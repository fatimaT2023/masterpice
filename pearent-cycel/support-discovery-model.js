/* Phase 2: parent-reported support needs. Every value here is the family's own
   explicit choice. Nothing is inferred from age, symptoms or story answers; the
   story only highlights areas the parent already mentioned. Services come from
   the existing catalog (support-catalog-data.js) and service map (parent-experience.js). */
(() => {
 'use strict';
 const p=(en,ar)=>({en,ar});
 const statuses=[
  ['diagnosed',p('Yes, my child has a professional diagnosis','أيوه، طفلي عنده تشخيص من مختص'),p('Choose it from our topics','بتختاروه من المواضيع')],
  ['assessment',p('We are currently undergoing an assessment','عم نعمل تقييم هالفترة'),p('Explore areas while you wait','استكشفوا المجالات وأنتو مستنيين')],
  ['concerns',p('I have concerns, but there is no diagnosis','عندي مخاوف، بس ما في تشخيص'),p('Tell us what is on your mind','احكولنا شو شاغل بالكم')],
  ['monitoring',p('No specific concerns; I want to follow my child’s development','ما في مخاوف محددة؛ بدي أتابع نمو طفلي'),p('Tracking, play and health records','متابعة ولعب وسجل صحي')],
  ['private',p('I prefer not to answer','بفضّل ما أجاوب'),p('You can still explore everything','بتقدروا تستكشفوا كل إشي')]
 ].map(([id,title,hint])=>({id,title,hint}));
 // One short line per area, matching the catalog's own topics.
 const areaCopy={
  development:p('Movement, milestones and early birth','الحركة والمراحل والولادة المبكرة'),
  speech:p('Words, sounds and being understood','الكلمات والأصوات والتواصل'),
  behaviour:p('Attention, tantrums and transitions','الانتباه والعصبية والانتقالات'),
  emotional:p('Worries, feelings and separation','المخاوف والمشاعر والانفصال'),
  learning:p('Early learning and learning differences','التعلّم المبكر وصعوباته'),
  sensory:p('Sounds, light, textures and seeking','الأصوات والضوء والملامس'),
  feeding:p('Picky eating, chewing and food allergies','الانتقائية والمضغ وحساسية الطعام'),
  sleep:p('Bedtime routines and night waking','روتين النوم والاستيقاظ بالليل'),
  medical:p('Hearing, vision and ongoing conditions','السمع والنظر والحالات المستمرة'),
  genetic:p('Down syndrome and other syndromes','متلازمة داون ومتلازمات أخرى'),
  everyday:p('Friends, preschool and independence','الأصحاب والروضة والاستقلالية')
 };
 // Autism exploration areas, each tied only to services that already exist.
 const autismAreas=[
  ['communication',p('Communication and speech','التواصل والنطق'),['speech','passport'],p('Speech specialists and how your child communicates','مختصّو النطق وطريقة تواصل طفلكم')],
  ['routines',p('Visual routines','الروتين البصري'),['routines'],p('First–then boards for everyday changes','لوحات «أولًا، بعدين» للانتقالات اليومية')],
  ['sensory',p('Sensory preferences','التفضيلات الحسّية'),['sensory'],p('What feels comfortable, in your child’s card','شو بريّح طفلكم، ببطاقته')],
  ['play',p('Daily activities and play','الأنشطة اليومية واللعب'),['play'],p('A short activity at your child’s pace','نشاط قصير على راحة طفلكم')],
  ['emotions',p('Feelings and behaviour','المشاعر والسلوك'),['behaviour'],p('Write down tough moments in your own words','سجّلوا اللحظات الصعبة بكلماتكم')],
  ['specialists',p('Finding a specialist','إيجاد مختص'),['specialists'],p('Browse the directory, then decide','تصفّحوا الدليل وبعدين قرّروا')]
 ].map(([id,title,services,hint])=>({id,title,services,hint}));
 const specialties={speech:p('Speech','نطق'),psychology:p('Psychology','نفسي'),development:p('Development','نمو'),pediatrician:p('Paediatrics','أطفال')};
 // Existing autism-only tools; they open only with a recorded autism diagnosis (support-services.js).
 const gated=['passport','routines','sensory'];
 const situations=['diagnosed_no_followup','diagnosed_following'];

 const catalog=()=>window.RafiqSupportCatalog,topic=id=>catalog().topics.find(t=>t.id===id);
 const unique=list=>[...new Set(list)];

 // Story answers only highlight areas the parent already mentioned; they never select anything.
 function hints(child){
  const a=child?.backgroundHistory?.answers||{},has=(id,value)=>{const v=a[id]?.value;return Array.isArray(v)?v.includes(value):v===value;},out=new Set();
  if(has('about.caregiver','nursery'))out.add('everyday');
  if(has('birth.termStatus','early')||has('birth.nicu','yes')||child?.bornBeforeDueDate==='yes')out.add('development');
  if(has('health.allergies','yes')||has('feeding.meals','support')||has('feeding.difficulty','yes'))out.add('feeding');
  if(has('health.conditions','yes'))out.add('medical');
  if(has('sleep.pattern','support')||has('sleep.hard','yes'))out.add('sleep');
  if(has('play.communication','support')||has('play.focus','communication'))out.add('speech');
  if(has('play.everydayParticipation','support')||has('play.focus','social')||has('play.focus','self_help'))out.add('everyday');
  if(has('play.focus','fine_motor'))out.add('development');
  if(has('play.focus','thinking'))out.add('learning');
  for(const [goal,area] of [['sleep','sleep'],['feeding','feeding'],['speech','speech'],['behaviour','behaviour'],['growth','development'],['play','everyday']])if(has('goals.choices',goal))out.add(area);
  return out;
 }
 function blank(){return {version:1,status:null,diagnosed:[],diagnosisNote:'',following:null,areas:[],topics:[],monitoring:false,priorities:[],autismAreas:[]};}
 // Families who chose support before Phase 2 keep their meaning when the page first opens.
 function fromChild(child){
  const saved=child?.supportDiscovery;if(saved?.version===1)return {...blank(),...JSON.parse(JSON.stringify(saved))};
  const d=blank(),s=child?.supportProfile;if(!s)return d;
  if(situations.includes(s.situation)){d.status='diagnosed';d.following=s.situation==='diagnosed_following'?'yes':'no';if(s.focus==='autism'){d.diagnosed=['autism'];d.areas=['development'];}}
  else if(s.situation==='worried')d.status='concerns';else if(s.situation==='none'){d.status='monitoring';d.monitoring=true;}
  return d;
 }
 function allTopics(d){return unique([...d.diagnosed,...d.topics]).filter(topic);}
 function hasAutism(d){return allTopics(d).includes('autism');}
 // The family's choice mapped onto the existing support-mode record (support-mode.js values only).
 function profileFor(d){
  if(d.status==='diagnosed'){
   const topics=d.diagnosed.map(topic).filter(Boolean),focus=topics.some(t=>t.id==='autism')?'autism':topics.some(t=>t.category==='speech')?'speech_language':topics.length?'other':'not_said';
   return {situation:d.following==='yes'?'diagnosed_following':'diagnosed_no_followup',focus};
  }
  return {assessment:{situation:'worried',focus:null},concerns:{situation:'worried',focus:null},monitoring:{situation:'none',focus:null},private:{situation:'skipped',focus:null}}[d.status]||null;
 }
 function autismActive(d){const prof=profileFor(d);return prof?.focus==='autism'&&situations.includes(prof.situation);}
 function specialistHref(specialty){return 'specialists.html'+(specialty?'?specialty='+encodeURIComponent(specialty):'');}
 // Relevant existing services, with the topics that led to each one. Priorities come first.
 function services(d){
  const map=new Map(),add=(id,source,extra={})=>{const e=map.get(id)||{id,sources:[],specialties:[],locked:false,priority:false};if(source&&!e.sources.includes(source))e.sources.push(source);if(extra.specialty&&!e.specialties.includes(extra.specialty))e.specialties.push(extra.specialty);map.set(id,e);};
  const categories=window.RafiqParentExperience.categories,ids=catalog().categories.map(c=>c.id);
  for(const t of allTopics(d).map(topic)){for(const s of t.services)add(s,t.id);add('specialists',t.id,{specialty:t.specialty});}
  for(const area of d.areas)if(!allTopics(d).some(id=>topic(id).category===area)){const row=categories[ids.indexOf(area)];if(row)add(row[2],'area:'+area);}
  if(hasAutism(d))for(const key of d.autismAreas){const area=autismAreas.find(a=>a.id===key);for(const s of area?.services||[])add(s,'autism');}
  if(d.monitoring||!map.size)for(const s of ['growth','play','health'])add(s,'monitoring');
  if(autismActive(d))add('journey','autism');
  const active=autismActive(d);for(const e of map.values())e.locked=gated.includes(e.id)&&!active;
  const wanted=priorityServices(d);for(const e of map.values())e.priority=wanted.includes(e.id);
  return [...map.values()].sort((a,b)=>(b.priority-a.priority)||(a.locked-b.locked)||(b.sources.length-a.sources.length));
 }
 // Priority choices are either an autism area or a single service id.
 function priorityServices(d){return unique([...d.priorities,...(hasAutism(d)?d.autismAreas.flatMap(key=>autismAreas.find(a=>a.id===key)?.services||[]):[])]);}
 // Services the family can pick as "most helpful now": relevant to their choices and open to them.
 // With autism chosen, services already offered as autism areas are not repeated here.
 function priorityOptions(d){const covered=hasAutism(d)?autismAreas.flatMap(a=>a.services):[];return services({...d,priorities:[],autismAreas:[]}).filter(s=>s.id!=='journey'&&!s.locked&&!covered.includes(s.id)).map(s=>s.id);}
 function clean(d){
  const ids=new Set(catalog().topics.map(t=>t.id)),areas=new Set(catalog().categories.map(c=>c.id)),text=v=>String(v||'').trim().slice(0,300);
  const out={version:1,status:statuses.some(s=>s.id===d.status)?d.status:null,diagnosed:d.status==='diagnosed'?unique(d.diagnosed).filter(id=>ids.has(id)):[],diagnosisNote:d.status==='diagnosed'?text(d.diagnosisNote):'',following:d.status==='diagnosed'&&['yes','no','private'].includes(d.following)?d.following:null,
   areas:unique(d.areas).filter(id=>areas.has(id)),topics:unique(d.topics).filter(id=>ids.has(id)),monitoring:!!d.monitoring,priorities:unique(d.priorities).slice(0,3).map(String),autismAreas:unique(d.autismAreas).filter(id=>autismAreas.some(a=>a.id===id))};
  out.topics=out.topics.filter(id=>!out.diagnosed.includes(id));
  if(!out.diagnosed.concat(out.topics).includes('autism'))out.autismAreas=[];
  return out;
 }
 // One write: the discovery record plus the matching support-mode record. Stale tabs are refused.
 function save(child,draft){
  const fresh=window.RafiqSetup.readChildren().find(c=>c.id===child.id);
  if(!fresh||!window.RafiqFamily.canAccessId(child.id))throw Error('This child profile is unavailable.');
  if((fresh.supportDiscovery?.revision||0)!==(child.supportDiscovery?.revision||0))throw Error('stale');
  const now=new Date().toISOString(),record={...clean(draft),revision:(fresh.supportDiscovery?.revision||0)+1,createdAt:fresh.supportDiscovery?.createdAt||now,updatedAt:now,updatedBy:window.RafiqSetup.parentOwner()};
  const mapped=profileFor(record),supportProfile=mapped?{version:1,situation:mapped.situation,focus:mapped.focus,setAt:fresh.supportProfile?.setAt||now,setBy:window.RafiqSetup.parentOwner(),updatedAt:now}:fresh.supportProfile;
  const next={...fresh,supportDiscovery:record};if(supportProfile)next.supportProfile=supportProfile;else delete next.supportProfile;
  window.RafiqSetup.writeChildren([next]);return next;
 }
 window.RafiqSupportDiscovery={statuses,areaCopy,autismAreas,specialties,gated,hints,blank,fromChild,allTopics,hasAutism,profileFor,autismActive,services,priorityServices,priorityOptions,clean,save,specialistHref};
})();
