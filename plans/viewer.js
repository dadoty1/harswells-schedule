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
async function fileBytes(url){
  const abs=new URL(url,location.href).href;
  try{
    const res=await fetch(abs,{credentials:'omit'});
    if(res&&res.ok)return await res.arrayBuffer();
  }catch(e){}
  if(window.caches){
    const box=await caches.open('hws-files');
    const hit=await box.match(abs,{ignoreSearch:true});
    if(hit)return await hit.arrayBuffer();
  }
  throw new Error('Not saved on this phone yet');
}
async function render(canvas,url){
  const pdfjs=await loadPdf();
  const data=await fileBytes(url);
  const doc=await pdfjs.getDocument({data,disableRange:true,disableStream:true,disableAutoFetch:true}).promise;
  const page=await doc.getPage(1);
  const base=page.getViewport({scale:1});
  const width=Math.max(canvas.parentElement?canvas.parentElement.clientWidth:0,320);
  const scale=Math.min(2.5,Math.max(1,width/base.width));
  const vp=page.getViewport({scale});
  const ctx=canvas.getContext('2d',{alpha:false});
  canvas.width=Math.floor(vp.width);canvas.height=Math.floor(vp.height);
  await page.render({canvasContext:ctx,viewport:vp}).promise;
  return {pages:doc.numPages,width:canvas.width,height:canvas.height};
}
window.HWSPlan={loadPdf,render,asset};
const params=new URLSearchParams(location.search);
const src=params.get('src');
const canvas=document.getElementById('c');
if(src&&canvas){
  const st=document.getElementById('st');
  render(canvas,src).then(info=>{if(st)st.textContent='Showing saved plan · '+info.pages+' page'+(info.pages===1?'':'s')}).catch(e=>{if(st)st.textContent=e.message||'Could not open this plan'})}
})();
