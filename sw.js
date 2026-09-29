/* Harswells service worker. The shell cache name includes the build version, and activate deletes every older shell
   cache so a deploy cannot leave a phone on stuck files. Private data.json is not in the shell: it is cached only
   after the page loads it (stale-while-revalidate) and is copied forward when the version changes. Opened plans and
   files live in hws-files, which is not wiped on deploy. Cross-origin calls and the demo path are ignored. */
const VERSION='db5b11cba1';
const SHELL='hws-shell-'+VERSION;
const DATA='hws-data-'+VERSION;
const FILES='hws-files';
const ASSETS=['./','index.html','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png','plans/viewer.html','plans/viewer.js','vendor/pdf.min.js','vendor/pdf.worker.min.js'];
function dataUrl(url){try{return new URL(url).pathname.endsWith('/data/data.json')}catch(e){return false}}
async function copyData(fromName,dest){
  let box;try{box=await caches.open(fromName)}catch(e){return}
  const reqs=await box.keys();
  for(let i=0;i<reqs.length;i++){
    if(!dataUrl(reqs[i].url))continue;
    const res=await box.match(reqs[i]);
    if(res)await dest.put(reqs[i],res);
  }
}
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(SHELL).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const dest=await caches.open(DATA);
    const keys=await caches.keys();
    await Promise.all(keys.map(async k=>{
      if(k===SHELL||k===DATA||k===FILES)return;
      if(k.startsWith('hws-shell-')||k.startsWith('hws-data-')||k==='hws-data'){
        await copyData(k,dest);
        await caches.delete(k);
      }
    }));
    await self.clients.claim();
    const clients=await self.clients.matchAll({type:'window'});
    clients.forEach(c=>c.postMessage({type:'hws-shell',version:VERSION}));
  })());
});
self.addEventListener('message',e=>{
  if(e.data==='skip-waiting'||(e.data&&e.data.type==='skip-waiting'))self.skipWaiting();
});
async function staleWhileRevalidate(req){
  const cache=await caches.open(DATA);
  const clean=new URL(req.url);
  clean.search='';
  const key=new Request(clean.toString());
  const cached=await cache.match(key);
  const revalidate=req.headers.get('X-HWS-Revalidate')==='1';
  const network=fetch(req).then(async res=>{
    if(res&&res.ok){
      const headers=new Headers(res.headers);
      headers.set('X-HWS-Cache','fresh');
      const body=await res.clone().blob();
      await cache.put(key,new Response(body,{status:res.status,statusText:res.statusText,headers}));
    }
    return res;
  }).catch(()=>null);
  if(!revalidate&&cached){
    network.then(res=>{
      if(!res)return;
      self.clients.matchAll({type:'window'}).then(cs=>cs.forEach(c=>c.postMessage({type:'hws-data-updated'})));
    }).catch(()=>{});
    const headers=new Headers(cached.headers);
    headers.set('X-HWS-Cache','stale');
    const body=await cached.blob();
    return new Response(body,{status:cached.status,statusText:cached.statusText,headers});
  }
  const res=await network;
  if(res)return res;
  if(cached){
    const headers=new Headers(cached.headers);
    headers.set('X-HWS-Cache','stale');
    const body=await cached.blob();
    return new Response(body,{status:200,statusText:'OK',headers});
  }
  return new Response('offline',{status:503,headers:{'Content-Type':'text/plain','X-HWS-Cache':'miss'}});
}
async function cacheFirst(req){
  const hit=await caches.match(req,{ignoreSearch:true});
  if(hit)return hit;
  try{
    const res=await fetch(req);
    if(res&&res.ok){const copy=res.clone();caches.open(SHELL).then(c=>c.put(req,copy)).catch(()=>{})}
    return res;
  }catch(e){
    if(req.mode==='navigate'){const shell=await caches.match('index.html');if(shell)return shell}
    throw e;
  }
}
async function filesThenNet(req){
  const box=await caches.open(FILES);
  const hit=await box.match(req,{ignoreSearch:true});
  if(hit)return hit;
  try{return await fetch(req)}
  catch(e){
    if(req.mode==='navigate'){const shell=await caches.match('index.html');if(shell)return shell}
    throw e;
  }
}
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  let url;try{url=new URL(req.url)}catch(err){return}
  /* This origin only. dropbox.com is another host, so those links are never cached. */
  if(url.origin!==self.location.origin||url.pathname.includes('/demo/')||/(^|\.)dropbox\.com$|(^|\.)dropboxusercontent\.com$/i.test(url.hostname))return;
  if(dataUrl(url)){e.respondWith(staleWhileRevalidate(req));return}
  const shell=ASSETS.some(a=>{
    if(a==='./')return url.pathname.endsWith('/');
    return url.pathname.endsWith('/'+a)||url.pathname.endsWith(a);
  });
  if(shell){e.respondWith(cacheFirst(req));return}
  e.respondWith(filesThenNet(req));
});
