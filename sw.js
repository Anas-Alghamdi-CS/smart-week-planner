/* Service worker: precaches the app shell and serves it offline. Supabase API calls are never cached. */
const CACHE_VERSION = "v2";
const SHELL_CACHE   = `week-planner-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `week-planner-runtime-${CACHE_VERSION}`;
const SHELL_ASSETS  = [
    "./",
    "./index.html",
    "./manifest.webmanifest",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/icon-maskable-512.png"
];
// Third-party libraries that are safe to cache after the first successful load
const CACHEABLE_HOSTS = ["cdn.jsdelivr.net"];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys
                .filter(key => ![SHELL_CACHE, RUNTIME_CACHE].includes(key))
                .map(key => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;
    if (request.method !== "GET") return;
    const url = new URL(request.url);

    // Page navigations: network first so updates arrive quickly, cached shell when offline
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const copy = response.clone();
                    caches.open(SHELL_CACHE).then(cache => cache.put("./index.html", copy));
                    return response;
                })
                .catch(() => caches.match("./index.html"))
        );
        return;
    }

    // Same-origin assets and whitelisted CDN scripts: stale-while-revalidate
    if (url.origin === self.location.origin || CACHEABLE_HOSTS.includes(url.hostname)) {
        event.respondWith(
            caches.match(request).then(cached => {
                const refresh = fetch(request)
                    .then(response => {
                        if (response.ok) {
                            const copy = response.clone();
                            caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy));
                        }
                        return response;
                    })
                    .catch(() => cached);
                return cached || refresh;
            })
        );
    }
    // Everything else (Supabase REST/Auth) goes straight to the network
});
