import { state } from '../../state.ts';
import { Pet, PetSpecies, PetGender, VaccinationStatus } from '../../types.ts';
import { CAT_BREEDS, DOG_BREEDS } from '../../data/egyptLocations.ts';
import { PERSONALITY_TRAITS } from '../views/OnboardingView.ts';
import {
  escapeAttr,
  escapeHtml,
  sanitizeImageSrc,
  validateUploadedFile,
} from '../../utils/sanitize.ts';
import { attachSheetDragToDismiss } from '../../utils/touchGestures.ts';

function getPetNameTextColorClass(gender: PetGender | null): string {
  if (gender === 'male') return 'text-[#60A5FA]';
  if (gender === 'female') return 'text-[#F472B6]';
  return 'text-[#1a1612]';
}

function renderBreedOptionsHtml(
  species: PetSpecies | null,
  includeNoHybridPrefix = false,
  selectedValue = ''
): string {
  if (!species) {
    return includeNoHybridPrefix
      ? `<option value="" selected>بدون هجين</option>`
      : `<option value="" selected>اختر النوع أولاً</option>`;
  }

  const baseBreeds = species === 'dog' ? DOG_BREEDS : CAT_BREEDS;
  const normalizedSelected = (selectedValue || '').trim();
  const hasCustom = Boolean(normalizedSelected && !baseBreeds.includes(normalizedSelected));
  const breeds = hasCustom ? [normalizedSelected, ...baseBreeds] : baseBreeds;

  if (includeNoHybridPrefix) {
    return [
      `<option value="" ${normalizedSelected === '' ? 'selected' : ''}>بدون هجين</option>`,
      ...breeds.map(
        (breed) =>
          `<option value="${escapeAttr(breed)}" ${breed === normalizedSelected ? 'selected' : ''}>${escapeHtml(breed)}</option>`
      ),
    ].join('');
  }

  return [
    `<option value="" ${normalizedSelected === '' ? 'selected' : ''}>اختر السلالة</option>`,
    ...breeds.map(
      (breed) =>
        `<option value="${escapeAttr(breed)}" ${breed === normalizedSelected ? 'selected' : ''}>${escapeHtml(breed)}</option>`
    ),
  ].join('');
}

export function renderAddPetModal(petToEdit: Pet | null): string {
  const isEdit = Boolean(petToEdit);

  // Strict parity with Onboarding Step 6: ZERO defaults on Add, full pre-fill on Edit
  const selectedSpecies: PetSpecies | null = petToEdit ? petToEdit.species : null;
  const selectedGender: PetGender | null = petToEdit ? petToEdit.gender : null;
  const selectedVaccination: 'yes' | 'no' | 'partial' | null = petToEdit
    ? petToEdit.vaccinationStatus === 'fully_vaccinated'
      ? 'yes'
      : petToEdit.vaccinationStatus === 'not_vaccinated'
      ? 'no'
      : 'partial'
    : null;

  const petName = petToEdit?.name || '';
  const petColor = petToEdit?.color || '';
  const petBreed = petToEdit?.breed || '';
  const petHybrid = petToEdit?.hybridBreed || '';
  const petAgeYears = petToEdit
    ? petToEdit.ageYears > 0 || petToEdit.ageMonths === 0
      ? String(petToEdit.ageYears)
      : ''
    : '';
  const petAgeMonths =
    petToEdit && petToEdit.ageMonths > 0 ? String(petToEdit.ageMonths) : '';
  const petNotes = petToEdit?.healthNotes || '';
  const existingPhotos = petToEdit?.photos || [];

  const petTraitsList = petToEdit?.personality || [];
  const selectedTraitsSet = new Set<string>(petTraitsList);
  const displayTraits = [
    ...PERSONALITY_TRAITS,
    ...petTraitsList.filter((t) => !PERSONALITY_TRAITS.includes(t)),
  ];

  const isTraitsValid = selectedTraitsSet.size >= 3 && selectedTraitsSet.size <= 6;
  const petNameColorClass = getPetNameTextColorClass(selectedGender);

  return `
    <div id="add-pet-modal-backdrop" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-fade-in" dir="rtl">
      <div id="add-pet-modal-sheet" class="bg-[#FFF9E9] rounded-t-[32px] rounded-b-none sm:rounded-3xl max-w-lg w-full border-2 border-b-0 sm:border-b-2 border-[#d6c7b2] shadow-2xl overflow-hidden my-0 sm:my-auto max-h-[92dvh] flex flex-col relative text-[#2d221b] animate-slide-up sm:animate-scale-up">

        <!-- Header matching Onboarding Step 6 & clean modal close -->
        <div id="add-pet-drag-handle" class="px-5 pt-2.5 pb-3.5 flex flex-col border-b border-[#d6c7b2]/60 bg-[#FFF9E9]/95 sticky top-0 z-10">
          <div class="w-12 h-1.5 rounded-full bg-[#d6c7b2] mx-auto mb-2.5 sm:hidden cursor-grab active:cursor-grabbing"></div>
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-10 h-10 rounded-2xl bg-[#e67e22]/15 text-[#e67e22] flex items-center justify-center text-lg shrink-0">
                <i class="fa-solid fa-paw"></i>
              </div>
              <h3 class="text-xl sm:text-2xl font-extrabold font-baloo text-[#1a1612] m-0 truncate">
                ${isEdit ? `تعديل بيانات: ${escapeHtml(petToEdit!.name)}` : 'تسجيل بيانات المياو'}
              </h3>
            </div>
            <button
              id="close-add-pet-modal-btn"
              class="w-10 h-10 rounded-full bg-[#fffefc] border border-[#d6c7b2] hover:bg-[#e67e22] hover:text-white text-[#2d221b] flex items-center justify-center cursor-pointer transition text-base active:scale-90 shrink-0"
              type="button"
              aria-label="إغلاق"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Scrollable Form Body (Exact same fields, order, colors & design as Onboarding Step 6) -->
        <form id="pet-form" novalidate class="p-4 sm:p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-5 overflow-y-auto overscroll-contain space-y-5 flex-1 font-baloo">

          <!-- 1. عندك ايه (قطة / كلب) -->
          <div class="space-y-2">
            <label class="block text-base font-bold text-[#2d221b]">عندك ايه</label>
            <div id="modal-pet-species-group" class="grid grid-cols-2 gap-3.5 rounded-[28px]">
              <button
                type="button"
                id="type-cat-btn"
                class="h-16 relative flex items-center justify-center gap-2.5 px-4 rounded-[28px] border-2 ${
                  selectedSpecies === 'cat'
                    ? 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold'
                } text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="text-2xl">🐱</span>
                <span class="font-black">قطة</span>
              </button>

              <button
                type="button"
                id="type-dog-btn"
                class="h-16 relative flex items-center justify-center gap-2 px-4 rounded-[28px] border-2 ${
                  selectedSpecies === 'dog'
                    ? 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold'
                } text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="text-2xl">🐶</span>
                <span class="font-black">كلب</span>
              </button>
              <input id="form-pet-species" type="hidden" value="${selectedSpecies || ''}" />
            </div>
          </div>

          <!-- 2. صور للمياو (3 مربعات) -->
          <div class="space-y-2">
            <label class="block text-base font-bold text-[#2d221b]">صور للمياو</label>
            <div id="modal-pet-photos-group" class="grid grid-cols-3 gap-3 rounded-3xl">
              ${[0, 1, 2]
                .map((idx) => {
                  const photo = existingPhotos[idx];
                  const isPrimary = idx === 0;
                  return `
                    <div class="relative aspect-square rounded-3xl border-2 overflow-hidden ${
                      isPrimary
                        ? 'border-[#e67e22] bg-[#fffbf2] hover:bg-[#fff5e5]'
                        : 'border-[#d6c7b2] bg-[#fffefc] hover:bg-[#faf6ed]'
                    } shadow-sm group">
                      <label class="w-full h-full flex items-center justify-center cursor-pointer">
                        <input accept="image/*" class="hidden add-pet-photo-input" data-photo-slot="${idx}" type="file" />
                        ${
                          photo
                            ? `<img src="${escapeAttr(sanitizeImageSrc(photo))}" alt="صورة ${idx + 1}" class="w-full h-full object-cover" />`
                            : `<span class="text-4xl font-black ${
                                isPrimary ? 'text-[#e67e22]' : 'text-[#998b7c]'
                              } group-hover:scale-110 transition-transform">+</span>`
                        }
                      </label>
                      ${
                        photo
                          ? `
                            <button
                              type="button"
                              data-clear-photo-slot="${idx}"
                              class="clear-pet-photo-btn absolute top-1.5 left-1.5 w-7 h-7 rounded-full bg-black/70 hover:bg-black/85 text-white text-sm font-black flex items-center justify-center cursor-pointer transition shadow-sm active:scale-90"
                              aria-label="إزالة الصورة"
                            >×</button>
                          `
                          : ''
                      }
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>

          <!-- 3. اسم المياو واللون -->
          <div class="grid grid-cols-2 gap-3 sm:gap-3.5">
            <div class="space-y-2 min-w-0">
              <label for="form-pet-name" class="block text-sm sm:text-base font-bold text-[#2d221b]">اسم المياو</label>
              <div class="relative flex items-center h-16">
                <input
                  type="text"
                  id="form-pet-name"
                  value="${escapeAttr(petName)}"
                  autocomplete="off"
                  class="w-full min-w-0 h-16 py-4 px-3 sm:px-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-base sm:text-lg font-black text-center ${petNameColorClass} focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                />
              </div>
            </div>

            <div class="space-y-2 min-w-0">
              <label for="form-pet-color" class="block text-sm sm:text-base font-bold text-[#2d221b]">اللون</label>
              <div class="relative flex items-center h-16">
                <input
                  type="text"
                  id="form-pet-color"
                  value="${escapeAttr(petColor)}"
                  autocomplete="off"
                  class="w-full min-w-0 h-16 py-4 px-3 sm:px-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-base sm:text-lg font-black text-center text-[#1a1612] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <!-- 4. السلالة وسلالة هجينة (اختياري) + 5. العمر -->
          <div class="space-y-3.5">
            <div class="grid grid-cols-2 gap-3 sm:gap-3.5">
              <div class="space-y-2 min-w-0">
                <label for="form-pet-breed" class="block text-sm sm:text-base font-black text-[#2d221b]">السلالة</label>
                <div class="relative flex items-center h-16">
                  <select
                    id="form-pet-breed"
                    ${selectedSpecies ? '' : 'disabled'}
                    class="w-full min-w-0 h-16 py-3 pr-3.5 sm:pr-4 pl-9 sm:pl-11 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-sm sm:text-base font-black text-right text-[#1a1612] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm appearance-none truncate ${
                      selectedSpecies ? 'cursor-pointer' : 'opacity-65 cursor-not-allowed'
                    }"
                  >
                    ${renderBreedOptionsHtml(selectedSpecies, false, petBreed)}
                  </select>
                  <div class="pointer-events-none absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 flex items-center text-[#786555]">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="space-y-2 min-w-0">
                <label for="form-pet-hybrid" class="block text-sm sm:text-base font-black text-[#2d221b] truncate">سلالة هجينة (اختياري)</label>
                <div class="relative flex items-center h-16">
                  <select
                    id="form-pet-hybrid"
                    ${selectedSpecies ? '' : 'disabled'}
                    class="w-full min-w-0 h-16 py-3 pr-3.5 sm:pr-4 pl-9 sm:pl-11 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-sm sm:text-base font-black text-right text-[#1a1612] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm appearance-none truncate ${
                      selectedSpecies ? 'cursor-pointer' : 'opacity-65 cursor-not-allowed'
                    }"
                  >
                    ${renderBreedOptionsHtml(selectedSpecies, true, petHybrid)}
                  </select>
                  <div class="pointer-events-none absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 flex items-center text-[#786555]">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- العمر -->
            <div class="space-y-2">
              <label class="block text-base font-black text-[#2d221b]">العمر</label>
              <div id="modal-pet-age-group" class="grid grid-cols-2 gap-3.5 h-16 rounded-[28px]">
                <div class="relative flex items-center h-16">
                  <input
                    type="number"
                    id="form-pet-age-years"
                    inputmode="numeric"
                    min="0"
                    max="25"
                    placeholder="سنة"
                    value="${escapeAttr(petAgeYears)}"
                    class="w-full h-16 py-4 px-2 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-lg font-black text-center text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                  />
                </div>
                <div class="relative flex items-center h-16">
                  <input
                    type="number"
                    id="form-pet-age-months"
                    inputmode="numeric"
                    min="0"
                    max="11"
                    placeholder="شهر (اختياري)"
                    value="${escapeAttr(petAgeMonths)}"
                    class="w-full h-16 py-4 px-2 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-base font-black text-center text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 6. الجنس -->
          <div class="space-y-2">
            <label class="block text-base font-bold text-[#2d221b]">الجنس</label>
            <div id="modal-pet-gender-group" class="grid grid-cols-2 gap-3.5 rounded-[28px]">
              <button
                type="button"
                id="form-gender-male-btn"
                class="h-16 relative flex items-center justify-center gap-2 rounded-[28px] border-2 ${
                  selectedGender === 'male'
                    ? 'border-[#3b82f6] bg-[#eff6ff] text-[#2563eb]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-xl px-5"
              >
                <span class="font-black">ذكر</span>
              </button>

              <button
                type="button"
                id="form-gender-female-btn"
                class="h-16 relative flex items-center justify-center gap-2 px-5 rounded-[28px] border-2 ${
                  selectedGender === 'female'
                    ? 'border-[#ec4899] bg-[#fce7f3] text-[#db2777]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="font-black">انثى</span>
              </button>
              <input id="form-pet-gender" type="hidden" value="${selectedGender || ''}" />
            </div>
          </div>

          <!-- 7. حالة التطعيم -->
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <label class="block text-base font-black text-[#2d221b]">حالة التطعيم</label>
              ${
                selectedVaccination === 'partial'
                  ? `<span id="modal-vax-partial-note" class="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#fff5ea] text-[#e67e22] border border-[#e67e22]/30">المسجل حالياً: مطعم جزئياً</span>`
                  : ''
              }
            </div>
            <div id="modal-pet-vax-group" class="grid grid-cols-2 gap-3.5 h-16 rounded-[28px]">
              <button
                type="button"
                id="modal-vax-yes-btn"
                class="h-16 relative flex items-center justify-center gap-2 rounded-[28px] border-2 ${
                  selectedVaccination === 'yes'
                    ? 'border-[#10b981] bg-[#ecfdf5] text-[#059669]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-base px-2"
              >
                <i class="fa-solid fa-check"></i>
                <span class="font-black">مطعم</span>
              </button>

              <button
                type="button"
                id="modal-vax-no-btn"
                class="h-16 relative flex items-center justify-center gap-1.5 px-2 rounded-[28px] border-2 ${
                  selectedVaccination === 'no'
                    ? 'border-[#ea580c] bg-[#fff7ed] text-[#c2410c]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold text-base cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="font-black">غير مطعم</span>
              </button>
            </div>
          </div>

          <!-- 8. سمات الشخصية -->
          <div id="modal-pet-traits-group" class="space-y-2.5 pt-2 rounded-3xl">
            <div class="flex items-center justify-between gap-2 pb-1 flex-wrap">
              <div class="flex items-center gap-2">
                <label class="block text-xl font-black text-[#2d221b]">الشخصية</label>
                <span class="text-xs sm:text-sm font-bold text-[#8a7663] bg-[#fffbf2] border border-[#d6c7b2]/60 px-3 py-1 rounded-full shadow-sm">(اختر 3 إلى 6 صفات)</span>
              </div>
              <span
                id="modal-traits-count-badge"
                class="text-xs sm:text-sm font-black px-3 py-1 rounded-full border transition-all shadow-sm ${
                  isTraitsValid
                    ? 'bg-[#ecfdf5] text-[#059669] border-[#10b981]/30'
                    : 'bg-[#faecd8] text-[#c25807] border-[#e67e22]/20'
                }"
              >
                المحدد: ${selectedTraitsSet.size} من 6
              </span>
            </div>

            <div class="flex flex-wrap pt-2 gap-2.5 justify-start">
              ${displayTraits
                .map((trait) => {
                  const isSelected = selectedTraitsSet.has(trait);
                  return `
                    <button
                      type="button"
                      data-modal-trait-name="${escapeAttr(trait)}"
                      class="modal-trait-chip-btn rounded-full border-2 px-5 py-2.5 text-base transition-all cursor-pointer select-none active:scale-95 shadow-sm flex items-center justify-center ${
                        isSelected
                          ? 'border-[#e67300] bg-[#fff2e2] text-[#c25807] font-black ring-2 ring-[#e67300]/20'
                          : 'border-[#d6c7b2] bg-[#fffefc] text-[#6d5b4c] font-black hover:border-[#e67e22]/50'
                      }"
                    >
                      ${escapeHtml(trait)}
                    </button>
                  `;
                })
                .join('')}
            </div>

            <p id="modal-trait-limit-msg" class="text-xs font-bold text-[#c25807] hidden">الحد الأقصى هو 6 صفات فقط!</p>
          </div>

          <!-- 9. ملاحظات صحية / سلوكية -->
          <div class="space-y-2">
            <label for="form-pet-health-notes" class="block text-base font-bold text-[#2d221b]">ملاحظات صحية / سلوكية</label>
            <div class="relative flex items-center">
              <textarea
                id="form-pet-health-notes"
                rows="3"
                class="w-full p-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-lg font-black text-[#1a1612] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm resize-none"
              >${escapeHtml(petNotes)}</textarea>
            </div>
          </div>

          <!-- Validation Alert -->
          <div
            id="modal-pet-form-error"
            class="hidden rounded-2xl border-2 border-[#e67e22] bg-[#fff5ea] px-4 py-3 text-sm font-bold text-[#9a3412] leading-relaxed"
            role="alert"
          ></div>

          <!-- CTA Button -->
          <div class="pt-4">
            <button
              id="modal-btn-pet-submit"
              type="submit"
              class="w-full h-16 px-6 text-white bg-[#e67e22] hover:bg-[#ea580c] rounded-[28px] font-extrabold text-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-baloo"
            >
              <span>${isEdit ? 'حفظ التعديلات' : 'نونو على الكلام'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}

export function attachAddPetModalEvents(petToEdit: Pet | null): void {
  const closeBtn = document.getElementById('close-add-pet-modal-btn');
  const backdrop = document.getElementById('add-pet-modal-backdrop');
  const sheet = document.getElementById('add-pet-modal-sheet');
  const form = document.getElementById('pet-form') as HTMLFormElement | null;

  const handleClose = () => {
    state.setAddPetModalVisible(false, null);
  };

  if (closeBtn) closeBtn.addEventListener('click', handleClose);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) handleClose();
    });
  }
  if (sheet) {
    attachSheetDragToDismiss(sheet, {
      backdropEl: backdrop,
      handleSelector: '#add-pet-drag-handle',
      scrollContainerSelector: '#pet-form',
      onClose: handleClose,
    });
  }

  let currentSpecies: PetSpecies | null = petToEdit ? petToEdit.species : null;
  let currentGender: PetGender | null = petToEdit ? petToEdit.gender : null;
  let currentVaccination: 'yes' | 'no' | 'partial' | null = petToEdit
    ? petToEdit.vaccinationStatus === 'fully_vaccinated'
      ? 'yes'
      : petToEdit.vaccinationStatus === 'not_vaccinated'
      ? 'no'
      : 'partial'
    : null;
  const uploadedSlots: (string | undefined)[] = [
    petToEdit?.photos?.[0],
    petToEdit?.photos?.[1],
    petToEdit?.photos?.[2],
  ];
  const selectedTraits = new Set<string>(petToEdit?.personality || []);

  const speciesGroup = document.getElementById('modal-pet-species-group');
  const photosGroup = document.getElementById('modal-pet-photos-group');
  const catBtn = document.getElementById('type-cat-btn');
  const dogBtn = document.getElementById('type-dog-btn');
  const speciesInput = document.getElementById('form-pet-species') as HTMLInputElement | null;

  const petNameInput = document.getElementById('form-pet-name') as HTMLInputElement | null;
  const petColorInput = document.getElementById('form-pet-color') as HTMLInputElement | null;
  const breedSelect = document.getElementById('form-pet-breed') as HTMLSelectElement | null;
  const hybridSelect = document.getElementById('form-pet-hybrid') as HTMLSelectElement | null;
  const ageYearsInput = document.getElementById('form-pet-age-years') as HTMLInputElement | null;
  const ageMonthsInput = document.getElementById('form-pet-age-months') as HTMLInputElement | null;
  const petAgeGroup = document.getElementById('modal-pet-age-group');
  const petGenderGroup = document.getElementById('modal-pet-gender-group');
  const genderInput = document.getElementById('form-pet-gender') as HTMLInputElement | null;
  const maleBtn = document.getElementById('form-gender-male-btn');
  const femaleBtn = document.getElementById('form-gender-female-btn');
  const petVaxGroup = document.getElementById('modal-pet-vax-group');
  const vaxYesBtn = document.getElementById('modal-vax-yes-btn');
  const vaxNoBtn = document.getElementById('modal-vax-no-btn');
  const petTraitsGroup = document.getElementById('modal-pet-traits-group');
  const countBadge = document.getElementById('modal-traits-count-badge');
  const limitMsg = document.getElementById('modal-trait-limit-msg');
  const petNotesInput = document.getElementById('form-pet-health-notes') as HTMLTextAreaElement | null;
  const formError = document.getElementById('modal-pet-form-error');

  // Input clear validation highlights
  petNameInput?.addEventListener('input', () => {
    petNameInput.classList.remove('border-[#e67e22]', 'ring-2', 'ring-[#e67e22]/40');
  });
  petColorInput?.addEventListener('input', () => {
    petColorInput.classList.remove('border-[#e67e22]', 'ring-2', 'ring-[#e67e22]/40');
  });
  breedSelect?.addEventListener('change', () => {
    breedSelect.classList.remove('border-[#e67e22]', 'ring-2', 'ring-[#e67e22]/40');
  });

  // 1. Species toggle + dynamic breed dropdowns
  const updateSpeciesUI = (species: PetSpecies) => {
    const speciesChanged = currentSpecies !== species;
    currentSpecies = species;
    if (speciesInput) speciesInput.value = species;
    speciesGroup?.classList.remove('ring-2', 'ring-[#e67e22]', 'p-1');

    if (catBtn && dogBtn) {
      if (species === 'cat') {
        catBtn.className =
          'h-16 relative flex items-center justify-center gap-2.5 px-4 rounded-[28px] border-2 border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
        dogBtn.className =
          'h-16 relative flex items-center justify-center gap-2 px-4 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
      } else {
        dogBtn.className =
          'h-16 relative flex items-center justify-center gap-2 px-4 rounded-[28px] border-2 border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
        catBtn.className =
          'h-16 relative flex items-center justify-center gap-2.5 px-4 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
      }
    }

    const nextBreedVal = speciesChanged ? '' : breedSelect?.value || '';
    const nextHybridVal = speciesChanged ? '' : hybridSelect?.value || '';

    if (breedSelect) {
      breedSelect.disabled = false;
      breedSelect.classList.remove('opacity-65', 'cursor-not-allowed');
      breedSelect.classList.add('cursor-pointer');
      breedSelect.innerHTML = renderBreedOptionsHtml(species, false, nextBreedVal);
    }
    if (hybridSelect) {
      hybridSelect.disabled = false;
      hybridSelect.classList.remove('opacity-65', 'cursor-not-allowed');
      hybridSelect.classList.add('cursor-pointer');
      hybridSelect.innerHTML = renderBreedOptionsHtml(species, true, nextHybridVal);
    }
  };

  catBtn?.addEventListener('click', () => updateSpeciesUI('cat'));
  dogBtn?.addEventListener('click', () => updateSpeciesUI('dog'));

  // 2. Photo slot uploads & clear buttons
  const renderSlotState = (slotEl: HTMLElement, idx: number, photoUrl?: string) => {
    const label = slotEl.querySelector('label');
    if (label) {
      const existingImg = label.querySelector('img');
      const existingPlus = label.querySelector('span');
      if (photoUrl) {
        const safeUrl = sanitizeImageSrc(photoUrl, '');
        if (!safeUrl) return;
        if (existingPlus) existingPlus.remove();
        if (existingImg) {
          existingImg.src = safeUrl;
        } else {
          const img = document.createElement('img');
          img.src = safeUrl;
          img.alt = `صورة ${idx + 1}`;
          img.className = 'w-full h-full object-cover';
          label.appendChild(img);
        }
      } else {
        if (existingImg) existingImg.remove();
        if (!existingPlus) {
          const span = document.createElement('span');
          span.className = `text-4xl font-black ${
            idx === 0 ? 'text-[#e67e22]' : 'text-[#998b7c]'
          } group-hover:scale-110 transition-transform`;
          span.textContent = '+';
          label.appendChild(span);
        }
      }
    }
    const existingClear = slotEl.querySelector('.clear-pet-photo-btn');
    if (photoUrl && !existingClear) {
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.setAttribute('data-clear-photo-slot', String(idx));
      clearBtn.className =
        'clear-pet-photo-btn absolute top-1.5 left-1.5 w-7 h-7 rounded-full bg-black/70 hover:bg-black/85 text-white text-sm font-black flex items-center justify-center cursor-pointer transition shadow-sm active:scale-90';
      clearBtn.setAttribute('aria-label', 'إزالة الصورة');
      clearBtn.textContent = '×';
      clearBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        uploadedSlots[idx] = undefined;
        const inputEl = slotEl.querySelector<HTMLInputElement>('.add-pet-photo-input');
        if (inputEl) inputEl.value = '';
        renderSlotState(slotEl, idx, undefined);
      });
      slotEl.appendChild(clearBtn);
    } else if (!photoUrl && existingClear) {
      existingClear.remove();
    }
  };

  document.querySelectorAll<HTMLInputElement>('.add-pet-photo-input').forEach((input) => {
    input.addEventListener('change', () => {
      const slotStr = input.getAttribute('data-photo-slot');
      const slot = slotStr ? parseInt(slotStr, 10) : -1;
      const file = input.files?.[0];
      if (!file || slot < 0 || slot > 2) return;

      const check = validateUploadedFile(file, 'image');
      if (!check.valid) {
        input.value = '';
        if (formError) {
          formError.textContent = check.errorMessage || 'صيغة أو حجم الصورة غير مدعوم.';
          formError.classList.remove('hidden');
          formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      photosGroup?.classList.remove('ring-2', 'ring-[#e67e22]', 'p-1');
      if (formError) {
        formError.innerHTML = '';
        formError.classList.add('hidden');
      }

      const reader = new FileReader();
      reader.onload = () => {
        const rawResult = typeof reader.result === 'string' ? reader.result : undefined;
        const safeResult = rawResult ? sanitizeImageSrc(rawResult, '') : '';
        if (!safeResult) return;
        uploadedSlots[slot] = safeResult;
        const slotWrapper = input.closest('div');
        if (slotWrapper) {
          renderSlotState(slotWrapper, slot, safeResult);
        }
      };
      reader.readAsDataURL(file);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.clear-pet-photo-btn').forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const slotStr = btn.getAttribute('data-clear-photo-slot');
      const slot = slotStr ? parseInt(slotStr, 10) : -1;
      if (slot < 0 || slot > 2) return;
      uploadedSlots[slot] = undefined;
      const slotWrapper = btn.closest('div');
      if (slotWrapper) {
        const inputEl = slotWrapper.querySelector<HTMLInputElement>('.add-pet-photo-input');
        if (inputEl) inputEl.value = '';
        renderSlotState(slotWrapper, slot, undefined);
      }
    });
  });

  // 3. Age numeric sanitization
  ageYearsInput?.addEventListener('input', () => {
    ageYearsInput.value = ageYearsInput.value.replace(/[^0-9]/g, '');
    petAgeGroup?.classList.remove('ring-2', 'ring-[#e67e22]');
  });
  ageMonthsInput?.addEventListener('input', () => {
    ageMonthsInput.value = ageMonthsInput.value.replace(/[^0-9]/g, '');
    petAgeGroup?.classList.remove('ring-2', 'ring-[#e67e22]');
  });

  // 4. Gender Buttons + Live Pet Name Text Color
  const applyPetNameGenderColor = (gender: PetGender | null) => {
    if (!petNameInput) return;
    petNameInput.classList.remove('text-[#1a1612]', 'text-[#60A5FA]', 'text-[#F472B6]');
    petNameInput.classList.add(getPetNameTextColorClass(gender));
  };

  if (maleBtn && femaleBtn) {
    maleBtn.addEventListener('click', () => {
      currentGender = 'male';
      if (genderInput) genderInput.value = 'male';
      petGenderGroup?.classList.remove('ring-2', 'ring-[#e67e22]', 'p-1');
      maleBtn.className =
        'h-16 relative flex items-center justify-center gap-2 rounded-[28px] border-2 border-[#3b82f6] bg-[#eff6ff] text-[#2563eb] font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-xl px-5';
      femaleBtn.className =
        'h-16 relative flex items-center justify-center gap-2 px-5 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
      applyPetNameGenderColor('male');
    });
    femaleBtn.addEventListener('click', () => {
      currentGender = 'female';
      if (genderInput) genderInput.value = 'female';
      petGenderGroup?.classList.remove('ring-2', 'ring-[#e67e22]', 'p-1');
      femaleBtn.className =
        'h-16 relative flex items-center justify-center gap-2 px-5 rounded-[28px] border-2 border-[#ec4899] bg-[#fce7f3] text-[#db2777] font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
      maleBtn.className =
        'h-16 relative flex items-center justify-center gap-2 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-xl px-5';
      applyPetNameGenderColor('female');
    });
  }

  // 5. Vaccination Yes/No buttons
  if (vaxYesBtn && vaxNoBtn) {
    vaxYesBtn.addEventListener('click', () => {
      currentVaccination = 'yes';
      document.getElementById('modal-vax-partial-note')?.classList.add('hidden');
      petVaxGroup?.classList.remove('ring-2', 'ring-[#e67e22]', 'p-1');
      vaxYesBtn.className =
        'h-16 relative flex items-center justify-center gap-2 rounded-[28px] border-2 border-[#10b981] bg-[#ecfdf5] text-[#059669] font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-base px-2';
      vaxNoBtn.className =
        'h-16 relative flex items-center justify-center gap-1.5 px-2 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold text-base cursor-pointer shadow-sm transition-all active:scale-[0.98]';
    });
    vaxNoBtn.addEventListener('click', () => {
      currentVaccination = 'no';
      document.getElementById('modal-vax-partial-note')?.classList.add('hidden');
      petVaxGroup?.classList.remove('ring-2', 'ring-[#e67e22]', 'p-1');
      vaxNoBtn.className =
        'h-16 relative flex items-center justify-center gap-1.5 px-2 rounded-[28px] border-2 border-[#ea580c] bg-[#fff7ed] text-[#c2410c] font-bold text-base cursor-pointer shadow-sm transition-all active:scale-[0.98]';
      vaxYesBtn.className =
        'h-16 relative flex items-center justify-center gap-2 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-base px-2';
    });
  }

  // 6. Personality Trait Chips (3 to 6)
  document.querySelectorAll<HTMLButtonElement>('.modal-trait-chip-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const trait = btn.getAttribute('data-modal-trait-name');
      if (!trait) return;

      if (selectedTraits.has(trait)) {
        selectedTraits.delete(trait);
        btn.className =
          'modal-trait-chip-btn rounded-full border-2 px-5 py-2.5 text-base transition-all cursor-pointer select-none active:scale-95 shadow-sm flex items-center justify-center border-[#d6c7b2] bg-[#fffefc] text-[#6d5b4c] font-black hover:border-[#e67e22]/50';
        if (limitMsg) limitMsg.classList.add('hidden');
      } else {
        if (selectedTraits.size >= 6) {
          if (limitMsg) {
            limitMsg.classList.remove('hidden');
            setTimeout(() => limitMsg.classList.add('hidden'), 2500);
          }
          return;
        }
        selectedTraits.add(trait);
        btn.className =
          'modal-trait-chip-btn rounded-full border-2 px-5 py-2.5 text-base transition-all cursor-pointer select-none active:scale-95 shadow-sm flex items-center justify-center border-[#e67300] bg-[#fff2e2] text-[#c25807] font-black ring-2 ring-[#e67300]/20';
        if (limitMsg) limitMsg.classList.add('hidden');
      }

      if (selectedTraits.size >= 3) {
        petTraitsGroup?.classList.remove('ring-2', 'ring-[#e67e22]', 'p-2');
      }

      if (countBadge) {
        countBadge.textContent = `المحدد: ${selectedTraits.size} من 6`;
        if (selectedTraits.size >= 3) {
          countBadge.className =
            'text-xs sm:text-sm font-black px-3 py-1 rounded-full border transition-all shadow-sm bg-[#ecfdf5] text-[#059669] border-[#10b981]/30';
        } else {
          countBadge.className =
            'text-xs sm:text-sm font-black px-3 py-1 rounded-full border transition-all shadow-sm bg-[#faecd8] text-[#c25807] border-[#e67e22]/20';
        }
      }
    });
  });

  // 7. Submit handler (exact Onboarding Step 6 validation + zero data loss on Edit)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (petNameInput?.value || '').trim();
      const color = (petColorInput?.value || '').trim();
      const breed = (breedSelect?.value || '').trim();
      const hybridBreed = (hybridSelect?.value || '').trim();
      const ageYearsRaw = (ageYearsInput?.value || '').trim();
      const ageMonthsRaw = (ageMonthsInput?.value || '').trim();
      const notes = (petNotesInput?.value || '').trim();

      const ageYears = ageYearsRaw !== '' ? parseInt(ageYearsRaw, 10) : 0;
      const ageMonths = ageMonthsRaw !== '' ? parseInt(ageMonthsRaw, 10) : 0;
      const validPhotos = uploadedSlots.filter((p): p is string => Boolean(p));

      const errors: string[] = [];

      if (!currentSpecies) {
        errors.push('• يرجى اختيار نوع الأليف (قطة أو كلب).');
        speciesGroup?.classList.add('ring-2', 'ring-[#e67e22]', 'p-1');
      }
      if (validPhotos.length === 0) {
        errors.push('• يرجى إضافة صورة واحدة على الأقل للأليف.');
        photosGroup?.classList.add('ring-2', 'ring-[#e67e22]', 'p-1');
      }
      if (!name) {
        errors.push('• يرجى كتابة اسم الأليف.');
        petNameInput?.classList.add('border-[#e67e22]', 'ring-2', 'ring-[#e67e22]/40');
      }
      if (!color) {
        errors.push('• يرجى كتابة لون الأليف.');
        petColorInput?.classList.add('border-[#e67e22]', 'ring-2', 'ring-[#e67e22]/40');
      }
      if (!breed) {
        errors.push('• يرجى اختيار سلالة الأليف.');
        breedSelect?.classList.add('border-[#e67e22]', 'ring-2', 'ring-[#e67e22]/40');
      }
      if (
        (ageYearsRaw === '' && ageMonthsRaw === '') ||
        isNaN(ageYears) ||
        isNaN(ageMonths) ||
        ageYears < 0 ||
        ageYears > 25 ||
        ageMonths < 0 ||
        ageMonths > 11 ||
        ageYears + ageMonths === 0
      ) {
        errors.push('• يرجى إدخال عمر صحيح للأليف (سنوات من 0-25 أو أشهر من 1-11).');
        petAgeGroup?.classList.add('ring-2', 'ring-[#e67e22]');
      }
      if (!currentGender) {
        errors.push('• يرجى اختيار جنس الأليف (ذكر أو أنثى).');
        petGenderGroup?.classList.add('ring-2', 'ring-[#e67e22]', 'p-1');
      }
      if (!currentVaccination) {
        errors.push('• يرجى تحديد حالة التطعيم (مطعم أو غير مطعم).');
        petVaxGroup?.classList.add('ring-2', 'ring-[#e67e22]', 'p-1');
      }
      if (selectedTraits.size < 3 || selectedTraits.size > 6) {
        errors.push('• يرجى اختيار من 3 إلى 6 صفات شخصية للأليف.');
        petTraitsGroup?.classList.add('ring-2', 'ring-[#e67e22]', 'p-2');
      }

      if (errors.length > 0) {
        if (formError) {
          formError.innerHTML = errors.map((err) => escapeHtml(err)).join('<br />');
          formError.classList.remove('hidden');
          formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      if (formError) {
        formError.innerHTML = '';
        formError.classList.add('hidden');
      }

      const resolvedVaccination: VaccinationStatus =
        currentVaccination === 'yes'
          ? 'fully_vaccinated'
          : currentVaccination === 'partial'
          ? 'partially_vaccinated'
          : 'not_vaccinated';

      const currentUser = state.getUser();

      if (petToEdit) {
        // Edit mode: preserve untouched geo, status, adoption metadata, and healthStatus
        state.savePet({
          id: petToEdit.id,
          name,
          species: currentSpecies!,
          breed,
          hybridBreed: hybridBreed || undefined,
          color,
          gender: currentGender!,
          ageYears,
          ageMonths,
          vaccinationStatus: resolvedVaccination,
          personality: Array.from(selectedTraits),
          healthNotes: notes,
          photos: validPhotos,
        });
      } else {
        // Add mode: inherits user's geo hierarchy and starts in 'mating' like Onboarding Step 6
        state.savePet({
          name,
          species: currentSpecies!,
          breed,
          hybridBreed: hybridBreed || undefined,
          color,
          gender: currentGender!,
          ageYears,
          ageMonths,
          area: currentUser.village || currentUser.city || currentUser.governorate || 'القاهرة',
          city: currentUser.city || currentUser.governorate || 'القاهرة',
          governorate: currentUser.governorate || 'القاهرة',
          markaz: currentUser.markaz,
          village: currentUser.village,
          governorateId: currentUser.governorateId,
          markazId: currentUser.markazId,
          cityId: currentUser.cityId,
          villageId: currentUser.villageId,
          locationId: currentUser.locationId,
          lat: currentUser.lat,
          lng: currentUser.lng,
          vaccinationStatus: resolvedVaccination,
          personality: Array.from(selectedTraits),
          healthNotes: notes,
          photos: validPhotos,
          status: 'mating',
        });
      }
    });
  }
}
