/* Reloadex service worker — offline + assets cache (APK/PWA ready) */
const VERSION = 'reloadex-v3';
const CORE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/logo.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // El dataset puede regenerarse: JSON se actualiza de la red y se usa caché solo sin conexión.
  if (url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(request).then((res) => {
        if (res.ok) caches.open(VERSION).then((cache) => cache.put(request, res.clone()));
        return res;
      }).catch(async () => (await caches.match(request)) || caches.match('/index.html'))
    );
    return;
  }

  // assets estáticos (sprites, cries, js, css): cache-first
  const isAsset = /\.(gif|png|jpg|jpeg|webp|svg|wav|mp3|ogg|js|css|ico|webmanifest)$/.test(url.pathname);
  if (isAsset) {
    event.respondWith(
      caches.open(VERSION).then((cache) =>
        cache.match(request).then((cached) =>
          cached || fetch(request).then((res) => { if (res.ok) cache.put(request, res.clone()); return res; }).catch(() => cached)
        )
      )
    );
    return;
  }

  // navegación: network-first con fallback a app shell
  event.respondWith(
    fetch(request).catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
  );
});
