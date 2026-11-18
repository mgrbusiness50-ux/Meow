import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  Auth,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export interface GoogleAuthAccount {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}

export interface GoogleAuthResult {
  success: boolean;
  cancelled?: boolean;
  account?: GoogleAuthAccount;
  errorMessage?: string;
}

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;

export function isFirebaseOAuthConfigured(): boolean {
  return Boolean(
    firebaseConfig &&
      firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.projectId !== 'remixed-project-id'
  );
}

function getFirebaseAuthInstance(): Auth {
  if (!isFirebaseOAuthConfigured()) {
    throw new Error('FIREBASE_CONFIG_MISSING');
  }
  if (!cachedApp) {
    cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  if (!cachedAuth) {
    cachedAuth = getAuth(cachedApp);
  }
  return cachedAuth;
}

function mapFirebaseAuthError(error: unknown): { cancelled: boolean; message: string } {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code || '')
      : '';
  const msg = error instanceof Error ? error.message : String(error || '');

  if (msg === 'FIREBASE_CONFIG_MISSING') {
    return {
      cancelled: false,
      message:
        'إعدادات Google OAuth / Firebase غير مكتملة حالياً في المشروع. يرجى التأكد من تفعيل Firebase Auth وإعداد firebase-applet-config.json.',
    };
  }

  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return {
        cancelled: true,
        message: 'تم إلغاء تسجيل الدخول عبر Google. لم يتم تسجيل دخولك — يمكنك المحاولة مرة أخرى.',
      };
    case 'auth/popup-blocked':
      return {
        cancelled: false,
        message:
          'قام المتصفح بحظر نافذة Google المنبثقة. يرجى السماح بالنوافذ المنبثقة (Popups) لهذا الموقع ثم إعادة المحاولة.',
      };
    case 'auth/unauthorized-domain':
      return {
        cancelled: false,
        message:
          'نطاق التشغيل الحالي غير مضاف في Authorized Domains داخل إعدادات Firebase Authentication. أضف النطاق لإتمام تسجيل Google.',
      };
    case 'auth/operation-not-allowed':
      return {
        cancelled: false,
        message:
          'مزوّد تسجيل الدخول عبر Google غير مفعّل في مشروع Firebase Authentication.',
      };
    case 'auth/network-request-failed':
      return {
        cancelled: false,
        message: 'تعذر الاتصال بخدمة Google بسبب مشكلة في الشبكة. تحقق من الإنترنت وحاول مجدداً.',
      };
    case 'auth/account-exists-with-different-credential':
      return {
        cancelled: false,
        message: 'هذا البريد الإلكتروني مسجل بطريقة دخول أخرى.',
      };
    default:
      return {
        cancelled: false,
        message:
          code
            ? `تعذر إتمام تسجيل الدخول عبر Google (${code}). يرجى المحاولة مرة أخرى.`
            : 'تعذر إتمام تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.',
      };
  }
}

/**
 * Executes real Google OAuth sign-in using Firebase Authentication signInWithPopup.
 * Never simulates login or returns success if authentication fails or is cancelled.
 */
export async function signInWithGoogleOAuth(): Promise<GoogleAuthResult> {
  try {
    const auth = getFirebaseAuthInstance();
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });

    const result = await signInWithPopup(auth, provider);
    const user = result?.user;

    if (!user || !user.uid) {
      return {
        success: false,
        errorMessage: 'لم تكتمل عملية التحقق من حساب Google. يرجى المحاولة مجدداً.',
      };
    }

    return {
      success: true,
      account: {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        emailVerified: Boolean(user.emailVerified),
      },
    };
  } catch (error) {
    const mapped = mapFirebaseAuthError(error);
    return {
      success: false,
      cancelled: mapped.cancelled,
      errorMessage: mapped.message,
    };
  }
}

export async function signOutGoogleOAuth(): Promise<void> {
  try {
    if (!isFirebaseOAuthConfigured()) return;
    const auth = getFirebaseAuthInstance();
    await signOut(auth);
  } catch (error) {
    console.warn('Error signing out of Firebase Auth:', error);
  }
}
