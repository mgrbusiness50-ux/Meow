import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Conversation, CustomStickerModel, Pet } from '../src/types.ts';

const flushMicrotasks = async (rounds = 8) => {
  for (let i = 0; i < rounds; i += 1) {
    await Promise.resolve();
  }
};

function makePet(overrides: Partial<Pet> = {}): Pet {
  return {
    id: overrides.id ?? 'pet-other-1',
    ownerId: overrides.ownerId ?? 'owner-other-1',
    ownerName: overrides.ownerName ?? 'كريم محمد',
    ownerAvatar: overrides.ownerAvatar ?? '',
    ownerPrivacy: overrides.ownerPrivacy ?? 'private',
    ownerShowPhone: overrides.ownerShowPhone ?? false,
    name: overrides.name ?? 'لوزة',
    species: overrides.species ?? 'cat',
    breed: overrides.breed ?? 'شيرازي',
    ageYears: overrides.ageYears ?? 1,
    ageMonths: overrides.ageMonths ?? 6,
    gender: overrides.gender ?? 'female',
    status: overrides.status ?? 'mating',
    photos: overrides.photos ?? ['https://example.com/cat.jpg'],
    vaccinationStatus: overrides.vaccinationStatus ?? 'vaccinated',
    personality: overrides.personality ?? ['لطيفة', 'هادئة'],
    location: overrides.location ?? 'القاهرة • مدينة نصر',
    governorate: overrides.governorate ?? 'القاهرة',
    city: overrides.city ?? 'مدينة نصر',
    createdAt: overrides.createdAt ?? '2026-10-01T10:00:00.000Z',
    ...overrides,
  };
}

describe('Meow UX/UI, Realtime Chat, Mating, Saved Pets, and OTA Enhancements', () => {
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
    if (!Element.prototype.scrollIntoView) {
      Element.prototype.scrollIntoView = vi.fn();
    }
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.doUnmock('../src/services/supabaseClient.ts');
    vi.doUnmock('../src/services/supabaseAuthService.ts');
    vi.doUnmock('../src/services/supabaseDataService.ts');
    vi.doUnmock('../src/services/supabaseChatService.ts');
  });

  it('1. OTA checkForUpdates treats 404 manifests as up_to_date and shows Arabic feedback without error', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: false,
      status: 404,
      json: async () => ({}),
    }));
    vi.stubGlobal('fetch', fetchMock);
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const { checkForUpdates } = await import('../src/services/updateService.ts');
    const directRes = await checkForUpdates({
      baseUrl: 'https://updates.example.com',
      channel: 'production',
      currentNativeVersion: '1.2.0',
      currentBuildNumber: 2,
      currentBundleVersion: '1.2.0',
    });

    expect(directRes.configured).toBe(true);
    expect(directRes.status).toBe('up_to_date');
    expect(directRes.errorMessage).toBeUndefined();

    // Also verify through state.checkForAppUpdates(true)
    const { state } = await import('../src/state.ts');
    // Stub Vite/env base url via checkForUpdates mock only for default url fallback if empty
    const stateRes = await state.checkForAppUpdates(true);
    expect(state.getUpdateState().feedback?.message).toBe('مفيش تحديثات جديدة حاليًا');
    expect(stateRes.errorMessage).toBeUndefined();
  });

  it('2. Excludes accepted requests from pending lists, sends دااووووووووود once on mating approval, and blocks incompatible mating targets', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const { state, AUTO_MATING_GREETING_TEXT } = await import('../src/state.ts');
    state.resetSplashState();
    await vi.advanceTimersByTimeAsync(2000);
    state.setOwnerDetailsCompleted('أحمد', 'القاهرة', '01012345678', 'male', 'القاهرة');

    const myMaleCat = state.savePet({
      id: 'my-cat-1',
      name: 'مشمش',
      species: 'cat',
      breed: 'شيرازي',
      gender: 'male',
      status: 'mating',
      ageYears: 2,
      ageMonths: 0,
      color: 'برتقالي',
      photos: ['https://example.com/mycat.jpg'],
      vaccinationStatus: 'vaccinated',
      personality: ['هادي'],
    });

    const compatibleFemaleCat = makePet({
      id: 'compat-cat',
      ownerId: 'owner-sara',
      ownerName: 'سارة',
      species: 'cat',
      gender: 'female',
      status: 'mating',
    });
    const incompatibleDog = makePet({
      id: 'dog-target',
      ownerId: 'owner-ali',
      ownerName: 'علي',
      name: 'روكي',
      species: 'dog',
      gender: 'female',
      status: 'mating',
    });
    const incompatibleMaleCat = makePet({
      id: 'male-cat-target',
      ownerId: 'owner-mona',
      ownerName: 'منى',
      name: 'بندق',
      species: 'cat',
      gender: 'male',
      status: 'mating',
    });

    // Inject discovery pets & enable recommended match for user's male cat
    (state as unknown as { matingPets: Pet[] }).matingPets = [
      compatibleFemaleCat,
      incompatibleDog,
      incompatibleMaleCat,
    ];
    state.setMatingRecommendedMode(true, myMaleCat.id);
    const filteredMating = state.getFilteredMatingPets();
    expect(filteredMating.map((p) => p.id)).toEqual(['compat-cat']);

    // Outgoing request lifecycle + incoming mating approval sending AUTO_MATING_GREETING_TEXT once
    const outgoingReq = state.sendContactRequest(compatibleFemaleCat, 'ممكن تزاوج؟', myMaleCat.id);
    expect(state.getOutgoingContactRequests().some((r) => r.id === outgoingReq.id)).toBe(true);
    outgoingReq.status = 'accepted';
    expect(state.getOutgoingContactRequests().some((r) => r.id === outgoingReq.id)).toBe(false);

    // Incoming mating request from Sara
    const incomingReqId = 'req-incoming-mating-1';
    const internalRequests = (
      state as unknown as { contactRequests: ReturnType<typeof state.getContactRequests> }
    ).contactRequests;
    internalRequests.unshift({
      id: incomingReqId,
      senderId: 'owner-sara',
      senderName: 'سارة',
      senderAvatar: '',
      senderPetId: compatibleFemaleCat.id,
      senderPetName: compatibleFemaleCat.name,
      senderPet: compatibleFemaleCat,
      receiverOwnerId: state.getUser().id,
      receiverPetId: myMaleCat.id,
      receiverPetName: myMaleCat.name,
      receiverPet: myMaleCat,
      message: 'أهلاً، حابين ننسق تزاوج لمشمش',
      type: 'mating',
      status: 'pending',
      isWithdrawn: false,
      timestamp: 'الآن',
    });

    expect(state.getIncomingContactRequests().some((r) => r.id === incomingReqId)).toBe(true);
    state.approveContactRequest(incomingReqId);
    await flushMicrotasks();

    // Accepted request is removed from pending incoming list
    expect(state.getIncomingContactRequests().some((r) => r.id === incomingReqId)).toBe(false);

    const conv = state.getActiveConversation();
    expect(conv).not.toBeNull();
    const greetingMsgs = conv!.messages.filter(
      (m) => (m.text || '').trim() === AUTO_MATING_GREETING_TEXT
    );
    expect(greetingMsgs).toHaveLength(1);
    expect(greetingMsgs[0].text).toBe('دااووووووووود');

    // Calling celebration/greeting logic again will NOT duplicate دااووووووووود
    expect(state.triggerMatingCelebrationIfNeeded(conv!)).toBe(false);
    expect(
      conv!.messages.filter((m) => (m.text || '').trim() === AUTO_MATING_GREETING_TEXT)
    ).toHaveLength(1);
  });

  it('3. PetDetailModal removes top individual status badge and renders exact CTAs per relationship state', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const [{ state }, { renderPetDetailModal }] = await Promise.all([
      import('../src/state.ts'),
      import('../src/ui/modals/PetDetailModal.ts'),
    ]);

    const otherPet = makePet({ id: 'rel-pet-1', ownerId: 'owner-rel-1', status: 'mating' });

    // a) none -> #modal-open-confirmation-btn + no top status pill ("متاح للتزاوج" not present inside profile details)
    const noneHtml = renderPetDetailModal(otherPet);
    expect(noneHtml).toContain('id="modal-open-confirmation-btn"');
    expect(noneHtml).toContain('bg-transparent');
    expect(noneHtml).not.toContain('متاح للتزاوج ❤️');

    // b) owner -> no request CTA button
    const ownPet = makePet({ id: 'rel-own-pet', ownerId: state.getUser().id, status: 'adoption' });
    const ownerHtml = renderPetDetailModal(ownPet);
    expect(ownerHtml).not.toContain('id="modal-open-confirmation-btn"');
    expect(ownerHtml).toContain('هذا الأليف مسجل ضمن حسابك الشخصي');

    // c) outgoing_pending -> #modal-withdraw-request-btn
    const outReq = state.sendContactRequest(otherPet, 'مرحبا');
    const outHtml = renderPetDetailModal(otherPet);
    expect(outHtml).toContain('id="modal-withdraw-request-btn"');

    // d) incoming_pending -> #modal-approve-request-btn + #modal-reject-request-btn
    state.withdrawContactRequest(outReq.id);
    (
      state as unknown as { contactRequests: ReturnType<typeof state.getContactRequests> }
    ).contactRequests.unshift({
      id: 'incoming-rel-req',
      senderId: 'owner-rel-1',
      senderName: 'كريم محمد',
      senderAvatar: '',
      receiverOwnerId: state.getUser().id,
      receiverPetId: otherPet.id,
      receiverPetName: otherPet.name,
      receiverPet: otherPet,
      message: 'حابب أتواصل',
      type: 'mating',
      status: 'pending',
      isWithdrawn: false,
      timestamp: 'الآن',
    });
    const incomingHtml = renderPetDetailModal(otherPet);
    expect(incomingHtml).toContain('id="modal-approve-request-btn"');
    expect(incomingHtml).toContain('id="modal-reject-request-btn"');

    // e) accepted -> #modal-open-chat-btn
    state.approveContactRequest('incoming-rel-req');
    await flushMicrotasks();
    const acceptedHtml = renderPetDetailModal(otherPet);
    expect(acceptedHtml).toContain('id="modal-open-chat-btn"');
  });

  it('4. ProfileView pet status toggle sets pending confirmation and shouldHideTabBar hides bar during modals & active chat', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const [{ state }, { renderProfileView, attachProfileEvents }, { shouldHideTabBar }] =
      await Promise.all([
        import('../src/state.ts'),
        import('../src/ui/views/ProfileView.ts'),
        import('../src/ui/components/TabBar.ts'),
      ]);

    const myPet = state.savePet({
      id: 'profile-pet-1',
      name: 'بندق',
      species: 'cat',
      breed: 'بلدي',
      gender: 'male',
      status: 'mating',
      ageYears: 1,
      ageMonths: 2,
      color: 'أسود',
      photos: ['https://example.com/cat.jpg'],
      vaccinationStatus: 'vaccinated',
      personality: ['ودود'],
    });

    state.setCurrentTab('profile');
    expect(shouldHideTabBar()).toBe(false);

    document.body.innerHTML = renderProfileView();
    attachProfileEvents();

    const toggleBtn = document.querySelector<HTMLButtonElement>(
      `.pet-status-toggle-btn[data-pet-id="${myPet.id}"][data-target-status="not_available"]`
    );
    expect(toggleBtn).not.toBeNull();
    toggleBtn!.click();

    expect(state.getPendingStatusChange()?.pet.id).toBe(myPet.id);
    expect(state.getPendingStatusChange()?.targetStatus).toBe('not_available');
    expect(shouldHideTabBar()).toBe(true);

    state.cancelPetStatusChange();
    expect(shouldHideTabBar()).toBe(false);

    // Active chat room hides bottom TabBar
    const conv: Conversation = {
      id: 'conv-tabbar-hide',
      requestId: 'req-tabbar-hide',
      otherUserId: 'u2',
      otherUserName: 'منى',
      otherUserAvatar: '',
      petId: 'p2',
      petName: 'كوكو',
      petPhoto: '',
      petType: 'adoption',
      lastMessage: 'أهلاً',
      lastMessageTime: 'الآن',
      unreadCount: 0,
      ownerPrivacy: 'private',
      isPinned: false,
      messages: [],
    };
    (state as unknown as { conversations: Conversation[] }).conversations = [conv];
    state.setCurrentTab('chat');
    expect(shouldHideTabBar()).toBe(false);

    state.setActiveConversationId(conv.id);
    expect(shouldHideTabBar()).toBe(true);
  });

  it('5. AdoptionView removes redundant marketing strings, keeps clean title, and attachPullToRefresh renders containerless 3-dot loader', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const [{ renderAdoptionView }, { attachPullToRefresh }] = await Promise.all([
      import('../src/ui/views/AdoptionView.ts'),
      import('../src/utils/touchGestures.ts'),
    ]);

    const html = renderAdoptionView();
    expect(html).toContain('امنح حيوانًا أليفًا بيتًا دافئًا ومستقرًا');
    expect(html).not.toContain('تبني رحيم وآمن');
    expect(html).not.toContain('بدون أي مقابل مالي 💛');
    expect(html).not.toContain('تصفح الحالات الفردية');
    expect(html).toContain('meow-floating-hearts');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const onRefresh = vi.fn();
    attachPullToRefresh(root, { onRefresh });

    const touchStart = new Event('touchstart', { bubbles: true }) as TouchEvent;
    Object.defineProperty(touchStart, 'touches', { value: [{ clientX: 100, clientY: 20 }] });
    root.dispatchEvent(touchStart);

    const touchMove = new Event('touchmove', { bubbles: true, cancelable: true }) as TouchEvent;
    Object.defineProperty(touchMove, 'touches', { value: [{ clientX: 100, clientY: 160 }] });
    root.dispatchEvent(touchMove);

    const indicator = document.getElementById('meow-ptr-indicator')!;
    expect(indicator).not.toBeNull();
    expect(indicator.className).not.toContain('rounded-full');
    expect(indicator.className).not.toContain('bg-white');
    const dots = indicator.querySelector('.meow-ptr-dots');
    expect(dots).not.toBeNull();
    expect(dots!.querySelectorAll('span')).toHaveLength(3);
  });

  it('6. Zero-flash heart save & SavedPetsView in-place removal do not re-create feed or modal DOM', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const [{ state }, { renderAdoptionView, attachAdoptionEvents }, { renderSavedPetsView, attachSavedPetsEvents }] =
      await Promise.all([
        import('../src/state.ts'),
        import('../src/ui/views/AdoptionView.ts'),
        import('../src/ui/views/SavedPetsView.ts'),
      ]);

    const adoptPet = makePet({
      id: 'adopt-zero-flash-1',
      ownerId: 'owner-adopt-1',
      name: 'كراميل',
      status: 'adoption',
      adoptionType: 'individual',
    });
    (state as unknown as { adoptionPets: Pet[] }).adoptionPets = [adoptPet];

    document.body.innerHTML = `<div id="drawer-saved-pets-btn"><span class="rounded-full">${state.getSavedCount()}</span></div>${renderAdoptionView()}`;
    attachAdoptionEvents();

    const feedRoot = document.getElementById('adoption-view-root')!;
    const saveBtn = document.querySelector<HTMLButtonElement>(
      `.toggle-save-pet-btn[data-pet-save-id="${adoptPet.id}"]`
    )!;
    const notifyListener = vi.fn();
    state.subscribe(notifyListener);

    saveBtn.click();

    // DOM node preserved & updated silently without firing full-app re-render
    expect(document.getElementById('adoption-view-root')).toBe(feedRoot);
    expect(state.isPetSaved(adoptPet.id)).toBe(true);
    expect(saveBtn.getAttribute('aria-pressed')).toBe('true');
    expect(document.querySelector('#drawer-saved-pets-btn span.rounded-full')?.textContent).toBe('1');
    expect(notifyListener).not.toHaveBeenCalled();

    // SavedPetsView removes saved card in-place without replacing #saved-pets-modal
    state.openSavedPetsView('adoption');
    document.body.innerHTML = renderSavedPetsView();
    attachSavedPetsEvents();

    const modalEl = document.getElementById('saved-pets-modal')!;
    const removeBtn = document.querySelector<HTMLButtonElement>(
      `.remove-saved-pet-btn[data-pet-save-id="${adoptPet.id}"]`
    )!;
    removeBtn.click();

    expect(document.getElementById('saved-pets-modal')).toBe(modalEl);
    expect(state.isPetSaved(adoptPet.id)).toBe(false);
    expect(
      document.querySelector(`.remove-saved-pet-btn[data-pet-save-id="${adoptPet.id}"]`)
    ).toBeNull();
  });

  it('7. MeowApp + ChatView patches active room in-place keeping input focus/draft, and supports search, reply, soft-delete, mute, and sticker tabs', async () => {
    vi.doMock('../src/services/supabaseClient.ts', () => ({
      isSupabaseConfigured: () => false,
    }));

    const [{ state }, { MeowApp }] = await Promise.all([
      import('../src/state.ts'),
      import('../src/ui/App.ts'),
    ]);

    state.resetSplashState();
    await vi.advanceTimersByTimeAsync(3500);
    state.setTermsAccepted(true, true);
    state.completeGoogleAuthentication(
      {
        uid: 'test-uid-chat-7',
        displayName: 'أحمد',
        email: 'ahmed@example.com',
        photoURL: '',
      },
      'signup'
    );
    state.setOwnerDetailsCompleted('أحمد', 'القاهرة', '01012345678', 'male', 'القاهرة');
    state.savePet({
      id: 'app-pet-1',
      name: 'سيمبا',
      species: 'cat',
      breed: 'شيرازي',
      gender: 'male',
      status: 'mating',
      ageYears: 2,
      ageMonths: 0,
      color: 'ذهبي',
      photos: ['https://example.com/simba.jpg'],
      vaccinationStatus: 'vaccinated',
      personality: ['ذكي'],
    });
    state.setOnboardingStep('completed');
    expect(state.getOnboardingStep()).toBe('completed');

    const convId = 'conv-inplace-1';
    const conv: Conversation = {
      id: convId,
      requestId: 'req-inplace-1',
      otherUserId: 'user-nora',
      otherUserName: 'نورا',
      otherUserAvatar: '',
      petId: 'pet-nora',
      petName: 'بوسي',
      petPhoto: '',
      petType: 'mating',
      lastMessage: 'أهلاً بك في Meow',
      lastMessageTime: '10:00',
      unreadCount: 0,
      ownerPrivacy: 'private',
      isPinned: false,
      isMuted: false,
      messages: [
        {
          id: 'msg-1',
          conversationId: convId,
          senderId: 'user-nora',
          senderName: 'نورا',
          text: 'أهلاً يا أحمد ممكن نتفق على ميعاد؟',
          timestamp: '10:00',
          createdAtMs: Date.now() - 5000,
          isFromUser: false,
        },
      ],
    };
    (state as unknown as { conversations: Conversation[] }).conversations = [conv];
    (state as unknown as { customStickers: CustomStickerModel[] }).customStickers = [
      {
        id: 'stk-test-1',
        imageUrl:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        title: 'قطة سعيدة',
        createdAt: new Date().toISOString(),
      },
    ];
    state.setCurrentTab('chat');
    state.setActiveConversationId(convId);

    const host = document.createElement('div');
    document.body.appendChild(host);
    const app = new MeowApp(host);
    app.init();

    const roomEl = document.getElementById('active-chat-room')!;
    const inputEl = document.getElementById('chat-message-input') as HTMLInputElement;
    expect(roomEl).not.toBeNull();
    expect(inputEl).not.toBeNull();

    // Focus input and type a draft
    inputEl.focus();
    inputEl.value = 'مسودة رسالة غير مرسلة';
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    expect(state.getChatDraft(convId)).toBe('مسودة رسالة غير مرسلة');

    // Incoming message triggers state.notify() -> MeowApp patches in-place!
    conv.messages.push({
      id: 'msg-2',
      conversationId: convId,
      senderId: 'user-nora',
      senderName: 'نورا',
      text: 'في التجمع الخامس مناسب ليك؟',
      timestamp: '10:01',
      createdAtMs: Date.now() - 2000,
      isFromUser: false,
    });
    conv.lastMessage = 'في التجمع الخامس مناسب ليك؟';
    (state as unknown as { notify: () => void }).notify();

    // Exact same DOM elements, preserved focus and draft text!
    expect(document.getElementById('active-chat-room')).toBe(roomEl);
    expect(document.getElementById('chat-message-input')).toBe(inputEl);
    expect(document.activeElement).toBe(inputEl);
    expect(inputEl.value).toBe('مسودة رسالة غير مرسلة');
    expect(document.getElementById('chat-messages-list')?.textContent).toContain(
      'في التجمع الخامس مناسب ليك؟'
    );

    // Mute toggle updates state and stays inside same room
    const muteBtn = document.getElementById('chat-mute-toggle-btn') as HTMLButtonElement;
    muteBtn.click();
    expect(conv.isMuted).toBe(true);
    expect(document.getElementById('active-chat-room')).toBe(roomEl);

    // In-room search highlights matching hit
    const searchToggleBtn = document.getElementById('chat-inroom-search-toggle-btn')!;
    searchToggleBtn.click();
    const searchInput = document.getElementById('chat-inroom-search-input') as HTMLInputElement;
    searchInput.value = 'التجمع';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(document.querySelectorAll('.meow-chat-search-hit').length).toBeGreaterThan(0);

    // Reply to msg-2 and send new message
    const replyBtn = document.querySelector<HTMLButtonElement>(
      '.chat-msg-reply-btn[data-reply-msg-id="msg-2"]'
    )!;
    replyBtn.click();
    expect(document.getElementById('chat-reply-preview-bar')?.classList.contains('hidden')).toBe(
      false
    );

    inputEl.value = 'أيوه التجمع الخامس ممتاز!';
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('chat-action-btn')!.click();

    const sentMsg = conv.messages[conv.messages.length - 1];
    expect(sentMsg.text).toBe('أيوه التجمع الخامس ممتاز!');
    expect(sentMsg.replyTo?.messageId).toBe('msg-2');
    expect(state.getChatDraft(convId)).toBe('');

    // Soft-delete own sent message
    const deleteBtn = document.querySelector<HTMLButtonElement>(
      `.chat-msg-delete-btn[data-delete-msg-id="${sentMsg.id}"]`
    )!;
    deleteBtn.click();
    await flushMicrotasks();
    expect(sentMsg.deletedAt).toBeTruthy();
    expect(document.getElementById('chat-messages-list')?.textContent).toContain('اتمسحت الرسالة دي');

    // Sticker drawer tabs (favorite toggle + Favorites/Recent tabs)
    document.getElementById('chat-stickers-btn')!.click();
    const firstFavBtn = document.querySelector<HTMLButtonElement>('.sticker-fav-toggle-btn')!;
    const stickerId = firstFavBtn.getAttribute('data-sticker-id')!;
    expect(stickerId).toBe('stk-test-1');
    firstFavBtn.click();
    expect(state.isStickerFavorite(stickerId)).toBe(true);

    const favTabBtn = document.querySelector<HTMLButtonElement>('[data-sticker-tab="favorites"]')!;
    favTabBtn.click();
    const favSendBtn = document.querySelector<HTMLButtonElement>(
      `.custom-sticker-send-btn[data-sticker-id="${stickerId}"]`
    )!;
    expect(favSendBtn).not.toBeNull();
    favSendBtn.click();
    expect(state.getRecentStickerIds()).toContain(stickerId);

    document.getElementById('chat-stickers-btn')!.click();
    document.querySelector<HTMLButtonElement>('[data-sticker-tab="recent"]')!.click();
    expect(
      document.querySelectorAll(`.custom-sticker-send-btn[data-sticker-id="${stickerId}"]`).length
    ).toBe(1);
  });
});
