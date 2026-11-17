/* Phase 5 demo bridge for Specialist pages. Only when a page is opened inside the parent
   demo preview while "viewing as a specialist" does it use the preview's shared demo store,
   so a parent's request and the specialist's reply are the same fictional records.
   Opened normally (real accounts), this file does nothing. Must load before other scripts. */
(() => {
 'use strict';
 let host;
 try{if(window.parent!==window&&window.parent.RafiqParentPreview)host=window.parent.RafiqParentPreview;}catch{host=null;}
 if(!host||typeof host.isDemoRole!=='function'||!host.isDemoRole('specialist'))return;
 try{
  const store=host.connect(window);
  Object.defineProperty(window,'localStorage',{value:store.local,configurable:true});
  Object.defineProperty(window,'sessionStorage',{value:store.session,configurable:true});
  if(store.indexedDB)Object.defineProperty(window,'indexedDB',{value:store.indexedDB,configurable:true});
  window.RafiqParentPreview=host;document.documentElement.dataset.demoPreview='specialist';
  // In the demo, "Log out" returns to the parent view instead of leaving the shared demo.
  document.addEventListener('click',event=>{const button=event.target.closest?.('#logoutButton');if(!button||typeof host.viewAs!=='function')return;event.preventDefault();event.stopImmediatePropagation();host.viewAs('parent');},true);
 }catch{/* Falls back to the page's normal behaviour. */}
})();
