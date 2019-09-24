this.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open('static').then(function (cache) {
            cache.addAll(['/', '/app.js', '/index.html', '/canvas.html', '/jogos.html', '/manifest.json']);
        })
    );
});

this.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating Service Worker ....', event);
});

this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return fetch(event.request).then(function (res) {
                return caches.open('dynamic').then(function (cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                });
            });
        })
    );
});