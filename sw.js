const CACHE_NAME = 'matematik-evreni-v34b-2026-11-12';
const CORE = ['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME && k.startsWith('matematik-evreni-')).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if(req.mode === 'navigate') {
    event.respondWith(fetch(req).then(resp=>{if(resp.ok){const cp=resp.clone();caches.open(CACHE_NAME).then(c=>c.put(req,cp));}return resp;}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then(r=>r||fetch(req).then(resp=>{if(resp.ok){const cp=resp.clone();caches.open(CACHE_NAME).then(c=>c.put(req,cp));}return resp;})));
});