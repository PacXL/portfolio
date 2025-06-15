const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  '/portfolio/favicon-1.ico?v=2',
  '/portfolio/gt/01/map.png',
  '/portfolio/gt/01/map-overlay.png',
  '/portfolio/gt/01/MapPin.png',
  '/portfolio/gt/01/MapPinMarked.png',
  '/portfolio/gt/01/MapPinShelter.png',
  '/portfolio/gt/01/gear.svg',
  '/portfolio/gt/01/MapPinSurvivor.svg',
  '/portfolio/gt/01/item/Lockpick.png',
  '/portfolio/gt/01/item/Bolt%20cutter.png',
  '/portfolio/gt/01/survivor/Miguel.png',
  '/portfolio/gt/01/survivor/Barb.png',
  '/portfolio/gt/01/survivor/Aubrey.png',
  '/portfolio/gt/01/survivor/Rahul.png',
  '/portfolio/gt/01/survivor/Joe.png',
  '/portfolio/gt/01/survivor/Frank.png',
  '/portfolio/gt/01/survivor/Lester.png',
  '/portfolio/gt/01/survivor/Michelle.png',
  '/portfolio/gt/01/survivor/Hudson.png',
  '/portfolio/gt/01/survivor/Robbie.png',
  '/portfolio/gt/01/survivor/Cooper.png',
  '/portfolio/gt/01/survivor/Kirk.png',
  '/portfolio/gt/01/survivor/Isabel.png',
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
