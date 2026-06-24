// AgriLink service worker
// Caches the static app shell so the PWA installs and opens reliably offline.
// Deliberately does NOT cache Supabase/API requests — prices, orders, and
// wallet data must always come from the network, never a stale cache.

const CACHE_NAME = "agrilink-shell-v1";

const SHELL_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle simple GET navigations/assets. Everything else (POST,
  // Supabase REST/Realtime calls, auth, etc.) passes straight through.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never intercept cross-origin requests (Supabase, fonts CDN, etc.)
  if (url.origin !== self.location.origin) return;

  // Never intercept API-ish paths even if same-origin in the future.
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      // Stale-while-revalidate for shell assets: show cached instantly,
      // refresh cache in background.
      return cached || networkFetch;
    })
  );
});