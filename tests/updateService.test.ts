import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  compareSemver,
  evaluateApkRelease,
  isOtaManifestApplicable,
  type ApkReleaseManifest,
  type OtaManifest,
} from '../src/services/updateService.ts';

describe('updateService version & manifest gating', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('@capacitor/core');
    vi.doUnmock('@capgo/capacitor-updater');
  });

  it('compares semantic versions and prereleases accurately', () => {
    expect(compareSemver('1.2.1', '1.2.0')).toBe(1);
    expect(compareSemver('1.2.0', '1.2.0')).toBe(0);
    expect(compareSemver('1.1.9', '1.2.0')).toBe(-1);
    expect(compareSemver('1.2.0', '1.2.0-beta.1')).toBe(1);
    expect(compareSemver('v1.3.0', '1.2.9')).toBe(1);
  });

  it('accepts valid OTA manifest matching channel and native version range', () => {
    const manifest: OtaManifest = {
      version: '1.2.1',
      buildNumber: 3,
      bundleUrl: 'https://meow.github.io/updates/bundles/1.2.1/bundle.zip',
      minNativeVersion: '1.2.0',
      maxNativeVersion: '1.3.0',
      channel: 'production',
    };

    expect(isOtaManifestApplicable(manifest, '1.2.0', '1.2.0', 'production')).toBe(true);
    expect(isOtaManifestApplicable(manifest, '1.2.0', '1.2.1', 'production')).toBe(false);
    expect(isOtaManifestApplicable(manifest, '1.2.0', '1.2.0', 'testing')).toBe(false);
    expect(isOtaManifestApplicable(manifest, '1.1.0', '1.1.0', 'production')).toBe(false);
    expect(isOtaManifestApplicable(manifest, '1.4.0', '1.4.0', 'production')).toBe(false);
  });

  it('rejects non-HTTPS OTA bundle URLs', () => {
    const insecure: OtaManifest = {
      version: '1.2.5',
      buildNumber: 5,
      bundleUrl: 'javascript:alert(1)',
      channel: 'production',
    };
    expect(isOtaManifestApplicable(insecure, '1.2.0', '1.2.0', 'production')).toBe(false);
  });

  it('evaluates signed APK releases by version/buildNumber and minSupportedVersion', () => {
    const manifest: ApkReleaseManifest = {
      latestVersion: '1.3.0',
      latestBuildNumber: 5,
      minSupportedVersion: '1.2.0',
      apkUrl: 'https://github.com/org/meow/releases/download/v1.3.0/meow-release.apk',
      mandatory: false,
    };

    const optionalUpdate = evaluateApkRelease(manifest, '1.2.0', 2);
    expect(optionalUpdate).not.toBeNull();
    expect(optionalUpdate?.isMandatory).toBe(false);

    const forcedUpdate = evaluateApkRelease(manifest, '1.1.0', 1);
    expect(forcedUpdate).not.toBeNull();
    expect(forcedUpdate?.isMandatory).toBe(true);

    expect(evaluateApkRelease(manifest, '1.3.0', 5)).toBeNull();
    expect(
      evaluateApkRelease(
        {
          latestVersion: '1.3.0',
          latestBuildNumber: 6,
          apkUrl: 'https://github.com/org/meow/releases/download/v1.3.0-b6/meow.apk',
        },
        '1.3.0',
        5
      )
    ).not.toBeNull();
  });

  it('stages OTA updates via CapacitorUpdater.download (with checksum) + next() without abrupt set() reload', async () => {
    const downloadMock = vi.fn(async () => ({ id: 'bundle-121', version: '1.2.1' }));
    const nextMock = vi.fn(async () => ({ id: 'bundle-121', version: '1.2.1' }));
    const setMock = vi.fn();
    const reloadMock = vi.fn(async () => {});

    vi.resetModules();
    vi.doMock('@capacitor/core', () => ({
      Capacitor: { isNativePlatform: () => true },
    }));
    vi.doMock('@capgo/capacitor-updater', () => ({
      CapacitorUpdater: {
        download: downloadMock,
        next: nextMock,
        set: setMock,
        reload: reloadMock,
        notifyAppReady: vi.fn(async () => {}),
        current: vi.fn(async () => ({ bundle: { version: '1.2.0' } })),
      },
    }));

    const { applyOtaUpdate, reloadAppToApplyStagedUpdate } = await import(
      '../src/services/updateService.ts'
    );

    const res = await applyOtaUpdate({
      version: '1.2.1',
      buildNumber: 3,
      bundleUrl: 'https://updates.example.com/bundles/1.2.1/bundle.zip',
      checksum: 'abc123sha256',
      channel: 'production',
    });

    expect(downloadMock).toHaveBeenCalledWith({
      url: 'https://updates.example.com/bundles/1.2.1/bundle.zip',
      version: '1.2.1',
      checksum: 'abc123sha256',
    });
    expect(nextMock).toHaveBeenCalledWith({ id: 'bundle-121' });
    expect(setMock).not.toHaveBeenCalled();
    expect(res).toEqual({
      success: true,
      appliedImmediately: false,
      stagedForNextLaunch: true,
      version: '1.2.1',
    });

    const reloadRes = await reloadAppToApplyStagedUpdate();
    expect(reloadMock).toHaveBeenCalledTimes(1);
    expect(reloadRes.success).toBe(true);
  });

  it('returns clear error when CapacitorUpdater.download fails', async () => {
    vi.resetModules();
    vi.doMock('@capacitor/core', () => ({
      Capacitor: { isNativePlatform: () => true },
    }));
    vi.doMock('@capgo/capacitor-updater', () => ({
      CapacitorUpdater: {
        download: vi.fn(async () => {
          throw new Error('Checksum mismatch');
        }),
        next: vi.fn(),
        set: vi.fn(),
        reload: vi.fn(),
      },
    }));

    const { applyOtaUpdate } = await import('../src/services/updateService.ts');
    const res = await applyOtaUpdate({
      version: '1.2.1',
      buildNumber: 3,
      bundleUrl: 'https://updates.example.com/bundles/1.2.1/bundle.zip',
      checksum: 'badchecksum',
      channel: 'production',
    });

    expect(res.success).toBe(false);
    expect(res.errorMessage).toContain('Checksum mismatch');
  });
});
