// Name and version of the cache
const CACHE_NAME = 'does-network-cache-v1';

// Files to cache (add any other assets or scripts you want cached)
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',  // Assuming you have a separate CSS file
  '/script.js',   // Assuming you have separate JavaScript files
  '/sofiaPro.otf',
  '/sofiaProBold.otf'
];

// Install event - caching essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(self.skipWaiting())  // Activate the service worker immediately
  );
});

// Activate event - cleaning up old caches if any
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    )
  );
  self.clients.claim();  // Claim clients to ensure control over the page
});

// Fetch event - serving assets from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Serve from cache if available, else fetch from network
        return cachedResponse || fetch(event.request);
      })
  );
});
