import * as xb from 'xrblocks';
import { MeowApp } from './ui/App.ts';
import { CatScene } from './xr/CatScene.ts';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mount Meow Responsive 2D Application into #root
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const app = new MeowApp(rootElement);
    app.init();
  }

  // 2. Initialize XR Blocks Spatial 3D Experience (WebXR + Simulator)
  const options = new xb.Options();
  options.setAppTitle('Meow - مواء');
  options.setAppDescription('منصة رعاية وتزاوج وتبني الحيوانات الأليفة');

  xb.add(new CatScene());
  xb.init(options);
});
