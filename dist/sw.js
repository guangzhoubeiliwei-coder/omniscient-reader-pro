/**
 * Service Worker for Omniscient Reader Pro
 * Provides offline-first functionality with cache-first strategy
 */

const CACHE_VERSION = 'omniscient-reader-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Assets to cache immediately on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
];

// Maximum cache sizes
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_IMAGE_CACHE_SIZE = 100;

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name.startsWith('omniscient-reader-') && name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== IMAGE_CACHE)
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

/**
 * Fetch event - cache-first strategy with network fallback
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip external API requests (let them go to network)
    if (url.origin !== location.origin && !url.hostname.includes('localhost')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request)
                    .then((networkResponse) => {
                        // Don't cache if not successful
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
                            return networkResponse;
                        }

                        // Clone the response
                        const responseToCache = networkResponse.clone();

                        // Determine which cache to use
                        let cacheName = DYNAMIC_CACHE;
                        if (request.destination === 'image') {
                            cacheName = IMAGE_CACHE;
                        }

                        // Cache the response
                        caches.open(cacheName)
                            .then((cache) => {
                                cache.put(request, responseToCache);

                                // Limit cache size
                                limitCacheSize(cacheName, request.destination === 'image' ? MAX_IMAGE_CACHE_SIZE : MAX_DYNAMIC_CACHE_SIZE);
                            });

                        return networkResponse;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }

                        // Return placeholder for images
                        if (request.destination === 'image') {
                            return caches.match('/placeholder.svg');
                        }
                    });
            })
    );
});

/**
 * Limit cache size by removing oldest entries
 */
function limitCacheSize(cacheName, maxSize) {
    caches.open(cacheName)
        .then((cache) => {
            cache.keys()
                .then((keys) => {
                    if (keys.length > maxSize) {
                        cache.delete(keys[0])
                            .then(() => limitCacheSize(cacheName, maxSize));
                    }
                });
        });
}

/**
 * Message event - handle cache clearing
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys()
                .then((cacheNames) => {
                    return Promise.all(
                        cacheNames.map((name) => caches.delete(name))
                    );
                })
                .then(() => {
                    return self.clients.matchAll();
                })
                .then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({ type: 'CACHE_CLEARED' });
                    });
                })
        );
    }
});
