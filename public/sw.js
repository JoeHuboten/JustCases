// Service Worker for JustCases
const CACHE_NAME = 'justcases-v1';
const STATIC_CACHE = 'justcases-static-v1';
const DYNAMIC_CACHE = 'justcases-dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/shop',
  '/about',
  '/contact',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
];

// API routes to cache
const API_ROUTES = [
  '/api/products',
  '/api/categories',
  '/api/cart',
  '/api/wishlist',
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - network first, then cache
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/_next/image')) {
    // Static assets - cache first
    event.respondWith(handleStaticRequest(request));
  } else if (url.pathname.startsWith('/product/') || url.pathname.startsWith('/shop')) {
    // Product pages - network first, then cache
    event.respondWith(handlePageRequest(request));
  } else {
    // Other pages - cache first, then network
    event.respondWith(handleOtherRequest(request));
  }
});

// Handle API requests
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed for API request, trying cache');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({ error: 'Offline - No cached data available' }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Failed to fetch static asset', request.url);
    return new Response('Asset not available offline', { status: 404 });
  }
}

// Handle page requests
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed for page request, trying cache');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Redirect to offline page
    return caches.match('/offline');
  }
}

// Handle other requests
async function handleOtherRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Failed to fetch', request.url);
    return new Response('Page not available offline', { status: 404 });
  }
}

// Background sync for cart and wishlist
self.addEventListener('sync', (event) => {
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCart());
  } else if (event.tag === 'wishlist-sync') {
    event.waitUntil(syncWishlist());
  }
});

// Sync cart data when back online
async function syncCart() {
  try {
    const cartData = await getStoredCartData();
    if (cartData && cartData.length > 0) {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData)
      });
      
      if (response.ok) {
        console.log('Service Worker: Cart synced successfully');
        clearStoredCartData();
      }
    }
  } catch (error) {
    console.error('Service Worker: Failed to sync cart', error);
  }
}

// Sync wishlist data when back online
async function syncWishlist() {
  try {
    const wishlistData = await getStoredWishlistData();
    if (wishlistData && wishlistData.length > 0) {
      for (const item of wishlistData) {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: item.id })
        });
      }
      console.log('Service Worker: Wishlist synced successfully');
      clearStoredWishlistData();
    }
  } catch (error) {
    console.error('Service Worker: Failed to sync wishlist', error);
  }
}

// Helper functions for IndexedDB operations
async function getStoredCartData() {
  // Implementation would depend on your IndexedDB setup
  return [];
}

async function clearStoredCartData() {
  // Implementation would depend on your IndexedDB setup
}

async function getStoredWishlistData() {
  // Implementation would depend on your IndexedDB setup
  return [];
}

async function clearStoredWishlistData() {
  // Implementation would depend on your IndexedDB setup
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/android-chrome-192x192.png',
      badge: '/android-chrome-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View Product',
          icon: '/android-chrome-192x192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/android-chrome-192x192.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/shop')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
