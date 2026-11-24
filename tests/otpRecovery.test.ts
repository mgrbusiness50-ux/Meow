import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockResetPasswordForEmail = vi.fn();
const mockVerifyOtp = vi.fn();
const mockUpdateUser = vi.fn();
const mockGetSession = vi.fn();
const mockSignInWithPassword = vi.fn();

vi.mock('../src/services/supabaseClient.ts', () => ({
  isSupabaseConfigured: () => true,
  getSupabaseClient: () => ({
    auth: {
      resetPasswordForEmail: mockResetPasswordForEmail,
      verifyOtp: mockVerifyOtp,
      updateUser: mockUpdateUser,
      getSession: mockGetSession,
      signInWithPassword: mockSignInWithPassword,
    },
  }),
}));

import {
  RECOVERY_OTP_COOLDOWN_SECONDS,
  clearSupabasePasswordRecoveryState,
  isSupabasePasswordRecoveryActive,
  sendPasswordRecoveryOtp,
  signInWithEmailPassword,
  updateSupabasePassword,
  verifyPasswordRecoveryOtp,
} from '../src/services/supabaseAuthService.ts';

describe('Supabase 6-digit OTP password recovery service', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockResetPasswordForEmail.mockReset();
    mockVerifyOtp.mockReset();
    mockUpdateUser.mockReset();
    mockGetSession.mockReset();
    mockSignInWithPassword.mockReset();
    clearSupabasePasswordRecoveryState();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('rejects invalid email before calling Supabase', async () => {
    const res = await sendPasswordRecoveryOtp('not-an-email');
    expect(res.success).toBe(false);
    expect(res.errorCode).toBe('invalid_email');
    expect(mockResetPasswordForEmail).not.toHaveBeenCalled();
  });

  it('sends OTP request, enforces 90s resend cooldown per email, and maps SMTP errors clearly', async () => {
    expect(RECOVERY_OTP_COOLDOWN_SECONDS).toBe(90);
    mockResetPasswordForEmail.mockResolvedValueOnce({ error: null });

    const first = await sendPasswordRecoveryOtp('User.One@Example.com');
    expect(first.success).toBe(true);
    expect(mockResetPasswordForEmail).toHaveBeenCalledWith('user.one@example.com', expect.any(Object));

    const second = await sendPasswordRecoveryOtp('user.one@example.com');
    expect(second.success).toBe(false);
    expect(second.errorCode).toBe('client_cooldown');
    expect(mockResetPasswordForEmail).toHaveBeenCalledTimes(1);

    // Still locked at 89 seconds
    await vi.advanceTimersByTimeAsync(89_000);
    const stillLocked = await sendPasswordRecoveryOtp('user.one@example.com');
    expect(stillLocked.success).toBe(false);
    expect(stillLocked.errorCode).toBe('client_cooldown');
    expect(mockResetPasswordForEmail).toHaveBeenCalledTimes(1);

    // Unlocked right at 90 seconds; test SMTP delivery error mapping
    await vi.advanceTimersByTimeAsync(1_000);
    mockResetPasswordForEmail.mockResolvedValueOnce({
      error: { message: 'Error sending recovery email via SMTP' },
    });
    const smtpFail = await sendPasswordRecoveryOtp('user.one@example.com');
    expect(smtpFail.success).toBe(false);
    expect(smtpFail.errorCode).toBe('email_delivery_failed');
    expect(smtpFail.errorMessage).toContain('SMTP');
    expect(mockResetPasswordForEmail).toHaveBeenCalledTimes(2);
  });

  it('validates 6-digit numeric OTP format before calling verifyOtp', async () => {
    const shortRes = await verifyPasswordRecoveryOtp({
      email: 'user@example.com',
      token: '12345',
    });
    expect(shortRes.success).toBe(false);
    expect(shortRes.errorCode).toBe('invalid_otp_format');
    expect(mockVerifyOtp).not.toHaveBeenCalled();
  });

  it('rejects expired or wrong 6-digit OTP without activating recovery state', async () => {
    mockVerifyOtp.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { code: 'otp_expired', message: 'Token has expired or is invalid' },
    });

    const res = await verifyPasswordRecoveryOtp({
      email: 'expired@example.com',
      token: '999999',
    });
    expect(res.success).toBe(false);
    expect(res.errorCode).toBe('otp_expired');
    expect(res.errorMessage).toContain('انتهت صلاحية رمز التحقق');
    expect(isSupabasePasswordRecoveryActive()).toBe(false);
  });

  it('strips non-digits, verifies 6-digit OTP, updates password with verified session, and allows login', async () => {
    const fakeSession = { access_token: 'tok', user: { id: 'u1', email: 'user@example.com' } };
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: fakeSession.user, session: fakeSession },
      error: null,
    });

    mockVerifyOtp.mockResolvedValueOnce({
      data: { user: fakeSession.user, session: fakeSession },
      error: null,
    });

    const otpRes = await verifyPasswordRecoveryOtp({
      email: 'User@Example.com',
      token: ' 482-910 ',
    });
    expect(otpRes.success).toBe(true);
    expect(otpRes.session).toEqual(fakeSession);
    expect(isSupabasePasswordRecoveryActive()).toBe(true);
    expect(mockVerifyOtp).toHaveBeenCalledWith({
      email: 'user@example.com',
      token: '482910',
      type: 'recovery',
    });

    // Reject weak password before touching updateUser
    const weakPw = await updateSupabasePassword('123');
    expect(weakPw.success).toBe(false);
    expect(weakPw.errorCode).toBe('weak_password');
    expect(mockUpdateUser).not.toHaveBeenCalled();

    // Update password when verified session is active
    mockGetSession
      .mockResolvedValueOnce({ data: { session: fakeSession }, error: null })
      .mockResolvedValueOnce({ data: { session: fakeSession }, error: null });
    mockUpdateUser.mockResolvedValueOnce({ data: { user: fakeSession.user }, error: null });

    const updateRes = await updateSupabasePassword('newStrongPass123');
    expect(updateRes.success).toBe(true);
    expect(isSupabasePasswordRecoveryActive()).toBe(false);
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'newStrongPass123' });

    const loginRes = await signInWithEmailPassword({
      email: 'user@example.com',
      password: 'newStrongPass123',
    });
    expect(loginRes.success).toBe(true);
  });

  it('rejects password update when no verified session exists', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null }, error: null });

    const res = await updateSupabasePassword('newStrongPass123');
    expect(res.success).toBe(false);
    expect(res.errorCode).toBe('session_missing');
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
});

