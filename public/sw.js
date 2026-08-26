// Minimal offline-after-first-visit service worker.
//
// Strategy: network-first, falling back to a runtime cache. Every
// successful same-origin GET response is cached as it's fetched, so pages
// and assets you've already visited keep working offline. There is no
// build-time precache list here on purpose - Next.js static export emits
// content-hashed filenames per build, so a hardcoded precache list would
// go stale (and start 404ing) the moment a new version deploys. Bump
// CACHE_NAME on meaningful changes to this file to invalidate old caches.
const CACHE_NAME = "image-convertor-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached ?? Response.error())),
  );
});
