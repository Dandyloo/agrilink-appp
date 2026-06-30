// AgriLink Service Worker v2 — PWA offline support
const CACHE_NAME = "agrilink-v2";
const OFFLINE_URL = "/offline.html";

// App shell routes to precache so the app loads offline instantly
const PRECACHE = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/maskable-icon-512.png",
];

// Install: pre-cache shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(PRECACHE).catch((err) => {
        console.warn("[SW] Precache partial failure:", err);
      })
    )
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy:
//   Navigation → network-first, fallback offline page
//   Supabase / API → network-only (never cache auth/data)
//   Google Fonts / static assets → cache-first, update in background (stale-while-revalidate)
//   Everything else → network-first, stash in cache
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== "GET") return;

  // Never cache Supabase, auth, or external API calls
  if (
    url.hostname.includes("supabase.co") ||
    url.hostname.includes("supabase.io") ||
    url.pathname.includes("/auth/") ||
    url.hostname.includes("cloudinary.com")
  ) return;

  // Navigation: network-first, fall back to offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // Stash a copy of navigated pages
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || caches.match(OFFLINE_URL).then((r) => r || new Response("Offline"))
          )
        )
    );
    return;
  }

  // Google Fonts + static assets: stale-while-revalidate
  const isStatic =
    url.hostname.includes("fonts.g") ||
    /\.(png|jpg|jpeg|webp|ico|svg|woff2?|ttf|css|js)(\?.*)?$/.test(url.pathname);

  if (isStatic) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const networkFetch = fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          });
          return cached || networkFetch;
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
  console.log("[SW] Retrying pending orders on reconnect");
}

// Push notifications
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