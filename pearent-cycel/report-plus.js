/* Phase 5 parent report additions (specialist-report.html): demonstration label, areas
   discussed, suggested home activities that open Rafiq's real activity pages, next steps,
   and a way back to the child's support. Read-only for the parent. */
(() => {
 'use strict';
 const p=(en,ar)=>({en,ar}),lang=()=>document.documentElement.lang==='ar'?'ar':'en',t=v=>v[lang()];
 const copy={
  demo:p('Demonstration report from a fictional specialist. Not a clinical record or diagnosis.','تقرير عرض من مختص وهمي. مش سجل طبي ولا تشخيص.'),
  areas:p('Areas discussed','المجالات اللي انحكى عنها'),acts:p('Suggested activities to try at home','أنشطة مقترحة تجرّبوها بالبيت'),
  together:p('Play together','نلعب سوا'),screen:p('Play on screen','نلعب على الشاشة'),open:p('Open activity','افتحوا النشاط'),
  next:p('Recommended next steps','الخطوات الجاية المقترحة'),back:p('Back to {0}’s home','رجوع لرئيسية {0}'),allActs:p('All activities','كل الأنشطة'),appts:p('My appointments','مواعيدي'),
  missing:p('This activity is no longer in the library.','هالنشاط مش موجود بالمكتبة هلّق.')
 };
 const areaNames={development:p('Development','النمو'),speech:p('Speech and language','النطق واللغة'),behaviour:p('Behaviour and attention','السلوك والانتباه'),emotional:p('Emotional wellbeing','المشاعر'),learning:p('Learning','التعلّم'),sensory:p('Sensory differences','الاختلافات الحسّية'),feeding:p('Feeding','التغذية'),sleep:p('Sleep','النوم'),medical:p('Physical and medical','الصحة الجسدية'),genetic:p('Genetic syndromes','المتلازمات الوراثية'),everyday:p('Social and everyday life','الحياة اليومية')};
 const games={shapes:p('Shape match','نطابق الأشكال'),sizes:p('Big and small','كبير وصغير'),feelings:p('Feelings faces','وجوه المشاعر')};
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
 const read=key=>{try{const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[];}catch{return [];}};
 function current(){try{const child=window.RafiqSetup.readChildren().find(c=>c.id===window.RafiqFamily.selected());const id=sessionStorage.getItem('rafiqSelectedReportBooking');return {child,report:read('rafiqSpecialistReports').find(r=>r.bookingId===id&&r.childId===child?.id&&r.status==='submitted')};}catch{return {};}}
 const ar=s=>lang()==='ar'?(window.RafiqHomeArabic?.[s]||s):s;
 function render(){
  const {child,report}=current(),view=document.getElementById('reportView');if(!report||!view||view.hidden)return;
  let box=document.getElementById('reportPlus');if(!box){box=el('section','report-plus');box.id='reportPlus';box.dataset.noTranslate='';const anchor=document.getElementById('followUpText')?.closest('section,.report-section,.report-card,div');(anchor||view).after(box);}
  let banner=document.getElementById('reportDemoBanner');if(!banner&&(report.isDemo||report.isDemoReport||child?.isDemo)){banner=el('p','report-demo-banner');banner.id='reportDemoBanner';banner.dataset.noTranslate='';view.prepend(banner);}if(banner)banner.textContent=t(copy.demo);
  box.replaceChildren();
  if(report.areasDiscussed?.length){const chips=el('div','report-chips');for(const a of report.areasDiscussed)if(areaNames[a])chips.append(el('span',undefined,t(areaNames[a])));box.append(el('h2',undefined,t(copy.areas)),chips);}
  if(report.homeActivities?.length){const ul=el('ul','report-activity-list');ul.id='reportActivityLinks';
   for(const a of report.homeActivities){const li=el('li');const isScreen=a.kind==='screen',exists=isScreen?!!games[a.id]:!!window.RafiqDailyMoments?.library.some(i=>i.id===a.id);
    li.append(el('strong',undefined,isScreen?t(games[a.id]||p(a.title,a.title)):ar(a.title)),el('small',undefined,t(isScreen?copy.screen:copy.together)));
    if(exists){const link=el('a',undefined,t(copy.open));link.href=isScreen?'play-on-screen.html?game='+encodeURIComponent(a.id):'activities.html?activity='+encodeURIComponent(a.id);link.dataset.activityKind=a.kind;li.append(link);}else li.append(el('small',undefined,t(copy.missing)));ul.append(li);}
   box.append(el('h2',undefined,t(copy.acts)),ul);}
  if(report.nextSteps){const n=el('p',undefined,report.nextSteps);n.setAttribute('data-user-content','');box.append(el('h2',undefined,t(copy.next)),n);}
  const links=el('div','match-links');const home=el('a');const parts=t(copy.back).split('{0}');home.append(parts[0]);const b=el('bdi',undefined,child?.name||'');b.setAttribute('data-user-content','');home.append(b,parts[1]||'');home.href='parent-dashboard.html?child='+encodeURIComponent(child?.id||'');const acts=el('a',undefined,t(copy.allActs));acts.href='activities.html';const appts=el('a',undefined,t(copy.appts));appts.href='bookings.html';links.append(home,acts,appts);box.append(links);
 }
 document.addEventListener('DOMContentLoaded',()=>{setTimeout(render,0);new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});});
 window.RafiqReportPlus={render};
})();
