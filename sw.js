// Service Worker for Vedang Portfolio - Caching and Performance
const CACHE_NAME = 'vedang-portfolio-v1';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/performance.css',
    '/css/gallery.css',
    '/js/gsap-animations-optimized.js',
    '/js/main-optimized.js',
    '/js/contact.js',
    '/pages/weddings.html',
    '/pages/events.html',
    '/pages/corporate.html',
    '/pages/concerts.html',
    '/pages/product.html',
    '/pages/food.html',
    '/pages/advertisement.html',
    // Critical wedding images
    '/images/weddings/KPS-34.jpg',
    '/images/weddings/KPS.jpg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching app shell');
                return cache.addAll(CACHE_URLS);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Clearing old cache');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request)
                    .then((fetchResponse) => {
                        // Save to cache for next time (for GET requests)
                        if (event.request.method === 'GET') {
                            const responseClone = fetchResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return fetchResponse;
                    });
            })
            .catch(() => {
                // Return offline page for navigation requests
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});
