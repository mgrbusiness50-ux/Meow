import { AppNotification } from '../types.ts';

let swRegistration: ServiceWorkerRegistration | null = null;
let swListenerAttached = false;

export type BrowserNotificationPermission = NotificationPermission | 'unsupported';

export function getBrowserNotificationPermission(): BrowserNotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function initNotificationService(
  onNotificationClick?: (data: {
    notificationId?: string;
    targetTab?: string;
    targetRequestId?: string;
    targetConversationId?: string;
  }) => void
): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    swRegistration = await navigator.serviceWorker.register('/sw.js');
    if (!swListenerAttached && onNotificationClick) {
      swListenerAttached = true;
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'MEOW_NOTIFICATION_CLICK' && event.data?.payload) {
          onNotificationClick(event.data.payload);
        }
      });
    }
  } catch (err) {
    console.warn('ServiceWorker registration skipped:', err);
  }
}

export async function requestBrowserNotificationPermission(): Promise<BrowserNotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

export async function showSystemNotification(notification: AppNotification): Promise<void> {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const options: NotificationOptions = {
    body: notification.body,
    tag: notification.id,
    dir: 'rtl',
    lang: 'ar',
    data: {
      notificationId: notification.id,
      targetTab: notification.targetTab,
      targetRequestId: notification.targetRequestId,
      targetConversationId: notification.targetConversationId,
    },
  };

  try {
    if (swRegistration && typeof swRegistration.showNotification === 'function') {
      await swRegistration.showNotification(notification.title, options);
      return;
    }
    const nativeNotif = new Notification(notification.title, options);
    nativeNotif.onclick = () => {
      window.focus();
      nativeNotif.close();
      window.dispatchEvent(
        new CustomEvent('meow:open-notification', {
          detail: { notificationId: notification.id },
        })
      );
    };
  } catch (err) {
    console.warn('Browser notification display skipped:', err);
  }
}
