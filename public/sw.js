const SHELL_CACHE_NAME = 'meow-shell-v1';
const CORE_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/meow-logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE_NAME)
      .then((cache) => cache.addAll(CORE_SHELL_URLS).catch(() => {}))
      .finally(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('meow-shell-') && k !== SHELL_CACHE_NAME)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

function shouldBypassCache(url) {
  if (!url) return true;
  if (url.origin !== self.location.origin) return true;
  const path = url.pathname.toLowerCase();
  if (
    path.includes('/updates/') ||
    path.endsWith('ota-manifest.json') ||
    path.endsWith('ota-manifest-testing.json') ||
    path.endsWith('apk-release.json') ||
    path.endsWith('.zip') ||
    path.endsWith('.apk') ||
    path.startsWith('/api/')
  ) {
    return true;
  }
  return false;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  if (shouldBypassCache(url)) {
    return;
  }

  const isNavigation =
    request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            void caches.open(SHELL_CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          }
          return response;
        })
        .catch(async () => {
          const cached =
            (await caches.match(request)) || (await caches.match('/index.html'));
          return cached || Response.error();
        })
    );
    return;
  }

  const dest = request.destination;
  if (dest === 'script' || dest === 'style' || dest === 'font' || dest === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              const copy = response.clone();
              void caches.open(SHELL_CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached || Response.error());

        if (dest === 'image' || dest === 'font') {
          return cached || networkFetch;
        }
        return networkFetch;
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      if (clients.length > 0) {
        const client = clients[0];
        if ('focus' in client) client.focus();
        client.postMessage({
          type: 'MEOW_NOTIFICATION_CLICK',
          payload: data,
        });
        return;
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
