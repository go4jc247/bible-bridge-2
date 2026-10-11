/* Bible Bridge service worker.
   Change VERSION whenever you upload a new index.html so phones pick up the update. */
const VERSION = 'v2.3.0';
const CACHE = 'bible-bridge-' + VERSION;
const CORE = ['./', 'index.html', 'style.css', 'app.js', 'images.js', 'reader.js', 'reader.css', 'manifest.webmanifest'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('bible-bridge-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Opening the app: try the network first (so updates arrive), fall back to the saved copy
   when offline or when the network is slow. */
function openApp(request) {
  return new Promise(resolve => {
    let done = false;
    const finish = r => { if (!done && r) { done = true; resolve(r); } };
    const fromCache = () => caches.match('index.html').then(finish);
    const timer = setTimeout(fromCache, 3500);
    fetch(request).then(res => {
      clearTimeout(timer);
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('index.html', copy));
        finish(res);
      } else {
        fromCache().then(() => finish(res));
      }
    }).catch(() => {
      clearTimeout(timer);
      fromCache().then(() => finish(Response.error()));
    });
  });
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;           // fonts, Bible sites, etc. go straight to the network
  if (/\/lang\/[^/]+\.json$/.test(url.pathname)) return;   // language packs: the app fetches and keeps these itself
  if (req.headers.has('range')) return;                      // Bible text is read piece by piece (byte ranges): the reader keeps its own offline copy
  if (req.mode === 'navigate') { event.respondWith(openApp(req)); return; }
  event.respondWith(
    caches.match(req).then(hit => {
      const refresh = fetch(req).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || refresh;
    })
  );
});
