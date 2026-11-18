/* Runs before every parent page controller. Native storage is never used for
   new clinical input. The outer same-origin preview owns volatile state. */
(() => {
 'use strict';let host;
 try{if(window.parent!==window&&window.parent.RafiqParentPreview)host=window.parent.RafiqParentPreview;else if(window.opener?.RafiqParentPreview)host=window.opener.RafiqParentPreview;}catch{}
 if(!host){
  const page=location.pathname.split('/').pop()+location.search+location.hash;
  const destination='parent-preview.html?page='+encodeURIComponent(page);
  window.stop();document.open();document.write('<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>RAFIQ</title><body><p>جاري فتح العرض التجريبي المؤقت · Opening temporary preview</p></body></html>');document.close();location.replace(destination);return;
 }
 try{
  // Inside the preview all data lives in the in-memory store, which sends its own (untrusted) storage events.
  // Real browser storage events (e.g. the shell saving rafiqPreviewState) must not make pages reload in a loop.
  window.addEventListener('storage',event=>{if(event.isTrusted)event.stopImmediatePropagation();},true);
  // Loading veil: hide the half-built (English) page until scripts have translated and rendered it.
  try{
   let ar=true;try{ar=(window.parent.localStorage.getItem('rafiqLanguage')||'ar')!=='en';}catch{}
   const veil=document.createElement('div');veil.id='rafiqPageVeil';veil.setAttribute('role','status');veil.setAttribute('aria-live','polite');
   veil.style.cssText='position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:linear-gradient(180deg,#fdf1f4,#f6eef3);color:#28675f;font:600 16px/1.6 Tahoma,Arial,sans-serif;transition:opacity .18s ease';
   veil.innerHTML='<span style="display:grid;place-items:center;width:52px;height:52px;border-radius:16px;background:#28675f;color:#fff;font-size:24px;font-weight:700">'+(ar?'ر':'R')+'</span><span style="width:34px;height:34px;border-radius:50%;border:3px solid #cfe6dc;border-top-color:#28675f;animation:rafiqVeilSpin .8s linear infinite"></span><span>'+(ar?'لحظة، عم نجهّز صفحتكم…':'One moment, getting your page ready…')+'</span><style>@keyframes rafiqVeilSpin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){#rafiqPageVeil span{animation:none!important}}</style>';
   document.documentElement.append(veil);
   const lift=()=>{if(!veil.isConnected)return;veil.style.opacity='0';setTimeout(()=>veil.remove(),190);};
   window.addEventListener('load',()=>setTimeout(lift,80),{once:true});setTimeout(lift,7000);
  }catch{}
  const store=host.connect(window);Object.defineProperty(window,'localStorage',{value:store.local,configurable:true});Object.defineProperty(window,'sessionStorage',{value:store.session,configurable:true});Object.defineProperty(window,'indexedDB',{value:store.indexedDB,configurable:true});window.RafiqParentPreview=host;window.RafiqParentStorage=store.local;window.RafiqParentPreviewMode={active:true,readOnly:store.readOnly};
  document.addEventListener('click',event=>{const target=event.target.closest?.('a,button');if(target?.matches('#logoutButton,[data-setup-exit]')){host.signOut();return;}const link=target?.closest('a');if(!link)return;const url=new URL(link.href,location.href);if(url.origin===location.origin&&!host.isParentURL(url.href)&&!link.hasAttribute('download')&&!url.pathname.match(/\.(?:pdf|png|jpg|jpeg|webp|svg|ics)$/i)){event.preventDefault();event.stopImmediatePropagation();host.boundary(url.href);}},true);
  document.addEventListener('DOMContentLoaded',()=>{const language=()=>host.languageChanged(document.documentElement.lang);language();new MutationObserver(language).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});if(store.readOnly)document.addEventListener('submit',event=>{event.preventDefault();event.stopImmediatePropagation();host.notify('readonly');},true);});
 }catch{
  window.stop();document.open();document.write('<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>RAFIQ</title><body><p>تعذّر فتح العرض الآمن للبيانات. لم تتغير السجلات القديمة. · Preview unavailable. Saved records were not changed.</p></body></html>');document.close();
 }
})();
