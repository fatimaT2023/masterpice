/* Phase 4 growth journal view: CDC checklist examples by area, an optional area
   tag for new notes, and a summary of what has been recorded. Counts describe
   records, never a developmental score; nothing is compared against milestones.
   Requires parent-services-kit.js and milestones-cdc.js. */
(() => {
 'use strict';
 const K=window.RafiqServicesKit,{p,t,num,el}=K;
 const copy={
  stageNow:p('Their stage now','مرحلتهم هلّق'),
  lead:p('What most children can do by {0}, from the CDC checklist. Every child develops at their own pace. This is not a test or a score.','شو بيقدروا أغلب الأطفال يعملوا بعمر {0}، من قائمة CDC. كل طفل بيكبر على راحته. هاد مش اختبار ولا علامة.'),
  under2:p('CDC checklists start at 2 months. For now, simply notice and enjoy your baby’s cues.','قوائم CDC بتبلّش من عمر شهرين. هلّق، بس لاحظوا إشارات طفلكم واستمتعوا فيها.'),
  unsupported:p('Personalised content covers birth until the seventh birthday. Your saved observations remain available.','المحتوى المخصّص بيغطي من الولادة لعيد الميلاد السابع. ملاحظاتكم المحفوظة بتضل متاحة.'),
  needsDue:p('Add the expected due date in child details to choose resources by corrected age.','أضيفوا موعد الولادة المتوقع ببيانات الطفل لنختار المصادر حسب العمر المصحّح.'),
  gridTitle:p('From the CDC checklist for {0}','من قائمة CDC لعمر {0}'),
  gridLead:p('Examples to notice in everyday life, in four areas. Tap an area to write down something you saw.','أمثلة تلاحظوها بالحياة اليومية، بأربع مجالات. اضغطوا على مجال لتكتبوا شي شفتوه.'),
  noteArea:p('Note something about this','سجّلوا ملاحظة عن هالمجال'),
  areaNotes:p('{0} notes in this area','{0} ملاحظات بهالمجال'),areaNone:p('No notes in this area yet','لسه ما في ملاحظات بهالمجال'),
  sourceText:p('Source: CDC “Learn the Signs. Act Early.” checklist for {0}, paraphrased. The full list is on the CDC page (English). Talk with your care team about any question.','المصدر: قائمة CDC «تعرّفوا على العلامات، تصرّفوا بدري» لعمر {0}، بصياغة مبسّطة. القائمة الكاملة على صفحة CDC (بالإنجليزي). احكوا مع فريق الرعاية عن أي سؤال.'),
  sourceLink:p('Open the full CDC checklist ↗','افتحوا قائمة CDC الكاملة ↗'),
  pickLegend:p('Which area is it about? (optional)','عن أي مجال؟ (اختياري)'),other:p('Something else','شي ثاني'),
  progTitle:p('What you have recorded','شو سجّلتوا لحد هلّق'),
  progLead:p('A summary of {0}’s saved records. It counts entries; it does not measure development.','ملخص سجلات {0} المحفوظة. بيعدّ الملاحظات، وما بيقيس النمو.'),
  family:p('Family observations','ملاحظات العيلة'),familyHelp:p('Everyday things you noticed and wrote down.','أشياء يومية لاحظتوها وكتبتوها.'),
  activity:p('Activity results','نتائج الأنشطة'),activityHelp:p('{0} tried together.','{0} جرّبتوها سوا.'),
  questions:p('Questions and concerns','أسئلة ومخاوف'),questionsHelp:p('Questions you wrote down to discuss.','أسئلة كتبتوها لتناقشوها.'),
  reports:p('Specialist reports','تقارير المختصين'),reportsHelp:p('Written by a specialist after a session. Open them from appointments.','بيكتبها مختص بعد الجلسة. افتحوها من المواعيد.'),
  open:p('Open appointments and reports','افتحوا المواعيد والتقارير'),seeNotes:p('See saved notes','شوفوا الملاحظات'),
  familyBadge:p('Family observation','ملاحظة من العيلة'),proBadge:p('Professional assessment','تقييم مختص'),
  legend:p('Notes you write are family observations. Only a specialist’s report is a professional assessment.','الملاحظات اللي بتكتبوها هي ملاحظات العيلة. بس تقرير المختص هو تقييم مهني.')
 };
 const fill=(s,...v)=>v.reduce((out,x,i)=>out.replace('{'+i+'}',x),s);
 function checkpointLabel(month){if(month>=24&&month%12===0){const y=month/12;return K.lang()==='ar'?(y===2?'سنتين':num(y)+' سنوات'):y+' years';}return K.lang()==='ar'?num(month)+' شهر':month+' months';}
 let state=null,area=null;
 const areaOf=note=>window.RafiqMilestoneGuide.domains[note?.area]?note.area:'';
 function reports(child){try{const rows=JSON.parse(localStorage.getItem('rafiqSpecialistReports')||'[]');return Array.isArray(rows)?rows.filter(r=>r?.childId===child.id).length:0;}catch{return 0;}}
 function stage(){
  const {child,context}=state,guide=window.RafiqMilestoneGuide.forContext(context);
  const h=document.getElementById('growthStage'),d=document.getElementById('growthStageDescription');
  for(const n of [h,d,document.getElementById('growthSourceDescription'),document.getElementById('growthSource'),document.querySelector('.stage-skills-title-row')])if(n)n.dataset.noTranslate='';
  if(h)h.textContent=K.ageLabel(context.chronological)||t(copy.stageNow);
  if(d)d.textContent=!context.supported?t(copy.unsupported):context.needsDueDate?t(copy.needsDue):guide?fill(t(copy.lead),checkpointLabel(guide.month)):t(copy.under2);
  const grid=document.getElementById('stageSkillsGrid'),row=document.querySelector('.stage-skills-title-row');
  if(row){row.replaceChildren();if(guide)row.append(el('h3',undefined,fill(t(copy.gridTitle),checkpointLabel(guide.month))),el('p',undefined,t(copy.gridLead)));}
  if(grid){grid.replaceChildren();grid.className='ps-domains';grid.hidden=!guide;
   if(guide)for(const [key,domain] of Object.entries(window.RafiqMilestoneGuide.domains)){
    const card=el('article','ps-domain');card.dataset.area=key;const head=el('div','ps-tile-head');head.append(K.icon(domain.icon),el('h4',undefined,t(domain)));
    const list=el('ul');for(const item of guide.items[key]||[])list.append(el('li',undefined,t(item)));
    const count=state.getNotes().filter(n=>(!n.childId||n.childId===child.id)&&areaOf(n)===key).length;
    const btn=el('button',undefined,t(copy.noteArea));btn.type='button';btn.addEventListener('click',()=>pick(key,true));
    card.append(head,list,el('p','ps-count',count?fill(t(copy.areaNotes),num(count)):t(copy.areaNone)),btn);grid.append(card);
   }}
  const src=document.getElementById('growthSourceDescription');if(src)src.textContent=guide?fill(t(copy.sourceText),checkpointLabel(guide.month)):'';
  const link=document.getElementById('growthSource');if(link&&guide){link.textContent=t(copy.sourceLink);link.href=guide.resource.source.url;}
  const box=document.getElementById('growthSourceBox');if(box)box.hidden=!guide;
 }
 function picker(){
  const form=document.getElementById('growthNoteForm'),target=document.getElementById('growthNote')?.closest('.form-row');if(!form||!target)return;
  let box=document.getElementById('growthAreaPick');if(!box){box=el('fieldset','ps-area-pick');box.id='growthAreaPick';box.dataset.noTranslate='';target.before(box);}
  box.replaceChildren(el('legend',undefined,t(copy.pickLegend)));
  for(const [key,domain] of [...Object.entries(window.RafiqMilestoneGuide.domains),['',{...copy.other,icon:'heart'}]]){const b=el('button','ps-chip');b.type='button';b.dataset.area=key;b.setAttribute('aria-pressed',String(area===key));b.innerHTML=K.svg(domain.icon,16);b.append(document.createTextNode(t(domain)));b.addEventListener('click',()=>pick(key));box.append(b);}
 }
 function pick(key,focus=false){area=key;document.querySelectorAll('#growthAreaPick [data-area]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.area===key)));if(focus){const note=document.getElementById('growthNote');note?.scrollIntoView({block:'center'});note?.focus({preventScroll:true});}}
 function progress(){
  const {child}=state;let panel=document.getElementById('growthProgress');
  if(!panel){panel=el('section','ps-panel');panel.id='growthProgress';panel.dataset.noTranslate='';panel.setAttribute('aria-labelledby','growthProgressTitle');document.getElementById('growthStageSection')?.after(panel);}
  const notes=state.getNotes().filter(n=>!n.childId||n.childId===child.id),kind=n=>n.type||'observation';
  const fam=notes.filter(n=>['observation','follow-up','ai-share'].includes(kind(n))).length,acts=notes.filter(n=>['daily-moment','screen-play'].includes(kind(n))),q=notes.filter(n=>kind(n)==='concern').length,r=reports(child);
  const head=el('header');const h=el('h2',undefined,t(copy.progTitle));h.id='growthProgressTitle';const txt=el('div');const lead=el('p','ps-lead');lead.append(...fill(t(copy.progLead),'\u0000').split('\u0000').flatMap((part,i)=>i?[K.name(child),part]:[part]));txt.append(h,lead);head.append(K.icon('star'),txt);
  const tile=(icon,title,value,help,badge,actions=[])=>{const li=el('li','ps-tile');const th=el('div','ps-tile-head');th.append(K.icon(icon),el('strong',undefined,title));li.append(th,el('span','ps-value',num(value)),el('p',undefined,help));if(badge)li.append(badge);if(actions.length){const a=el('div','ps-tile-actions');a.append(...actions);li.append(a);}return li;};
  const fb=()=>el('span','ps-badge is-parent',t(copy.familyBadge));
  const tiles=el('ul','ps-tiles');
  tiles.append(tile('note',t(copy.family),fam,t(copy.familyHelp),fb(),[K.link(t(copy.seeNotes),'#savedObservations')]),
   tile('heart',t(copy.activity),acts.length,fill(t(copy.activityHelp),num(acts.filter(n=>n.outcome==='tried').length)),fb(),[K.link(t(copy.seeNotes),'milestones.html?filter=daily-moment#savedObservations')]),
   tile('talk',t(copy.questions),q,t(copy.questionsHelp),fb(),[K.link(t(copy.seeNotes),'milestones.html?filter=concern#savedObservations')]),
   tile('steth',t(copy.reports),r,t(copy.reportsHelp),el('span','ps-badge is-pro',t(copy.proBadge)),[K.link(t(copy.open),'bookings.html')]));
  panel.replaceChildren(head,tiles,el('p','ps-source',t(copy.legend)));
 }
 // Small badges on each saved entry: who wrote it, and the area if the family chose one.
 function decorate(article,note){
  const row=el('div','ps-kind-row');row.dataset.noTranslate='';row.append(el('span','ps-badge is-parent',t(copy.familyBadge)));
  const key=areaOf(note);if(key)row.append(el('span','ps-badge',t(window.RafiqMilestoneGuide.domains[key])));
  article.querySelector('.growth-kind')?.after(row);
 }
 function refresh(){if(!state)return;stage();picker();progress();}
 function mount(child,context,getNotes){state={child,context,getNotes};refresh();K.onLang(()=>{refresh();state.rerender?.();});}
 window.RafiqGrowthView={mount,refresh,decorate,area:()=>area||null,reset:()=>pick(null),onRerender:fn=>{if(state)state.rerender=fn;},copy,checkpointLabel};
})();
