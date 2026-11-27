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

describe('OTA background staging, safe activation & notification deduplication', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    localStorage.setItem('meow_onboarding_done', 'true');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.doUnmock('@capacitor/core');
    vi.doUnmock('../src/services/supabaseClient.ts');
    vi.doUnmock('../src/services/updateService.ts');
  });

  it('automatically downloads & stages compatible OTA updates in background, preserves chat drafts, and suppresses notice after dismissal across restarts', async () => {
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
    const applyOtaMock = vi.fn(async (manifest: OtaManifest) => ({
      success: true,
      appliedImmediately: false,
      stagedForNextLaunch: true,
      version: manifest.version,
    }));

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
    state.setChatDraft('conv-1', 'رسالة مهمة لم تُرسل بعد');
    await state.checkForAppUpdates(false);

    // Compatible OTA is automatically downloaded & staged in the background
    expect(applyOtaMock).toHaveBeenCalledTimes(1);
    expect(applyOtaMock).toHaveBeenCalledWith(manifest121);
    expect(state.getUpdateState().isOtaStagedForRestart).toBe(true);
    expect(state.getUpdateState().stagedOtaVersion).toBe('1.2.1');
    expect(state.getUpdateState().isOtaNoticeVisible).toBe(true);

    // User dismisses notice -> persists across app relaunches while draft also survives reload
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
    expect(reopenedState.getChatDraft('conv-1')).toBe('رسالة مهمة لم تُرسل بعد');
    await reopenedState.checkForAppUpdates(false);

    // Notice stays hidden on reopen if dismissed, while staged state is ready
    expect(reopenedState.getUpdateState().isOtaNoticeVisible).toBe(false);
    expect(reopenedState.getUpdateState().isOtaStagedForRestart).toBe(true);

    // When a newer version (1.2.2) is published, it stages and notice appears again
    const manifest122 = makeOtaManifest('1.2.2');
    checkForUpdatesMock.mockResolvedValueOnce({
      configured: true,
      status: 'ota_available',
      currentNativeVersion: '1.2.0',
      currentBuildNumber: 2,
      currentBundleVersion: '1.2.0',
      otaUpdate: manifest122,
      apkUpdate: null,
    });
    await reopenedState.checkForAppUpdates(false);
    expect(applyOtaMock).toHaveBeenCalledWith(manifest122);
    expect(reopenedState.getUpdateState().stagedOtaVersion).toBe('1.2.2');
    expect(reopenedState.getUpdateState().isOtaNoticeVisible).toBe(true);
  });

  it('activates staged OTA on background resume only at safe points, never interrupting active chat or focused typing', async () => {
    const manifest121 = makeOtaManifest('1.2.1');
    const reloadMock = vi.fn(async () => ({ success: true }));

    vi.doMock('@capacitor/core', () => ({
      Capacitor: { isNativePlatform: () => true },
    }));
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
        applyOtaUpdate: vi.fn(async () => ({
          success: true,
          appliedImmediately: false,
          stagedForNextLaunch: true,
          version: '1.2.1',
        })),
        reloadAppToApplyStagedUpdate: reloadMock,
      };
    });

    const { state } = await import('../src/state.ts');
    await state.checkForAppUpdates(false);
    expect(state.getUpdateState().isOtaStagedForRestart).toBe(true);

    // 1. Inside an active chat conversation -> notice hidden & resume does NOT reload mid-chat
    const firstConvId = state.getConversations()[0]?.id || 'conv-1';
    state.setCurrentTab('chat');
    state.setActiveConversationId(firstConvId);
    expect(state.isSafeToActivateStagedOta()).toBe(false);

    state.handleAppBackgrounded();
    state.resumeFromBackground();
    await Promise.resolve();
    expect(reloadMock).not.toHaveBeenCalled();

    // 2. While typing in a focused input -> unsafe to activate
    state.setActiveConversationId(null);
    state.setCurrentTab('mating');
    const input = document.createElement('textarea');
    document.body.appendChild(input);
    input.focus();
    expect(state.isSafeToActivateStagedOta()).toBe(false);

    // 3. After leaving input & closing chat on a safe screen -> resume activates staged OTA cleanly
    input.blur();
    expect(state.isSafeToActivateStagedOta()).toBe(true);
    state.handleAppBackgrounded();
    state.resumeFromBackground();
    await Promise.resolve();
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it('does not show OTA notice on network error, unconfigured host, or up_to_date status', async () => {
    const checkForUpdatesMock = vi.fn<() => Promise<UpdateCheckResult>>();
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
      expect(applyOtaMock).not.toHaveBeenCalled();
    }
  });

  it('keeps background download/checksum failures silent without interrupting user and recovers on manual retry', async () => {
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
    // 1. Background auto-stage fails -> silent (no staged state, no banner, no error feedback toast)
    await state.checkForAppUpdates(false);
    expect(state.getUpdateState().isOtaStagedForRestart).toBe(false);
    expect(state.getUpdateState().isOtaNoticeVisible).toBe(false);
    expect(state.getUpdateState().feedback).toBeNull();

    // Subsequent automatic check in the same session does not hammer failing download
    await state.checkForAppUpdates(false);
    expect(applyOtaMock).toHaveBeenCalledTimes(1);

    // 2. Manual retry from Settings succeeds -> stages cleanly
    await state.applyOtaUpdateNow();
    expect(applyOtaMock).toHaveBeenCalledTimes(2);
    expect(state.getUpdateState().isOtaStagedForRestart).toBe(true);
    expect(state.getUpdateState().stagedOtaVersion).toBe('1.2.1');
    expect(state.getUpdateState().feedback?.kind).toBe('success');
  });
});
