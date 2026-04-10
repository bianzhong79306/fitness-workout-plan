// FitPlan Pro Service Worker
// Version 1.0 - Basic caching strategy

const CACHE_NAME = 'fitplan-pro-v1';
const STATIC_CACHE = 'fitplan-static-v1';
const API_CACHE = 'fitplan-api-v1';

// Static assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

// Install - precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => !name.startsWith('fitplan-'))
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch - routing strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip authentication and payment routes
  if (url.pathname.includes('/auth/') || url.pathname.includes('/payment/')) {
    return;
  }

  // API requests - Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Static assets - Cache first, network fallback
  if (url.pathname.startsWith('/icons/') || url.pathname.endsWith('.svg')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Navigation requests - Network first
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, STATIC_CACHE)
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Default - Stale while revalidate
  event.respondWith(staleWhileRevalidate(request, CACHE_NAME));
});

// Cache first strategy
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Cache first failed:', error);
    return new Response('Network error', { status: 408 });
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    console.error('Network first failed:', error);
    return new Response('Network error', { status: 408 });
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      const cache = caches.open(cacheName);
      cache.then((c) => c.put(request, response.clone()));
    }
    return response;
  });

  return cached || fetchPromise;
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});