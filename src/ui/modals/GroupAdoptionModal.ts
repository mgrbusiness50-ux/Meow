import { state } from '../../state.ts';
import { AdoptionPublishMode, Pet } from '../../types.ts';
import { attachSheetDragToDismiss } from '../../utils/touchGestures.ts';

interface GroupDraft {
  activeSessionKey: string | null;
  selectedPetIds: string[];
  memberPhotosByPetId: Record<string, string[]>;
  sharedGroupPhotos: string[];
  mustAdoptTogether: boolean;
  adoptionReason: string;
  publishMode: 'group_only' | 'both';
  step: 'edit' | 'confirm';
  validationMessage: string;
}

let pendingChoiceStep: {
  petId: string | null;
  confirmMode: AdoptionPublishMode | null;
} = {
  petId: null,
  confirmMode: null,
};

let isSubmittingAction = false;

let draft: GroupDraft = {
  activeSessionKey: null,
  selectedPetIds: [],
  memberPhotosByPetId: {},
  sharedGroupPhotos: [],
  mustAdoptTogether: true,
  adoptionReason: '',
  publishMode: 'group_only',
  step: 'edit',
  validationMessage: '',
};

function resetDraft(): void {
  isSubmittingAction = false;
  draft = {
    activeSessionKey: null,
    selectedPetIds: [],
    memberPhotosByPetId: {},
    sharedGroupPhotos: [],
    mustAdoptTogether: true,
    adoptionReason: '',
    publishMode: 'group_only',
    step: 'edit',
    validationMessage: '',
  };
}

function resetChoiceState(): void {
  isSubmittingAction = false;
  pendingChoiceStep = {
    petId: null,
    confirmMode: null,
  };
}

function initDraftIfNeeded(): void {
  const preselectIds = state.getGroupEditorPreselectIds();
  const existingGroup = state.getUserGroupAdoptionListing();
  const defaultPublishMode = state.getGroupEditorPublishMode();
  const sessionKey =
    preselectIds.join(',') + '::' + (existingGroup?.id || 'new') + '::' + defaultPublishMode;

  if (draft.activeSessionKey === sessionKey) return;

  const userPets = state.getUserPets();
  const initialSelected =
    preselectIds.length >= 2
      ? Array.from(new Set(preselectIds.filter((id) => userPets.some((p) => p.id === id))))
      : userPets.slice(0, 2).map((p) => p.id);

  const memberPhotosByPetId: Record<string, string[]> = {};
  const perPetCap = initialSelected.length >= 3 ? 2 : 3;

  userPets.forEach((pet) => {
    const existingMember = existingGroup?.groupMembers?.find((m) => m.petId === pet.id);
    const sourcePhotos =
      existingMember && existingMember.individualPhotos.length > 0
        ? existingMember.individualPhotos
        : pet.photos || [];
    memberPhotosByPetId[pet.id] = sourcePhotos.slice(0, perPetCap);
  });

  // Ensure initial sum doesn't exceed 10
  let runningTotal = initialSelected.reduce(
    (sum, id) => sum + (memberPhotosByPetId[id]?.length || 0),
    0
  );
  if (runningTotal > 10) {
    initialSelected.forEach((id) => {
      while (runningTotal > 10 && (memberPhotosByPetId[id]?.length || 0) > 1) {
        memberPhotosByPetId[id].pop();
        runningTotal--;
      }
    });
  }

  const shared = existingGroup?.sharedGroupPhotos
    ? [...existingGroup.sharedGroupPhotos].slice(0, Math.max(0, 10 - runningTotal))
    : [];

  draft = {
    activeSessionKey: sessionKey,
    selectedPetIds: initialSelected,
    memberPhotosByPetId,
    sharedGroupPhotos: shared,
    mustAdoptTogether: existingGroup?.mustAdoptTogether ?? true,
    adoptionReason: existingGroup?.adoptionReason ?? '',
    publishMode: defaultPublishMode,
    step: 'edit',
    validationMessage: '',
  };
}

function getTotalDraftPhotoCount(): number {
  const individualCount = draft.selectedPetIds.reduce(
    (sum, id) => sum + (draft.memberPhotosByPetId[id]?.length || 0),
    0
  );
  return individualCount + draft.sharedGroupPhotos.length;
}

export function renderGroupAdoptionModal(): string {
  const pendingChoicePet = state.getPendingGroupChoicePet();
  const isEditorOpen = state.getIsGroupAdoptionEditorOpen();

  if (pendingChoicePet) {
    if (pendingChoiceStep.petId !== pendingChoicePet.id) {
      pendingChoiceStep = { petId: pendingChoicePet.id, confirmMode: null };
      isSubmittingAction = false;
    }

    const existingAdoptionPets = state
      .getUserAdoptionPets()
      .filter((p) => p.id !== pendingChoicePet.id);
    const allInvolvedPets = [...existingAdoptionPets, pendingChoicePet];
    const existingNames = existingAdoptionPets.map((p) => p.name).join(' و ');
    const confirmMode = pendingChoiceStep.confirmMode;

    if (confirmMode === 'separate') {
      return `
        <div id="group-choice-backdrop" class="fixed inset-0 z-[75] bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
          <div id="group-choice-sheet" class="bg-[#FFF9E9] w-full max-w-md sm:max-w-sm rounded-t-[32px] rounded-b-none sm:rounded-[32px] px-5 sm:px-6 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6 border-2 border-b-0 sm:border-b-2 border-[#d6c7b2] shadow-2xl space-y-4 text-right animate-slide-up sm:animate-scale-up font-baloo text-[#2d221b] max-h-[92dvh] overflow-y-auto overscroll-contain">
            <div id="group-choice-drag-handle" class="w-12 h-1.5 rounded-full bg-[#d6c7b2] mx-auto mb-1 sm:hidden cursor-grab active:cursor-grabbing"></div>
            <div class="flex items-center justify-between gap-2 pb-3 border-b border-[#d6c7b2]/60">
              <div class="flex items-center gap-2.5">
                <div class="w-11 h-11 rounded-2xl bg-[#e67e22]/15 text-[#e67e22] flex items-center justify-center text-xl shrink-0">
                  <i class="fa-solid fa-clipboard-check"></i>
                </div>
                <div>
                  <h3 class="text-lg font-black text-[#1a1612] m-0">تأكيد إنشاء الإعلانات</h3>
                  <p class="text-xs font-bold text-[#786555] m-0">وضع العرض: إعلانات منفصلة</p>
                </div>
              </div>
              <button
                id="close-group-choice-btn"
                type="button"
                aria-label="إغلاق"
                class="w-10 h-10 rounded-full bg-[#fffefc] border border-[#d6c7b2] text-[#2d221b] flex items-center justify-center hover:bg-[#e67e22] hover:text-white transition cursor-pointer shrink-0 active:scale-90"
              >
                <i class="fa-solid fa-xmark text-base"></i>
              </button>
            </div>

            <div class="p-3.5 rounded-2xl bg-[#fffefc] border border-[#d6c7b2] space-y-2.5">
              <p class="text-xs sm:text-sm font-black text-[#1a1612] m-0">
                سيتم نشر ${allInvolvedPets.length} إعلانات تبنٍ منفصلة (إعلان مستقل لكل حيوان):
              </p>
              <ul class="space-y-1.5 m-0 p-0 list-none">
                ${allInvolvedPets
                  .map(
                    (p) => `
                  <li class="flex items-center gap-2 text-xs font-bold text-[#2d221b] bg-[#faf6ed] px-3 py-1.5 rounded-xl border border-[#d6c7b2]/60">
                    <i class="fa-solid fa-paw text-[#e67e22] text-[11px]"></i>
                    <span>إعلان مستقل لـ «${p.name}» (${p.breed})</span>
                  </li>
                `
                  )
                  .join('')}
              </ul>
              <p class="text-[11px] font-bold text-[#786555] m-0">
                سيظهر كل حيوان في بطاقة مستقلة داخل قسم التبني دون ربطه بإعلان جماعي.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-2.5 pt-1">
              <button
                id="confirm-separate-choice-btn"
                type="button"
                class="h-12 rounded-full bg-brand-orange hover:bg-brand-accent text-white font-black text-xs sm:text-sm shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <i class="fa-solid fa-check"></i>
                <span>تأكيد وإنشاء</span>
              </button>
              <button
                id="back-group-choice-btn"
                type="button"
                class="h-12 rounded-full bg-[#fffefc] hover:bg-[#faf6ed] border-2 border-[#d6c7b2] text-[#2d221b] font-black text-xs sm:text-sm transition cursor-pointer active:scale-95"
              >
                رجوع للخيارات
              </button>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div id="group-choice-backdrop" class="fixed inset-0 z-[75] bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
        <div id="group-choice-sheet" class="bg-[#FFF9E9] w-full max-w-md sm:max-w-sm rounded-t-[32px] rounded-b-none sm:rounded-[32px] px-5 sm:px-6 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6 border-2 border-b-0 sm:border-b-2 border-[#d6c7b2] shadow-2xl space-y-4 text-right animate-slide-up sm:animate-scale-up font-baloo text-[#2d221b] max-h-[92dvh] overflow-y-auto overscroll-contain">
          <div id="group-choice-drag-handle" class="w-12 h-1.5 rounded-full bg-[#d6c7b2] mx-auto mb-1 sm:hidden cursor-grab active:cursor-grabbing"></div>
          <div class="flex items-center justify-between gap-2 pb-3 border-b border-[#d6c7b2]/60">
            <div class="flex items-center gap-2.5">
              <div class="w-11 h-11 rounded-2xl bg-[#e67e22]/15 text-[#e67e22] flex items-center justify-center text-xl shrink-0">
                <i class="fa-solid fa-house-chimney-heart"></i>
              </div>
              <div>
                <h3 class="text-lg font-black text-[#1a1612] m-0">اختيار طريقة العرض للتبني</h3>
                <p class="text-xs font-bold text-[#786555] m-0">إضافة: ${pendingChoicePet.name}</p>
              </div>
            </div>
            <button
              id="close-group-choice-btn"
              type="button"
              aria-label="إغلاق"
              class="w-10 h-10 rounded-full bg-[#fffefc] border border-[#d6c7b2] text-[#2d221b] flex items-center justify-center hover:bg-[#e67e22] hover:text-white transition cursor-pointer shrink-0 active:scale-90"
            >
              <i class="fa-solid fa-xmark text-base"></i>
            </button>
          </div>

          <p class="text-xs sm:text-sm font-bold text-[#2d221b] leading-relaxed m-0">
            لديك حيوان معروض للتبني بالفعل (${existingNames || 'مسجل للتبني'}). اختر طريقة نشر
            <span class="text-[#e67e22] font-black">«${pendingChoicePet.name}»</span>:
          </p>

          <div class="space-y-2.5 pt-1">
            <!-- 1. إعلان جماعي فقط -->
            <button
              id="choose-group-adoption-btn"
              type="button"
              class="w-full p-3.5 rounded-[26px] bg-brand-orange hover:bg-brand-accent text-white font-black shadow-md flex items-center gap-3 text-right transition active:scale-[0.98] cursor-pointer"
            >
              <div class="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-lg shrink-0">
                <i class="fa-solid fa-people-roof"></i>
              </div>
              <div class="min-w-0">
                <div class="text-sm sm:text-base font-black">إعلان جماعي فقط</div>
                <div class="text-[11px] font-bold text-white/90">عرض جميع الحيوانات معاً في إعلان جماعي واحد</div>
              </div>
            </button>

            <!-- 2. إعلانات منفصلة -->
            <button
              id="choose-independent-adoption-btn"
              type="button"
              class="w-full p-3.5 rounded-[24px] bg-[#fffefc] hover:bg-[#faf6ed] border-2 border-[#d6c7b2] text-[#2d221b] font-black shadow-sm flex items-center gap-3 text-right transition active:scale-[0.98] cursor-pointer"
            >
              <div class="w-10 h-10 rounded-2xl bg-[#fff5ea] text-[#e67e22] flex items-center justify-center text-lg shrink-0">
                <i class="fa-solid fa-paw"></i>
              </div>
              <div class="min-w-0">
                <div class="text-sm sm:text-base font-black">إعلانات منفصلة</div>
                <div class="text-[11px] font-bold text-[#786555]">عرض كل حيوان في إعلان تبنٍ مستقل خاص به</div>
              </div>
            </button>

            <!-- 3. الاثنان معاً -->
            <button
              id="choose-both-adoption-btn"
              type="button"
              class="w-full p-3.5 rounded-[24px] bg-[#fff5ea] hover:bg-[#ffedd5] border-2 border-[#e67e22] text-[#2d221b] font-black shadow-sm flex items-center gap-3 text-right transition active:scale-[0.98] cursor-pointer"
            >
              <div class="w-10 h-10 rounded-2xl bg-[#e67e22] text-white flex items-center justify-center text-lg shrink-0">
                <i class="fa-solid fa-layer-group"></i>
              </div>
              <div class="min-w-0">
                <div class="text-sm sm:text-base font-black text-[#e67e22]">الاثنان معاً</div>
                <div class="text-[11px] font-bold text-[#786555]">نشر إعلان جماعي للمجموعة + إعلان مستقل لكل حيوان في نفس الوقت</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (!isEditorOpen) {
    return '';
  }

  initDraftIfNeeded();

  const userPets = state.getUserPets();
  const existingGroup = state.getUserGroupAdoptionListing();
  const selectedPets: Pet[] = draft.selectedPetIds
    .map((id) => userPets.find((p) => p.id === id))
    .filter((p): p is Pet => Boolean(p));

  const totalPhotos = getTotalDraftPhotoCount();
  const everyMemberHasPhoto = selectedPets.every(
    (p) => (draft.memberPhotosByPetId[p.id]?.length || 0) >= 1
  );
  const canSave =
    selectedPets.length >= 2 && everyMemberHasPhoto && totalPhotos >= 3 && totalPhotos <= 10;

  if (draft.step === 'confirm') {
    const isBoth = draft.publishMode === 'both';
    const groupTitle = selectedPets.map((p) => p.name).join(' و ');
    const totalAdsCount = isBoth ? 1 + selectedPets.length : 1;

    return `
      <div id="group-editor-backdrop" class="fixed inset-0 z-[75] bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
        <div id="group-editor-sheet" class="bg-[#FFF9E9] text-[#2d221b] w-full max-w-md rounded-t-[32px] rounded-b-none sm:rounded-[36px] border-2 border-b-0 sm:border-b-2 border-[#d6c7b2] shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden animate-slide-up sm:animate-scale-up font-baloo">

          <div id="group-editor-drag-handle" class="px-5 pt-2.5 pb-3.5 border-b border-[#d6c7b2]/70 bg-[#FFF9E9]/95 flex flex-col shrink-0">
            <div class="w-12 h-1.5 rounded-full bg-[#d6c7b2] mx-auto mb-2.5 sm:hidden cursor-grab active:cursor-grabbing"></div>
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center text-lg">
                  <i class="fa-solid fa-clipboard-check"></i>
                </div>
                <div>
                  <h3 class="text-base sm:text-lg font-black text-[#1a1612] m-0">تأكيد إنشاء الإعلانات</h3>
                  <p class="text-xs font-bold text-[#786555] m-0">مراجعة ملخص الإعلانات قبل النشر النهائي</p>
                </div>
              </div>
              <button
                id="close-group-editor-btn"
                type="button"
                aria-label="إغلاق"
                class="w-10 h-10 rounded-full bg-[#fffefc] border border-[#d6c7b2] text-[#2d221b] flex items-center justify-center hover:bg-[#e67e22] hover:text-white transition cursor-pointer shrink-0 active:scale-90"
              >
                <i class="fa-solid fa-xmark text-base"></i>
              </button>
            </div>
          </div>

          <div id="group-editor-scroll" class="p-5 overflow-y-auto overscroll-contain space-y-4 flex-1 text-right">
            <div class="p-4 rounded-3xl bg-[#fffefc] border-2 border-[#d6c7b2] space-y-3">
              <div class="flex items-center justify-between gap-2">
                <span class="text-sm font-black text-[#1a1612]">ملخص الإعلانات التي سيتم إنشاؤها:</span>
                <span class="px-2.5 py-0.5 rounded-full bg-[#fff5ea] text-[#e67e22] border border-[#e67e22]/30 text-xs font-black">
                  ${totalAdsCount} ${totalAdsCount === 1 ? 'إعلان' : 'إعلانات'}
                </span>
              </div>

              <!-- 1. Group Ad Summary -->
              <div class="p-3.5 rounded-[24px] bg-[#fff5ea] border border-brand-orange/35 space-y-1">
                <div class="flex items-center gap-2 text-xs sm:text-sm font-black text-brand-dark">
                  <i class="fa-solid fa-people-roof text-brand-orange"></i>
                  <span>إعلان تبنٍ جماعي: ${groupTitle}</span>
                </div>
                <p class="text-[11px] font-bold text-[#786555] m-0">
                  يضم ${selectedPets.length} حيوانات • ${totalPhotos} صور • ${
                    draft.mustAdoptTogether ? 'يُشترط التبني معاً' : 'يمكن التبني منفرداً أو معاً'
                  }
                </p>
              </div>

              <!-- 2. Individual Ads Summary (if "الاثنان معاً") -->
              ${
                isBoth
                  ? `
                    <div class="space-y-1.5 pt-1">
                      <span class="block text-xs font-black text-[#786555]">الإعلانات المستقلة المضافة في نفس الوقت:</span>
                      ${selectedPets
                        .map(
                          (pet) => `
                            <div class="p-2.5 rounded-2xl bg-[#fff5ea]/80 border border-[#e67e22]/30 flex items-center justify-between gap-2 text-xs font-black">
                              <div class="flex items-center gap-2 min-w-0">
                                <i class="fa-solid fa-paw text-[#e67e22]"></i>
                                <span class="truncate text-[#1a1612]">إعلان فردي لـ «${pet.name}» (${pet.breed})</span>
                              </div>
                              <span class="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#d6c7b2] text-[#786555] shrink-0">مستقل</span>
                            </div>
                          `
                        )
                        .join('')}
                    </div>
                  `
                  : `
                    <p class="text-xs font-bold text-[#786555] m-0">
                      لن يتم نشر إعلانات منفصلة — سيظهر الإعلان الجماعي فقط في قسم التبني.
                    </p>
                  `
              }
            </div>
          </div>

          <div class="pt-4 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-4 border-t border-[#d6c7b2]/70 bg-[#FFF9E9] grid grid-cols-2 gap-2.5 shrink-0">
            <button
              id="confirm-publish-group-adoption-btn"
              type="button"
              class="h-[52px] py-3 px-4 rounded-full bg-brand-orange hover:bg-brand-accent text-white font-black text-sm shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <i class="fa-solid fa-check"></i>
              <span>تأكيد ونشر الإعلانات</span>
            </button>
            <button
              id="back-to-group-editor-btn"
              type="button"
              class="h-[52px] py-3 px-4 rounded-full bg-[#fffefc] hover:bg-[#faf6ed] border-2 border-[#d6c7b2] text-[#2d221b] font-black text-sm transition cursor-pointer active:scale-95"
            >
              تعديل البيانات
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div id="group-editor-backdrop" class="fixed inset-0 z-[75] bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
      <div id="group-editor-sheet" class="bg-[#FFF9E9] text-[#2d221b] w-full max-w-md rounded-t-[32px] rounded-b-none sm:rounded-[36px] border-2 border-b-0 sm:border-b-2 border-[#d6c7b2] shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden animate-slide-up sm:animate-scale-up font-baloo">

        <!-- Sticky Header -->
        <div id="group-editor-drag-handle" class="px-5 pt-2.5 pb-3.5 border-b border-[#d6c7b2]/70 bg-[#FFF9E9]/95 flex flex-col shrink-0">
          <div class="w-12 h-1.5 rounded-full bg-[#d6c7b2] mx-auto mb-2.5 sm:hidden cursor-grab active:cursor-grabbing"></div>
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-10 h-10 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center text-lg shrink-0">
                <i class="fa-solid fa-people-roof"></i>
              </div>
              <div class="min-w-0">
                <h3 class="text-base sm:text-lg font-black text-[#1a1612] m-0 truncate">إعداد إعلان التبني الجماعي</h3>
                <p class="text-xs font-bold text-[#786555] m-0">صور منفصلة لكل حيوان أولاً، ثم صور جماعية اختيارية</p>
              </div>
            </div>
            <button
              id="close-group-editor-btn"
              type="button"
              aria-label="إغلاق"
              class="w-10 h-10 rounded-full bg-[#fffefc] border border-[#d6c7b2] text-[#2d221b] flex items-center justify-center hover:bg-[#e67e22] hover:text-white transition cursor-pointer shrink-0 active:scale-90"
            >
              <i class="fa-solid fa-xmark text-base"></i>
            </button>
          </div>
        </div>

        <!-- Scrollable Body -->
        <div id="group-editor-scroll" class="p-5 overflow-y-auto overscroll-contain space-y-5 flex-1 text-right">

          <!-- Publishing Mode Selector (إعلان جماعي فقط / الاثنان معاً) -->
          <div class="space-y-2">
            <label class="block text-sm sm:text-base font-black text-[#2d221b]">طريقة النشر</label>
            <div class="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                id="mode-group-only-btn"
                class="p-3.5 rounded-[24px] border-2 text-right transition cursor-pointer ${
                  draft.publishMode === 'group_only'
                    ? 'border-brand-orange bg-[#fff5ea] text-brand-orange'
                    : 'border-[#d6c7b2] bg-[#fffefc] text-[#786555] hover:bg-[#faf6ed]'
                }"
              >
                <div class="text-xs sm:text-sm font-black">إعلان جماعي فقط</div>
                <div class="text-[10px] font-bold opacity-85 mt-0.5">إعلان واحد للمجموعة</div>
              </button>
              <button
                type="button"
                id="mode-both-btn"
                class="p-3 rounded-[22px] border-2 text-right transition cursor-pointer ${
                  draft.publishMode === 'both'
                    ? 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22]'
                    : 'border-[#d6c7b2] bg-[#fffefc] text-[#786555] hover:bg-[#faf6ed]'
                }"
              >
                <div class="text-xs sm:text-sm font-black">الاثنان معاً</div>
                <div class="text-[10px] font-bold opacity-85 mt-0.5">جماعي + إعلان مستقل لكل حيوان</div>
              </button>
            </div>
          </div>

          <!-- 1. Select Pets to Link Together -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm sm:text-base font-black text-[#2d221b]">1. اختر الحيوانات في المجموعة (2 فأكثر)</label>
              <span class="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#fff5ea] text-[#e67e22] border border-[#e67e22]/30">
                المختار: ${selectedPets.length}
              </span>
            </div>

            <div class="grid grid-cols-1 gap-2">
              ${userPets
                .map((pet) => {
                  const isChecked = draft.selectedPetIds.includes(pet.id);
                  const ageText =
                    pet.ageYears > 0
                      ? `${pet.ageYears} سنة`
                      : pet.ageMonths > 0
                      ? `${pet.ageMonths} شهر`
                      : '';
                  return `
                    <button
                      type="button"
                      data-toggle-group-pet="${pet.id}"
                      class="group-pet-select-btn flex items-center justify-between p-3.5 rounded-[24px] border-2 transition cursor-pointer ${
                        isChecked
                          ? 'border-[#e67e22] bg-[#fff5ea]'
                          : 'border-[#d6c7b2] bg-[#fffefc] hover:bg-[#faf6ed]'
                      }"
                    >
                      <div class="flex items-center gap-3 min-w-0">
                        <img src="${pet.photos[0]}" alt="${pet.name}" class="w-12 h-12 rounded-2xl object-cover border border-[#d6c7b2] shrink-0" />
                        <div class="text-right min-w-0">
                          <div class="text-sm font-black text-[#1a1612] truncate">${pet.name}</div>
                          <div class="text-xs font-bold text-[#786555] truncate">${pet.breed} • ${pet.gender === 'male' ? 'ذكر' : 'أنثى'}${ageText ? ` • ${ageText}` : ''}</div>
                        </div>
                      </div>
                      <span class="w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                        isChecked
                          ? 'bg-[#e67e22] border-[#e67e22] text-white'
                          : 'bg-white border-[#d6c7b2] text-transparent'
                      }">
                        <i class="fa-solid fa-check text-[11px]"></i>
                      </span>
                    </button>
                  `;
                })
                .join('')}
            </div>
          </div>

          <!-- Total Photos Counter Banner (Min 3, Max 10) -->
          <div class="p-3.5 rounded-2xl border-2 ${
            totalPhotos >= 3 && totalPhotos <= 10
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          } flex items-center justify-between gap-2 text-xs font-black">
            <span>إجمالي صور المجموعة: ${totalPhotos} من 10</span>
            <span>الحد الأدنى: 3 صور</span>
          </div>

          <!-- 2. Per-Pet Individual Photos (Mandatory separate photos first) -->
          <div class="space-y-3">
            <label class="block text-sm sm:text-base font-black text-[#2d221b]">
              2. الصور المنفصلة لكل حيوان (تظهر أولاً لإبراز هوية كل أليف)
            </label>

            ${selectedPets
              .map((pet) => {
                const petPhotos = draft.memberPhotosByPetId[pet.id] || [];
                const canAddMore = totalPhotos < 10;
                return `
                  <div class="p-3.5 rounded-[24px] bg-[#fffefc] border-2 border-[#d6c7b2] space-y-2.5 shadow-sm">
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="text-base">${pet.species === 'dog' ? '🐶' : '🐱'}</span>
                        <span class="text-sm font-black text-[#1a1612]">صور ${pet.name} المنفصلة</span>
                      </div>
                      <span class="text-[11px] font-black px-2 py-0.5 rounded-full ${
                        petPhotos.length >= 1
                          ? 'bg-[#fff5ea] text-[#e67e22]'
                          : 'bg-amber-100 text-amber-900'
                      }">
                        ${petPhotos.length} صورة
                      </span>
                    </div>

                    <div class="grid grid-cols-4 gap-2">
                      ${petPhotos
                        .map(
                          (src, idx) => `
                            <div class="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#e67e22] bg-[#faf6ed]">
                              <img src="${src}" alt="${pet.name} ${idx + 1}" class="w-full h-full object-cover" />
                              ${
                                petPhotos.length > 1
                                  ? `
                                    <button
                                      type="button"
                                      data-remove-member-photo="${pet.id}"
                                      data-photo-index="${idx}"
                                      class="remove-member-photo-btn absolute top-1 left-1 w-7 h-7 rounded-full bg-black/70 text-white text-sm flex items-center justify-center cursor-pointer active:scale-90"
                                      aria-label="حذف الصورة"
                                    >
                                      ×
                                    </button>
                                  `
                                  : ''
                              }
                            </div>
                          `
                        )
                        .join('')}

                      ${
                        canAddMore
                          ? `
                            <label class="aspect-square rounded-2xl border-2 border-dashed border-[#e67e22] bg-[#fffbf2] hover:bg-[#fff5ea] flex flex-col items-center justify-center cursor-pointer text-[#e67e22] transition">
                              <input
                                type="file"
                                accept="image/*"
                                class="hidden add-member-photo-input"
                                data-member-pet-id="${pet.id}"
                              />
                              <span class="text-xl font-black">+</span>
                              <span class="text-[10px] font-bold">إضافة</span>
                            </label>
                          `
                          : ''
                      }
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>

          <!-- 3. Optional Collective Photos (Shared) -->
          <div class="p-3.5 rounded-[24px] bg-[#fffefc] border-2 border-[#d6c7b2] space-y-2.5 shadow-sm">
            <div class="flex items-center justify-between gap-2">
              <div>
                <span class="text-sm font-black text-[#1a1612] block">3. صور جماعية معاً (اختياري)</span>
                <span class="text-[11px] font-bold text-[#786555]">تظهر بعد الصور الفردية — غير إجبارية</span>
              </div>
              <span class="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#f3ebdd] text-[#786555]">
                ${draft.sharedGroupPhotos.length} جماعية
              </span>
            </div>

            <div class="grid grid-cols-4 gap-2">
              ${draft.sharedGroupPhotos
                .map(
                  (src, idx) => `
                    <div class="relative aspect-square rounded-2xl overflow-hidden border-2 border-brand-orange/80 bg-[#faf6ed]">
                      <img src="${src}" alt="صورة جماعية ${idx + 1}" class="w-full h-full object-cover" />
                      <button
                        type="button"
                        data-remove-shared-photo="${idx}"
                        class="remove-shared-photo-btn absolute top-1 left-1 w-7 h-7 rounded-full bg-black/70 text-white text-sm flex items-center justify-center cursor-pointer active:scale-90"
                        aria-label="حذف الصورة الجماعية"
                      >
                        ×
                      </button>
                    </div>
                  `
                )
                .join('')}

              ${
                totalPhotos < 10
                  ? `
                    <label class="aspect-square rounded-2xl border-2 border-dashed border-brand-orange/65 bg-[#fffbf2] hover:bg-[#fff5ea] flex flex-col items-center justify-center cursor-pointer text-brand-orange transition">
                      <input type="file" accept="image/*" class="hidden add-shared-photo-input" />
                      <span class="text-xl font-black">+</span>
                      <span class="text-[10px] font-bold">جماعية</span>
                    </label>
                  `
                  : ''
              }
            </div>
          </div>

          <!-- 4. Must Adopt Together Toggle & Reason -->
          <div class="space-y-3">
            <label class="block text-sm font-black text-[#2d221b]">شرط التبني الجماعي</label>
            <div class="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                id="group-must-together-yes"
                class="py-3.5 px-4 rounded-full border-2 text-xs sm:text-sm font-black cursor-pointer transition ${
                  draft.mustAdoptTogether
                    ? 'border-brand-orange bg-[#fff5ea] text-brand-orange'
                    : 'border-[#d6c7b2] bg-[#fffefc] text-[#786555]'
                }"
              >
                يُشترط تبنيهم معاً
              </button>
              <button
                type="button"
                id="group-must-together-no"
                class="py-3.5 px-4 rounded-full border-2 text-xs sm:text-sm font-black cursor-pointer transition ${
                  !draft.mustAdoptTogether
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-[#d6c7b2] bg-[#fffefc] text-[#786555]'
                }"
              >
                يمكن التبني منفرداً أو معاً
              </button>
            </div>

            <div class="space-y-1.5">
              <label for="group-adoption-reason-input" class="block text-sm font-bold text-[#2d221b]">ملاحظة أو سبب التبني (اختياري)</label>
              <textarea
                id="group-adoption-reason-input"
                rows="2"
                placeholder="مثال: مترابطون جداً ويفضل بقاؤهم معاً..."
                class="w-full p-3.5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[22px] text-xs sm:text-sm font-bold text-[#1a1612] focus:outline-none focus:border-[#e67e22]"
              >${draft.adoptionReason}</textarea>
            </div>
          </div>

          ${
            draft.validationMessage
              ? `<div class="p-3 rounded-2xl bg-[#fff5ea] border border-[#e67e22] text-[#9a3412] text-xs font-black text-center">${draft.validationMessage}</div>`
              : ''
          }
        </div>

        <!-- Footer Buttons -->
        <div class="pt-4 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-4 border-t border-[#d6c7b2]/70 bg-[#FFF9E9] space-y-2 shrink-0">
          <button
            id="save-group-adoption-btn"
            type="button"
            ${canSave ? '' : 'disabled'}
            class="w-full h-14 rounded-full font-black text-base sm:text-lg shadow-md flex items-center justify-center gap-2 transition ${
              canSave
                ? 'bg-brand-orange hover:bg-brand-accent text-white cursor-pointer active:scale-[0.98]'
                : 'bg-[#d6c7b2] text-white/90 cursor-not-allowed'
            }"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>${existingGroup ? 'مراجعة وتأكيد التعديلات' : 'مراجعة وتأكيد الإعلانات'}</span>
          </button>

          ${
            existingGroup
              ? `
                <button
                  id="dissolve-group-adoption-btn"
                  type="button"
                  class="w-full py-2.5 rounded-full bg-white border border-[#d6c7b2] text-[#786555] hover:bg-[#faf6ed] hover:text-[#2d221b] hover:border-[#e67e22]/50 text-xs font-black cursor-pointer transition"
                >
                  فصل المجموعة وعرض كل حيوان في ملف مستقل
                </button>
              `
              : ''
          }
        </div>

      </div>
    </div>
  `;
}

export function attachGroupAdoptionModalEvents(): void {
  // 1. Choice Modal Events
  const pendingPet = state.getPendingGroupChoicePet();
  if (pendingPet) {
    const closeChoice = document.getElementById('close-group-choice-btn');
    const choiceBackdrop = document.getElementById('group-choice-backdrop');
    const groupBtn = document.getElementById('choose-group-adoption-btn');
    const indepBtn = document.getElementById('choose-independent-adoption-btn');
    const bothBtn = document.getElementById('choose-both-adoption-btn');
    const confirmSepBtn = document.getElementById('confirm-separate-choice-btn');
    const backChoiceBtn = document.getElementById('back-group-choice-btn');

    const closeModal = () => {
      resetChoiceState();
      state.cancelPendingGroupChoice();
    };

    if (closeChoice) closeChoice.addEventListener('click', closeModal);
    if (choiceBackdrop) {
      choiceBackdrop.addEventListener('click', (e) => {
        if (e.target === choiceBackdrop) closeModal();
      });
    }
    const choiceSheet = document.getElementById('group-choice-sheet');
    if (choiceSheet) {
      attachSheetDragToDismiss(choiceSheet, {
        backdropEl: choiceBackdrop,
        handleSelector: '#group-choice-drag-handle',
        scrollContainerSelector: '#group-choice-sheet',
        onClose: closeModal,
      });
    }
    if (groupBtn) {
      groupBtn.addEventListener('click', () => {
        resetDraft();
        resetChoiceState();
        state.chooseGroupAdoption(pendingPet.id);
      });
    }
    if (indepBtn) {
      indepBtn.addEventListener('click', () => {
        pendingChoiceStep = { petId: pendingPet.id, confirmMode: 'separate' };
        state.setCurrentTab(state.getCurrentTab());
      });
    }
    if (bothBtn) {
      bothBtn.addEventListener('click', () => {
        resetDraft();
        resetChoiceState();
        state.chooseBothAdoption(pendingPet.id);
      });
    }
    if (backChoiceBtn) {
      backChoiceBtn.addEventListener('click', () => {
        pendingChoiceStep = { petId: pendingPet.id, confirmMode: null };
        state.setCurrentTab(state.getCurrentTab());
      });
    }
    if (confirmSepBtn) {
      confirmSepBtn.addEventListener('click', () => {
        if (isSubmittingAction) return;
        isSubmittingAction = true;
        resetChoiceState();
        state.chooseIndependentAdoption(pendingPet.id);
      });
    }
    return;
  }

  // 2. Editor Modal Events
  if (!state.getIsGroupAdoptionEditorOpen()) return;

  const rerenderEditorOnly = () => {
    state.setCurrentTab(state.getCurrentTab());
  };

  const closeBtn = document.getElementById('close-group-editor-btn');
  const backdrop = document.getElementById('group-editor-backdrop');
  const editorSheet = document.getElementById('group-editor-sheet');
  const closeEditor = () => {
    resetDraft();
    state.closeGroupAdoptionEditor();
  };
  if (closeBtn) closeBtn.addEventListener('click', closeEditor);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeEditor();
    });
  }
  if (editorSheet) {
    attachSheetDragToDismiss(editorSheet, {
      backdropEl: backdrop,
      handleSelector: '#group-editor-drag-handle',
      scrollContainerSelector: '#group-editor-scroll',
      onClose: closeEditor,
    });
  }

  // Confirmation step events
  if (draft.step === 'confirm') {
    const confirmPublishBtn = document.getElementById('confirm-publish-group-adoption-btn');
    const backToEditorBtn = document.getElementById('back-to-group-editor-btn');
    if (backToEditorBtn) {
      backToEditorBtn.addEventListener('click', () => {
        draft.step = 'edit';
        rerenderEditorOnly();
      });
    }
    if (confirmPublishBtn) {
      confirmPublishBtn.addEventListener('click', () => {
        if (isSubmittingAction) return;
        isSubmittingAction = true;
        const saved = state.saveGroupAdoptionListing({
          orderedPetIds: draft.selectedPetIds,
          memberPhotosByPetId: draft.memberPhotosByPetId,
          sharedGroupPhotos: draft.sharedGroupPhotos,
          mustAdoptTogether: draft.mustAdoptTogether,
          adoptionReason: draft.adoptionReason,
          publishMode: draft.publishMode,
        });
        if (saved) {
          resetDraft();
        } else {
          isSubmittingAction = false;
        }
      });
    }
    return;
  }

  // Publish Mode toggles
  const modeGroupOnlyBtn = document.getElementById('mode-group-only-btn');
  const modeBothBtn = document.getElementById('mode-both-btn');
  if (modeGroupOnlyBtn) {
    modeGroupOnlyBtn.addEventListener('click', () => {
      draft.publishMode = 'group_only';
      rerenderEditorOnly();
    });
  }
  if (modeBothBtn) {
    modeBothBtn.addEventListener('click', () => {
      draft.publishMode = 'both';
      rerenderEditorOnly();
    });
  }

  // Toggle Pet inclusion
  document.querySelectorAll<HTMLButtonElement>('.group-pet-select-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const petId = btn.getAttribute('data-toggle-group-pet');
      if (!petId) return;
      if (draft.selectedPetIds.includes(petId)) {
        if (draft.selectedPetIds.length <= 2) {
          draft.validationMessage = 'يجب أن تضم المجموعة حيوانين على الأقل.';
          rerenderEditorOnly();
          return;
        }
        draft.selectedPetIds = draft.selectedPetIds.filter((id) => id !== petId);
      } else {
        const pet = state.getUserPets().find((p) => p.id === petId);
        if (pet && (!draft.memberPhotosByPetId[petId] || draft.memberPhotosByPetId[petId].length === 0)) {
          draft.memberPhotosByPetId[petId] = pet.photos.slice(0, 1);
        }
        if (getTotalDraftPhotoCount() + (draft.memberPhotosByPetId[petId]?.length || 0) > 10) {
          draft.memberPhotosByPetId[petId] = (draft.memberPhotosByPetId[petId] || []).slice(0, 1);
        }
        if (getTotalDraftPhotoCount() >= 10) {
          draft.validationMessage = 'تم الوصول للحد الأقصى 10 صور. احذف صورة أولاً لإضافة حيوان آخر.';
          rerenderEditorOnly();
          return;
        }
        draft.selectedPetIds = [...draft.selectedPetIds, petId];
      }
      draft.validationMessage = '';
      rerenderEditorOnly();
    });
  });

  // Add Member Separate Photo
  document.querySelectorAll<HTMLInputElement>('.add-member-photo-input').forEach((input) => {
    input.addEventListener('change', () => {
      const petId = input.getAttribute('data-member-pet-id');
      const file = input.files?.[0];
      if (!petId || !file) return;
      if (getTotalDraftPhotoCount() >= 10) {
        draft.validationMessage = 'الحد الأقصى للصور في المجموعة هو 10 صور.';
        rerenderEditorOnly();
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          draft.memberPhotosByPetId[petId] = [
            ...(draft.memberPhotosByPetId[petId] || []),
            reader.result,
          ];
          draft.validationMessage = '';
          rerenderEditorOnly();
        }
      };
      reader.readAsDataURL(file);
    });
  });

  // Remove Member Separate Photo
  document.querySelectorAll<HTMLButtonElement>('.remove-member-photo-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const petId = btn.getAttribute('data-remove-member-photo');
      const idxStr = btn.getAttribute('data-photo-index');
      if (!petId || idxStr === null) return;
      const idx = parseInt(idxStr, 10);
      const list = draft.memberPhotosByPetId[petId] || [];
      if (list.length <= 1) return;
      draft.memberPhotosByPetId[petId] = list.filter((_, i) => i !== idx);
      draft.validationMessage = '';
      rerenderEditorOnly();
    });
  });

  // Add Optional Shared Collective Photo
  const sharedInput = document.querySelector<HTMLInputElement>('.add-shared-photo-input');
  if (sharedInput) {
    sharedInput.addEventListener('change', () => {
      const file = sharedInput.files?.[0];
      if (!file) return;
      if (getTotalDraftPhotoCount() >= 10) {
        draft.validationMessage = 'الحد الأقصى للصور في المجموعة هو 10 صور.';
        rerenderEditorOnly();
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          draft.sharedGroupPhotos = [...draft.sharedGroupPhotos, reader.result];
          draft.validationMessage = '';
          rerenderEditorOnly();
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Remove Shared Collective Photo
  document.querySelectorAll<HTMLButtonElement>('.remove-shared-photo-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idxStr = btn.getAttribute('data-remove-shared-photo');
      if (idxStr === null) return;
      const idx = parseInt(idxStr, 10);
      draft.sharedGroupPhotos = draft.sharedGroupPhotos.filter((_, i) => i !== idx);
      draft.validationMessage = '';
      rerenderEditorOnly();
    });
  });

  // Must Adopt Together toggle
  const mustYes = document.getElementById('group-must-together-yes');
  const mustNo = document.getElementById('group-must-together-no');
  if (mustYes) {
    mustYes.addEventListener('click', () => {
      draft.mustAdoptTogether = true;
      rerenderEditorOnly();
    });
  }
  if (mustNo) {
    mustNo.addEventListener('click', () => {
      draft.mustAdoptTogether = false;
      rerenderEditorOnly();
    });
  }

  // Reason input live sync
  const reasonInput = document.getElementById('group-adoption-reason-input') as HTMLTextAreaElement | null;
  if (reasonInput) {
    reasonInput.addEventListener('input', () => {
      draft.adoptionReason = reasonInput.value;
    });
  }

  // Proceed to Final Confirmation Summary Step
  const saveBtn = document.getElementById('save-group-adoption-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (reasonInput) {
        draft.adoptionReason = reasonInput.value;
      }
      const total = getTotalDraftPhotoCount();
      if (draft.selectedPetIds.length < 2) {
        draft.validationMessage = 'يجب اختيار حيوانين على الأقل للتبني الجماعي.';
        rerenderEditorOnly();
        return;
      }
      if (total < 3 || total > 10) {
        draft.validationMessage = 'يجب أن يتراوح إجمالي الصور بين 3 و 10 صور.';
        rerenderEditorOnly();
        return;
      }
      draft.validationMessage = '';
      draft.step = 'confirm';
      rerenderEditorOnly();
    });
  }

  // Dissolve Group Back to Independent (asks confirmation via ProfileView modal)
  const dissolveBtn = document.getElementById('dissolve-group-adoption-btn');
  if (dissolveBtn) {
    dissolveBtn.addEventListener('click', () => {
      resetDraft();
      state.closeGroupAdoptionEditor();
      state.requestAdoptionActionConfirm('dissolve_group');
    });
  }
}
