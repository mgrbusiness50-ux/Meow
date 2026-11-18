import { state } from '../state.ts';
import { renderHeader, attachHeaderEvents } from './components/Header.ts';
import { renderTabBar, attachTabBarEvents } from './components/TabBar.ts';
import { renderMatingView, attachMatingEvents } from './views/MatingView.ts';
import { renderAdoptionView, attachAdoptionEvents } from './views/AdoptionView.ts';
import { renderChatView, attachChatEvents } from './views/ChatView.ts';
import { renderClinicView, attachClinicEvents } from './views/ClinicView.ts';
import { renderStoreView, attachStoreEvents } from './views/StoreView.ts';
import { renderProfileView, attachProfileEvents } from './views/ProfileView.ts';
import { renderPetDetailModal, attachPetDetailModalEvents } from './modals/PetDetailModal.ts';
import { renderContactRequestModal, attachContactRequestModalEvents } from './modals/ContactRequestModal.ts';
import { renderAddPetModal, attachAddPetModalEvents } from './modals/AddPetModal.ts';
import {
  renderOnboardingView,
  attachOnboardingEvents,
  renderOwnerEditView,
  attachOwnerEditEvents,
} from './views/OnboardingView.ts';
import { renderFilterModal, attachFilterModalEvents } from './modals/FilterModal.ts';
import { renderContactView, attachContactEvents } from './views/ContactView.ts';
import { renderSavedPetsView, attachSavedPetsEvents } from './views/SavedPetsView.ts';
import { renderGroupAdoptionModal, attachGroupAdoptionModalEvents } from './modals/GroupAdoptionModal.ts';
import { renderNotificationsModal, attachNotificationsModalEvents } from './modals/NotificationsModal.ts';
import {
  renderBlockConfirmModal,
  attachBlockConfirmModalEvents,
  renderReportModal,
  attachReportModalEvents,
  renderReportSubmittedToast,
  attachReportToastEvents,
  attachThreeDotsMenuEvents,
  closeAllThreeDotsDropdowns,
} from './components/BlockMenu.ts';
import {
  renderDeleteConversationConfirmModal,
  attachDeleteConversationModalEvents,
} from './views/ChatView.ts';

export class MeowApp {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    if (typeof document !== 'undefined') {
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement | null;
        if (target && !target.closest('.meow-more-menu-container')) {
          closeAllThreeDotsDropdowns();
        }
      });
    }
    state.subscribe(() => {
      this.render();
    });
  }

  public init(): void {
    this.render();
  }

  public render(): void {
    const onboardingStep = state.getOnboardingStep();

    // 1. If user is in the onboarding / registration flow, show the exact sequential registration screens
    if (onboardingStep !== 'completed') {
      this.container.innerHTML = `
        <div class="min-h-[100dvh] flex flex-col justify-center bg-[#FFF9E9] text-[#3E2723]">
          ${renderOnboardingView()}
        </div>
      `;
      attachOnboardingEvents();
      return;
    }

    // 2. Main App Shell
    const currentTab = state.getCurrentTab();
    const activeConversation = state.getActiveConversation();
    const isInsideChatRoom = currentTab === 'chat' && Boolean(activeConversation);
    const isSettingsOpen = state.isSettingsOpen();
    const hideBottomBar = isInsideChatRoom || isSettingsOpen;
    const selectedPetDetail = state.getSelectedPetForDetail();
    const selectedPetRequest = state.getSelectedPetForRequest();
    const isAddPetOpen = state.isAddPetModalVisible();
    const editingPet = state.getEditingPet();

    let tabHtml = '';
    switch (currentTab) {
      case 'mating':
        tabHtml = renderMatingView();
        break;
      case 'adoption':
        tabHtml = renderAdoptionView();
        break;
      case 'chat':
        tabHtml = renderChatView();
        break;
      case 'clinic':
        tabHtml = renderClinicView();
        break;
      case 'store':
        tabHtml = renderStoreView();
        break;
      case 'profile':
        tabHtml = renderProfileView();
        break;
      default:
        tabHtml = renderMatingView();
    }

    this.container.innerHTML = `
      <div class="min-h-full flex flex-col justify-between bg-warm-bg dark:bg-warm-darkBg text-warm-text dark:text-white transition-colors duration-200">
        <!-- App Header (Hidden when inside chat room so chat has dedicated header) -->
        ${isInsideChatRoom ? '' : renderHeader()}

        <!-- Main Tab Content -->
        <main class="flex-1 flex flex-col ${isInsideChatRoom ? 'p-0 m-0 pb-0' : 'pb-24'}">
          ${tabHtml}
        </main>

        <!-- Bottom Tab Bar (Taskbar: hidden when inside conversation or settings drawer, reappears on exit) -->
        ${hideBottomBar ? '' : renderTabBar()}

        <!-- Modals & Sub-views -->
        ${renderContactRequestModal(selectedPetRequest)}
        ${isAddPetOpen ? renderAddPetModal(editingPet) : ''}
        ${state.isEditOwnerModalVisible() ? renderOwnerEditView() : ''}
        ${renderFilterModal()}
        ${state.isSavedPetsVisible() ? renderSavedPetsView() : ''}
        ${renderPetDetailModal(selectedPetDetail)}
        ${state.isContactOpen() ? renderContactView() : ''}
        ${renderGroupAdoptionModal()}
        ${renderBlockConfirmModal()}
        ${renderDeleteConversationConfirmModal()}
        ${renderReportModal()}
        ${renderNotificationsModal()}
        ${renderReportSubmittedToast()}
      </div>
    `;

    // Attach events after innerHTML update
    if (!isInsideChatRoom) {
      attachHeaderEvents();
    }
    if (!hideBottomBar) {
      attachTabBarEvents();
    }

    switch (currentTab) {
      case 'mating':
        attachMatingEvents();
        break;
      case 'adoption':
        attachAdoptionEvents();
        break;
      case 'chat':
        attachChatEvents();
        break;
      case 'clinic':
        attachClinicEvents();
        break;
      case 'store':
        attachStoreEvents();
        break;
      case 'profile':
        attachProfileEvents();
        break;
    }

    // Modal events
    if (selectedPetDetail) attachPetDetailModalEvents(selectedPetDetail);
    if (selectedPetRequest) attachContactRequestModalEvents(selectedPetRequest);
    if (isAddPetOpen) attachAddPetModalEvents(editingPet);
    if (state.isEditOwnerModalVisible()) attachOwnerEditEvents();
    if (state.getIsFilterModalOpen()) attachFilterModalEvents(() => this.render());
    if (state.isSavedPetsVisible()) attachSavedPetsEvents();
    if (state.isContactOpen()) attachContactEvents();
    attachThreeDotsMenuEvents();
    attachGroupAdoptionModalEvents();
    if (state.getPendingBlockTarget()) attachBlockConfirmModalEvents();
    if (state.getPendingDeleteConversation()) attachDeleteConversationModalEvents();
    if (state.getPendingReportTarget()) attachReportModalEvents();
    if (state.isNotificationsOpen()) attachNotificationsModalEvents();
    if (state.getLastSubmittedReportNotice()) attachReportToastEvents();
  }
}

