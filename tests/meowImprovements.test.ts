import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  extractGoogleRealName,
  isExplicitAuthInvalidError,
  isNetworkOrOfflineError,
} from '../src/utils/authHelpers.ts';

const flushMicrotasks = async (rounds = 10) => {
  for (let i = 0; i < rounds; i += 1) {
    await Promise.resolve();
  }
};

describe('Meow targeted improvements test suite', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
    document.body.innerHTML = '';
    document.body.style.overflow = '';
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => true,
    });
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.doUnmock('../src/services/supabaseClient.ts');
    vi.doUnmock('../src/services/supabaseAuthService.ts');
    vi.doUnmock('../src/services/supabaseDataService.ts');
    vi.doUnmock('../src/services/updateService.ts');
    vi.doUnmock('../src/utils/imageUpload.ts');
  });

  it('1. extractGoogleRealName maps real display names properly without leaking username or email local-part', () => {
    expect(
      extractGoogleRealName({
        email: 'meow.user99@gmail.com',
        user_metadata: {
          full_name: 'Nour Hassan',
          preferred_username: 'meow_user99',
          user_name: '@nour_cat',
        },
      })
    ).toBe('Nour Hassan');

    expect(
      extractGoogleRealName({
        email: 'sara.mohamed@gmail.com',
        user_metadata: {
          given_name: 'Sara',
          family_name: 'Mohamed',
          nickname: 'sara_99',
        },
      })
    ).toBe('Sara Mohamed');

    // When Google metadata only provides username/email-prefix as name, never place it into real name
    expect(
      extractGoogleRealName({
        email: 'catlover2026@gmail.com',
        user_metadata: {
          full_name: 'catlover2026',
          name: '@catlover2026',
          preferred_username: 'catlover2026',
        },
      })
    ).toBe('');

    expect(
      extractGoogleRealName({
        email: 'user@gmail.com',
        user_metadata: {
          name: 'x_player99',
          user_name: 'x_player99',
        },
      })
    ).toBe('');
  });

  it('2. distinguishes transient network errors from explicit auth invalidation and preserves session when offline/network fails', async () => {
    expect(isNetworkOrOfflineError(new Error('Failed to fetch'))).toBe(true);
    expect(isNetworkOrOfflineError({ status: 503, message: 'Service Unavailable' })).toBe(true);
    expect(isExplicitAuthInvalidError({ code: 'invalid_grant', message: 'Invalid Refresh Token' })).toBe(true);
    expect(isExplicitAuthInvalidError({ status: 401, message: 'Unauthorized' })).toBe(true);
    expect(isExplicitAuthInvalidError(new Error('Failed to fetch'))).toBe(false);

    const userId = '22222222-2222-4222-8222-222222222222';
    const fakeSession = {
      access_token: 'tok-persist-session',
      user: { id: userId, email: 'mona@example.com' },
    };

    const getCurrentSessionMock = vi
      .fn()
      .mockResolvedValueOnce({
        configured: true,
        session: fakeSession,
        user: fakeSession.user,
        isPasswordRecovery: false,
      })
      .mockResolvedValueOnce({
        configured: true,
        session: null,
        user: null,
        isPasswordRecovery: false,
        errorMessage: 'Failed to fetch',
      });

    const fetchBundleMock = vi
      .fn()
      .mockResolvedValueOnce({
        success: true,
        bundle: {
          exists: true,
          profile: {
            id: userId,
            name: 'منى طارق',
            email: 'mona@example.com',
            phone: '01099887766',
            city: 'الجيزة',
            governorate: 'الجيزة',
            gender: 'female',
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
      });

    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => true,
      getSupabaseClient: () => null,
    }));
    vi.doMock('../src/services/supabaseAuthService.ts', () => ({
      clearSupabasePasswordRecoveryState: vi.fn(),
      closeExternalAuthBrowserIfOpen: vi.fn(async () => {}),
      fetchSupabaseUserAccountBundle: fetchBundleMock,
      getCurrentSupabaseSession: getCurrentSessionMock,
      handleSupabaseAuthCallbackUrl: vi.fn(async () => ({ handled: false })),
      isSupabaseAuthCallbackUrl: vi.fn(() => false),
      isSupabasePasswordRecoveryActive: vi.fn(() => false),
      saveSupabaseUserAccountBundle: vi.fn(),
      signOutFromSupabase: vi.fn(async () => ({ success: true, message: 'ok' })),
      subscribeToSupabaseAuthChanges: vi.fn(() => () => {}),
      updateSupabaseAccountPreferences: vi.fn(),
    }));
    vi.doMock('../src/services/supabaseDataService.ts', () => ({
      hydrateSupabaseWorkspace: vi.fn(async () => ({
        success: true,
        data: {
          userPets: [],
          userGroupAdoptionListing: null,
          matingPets: [],
          adoptionPets: [],
          savedPetIds: [],
          contactRequests: [],
          conversations: [],
          notifications: [],
          healthRecords: [],
          blockedUsers: [],
          reports: [],
          customStickers: [],
        },
      })),
      subscribeToSupabaseWorkspaceRealtime: vi.fn(() => () => {}),
    }));

    // Boot 1 (online): saves snapshot
    const firstStateMod = await import('../src/state.ts');
    await flushMicrotasks();
    await vi.advanceTimersByTimeAsync(2000);
    expect(firstStateMod.state.getOnboardingStep()).toBe('completed');
    expect(firstStateMod.state.getUser().name).toBe('منى طارق');

    // Boot 2 (network failure while getCurrentSupabaseSession returns null + 'Failed to fetch'): restores snapshot without signing out
    vi.resetModules();
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => true,
      getSupabaseClient: () => null,
    }));
    vi.doMock('../src/services/supabaseAuthService.ts', () => ({
      clearSupabasePasswordRecoveryState: vi.fn(),
      closeExternalAuthBrowserIfOpen: vi.fn(async () => {}),
      fetchSupabaseUserAccountBundle: fetchBundleMock,
      getCurrentSupabaseSession: getCurrentSessionMock,
      handleSupabaseAuthCallbackUrl: vi.fn(async () => ({ handled: false })),
      isSupabaseAuthCallbackUrl: vi.fn(() => false),
      isSupabasePasswordRecoveryActive: vi.fn(() => false),
      saveSupabaseUserAccountBundle: vi.fn(),
      signOutFromSupabase: vi.fn(async () => ({ success: true, message: 'ok' })),
      subscribeToSupabaseAuthChanges: vi.fn(() => () => {}),
      updateSupabaseAccountPreferences: vi.fn(),
    }));
    vi.doMock('../src/services/supabaseDataService.ts', () => ({
      hydrateSupabaseWorkspace: vi.fn(async () => ({ success: false })),
      subscribeToSupabaseWorkspaceRealtime: vi.fn(() => () => {}),
    }));

    const secondStateMod = await import('../src/state.ts');
    await flushMicrotasks();
    await vi.advanceTimersByTimeAsync(2000);

    expect(secondStateMod.state.getOnboardingStep()).toBe('completed');
    expect(secondStateMod.state.getUser().name).toBe('منى طارق');
    expect(secondStateMod.state.getOfflineStatus().isUsingCache).toBe(true);
  });

  it('3. AddPetModal persists draft across reloads, shows instant preview + progress, revokes object URL, and keeps previous photo on upload failure', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const revokeSpy = vi.fn();
    let uploadCall = 0;
    let resolveSecondUpload: ((val: { success: false; errorMessage: string }) => void) | null = null;

    vi.doMock('../src/utils/imageUpload.ts', () => ({
      createSafeObjectPreviewUrl: vi.fn(() => 'blob:mock-preview-1'),
      revokeSafeObjectPreviewUrl: revokeSpy,
      processImageFileForUpload: vi.fn(
        async (_file: File, opts?: { onProgress?: (pct: number) => void }) => {
          uploadCall += 1;
          opts?.onProgress?.(55);
          if (uploadCall === 1) {
            return { success: true, dataUrl: 'data:image/jpeg;base64,VALID1' };
          }
          return await new Promise<{ success: false; errorMessage: string }>((resolve) => {
            resolveSecondUpload = resolve;
          });
        }
      ),
    }));

    const [{ state }, addPetMod] = await Promise.all([
      import('../src/state.ts'),
      import('../src/ui/modals/AddPetModal.ts'),
    ]);

    state.resetSplashState();
    await vi.advanceTimersByTimeAsync(2500);
    state.setTermsAccepted(true, true);
    state.completeGoogleAuthentication(
      { uid: 'test-uid-addpet', displayName: 'أحمد', email: 'ahmed@example.com', photoURL: '' },
      'signup'
    );
    state.setOwnerDetailsCompleted('أحمد', 'القاهرة', '01012345678', 'male', 'القاهرة');
    state.setOnboardingStep('completed');
    state.setAddPetModalVisible(true, null);

    document.body.innerHTML = addPetMod.renderAddPetModal(null);
    addPetMod.attachAddPetModalEvents(null);

    const nameInput = document.getElementById('form-pet-name') as HTMLInputElement;
    nameInput.value = 'مشمش';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));

    const fileInput = document.querySelector('.add-pet-photo-input[data-photo-slot="0"]') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', {
      configurable: true,
      value: [new File(['img1'], 'cat1.jpg', { type: 'image/jpeg' })],
    });
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    await flushMicrotasks();

    expect(revokeSpy).toHaveBeenCalledWith('blob:mock-preview-1');
    const savedDraftRaw = localStorage.getItem('meow_add_pet_modal_draft_v1');
    expect(savedDraftRaw).not.toBeNull();
    const parsedDraft = JSON.parse(savedDraftRaw!);
    expect(parsedDraft.isOpen).toBe(true);
    expect(parsedDraft.name).toBe('مشمش');
    expect(parsedDraft.photos[0]).toBe('data:image/jpeg;base64,VALID1');

    // Start a second upload on slot 0 -> verify progress indicator & preview while pending, then fail and confirm VALID1 is preserved
    Object.defineProperty(fileInput, 'files', {
      configurable: true,
      value: [new File(['img2'], 'cat2.jpg', { type: 'image/jpeg' })],
    });
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    await flushMicrotasks();

    const slotCard = document.querySelector('[data-photo-slot-card="0"]')!;
    expect(slotCard.textContent).toContain('55%');
    expect(slotCard.innerHTML).toContain('blob:mock-preview-1');

    resolveSecondUpload?.({ success: false, errorMessage: 'فشل مؤقت' });
    await flushMicrotasks();

    expect(slotCard.innerHTML).toContain('data:image/jpeg;base64,VALID1');

    // Simulate WebView kill & reload -> restoreAddPetModalDraftOnStartup reopens modal with saved name & photo
    vi.resetModules();
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));
    const [{ state: state2 }, addPetMod2] = await Promise.all([
      import('../src/state.ts'),
      import('../src/ui/modals/AddPetModal.ts'),
    ]);
    state2.resetSplashState();
    await vi.advanceTimersByTimeAsync(2500);
    state2.setTermsAccepted(true, true);
    state2.completeGoogleAuthentication(
      { uid: 'test-uid-addpet', displayName: 'أحمد', email: 'ahmed@example.com', photoURL: '' },
      'signup'
    );
    state2.setOwnerDetailsCompleted('أحمد', 'القاهرة', '01012345678', 'male', 'القاهرة');
    state2.setOnboardingStep('completed');

    addPetMod2.restoreAddPetModalDraftOnStartup();
    expect(state2.isAddPetModalVisible()).toBe(true);
    const restoredHtml = addPetMod2.renderAddPetModal(null);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = restoredHtml;
    expect((wrapper.querySelector('#form-pet-name') as HTMLInputElement).value).toBe('مشمش');
    expect(wrapper.querySelector('[data-photo-slot-card="0"]')?.innerHTML).toContain('data:image/jpeg;base64,VALID1');
  });

  it('4. TabBar smoothly scrolls to top only on active tab re-tap, while MeowApp preserves per-tab scroll positions and syncs sliding pill', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const [{ state }, { MeowApp }, { syncTabBarActiveIndicator }] = await Promise.all([
      import('../src/state.ts'),
      import('../src/ui/App.ts'),
      import('../src/ui/components/TabBar.ts'),
    ]);

    state.resetSplashState();
    await vi.advanceTimersByTimeAsync(2500);
    state.setTermsAccepted(true, true);
    state.completeGoogleAuthentication(
      { uid: 'test-uid-tabs', displayName: 'أحمد', email: 'ahmed@example.com', photoURL: '' },
      'signup'
    );
    state.setOwnerDetailsCompleted('أحمد', 'القاهرة', '01012345678', 'male', 'القاهرة');
    state.setOnboardingStep('completed');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const app = new MeowApp(root);
    app.init();

    // Simulate scrolled down on mating tab
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 320 });
    (window.scrollTo as ReturnType<typeof vi.fn>).mockClear();

    // Re-tap active tab ('mating') -> smooth scroll to top
    const matingTabBtn = document.querySelector<HTMLButtonElement>('.tab-btn[data-tab-id="mating"]')!;
    matingTabBtn.click();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

    // Switch to 'adoption' tab -> should save mating's scrollY (320) and scroll adoption to 0
    (window.scrollTo as ReturnType<typeof vi.fn>).mockClear();
    const adoptionTabBtn = document.querySelector<HTMLButtonElement>('.tab-btn[data-tab-id="adoption"]')!;
    adoptionTabBtn.click();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });

    // Switch back to 'mating' -> should restore mating's saved scrollY (320)
    (window.scrollTo as ReturnType<typeof vi.fn>).mockClear();
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 40 });
    document.querySelector<HTMLButtonElement>('.tab-btn[data-tab-id="mating"]')!.click();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 320, behavior: 'auto' });

    // Sliding pill tracks drag progress smoothly and resets on zero
    syncTabBarActiveIndicator(0.4);
    const pill = document.getElementById('tabbar-active-pill') as HTMLElement;
    expect(pill.style.transition).toBe('none');
    expect(pill.style.right).toContain('6.66');
    syncTabBarActiveIndicator(0);
    expect(pill.style.transition).toBe('');
  });

  it('5. Profile drawer stays mounted without replaying entrance animation when toggling switches or opening sub-modals, and locks body scroll', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const [{ state }, { MeowApp }] = await Promise.all([
      import('../src/state.ts'),
      import('../src/ui/App.ts'),
    ]);

    state.resetSplashState();
    await vi.advanceTimersByTimeAsync(2500);
    state.setTermsAccepted(true, true);
    state.completeGoogleAuthentication(
      { uid: 'test-uid-drawer', displayName: 'أحمد', email: 'ahmed@example.com', photoURL: '' },
      'signup'
    );
    state.setOwnerDetailsCompleted('أحمد', 'القاهرة', '01012345678', 'male', 'القاهرة');
    state.setOnboardingStep('completed');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const app = new MeowApp(root);
    app.init();

    state.setSettingsOpen(true);
    const initialPanel = document.getElementById('profile-drawer-panel') as HTMLElement;
    const initialBackdrop = document.getElementById('profile-drawer-backdrop') as HTMLElement;
    expect(initialPanel).not.toBeNull();
    expect(initialPanel.classList.contains('meow-drawer-enter-rtl')).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');

    // Toggle notifications & show-phone inside drawer -> same panel DOM node preserved, entrance animation stripped
    document.getElementById('drawer-notifications-toggle')!.click();
    expect(document.getElementById('profile-drawer-panel')).toBe(initialPanel);
    expect(initialPanel.classList.contains('meow-drawer-enter-rtl')).toBe(false);

    document.getElementById('drawer-show-phone-toggle')!.click();
    expect(document.getElementById('profile-drawer-panel')).toBe(initialPanel);

    // Open Blocked Users sub-modal -> drawer panel stays untouched in #app-profile-drawer-slot
    document.querySelector<HTMLButtonElement>('[data-drawer-action="blocked"]')!.click();
    expect(document.getElementById('profile-drawer-panel')).toBe(initialPanel);
    expect(document.getElementById('drawer-submodal-backdrop')).not.toBeNull();
    document.getElementById('close-drawer-submodal-btn')!.click();
    expect(document.getElementById('profile-drawer-panel')).toBe(initialPanel);

    // Close drawer via backdrop click -> keeps pointer-events-auto during exit and unlocks body scroll
    initialBackdrop.click();
    expect(initialBackdrop.classList.contains('pointer-events-auto')).toBe(true);
    await vi.advanceTimersByTimeAsync(220);
    expect(state.isSettingsOpen()).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('6. SavedPetsView moves #saved-tab-pill across all 4 tabs and ChatView slides #req-direction-pill in-place', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const [
      { state },
      { renderSavedPetsView, attachSavedPetsEvents },
      { renderChatView, attachChatEvents },
    ] = await Promise.all([
      import('../src/state.ts'),
      import('../src/ui/views/SavedPetsView.ts'),
      import('../src/ui/views/ChatView.ts'),
    ]);

    // SavedPets 4-tab sliding pill
    state.openSavedPetsView('mating');
    document.body.innerHTML = renderSavedPetsView();
    attachSavedPetsEvents();

    const savedPill = document.getElementById('saved-tab-pill') as HTMLElement;
    expect(savedPill.style.right).toBe('0.375rem');

    document.querySelector<HTMLButtonElement>('[data-saved-tab="adoption"]')!.click();
    expect(document.getElementById('saved-tab-pill')).toBe(savedPill);
    expect(savedPill.style.right).toBe('calc(25% + 0.1875rem)');

    document.querySelector<HTMLButtonElement>('[data-saved-tab="clinics"]')!.click();
    expect(savedPill.style.right).toBe('calc(50%)');

    document.querySelector<HTMLButtonElement>('[data-saved-tab="store"]')!.click();
    expect(savedPill.style.right).toBe('calc(75% - 0.1875rem)');

    // ChatView requests direction pill (الواردة / الصادرة)
    document.body.innerHTML = `<div id="chat-host">${renderChatView()}</div>`;
    attachChatEvents();
    document.getElementById('subtab-requests-btn')!.click();

    const reqSwitcher = document.getElementById('req-direction-switcher')!;
    const reqPill = document.getElementById('req-direction-pill') as HTMLElement;
    const reqListBody = document.getElementById('chat-requests-list-body')!;
    expect(reqPill.style.right).toBe('0.25rem');

    document.querySelector<HTMLButtonElement>('[data-req-direction="outgoing"]')!.click();
    expect(document.getElementById('req-direction-switcher')).toBe(reqSwitcher);
    expect(document.getElementById('chat-requests-list-body')).toBe(reqListBody);
    expect(reqPill.style.right).toBe('calc(50%)');
    expect(reqListBody.textContent).toContain('لم ترسل أي طلبات تواصل بعد');
  });

  it('7. OnboardingView and AddPetModal enforce autofill suppression and Header row 2 keeps compact chips in order', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const [{ state }, { renderOnboardingView }, { renderAddPetModal }, { renderHeader }] =
      await Promise.all([
        import('../src/state.ts'),
        import('../src/ui/views/OnboardingView.ts'),
        import('../src/ui/modals/AddPetModal.ts'),
        import('../src/ui/components/Header.ts'),
      ]);

    state.resetSplashState();
    await vi.advanceTimersByTimeAsync(2500);
    state.setTermsAccepted(true, true);
    state.completeGoogleAuthentication(
      { uid: 'test-uid-autofill', displayName: 'أحمد', email: 'ahmed@example.com', photoURL: '' },
      'signup'
    );
    state.setOnboardingStep('owner_details');
    const ownerWrap = document.createElement('div');
    ownerWrap.innerHTML = renderOnboardingView();
    const ownerName = ownerWrap.querySelector('#owner-full-name-input') as HTMLInputElement;
    const ownerPhone = ownerWrap.querySelector('#owner-phone-number-input') as HTMLInputElement;
    expect(ownerName.getAttribute('autocomplete')).toBe('off');
    expect(ownerName.getAttribute('data-lpignore')).toBe('true');
    expect(ownerName.getAttribute('data-form-type')).toBe('other');
    expect(ownerPhone.getAttribute('autocomplete')).toBe('off');
    expect(ownerPhone.getAttribute('data-1p-ignore')).toBe('true');

    const petModalWrap = document.createElement('div');
    petModalWrap.innerHTML = renderAddPetModal(null);
    const modalPetName = petModalWrap.querySelector('#form-pet-name') as HTMLInputElement;
    expect(modalPetName.getAttribute('autocomplete')).toBe('off');
    expect(modalPetName.getAttribute('data-lpignore')).toBe('true');
    expect(modalPetName.getAttribute('data-form-type')).toBe('other');

    state.setOwnerDetailsCompleted('أحمد', 'القاهرة', '01012345678', 'male', 'القاهرة');
    state.setOnboardingStep('completed');
    const headerWrap = document.createElement('div');
    headerWrap.innerHTML = renderHeader();
    const filterBtn = headerWrap.querySelector('#filter-toggle-btn') as HTMLButtonElement;
    const speciesBtns = Array.from(
      headerWrap.querySelectorAll<HTMLButtonElement>('.category-species-btn')
    );
    expect(filterBtn.className).toContain('min-h-[36px]');
    expect(speciesBtns.map((b) => b.getAttribute('data-species-tab'))).toEqual(['all', 'cat', 'dog']);
    speciesBtns.forEach((btn) => {
      expect(btn.className).toContain('min-h-[36px]');
    });
  });
});
