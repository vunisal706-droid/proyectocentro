const CACHE = 'plan-centro-v4';
const ASSETS = [
  './', './index.html', './manifest.json',
  './data/resumenes.js',
  './data/pe.js','./data/rof.js','./data/gestion.js','./data/anexos.js',
  './icons/icon-192.png','./icons/icon-512.png','./icons/logo-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const copy = resp.clone();
      if (resp.ok && e.request.url.startsWith(self.location.origin))
        caches.open(CACHE).then(c => c.put(e.request, copy));
      return resp;
    }).catch(() => caches.match('./index.html')))
  );
});
