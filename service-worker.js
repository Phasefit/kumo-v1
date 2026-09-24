const CACHE_NAME = "kumo-v19";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js?v=19",
  "./lib/supabase-v2.js?v=2.108.2",
  "./data/courseContent.js?v=2",
  "./config/runtime-config.js?v=1",
  "./lib/supabaseClient.js?v=1",
  "./services/authService.js?v=5",
  "./services/profileService.js?v=1",
  "./services/courseService.js?v=2",
  "./services/progressService.js?v=2",
  "./services/lessonService.js?v=2",
  "./manifest.webmanifest",
  "./icons/favicon.ico?v=2",
  "./icons/kumo-180.png",
  "./icons/kumo-192.png",
  "./icons/kumo-512.png",
  "./lib/formatRemainingTime.js?v=1",
  "./components/CountdownTimer.js?v=1",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("kumo-v") && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const sameOrigin = requestUrl.origin === self.location.origin;
  const isAppCode =
    event.request.mode === "navigate" ||
    ["script", "style", "manifest"].includes(event.request.destination);

  if (sameOrigin && isAppCode) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() =>
          event.request.mode === "navigate"
            ? caches.match("./index.html")
            : caches.match(event.request),
        ),
    );
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            if (sameOrigin && response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }
            return response;
          }),
      ),
  );
});
