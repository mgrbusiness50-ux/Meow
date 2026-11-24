import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const flushMicrotasks = async (rounds = 6) => {
  for (let i = 0; i < rounds; i += 1) {
    await Promise.resolve();
  }
};

describe('Splash screen minimum duration (7000ms) and readiness gating', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.doUnmock('../src/services/supabaseClient.ts');
    vi.doUnmock('../src/services/supabaseAuthService.ts');
  });

  it('holds splash for at least 7000ms, blocks premature skips, and transitions automatically without user interaction', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const { state } = await import('../src/state.ts');
    state.resetSplashState();

    expect(state.getOnboardingStep()).toBe('splash');
    expect(state.getSplashMinDurationMs()).toBe(7000);

    // Attempt early transition before 7000ms elapses
    state.setOnboardingStep('welcome');
    expect(state.getOnboardingStep()).toBe('splash');

    await vi.advanceTimersByTimeAsync(6999);
    expect(state.getOnboardingStep()).toBe('splash');

    // Transitions automatically right after 7000ms without needing any click
    await vi.advanceTimersByTimeAsync(1);
    expect(state.getOnboardingStep()).toBe('welcome');
    expect(state.isSplashLoadingDelayed()).toBe(false);
  });

  it('waits until 7000ms when initialization completes early (1500ms) and transitions without extra delay at 7000ms', async () => {
    let resolveSession!: (val: unknown) => void;
    const sessionPromise = new Promise((resolve) => {
      resolveSession = resolve;
    });

    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => true,
    }));
    vi.doMock('../src/services/supabaseAuthService.ts', () => ({
      clearSupabasePasswordRecoveryState: vi.fn(),
      closeExternalAuthBrowserIfOpen: vi.fn(async () => {}),
      fetchSupabaseUserAccountBundle: vi.fn(),
      getCurrentSupabaseSession: vi.fn(() => sessionPromise),
      handleSupabaseAuthCallbackUrl: vi.fn(async () => ({ handled: false })),
      isSupabaseAuthCallbackUrl: vi.fn(() => false),
      isSupabasePasswordRecoveryActive: vi.fn(() => false),
      saveSupabaseUserAccountBundle: vi.fn(),
      signOutFromSupabase: vi.fn(async () => ({ success: true })),
      subscribeToSupabaseAuthChanges: vi.fn(() => () => {}),
      updateSupabaseAccountPreferences: vi.fn(),
    }));

    const { state } = await import('../src/state.ts');
    expect(state.getOnboardingStep()).toBe('splash');

    await vi.advanceTimersByTimeAsync(1500);
    resolveSession({ configured: true, session: null, user: null, isPasswordRecovery: false });
    await flushMicrotasks();

    // Still holds splash until 7000ms minimum duration passes
    expect(state.getOnboardingStep()).toBe('splash');

    await vi.advanceTimersByTimeAsync(5499);
    expect(state.getOnboardingStep()).toBe('splash');

    await vi.advanceTimersByTimeAsync(1);
    expect(state.getOnboardingStep()).toBe('welcome');
    expect(state.isSplashLoadingDelayed()).toBe(false);
  });

  it('stays on splash with loading indicator when initialization is delayed past 7000ms and transitions immediately upon readiness', async () => {
    let resolveSession!: (val: unknown) => void;
    const sessionPromise = new Promise((resolve) => {
      resolveSession = resolve;
    });

    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => true,
    }));
    vi.doMock('../src/services/supabaseAuthService.ts', () => ({
      clearSupabasePasswordRecoveryState: vi.fn(),
      closeExternalAuthBrowserIfOpen: vi.fn(async () => {}),
      fetchSupabaseUserAccountBundle: vi.fn(),
      getCurrentSupabaseSession: vi.fn(() => sessionPromise),
      handleSupabaseAuthCallbackUrl: vi.fn(async () => ({ handled: false })),
      isSupabaseAuthCallbackUrl: vi.fn(() => false),
      isSupabasePasswordRecoveryActive: vi.fn(() => false),
      saveSupabaseUserAccountBundle: vi.fn(),
      signOutFromSupabase: vi.fn(async () => ({ success: true })),
      subscribeToSupabaseAuthChanges: vi.fn(() => () => {}),
      updateSupabaseAccountPreferences: vi.fn(),
    }));

    const { state } = await import('../src/state.ts');
    expect(state.getOnboardingStep()).toBe('splash');

    // Pass 7000ms while auth session check is still pending -> shows loading indicator
    await vi.advanceTimersByTimeAsync(7000);
    expect(state.getOnboardingStep()).toBe('splash');
    expect(state.isSplashLoadingDelayed()).toBe(true);

    // Even past 10500ms, still waits because initialization has not settled yet
    await vi.advanceTimersByTimeAsync(3500);
    expect(state.getOnboardingStep()).toBe('splash');
    expect(state.isSplashLoadingDelayed()).toBe(true);

    // As soon as delayed initialization completes at 10500ms, transitions immediately
    resolveSession({ configured: true, session: null, user: null, isPasswordRecovery: false });
    await flushMicrotasks();

    expect(state.getOnboardingStep()).toBe('welcome');
    expect(state.isSplashLoadingDelayed()).toBe(false);
  });

  it('avoids duplicate transitions or conflicting timers when scheduleSplashAutoTransition is called multiple times', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const { state } = await import('../src/state.ts');
    let notifications = 0;
    const unsub = state.subscribe(() => {
      notifications += 1;
    });

    state.resetSplashState();
    state.scheduleSplashAutoTransition();
    state.scheduleSplashAutoTransition();
    const beforeCount = notifications;

    await vi.advanceTimersByTimeAsync(7000);
    expect(state.getOnboardingStep()).toBe('welcome');
    expect(notifications - beforeCount).toBe(1);

    // Re-calling scheduleSplashAutoTransition after transition has completed is a safe no-op
    state.scheduleSplashAutoTransition();
    await vi.advanceTimersByTimeAsync(15000);
    expect(state.getOnboardingStep()).toBe('welcome');
    expect(notifications - beforeCount).toBe(1);
    unsub();
  });

  it('routes a valid returning session directly to completed after >=7000ms without needing user click', async () => {
    const fakeSession = { access_token: 'tok', user: { id: 'u-1', email: 'user@example.com' } };
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => true,
    }));
    vi.doMock('../src/services/supabaseAuthService.ts', () => ({
      clearSupabasePasswordRecoveryState: vi.fn(),
      closeExternalAuthBrowserIfOpen: vi.fn(async () => {}),
      fetchSupabaseUserAccountBundle: vi.fn(async () => ({
        success: true,
        bundle: {
          exists: true,
          profile: {
            id: 'u-1',
            name: 'أحمد',
            email: 'user@example.com',
            phone: '01012345678',
            city: 'القاهرة',
            governorate: 'القاهرة',
            gender: 'male',
            avatar: '',
            privacyMode: 'private',
            showPhoneOnlyAfterApproval: false,
            showPhoneInProfile: false,
            notificationsEnabled: true,
          },
          role: 'user',
          onboardingDone: true,
          adviceDismissed: false,
          isDeleted: false,
          rawProfile: null,
          rawPrivateDetails: null,
        },
      })),
      getCurrentSupabaseSession: vi.fn(async () => ({
        configured: true,
        session: fakeSession,
        user: fakeSession.user,
        isPasswordRecovery: false,
      })),
      handleSupabaseAuthCallbackUrl: vi.fn(async () => ({ handled: false })),
      isSupabaseAuthCallbackUrl: vi.fn(() => false),
      isSupabasePasswordRecoveryActive: vi.fn(() => false),
      saveSupabaseUserAccountBundle: vi.fn(),
      signOutFromSupabase: vi.fn(async () => ({ success: true })),
      subscribeToSupabaseAuthChanges: vi.fn(() => () => {}),
      updateSupabaseAccountPreferences: vi.fn(),
    }));

    const { state } = await import('../src/state.ts');
    await flushMicrotasks();
    expect(state.getOnboardingStep()).toBe('splash');

    await vi.advanceTimersByTimeAsync(7000);
    expect(state.getOnboardingStep()).toBe('completed');
  });

  it('lands on auth_method (not owner_details or splash) when cached session exists but profile load fails offline', async () => {
    const fakeSession = { access_token: 'tok', user: { id: 'u-offline', email: 'offline@example.com' } };
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => true,
    }));
    vi.doMock('../src/services/supabaseAuthService.ts', () => ({
      clearSupabasePasswordRecoveryState: vi.fn(),
      closeExternalAuthBrowserIfOpen: vi.fn(async () => {}),
      fetchSupabaseUserAccountBundle: vi.fn(async () => ({
        success: false,
        bundle: null,
        errorMessage: 'تعذر حفظ أو جلب بيانات الحساب بسبب مشكلة في الاتصال بالإنترنت.',
      })),
      getCurrentSupabaseSession: vi.fn(async () => ({
        configured: true,
        session: fakeSession,
        user: fakeSession.user,
        isPasswordRecovery: false,
      })),
      handleSupabaseAuthCallbackUrl: vi.fn(async () => ({ handled: false })),
      isSupabaseAuthCallbackUrl: vi.fn(() => false),
      isSupabasePasswordRecoveryActive: vi.fn(() => false),
      saveSupabaseUserAccountBundle: vi.fn(),
      signOutFromSupabase: vi.fn(async () => ({ success: true })),
      subscribeToSupabaseAuthChanges: vi.fn(() => () => {}),
      updateSupabaseAccountPreferences: vi.fn(),
    }));

    const { state } = await import('../src/state.ts');
    await flushMicrotasks();
    expect(state.getOnboardingStep()).toBe('splash');

    await vi.advanceTimersByTimeAsync(7000);
    expect(state.getOnboardingStep()).toBe('auth_method');
    expect(state.getSupabaseAuthError()).toContain('مشكلة في الاتصال بالإنترنت');
  });

  it('preserves exact Splash DOM nodes across delayed auth updates so logo never disappears or flickers', async () => {
    let resolveSession!: (val: unknown) => void;
    const sessionPromise = new Promise((resolve) => {
      resolveSession = resolve;
    });

    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => true,
    }));
    vi.doMock('../src/services/supabaseAuthService.ts', () => ({
      clearSupabasePasswordRecoveryState: vi.fn(),
      closeExternalAuthBrowserIfOpen: vi.fn(async () => {}),
      fetchSupabaseUserAccountBundle: vi.fn(),
      getCurrentSupabaseSession: vi.fn(() => sessionPromise),
      handleSupabaseAuthCallbackUrl: vi.fn(async () => ({ handled: false })),
      isSupabaseAuthCallbackUrl: vi.fn(() => false),
      isSupabasePasswordRecoveryActive: vi.fn(() => false),
      saveSupabaseUserAccountBundle: vi.fn(),
      signOutFromSupabase: vi.fn(async () => ({ success: true })),
      subscribeToSupabaseAuthChanges: vi.fn(() => () => {}),
      updateSupabaseAccountPreferences: vi.fn(),
    }));

    document.body.innerHTML = `
      <div id="root">
        <div id="splash-screen-container">
          <img id="splash-logo-img" alt="Meow Logo" src="/assets/meow-logo.png" />
          <div id="splash-loading-slot"></div>
        </div>
      </div>
    `;
    const root = document.getElementById('root')!;
    const initialContainer = document.getElementById('splash-screen-container');
    const initialLogo = document.getElementById('splash-logo-img') as HTMLImageElement | null;

    const [{ state }, { MeowApp }] = await Promise.all([
      import('../src/state.ts'),
      import('../src/ui/App.ts'),
    ]);

    const app = new MeowApp(root);
    app.init();

    expect(state.getOnboardingStep()).toBe('splash');
    expect(document.getElementById('splash-screen-container')).toBe(initialContainer);
    expect(document.getElementById('splash-logo-img')).toBe(initialLogo);
    expect(initialLogo?.getAttribute('src')).toBe('/assets/meow-logo.png');

    // Trigger loading indicator at 7000ms while session is still pending -> DOM container & logo MUST remain exact same nodes
    await vi.advanceTimersByTimeAsync(7000);
    expect(state.isSplashLoadingDelayed()).toBe(true);
    expect(document.getElementById('splash-screen-container')).toBe(initialContainer);
    expect(document.getElementById('splash-logo-img')).toBe(initialLogo);
    expect(document.getElementById('splash-loading-indicator')).not.toBeNull();

    // Settle delayed session -> auto-transitions cleanly to Welcome screen
    resolveSession({ configured: true, session: null, user: null, isPasswordRecovery: false });
    await flushMicrotasks();
    expect(state.getOnboardingStep()).toBe('welcome');
  });

  it('renders logo and developer credit simultaneously in both index.html and OnboardingView without render-blocking remote stylesheets', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const indexHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
    const indexCss = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf8');

    // Verify no blocking remote @import inside src/index.css and non-blocking remote stylesheets in index.html
    expect(indexCss).not.toContain('@import url(');
    expect(indexHtml).toContain('id="splash-logo-img"');
    expect(indexHtml).toContain('id="splash-brand-credit"');
    expect(indexHtml).toContain('Mohamed Gamil');
    expect(indexHtml).toContain('media="print"');

    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));
    const [{ state }, { renderOnboardingView }] = await Promise.all([
      import('../src/state.ts'),
      import('../src/ui/views/OnboardingView.ts'),
    ]);
    state.resetSplashState();
    const html = renderOnboardingView();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;

    const logoEl = wrapper.querySelector('#splash-logo-img') as HTMLImageElement | null;
    const creditEl = wrapper.querySelector('#splash-brand-credit') as HTMLElement | null;
    expect(logoEl).not.toBeNull();
    expect(creditEl).not.toBeNull();
    expect(logoEl?.getAttribute('src')).toBe('/assets/meow-logo.png');
    expect(creditEl?.textContent).toContain('By');
    expect(creditEl?.textContent).toContain('Mohamed Gamil');
  });
});

