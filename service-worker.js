const CACHE_NAME = "garanti-coil-app-v1";

const APP_BASE = "/GarantiCoilApp/";

const FILES_TO_CACHE = [
    APP_BASE,
    APP_BASE + "index.html",
    APP_BASE + "chemical.html",
    APP_BASE + "pricecalc.html",
    APP_BASE + "manifest.json",
    APP_BASE + "icon-192.png",
    APP_BASE + "icon-512.png"
];

// Install: save the app files for offline use
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activate: remove old versions of the cache
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch: serve saved files when offline
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) return cachedResponse;

            return fetch(event.request);
        })
    );
});
