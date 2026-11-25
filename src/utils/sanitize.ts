export const SAFE_FALLBACK_AVATAR_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='32' fill='%23FFE2C5'/%3E%3Ccircle cx='32' cy='25' r='11' fill='%23E67E22'/%3E%3Cpath d='M14 54c2-11 11-16 18-16s16 5 18 16' fill='%23E67E22'/%3E%3C/svg%3E";

export const SAFE_FALLBACK_PET_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='24' fill='%23FFF5EA'/%3E%3Ccircle cx='60' cy='62' r='26' fill='%23FFE2C5'/%3E%3Ctext x='60' y='71' text-anchor='middle' font-size='32'%3E%F0%9F%90%BE%3C/text%3E%3C/svg%3E";

const SAFE_IMAGE_DATA_URL_RE =
  /^data:image\/(?:png|jpeg|jpg|webp|gif|bmp|avif|heic|heif);base64,[A-Za-z0-9+/=\s]+$/i;

const SAFE_AUDIO_DATA_URL_RE =
  /^data:audio\/(?:webm|ogg|mp4|mpeg|mp3|wav|aac);base64,[A-Za-z0-9+/=\s]+$/i;

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeAttr(value: unknown): string {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

export function sanitizeUrl(rawUrl: unknown, fallback = ''): string {
  if (typeof rawUrl !== 'string') return fallback;
  const trimmed = rawUrl.trim();
  if (!trimmed) return fallback;

  // Reject control characters / whitespace tricks in schemes
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) return fallback;

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  if (SAFE_IMAGE_DATA_URL_RE.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const proto = parsed.protocol.toLowerCase();
    if (proto === 'https:' || proto === 'http:' || proto === 'blob:') {
      return parsed.toString();
    }
  } catch {
    // Allow relative safe paths without explicit protocol tricks
    if (!trimmed.includes(':') && !trimmed.startsWith('//')) {
      return trimmed;
    }
  }

  return fallback;
}

export function sanitizeImageSrc(
  rawUrl: unknown,
  fallback: string = SAFE_FALLBACK_PET_SVG
): string {
  if (typeof rawUrl === 'string' && rawUrl.startsWith('data:image/svg+xml,')) {
    // Only allow our built-in static placeholder constants
    if (rawUrl === SAFE_FALLBACK_AVATAR_SVG || rawUrl === SAFE_FALLBACK_PET_SVG) {
      return rawUrl;
    }
    return fallback;
  }
  return sanitizeUrl(rawUrl, fallback);
}

export function sanitizeAudioSrc(rawUrl: unknown): string {
  if (typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed || /[\u0000-\u001F\u007F]/.test(trimmed)) return '';
  if (SAFE_AUDIO_DATA_URL_RE.test(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed);
    const proto = parsed.protocol.toLowerCase();
    if (proto === 'https:' || proto === 'http:' || proto === 'blob:') {
      return parsed.toString();
    }
  } catch {
    return '';
  }
  return '';
}

export function sanitizeTelUrl(phone: unknown): string {
  if (typeof phone !== 'string') return '#';
  const cleaned = phone.trim().replace(/[^\d+]/g, '');
  const normalized = cleaned.startsWith('+')
    ? `+${cleaned.slice(1).replace(/\+/g, '')}`
    : cleaned.replace(/\+/g, '');
  const digitsCount = normalized.replace(/\D/g, '').length;
  if (digitsCount < 7 || digitsCount > 16) return '#';
  return `tel:${normalized}`;
}

export type UploadFileKind = 'image' | 'audio' | 'document';

const UPLOAD_RULES: Record<
  UploadFileKind,
  { maxBytes: number; mimePrefixes: string[]; mimeExact: string[]; labelAr: string }
> = {
  image: {
    maxBytes: 12 * 1024 * 1024,
    mimePrefixes: [],
    mimeExact: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/heic',
      'image/heif',
      'image/avif',
      'image/bmp',
    ],
    labelAr: 'الصورة (JPG / PNG / WEBP / HEIC بحد أقصى 12 ميجابايت)',
  },
  audio: {
    maxBytes: 10 * 1024 * 1024,
    mimePrefixes: ['audio/'],
    mimeExact: [],
    labelAr: 'المقطع الصوتي (بحد أقصى 10 ميجابايت)',
  },
  document: {
    maxBytes: 10 * 1024 * 1024,
    mimePrefixes: [],
    mimeExact: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf',
      'text/plain',
    ],
    labelAr: 'المرفق (صورة أو PDF أو نص بحد أقصى 10 ميجابايت)',
  },
};

const SAFE_IMAGE_EXTENSIONS_RE = /\.(?:jpe?g|png|webp|gif|heic|heif|avif|bmp)$/i;

export function validateUploadedFile(
  file: Pick<File, 'type' | 'size' | 'name'> | null | undefined,
  kind: UploadFileKind
): { valid: boolean; errorMessage?: string } {
  if (!file) {
    return { valid: false, errorMessage: 'لم يتم تحديد أي ملف.' };
  }
  const rules = UPLOAD_RULES[kind];
  if (file.size <= 0) {
    return { valid: false, errorMessage: 'الملف المحدد فارغ أو غير صالح.' };
  }
  if (file.size > rules.maxBytes) {
    const maxMb = Math.round(rules.maxBytes / (1024 * 1024));
    return {
      valid: false,
      errorMessage: `حجم الملف يتجاوز الحد المسموح (${maxMb} ميجابايت).`,
    };
  }
  const mime = (file.type || '').toLowerCase().trim();
  const isUnknownMobileMime = mime === '' || mime === 'application/octet-stream';
  const imageExtensionAllowed =
    kind === 'image' && isUnknownMobileMime && SAFE_IMAGE_EXTENSIONS_RE.test((file.name || '').trim());
  const mimeAllowed =
    (mime && rules.mimeExact.includes(mime)) ||
    (mime && rules.mimePrefixes.some((p) => mime.startsWith(p))) ||
    imageExtensionAllowed;

  if (!mimeAllowed) {
    return {
      valid: false,
      errorMessage: `صيغة الملف غير مدعومة. الصيغ المسموحة: ${rules.labelAr}.`,
    };
  }
  return { valid: true };
}

export function isSafeDeepLink(rawUrl: unknown): boolean {
  if (typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    const proto = parsed.protocol.toLowerCase();
    if (proto === 'com.meow.app:') {
      return parsed.host.toLowerCase() === 'auth-callback';
    }
    if (typeof window !== 'undefined' && proto === 'https:') {
      return parsed.origin === window.location.origin;
    }
    return false;
  } catch {
    return false;
  }
}
