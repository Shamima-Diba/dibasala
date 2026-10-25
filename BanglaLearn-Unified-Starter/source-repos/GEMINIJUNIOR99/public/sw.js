// Junior Gemini Service Worker for Offline Learning & Core Materials Caching
const CACHE_NAME = 'junior-gemini-v1';
const CONTENT_CACHE_NAME = 'junior-gemini-content-v1';

// Assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
  '/src/App.tsx'
];

// Offline core fallback data
const OFFLINE_FALLBACK_API_RESPONSE = {
  offline: true,
  reply: "⚡ [অফলাইন মোড / Offline Mode] ইন্টারনেটের সংযোগ সাময়িকভাবে বিচ্ছিন্ন রয়েছে। আপনি জুনিয়র জেমিনির প্রাক-সংরক্ষিত (Pre-cached) পাঠ্যক্রম, কুইজ এবং কোডিং টিউটোরিয়াল ব্যবহার করতে পারেন।",
  modelUsed: "junior-gemini-offline-engine"
};

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing Junior Gemini Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching Core App Shell');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Pre-cache partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating Junior Gemini Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== CONTENT_CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Handle API Requests (Network First, with Offline Fallback)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If valid response, clone and cache for offline backup
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CONTENT_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          console.log('[ServiceWorker] Network request failed for API. Checking cache or returning offline fallback:', url.pathname);
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return structured offline JSON response
          return new Response(JSON.stringify(OFFLINE_FALLBACK_API_RESPONSE), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
          });
        })
    );
    return;
  }

  // Handle Static Assets & Pages (Cache First, falling back to Network)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached and update in background
        fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {/* Ignore network update errors when offline */});
        
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(async () => {
        // If navigation request fails offline, fallback to index.html
        if (request.mode === 'navigate') {
          const indexFallback = await caches.match('/index.html') || await caches.match('/');
          if (indexFallback) return indexFallback;
        }
        return new Response('Offline - Material cached in Junior Gemini Storage', { status: 503 });
      });
    })
  );
});

// PostMessage API for app interaction
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'PRECACHE_MATERIALS') {
    const materials = event.data.materials || [];
    caches.open(CONTENT_CACHE_NAME).then(async (cache) => {
      console.log('[ServiceWorker] Pre-caching offline material items count:', materials.length);
      for (const item of materials) {
        const dummyUrl = new Request(`/offline-material/${encodeURIComponent(item.id)}`);
        const response = new Response(JSON.stringify(item), {
          headers: { 'Content-Type': 'application/json' }
        });
        await cache.put(dummyUrl, response);
      }
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: true, count: materials.length });
      }
    });
  } else if (event.data.type === 'GET_CACHE_STATS') {
    Promise.all([
      caches.open(CACHE_NAME).then(c => c.keys()),
      caches.open(CONTENT_CACHE_NAME).then(c => c.keys())
    ]).then(([appKeys, contentKeys]) => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({
          appShellCount: appKeys.length,
          contentCount: contentKeys.length,
          timestamp: Date.now()
        });
      }
    });
  } else if (event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME);
    caches.delete(CONTENT_CACHE_NAME);
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({ cleared: true });
    }
  }
});
