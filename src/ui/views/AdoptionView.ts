import { state } from '../../state.ts';
import { getViewMode } from '../components/Header.ts';

export function renderAdoptionView(): string {
  const filters = state.getAdoptionFilters();
  const pets = state.getFilteredAdoptionPets();
  const viewMode = getViewMode();

  return `
    <main class="w-full max-w-md mx-auto px-4 pt-2 pb-24 flex-1 space-y-4">
      
      <!-- Dismissible Meow Advice Message (Small message with X button) -->
      ${
        !state.getIsAdviceDismissed()
          ? `
          <div id="meow-adoption-advice-banner" class="bg-amber-50/90 dark:bg-[#342A24] border border-brand-peachBorder/70 dark:border-warm-darkBorder rounded-2xl px-4 py-3 flex items-center justify-between gap-3 text-sm text-brand-dark/90 dark:text-white shadow-2xs transition-all">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="text-lg text-brand-orange shrink-0">💡</span>
              <p class="m-0 font-bold text-xs sm:text-sm leading-normal">
                <strong class="text-brand-orange font-black">نصيحة Meow:</strong> التبني مسؤولية جميلة، تواصل مع صاحب الأليف وتعرّف على احتياجاته!
              </p>
            </div>
            <button
              id="dismiss-adoption-advice-btn"
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

      <!-- Smart Warm Banner for Adoption -->
      <div class="bg-white/90 dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl p-4 shadow-sm relative overflow-hidden">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-brand-orange/15 border border-brand-peachBorder dark:border-warm-darkBorder flex items-center justify-center text-2xl flex-shrink-0 text-brand-orange">
            <i class="fa-solid fa-hand-holding-heart"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 mb-0.5">
              <span class="text-xs font-black text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-md">تبني رحيم وآمن</span>
              <span class="text-xs font-bold text-brand-subtleGray dark:text-[#A89F91]">بدون أي مقابل مالي 💛</span>
            </div>
            <h3 class="text-base font-black text-brand-dark dark:text-white truncate font-baloo">امنح حيوانًا أليفًا بيتًا دافئًا ومستقرًا</h3>
            <p class="text-xs font-semibold text-brand-subtleGray dark:text-[#A89F91] leading-tight line-clamp-1">
              تصفح الحالات الفردية والمجموعات واطلع على شروط تبني المجموعة
            </p>
          </div>
        </div>

        <!-- Filter pills for Individual vs Group -->
        <div class="flex items-center gap-2 mt-3 pt-3 border-t border-brand-peachBorder/40 dark:border-warm-darkBorder/40 overflow-x-auto no-scrollbar">
          <button
            data-adopt-type="all"
            type="button"
            class="adopt-type-btn text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-baloo ${
              filters.adoptionType === 'all'
                ? 'bg-brand-orange text-white shadow-soft'
                : 'bg-white dark:bg-[#342A24] text-brand-dark dark:text-[#D1C7BD] border border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
            }"
          >
            الكل (${pets.length})
          </button>
          <button
            data-adopt-type="individual"
            type="button"
            class="adopt-type-btn text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-baloo ${
              filters.adoptionType === 'individual'
                ? 'bg-brand-orange text-white shadow-soft'
                : 'bg-white dark:bg-[#342A24] text-brand-dark dark:text-[#D1C7BD] border border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
            }"
          >
            🐾 تبني فردي
          </button>
          <button
            data-adopt-type="group"
            type="button"
            class="adopt-type-btn text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-baloo ${
              filters.adoptionType === 'group'
                ? 'bg-brand-orange text-white shadow-soft'
                : 'bg-white dark:bg-[#342A24] text-brand-dark dark:text-[#D1C7BD] border border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
            }"
          >
            👨‍👩‍👧 مجموعات وعائلات
          </button>
        </div>
      </div>

      <!-- Search Row -->
      <div class="flex items-center justify-between gap-2 px-1">
        <div class="relative flex-1">
          <input
            type="text"
            id="adoption-search-input"
            value="${filters.breed || ''}"
            placeholder="ابحث بالسلالة أو المدينة..."
            class="w-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-2xl py-2 px-3 pr-8 text-xs sm:text-sm font-bold text-brand-dark dark:text-white placeholder-brand-subtleGray focus:outline-none focus:border-brand-orange shadow-sm font-baloo"
          />
          <i class="fa-solid fa-magnifying-glass absolute right-2.5 top-3 text-xs text-brand-subtleGray"></i>
        </div>
      </div>

      <!-- Adoption Grid (Exact Reference Screenshot 1: 2-column cards, heart save button, badge without star, no compatibility %) -->
      ${
        pets.length === 0
          ? `
          <div class="bg-white/90 dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl p-8 text-center shadow-card space-y-3">
            <div class="w-16 h-16 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center mx-auto text-2xl">
              <i class="fa-solid fa-shield-cat"></i>
            </div>
            <h4 class="text-base font-black text-brand-dark dark:text-white">لا توجد حالات تبني مطابقة</h4>
            <p class="text-xs font-semibold text-brand-subtleGray dark:text-[#A89F91] max-w-xs mx-auto">
              جرب تغيير نوع التبني (فردي / مجموعة) أو تصفح كل الحالات المتاحة.
            </p>
          </div>
          `
          : `
          <div class="${viewMode === 'grid' ? 'grid grid-cols-2 gap-3 sm:gap-3.5' : 'flex flex-col gap-3.5'}" data-purpose="pet-listings-grid">
            ${pets
              .map((pet) => {
                const isGroup = pet.adoptionType === 'group';
                const isSaved = state.isPetSaved(pet.id);

                if (viewMode === 'grid') {
                  return `
                    <article
                      class="pet-card bg-white dark:bg-[#27201B] rounded-3xl border border-brand-peachBorder dark:border-warm-darkBorder overflow-hidden shadow-card flex flex-col group transition-all duration-300 hover:shadow-soft cursor-pointer relative"
                      data-pet-detail-id="${pet.id}"
                      data-pet-type="${pet.species || 'cat'}"
                    >
                      <!-- Pet Image Container with Heart Save Button & Status Badge (NO STAR) -->
                      <div class="relative w-full aspect-[4/4.5] sm:aspect-[4/4.2] overflow-hidden bg-brand-peachBorder/30 dark:bg-[#342A24]">
                        <img
                          src="${pet.photos[0]}"
                          alt="صورة ${pet.name}"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pet-card-img"
                          loading="lazy"
                        />

                        <!-- Heart Save Button -->
                        <button
                          type="button"
                          aria-label="حفظ الأليف"
                          class="toggle-save-pet-btn absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all cursor-pointer z-10 active:scale-85"
                          data-pet-save-id="${pet.id}"
                          title="${isSaved ? 'إزالة من المحفوظات' : 'حفظ في المحفوظات'}"
                        >
                          <i class="${isSaved ? 'fa-solid fa-heart text-red-500 scale-110' : 'fa-regular fa-heart text-white'} text-sm transition-transform"></i>
                        </button>

                        <!-- Status Badge: ONLY text with NO star icon -->
                        <div class="absolute top-2.5 right-2.5 bg-brand-orange text-white px-3 py-1 rounded-xl text-xs font-black shadow-sm font-baloo pointer-events-none">
                          <span>${isGroup ? `عائلة (${pet.groupCount || 2})` : 'للتبني'}</span>
                        </div>

                        <!-- Group Adoption Requirement Pill if Group -->
                        ${
                          isGroup
                            ? `
                            <div class="absolute bottom-2 right-2 left-2 bg-brand-dark/75 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded-lg text-center truncate">
                              ${pet.mustAdoptTogether ? '⚠️ يجب تبني المجموعة كاملة' : '✅ يمكن التبني المستقل'}
                            </div>
                            `
                            : ''
                        }
                      </div>

                      <!-- Pet Info Content matching Screenshot 1 -->
                      <div class="p-3 text-right flex flex-col justify-between flex-1">
                        <div>
                          <h2 class="text-base sm:text-lg font-black text-brand-dark dark:text-white tracking-tight leading-tight font-baloo truncate">
                            ${pet.name}, ${pet.ageYears > 0 ? pet.ageYears : `${pet.ageMonths}ش`}
                          </h2>
                          <p class="text-xs font-bold text-brand-subtleGray dark:text-[#A89F91] mt-0.5 truncate">
                            ${pet.breed}
                          </p>
                        </div>
                      </div>
                    </article>
                  `;
                }

                // Single column / Full card view matching Reference Screenshot (Info over photo with gradient)
                return `
                  <article
                    class="pet-card bg-white dark:bg-[#27201B] rounded-[32px] border border-brand-peachBorder dark:border-warm-darkBorder overflow-hidden shadow-card flex flex-col group transition-all duration-300 hover:shadow-soft cursor-pointer relative"
                    data-pet-detail-id="${pet.id}"
                    data-pet-type="${pet.species || 'cat'}"
                  >
                    <!-- Photo filling card with Gradient & Superimposed Info matching Reference Screenshot -->
                    <div class="relative w-full aspect-[4/4.3] sm:aspect-[4/4] overflow-hidden bg-brand-peachBorder/30 dark:bg-[#342A24]">
                      <img
                        src="${pet.photos[0]}"
                        alt="صورة ${pet.name}"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

                      <!-- Status Badge (NO STAR) -->
                      <div class="absolute top-3.5 right-3.5 bg-brand-orange text-white px-4 py-1.5 rounded-2xl text-xs sm:text-sm font-black shadow-md font-baloo pointer-events-none z-20">
                        <span>${isGroup ? `عائلة (${pet.groupCount || 2})` : 'للتبني'}</span>
                      </div>

                      <!-- Basic Info Overlaid on Image with Gradient: Name, Age, Location, Breed & Traits -->
                      <div class="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-right flex flex-col gap-1.5 z-20 text-white">
                        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight font-baloo drop-shadow-md m-0">
                          ${pet.name}, ${pet.ageYears > 0 ? pet.ageYears : `${pet.ageMonths}ش`}
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

    </main>
  `;
}

export function attachAdoptionEvents(): void {
  // Dismiss Meow Advice Message
  const dismissBtn = document.getElementById('dismiss-adoption-advice-btn');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      state.dismissAdvice();
      const banner = document.getElementById('meow-adoption-advice-banner');
      if (banner) banner.remove();
    });
  }

  // Adoption Type Filter Buttons
  const typeButtons = document.querySelectorAll<HTMLButtonElement>('.adopt-type-btn');
  typeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-adopt-type') as any;
      state.setAdoptionFilters({ adoptionType: type });
    });
  });

  // Search Input
  const searchInput = document.getElementById('adoption-search-input') as HTMLInputElement;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.setAdoptionFilters({ breed: (e.target as HTMLInputElement).value });
    });
  }

  // Sort By
  const sortBySelect = document.getElementById('adoption-sort-by') as HTMLSelectElement;
  if (sortBySelect) {
    sortBySelect.addEventListener('change', (e) => {
      state.setAdoptionFilters({ sortBy: (e.target as HTMLSelectElement).value as any });
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

  // View Details (clicks on card)
  const detailTriggers = document.querySelectorAll<HTMLElement>('[data-pet-detail-id]');
  detailTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const petId = trigger.getAttribute('data-pet-detail-id');
      const pet = state.getFilteredAdoptionPets().find((p) => p.id === petId);
      if (pet) {
        state.setSelectedPetForDetail(pet);
      }
    });
  });

  // Send Request
  const sendRequestBtns = document.querySelectorAll<HTMLButtonElement>('.send-adoption-request-btn');
  sendRequestBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const petId = btn.getAttribute('data-pet-request-id');
      const pet = state.getFilteredAdoptionPets().find((p) => p.id === petId);
      if (pet) {
        state.setSelectedPetForRequest(pet);
      }
    });
  });
}
