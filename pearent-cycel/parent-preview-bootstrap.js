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
  const store=host.connect(window);Object.defineProperty(window,'localStorage',{value:store.local,configurable:true});Object.defineProperty(window,'sessionStorage',{value:store.session,configurable:true});Object.defineProperty(window,'indexedDB',{value:store.indexedDB,configurable:true});window.RafiqParentPreview=host;window.RafiqParentStorage=store.local;window.RafiqParentPreviewMode={active:true,readOnly:store.readOnly};
  document.addEventListener('click',event=>{const target=event.target.closest?.('a,button');if(target?.matches('#logoutButton,[data-setup-exit]')){host.signOut();return;}const link=target?.closest('a');if(!link)return;const url=new URL(link.href,location.href);if(url.origin===location.origin&&!host.isParentURL(url.href)&&!link.hasAttribute('download')&&!url.pathname.match(/\.(?:pdf|png|jpg|jpeg|webp|svg|ics)$/i)){event.preventDefault();event.stopImmediatePropagation();host.boundary(url.href);}},true);
  document.addEventListener('DOMContentLoaded',()=>{const language=()=>host.languageChanged(document.documentElement.lang);language();new MutationObserver(language).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});if(store.readOnly)document.addEventListener('submit',event=>{event.preventDefault();event.stopImmediatePropagation();host.notify('readonly');},true);});
 }catch{
  window.stop();document.open();document.write('<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>RAFIQ</title><body><p>تعذّر فتح العرض الآمن للبيانات. لم تتغير السجلات القديمة. · Preview unavailable. Saved records were not changed.</p></body></html>');document.close();
 }
})();
