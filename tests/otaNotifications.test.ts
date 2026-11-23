import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { OtaManifest, UpdateCheckResult } from '../src/services/updateService.ts';

function makeOtaManifest(version: string, mandatory = false): OtaManifest {
  return {
    version,
    buildNumber: 3,
    bundleUrl: `https://updates.example.com/bundles/${version}/bundle.zip`,
    checksum: 'deadbeef',
    minNativeVersion: '1.2.0',
    channel: 'production',
    releaseNotes: 'تحسينات في الأداء وإصلاحات مهمة.',
    mandatory,
  };
}

describe('OTA notification state & deduplication', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  afterEach(() => {
    vi.doUnmock('../src/services/supabaseClient.ts');
    vi.doUnmock('../src/services/updateService.ts');
  });

  it('shows non-intrusive OTA notification on compatible startup check without auto-downloading, and suppresses repeat after dismissal across restarts', async () => {
    const manifest121 = makeOtaManifest('1.2.1');
    const checkForUpdatesMock = vi.fn(
      async (): Promise<UpdateCheckResult> => ({
        configured: true,
        status: 'ota_available',
        currentNativeVersion: '1.2.0',
        currentBuildNumber: 2,
        currentBundleVersion: '1.2.0',
        otaUpdate: manifest121,
        apkUpdate: null,
      })
    );
    const applyOtaMock = vi.fn();

    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));
    vi.doMock('../src/services/updateService.ts', async () => {
      const actual = await vi.importActual<typeof import('../src/services/updateService.ts')>(
        '../src/services/updateService.ts'
      );
      return {
        ...actual,
        checkForUpdates: checkForUpdatesMock,
        applyOtaUpdate: applyOtaMock,
      };
    });

    const { state } = await import('../src/state.ts');
    await state.checkForAppUpdates(false);

    // Notification appears, and download is NEVER triggered automatically
    expect(state.getUpdateState().isOtaNoticeVisible).toBe(true);
    expect(state.getUpdateState().result.otaUpdate?.version).toBe('1.2.1');
    expect(applyOtaMock).not.toHaveBeenCalled();

    // User dismisses notification -> persists across app relaunches
    state.dismissOtaNotice();
    expect(state.getUpdateState().isOtaNoticeVisible).toBe(false);
    expect(localStorage.getItem('meow_dismissed_ota_version')).toBe('production:1.2.1');

    // Simulate app reopen (fresh module instance reading localStorage)
    vi.resetModules();
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));
    vi.doMock('../src/services/updateService.ts', async () => {
      const actual = await vi.importActual<typeof import('../src/services/updateService.ts')>(
        '../src/services/updateService.ts'
      );
      return {
        ...actual,
        checkForUpdates: checkForUpdatesMock,
        applyOtaUpdate: applyOtaMock,
      };
    });

    const { state: reopenedState } = await import('../src/state.ts');
    await reopenedState.checkForAppUpdates(false);

    // Banner stays hidden on reopen, while update stays available manually in Settings
    expect(reopenedState.getUpdateState().isOtaNoticeVisible).toBe(false);
    expect(reopenedState.getUpdateState().result.otaUpdate?.version).toBe('1.2.1');

    // When a newer version (1.2.2) is published, notification appears again
    checkForUpdatesMock.mockResolvedValueOnce({
      configured: true,
      status: 'ota_available',
      currentNativeVersion: '1.2.0',
      currentBuildNumber: 2,
      currentBundleVersion: '1.2.0',
      otaUpdate: makeOtaManifest('1.2.2'),
      apkUpdate: null,
    });
    await reopenedState.checkForAppUpdates(false);
    expect(reopenedState.getUpdateState().isOtaNoticeVisible).toBe(true);
    expect(reopenedState.getUpdateState().result.otaUpdate?.version).toBe('1.2.2');
  });

  it('does not show OTA notice on network error, unconfigured host, or up_to_date status', async () => {
    const checkForUpdatesMock = vi.fn<() => Promise<UpdateCheckResult>>();

    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));
    vi.doMock('../src/services/updateService.ts', async () => {
      const actual = await vi.importActual<typeof import('../src/services/updateService.ts')>(
        '../src/services/updateService.ts'
      );
      return {
        ...actual,
        checkForUpdates: checkForUpdatesMock,
      };
    });

    const { state } = await import('../src/state.ts');

    for (const status of ['unconfigured', 'up_to_date', 'error'] as const) {
      checkForUpdatesMock.mockResolvedValueOnce({
        configured: status !== 'unconfigured',
        status,
        currentNativeVersion: '1.2.0',
        currentBuildNumber: 2,
        currentBundleVersion: '1.2.0',
        otaUpdate: null,
        apkUpdate: null,
        ...(status === 'error' ? { errorMessage: 'Network failure' } : {}),
      });
      await state.checkForAppUpdates(false);
      expect(state.getUpdateState().isOtaNoticeVisible).toBe(false);
    }
  });

  it('handles OTA download failure cleanly and marks staged state on success', async () => {
    const manifest121 = makeOtaManifest('1.2.1');
    const applyOtaMock = vi
      .fn()
      .mockResolvedValueOnce({
        success: false,
        appliedImmediately: false,
        errorMessage: 'فشل تنزيل حزمة التحديث.',
      })
      .mockResolvedValueOnce({
        success: true,
        appliedImmediately: false,
        stagedForNextLaunch: true,
        version: '1.2.1',
      });

    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));
    vi.doMock('../src/services/updateService.ts', async () => {
      const actual = await vi.importActual<typeof import('../src/services/updateService.ts')>(
        '../src/services/updateService.ts'
      );
      return {
        ...actual,
        checkForUpdates: vi.fn(async () => ({
          configured: true,
          status: 'ota_available' as const,
          currentNativeVersion: '1.2.0',
          currentBuildNumber: 2,
          currentBundleVersion: '1.2.0',
          otaUpdate: manifest121,
          apkUpdate: null,
        })),
        applyOtaUpdate: applyOtaMock,
      };
    });

    const { state } = await import('../src/state.ts');
    await state.checkForAppUpdates(false);
    expect(state.getUpdateState().isOtaNoticeVisible).toBe(true);

    // 1. Download fails -> shows error feedback, not staged
    await state.applyOtaUpdateNow();
    expect(state.getUpdateState().isOtaStagedForRestart).toBe(false);
    expect(state.getUpdateState().feedback?.kind).toBe('error');
    expect(state.getUpdateState().feedback?.message).toContain('فشل تنزيل');

    // 2. Retry succeeds -> staged for restart
    await state.applyOtaUpdateNow();
    expect(state.getUpdateState().isOtaStagedForRestart).toBe(true);
    expect(state.getUpdateState().stagedOtaVersion).toBe('1.2.1');
    expect(state.getUpdateState().feedback?.kind).toBe('success');
  });
});
