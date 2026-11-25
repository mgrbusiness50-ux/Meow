import { sanitizeImageSrc, validateUploadedFile } from './sanitize.ts';

export type ImageUploadResult =
  | { success: true; dataUrl: string }
  | { success: false; errorMessage: string };

export interface ImageUploadProcessOptions {
  maxDimension?: number;
  quality?: number;
}

const DEFAULT_MAX_DIMENSION = 1200;
const DEFAULT_JPEG_QUALITY = 0.82;
const MAX_STORED_DATA_URL_CHARS = 2_400_000;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string' && reader.result.length > 0) {
        resolve(reader.result);
      } else {
        reject(new Error('EMPTY_FILE_RESULT'));
      }
    };
    reader.onerror = () => {
      reject(reader.error || new Error('FILE_READ_ERROR'));
    };
    reader.onabort = () => {
      reject(new Error('FILE_READ_ABORTED'));
    };
    try {
      reader.readAsDataURL(file);
    } catch (err) {
      reject(err);
    }
  });
}

function compressDataUrlWithCanvas(
  rawDataUrl: string,
  maxDimension: number,
  quality: number
): Promise<string | null> {
  if (typeof Image === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;

    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      resolve(value);
    };

    const timeoutId = window.setTimeout(() => finish(null), 12000);

    img.onload = () => {
      try {
        const srcWidth = img.naturalWidth || img.width;
        const srcHeight = img.naturalHeight || img.height;
        if (!srcWidth || !srcHeight) {
          finish(null);
          return;
        }

        const scale = Math.min(1, maxDimension / Math.max(srcWidth, srcHeight));
        const targetWidth = Math.max(1, Math.round(srcWidth * scale));
        const targetHeight = Math.max(1, Math.round(srcHeight * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          finish(null);
          return;
        }

        // Fill white background so transparent PNG/WebP renders cleanly in JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        let compressed = canvas.toDataURL('image/jpeg', quality);
        if (!compressed || compressed === 'data:,') {
          finish(null);
          return;
        }
        if (compressed.length > MAX_STORED_DATA_URL_CHARS) {
          const stronger = canvas.toDataURL('image/jpeg', 0.68);
          if (stronger && stronger !== 'data:,') {
            compressed = stronger;
          }
        }
        finish(compressed);
      } catch {
        finish(null);
      }
    };

    img.onerror = () => {
      finish(null);
    };

    img.src = rawDataUrl;
  });
}

/**
 * Validates, reads, normalizes, and compresses a user-selected photo for mobile/WebView upload.
 * Always returns a structured result with a clear Arabic error message on failure.
 */
export async function processImageFileForUpload(
  file: File | null | undefined,
  options: ImageUploadProcessOptions = {}
): Promise<ImageUploadResult> {
  const validation = validateUploadedFile(file, 'image');
  if (!validation.valid || !file) {
    return {
      success: false,
      errorMessage: validation.errorMessage || 'ملف الصورة غير مدعوم أو يتجاوز الحد المسموح.',
    };
  }

  let rawDataUrl = '';
  try {
    rawDataUrl = await readFileAsDataUrl(file);
  } catch {
    return {
      success: false,
      errorMessage: 'تعذر قراءة الصورة من الهاتف. يرجى المحاولة مرة أخرى أو اختيار صورة أخرى.',
    };
  }

  // Some Android WebView content:// picks return data:application/octet-stream;base64,...
  // Normalize unknown base64 prefix to image mime guess before canvas decoding if needed.
  if (rawDataUrl.startsWith('data:application/octet-stream;base64,')) {
    const ext = (file.name || '').split('.').pop()?.toLowerCase();
    const mimeGuess =
      ext === 'png'
        ? 'image/png'
        : ext === 'webp'
          ? 'image/webp'
          : ext === 'gif'
            ? 'image/gif'
            : 'image/jpeg';
    rawDataUrl = rawDataUrl.replace(
      'data:application/octet-stream;base64,',
      `data:${mimeGuess};base64,`
    );
  }

  const maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION;
  const quality = options.quality ?? DEFAULT_JPEG_QUALITY;
  const isSmallGif =
    (file.type || '').toLowerCase() === 'image/gif' && file.size <= 1_500_000;

  if (!isSmallGif) {
    const compressed = await compressDataUrlWithCanvas(rawDataUrl, maxDimension, quality);
    if (compressed) {
      const safeCompressed = sanitizeImageSrc(compressed, '');
      if (safeCompressed) {
        return { success: true, dataUrl: safeCompressed };
      }
    }
  }

  const safeRaw = sanitizeImageSrc(rawDataUrl, '');
  if (!safeRaw) {
    return {
      success: false,
      errorMessage:
        'تعذر معالجة صيغة هذه الصورة. يرجى اختيار صورة بصيغة JPG أو PNG أو WEBP.',
    };
  }

  if (safeRaw.length > MAX_STORED_DATA_URL_CHARS * 2) {
    return {
      success: false,
      errorMessage: 'حجم الصورة كبير جداً بعد المعالجة. يرجى اختيار صورة أصغر.',
    };
  }

  return { success: true, dataUrl: safeRaw };
}
