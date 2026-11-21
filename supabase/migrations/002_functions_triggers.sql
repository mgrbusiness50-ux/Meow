-- ============================================================================
-- Meow Database Functions & Triggers - Migration 002
-- NOTE: Local migration file only. Run after 001_schema.sql when approved.
-- ============================================================================

-- ============================================================================
-- 1. GENERIC TIMESTAMP & PRIVACY HELPERS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_profile_privacy_flags()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- show_phone_in_profile is the single authoritative privacy toggle (matches src/state.ts)
  NEW.show_phone_in_profile = COALESCE(NEW.show_phone_in_profile, false);
  NEW.privacy_mode = CASE WHEN NEW.show_phone_in_profile THEN 'public' ELSE 'private' END;
  NEW.show_phone_only_after_approval = NEW.show_phone_in_profile;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  jwt_role text := COALESCE(current_setting('request.jwt.claim.role', true), '');
BEGIN
  IF (NEW.role IS DISTINCT FROM OLD.role) THEN
    IF jwt_role <> 'service_role' AND current_user NOT IN ('postgres', 'supabase_admin') THEN
      RAISE EXCEPTION 'Insufficient privileges to modify profile role';
    END IF;
  END IF;

  IF (NEW.deleted_at IS DISTINCT FROM OLD.deleted_at) THEN
    IF jwt_role <> 'service_role' AND current_user NOT IN ('postgres', 'supabase_admin') THEN
      RAISE EXCEPTION 'Insufficient privileges to modify profile archive state';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================================
-- 2. AUTH SIGNUP BOOTSTRAP
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  display_name text;
  avatar text;
BEGIN
  display_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'name'), ''),
    SPLIT_PART(COALESCE(NEW.email, 'مستخدم Meow'), '@', 1)
  );
  avatar := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'avatar_url'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'picture'), ''),
    ''
  );

  -- Always initialize as regular 'user' with phone hidden by default
  INSERT INTO public.profiles (
    id, role, name, avatar_url,
    show_phone_in_profile, privacy_mode, show_phone_only_after_approval
  )
  VALUES (
    NEW.id, 'user', display_name, avatar,
    false, 'private', false
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_private_details (user_id, email, phone)
  VALUES (NEW.id, COALESCE(NEW.email, ''), '')
  ON CONFLICT (user_id) DO UPDATE
    SET email = EXCLUDED.email
    WHERE public.user_private_details.email = '';

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auth_user_created ON auth.users;
CREATE TRIGGER trg_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

-- ============================================================================
-- 3. STRICT PHONE REVEAL RPC (Matches state.ts: never auto-reveals on accept)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_owner_phone_if_allowed(target_user_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  viewer_id uuid := auth.uid();
  result_phone text;
BEGIN
  IF viewer_id IS NULL OR target_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  IF viewer_id = target_user_id THEN
    SELECT upd.phone
    INTO result_phone
    FROM public.user_private_details upd
    WHERE upd.user_id = target_user_id;
    RETURN NULLIF(TRIM(COALESCE(result_phone, '')), '');
  END IF;

  IF NOT public.is_not_blocked(viewer_id, target_user_id) THEN
    RETURN NULL;
  END IF;

  SELECT upd.phone
  INTO result_phone
  FROM public.profiles p
  JOIN public.user_private_details upd ON upd.user_id = p.id
  WHERE p.id = target_user_id
    AND p.deleted_at IS NULL
    AND p.show_phone_in_profile = true
    AND p.privacy_mode = 'public';

  RETURN NULLIF(TRIM(COALESCE(result_phone, '')), '');
END;
$$;

REVOKE ALL ON FUNCTION public.get_owner_phone_if_allowed(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_owner_phone_if_allowed(uuid) TO authenticated;

-- ============================================================================
-- 4. PETS & GROUP ADOPTION INTEGRITY
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_pet_soft_delete()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
    NEW.status = 'not_available';
    NEW.also_listed_individually = false;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cascade_pet_soft_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
    DELETE FROM public.saved_pets
    WHERE pet_id = NEW.id;

    UPDATE public.group_adoption_members
    SET deleted_at = NEW.deleted_at,
        updated_at = now()
    WHERE (group_pet_id = NEW.id OR linked_pet_id = NEW.id)
      AND deleted_at IS NULL;

    UPDATE public.health_records
    SET deleted_at = NEW.deleted_at,
        updated_at = now()
    WHERE pet_id = NEW.id
      AND deleted_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_group_adoption_member()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  grp_status text;
  grp_adoption_type text;
  grp_deleted timestamptz;
  linked_deleted timestamptz;
BEGIN
  -- Allow soft-deleting member rows even after the parent group listing is stopped/dissolved
  IF NEW.deleted_at IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT p.status, p.adoption_type, p.deleted_at
  INTO grp_status, grp_adoption_type, grp_deleted
  FROM public.pets p
  WHERE p.id = NEW.group_pet_id
    AND p.owner_id = NEW.owner_id;

  IF NOT FOUND OR grp_deleted IS NOT NULL THEN
    RAISE EXCEPTION 'Group adoption listing does not exist or is deleted';
  END IF;

  IF grp_status <> 'adoption' OR grp_adoption_type <> 'group' THEN
    RAISE EXCEPTION 'Target pet listing is not an active group adoption listing';
  END IF;

  IF NEW.linked_pet_id IS NOT NULL THEN
    SELECT p.deleted_at
    INTO linked_deleted
    FROM public.pets p
    WHERE p.id = NEW.linked_pet_id
      AND p.owner_id = NEW.owner_id;

    IF NOT FOUND OR linked_deleted IS NOT NULL THEN
      RAISE EXCEPTION 'Linked member pet does not belong to owner or is deleted';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================================
-- 5. CONTACT REQUESTS VALIDATION & IDEMPOTENT ACCEPTANCE WORKFLOW
-- ============================================================================

CREATE OR REPLACE FUNCTION public.validate_contact_request_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  rec_pet record;
  snd_pet record;
BEGIN
  IF NOT public.is_not_blocked(NEW.sender_id, NEW.receiver_id) THEN
    RAISE EXCEPTION 'Cannot send contact request between blocked users';
  END IF;

  SELECT p.id, p.owner_id, p.status, p.deleted_at
  INTO rec_pet
  FROM public.pets p
  WHERE p.id = NEW.receiver_pet_id;

  IF NOT FOUND OR rec_pet.deleted_at IS NOT NULL THEN
    RAISE EXCEPTION 'Target pet listing is unavailable';
  END IF;

  IF rec_pet.owner_id <> NEW.receiver_id THEN
    RAISE EXCEPTION 'Receiver does not own the target pet';
  END IF;

  IF (NEW.type = 'mating' AND rec_pet.status <> 'mating')
     OR (NEW.type = 'adoption' AND rec_pet.status <> 'adoption') THEN
    RAISE EXCEPTION 'Target pet is not available for %', NEW.type;
  END IF;

  IF NEW.type = 'mating' THEN
    IF NEW.sender_pet_id IS NULL THEN
      RAISE EXCEPTION 'Mating request requires sender_pet_id';
    END IF;

    SELECT p.id, p.owner_id, p.status, p.deleted_at
    INTO snd_pet
    FROM public.pets p
    WHERE p.id = NEW.sender_pet_id;

    IF NOT FOUND OR snd_pet.deleted_at IS NOT NULL OR snd_pet.owner_id <> NEW.sender_id THEN
      RAISE EXCEPTION 'Sender pet does not exist or is not owned by sender';
    END IF;

    IF snd_pet.status <> 'mating' THEN
      RAISE EXCEPTION 'Sender pet must be eligible (status = mating) for a mating request';
    END IF;
  ELSIF NEW.sender_pet_id IS NOT NULL THEN
    SELECT p.id, p.owner_id, p.deleted_at
    INTO snd_pet
    FROM public.pets p
    WHERE p.id = NEW.sender_pet_id;

    IF NOT FOUND OR snd_pet.deleted_at IS NOT NULL OR snd_pet.owner_id <> NEW.sender_id THEN
      RAISE EXCEPTION 'Optional sender_pet_id must belong to an active pet owned by sender';
    END IF;
  END IF;

  NEW.status = 'pending';
  NEW.celebrated = false;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_contact_request_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  actor uuid := auth.uid();
  jwt_role text := COALESCE(current_setting('request.jwt.claim.role', true), '');
BEGIN
  -- Immutable fields check
  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.legacy_id IS DISTINCT FROM OLD.legacy_id
     OR NEW.sender_id IS DISTINCT FROM OLD.sender_id
     OR NEW.receiver_id IS DISTINCT FROM OLD.receiver_id
     OR NEW.sender_pet_id IS DISTINCT FROM OLD.sender_pet_id
     OR NEW.receiver_pet_id IS DISTINCT FROM OLD.receiver_pet_id
     OR NEW.type IS DISTINCT FROM OLD.type
     OR NEW.message IS DISTINCT FROM OLD.message
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Immutable contact request fields cannot be modified';
  END IF;

  IF jwt_role = 'service_role' OR current_user IN ('postgres', 'supabase_admin', 'service_role') THEN
    RETURN NEW;
  END IF;

  IF actor = OLD.receiver_id THEN
    IF OLD.status <> 'pending' OR NEW.status NOT IN ('accepted', 'rejected') THEN
      RAISE EXCEPTION 'Receiver can only accept or reject a pending request';
    END IF;
    IF NEW.status = 'accepted' AND NOT public.is_not_blocked(OLD.sender_id, OLD.receiver_id) THEN
      RAISE EXCEPTION 'Cannot accept contact request between blocked users';
    END IF;
    IF NEW.celebrated IS DISTINCT FROM OLD.celebrated THEN
      RAISE EXCEPTION 'Receiver cannot alter sender celebration flag';
    END IF;
    RETURN NEW;
  ELSIF actor = OLD.sender_id THEN
    -- Sender can withdraw while pending
    IF OLD.status = 'pending' AND NEW.status = 'withdrawn' AND NEW.celebrated = OLD.celebrated THEN
      RETURN NEW;
    END IF;
    -- Or mark celebrated once accepted
    IF OLD.status = 'accepted' AND NEW.status = 'accepted' AND NEW.celebrated = true THEN
      RETURN NEW;
    END IF;
    RAISE EXCEPTION 'Sender can only withdraw a pending request or celebrate an accepted request';
  END IF;

  RAISE EXCEPTION 'Not authorized to update this contact request';
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_contact_request_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sender_name text;
  pet_name text;
  rec_notif_enabled boolean;
BEGIN
  SELECT p.name INTO sender_name FROM public.profiles p WHERE p.id = NEW.sender_id;
  SELECT pt.name INTO pet_name FROM public.pets pt WHERE pt.id = NEW.receiver_pet_id;
  SELECT p.notifications_enabled INTO rec_notif_enabled FROM public.profiles p WHERE p.id = NEW.receiver_id;

  IF COALESCE(rec_notif_enabled, true) THEN
    INSERT INTO public.notifications (
      user_id, dedupe_key, type, title, body,
      read, dismissed, celebrated,
      target_tab, target_sub_tab, target_request_id, target_pet_id
    )
    VALUES (
      NEW.receiver_id,
      'req_created:' || NEW.id::text || ':' || NEW.receiver_id::text,
      'contact_request',
      CASE WHEN NEW.type = 'mating' THEN 'طلب تزاوج جديد' ELSE 'طلب تبني جديد' END,
      COALESCE(sender_name, 'مستخدم') || ' أرسل لك طلبًا بخصوص «' || COALESCE(pet_name, 'أليفك') || '».',
      false, false, false,
      'chat', 'requests', NEW.id, NEW.receiver_pet_id
    )
    ON CONFLICT (dedupe_key) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_contact_request_accepted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conv_id uuid;
  conv_inserted boolean := false;
  receiver_name text;
  pet_record record;
  sys_text text;
  sender_notif_enabled boolean;
BEGIN
  IF NOT (OLD.status = 'pending' AND NEW.status = 'accepted') THEN
    RETURN NEW;
  END IF;

  SELECT p.id, p.name, p.adoption_type, p.group_count, p.must_adopt_together
  INTO pet_record
  FROM public.pets p
  WHERE p.id = NEW.receiver_pet_id;

  SELECT p.name INTO receiver_name FROM public.profiles p WHERE p.id = NEW.receiver_id;
  SELECT p.notifications_enabled INTO sender_notif_enabled FROM public.profiles p WHERE p.id = NEW.sender_id;

  -- Idempotent conversation creation (only once per accepted request)
  INSERT INTO public.conversations (
    request_id, user_a_id, user_b_id, pet_id, pet_type,
    last_message, last_message_at
  )
  VALUES (
    NEW.id, NEW.sender_id, NEW.receiver_id, NEW.receiver_pet_id, NEW.type,
    'تمت الموافقة على طلب التواصل! يمكنكما التحدث الآن.', now()
  )
  ON CONFLICT (request_id) DO NOTHING
  RETURNING id INTO conv_id;

  IF conv_id IS NOT NULL THEN
    conv_inserted := true;
  ELSE
    SELECT c.id INTO conv_id FROM public.conversations c WHERE c.request_id = NEW.id;
  END IF;

  -- Per-user state rows (idempotent)
  INSERT INTO public.conversation_user_state (conversation_id, user_id, unread_count, is_pinned, is_hidden)
  VALUES
    (conv_id, NEW.sender_id, 0, false, false),
    (conv_id, NEW.receiver_id, 0, false, false)
  ON CONFLICT (conversation_id, user_id) DO NOTHING;

  -- Seed initial system & request messages only on initial creation
  IF conv_inserted THEN
    IF pet_record.adoption_type = 'group' THEN
      sys_text := 'تمت الموافقة على طلب التواصل بخصوص التبني الجماعي «'
        || COALESCE(pet_record.name, 'مجموعة أليفة')
        || '» (' || COALESCE(pet_record.group_count, 2)::text || ' حيوانات).';
    ELSE
      sys_text := 'تمت الموافقة على طلب التواصل بنجاح 🐾. يمكنك التحدث مباشرة داخل التطبيق بأمان، ولا يظهر رقم الهاتف إلا عند تفعيله من إعدادات الخصوصية.';
    END IF;

    INSERT INTO public.messages (conversation_id, sender_id, is_system, type, text, status)
    VALUES (conv_id, NULL, true, 'text', sys_text, 'read');

    IF COALESCE(TRIM(NEW.message), '') <> '' THEN
      INSERT INTO public.messages (conversation_id, sender_id, is_system, type, text, status)
      VALUES (conv_id, NEW.sender_id, false, 'text', TRIM(NEW.message), 'delivered');
    END IF;
  END IF;

  -- Idempotent approval notification for sender (only once)
  IF COALESCE(sender_notif_enabled, true) THEN
    INSERT INTO public.notifications (
      user_id, dedupe_key, type, title, body,
      read, dismissed, celebrated,
      target_tab, target_sub_tab, target_request_id, target_conversation_id, target_pet_id
    )
    VALUES (
      NEW.sender_id,
      'req_accepted:' || NEW.id::text || ':' || NEW.sender_id::text,
      CASE WHEN NEW.type = 'mating' THEN 'mating_approved' ELSE 'adoption_approved' END,
      CASE WHEN NEW.type = 'mating' THEN 'تمت الموافقة على التزاوج 🎉' ELSE 'تمت الموافقة على طلب التبني 🏠' END,
      CASE WHEN NEW.type = 'mating'
        THEN 'مبارك! تمت الموافقة على طلب التزاوج مع ' || COALESCE(receiver_name, 'المالك') || ' بخصوص «' || COALESCE(pet_record.name, '') || '».'
        ELSE 'تمت الموافقة على طلب التبني مع ' || COALESCE(receiver_name, 'المالك') || ' بخصوص «' || COALESCE(pet_record.name, '') || '».'
      END,
      false, false, false,
      'chat', 'chats', NEW.id, conv_id, NEW.receiver_pet_id
    )
    ON CONFLICT (dedupe_key) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================================
-- 6. MESSAGES, CONVERSATION STATE, AND INDEPENDENT HIDING LOGIC
-- ============================================================================

CREATE OR REPLACE FUNCTION public.ensure_conversation_user_state_rows()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.conversation_user_state (conversation_id, user_id, unread_count, is_pinned, is_hidden)
  VALUES
    (NEW.id, NEW.user_a_id, 0, false, false),
    (NEW.id, NEW.user_b_id, 0, false, false)
  ON CONFLICT (conversation_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_message_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  conv record;
  jwt_role text := COALESCE(current_setting('request.jwt.claim.role', true), '');
BEGIN
  IF NEW.is_system THEN
    IF pg_trigger_depth() <= 1
       AND jwt_role <> 'service_role'
       AND current_user NOT IN ('postgres', 'supabase_admin', 'service_role') THEN
      RAISE EXCEPTION 'Clients cannot insert system messages';
    END IF;
    RETURN NEW;
  END IF;

  SELECT c.user_a_id, c.user_b_id
  INTO conv
  FROM public.conversations c
  WHERE c.id = NEW.conversation_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Conversation not found';
  END IF;

  IF NEW.sender_id IS NULL OR NEW.sender_id NOT IN (conv.user_a_id, conv.user_b_id) THEN
    RAISE EXCEPTION 'Sender must be a participant of this conversation';
  END IF;

  IF NOT public.is_not_blocked(conv.user_a_id, conv.user_b_id) THEN
    RAISE EXCEPTION 'Cannot send messages between blocked users';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_message_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  jwt_role text := COALESCE(current_setting('request.jwt.claim.role', true), '');
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.legacy_id IS DISTINCT FROM OLD.legacy_id
     OR NEW.conversation_id IS DISTINCT FROM OLD.conversation_id
     OR NEW.sender_id IS DISTINCT FROM OLD.sender_id
     OR NEW.is_system IS DISTINCT FROM OLD.is_system
     OR NEW.type IS DISTINCT FROM OLD.type
     OR NEW.text IS DISTINCT FROM OLD.text
     OR NEW.file_url IS DISTINCT FROM OLD.file_url
     OR NEW.file_name IS DISTINCT FROM OLD.file_name
     OR NEW.file_size IS DISTINCT FROM OLD.file_size
     OR NEW.audio_duration IS DISTINCT FROM OLD.audio_duration
     OR NEW.sticker_url IS DISTINCT FROM OLD.sticker_url
     OR NEW.sticker_emoji IS DISTINCT FROM OLD.sticker_emoji
     OR NEW.sticker_title IS DISTINCT FROM OLD.sticker_title
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Messages are immutable except status updates';
  END IF;

  IF OLD.is_system THEN
    RAISE EXCEPTION 'System messages cannot be modified';
  END IF;

  IF jwt_role <> 'service_role'
     AND current_user NOT IN ('postgres', 'supabase_admin', 'service_role') THEN
    IF NEW.status IS NULL OR NEW.status <> 'read' THEN
      RAISE EXCEPTION 'Only status = read is permitted when updating messages';
    END IF;
  ELSIF NEW.status IS NULL OR NEW.status NOT IN ('sent', 'delivered', 'read') THEN
    RAISE EXCEPTION 'Invalid message status value';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_message_events()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conv record;
  recipient_id uuid;
  sender_name text;
  recipient_notif_enabled boolean;
  preview_text text;
BEGIN
  preview_text := CASE NEW.type
    WHEN 'sticker' THEN '🎭 ملصق: ' || COALESCE(NULLIF(NEW.sticker_title, ''), NULLIF(NEW.sticker_emoji, ''), 'مياو')
    WHEN 'image' THEN '📷 صورة'
    WHEN 'audio' THEN '🎤 رسالة صوتية'
    WHEN 'file' THEN '📎 ' || COALESCE(NULLIF(NEW.file_name, ''), 'ملف مرفق')
    ELSE COALESCE(NEW.text, '')
  END;

  UPDATE public.conversations
  SET
    last_message = preview_text,
    last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;

  IF NEW.is_system OR NEW.sender_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT c.user_a_id, c.user_b_id, c.pet_id
  INTO conv
  FROM public.conversations c
  WHERE c.id = NEW.conversation_id;

  recipient_id := CASE WHEN conv.user_a_id = NEW.sender_id THEN conv.user_b_id ELSE conv.user_a_id END;

  -- Un-hide for recipient ONLY, preserve recipient.hidden_at so pre-hide history stays hidden,
  -- and DO NOT modify sender's is_hidden / hidden_at state.
  INSERT INTO public.conversation_user_state (
    conversation_id, user_id, unread_count, is_pinned, is_hidden, updated_at
  )
  VALUES (
    NEW.conversation_id, recipient_id, 1, false, false, now()
  )
  ON CONFLICT (conversation_id, user_id) DO UPDATE
  SET
    unread_count = public.conversation_user_state.unread_count + 1,
    is_hidden = false,
    updated_at = now();

  SELECT p.name INTO sender_name FROM public.profiles p WHERE p.id = NEW.sender_id;
  SELECT p.notifications_enabled INTO recipient_notif_enabled FROM public.profiles p WHERE p.id = recipient_id;

  IF COALESCE(recipient_notif_enabled, true) THEN
    INSERT INTO public.notifications (
      user_id, dedupe_key, type, title, body,
      read, dismissed, celebrated,
      target_tab, target_sub_tab, target_conversation_id, target_pet_id
    )
    VALUES (
      recipient_id,
      'new_msg:' || NEW.id::text || ':' || recipient_id::text,
      'new_message',
      'رسالة جديدة من ' || COALESCE(sender_name, 'مستخدم'),
      preview_text,
      false, false, false,
      'chat', 'chats', NEW.conversation_id, conv.pet_id
    )
    ON CONFLICT (dedupe_key) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_conversation_user_state()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  jwt_role text := COALESCE(current_setting('request.jwt.claim.role', true), '');
BEGIN
  IF NEW.conversation_id IS DISTINCT FROM OLD.conversation_id
     OR NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Cannot reassign conversation_user_state ownership';
  END IF;

  -- Direct client updates (trigger depth <= 1) may only reset unread_count to 0, and cannot erase hidden_at cutoff
  IF pg_trigger_depth() <= 1
     AND jwt_role <> 'service_role'
     AND current_user NOT IN ('postgres', 'supabase_admin', 'service_role') THEN
    IF NEW.unread_count IS DISTINCT FROM OLD.unread_count AND NEW.unread_count <> 0 THEN
      RAISE EXCEPTION 'Clients cannot manually set unread_count to non-zero values';
    END IF;
    IF OLD.hidden_at IS NOT NULL AND (NEW.hidden_at IS NULL OR NEW.hidden_at < OLD.hidden_at) THEN
      RAISE EXCEPTION 'Cannot clear or backdate hidden_at cutoff';
    END IF;
    IF NEW.is_hidden = true AND OLD.is_hidden = false AND NEW.hidden_at IS NOT DISTINCT FROM OLD.hidden_at THEN
      NEW.hidden_at = now();
    ELSIF NEW.is_hidden = true AND NEW.hidden_at IS NULL THEN
      NEW.hidden_at = now();
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Safe RPCs for per-user conversation actions
CREATE OR REPLACE FUNCTION public.hide_conversation_for_me(p_conversation_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = p_conversation_id
      AND uid IN (c.user_a_id, c.user_b_id)
  ) THEN
    RAISE EXCEPTION 'Not a participant of this conversation';
  END IF;

  INSERT INTO public.conversation_user_state (
    conversation_id, user_id, unread_count, is_hidden, hidden_at, updated_at
  )
  VALUES (
    p_conversation_id, uid, 0, true, now(), now()
  )
  ON CONFLICT (conversation_id, user_id) DO UPDATE
  SET
    is_hidden = true,
    hidden_at = now(),
    unread_count = 0,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_conversation_read(p_conversation_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = p_conversation_id
      AND uid IN (c.user_a_id, c.user_b_id)
  ) THEN
    RAISE EXCEPTION 'Not a participant of this conversation';
  END IF;

  INSERT INTO public.conversation_user_state (
    conversation_id, user_id, unread_count, last_read_at, updated_at
  )
  VALUES (
    p_conversation_id, uid, 0, now(), now()
  )
  ON CONFLICT (conversation_id, user_id) DO UPDATE
  SET
    unread_count = 0,
    last_read_at = now(),
    updated_at = now();

  UPDATE public.messages m
  SET status = 'read'
  WHERE m.conversation_id = p_conversation_id
    AND m.is_system = false
    AND m.sender_id <> uid
    AND m.status <> 'read';
END;
$$;

REVOKE ALL ON FUNCTION public.hide_conversation_for_me(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.hide_conversation_for_me(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.mark_conversation_read(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_conversation_read(uuid) TO authenticated;

-- ============================================================================
-- 7. ADMIN MODERATION PROTECTION (reports & support_messages)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.protect_notification_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  jwt_role text := COALESCE(current_setting('request.jwt.claim.role', true), '');
BEGIN
  IF jwt_role = 'service_role' OR current_user IN ('postgres', 'supabase_admin', 'service_role') THEN
    RETURN NEW;
  END IF;

  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.legacy_id IS DISTINCT FROM OLD.legacy_id
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.dedupe_key IS DISTINCT FROM OLD.dedupe_key
     OR NEW.type IS DISTINCT FROM OLD.type
     OR NEW.title IS DISTINCT FROM OLD.title
     OR NEW.body IS DISTINCT FROM OLD.body
     OR NEW.target_tab IS DISTINCT FROM OLD.target_tab
     OR NEW.target_sub_tab IS DISTINCT FROM OLD.target_sub_tab
     OR NEW.target_request_id IS DISTINCT FROM OLD.target_request_id
     OR NEW.target_conversation_id IS DISTINCT FROM OLD.target_conversation_id
     OR NEW.target_pet_id IS DISTINCT FROM OLD.target_pet_id
     OR NEW.metadata IS DISTINCT FROM OLD.metadata
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Notification metadata is immutable; only read, dismissed, and celebrated may change';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_report_immutable_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.reporter_id IS DISTINCT FROM OLD.reporter_id
     OR NEW.target_user_id IS DISTINCT FROM OLD.target_user_id
     OR NEW.target_type IS DISTINCT FROM OLD.target_type
     OR NEW.pet_id IS DISTINCT FROM OLD.pet_id
     OR NEW.conversation_id IS DISTINCT FROM OLD.conversation_id
     OR NEW.reason IS DISTINCT FROM OLD.reason
     OR NEW.reason_label IS DISTINCT FROM OLD.reason_label
     OR NEW.details IS DISTINCT FROM OLD.details
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Report submission fields are immutable';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.protect_support_message_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  jwt_role text := COALESCE(current_setting('request.jwt.claim.role', true), '');
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.sender_name IS DISTINCT FROM OLD.sender_name
     OR NEW.sender_email IS DISTINCT FROM OLD.sender_email
     OR NEW.sender_phone IS DISTINCT FROM OLD.sender_phone
     OR NEW.subject IS DISTINCT FROM OLD.subject
     OR NEW.message IS DISTINCT FROM OLD.message
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Support message sender content is immutable';
  END IF;

  -- Only service_role (Edge Function) may modify email notification audit flags
  IF (NEW.email_notified IS DISTINCT FROM OLD.email_notified OR NEW.email_notified_at IS DISTINCT FROM OLD.email_notified_at)
     AND jwt_role <> 'service_role'
     AND current_user NOT IN ('postgres', 'supabase_admin') THEN
    RAISE EXCEPTION 'Only backend service_role can update email notification delivery state';
  END IF;

  IF NEW.admin_reply IS DISTINCT FROM OLD.admin_reply AND COALESCE(TRIM(NEW.admin_reply), '') <> '' THEN
    NEW.replied_at = COALESCE(NEW.replied_at, now());
    IF NEW.status IN ('new', 'in_progress') THEN
      NEW.status = 'replied';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================================================
-- 8. ATTACH TRIGGERS TO TABLES
-- ============================================================================

-- updated_at triggers
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_private_details_updated_at ON public.user_private_details;
CREATE TRIGGER trg_private_details_updated_at BEFORE UPDATE ON public.user_private_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_pets_updated_at ON public.pets;
CREATE TRIGGER trg_pets_updated_at BEFORE UPDATE ON public.pets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_group_members_updated_at ON public.group_adoption_members;
CREATE TRIGGER trg_group_members_updated_at BEFORE UPDATE ON public.group_adoption_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_health_records_updated_at ON public.health_records;
CREATE TRIGGER trg_health_records_updated_at BEFORE UPDATE ON public.health_records FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_contact_requests_updated_at ON public.contact_requests;
CREATE TRIGGER trg_contact_requests_updated_at BEFORE UPDATE ON public.contact_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_conversations_updated_at ON public.conversations;
CREATE TRIGGER trg_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_conv_user_state_updated_at ON public.conversation_user_state;
CREATE TRIGGER trg_conv_user_state_updated_at BEFORE UPDATE ON public.conversation_user_state FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_reports_updated_at ON public.reports;
CREATE TRIGGER trg_reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_support_messages_updated_at ON public.support_messages;
CREATE TRIGGER trg_support_messages_updated_at BEFORE UPDATE ON public.support_messages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- profiles privacy & role protection
DROP TRIGGER IF EXISTS trg_profiles_privacy_sync ON public.profiles;
CREATE TRIGGER trg_profiles_privacy_sync
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_privacy_flags();

DROP TRIGGER IF EXISTS trg_profiles_protect_role ON public.profiles;
CREATE TRIGGER trg_profiles_protect_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- pets & group adoption integrity
DROP TRIGGER IF EXISTS trg_pets_soft_delete ON public.pets;
CREATE TRIGGER trg_pets_soft_delete
  BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.handle_pet_soft_delete();

DROP TRIGGER IF EXISTS trg_pets_soft_delete_cascade ON public.pets;
CREATE TRIGGER trg_pets_soft_delete_cascade
  AFTER UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.cascade_pet_soft_delete();

DROP TRIGGER IF EXISTS trg_group_members_validate ON public.group_adoption_members;
CREATE TRIGGER trg_group_members_validate
  BEFORE INSERT OR UPDATE ON public.group_adoption_members
  FOR EACH ROW EXECUTE FUNCTION public.validate_group_adoption_member();

-- contact_requests lifecycle
DROP TRIGGER IF EXISTS trg_contact_requests_validate_insert ON public.contact_requests;
CREATE TRIGGER trg_contact_requests_validate_insert
  BEFORE INSERT ON public.contact_requests
  FOR EACH ROW EXECUTE FUNCTION public.validate_contact_request_insert();

DROP TRIGGER IF EXISTS trg_contact_requests_validate_update ON public.contact_requests;
CREATE TRIGGER trg_contact_requests_validate_update
  BEFORE UPDATE ON public.contact_requests
  FOR EACH ROW EXECUTE FUNCTION public.validate_contact_request_update();

DROP TRIGGER IF EXISTS trg_contact_requests_created_notif ON public.contact_requests;
CREATE TRIGGER trg_contact_requests_created_notif
  AFTER INSERT ON public.contact_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_contact_request_created();

DROP TRIGGER IF EXISTS trg_contact_requests_accepted ON public.contact_requests;
CREATE TRIGGER trg_contact_requests_accepted
  AFTER UPDATE ON public.contact_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_contact_request_accepted();

-- messages, notifications & conversation_user_state
DROP TRIGGER IF EXISTS trg_conversations_ensure_user_state ON public.conversations;
CREATE TRIGGER trg_conversations_ensure_user_state
  AFTER INSERT ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.ensure_conversation_user_state_rows();

DROP TRIGGER IF EXISTS trg_messages_validate_insert ON public.messages;
CREATE TRIGGER trg_messages_validate_insert
  BEFORE INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.validate_message_insert();

DROP TRIGGER IF EXISTS trg_messages_protect_update ON public.messages;
CREATE TRIGGER trg_messages_protect_update
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.protect_message_update();

DROP TRIGGER IF EXISTS trg_messages_after_insert ON public.messages;
CREATE TRIGGER trg_messages_after_insert
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_message_events();

DROP TRIGGER IF EXISTS trg_conv_user_state_protect ON public.conversation_user_state;
CREATE TRIGGER trg_conv_user_state_protect
  BEFORE UPDATE ON public.conversation_user_state
  FOR EACH ROW EXECUTE FUNCTION public.protect_conversation_user_state();

DROP TRIGGER IF EXISTS trg_notifications_protect_update ON public.notifications;
CREATE TRIGGER trg_notifications_protect_update
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.protect_notification_update();

-- moderation tables protection
DROP TRIGGER IF EXISTS trg_reports_protect_fields ON public.reports;
CREATE TRIGGER trg_reports_protect_fields
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.protect_report_immutable_fields();

DROP TRIGGER IF EXISTS trg_support_messages_protect_fields ON public.support_messages;
CREATE TRIGGER trg_support_messages_protect_fields
  BEFORE UPDATE ON public.support_messages
  FOR EACH ROW EXECUTE FUNCTION public.protect_support_message_fields();

-- ============================================================================
-- 9. IDEMPOTENT BACKFILL FOR ANY PRE-EXISTING auth.users ROWS
-- ============================================================================

INSERT INTO public.profiles (
  id, role, name, avatar_url,
  show_phone_in_profile, privacy_mode, show_phone_only_after_approval
)
SELECT
  u.id,
  'user',
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data ->> 'full_name'), ''),
    NULLIF(TRIM(u.raw_user_meta_data ->> 'name'), ''),
    SPLIT_PART(COALESCE(u.email, 'مستخدم Meow'), '@', 1)
  ),
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data ->> 'avatar_url'), ''),
    NULLIF(TRIM(u.raw_user_meta_data ->> 'picture'), ''),
    ''
  ),
  false,
  'private',
  false
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_private_details (user_id, email, phone)
SELECT u.id, COALESCE(u.email, ''), ''
FROM auth.users u
ON CONFLICT (user_id) DO NOTHING;
