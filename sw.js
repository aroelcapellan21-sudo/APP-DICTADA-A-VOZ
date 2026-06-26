// Service Worker — estrategia cache-first (stale-while-revalidate) para el app-shell.
//
// Toda la app vive dentro de index.html (un único documento con el JS inline),
// así que las NAVEGACIONES responden al instante desde el caché y refrescan en
// segundo plano: la PWA abre casi instantáneo (online u offline) y el próximo
// arranque ya trae la versión nueva. No hace falta subir un número de versión a
// mano en cada deploy.
//
// Al cambiar la lógica del SW sí conviene subir CACHE (bon-v3 -> bon-v4) para
// que el navegador detecte el SW nuevo y 'activate' purgue los cachés viejos.
const CACHE = 'bon-v4';
const URL_APP = '/';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.add(URL_APP))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // No cachear las llamadas al backend ni peticiones que no sean GET:
  // deben ir siempre a la red (y la Cache API no admite POST).
  if (req.method !== 'GET' || url.pathname.startsWith('/api/')) {
    return;
  }

  // NAVEGACIONES (el app-shell / HTML): cache-first (stale-while-revalidate).
  // Respondemos al instante desde el caché si existe y refrescamos en segundo
  // plano; solo la primerísima carga sin caché espera la red.
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match(URL_APP).then(cached => {
        const fresh = fetch(req).then(resp => {
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE).then(c => c.put(URL_APP, clone));
          }
          return resp;
        }).catch(() => cached);
        return cached || fresh;
      })
    );
    return;
  }

  // RESTO de GET (fotos remotas, etc.): stale-while-revalidate.
  // Respondemos rápido desde caché si existe y refrescamos en segundo plano.
  e.respondWith(
    caches.match(req).then(cached => {
      const fresh = fetch(req).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return resp;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
