import { state } from '../../state.ts';
import {
  getGovernorates,
  getMarkazesForGovernorate,
  getCitiesForMarkaz,
  getVillagesForCity,
  getGeoNodeById,
  resolveLocationLineage,
  CAT_BREEDS,
  DOG_BREEDS,
  GeoNode,
} from '../../data/egyptLocations.ts';
import {
  renderSearchableSelect,
  attachSearchableSelect,
  SearchableOption,
  SearchableSelectController,
} from '../components/SearchableSelect.ts';
import { attachSheetDragToDismiss } from '../../utils/touchGestures.ts';
import { escapeAttr, escapeHtml } from '../../utils/sanitize.ts';

function nodesToOptions(nodes: GeoNode[], allLabel: string): SearchableOption[] {
  return [
    { value: '', label: allLabel },
    ...nodes.map((node) => ({
      value: node.id,
      label: node.name,
      searchText: node.aliases?.join(' '),
    })),
  ];
}

function getBreedOptions(
  species: string,
  isHybrid = false,
  extraValue = ''
): SearchableOption[] {
  const baseList =
    species === 'dog'
      ? DOG_BREEDS
      : species === 'cat'
      ? CAT_BREEDS
      : Array.from(new Set([...CAT_BREEDS, ...DOG_BREEDS]));
  const cleanedExtra = extraValue.trim();
  const list =
    cleanedExtra && cleanedExtra !== 'none' && !baseList.includes(cleanedExtra)
      ? [cleanedExtra, ...baseList]
      : baseList;
  if (isHybrid) {
    return [
      { value: '', label: 'الكل' },
      { value: 'none', label: 'بدون هجين' },
      ...list.map((b) => ({ value: b, label: b })),
    ];
  }
  return [{ value: '', label: 'الكل' }, ...list.map((b) => ({ value: b, label: b }))];
}

function getMarkazOptionsForFilter(governorateId: string): SearchableOption[] {
  if (!governorateId) {
    return [{ value: '', label: 'كل المراكز والأقسام' }];
  }
  return nodesToOptions(getMarkazesForGovernorate(governorateId), 'كل المراكز والأقسام');
}

function getCityOptionsForFilter(markazId: string): SearchableOption[] {
  if (!markazId) {
    return [{ value: '', label: 'كل المدن والأحياء' }];
  }
  return nodesToOptions(getCitiesForMarkaz(markazId), 'كل المدن والأحياء');
}

function getVillageOptionsForFilter(cityId: string): {
  options: SearchableOption[];
  disabled: boolean;
  placeholder: string;
} {
  if (!cityId) {
    return {
      options: [{ value: '', label: 'كل القرى والتجمعات' }],
      disabled: true,
      placeholder: 'اختر المدينة / الحي أولاً',
    };
  }
  const villages = getVillagesForCity(cityId);
  if (villages.length === 0) {
    return {
      options: [{ value: '', label: 'لا توجد قرى مسجلة تحت هذا النطاق' }],
      disabled: true,
      placeholder: 'لا توجد قرى مسجلة تحت هذا النطاق',
    };
  }
  return {
    options: nodesToOptions(villages, 'كل القرى والتجمعات'),
    disabled: false,
    placeholder: 'كل القرى والتجمعات',
  };
}

export function renderFilterModal(): string {
  if (!state.getIsFilterModalOpen()) return '';

  const currentTab = state.getCurrentTab();
  const filters = currentTab === 'mating' ? state.getMatingFilters() : state.getAdoptionFilters();

  const selectedSpecies = filters.species || 'all';
  const selectedGender = filters.gender || 'all';
  const selectedVaccination = filters.vaccinationStatus || 'all';

  // Resolve current hierarchy safely (supports both IDs and legacy text filters)
  const resolved = resolveLocationLineage({
    governorateId: filters.governorateId,
    markazId: filters.markazId,
    cityId: filters.cityId,
    villageId: filters.villageId,
    locationId: filters.locationId,
    governorate: filters.governorate,
    markaz: filters.markaz,
    city: filters.city,
    village: filters.village,
  });

  const selectedGovId = filters.governorateId || resolved.governorate?.id || '';
  const selectedMarkazId = selectedGovId ? filters.markazId || resolved.markaz?.id || '' : '';
  const selectedCityId = selectedMarkazId ? filters.cityId || resolved.city?.id || '' : '';
  const selectedVillageId = selectedCityId ? filters.villageId || resolved.village?.id || '' : '';

  const govOptions = nodesToOptions(getGovernorates(), 'كل المحافظات (27)');
  const markazOptions = getMarkazOptionsForFilter(selectedGovId);
  const cityOptions = getCityOptionsForFilter(selectedMarkazId);
  const villageMeta = getVillageOptionsForFilter(selectedCityId);

  const isMatingTab = currentTab === 'mating';
  const userPets = state.getUserPets();
  const userMatingPets = state.getUserMatingPets();
  const candidateRefPets = userMatingPets.length > 0 ? userMatingPets : userPets;
  const activeRefPet = state.getRecommendedReferencePet() || candidateRefPets[0];
  const isRecommendedActive = Boolean(isMatingTab && filters.recommendedMatchEnabled);

  return `
    <!-- Filter Modal matching Meow Pet Registration Form Design -->
    <div id="filter-backdrop" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
      <div
        id="filter-modal-card"
        class="bg-[#FFF9E9] text-[#2d221b] w-full max-w-md rounded-t-[32px] rounded-b-none sm:rounded-[36px] border-2 border-b-0 sm:border-b-2 border-[#d6c7b2] shadow-2xl max-h-[92dvh] overflow-y-auto overscroll-contain transform transition-all animate-slide-up"
      >
        <!-- Drag Handle + Sticky Header -->
        <div class="sticky top-0 z-30 bg-[#FFF9E9]/95 backdrop-blur-md border-b border-[#d6c7b2]/70">
          <div id="filter-drag-handle" class="pt-2.5 pb-1 flex justify-center sm:hidden cursor-grab active:cursor-grabbing">
            <div class="w-12 h-1.5 rounded-full bg-[#d6c7b2]/80"></div>
          </div>
          <div class="px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">🐾</span>
              <h2 class="text-xl font-black font-baloo text-[#1a1612] m-0">تصفية البحث</h2>
            </div>

            <div class="flex items-center gap-2">
              <button
                id="reset-filter-btn"
                type="button"
                class="h-10 text-xs font-black text-[#e67e22] hover:bg-[#fff5ea] cursor-pointer px-3.5 rounded-full bg-[#fffefc] border border-[#d6c7b2] font-baloo transition active:scale-95 flex items-center"
              >
                إعادة ضبط
              </button>
              <button
                id="close-filter-btn"
                type="button"
                aria-label="إغلاق الفلتر"
                class="w-10 h-10 rounded-full bg-[#fffefc] border border-[#d6c7b2] text-[#2d221b] flex items-center justify-center hover:bg-[#e67e22] hover:text-white hover:border-[#e67e22] transition-all cursor-pointer active:scale-90"
              >
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <form id="meow-filter-form" class="p-4 sm:p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-5 text-right font-baloo" onsubmit="return false;">

          ${
            isMatingTab
              ? `
                <!-- زر الترشيح المناسب (خاص بقسم التزاوج فقط - يعبئ الفلتر داخل النافذة قبل التطبيق) -->
                <div id="recommended-card-box" class="p-4 rounded-[28px] border-2 ${
                  isRecommendedActive
                    ? 'border-[#e67e22] bg-[#fff5ea]'
                    : 'border-[#d6c7b2] bg-[#fffefc]'
                } shadow-sm space-y-3 transition-colors">
                  <div class="flex items-center justify-between gap-2">
                    <div class="min-w-0">
                      <span class="text-sm font-black text-[#1a1612] block">مطابقة ذكية حسب بيانات أليفك</span>
                      <span id="recommended-pet-subtitle" class="text-[11px] font-bold text-[#786555] block truncate">
                        ${
                          activeRefPet
                            ? `تحليل: ${escapeHtml(activeRefPet.name)} (${activeRefPet.gender === 'male' ? 'ذكر' : 'أنثى'} • ${escapeHtml(activeRefPet.breed)})`
                            : 'أضف بيانات أليفك أولاً لتشغيل الترشيح'
                        }
                      </span>
                    </div>
                    <button
                      id="disable-recommended-btn"
                      type="button"
                      class="${isRecommendedActive ? '' : 'hidden'} text-xs font-black text-brand-orange bg-[#fff5ea] border border-brand-orange/35 hover:bg-brand-orange hover:text-white px-3.5 py-1.5 rounded-full transition cursor-pointer shrink-0"
                    >
                      إلغاء التفعيل
                    </button>
                  </div>

                  ${
                    candidateRefPets.length > 1
                      ? `
                        <div class="flex items-center gap-1.5 flex-wrap">
                          ${candidateRefPets
                            .map(
                              (up) => `
                                <button
                                  type="button"
                                  data-rec-pet-id="${escapeAttr(up.id)}"
                                  class="rec-pet-choice-btn px-3 py-1 rounded-full text-xs font-black border cursor-pointer transition ${
                                    activeRefPet?.id === up.id
                                      ? 'bg-[#e67e22] text-white border-[#e67e22]'
                                      : 'bg-white text-[#786555] border-[#d6c7b2]'
                                  }"
                                >
                                  ${escapeHtml(up.name)}
                                </button>
                              `
                            )
                            .join('')}
                        </div>
                      `
                      : ''
                  }

                  <button
                    id="recommended-match-btn"
                    type="button"
                    ${activeRefPet ? '' : 'disabled'}
                    class="w-full h-14 px-6 rounded-full font-black text-base sm:text-lg flex items-center justify-center gap-2 transition shadow-soft ${
                      activeRefPet
                        ? isRecommendedActive
                          ? 'bg-brand-orange text-white ring-4 ring-brand-orange/30 cursor-pointer active:scale-[0.98]'
                          : 'bg-brand-orange hover:bg-brand-accent text-white cursor-pointer active:scale-[0.98]'
                        : 'bg-[#f3ebdd] text-[#998b7c] cursor-not-allowed'
                    }"
                  >
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span>الترشيح المناسب</span>
                  </button>

                  <!-- Calm inline loading / editable confirmation banner inside Modal -->
                  <div
                    id="rec-prep-status"
                    class="hidden rounded-2xl bg-[#FFF9E9] border border-[#e67e22]/35 px-3 py-2 text-xs font-bold text-[#786555] flex items-center gap-2"
                  >
                    <span class="w-3.5 h-3.5 rounded-full border-2 border-[#e67e22] border-t-transparent animate-spin shrink-0"></span>
                    <span>جاري تحليل بيانات أليفك وتجهيز أنسب الفلاتر...</span>
                  </div>

                  <div
                    id="rec-filled-banner"
                    class="${isRecommendedActive ? '' : 'hidden'} rounded-2xl bg-[#ecfdf5] border border-[#10b981]/30 px-3 py-2 text-[11px] font-bold text-[#065f46] leading-relaxed"
                  >
                    <i class="fa-solid fa-circle-check ml-1 text-[#059669]"></i>
                    <span>تم تعبئة الفلتر تلقائياً بأفضل معايير التوافق — يمكنك تعديل أي خانة يدوياً ثم الضغط على <strong>«تطبيق الفلترة»</strong>.</span>
                  </div>
                </div>
              `
              : ''
          }

          <!-- 1. عندك ايه (قطة / كلب / الكل) -->
          <div class="space-y-2">
            <label class="block text-base font-bold text-[#2d221b]">عندك ايه</label>
            <div class="grid grid-cols-3 gap-2 sm:gap-2.5">
              <button
                type="button"
                data-filter-species="all"
                class="filter-species-btn min-w-0 h-16 relative flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 rounded-[28px] border-2 ${
                  selectedSpecies === 'all'
                    ? 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold'
                } text-base sm:text-lg cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="font-black truncate">الكل</span>
              </button>

              <button
                type="button"
                data-filter-species="cat"
                class="filter-species-btn min-w-0 h-16 relative flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 rounded-[28px] border-2 ${
                  selectedSpecies === 'cat'
                    ? 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold'
                } text-base sm:text-lg cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="text-lg sm:text-xl">🐱</span>
                <span class="font-black truncate">قطة</span>
              </button>

              <button
                type="button"
                data-filter-species="dog"
                class="filter-species-btn min-w-0 h-16 relative flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 rounded-[28px] border-2 ${
                  selectedSpecies === 'dog'
                    ? 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold'
                } text-base sm:text-lg cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="text-lg sm:text-xl">🐶</span>
                <span class="font-black truncate">كلب</span>
              </button>
            </div>
          </div>

          <!-- 2. اللون -->
          <div class="space-y-2">
            <label for="filter-color-input" class="block text-base font-bold text-[#2d221b]">اللون</label>
            <div class="relative flex items-center h-16">
              <input
                id="filter-color-input"
                type="text"
                value="${escapeAttr(filters.color || '')}"
                placeholder="مثال: أبيض، رمادي، مشمشي..."
                autocomplete="off"
                class="w-full h-16 py-4 px-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-lg font-black text-center text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
              />
            </div>
          </div>

          <!-- 3. السلالة & سلالة هجينة (اختياري) -->
          <div class="grid grid-cols-2 gap-3.5">
            <div class="space-y-2">
              <label for="filter-breed-select-trigger" class="block text-base font-black text-[#2d221b]">السلالة</label>
              ${renderSearchableSelect({
                id: 'filter-breed-select',
                options: getBreedOptions(selectedSpecies, false, filters.breed || ''),
                value: filters.breed || '',
                placeholder: 'الكل',
                searchPlaceholder: 'ابحث عن السلالة...',
                textAlignClass: 'text-right',
              })}
            </div>

            <div class="space-y-2">
              <label for="filter-hybrid-select-trigger" class="block text-sm sm:text-base font-black text-[#2d221b] truncate">سلالة هجينة (اختياري)</label>
              ${renderSearchableSelect({
                id: 'filter-hybrid-select',
                options: getBreedOptions(selectedSpecies, true, filters.hybridBreed || ''),
                value: filters.hybridBreed || '',
                placeholder: 'الكل',
                searchPlaceholder: 'ابحث عن السلالة الهجينة...',
                textAlignClass: 'text-right',
              })}
            </div>
          </div>

          <!-- 4. العمر (سنة & شهر اختياري) -->
          <div class="space-y-2">
            <label class="block text-base font-black text-[#2d221b]">العمر</label>
            <div class="grid grid-cols-2 gap-3.5 h-16">
              <div class="relative flex items-center h-16">
                <input
                  id="filter-age-years-input"
                  type="number"
                  inputmode="numeric"
                  min="0"
                  max="25"
                  value="${filters.ageYears ?? ''}"
                  placeholder="سنة"
                  class="w-full h-16 py-4 px-2 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-lg font-black text-center text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                />
              </div>
              <div class="relative flex items-center h-16">
                <input
                  id="filter-age-months-input"
                  type="number"
                  inputmode="numeric"
                  min="0"
                  max="11"
                  value="${filters.ageMonths ?? ''}"
                  placeholder="شهر (اختياري)"
                  class="w-full h-16 py-4 px-2 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-base font-black text-center text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <!-- 5. الجنس -->
          <div class="space-y-2">
            <label class="block text-base font-bold text-[#2d221b]">الجنس</label>
            <div class="grid grid-cols-3 gap-2 sm:gap-2.5">
              <button
                type="button"
                data-filter-gender="all"
                class="filter-gender-btn min-w-0 h-16 relative flex items-center justify-center gap-1.5 rounded-[28px] border-2 ${
                  selectedGender === 'all'
                    ? 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold'
                } text-base sm:text-lg cursor-pointer shadow-sm transition-all active:scale-[0.98] px-2 sm:px-3"
              >
                <span class="font-black truncate">الكل</span>
              </button>

              <button
                type="button"
                data-filter-gender="male"
                class="filter-gender-btn min-w-0 h-16 relative flex items-center justify-center gap-1.5 rounded-[28px] border-2 ${
                  selectedGender === 'male'
                    ? 'border-[#3b82f6] bg-[#eff6ff] text-[#2563eb]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } text-base sm:text-lg font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] px-2 sm:px-3"
              >
                <span class="font-black truncate">ذكر</span>
              </button>

              <button
                type="button"
                data-filter-gender="female"
                class="filter-gender-btn min-w-0 h-16 relative flex items-center justify-center gap-1.5 rounded-[28px] border-2 ${
                  selectedGender === 'female'
                    ? 'border-[#ec4899] bg-[#fce7f3] text-[#db2777]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } text-base sm:text-lg font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] px-2 sm:px-3"
              >
                <span class="font-black truncate">انثى</span>
              </button>
            </div>
          </div>

          <!-- 6. حالة التطعيم -->
          <div class="space-y-2">
            <label class="block text-base font-black text-[#2d221b]">حالة التطعيم</label>
            <div class="grid grid-cols-3 gap-2 sm:gap-2.5 h-16">
              <button
                type="button"
                data-filter-vaccine="all"
                class="filter-vaccine-btn min-w-0 h-16 relative flex items-center justify-center gap-1 sm:gap-1.5 rounded-[28px] border-2 ${
                  selectedVaccination === 'all'
                    ? 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold'
                } cursor-pointer shadow-sm transition-all active:scale-[0.98] text-sm sm:text-base px-1.5 sm:px-2"
              >
                <span class="font-black truncate">الكل</span>
              </button>

              <button
                type="button"
                data-filter-vaccine="fully_vaccinated"
                class="filter-vaccine-btn min-w-0 h-16 relative flex items-center justify-center gap-1 sm:gap-1.5 rounded-[28px] border-2 ${
                  selectedVaccination === 'fully_vaccinated'
                    ? 'border-[#10b981] bg-[#ecfdf5] text-[#059669]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-sm sm:text-base px-1.5 sm:px-2"
              >
                <i class="fa-solid fa-check shrink-0"></i>
                <span class="font-black truncate">مطعم</span>
              </button>

              <button
                type="button"
                data-filter-vaccine="not_vaccinated"
                class="filter-vaccine-btn min-w-0 h-16 relative flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 rounded-[28px] border-2 ${
                  selectedVaccination === 'not_vaccinated'
                    ? 'border-brand-orange bg-[#fff5ea] text-brand-orange'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold text-sm sm:text-base cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="font-black truncate">غير مطعم</span>
              </button>
            </div>
          </div>

          <!-- 7. التدرج الجغرافي لمصر (الدولة ← المحافظة ← المركز/القسم ← المدينة/الحي ← القرية/النجع/العزبة) -->
          <div class="space-y-3 pt-1">
            <div class="flex items-center justify-between gap-2">
              <label class="block text-base font-black text-[#2d221b]">الموقع الجغرافي</label>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fffefc] border border-[#d6c7b2] text-xs font-black text-[#2d221b]">
                <span>🇪🇬</span>
                <span>الدولة: مصر</span>
              </span>
            </div>

            <div
              id="filter-location-loading"
              class="hidden rounded-2xl bg-[#fff5ea] border border-[#e67e22]/30 px-3 py-1.5 text-[11px] font-bold text-[#786555] flex items-center gap-2"
            >
              <span class="w-3 h-3 rounded-full border-2 border-[#e67e22] border-t-transparent animate-spin shrink-0"></span>
              <span>جاري تحميل المناطق التابعة...</span>
            </div>

            <!-- الصف 1: المحافظة + المركز / القسم -->
            <div class="grid grid-cols-2 gap-3.5">
              <div class="space-y-1.5">
                <label for="filter-governorate-select-trigger" class="block text-sm font-black text-[#2d221b]">المحافظة</label>
                ${renderSearchableSelect({
                  id: 'filter-governorate-select',
                  options: govOptions,
                  value: selectedGovId,
                  placeholder: 'كل المحافظات (27)',
                  searchPlaceholder: 'ابحث عن المحافظة...',
                })}
              </div>

              <div class="space-y-1.5">
                <label for="filter-markaz-select-trigger" class="block text-sm font-black text-[#2d221b]">المركز أو القسم</label>
                ${renderSearchableSelect({
                  id: 'filter-markaz-select',
                  options: markazOptions,
                  value: selectedMarkazId,
                  placeholder: selectedGovId ? 'كل المراكز والأقسام' : 'اختر المحافظة أولاً',
                  searchPlaceholder: 'ابحث عن المركز أو القسم...',
                  disabled: !selectedGovId,
                })}
              </div>
            </div>

            <!-- الصف 2: المدينة / الحي + القرية / النجع / العزبة -->
            <div class="grid grid-cols-2 gap-3.5">
              <div class="space-y-1.5">
                <label for="filter-city-select-trigger" class="block text-sm font-black text-[#2d221b]">المدينة أو الحي</label>
                ${renderSearchableSelect({
                  id: 'filter-city-select',
                  options: cityOptions,
                  value: selectedCityId,
                  placeholder: selectedMarkazId ? 'كل المدن والأحياء' : 'اختر المركز أولاً',
                  searchPlaceholder: 'ابحث عن المدينة أو الحي...',
                  disabled: !selectedMarkazId,
                })}
              </div>

              <div class="space-y-1.5">
                <label for="filter-village-select-trigger" class="block text-xs sm:text-sm font-black text-[#2d221b] truncate">القرية / النجع / العزبة</label>
                ${renderSearchableSelect({
                  id: 'filter-village-select',
                  options: villageMeta.options,
                  value: selectedVillageId,
                  placeholder: villageMeta.placeholder,
                  searchPlaceholder: 'ابحث عن القرية أو التجمع...',
                  disabled: villageMeta.disabled,
                })}
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="pt-3">
            <button
              id="apply-filter-btn"
              type="button"
              class="w-full h-16 px-6 text-white bg-brand-orange hover:bg-brand-accent rounded-full font-extrabold text-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-baloo"
            >
              <span>تطبيق الفلترة</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  `;
}

export function attachFilterModalEvents(onApply?: () => void): void {
  const backdrop = document.getElementById('filter-backdrop');
  const closeBtn = document.getElementById('close-filter-btn');
  const applyBtn = document.getElementById('apply-filter-btn');
  const resetBtn = document.getElementById('reset-filter-btn');

  const close = () => {
    state.setFilterModalOpen(false);
  };

  const modalCard = document.getElementById('filter-modal-card');
  if (modalCard) {
    attachSheetDragToDismiss(modalCard, {
      backdropEl: backdrop,
      handleSelector: '#filter-drag-handle',
      scrollContainerSelector: '#filter-modal-card',
      onClose: close,
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });
  }

  const currentTab = state.getCurrentTab();
  const currentFilters =
    currentTab === 'mating' ? state.getMatingFilters() : state.getAdoptionFilters();

  let tempSpecies: 'all' | 'cat' | 'dog' = (currentFilters.species as 'all' | 'cat' | 'dog') || 'all';
  let tempGender: 'all' | 'male' | 'female' =
    (currentFilters.gender as 'all' | 'male' | 'female') || 'all';
  let tempVaccine: 'all' | 'fully_vaccinated' | 'not_vaccinated' =
    currentFilters.vaccinationStatus === 'fully_vaccinated' ||
    currentFilters.vaccinationStatus === 'not_vaccinated'
      ? currentFilters.vaccinationStatus
      : 'all';
  let draftRecommendedMatch = Boolean(currentFilters.recommendedMatchEnabled);

  const speciesBtns = document.querySelectorAll<HTMLButtonElement>('.filter-species-btn');
  const genderBtns = document.querySelectorAll<HTMLButtonElement>('.filter-gender-btn');
  const vaccineBtns = document.querySelectorAll<HTMLButtonElement>('.filter-vaccine-btn');

  const syncSpeciesButtons = (species: 'all' | 'cat' | 'dog') => {
    tempSpecies = species;
    speciesBtns.forEach((b) => {
      const isMatch = b.getAttribute('data-filter-species') === tempSpecies;
      b.className = `filter-species-btn min-w-0 h-16 relative flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 rounded-[28px] border-2 ${
        isMatch
          ? 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold'
          : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold'
      } text-base sm:text-lg cursor-pointer shadow-sm transition-all active:scale-[0.98]`;
    });
  };

  const syncGenderButtons = (gender: 'all' | 'male' | 'female') => {
    tempGender = gender;
    genderBtns.forEach((b) => {
      const gVal = b.getAttribute('data-filter-gender');
      const isMatch = gVal === tempGender;
      let activeCls = 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold';
      if (isMatch) {
        if (gVal === 'male') activeCls = 'border-[#3b82f6] bg-[#eff6ff] text-[#2563eb] font-bold';
        else if (gVal === 'female')
          activeCls = 'border-[#ec4899] bg-[#fce7f3] text-[#db2777] font-bold';
        else activeCls = 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold';
      }
      b.className = `filter-gender-btn min-w-0 h-16 relative flex items-center justify-center gap-1.5 rounded-[28px] border-2 ${activeCls} text-base sm:text-lg cursor-pointer shadow-sm transition-all active:scale-[0.98] px-2 sm:px-3`;
    });
  };

  const syncVaccineButtons = (vaccine: 'all' | 'fully_vaccinated' | 'not_vaccinated') => {
    tempVaccine = vaccine;
    vaccineBtns.forEach((b) => {
      const vVal = b.getAttribute('data-filter-vaccine');
      const isMatch = vVal === tempVaccine;
      let activeCls = 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold';
      if (isMatch) {
        if (vVal === 'fully_vaccinated')
          activeCls = 'border-[#10b981] bg-[#ecfdf5] text-[#059669] font-bold';
        else if (vVal === 'not_vaccinated')
          activeCls = 'border-brand-orange bg-[#fff5ea] text-brand-orange font-bold';
        else activeCls = 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold';
      }
      b.className = `filter-vaccine-btn min-w-0 h-16 relative flex items-center justify-center gap-1 sm:gap-1.5 rounded-[28px] border-2 ${activeCls} cursor-pointer shadow-sm transition-all active:scale-[0.98] text-sm sm:text-base px-1.5 sm:px-2`;
    });
  };

  // Searchable dropdowns for Breed & Hybrid Breed
  const breedSelectCtrl: SearchableSelectController | null = attachSearchableSelect({
    id: 'filter-breed-select',
    options: getBreedOptions(tempSpecies, false, currentFilters.breed || ''),
    value: currentFilters.breed || '',
    placeholder: 'الكل',
    searchPlaceholder: 'ابحث عن السلالة...',
  });

  const hybridSelectCtrl: SearchableSelectController | null = attachSearchableSelect({
    id: 'filter-hybrid-select',
    options: getBreedOptions(tempSpecies, true, currentFilters.hybridBreed || ''),
    value: currentFilters.hybridBreed || '',
    placeholder: 'الكل',
    searchPlaceholder: 'ابحث عن السلالة الهجينة...',
  });

  // Resolve initial 4-level Egypt hierarchy IDs
  const resolved = resolveLocationLineage({
    governorateId: currentFilters.governorateId,
    markazId: currentFilters.markazId,
    cityId: currentFilters.cityId,
    villageId: currentFilters.villageId,
    locationId: currentFilters.locationId,
    governorate: currentFilters.governorate,
    markaz: currentFilters.markaz,
    city: currentFilters.city,
    village: currentFilters.village,
  });

  const initialGovId = currentFilters.governorateId || resolved.governorate?.id || '';
  const initialMarkazId = initialGovId ? currentFilters.markazId || resolved.markaz?.id || '' : '';
  const initialCityId = initialMarkazId ? currentFilters.cityId || resolved.city?.id || '' : '';
  const initialVillageId = initialCityId ? currentFilters.villageId || resolved.village?.id || '' : '';

  const locLoadingEl = document.getElementById('filter-location-loading');
  let locLoadingTimeout: ReturnType<typeof setTimeout> | null = null;
  const flashLocationLoading = () => {
    if (!locLoadingEl) return;
    if (locLoadingTimeout) clearTimeout(locLoadingTimeout);
    locLoadingEl.classList.remove('hidden');
    locLoadingTimeout = setTimeout(() => {
      locLoadingEl.classList.add('hidden');
      locLoadingTimeout = null;
    }, 140);
  };

  const initialVillageMeta = getVillageOptionsForFilter(initialCityId);

  const villageSelectCtrl = attachSearchableSelect({
    id: 'filter-village-select',
    options: initialVillageMeta.options,
    value: initialVillageId,
    placeholder: initialVillageMeta.placeholder,
    searchPlaceholder: 'ابحث عن القرية أو التجمع...',
    disabled: initialVillageMeta.disabled,
  });

  const citySelectCtrl = attachSearchableSelect({
    id: 'filter-city-select',
    options: getCityOptionsForFilter(initialMarkazId),
    value: initialCityId,
    placeholder: initialMarkazId ? 'كل المدن والأحياء' : 'اختر المركز أولاً',
    searchPlaceholder: 'ابحث عن المدينة أو الحي...',
    disabled: !initialMarkazId,
    onChange: (newCityId) => {
      flashLocationLoading();
      const nextVillages = getVillageOptionsForFilter(newCityId);
      villageSelectCtrl?.setOptions(
        nextVillages.options,
        '',
        nextVillages.disabled,
        nextVillages.placeholder
      );
    },
  });

  const markazSelectCtrl = attachSearchableSelect({
    id: 'filter-markaz-select',
    options: getMarkazOptionsForFilter(initialGovId),
    value: initialMarkazId,
    placeholder: initialGovId ? 'كل المراكز والأقسام' : 'اختر المحافظة أولاً',
    searchPlaceholder: 'ابحث عن المركز أو القسم...',
    disabled: !initialGovId,
    onChange: (newMarkazId) => {
      flashLocationLoading();
      citySelectCtrl?.setOptions(
        getCityOptionsForFilter(newMarkazId),
        '',
        !newMarkazId,
        newMarkazId ? 'كل المدن والأحياء' : 'اختر المركز أولاً'
      );
      const resetVillages = getVillageOptionsForFilter('');
      villageSelectCtrl?.setOptions(
        resetVillages.options,
        '',
        true,
        resetVillages.placeholder
      );
    },
  });

  const govSelectCtrl = attachSearchableSelect({
    id: 'filter-governorate-select',
    options: nodesToOptions(getGovernorates(), 'كل المحافظات (27)'),
    value: initialGovId,
    placeholder: 'كل المحافظات (27)',
    searchPlaceholder: 'ابحث عن المحافظة...',
    onChange: (newGovId) => {
      flashLocationLoading();
      markazSelectCtrl?.setOptions(
        getMarkazOptionsForFilter(newGovId),
        '',
        !newGovId,
        newGovId ? 'كل المراكز والأقسام' : 'اختر المحافظة أولاً'
      );
      citySelectCtrl?.setOptions(
        getCityOptionsForFilter(''),
        '',
        true,
        'اختر المركز أولاً'
      );
      const resetVillages = getVillageOptionsForFilter('');
      villageSelectCtrl?.setOptions(
        resetVillages.options,
        '',
        true,
        resetVillages.placeholder
      );
    },
  });

  // Species buttons
  speciesBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextSp = (btn.getAttribute('data-filter-species') || 'all') as 'all' | 'cat' | 'dog';
      syncSpeciesButtons(nextSp);
      breedSelectCtrl?.setOptions(getBreedOptions(nextSp, false), '');
      hybridSelectCtrl?.setOptions(getBreedOptions(nextSp, true), '');
    });
  });

  // Gender buttons
  genderBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextG = (btn.getAttribute('data-filter-gender') || 'all') as 'all' | 'male' | 'female';
      syncGenderButtons(nextG);
    });
  });

  // Vaccine buttons
  vaccineBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextV = (btn.getAttribute('data-filter-vaccine') || 'all') as
        | 'all'
        | 'fully_vaccinated'
        | 'not_vaccinated';
      syncVaccineButtons(nextV);
    });
  });

  // Numeric sanitization for Age inputs
  const yearsInput = document.getElementById('filter-age-years-input') as HTMLInputElement | null;
  const monthsInput = document.getElementById('filter-age-months-input') as HTMLInputElement | null;
  if (yearsInput) {
    yearsInput.addEventListener('input', () => {
      yearsInput.value = yearsInput.value.replace(/[^0-9]/g, '');
    });
  }
  if (monthsInput) {
    monthsInput.addEventListener('input', () => {
      monthsInput.value = monthsInput.value.replace(/[^0-9]/g, '');
    });
  }

  // Recommended Match Button & Pet Selector (Mating only — fills modal controls in-place, stays open!)
  let chosenRecPetId = (state.getRecommendedReferencePet() || state.getUserPets()[0])?.id;
  const recPetBtns = document.querySelectorAll<HTMLButtonElement>('.rec-pet-choice-btn');
  const recCardBox = document.getElementById('recommended-card-box');
  const recSubtitle = document.getElementById('recommended-pet-subtitle');
  const recMatchBtn = document.getElementById('recommended-match-btn') as HTMLButtonElement | null;
  const recPrepStatus = document.getElementById('rec-prep-status');
  const recFilledBanner = document.getElementById('rec-filled-banner');
  const disableRecBtn = document.getElementById('disable-recommended-btn');

  recPetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-rec-pet-id');
      if (!pid) return;
      chosenRecPetId = pid;
      const petObj = state.getUserPets().find((p) => p.id === pid);
      if (recSubtitle && petObj) {
        recSubtitle.textContent = `تحليل: ${petObj.name} (${petObj.gender === 'male' ? 'ذكر' : 'أنثى'} • ${petObj.breed})`;
      }
      recPetBtns.forEach((b) => {
        const active = b.getAttribute('data-rec-pet-id') === pid;
        b.className = `rec-pet-choice-btn px-3 py-1 rounded-full text-xs font-black border cursor-pointer transition ${
          active
            ? 'bg-[#e67e22] text-white border-[#e67e22]'
            : 'bg-white text-[#786555] border-[#d6c7b2]'
        }`;
      });
    });
  });

  const colorInputEl = document.getElementById('filter-color-input') as HTMLInputElement | null;

  if (recMatchBtn) {
    recMatchBtn.addEventListener('click', () => {
      if (!chosenRecPetId) return;
      const preset = state.getRecommendedFilterPreset(chosenRecPetId);
      if (!preset) return;

      if (recPrepStatus) recPrepStatus.classList.add('hidden');
      draftRecommendedMatch = true;

      // 1. Auto-fill Species, Breed & Hybrid Breed
      syncSpeciesButtons(preset.species);
      breedSelectCtrl?.setOptions(
        getBreedOptions(preset.species, false, preset.breed || ''),
        preset.breed || ''
      );
      hybridSelectCtrl?.setOptions(
        getBreedOptions(preset.species, true, preset.hybridBreed || ''),
        preset.hybridBreed || ''
      );

      // 2. Auto-fill Color & Age (actual values from pet profile, always editable)
      if (colorInputEl) {
        colorInputEl.value = preset.color || '';
      }
      if (yearsInput) {
        yearsInput.value = preset.ageYears !== undefined ? String(preset.ageYears) : '';
      }
      if (monthsInput) {
        monthsInput.value = preset.ageMonths !== undefined ? String(preset.ageMonths) : '';
      }

      // 3. Auto-fill opposite Gender & Vaccination status
      syncGenderButtons(preset.gender);
      syncVaccineButtons(preset.vaccinationStatus);

      // 4. Auto-fill full Egypt Geographic Location hierarchy (Governorate -> Markaz -> City -> Village)
      const govId = preset.governorateId || '';
      const markazId = govId ? preset.markazId || '' : '';
      const cityId = markazId ? preset.cityId || '' : '';
      const nextVillages = getVillageOptionsForFilter(cityId);
      const villageId = !nextVillages.disabled && preset.villageId ? preset.villageId : '';

      govSelectCtrl?.setValue(govId);
      markazSelectCtrl?.setOptions(
        getMarkazOptionsForFilter(govId),
        markazId,
        !govId,
        govId ? 'كل المراكز والأقسام' : 'اختر المحافظة أولاً'
      );
      citySelectCtrl?.setOptions(
        getCityOptionsForFilter(markazId),
        cityId,
        !markazId,
        markazId ? 'كل المدن والأحياء' : 'اختر المركز أولاً'
      );
      villageSelectCtrl?.setOptions(
        nextVillages.options,
        villageId,
        nextVillages.disabled,
        nextVillages.placeholder
      );

      // 5. Visual highlight & editable confirmation banner inside Modal (applied ONLY on «تطبيق الفلترة»)
      if (recCardBox) {
        recCardBox.classList.remove('border-[#d6c7b2]', 'bg-[#fffefc]');
        recCardBox.classList.add('border-[#e67e22]', 'bg-[#fff5ea]');
      }
      recMatchBtn.className =
        'w-full h-14 px-6 rounded-full font-black text-base sm:text-lg flex items-center justify-center gap-2 transition shadow-soft bg-brand-orange text-white ring-4 ring-brand-orange/30 cursor-pointer active:scale-[0.98]';
      if (recFilledBanner) recFilledBanner.classList.remove('hidden');
      if (disableRecBtn) disableRecBtn.classList.remove('hidden');
    });
  }

  if (disableRecBtn) {
    disableRecBtn.addEventListener('click', () => {
      draftRecommendedMatch = false;
      if (recCardBox) {
        recCardBox.classList.remove('border-[#e67e22]', 'bg-[#fff5ea]');
        recCardBox.classList.add('border-[#d6c7b2]', 'bg-[#fffefc]');
      }
      if (recFilledBanner) recFilledBanner.classList.add('hidden');
      disableRecBtn.classList.add('hidden');
      if (recMatchBtn) {
        recMatchBtn.className =
          'w-full h-14 px-6 rounded-full font-black text-base sm:text-lg flex items-center justify-center gap-2 transition shadow-soft bg-brand-orange hover:bg-brand-accent text-white cursor-pointer active:scale-[0.98]';
      }
    });
  }

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const emptyFilters = {
        species: 'all' as const,
        gender: 'all' as const,
        breed: '',
        hybridBreed: '',
        color: '',
        governorate: '',
        markaz: '',
        city: '',
        village: '',
        governorateId: '',
        markazId: '',
        cityId: '',
        villageId: '',
        locationId: '',
        vaccinationStatus: 'all' as const,
        ageYears: undefined,
        ageMonths: undefined,
        recommendedMatchEnabled: false,
        sortBy: 'newest' as const,
      };
      if (currentTab === 'mating') {
        state.applyMatingFiltersWithLoading(emptyFilters, 'جاري إعادة ضبط الفلترة...');
      } else {
        state.applyAdoptionFiltersWithLoading(emptyFilters, 'جاري إعادة ضبط الفلترة...');
      }
      close();
    });
  }

  // Apply — commits draft criteria + recommendation mode with calm loading feedback
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const colorInput = document.getElementById('filter-color-input') as HTMLInputElement | null;
      const yearsRaw = yearsInput?.value?.trim() || '';
      const monthsRaw = monthsInput?.value?.trim() || '';

      const govId = govSelectCtrl ? govSelectCtrl.getValue().trim() : '';
      const markazId = markazSelectCtrl ? markazSelectCtrl.getValue().trim() : '';
      const cityId = citySelectCtrl ? citySelectCtrl.getValue().trim() : '';
      const villageId = villageSelectCtrl ? villageSelectCtrl.getValue().trim() : '';

      const govNode = getGeoNodeById(govId);
      const markazNode = getGeoNodeById(markazId);
      const cityNode = getGeoNodeById(cityId);
      const villageNode = getGeoNodeById(villageId);
      const deepestId = villageId || cityId || markazId || govId || '';

      const updated = {
        species: tempSpecies,
        gender: tempGender,
        vaccinationStatus: tempVaccine,
        breed: breedSelectCtrl ? breedSelectCtrl.getValue().trim() : '',
        hybridBreed: hybridSelectCtrl ? hybridSelectCtrl.getValue().trim() : '',
        color: colorInput ? colorInput.value.trim() : '',
        ageYears: yearsRaw !== '' ? parseInt(yearsRaw, 10) : undefined,
        ageMonths: monthsRaw !== '' ? parseInt(monthsRaw, 10) : undefined,
        governorateId: govId,
        markazId,
        cityId,
        villageId,
        locationId: deepestId,
        governorate: govNode?.name || '',
        markaz: markazNode?.name || '',
        city: cityNode?.name || '',
        village: villageNode?.name || '',
        ...(currentTab === 'mating'
          ? {
              recommendedMatchEnabled: draftRecommendedMatch,
              recommendedForPetId: draftRecommendedMatch ? chosenRecPetId : undefined,
              sortBy: draftRecommendedMatch ? ('recommended' as const) : ('newest' as const),
            }
          : {}),
      };

      close();
      if (currentTab === 'mating') {
        state.applyMatingFiltersWithLoading(
          updated,
          draftRecommendedMatch
            ? 'جاري ترتيب النتائج من الأكثر توافقاً للأقل...'
            : 'جاري البحث وتصفية نتائج التزاوج...'
        );
      } else {
        state.applyAdoptionFiltersWithLoading(updated, 'جاري البحث وتصفية نتائج التبني...');
      }
      if (onApply) onApply();
    });
  }
}
