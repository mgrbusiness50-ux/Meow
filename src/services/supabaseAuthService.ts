import type { AuthChangeEvent, AuthError, EmailOtpType, Session, User } from '@supabase/supabase-js';
import * as CapacitorCore from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient.ts';
import {
  DbProfileRow,
  DbUserPrivateDetailsRow,
  ProfileRole,
  mapDbProfileToUserProfile,
  mapUserProfileToDbUpsert,
} from './supabaseMappers.ts';
import type { UserProfile } from '../types.ts';

const { Capacitor } = CapacitorCore;

export const ANDROID_AUTH_CALLBACK_URL = 'com.meow.app://auth-callback';
export const RECOVERY_OTP_COOLDOWN_SECONDS = 90;
export const RECOVERY_OTP_COOLDOWN_MS = RECOVERY_OTP_COOLDOWN_SECONDS * 1000;

interface MeowGoogleAuthNativeResult {
  idToken: string;
  id?: string;
  displayName?: string;
  givenName?: string;
  familyName?: string;
  profilePictureUri?: string;
}

interface MeowGoogleAuthPlugin {
  signIn(options: { serverClientId: string; nonce?: string }): Promise<MeowGoogleAuthNativeResult>;
}

let cachedNativeGoogleAuthPlugin: MeowGoogleAuthPlugin | null = null;

function getNativeGoogleAuthPlugin(): MeowGoogleAuthPlugin | null {
  if (cachedNativeGoogleAuthPlugin) return cachedNativeGoogleAuthPlugin;
  const registerPluginFn = (
    CapacitorCore as unknown as {
      registerPlugin?: <T>(name: string) => T;
    }
  ).registerPlugin;
  if (typeof registerPluginFn !== 'function') {
    return null;
  }
  cachedNativeGoogleAuthPlugin = registerPluginFn<MeowGoogleAuthPlugin>('MeowGoogleAuth');
  return cachedNativeGoogleAuthPlugin;
}

function getGoogleWebClientId(): string {
  const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : undefined;
  const raw = env?.VITE_GOOGLE_WEB_CLIENT_ID;
  return typeof raw === 'string' ? raw.trim() : '';
}

async function generateGoogleNoncePair(): Promise<{ rawNonce?: string; hashedNonce?: string }> {
  try {
    const cryptoObj = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
    if (!cryptoObj?.getRandomValues) {
      return {};
    }
    const bytes = new Uint8Array(24);
    cryptoObj.getRandomValues(bytes);
    const rawNonce = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    if (!cryptoObj.subtle?.digest) {
      return { rawNonce };
    }
    const encoded = new TextEncoder().encode(rawNonce);
    const digest = await cryptoObj.subtle.digest('SHA-256', encoded);
    const hashedNonce = Array.from(new Uint8Array(digest), (b) =>
      b.toString(16).padStart(2, '0')
    ).join('');
    return { rawNonce, hashedNonce };
  } catch {
    return {};
  }
}

export interface SupabaseOAuthLaunchResult {
  success: boolean;
  launchedExternalBrowser?: boolean;
  session?: Session | null;
  user?: User | null;
  method?: 'native_google_id_token' | 'oauth_browser';
  errorMessage?: string;
  errorCode?: string;
}

export interface SupabaseAuthActionResult {
  success: boolean;
  user: User | null;
  session: Session | null;
  needsEmailConfirmation: boolean;
  message?: string;
  errorMessage?: string;
  errorCode?: string;
}

export interface SupabaseBasicResult {
  success: boolean;
  message?: string;
  errorMessage?: string;
  errorCode?: string;
}

export interface SupabaseSessionResult {
  configured: boolean;
  session: Session | null;
  user: User | null;
  isPasswordRecovery: boolean;
  errorMessage?: string;
}

export interface SupabaseUserAccountBundle {
  exists: boolean;
  profile: UserProfile | null;
  role: ProfileRole;
  onboardingDone: boolean;
  adviceDismissed: boolean;
  isDeleted: boolean;
  rawProfile: DbProfileRow | null;
  rawPrivateDetails: DbUserPrivateDetailsRow | null;
}

export interface SupabaseAccountBundleResult {
  success: boolean;
  bundle: SupabaseUserAccountBundle | null;
  errorMessage?: string;
}

export type SupabaseAuthStateChangeHandler = (payload: {
  event: AuthChangeEvent;
  session: Session | null;
  user: User | null;
  isPasswordRecovery: boolean;
}) => void;

export interface SupabaseAuthCallbackResult {
  handled: boolean;
  success: boolean;
  session: Session | null;
  user: User | null;
  isPasswordRecovery: boolean;
  message?: string;
  errorMessage?: string;
  errorCode?: string;
}

const PROFILE_SELECT_COLUMNS = [
  'id',
  'role',
  'name',
  'avatar_url',
  'gender',
  'city',
  'governorate',
  'markaz',
  'village',
  'location_id',
  'governorate_id',
  'markaz_id',
  'city_id',
  'village_id',
  'lat',
  'lng',
  'show_phone_in_profile',
  'privacy_mode',
  'show_phone_only_after_approval',
  'notifications_enabled',
  'advice_dismissed',
  'onboarding_done',
  'deleted_at',
  'created_at',
  'updated_at',
].join(', ');

const PRIVATE_DETAILS_SELECT_COLUMNS = [
  'user_id',
  'email',
  'phone',
  'created_at',
  'updated_at',
].join(', ');

let passwordRecoveryActive = detectRecoveryHintInUrl();

function detectRecoveryHintInUrl(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const searchParams = new URLSearchParams(window.location.search);
    return (
      hashParams.get('type') === 'recovery' ||
      searchParams.get('type') === 'recovery'
    );
  } catch {
    return false;
  }
}

function isNativeAndroidRuntime(): boolean {
  try {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
  } catch {
    return false;
  }
}

function getDefaultRedirectUrl(): string | undefined {
  if (isNativeAndroidRuntime()) {
    return ANDROID_AUTH_CALLBACK_URL;
  }
  if (typeof window === 'undefined') return undefined;
  return `${window.location.origin}${window.location.pathname}`;
}

function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

function isValidEmailFormat(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getAuthErrorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const authErr = error as Partial<AuthError> & { code?: unknown };
    if (typeof authErr.code === 'string' && authErr.code.trim()) {
      return authErr.code.trim();
    }
  }
  return '';
}

function mapSupabaseAuthErrorToArabic(error: unknown, fallbackMessage: string): {
  code: string;
  message: string;
} {
  const code = getAuthErrorCode(error).toLowerCase();
  const rawMessage = (
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message?: unknown }).message || '')
      : String(error || '')
  ).toLowerCase();

  if (
    code === 'invalid_credentials' ||
    rawMessage.includes('invalid login credentials')
  ) {
    return {
      code: code || 'invalid_credentials',
      message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    };
  }

  if (
    code === 'email_not_confirmed' ||
    rawMessage.includes('email not confirmed')
  ) {
    return {
      code: code || 'email_not_confirmed',
      message:
        'لم يتم تأكيد البريد الإلكتروني بعد. يرجى فتح رسالة التفعيل في بريدك ثم إعادة المحاولة.',
    };
  }

  if (
    code === 'user_already_exists' ||
    code === 'email_exists' ||
    rawMessage.includes('user already registered') ||
    rawMessage.includes('already been registered')
  ) {
    return {
      code: code || 'user_already_exists',
      message:
        'هذا البريد الإلكتروني مسجل بالفعل. يمكنك تسجيل الدخول أو استخدام استعادة كلمة المرور.',
    };
  }

  if (
    code === 'weak_password' ||
    rawMessage.includes('password should be at least') ||
    rawMessage.includes('weak password')
  ) {
    return {
      code: code || 'weak_password',
      message: 'كلمة المرور قصيرة أو ضعيفة. يجب أن تتكون من 6 أحرف على الأقل.',
    };
  }

  if (
    code === 'same_password' ||
    rawMessage.includes('new password should be different')
  ) {
    return {
      code: code || 'same_password',
      message: 'يجب اختيار كلمة مرور جديدة مختلفة عن كلمة المرور السابقة.',
    };
  }

  if (
    code === 'validation_failed' ||
    code === 'email_address_invalid' ||
    rawMessage.includes('unable to validate email') ||
    rawMessage.includes('invalid email')
  ) {
    return {
      code: code || 'invalid_email',
      message: 'صيغة البريد الإلكتروني غير صحيحة. يرجى التحقق والمحاولة مجددًا.',
    };
  }

  if (
    code === 'over_email_send_rate_limit' ||
    rawMessage.includes('email rate limit exceeded')
  ) {
    return {
      code: 'over_email_send_rate_limit',
      message:
        'تم الوصول للحد الأقصى المؤقت لإرسال رسائل التفعيل في Supabase. يرجى الانتظار قليلًا أو التسجيل عبر Google.',
    };
  }

  if (
    code === 'over_request_rate_limit' ||
    rawMessage.includes('rate limit') ||
    rawMessage.includes('too many requests') ||
    rawMessage.includes('security purposes')
  ) {
    return {
      code: code || 'over_request_rate_limit',
      message: 'تم إرسال عدة طلبات خلال وقت قصير. يرجى الانتظار قليلًا ثم المحاولة مرة أخرى.',
    };
  }

  if (
    code === 'otp_expired' ||
    code === 'flow_state_expired' ||
    code === 'token_expired' ||
    rawMessage.includes('expired') ||
    rawMessage.includes('invalid token') ||
    rawMessage.includes('token has expired')
  ) {
    return {
      code: code || 'otp_expired',
      message: 'انتهت صلاحية رمز التحقق أو الرابط. يرجى طلب رمز جديد.',
    };
  }

  if (
    code === 'session_not_found' ||
    rawMessage.includes('auth session missing') ||
    rawMessage.includes('session missing')
  ) {
    return {
      code: code || 'session_missing',
      message: 'لا توجد جلسة نشطة حاليًا. يرجى تسجيل الدخول أو فتح رابط الاستعادة من جديد.',
    };
  }

  if (code === 'signup_disabled' || rawMessage.includes('signups not allowed')) {
    return {
      code: code || 'signup_disabled',
      message: 'تسجيل الحسابات الجديدة معطّل حاليًا في إعدادات المنصة.',
    };
  }

  if (
    code === 'access_denied' ||
    code === 'user_cancelled' ||
    rawMessage.includes('access_denied') ||
    rawMessage.includes('user cancelled') ||
    rawMessage.includes('user canceled')
  ) {
    return {
      code: 'oauth_cancelled',
      message: 'تم إلغاء تسجيل الدخول عبر Google قبل إتمامه. يمكنك المحاولة مرة أخرى.',
    };
  }

  if (
    code === 'provider_disabled' ||
    rawMessage.includes('unsupported provider') ||
    rawMessage.includes('provider is not enabled')
  ) {
    return {
      code: 'provider_disabled',
      message:
        'تسجيل الدخول عبر Google غير مفعّل حاليًا في إعدادات Supabase. يرجى تفعيله من لوحة التحكم.',
    };
  }

  if (
    rawMessage.includes('redirect') &&
    (rawMessage.includes('not allowed') || rawMessage.includes('mismatch') || rawMessage.includes('invalid'))
  ) {
    return {
      code: 'redirect_url_not_allowed',
      message:
        'رابط العودة بعد تسجيل الدخول غير مضاف في قائمة Redirect URLs المسموح بها في Supabase.',
    };
  }

  if (
    code === 'otp_disabled' ||
    rawMessage.includes('invalid otp') ||
    rawMessage.includes('token not found') ||
    rawMessage.includes('otp expired')
  ) {
    return {
      code: 'otp_expired',
      message: 'رمز التحقق غير صحيح أو منتهي الصلاحية. يرجى التأكد من الأرقام أو طلب رمز جديد.',
    };
  }

  if (
    rawMessage.includes('unacceptable audience') ||
    (rawMessage.includes('id_token') && rawMessage.includes('audience'))
  ) {
    return {
      code: 'google_client_id_mismatch',
      message:
        'معرّف عميل Google (Web Client ID) غير مضاف أو غير مطابق لإعدادات مزود Google في Supabase.',
    };
  }

  if (
    rawMessage.includes('error sending recovery email') ||
    rawMessage.includes('error sending confirmation email') ||
    rawMessage.includes('smtp') ||
    rawMessage.includes('535')
  ) {
    return {
      code: code || 'email_delivery_failed',
      message:
        'تعذر إرسال رسالة البريد من خادم البريد (SMTP) في Supabase. تأكد من إعدادات Custom SMTP في لوحة Supabase.',
    };
  }

  if (
    code === 'bad_oauth_state' ||
    code === 'flow_state_not_found' ||
    rawMessage.includes('bad_oauth_state') ||
    rawMessage.includes('oauth state') ||
    rawMessage.includes('flow state not found')
  ) {
    return {
      code: code || 'bad_oauth_state',
      message: 'انتهت جلسة المصادقة مع Google أو تعذر التحقق من حالتها. يرجى الضغط على تسجيل الدخول عبر Google مرة أخرى.',
    };
  }

  if (
    code === 'pkce_code_verifier_not_found' ||
    rawMessage.includes('code verifier') ||
    rawMessage.includes('both auth code and code verifier') ||
    rawMessage.includes('invalid flow id')
  ) {
    return {
      code: 'pkce_code_verifier_not_found',
      message: 'تعذر إكمال التحقق الأمني (PKCE) بعد العودة من المتصفح. يرجى إعادة المحاولة من داخل التطبيق.',
    };
  }

  if (
    rawMessage.includes('database error saving new user') ||
    rawMessage.includes('unable to exchange external code') ||
    code === 'unexpected_failure'
  ) {
    return {
      code: code || 'oauth_server_error',
      message: 'تعذر إكمال حفظ حساب Google في قاعدة بيانات Supabase. يرجى المحاولة مرة أخرى.',
    };
  }

  if (
    rawMessage.includes('failed to fetch') ||
    rawMessage.includes('network') ||
    rawMessage.includes('fetch') ||
    rawMessage.includes('timeout') ||
    rawMessage.includes('timed out')
  ) {
    return {
      code: code || 'network_error',
      message: 'تعذر الاتصال بخادم المصادقة. تحقق من اتصال الإنترنت وحاول مجددًا.',
    };
  }

  return {
    code: code || 'auth_error',
    message: fallbackMessage,
  };
}

function getDatabaseErrorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const errObj = error as { code?: unknown; status?: unknown };
    if (typeof errObj.code === 'string' && errObj.code.trim()) {
      return errObj.code.trim();
    }
    if (typeof errObj.status === 'number') {
      return String(errObj.status);
    }
  }
  return '';
}

function mapDatabaseErrorToArabic(error: unknown, fallbackMessage: string): string {
  const code = getDatabaseErrorCode(error).toLowerCase();
  const rawMessage = (
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message?: unknown }).message || '')
      : String(error || '')
  ).toLowerCase();

  if (code || rawMessage) {
    console.warn('[Meow Supabase DB error]', { code, message: rawMessage });
  }

  if (
    code === '42501' ||
    code === '403' ||
    rawMessage.includes('row-level security') ||
    rawMessage.includes('permission denied') ||
    rawMessage.includes('insufficient privileges')
  ) {
    return 'لا تملك صلاحية لتنفيذ هذه العملية على بيانات الحساب.';
  }

  if (rawMessage.includes('chk_profiles_privacy_consistency')) {
    return 'تعارض في إعدادات خصوصية رقم الهاتف. يرجى إعادة المحاولة.';
  }

  if (code === '23503' || rawMessage.includes('foreign key constraint')) {
    return 'تعذر ربط تفاصيل الحساب لأن سجل الملف الشخصي غير مكتمل بعد. يرجى تحديث الصفحة أو إعادة تسجيل الدخول.';
  }

  if (
    rawMessage.includes('failed to fetch') ||
    rawMessage.includes('network') ||
    rawMessage.includes('timeout')
  ) {
    return 'تعذر حفظ أو جلب بيانات الحساب بسبب مشكلة في الاتصال بالإنترنت.';
  }

  return fallbackMessage;
}

function ensureConfiguredClient() {
  if (!isSupabaseConfigured()) {
    return {
      client: null,
      errorMessage: 'إعدادات Supabase غير مكتملة في المشروع حاليًا.',
    };
  }
  const client = getSupabaseClient();
  if (!client) {
    return {
      client: null,
      errorMessage: 'تعذر تهيئة الاتصال بخدمة Supabase.',
    };
  }
  return { client, errorMessage: undefined };
}

export function isSupabasePasswordRecoveryActive(): boolean {
  return passwordRecoveryActive;
}

export function clearSupabasePasswordRecoveryState(): void {
  passwordRecoveryActive = false;
}

const RECENT_AUTH_COOLDOWN_MS = 12_000;
const recentAuthRequests = new Map<string, number>();
let inFlightSignUpKey: string | null = null;
let activeBrowserFinishedHandle: PluginListenerHandle | null = null;

function isWithinAuthCooldown(actionKey: string, cooldownMs = RECENT_AUTH_COOLDOWN_MS): number {
  const lastAt = recentAuthRequests.get(actionKey);
  if (!lastAt) return 0;
  const remainingMs = cooldownMs - (Date.now() - lastAt);
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
}

function markAuthRequestAttempt(actionKey: string): void {
  recentAuthRequests.set(actionKey, Date.now());
  if (recentAuthRequests.size > 30) {
    const oldestKey = recentAuthRequests.keys().next().value;
    if (oldestKey) recentAuthRequests.delete(oldestKey);
  }
}

export async function closeExternalAuthBrowserIfOpen(): Promise<void> {
  if (activeBrowserFinishedHandle) {
    try {
      await activeBrowserFinishedHandle.remove();
    } catch {
      // ignore listener cleanup errors
    }
    activeBrowserFinishedHandle = null;
  }
  if (!isNativeAndroidRuntime()) return;
  try {
    await Browser.close();
  } catch {
    // ignore if browser already dismissed
  }
}

/**
 * 0. Sign in / sign up with Google using Supabase Auth.
 * - On Native Android (Capacitor) with VITE_GOOGLE_WEB_CLIENT_ID configured:
 *   uses Android's official Google Sign-In Credential Manager account picker
 *   and exchanges the Google ID token directly with supabase.auth.signInWithIdToken().
 * - Otherwise / fallback on Native Android: launches Chrome Custom Tabs PKCE OAuth
 *   (without fullscreen distortion) returning to com.meow.app://auth-callback.
 * - On Web: initiates standard OAuth redirect back to origin + pathname.
 */
export async function signInWithGoogleSupabaseOAuth(opts?: {
  onExternalBrowserClosed?: () => void;
}): Promise<SupabaseOAuthLaunchResult> {
  const { client, errorMessage } = ensureConfiguredClient();
  if (!client) {
    return {
      success: false,
      errorMessage,
      errorCode: 'supabase_not_configured',
    };
  }

  try {
    passwordRecoveryActive = false;

    if (isNativeAndroidRuntime()) {
      const googleWebClientId = getGoogleWebClientId();
      const nativeGoogleAuth = googleWebClientId ? getNativeGoogleAuthPlugin() : null;
      const isNativePluginAvailable =
        typeof (Capacitor as { isPluginAvailable?: (name: string) => boolean }).isPluginAvailable ===
        'function'
          ? Capacitor.isPluginAvailable('MeowGoogleAuth')
          : Boolean(nativeGoogleAuth);

      if (googleWebClientId && nativeGoogleAuth && isNativePluginAvailable) {
        try {
          const { rawNonce, hashedNonce } = await generateGoogleNoncePair();
          const nativeCredential = await nativeGoogleAuth.signIn({
            serverClientId: googleWebClientId,
            ...(hashedNonce ? { nonce: hashedNonce } : {}),
          });

          const idToken = (nativeCredential?.idToken || '').trim();
          if (!idToken) {
            return {
              success: false,
              errorCode: 'invalid_google_credential',
              errorMessage: 'لم يتم استلام رمز مصادقة صالح من Google. يرجى المحاولة مرة أخرى.',
            };
          }

          const { data, error } = await client.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
            ...(rawNonce ? { nonce: rawNonce } : {}),
          });

          if (error || !data?.session) {
            const mapped = mapSupabaseAuthErrorToArabic(
              error || new Error('google_id_token_exchange_failed'),
              'تعذر إتمام تسجيل الدخول عبر Google في Supabase. يرجى التحقق من إعدادات Google Provider.'
            );
            return {
              success: false,
              errorMessage: mapped.message,
              errorCode: mapped.code,
            };
          }

          passwordRecoveryActive = false;
          return {
            success: true,
            launchedExternalBrowser: false,
            method: 'native_google_id_token',
            session: data.session,
            user: data.user ?? data.session.user ?? null,
          };
        } catch (nativeErr) {
          const nativeCode = getAuthErrorCode(nativeErr).toLowerCase();
          const nativeMsg = (
            nativeErr instanceof Error ? nativeErr.message : String(nativeErr || '')
          ).toLowerCase();

          if (
            nativeCode === 'user_cancelled' ||
            nativeCode === 'canceled' ||
            nativeMsg.includes('cancel')
          ) {
            return {
              success: false,
              errorCode: 'oauth_cancelled',
              errorMessage: 'تم إلغاء تسجيل الدخول عبر Google قبل إتمامه. يمكنك المحاولة مرة أخرى.',
            };
          }

          const shouldFallbackToOAuthBrowser =
            nativeCode === 'credential_manager_unsupported' ||
            nativeCode === 'no_credentials' ||
            nativeCode === 'google_auth_init_failed' ||
            nativeCode === 'unimplemented' ||
            nativeMsg.includes('not implemented');

          if (!shouldFallbackToOAuthBrowser) {
            const mapped = mapSupabaseAuthErrorToArabic(
              nativeErr,
              'تعذر إتمام تسجيل الدخول عبر حساب Google. تأكد من تفعيل خدمات Google Play وحاول مرة أخرى.'
            );
            return {
              success: false,
              errorMessage: mapped.message,
              errorCode: mapped.code,
            };
          }
        }
      }

      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: ANDROID_AUTH_CALLBACK_URL,
          skipBrowserRedirect: true,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (error || !data?.url) {
        const mapped = mapSupabaseAuthErrorToArabic(
          error || new Error('google_oauth_url_missing'),
          'تعذر بدء تسجيل الدخول عبر Google. تأكد من تفعيل مزود Google في Supabase.'
        );
        return {
          success: false,
          errorMessage: mapped.message,
          errorCode: mapped.code,
        };
      }

      if (activeBrowserFinishedHandle) {
        await activeBrowserFinishedHandle.remove().catch(() => {});
        activeBrowserFinishedHandle = null;
      }

      activeBrowserFinishedHandle = await Browser.addListener('browserFinished', () => {
        const handle = activeBrowserFinishedHandle;
        activeBrowserFinishedHandle = null;
        if (handle) {
          void handle.remove().catch(() => {});
        }
        opts?.onExternalBrowserClosed?.();
      });

      try {
        await Browser.open({
          url: data.url,
          toolbarColor: '#FFF9E9',
        });
      } catch (openErr) {
        if (activeBrowserFinishedHandle) {
          await activeBrowserFinishedHandle.remove().catch(() => {});
          activeBrowserFinishedHandle = null;
        }
        throw openErr;
      }

      return {
        success: true,
        launchedExternalBrowser: true,
        method: 'oauth_browser',
      };
    }

    const redirectTo = getDefaultRedirectUrl();
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        ...(redirectTo ? { redirectTo } : {}),
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      const mapped = mapSupabaseAuthErrorToArabic(
        error,
        'تعذر فتح صفحة تسجيل الدخول عبر Google.'
      );
      return {
        success: false,
        errorMessage: mapped.message,
        errorCode: mapped.code,
      };
    }

    return {
      success: true,
      launchedExternalBrowser: false,
      method: 'oauth_browser',
    };
  } catch (err) {
    const mapped = mapSupabaseAuthErrorToArabic(
      err,
      'تعذر إتمام تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.'
    );
    return {
      success: false,
      errorMessage: mapped.message,
      errorCode: mapped.code,
    };
  }
}

/**
 * 1. Sign up with email & password.
 * Safely handles both email confirmation disabled (session !== null -> immediate onboarding)
 * and enabled (session === null -> confirmation notice).
 */
export async function signUpWithEmailPassword(params: {
  email: string;
  password: string;
  fullName?: string;
  emailRedirectTo?: string;
}): Promise<SupabaseAuthActionResult> {
  const { client, errorMessage } = ensureConfiguredClient();
  if (!client) {
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage,
      errorCode: 'supabase_not_configured',
    };
  }

  const email = normalizeEmail(params.email);
  const password = params.password || '';
  const fullName = (params.fullName || '').trim();

  if (!email || !isValidEmailFormat(email)) {
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage: 'يرجى إدخال بريد إلكتروني صحيح.',
      errorCode: 'invalid_email',
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage: 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.',
      errorCode: 'weak_password',
    };
  }

  const requestKey = `signup:${email}`;
  if (inFlightSignUpKey === requestKey) {
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage: 'طلب إنشاء الحساب قيد التنفيذ بالفعل...',
      errorCode: 'request_in_flight',
    };
  }

  const remainingSec = isWithinAuthCooldown(requestKey, 8_000);
  if (remainingSec > 0) {
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage: `يرجى الانتظار ${remainingSec} ثوانٍ قبل إعادة إرسال نفس الطلب لتجنب الحد المؤقت.`,
      errorCode: 'client_cooldown',
    };
  }

  inFlightSignUpKey = requestKey;
  passwordRecoveryActive = false;
  try {
    const redirectTo = params.emailRedirectTo || getDefaultRedirectUrl();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
        ...(fullName ? { data: { full_name: fullName, name: fullName } } : {}),
      },
    });

    if (error) {
      const mapped = mapSupabaseAuthErrorToArabic(
        error,
        'تعذر إنشاء الحساب حاليًا. يرجى المحاولة مرة أخرى.'
      );
      if (
        mapped.code === 'over_email_send_rate_limit' ||
        mapped.code === 'over_request_rate_limit'
      ) {
        markAuthRequestAttempt(requestKey);
      }
      return {
        success: false,
        user: null,
        session: null,
        needsEmailConfirmation: false,
        errorMessage: mapped.message,
        errorCode: mapped.code,
      };
    }

    // When email confirmation is enabled and email already exists, Supabase may return empty identities
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return {
        success: false,
        user: null,
        session: null,
        needsEmailConfirmation: false,
        errorMessage:
          'هذا البريد الإلكتروني مسجل بالفعل. يمكنك تسجيل الدخول أو استعادة كلمة المرور.',
        errorCode: 'user_already_exists',
      };
    }

    markAuthRequestAttempt(requestKey);
    const session = data.session ?? null;
    if (session) {
      passwordRecoveryActive = false;
    }
    const user = data.user ?? session?.user ?? null;
    const needsEmailConfirmation = Boolean(user && !session);

    return {
      success: true,
      user,
      session,
      needsEmailConfirmation,
      message: needsEmailConfirmation
        ? 'تم إنشاء الحساب بنجاح! يرجى فتح رسالة التفعيل المرسلة إلى بريدك الإلكتروني قبل تسجيل الدخول.'
        : 'تم إنشاء الحساب وتفعيله بنجاح.',
    };
  } catch (err) {
    const mapped = mapSupabaseAuthErrorToArabic(
      err,
      'حدث خطأ غير متوقع أثناء إنشاء الحساب. يرجى المحاولة مجددًا.'
    );
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage: mapped.message,
      errorCode: mapped.code,
    };
  } finally {
    if (inFlightSignUpKey === requestKey) {
      inFlightSignUpKey = null;
    }
  }
}

/**
 * Resends email confirmation link if Confirm Email is enabled in Supabase.
 */
export async function resendSignUpConfirmationEmail(
  emailInput: string,
  emailRedirectTo?: string
): Promise<SupabaseBasicResult> {
  const { client, errorMessage } = ensureConfiguredClient();
  if (!client) {
    return { success: false, errorMessage, errorCode: 'supabase_not_configured' };
  }

  const email = normalizeEmail(emailInput);
  if (!email || !isValidEmailFormat(email)) {
    return {
      success: false,
      errorMessage: 'يرجى إدخال بريد إلكتروني صحيح لإعادة إرسال رابط التفعيل.',
      errorCode: 'invalid_email',
    };
  }

  const requestKey = `resend:${email}`;
  const remainingSec = isWithinAuthCooldown(requestKey, 45_000);
  if (remainingSec > 0) {
    return {
      success: false,
      errorMessage: `تم إرسال رسالة التفعيل مؤخرًا. يرجى الانتظار ${remainingSec} ثانية قبل إعادة المحاولة.`,
      errorCode: 'client_cooldown',
    };
  }

  try {
    const redirectTo = emailRedirectTo || getDefaultRedirectUrl();
    const { error } = await client.auth.resend({
      type: 'signup',
      email,
      ...(redirectTo ? { options: { emailRedirectTo: redirectTo } } : {}),
    });

    if (error) {
      const mapped = mapSupabaseAuthErrorToArabic(
        error,
        'تعذر إعادة إرسال رابط التفعيل حاليًا. يرجى المحاولة لاحقًا.'
      );
      if (
        mapped.code === 'over_email_send_rate_limit' ||
        mapped.code === 'over_request_rate_limit'
      ) {
        markAuthRequestAttempt(requestKey);
      }
      return { success: false, errorMessage: mapped.message, errorCode: mapped.code };
    }

    markAuthRequestAttempt(requestKey);
    return {
      success: true,
      message: 'تم إرسال رابط التفعيل إلى بريدك الإلكتروني بنجاح.',
    };
  } catch (err) {
    const mapped = mapSupabaseAuthErrorToArabic(
      err,
      'حدث خطأ أثناء إعادة إرسال رابط التفعيل.'
    );
    return { success: false, errorMessage: mapped.message, errorCode: mapped.code };
  }
}

/**
 * 2. Sign in with email & password.
 */
export async function signInWithEmailPassword(params: {
  email: string;
  password: string;
}): Promise<SupabaseAuthActionResult> {
  const { client, errorMessage } = ensureConfiguredClient();
  if (!client) {
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage,
      errorCode: 'supabase_not_configured',
    };
  }

  const email = normalizeEmail(params.email);
  const password = params.password || '';

  if (!email || !isValidEmailFormat(email)) {
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage: 'يرجى إدخال بريد إلكتروني صحيح.',
      errorCode: 'invalid_email',
    };
  }

  if (!password) {
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage: 'يرجى إدخال كلمة المرور.',
      errorCode: 'missing_password',
    };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const mapped = mapSupabaseAuthErrorToArabic(
        error,
        'تعذر تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مجددًا.'
      );
      return {
        success: false,
        user: null,
        session: null,
        needsEmailConfirmation: mapped.code === 'email_not_confirmed',
        errorMessage: mapped.message,
        errorCode: mapped.code,
      };
    }

    passwordRecoveryActive = false;

    return {
      success: true,
      user: data.user ?? data.session?.user ?? null,
      session: data.session ?? null,
      needsEmailConfirmation: false,
      message: 'تم تسجيل الدخول بنجاح.',
    };
  } catch (err) {
    const mapped = mapSupabaseAuthErrorToArabic(
      err,
      'حدث خطأ غير متوقع أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.'
    );
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage: mapped.message,
      errorCode: mapped.code,
    };
  }
}

/**
 * 3. Send password recovery email (triggers Supabase Reset Password template).
 * When Supabase Reset Password template contains {{ .Token }}, users receive a 6-digit OTP
 * that can be verified directly inside the app via verifyPasswordRecoveryOtp().
 */
export async function sendPasswordRecoveryEmail(
  emailInput: string,
  redirectToInput?: string
): Promise<SupabaseBasicResult> {
  const { client, errorMessage } = ensureConfiguredClient();
  if (!client) {
    return { success: false, errorMessage, errorCode: 'supabase_not_configured' };
  }

  const email = normalizeEmail(emailInput);
  if (!email || !isValidEmailFormat(email)) {
    return {
      success: false,
      errorMessage: 'يرجى إدخال البريد الإلكتروني الصحيح لإرسال رمز الاستعادة.',
      errorCode: 'invalid_email',
    };
  }

  const requestKey = `recovery:${email}`;
  const remainingSec = isWithinAuthCooldown(requestKey, RECOVERY_OTP_COOLDOWN_MS);
  if (remainingSec > 0) {
    return {
      success: false,
      errorMessage: `تم إرسال رمز التحقق مؤخرًا. يرجى الانتظار ${remainingSec} ثانية قبل إعادة الإرسال.`,
      errorCode: 'client_cooldown',
    };
  }

  try {
    const redirectTo = redirectToInput || getDefaultRedirectUrl();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      ...(redirectTo ? { redirectTo } : {}),
    });

    if (error) {
      const mapped = mapSupabaseAuthErrorToArabic(
        error,
        'تعذر إرسال رمز استعادة كلمة المرور. يرجى المحاولة لاحقًا.'
      );
      if (
        mapped.code === 'over_email_send_rate_limit' ||
        mapped.code === 'over_request_rate_limit'
      ) {
        markAuthRequestAttempt(requestKey);
      }
      return {
        success: false,
        errorMessage: mapped.message,
        errorCode: mapped.code,
      };
    }

    markAuthRequestAttempt(requestKey);
    return {
      success: true,
      message:
        'إذا كان البريد الإلكتروني مسجلًا لدينا، فقد تم إرسال رمز تحقق مكون من 6 أرقام إليه.',
    };
  } catch (err) {
    const mapped = mapSupabaseAuthErrorToArabic(
      err,
      'حدث خطأ أثناء طلب رمز استعادة كلمة المرور.'
    );
    return {
      success: false,
      errorMessage: mapped.message,
      errorCode: mapped.code,
    };
  }
}

export async function sendPasswordRecoveryOtp(
  emailInput: string,
  redirectToInput?: string
): Promise<SupabaseBasicResult> {
  return sendPasswordRecoveryEmail(emailInput, redirectToInput);
}

/**
 * 3b. Verify 6-digit recovery OTP inside the app without leaving to a browser link.
 */
export async function verifyPasswordRecoveryOtp(params: {
  email: string;
  token: string;
}): Promise<SupabaseAuthActionResult> {
  const { client, errorMessage } = ensureConfiguredClient();
  if (!client) {
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage,
      errorCode: 'supabase_not_configured',
    };
  }

  const email = normalizeEmail(params.email);
  const cleanedToken = (params.token || '').replace(/\D/g, '').trim();

  if (!email || !isValidEmailFormat(email)) {
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage: 'يرجى إدخال البريد الإلكتروني الصحيح أولًا.',
      errorCode: 'invalid_email',
    };
  }

  if (!/^\d{6}$/.test(cleanedToken)) {
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage: 'يرجى إدخال رمز التحقق المكون من 6 أرقام فقط.',
      errorCode: 'invalid_otp_format',
    };
  }

  try {
    const { data, error } = await client.auth.verifyOtp({
      email,
      token: cleanedToken,
      type: 'recovery',
    });

    if (error || !data.session) {
      const mapped = mapSupabaseAuthErrorToArabic(
        error,
        'رمز التحقق غير صحيح أو منتهي الصلاحية. يرجى التأكد من الأرقام أو طلب رمز جديد.'
      );
      return {
        success: false,
        user: null,
        session: null,
        needsEmailConfirmation: false,
        errorMessage: mapped.message,
        errorCode: mapped.code,
      };
    }

    passwordRecoveryActive = true;
    return {
      success: true,
      user: data.user ?? data.session.user ?? null,
      session: data.session,
      needsEmailConfirmation: false,
      message: 'تم التحقق من الرمز بنجاح. يمكنك الآن تعيين كلمة المرور الجديدة.',
    };
  } catch (err) {
    const mapped = mapSupabaseAuthErrorToArabic(
      err,
      'تعذر التحقق من رمز الاستعادة. يرجى المحاولة مرة أخرى.'
    );
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage: mapped.message,
      errorCode: mapped.code,
    };
  }
}

/**
 * 4. Handle return from password recovery link & update password.
 * Works after Supabase processes PKCE ?code=... or hash tokens and emits PASSWORD_RECOVERY.
 */
export async function updateSupabasePassword(
  newPassword: string
): Promise<SupabaseAuthActionResult> {
  const { client, errorMessage } = ensureConfiguredClient();
  if (!client) {
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage,
      errorCode: 'supabase_not_configured',
    };
  }

  if (!newPassword || newPassword.length < 6) {
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage: 'كلمة المرور الجديدة يجب أن تتكون من 6 أحرف على الأقل.',
      errorCode: 'weak_password',
    };
  }

  try {
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError || !sessionData.session) {
      return {
        success: false,
        user: null,
        session: null,
        needsEmailConfirmation: false,
        errorMessage:
          'انتهت صلاحية رابط استعادة كلمة المرور أو لا توجد جلسة تحقق صالحة. يرجى طلب رابط جديد.',
        errorCode: 'session_missing',
      };
    }

    const { data, error } = await client.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      const mapped = mapSupabaseAuthErrorToArabic(
        error,
        'تعذر تحديث كلمة المرور حاليًا. يرجى المحاولة مجددًا.'
      );
      return {
        success: false,
        user: null,
        session: sessionData.session,
        needsEmailConfirmation: false,
        errorMessage: mapped.message,
        errorCode: mapped.code,
      };
    }

    passwordRecoveryActive = false;

    const { data: refreshed } = await client.auth.getSession();
    return {
      success: true,
      user: data.user ?? refreshed.session?.user ?? null,
      session: refreshed.session ?? sessionData.session,
      needsEmailConfirmation: false,
      message: 'تم تحديث كلمة المرور بنجاح.',
    };
  } catch (err) {
    const mapped = mapSupabaseAuthErrorToArabic(
      err,
      'حدث خطأ غير متوقع أثناء تحديث كلمة المرور.'
    );
    return {
      success: false,
      user: null,
      session: null,
      needsEmailConfirmation: false,
      errorMessage: mapped.message,
      errorCode: mapped.code,
    };
  }
}

/**
 * 5. Sign out from Supabase Auth.
 */
export async function signOutFromSupabase(): Promise<SupabaseBasicResult> {
  const { client, errorMessage } = ensureConfiguredClient();
  if (!client) {
    return { success: false, errorMessage, errorCode: 'supabase_not_configured' };
  }

  try {
    const { error } = await client.auth.signOut();
    if (error) {
      // Fallback to local sign-out if network/global revoke fails so the client session is still cleared
      const localResult = await client.auth.signOut({ scope: 'local' });
      if (localResult.error) {
        const mapped = mapSupabaseAuthErrorToArabic(
          error,
          'تعذر تسجيل الخروج بشكل كامل. يرجى المحاولة مرة أخرى.'
        );
        return {
          success: false,
          errorMessage: mapped.message,
          errorCode: mapped.code,
        };
      }
    }

    passwordRecoveryActive = false;
    return {
      success: true,
      message: 'تم تسجيل الخروج بنجاح.',
    };
  } catch (err) {
    const mapped = mapSupabaseAuthErrorToArabic(
      err,
      'حدث خطأ أثناء تسجيل الخروج.'
    );
    return {
      success: false,
      errorMessage: mapped.message,
      errorCode: mapped.code,
    };
  }
}

/**
 * 6. Fetch current active session from Supabase Auth.
 */
export async function getCurrentSupabaseSession(): Promise<SupabaseSessionResult> {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      session: null,
      user: null,
      isPasswordRecovery: false,
      errorMessage: 'إعدادات Supabase غير مكتملة.',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      configured: false,
      session: null,
      user: null,
      isPasswordRecovery: false,
      errorMessage: 'تعذر إنشاء عميل Supabase.',
    };
  }

  try {
    const { data, error } = await client.auth.getSession();
    if (error) {
      const mapped = mapSupabaseAuthErrorToArabic(
        error,
        'تعذر التحقق من جلسة المستخدم الحالية.'
      );
      return {
        configured: true,
        session: null,
        user: null,
        isPasswordRecovery: passwordRecoveryActive,
        errorMessage: mapped.message,
      };
    }

    const session = data.session ?? null;
    if (!session) {
      passwordRecoveryActive = false;
    }

    return {
      configured: true,
      session,
      user: session?.user ?? null,
      isPasswordRecovery: Boolean(session && passwordRecoveryActive),
    };
  } catch (err) {
    const mapped = mapSupabaseAuthErrorToArabic(
      err,
      'حدث خطأ أثناء استرجاع الجلسة الحالية.'
    );
    return {
      configured: true,
      session: null,
      user: null,
      isPasswordRecovery: false,
      errorMessage: mapped.message,
    };
  }
}

/**
 * 7. Subscribe to Supabase Auth state changes (including PASSWORD_RECOVERY).
 */
export function subscribeToSupabaseAuthChanges(
  handler: SupabaseAuthStateChangeHandler
): () => void {
  if (!isSupabaseConfigured()) {
    return () => {};
  }

  const client = getSupabaseClient();
  if (!client) {
    return () => {};
  }

  const { data } = client.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      passwordRecoveryActive = true;
    } else if (event === 'SIGNED_OUT') {
      passwordRecoveryActive = false;
    }

    handler({
      event,
      session: session ?? null,
      user: session?.user ?? null,
      isPasswordRecovery:
        event === 'PASSWORD_RECOVERY' || Boolean(session && passwordRecoveryActive),
    });
  });

  return () => {
    data.subscription.unsubscribe();
  };
}

/**
 * 8. Load current user account bundle from public.profiles and public.user_private_details.
 * Respects RLS (auth.uid() = id / user_id) and maps via supabaseMappers.ts.
 */
export async function fetchSupabaseUserAccountBundle(
  targetUserId?: string
): Promise<SupabaseAccountBundleResult> {
  const { client, errorMessage } = ensureConfiguredClient();
  if (!client) {
    return { success: false, bundle: null, errorMessage };
  }

  try {
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    const sessionUser = sessionData?.session?.user ?? null;
    if (sessionError || !sessionUser) {
      return {
        success: false,
        bundle: null,
        errorMessage: 'يجب تسجيل الدخول أولًا لجلب بيانات الحساب.',
      };
    }

    const userId = targetUserId && targetUserId === sessionUser.id ? targetUserId : sessionUser.id;
    if (targetUserId && targetUserId !== sessionUser.id) {
      return {
        success: false,
        bundle: null,
        errorMessage: 'غير مسموح بقراءة التفاصيل الخاصة لحساب آخر.',
      };
    }

    const [profileRes, privateRes] = await Promise.all([
      client
        .from('profiles')
        .select(PROFILE_SELECT_COLUMNS)
        .eq('id', userId)
        .maybeSingle(),
      client
        .from('user_private_details')
        .select(PRIVATE_DETAILS_SELECT_COLUMNS)
        .eq('user_id', userId)
        .maybeSingle(),
    ]);

    if (profileRes.error) {
      return {
        success: false,
        bundle: null,
        errorMessage: mapDatabaseErrorToArabic(
          profileRes.error,
          'تعذر تحميل بيانات الملف الشخصي من قاعدة البيانات.'
        ),
      };
    }

    if (privateRes.error) {
      return {
        success: false,
        bundle: null,
        errorMessage: mapDatabaseErrorToArabic(
          privateRes.error,
          'تعذر تحميل بيانات التواصل الخاصة بالحساب.'
        ),
      };
    }

    const rawProfile = (profileRes.data as unknown as DbProfileRow | null) ?? null;
    const rawPrivateDetails =
      (privateRes.data as unknown as DbUserPrivateDetailsRow | null) ?? null;

    if (!rawProfile) {
      return {
        success: true,
        bundle: {
          exists: false,
          profile: null,
          role: 'user',
          onboardingDone: false,
          adviceDismissed: false,
          isDeleted: false,
          rawProfile: null,
          rawPrivateDetails,
        },
      };
    }

    const mapped = mapDbProfileToUserProfile(rawProfile, rawPrivateDetails);
    if (!mapped.email && sessionUser.email) {
      mapped.email = sessionUser.email;
    }

    return {
      success: true,
      bundle: {
        exists: true,
        profile: mapped,
        role: rawProfile.role,
        onboardingDone: Boolean(rawProfile.onboarding_done),
        adviceDismissed: Boolean(rawProfile.advice_dismissed),
        isDeleted: Boolean(rawProfile.deleted_at),
        rawProfile,
        rawPrivateDetails,
      },
    };
  } catch (err) {
    return {
      success: false,
      bundle: null,
      errorMessage: mapDatabaseErrorToArabic(
        err,
        'حدث خطأ غير متوقع أثناء جلب بيانات الحساب.'
      ),
    };
  }
}

/**
 * 9. Save / update current user's account in public.profiles and public.user_private_details
 * using mapUserProfileToDbUpsert from supabaseMappers.ts and respecting RLS & revoked columns.
 */
export async function saveSupabaseUserAccountBundle(
  userProfile: UserProfile,
  extra?: { adviceDismissed?: boolean; onboardingDone?: boolean }
): Promise<SupabaseAccountBundleResult> {
  const { client, errorMessage } = ensureConfiguredClient();
  if (!client) {
    return { success: false, bundle: null, errorMessage };
  }

  try {
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    const sessionUser = sessionData?.session?.user ?? null;
    if (sessionError || !sessionUser) {
      return {
        success: false,
        bundle: null,
        errorMessage: 'يجب تسجيل الدخول أولًا لحفظ بيانات الحساب.',
      };
    }

    const normalizedUser: UserProfile = {
      ...userProfile,
      id: sessionUser.id,
      email: (userProfile.email || sessionUser.email || '').trim(),
    };

    const { profile: profilePayload, privateDetails: privatePayload } =
      mapUserProfileToDbUpsert(normalizedUser, extra);

    const { id: _profileId, ...profileUpdateFields } = profilePayload;
    const { user_id: _privateUserId, ...privateUpdateFields } = privatePayload;

    let profileRes = await client
      .from('profiles')
      .update(profileUpdateFields)
      .eq('id', sessionUser.id)
      .select(PROFILE_SELECT_COLUMNS)
      .maybeSingle();

    if (!profileRes.error && !profileRes.data) {
      profileRes = await client
        .from('profiles')
        .insert(profilePayload)
        .select(PROFILE_SELECT_COLUMNS)
        .single();

      if (profileRes.error && getDatabaseErrorCode(profileRes.error) === '23505') {
        profileRes = await client
          .from('profiles')
          .update(profileUpdateFields)
          .eq('id', sessionUser.id)
          .select(PROFILE_SELECT_COLUMNS)
          .maybeSingle();
      }
    }

    if (profileRes.error || !profileRes.data) {
      return {
        success: false,
        bundle: null,
        errorMessage: mapDatabaseErrorToArabic(
          profileRes.error || new Error('profile_save_empty'),
          'تعذر حفظ بيانات الملف الشخصي. يرجى التحقق والمحاولة مرة أخرى.'
        ),
      };
    }

    let privateRes = await client
      .from('user_private_details')
      .update(privateUpdateFields)
      .eq('user_id', sessionUser.id)
      .select(PRIVATE_DETAILS_SELECT_COLUMNS)
      .maybeSingle();

    if (!privateRes.error && !privateRes.data) {
      privateRes = await client
        .from('user_private_details')
        .insert(privatePayload)
        .select(PRIVATE_DETAILS_SELECT_COLUMNS)
        .single();

      if (privateRes.error && getDatabaseErrorCode(privateRes.error) === '23505') {
        privateRes = await client
          .from('user_private_details')
          .update(privateUpdateFields)
          .eq('user_id', sessionUser.id)
          .select(PRIVATE_DETAILS_SELECT_COLUMNS)
          .maybeSingle();
      }
    }

    if (privateRes.error || !privateRes.data) {
      return {
        success: false,
        bundle: null,
        errorMessage: mapDatabaseErrorToArabic(
          privateRes.error || new Error('private_details_save_empty'),
          'تعذر حفظ بيانات التواصل الخاصة بالحساب.'
        ),
      };
    }

    const rawProfile = profileRes.data as unknown as DbProfileRow;
    const rawPrivateDetails = privateRes.data as unknown as DbUserPrivateDetailsRow;
    const mapped = mapDbProfileToUserProfile(rawProfile, rawPrivateDetails);
    if (!mapped.email && sessionUser.email) {
      mapped.email = sessionUser.email;
    }

    return {
      success: true,
      bundle: {
        exists: true,
        profile: mapped,
        role: rawProfile.role,
        onboardingDone: Boolean(rawProfile.onboarding_done),
        adviceDismissed: Boolean(rawProfile.advice_dismissed),
        isDeleted: Boolean(rawProfile.deleted_at),
        rawProfile,
        rawPrivateDetails,
      },
    };
  } catch (err) {
    return {
      success: false,
      bundle: null,
      errorMessage: mapDatabaseErrorToArabic(
        err,
        'حدث خطأ غير متوقع أثناء حفظ بيانات الحساب.'
      ),
    };
  }
}

/**
 * Lightweight partial update for profile preferences (privacy toggle, notifications, onboarding, advice)
 * without overwriting owner identity/geo fields or touching privileged columns (role, deleted_at).
 */
export async function updateSupabaseAccountPreferences(prefs: {
  showPhoneInProfile?: boolean;
  notificationsEnabled?: boolean;
  adviceDismissed?: boolean;
  onboardingDone?: boolean;
}): Promise<SupabaseAccountBundleResult> {
  const { client, errorMessage } = ensureConfiguredClient();
  if (!client) {
    return { success: false, bundle: null, errorMessage };
  }

  try {
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    const sessionUser = sessionData?.session?.user ?? null;
    if (sessionError || !sessionUser) {
      return {
        success: false,
        bundle: null,
        errorMessage: 'يجب تسجيل الدخول أولًا لتحديث إعدادات الحساب.',
      };
    }

    const updatePayload: Record<string, unknown> = {};
    if (typeof prefs.showPhoneInProfile === 'boolean') {
      const showPhone = prefs.showPhoneInProfile;
      updatePayload.show_phone_in_profile = showPhone;
      updatePayload.privacy_mode = showPhone ? 'public' : 'private';
      updatePayload.show_phone_only_after_approval = showPhone;
    }
    if (typeof prefs.notificationsEnabled === 'boolean') {
      updatePayload.notifications_enabled = prefs.notificationsEnabled;
    }
    if (typeof prefs.adviceDismissed === 'boolean') {
      updatePayload.advice_dismissed = prefs.adviceDismissed;
    }
    if (typeof prefs.onboardingDone === 'boolean') {
      updatePayload.onboarding_done = prefs.onboardingDone;
    }

    if (Object.keys(updatePayload).length === 0) {
      return fetchSupabaseUserAccountBundle(sessionUser.id);
    }

    const { error } = await client
      .from('profiles')
      .update(updatePayload)
      .eq('id', sessionUser.id);

    if (error) {
      return {
        success: false,
        bundle: null,
        errorMessage: mapDatabaseErrorToArabic(
          error,
          'تعذر تحديث إعدادات الحساب حاليًا.'
        ),
      };
    }

    return fetchSupabaseUserAccountBundle(sessionUser.id);
  } catch (err) {
    return {
      success: false,
      bundle: null,
      errorMessage: mapDatabaseErrorToArabic(
        err,
        'حدث خطأ غير متوقع أثناء تحديث إعدادات الحساب.'
      ),
    };
  }
}

const inFlightAuthCallbacks = new Map<string, Promise<SupabaseAuthCallbackResult>>();
const completedAuthCallbacks = new Map<string, SupabaseAuthCallbackResult>();

function cacheCompletedAuthCallback(key: string, result: SupabaseAuthCallbackResult): void {
  if (completedAuthCallbacks.size >= 25) {
    const oldestKey = completedAuthCallbacks.keys().next().value;
    if (oldestKey) {
      completedAuthCallbacks.delete(oldestKey);
    }
  }
  completedAuthCallbacks.set(key, result);
}

function parseCallbackUrlSafely(rawUrl: string): URL | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  try {
    return new URL(rawUrl.trim());
  } catch {
    return null;
  }
}

function isCustomAndroidAuthCallbackUrl(parsed: URL): boolean {
  return (
    parsed.protocol.toLowerCase() === 'com.meow.app:' &&
    parsed.host.toLowerCase() === 'auth-callback'
  );
}

function hasSupabaseAuthCallbackParams(parsed: URL): boolean {
  const search = parsed.searchParams;
  const hash = new URLSearchParams(parsed.hash.replace(/^#/, ''));
  const keys = [
    'code',
    'token_hash',
    'access_token',
    'refresh_token',
    'error',
    'error_code',
    'error_description',
  ];
  return keys.some((key) => Boolean(search.get(key) || hash.get(key)));
}

export function isSupabaseAuthCallbackUrl(rawUrl: string): boolean {
  const parsed = parseCallbackUrlSafely(rawUrl);
  if (!parsed) return false;
  if (isCustomAndroidAuthCallbackUrl(parsed)) return true;
  if (typeof window !== 'undefined' && parsed.origin === window.location.origin) {
    return hasSupabaseAuthCallbackParams(parsed);
  }
  return false;
}

function buildAuthCallbackDedupeKey(parsed: URL): string {
  const search = parsed.searchParams;
  const hash = new URLSearchParams(parsed.hash.replace(/^#/, ''));
  const code = search.get('code')?.trim();
  if (code) return `code:${code}`;
  const tokenHash = search.get('token_hash')?.trim() || hash.get('token_hash')?.trim();
  if (tokenHash) return `token_hash:${tokenHash}`;
  const accessToken = hash.get('access_token')?.trim() || search.get('access_token')?.trim();
  if (accessToken) return `access_token:${accessToken.slice(0, 32)}`;
  const errCode = search.get('error_code') || hash.get('error_code') || search.get('error') || hash.get('error');
  if (errCode) return `error:${errCode}:${parsed.search}${parsed.hash}`;
  return `url:${parsed.protocol}//${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
}

async function processSupabaseAuthCallbackUrl(
  parsed: URL
): Promise<SupabaseAuthCallbackResult> {
  const searchParams = parsed.searchParams;
  const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ''));
  const typeParam = (searchParams.get('type') || hashParams.get('type') || '')
    .trim()
    .toLowerCase();
  const isRecoveryHint = typeParam === 'recovery';

  const urlError =
    searchParams.get('error_description') ||
    hashParams.get('error_description') ||
    searchParams.get('error') ||
    hashParams.get('error');
  const urlErrorCode =
    searchParams.get('error_code') ||
    hashParams.get('error_code') ||
    searchParams.get('error') ||
    hashParams.get('error');

  if (urlError || urlErrorCode) {
    const mapped = mapSupabaseAuthErrorToArabic(
      { code: urlErrorCode || undefined, message: urlError || '' },
      'انتهت صلاحية الرابط أو تعذر التحقق منه. يرجى طلب رابط جديد.'
    );
    return {
      handled: true,
      success: false,
      session: null,
      user: null,
      isPasswordRecovery: isRecoveryHint,
      errorMessage: mapped.message,
      errorCode: mapped.code,
    };
  }

  const { client, errorMessage } = ensureConfiguredClient();
  if (!client) {
    return {
      handled: true,
      success: false,
      session: null,
      user: null,
      isPasswordRecovery: isRecoveryHint,
      errorMessage,
      errorCode: 'supabase_not_configured',
    };
  }

  try {
    const code = searchParams.get('code')?.trim() || hashParams.get('code')?.trim();
    const flowId =
      (
        searchParams.get('sb_flow_id') ||
        hashParams.get('sb_flow_id') ||
        searchParams.get('flow_id') ||
        hashParams.get('flow_id') ||
        ''
      ).trim() || undefined;

    if (code) {
      const { data, error } = await client.auth.exchangeCodeForSession(
        code,
        flowId ? { flowId } : undefined
      );

      if (error || !data?.session) {
        if (!isRecoveryHint) {
          try {
            const existingSessionRes = await client.auth.getSession();
            const existingSession = existingSessionRes?.data?.session ?? null;
            if (existingSession) {
              passwordRecoveryActive = false;
              return {
                handled: true,
                success: true,
                session: existingSession,
                user: existingSession.user ?? null,
                isPasswordRecovery: false,
                message: 'تم تسجيل الدخول وتفعيل الجلسة بنجاح.',
              };
            }
          } catch {
            // Fall through to mapped exchangeCodeForSession error
          }
        }

        const mapped = mapSupabaseAuthErrorToArabic(
          error || new Error('auth_code_exchange_failed'),
          'انتهت صلاحية رابط التحقق أو تعذر استعادة الجلسة. يرجى طلب رابط جديد.'
        );
        return {
          handled: true,
          success: false,
          session: null,
          user: null,
          isPasswordRecovery: isRecoveryHint,
          errorMessage: mapped.message,
          errorCode: mapped.code,
        };
      }

      const redirectType = (
        (data as { redirectType?: string | null } | null)?.redirectType || ''
      )
        .trim()
        .toLowerCase();
      const isRecovery =
        redirectType === 'recovery' || isRecoveryHint || passwordRecoveryActive;
      passwordRecoveryActive = isRecovery;

      return {
        handled: true,
        success: true,
        session: data.session,
        user: data.user ?? data.session.user ?? null,
        isPasswordRecovery: isRecovery,
        message: isRecovery
          ? 'تم التحقق من رابط استعادة كلمة المرور.'
          : 'تم تأكيد البريد الإلكتروني وتفعيل الجلسة بنجاح.',
      };
    }

    const accessToken =
      hashParams.get('access_token')?.trim() || searchParams.get('access_token')?.trim();
    const refreshToken =
      hashParams.get('refresh_token')?.trim() || searchParams.get('refresh_token')?.trim();

    if (accessToken && refreshToken) {
      const { data, error } = await client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error || !data?.session) {
        const mapped = mapSupabaseAuthErrorToArabic(
          error || new Error('set_session_failed'),
          'تعذر استعادة جلسة الحساب من الرابط. يرجى المحاولة مجددًا.'
        );
        return {
          handled: true,
          success: false,
          session: null,
          user: null,
          isPasswordRecovery: isRecoveryHint,
          errorMessage: mapped.message,
          errorCode: mapped.code,
        };
      }

      const isRecovery = isRecoveryHint || passwordRecoveryActive;
      passwordRecoveryActive = isRecovery;

      return {
        handled: true,
        success: true,
        session: data.session,
        user: data.user ?? data.session.user ?? null,
        isPasswordRecovery: isRecovery,
        message: isRecovery
          ? 'تم التحقق من رابط استعادة كلمة المرور.'
          : 'تم تأكيد الحساب وتسجيل الدخول بنجاح.',
      };
    }

    const tokenHash =
      searchParams.get('token_hash')?.trim() || hashParams.get('token_hash')?.trim();
    if (tokenHash && typeParam) {
      const { data, error } = await client.auth.verifyOtp({
        token_hash: tokenHash,
        type: typeParam as EmailOtpType,
      });

      if (error || !data?.session) {
        const mapped = mapSupabaseAuthErrorToArabic(
          error || new Error('verify_otp_failed'),
          'انتهت صلاحية رابط التحقق. يرجى طلب رابط جديد.'
        );
        return {
          handled: true,
          success: false,
          session: null,
          user: null,
          isPasswordRecovery: isRecoveryHint,
          errorMessage: mapped.message,
          errorCode: mapped.code,
        };
      }

      const isRecovery = isRecoveryHint || passwordRecoveryActive;
      passwordRecoveryActive = isRecovery;

      return {
        handled: true,
        success: true,
        session: data.session,
        user: data.user ?? data.session.user ?? null,
        isPasswordRecovery: isRecovery,
        message: isRecovery
          ? 'تم التحقق من رابط استعادة كلمة المرور.'
          : 'تم تأكيد البريد الإلكتروني بنجاح.',
      };
    }

    const { data: currentData } = await client.auth.getSession();
    if (currentData?.session) {
      return {
        handled: true,
        success: true,
        session: currentData.session,
        user: currentData.session.user ?? null,
        isPasswordRecovery: isRecoveryHint || passwordRecoveryActive,
      };
    }

    return {
      handled: true,
      success: false,
      session: null,
      user: null,
      isPasswordRecovery: isRecoveryHint,
      errorMessage: 'رابط التحقق غير مكتمل أو انتهت صلاحيته. يرجى طلب رابط جديد.',
      errorCode: 'invalid_callback_url',
    };
  } catch (err) {
    const mapped = mapSupabaseAuthErrorToArabic(
      err,
      'حدث خطأ غير متوقع أثناء معالجة رابط المصادقة.'
    );
    return {
      handled: true,
      success: false,
      session: null,
      user: null,
      isPasswordRecovery: isRecoveryHint,
      errorMessage: mapped.message,
      errorCode: mapped.code,
    };
  }
}

/**
 * Processes Android Native Deep Links (e.g., com.meow.app://auth-callback?code=...)
 * with strict deduplication so repeated launch/appUrlOpen events never exchange a PKCE code twice.
 */
export async function handleSupabaseAuthCallbackUrl(
  rawUrl: string
): Promise<SupabaseAuthCallbackResult> {
  const parsed = parseCallbackUrlSafely(rawUrl);
  if (!parsed || !isSupabaseAuthCallbackUrl(rawUrl)) {
    return {
      handled: false,
      success: true,
      session: null,
      user: null,
      isPasswordRecovery: false,
    };
  }

  const dedupeKey = buildAuthCallbackDedupeKey(parsed);
  const completed = completedAuthCallbacks.get(dedupeKey);
  if (completed) {
    return completed;
  }

  const existingInFlight = inFlightAuthCallbacks.get(dedupeKey);
  if (existingInFlight) {
    return existingInFlight;
  }

  const promise = processSupabaseAuthCallbackUrl(parsed)
    .then((res) => {
      if (res.success || res.errorCode === 'oauth_cancelled') {
        cacheCompletedAuthCallback(dedupeKey, res);
      }
      return res;
    })
    .finally(() => {
      inFlightAuthCallbacks.delete(dedupeKey);
    });

  inFlightAuthCallbacks.set(dedupeKey, promise);
  return promise;
}
