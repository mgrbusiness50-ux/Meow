import { state } from '../../state.ts';
import { MainTab } from '../../types.ts';

export function renderTabBar(): string {
  const currentTab = state.getCurrentTab();
  if (currentTab === 'chat' && state.getActiveConversation()) {
    return '';
  }
  if (state.isSettingsOpen()) {
    return '';
  }
  const pendingRequestsCount = state.getPendingRequestsCount();
  const unreadChatBadgeCount = pendingRequestsCount + state.getUnreadChatMessagesCount();

  const tabs: {
    id: MainTab;
    label: string;
    isLocked?: boolean;
    iconSvg: string;
  }[] = [
    {
      id: 'mating',
      label: 'التزاوج',
      iconSvg: `
        <svg class="w-6 h-6 fill-none stroke-current stroke-2 group-hover:scale-110 transition-transform" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
        </svg>
      `,
    },
    {
      id: 'adoption',
      label: 'التبني',
      iconSvg: `
        <svg class="w-6 h-6 fill-none stroke-current stroke-2 group-hover:scale-110 transition-transform" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5a1 1 0 01-1-1v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"></path>
          <path d="M12 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor" stroke="none"></path>
        </svg>
      `,
    },
    {
      id: 'chat',
      label: 'الرسائل',
      iconSvg: `
        <svg class="w-6 h-6 fill-none stroke-current stroke-2 group-hover:scale-110 transition-transform" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
          <circle cx="8.5" cy="11.5" fill="currentColor" r="1"></circle>
          <circle cx="12" cy="11.5" fill="currentColor" r="1"></circle>
          <circle cx="15.5" cy="11.5" fill="currentColor" r="1"></circle>
        </svg>
      `,
    },
    {
      id: 'clinic',
      label: 'العيادة',
      isLocked: true,
      iconSvg: `
        <svg class="w-6 h-6 fill-none stroke-current stroke-2 group-hover:scale-110 transition-transform" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <rect height="15" rx="3" width="18" x="3" y="6"></rect>
          <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
          <path d="M12 10v7M8.5 13.5h7" stroke-width="2.5"></path>
        </svg>
      `,
    },
    {
      id: 'store',
      label: 'المتجر',
      isLocked: true,
      iconSvg: `
        <svg class="w-6 h-6 fill-none stroke-current stroke-2 group-hover:scale-110 transition-transform" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M3 9l1.5-6h15L21 9M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0M3 9v11a2 2 0 002 2h14a2 2 0 002-2V9"></path>
          <path d="M10 14h4v4h-4z" fill="currentColor" fill-opacity="0.2"></path>
        </svg>
      `,
    },
    {
      id: 'profile',
      label: 'البروفايل',
      iconSvg: `
        <svg class="w-6 h-6 fill-none stroke-current stroke-2 drop-shadow-sm group-hover:scale-110 transition-transform" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M9 6a1.5 1.5 0 013-1.5" stroke-linecap="round"></path>
        </svg>
      `,
    },
  ];

  return `
    <nav aria-label="الشريط السفلي" class="fixed left-0 right-0 max-w-md mx-auto px-2.5 min-[360px]:px-4 sm:px-6 z-50 pointer-events-none" style="bottom: max(0.75rem, env(safe-area-inset-bottom));">
      <div class="bg-white/95 dark:bg-[#27201B]/95 backdrop-blur-md border border-brand-peachBorder dark:border-warm-darkBorder rounded-full py-1.5 sm:py-2 shadow-nav flex items-center pointer-events-auto px-1.5 sm:px-2 justify-between gap-0.5">
        ${tabs
          .map((tab) => {
            const isActive = currentTab === tab.id;
            return `
              <button
                data-tab-id="${tab.id}"
                aria-label="${tab.label}"
                class="tab-btn relative flex items-center justify-center p-0.5 sm:p-1 rounded-full text-brand-subtleGray dark:text-[#A89F91] hover:text-brand-orange transition-all group cursor-pointer min-w-0 shrink"
                type="button"
              >
                <!-- Pending & Unread Badge for Chat -->
                ${
                  tab.id === 'chat' && unreadChatBadgeCount > 0
                    ? `<span class="absolute top-0 right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm z-10 animate-bounce">${unreadChatBadgeCount}</span>`
                    : ''
                }

                <!-- Lock badge for Clinic and Store -->
                ${
                  tab.isLocked
                    ? `<span class="absolute -top-1 right-0.5 px-1 rounded-full bg-brand-cream dark:bg-[#342A24] border border-brand-peachBorder dark:border-warm-darkBorder text-[8px] font-black text-brand-orange leading-tight shadow-sm">قريباً</span>`
                    : ''
                }

                <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-gradient-to-tr from-brand-orange to-brand-accent text-white shadow-soft'
                    : 'hover:bg-brand-peachBorder/20 dark:hover:bg-[#342A24] text-brand-subtleGray dark:text-[#A89F91] hover:text-brand-orange'
                }">
                  ${tab.iconSvg}
                </div>
              </button>
            `;
          })
          .join('')}
      </div>
    </nav>
  `;
}

export function attachTabBarEvents(): void {
  const tabButtons = document.querySelectorAll<HTMLButtonElement>('.tab-btn');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab-id') as MainTab;
      if (tabId) {
        state.setCurrentTab(tabId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}
