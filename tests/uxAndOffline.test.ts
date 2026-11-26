import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sanitizeOAuthDisplayName } from '../src/utils/authHelpers.ts';

const flushMicrotasks = async (rounds = 8) => {
  for (let i = 0; i < rounds; i += 1) {
    await Promise.resolve();
  }
};

describe('UX, UI, and Offline resilience improvements', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
    document.body.innerHTML = '';
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.doUnmock('../src/services/supabaseClient.ts');
    vi.doUnmock('../src/services/supabaseAuthService.ts');
    vi.doUnmock('../src/services/supabaseDataService.ts');
    vi.doUnmock('../src/utils/imageUpload.ts');
  });

  it('1. sanitizeOAuthDisplayName rejects email local-parts, @handles, and username-only strings while keeping real names', () => {
    expect(sanitizeOAuthDisplayName('ahmed.cat99', 'ahmed.cat99@gmail.com')).toBe('');
    expect(sanitizeOAuthDisplayName('@ahmed_meow', 'other@gmail.com')).toBe('');
    expect(sanitizeOAuthDisplayName('mo_gamil99', 'other@gmail.com')).toBe('');
    expect(sanitizeOAuthDisplayName('Ahmed99', 'other@gmail.com')).toBe('');
    expect(sanitizeOAuthDisplayName('ahmed@gmail.com', 'ahmed@gmail.com')).toBe('');

    expect(sanitizeOAuthDisplayName('Ahmed Ali', 'ahmed.cat99@gmail.com')).toBe('Ahmed Ali');
    expect(sanitizeOAuthDisplayName('سارة محمد', 'sara.cats@gmail.com')).toBe('سارة محمد');
    expect(sanitizeOAuthDisplayName('  Mohamed Gamil ', 'mg@gmail.com')).toBe('Mohamed Gamil');
  });

  it('2. persists completed session offline snapshot, restores it when profile fetch fails offline, and clears cache on signOut', async () => {
    const userId = '11111111-1111-4111-8111-111111111111';
    const fakeSession = {
      access_token: 'tok-offline-test',
      user: { id: userId, email: 'ahmed@example.com' },
    };

    const fetchBundleMock = vi
      .fn()
      // First boot: online & succeeds -> saves snapshot
      .mockResolvedValueOnce({
        success: true,
        bundle: {
          exists: true,
          profile: {
            id: userId,
            name: 'أحمد علي',
            email: 'ahmed@example.com',
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
      })
      // Second boot: offline network error -> falls back to cached snapshot
      .mockResolvedValueOnce({
        success: false,
        bundle: null,
        errorMessage: 'تعذر حفظ أو جلب بيانات الحساب بسبب مشكلة في الاتصال بالإنترنت.',
      });

    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => true,
      getSupabaseClient: () => null,
    }));
    vi.doMock('../src/services/supabaseAuthService.ts', () => ({
      clearSupabasePasswordRecoveryState: vi.fn(),
      closeExternalAuthBrowserIfOpen: vi.fn(async () => {}),
      fetchSupabaseUserAccountBundle: fetchBundleMock,
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

    const firstMod = await import('../src/state.ts');
    await flushMicrotasks();
    await vi.advanceTimersByTimeAsync(2000);
    expect(firstMod.state.getOnboardingStep()).toBe('completed');
    expect(firstMod.state.getUser().name).toBe('أحمد علي');
    expect(localStorage.getItem(`meow_offline_cache_v1:${userId}`)).not.toBeNull();
    expect(localStorage.getItem('meow_last_user_id_v1')).toBe(userId);

    // Simulate cold launch while offline
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
      signOutFromSupabase: vi.fn(async () => ({ success: true, message: 'ok' })),
      subscribeToSupabaseAuthChanges: vi.fn(() => () => {}),
      updateSupabaseAccountPreferences: vi.fn(),
    }));
    vi.doMock('../src/services/supabaseDataService.ts', () => ({
      hydrateSupabaseWorkspace: vi.fn(async () => ({ success: false })),
      subscribeToSupabaseWorkspaceRealtime: vi.fn(() => () => {}),
    }));

    const secondMod = await import('../src/state.ts');
    await flushMicrotasks();
    await vi.advanceTimersByTimeAsync(2000);

    expect(secondMod.state.getOnboardingStep()).toBe('completed');
    expect(secondMod.state.getUser().name).toBe('أحمد علي');
    const offlineStatus = secondMod.state.getOfflineStatus();
    expect(offlineStatus.isOffline).toBe(true);
    expect(offlineStatus.isUsingCache).toBe(true);

    // Sign out clears stored offline cache
    await secondMod.state.signOutSupabaseAccount();
    expect(localStorage.getItem(`meow_offline_cache_v1:${userId}`)).toBeNull();
    expect(localStorage.getItem('meow_last_user_id_v1')).toBeNull();
    expect(secondMod.state.getOnboardingStep()).toBe('auth_method');
  });

  it('3. ChatView highlights clinics filter with orange active styling and slides #chat-subtab-pill in-place', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const { renderChatView, attachChatEvents } = await import('../src/ui/views/ChatView.ts');

    document.body.innerHTML = `<div id="chat-host">${renderChatView()}</div>`;
    attachChatEvents();

    const host = document.getElementById('chat-host')!;
    const subtabSwitcher = document.getElementById('chat-subtab-switcher')!;
    const initialPill = document.getElementById('chat-subtab-pill') as HTMLElement;
    const initialContent = document.getElementById('chat-tab-content')!;

    expect(initialPill).not.toBeNull();
    expect(initialPill.style.right).toBe('0.25rem');

    // Switch subtab to requests in-place (switcher & pill DOM nodes preserved, pill position moves)
    const requestsBtn = document.getElementById('subtab-requests-btn') as HTMLButtonElement;
    requestsBtn.click();

    expect(document.getElementById('chat-subtab-switcher')).toBe(subtabSwitcher);
    expect(document.getElementById('chat-subtab-pill')).toBe(initialPill);
    expect(document.getElementById('chat-tab-content')).toBe(initialContent);
    expect(initialPill.style.right).toBe('calc(50%)');

    // Click clinics filter -> active orange styling without white background
    const clinicsBtn = host.querySelector('[data-chat-filter="clinics"]') as HTMLButtonElement;
    expect(clinicsBtn).not.toBeNull();
    clinicsBtn.click();

    const updatedClinicsBtn = host.querySelector('[data-chat-filter="clinics"]') as HTMLButtonElement;
    expect(updatedClinicsBtn.classList.contains('bg-brand-orange')).toBe(true);
    expect(updatedClinicsBtn.classList.contains('text-white')).toBe(true);
    expect(updatedClinicsBtn.classList.contains('bg-white')).toBe(false);
  });

  it('4. SavedPetsView switches tabs in-place inside #saved-pets-body without re-creating #saved-pets-modal', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const [{ state }, { renderSavedPetsView, attachSavedPetsEvents }] = await Promise.all([
      import('../src/state.ts'),
      import('../src/ui/views/SavedPetsView.ts'),
    ]);

    state.openSavedPetsView('mating');
    document.body.innerHTML = renderSavedPetsView();
    attachSavedPetsEvents();

    const initialModal = document.getElementById('saved-pets-modal');
    const initialBody = document.getElementById('saved-pets-body');
    expect(initialModal).not.toBeNull();
    expect(initialBody).not.toBeNull();

    const clinicsTabBtn = document.querySelector<HTMLButtonElement>('[data-saved-tab="clinics"]')!;
    clinicsTabBtn.click();

    expect(document.getElementById('saved-pets-modal')).toBe(initialModal);
    expect(document.getElementById('saved-pets-body')).toBe(initialBody);
    expect(initialBody?.textContent).toContain('قسم عيادات المحفوظات مقفول حالياً');
  });

  it('5. ClinicView and StoreView notify buttons have whitespace-nowrap and persist requested state across re-renders', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const [
      { renderClinicView, attachClinicEvents },
      { renderStoreView, attachStoreEvents },
    ] = await Promise.all([
      import('../src/ui/views/ClinicView.ts'),
      import('../src/ui/views/StoreView.ts'),
    ]);

    document.body.innerHTML = renderClinicView();
    attachClinicEvents();
    const clinicBtn = document.getElementById('clinic-notify-btn') as HTMLButtonElement;
    const clinicText = document.getElementById('clinic-notify-text') as HTMLElement;
    expect(clinicBtn.classList.contains('whitespace-nowrap')).toBe(true);
    expect(clinicText.classList.contains('whitespace-nowrap')).toBe(true);

    clinicBtn.click();
    // Re-render ClinicView from state -> should persist "تم تسجيل التنبيه! 🎉"
    document.body.innerHTML = renderClinicView();
    expect(document.getElementById('clinic-notify-text')?.textContent?.trim()).toBe(
      'تم تسجيل التنبيه! 🎉'
    );

    document.body.innerHTML = renderStoreView();
    attachStoreEvents();
    const storeBtn = document.getElementById('store-notify-btn') as HTMLButtonElement;
    const storeText = document.getElementById('store-notify-text') as HTMLElement;
    expect(storeBtn.classList.contains('whitespace-nowrap')).toBe(true);
    expect(storeText.classList.contains('whitespace-nowrap')).toBe(true);

    storeBtn.click();
    document.body.innerHTML = renderStoreView();
    expect(document.getElementById('store-notify-text')?.textContent?.trim()).toBe(
      'تم تسجيل التنبيه! 🎉'
    );
  });

  it('6. PetDetailModal 3-dots menu button omits circular backdrop classes (rounded-full, bg-black/50)', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const { renderPetDetailModal } = await import('../src/ui/modals/PetDetailModal.ts');
    const html = renderPetDetailModal({
      id: 'pet-99',
      ownerId: 'owner-other',
      ownerName: 'كريم',
      ownerAvatar: '',
      name: 'لوزة',
      species: 'cat',
      breed: 'شيرازي',
      ageYears: 1,
      ageMonths: 6,
      gender: 'female',
      status: 'mating',
      photos: ['https://example.com/cat.jpg'],
      vaccinationStatus: 'vaccinated',
      personality: ['لطيف'],
      location: 'القاهرة',
      governorate: 'القاهرة',
      city: 'مدينة نصر',
    });

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const threeDotsBtn = wrapper.querySelector('.meow-more-btn') as HTMLButtonElement | null;
    expect(threeDotsBtn).not.toBeNull();
    expect(threeDotsBtn?.classList.contains('rounded-full')).toBe(false);
    expect(threeDotsBtn?.classList.contains('bg-black/50')).toBe(false);
    expect(threeDotsBtn?.classList.contains('bg-transparent')).toBe(true);
  });

  it('7. ProfileView renderProfileOverlayModals renders elevated #profile-drawer-backdrop (z-[85]) and #drawer-check-updates-btn', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const [{ state }, { renderProfileOverlayModals }] = await Promise.all([
      import('../src/state.ts'),
      import('../src/ui/views/ProfileView.ts'),
    ]);

    state.setSettingsOpen(true);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderProfileOverlayModals();

    const drawerBackdrop = wrapper.querySelector('#profile-drawer-backdrop') as HTMLElement | null;
    const checkUpdatesBtn = wrapper.querySelector('#drawer-check-updates-btn') as HTMLElement | null;

    expect(drawerBackdrop).not.toBeNull();
    expect(drawerBackdrop?.className).toContain('z-[85]');
    expect(checkUpdatesBtn).not.toBeNull();
  });

  it('8. OnboardingView keeps main step container (z-20) above @Meow2026 footer (z-0) and persists pet draft + photo across re-mount', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));
    vi.doMock('../src/utils/imageUpload.ts', () => ({
      processImageFileForUpload: vi.fn(async () => ({
        success: true,
        dataUrl: 'data:image/jpeg;base64,QUJDREVGRw==',
      })),
    }));

    const [{ state }, { renderOnboardingView, attachOnboardingEvents }] = await Promise.all([
      import('../src/state.ts'),
      import('../src/ui/views/OnboardingView.ts'),
    ]);

    state.resetSplashState();
    await vi.advanceTimersByTimeAsync(2000);
    state.setOwnerDetailsCompleted('أحمد', 'القاهرة', '01012345678', 'male', 'القاهرة');
    state.setOnboardingStep('pet_details');

    document.body.innerHTML = renderOnboardingView();
    attachOnboardingEvents();

    // Verify z-index hierarchy between main step container and @Meow2026 footer
    const footer = document.querySelector('footer') as HTMLElement;
    const stepContainer = footer.previousElementSibling as HTMLElement;
    expect(footer.textContent).toContain('@Meow2026');
    expect(footer.className).toContain('z-0');
    expect(stepContainer.className).toContain('z-20');

    // Fill pet name & select cat species
    const catBtn = document.getElementById('pet-type-cat-btn') as HTMLButtonElement;
    catBtn.click();
    const nameInput = document.getElementById('pet-name-input') as HTMLInputElement;
    nameInput.value = 'سمسم';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Upload pet photo into slot 0
    const fileInput = document.querySelector('.pet-photo-file-input[data-photo-slot="0"]') as HTMLInputElement;
    const fakeFile = new File(['abc'], 'cat.jpg', { type: 'image/jpeg' });
    Object.defineProperty(fileInput, 'files', { value: [fakeFile] });
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    await flushMicrotasks();

    const storedRaw = sessionStorage.getItem('meow_onboarding_pet_draft_v1');
    expect(storedRaw).not.toBeNull();
    const storedDraft = JSON.parse(storedRaw!);
    expect(storedDraft.draftPetName).toBe('سمسم');
    expect(storedDraft.selectedPetSpecies).toBe('cat');
    expect(storedDraft.uploadedPetPhotos[0]).toBe('data:image/jpeg;base64,QUJDREVGRw==');

    // Simulate full re-mount with fresh OnboardingView module reading from sessionStorage
    vi.resetModules();
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));
    const [freshStateMod, freshOnboardingMod] = await Promise.all([
      import('../src/state.ts'),
      import('../src/ui/views/OnboardingView.ts'),
    ]);
    freshStateMod.state.resetSplashState();
    await vi.advanceTimersByTimeAsync(2000);
    freshStateMod.state.setOwnerDetailsCompleted(
      'أحمد',
      'القاهرة',
      '01012345678',
      'male',
      'القاهرة'
    );
    freshStateMod.state.setOnboardingStep('pet_details');

    document.body.innerHTML = freshOnboardingMod.renderOnboardingView();
    const restoredNameInput = document.getElementById('pet-name-input') as HTMLInputElement;
    expect(restoredNameInput.value).toBe('سمسم');
    const restoredSlotImg = document.querySelector(
      '[data-onboarding-photo-card="0"] img'
    ) as HTMLImageElement | null;
    expect(restoredSlotImg).not.toBeNull();
    expect(restoredSlotImg?.getAttribute('src')).toBe('data:image/jpeg;base64,QUJDREVGRw==');
  });
});
