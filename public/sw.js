/* Reloadex service worker — 100% offline (APK/PWA) */
const VERSION = 'reloadex-v4-fast';
// Precarga mínimo: el logo de 1,78 MB y los iconos grandes se descargan bajo
// demanda (o ya están en el APK), no bloquean el primer render.
const CORE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/logo-ui.png',
  '/favicon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Todo lo que usa la app está empaquetado localmente: cache-first.
  // Incluye JS/CSS, fuentes woff2, JSON, sprites GIF, iconos PNG y gritos WAV.
  const isLocalAsset = /\.(gif|png|jpg|jpeg|webp|svg|ico|wav|mp3|ogg|js|css|json|woff2?|webmanifest)(\?|$)/.test(url.pathname);
  if (isLocalAsset) {
    event.respondWith(
      caches.open(VERSION).then((cache) =>
        cache.match(request).then((cached) =>
          cached || fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          })
        )
      )
    );
    return;
  }

  // Navegación: red primero si hay PWA servida, con fallback al app shell.
  event.respondWith(
    fetch(request).catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
  );
});
