// BolSetu Service Worker (Network-First for Documents & Safe Cache Invalidation)
const CACHE_NAME = 'bolsetu-pwa-v2';
const STATIC_ASSETS = [
  '/favicon.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => console.log('PWA cache warning:', err));
    })
  );
  // Force active immediately without waiting for old tabs to close
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      // Purge ALL stale caches including previous v1
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  // Take control of all open client tabs immediately
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass API endpoints completely
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  const isNavigation =
    event.request.mode === 'navigate' ||
    event.request.destination === 'document' ||
    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));

  // 1. FOR HTML PAGES (Navigation): NETWORK FIRST
  // Always fetch latest index.html from server so new JS/CSS chunk hashes are never stale!
  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return caches.match(event.request).then((cached) => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // 2. FOR HASHED STATIC ASSETS & OTHER REQUESTS:
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // If an asset returned HTML (e.g. 404 rewrite), do NOT cache or return as JS/CSS
        const contentType = networkResponse.headers.get('content-type') || '';
        const isAsset = url.pathname.includes('/assets/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css');
        if (isAsset && contentType.includes('text/html')) {
          // Prevent executing HTML as JS/CSS
          return networkResponse;
        }

        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      });
    })
  );
});
