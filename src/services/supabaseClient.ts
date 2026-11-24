import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface SupabaseConnectionResult {
  ok: boolean;
  configured: boolean;
  hasSession?: boolean;
  message: string;
}

let cachedSupabaseClient: SupabaseClient | null = null;
let cachedConfigSignature: string | null = null;

function readEnvString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeSupabaseUrl(value: unknown): string {
  const trimmed = readEnvString(value);
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return '';
    }
    const cleanedPath = parsed.pathname
      .replace(/\/(rest|auth|storage|functions)\/v\d+\/?$/i, '')
      .replace(/\/+$/, '');
    return `${parsed.origin}${cleanedPath}`;
  } catch {
    return '';
  }
}

function isValidHttpUrl(value: string): boolean {
  return Boolean(normalizeSupabaseUrl(value));
}

export function getSupabaseConfig(): SupabaseConfig {
  const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : undefined;
  return {
    url: normalizeSupabaseUrl(env?.VITE_SUPABASE_URL),
    anonKey: readEnvString(env?.VITE_SUPABASE_ANON_KEY),
  };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return false;
  if (!isValidHttpUrl(url)) return false;
  if (url.includes('your-project-id') || anonKey.includes('your-supabase-')) {
    return false;
  }
  return true;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { url, anonKey } = getSupabaseConfig();
  const signature = `${url}::${anonKey}`;

  if (!cachedSupabaseClient || cachedConfigSignature !== signature) {
    cachedSupabaseClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storageKey: 'meow_supabase_auth_v1',
      },
    });
    cachedConfigSignature = signature;
  }

  return cachedSupabaseClient;
}

export async function testSupabaseConnection(): Promise<SupabaseConnectionResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      configured: false,
      message: 'إعدادات Supabase غير مضبوطة بعد (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      configured: false,
      message: 'تعذر إنشاء عميل Supabase.',
    };
  }

  try {
    const { data, error } = await client.auth.getSession();
    if (error) {
      return {
        ok: false,
        configured: true,
        message: `تعذر التحقق من اتصال Supabase: ${error.message}`,
      };
    }

    return {
      ok: true,
      configured: true,
      hasSession: Boolean(data.session),
      message: 'عميل Supabase مهيأ ومتصل بنجاح.',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      configured: true,
      message: `حدث خطأ أثناء اختبار اتصال Supabase: ${message}`,
    };
  }
}
