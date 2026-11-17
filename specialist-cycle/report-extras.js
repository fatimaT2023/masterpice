/* Phase 5 follow-up report additions (report-form.html): areas discussed, suggested home
   activities chosen from Rafiq's existing activity library (age-suitable for this child) and
   recommended next steps. Saved with the report via RafiqReportExtras.collect().
   Demonstration content only: never a diagnosis, treatment outcome or improvement score. */
(() => {
 'use strict';
 const p=(en,ar)=>({en,ar}),lang=()=>document.documentElement.lang==='ar'?'ar':'en',t=v=>v[lang()];
 const copy={
  demo:p('Demonstration report. Not a clinical record. Do not include diagnoses, treatment outcomes or improvement scores.','تقرير للعرض. مش سجل طبي. ما تكتبوا تشخيصات أو نتائج علاج أو علامات تحسّن.'),
  title:p('For the family: areas, activities and next steps','للعيلة: المجالات والأنشطة والخطوات الجاية'),
  areas:p('Areas discussed','المجالات اللي انحكى عنها'),
  acts:p('Suggested home activities (from Rafiq’s library, suitable for this child’s age)','أنشطة بيتية مقترحة (من مكتبة رفيق، مناسبة لعمر الطفل)'),
  together:p('Play together','نلعب سوا'),screen:p('Play on screen','نلعب على الشاشة'),months:p('months','شهر'),
  next:p('Recommended next steps','الخطوات الجاية المقترحة'),nextHelp:p('Practical steps for the family, in plain words.','خطوات عملية للعيلة، بكلام بسيط.'),
  none:p('No age-suitable activities are available for this child in the library.','ما في أنشطة مناسبة لعمر الطفل بالمكتبة.')
 };
 const areas=[['development',p('Development','النمو')],['speech',p('Speech and language','النطق واللغة')],['behaviour',p('Behaviour and attention','السلوك والانتباه')],['emotional',p('Emotional wellbeing','المشاعر')],['learning',p('Learning','التعلّم')],['sensory',p('Sensory differences','الاختلافات الحسّية')],['feeding',p('Feeding','التغذية')],['sleep',p('Sleep','النوم')],['medical',p('Physical and medical','الصحة الجسدية')],['genetic',p('Genetic syndromes','المتلازمات الوراثية')],['everyday',p('Social and everyday life','الحياة اليومية')]];
 const screens=[['shapes',p('Shape match','نطابق الأشكال'),24,84],['sizes',p('Big and small','كبير وصغير'),24,60],['feelings',p('Feelings faces','وجوه المشاعر'),36,84]];
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
 const state={areas:new Set(),acts:new Map(),next:''};
 const read=key=>{try{const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[];}catch{return [];}};
 const bookingId=()=>sessionStorage.getItem('rafiqSelectedSpecialistBooking');
 function months(childId){const c=read('rafiqChildren').find(x=>x.id===childId),dob=c?.dateOfBirth;if(!dob)return null;const b=new Date(dob+'T12:00:00'),n=new Date();let m=(n.getFullYear()-b.getFullYear())*12+n.getMonth()-b.getMonth();if(n.getDate()<b.getDate())m--;return m;}
 const ar=s=>lang()==='ar'?(window.RafiqHomeArabic?.[s]||s):s;
 function options(childId){const m=months(childId),out=[];if(m==null)return out;
  for(const item of window.RafiqDailyMoments?.library||[])if(m>=item.minMonths&&m<item.maxMonthsExclusive)out.push({kind:'together',id:item.id,title:item.title,range:item.minMonths+'–'+(item.maxMonthsExclusive-1)});
  for(const [id,title,min,max] of screens)if(m>=min&&m<max)out.push({kind:'screen',id,title:title.en,titleAr:title.ar,range:min+'–'+(max-1)});
  return out;}
 function prefill(){const r=read('rafiqSpecialistReports').find(x=>x.bookingId===bookingId());if(!r)return;(r.areasDiscussed||[]).forEach(a=>state.areas.add(a));(r.homeActivities||[]).forEach(a=>state.acts.set(a.kind+':'+a.id,a));state.next=r.nextSteps||'';}
 function render(){
  const anchor=document.getElementById('followUp');if(!anchor)return;const b=read('rafiqBookings').find(x=>x.id===bookingId());if(!b)return;
  let panel=document.getElementById('reportExtras');if(!panel){panel=el('section','rx-panel');panel.id='reportExtras';panel.dataset.noTranslate='';const host=anchor.closest('.form-group,.report-field,.field,section')||anchor.parentElement;host.after(panel);}
  panel.replaceChildren(el('p','rx-demo',t(copy.demo)),el('h3',undefined,t(copy.title)));
  const ac=el('div','rx-chips');ac.setAttribute('role','group');ac.setAttribute('aria-label',t(copy.areas));
  for(const [id,label] of areas){const c=el('button','rx-chip',t(label));c.type='button';c.dataset.area=id;c.setAttribute('aria-pressed',String(state.areas.has(id)));c.addEventListener('click',()=>{state.areas.has(id)?state.areas.delete(id):state.areas.add(id);c.setAttribute('aria-pressed',String(state.areas.has(id)));});ac.append(c);}
  panel.append(el('label',undefined,t(copy.areas)),ac);
  const list=options(b.childId),box=el('div','rx-activities');box.id='reportActivities';
  if(!list.length)box.append(el('p','rx-help',t(copy.none)));
  for(const o of list){const key=o.kind+':'+o.id,l=el('label'),cb=el('input');cb.type='checkbox';cb.value=key;cb.checked=state.acts.has(key);cb.addEventListener('change',()=>{cb.checked?state.acts.set(key,{kind:o.kind,id:o.id,title:o.title}):state.acts.delete(key);});const text=el('span');text.append(el('strong',undefined,o.kind==='screen'?(lang()==='ar'?o.titleAr:o.title):ar(o.title)),el('small',undefined,t(o.kind==='screen'?copy.screen:copy.together)+' · '+o.range+' '+t(copy.months)));l.append(cb,text);box.append(l);}
  panel.append(el('label',undefined,t(copy.acts)),box);
  const nl=el('label',undefined,t(copy.next)),na=el('textarea');na.id='reportNextSteps';na.rows=3;na.maxLength=1000;na.value=state.next;na.addEventListener('input',()=>{state.next=na.value;});nl.htmlFor=na.id;
  panel.append(nl,el('p','rx-help',t(copy.nextHelp)),na);
 }
 function collect(){return {areasDiscussed:[...state.areas],homeActivities:[...state.acts.values()],nextSteps:state.next.trim().slice(0,1000),isDemoReport:true};}
 document.addEventListener('DOMContentLoaded',()=>{prefill();render();new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});});
 window.RafiqReportExtras={collect,render,options,areas,screens};
})();
