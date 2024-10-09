// Define the cache name and the files we want to cache
const CACHE_NAME = 'does-network-cache-v1';
const urlsToCache = [
  '/',
  '/circularBlack.otf',
  '/circular.otf',
  '/index.html' // Adjust this to your actual HTML file path
];

// Install event - caching files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serving cached files if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return the cached resource
      if (response) {
        return response;
      }

      // If the resource is not in cache, fetch it from the network
      return fetch(event.request).catch(() => {
        // If offline and not cached, return a fallback page
        return caches.match('/');
      });
    })
  );
});

// Activate event - cleaning up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
