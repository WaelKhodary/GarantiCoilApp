
const CACHE_NAME = "garanti-coil-app-v2";

const APP_BASE = "/GarantiCoilApp/";

const FILES_TO_CACHE = [
    APP_BASE,
    APP_BASE + "index.html",
    APP_BASE + "chemical.html",
    APP_BASE + "pricecalc.html",
    APP_BASE + "manifest.json",
    APP_BASE + "icon-192.png",
    APP_BASE + "icon-512.png",
    APP_BASE + "logo.png"
];

// INSTALL
self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            })

            .then(() => self.skipWaiting())

    );

});


// ACTIVATE
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys
                    .filter(key =>
                        key.startsWith("garanti-coil-app-") &&
                        key !== CACHE_NAME
                    )
                    .map(key => caches.delete(key))

            );

        })

        .then(() => self.clients.claim())

    );

});


// FETCH
self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) return;

    event.respondWith(

        caches.open(CACHE_NAME).then(async cache => {

            const cachedResponse =
                await cache.match(event.request);

            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request);

        })

    );

});
