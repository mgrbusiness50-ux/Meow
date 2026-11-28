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
    vi.doUnmock('@capacitor/app');
    vi.doUnmock('@capgo/capacitor-updater');
    vi.unstubAllGlobals();
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

  it('reads real native APK version from CapApp.getInfo() separately from installed OTA bundle version', async () => {
    vi.resetModules();
    vi.doMock('@capacitor/core', () => ({
      Capacitor: { isNativePlatform: () => true },
    }));
    vi.doMock('@capacitor/app', () => ({
      App: {
        getInfo: vi.fn(async () => ({
          name: 'Meow',
          id: 'com.meow.app',
          version: '1.2.0',
          build: '2',
        })),
      },
    }));
    vi.doMock('@capgo/capacitor-updater', () => ({
      CapacitorUpdater: {
        current: vi.fn(async () => ({ bundle: { version: '1.2.2' } })),
      },
    }));
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith('/apk-release.json')) {
          return new Response(null, { status: 404 });
        }
        return new Response(
          JSON.stringify({
            version: '1.2.3',
            buildNumber: 5,
            bundleUrl: 'https://updates.example.com/bundles/1.2.3/bundle.zip',
            checksum: 'sha256hex',
            minNativeVersion: '1.2.0',
            maxNativeVersion: '1.2.0',
            channel: 'production',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );

    const { checkForUpdates } = await import('../src/services/updateService.ts');
    const result = await checkForUpdates({
      baseUrl: 'https://updates.example.com',
      channel: 'production',
    });

    expect(result.currentNativeVersion).toBe('1.2.0');
    expect(result.currentBuildNumber).toBe(2);
    expect(result.currentBundleVersion).toBe('1.2.2');
    expect(result.status).toBe('ota_available');
    expect(result.otaUpdate?.version).toBe('1.2.3');
  });

  it('resolves external GitHub Pages /updates baseUrl without duplicating /updates path segments', async () => {
    vi.resetModules();
    vi.doMock('@capacitor/core', () => ({
      Capacitor: { isNativePlatform: () => false },
    }));
    const requestedUrls: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        requestedUrls.push(url);
        if (url.endsWith('/apk-release.json')) {
          return new Response(null, { status: 404 });
        }
        return new Response(
          JSON.stringify({
            version: '1.2.2',
            buildNumber: 4,
            bundleUrl:
              'https://mgrbusiness50-ux.github.io/meow---ota--updates/updates/bundles/1.2.2-b4-production/bundle.zip',
            checksum: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
            minNativeVersion: '1.2.0',
            channel: 'production',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );

    const { checkForUpdates } = await import('../src/services/updateService.ts');
    const result = await checkForUpdates({
      baseUrl: 'https://mgrbusiness50-ux.github.io/meow---ota--updates/updates/',
      channel: 'production',
      currentNativeVersion: '1.2.1',
      currentBuildNumber: 3,
      currentBundleVersion: '1.2.1',
    });

    expect(requestedUrls).toEqual([
      'https://mgrbusiness50-ux.github.io/meow---ota--updates/updates/apk-release.json',
      'https://mgrbusiness50-ux.github.io/meow---ota--updates/updates/ota-manifest.json',
    ]);
    expect(result.status).toBe('ota_available');
    expect(result.otaUpdate?.bundleUrl).toBe(
      'https://mgrbusiness50-ux.github.io/meow---ota--updates/updates/bundles/1.2.2-b4-production/bundle.zip'
    );
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
