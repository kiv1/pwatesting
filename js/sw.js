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

self.addEventListener('message', function(event) {
    alert(event.data.alert);
});