const CACHE = "nj-ui-study-v3";
const BASE = new URL("./", self.location.href).href;
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache.addAll(
          [
            "",
            "icon-192.png",
            "icon-512.png",
            "service-update.svg",
            "train-scene.svg",
          ].map((path) => BASE + path),
        ),
      ),
  );
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("nj-ui-study-") && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !event.request.url.startsWith(BASE))
    return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const response = await caches.match(event.request);
        if (response) return response;
        if (event.request.mode === "navigate") {
          const shell = await caches.match(BASE);
          if (shell) return shell;
        }
        return new Response("Offline. This page has not been cached.", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      }),
  );
});
