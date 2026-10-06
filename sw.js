/* Harswells service worker. The shell cache name includes the build version, and activate deletes every older shell
   cache so a deploy cannot leave a phone on stuck files. index.html (and the directory URL) is network-first while
   online, so a stale shell cannot persist; offline still uses the cached shell. sw.js and version.json are not
   intercepted. Private data.json is not in the shell: it is cached only
   after the page loads it (stale-while-revalidate) and is copied forward when the version changes. Opened plans and
   files live in hws-files, which is not wiped on deploy. Cross-origin calls and the demo path are ignored. */
const VERSION='be6bc1d6ff';
const DOC_NETWORK_FIRST=true;
const SHELL='hws-shell-'+VERSION;
const DATA='hws-data-'+VERSION;
const FILES='hws-files';
/* CAD viewer, worker, and wasm. Runtime only: not listed in ASSETS, so the shell
   install does not download LibreDWG. v1 bumps this cache without a shell change. */
const CAD='hws-cad-v1-'+VERSION;
const ASSETS=['./','index.html','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png','plans/viewer.html','plans/viewer.js','vendor/pdf.min.js','vendor/pdf.worker.min.js','vendor/pdf-lib.min.js','plan-room/preview/index.html','plan-room/preview/vendor/pdf.min.mjs','plan-room/preview/vendor/pdf.worker.min.mjs'];
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
/* A new build only deletes old hws-shell-* and hws-data-* Cache Storage. It does not
   clear localStorage or IndexedDB, and hws-files is kept. Sign-in is mirrored in IndexedDB
   (see sync.js) because iOS can still drop localStorage when this cache is replaced. */
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const dest=await caches.open(DATA);
    const keys=await caches.keys();
    await Promise.all(keys.map(async k=>{
      if(k===SHELL||k===DATA||k===FILES||k===CAD)return;
      if(k.startsWith('hws-cad-')){await caches.delete(k);return}
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
  const d=e.data;
  const t=d&&d.type;
  if(d==='skip-waiting'||t==='skip-waiting'||d==='SKIP_WAITING'||t==='SKIP_WAITING')self.skipWaiting();
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
      headers.delete('X-HWS-Net');
      const body=await res.clone().blob();
      await cache.put(key,new Response(body,{status:res.status,statusText:res.statusText,headers}));
    }
    return res;
  }).catch(()=>null);
  /* A cache hit while revalidating is not an offline mode. X-HWS-Net: 0 is set only when
     the network attempt itself failed, and that response is never stored. */
  async function serveCached(hit, failed){
    const headers=new Headers(hit.headers);
    headers.set('X-HWS-Cache','stale');
    if(failed) headers.set('X-HWS-Net','0');
    else headers.delete('X-HWS-Net');
    const body=await hit.blob();
    return new Response(body,{status:200,statusText:'OK',headers});
  }
  if(!revalidate&&cached){
    network.then(res=>{
      if(!res||!res.ok)return;
      self.clients.matchAll({type:'window'}).then(cs=>cs.forEach(c=>c.postMessage({type:'hws-data-updated'})));
    }).catch(()=>{});
    return serveCached(cached, false);
  }
  const res=await network;
  /* status 0 is a dropped connection (WebKit abort / iOS blip), not an HTTP answer. */
  if(res&&res.status!==0)return res;
  if(cached)return serveCached(cached, true);
  return new Response('offline',{status:503,headers:{'Content-Type':'text/plain','X-HWS-Cache':'miss','X-HWS-Net':'0'}});
}
function documentPdf(req){try{
  const u=new URL(req.url);
  if(!/\.pdf$/i.test(u.pathname))return false;
  return req.mode==='navigate'||req.destination==='document'||req.destination==='iframe';
}catch(e){return false}}
function pdfRequest(req){try{
  if(documentPdf(req))return false;
  const u=new URL(req.url);
  return /\.pdf$/i.test(u.pathname);
}catch(e){return false}}
function appRoot(){return new URL('./', self.location.href);}
function pdfHtml(req,res){
  if(!pdfRequest(req)||!res)return false;
  const ct=(res.headers.get('content-type')||'').toLowerCase();
  return ct.indexOf('text/html')>=0||ct.indexOf('application/json')>=0;
}
function pdfMiss(){return new Response('Not a PDF',{status:415,headers:{'Content-Type':'text/plain','X-HWS-Cache':'not-pdf'}})}
/* A PDF request never receives the app shell. An HTML or JSON body (a Pages fallback, a
   sign-in page, a 404 document) is replaced before the viewer can hand it to pdf.js. */
function pdfOrPass(req,res){return pdfHtml(req,res)?pdfMiss():res}
async function cacheFirst(req){
  const hit=await caches.match(req,{ignoreSearch:true});
  if(hit&&!pdfHtml(req,hit))return hit;
  if(pdfRequest(req)&&!self.navigator.onLine)return pdfMiss();
  try{
    const res=await fetch(req);
    const safe=pdfOrPass(req,res);
    if(safe===res&&res&&res.ok){const copy=res.clone();caches.open(SHELL).then(c=>c.put(req,copy)).catch(()=>{})}
    return safe;
  }catch(e){
    if(pdfRequest(req))return pdfMiss();
    if(req.mode==='navigate'){const shell=await caches.match('index.html');if(shell)return shell}
    throw e;
  }
}
async function runtimeCad(req){
  const cache=await caches.open(CAD);
  const hit=await cache.match(req,{ignoreSearch:true});
  if(hit)return hit;
  const res=await fetch(req);
  if(res&&res.ok){const copy=res.clone();cache.put(req,copy).catch(()=>{})}
  return res;
}
async function filesThenNet(req){
  const box=await caches.open(FILES);
  const hit=await box.match(req,{ignoreSearch:true});
  if(hit&&!pdfHtml(req,hit))return hit;
  if(pdfRequest(req)&&!self.navigator.onLine)return pdfMiss();
  try{return pdfOrPass(req,await fetch(req))}
  catch(e){
    if(pdfRequest(req))return pdfMiss();
    if(req.mode==='navigate'){const shell=await caches.match('index.html');if(shell)return shell}
    throw e;
  }
}
function updateScript(url){
  return /\/sw\.js$/i.test(url.pathname)||/\/version\.json$/i.test(url.pathname);
}
function appDocument(url){
  return url.pathname.endsWith('/index.html')||url.pathname.endsWith('/');
}
async function networkFirstDoc(req){
  let res=null;
  try{
    res=await fetch(new Request(req.url,{cache:'no-store',credentials:'same-origin',redirect:'follow',headers:{'X-HWS-Shell-Net':'1'}}));
  }catch(e){
    try{res=await fetch(req)}catch(err){res=null}
  }
  if(res&&res.ok){
    try{
      const box=await caches.open(SHELL);
      try{await box.put(new Request(req.url), res.clone())}catch(e){}
      try{await box.put('index.html', res.clone())}catch(e){}
    }catch(e){}
    return res;
  }
  const hit=await caches.match(req,{ignoreSearch:true});
  if(hit)return hit;
  const shell=await caches.match('index.html');
  if(shell)return shell;
  if(res)return res;
  return fetch(req);
}
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  /* The worker's own index.html fetch carries this header. Letting it through
     reaches the network; answering it from cache would keep the old shell. */
  if(req.headers.get('X-HWS-Shell-Net')==='1')return;
  let url;try{url=new URL(req.url)}catch(err){return}
  /* A document load is the app. Safari shows a PDF error when the address ends in .pdf,
     including an OAuth return (?code=) onto that path. Send those to the app root and
     keep the query so sign-in can finish. This worker's shell cache is versioned, so an
     older cached index (and its click handler) is deleted on activate. */
  if(documentPdf(req)){
    const dest=appRoot();
    dest.search=url.search;
    dest.hash=url.hash;
    e.respondWith(Response.redirect(dest.href, 302));
    return;
  }
  /* sw.js and version.json are how the page sees a new build. Never cache them. */
  if(updateScript(url))return;
  /* This origin only. dropbox.com is another host, so those links are never cached. */
  if(url.origin!==self.location.origin||url.pathname.includes('/demo/')||/(^|\.)dropbox\.com$|(^|\.)dropboxusercontent\.com$/i.test(url.hostname))return;
  /* Account numbers. The page asks with cache no-store. Do not answer from the file cache. */
  if(/\/api\/job\/[a-z0-9-]+\/property$/i.test(url.pathname))return;
  if(url.pathname.indexOf('/plan-room/cad/')>=0){e.respondWith(runtimeCad(req));return}
  if(dataUrl(url)){e.respondWith(staleWhileRevalidate(req));return}
  /* Online document loads take the network copy and refresh the shell cache.
     Offline keeps the cached shell so the app still opens. */
  if(DOC_NETWORK_FIRST&&self.navigator.onLine&&appDocument(url)&&(req.mode==='navigate'||req.destination==='document')){
    e.respondWith(networkFirstDoc(req));
    return;
  }
  const shell=ASSETS.some(a=>{
    if(a==='./')return url.pathname.endsWith('/');
    return url.pathname.endsWith('/'+a)||url.pathname.endsWith(a);
  });
  if(shell){e.respondWith(cacheFirst(req));return}
  e.respondWith(filesThenNet(req));
});
