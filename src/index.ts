import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { MeowApp } from './ui/App.ts';
import { state } from './state.ts';
import {
  closeNativeAuthBrowser,
  isSupabaseAuthCallbackUrl,
} from './services/supabaseAuthService.ts';

function setupAndroidBackHandler(): void {
  try {
    if (Capacitor.isNativePlatform()) {
      void CapApp.addListener('backButton', ({ canGoBack }) => {
        const handled = state.handleHardwareBack();
        if (handled) return;
        if (canGoBack) {
          window.history.back();
        } else {
          void CapApp.exitApp();
        }
      });
    }
  } catch (err) {
    console.warn('Capacitor backButton listener skipped:', err);
  }
}

function setupAndroidDeepLinkHandler(): void {
  try {
    if (Capacitor.isNativePlatform()) {
      void CapApp.addListener('appUrlOpen', ({ url }) => {
        if (url) {
          if (isSupabaseAuthCallbackUrl(url)) {
            void closeNativeAuthBrowser();
          }
          void state.handleAuthDeepLinkUrl(url);
        }
      });
    }
  } catch (err) {
    console.warn('Capacitor appUrlOpen listener skipped:', err);
  }
}

function shouldBootDevXrPreview(): boolean {
  if (!import.meta.env.DEV || typeof window === 'undefined') {
    return false;
  }
  try {
    if (Capacitor.isNativePlatform()) {
      return false;
    }
    return new URLSearchParams(window.location.search).get('xr') === '1';
  } catch {
    return false;
  }
}

async function initDevXrPreviewIfRequested(): Promise<void> {
  if (!shouldBootDevXrPreview()) return;
  try {
    const [xb, { CatScene }] = await Promise.all([
      import('xrblocks'),
      import('./xr/CatScene.ts'),
    ]);
    const options = new xb.Options();
    options.setAppTitle('Meow - مواء');
    options.setAppDescription('منصة رعاية وتزاوج وتبني الحيوانات الأليفة');
    xb.add(new CatScene());
    await xb.init(options);
  } catch (err) {
    console.warn('XR preview initialization skipped:', err);
  }
}

function bootMeowApp(): void {
  // 1. Mount Meow Responsive 2D Application into #root
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const app = new MeowApp(rootElement);
    app.init();
  }

  // 2. Register Android Hardware Back Button & Deep Link Handlers
  setupAndroidBackHandler();
  setupAndroidDeepLinkHandler();

  // 3. Optional Dev-Only XR Preview (excluded from production Web & Android APK bundles)
  void initDevXrPreviewIfRequested();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootMeowApp);
} else {
  bootMeowApp();
}
