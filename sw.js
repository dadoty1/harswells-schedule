/* Harswells Schedule service worker (editable PWA): caches the app shell for full offline use. Job data is fetched by the
   page (Dropbox API; same-origin only for the local dev preview) and kept in IndexedDB; edits live in localStorage until checked in or exported.
   Cross-origin requests (Dropbox) are never intercepted. */
const SHELL='hws-shell-885c9c1cd3';
const ASSETS=['./','index.html','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('hws-shell-')&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
 if(u.pathname.endsWith('/data/data.json')){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(SHELL).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));return}
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{const net=fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(SHELL).then(x=>x.put(e.request,c))}return r}).catch(()=>hit||caches.match('index.html'));return hit||net}))});
