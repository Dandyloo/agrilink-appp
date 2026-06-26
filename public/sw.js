// AgriLink Service Worker — PWA offline support
const CACHE_NAME = "agrilink-v1";
const OFFLINE_URL = "/offline.html";

const PRECACHE = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
];

// Install: pre-cache shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy:
//   - Navigation requests → network-first, fallback to offline page
//   - Supabase API → network-only (never cache auth/data)
//   - Static assets → cache-first
//   - Everything else → network-first, stash response in cache
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and supabase requests entirely
  if (request.method !== "GET") return;
  if (url.hostname.includes("supabase.co")) return;
  if (url.hostname.includes("unsplash.com")) return;

  // Navigation: network-first, fall back to offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then((r) => r || new Response("Offline"))
      )
    );
    return;
  }

  // Static assets (fonts, images, scripts): cache-first
  const isStatic =
    url.hostname.includes("fonts.g") ||
    /\.(png|jpg|jpeg|webp|ico|woff2?|css|js)(\?.*)?$/.test(url.pathname);

  if (isStatic) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE_NAME).then((c) => c.put(request, clone));
            }
            return res;
          })
      )
    );
    return;
  }

  // Default: network-first, cache fallback
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});

// Background sync: retry failed order placements when back online
self.addEventListener("sync", (event) => {
  if (event.tag === "retry-orders") {
    event.waitUntil(retryPendingOrders());
  }
});

async function retryPendingOrders() {
  // Pending orders are stored in IndexedDB by the app
  // This is a placeholder — wire up with idb-keyval in production
  console.log("[SW] Retrying pending orders on reconnect");
}

// Push notifications (Africa's Talking / Firebase)
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const { title, body, icon, url } = event.data.json();
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: icon || "/icon-192.png",
      badge: "/icon-192.png",
      data: { url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});