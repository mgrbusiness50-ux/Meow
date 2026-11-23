import { state } from '../../state.ts';
import { Pet } from '../../types.ts';
import { renderThreeDotsMenu } from '../components/BlockMenu.ts';
import { escapeAttr, escapeHtml, sanitizeImageSrc } from '../../utils/sanitize.ts';

export function renderSavedPetsView(): string {
  const isVisible = state.isSavedPetsVisible();
  if (!isVisible) return '';

  const activeSubTab = state.getSavedPetsSubTab();
  const savedPets = state.getSavedPets();
  const matingSaved = savedPets.filter((p) => p.status === 'mating');
  const adoptionSaved = savedPets.filter((p) => p.status === 'adoption');

  return `
    <div id="saved-pets-modal" class="fixed inset-0 z-50 bg-[#FFF9E9] dark:bg-[#141210] text-[#2A2521] dark:text-[#F7EFE8] w-full min-h-[100dvh] overflow-y-auto flex flex-col font-baloo animate-fade-in" dir="rtl">
      
      <!-- Top Header -->
      <header class="sticky top-0 z-40 w-full max-w-md mx-auto px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] flex items-center justify-between bg-[#FFF9E9]/95 dark:bg-[#141210]/95 backdrop-blur-md border-b border-brand-peachBorder/70 dark:border-[#3A3027]">
        <div class="flex items-center gap-3">
          <button
            id="close-saved-pets-btn"
            type="button"
            aria-label="رجوع"
            class="w-11 h-11 rounded-full bg-white dark:bg-[#241E1A] border-2 border-brand-peachBorder dark:border-[#3A3027] text-brand-dark dark:text-white flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all cursor-pointer active:scale-90 shadow-sm"
          >
            <i class="fa-solid fa-arrow-right text-base"></i>
          </button>
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-heart text-red-500 text-xl"></i>
            <h1 class="text-2xl font-black text-brand-dark dark:text-white m-0 tracking-tight">
              المحفوظات
            </h1>
          </div>
        </div>

        <span class="px-3 py-1 rounded-full bg-brand-orange/15 text-brand-orange text-xs font-black">
          ${savedPets.length} عنصر
        </span>
      </header>

      <!-- Main Content Container -->
      <div class="w-full max-w-md mx-auto px-4 pt-4 pb-[max(5rem,calc(2.5rem+env(safe-area-inset-bottom)))] flex-1 flex flex-col min-w-0">
        
        <!-- The 4 Required Tabs: 1. التزاوج, 2. التبني, 3. العيادات (مقفولة), 4. المتجر (مقفول) -->
        <div class="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-white/90 dark:bg-[#1F1A16] border-2 border-brand-peachBorder/70 dark:border-[#3A3027] shadow-sm mb-5">
          
          <!-- 1. التزاوج -->
          <button
            data-saved-tab="mating"
            type="button"
            class="saved-tab-btn py-2.5 px-1 rounded-xl text-xs sm:text-sm font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer font-baloo ${
              activeSubTab === 'mating'
                ? 'bg-brand-orange text-white shadow-soft'
                : 'text-brand-dark/75 dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
            }"
          >
            <span>التزاوج</span>
            <span class="text-[10px] opacity-80">(${matingSaved.length})</span>
          </button>

          <!-- 2. التبني -->
          <button
            data-saved-tab="adoption"
            type="button"
            class="saved-tab-btn py-2.5 px-1 rounded-xl text-xs sm:text-sm font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer font-baloo ${
              activeSubTab === 'adoption'
                ? 'bg-brand-orange text-white shadow-soft'
                : 'text-brand-dark/75 dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
            }"
          >
            <span>التبني</span>
            <span class="text-[10px] opacity-80">(${adoptionSaved.length})</span>
          </button>

          <!-- 3. العيادات (مقفول) -->
          <button
            data-saved-tab="clinics"
            type="button"
            class="saved-tab-btn py-2.5 px-1 rounded-xl text-xs sm:text-sm font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer font-baloo opacity-85 ${
              activeSubTab === 'clinics'
                ? 'bg-brand-orange text-white shadow-soft'
                : 'text-brand-dark/75 dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
            }"
          >
            <span>العيادات</span>
            <span class="text-[10px] text-amber-500 font-bold">🔒</span>
          </button>

          <!-- 4. المتجر (مقفول) -->
          <button
            data-saved-tab="store"
            type="button"
            class="saved-tab-btn py-2.5 px-1 rounded-xl text-xs sm:text-sm font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer font-baloo opacity-85 ${
              activeSubTab === 'store'
                ? 'bg-brand-orange text-white shadow-soft'
                : 'text-brand-dark/75 dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
            }"
          >
            <span>المتجر</span>
            <span class="text-[10px] text-amber-500 font-bold">🔒</span>
          </button>

        </div>

        <!-- Tab Body Content -->
        ${
          activeSubTab === 'mating'
            ? renderSavedPetsList(matingSaved, 'mating')
            : activeSubTab === 'adoption'
            ? renderSavedPetsList(adoptionSaved, 'adoption')
            : activeSubTab === 'clinics'
            ? `
            <div class="bg-white/80 dark:bg-[#1F1A16] border-2 border-brand-peachBorder dark:border-[#3A3027] rounded-3xl p-8 text-center space-y-4 shadow-card">
              <div class="w-20 h-20 rounded-3xl bg-amber-500/15 border-2 border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto text-3xl shadow-soft">
                <i class="fa-solid fa-lock"></i>
              </div>
              <h3 class="text-xl font-black text-brand-dark dark:text-white">قسم عيادات المحفوظات مقفول حالياً</h3>
              <p class="text-sm font-semibold text-brand-subtleGray dark:text-[#A89F91] max-w-xs mx-auto leading-relaxed">
                هذا القسم مخصص لحفظ العيادات البيطرية والمستشفيات المفضلة لديك وسيتوفر فور تدشين شبكة العيادات في التحديث القادم.
              </p>
              <span class="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-500 text-xs font-black">
                مقفول • قريباً
              </span>
            </div>
            `
            : `
            <div class="bg-white/80 dark:bg-[#1F1A16] border-2 border-brand-peachBorder dark:border-[#3A3027] rounded-3xl p-8 text-center space-y-4 shadow-card">
              <div class="w-20 h-20 rounded-3xl bg-amber-500/15 border-2 border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto text-3xl shadow-soft">
                <i class="fa-solid fa-lock"></i>
              </div>
              <h3 class="text-xl font-black text-brand-dark dark:text-white">قسم متجر المحفوظات مقفول حالياً</h3>
              <p class="text-sm font-semibold text-brand-subtleGray dark:text-[#A89F91] max-w-xs mx-auto leading-relaxed">
                هذا القسم مخصص لحفظ المنتجات ومستلزمات الحيوانات الأليفة المفضلة لديك وسيتوفر فور إطلاق متجر Meow الرسمي.
              </p>
              <span class="inline-block px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-500 text-xs font-black">
                مقفول • قريباً
              </span>
            </div>
            `
        }

      </div>
    </div>
  `;
}

function renderSavedPetsList(pets: Pet[], type: 'mating' | 'adoption'): string {
  if (pets.length === 0) {
    return `
      <div class="bg-white/70 dark:bg-[#1F1A16] border-2 border-brand-peachBorder dark:border-[#3A3027] rounded-3xl p-8 text-center space-y-4 shadow-card">
        <div class="w-20 h-20 rounded-3xl bg-red-500/15 border-2 border-red-500/30 text-red-500 flex items-center justify-center mx-auto text-3xl shadow-soft">
          <i class="fa-regular fa-heart"></i>
        </div>
        <h3 class="text-xl font-black text-brand-dark dark:text-white">لا توجد حيوانات محفوظة في قسم ${type === 'mating' ? 'التزاوج' : 'التبني'}</h3>
        <p class="text-sm font-semibold text-brand-subtleGray dark:text-[#A89F91] max-w-xs mx-auto leading-relaxed">
          اضغط على علامة القلب ❤️ الموجودة على أي بطاقة حيوان لحفظها والرجوع إليها بسهولة في أي وقت!
        </p>
        <button
          type="button"
          id="go-browse-saved-btn"
          class="px-6 py-2.5 rounded-full bg-brand-orange text-white text-xs sm:text-sm font-black shadow-soft hover:bg-brand-orangeHover transition-all cursor-pointer font-baloo active:scale-95"
        >
          تصفح ${type === 'mating' ? 'حيوانات التزاوج' : 'حيوانات التبني'} الآن
        </button>
      </div>
    `;
  }

  const currentUserId = state.getUser().id;

  return `
    <div class="grid grid-cols-2 gap-3 sm:gap-4 min-w-0">
      ${pets
        .map((pet) => {
          const isGroup = pet.status === 'adoption' && pet.adoptionType === 'group';
          const members = isGroup ? pet.groupMembers || [] : [];
          const groupCount = pet.groupCount || members.length || 2;
          const memberThumbs = members
            .map((m) => sanitizeImageSrc(m.individualPhotos?.[0] || ''))
            .filter(Boolean);
          const safePetPhoto = sanitizeImageSrc(pet.photos[0]);

          if (isGroup) {
            return `
              <div
                class="bg-white dark:bg-[#1F1A16] rounded-3xl border-2 border-brand-peachBorder dark:border-[#3A3027] shadow-card hover:shadow-soft transition-all duration-300 relative group flex flex-col cursor-pointer saved-pet-card min-w-0"
                data-pet-detail-id="${escapeAttr(pet.id)}"
              >
                <div class="relative w-full aspect-[4/4.2] rounded-t-3xl bg-brand-peachBorder/30 dark:bg-[#241E1A]">
                  <div class="absolute inset-0 overflow-hidden rounded-t-3xl">
                    <img
                      src="${escapeAttr(memberThumbs[0] || safePetPhoto)}"
                      alt="${escapeAttr(pet.name)}"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent pointer-events-none"></div>
                  </div>

                  <div class="absolute top-2 left-2 flex items-center gap-1.5 z-30">
                    <button
                      type="button"
                      aria-label="إزالة من المحفوظات"
                      class="remove-saved-pet-btn w-9 h-9 rounded-full bg-black/55 backdrop-blur-md text-red-500 flex items-center justify-center hover:bg-black/75 transition-all cursor-pointer active:scale-90 shadow-md"
                      data-pet-save-id="${escapeAttr(pet.id)}"
                      title="إزالة من المحفوظات"
                    >
                      <i class="fa-solid fa-heart text-sm"></i>
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
                              'w-9 h-9 rounded-full bg-black/55 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/75 transition-all cursor-pointer active:scale-90 shadow-md',
                            dropdownAlign: 'left',
                          })
                        : ''
                    }
                  </div>

                  <div class="absolute top-2.5 right-2.5 bg-brand-orange text-white px-3 py-1 rounded-full text-[11px] font-black shadow-sm font-baloo pointer-events-none z-20">
                    <span>تبني جماعي (${groupCount})</span>
                  </div>

                  <div class="absolute bottom-2 inset-x-2 flex items-center justify-between gap-1 pointer-events-none z-10">
                    <div class="flex items-center -space-x-2 space-x-reverse">
                      ${memberThumbs
                        .slice(0, 4)
                        .map(
                          (src) =>
                            `<img src="${escapeAttr(src)}" alt="${escapeAttr(pet.name)}" class="w-6 h-6 rounded-full object-cover border border-white shadow-sm" />`
                        )
                        .join('')}
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                      pet.mustAdoptTogether ? 'bg-brand-orange text-white' : 'bg-white/95 text-emerald-700'
                    }">
                      ${pet.mustAdoptTogether ? 'معاً فقط' : 'منفرداً متاح'}
                    </span>
                  </div>
                </div>

                <div class="p-3 text-right flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <h4 class="text-sm sm:text-base font-black text-brand-dark dark:text-white truncate font-baloo leading-tight">
                      ${escapeHtml(pet.name)}
                    </h4>
                    <p class="text-[11px] font-bold text-brand-orange truncate mt-0.5">
                      ${escapeHtml(members.length > 0 ? members.map((m) => m.name).join(' • ') : pet.breed)}
                    </p>
                    <p class="text-[10px] font-semibold text-brand-subtleGray truncate mt-0.5">
                      📍 ${escapeHtml(pet.area)}، ${escapeHtml(pet.city)}
                    </p>
                  </div>
                </div>
              </div>
            `;
          }

          return `
            <div
              class="bg-white dark:bg-[#1F1A16] rounded-3xl border-2 border-brand-peachBorder dark:border-[#3A3027] shadow-card hover:shadow-soft transition-all duration-300 relative group flex flex-col cursor-pointer saved-pet-card min-w-0"
              data-pet-detail-id="${escapeAttr(pet.id)}"
            >
              <!-- Pet Photo & Save Heart Button -->
              <div class="relative w-full aspect-[4/4.2] rounded-t-3xl bg-brand-peachBorder/30 dark:bg-[#241E1A]">
                <div class="absolute inset-0 overflow-hidden rounded-t-3xl">
                  <img
                    src="${escapeAttr(safePetPhoto)}"
                    alt="${escapeAttr(pet.name)}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <!-- Top-left actions: Heart Remove + 3-Dots Menu -->
                <div class="absolute top-2 left-2 flex items-center gap-1.5 z-30">
                  <button
                    type="button"
                    aria-label="إزالة من المحفوظات"
                    class="remove-saved-pet-btn w-9 h-9 rounded-full bg-black/55 backdrop-blur-md text-red-500 flex items-center justify-center hover:bg-black/75 transition-all cursor-pointer active:scale-90 shadow-md"
                    data-pet-save-id="${escapeAttr(pet.id)}"
                    title="إزالة من المحفوظات"
                  >
                    <i class="fa-solid fa-heart text-sm"></i>
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
                            'w-9 h-9 rounded-full bg-black/55 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/75 transition-all cursor-pointer active:scale-90 shadow-md',
                          dropdownAlign: 'left',
                        })
                      : ''
                  }
                </div>

                <!-- Status Badge (No star) -->
                <div class="absolute top-2.5 right-2.5 bg-brand-orange text-white px-3.5 py-1 rounded-full text-xs font-black shadow-sm font-baloo pointer-events-none z-20">
                  <span>${pet.status === 'mating' ? 'للزواج' : 'للتبني'}</span>
                </div>
              </div>

              <!-- Pet Info Block -->
              <div class="p-3 text-right flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <h4 class="text-base sm:text-lg font-black text-brand-dark dark:text-white truncate font-baloo leading-tight">
                    ${escapeHtml(pet.name)}, ${pet.ageYears}
                  </h4>
                  <p class="text-xs font-bold text-brand-subtleGray dark:text-[#A89F91] truncate mt-0.5">
                    ${escapeHtml(pet.breed)}
                  </p>
                  <p class="text-[11px] font-semibold text-brand-orange truncate mt-0.5">
                    ${escapeHtml(pet.area)}، ${escapeHtml(pet.city)}
                  </p>
                </div>
              </div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

export function attachSavedPetsEvents(): void {
  const closeBtn = document.getElementById('close-saved-pets-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      state.closeSavedPetsView();
    });
  }

  // Sub-tabs switcher
  const tabBtns = document.querySelectorAll<HTMLButtonElement>('.saved-tab-btn');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-saved-tab') as any;
      if (tab) {
        state.setSavedPetsSubTab(tab);
      }
    });
  });

  // Remove pet from saved button
  const removeBtns = document.querySelectorAll<HTMLButtonElement>('.remove-saved-pet-btn');
  removeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const petId = btn.getAttribute('data-pet-save-id');
      if (petId) {
        state.toggleSavePet(petId);
      }
    });
  });

  // Open pet details
  const cards = document.querySelectorAll<HTMLElement>('.saved-pet-card');
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // Do not trigger pet detail if user clicked the remove heart button or 3-dots menu
      if ((e.target as HTMLElement).closest('.remove-saved-pet-btn, .meow-more-menu-container')) {
        return;
      }
      const petId = card.getAttribute('data-pet-detail-id');
      const pet =
        state.getAllPets().find((p) => p.id === petId) ||
        state.getSavedPets().find((p) => p.id === petId);
      if (pet) {
        state.setSelectedPetForDetail(pet);
      }
    });
  });

  // Go browse button
  const browseBtn = document.getElementById('go-browse-saved-btn');
  if (browseBtn) {
    browseBtn.addEventListener('click', () => {
      const currentSubTab = state.getSavedPetsSubTab();
      state.closeSavedPetsView();
      state.setCurrentTab(currentSubTab === 'adoption' ? 'adoption' : 'mating');
    });
  }
}
