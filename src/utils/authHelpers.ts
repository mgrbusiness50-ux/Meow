export function isNetworkOrOfflineError(input?: unknown): boolean {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return true;
  }
  const message =
    typeof input === 'string'
      ? input
      : input && typeof input === 'object'
      ? String(
          (input as { message?: unknown; errorMessage?: unknown }).message ||
            (input as { message?: unknown; errorMessage?: unknown }).errorMessage ||
            ''
        )
      : '';
  const lower = message.trim().toLowerCase();
  if (!lower) return false;
  return (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('network request failed') ||
    lower.includes('err_internet_disconnected') ||
    lower.includes('load failed') ||
    lower.includes('timeout') ||
    lower.includes('timed out') ||
    lower.includes('aborted') ||
    lower.includes('مشكلة في الاتصال بالإنترنت') ||
    lower.includes('انقطع الاتصال') ||
    lower.includes('تعذر الاتصال')
  );
}

function collectMetadataUsernames(sessionUser?: {
  email?: string;
  user_metadata?: Record<string, unknown>;
  identities?: Array<{ identity_data?: Record<string, unknown> | null }>;
} | null): string[] {
  const handles = new Set<string>();
  const add = (val: unknown) => {
    if (typeof val !== 'string') return;
    const trimmed = val.trim().toLowerCase().replace(/^@+/, '');
    if (trimmed) handles.add(trimmed);
  };
  if (sessionUser?.user_metadata) {
    add(sessionUser.user_metadata.username);
    add(sessionUser.user_metadata.preferred_username);
    add(sessionUser.user_metadata.user_name);
    add(sessionUser.user_metadata.nickname);
  }
  if (Array.isArray(sessionUser?.identities)) {
    for (const identity of sessionUser.identities) {
      const data = identity?.identity_data;
      if (!data) continue;
      add(data.username);
      add(data.preferred_username);
      add(data.user_name);
      add(data.nickname);
    }
  }
  return Array.from(handles);
}

/**
 * Prevents auto-filling the user's real display name from an email prefix
 * (e.g. `SPLIT_PART(email, '@', 1)` created by DB triggers) or social @handles/usernames.
 * Keeps genuine Google display names (e.g. "Ahmed Ali" or "أحمد علي").
 */
export function sanitizeOAuthDisplayName(
  rawName: unknown,
  email?: string,
  sessionUser?: {
    email?: string;
    user_metadata?: Record<string, unknown>;
    identities?: Array<{ identity_data?: Record<string, unknown> | null }>;
  } | null
): string {
  if (typeof rawName !== 'string') return '';
  const trimmed = rawName.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('@')) return '';

  const normalized = trimmed.toLowerCase();
  const normalizedWithoutAt = normalized.replace(/^@+/, '');
  const resolvedEmail = (email || sessionUser?.email || '').trim().toLowerCase();
  const emailPrefix = resolvedEmail.includes('@') ? resolvedEmail.split('@')[0] : '';

  if (resolvedEmail && normalized === resolvedEmail) return '';
  if (emailPrefix && (normalized === emailPrefix || normalizedWithoutAt === emailPrefix)) {
    return '';
  }

  const usernames = collectMetadataUsernames(sessionUser);
  if (usernames.some((u) => u === normalized || u === normalizedWithoutAt)) {
    return '';
  }

  // Reject single-token handle/slug forms clearly derived from username/email syntax
  if (!/\s/.test(trimmed) && /[._\d]/.test(trimmed)) {
    const compactName = normalized.replace(/[^a-z0-9]/g, '');
    const compactPrefix = emailPrefix.replace(/[^a-z0-9]/g, '');
    if (
      compactName &&
      ((compactPrefix && compactName === compactPrefix) ||
        usernames.some((u) => u.replace(/[^a-z0-9]/g, '') === compactName))
    ) {
      return '';
    }
    if (/^[a-z0-9._-]+$/i.test(trimmed) && /\d/.test(trimmed)) {
      return '';
    }
  }

  return trimmed;
}
