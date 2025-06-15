const CACHE_NAME = 'portfolio-cache-v1';
const BASE_PATH = self.location.pathname.replace('service-worker.js', '');

const urlsToCache = [
  `${BASE_PATH}`,
  `${BASE_PATH}index.html`,
  `${BASE_PATH}favicon-1.ico?v=2`,
  `${BASE_PATH}gt/01/map.png`,
  `${BASE_PATH}gt/01/map-overlay.png`,
  `${BASE_PATH}gt/01/MapPin.png`,
  `${BASE_PATH}gt/01/MapPinMarked.png`,
  `${BASE_PATH}gt/01/MapPinShelter.png`,
  `${BASE_PATH}gt/01/gear.svg`,
  `${BASE_PATH}gt/01/MapPinSurvivor.svg`,
  `${BASE_PATH}gt/01/item/Lockpick.png`,
  `${BASE_PATH}gt/01/item/Bolt%20cutter.png`,
  `${BASE_PATH}gt/01/survivor/Miguel.png`,
  `${BASE_PATH}gt/01/survivor/Barb.png`,
  `${BASE_PATH}gt/01/survivor/Aubrey.png`,
  `${BASE_PATH}gt/01/survivor/Rahul.png`,
  `${BASE_PATH}gt/01/survivor/Joe.png`,
  `${BASE_PATH}gt/01/survivor/Frank.png`,
  `${BASE_PATH}gt/01/survivor/Lester.png`,
  `${BASE_PATH}gt/01/survivor/Michelle.png`,
  `${BASE_PATH}gt/01/survivor/Hudson.png`,
  `${BASE_PATH}gt/01/survivor/Robbie.png`,
  `${BASE_PATH}gt/01/survivor/Cooper.png`,
  `${BASE_PATH}gt/01/survivor/Kirk.png`,
  `${BASE_PATH}gt/01/survivor/Isabel.png`,
];

// Log informasi tentang service worker untuk debugging
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing with BASE_PATH:', BASE_PATH);
  console.log('[Service Worker] URLs to cache:', urlsToCache);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] All resources cached');
        return self.skipWaiting(); // Aktifkan service worker segera
      })
      .catch((error) => {
        console.error('[Service Worker] Cache error:', error);
      })
  );
});

// Aktifkan dan ambil alih semua klien
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating');
  
  event.waitUntil(
    // Hapus cache lama
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('portfolio-cache')) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim(); // Ambil alih klien yang ada
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Pastikan URL dimulai dengan origin yang sama
  if (!event.request.url.startsWith(self.location.origin)) {
    return; // Abaikan permintaan cross-origin
  }
  
  // Log permintaan untuk debugging
  console.log('[Service Worker] Fetching:', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Jika ada di cache, kembalikan dari cache
        if (cachedResponse) {
          console.log('[Service Worker] Returning from cache:', event.request.url);
          return cachedResponse;
        }
        
        // Jika tidak ada di cache, coba ambil dari jaringan
        console.log('[Service Worker] Not in cache, fetching:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Jangan cache jika bukan respons yang valid atau method bukan GET
            if (!response || response.status !== 200 || event.request.method !== 'GET') {
              return response;
            }
            
            // Clone respons untuk disimpan di cache
            const responseToCache = response.clone();
            
            // Simpan respons baru di cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                console.log('[Service Worker] Caching new resource:', event.request.url);
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // Jika permintaan adalah untuk halaman HTML, kembalikan halaman offline
            if (event.request.mode === 'navigate') {
              return caches.match(`${BASE_PATH}index.html`);
            }
            
            // Jika tidak bisa mengambil dari jaringan dan tidak ada di cache, kembalikan error
            throw error;
          });
      })
  );
});
