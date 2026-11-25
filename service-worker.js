const CACHE_NAME = "mz-treino-v1";

const ARQUIVOS = [
  "./",
  "./manifest.json",
  "./assets/mz-interface.png",
  "./assets/mz-logo.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ARQUIVOS))
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const cachesExistentes = await caches.keys();

      await Promise.all(
        cachesExistentes
          .filter(nome => nome !== CACHE_NAME)
          .map(nome => caches.delete(nome))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      const arquivoCache = await caches.match(event.request);

      if (arquivoCache) return arquivoCache;

      try {
        return await fetch(event.request);
      } catch (erro) {
        return await caches.match("./");
      }
    })()
  );
});
