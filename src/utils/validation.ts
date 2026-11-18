export function normalizeArabicDigits(input: string): string {
  const arabicIndic = '٠١٢٣٤٥٦٧٨٩';
  const easternArabic = '۰۱۲۳۴۵۶۷۸۹';
  return input
    .replace(/[٠-٩]/g, (d) => String(arabicIndic.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String(easternArabic.indexOf(d)));
}

export interface EgyptianPhoneValidationResult {
  isValid: boolean;
  normalized: string;
  local11Digits?: string;
  error?: string;
}

/**
 * Validates Egyptian mobile numbers:
 * - Local 11-digit format: 010xxxxxxxx, 011xxxxxxxx, 012xxxxxxxx, 015xxxxxxxx
 * - International formats: +2010xxxxxxxx, 2010xxxxxxxx, 002010xxxxxxxx
 * - Prefix-paired 10-digit format (when +20 badge is shown): 10xxxxxxxx, 11xxxxxxxx, 12xxxxxxxx, 15xxxxxxxx
 */
export function validateEgyptianMobile(rawInput: string): EgyptianPhoneValidationResult {
  const normalizedDigits = normalizeArabicDigits(rawInput || '').trim();
  if (!normalizedDigits) {
    return {
      isValid: false,
      normalized: '',
      error: 'يرجى إدخال رقم الهاتف المصري.',
    };
  }

  // Reject alphabetic or invalid symbol characters (allow leading + and spaces/hyphens/parentheses only)
  const cleaned = normalizedDigits.replace(/[\s\-()]/g, '');
  if (!/^\+?\d+$/.test(cleaned)) {
    return {
      isValid: false,
      normalized: '',
      error: 'رقم الهاتف يجب أن يحتوي على أرقام صحيحة فقط.',
    };
  }

  let national10 = '';

  if (/^01[0125]\d{8}$/.test(cleaned)) {
    // 010 / 011 / 012 / 015 + 8 digits (11 digits total)
    national10 = cleaned.slice(1);
  } else if (/^1[0125]\d{8}$/.test(cleaned)) {
    // 10 / 11 / 12 / 15 + 8 digits (10 digits entered after +20 prefix)
    national10 = cleaned;
  } else if (/^\+201[0125]\d{8}$/.test(cleaned)) {
    // +201[0125] + 8 digits
    national10 = cleaned.slice(3);
  } else if (/^201[0125]\d{8}$/.test(cleaned)) {
    // 201[0125] + 8 digits
    national10 = cleaned.slice(2);
  } else if (/^00201[0125]\d{8}$/.test(cleaned)) {
    // 00201[0125] + 8 digits
    national10 = cleaned.slice(4);
  } else if (/^\+?2001[0125]\d{8}$/.test(cleaned)) {
    // Handles accidental +20 followed by leading 0 (e.g. +2001012345678)
    const idx = cleaned.indexOf('01');
    national10 = cleaned.slice(idx + 1);
  } else {
    return {
      isValid: false,
      normalized: '',
      error:
        'رقم الهاتف المصري غير صحيح. يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويتكون من 11 رقماً (أو +20 متبوعاً بـ 10 أرقام).',
    };
  }

  const local11 = `0${national10}`;
  const formatted = `+20 ${national10.slice(0, 3)} ${national10.slice(3, 6)} ${national10.slice(6)}`;
  return {
    isValid: true,
    normalized: formatted,
    local11Digits: local11,
  };
}
