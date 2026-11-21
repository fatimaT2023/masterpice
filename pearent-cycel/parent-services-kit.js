/* Phase 4 shared helpers for self-bilingual parent service views.
   Views built with this kit carry data-no-translate and re-render on <html lang> change. */
(() => {
 'use strict';
 const p=(en,ar)=>({en,ar});
 const lang=()=>document.documentElement.lang==='ar'?'ar':'en';
 const t=v=>v&&typeof v==='object'?v[lang()]:v;
 const num=v=>new Intl.NumberFormat(lang()==='ar'?'ar':'en').format(v);
 const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
 // Existing Arabic for shared library text (dictionary loaded before DOMContentLoaded).
 const dict=s=>lang()==='ar'?(window.RafiqHomeArabic?.[norm(s)]||s):s;
 function ageLabel(age){
  if(!age)return '';const ar=lang()==='ar';
  const parts=[[age.years,'year','سنة','سنتين','سنوات'],[age.months,'month','شهر','شهرين','أشهر'],[age.days,'day','يوم','يومين','أيام']].filter(([n])=>n).map(([n,en,one,two,many])=>ar?(n===1?one:n===2?two:num(n)+' '+(n<=10?many:one)):n+' '+en+(n===1?'':'s'));
  return parts.length?parts.join(ar?' و':', '):(ar?'أقل من يوم':'Under one day');
 }
 function date(value){const d=value instanceof Date?value:new Date(String(value).length===10?value+'T12:00:00':value);return Number.isNaN(d.getTime())?'':d.toLocaleDateString(lang()==='ar'?'ar':'en',{year:'numeric',month:'short',day:'numeric'});}
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined&&text!==null)n.textContent=text;return n;};
 const link=(text,href,cls)=>{const a=el('a',cls,text);a.href=href;return a;};
 const icons={
  book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  music:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  talk:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/>',
  look:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  blocks:'<rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><rect x="8" y="3" width="8" height="8" rx="1.5"/>',
  move:'<circle cx="13" cy="4" r="2"/><path d="M8 22l3-7 3 3v4M6 12l3-4 4 1 3 3 3 1"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bag:'<path d="M6 7h12l1 14H5z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
  child:'<circle cx="12" cy="6" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2"/>',
  star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',skip:'<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>',
  puzzle:'<path d="M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3z"/>',
  syringe:'<path d="M18 2l4 4M17 7l-9.5 9.5M14 4l6 6M3 21l3-3M6 18l-1.5-4.5L13 5l6 6-8.5 8.5z"/>',
  ruler:'<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
  note:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  steth:'<path d="M5 3v6a5 5 0 0 0 10 0V3"/><path d="M10 14v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="12" r="2"/>',
  people:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 5 4.5"/>',
  brain:'<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
  ear:'<path d="M6 9a6 6 0 1 1 12 0c0 3-2 4-3 5.5S14 18 12 20a3 3 0 0 1-5-1"/><path d="M9 9a3 3 0 0 1 6 0"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
  spoon:'<path d="M7 3c-2 0-3 2-3 4s1.5 4 3 4 3-2 3-4-1-4-3-4zM7 11v10M17 3v18M14 3v5a3 3 0 0 0 6 0V3"/>',
  dna:'<path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12"/><path d="M8 7h8M8 17h8"/>',
  home:'<path d="M3 11l9-8 9 8v10H3z"/><path d="M9 21v-6h6v6"/>',
  wave:'<path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  speaker:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
  mute:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l4 6M21 9l-4 6"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'
 };
 const svg=(name,size=22)=>'<svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+(icons[name]||icons.heart)+'</svg>';
 const icon=(name,cls='ps-icon',size)=>{const s=el('span',cls);s.innerHTML=svg(name,size);return s;};
 // Re-run a render function whenever the page language changes.
 const watchers=new Set();
 const onLang=fn=>{watchers.add(fn);return fn;};
 new MutationObserver(()=>watchers.forEach(fn=>{try{fn();}catch{/* One view must not block others. */}})).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 // Child name stays as the family typed it, isolated for mixed-direction text.
 const name=(child,fallback=p('Your child','طفلكم'))=>{const b=el('bdi',undefined,child?.name||t(fallback));b.setAttribute('data-user-content','');return b;};
 window.RafiqServicesKit={p,t,lang,num,dict,ageLabel,date,el,link,svg,icon,icons,onLang,name};
})();
