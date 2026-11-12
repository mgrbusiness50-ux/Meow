import { state } from '../../state.ts';

const CAT_BREEDS = [
  'الكل',
  'بلدي (ماو مصري)',
  'شيرازي (فارسي)',
  'سيامي',
  'هيمالايا',
  'سكوتش فولد',
  'بريطاني قصير الشعر',
  'راغدول',
  'مين كون',
  'بنغالي',
  'سفينكس (الفرعوني)',
  'حبشي',
  'روسي أزرق',
  'تركي أنغورا',
  'بيرمان',
  'أمريكي قصير الشعر',
  'نرويجي غابات',
  'سلالة أخرى',
];

const DOG_BREEDS = [
  'الكل',
  'بلدي',
  'جيرمن شيبرد (الراعي الألماني)',
  'غولدن ريتريفر',
  'لابرادور ريتريفر',
  'هاسكي سيبيري',
  'روتوايلر',
  'بيت بول',
  'دوبرمان',
  'بولدوغ فرنسي',
  'كان كورسو',
  'شيواوا',
  'مالينوا بلجيكي',
  'بوكسر',
  'شيتزو',
  'سلالة أخرى',
];



export function renderFilterModal(): string {
  if (!state.getIsFilterModalOpen()) return '';

  const currentTab = state.getCurrentTab();
  const filters = currentTab === 'mating' ? state.getMatingFilters() : state.getAdoptionFilters();

  const selectedSpecies = filters.species || 'all';
  const selectedGender = filters.gender || 'all';
  const selectedVaccination = filters.vaccinationStatus || 'all';
  const selectedHybrid = filters.hybridBreed || 'all';

  const breeds = selectedSpecies === 'dog' ? DOG_BREEDS : CAT_BREEDS;

  return `
    <!-- Filter Modal (Matching Meow Pet Registration Form Structure & Order) -->
    <div id="filter-backdrop" class="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in" dir="rtl">
      <div 
        id="filter-modal-card" 
        class="bg-[#FFF9E9] dark:bg-[#1C1713] text-[#2d221b] dark:text-[#F7EFE8] w-full max-w-sm sm:max-w-md rounded-[32px] p-4 sm:p-5 shadow-2xl border-2 border-brand-peachBorder dark:border-warm-darkBorder max-h-[90vh] overflow-y-auto transform transition-all animate-scale-up"
      >
        
        <!-- Header: Matching Meow registration aesthetics -->
        <div class="flex items-center justify-between pb-3 border-b border-brand-peachBorder/60 dark:border-warm-darkBorder mb-3.5 sticky top-0 bg-[#FFF9E9] dark:bg-[#1C1713] z-10">
          <div class="flex items-center gap-2">
            <span class="text-xl text-brand-orange">🐾</span>
            <h2 class="text-base sm:text-lg font-black font-baloo text-brand-dark dark:text-white leading-tight m-0">تصفية وفلاتر البحث</h2>
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              id="reset-filter-btn" 
              type="button"
              class="text-xs font-bold text-brand-orange hover:underline cursor-pointer px-2.5 py-1 rounded-xl bg-brand-cream/80 dark:bg-[#27201B] border border-brand-peachBorder/60 dark:border-warm-darkBorder font-baloo"
            >
              إعادة ضبط
            </button>
            <button 
              id="close-filter-btn" 
              aria-label="إغلاق الفلتر"
              class="w-8 h-8 rounded-full bg-brand-peachBorder/40 dark:bg-[#342A24] text-brand-dark dark:text-white flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all cursor-pointer"
            >
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        <form id="meow-filter-form" class="space-y-4 text-right">
          
          <!-- 1. عندك ايه؟ (قطة / كلب / الكل) -->
          <div class="space-y-1.5">
            <label class="block text-xs font-black text-brand-dark dark:text-white">عندك ايه؟</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                type="button" 
                data-filter-species="all" 
                class="filter-species-btn h-11 rounded-2xl text-xs font-black transition-all cursor-pointer font-baloo active:scale-95 ${
                  selectedSpecies === 'all'
                    ? 'bg-brand-orange text-white shadow-soft border-2 border-brand-orange'
                    : 'bg-white dark:bg-[#27201B] text-brand-dark dark:text-[#D1C7BD] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
                }"
              >
                الكل
              </button>
              <button 
                type="button" 
                data-filter-species="cat" 
                class="filter-species-btn h-11 rounded-2xl text-xs font-black transition-all cursor-pointer font-baloo active:scale-95 flex items-center justify-center gap-1.5 ${
                  selectedSpecies === 'cat'
                    ? 'bg-brand-orange text-white shadow-soft border-2 border-brand-orange'
                    : 'bg-white dark:bg-[#27201B] text-brand-dark dark:text-[#D1C7BD] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
                }"
              >
                <span>قطة</span>
                <span>🐱</span>
              </button>
              <button 
                type="button" 
                data-filter-species="dog" 
                class="filter-species-btn h-11 rounded-2xl text-xs font-black transition-all cursor-pointer font-baloo active:scale-95 flex items-center justify-center gap-1.5 ${
                  selectedSpecies === 'dog'
                    ? 'bg-brand-orange text-white shadow-soft border-2 border-brand-orange'
                    : 'bg-white dark:bg-[#27201B] text-brand-dark dark:text-[#D1C7BD] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
                }"
              >
                <span>كلب</span>
                <span>🐶</span>
              </button>
            </div>
          </div>

          <!-- 2. اللون (مطابق لنموذج التسجيل بدون خانة الاسم) -->
          <div>
            <label class="block text-xs font-black text-brand-dark dark:text-white mb-1">اللون</label>
            <input 
              id="filter-color-input"
              type="text" 
              value="${filters.color || ''}"
              placeholder="أبيض، رمادي، مشمشي..."
              class="w-full bg-white dark:bg-[#27201B] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder rounded-2xl px-3.5 py-2 text-xs font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-2xs font-baloo"
            />
          </div>

          <!-- 3. السلالة & سلالة هجينة (مطابق لنموذج التسجيل) -->
          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block text-xs font-black text-brand-dark dark:text-white mb-1">السلالة</label>
              <select 
                id="filter-breed-select"
                class="w-full bg-white dark:bg-[#27201B] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder rounded-2xl px-2.5 py-2 text-xs font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-2xs font-baloo cursor-pointer truncate"
              >
                ${breeds
                  .map(
                    (b) =>
                      `<option value="${b === 'الكل' ? '' : b}" ${
                        filters.breed === b ? 'selected' : ''
                      }>${b}</option>`
                  )
                  .join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-black text-brand-dark dark:text-white mb-1">سلالة هجينة (اختياري)</label>
              <select 
                id="filter-hybrid-select"
                class="w-full bg-white dark:bg-[#27201B] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder rounded-2xl px-2.5 py-2 text-xs font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-2xs font-baloo cursor-pointer"
              >
                <option value="all" ${selectedHybrid === 'all' ? 'selected' : ''}>الكل</option>
                <option value="none" ${selectedHybrid === 'none' ? 'selected' : ''}>بدون هجين</option>
                <option value="hybrid" ${selectedHybrid === 'hybrid' ? 'selected' : ''}>هجين / مختلط</option>
              </select>
            </div>
          </div>

          <!-- 4. العمر (سنة / شهر) مطابق لنموذج التسجيل -->
          <div class="space-y-1">
            <label class="block text-xs font-black text-brand-dark dark:text-white">العمر</label>
            <div class="grid grid-cols-2 gap-2.5">
              <div class="flex items-center gap-1.5 bg-white dark:bg-[#27201B] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder rounded-2xl px-3 py-1.5">
                <input 
                  id="filter-max-age-input" 
                  type="number" 
                  min="0" 
                  max="20" 
                  value="${filters.maxAgeYears ?? 10}" 
                  class="w-full bg-transparent text-center text-xs font-black text-brand-dark dark:text-white focus:outline-none font-baloo"
                  placeholder="سنة"
                />
                <span class="text-xs font-bold text-brand-subtleGray shrink-0">سنة</span>
              </div>

              <div class="flex items-center gap-1.5 bg-white dark:bg-[#27201B] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder rounded-2xl px-3 py-1.5">
                <input 
                  id="filter-months-input" 
                  type="number" 
                  min="0" 
                  max="11" 
                  value="${filters.ageMonths ?? ''}" 
                  class="w-full bg-transparent text-center text-xs font-black text-brand-dark dark:text-white focus:outline-none font-baloo"
                  placeholder="شهر (اختياري)"
                />
                <span class="text-xs font-bold text-brand-subtleGray shrink-0">شهر</span>
              </div>
            </div>
          </div>

          <!-- 5. الجنس (مطابق لنموذج التسجيل: ذكر / أنثى / الكل) -->
          <div class="space-y-1.5">
            <label class="block text-xs font-black text-brand-dark dark:text-white">الجنس</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                type="button" 
                data-filter-gender="all" 
                class="filter-gender-btn h-10 rounded-2xl text-xs font-black transition-all cursor-pointer font-baloo active:scale-95 ${
                  selectedGender === 'all'
                    ? 'bg-brand-orange text-white shadow-soft border-2 border-brand-orange'
                    : 'bg-white dark:bg-[#27201B] text-brand-dark dark:text-[#D1C7BD] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
                }"
              >
                الكل
              </button>
              <button 
                type="button" 
                data-filter-gender="male" 
                class="filter-gender-btn h-10 rounded-2xl text-xs font-black transition-all cursor-pointer font-baloo active:scale-95 flex items-center justify-center gap-1 ${
                  selectedGender === 'male'
                    ? 'bg-[#3b82f6] text-white shadow-soft border-2 border-[#3b82f6]'
                    : 'bg-white dark:bg-[#27201B] text-brand-dark dark:text-[#D1C7BD] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
                }"
              >
                <span>ذكر ♂</span>
              </button>
              <button 
                type="button" 
                data-filter-gender="female" 
                class="filter-gender-btn h-10 rounded-2xl text-xs font-black transition-all cursor-pointer font-baloo active:scale-95 flex items-center justify-center gap-1 ${
                  selectedGender === 'female'
                    ? 'bg-[#ec4899] text-white shadow-soft border-2 border-[#ec4899]'
                    : 'bg-white dark:bg-[#27201B] text-brand-dark dark:text-[#D1C7BD] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
                }"
              >
                <span>أنثى ♀</span>
              </button>
            </div>
          </div>

          <!-- 6. حالة التطعيم (مطابق لنموذج التسجيل: مطعم / غير مطعم / الكل) -->
          <div class="space-y-1.5">
            <label class="block text-xs font-black text-brand-dark dark:text-white">حالة التطعيم</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                type="button" 
                data-filter-vaccine="all" 
                class="filter-vaccine-btn h-10 rounded-2xl text-xs font-black transition-all cursor-pointer font-baloo active:scale-95 ${
                  selectedVaccination === 'all'
                    ? 'bg-brand-orange text-white shadow-soft border-2 border-brand-orange'
                    : 'bg-white dark:bg-[#27201B] text-brand-dark dark:text-[#D1C7BD] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
                }"
              >
                الكل
              </button>
              <button 
                type="button" 
                data-filter-vaccine="fully_vaccinated" 
                class="filter-vaccine-btn h-10 rounded-2xl text-xs font-black transition-all cursor-pointer font-baloo active:scale-95 flex items-center justify-center gap-1 ${
                  selectedVaccination === 'fully_vaccinated'
                    ? 'bg-[#10b981] text-white shadow-soft border-2 border-[#10b981]'
                    : 'bg-white dark:bg-[#27201B] text-brand-dark dark:text-[#D1C7BD] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
                }"
              >
                <span>مُطعّم ✅</span>
              </button>
              <button 
                type="button" 
                data-filter-vaccine="not_vaccinated" 
                class="filter-vaccine-btn h-10 rounded-2xl text-xs font-black transition-all cursor-pointer font-baloo active:scale-95 flex items-center justify-center gap-1 ${
                  selectedVaccination === 'not_vaccinated'
                    ? 'bg-[#ea580c] text-white shadow-soft border-2 border-[#ea580c]'
                    : 'bg-white dark:bg-[#27201B] text-brand-dark dark:text-[#D1C7BD] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
                }"
              >
                <span>غير مطعم</span>
              </button>
            </div>
          </div>



          <!-- 8. المحافظة / المدينة (مطابق لنموذج تسجيل بيانات المالك) -->
          <div>
            <label class="block text-xs font-black text-brand-dark dark:text-white mb-1">المحافظة / المدينة</label>
            <select 
              id="filter-city-select" 
              class="w-full py-2 px-3 bg-white dark:bg-[#27201B] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder text-brand-dark dark:text-white text-xs font-bold rounded-2xl cursor-pointer font-baloo focus:outline-none focus:border-brand-orange shadow-2xs"
            >
              <option value="" ${!filters.city ? 'selected' : ''}>كل المحافظات والمدن</option>
              <option value="القاهرة" ${filters.city === 'القاهرة' ? 'selected' : ''}>القاهرة</option>
              <option value="الجيزة" ${filters.city === 'الجيزة' ? 'selected' : ''}>الجيزة</option>
              <option value="الإسكندرية" ${filters.city === 'الإسكندرية' ? 'selected' : ''}>الإسكندرية</option>
              <option value="المعادي" ${filters.city === 'المعادي' ? 'selected' : ''}>المعادي</option>
              <option value="مدينة نصر" ${filters.city === 'مدينة نصر' ? 'selected' : ''}>مدينة نصر</option>
              <option value="حدائق اكتوبر" ${filters.city === 'حدائق اكتوبر' ? 'selected' : ''}>حدائق اكتوبر</option>
              <option value="الشروق" ${filters.city === 'الشروق' ? 'selected' : ''}>الشروق</option>
            </select>
          </div>

          <!-- زر تطبيق الفلاتر الرئيسي -->
          <div class="pt-2 sticky bottom-0 bg-[#FFF9E9] dark:bg-[#1C1713] pb-1">
            <button 
              id="apply-filter-btn" 
              type="button"
              class="w-full h-12 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white font-baloo font-black text-sm sm:text-base shadow-soft flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <span>تطبيق الفلترة</span>
              <i class="fa-solid fa-check text-xs"></i>
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

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });
  }

  const currentTab = state.getCurrentTab();
  const currentFilters = currentTab === 'mating' ? state.getMatingFilters() : state.getAdoptionFilters();

  let tempSpecies = currentFilters.species || 'all';
  let tempGender = currentFilters.gender || 'all';
  let tempVaccine = currentFilters.vaccinationStatus || 'all';

  // Species buttons
  const speciesBtns = document.querySelectorAll<HTMLButtonElement>('.filter-species-btn');
  const breedSelect = document.getElementById('filter-breed-select') as HTMLSelectElement;

  speciesBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tempSpecies = (btn.getAttribute('data-filter-species') || 'all') as any;
      speciesBtns.forEach((b) => {
        const isMatch = b.getAttribute('data-filter-species') === tempSpecies;
        b.className = `filter-species-btn h-11 rounded-2xl text-xs font-black transition-all cursor-pointer font-baloo active:scale-95 flex items-center justify-center gap-1.5 ${
          isMatch
            ? 'bg-brand-orange text-white shadow-soft border-2 border-brand-orange'
            : 'bg-white dark:bg-[#27201B] text-brand-dark dark:text-[#D1C7BD] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
        }`;
      });

      // Update breed options
      if (breedSelect) {
        const breeds = tempSpecies === 'dog' ? DOG_BREEDS : CAT_BREEDS;
        breedSelect.innerHTML = breeds
          .map((b) => `<option value="${b === 'الكل' ? '' : b}">${b}</option>`)
          .join('');
      }
    });
  });

  // Gender buttons
  const genderBtns = document.querySelectorAll<HTMLButtonElement>('.filter-gender-btn');
  genderBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tempGender = (btn.getAttribute('data-filter-gender') || 'all') as any;
      genderBtns.forEach((b) => {
        const isMatch = b.getAttribute('data-filter-gender') === tempGender;
        const activeColor =
          tempGender === 'male' ? 'bg-[#3b82f6] border-[#3b82f6]' : tempGender === 'female' ? 'bg-[#ec4899] border-[#ec4899]' : 'bg-brand-orange border-brand-orange';

        b.className = `filter-gender-btn h-10 rounded-2xl text-xs font-black transition-all cursor-pointer font-baloo active:scale-95 flex items-center justify-center gap-1 ${
          isMatch
            ? `${activeColor} text-white shadow-soft border-2`
            : 'bg-white dark:bg-[#27201B] text-brand-dark dark:text-[#D1C7BD] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
        }`;
      });
    });
  });

  // Vaccine buttons
  const vaccineBtns = document.querySelectorAll<HTMLButtonElement>('.filter-vaccine-btn');
  vaccineBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tempVaccine = (btn.getAttribute('data-filter-vaccine') || 'all') as any;
      vaccineBtns.forEach((b) => {
        const isMatch = b.getAttribute('data-filter-vaccine') === tempVaccine;
        const activeColor =
          tempVaccine === 'fully_vaccinated' ? 'bg-[#10b981] border-[#10b981]' : tempVaccine === 'not_vaccinated' ? 'bg-[#ea580c] border-[#ea580c]' : 'bg-brand-orange border-brand-orange';

        b.className = `filter-vaccine-btn h-10 rounded-2xl text-xs font-black transition-all cursor-pointer font-baloo active:scale-95 flex items-center justify-center gap-1 ${
          isMatch
            ? `${activeColor} text-white shadow-soft border-2`
            : 'bg-white dark:bg-[#27201B] text-brand-dark dark:text-[#D1C7BD] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
        }`;
      });
    });
  });

  // Reset
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const emptyFilters = {
        species: 'all' as const,
        gender: 'all' as const,
        breed: '',
        hybridBreed: '',
        color: '',
        city: '',
        vaccinationStatus: 'all' as const,
        maxAgeYears: 10,
        ageMonths: undefined,
      };
      if (currentTab === 'mating') {
        state.setMatingFilters(emptyFilters);
      } else {
        state.setAdoptionFilters(emptyFilters);
      }
      close();
    });
  }

  // Apply
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const hybridSelect = document.getElementById('filter-hybrid-select') as HTMLSelectElement;
      const colorInput = document.getElementById('filter-color-input') as HTMLInputElement;
      const maxAgeInput = document.getElementById('filter-max-age-input') as HTMLInputElement;
      const monthsInput = document.getElementById('filter-months-input') as HTMLInputElement;
      const citySelect = document.getElementById('filter-city-select') as HTMLSelectElement;

      const updated = {
        species: tempSpecies,
        gender: tempGender,
        vaccinationStatus: tempVaccine,
        breed: breedSelect ? breedSelect.value.trim() : '',
        hybridBreed: hybridSelect ? hybridSelect.value : 'all',
        color: colorInput ? colorInput.value.trim() : '',
        maxAgeYears: maxAgeInput && maxAgeInput.value ? parseInt(maxAgeInput.value, 10) : 10,
        ageMonths: monthsInput && monthsInput.value ? parseInt(monthsInput.value, 10) : undefined,
        city: citySelect ? citySelect.value : '',
      };

      if (currentTab === 'mating') {
        state.setMatingFilters(updated);
      } else {
        state.setAdoptionFilters(updated);
      }

      close();
      if (onApply) onApply();
    });
  }
}
