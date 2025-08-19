// Enhanced Service Worker for Advanced Caching and Performance
const CACHE_NAME = 'vedang-cinematography-v2.1';
const STATIC_CACHE = 'vedang-static-v2.1';
const DYNAMIC_CACHE = 'vedang-dynamic-v2.1';
const IMAGE_CACHE = 'vedang-images-v2.1';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/css/critical-optimized.css',
    '/js/performance-advanced.js',
    '/images/weddings/KPS-34.jpg'
];

// Static resources to cache
const STATIC_RESOURCES = [
    '/css/style.css',
    '/css/carousel.css',
    '/css/no-cursor.css',
    '/css/performance.css',
    '/css/mobile-performance.css',
    '/css/image-optimization.css',
    '/js/main-optimized.js',
    '/js/carousel.js',
    '/js/gsap-animations-optimized.js',
    '/js/contact.js'
];

// CDN resources to cache
const CDN_RESOURCES = [
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap'
];

// Install event - cache critical resources
self.addEventListener('install', event => {
    console.log('Enhanced Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache critical resources first
            caches.open(CACHE_NAME).then(cache => {
                return cache.addAll(CRITICAL_RESOURCES);
            }),
            // Cache static resources
            caches.open(STATIC_CACHE).then(cache => {
                return cache.addAll(STATIC_RESOURCES.concat(CDN_RESOURCES));
            })
        ]).then(() => {
            console.log('Critical resources cached successfully');
            // Skip waiting to activate immediately
            return self.skipWaiting();
        }).catch(error => {
            console.error('Failed to cache critical resources:', error);
        })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    console.log('Enhanced Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete old caches
                    if (cacheName !== CACHE_NAME && 
                        cacheName !== STATIC_CACHE && 
                        cacheName !== DYNAMIC_CACHE && 
                        cacheName !== IMAGE_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Old caches cleaned up');
            return self.clients.claim();
        })
    );
});

// Fetch event - advanced caching strategies
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip Chrome extensions and other protocols
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Handle different types of resources
    if (isImageRequest(request)) {
        event.respondWith(handleImageRequest(request));
    } else if (isCDNRequest(request)) {
        event.respondWith(handleCDNRequest(request));
    } else if (isAPIRequest(request)) {
        event.respondWith(handleAPIRequest(request));
    } else {
        event.respondWith(handleStaticRequest(request));
    }
});

// Handle image requests with stale-while-revalidate
async function handleImageRequest(request) {
    try {
        const cache = await caches.open(IMAGE_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // Return cached version immediately
            updateImageCache(cache, request);
            return cachedResponse;
        }
        
        // Fetch and cache new image
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
        
    } catch (error) {
        console.error('Image request failed:', error);
        return new Response('Image not available', { status: 404 });
    }
}

// Update image cache in background
async function updateImageCache(cache, request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            await cache.put(request, response);
        }
    } catch (error) {
        console.log('Background image update failed:', error);
    }
}

// Handle CDN requests with cache-first strategy
async function handleCDNRequest(request) {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
        
    } catch (error) {
        console.error('CDN request failed:', error);
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('Resource not available', { status: 404 });
    }
}

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
    try {
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
        
    } catch (error) {
        console.error('API request failed:', error);
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('API not available', { status: 503 });
    }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
    try {
        // Check all caches
        const caches_to_check = [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE];
        
        for (const cache_name of caches_to_check) {
            const cache = await caches.open(cache_name);
            const cachedResponse = await cache.match(request);
            if (cachedResponse) {
                return cachedResponse;
            }
        }
        
        // Not in cache, fetch from network
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
        
    } catch (error) {
        console.error('Static request failed:', error);
        
        // Fallback to any cached version
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Ultimate fallback for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
        }
        
        return new Response('Resource not available', { status: 404 });
    }
}

// Helper functions
function isImageRequest(request) {
    const url = new URL(request.url);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname) || 
           request.headers.get('accept')?.includes('image/');
}

function isCDNRequest(request) {
    const url = new URL(request.url);
    return url.hostname.includes('cdnjs.cloudflare.com') || 
           url.hostname.includes('fonts.googleapis.com') ||
           url.hostname.includes('fonts.gstatic.com');
}

function isAPIRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api/') || 
           url.hostname !== self.location.hostname;
}

// Background sync for failed requests
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    console.log('Performing background sync...');
    // Add any background sync logic here
}

// Push notifications (if needed in future)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/images/icon-192x192.png',
            badge: '/images/badge-72x72.png',
            tag: 'portfolio-notification',
            renotify: true
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Cache management - cleanup old entries
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        event.waitUntil(cleanupCache());
    }
});

async function cleanupCache() {
    const imageCache = await caches.open(IMAGE_CACHE);
    const requests = await imageCache.keys();
    
    // Keep only recent 50 images
    if (requests.length > 50) {
        const requestsToDelete = requests.slice(0, requests.length - 50);
        await Promise.all(
            requestsToDelete.map(request => imageCache.delete(request))
        );
        console.log(`Cleaned up ${requestsToDelete.length} old cached images`);
    }
}
