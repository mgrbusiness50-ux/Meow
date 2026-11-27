-- ============================================================================
-- Meow App - Migration 003: Realtime Publication, Private Chat Media Bucket,
-- Message Reply/Soft-Delete, Delivered Status RPC, and Conversation Mute
-- Safe & Idempotent (re-runnable without data loss).
-- DO NOT run automatically from code; apply manually in Supabase SQL Editor.
-- ============================================================================

-- 1. Schema additions on public.messages & public.conversation_user_state
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS reply_to_id uuid REFERENCES public.messages(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reply_to_sender_name text,
  ADD COLUMN IF NOT EXISTS reply_to_text text,
  ADD COLUMN IF NOT EXISTS reply_to_type text CHECK (reply_to_type IN ('text', 'image', 'audio', 'file', 'sticker')),
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.conversation_user_state
  ADD COLUMN IF NOT EXISTS is_muted boolean NOT NULL DEFAULT false;

-- 2. Allow authenticated clients to update status OR soft-delete their own message via deleted_at
REVOKE UPDATE ON public.messages FROM authenticated;
GRANT UPDATE (status, deleted_at) ON public.messages TO authenticated;

-- 3. Update RLS policy on public.messages for recipient status updates + sender soft delete
DROP POLICY IF EXISTS messages_update_sender_soft_delete ON public.messages;
CREATE POLICY messages_update_sender_soft_delete ON public.messages
  FOR UPDATE TO authenticated
  USING (
    is_system = false
    AND auth.uid() = sender_id
    AND EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND auth.uid() IN (c.user_a_id, c.user_b_id)
    )
  )
  WITH CHECK (
    auth.uid() = sender_id
    AND deleted_at IS NOT NULL
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
  WITH CHECK (status IN ('delivered', 'read'));

-- 4. Update protect_message_update() to permit 'delivered'/'read' transitions and sender soft-delete (deleted_at)
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
     OR NEW.reply_to_id IS DISTINCT FROM OLD.reply_to_id
     OR NEW.reply_to_sender_name IS DISTINCT FROM OLD.reply_to_sender_name
     OR NEW.reply_to_text IS DISTINCT FROM OLD.reply_to_text
     OR NEW.reply_to_type IS DISTINCT FROM OLD.reply_to_type
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Messages are immutable except delivery/read status and soft deletion';
  END IF;

  IF OLD.is_system THEN
    RAISE EXCEPTION 'System messages cannot be modified';
  END IF;

  IF NEW.deleted_at IS DISTINCT FROM OLD.deleted_at THEN
    IF OLD.deleted_at IS NOT NULL THEN
      RAISE EXCEPTION 'Cannot restore a deleted message';
    END IF;
    IF NEW.deleted_at IS NULL THEN
      RAISE EXCEPTION 'deleted_at cannot be cleared';
    END IF;
    IF auth.uid() IS DISTINCT FROM OLD.sender_id
       AND jwt_role <> 'service_role'
       AND current_user NOT IN ('postgres', 'supabase_admin', 'service_role') THEN
      RAISE EXCEPTION 'Only sender can delete their own message';
    END IF;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF jwt_role <> 'service_role'
       AND current_user NOT IN ('postgres', 'supabase_admin', 'service_role') THEN
      IF NEW.status NOT IN ('delivered', 'read') THEN
        RAISE EXCEPTION 'Only status = delivered or read is permitted when updating messages';
      END IF;
      IF OLD.status = 'read' AND NEW.status = 'delivered' THEN
        RAISE EXCEPTION 'Cannot downgrade message status from read to delivered';
      END IF;
    ELSIF NEW.status IS NULL OR NEW.status NOT IN ('sent', 'delivered', 'read') THEN
      RAISE EXCEPTION 'Invalid message status value';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- 5. RPC to mark incoming sent messages in a conversation as delivered
CREATE OR REPLACE FUNCTION public.mark_messages_delivered(p_conversation_id uuid)
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

  UPDATE public.messages m
  SET status = 'delivered'
  WHERE m.conversation_id = p_conversation_id
    AND m.is_system = false
    AND m.sender_id <> uid
    AND m.status = 'sent';
END;
$$;

REVOKE ALL ON FUNCTION public.mark_messages_delivered(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_messages_delivered(uuid) TO authenticated;

-- 6. Ensure Supabase Realtime publication emits full row payloads for chat, requests & notifications
ALTER TABLE public.contact_requests REPLICA IDENTITY FULL;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.conversation_user_state REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'contact_requests',
    'conversations',
    'conversation_user_state',
    'messages',
    'notifications'
  ]
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = tbl
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', tbl);
    END IF;
  END LOOP;
END
$$;

-- 7. Private Supabase Storage bucket 'chat-media' + participant-only RLS policies
-- Path convention enforced on upload: <conversation_id>/<auth.uid()>/<filename>
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-media',
  'chat-media',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

DROP POLICY IF EXISTS chat_media_select_participants ON storage.objects;
CREATE POLICY chat_media_select_participants ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'chat-media'
    AND EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id::text = (storage.foldername(name))[1]
        AND auth.uid() IN (c.user_a_id, c.user_b_id)
    )
  );

DROP POLICY IF EXISTS chat_media_insert_participants ON storage.objects;
CREATE POLICY chat_media_insert_participants ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'chat-media'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id::text = (storage.foldername(name))[1]
        AND auth.uid() IN (c.user_a_id, c.user_b_id)
        AND public.is_not_blocked(c.user_a_id, c.user_b_id)
    )
  );

DROP POLICY IF EXISTS chat_media_delete_owner ON storage.objects;
CREATE POLICY chat_media_delete_owner ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'chat-media'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );
