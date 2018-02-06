//https://stackoverflow.com/questions/30256390/navigator-serviceworker-controller-is-always-null
var cacheName = 'pwatesting';
var filesToCache = [ '/index.html',
  '/js/index.js',
  '/css/style.css'];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
});
