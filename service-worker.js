const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  'favicon-1.ico?v=2',
  'gt/01/map.png',
  'gt/01/map-overlay.png',
  'gt/01/MapPin.png',
  'gt/01/MapPinMarked.png',
  'gt/01/MapPinShelter.png',
  'gt/01/gear.svg',
  'gt/01/MapPinSurvivor.svg',
  'gt/01/item/Lockpick.png',
  'gt/01/item/Bolt%20cutter.png',
  'gt/01/survivor/Miguel.png',
  'gt/01/survivor/Barb.png',
  'gt/01/survivor/Aubrey.png',
  'gt/01/survivor/Rahul.png',
  'gt/01/survivor/Joe.png',
  'gt/01/survivor/Frank.png',
  'gt/01/survivor/Lester.png',
  'gt/01/survivor/Michelle.png',
  'gt/01/survivor/Hudson.png',
  'gt/01/survivor/Robbie.png',
  'gt/01/survivor/Cooper.png',
  'gt/01/survivor/Kirk.png',
  'gt/01/survivor/Isabel.png',
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
