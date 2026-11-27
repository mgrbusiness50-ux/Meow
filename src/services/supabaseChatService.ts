import { ChatMessage } from '../types.ts';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient.ts';
import {
  DbMessageRow,
  formatArabicClock,
  mapDbMessageToModel,
} from './supabaseMappers.ts';

export const CHAT_MEDIA_BUCKET = 'chat-media';
export const CHAT_STORAGE_PREFIX = 'sb-storage://chat-media/';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUuid(id?: string | null): boolean {
  return Boolean(id && UUID_REGEX.test(id));
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getDbErrorMessage(err: unknown, fallback: string): string {
  const code = (err as { code?: string; status?: number } | null)?.code;
  const message = (err as { message?: string } | null)?.message || '';
  if (code === '42501' || message.toLowerCase().includes('row-level security')) {
    return 'معندكش صلاحية لتنفيذ العملية دي دلوقتي.';
  }
  if (
    message.toLowerCase().includes('failed to fetch') ||
    message.toLowerCase().includes('network')
  ) {
    return 'مفيش اتصال بالإنترنت، جرب تاني كمان شوية.';
  }
  return fallback;
}

const signedUrlCache = new Map<string, { url: string; expiresAt: number }>();

export function buildChatStorageRef(path: string): string {
  return `${CHAT_STORAGE_PREFIX}${path.replace(/^\/+/, '')}`;
}

export function extractChatStoragePath(urlOrRef?: string | null): string | null {
  if (!urlOrRef) return null;
  if (urlOrRef.startsWith(CHAT_STORAGE_PREFIX)) {
    return urlOrRef.slice(CHAT_STORAGE_PREFIX.length);
  }
  return null;
}

export async function resolveChatMediaSignedUrl(
  storagePathOrRef: string
): Promise<string | null> {
  const path = extractChatStoragePath(storagePathOrRef) || storagePathOrRef;
  if (!path || !isSupabaseConfigured()) return null;

  const cached = signedUrlCache.get(path);
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.url;
  }

  const client = getSupabaseClient();
  if (!client || typeof client.storage?.from !== 'function') return null;

  try {
    const { data, error } = await client.storage
      .from(CHAT_MEDIA_BUCKET)
      .createSignedUrl(path, 3600);
    if (error || !data?.signedUrl) {
      return null;
    }
    signedUrlCache.set(path, {
      url: data.signedUrl,
      expiresAt: Date.now() + 3500 * 1000,
    });
    return data.signedUrl;
  } catch {
    return null;
  }
}

export async function resolveConversationMediaUrls(
  messages: ChatMessage[]
): Promise<void> {
  const targets = messages.filter(
    (m) => !m.deletedAt && m.storagePath && (!m.fileUrl || m.fileUrl.startsWith(CHAT_STORAGE_PREFIX))
  );
  if (targets.length === 0) return;

  await Promise.all(
    targets.map(async (m) => {
      if (!m.storagePath) return;
      const signed = await resolveChatMediaSignedUrl(m.storagePath);
      if (signed) {
        m.fileUrl = signed;
      }
    })
  );
}

export interface UploadChatMediaResult {
  success: boolean;
  storagePath?: string;
  storageRef?: string;
  signedUrl?: string;
  errorMessage?: string;
}

export async function uploadChatMediaInSupabase(params: {
  conversationId: string;
  senderId: string;
  blob: Blob;
  mimeType: string;
  extension?: string;
}): Promise<UploadChatMediaResult> {
  const client = getSupabaseClient();
  if (
    !client ||
    typeof client.storage?.from !== 'function' ||
    !isValidUuid(params.conversationId) ||
    !isValidUuid(params.senderId)
  ) {
    return {
      success: false,
      errorMessage: 'تعذر تجهيز رفع الصورة. تأكد من اتصالك وحاول تاني.',
    };
  }

  const ext =
    params.extension ||
    (params.mimeType === 'image/png'
      ? 'png'
      : params.mimeType === 'image/webp'
      ? 'webp'
      : 'jpg');
  const filePath = `${params.conversationId}/${params.senderId}/${Date.now()}-${generateUuid().slice(0, 8)}.${ext}`;

  try {
    const { error } = await client.storage
      .from(CHAT_MEDIA_BUCKET)
      .upload(filePath, params.blob, {
        contentType: params.mimeType,
        upsert: false,
        cacheControl: '3600',
      });

    if (error) {
      const msg = String(error.message || '').toLowerCase();
      if (msg.includes('bucket') && msg.includes('not found')) {
        return {
          success: false,
          errorMessage: 'مخزن صور الشات (chat-media) لسه متفعلش على Supabase.',
        };
      }
      return {
        success: false,
        errorMessage: getDbErrorMessage(error, 'فشل رفع الصورة، جرب تاني.'),
      };
    }

    const signedUrl = await resolveChatMediaSignedUrl(filePath);
    return {
      success: true,
      storagePath: filePath,
      storageRef: buildChatStorageRef(filePath),
      signedUrl: signedUrl || undefined,
    };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'حصلت مشكلة وقت رفع الصورة.'),
    };
  }
}

export async function sendExtendedChatMessageInSupabase(params: {
  id?: string;
  conversationId: string;
  senderId: string;
  message: ChatMessage;
}): Promise<{ success: boolean; data?: ChatMessage; errorMessage?: string }> {
  const client = getSupabaseClient();
  if (
    !client ||
    !isValidUuid(params.conversationId) ||
    !isValidUuid(params.senderId)
  ) {
    return { success: false, errorMessage: 'بيانات المحادثة مش سليمة.' };
  }

  const msgId = params.id && isValidUuid(params.id) ? params.id : generateUuid();
  const basePayload: Record<string, unknown> = {
    id: msgId,
    conversation_id: params.conversationId,
    sender_id: params.senderId,
    is_system: false,
    type: params.message.type || 'text',
    text: params.message.text ?? null,
    file_url: params.message.storagePath
      ? buildChatStorageRef(params.message.storagePath)
      : params.message.fileUrl ?? null,
    file_name: params.message.fileName ?? null,
    file_size: params.message.fileSize ?? null,
    audio_duration:
      typeof params.message.audioDuration === 'number'
        ? Math.max(0, Math.round(params.message.audioDuration))
        : null,
    sticker_url: params.message.stickerUrl ?? null,
    sticker_emoji: params.message.stickerEmoji ?? null,
    sticker_title: params.message.stickerTitle ?? null,
    status: 'sent',
  };

  const extendedPayload =
    params.message.replyTo && isValidUuid(params.message.replyTo.messageId)
      ? {
          ...basePayload,
          reply_to_id: params.message.replyTo.messageId,
          reply_to_sender_name: params.message.replyTo.senderName,
          reply_to_text: params.message.replyTo.text,
          reply_to_type: params.message.replyTo.type || 'text',
        }
      : basePayload;

  try {
    let { data, error } = await client
      .from('messages')
      .insert(extendedPayload)
      .select('*')
      .single();

    // Graceful fallback if migration 003 reply_to columns haven't been executed yet
    if (error && extendedPayload !== basePayload) {
      const errMsg = String(error.message || '').toLowerCase();
      if (
        error.code === '42703' ||
        error.code === 'PGRST204' ||
        errMsg.includes('reply_to_') ||
        errMsg.includes('column')
      ) {
        const retry = await client
          .from('messages')
          .insert(basePayload)
          .select('*')
          .single();
        data = retry.data;
        error = retry.error;
      }
    }

    if (error || !data) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(error, 'ماقدرناش نبعت الرسالة دلوقتي.'),
      };
    }

    const row = data as unknown as DbMessageRow;
    const mapped = mapDbMessageToModel(row, params.senderId);
    const resolvedFileUrl =
      params.message.fileUrl && !params.message.fileUrl.startsWith(CHAT_STORAGE_PREFIX)
        ? params.message.fileUrl
        : mapped.storagePath
        ? (await resolveChatMediaSignedUrl(mapped.storagePath)) || undefined
        : mapped.fileUrl;

    return {
      success: true,
      data: {
        ...params.message,
        ...mapped,
        id: row.id,
        senderName: params.message.senderName,
        replyTo: mapped.replyTo || params.message.replyTo,
        fileUrl: resolvedFileUrl,
        timestamp: formatArabicClock(row.created_at),
        localStatus: 'sent',
      },
    };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'ماقدرناش نبعت الرسالة دلوقتي.'),
    };
  }
}

export async function softDeleteMessageInSupabase(
  messageId: string,
  senderId: string
): Promise<{ success: boolean; errorMessage?: string }> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(messageId) || !isValidUuid(senderId)) {
    return { success: false, errorMessage: 'بيانات الرسالة مش صالحة للمسح.' };
  }

  try {
    const deletedAt = new Date().toISOString();
    const { error } = await client
      .from('messages')
      .update({ deleted_at: deletedAt })
      .eq('id', messageId)
      .eq('sender_id', senderId);

    if (error) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(
          error,
          'تعذر مسح الرسالة من السيرفر.'
        ),
      };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'تعذر مسح الرسالة.'),
    };
  }
}

export async function setConversationMutedInSupabase(
  conversationId: string,
  userId: string,
  muted: boolean
): Promise<{ success: boolean; errorMessage?: string }> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(conversationId) || !isValidUuid(userId)) {
    return { success: false };
  }

  try {
    const { error } = await client
      .from('conversation_user_state')
      .update({ is_muted: muted })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);
    if (error) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(error, 'تعذر تحديث إعدادات الكتم.'),
      };
    }
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function markMessagesDeliveredInSupabase(
  conversationId: string
): Promise<void> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(conversationId) || typeof client.rpc !== 'function') return;
  try {
    await client.rpc('mark_messages_delivered', { p_conversation_id: conversationId });
  } catch {
    // Ignore if RPC not deployed yet or offline
  }
}
