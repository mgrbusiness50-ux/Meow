import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockSignInWithOAuth = vi.fn();
const mockSignUp = vi.fn();
const mockSignInWithPassword = vi.fn();
const mockSignOut = vi.fn();
const mockGetSession = vi.fn();
const mockExchangeCodeForSession = vi.fn();
const mockVerifyOtp = vi.fn();
const mockSetSession = vi.fn();
const mockOnAuthStateChange = vi.fn(() => ({
  data: { subscription: { unsubscribe: vi.fn() } },
}));
const mockFrom = vi.fn();

const mockBrowserOpen = vi.fn();
const mockBrowserClose = vi.fn();
const mockBrowserAddListener = vi.fn();

describe('Supabase Auth flows: Google OAuth deep link, Email signup (Confirm Email OFF), and error paths', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    localStorage.clear();

    mockSignInWithOAuth.mockReset();
    mockSignUp.mockReset();
    mockSignInWithPassword.mockReset();
    mockSignOut.mockReset();
    mockGetSession.mockReset();
    mockExchangeCodeForSession.mockReset();
    mockVerifyOtp.mockReset();
    mockSetSession.mockReset();
    mockFrom.mockReset();
    mockBrowserOpen.mockReset();
    mockBrowserClose.mockReset();
    mockBrowserAddListener.mockReset();
    mockBrowserAddListener.mockResolvedValue({ remove: vi.fn(async () => {}) });

    vi.doMock('@capacitor/core', () => ({
      Capacitor: {
        isNativePlatform: () => true,
        getPlatform: () => 'android',
      },
    }));
    vi.doMock('@capacitor/browser', () => ({
      Browser: {
        open: mockBrowserOpen,
        close: mockBrowserClose,
        addListener: mockBrowserAddListener,
      },
    }));
    vi.doMock('@capacitor/app', () => ({
      App: {
        getLaunchUrl: vi.fn(async () => ({ url: undefined })),
        addListener: vi.fn(async () => ({ remove: vi.fn(async () => {}) })),
      },
    }));
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => true,
      getSupabaseClient: () => ({
        auth: {
          signInWithOAuth: mockSignInWithOAuth,
          signUp: mockSignUp,
          signInWithPassword: mockSignInWithPassword,
          signOut: mockSignOut,
          getSession: mockGetSession,
          exchangeCodeForSession: mockExchangeCodeForSession,
          verifyOtp: mockVerifyOtp,
          setSession: mockSetSession,
          onAuthStateChange: mockOnAuthStateChange,
        },
        from: mockFrom,
      }),
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.doUnmock('@capacitor/core');
    vi.doUnmock('@capacitor/browser');
    vi.doUnmock('@capacitor/app');
    vi.doUnmock('../src/services/supabaseClient.ts');
  });

  it('launches Google PKCE OAuth with native com.meow.app://auth-callback and exchanges auth code once (without caching transient network errors)', async () => {
    mockSignInWithOAuth.mockResolvedValueOnce({
      data: { url: 'https://accounts.google.com/o/oauth2/v2/auth?state=abc' },
      error: null,
    });
    mockBrowserOpen.mockResolvedValueOnce(undefined);

    const {
      ANDROID_AUTH_CALLBACK_URL,
      handleSupabaseAuthCallbackUrl,
      signInWithGoogleSupabaseOAuth,
    } = await import('../src/services/supabaseAuthService.ts');

    const launchRes = await signInWithGoogleSupabaseOAuth();
    expect(launchRes.success).toBe(true);
    expect(launchRes.launchedExternalBrowser).toBe(true);
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: ANDROID_AUTH_CALLBACK_URL,
        skipBrowserRedirect: true,
        queryParams: { prompt: 'select_account' },
      },
    });
    expect(mockBrowserOpen).toHaveBeenCalledWith({
      url: 'https://accounts.google.com/o/oauth2/v2/auth?state=abc',
      presentationStyle: 'fullscreen',
    });

    // Transient network error during PKCE code exchange is NOT cached, so retry succeeds
    const callbackUrl = 'com.meow.app://auth-callback?code=pkce_code_123';
    mockExchangeCodeForSession.mockResolvedValueOnce({
      data: { session: null },
      error: { message: 'Failed to fetch' },
    });

    const firstAttempt = await handleSupabaseAuthCallbackUrl(callbackUrl);
    expect(firstAttempt.success).toBe(false);
    expect(firstAttempt.errorCode).toBe('network_error');

    const fakeSession = {
      access_token: 'tok_google',
      user: { id: 'g-1', email: 'catlover@gmail.com' },
    };
    mockExchangeCodeForSession.mockResolvedValueOnce({
      data: { session: fakeSession, user: fakeSession.user, redirectType: 'oauth' },
      error: null,
    });

    const retryAttempt = await handleSupabaseAuthCallbackUrl(callbackUrl);
    expect(retryAttempt.success).toBe(true);
    expect(retryAttempt.session).toEqual(fakeSession);

    // Duplicate Intent delivery with the exact same PKCE code returns cached success without second exchange
    const duplicateAttempt = await handleSupabaseAuthCallbackUrl(callbackUrl);
    expect(duplicateAttempt.success).toBe(true);
    expect(mockExchangeCodeForSession).toHaveBeenCalledTimes(2);
  });

  it('maps Google OAuth user cancellation (access_denied) cleanly without partial login', async () => {
    const { handleSupabaseAuthCallbackUrl } = await import(
      '../src/services/supabaseAuthService.ts'
    );

    const res = await handleSupabaseAuthCallbackUrl(
      'com.meow.app://auth-callback?error=access_denied&error_description=User+cancelled'
    );
    expect(res.handled).toBe(true);
    expect(res.success).toBe(false);
    expect(res.errorCode).toBe('oauth_cancelled');
    expect(res.errorMessage).toContain('تم إلغاء تسجيل الدخول عبر Google');
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
  });

  it('completes Email+Password signup immediately without confirmation when Confirm Email is disabled and routes new user to owner_details', async () => {
    const fakeSession = {
      access_token: 'tok_email',
      user: { id: 'u-new', email: 'newuser@example.com', identities: [{ id: 'id-1' }] },
    };

    mockGetSession
      .mockResolvedValueOnce({ data: { session: null }, error: null })
      .mockResolvedValue({ data: { session: fakeSession }, error: null });

    mockFrom.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          maybeSingle: vi.fn(async () => ({ data: null, error: null })),
        }),
      }),
    }));

    mockSignUp.mockResolvedValueOnce({
      data: { user: fakeSession.user, session: fakeSession },
      error: null,
    });

    const [{ signUpWithEmailPassword }, { state }] = await Promise.all([
      import('../src/services/supabaseAuthService.ts'),
      import('../src/state.ts'),
    ]);

    await vi.advanceTimersByTimeAsync(7000);
    state.setOnboardingStep('auth_method');
    state.setTermsAccepted(true);

    const signUpRes = await signUpWithEmailPassword({
      email: 'NewUser@Example.com',
      password: 'password123',
    });
    expect(signUpRes.success).toBe(true);
    expect(signUpRes.needsEmailConfirmation).toBe(false);
    expect(signUpRes.session).toEqual(fakeSession);

    const accountRes = await state.handleDirectSupabaseAuthSuccess(signUpRes.session!);
    expect(accountRes.success).toBe(true);
    expect(state.isSupabaseAuthenticated()).toBe(true);
    expect(state.getOnboardingStep()).toBe('owner_details');
  });

  it('rejects duplicate email signup, wrong password login, and handles clean sign-out', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockSignUp.mockResolvedValueOnce({
      data: { user: { id: 'dup', identities: [] }, session: null },
      error: null,
    });
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { code: 'invalid_credentials', message: 'Invalid login credentials' },
    });
    mockSignOut.mockResolvedValueOnce({ error: null });

    const [{ signUpWithEmailPassword, signInWithEmailPassword }, { state }] = await Promise.all([
      import('../src/services/supabaseAuthService.ts'),
      import('../src/state.ts'),
    ]);

    const dupRes = await signUpWithEmailPassword({
      email: 'existing@example.com',
      password: 'password123',
    });
    expect(dupRes.success).toBe(false);
    expect(dupRes.errorCode).toBe('user_already_exists');

    const badLogin = await signInWithEmailPassword({
      email: 'existing@example.com',
      password: 'wrong-password',
    });
    expect(badLogin.success).toBe(false);
    expect(badLogin.errorCode).toBe('invalid_credentials');

    const signOutRes = await state.signOutSupabaseAccount();
    expect(signOutRes.success).toBe(true);
    expect(state.getOnboardingStep()).toBe('auth_method');
    expect(state.isSupabaseAuthenticated()).toBe(false);
  });
});
