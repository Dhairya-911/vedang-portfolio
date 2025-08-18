// Service Worker for Vedang Portfolio - Enhanced Caching and Performance
const CACHE_NAME = 'vedang-portfolio-v2.1';
const STATIC_CACHE = 'vedang-static-v2.1';
const DYNAMIC_CACHE = 'vedang-dynamic-v2.1';
const IMAGE_CACHE = 'vedang-images-v2.1';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/critical.css',
    '/css/performance.css',
    '/css/mobile-performance.css',
    '/css/image-optimization.css',
    '/css/gallery.css',
    '/js/main-optimized.js',
    '/js/gsap-animations-optimized.js',
    '/js/performance-optimizer.js',
    '/js/contact.js',
    '/pages/weddings.html',
    '/pages/events.html',
    '/pages/corporate.html',
    '/pages/concerts.html',
    '/pages/product.html',
    '/pages/food.html',
    '/pages/advertisement.html',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js'
];

// Critical images to cache
const CRITICAL_IMAGES = [
    '/images/weddings/KPS-34.jpg',
    '/images/weddings/KPS.jpg',
    '/images/concerts/P1110229.jpg',
    '/images/food/Paneer Final 1.jpg',
    '/images/events/P1022542.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then((cache) => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            // Cache critical images
            caches.open(IMAGE_CACHE).then((cache) => {
                console.log('Caching critical images');
                return cache.addAll(CRITICAL_IMAGES);
            })
        ]).then(() => {
            console.log('Service Worker installation complete');
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && 
                        cacheName !== DYNAMIC_CACHE && 
                        cacheName !== IMAGE_CACHE &&
                        cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip external requests (except GSAP CDN)
    if (url.origin !== location.origin && !url.hostname.includes('cdnjs.cloudflare.com')) {
        return;
    }

    event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
    try {
        // Handle different types of requests with appropriate strategies
        if (isImageRequest(request)) {
            return handleImageRequest(request);
        } else if (isStaticAsset(request)) {
            return handleStaticAsset(request);
        } else {
            return handleDynamicRequest(request);
        }
    } catch (error) {
        console.error('Service Worker fetch error:', error);
        return fetch(request);
    }
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Return placeholder if image fails to load
        return new Response('', { 
            status: 200, 
            statusText: 'Image unavailable' 
        });
    }
}

// Handle static assets with cache-first + background update
async function handleStaticAsset(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        // Update cache in background
        fetch(request).then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
        }).catch(() => {});
        
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        return cachedResponse || new Response('Network error', { status: 408 });
    }
}

// Handle dynamic requests with network-first strategy
async function handleDynamicRequest(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback to index.html for navigation requests
        if (request.destination === 'document') {
            return caches.match('/index.html');
        }
        
        return new Response('Offline', { status: 503 });
    }
}

// Helper functions
function isImageRequest(request) {
    return request.destination === 'image' || 
           request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
}

function isStaticAsset(request) {
    return request.url.match(/\.(css|js|woff|woff2|ttf|eot)$/i) ||
           request.url.includes('cdnjs.cloudflare.com');
}
