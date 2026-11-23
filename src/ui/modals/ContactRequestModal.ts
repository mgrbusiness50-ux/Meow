import { state } from '../../state.ts';
import { Pet } from '../../types.ts';
import { escapeAttr, escapeHtml, sanitizeImageSrc } from '../../utils/sanitize.ts';
import { attachSheetDragToDismiss } from '../../utils/touchGestures.ts';

export function renderContactRequestModal(targetPet: Pet | null): string {
  if (!targetPet) return '';

  const userPets = state.getUserPets();
  const isMating = targetPet.status === 'mating';
  const safePetPhoto = sanitizeImageSrc(targetPet.photos?.[0]);

  return `
    <div id="contact-request-modal-backdrop" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fade-in" dir="rtl">
      <div id="contact-request-sheet" class="bg-[#FFF9E9] rounded-t-[32px] rounded-b-none sm:rounded-3xl max-w-md w-full border-2 border-b-0 sm:border-b-2 border-brand-peachBorder shadow-2xl overflow-y-auto max-h-[92dvh] overscroll-contain px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-5 space-y-4 text-[#2d221b] animate-slide-up">
        
        <div id="contact-request-drag-handle" class="pt-0.5 pb-1 flex justify-center sm:hidden cursor-grab active:cursor-grabbing">
          <div class="w-12 h-1.5 rounded-full bg-brand-peachBorder/80"></div>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between border-b border-brand-peachBorder/60 pb-3">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-xl shrink-0">${isMating ? '❤️' : '🏠'}</span>
            <h3 class="text-base font-black text-brand-dark truncate">
              ${isMating ? 'إرسال طلب تزاوج' : 'إرسال طلب تبني'} إلى ${escapeHtml(targetPet.ownerName)}
            </h3>
          </div>
          <button id="close-contact-request-btn" type="button" aria-label="إغلاق" class="w-10 h-10 rounded-full bg-brand-peachBorder/40 hover:bg-brand-peachBorder text-brand-dark flex items-center justify-center cursor-pointer transition text-sm active:scale-90 shrink-0">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Target Cat Summary Pill -->
        <div class="p-3 rounded-2xl bg-white border border-brand-peachBorder flex items-center gap-3 shadow-sm">
          <img src="${escapeAttr(safePetPhoto)}" alt="${escapeAttr(targetPet.name)}" class="w-12 h-12 rounded-xl object-cover border border-brand-peachBorder shrink-0" />
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-black text-brand-dark truncate">${escapeHtml(targetPet.name)}</h4>
            ${
              targetPet.status === 'adoption' && targetPet.adoptionType === 'group'
                ? `
                  <span class="text-[11px] font-bold text-emerald-700 block truncate">
                    تبني جماعي (${targetPet.groupCount || targetPet.groupMembers?.length || 2} حيوانات): ${(targetPet.groupMembers || []).map((m) => escapeHtml(m.name)).join('، ')}
                  </span>
                  <span class="text-[10px] font-bold text-brand-subtleGray block truncate">
                    ${targetPet.mustAdoptTogether ? '⚠️ يُشترط تبنيهم معاً' : '✅ متاح منفرداً أو معاً'} • 📍 ${escapeHtml(targetPet.area)}، ${escapeHtml(targetPet.city)}
                  </span>
                `
                : `<span class="text-xs font-semibold text-brand-subtleGray block">${escapeHtml(targetPet.breed)} • ${escapeHtml(targetPet.area)}</span>`
            }
          </div>
          <span class="text-xs font-bold px-2 py-0.5 rounded-lg shrink-0 ${isMating ? 'bg-brand-orange/15 text-brand-orange' : 'bg-emerald-50 text-emerald-800'}">
            ${isMating ? 'تزاوج ❤️' : targetPet.adoptionType === 'group' ? 'جماعي 🏠' : 'تبني 🏠'}
          </span>
        </div>

        <!-- If Mating: Select which of user's pets to pair -->
        ${
          isMating
            ? `
            <div class="space-y-1">
              <label for="select-user-mating-pet" class="block text-xs font-black text-brand-dark">
                اختر حيوانك الأليف المقترح للتزاوج:
              </label>
              <select
                id="select-user-mating-pet"
                class="w-full min-h-[44px] bg-white border border-brand-peachBorder rounded-2xl px-3 py-2 text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-orange shadow-sm cursor-pointer"
              >
                ${userPets
                  .map(
                    (p) => `
                  <option value="${escapeAttr(p.id)}">${escapeHtml(p.name)} (${escapeHtml(p.breed)} - ${p.gender === 'male' ? 'ذكر' : 'أنثى'} - ${p.ageYears} سنة)</option>
                `
                  )
                  .join('')}
              </select>
            </div>
            `
            : ''
        }

        <!-- Message Field -->
        <div class="space-y-1">
          <label for="contact-request-message" class="block text-xs font-black text-brand-dark">
            ${isMating ? 'رسالتك لصاحب القطة (التطعيمات، البيئة، الموعد المقترح):' : 'نبذة عن بيئة منزلك وتجربتك في رعاية الحيوانات:'}
          </label>
          <textarea
            id="contact-request-message"
            rows="3"
            class="w-full bg-white border border-brand-peachBorder rounded-2xl p-3 text-xs font-semibold text-brand-dark placeholder-brand-subtleGray focus:outline-none focus:border-brand-orange shadow-sm leading-relaxed"
            placeholder="${
              isMating
                ? 'السلام عليكم، يسعدني التنسيق معكم بخصوص تزاوج أليفي مع أليفكم الجميل، جميع الفحوصات واللقاحات سارية...'
                : 'السلام عليكم، أود تقديم طلب لتبني هذا الأليف الرائع، لدينا منزل آمن وتجربة سابقة في العناية بالحيوانات...'
            }"
          ></textarea>
        </div>

        <!-- Privacy & Flow Notice -->
        <div class="p-3 rounded-2xl bg-[#fff5ea] border border-brand-peachBorder text-xs text-brand-subtleGray space-y-1">
          <div class="flex items-center gap-1.5 text-brand-orange font-black">
            <i class="fa-solid fa-shield-halved text-xs"></i>
            <span>نظام التواصل الآمن:</span>
          </div>
          <p class="m-0 leading-normal font-semibold">
            سيصل طلبك إلى الطرف الآخر للموافقة، وبمجرد قبوله سيتم فتح محادثة فورية وتبادل معلومات الاتصال المباشر وفق إعدادات الخصوصية.
          </p>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-end gap-2.5 pt-2">
          <button id="cancel-contact-request-btn" type="button" class="h-11 px-5 rounded-full bg-white border border-brand-peachBorder text-brand-dark font-extrabold text-xs sm:text-sm hover:bg-brand-peachBorder/20 transition active:scale-95 cursor-pointer">
            إلغاء
          </button>
          <button id="submit-contact-request-btn" type="button" class="h-11 px-6 rounded-full bg-brand-orange text-white font-black text-xs sm:text-sm shadow-soft hover:bg-brand-orange/95 transition active:scale-95 cursor-pointer">
            إرسال الطلب الآن ✈️
          </button>
        </div>

      </div>
    </div>
  `;
}

export function attachContactRequestModalEvents(targetPet: Pet | null): void {
  if (!targetPet) return;

  const closeBtn = document.getElementById('close-contact-request-btn');
  const cancelBtn = document.getElementById('cancel-contact-request-btn');
  const backdrop = document.getElementById('contact-request-modal-backdrop');
  const sheet = document.getElementById('contact-request-sheet');

  const handleClose = () => {
    state.setSelectedPetForRequest(null);
  };

  if (sheet) {
    attachSheetDragToDismiss(sheet, {
      backdropEl: backdrop,
      handleSelector: '#contact-request-drag-handle',
      scrollContainerSelector: '#contact-request-sheet',
      onClose: handleClose,
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', handleClose);
  if (cancelBtn) cancelBtn.addEventListener('click', handleClose);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) handleClose();
    });
  }

  const submitBtn = document.getElementById('submit-contact-request-btn') as HTMLButtonElement | null;
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (submitBtn.disabled) return;
      submitBtn.disabled = true;
      const messageTextarea = document.getElementById('contact-request-message') as HTMLTextAreaElement;
      const petSelect = document.getElementById('select-user-mating-pet') as HTMLSelectElement;

      const message =
        messageTextarea && messageTextarea.value.trim()
          ? messageTextarea.value.trim()
          : targetPet.status === 'mating'
          ? 'السلام عليكم، أود التواصل للتنسيق بخصوص تزاوج قطتي مع قطكم الجميل. التحاليل والتطعيمات سليمة.'
          : 'السلام عليكم، أود تقديم طلب رسمي لتبني القطة وتوفير أفضل بيئة معيشية لها.';

      const selectedUserPetId = petSelect ? petSelect.value : undefined;

      state.sendContactRequest(targetPet, message, selectedUserPetId);
      state.setSelectedPetForRequest(null);
      // Switch to Chat tab to see the pending request
      state.setCurrentTab('chat');
    });
  }
}
