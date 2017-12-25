var CACHE_NAME = 'form-v1';

var resourcesToCache = [
  '',
  'index.html',
  'index.html?',
  'index_geolocation.html',
  'index_geolocation.html?',
  'index_foundation.html',
  'index_foundation.html?',
  'index_serviceworker.html',
  'index_serviceworker.html?',
  'index_pouch.html',
  'index_pouch.html?',
  'index_final.html',
  'index_final.html?',
  'css/app.css',
  'css/foundation.css',
  'css/images/gps4.png',
  'js/app.js',
  'js/pouchdb-6.3.4.min.js',
  'js/offlinedb.js',
  'js/data-redraw.js',
  'js/vendor/foundation.js',
  'js/vendor/jquery.js',
  'js/vendor/what-input.js'
];

self.addEventListener('install', function (event) {
    console.info('installing service worker');

    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function (cache) {
            console.info('cache opened');

            return cache.addAll(resourcesToCache);
        })
    );
});

self.addEventListener('activate', function (event) {
    console.info('service worker activated');
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            console.log('request:', event.request);

            if (response) {
                console.info('cache hit');
                return response;
            }

            console.info('fetching');
            return fetch(event.request);
        })
    );
});
