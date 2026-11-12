import { state } from '../../state.ts';
import { Pet } from '../../types.ts';

let activePhotoIndex = 0;
let isConfirmationDialogOpen = false;

export function renderPetDetailModal(pet: Pet | null): string {
  if (!pet) return '';

  const isUserPet = pet.ownerId === state.getUser().id;
  const isMating = pet.status === 'mating';
  const isAdoption = pet.status === 'adoption';
  const isMale = pet.gender === 'male';
  const isSaved = state.isPetSaved(pet.id);

  // Check if there is an accepted request with this owner to reveal phone
  const hasAcceptedRequest = state
    .getContactRequests()
    .some((r) => r.receiverPetId === pet.id && r.status === 'accepted');

  const showPhone =
    pet.ownerPrivacy === 'public' ||
    (pet.ownerPrivacy === 'limited_until_approved' && hasAcceptedRequest) ||
    isUserPet;

  const currentPhoto = pet.photos[activePhotoIndex] || pet.photos[0];

  return `
    <!-- Full-Screen Pet Profile View (Exact Reference Screenshot 2 layout with Meow Identity) -->
    <div id="pet-detail-modal-backdrop" class="fixed inset-0 z-[70] bg-[#FFF9E9] w-full min-h-screen overflow-y-auto flex flex-col text-[#2d221b] animate-fade-in" dir="rtl">
      
      <!-- Top Floating Navigation Buttons (Over Hero Photo) -->
      <div class="sticky top-0 z-40 w-full max-w-md mx-auto px-4 pt-3 flex items-center justify-between pointer-events-none">
        <button
          id="close-pet-detail-btn"
          class="h-11 w-11 rounded-full bg-black/45 dark:bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand-orange transition-all active:scale-95 cursor-pointer shadow-md pointer-events-auto"
          aria-label="رجوع"
          type="button"
        >
          <i class="fa-solid fa-arrow-right text-base"></i>
        </button>

        <div class="flex items-center gap-2 pointer-events-auto">
          <!-- Heart Save Button -->
          <button
            id="detail-save-pet-btn"
            data-pet-save-id="${pet.id}"
            class="toggle-save-pet-btn h-11 w-11 rounded-full bg-black/45 dark:bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all active:scale-95 cursor-pointer shadow-md"
            aria-label="حفظ الأليف"
            type="button"
          >
            <i class="${isSaved ? 'fa-solid fa-heart text-red-500 scale-110' : 'fa-regular fa-heart text-white'} text-base"></i>
          </button>
        </div>
      </div>

      <!-- Main Profile Scrollable Content -->
      <main class="w-full max-w-md mx-auto -mt-14 pb-32 flex-1 flex flex-col">
        
        <!-- 1. Hero Photo Slider filling width with rounded-b-3xl -->
        <div class="relative w-full aspect-[4/4.8] bg-black/10 dark:bg-black/40 overflow-hidden shadow-lg select-none">
          <img
            id="detail-main-photo"
            src="${currentPhoto}"
            alt="${pet.name}"
            class="w-full h-full object-cover transition-opacity duration-300"
          />

          <!-- Dots Indicator for Photos -->
          ${
            pet.photos.length > 1
              ? `
              <div class="absolute bottom-4 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
                ${pet.photos
                  .map(
                    (_, i) => `
                    <span class="h-2 rounded-full transition-all duration-300 ${
                      activePhotoIndex === i ? 'w-6 bg-brand-orange shadow-sm' : 'w-2 bg-white/70 backdrop-blur-xs'
                    }"></span>
                  `
                  )
                  .join('')}
              </div>

              <!-- Prev / Next Navigation Arrows -->
              <button
                id="detail-prev-photo-btn"
                type="button"
                aria-label="الصورة السابقة"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand-orange transition-all cursor-pointer shadow-md active:scale-90"
              >
                <i class="fa-solid fa-chevron-right text-xs"></i>
              </button>
              <button
                id="detail-next-photo-btn"
                type="button"
                aria-label="الصورة التالية"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand-orange transition-all cursor-pointer shadow-md active:scale-90"
              >
                <i class="fa-solid fa-chevron-left text-xs"></i>
              </button>
              `
              : ''
          }
        </div>

        <!-- 2. Profile Details Body (Elevated & Overlapping Photo with Rounded Top Corners matching Reference Screenshot) -->
        <div class="-mt-10 relative z-20 bg-[#FFF9E9] dark:bg-[#1C1713] rounded-t-[40px] px-5 pt-6 pb-6 shadow-2xl border-t border-brand-peachBorder/50 dark:border-warm-darkBorder flex flex-col gap-5">
          
          <!-- Badges & Title Block (Matching Screenshot: Name & Location on one side, Gender Pill on the other) -->
          <div class="flex items-start justify-between gap-3 text-right">
            <div>
              <h1 class="text-3xl sm:text-4xl font-black font-baloo text-brand-dark dark:text-white leading-tight m-0">
                ${pet.name}, ${pet.ageYears}
              </h1>
              <p class="text-xs sm:text-sm font-bold text-brand-subtleGray dark:text-[#A89F91] flex items-center gap-1.5 mt-1.5 m-0">
                <i class="fa-solid fa-location-dot text-brand-orange text-sm"></i>
                <span>${pet.area}، ${pet.city}</span>
              </p>
            </div>

            <!-- Gender Pill (Matching Screenshot 10:33 PM: Rounded Soft Pill) -->
            <div class="px-5 py-2 rounded-2xl bg-white dark:bg-[#27201B] border border-brand-peachBorder/70 dark:border-warm-darkBorder shadow-2xs font-baloo font-black text-sm sm:text-base shrink-0 ${
              isMale ? 'text-blue-600 dark:text-blue-400' : 'text-pink-600 dark:text-pink-400'
            }">
              ${isMale ? 'ذكر' : 'أنثى'}
            </div>
          </div>

          <!-- 3. Section: "عن [الاسم]" / About with Status Badge -->
          <div class="bg-white/85 dark:bg-[#27201B] border border-brand-peachBorder/80 dark:border-warm-darkBorder rounded-[32px] p-5 shadow-sm space-y-3 text-right">
            <div class="flex items-center justify-between">
              <h3 class="text-base sm:text-lg font-black font-baloo text-brand-dark dark:text-white flex items-center gap-2 m-0">
                <span>عن ${pet.name}</span>
                <span class="text-brand-orange text-lg">🐾</span>
              </h3>
              <span class="px-3.5 py-1 rounded-xl text-xs font-black shadow-2xs font-baloo ${
                isMating
                  ? 'bg-brand-orange text-white'
                  : isAdoption
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }">
                ${isMating ? 'للزواج' : isAdoption ? 'للتبني' : 'أليف شخصي'}
              </span>
            </div>

            <p class="text-sm sm:text-base font-semibold text-brand-dark/90 dark:text-[#E2D9CF] leading-relaxed">
              ${pet.healthNotes || 'أليف مرح ولطيف جداً، يتميز بالذكاء والهدوء ونظافة العادات، يعيش في بيئة منزلية مريحة ويبحث عن التوافق المناسب.'}
            </p>

            <!-- Personality Pills (ذكي، مرح، إلخ) -->
            <div class="flex items-center gap-2 flex-wrap pt-1">
              ${pet.personality
                .map(
                  (trait) => `
                  <span class="px-4 py-1.5 rounded-full bg-brand-cream/80 dark:bg-[#342A24] border border-brand-peachBorder/60 dark:border-warm-darkBorder text-xs sm:text-sm font-bold text-brand-dark dark:text-white shadow-2xs">
                    ${trait}
                  </span>
                `
                )
                .join('')}
            </div>
          </div>

          <!-- 4. Two Info Cards: الصحة & السلالة (More Rounded & Larger Legible Typography) -->
          <div class="grid grid-cols-2 gap-3.5">
            <!-- الصحة -->
            <div class="bg-white/85 dark:bg-[#27201B] border border-brand-peachBorder/80 dark:border-warm-darkBorder rounded-[28px] p-4 sm:p-5 flex flex-col gap-2 shadow-sm text-right">
              <div class="flex items-center gap-2">
                <span class="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-base shrink-0">
                  <i class="fa-solid fa-circle-check"></i>
                </span>
                <span class="text-xs sm:text-sm font-bold text-brand-subtleGray dark:text-[#A89F91]">الصحة</span>
              </div>
              <span class="text-base sm:text-lg font-black font-baloo text-brand-dark dark:text-white mt-1 leading-snug">
                ${
                  pet.vaccinationStatus === 'fully_vaccinated'
                    ? 'مُطعم بالكامل'
                    : pet.vaccinationStatus === 'partially_vaccinated'
                    ? 'مطعم جزئياً'
                    : 'تحت المتابعة'
                }
              </span>
            </div>

            <!-- السلالة -->
            <div class="bg-white/85 dark:bg-[#27201B] border border-brand-peachBorder/80 dark:border-warm-darkBorder rounded-[28px] p-4 sm:p-5 flex flex-col gap-2 shadow-sm text-right">
              <div class="flex items-center gap-2">
                <span class="w-9 h-9 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base shrink-0">
                  <i class="fa-solid fa-paw"></i>
                </span>
                <span class="text-xs sm:text-sm font-bold text-brand-subtleGray dark:text-[#A89F91]">السلالة</span>
              </div>
              <span class="text-base sm:text-lg font-black font-baloo text-brand-dark dark:text-white mt-1 leading-snug truncate">
                ${pet.breed}
              </span>
            </div>
          </div>

          <!-- 5. Owner Info Card (Matching Reference: No big owner photo, clean owner name display) -->
          <div class="bg-white/85 dark:bg-[#27201B] border border-brand-peachBorder/80 dark:border-warm-darkBorder rounded-[28px] p-4 sm:p-5 shadow-sm flex items-center justify-between gap-3 text-right">
            <div class="min-w-0 flex-1">
              <h4 class="text-lg sm:text-xl font-black font-baloo text-brand-dark dark:text-white truncate m-0">
                ${pet.ownerName}
              </h4>
              <p class="text-xs sm:text-sm font-bold text-brand-subtleGray dark:text-[#A89F91] mt-1 m-0">
                ${pet.area}، ${pet.city}
              </p>
              ${
                showPhone && pet.ownerPhone
                  ? `<p class="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono" dir="ltr">${pet.ownerPhone}</p>`
                  : ''
              }
            </div>

            <div class="flex items-center gap-1.5 text-xs sm:text-sm font-black font-baloo text-brand-orange bg-brand-orange/10 dark:bg-brand-orange/20 px-3.5 py-1.5 rounded-xl shrink-0">
              <span>مالك</span>
              <i class="fa-solid fa-chevron-left text-[10px]"></i>
            </div>
          </div>

        </div>

      </main>

      <!-- 6. Fixed Bottom Action Bar matching Reference (Pill / Rounded Button) -->
      <footer class="fixed bottom-0 inset-x-0 z-40 bg-[#FFF9E9]/95 dark:bg-[#1C1713]/95 backdrop-blur-md border-t border-brand-peachBorder/60 dark:border-warm-darkBorder p-4 shadow-2xl">
        <div class="max-w-md mx-auto">
          ${
            !isUserPet
              ? `
              <button
                id="modal-open-confirmation-btn"
                type="button"
                class="w-full h-14 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white font-black text-base sm:text-lg shadow-soft transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer active:scale-95 font-baloo"
              >
                <i class="fa-solid fa-comment text-xl"></i>
                <span>${isMating ? 'رسالة للتزاوج' : 'رسالة للتبني'}</span>
              </button>
              `
              : `
              <div class="w-full h-12 rounded-2xl bg-brand-cream/80 dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder flex items-center justify-center text-xs font-black text-brand-orange font-baloo">
                هذا الأليف مسجل ضمن حسابك الشخصي 👑
              </div>
              `
          }
        </div>
      </footer>

      <!-- Confirmation / Request Dialog Popup -->
      ${
        isConfirmationDialogOpen
          ? `
          <div id="confirmation-dialog-backdrop" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in" dir="rtl">
            <div class="bg-white dark:bg-[#27201B] w-full max-w-sm rounded-[28px] p-6 shadow-2xl border-2 border-brand-peachBorder dark:border-warm-darkBorder space-y-4 animate-scale-up text-right">
              
              <div class="flex items-center gap-3 pb-3 border-b border-brand-peachBorder/40 dark:border-warm-darkBorder">
                <div class="w-12 h-12 rounded-2xl bg-brand-orange/15 text-brand-orange flex items-center justify-center text-2xl shrink-0">
                  <i class="fa-solid fa-comments"></i>
                </div>
                <div>
                  <h3 class="text-lg font-black font-baloo text-brand-dark dark:text-white leading-tight m-0">
                    ${isMating ? 'إرسال طلب تزاوج' : 'إرسال طلب تبني'}
                  </h3>
                  <p class="text-xs font-bold text-brand-subtleGray dark:text-[#A89F91] m-0">تواصل مباشر وآمن مع المالك</p>
                </div>
              </div>

              <p class="text-xs font-semibold text-brand-dark/90 dark:text-[#D1C7BD] leading-relaxed">
                سيتم إرسال إشعار وفتح محادثة مباشرة مع <strong class="text-brand-orange">${pet.ownerName}</strong> بخصوص <strong class="text-brand-orange">${pet.name}</strong>.
              </p>

              <div class="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="confirm-send-request-btn"
                  type="button"
                  class="h-12 rounded-full bg-brand-orange text-white font-black text-sm shadow-soft hover:bg-brand-orangeHover transition-all active:scale-95 cursor-pointer font-baloo"
                >
                  تأكيد وإرسال ✓
                </button>
                <button
                  id="cancel-confirmation-btn"
                  type="button"
                  class="h-12 rounded-full bg-white dark:bg-[#342A24] border border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark dark:text-white font-black text-sm hover:bg-brand-peachBorder/20 transition-all active:scale-95 cursor-pointer font-baloo"
                >
                  إلغاء
                </button>
              </div>

            </div>
          </div>
          `
          : ''
      }

    </div>
  `;
}

export function attachPetDetailModalEvents(pet: Pet | null): void {
  if (!pet) return;

  const closeBtn = document.getElementById('close-pet-detail-btn');
  const handleClose = () => {
    activePhotoIndex = 0;
    isConfirmationDialogOpen = false;
    state.setSelectedPetForDetail(null);
  };

  if (closeBtn) closeBtn.addEventListener('click', handleClose);

  // Heart Save Button
  const saveBtn = document.getElementById('detail-save-pet-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      state.toggleSavePet(pet.id);
    });
  }

  // Next / Prev photo arrows
  const prevBtn = document.getElementById('detail-prev-photo-btn');
  const nextBtn = document.getElementById('detail-next-photo-btn');

  const updatePhoto = (newIdx: number) => {
    activePhotoIndex = (newIdx + pet.photos.length) % pet.photos.length;
    const mainPhoto = document.getElementById('detail-main-photo') as HTMLImageElement;
    if (mainPhoto && pet.photos[activePhotoIndex]) {
      mainPhoto.src = pet.photos[activePhotoIndex];
    }
    // Re-render modal to sync dots indicator
    state.setSelectedPetForDetail(pet);
  };

  if (prevBtn) prevBtn.addEventListener('click', () => updatePhoto(activePhotoIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updatePhoto(activePhotoIndex + 1));

  // Open Confirmation Dialog
  const openConfirmBtn = document.getElementById('modal-open-confirmation-btn');
  if (openConfirmBtn) {
    openConfirmBtn.addEventListener('click', () => {
      isConfirmationDialogOpen = true;
      state.setSelectedPetForDetail(pet);
    });
  }

  // Cancel Confirmation Dialog
  const cancelConfirmBtn = document.getElementById('cancel-confirmation-btn');
  const confirmBackdrop = document.getElementById('confirmation-dialog-backdrop');
  const handleCancelConfirmation = () => {
    isConfirmationDialogOpen = false;
    state.setSelectedPetForDetail(pet);
  };

  if (cancelConfirmBtn) cancelConfirmBtn.addEventListener('click', handleCancelConfirmation);
  if (confirmBackdrop) {
    confirmBackdrop.addEventListener('click', (e) => {
      if (e.target === confirmBackdrop) handleCancelConfirmation();
    });
  }

  // Confirm and Send Request
  const confirmSendBtn = document.getElementById('confirm-send-request-btn');
  if (confirmSendBtn) {
    confirmSendBtn.addEventListener('click', () => {
      isConfirmationDialogOpen = false;
      state.setSelectedPetForDetail(null);
      const message =
        pet.status === 'mating'
          ? `السلام عليكم، أود التنسيق معكم بخصوص تزاوج أليفي مع ${pet.name}.`
          : `السلام عليكم، أود تقديم طلب لتبني ${pet.name}.`;

      state.sendContactRequest(pet, message);
      state.setCurrentTab('chat');
    });
  }
}
