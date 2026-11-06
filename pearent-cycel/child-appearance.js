/* Child appearance is a view preference derived from the selected profile. */
(() => {
 'use strict';
 const root=document.documentElement;
 function apply(gender){root.dataset.childAppearance=gender==='male'?'boy':gender==='female'?'girl':'cream';}
 function sync(){
  const form=document.getElementById('childForm');
  if(form){apply(form.querySelector('input[name="gender"]:checked')?.value);return;}
  if(location.pathname.endsWith('/onboarding.html')){apply('');return;}
  try{
   const children=window.RafiqSetup?.readChildren?.()||JSON.parse(localStorage.getItem('rafiqChildren')||'[]');
   const params=new URLSearchParams(location.search);
   const id=(location.pathname.endsWith('/child-profile.html')?params.get('child'):null)||(window.RafiqFamily ? window.RafiqFamily.selected() : localStorage.getItem('rafiqCurrentChildId'));
   const profiles=Array.isArray(children)?children:[];
   apply((profiles.find(child=>child.id===id)||profiles[0])?.gender);
  }catch{apply('');}
 }
 apply('');sync();
 document.addEventListener('DOMContentLoaded',()=>{sync();const form=document.getElementById('childForm');form?.addEventListener('change',event=>{if(event.target.matches('input[name="gender"]'))sync();});form?.addEventListener('reset',()=>queueMicrotask(sync));});
 window.addEventListener('pageshow',sync);
 window.addEventListener('storage',event=>{if(event.key===null||['rafiqChildren','rafiqCurrentChildId'].includes(event.key))sync();});
 document.addEventListener('rafiq-child-change',sync);
})();
