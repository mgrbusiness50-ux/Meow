import { state } from '../../state.ts';
import {
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
} from '../../services/notificationService.ts';
import { AppNotification } from '../../types.ts';
import { escapeAttr, escapeHtml } from '../../utils/sanitize.ts';
import {
  attachSheetDragToDismiss,
  attachSwipeToDismissList,
  showMobileToast,
} from '../../utils/touchGestures.ts';

function getNotificationStyle(type: AppNotification['type']): {
  icon: string;
  badgeClass: string;
} {
  switch (type) {
    case 'mating_approved':
      return {
        icon: 'fa-solid fa-heart',
        badgeClass: 'bg-brand-orange/15 text-brand-orange border-brand-orange/30',
      };
    case 'adoption_approved':
      return {
        icon: 'fa-solid fa-house-circle-check',
        badgeClass: 'bg-emerald-500/15 text-emerald-600 border-emerald-200',
      };
    case 'contact_request':
      return {
        icon: 'fa-solid fa-paw',
        badgeClass: 'bg-amber-500/15 text-amber-700 border-amber-200',
      };
    case 'new_message':
      return {
        icon: 'fa-solid fa-comment-dots',
        badgeClass: 'bg-sky-500/15 text-sky-600 border-sky-200',
      };
    default:
      return {
        icon: 'fa-solid fa-bell',
        badgeClass: 'bg-brand-orange/15 text-brand-orange border-brand-peachBorder',
      };
  }
}

export function renderNotificationsModal(): string {
  if (!state.isNotificationsOpen()) return '';

  const notifications = state.getNotifications();
  const unreadCount = state.getUnreadNotificationsCount();
  const browserPerm = getBrowserNotificationPermission();
  const notificationsEnabled = state.getNotificationsEnabled();

  return `
    <div
      id="notifications-modal-backdrop"
      class="fixed inset-0 z-[85] bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      dir="rtl"
    >
      <div
        id="notifications-sheet-panel"
        class="w-full max-w-md bg-[#FFF9E9] rounded-t-[36px] sm:rounded-[36px] border-t-2 sm:border-2 border-brand-peachBorder shadow-2xl max-h-[88dvh] flex flex-col overflow-hidden animate-slide-up pb-[env(safe-area-inset-bottom)]"
      >
        <!-- Drag Handle & Header -->
        <div id="notifications-drag-handle" class="shrink-0 bg-white/95 border-b border-brand-peachBorder/80">
          <div class="sm:hidden pt-2.5 pb-1 flex justify-center">
            <span class="w-12 h-1.5 rounded-full bg-brand-peachBorder"></span>
          </div>
          <header class="px-4 sm:px-5 pt-2.5 sm:pt-5 pb-3.5 sm:pb-4 flex items-center justify-between gap-2.5">
            <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center text-base sm:text-lg border border-brand-orange/25 shrink-0">
                <i class="fa-solid fa-bell"></i>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h2 class="text-base sm:text-lg font-black font-baloo text-brand-dark m-0">الإشعارات</h2>
                  ${
                    unreadCount > 0
                      ? `<span class="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[11px] font-black font-mono">${unreadCount}</span>`
                      : ''
                  }
                </div>
                <p class="text-[11px] font-bold text-brand-subtleGray m-0 truncate">اسحب الإشعار يميناً أو يساراً لحذفه أو اضغط ×</p>
              </div>
            </div>

            <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
              ${
                unreadCount > 0
                  ? `
                    <button
                      id="mark-all-notifications-read-btn"
                      type="button"
                      class="h-10 px-3 sm:px-3.5 rounded-full bg-brand-orange/10 hover:bg-brand-orange text-brand-orange hover:text-white text-[11px] font-black transition cursor-pointer font-baloo whitespace-nowrap"
                    >
                      قراءة الكل ✓
                    </button>
                  `
                  : ''
              }
              <button
                id="close-notifications-modal-btn"
                type="button"
                aria-label="إغلاق الإشعارات"
                class="w-10 h-10 rounded-full bg-[#FFF5EA] border border-brand-peachBorder text-brand-dark hover:bg-brand-orange hover:text-white flex items-center justify-center transition active:scale-90 cursor-pointer"
              >
                <i class="fa-solid fa-xmark text-base"></i>
              </button>
            </div>
          </header>
        </div>

        <!-- Browser / Device Notification Permission Banner -->
        ${
          notificationsEnabled && browserPerm === 'default'
            ? `
              <div class="shrink-0 mx-4 mt-3 p-3.5 rounded-[26px] bg-white border-2 border-brand-orange/35 flex items-center justify-between gap-3 shadow-sm">
                <div class="min-w-0">
                  <p class="text-xs font-black text-brand-dark font-baloo m-0">تفعيل تنبيهات الجهاز</p>
                  <p class="text-[11px] font-bold text-brand-subtleGray m-0 mt-0.5">اسمح بالإشعارات لتصلك تنبيهات الموافقة والرسائل فوراً.</p>
                </div>
                <button
                  id="enable-browser-notifications-btn"
                  type="button"
                  class="h-10 px-4 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white text-xs font-black shrink-0 shadow-soft transition active:scale-95 cursor-pointer font-baloo"
                >
                  تفعيل
                </button>
              </div>
            `
            : ''
        }

        <!-- Notifications List -->
        <div
          id="notifications-list-scroll"
          class="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 overscroll-contain"
        >
          ${
            notifications.length === 0
              ? `
                <div class="bg-white/90 border-2 border-brand-peachBorder rounded-[30px] p-8 text-center space-y-3 shadow-sm">
                  <div class="w-16 h-16 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center mx-auto text-2xl">
                    <i class="fa-regular fa-bell"></i>
                  </div>
                  <h3 class="text-base font-black font-baloo text-brand-dark m-0">لا توجد إشعارات حالياً</h3>
                  <p class="text-xs font-bold text-brand-subtleGray m-0 leading-relaxed">
                    ستظهر هنا تنبيهات طلبات التزاوج والتبني والرسائل الجديدة فور وصولها.
                  </p>
                </div>
              `
              : notifications
                  .map((notif) => {
                    const style = getNotificationStyle(notif.type);
                    return `
                      <div
                        class="notif-swipe-item relative overflow-hidden rounded-[28px]"
                        data-notification-id="${escapeAttr(notif.id)}"
                      >
                        <div
                          class="absolute inset-0 bg-gradient-to-l from-red-500 to-rose-600 text-white px-5 flex items-center justify-between pointer-events-none select-none"
                          aria-hidden="true"
                        >
                          <span class="inline-flex items-center gap-1.5 text-xs font-black font-baloo">
                            <i class="fa-solid fa-trash-can text-sm"></i>
                            حذف
                          </span>
                          <span class="inline-flex items-center gap-1.5 text-xs font-black font-baloo">
                            حذف
                            <i class="fa-solid fa-trash-can text-sm"></i>
                          </span>
                        </div>

                        <div
                          data-notification-id="${escapeAttr(notif.id)}"
                          class="notif-swipe-card no-active-scale relative w-full text-right p-3.5 rounded-[28px] border-2 flex items-start gap-2.5 touch-pan-y select-none ${
                            notif.read
                              ? 'bg-white border-brand-peachBorder/85 hover:border-brand-orange/50'
                              : 'bg-white border-brand-orange/75 shadow-sm'
                          }"
                        >
                          <div
                            role="button"
                            tabindex="0"
                            data-open-notification-id="${escapeAttr(notif.id)}"
                            class="notification-open-area flex-1 min-w-0 flex items-start gap-3 cursor-pointer"
                          >
                            <span class="w-11 h-11 rounded-full border flex items-center justify-center text-base shrink-0 ${style.badgeClass}">
                              <i class="${style.icon}"></i>
                            </span>

                            <div class="flex-1 min-w-0">
                              <div class="flex items-center justify-between gap-2">
                                <h4 class="text-xs sm:text-sm font-black font-baloo text-brand-dark truncate m-0">
                                  ${escapeHtml(notif.title)}
                                </h4>
                                <div class="flex items-center gap-1.5 shrink-0">
                                  <span class="text-[10px] font-bold text-brand-subtleGray">${escapeHtml(notif.timestampLabel)}</span>
                                  ${
                                    !notif.read
                                      ? `<span class="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" title="غير مقروء"></span>`
                                      : ''
                                  }
                                </div>
                              </div>
                              <p class="text-xs font-semibold text-brand-dark/85 mt-1 mb-0 leading-relaxed line-clamp-2">
                                ${escapeHtml(notif.body)}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            data-delete-notification-id="${escapeAttr(notif.id)}"
                            aria-label="حذف الإشعار"
                            title="حذف الإشعار"
                            class="delete-notification-btn w-10 h-10 -my-1 -ml-1 rounded-full bg-brand-cream/90 hover:bg-red-50 border border-brand-peachBorder text-brand-subtleGray hover:text-red-600 flex items-center justify-center shrink-0 transition active:scale-90 cursor-pointer"
                          >
                            <i class="fa-solid fa-xmark text-sm pointer-events-none"></i>
                          </button>
                        </div>
                      </div>
                    `;
                  })
                  .join('')
          }
        </div>
      </div>
    </div>
  `;
}

export function attachNotificationsModalEvents(): void {
  const backdrop = document.getElementById('notifications-modal-backdrop');
  const sheetPanel = document.getElementById('notifications-sheet-panel');
  const closeBtn = document.getElementById('close-notifications-modal-btn');
  const markAllBtn = document.getElementById('mark-all-notifications-read-btn');
  const enableBrowserBtn = document.getElementById('enable-browser-notifications-btn');
  const listContainer = document.getElementById('notifications-list-scroll');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      state.setNotificationsOpen(false);
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        state.setNotificationsOpen(false);
      }
    });
  }

  attachSheetDragToDismiss(sheetPanel, {
    backdropEl: backdrop,
    handleSelector: '#notifications-drag-handle',
    scrollContainerSelector: '#notifications-list-scroll',
    onClose: () => state.setNotificationsOpen(false),
  });

  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      state.markAllNotificationsRead();
    });
  }

  if (enableBrowserBtn) {
    enableBrowserBtn.addEventListener('click', () => {
      void requestBrowserNotificationPermission().then(() => {
        state.setNotificationsOpen(true);
      });
    });
  }

  document.querySelectorAll<HTMLElement>('.notification-open-area').forEach((area) => {
    const open = () => {
      const id = area.getAttribute('data-open-notification-id');
      if (id) state.openNotification(id);
    };
    area.addEventListener('click', open);
    area.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.delete-notification-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-delete-notification-id');
      if (!id) return;
      const itemEl = btn.closest('.notif-swipe-item') as HTMLElement | null;
      const cardEl = btn.closest('.notif-swipe-card') as HTMLElement | null;
      if (itemEl && cardEl) {
        const startHeight = itemEl.offsetHeight;
        itemEl.style.maxHeight = `${startHeight}px`;
        itemEl.style.overflow = 'hidden';
        cardEl.style.transition = 'transform 170ms ease-in, opacity 170ms ease-in';
        cardEl.style.transform = 'translate3d(110%, 0, 0)';
        cardEl.style.opacity = '0';
        window.setTimeout(() => {
          itemEl.style.transition = 'max-height 150ms ease, margin 150ms ease, opacity 130ms ease';
          itemEl.style.maxHeight = '0px';
          itemEl.style.marginBottom = '0px';
          itemEl.style.opacity = '0';
          window.setTimeout(() => {
            state.dismissNotification(id);
            showMobileToast('تم حذف الإشعار');
          }, 150);
        }, 155);
      } else {
        state.dismissNotification(id);
        showMobileToast('تم حذف الإشعار');
      }
    });
  });

  attachSwipeToDismissList({
    listEl: listContainer,
    itemSelector: '.notif-swipe-item',
    cardSelector: '.notif-swipe-card',
    idAttribute: 'data-notification-id',
    ignoreSelector: '.delete-notification-btn',
    onDismiss: (id) => {
      state.dismissNotification(id);
      showMobileToast('تم حذف الإشعار');
    },
  });
}
