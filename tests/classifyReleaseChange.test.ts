import { describe, expect, it } from 'vitest';
import { classifyChangedFiles } from '../scripts/classify-release-change.mjs';

describe('classify-release-change script', () => {
  it('classifies pure web/UI changes as ota_eligible', () => {
    const res = classifyChangedFiles([
      'src/ui/views/ChatView.ts',
      'src/index.css',
      'version.json',
    ]);
    expect(res.classification).toBe('ota_eligible');
    expect(res.shouldDeployOta).toBe(true);
  });

  it('classifies native Android or Capacitor config changes as apk_required', () => {
    const res = classifyChangedFiles([
      'src/ui/views/ProfileView.ts',
      'android/app/src/main/AndroidManifest.xml',
    ]);
    expect(res.classification).toBe('apk_required');
    expect(res.shouldDeployOta).toBe(false);

    const capRes = classifyChangedFiles(['capacitor.config.ts']);
    expect(capRes.classification).toBe('apk_required');
    expect(capRes.shouldDeployOta).toBe(false);
  });

  it('handles package.json native vs web-only dependency updates', () => {
    expect(
      classifyChangedFiles(['package.json'], { nativePackageChanged: true }).classification
    ).toBe('apk_required');
    expect(
      classifyChangedFiles(['package.json'], { nativePackageChanged: false }).classification
    ).toBe('ota_eligible');
  });

  it('classifies documentation and tests as no_app_changes', () => {
    const res = classifyChangedFiles([
      'README.md',
      'tests/sanitize.test.ts',
      'public/updates/ota-manifest.json',
    ]);
    expect(res.classification).toBe('no_app_changes');
    expect(res.shouldDeployOta).toBe(false);
  });
});
