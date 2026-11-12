import { state } from '../../state.ts';
import { getViewMode } from '../components/Header.ts';

export function renderMatingView(): string {
  const primaryPet = state.getPrimaryUserMatingPet();
  const filters = state.getMatingFilters();
  const pets = state.getFilteredMatingPets();
  const viewMode = getViewMode();

  return `
    <div class="max-w-md mx-auto px-4 pt-2 pb-24 flex-1 space-y-4">

      <!-- Dismissible Meow Advice Message (Small message with X button) -->
      ${
        !state.getIsAdviceDismissed()
          ? `
          <div id="meow-advice-banner" class="bg-amber-50/90 dark:bg-[#342A24] border border-brand-peachBorder/70 dark:border-warm-darkBorder rounded-2xl px-4 py-3 flex items-center justify-between gap-3 text-sm text-brand-dark/90 dark:text-white shadow-2xs transition-all">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="text-lg text-brand-orange shrink-0">💡</span>
              <p class="m-0 font-bold text-xs sm:text-sm leading-normal">
                <strong class="text-brand-orange font-black">نصيحة Meow:</strong> نوصيك باختيار الفلاتر المناسبة لتجربة تزاوج ناجحة ومريحة لحيوانك الأليف!
              </p>
            </div>
            <button
              id="dismiss-advice-btn"
              class="w-6 h-6 rounded-full flex items-center justify-center text-brand-subtleGray dark:text-[#A89F91] hover:text-brand-orange hover:bg-black/5 dark:hover:bg-white/10 shrink-0 cursor-pointer transition active:scale-90"
              type="button"
              aria-label="إغلاق الرسالة"
              title="إغلاق"
            >
              <i class="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
          `
          : ''
      }

      <!-- Count Bar -->
      <div class="flex items-center justify-between gap-2 px-1">
        <div class="flex items-center gap-1.5 text-sm font-extrabold text-brand-dark dark:text-white">
          <span class="text-brand-orange text-lg">🐾</span>
          <span class="text-sm font-black text-brand-orange px-2.5 py-1 rounded-xl bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder shadow-2xs">${pets.length} متاح</span>
        </div>
      </div>

      <!-- Cats Cards Grid (Exact Reference Screenshot 1: 2-column cards, clear heart save button, badge 'للزواج' with no star, no % compatibility) -->
      ${
        pets.length === 0
          ? `
          <div class="bg-white/80 dark:bg-[#27201B]/80 border border-brand-peachBorder/70 dark:border-warm-darkBorder rounded-3xl p-8 text-center space-y-3">
            <span class="text-4xl block">🐾</span>
            <h3 class="text-base font-black text-brand-dark dark:text-white">لم نجد حيوانات مطابقة للفلتر المحدد</h3>
            <p class="text-xs text-brand-subtleGray dark:text-[#A89F91] max-w-xs mx-auto">
              جرب تغيير معايير البحث أو إلغاء بعض الفلاتر لرؤية المزيد من خيارات التزاوج.
            </p>
          </div>
          `
          : `
          <div class="${viewMode === 'grid' ? 'grid grid-cols-2 gap-3 sm:gap-3.5' : 'flex flex-col gap-3.5'}" data-purpose="pet-listings-grid">
            ${pets
              .map((pet) => {
                const isSaved = state.isPetSaved(pet.id);

                if (viewMode === 'grid') {
                  return `
                    <article
                      class="pet-card bg-white dark:bg-[#27201B] rounded-3xl border border-brand-peachBorder dark:border-warm-darkBorder overflow-hidden shadow-card flex flex-col group transition-all duration-300 hover:shadow-soft cursor-pointer relative"
                      data-pet-detail-id="${pet.id}"
                      data-pet-type="${pet.species}"
                    >
                      <!-- Photo with 'للزواج' Badge (NO STAR) & Heart Save Button (NO MESSAGE ICON) -->
                      <div class="relative w-full aspect-[4/4.5] sm:aspect-[4/4.2] overflow-hidden bg-brand-peachBorder/30 dark:bg-[#342A24]">
                        <img
                          alt="${pet.name}"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src="${pet.photos[0]}"
                          loading="lazy"
                        />

                        <!-- Heart Save Button (Replacing message icon, functioning as save/favorite) -->
                        <button
                          type="button"
                          aria-label="حفظ الأليف"
                          class="toggle-save-pet-btn absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all cursor-pointer z-10 active:scale-85"
                          data-pet-save-id="${pet.id}"
                          title="${isSaved ? 'إزالة من المحفوظات' : 'حفظ في المحفوظات'}"
                        >
                          <i class="${isSaved ? 'fa-solid fa-heart text-red-500 scale-110' : 'fa-regular fa-heart text-white'} text-sm transition-transform"></i>
                        </button>

                        <!-- 'للزواج' Badge: ONLY 'للزواج' with NO star icon -->
                        <div class="absolute top-2.5 right-2.5 bg-brand-orange text-white px-3 py-1 rounded-xl text-xs font-black shadow-sm font-baloo pointer-events-none">
                          <span>للزواج</span>
                        </div>
                      </div>

                      <!-- Basic Info: Name, Age & Breed matching Screenshot 1 -->
                      <div class="p-3 text-right flex flex-col justify-between flex-1">
                        <div>
                          <h2 class="text-base sm:text-lg font-black text-brand-dark dark:text-white tracking-tight leading-tight font-baloo truncate">
                            ${pet.name}, ${pet.ageYears}
                          </h2>
                          <p class="text-xs font-bold text-brand-subtleGray dark:text-[#A89F91] mt-0.5 truncate">
                            ${pet.breed}
                          </p>
                        </div>
                      </div>
                    </article>
                  `;
                }

                // Single-column / Full card View Mode matching Reference Screenshot (Info over photo with gradient)
                return `
                  <article
                    class="pet-card bg-white dark:bg-[#27201B] rounded-[32px] border border-brand-peachBorder dark:border-warm-darkBorder overflow-hidden shadow-card flex flex-col group transition-all duration-300 hover:shadow-soft cursor-pointer relative"
                    data-pet-detail-id="${pet.id}"
                    data-pet-type="${pet.species}"
                  >
                    <!-- Photo filling card with Gradient & Superimposed Info matching Reference Screenshot -->
                    <div class="relative w-full aspect-[4/4.3] sm:aspect-[4/4] overflow-hidden bg-brand-peachBorder/30 dark:bg-[#342A24]">
                      <img
                        alt="${pet.name}"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src="${pet.photos[0]}"
                        loading="lazy"
                      />

                      <!-- Gradient Overlay from bottom up (prominent behind text, fading to top) -->
                      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none"></div>

                      <!-- Heart Save Button -->
                      <button
                        type="button"
                        aria-label="حفظ الأليف"
                        class="toggle-save-pet-btn absolute top-3.5 left-3.5 w-10 h-10 rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/65 transition-all cursor-pointer z-20 active:scale-90 shadow-md"
                        data-pet-save-id="${pet.id}"
                        title="${isSaved ? 'إزالة من المحفوظات' : 'حفظ في المحفوظات'}"
                      >
                        <i class="${isSaved ? 'fa-solid fa-heart text-red-500 scale-110' : 'fa-regular fa-heart text-white'} text-base transition-transform"></i>
                      </button>

                      <!-- 'للزواج' Badge (NO STAR) -->
                      <div class="absolute top-3.5 right-3.5 bg-brand-orange text-white px-4 py-1.5 rounded-2xl text-xs sm:text-sm font-black shadow-md font-baloo pointer-events-none z-20">
                        <span>للزواج</span>
                      </div>

                      <!-- Basic Info Overlaid on Image with Gradient: Name, Age, Location, Breed & Traits -->
                      <div class="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-right flex flex-col gap-1.5 z-20 text-white">
                        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight font-baloo drop-shadow-md m-0">
                          ${pet.name}, ${pet.ageYears}
                        </h2>
                        <p class="text-xs sm:text-sm font-bold text-white/95 drop-shadow-sm m-0 font-baloo flex items-center gap-1.5">
                          <span>${pet.area}، ${pet.city}</span>
                          <span class="opacity-70">•</span>
                          <span>${pet.breed}</span>
                        </p>

                        <!-- Traits Chips on Photo (e.g. ذكي, مرح) -->
                        <div class="flex items-center gap-2 flex-wrap pt-1.5">
                          ${pet.personality
                            .slice(0, 3)
                            .map(
                              (trait) => `
                              <span class="px-3.5 py-1 rounded-full bg-white/25 backdrop-blur-md border border-white/30 text-white text-xs font-black shadow-2xs font-baloo">
                                ${trait}
                              </span>
                            `
                            )
                            .join('')}
                        </div>
                      </div>

                    </div>
                  </article>
                `;
              })
              .join('')}
          </div>
          `
      }

    </div>
  `;
}

export function attachMatingEvents(): void {
  // Dismiss Meow Advice Message
  const dismissBtn = document.getElementById('dismiss-advice-btn');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      state.dismissAdvice();
      const banner = document.getElementById('meow-advice-banner');
      if (banner) banner.remove();
    });
  }

  // Sort By
  const sortBy = document.getElementById('mating-sort-by') as HTMLSelectElement;
  if (sortBy) {
    sortBy.addEventListener('change', () => {
      state.setMatingFilters({ sortBy: sortBy.value as any });
    });
  }

  // Apply Advanced
  const applyBtn = document.getElementById('apply-advanced-filters-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const gender = (document.getElementById('mating-filter-gender') as HTMLSelectElement)?.value as any;
      const color = (document.getElementById('mating-filter-color') as HTMLInputElement)?.value;
      const breed = (document.getElementById('mating-search-breed') as HTMLInputElement)?.value;
      const city = (document.getElementById('mating-filter-city') as HTMLInputElement)?.value;

      state.setMatingFilters({
        gender: gender || 'all',
        color: color ? color.trim() : '',
        breed: breed ? breed.trim() : '',
        city: city ? city.trim() : '',
      });
    });
  }

  // Reset Filters
  const resetBtn = document.getElementById('reset-mating-filters-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.setMatingFilters({
        species: 'all',
        gender: 'all',
        breed: '',
        color: '',
        city: '',
        maxDistanceKm: 150,
      });
    });
  }

  // Toggle Save Pet (Heart button)
  const saveTriggers = document.querySelectorAll<HTMLElement>('.toggle-save-pet-btn');
  saveTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const petId = btn.getAttribute('data-pet-save-id');
      if (petId) {
        state.toggleSavePet(petId);
      }
    });
  });

  // Open Details Modal
  const detailTriggers = document.querySelectorAll<HTMLElement>('[data-pet-detail-id]');
  detailTriggers.forEach((el) => {
    el.addEventListener('click', () => {
      const petId = el.getAttribute('data-pet-detail-id');
      const pet = state.getFilteredMatingPets().find((p) => p.id === petId);
      if (pet) {
        state.setSelectedPetForDetail(pet);
      }
    });
  });

  // Open Request Modal
  const requestTriggers = document.querySelectorAll<HTMLElement>('[data-pet-request-id]');
  requestTriggers.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const petId = el.getAttribute('data-pet-request-id');
      const pet = state.getFilteredMatingPets().find((p) => p.id === petId);
      if (pet) {
        state.setSelectedPetForRequest(pet);
      }
    });
  });
}

