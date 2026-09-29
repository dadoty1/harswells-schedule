/* Plan Room viewer. Sheet bytes come from a same-origin URL (or the offline file cache). No job data is baked in. */
(function(){
'use strict';
function appRoot(){
  let path=location.pathname;
  if(/\/plans\/[^/]*$/.test(path))path=path.replace(/\/plans\/[^/]*$/,'/');
  else if(/\/[^/]+\.html$/.test(path))path=path.replace(/\/[^/]+\.html$/,'/');
  else if(!path.endsWith('/'))path+='/';
  return location.origin+path;
}
function asset(rel){return new URL(rel,appRoot()).href}
function loadPdf(){
  if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);
  return new Promise((res,rej)=>{
    const s=document.createElement('script');
    s.src=asset('vendor/pdf.min.js');
    s.onload=()=>{
      if(!window.pdfjsLib){rej(new Error('pdf.js did not load'));return}
      window.pdfjsLib.GlobalWorkerOptions.workerSrc=asset('vendor/pdf.worker.min.js');
      res(window.pdfjsLib);
    };
    s.onerror=()=>rej(new Error('pdf.js did not load'));
    document.head.appendChild(s);
  });
}
function pdfMagic(buf){
  const u=buf instanceof Uint8Array?buf:new Uint8Array(buf||new ArrayBuffer(0));
  const n=Math.min(u.length,1024);
  for(let i=0;i<=n-5;i++){
    if(u[i]===0x25&&u[i+1]===0x50&&u[i+2]===0x44&&u[i+3]===0x46&&u[i+4]===0x2d)return true;
  }
  return false;
}
function isPdfBody(type,buf){
  const ct=String(type||'').toLowerCase();
  if(/text\/html|application\/json|text\/plain|image\/|text\/css|javascript/.test(ct))return false;
  return pdfMagic(buf);
}
async function fileBytes(url){
  const abs=new URL(url,location.href).href;
  try{
    const res=await fetch(abs,{credentials:'omit'});
    if(res){
      const type=res.headers.get('content-type')||'';
      const buf=await res.arrayBuffer();
      if(res.ok&&isPdfBody(type,buf))return buf;
      if(res.ok||/text\/html|application\/json|text\/plain/.test(type.toLowerCase()))throw new Error('This is not a PDF.');
    }
  }catch(e){
    if(e&&e.message==='This is not a PDF.')throw e;
  }
  if(window.caches){
    const box=await caches.open('hws-files');
    const hit=await box.match(abs,{ignoreSearch:true});
    if(hit){
      const type=hit.headers.get('content-type')||'';
      const buf=await hit.arrayBuffer();
      if(!isPdfBody(type,buf))throw new Error('This is not a PDF.');
      return buf;
    }
  }
  throw new Error('Not saved on this phone yet');
}
function quarter(deg){
  const n=Math.round(Number(deg)/90)*90;
  if(!Number.isFinite(n))return 0;
  return ((n%360)+360)%360;
}
/* Default viewport rotation is page.rotate. Passing 0 would drop /Rotate. */
function viewportFor(page,scale,override){
  return page.getViewport({scale,rotation:quarter((page.rotate||0)+(override||0))});
}
async function render(canvas,url){
  const pdfjs=await loadPdf();
  const data=await fileBytes(url);
  let doc;
  try{doc=await pdfjs.getDocument({data,disableRange:true,disableStream:true,disableAutoFetch:true}).promise}
  catch(e){throw new Error('This is not a PDF.')}
  const page=await doc.getPage(1);
  const base=viewportFor(page,1,0);
  const width=Math.max(canvas.parentElement?canvas.parentElement.clientWidth:0,320);
  const scale=Math.min(2.5,Math.max(1,width/base.width));
  const vp=viewportFor(page,scale,0);
  const ctx=canvas.getContext('2d',{alpha:false});
  canvas.width=Math.floor(vp.width);canvas.height=Math.floor(vp.height);
  canvas.dataset.rotate=String(quarter(page.rotate||0));
  await page.render({canvasContext:ctx,viewport:vp}).promise;
  return {pages:doc.numPages,width:canvas.width,height:canvas.height,rotate:quarter(page.rotate||0)};
}
window.HWSPlan={loadPdf,render,asset};
const params=new URLSearchParams(location.search);
const src=params.get('src');
const canvas=document.getElementById('c');
if(src&&canvas){
  const st=document.getElementById('st');
  render(canvas,src).then(info=>{if(st)st.textContent='Showing saved plan · '+info.pages+' page'+(info.pages===1?'':'s')}).catch(e=>{if(st)st.textContent=e.message||'Could not open this plan'})}
})();
