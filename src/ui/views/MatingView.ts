import { state } from '../../state.ts';
import { getViewMode } from '../components/Header.ts';
import { renderThreeDotsMenu } from '../components/BlockMenu.ts';
import { attachPullToRefresh, showMobileToast } from '../../utils/touchGestures.ts';

export function renderMatingView(): string {
  const filters = state.getMatingFilters();
  const pets = state.getFilteredMatingPets();
  const matchSummary = state.getMatingMatchSummary();
  const viewMode = getViewMode();
  const currentUserId = state.getUser().id;
  const refPet = filters.recommendedMatchEnabled ? state.getRecommendedReferencePet() : undefined;
  const loadingState = state.getFilteringLoadingState();

  return `
    <div id="mating-view-root" class="max-w-md mx-auto px-3.5 min-[360px]:px-4 pt-2 pb-24 flex-1 space-y-4">

      <!-- Dismissible Meow Advice Message (Small message with X button) -->
      ${
        !state.getIsAdviceDismissed()
          ? `
          <div id="meow-advice-banner" class="bg-amber-50/90 border border-brand-peachBorder/70 rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2.5 text-sm text-brand-dark/90 shadow-sm transition-all">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="text-lg text-brand-orange shrink-0">💡</span>
              <p class="m-0 font-bold text-xs sm:text-sm leading-normal">
                <strong class="text-brand-orange font-black">نصيحة Meow:</strong> نوصيك باختيار الفلاتر المناسبة لتجربة تزاوج ناجحة ومريحة لحيوانك الأليف!
              </p>
            </div>
            <button
              id="dismiss-advice-btn"
              class="w-9 h-9 rounded-full flex items-center justify-center text-brand-subtleGray hover:text-brand-orange hover:bg-black/5 shrink-0 cursor-pointer transition active:scale-90"
              type="button"
              aria-label="إغلاق الرسالة"
              title="إغلاق"
            >
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
          `
          : ''
      }

      <!-- Count Bar -->
      <div class="flex items-center justify-between gap-2 px-1">
        <div class="flex items-center gap-1.5 text-sm font-extrabold text-brand-dark">
          <span class="text-brand-orange text-lg">🐾</span>
          <span class="text-sm font-black text-brand-orange px-2.5 py-1 rounded-xl bg-white border border-brand-peachBorder shadow-sm">${pets.length} متاح</span>
        </div>
        ${
          filters.recommendedMatchEnabled && refPet
            ? `
              <button
                id="clear-recommended-match-btn"
                type="button"
                class="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#fff5ea] border border-[#e67e22] text-[#e67e22] text-xs font-black font-baloo cursor-pointer hover:bg-[#e67e22] hover:text-white transition"
              >
                <i class="fa-solid fa-wand-magic-sparkles text-[11px]"></i>
                <span>ترشيح ${refPet.name}</span>
                <i class="fa-solid fa-xmark text-[11px] mr-0.5"></i>
              </button>
            `
            : ''
        }
      </div>

      ${
        filters.recommendedMatchEnabled && refPet
          ? `
            <div class="bg-[#fff5ea] border border-[#e67e22]/50 rounded-2xl px-4 py-2.5 text-right flex items-center justify-between gap-2 font-baloo">
              <div class="min-w-0">
                <p class="text-xs sm:text-sm font-black text-[#1a1612] m-0">
                  الترشيح المناسب لـ «${refPet.name}» (${refPet.gender === 'male' ? 'إناث متوافقة' : 'ذكور متوافقة'})
                </p>
                <p class="text-[11px] font-bold text-[#786555] m-0">
                  مرتبة من الأكثر توافقاً حسب الموقع، السلالة، اللون، العمر والحالة الصحية
                </p>
              </div>
            </div>
          `
          : matchSummary.hasFilters && !matchSummary.hasExactMatch && pets.length > 0
          ? `
            <div id="mating-ranked-fallback-notice" class="bg-[#fff5ea] border border-[#e67e22]/45 rounded-2xl px-4 py-2.5 text-right font-baloo">
              <p class="text-xs font-black text-[#1a1612] m-0">
                عرض النتائج المتاحة من الأكثر توافقاً مع اختيارك إلى الأقل
              </p>
              <p class="text-[11px] font-bold text-[#786555] m-0">
                لم يتوفر تطابق كامل لكل الشروط، لذا رتبنا لك أقرب الحالات الصالحة للتزاوج
              </p>
            </div>
          `
          : ''
      }

      ${
        loadingState.active
          ? `
            <div id="mating-loading-indicator" class="bg-[#fff5ea] border border-[#e67e22]/40 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 text-xs font-black text-[#786555] font-baloo shadow-sm animate-fade-in">
              <span class="w-4 h-4 rounded-full border-2 border-[#e67e22] border-t-transparent animate-spin shrink-0"></span>
              <span>${loadingState.label || 'جاري تحميل النتائج...'}</span>
            </div>
          `
          : ''
      }

      <!-- Cats Cards Grid (Original Stitch Layout: 2-column bg-brand-lightCream cards, h-44 photo, centered name/age & breed) -->
      ${
        pets.length === 0
          ? `
          <div class="bg-white/80 dark:bg-[#27201B]/80 border border-brand-peachBorder/70 dark:border-warm-darkBorder rounded-3xl p-8 text-center space-y-3">
            <span class="text-4xl block">🐾</span>
            <h3 class="text-base font-black text-brand-dark dark:text-white">لا توجد حيوانات صالحة للتزاوج بهذا النوع أو الجنس حالياً</h3>
            <p class="text-xs text-brand-subtleGray dark:text-[#A89F91] max-w-xs mx-auto">
              لم يتوفر حالياً حيوان من نفس النوع أو الجنس المطلوب للتزاوج الصحيح.
            </p>
          </div>
          `
          : `
          <div class="${viewMode === 'grid' ? 'grid grid-cols-2 gap-3 sm:gap-4' : 'flex flex-col gap-4'}" data-purpose="pet-listings-grid">
            ${pets
              .map((pet) => {
                const isSaved = state.isPetSaved(pet.id);
                const ageDisplay = pet.ageYears > 0 ? pet.ageYears : `${pet.ageMonths}ش`;

                if (viewMode === 'grid') {
                  return `
                    <article
                      class="pet-card min-w-0 bg-brand-lightCream dark:bg-[#27201B] rounded-3xl border border-brand-peachBorder dark:border-warm-darkBorder shadow-card flex flex-col group transition-all duration-300 hover:shadow-soft cursor-pointer relative"
                      data-pet-detail-id="${pet.id}"
                      data-pet-type="${pet.species}"
                    >
                      <!-- Photo with 'للزواج' Badge & Heart Save Button + 3-Dots Menu -->
                      <div class="relative w-full h-44 rounded-t-3xl bg-brand-peachBorder/30 dark:bg-[#342A24]">
                        <div class="relative w-full h-full overflow-hidden rounded-t-3xl">
                          <img
                            alt="${pet.name}"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src="${pet.photos[0]}"
                            loading="lazy"
                          />
                        </div>

                        <!-- Top-left actions: Heart Save Button + 3-Dots More Menu -->
                        <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-30">
                          <button
                            type="button"
                            aria-label="حفظ الأليف"
                            class="toggle-save-pet-btn w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all active:scale-90 cursor-pointer shadow-md"
                            data-pet-save-id="${pet.id}"
                            title="${isSaved ? 'إزالة من المحفوظات' : 'حفظ في المحفوظات'}"
                          >
                            <i class="${isSaved ? 'fa-solid fa-heart text-red-500 scale-110' : 'fa-regular fa-heart text-white'} text-base transition-transform"></i>
                          </button>
                          ${
                            pet.ownerId !== currentUserId
                              ? renderThreeDotsMenu({
                                  userId: pet.ownerId,
                                  userName: pet.ownerName,
                                  userAvatar: pet.ownerAvatar,
                                  petName: pet.name,
                                  petId: pet.id,
                                  reportTargetType: 'pet',
                                  buttonClass:
                                    'w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all active:scale-90 cursor-pointer shadow-md',
                                  dropdownAlign: 'left',
                                })
                              : ''
                          }
                        </div>

                        <!-- 'للزواج' Badge: Original rounded-xl style -->
                        <div class="absolute top-2.5 right-2.5 bg-brand-orange/95 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm font-baloo pointer-events-none z-20">
                          <span>للزواج</span>
                        </div>
                        ${
                          filters.recommendedMatchEnabled && pet.compatibilityScore !== undefined
                            ? `
                              <div class="absolute bottom-2 right-2 bg-emerald-600/90 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-lg text-[11px] font-black font-baloo pointer-events-none shadow-sm">
                                توافق ${pet.compatibilityScore}%
                              </div>
                            `
                            : ''
                        }
                      </div>

                      <!-- Basic Info: Centered Name, Age & Breed matching original Stitch design -->
                      <div class="p-3 text-center flex flex-col justify-center items-center">
                        <h2 class="text-lg font-black text-brand-dark dark:text-white tracking-tight leading-tight font-baloo max-w-full truncate">
                          ${pet.name}, ${ageDisplay}
                        </h2>
                        <p class="text-xs uppercase font-extrabold text-brand-subtleGray dark:text-[#A89F91] tracking-wider mt-0.5 max-w-full truncate">
                          ${pet.breed}
                        </p>
                      </div>
                    </article>
                  `;
                }

                // Single-column / Full card View Mode
                return `
                  <article
                    class="pet-card bg-brand-lightCream dark:bg-[#27201B] rounded-3xl border border-brand-peachBorder dark:border-warm-darkBorder shadow-card flex flex-col group transition-all duration-300 hover:shadow-soft cursor-pointer relative"
                    data-pet-detail-id="${pet.id}"
                    data-pet-type="${pet.species}"
                  >
                    <!-- Photo filling card with Gradient & Superimposed Info -->
                    <div class="relative w-full aspect-[4/4.3] sm:aspect-[4/4] rounded-3xl bg-brand-peachBorder/30 dark:bg-[#342A24]">
                      <div class="relative w-full h-full overflow-hidden rounded-3xl">
                        <img
                          alt="${pet.name}"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src="${pet.photos[0]}"
                          loading="lazy"
                        />

                        <!-- Gradient Overlay from bottom up -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none"></div>
                      </div>

                      <!-- Top-left actions: Heart Save Button + 3-Dots More Menu -->
                      <div class="absolute top-3 left-3 flex items-center gap-2 z-30">
                        <button
                          type="button"
                          aria-label="حفظ الأليف"
                          class="toggle-save-pet-btn w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all active:scale-90 cursor-pointer shadow-md"
                          data-pet-save-id="${pet.id}"
                          title="${isSaved ? 'إزالة من المحفوظات' : 'حفظ في المحفوظات'}"
                        >
                          <i class="${isSaved ? 'fa-solid fa-heart text-red-500 scale-110' : 'fa-regular fa-heart text-white'} text-base transition-transform"></i>
                        </button>
                        ${
                          pet.ownerId !== currentUserId
                            ? renderThreeDotsMenu({
                                userId: pet.ownerId,
                                userName: pet.ownerName,
                                userAvatar: pet.ownerAvatar,
                                petName: pet.name,
                                petId: pet.id,
                                reportTargetType: 'pet',
                                buttonClass:
                                  'w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all active:scale-90 cursor-pointer shadow-md',
                                dropdownAlign: 'left',
                              })
                            : ''
                        }
                      </div>

                      <!-- 'للزواج' Badge -->
                      <div class="absolute top-3 right-3 flex items-center gap-1.5 z-20 pointer-events-none">
                        <div class="bg-brand-orange/95 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-xs font-bold shadow-sm font-baloo">
                          <span>للزواج</span>
                        </div>
                        ${
                          filters.recommendedMatchEnabled && pet.compatibilityScore !== undefined
                            ? `<div class="bg-emerald-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-xs font-bold shadow-sm font-baloo">توافق ${pet.compatibilityScore}%</div>`
                            : ''
                        }
                      </div>

                      <!-- Basic Info Overlaid on Image with Gradient: Name, Age, Location, Breed & Traits -->
                      <div class="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-right flex flex-col gap-1.5 z-20 text-white">
                        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight font-baloo drop-shadow-md m-0">
                          ${pet.name}, ${ageDisplay}
                        </h2>
                        <p class="text-xs sm:text-sm font-bold text-white/95 drop-shadow-sm m-0 font-baloo flex items-center gap-1.5">
                          <span>${pet.area && pet.area !== pet.city ? `${pet.area}، ${pet.city}` : pet.city || pet.governorate}</span>
                          <span class="opacity-70">•</span>
                          <span>${pet.breed}</span>
                        </p>

                        <!-- Traits Chips on Photo -->
                        <div class="flex items-center gap-2 flex-wrap pt-1.5">
                          ${pet.personality
                            .slice(0, 3)
                            .map(
                              (trait) => `
                              <span class="px-3 py-1 rounded-xl bg-white/25 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-sm font-baloo">
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
  const clearRecBtn = document.getElementById('clear-recommended-match-btn');
  if (clearRecBtn) {
    clearRecBtn.addEventListener('click', () => {
      state.setMatingRecommendedMode(false);
    });
  }

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

  const gridScope = document.querySelector<HTMLElement>('[data-purpose="pet-listings-grid"]');

  // Toggle Save Pet (Heart button) - Scoped strictly to grid/list container
  const saveTriggers = gridScope
    ? gridScope.querySelectorAll<HTMLElement>('.toggle-save-pet-btn')
    : [];
  saveTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const petId = btn.getAttribute('data-pet-save-id');
      if (petId) {
        state.toggleSavePet(petId);
      }
    });
  });

  // Open Details Modal - Scoped strictly to grid/list container
  const detailTriggers = gridScope
    ? gridScope.querySelectorAll<HTMLElement>('[data-pet-detail-id]')
    : [];
  detailTriggers.forEach((el) => {
    el.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.toggle-save-pet-btn, .meow-more-menu-container')) {
        return;
      }
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

  attachPullToRefresh(document.getElementById('mating-view-root'), {
    isBlocked: () =>
      Boolean(
        state.isNotificationsOpen() ||
          state.isSettingsOpen() ||
          state.getSelectedPetForDetail() ||
          state.getSelectedPetForRequest() ||
          state.isAddPetModalVisible() ||
          state.getIsFilterModalOpen() ||
          state.isEditOwnerModalVisible() ||
          state.isSavedPetsVisible() ||
          state.isContactOpen() ||
          state.getPendingBlockTarget() ||
          state.getPendingReportTarget()
      ),
    onRefresh: () => {
      state.refreshFeed('mating');
      showMobileToast('تم تحديث قائمة التزاوج', 'success', 1600);
    },
  });
}

