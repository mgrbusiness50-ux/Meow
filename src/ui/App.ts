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
  renderSplashLoadingIndicatorHtml,
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
import { escapeAttr, escapeHtml, sanitizeUrl } from '../utils/sanitize.ts';
import { APP_VERSION_INFO } from '../config/appVersion.ts';

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

      document.addEventListener('focusin', (e) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const tag = target.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') return;
        if (typeof window !== 'undefined' && window.innerWidth <= 900) {
          window.setTimeout(() => {
            if (typeof target.scrollIntoView === 'function') {
              target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 180);
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
      if (onboardingStep === 'splash') {
        state.markSplashViewMounted();
        const existingSplash = this.container.querySelector('#splash-screen-container');
        const existingLoadingSlot = this.container.querySelector('#splash-loading-slot');
        if (existingSplash && existingLoadingSlot) {
          const nextLoadingHtml = renderSplashLoadingIndicatorHtml(
            state.isSplashLoadingDelayed()
          );
          if (existingLoadingSlot.innerHTML !== nextLoadingHtml) {
            existingLoadingSlot.innerHTML = nextLoadingHtml;
          }
          attachOnboardingEvents();
          return;
        }
      }

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
        <main class="flex-1 flex flex-col ${isInsideChatRoom ? 'p-0 m-0 pb-0' : ''}" style="${isInsideChatRoom ? '' : 'padding-bottom: calc(6rem + env(safe-area-inset-bottom));'}">
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
        ${this.renderOtaUpdateNotice()}
        ${this.renderApkUpdateModal()}
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
    this.attachOtaUpdateNoticeEvents();
    this.attachApkUpdateModalEvents();
  }

  private renderApkUpdateModal(): string {
    const updateState = state.getUpdateState();
    const apk = updateState.result.apkUpdate;
    if (!updateState.isApkModalOpen || !apk) return '';

    const safeDownloadUrl = sanitizeUrl(apk.apkUrl);
    const notes = (apk.releaseNotes || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 4);

    return `
      <div
        id="apk-update-modal-backdrop"
        class="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in font-baloo"
        dir="rtl"
      >
        <div
          id="apk-update-modal-card"
          class="bg-[#FFF9E9] w-full max-w-sm rounded-t-[32px] rounded-b-none sm:rounded-[34px] px-5 sm:px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:py-6 shadow-2xl border-2 border-b-0 sm:border-b-2 border-[#f2d0a9] text-right space-y-4 max-h-[90dvh] overflow-y-auto"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-[#e67e22]/15 border border-[#e67e22]/30 text-[#e67e22] flex items-center justify-center text-xl shrink-0">
                <i class="fa-brands fa-android"></i>
              </div>
              <div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                  apk.isMandatory
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }">
                  ${apk.isMandatory ? 'تحديث إجباري للتطبيق' : 'تحديث جديد متاح (APK)'}
                </span>
                <h3 class="text-lg font-black text-[#1a1612] m-0 mt-1">
                  إصدار Meow ${escapeHtml(apk.latestVersion)}
                </h3>
              </div>
            </div>
            ${
              apk.isMandatory
                ? ''
                : `
                  <button
                    id="apk-update-dismiss-x-btn"
                    type="button"
                    aria-label="إغلاق نافذة التحديث"
                    class="w-10 h-10 rounded-full bg-white border-2 border-[#f2d0a9] text-[#5D4037] flex items-center justify-center hover:border-[#e67e22] hover:text-[#e67e22] transition cursor-pointer active:scale-90 shrink-0"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                `
            }
          </div>

          <div class="p-3.5 rounded-2xl bg-white border border-[#f2d0a9]/80 text-xs font-bold text-[#5D4037] space-y-1.5">
            <p class="m-0">
              الإصدار الحالي المثبّت: <span dir="ltr" class="font-mono text-[#1a1612]">v${escapeHtml(APP_VERSION_INFO.appVersion)} (${APP_VERSION_INFO.buildNumber})</span>
            </p>
            <p class="m-0">
              الإصدار الجديد: <span dir="ltr" class="font-mono text-[#e67e22]">v${escapeHtml(apk.latestVersion)} (${apk.latestBuildNumber})</span>
            </p>
          </div>

          ${
            notes.length > 0
              ? `
                <div class="space-y-1.5">
                  <p class="text-xs font-black text-[#1a1612] m-0">أبرز ما في التحديث:</p>
                  <ul class="list-disc pr-5 m-0 space-y-1 text-xs font-bold text-[#5D4037]">
                    ${notes.map((n: string) => `<li>${escapeHtml(n)}</li>`).join('')}
                  </ul>
                </div>
              `
              : ''
          }

          <div class="p-3.5 rounded-2xl bg-[#fff5ea] border border-[#f2d0a9] text-[11px] font-bold text-[#786555] space-y-1 leading-relaxed">
            <p class="font-black text-[#1a1612] m-0">خطوات التحديث الآمن دون فقدان البيانات:</p>
            <p class="m-0">1. اضغط «تحميل التحديث الآن» لتنزيل ملف Meow الرسمي.</p>
            <p class="m-0">2. افتح الملف من إشعارات المتصفح واضغط «تحديث / Update».</p>
            <p class="m-0">3. لا تحذف التطبيق الحالي حتى تبقى جلستك وبياناتك محفوظة.</p>
          </div>

          <div class="flex flex-col gap-2 pt-1">
            ${
              safeDownloadUrl
                ? `
                  <a
                    id="apk-update-download-link"
                    href="${escapeAttr(safeDownloadUrl)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full h-12 rounded-2xl bg-[#e67e22] hover:bg-[#d35400] text-white text-sm font-black flex items-center justify-center gap-2 shadow-soft transition active:scale-95 no-underline"
                  >
                    <i class="fa-solid fa-download"></i>
                    <span>تحميل التحديث الآن (APK)</span>
                  </a>
                `
                : `
                  <div class="w-full py-3 px-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold text-center">
                    رابط التحميل غير متوفر حالياً. يرجى المحاولة لاحقاً.
                  </div>
                `
            }
            ${
              apk.isMandatory
                ? ''
                : `
                  <button
                    id="apk-update-dismiss-btn"
                    type="button"
                    class="w-full h-11 rounded-2xl bg-white border-2 border-[#f2d0a9] text-[#5D4037] hover:bg-[#fff5ea] text-xs font-black transition cursor-pointer active:scale-95"
                  >
                    تذكيري لاحقاً
                  </button>
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  private attachApkUpdateModalEvents(): void {
    const backdrop = document.getElementById('apk-update-modal-backdrop');
    const dismissBtn = document.getElementById('apk-update-dismiss-btn');
    const dismissXBtn = document.getElementById('apk-update-dismiss-x-btn');
    const apk = state.getUpdateState().result.apkUpdate;

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => state.dismissApkUpdateModal());
    }
    if (dismissXBtn) {
      dismissXBtn.addEventListener('click', () => state.dismissApkUpdateModal());
    }
      if (backdrop && !apk?.isMandatory) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) {
            state.dismissApkUpdateModal();
          }
        });
      }
    }

  private renderOtaUpdateNotice(): string {
    const updateState = state.getUpdateState();
    const ota = updateState.result.otaUpdate;
    if (
      updateState.isApkModalOpen ||
      !updateState.isOtaNoticeVisible ||
      (!ota && !updateState.isOtaStagedForRestart)
    ) {
      return '';
    }

    const versionLabel = updateState.stagedOtaVersion || ota?.version || '';
    const notesFirstLine = (ota?.releaseNotes || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean);
    const hasError = updateState.feedback?.kind === 'error';
    const isStaged = updateState.isOtaStagedForRestart;
    const currentTab = state.getCurrentTab();
    const isInsideChatRoom = currentTab === 'chat' && Boolean(state.getActiveConversation());
    const bottomClass =
      isInsideChatRoom || state.isSettingsOpen()
        ? 'bottom-[max(1rem,env(safe-area-inset-bottom))]'
        : 'bottom-[calc(5.25rem+env(safe-area-inset-bottom))]';

    return `
      <aside
        id="ota-update-notice-banner"
        aria-live="polite"
        dir="rtl"
        class="fixed ${bottomClass} left-3 right-3 z-40 max-w-md mx-auto pointer-events-auto animate-slide-up font-baloo"
      >
        <div class="bg-[#FFF9E9]/98 dark:bg-[#27201B]/98 backdrop-blur-md border-2 border-[#e67e22]/45 rounded-[26px] p-3.5 sm:p-4 shadow-2xl space-y-2.5 text-right">
          <div class="flex items-start justify-between gap-2.5">
            <div class="flex items-start gap-2.5 min-w-0">
              <div class="w-10 h-10 rounded-2xl ${
                isStaged
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-[#e67e22]/15 text-[#e67e22] border border-[#e67e22]/30'
              } flex items-center justify-center shrink-0 text-base">
                <i class="fa-solid ${isStaged ? 'fa-circle-check' : 'fa-bolt'}"></i>
              </div>
              <div class="min-w-0 space-y-0.5">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isStaged
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-[#e67e22]/15 text-[#e67e22] border border-[#e67e22]/30'
                  }">
                    ${isStaged ? 'التحديث جاهز للتفعيل' : 'تحديث فوري متوافق'}
                  </span>
                  <span dir="ltr" class="font-mono text-[11px] font-black text-[#1a1612] dark:text-white">
                    v${escapeHtml(versionLabel)}
                  </span>
                </div>
                <p class="text-xs font-black text-[#1a1612] dark:text-white m-0 leading-snug">
                  ${
                    isStaged
                      ? `تم تنزيل وتجهيز التحديث (v${escapeHtml(versionLabel)}). سيُفعّل عند إعادة فتح التطبيق أو وضع التطبيق في الخلفية.`
                      : `يتوفر تحديث متوافق (v${escapeHtml(versionLabel)}) يمكن تطبيقه مباشرة دون تنزيل APK جديد.`
                  }
                </p>
                ${
                  !isStaged && notesFirstLine
                    ? `<p class="text-[11px] font-bold text-[#786555] dark:text-[#D1C7BD] m-0 line-clamp-2">${escapeHtml(notesFirstLine)}</p>`
                    : ''
                }
              </div>
            </div>
            <button
              id="ota-notice-dismiss-x-btn"
              type="button"
              aria-label="إغلاق إشعار التحديث"
              class="w-8 h-8 rounded-full bg-white border border-[#f2d0a9] text-[#5D4037] flex items-center justify-center hover:border-[#e67e22] hover:text-[#e67e22] transition cursor-pointer active:scale-90 shrink-0"
            >
              <i class="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>

          ${
            hasError && updateState.feedback
              ? `
                <div
                  id="ota-notice-error-box"
                  class="rounded-2xl px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold leading-snug"
                >
                  ${escapeHtml(updateState.feedback.message)}
                </div>
              `
              : ''
          }

          <div class="flex items-center gap-2">
            ${
              isStaged
                ? `
                  <button
                    id="ota-notice-restart-btn"
                    type="button"
                    class="flex-1 h-10 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-soft transition cursor-pointer active:scale-95"
                  >
                    <i class="fa-solid fa-rotate"></i>
                    <span>إعادة التشغيل الآن</span>
                  </button>
                `
                : `
                  <button
                    id="ota-notice-apply-btn"
                    type="button"
                    ${updateState.isApplyingOta ? 'disabled' : ''}
                    class="flex-1 h-10 px-4 rounded-2xl bg-[#e67e22] hover:bg-[#d35400] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-soft transition active:scale-95 ${
                      updateState.isApplyingOta ? 'opacity-75 cursor-wait' : 'cursor-pointer'
                    }"
                  >
                    <i class="fa-solid ${updateState.isApplyingOta ? 'fa-spinner fa-spin' : 'fa-download'}"></i>
                    <span>${
                      updateState.isApplyingOta
                        ? 'جاري تنزيل التحديث...'
                        : hasError
                        ? 'إعادة المحاولة'
                        : 'تنزيل وتجهيز التحديث'
                    }</span>
                  </button>
                `
            }
            <button
              id="ota-notice-dismiss-btn"
              type="button"
              class="h-10 px-3.5 rounded-2xl bg-white border border-[#f2d0a9] text-[#5D4037] hover:bg-[#fff5ea] text-xs font-black transition cursor-pointer active:scale-95 shrink-0"
            >
              ${isStaged ? 'لاحقًا' : 'تجاهل'}
            </button>
          </div>
        </div>
      </aside>
    `;
  }

  private attachOtaUpdateNoticeEvents(): void {
    const applyBtn = document.getElementById('ota-notice-apply-btn');
    const restartBtn = document.getElementById('ota-notice-restart-btn');
    const dismissBtn = document.getElementById('ota-notice-dismiss-btn');
    const dismissXBtn = document.getElementById('ota-notice-dismiss-x-btn');

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        void state.applyOtaUpdateNow();
      });
    }
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        void state.restartForStagedOtaUpdate();
      });
    }
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        state.dismissOtaNotice();
      });
    }
    if (dismissXBtn) {
      dismissXBtn.addEventListener('click', () => {
        state.dismissOtaNotice();
      });
    }
  }
}

