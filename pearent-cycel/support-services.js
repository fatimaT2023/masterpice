/* Family-selected support mode. Unavailable tools never produce dead links. */
(() => {
 const both=['diagnosed_no_followup','diagnosed_following'];
 const rows=[
 ['about-me','About {name}','عن {name}',both],
 ['start-guide','Where to start','من وين نبدأ',[both[0]]],
 ['find-specialist','Find a specialist who mentions autism','لاقوا مختص بذكر التوحد في ملفه',both],
 ['visit-prep','Prepare for an appointment','نحضّر للموعد',both],
 ['home-practice','Home practice from your specialist','تطبيق بالبيت من مختصكم',[both[1]]],
 ['visual-tools','Visual schedules and first, then cards','جداول مصوّرة وبطاقات أولًا، بعدين',both],
 ['behavior-log','Tough moments log','سجل اللحظات الصعبة',[both[1]]],
 ['parent-care','A moment for you','لحظة إلكم',both],
 ['wins','Small wins diary','دفتر اللحظات الحلوة',both],
 ['safety-card','Safety and emergency card','بطاقة الأمان والطوارئ',both]
 ];
 const services=rows.map(([id,title,titleAr,situations])=>({id,title,titleAr,description:id==='find-specialist'?'Explore published specialist profiles.':id==='about-me'?'A one-page profile you choose to share.':'A support tool for your family.',descriptionAr:id==='find-specialist'?'شوفوا المعلومات المنشورة بملفات المختصين.':id==='about-me'?'ملف بصفحة واحدة بتختاروا مشاركته.':'أداة دعم لعيلتكم.',icon:'♡',destination:id==='find-specialist'?'specialists.html':id==='about-me'?'about-me.html':'support-'+id+'.html',situations,available:['about-me','find-specialist'].includes(id),owner:'Rafiq content team',reviewStatus:'draft',reviewedBy:null,reviewedAt:null}));
 Object.assign(services.find(s=>s.id==='start-guide'),{available:true,destination:'start-guide.html',description:'A calm plan, one small step at a time.',descriptionAr:'خطة هادية، خطوة صغيرة كل مرة.'});
 for(const [id,destination] of [['visit-prep','support-visit.html'],['home-practice','support-practice.html'],['visual-tools','support-tools.html?tool=boards'],['behavior-log','support-tools.html?tool=moments'],['parent-care','support-tools.html?tool=care'],['wins','support-tools.html?tool=wins']])Object.assign(services.find(s=>s.id===id),{available:true,destination,situations:both,module:'journey'});
 function active(child){return child?.supportProfile?.focus==='autism'&&both.includes(child.supportProfile.situation);}
 function aboutReady(child){return child.aboutMe?.cursor===9||Object.values(child.aboutMe?.sections||{}).some(section=>Object.values(section).some(v=>Array.isArray(v)?v.length:typeof v==='string'?!!v.trim():v===true));}
 // Reveal the plan after the first passport step, keeping the home invitation small.
 function available(child){return active(child)?services.filter(s=>s.available&&(!s.module||window.RafiqSupportJourney)&&s.situations.includes(child.supportProfile.situation)&&(s.id!=='start-guide'||aboutReady(child))):[];}
 function next(child){
  if(active(child)&&window.RafiqSupportJourney)return window.RafiqSupportJourney.next(child);
  if(active(child)&&child.supportProfile.situation==='diagnosed_no_followup'&&window.RafiqSupportStart){
   const phase=window.RafiqSupportStart.build(child).phase;
   if(phase==='done')return null;
   if(phase==='booking'||(phase==='find'&&child.supportData?.completedServices?.includes('find-specialist'))){const copy=window.RafiqSupportStartContent.ui;return {id:'first-booking',title:copy.book.en,titleAr:copy.book.ar,description:copy.bookHelp.en,descriptionAr:copy.bookHelp.ar,destination:'specialists.html',owner:'Rafiq content team',reviewStatus:'draft',reviewedBy:null,reviewedAt:null};}
   return services.find(s=>s.id===({about:'about-me',start:'start-guide',find:'find-specialist'})[phase])||null;
  }
  return available(child).find(s=>s.id==='about-me'?child.aboutMe?.cursor!==9:!child.supportData?.completedServices?.includes(s.id))||null;
 }
 window.RafiqSupportServices={services,active,available,next};
})();
