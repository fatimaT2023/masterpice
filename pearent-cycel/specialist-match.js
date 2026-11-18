/* Phase 5 additions to the specialist directory (specialists.js stays the source of the list):
   - "Suggested for {child}": transparent rules from the family's own support answers.
   - Support-area filter (11 areas), demo-profile labels instead of "Verified"/ratings for
     fictional profiles, and a direct "Request a session" action.
   Suggestions are not a diagnosis, referral or clinical assessment. Everyone can browse all. */
(() => {
 'use strict';
 const p=(en,ar)=>({en,ar}),lang=()=>document.documentElement.lang==='ar'?'ar':'en',t=v=>v[lang()];
 const copy={
  title:p('Suggested for {0}','مقترح لـ{0}'),
  lead:p('Based only on the answers you gave in the support questions. This is not a diagnosis or a referral, and you can browse every specialist.','حسب إجاباتكم بأسئلة الدعم بس. هاد مش تشخيص ولا تحويل، وبتقدروا تتصفّحوا كل المختصين.'),
  why:p('Why this suggestion','ليش هالاقتراح'),show:p('Show these specialists','اعرضوا هالمختصين'),showing:p('Showing these specialists','عم نعرض هالمختصين'),
  count:p('{0} on Rafiq','{0} على رفيق'),none:p('None on Rafiq yet','ما في حدا على رفيق لسه'),
  empty:p('Answer the support questions and we will suggest which kind of specialist may help first.','جاوبوا أسئلة الدعم ومنقترح أي نوع مختص ممكن يساعد أول.'),
  answer:p('Answer the support questions','جاوبوا أسئلة الدعم'),all:p('Browse all specialists','تصفّحوا كل المختصين'),
  area:p('Support area','مجال الدعم'),anyArea:p('All support areas','كل مجالات الدعم'),
  request:p('Request a session','اطلبوا جلسة'),demo:p('Demo profile','ملف عرض'),demoHours:p('Demo hours (not live availability)','ساعات عرض (مش مواعيد مباشرة)')
 };
 const fill=(s,v)=>s.split('{0}').join(v);
 // Derived areas for real profiles that do not list support areas themselves.
 const areasBySpecialty={speech:['speech','development','everyday'],development:['development','learning','sensory','genetic','everyday'],psychology:['behaviour','emotional','sleep','everyday'],pediatrician:['medical','feeding','sleep','genetic','development'],occupational:['sensory','development','everyday'],learning:['learning'],behavior:['behaviour','everyday'],nutrition:['feeding'],family:['emotional','behaviour','everyday']};
 let area='',activeSpecialty=null;
 const read=key=>{try{const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[];}catch{return [];}};
 const approved=()=>read('rafiqSpecialists').filter(s=>s?.status==='approved'&&!window.RafiqAccountStatus?.inactive?.({...s,role:'specialist'}));
 const areasOf=s=>Array.isArray(s.supportAreas)&&s.supportAreas.length?s.supportAreas:areasBySpecialty[s.specialtyKey]||[];
 function child(){try{const list=window.RafiqSetup.readChildren();return list.find(c=>c.id===window.RafiqFamily?.selected?.())||list[0]||null;}catch{return null;}}
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
 function applyFilter(key){const select=document.getElementById('specialtyFilter');if(!select)return;if(![...select.options].some(o=>o.value===key)){const o=el('option',undefined,window.RafiqAppointments.t(window.RafiqAppointments.specialtyNames[key]||p(key,key)));o.value=key;select.append(o);}select.value=key;select.dispatchEvent(new Event('change',{bubbles:true}));activeSpecialty=key;panel();document.getElementById('resultCount')?.scrollIntoView({block:'start',behavior:'smooth'});}
 function panel(){
  const anchor=document.getElementById('resultCount');if(!anchor||!window.RafiqAppointments)return;
  let box=document.getElementById('matchPanel');if(!box){box=el('section','match-panel');box.id='matchPanel';box.dataset.noTranslate='';box.setAttribute('aria-labelledby','matchTitle');const row=anchor.parentElement&&anchor.parentElement.querySelector('h2,h3')?anchor.parentElement:anchor;row.before(box);}
  const c=child(),recs=c?window.RafiqAppointments.recommend(c):[],list=approved();box.replaceChildren();
  const h=el('h2');h.id='matchTitle';const parts=t(copy.title).split('{0}');h.append(parts[0]);const b=el('bdi',undefined,c?.name||'');b.setAttribute('data-user-content','');h.append(b,parts[1]||'');box.append(h,el('p','match-lead',t(copy.lead)));
  if(!recs.length){const links=el('div','match-links');const a=el('a',undefined,t(copy.answer));a.href='support-discovery.html'+(c?'?child='+encodeURIComponent(c.id)+'&return=home':'');links.append(a);box.append(el('p',undefined,t(copy.empty)),links);addAreaFilter(box);return;}
  const cards=el('div','match-cards');
  for(const r of recs){const n=list.filter(s=>s.specialtyKey===r.specialty).length,card=el('article','match-card');card.dataset.specialty=r.specialty;if(activeSpecialty===r.specialty)card.setAttribute('aria-current','true');
   card.append(el('strong',undefined,t(r.title)),el('small',undefined,n?fill(t(copy.count),new Intl.NumberFormat(lang()).format(n)):t(copy.none)));
   const ul=el('ul');ul.setAttribute('aria-label',t(copy.why));for(const reason of r.reasons)ul.append(el('li',undefined,t(reason)));card.append(ul);
   if(n){const btn=el('button','appt-btn '+(activeSpecialty===r.specialty?'is-ghost':'is-primary'),t(activeSpecialty===r.specialty?copy.showing:copy.show));btn.type='button';btn.addEventListener('click',()=>applyFilter(r.specialty));card.append(btn);}
   cards.append(card);}
  const links=el('div','match-links');const all=el('button',undefined,t(copy.all));all.type='button';all.addEventListener('click',()=>{activeSpecialty=null;area='';const s=document.getElementById('specialtyFilter');if(s){s.value='all';s.dispatchEvent(new Event('change',{bubbles:true}));}panel();decorate();});links.append(all);
  box.append(cards,links);addAreaFilter(box);
 }
 function addAreaFilter(box){
  const catalog=window.RafiqSupportCatalog;if(!catalog)return;const label=el('label','match-filter');const span=el('span',undefined,t(copy.area));const select=el('select');select.id='supportAreaFilter';
  const any=el('option',undefined,t(copy.anyArea));any.value='';select.append(any);for(const c of catalog.categories){const o=el('option',undefined,t(c.title));o.value=c.id;select.append(o);}select.value=area;
  select.addEventListener('change',()=>{area=select.value;decorate();});label.append(span,select);box.append(label);
 }
 // Card additions after each render of specialists.js (labels, area filter, request action).
 function decorate(){
  const grid=document.getElementById('specialistGrid');if(!grid)return;const list=approved();let shown=0;
  for(const card of grid.querySelectorAll('.specialist-card')){
   const id=card.querySelector('[data-id]')?.dataset.id,s=list.find(x=>x.id===id);if(!s)continue;card.dataset.specialistId=id;
   const hide=!!area&&!areasOf(s).includes(area);card.classList.toggle('match-hidden',hide);if(!hide)shown++;
   if(s.isDemo){const badge=card.querySelector('.verified-badge');const showcase=s.showcase||window.RafiqDemoSpecialists?.showcaseFor?.(s.id,lang());const rich=Array.isArray(showcase?.reviews)&&showcase.reviews.length;if(badge){if(rich){badge.dataset.noTranslate='';badge.textContent=t({en:'✓ Verified by Rafiq',ar:'✓ موثّق من رفيق'});}else{badge.className='demo-profile-badge';badge.dataset.noTranslate='';badge.textContent=t(copy.demo);}}if(rich){const r=card.querySelector('.rating');if(r){r.dataset.noTranslate='';r.textContent='★ '+(showcase.reviews.reduce((a,b)=>a+Number(b.stars||0),0)/showcase.reviews.length).toFixed(1)+' ('+showcase.reviews.length+')';}}else card.querySelector('.rating')?.remove();const hours=[...card.querySelectorAll('.detail-box span')].find(x=>/Published hours|الساعات|ساعات/.test(x.textContent));if(hours){hours.dataset.noTranslate='';hours.textContent=t(copy.demoHours);}}
   const req=card.querySelector('.card-book-button');if(req&&!req.dataset.requestReady){req.dataset.requestReady='1';req.dataset.noTranslate='';}
   if(req)req.textContent=t(copy.request);
  }
  // Languages line and child age in the page language (the original list writes English only).
  for(const line of grid.querySelectorAll('.directory-languages')){const id=line.closest('.specialist-card')?.dataset.specialistId,s=list.find(x=>x.id===id);if(!s)continue;const names={arabic:p('Arabic','العربية'),english:p('English','الإنجليزية'),french:p('French','الفرنسية')};line.dataset.noTranslate='';line.textContent=t(p('Languages: ','اللغات: '))+(Array.isArray(s.languages)?s.languages:[]).map(l=>names[String(l).toLowerCase()]?t(names[String(l).toLowerCase()]):l).join(lang()==='ar'?'، ':', ');}
  const ageNode=document.getElementById('heroProfileAge'),c=child();if(ageNode&&c&&window.RafiqSetup){const a=window.RafiqSetup.childContext(c).chronological;if(a){const ar=lang()==='ar',parts=[[a.years,'year','سنة','سنتين','سنوات'],[a.months,'month','شهر','شهرين','أشهر'],[a.days,'day','يوم','يومين','أيام']].filter(([n])=>n).map(([n,en,one,two,many])=>ar?(n===1?one:n===2?two:n+' '+(n<=10?many:one)):n+' '+en+(n===1?'':'s'));ageNode.dataset.noTranslate='';ageNode.textContent=parts.join(ar?' و':', ');}}
  const count=document.getElementById('resultCount');if(area&&count){count.dataset.noTranslate='';count.textContent=new Intl.NumberFormat(lang()).format(shown)+' · '+t(copy.area);}
 }
 // "Request a session" goes straight to the request form for this specialist.
 document.addEventListener('click',event=>{const btn=event.target.closest?.('.card-book-button');if(!btn)return;const s=approved().find(x=>x.id===btn.dataset.id);if(!s)return;event.preventDefault();event.stopImmediatePropagation();try{sessionStorage.setItem('rafiqSelectedSpecialistId',s.id);sessionStorage.setItem('rafiqSelectedSpecialist',JSON.stringify({...s,name:s.fullName||s.name,price:s.price??s.sessionFee}));location.assign('booking.html');}catch{location.assign('specialist-profile.html?specialist='+encodeURIComponent(s.id));}},true);
 document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.getElementById('specialistGrid');if(!grid)return;
  activeSpecialty=new URLSearchParams(location.search).get('specialty');
  panel();decorate();new MutationObserver(decorate).observe(grid,{childList:true});
  new MutationObserver(()=>{panel();decorate();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 });
 window.RafiqSpecialistMatch={panel,decorate,areasOf,copy};
})();
