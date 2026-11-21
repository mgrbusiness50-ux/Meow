import { state } from '../../state.ts';

export const MEOW_LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAY6QJL7JKltHBT26Mu5KNgb6l2xOIOIxLco06CS0t_ZH2zdMUUy9UMf7RAzLI1gylCQjTd5f2uzeczaNLfb3SHkpCIEmQOqhUzf-HXWv9o8GLI4h79IX2hdBoWsZ_PqeGD1iL7-0F0ORVYN1Ft3sQywD_LcaiBkAV7-38J1wRwjfbzRneDBSOjHhLFX9vgoI7TDFiUrcCCMr_3r6FBg6lYdrHFVSA2gYQTefyVuIHC3CG9epzhruHRcfmo9yr_3SwC';

let viewMode: 'grid' | 'list' = 'grid';
let isDrawerOpen = false;

export function getViewMode(): 'grid' | 'list' {
  return viewMode;
}

export function setViewMode(mode: 'grid' | 'list') {
  viewMode = mode;
}

export function renderHeader(): string {
  const user = state.getUser();
  const currentTab = state.getCurrentTab();
  const isBrowseTab = currentTab === 'mating' || currentTab === 'adoption';
  const filterState = currentTab === 'mating' ? state.getMatingFilters() : state.getAdoptionFilters();
  const selectedSpecies = filterState.species || 'all';
  const unreadNotificationsCount = state.getUnreadNotificationsCount();

  const bellButtonHtml = `
    <button
      id="header-notifications-btn"
      aria-label="الإشعارات"
      class="relative w-11 h-11 rounded-full bg-white/95 dark:bg-[#342A24] border-2 border-brand-peachBorder/80 dark:border-warm-darkBorder text-brand-dark dark:text-white flex items-center justify-center shadow-sm hover:border-brand-orange hover:text-brand-orange transition-all cursor-pointer active:scale-95 shrink-0"
      type="button"
      title="الإشعارات"
    >
      <span class="material-symbols-outlined text-2xl">notifications</span>
      ${
        unreadNotificationsCount > 0
          ? `<span class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-sm border-2 border-[#FFF9E9]">${
              unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount
            }</span>`
          : ''
      }
    </button>
  `;

  return `
    <header class="sticky top-0 z-40 w-full bg-[#FFF9E9]/95 dark:bg-[#27201B]/95 backdrop-blur-md border-b border-brand-peachBorder/40 dark:border-warm-darkBorder shadow-sm" id="main-header">
      <div class="max-w-md mx-auto px-3.5 min-[360px]:px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 flex flex-col gap-3">
        
        <!-- Row 1: Review/View Switcher + Notifications Bell & Meow Logo -->
        <div class="flex items-center justify-between w-full gap-2 min-w-0">
          
          <!-- One side (Right in RTL): View Switcher / Settings + Notifications Bell -->
          <div class="flex items-center gap-2 shrink-0">
            ${
              isBrowseTab
                ? `
                <div class="bg-white/95 dark:bg-[#342A24] border-2 border-brand-peachBorder/80 dark:border-warm-darkBorder p-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm" id="view-switcher">
                  <button
                    aria-label="عرض شبكي"
                    class="h-10 w-10 rounded-xl ${
                      viewMode === 'grid' ? 'bg-brand-orange text-white shadow-soft' : 'text-brand-dark/70 dark:text-[#D1C7BD] hover:bg-white/70 dark:hover:bg-[#3D312A]'
                    } flex items-center justify-center transition-all cursor-pointer"
                    id="btn-grid-view"
                    type="button"
                    title="عرض شبكي"
                  >
                    <i class="fa-solid fa-table-cells-large text-base"></i>
                  </button>
                  <button
                    aria-label="عرض قائمة"
                    class="h-10 w-10 rounded-xl ${
                      viewMode === 'list' ? 'bg-brand-orange text-white shadow-soft' : 'text-brand-dark/70 dark:text-[#D1C7BD] hover:bg-white/70 dark:hover:bg-[#3D312A]'
                    } flex items-center justify-center transition-all cursor-pointer"
                    id="btn-list-view"
                    type="button"
                    title="عرض قائمة"
                  >
                    <i class="fa-solid fa-list-ul text-base"></i>
                  </button>
                </div>
                ${bellButtonHtml}
                `
                : currentTab === 'profile'
                ? `
                <button
                  id="profile-menu-dots-btn"
                  aria-label="الإعدادات"
                  class="w-11 h-11 rounded-full bg-white/95 dark:bg-[#342A24] border-2 border-brand-peachBorder/80 dark:border-warm-darkBorder text-warm-text dark:text-white flex items-center justify-center shadow-sm hover:border-brand-orange hover:text-brand-orange transition-all cursor-pointer active:scale-95"
                  type="button"
                  title="الإعدادات"
                >
                  <span class="material-symbols-outlined text-2xl">settings</span>
                </button>
                ${bellButtonHtml}
                `
                : bellButtonHtml
            }
          </div>

          <!-- Opposite side (Left in RTL): Brand Logo - Noticeably Enlarged -->
          <div class="cursor-pointer flex items-center transition-transform active:scale-95 shrink-0" id="header-logo-container">
            <img
              alt="Meow Brand Logo"
              class="h-16 min-[360px]:h-20 sm:h-[84px] w-auto object-contain drop-shadow-md"
              src="${MEOW_LOGO_URL}"
            />
          </div>

        </div>

        <!-- Row 2: Filter Button (icon only) & Category Pills: 1. الكل, 2. قطط, 3. كلاب -->
        ${
          isBrowseTab
            ? `
            <div class="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5" data-no-ptr="true">
              <!-- Filter Button: ONLY filter icon in square box, no text -->
              <div class="relative shrink-0">
                <button
                  aria-label="تصفية"
                  class="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl border-2 border-brand-peachBorder dark:border-warm-darkBorder bg-white dark:bg-[#342A24] flex items-center justify-center text-brand-orange font-bold shadow-sm transition hover:bg-brand-peachBorder/20 dark:hover:bg-[#3D312A] cursor-pointer"
                  id="filter-toggle-btn"
                  type="button"
                  title="تصفية وفلاتر"
                >
                  <i class="fa-solid fa-sliders text-xl"></i>
                </button>
              </div>

              <!-- 1. Category: All (الكل) - الأول دائماً -->
              <button
                data-species-tab="all"
                class="category-species-btn h-11 sm:h-12 px-4 sm:px-6 rounded-2xl ${
                  selectedSpecies === 'all'
                    ? 'bg-brand-orange text-white font-black shadow-soft border-2 border-brand-orange'
                    : 'bg-white dark:bg-[#342A24] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark dark:text-[#D1C7BD] font-black hover:bg-white/80 dark:hover:bg-[#3D312A]'
                } text-sm sm:text-base flex items-center justify-center shrink-0 transition-all cursor-pointer font-baloo"
                type="button"
              >
                <span>الكل</span>
              </button>

              <!-- 2. Category: Cats (قطط) - الثاني -->
              <button
                data-species-tab="cat"
                class="category-species-btn h-11 sm:h-12 px-4 sm:px-6 rounded-2xl ${
                  selectedSpecies === 'cat'
                    ? 'bg-brand-orange text-white font-black shadow-soft border-2 border-brand-orange'
                    : 'bg-white dark:bg-[#342A24] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark dark:text-[#D1C7BD] font-black hover:bg-white/80 dark:hover:bg-[#3D312A]'
                } text-sm sm:text-base flex items-center justify-center shrink-0 transition-all cursor-pointer font-baloo"
                type="button"
              >
                <span>قطط</span>
              </button>

              <!-- 3. Category: Dogs (كلاب) - الثالث -->
              <button
                data-species-tab="dog"
                class="category-species-btn h-11 sm:h-12 px-4 sm:px-6 rounded-2xl ${
                  selectedSpecies === 'dog'
                    ? 'bg-brand-orange text-white font-black shadow-soft border-2 border-brand-orange'
                    : 'bg-white dark:bg-[#342A24] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark dark:text-[#D1C7BD] font-black hover:bg-white/80 dark:hover:bg-[#3D312A]'
                } text-sm sm:text-base flex items-center justify-center shrink-0 transition-all cursor-pointer font-baloo"
                type="button"
              >
                <span>كلاب</span>
              </button>
            </div>
            `
            : ''
        }

      </div>
    </header>
  `;
}

export function attachHeaderEvents(): void {
  // Logo click -> go to mating
  const logo = document.getElementById('header-logo-container');
  if (logo) {
    logo.addEventListener('click', () => {
      state.setCurrentTab('mating');
    });
  }

  // Grid/List View Switcher
  const btnGrid = document.getElementById('btn-grid-view');
  const btnList = document.getElementById('btn-list-view');

  if (btnGrid) {
    btnGrid.addEventListener('click', () => {
      viewMode = 'grid';
      state.setCurrentTab(state.getCurrentTab());
    });
  }

  if (btnList) {
    btnList.addEventListener('click', () => {
      viewMode = 'list';
      state.setCurrentTab(state.getCurrentTab());
    });
  }

  // Filter Toggle Button -> Open Modern Filter Modal
  const filterBtn = document.getElementById('filter-toggle-btn');
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      state.setFilterModalOpen(true);
    });
  }

  // Notifications Bell Button -> Open Notification Center
  const notifBtn = document.getElementById('header-notifications-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      state.setNotificationsOpen(true);
    });
  }

  // Category Species Pills
  const speciesBtns = document.querySelectorAll<HTMLButtonElement>('.category-species-btn');
  speciesBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const sp = btn.getAttribute('data-species-tab') as any;
      const currentTab = state.getCurrentTab();
      if (currentTab === 'mating') {
        state.setMatingFilters({ species: sp });
      } else if (currentTab === 'adoption') {
        state.setAdoptionFilters({ species: sp });
      }
    });
  });
}


