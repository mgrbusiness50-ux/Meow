import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { MeowApp } from './ui/App.ts';
import { state } from './state.ts';
import { initUpdateService } from './services/updateService.ts';

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
          void state.handleAuthDeepLinkUrl(url);
        }
      });
    }
  } catch (err) {
    console.warn('Capacitor appUrlOpen listener skipped:', err);
  }
}

function maybeInitDevXrOverlay(): void {
  if (!import.meta.env.DEV || Capacitor.isNativePlatform()) {
    return;
  }
  const hasXrFlag =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('xr');
  if (!hasXrFlag) {
    return;
  }

  void Promise.all([import('xrblocks'), import('./xr/CatScene.ts')])
    .then(([xb, { CatScene }]) => {
      const options = new xb.Options();
      options.setAppTitle('Meow - مواء');
      options.setAppDescription('منصة رعاية وتزاوج وتبني الحيوانات الأليفة');
      xb.add(new CatScene());
      return xb.init(options);
    })
    .catch((err) => {
      console.warn('XR dev overlay initialization skipped:', err);
    });
}

function bootMeowApp(): void {
  // 0. Mark bundled version ready immediately for OTA rollback protection
  void initUpdateService();

  // 1. Mount Meow Responsive 2D Application into #root
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const app = new MeowApp(rootElement);
    app.init();
  }

  // 2. Register Android Hardware Back Button & Deep Link Handlers
  setupAndroidBackHandler();
  setupAndroidDeepLinkHandler();

  // 3. Background check for OTA / APK updates without blocking startup
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      void state.checkForAppUpdates(false);
    }, 1800);
  }

  // 4. Optional Dev-Only XR Simulator (?xr) — excluded from production & Android APK builds
  maybeInitDevXrOverlay();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootMeowApp);
} else {
  bootMeowApp();
}
