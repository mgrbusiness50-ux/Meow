export function isExplicitAuthInvalidError(input?: unknown): boolean {
  const obj = input && typeof input === 'object' ? (input as { code?: unknown; status?: unknown; errorCode?: unknown; message?: unknown; errorMessage?: unknown }) : null;
  const code = String(obj?.code || obj?.errorCode || '').trim().toLowerCase();
  const status = typeof obj?.status === 'number' ? obj.status : Number(obj?.status || 0);
  const message =
    typeof input === 'string'
      ? input
      : obj
      ? String(obj.message || obj.errorMessage || '')
      : '';
  const lower = message.trim().toLowerCase();

  if (status === 401 || status === 403) {
    return true;
  }

  if (
    code === 'invalid_grant' ||
    code === 'refresh_token_not_found' ||
    code === 'session_not_found' ||
    code === 'user_not_found' ||
    code === 'user_banned' ||
    code === 'bad_jwt'
  ) {
    return true;
  }

  if (!lower) return false;
  return (
    lower.includes('invalid refresh token') ||
    lower.includes('refresh token not found') ||
    lower.includes('refresh_token_not_found') ||
    lower.includes('invalid_grant') ||
    lower.includes('jwt expired') ||
    lower.includes('session_not_found') ||
    lower.includes('user_not_found') ||
    lower.includes('user_banned') ||
    lower.includes('account_deleted') ||
    lower.includes('invalid claim')
  );
}

export function isNetworkOrOfflineError(input?: unknown): boolean {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return true;
  }
  const obj = input && typeof input === 'object' ? (input as { name?: unknown; status?: unknown; code?: unknown; message?: unknown; errorMessage?: unknown }) : null;
  const name = String(obj?.name || '').trim().toLowerCase();
  const code = String(obj?.code || '').trim().toLowerCase();
  const status = typeof obj?.status === 'number' ? obj.status : Number(obj?.status || 0);
  const message =
    typeof input === 'string'
      ? input
      : obj
      ? String(obj.message || obj.errorMessage || '')
      : '';
  const lower = message.trim().toLowerCase();

  if (name === 'aborterror' || code === 'econnrefused' || code === 'enotfound' || code === 'etimedout' || code === 'err_network') {
    return true;
  }
  if (status === 0 && obj && ('status' in obj) && lower.length > 0 && !isExplicitAuthInvalidError(input)) {
    return true;
  }
  if (status === 502 || status === 503 || status === 504) {
    return true;
  }
  if (!lower) return false;
  return (
    lower.includes('failed to fetch') ||
    lower.includes('fetch failed') ||
    lower.includes('networkerror') ||
    lower.includes('network request failed') ||
    lower.includes('network error') ||
    lower.includes('err_internet_disconnected') ||
    lower.includes('err_network') ||
    lower.includes('err_connection') ||
    lower.includes('err_name_not_resolved') ||
    lower.includes('net::err') ||
    lower.includes('load failed') ||
    lower.includes('timeout') ||
    lower.includes('timed out') ||
    lower.includes('aborted') ||
    lower.includes('socket hang up') ||
    lower.includes('econnreset') ||
    lower.includes('offline') ||
    lower.includes('مشكلة في الاتصال بالإنترنت') ||
    lower.includes('انقطع الاتصال') ||
    lower.includes('لا يوجد اتصال') ||
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

/**
 * Extracts a user's real display name from Google / OAuth metadata without
 * ever falling back to usernames, handles, nicknames, or email local-parts.
 */
export function extractGoogleRealName(sessionUser?: {
  email?: string;
  user_metadata?: Record<string, unknown>;
  identities?: Array<{ identity_data?: Record<string, unknown> | null }>;
} | null): string {
  if (!sessionUser) return '';
  const meta = (sessionUser.user_metadata || {}) as Record<string, unknown>;
  const candidates: unknown[] = [
    meta.full_name,
    [meta.given_name, meta.family_name]
      .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
      .join(' '),
    meta.name,
  ];
  if (Array.isArray(sessionUser.identities)) {
    for (const identity of sessionUser.identities) {
      const data = identity?.identity_data;
      if (!data) continue;
      candidates.push(
        data.full_name,
        [data.given_name, data.family_name]
          .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
          .join(' '),
        data.name
      );
    }
  }
  for (const candidate of candidates) {
    const cleaned = sanitizeOAuthDisplayName(candidate, sessionUser.email, sessionUser);
    if (cleaned) return cleaned;
  }
  return '';
}
