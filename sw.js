const CACHE_NAME = 'plan-centro-v1';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './plan_de_centro_2025.pdf',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Estrategia de Cache First, luego Network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si está en cache, lo devolvemos
                if (response) {
                    return response;
                }

                // Si no, intentamos obtenerlo de la red
                return fetch(event.request)
                    .then((response) => {
                        // Verificar si es una respuesta válida
                        if (!response || response.status !== 200 || response.type === 'basic') {
                            return response;
                        }

                        // Clonar la respuesta
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Si falla la red y no está en cache, mostrar página offline
                        return caches.match('./index.html');
                    });
            })
    );
});
