import { state } from '../../state.ts';
import {
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
} from '../../services/notificationService.ts';
import { AppNotification } from '../../types.ts';

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
      class="fixed inset-0 z-[85] bg-black/55 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      dir="rtl"
    >
      <div class="w-full max-w-md bg-[#FFF9E9] rounded-t-[36px] sm:rounded-[36px] border-t-2 sm:border-2 border-brand-peachBorder shadow-2xl max-h-[85dvh] flex flex-col overflow-hidden animate-slide-up">
        <!-- Header -->
        <header class="shrink-0 px-5 pt-5 pb-4 bg-white/95 border-b border-brand-peachBorder/80 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-11 h-11 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center text-lg border border-brand-orange/25 shrink-0">
              <i class="fa-solid fa-bell"></i>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h2 class="text-lg font-black font-baloo text-brand-dark m-0">الإشعارات</h2>
                ${
                  unreadCount > 0
                    ? `<span class="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[11px] font-black font-mono">${unreadCount}</span>`
                    : ''
                }
              </div>
              <p class="text-[11px] font-bold text-brand-subtleGray m-0">تحديثات الطلبات والمحادثات والتنبيهات</p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            ${
              unreadCount > 0
                ? `
                  <button
                    id="mark-all-notifications-read-btn"
                    type="button"
                    class="h-9 px-3.5 rounded-full bg-brand-orange/10 hover:bg-brand-orange text-brand-orange hover:text-white text-[11px] font-black transition cursor-pointer font-baloo"
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

        <!-- Browser / Device Notification Permission Banner -->
        ${
          notificationsEnabled && browserPerm === 'default'
            ? `
              <div class="shrink-0 mx-4 mt-3 p-3.5 rounded-[26px] bg-white border-2 border-brand-orange/35 flex items-center justify-between gap-3 shadow-2xs">
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
        <div class="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 overscroll-contain">
          ${
            notifications.length === 0
              ? `
                <div class="bg-white/90 border-2 border-brand-peachBorder rounded-[30px] p-8 text-center space-y-3 shadow-xs">
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
                      <button
                        type="button"
                        data-notification-id="${notif.id}"
                        class="notification-item-btn w-full text-right p-3.5 rounded-[28px] border-2 transition-all flex items-start gap-3 cursor-pointer active:scale-[0.99] ${
                          notif.read
                            ? 'bg-white/85 border-brand-peachBorder/80 hover:border-brand-orange/50'
                            : 'bg-white border-brand-orange/70 shadow-sm'
                        }"
                      >
                        <span class="w-11 h-11 rounded-full border flex items-center justify-center text-base shrink-0 ${style.badgeClass}">
                          <i class="${style.icon}"></i>
                        </span>

                        <div class="flex-1 min-w-0">
                          <div class="flex items-center justify-between gap-2">
                            <h4 class="text-xs sm:text-sm font-black font-baloo text-brand-dark truncate m-0">
                              ${notif.title}
                            </h4>
                            <div class="flex items-center gap-1.5 shrink-0">
                              <span class="text-[10px] font-bold text-brand-subtleGray">${notif.timestampLabel}</span>
                              ${
                                !notif.read
                                  ? `<span class="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" title="غير مقروء"></span>`
                                  : ''
                              }
                            </div>
                          </div>
                          <p class="text-xs font-semibold text-brand-dark/85 mt-1 mb-0 leading-relaxed line-clamp-2">
                            ${notif.body}
                          </p>
                        </div>
                      </button>
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
  const closeBtn = document.getElementById('close-notifications-modal-btn');
  const markAllBtn = document.getElementById('mark-all-notifications-read-btn');
  const enableBrowserBtn = document.getElementById('enable-browser-notifications-btn');

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

  document.querySelectorAll<HTMLButtonElement>('.notification-item-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-notification-id');
      if (id) {
        state.openNotification(id);
      }
    });
  });
}
