const CACHE_NAME = 'noire-v5';
const ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './js/script.js',
    './js/i18n.js',
    './favicon.ico',
    './favicon.svg',
    './apple-touch-icon.png',
    './images/hero.jpg',
    './images/restaurant.jpg',
    './images/plat1.jpg',
    './images/plat2.jpg',
    './images/plat3.jpg',
    './images/chef.jpg'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    const url = new URL(e.request.url);
    if (url.origin !== location.origin) return;

    e.respondWith(
        caches.match(e.request).then((cached) => {
            return cached || fetch(e.request).then((res) => {
                if (res && res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
                }
                return res;
            }).catch(() => cached);
        })
    );
});