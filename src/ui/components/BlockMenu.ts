import { state } from '../../state.ts';
import { PendingBlockTarget, PendingReportTarget, ReportReason } from '../../types.ts';

export interface ThreeDotsMenuOptions {
  userId: string;
  userName: string;
  userAvatar?: string;
  petId?: string;
  petName?: string;
  conversationId?: string;
  isPinned?: boolean;
  showPinActions?: boolean;
  showDeleteConversation?: boolean;
  reportTargetType?: 'pet' | 'chat' | 'request';
  buttonClass?: string;
  dropdownAlign?: 'left' | 'right';
}

const REPORT_REASONS: { id: ReportReason; label: string }[] = [
  { id: 'inappropriate_content', label: 'محتوى غير لائق أو مسيء' },
  { id: 'fraud_or_misleading', label: 'احتيال أو معلومات مضللة' },
  { id: 'unsafe_animal_care', label: 'إساءة معاملة أو عدم أمان للحيوان' },
  { id: 'spam_or_harassment', label: 'إزعاج أو رسائل متكررة' },
  { id: 'other', label: 'سبب آخر' },
];

let selectedReportReason: ReportReason = 'inappropriate_content';
let draftReportDetails = '';

function escapeAttr(val: string): string {
  return val
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderThreeDotsMenu(opts: ThreeDotsMenuOptions): string {
  const alignClass = opts.dropdownAlign === 'right' ? 'right-0' : 'left-0';
  const btnClass =
    opts.buttonClass ||
    'w-10 h-10 rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/65 transition-all cursor-pointer active:scale-90';
  const targetType = opts.reportTargetType || (opts.conversationId ? 'chat' : 'pet');

  return `
    <div class="meow-more-menu-container relative inline-flex">
      <button
        type="button"
        aria-label="خيارات إضافية"
        title="خيارات"
        class="meow-more-btn ${btnClass}"
      >
        <i class="fa-solid fa-ellipsis-vertical text-sm pointer-events-none"></i>
      </button>

      <div
        class="meow-more-dropdown hidden absolute top-full ${alignClass} mt-1.5 min-w-[186px] rounded-2xl bg-white border border-brand-peachBorder shadow-2xl py-1.5 px-1.5 z-[65] text-right space-y-0.5"
        role="menu"
      >
        ${
          opts.showPinActions && opts.conversationId
            ? `
            <button
              type="button"
              class="meow-pin-conv-btn w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-black text-brand-dark hover:bg-brand-orange/10 hover:text-brand-orange transition-colors cursor-pointer font-baloo text-right"
              data-pin-conversation-id="${escapeAttr(opts.conversationId)}"
              role="menuitem"
            >
              <i class="fa-solid fa-thumbtack text-xs shrink-0 ${opts.isPinned ? 'text-brand-orange' : ''}"></i>
              <span>${opts.isPinned ? 'إلغاء تثبيت المحادثة' : 'تثبيت المحادثة'}</span>
            </button>
            `
            : ''
        }

        <button
          type="button"
          class="meow-report-action-btn w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-black text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer font-baloo text-right"
          data-report-user-id="${escapeAttr(opts.userId)}"
          data-report-user-name="${escapeAttr(opts.userName)}"
          data-report-user-avatar="${escapeAttr(opts.userAvatar || '')}"
          data-report-pet-id="${escapeAttr(opts.petId || '')}"
          data-report-pet-name="${escapeAttr(opts.petName || '')}"
          data-report-conversation-id="${escapeAttr(opts.conversationId || '')}"
          data-report-target-type="${escapeAttr(targetType)}"
          role="menuitem"
        >
          <i class="fa-solid fa-flag text-xs shrink-0"></i>
          <span>إبلاغ</span>
        </button>

        <button
          type="button"
          class="meow-block-action-btn w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-black text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-baloo text-right"
          data-block-user-id="${escapeAttr(opts.userId)}"
          data-block-user-name="${escapeAttr(opts.userName)}"
          data-block-user-avatar="${escapeAttr(opts.userAvatar || '')}"
          data-block-pet-name="${escapeAttr(opts.petName || '')}"
          role="menuitem"
        >
          <i class="fa-solid fa-ban text-xs shrink-0"></i>
          <span>حظر</span>
        </button>

        ${
          opts.showDeleteConversation && opts.conversationId
            ? `
            <div class="my-1 border-t border-brand-peachBorder/50"></div>
            <button
              type="button"
              class="meow-delete-conv-btn w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-black text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-baloo text-right"
              data-delete-conversation-id="${escapeAttr(opts.conversationId)}"
              role="menuitem"
            >
              <i class="fa-solid fa-trash-can text-xs shrink-0"></i>
              <span>حذف المحادثة</span>
            </button>
            `
            : ''
        }
      </div>
    </div>
  `;
}

export function closeAllThreeDotsDropdowns(): void {
  const dropdowns = document.querySelectorAll<HTMLElement>('.meow-more-dropdown');
  dropdowns.forEach((dd) => dd.classList.add('hidden'));
  const elevatedCards = document.querySelectorAll<HTMLElement>('.meow-menu-elevated-card');
  elevatedCards.forEach((card) => card.classList.remove('meow-menu-elevated-card', 'z-40'));
}

export function attachThreeDotsMenuEvents(scope: ParentNode = document): void {
  const moreBtns = scope.querySelectorAll<HTMLButtonElement>('.meow-more-btn');
  moreBtns.forEach((btn) => {
    if (btn.dataset.threeDotsBound === '1') return;
    btn.dataset.threeDotsBound = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const container = btn.closest('.meow-more-menu-container');
      const dropdown = container?.querySelector<HTMLElement>('.meow-more-dropdown');
      if (!dropdown) return;

      const wasHidden = dropdown.classList.contains('hidden');
      closeAllThreeDotsDropdowns();
      if (wasHidden) {
        dropdown.classList.remove('hidden');
        const hostCard = btn.closest<HTMLElement>('.pet-card, .saved-pet-card');
        if (hostCard) {
          hostCard.classList.add('meow-menu-elevated-card', 'z-40');
        }
      }
    });
  });

  const pinBtns = scope.querySelectorAll<HTMLButtonElement>('.meow-pin-conv-btn');
  pinBtns.forEach((btn) => {
    if (btn.dataset.threeDotsBound === '1') return;
    btn.dataset.threeDotsBound = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAllThreeDotsDropdowns();
      const convId = btn.getAttribute('data-pin-conversation-id') || '';
      if (convId) {
        state.togglePinConversation(convId);
      }
    });
  });

  const deleteConvBtns = scope.querySelectorAll<HTMLButtonElement>('.meow-delete-conv-btn');
  deleteConvBtns.forEach((btn) => {
    if (btn.dataset.threeDotsBound === '1') return;
    btn.dataset.threeDotsBound = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAllThreeDotsDropdowns();
      const convId = btn.getAttribute('data-delete-conversation-id') || '';
      if (convId) {
        state.setPendingDeleteConversationId(convId);
      }
    });
  });

  const reportBtns = scope.querySelectorAll<HTMLButtonElement>('.meow-report-action-btn');
  reportBtns.forEach((btn) => {
    if (btn.dataset.threeDotsBound === '1') return;
    btn.dataset.threeDotsBound = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAllThreeDotsDropdowns();

      const targetUserId = btn.getAttribute('data-report-user-id') || '';
      const targetUserName = btn.getAttribute('data-report-user-name') || 'هذا الحساب';
      const targetUserAvatar = btn.getAttribute('data-report-user-avatar') || '';
      const petId = btn.getAttribute('data-report-pet-id') || '';
      const petName = btn.getAttribute('data-report-pet-name') || '';
      const conversationId = btn.getAttribute('data-report-conversation-id') || '';
      const targetType =
        (btn.getAttribute('data-report-target-type') as 'pet' | 'chat' | 'request') || 'pet';

      if (!targetUserId) return;

      selectedReportReason = 'inappropriate_content';
      draftReportDetails = '';

      const target: PendingReportTarget = {
        targetUserId,
        targetUserName,
        targetUserAvatar: targetUserAvatar || undefined,
        targetType,
        petId: petId || undefined,
        petName: petName || undefined,
        conversationId: conversationId || undefined,
      };
      state.setPendingReportTarget(target);
    });
  });

  const blockBtns = scope.querySelectorAll<HTMLButtonElement>('.meow-block-action-btn');
  blockBtns.forEach((btn) => {
    if (btn.dataset.threeDotsBound === '1') return;
    btn.dataset.threeDotsBound = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeAllThreeDotsDropdowns();

      const userId = btn.getAttribute('data-block-user-id') || '';
      const userName = btn.getAttribute('data-block-user-name') || 'هذا الحساب';
      const userAvatar = btn.getAttribute('data-block-user-avatar') || '';
      const petName = btn.getAttribute('data-block-pet-name') || '';

      if (!userId) return;

      const target: PendingBlockTarget = {
        userId,
        userName,
        userAvatar: userAvatar || undefined,
        petName: petName || undefined,
      };
      state.setPendingBlockTarget(target);
    });
  });
}

export function renderBlockConfirmModal(): string {
  const target = state.getPendingBlockTarget();
  if (!target) return '';

  return `
    <div id="meow-block-confirm-backdrop" class="fixed inset-0 z-[90] bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
      <div class="bg-white w-full max-w-sm rounded-t-[32px] sm:rounded-[28px] p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl border-t-2 sm:border-2 border-red-200 space-y-4 animate-slide-up sm:animate-scale-up text-right">
        <div class="sm:hidden flex justify-center -mt-2 pb-1">
          <span class="w-12 h-1.5 rounded-full bg-red-100"></span>
        </div>
        
        <div class="flex items-center gap-3 pb-3 border-b border-red-100">
          <div class="w-12 h-12 rounded-2xl bg-red-500/15 text-red-600 flex items-center justify-center text-xl shrink-0">
            <i class="fa-solid fa-ban"></i>
          </div>
          <div class="min-w-0">
            <h3 class="text-lg font-black font-baloo text-brand-dark leading-tight m-0">
              تأكيد الحظر
            </h3>
            <p class="text-xs font-bold text-brand-subtleGray m-0 mt-0.5 truncate">
              ${target.userName}
            </p>
          </div>
        </div>

        <p class="text-xs sm:text-sm font-semibold text-brand-dark/90 leading-relaxed">
          هل أنت متأكد من رغبتك في حظر <strong class="text-red-600">${target.userName}</strong>؟
          سيتم منع التواصل بين الحسابين ولن تظهر لك حيوانات أو محادثات هذا الحساب بعد الآن، ويمكنك إلغاء الحظر لاحقاً من الإعدادات.
        </p>

        <div class="grid grid-cols-2 gap-3 pt-1">
          <button
            id="confirm-block-user-btn"
            type="button"
            class="h-12 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-soft transition-all active:scale-95 cursor-pointer font-baloo"
          >
            تأكيد الحظر
          </button>
          <button
            id="cancel-block-user-btn"
            type="button"
            class="h-12 rounded-full bg-white border-2 border-brand-peachBorder text-brand-dark font-black text-sm hover:bg-brand-peachBorder/20 transition-all active:scale-95 cursor-pointer font-baloo"
          >
            إلغاء
          </button>
        </div>

      </div>
    </div>
  `;
}

export function attachBlockConfirmModalEvents(): void {
  const backdrop = document.getElementById('meow-block-confirm-backdrop');
  const cancelBtn = document.getElementById('cancel-block-user-btn');
  const confirmBtn = document.getElementById('confirm-block-user-btn');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      state.setPendingBlockTarget(null);
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        state.setPendingBlockTarget(null);
      }
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      state.confirmPendingBlock();
    });
  }
}

export function renderReportModal(): string {
  const target = state.getPendingReportTarget();
  if (!target) return '';

  const contextLabel =
    target.targetType === 'chat'
      ? `المحادثة مع ${target.targetUserName}`
      : target.targetType === 'request'
      ? `طلب التواصل من ${target.targetUserName}`
      : target.petName
      ? `ملف ${target.petName} (${target.targetUserName})`
      : target.targetUserName;

  return `
    <div id="meow-report-modal-backdrop" class="fixed inset-0 z-[95] bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
      <div class="bg-white w-full max-w-sm rounded-t-[32px] sm:rounded-[28px] p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl border-t-2 sm:border-2 border-brand-peachBorder space-y-4 animate-slide-up sm:animate-scale-up text-right max-h-[90dvh] overflow-y-auto overscroll-contain">
        <div class="sm:hidden flex justify-center -mt-2 pb-1">
          <span class="w-12 h-1.5 rounded-full bg-brand-peachBorder"></span>
        </div>

        <div class="flex items-center justify-between gap-2 pb-3 border-b border-brand-peachBorder/50">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center text-lg shrink-0">
              <i class="fa-solid fa-flag"></i>
            </div>
            <div class="min-w-0">
              <h3 class="text-lg font-black font-baloo text-brand-dark leading-tight m-0">
                تقديم بلاغ
              </h3>
              <p class="text-xs font-bold text-brand-subtleGray m-0 mt-0.5 truncate">
                ${contextLabel}
              </p>
            </div>
          </div>
          <button
            id="close-report-modal-btn"
            type="button"
            class="w-10 h-10 rounded-full bg-brand-peachBorder/30 text-brand-dark flex items-center justify-center text-sm cursor-pointer hover:bg-brand-orange hover:text-white transition shrink-0"
            aria-label="إغلاق"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="space-y-2">
          <p class="text-xs font-black text-brand-dark font-baloo m-0">سبب البلاغ</p>
          <div class="space-y-1.5">
            ${REPORT_REASONS.map(
              (r) => `
              <button
                type="button"
                data-report-reason="${r.id}"
                class="report-reason-option-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold transition cursor-pointer font-baloo text-right ${
                  selectedReportReason === r.id
                    ? 'border-brand-orange bg-[#fff5ea] text-brand-orange'
                    : 'border-brand-peachBorder/70 bg-white text-brand-dark hover:bg-brand-peachBorder/15'
                }"
              >
                <span>${r.label}</span>
                <i class="${
                  selectedReportReason === r.id
                    ? 'fa-solid fa-circle-check text-brand-orange'
                    : 'fa-regular fa-circle text-brand-subtleGray'
                }"></i>
              </button>
            `
            ).join('')}
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="report-details-textarea" class="block text-xs font-black text-brand-dark font-baloo">
            تفاصيل إضافية (اختياري)
          </label>
          <textarea
            id="report-details-textarea"
            rows="3"
            placeholder="اكتب أي تفاصيل تساعد في مراجعة البلاغ..."
            class="w-full rounded-2xl border-2 border-brand-peachBorder/80 bg-[#FFF9E9]/60 p-3 text-xs sm:text-sm font-semibold text-brand-dark placeholder-brand-subtleGray focus:outline-none focus:border-brand-orange font-baloo resize-none"
          >${escapeAttr(draftReportDetails)}</textarea>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-1">
          <button
            id="submit-report-btn"
            type="button"
            class="h-12 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white font-black text-sm shadow-soft transition-all active:scale-95 cursor-pointer font-baloo"
          >
            إرسال البلاغ
          </button>
          <button
            id="cancel-report-btn"
            type="button"
            class="h-12 rounded-full bg-white border-2 border-brand-peachBorder text-brand-dark font-black text-sm hover:bg-brand-peachBorder/20 transition-all active:scale-95 cursor-pointer font-baloo"
          >
            إلغاء
          </button>
        </div>

      </div>
    </div>
  `;
}

export function attachReportModalEvents(): void {
  const target = state.getPendingReportTarget();
  if (!target) return;

  const backdrop = document.getElementById('meow-report-modal-backdrop');
  const closeBtn = document.getElementById('close-report-modal-btn');
  const cancelBtn = document.getElementById('cancel-report-btn');
  const submitBtn = document.getElementById('submit-report-btn');
  const detailsInput = document.getElementById('report-details-textarea') as HTMLTextAreaElement | null;
  const reasonBtns = document.querySelectorAll<HTMLButtonElement>('.report-reason-option-btn');

  const close = () => {
    draftReportDetails = '';
    state.setPendingReportTarget(null);
  };

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (cancelBtn) cancelBtn.addEventListener('click', close);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });
  }

  if (detailsInput) {
    detailsInput.addEventListener('input', () => {
      draftReportDetails = detailsInput.value;
    });
  }

  reasonBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const reason = btn.getAttribute('data-report-reason') as ReportReason | null;
      if (!reason) return;
      selectedReportReason = reason;
      reasonBtns.forEach((other) => {
        const isSel = other.getAttribute('data-report-reason') === reason;
        other.className = `report-reason-option-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold transition cursor-pointer font-baloo text-right ${
          isSel
            ? 'border-brand-orange bg-[#fff5ea] text-brand-orange'
            : 'border-brand-peachBorder/70 bg-white text-brand-dark hover:bg-brand-peachBorder/15'
        }`;
        const icon = other.querySelector('i');
        if (icon) {
          icon.className = isSel
            ? 'fa-solid fa-circle-check text-brand-orange'
            : 'fa-regular fa-circle text-brand-subtleGray';
        }
      });
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const matched = REPORT_REASONS.find((r) => r.id === selectedReportReason) || REPORT_REASONS[0];
      const details = detailsInput ? detailsInput.value : draftReportDetails;
      draftReportDetails = '';
      state.submitReport(matched.id, matched.label, details);
    });
  }
}

export function renderReportSubmittedToast(): string {
  const notice = state.getLastSubmittedReportNotice();
  if (!notice) return '';

  return `
    <div id="meow-report-notice-toast" class="fixed inset-x-4 z-[96] max-w-md mx-auto bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-xl flex items-start justify-between gap-3 text-right animate-fade-in" style="top: max(1rem, env(safe-area-inset-top));" dir="rtl">
      <div class="flex items-start gap-2.5 min-w-0">
        <div class="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <div class="min-w-0">
          <p class="text-xs sm:text-sm font-black text-brand-dark font-baloo m-0">
            تم استلام بلاغك وحفظه للمراجعة
          </p>
          <p class="text-[11px] font-bold text-brand-subtleGray m-0 mt-0.5">
            السبب: ${notice.reasonLabel} • بخصوص: ${notice.targetUserName}
          </p>
        </div>
      </div>
      <button
        id="dismiss-report-notice-btn"
        type="button"
        class="w-9 h-9 rounded-full bg-brand-peachBorder/30 text-brand-dark flex items-center justify-center text-sm cursor-pointer shrink-0 hover:bg-brand-orange hover:text-white transition"
        aria-label="إغلاق الإشعار"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `;
}

export function attachReportToastEvents(): void {
  const btn = document.getElementById('dismiss-report-notice-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      state.dismissReportNotice();
    });
  }
}

