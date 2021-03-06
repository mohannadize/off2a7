const cacheStore = "Switch-1.0.4";
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheStore).then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./12.mp3",
        "./13.mp3",
        "./manifest.json",
        "./icon512.jpg",
        "./icon.jpg",
      ]).then(() => self.skipWaiting());
    })
  );
});
self.addEventListener("fetch", (e) => {
  if (!e.request.url.startsWith("chrome-extension://")) {
    e.respondWith(
      caches.match(e.request).then((res) => {
        return res || fetch(e.request).then((netres) => {
          return caches.open(cacheStore).then((x) => {
            x.put(e.request.url, netres.clone());
            return netres;
          });
        });
      })
    );
  }
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(function (ketchups) {
      return Promise.all(
        ketchups.filter(function (cacheName) {
          return cacheName.startsWith('Switch') && cacheName != cacheStore;
        }).map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  )
})