/* Phase 4 health overview: what is recorded for this child, at a glance, with the
   existing actions. Values are shown as the family entered them; nothing is
   interpreted, scheduled or compared. Demo fixtures (isDemo) are labelled.
   Requires parent-services-kit.js and health-records.js. */
(() => {
 'use strict';
 const K=window.RafiqServicesKit,{p,t,num,el}=K;
 const copy={
  title:p('{0}’s health at a glance','صحة {0} بلمحة'),
  lead:p('Only what your family saved. Rafiq does not create medical records or a vaccination schedule.','بس اللي حفظته عيلتكم. رفيق ما بيعمل سجلات طبية ولا جدول مطاعيم.'),
  vaccines:p('Vaccines received','المطاعيم اللي أخذها'),noVaccine:p('None saved yet. An empty list does not mean a vaccine was missed.','لسه ما في ولا وحدة محفوظة. القائمة الفاضية ما بتعني إنه فات مطعوم.'),lastVaccine:p('Latest: {0}','آخر واحد: {0}'),
  measure:p('Height and weight','الطول والوزن'),noMeasure:p('No measurement saved yet.','لسه ما في قياس محفوظ.'),measuredOn:p('Measured {0}','انقاس {0}'),
  notes:p('Health notes','ملاحظات صحية'),noNotes:p('Visits, questions, symptoms or medicine notes in your words.','زيارات أو أسئلة أو أعراض أو أدوية، بكلامكم.'),notesHelp:p('{0} checkup · {1} symptom · {2} medicine','{0} فحص · {1} أعراض · {2} أدوية'),
  visits:p('Appointments','المواعيد'),noVisit:p('No upcoming appointment for this child.','ما في موعد جاي لهالطفل.'),nextVisit:p('Next: {0}','الجاي: {0}'),
  add:p('Add','أضيفوا'),show:p('Show','اعرضوا'),open:p('Open appointments','افتحوا المواعيد'),find:p('Find a specialist','لاقوا مختص'),
  demo:p('Demo example','مثال تجريبي'),demoHelp:p('Records marked “Demo example” are fictional preview data, not this child’s real information.','السجلات المعلّمة «مثال تجريبي» هي بيانات عرض وهمية، مش معلومات حقيقية عن الطفل.'),
  cm:p('cm','سم'),kg:p('kg','كغ')
 };
 const fill=(s,...v)=>v.reduce((out,x,i)=>out.split('{'+i+'}').join(x),s);
 let state=null;
 function read(type){try{return window.RafiqHealthRecords.read(type,state.child.id).filter(r=>!r._deletedAt);}catch{return [];}}
 function upcoming(){try{const rows=JSON.parse(localStorage.getItem('rafiqBookings')||'[]');const today=new Date();today.setHours(0,0,0,0);return (Array.isArray(rows)?rows:[]).filter(b=>b?.childId===state.child.id&&!/cancel|declin|reject/i.test(b.status||'')&&b.date&&new Date(b.date+'T12:00:00')>=today).sort((a,b)=>String(a.date+a.time).localeCompare(String(b.date+b.time)))[0]||null;}catch{return null;}}
 function show(type){const f=document.getElementById('healthRecordFilter');if(!f)return;f.value=type;f.dispatchEvent(new Event('change'));document.getElementById('healthHistory')?.scrollIntoView({block:'start'});}
 function add(type){document.querySelector('[data-record="'+type+'"]')?.click();}
 const btn=(text,fn)=>{const b=el('button',undefined,text);b.type='button';b.addEventListener('click',fn);return b;};
 function tile(icon,title,value,help,actions,isText=false){const li=el('li','ps-tile');const h=el('div','ps-tile-head');h.append(K.icon(icon),el('strong',undefined,title));li.append(h,el('span','ps-value'+(isText?' is-text':''),value));if(help)li.append(el('p',undefined,help));const a=el('div','ps-tile-actions');a.append(...actions);li.append(a);return li;}
 function render(){
  if(!state)return;const {child}=state;
  let panel=document.getElementById('healthOverview');
  if(!panel){panel=el('section','ps-panel');panel.id='healthOverview';panel.dataset.noTranslate='';panel.setAttribute('aria-labelledby','healthOverviewTitle');const content=document.getElementById('healthContent');content?.prepend(panel);}
  const vaccines=read('vaccine').sort((a,b)=>String(b.date).localeCompare(String(a.date))),growth=read('growth').sort((a,b)=>String(b.date).localeCompare(String(a.date))),notes=read('note');
  const head=el('header'),txt=el('div'),h=el('h2');h.id='healthOverviewTitle';h.append(...fill(t(copy.title),'\u0000').split('\u0000').flatMap((s,i)=>i?[K.name(child),s]:[s]));txt.append(h,el('p','ps-lead',t(copy.lead)));head.append(K.icon('heart'),txt);
  const tiles=el('ul','ps-tiles');
  const lastV=vaccines[0];
  tiles.append(tile('syringe',t(copy.vaccines),num(vaccines.length),lastV?fill(t(copy.lastVaccine),(lastV.name||'')+' · '+K.date(lastV.date)):t(copy.noVaccine),[btn(t(copy.add),()=>add('vaccine')),...(vaccines.length?[btn(t(copy.show),()=>show('vaccine'))]:[])]));
  const m=growth[0];const mv=m?[m.height!=null&&m.height!==''?num(Number(m.height))+' '+t(copy.cm):'',m.weight!=null&&m.weight!==''?num(Number(m.weight))+' '+t(copy.kg):''].filter(Boolean).join(' · '):'—';
  tiles.append(tile('ruler',t(copy.measure),mv,m?fill(t(copy.measuredOn),K.date(m.date)):t(copy.noMeasure),[btn(t(copy.add),()=>add('growth')),...(growth.length?[btn(t(copy.show),()=>show('growth'))]:[])],!!m));
  const c=k=>num(notes.filter(n=>n.category===k).length);
  tiles.append(tile('note',t(copy.notes),num(notes.length),notes.length?fill(t(copy.notesHelp),c('checkup'),c('symptom'),c('medication')):t(copy.noNotes),[btn(t(copy.add),()=>add('note')),...(notes.length?[btn(t(copy.show),()=>show('note'))]:[])]));
  const next=upcoming();
  tiles.append(tile('calendar',t(copy.visits),next?K.date(next.date)+(next.time?' · '+next.time:''):'—',next?fill(t(copy.nextVisit),next.specialistName||''):t(copy.noVisit),[K.link(t(copy.open),'bookings.html'),K.link(t(copy.find),'specialists.html?specialty=pediatrician')],!!next));
  const parts=[head,tiles];
  if([...vaccines,...growth,...notes].some(r=>r.isDemo))parts.push(el('p','ps-source',t(copy.demoHelp)));
  panel.replaceChildren(...parts);
 }
 function decorate(article,record){if(!record?.isDemo)return;const b=el('span','ps-badge is-demo',t(copy.demo));b.dataset.noTranslate='';article.querySelector('h3')?.after(b);}
 function mount(child,rerender){state={child,rerender};render();K.onLang(()=>{render();state.rerender?.();});}
 window.RafiqHealthView={mount,refresh:render,decorate,copy};
})();
