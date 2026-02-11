/**
 * DataScience Masterclass - Service Worker
 * Provides offline support and caching
 * Version: 2.0.0
 */

const CACHE_NAME = 'ds-masterclass-v2.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/shared/css/design-system.css',
    '/shared/css/components.css',
    '/shared/js/search.js',
    '/shared/js/progress.js',
    '/shared/js/theme.js',
    '/manifest.json'
];

// Module pages to cache on first visit
const MODULE_PAGES = [
    '/DeepLearning/index.html',
    '/ml_complete-all-topics/index.html',
    '/complete-statistics/index.html',
    '/math-ds-complete/index.html',
    '/feature-engineering/index.html',
    '/Visualization/index.html',
    '/prompt-engineering-guide/index.html'
];

/**
 * Install event - cache core assets
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching core assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                console.log('[SW] Core assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Failed to cache core assets:', error);
            })
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
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Service worker activated');
                return self.clients.claim();
            })
    );
});

/**
 * Fetch event - serve from cache or network
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests (except CDN assets)
    if (url.origin !== location.origin && !isTrustedCDN(url)) {
        return;
    }

    // Handle navigation requests
    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
        return;
    }

    // Handle static assets
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Default: network first with cache fallback
    event.respondWith(networkFirst(request));
});

/**
 * Cache-first strategy (for static assets)
 */
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        // Update cache in background
        fetchAndCache(request, cache);
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('[SW] Failed to fetch:', request.url);
        throw error;
    }
}

/**
 * Network-first strategy (for HTML pages)
 */
async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);

        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            const offlinePage = await cache.match(OFFLINE_URL);
            if (offlinePage) {
                return offlinePage;
            }
        }

        throw error;
    }
}

/**
 * Fetch and cache in background
 */
async function fetchAndCache(request, cache) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response);
        }
    } catch (error) {
        // Silently fail for background updates
    }
}

/**
 * Check if URL is a static asset
 */
function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
    return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

/**
 * Check if URL is from trusted CDN
 */
function isTrustedCDN(url) {
    const trustedHosts = [
        'cdn.jsdelivr.net',
        'cdnjs.cloudflare.com',
        'unpkg.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com'
    ];
    return trustedHosts.includes(url.host);
}

/**
 * Handle messages from main thread
 */
self.addEventListener('message', (event) => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data.type === 'CACHE_MODULE') {
        const moduleUrl = event.data.url;
        caches.open(CACHE_NAME).then(cache => {
            cache.add(moduleUrl).then(() => {
                console.log('[SW] Cached module:', moduleUrl);
            });
        });
    }

    if (event.data.type === 'GET_CACHE_STATUS') {
        getCacheStatus().then(status => {
            event.ports[0].postMessage(status);
        });
    }
});

/**
 * Get cache status
 */
async function getCacheStatus() {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();

    const cachedModules = MODULE_PAGES.filter(page =>
        keys.some(key => key.url.includes(page))
    );

    return {
        totalCached: keys.length,
        cachedModules: cachedModules.length,
        totalModules: MODULE_PAGES.length,
        cacheVersion: CACHE_NAME
    };
}

/**
 * Periodic background sync (if supported)
 */
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-content') {
        event.waitUntil(updateCachedContent());
    }
});

/**
 * Update cached content
 */
async function updateCachedContent() {
    const cache = await caches.open(CACHE_NAME);

    for (const asset of PRECACHE_ASSETS) {
        try {
            const response = await fetch(asset);
            if (response.ok) {
                await cache.put(asset, response);
            }
        } catch (error) {
            console.log('[SW] Failed to update:', asset);
        }
    }

    console.log('[SW] Cache updated');
}
