import { state } from '../../state.ts';
import { Pet, PetSpecies, PetGender, VaccinationStatus, PetStatus } from '../../types.ts';

const PRESET_CAT_PHOTOS = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
];

export function renderAddPetModal(petToEdit: Pet | null): string {
  const isEdit = Boolean(petToEdit);

  const name = petToEdit?.name || '';
  let selectedSpecies = petToEdit?.species || 'cat';
  const breed = petToEdit?.breed || '';
  const hybridBreed = petToEdit?.hybridBreed || '';
  const ageYears = petToEdit?.ageYears ?? 1;
  const ageMonths = petToEdit?.ageMonths ?? 6;
  const color = petToEdit?.color || '';
  const gender = petToEdit?.gender || 'male';
  const area = petToEdit?.area || 'حي النرجس، الرياض';
  const vaccinationStatus = petToEdit?.vaccinationStatus || 'fully_vaccinated';
  const healthNotes = petToEdit?.healthNotes || 'تم الفحص البيطري ودفتر التطعيمات متوفر.';
  const personality = petToEdit?.personality?.join('، ') || 'مرح، ذكي، هادئ، حنون';
  const status = petToEdit?.status || 'mating';

  return `
    <div id="add-pet-modal-backdrop" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in" dir="rtl">
      <div class="bg-[#FFF9E9] dark:bg-[#1C1713] rounded-3xl max-w-lg w-full border-2 border-brand-peachBorder dark:border-warm-darkBorder shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col relative text-[#2d221b] dark:text-[#F7EFE8] animate-scale-up">
        
        <!-- Header Section matching _1/code.html -->
        <div class="p-4 px-5 flex items-center justify-between border-b border-brand-peachBorder/60 dark:border-warm-darkBorder bg-white/80 dark:bg-[#27201B] sticky top-0 z-10 backdrop-blur-sm">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl bg-brand-orange/15 text-brand-orange flex items-center justify-center text-xl shadow-xs">
              <i class="fa-solid fa-paw"></i>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-black font-baloo text-brand-dark dark:text-white leading-tight m-0">
                ${isEdit ? `تعديل بيانات: ${petToEdit?.name}` : 'تسجيل بيانات المياو 🐾'}
              </h3>
              <p class="text-xs font-bold text-brand-subtleGray dark:text-[#A89F91] m-0">
                ${isEdit ? 'تعديل البيانات والصور بدقة' : 'املأ بيانات حيوانك لربطه بفرص التزاوج والتبني'}
              </p>
            </div>
          </div>
          <button id="close-add-pet-modal-btn" class="w-9 h-9 rounded-2xl bg-brand-peachBorder/40 dark:bg-[#342A24] hover:bg-brand-orange hover:text-white text-brand-dark dark:text-white flex items-center justify-center cursor-pointer transition text-xs active:scale-90" type="button">
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Form Body matching _1/code.html field by field -->
        <form id="pet-form" class="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          
          <!-- 1. عندك ايه؟ (نوع الأليف - قطة / كلب) -->
          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white">عندك ايه؟ 🐾</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="type-cat-btn"
                class="species-choice-btn h-14 relative flex items-center justify-center gap-2 rounded-2xl border-2 transition-all cursor-pointer shadow-sm active:scale-95 font-baloo ${
                  selectedSpecies === 'cat'
                    ? 'border-brand-orange bg-[#fff5ea] dark:bg-[#342A24] text-brand-orange font-black'
                    : 'border-brand-peachBorder dark:border-warm-darkBorder bg-white dark:bg-[#27201B] text-brand-subtleGray dark:text-[#A89F91] font-bold'
                }"
              >
                <span class="text-2xl">🐱</span>
                <span class="text-base">قطة</span>
              </button>
              <button
                type="button"
                id="type-dog-btn"
                class="species-choice-btn h-14 relative flex items-center justify-center gap-2 rounded-2xl border-2 transition-all cursor-pointer shadow-sm active:scale-95 font-baloo ${
                  selectedSpecies === 'dog'
                    ? 'border-brand-orange bg-[#fff5ea] dark:bg-[#342A24] text-brand-orange font-black'
                    : 'border-brand-peachBorder dark:border-warm-darkBorder bg-white dark:bg-[#27201B] text-brand-subtleGray dark:text-[#A89F91] font-bold'
                }"
              >
                <span class="text-2xl">🐶</span>
                <span class="text-base">كلب</span>
              </button>
              <input id="form-pet-species" type="hidden" value="${selectedSpecies}" />
            </div>
          </div>

          <!-- 2. صور للمياو (3 صور أساسية) -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white">صور للمياو (3 صور متتالية) 📸</label>
              <span class="text-[11px] font-bold text-brand-orange font-baloo">تصفح وتأكد من الصور</span>
            </div>
            <div class="grid grid-cols-3 gap-2.5">
              ${(petToEdit?.photos || PRESET_CAT_PHOTOS.slice(0, 3))
                .slice(0, 3)
                .map((photo, i) => `
                  <div class="relative aspect-square rounded-2xl overflow-hidden border-2 border-brand-orange bg-[#fffbf2] dark:bg-[#342A24] shadow-sm">
                    <img src="${photo}" alt="صورة ${i + 1}" class="w-full h-full object-cover" />
                    <span class="absolute top-1 right-1 w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                      ${i + 1}
                    </span>
                  </div>
                `)
                .join('')}
            </div>
          </div>

          <!-- 3. اسم المياو & اللون -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white mb-1">اسم المياو *</label>
              <input
                type="text"
                id="form-pet-name"
                required
                value="${name}"
                placeholder="سيمبا، لونا، مشمش..."
                class="w-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-sm font-baloo"
              />
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white mb-1">اللون *</label>
              <input
                type="text"
                id="form-pet-color"
                required
                value="${color}"
                placeholder="أبيض ناصع، برتقالي، رمادي..."
                class="w-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-sm font-baloo"
              />
            </div>
          </div>

          <!-- 4. السلالة & سلالة هجينة (اختياري) -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white mb-1">السلالة *</label>
              <input
                type="text"
                id="form-pet-breed"
                required
                value="${breed}"
                placeholder="شيرازي، بريطاني، هاسكي..."
                class="w-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-sm font-baloo"
              />
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white mb-1">سلالة هجينة (اختياري)</label>
              <input
                type="text"
                id="form-pet-hybrid"
                value="${hybridBreed}"
                placeholder="بدون هجين / سيامي..."
                class="w-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-sm font-baloo"
              />
            </div>
          </div>

          <!-- 5. العمر (سنة وشهر) & الجنس -->
          <div class="grid grid-cols-3 gap-2.5">
            <div>
              <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white mb-1">الجنس *</label>
              <select
                id="form-pet-gender"
                class="w-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-2xl px-2.5 py-2.5 text-xs sm:text-sm font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-sm cursor-pointer font-baloo"
              >
                <option value="male" ${gender === 'male' ? 'selected' : ''}>ذكر (♂️)</option>
                <option value="female" ${gender === 'female' ? 'selected' : ''}>أنثى (♀️)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white mb-1">العمر (سنوات)</label>
              <input
                type="number"
                id="form-pet-age-years"
                min="0"
                max="25"
                value="${ageYears}"
                class="w-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-sm font-baloo text-center"
              />
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white mb-1">العمر (أشهر)</label>
              <input
                type="number"
                id="form-pet-age-months"
                min="0"
                max="11"
                value="${ageMonths}"
                class="w-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-sm font-baloo text-center"
              />
            </div>
          </div>

          <!-- 6. حالة التطعيم & المدينة -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white mb-1">حالة التطعيم *</label>
              <select
                id="form-pet-vaccination"
                class="w-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-sm cursor-pointer font-baloo"
              >
                <option value="fully_vaccinated" ${vaccinationStatus === 'fully_vaccinated' ? 'selected' : ''}>مُطعّم بالكامل ✓</option>
                <option value="partially_vaccinated" ${vaccinationStatus === 'partially_vaccinated' ? 'selected' : ''}>مطعم جزئياً</option>
                <option value="not_vaccinated" ${vaccinationStatus === 'not_vaccinated' ? 'selected' : ''}>غير مطعم</option>
              </select>
            </div>
            <div>
              <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white mb-1">المدينة والحي *</label>
              <input
                type="text"
                id="form-pet-area"
                required
                value="${area}"
                placeholder="المعادي، القاهرة"
                class="w-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-sm font-baloo"
              />
            </div>
          </div>

          <!-- 7. الشخصية والطباع (السمات) -->
          <div>
            <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white mb-1">الشخصية والطباع (مفصولة بفواصل)</label>
            <input
              id="form-pet-personality"
              type="text"
              placeholder="مثال: مرح، ذكي، هادئ، حنون"
              value="${personality}"
              class="w-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-sm font-baloo"
            />
          </div>

          <!-- 8. ملاحظات صحية / سلوكية -->
          <div>
            <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white mb-1">ملاحظات صحية / سلوكية</label>
            <textarea
              id="form-pet-health-notes"
              rows="2"
              placeholder="أي تفاصيل صحية أو سلوكية إضافية..."
              class="w-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-2xl p-3 text-xs sm:text-sm font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange shadow-sm font-baloo"
            >${healthNotes}</textarea>
          </div>

          <!-- 9. تفعيل الظهور (تزاوج / تبني / غير متاح) -->
          <div class="p-3.5 rounded-2xl bg-[#fff5ea] dark:bg-[#342A24] border border-brand-peachBorder dark:border-warm-darkBorder space-y-2">
            <label class="block text-xs sm:text-sm font-black text-brand-dark dark:text-white">تفعيل ظهور الأليف في أقسام التطبيق: *</label>
            <div class="grid grid-cols-3 gap-2">
              <label class="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder cursor-pointer">
                <input type="radio" name="form_pet_status" value="mating" ${status === 'mating' ? 'checked' : ''} class="accent-brand-orange" />
                <span class="text-xs font-black text-brand-dark dark:text-white font-baloo">تزاوج ❤️</span>
              </label>
              <label class="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder cursor-pointer">
                <input type="radio" name="form_pet_status" value="adoption" ${status === 'adoption' ? 'checked' : ''} class="accent-brand-orange" />
                <span class="text-xs font-black text-brand-dark dark:text-white font-baloo">تبني 🏠</span>
              </label>
              <label class="flex items-center gap-1.5 p-2 rounded-xl bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder cursor-pointer">
                <input type="radio" name="form_pet_status" value="not_available" ${status === 'not_available' ? 'checked' : ''} class="accent-brand-orange" />
                <span class="text-xs font-black text-brand-subtleGray dark:text-[#A89F91] font-baloo">خاص ⏸️</span>
              </label>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="cancel-add-pet-btn"
              class="px-5 py-2.5 rounded-xl bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark dark:text-white font-black text-xs sm:text-sm hover:bg-brand-peachBorder/20 transition active:scale-95 cursor-pointer font-baloo"
            >
              إلغاء
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 rounded-xl bg-brand-orange text-white font-black text-xs sm:text-sm shadow-soft hover:bg-brand-orangeHover transition active:scale-95 cursor-pointer font-baloo"
            >
              ${isEdit ? 'حفظ التعديلات ✨' : 'تسجيل الأليف الآن 🐾'}
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}

export function attachAddPetModalEvents(petToEdit: Pet | null): void {
  const closeBtn = document.getElementById('close-add-pet-modal-btn');
  const cancelBtn = document.getElementById('cancel-add-pet-btn');
  const backdrop = document.getElementById('add-pet-modal-backdrop');
  const form = document.getElementById('pet-form') as HTMLFormElement;

  const handleClose = () => {
    state.setAddPetModalVisible(false, null);
  };

  if (closeBtn) closeBtn.addEventListener('click', handleClose);
  if (cancelBtn) cancelBtn.addEventListener('click', handleClose);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) handleClose();
    });
  }

  // Species toggle
  const catBtn = document.getElementById('type-cat-btn');
  const dogBtn = document.getElementById('type-dog-btn');
  const speciesInput = document.getElementById('form-pet-species') as HTMLInputElement;

  if (catBtn && dogBtn && speciesInput) {
    catBtn.addEventListener('click', () => {
      speciesInput.value = 'cat';
      catBtn.className = 'species-choice-btn h-14 relative flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-orange bg-[#fff5ea] dark:bg-[#342A24] text-brand-orange font-black shadow-sm active:scale-95 transition-all cursor-pointer font-baloo';
      dogBtn.className = 'species-choice-btn h-14 relative flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-peachBorder dark:border-warm-darkBorder bg-white dark:bg-[#27201B] text-brand-subtleGray dark:text-[#A89F91] font-bold shadow-sm active:scale-95 transition-all cursor-pointer font-baloo';
    });
    dogBtn.addEventListener('click', () => {
      speciesInput.value = 'dog';
      dogBtn.className = 'species-choice-btn h-14 relative flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-orange bg-[#fff5ea] dark:bg-[#342A24] text-brand-orange font-black shadow-sm active:scale-95 transition-all cursor-pointer font-baloo';
      catBtn.className = 'species-choice-btn h-14 relative flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-peachBorder dark:border-warm-darkBorder bg-white dark:bg-[#27201B] text-brand-subtleGray dark:text-[#A89F91] font-bold shadow-sm active:scale-95 transition-all cursor-pointer font-baloo';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-pet-name') as HTMLInputElement;
      const breedInput = document.getElementById('form-pet-breed') as HTMLInputElement;
      const hybridInput = document.getElementById('form-pet-hybrid') as HTMLInputElement;
      const colorInput = document.getElementById('form-pet-color') as HTMLInputElement;
      const genderSelect = document.getElementById('form-pet-gender') as HTMLSelectElement;
      const ageYearsInput = document.getElementById('form-pet-age-years') as HTMLInputElement;
      const ageMonthsInput = document.getElementById('form-pet-age-months') as HTMLInputElement;
      const vaccinationSelect = document.getElementById('form-pet-vaccination') as HTMLSelectElement;
      const areaInput = document.getElementById('form-pet-area') as HTMLInputElement;
      const personalityInput = document.getElementById('form-pet-personality') as HTMLInputElement;
      const notesInput = document.getElementById('form-pet-health-notes') as HTMLTextAreaElement;

      const selectedStatusRadio = document.querySelector<HTMLInputElement>(
        'input[name="form_pet_status"]:checked'
      );

      const status = (selectedStatusRadio?.value as PetStatus) || 'mating';

      const personalityArray = personalityInput ? personalityInput.value
        .split(/[،,]/)
        .map((s) => s.trim())
        .filter(Boolean) : ['أليف', 'لطيف'];

      const petData: Partial<Pet> = {
        id: petToEdit ? petToEdit.id : undefined,
        name: nameInput.value.trim(),
        species: (speciesInput ? speciesInput.value : 'cat') as PetSpecies,
        breed: breedInput.value.trim(),
        hybridBreed: hybridInput ? hybridInput.value.trim() : '',
        color: colorInput.value.trim(),
        gender: genderSelect.value as PetGender,
        ageYears: parseInt(ageYearsInput.value, 10) || 1,
        ageMonths: parseInt(ageMonthsInput.value, 10) || 0,
        area: areaInput.value.trim(),
        city: areaInput.value.includes('الجيزة') ? 'الجيزة' : areaInput.value.includes('الإسكندرية') ? 'الإسكندرية' : 'القاهرة',
        healthStatus: 'ممتازة',
        vaccinationStatus: (vaccinationSelect ? vaccinationSelect.value : 'fully_vaccinated') as VaccinationStatus,
        personality: personalityArray.length > 0 ? personalityArray : ['أليف', 'لطيف'],
        healthNotes: notesInput ? notesInput.value.trim() : '',
        status,
        photos: petToEdit?.photos || PRESET_CAT_PHOTOS.slice(0, 3),
      };

      state.savePet(petData);
      state.setAddPetModalVisible(false, null);
    });
  }
}
