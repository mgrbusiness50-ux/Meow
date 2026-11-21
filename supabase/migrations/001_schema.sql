-- ============================================================================
-- Meow Database Schema - Migration 001 (Core Tables, Constraints, Indexes, RLS)
-- NOTE: Local migration file only. Do not execute without explicit approval.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 1. CORE TABLES (14 Core Tables + user_custom_stickers for existing Chat stickers)
-- ============================================================================

-- 1.1 profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
  role text NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'admin', 'moderator', 'vet', 'vendor', 'rescuer')),
  name text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  gender text CHECK (gender IN ('male', 'female')),
  city text NOT NULL DEFAULT '',
  governorate text,
  markaz text,
  village text,
  location_id text,
  governorate_id text,
  markaz_id text,
  city_id text,
  village_id text,
  lat double precision,
  lng double precision,
  show_phone_in_profile boolean NOT NULL DEFAULT false,
  privacy_mode text NOT NULL DEFAULT 'private'
    CHECK (privacy_mode IN ('public', 'private')),
  show_phone_only_after_approval boolean NOT NULL DEFAULT false,
  notifications_enabled boolean NOT NULL DEFAULT true,
  advice_dismissed boolean NOT NULL DEFAULT false,
  onboarding_done boolean NOT NULL DEFAULT false,
  deleted_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_profiles_privacy_consistency CHECK (
    (show_phone_in_profile = true AND privacy_mode = 'public' AND show_phone_only_after_approval = true)
    OR
    (show_phone_in_profile = false AND privacy_mode = 'private' AND show_phone_only_after_approval = false)
  )
);

CREATE INDEX IF NOT EXISTS idx_profiles_geo ON public.profiles (governorate_id, city_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);

-- 1.2 user_private_details (Isolated sensitive PII: email & phone)
CREATE TABLE IF NOT EXISTS public.user_private_details (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE RESTRICT,
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.3 pets (Individual & Group adoption root listings with soft delete)
CREATE TABLE IF NOT EXISTS public.pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  name text NOT NULL,
  species text NOT NULL CHECK (species IN ('cat', 'dog')),
  breed text NOT NULL DEFAULT '',
  hybrid_breed text,
  age_years integer NOT NULL DEFAULT 0 CHECK (age_years >= 0),
  age_months integer NOT NULL DEFAULT 0 CHECK (age_months BETWEEN 0 AND 11),
  color text NOT NULL DEFAULT '',
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  area text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  governorate text,
  markaz text,
  village text,
  location_id text,
  governorate_id text,
  markaz_id text,
  city_id text,
  village_id text,
  lat double precision,
  lng double precision,
  health_status text NOT NULL DEFAULT 'ممتازة'
    CHECK (health_status IN ('ممتازة', 'جيدة جدًا', 'تحت المتابعة')),
  vaccination_status text NOT NULL DEFAULT 'not_vaccinated'
    CHECK (vaccination_status IN ('fully_vaccinated', 'partially_vaccinated', 'not_vaccinated')),
  personality text[] NOT NULL DEFAULT '{}',
  health_notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'not_available'
    CHECK (status IN ('mating', 'adoption', 'not_available')),
  adoption_type text CHECK (adoption_type IN ('individual', 'group')),
  also_listed_individually boolean NOT NULL DEFAULT false,
  group_count integer CHECK (group_count IS NULL OR group_count >= 1),
  must_adopt_together boolean NOT NULL DEFAULT false,
  adoption_reason text,
  shared_group_photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  photo_entries jsonb NOT NULL DEFAULT '[]'::jsonb,
  deleted_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_pets_id_owner UNIQUE (id, owner_id),
  CONSTRAINT chk_pets_adoption_type_consistency CHECK (
    (status = 'adoption' AND adoption_type IS NOT NULL)
    OR
    (status <> 'adoption')
  )
);

CREATE INDEX IF NOT EXISTS idx_pets_active_feed
  ON public.pets (status, species, adoption_type, created_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_pets_filter_attributes
  ON public.pets (status, species, gender, vaccination_status, created_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_pets_owner_active
  ON public.pets (owner_id, created_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_pets_geo_active
  ON public.pets (governorate_id, markaz_id, city_id, village_id)
  WHERE deleted_at IS NULL;

-- 1.4 group_adoption_members (Ownership guaranteed via composite FK to pets)
CREATE TABLE IF NOT EXISTS public.group_adoption_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_pet_id uuid NOT NULL,
  owner_id uuid NOT NULL,
  linked_pet_id uuid NULL,
  name text NOT NULL,
  species text NOT NULL CHECK (species IN ('cat', 'dog')),
  breed text NOT NULL DEFAULT '',
  hybrid_breed text,
  age_years integer NOT NULL DEFAULT 0 CHECK (age_years >= 0),
  age_months integer NOT NULL DEFAULT 0 CHECK (age_months BETWEEN 0 AND 11),
  color text NOT NULL DEFAULT '',
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  vaccination_status text NOT NULL DEFAULT 'not_vaccinated'
    CHECK (vaccination_status IN ('fully_vaccinated', 'partially_vaccinated', 'not_vaccinated')),
  personality text[] NOT NULL DEFAULT '{}',
  health_notes text NOT NULL DEFAULT '',
  individual_photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  deleted_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_group_member_group_owner
    FOREIGN KEY (group_pet_id, owner_id) REFERENCES public.pets(id, owner_id) ON DELETE RESTRICT,
  CONSTRAINT fk_group_member_linked_pet_owner
    FOREIGN KEY (linked_pet_id, owner_id) REFERENCES public.pets(id, owner_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_group_members_active
  ON public.group_adoption_members (group_pet_id, sort_order)
  WHERE deleted_at IS NULL;

-- 1.5 health_records (Owner must match pet owner via composite FK)
CREATE TABLE IF NOT EXISTS public.health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  pet_id uuid NOT NULL,
  owner_id uuid NOT NULL,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('vaccine', 'checkup', 'treatment', 'deworming')),
  record_date date NOT NULL,
  next_due_date date,
  clinic_name text,
  notes text,
  completed boolean NOT NULL DEFAULT true,
  deleted_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_health_records_pet_owner
    FOREIGN KEY (pet_id, owner_id) REFERENCES public.pets(id, owner_id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_health_records_pet_active
  ON public.health_records (pet_id, record_date DESC)
  WHERE deleted_at IS NULL;

-- 1.6 saved_pets (Favorites)
CREATE TABLE IF NOT EXISTS public.saved_pets (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id uuid NOT NULL REFERENCES public.pets(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, pet_id)
);

-- 1.7 contact_requests (Mating requires owned eligible pet; Adoption optional)
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  sender_pet_id uuid NULL,
  receiver_pet_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('mating', 'adoption')),
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  celebrated boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_request_distinct_users CHECK (sender_id <> receiver_id),
  CONSTRAINT chk_mating_requires_sender_pet CHECK (
    (type <> 'mating') OR (sender_pet_id IS NOT NULL)
  ),
  CONSTRAINT fk_request_sender_pet_owner
    FOREIGN KEY (sender_pet_id, sender_id) REFERENCES public.pets(id, owner_id) ON DELETE RESTRICT,
  CONSTRAINT fk_request_receiver_pet_owner
    FOREIGN KEY (receiver_pet_id, receiver_id) REFERENCES public.pets(id, owner_id) ON DELETE RESTRICT,
  CONSTRAINT uq_request_id_participants UNIQUE (id, sender_id, receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_requests_receiver
  ON public.contact_requests (receiver_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_sender
  ON public.contact_requests (sender_id, status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_contact_requests_pending_pair
  ON public.contact_requests (
    sender_id,
    receiver_pet_id,
    COALESCE(sender_pet_id, '00000000-0000-0000-0000-000000000000'::uuid)
  )
  WHERE status = 'pending';

-- 1.8 conversations (Strictly tied to accepted request & exact participants)
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  request_id uuid UNIQUE NOT NULL,
  user_a_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  user_b_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  pet_id uuid NULL REFERENCES public.pets(id) ON DELETE SET NULL,
  pet_type text NOT NULL CHECK (pet_type IN ('mating', 'adoption')),
  last_message text NOT NULL DEFAULT '',
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_conversations_distinct_users CHECK (user_a_id <> user_b_id),
  CONSTRAINT fk_conversations_request_participants
    FOREIGN KEY (request_id, user_a_id, user_b_id)
    REFERENCES public.contact_requests(id, sender_id, receiver_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_conversations_id_participants UNIQUE (id, user_a_id, user_b_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_a ON public.conversations (user_a_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_user_b ON public.conversations (user_b_id, last_message_at DESC);

-- 1.9 conversation_user_state (Per-user pin, unread_count, independent hide & hidden_at)
CREATE TABLE IF NOT EXISTS public.conversation_user_state (
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  unread_count integer NOT NULL DEFAULT 0 CHECK (unread_count >= 0),
  is_pinned boolean NOT NULL DEFAULT false,
  pinned_at timestamptz NULL,
  is_hidden boolean NOT NULL DEFAULT false,
  hidden_at timestamptz NULL,
  last_read_at timestamptz NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conv_user_state_visible
  ON public.conversation_user_state (user_id, is_hidden, is_pinned DESC, updated_at DESC);

-- 1.10 messages (Supports system welcome messages + user text/media/sticker/audio)
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE RESTRICT,
  sender_id uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_system boolean NOT NULL DEFAULT false,
  type text NOT NULL DEFAULT 'text'
    CHECK (type IN ('text', 'image', 'file', 'audio', 'sticker')),
  text text,
  file_url text,
  file_name text,
  file_size text,
  audio_duration integer CHECK (audio_duration IS NULL OR audio_duration >= 0),
  sticker_url text,
  sticker_emoji text,
  sticker_title text,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_messages_system_or_sender CHECK (
    (is_system = true AND sender_id IS NULL)
    OR
    (is_system = false AND sender_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_messages_conv_created
  ON public.messages (conversation_id, created_at ASC);

-- 1.11 notifications (Idempotent via dedupe_key)
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  dedupe_key text UNIQUE,
  type text NOT NULL
    CHECK (type IN ('contact_request', 'mating_approved', 'adoption_approved', 'new_message', 'system')),
  title text NOT NULL,
  body text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  dismissed boolean NOT NULL DEFAULT false,
  celebrated boolean NOT NULL DEFAULT false,
  target_tab text NOT NULL CHECK (target_tab IN ('mating', 'adoption', 'chat', 'clinic', 'store', 'profile')),
  target_sub_tab text CHECK (target_sub_tab IN ('chats', 'requests')),
  target_request_id uuid REFERENCES public.contact_requests(id) ON DELETE SET NULL,
  target_conversation_id uuid REFERENCES public.conversations(id) ON DELETE SET NULL,
  target_pet_id uuid REFERENCES public.pets(id) ON DELETE SET NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_active
  ON public.notifications (user_id, dismissed, created_at DESC);

-- 1.12 blocked_users
CREATE TABLE IF NOT EXISTS public.blocked_users (
  blocker_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  blocked_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  blocked_user_name text,
  blocked_user_avatar text,
  pet_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CONSTRAINT chk_blocked_distinct_users CHECK (blocker_id <> blocked_id)
);

-- 1.13 reports
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  target_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  target_user_name text NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('pet', 'chat', 'request')),
  pet_id uuid NULL REFERENCES public.pets(id) ON DELETE SET NULL,
  pet_name text,
  conversation_id uuid NULL REFERENCES public.conversations(id) ON DELETE SET NULL,
  reason text NOT NULL CHECK (
    reason IN ('inappropriate_content', 'fraud_or_misleading', 'unsafe_animal_care', 'spam_or_harassment', 'other')
  ),
  reason_label text NOT NULL,
  details text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review', 'under_review', 'resolved', 'dismissed')),
  reviewed_by uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_reports_distinct_users CHECK (reporter_id <> target_user_id)
);

CREATE INDEX IF NOT EXISTS idx_reports_status_created ON public.reports (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON public.reports (reporter_id, created_at DESC);

-- 1.14 support_messages (Contact Us + Admin dashboard & email alert readiness)
CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  sender_name text NOT NULL,
  sender_email text NOT NULL DEFAULT '',
  sender_phone text NOT NULL DEFAULT '',
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'in_progress', 'replied', 'closed')),
  priority text NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_admin_id uuid NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  admin_reply text,
  replied_at timestamptz NULL,
  email_notified boolean NOT NULL DEFAULT false,
  email_notified_at timestamptz NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_status_created ON public.support_messages (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_user_created ON public.support_messages (user_id, created_at DESC);

-- 1.15 user_custom_stickers (Covers ChatView custom pet stickers currently in localStorage)
CREATE TABLE IF NOT EXISTS public.user_custom_stickers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  title text NOT NULL DEFAULT 'استيكر مخصص',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_custom_stickers_user_created
  ON public.user_custom_stickers (user_id, created_at DESC);

-- ============================================================================
-- 2. SECURITY HELPER FUNCTIONS FOR RLS (Tamper-resistant)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (
      COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'moderator')
    )
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.deleted_at IS NULL
        AND p.role IN ('admin', 'moderator')
    );
$$;

CREATE OR REPLACE FUNCTION public.is_not_blocked(user_1 uuid, user_2 uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    user_1 IS NOT NULL
    AND user_2 IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM public.blocked_users b
      WHERE (b.blocker_id = user_1 AND b.blocked_id = user_2)
         OR (b.blocker_id = user_2 AND b.blocked_id = user_1)
    );
$$;

CREATE OR REPLACE FUNCTION public.get_my_profile_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.role
  FROM public.profiles p
  WHERE p.id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

REVOKE ALL ON FUNCTION public.is_not_blocked(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_not_blocked(uuid, uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.get_my_profile_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_profile_role() TO authenticated;

-- Prevent clients from directly writing privileged columns even before triggers fire
REVOKE INSERT (role, deleted_at) ON public.profiles FROM anon, authenticated;
REVOKE UPDATE (role, deleted_at) ON public.profiles FROM anon, authenticated;

-- Restrict client UPDATE on messages strictly to the read status column and block DELETE
REVOKE UPDATE, DELETE ON public.messages FROM anon, authenticated;
GRANT UPDATE (status) ON public.messages TO authenticated;

-- Prevent clients from inserting or deleting conversation_user_state rows (managed by triggers/RPCs)
REVOKE INSERT, DELETE ON public.conversation_user_state FROM anon, authenticated;

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY ON ALL 15 TABLES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_private_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_adoption_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_user_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_custom_stickers ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. RLS POLICIES FOR ALL 15 TABLES
-- ============================================================================

-- 4.1 profiles
DROP POLICY IF EXISTS profiles_select_policy ON public.profiles;
CREATE POLICY profiles_select_policy ON public.profiles
  FOR SELECT TO authenticated
  USING (
    auth.uid() = id
    OR public.is_admin()
    OR (deleted_at IS NULL AND public.is_not_blocked(auth.uid(), id))
  );

DROP POLICY IF EXISTS profiles_insert_self ON public.profiles;
CREATE POLICY profiles_insert_self ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND role = 'user'
    AND deleted_at IS NULL
  );

DROP POLICY IF EXISTS profiles_update_self ON public.profiles;
CREATE POLICY profiles_update_self ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id AND deleted_at IS NULL)
  WITH CHECK (
    auth.uid() = id
    AND deleted_at IS NULL
    AND role = public.get_my_profile_role()
  );

-- 4.2 user_private_details
DROP POLICY IF EXISTS private_details_select_policy ON public.user_private_details;
CREATE POLICY private_details_select_policy ON public.user_private_details
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS private_details_insert_self ON public.user_private_details;
CREATE POLICY private_details_insert_self ON public.user_private_details
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS private_details_update_self ON public.user_private_details;
CREATE POLICY private_details_update_self ON public.user_private_details
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4.3 pets
DROP POLICY IF EXISTS pets_select_policy ON public.pets;
CREATE POLICY pets_select_policy ON public.pets
  FOR SELECT TO authenticated
  USING (
    auth.uid() = owner_id
    OR public.is_admin()
    OR (
      deleted_at IS NULL
      AND status IN ('mating', 'adoption')
      AND public.is_not_blocked(auth.uid(), owner_id)
    )
  );

DROP POLICY IF EXISTS pets_insert_owner ON public.pets;
CREATE POLICY pets_insert_owner ON public.pets
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = owner_id
    AND deleted_at IS NULL
  );

DROP POLICY IF EXISTS pets_update_owner ON public.pets;
CREATE POLICY pets_update_owner ON public.pets
  FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 4.4 group_adoption_members
DROP POLICY IF EXISTS group_members_select_policy ON public.group_adoption_members;
CREATE POLICY group_members_select_policy ON public.group_adoption_members
  FOR SELECT TO authenticated
  USING (
    auth.uid() = owner_id
    OR public.is_admin()
    OR (
      deleted_at IS NULL
      AND EXISTS (
        SELECT 1
        FROM public.pets p
        WHERE p.id = group_pet_id
          AND p.deleted_at IS NULL
          AND p.status = 'adoption'
          AND p.adoption_type = 'group'
          AND public.is_not_blocked(auth.uid(), p.owner_id)
      )
    )
  );

DROP POLICY IF EXISTS group_members_insert_owner ON public.group_adoption_members;
CREATE POLICY group_members_insert_owner ON public.group_adoption_members
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = owner_id
    AND deleted_at IS NULL
  );

DROP POLICY IF EXISTS group_members_update_owner ON public.group_adoption_members;
CREATE POLICY group_members_update_owner ON public.group_adoption_members
  FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 4.5 health_records
DROP POLICY IF EXISTS health_records_select_owner ON public.health_records;
CREATE POLICY health_records_select_owner ON public.health_records
  FOR SELECT TO authenticated
  USING ((auth.uid() = owner_id AND deleted_at IS NULL) OR public.is_admin());

DROP POLICY IF EXISTS health_records_insert_owner ON public.health_records;
CREATE POLICY health_records_insert_owner ON public.health_records
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS health_records_update_owner ON public.health_records;
CREATE POLICY health_records_update_owner ON public.health_records
  FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 4.6 saved_pets
DROP POLICY IF EXISTS saved_pets_select_self ON public.saved_pets;
CREATE POLICY saved_pets_select_self ON public.saved_pets
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS saved_pets_insert_self ON public.saved_pets;
CREATE POLICY saved_pets_insert_self ON public.saved_pets
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.pets p
      WHERE p.id = pet_id
        AND p.deleted_at IS NULL
        AND (p.owner_id = auth.uid() OR (p.status IN ('mating', 'adoption') AND public.is_not_blocked(auth.uid(), p.owner_id)))
    )
  );

DROP POLICY IF EXISTS saved_pets_delete_self ON public.saved_pets;
CREATE POLICY saved_pets_delete_self ON public.saved_pets
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 4.7 contact_requests
DROP POLICY IF EXISTS contact_requests_select_participants ON public.contact_requests;
CREATE POLICY contact_requests_select_participants ON public.contact_requests
  FOR SELECT TO authenticated
  USING (auth.uid() IN (sender_id, receiver_id) OR public.is_admin());

DROP POLICY IF EXISTS contact_requests_insert_sender ON public.contact_requests;
CREATE POLICY contact_requests_insert_sender ON public.contact_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND sender_id <> receiver_id
    AND status = 'pending'
    AND celebrated = false
    AND public.is_not_blocked(sender_id, receiver_id)
    AND ((type <> 'mating') OR (sender_pet_id IS NOT NULL))
  );

DROP POLICY IF EXISTS contact_requests_update_receiver ON public.contact_requests;
CREATE POLICY contact_requests_update_receiver ON public.contact_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id AND status = 'pending')
  WITH CHECK (auth.uid() = receiver_id AND status IN ('accepted', 'rejected'));

DROP POLICY IF EXISTS contact_requests_update_sender ON public.contact_requests;
CREATE POLICY contact_requests_update_sender ON public.contact_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = sender_id AND status IN ('pending', 'accepted'))
  WITH CHECK (auth.uid() = sender_id AND status IN ('withdrawn', 'accepted'));

-- 4.8 conversations (Read-only for participants; mutations handled exclusively by SECURITY DEFINER triggers)
DROP POLICY IF EXISTS conversations_select_participants ON public.conversations;
CREATE POLICY conversations_select_participants ON public.conversations
  FOR SELECT TO authenticated
  USING (auth.uid() IN (user_a_id, user_b_id) OR public.is_admin());

-- 4.9 conversation_user_state (Per-user isolation)
DROP POLICY IF EXISTS conv_user_state_select_self ON public.conversation_user_state;
CREATE POLICY conv_user_state_select_self ON public.conversation_user_state
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS conv_user_state_update_self ON public.conversation_user_state;
CREATE POLICY conv_user_state_update_self ON public.conversation_user_state
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = conversation_id
        AND auth.uid() IN (c.user_a_id, c.user_b_id)
    )
  )
  WITH CHECK (auth.uid() = user_id);

-- 4.10 messages (Respects per-user hidden_at cutoff; insert restricted to active participants)
DROP POLICY IF EXISTS messages_select_participant_after_hide ON public.messages;
CREATE POLICY messages_select_participant_after_hide ON public.messages
  FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.conversations c
      LEFT JOIN public.conversation_user_state cus
        ON cus.conversation_id = c.id AND cus.user_id = auth.uid()
      WHERE c.id = messages.conversation_id
        AND auth.uid() IN (c.user_a_id, c.user_b_id)
        AND (cus.hidden_at IS NULL OR messages.created_at > cus.hidden_at)
    )
  );

DROP POLICY IF EXISTS messages_insert_participant ON public.messages;
CREATE POLICY messages_insert_participant ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    is_system = false
    AND auth.uid() = sender_id
    AND EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND auth.uid() IN (c.user_a_id, c.user_b_id)
        AND public.is_not_blocked(c.user_a_id, c.user_b_id)
    )
  );

DROP POLICY IF EXISTS messages_update_recipient_read ON public.messages;
CREATE POLICY messages_update_recipient_read ON public.messages
  FOR UPDATE TO authenticated
  USING (
    is_system = false
    AND auth.uid() <> sender_id
    AND EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND auth.uid() IN (c.user_a_id, c.user_b_id)
    )
  )
  WITH CHECK (status = 'read');

-- 4.11 notifications
DROP POLICY IF EXISTS notifications_select_self ON public.notifications;
CREATE POLICY notifications_select_self ON public.notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS notifications_insert_system_self ON public.notifications;
CREATE POLICY notifications_insert_system_self ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND type = 'system');

DROP POLICY IF EXISTS notifications_update_self ON public.notifications;
CREATE POLICY notifications_update_self ON public.notifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4.12 blocked_users
DROP POLICY IF EXISTS blocked_users_select_blocker ON public.blocked_users;
CREATE POLICY blocked_users_select_blocker ON public.blocked_users
  FOR SELECT TO authenticated
  USING (auth.uid() = blocker_id);

DROP POLICY IF EXISTS blocked_users_insert_blocker ON public.blocked_users;
CREATE POLICY blocked_users_insert_blocker ON public.blocked_users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = blocker_id AND blocker_id <> blocked_id);

DROP POLICY IF EXISTS blocked_users_delete_blocker ON public.blocked_users;
CREATE POLICY blocked_users_delete_blocker ON public.blocked_users
  FOR DELETE TO authenticated
  USING (auth.uid() = blocker_id);

-- 4.13 reports
DROP POLICY IF EXISTS reports_select_reporter_or_admin ON public.reports;
CREATE POLICY reports_select_reporter_or_admin ON public.reports
  FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id OR public.is_admin());

DROP POLICY IF EXISTS reports_insert_reporter ON public.reports;
CREATE POLICY reports_insert_reporter ON public.reports
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = reporter_id
    AND reporter_id <> target_user_id
    AND status = 'pending_review'
    AND reviewed_by IS NULL
    AND admin_notes IS NULL
  );

DROP POLICY IF EXISTS reports_update_admin_only ON public.reports;
CREATE POLICY reports_update_admin_only ON public.reports
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4.14 support_messages
DROP POLICY IF EXISTS support_messages_select_owner_or_admin ON public.support_messages;
CREATE POLICY support_messages_select_owner_or_admin ON public.support_messages
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS support_messages_insert_owner ON public.support_messages;
CREATE POLICY support_messages_insert_owner ON public.support_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'new'
    AND priority = 'normal'
    AND assigned_admin_id IS NULL
    AND admin_reply IS NULL
    AND replied_at IS NULL
    AND email_notified = false
    AND email_notified_at IS NULL
  );

DROP POLICY IF EXISTS support_messages_update_admin_only ON public.support_messages;
CREATE POLICY support_messages_update_admin_only ON public.support_messages
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4.15 user_custom_stickers
DROP POLICY IF EXISTS custom_stickers_select_self ON public.user_custom_stickers;
CREATE POLICY custom_stickers_select_self ON public.user_custom_stickers
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS custom_stickers_insert_self ON public.user_custom_stickers;
CREATE POLICY custom_stickers_insert_self ON public.user_custom_stickers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS custom_stickers_delete_self ON public.user_custom_stickers;
CREATE POLICY custom_stickers_delete_self ON public.user_custom_stickers
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
