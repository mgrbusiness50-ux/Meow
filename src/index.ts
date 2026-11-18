import * as xb from 'xrblocks';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { MeowApp } from './ui/App.ts';
import { CatScene } from './xr/CatScene.ts';
import { state } from './state.ts';

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

function bootMeowApp(): void {
  // 1. Mount Meow Responsive 2D Application into #root
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const app = new MeowApp(rootElement);
    app.init();
  }

  // 2. Register Android Hardware Back Button Handler
  setupAndroidBackHandler();

  // 3. Initialize XR Blocks Spatial 3D Experience (WebXR + Simulator)
  try {
    const options = new xb.Options();
    options.setAppTitle('Meow - مواء');
    options.setAppDescription('منصة رعاية وتزاوج وتبني الحيوانات الأليفة');

    xb.add(new CatScene());
    const initResult = xb.init(options) as unknown;
    if (initResult && typeof (initResult as Promise<unknown>).catch === 'function') {
      (initResult as Promise<unknown>).catch((err) => {
        console.warn('XR initialization skipped in current environment:', err);
      });
    }
  } catch (err) {
    console.warn('XR setup skipped in current environment:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootMeowApp);
} else {
  bootMeowApp();
}
