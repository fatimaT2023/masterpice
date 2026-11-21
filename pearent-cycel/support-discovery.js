/* Phase 2 discovery: a short, adaptive conversation after the child's story,
   ending in a support summary. Steps that do not apply are skipped. Every screen
   has a title, one primary action, Back and a way out. Data rules live in
   support-discovery-model.js; this file only renders and navigates. */
(() => {
 'use strict';
 const p=(en,ar)=>({en,ar});
 Object.assign(window.RafiqHomeArabic=window.RafiqHomeArabic||{},{'Skip for now':'تخطّي هلأ','Support for your child':'دعم طفلكم','Back to profile':'رجوع للملف','Back to home':'رجوع للرئيسية'});
 const C={
  kicker:p('STEP 3 OF 3 · SUPPORT','الخطوة ٣ من ٣ · الدعم'),editKicker:p('SUPPORT CHOICES','اختيارات الدعم'),
  dots:{status:p('Diagnosis','التشخيص'),diagnosis:p('Which one','أي تشخيص'),areas:p('Areas','المجالات'),topics:p('Topics','المواضيع'),priorities:p('Priorities','الأولويات'),summary:p('Summary','الملخص')},
  statusTitle:p('Has {name} received a diagnosis from a qualified professional?','هل {name} عنده تشخيص من مختص مؤهّل؟'),
  statusLead:p('Your answer only helps us show relevant services. Everything in Rafeeq stays open to you.','إجابتكم بتساعدنا نعرض الخدمات المناسبة بس. كل إشي برفيق بضل متاح إلكم.'),
  statusNeeded:p('Choose one answer, or use “Skip for now”.','اختاروا إجابة وحدة، أو استخدموا «تخطّي هلأ».'),
  diagnosisTitle:p('Which diagnosis?','أي تشخيص؟'),diagnosisLead:p('Choose from Rafeeq’s topics. More than one is fine.','اختاروا من مواضيع رفيق. بتقدروا تختاروا أكثر من واحد.'),
  moreTopics:p('Not listed? Show all topics','مش موجود؟ اعرضوا كل المواضيع'),note:p('Anything you’d like to add? (optional)','في إشي بتحبّوا تضيفوه؟ (اختياري)'),notePlaceholder:p('For example, who gave the diagnosis or when','مثلًا مين عطى التشخيص أو إمتى'),
  followTitle:p('Is a specialist already following {name} for this?','في مختص بتابع {name} بهالموضوع؟'),follow:{yes:p('Yes','أيوه'),no:p('Not yet','لسه لا'),private:p('Prefer not to say','بفضّل ما أحكي')},
  areasTitle:{diagnosed:p('Anything else you’d like support with?','في إشي ثاني بتحبّوا دعم فيه؟'),assessment:p('What would you like support with while you wait?','بشو بتحبّوا دعم وأنتو مستنيين التقييم؟'),concerns:p('What is on your mind?','شو شاغل بالكم؟'),monitoring:p('Would you like to keep an eye on anything?','في إشي بتحبّوا تنتبهوا إله؟'),private:p('Would you like to explore any areas?','بتحبّوا تستكشفوا أي مجال؟')},
  areasLead:p('Choose any. Optional. A dashed outline means you mentioned it in the story.','اختاروا اللي بدكم. اختياري. الإطار المنقّط يعني إنكم ذكرتوه بالحكاية.'),
  mentioned:p('You mentioned this','ذكرتوه'),diagnosisTag:p('Diagnosis','تشخيص'),
  general:p('General development','النمو بشكل عام'),generalCopy:p('Follow growth, play and health','متابعة النمو واللعب والصحة'),
  topicsTitle:p('Which topics fit {name}?','أي مواضيع بتناسب {name}؟'),topicsLead:p('Choose any that fit. A topic is not a diagnosis.','اختاروا اللي بناسب. الموضوع مش تشخيص.'),
  prioritiesTitle:p('What would help most right now?','شو أكثر إشي بساعد هلأ؟'),prioritiesLead:p('Pick up to 3. We’ll put them first.','اختاروا لحد ٣. رح نحطّهم بالأول.'),
  autismTitle:p('Autism support: what would you like to explore?','دعم التوحد: شو بتحبّوا تستكشفوا؟'),autismLead:p('Every autistic child is different. Choose what fits {name}.','كل طفل متوحّد مختلف. اختاروا اللي بناسب {name}.'),
  locked:p('Opens with a recorded autism diagnosis','بتنفتح مع تشخيص توحد مسجّل'),upTo:p('Up to 3 — remove one to choose another','لحد ٣ — شيلوا وحدة لتختاروا غيرها'),
  back:p('Back','رجوع'),backStory:p('Back to the story','رجوع للحكاية'),next:p('Next','التالي'),skip:p('Skip this step','تخطّي هالخطوة'),skipQuestion:p('Skip this question','تخطّي هالسؤال'),
  seeSummary:p('See {name}’s summary','شوفوا ملخص {name}'),saving:p('Saving…','عم نحفظ…'),
  summaryTitle:p('{name}’s support summary','ملخص الدعم لـ{name}'),summaryLead:p('Based on the information you shared, these resources may be useful.','حسب المعلومات اللي شاركتوها، هالمصادر ممكن تفيدكم.'),
  saved:p('Saved','انحفظ'),statusLabel:p('Diagnosis status (as you shared)','حالة التشخيص (حسب ما شاركتوا)'),areasLabel:p('Areas','المجالات'),topicsLabel:p('Topics','المواضيع'),prioritiesLabel:p('Your priorities','أولوياتكم'),
  noAreas:p('No areas chosen','ما اخترتوا مجالات'),noTopics:p('No topics chosen','ما اخترتوا مواضيع'),noPriorities:p('No priorities yet','لسه ما في أولويات'),notShared:p('Not shared','ما انذكر'),
  following:{yes:p('A specialist is following','في مختص بتابع'),no:p('No specialist yet','لسه ما في مختص'),private:p('Follow-up not shared','المتابعة ما انذكرت')},
  servicesTitle:p('Resources that may help','مصادر ممكن تفيد'),forLabel:p('For','لـ'),priorityTag:p('Your priority','أولويتكم'),general2:p('General development','النمو العام'),
  stepsTitle:p('Suggested next steps','خطوات مقترحة'),stepStart:p('Start with: {title}','ابدؤوا بـ: {title}'),stepActivity:p('Try a first activity together','جرّبوا أول نشاط سوا'),stepActivityLater:p('Open today’s activity','افتحوا نشاط اليوم'),stepHome:p('Find everything on your home page','كل إشي بتلاقوه بالرئيسية'),
  home:p('Continue to home','كمّلوا للرئيسية'),toProfile:p('Back to {name}’s profile','رجوع لملف {name}'),edit:p('Edit answers','تعديل الإجابات'),browse:p('Browse all 32 topics','تصفّحوا كل المواضيع الـ٣٢'),
  disclaimer:p('This is not an assessment or a diagnosis. You can change it any time from {name}’s profile.','هذا مش تقييم ولا تشخيص. بتقدروا تغيّروه بأي وقت من ملف {name}.'),
  stale:p('{name}’s support choices changed in another tab. Reload to see the latest, then try again.','اختيارات الدعم لـ{name} تغيّرت بصفحة ثانية. حدّثوا الصفحة وجرّبوا مرة ثانية.'),
  failed:p('We could not save. Your earlier choices are unchanged. Please try again.','ما قدرنا نحفظ. اختياراتكم السابقة ما تغيّرت. جرّبوا مرة ثانية.'),
  reload:p('Reload','تحديث'),missing:p('We could not find this child’s profile. Your records were not changed.','ما لقينا ملف هالطفل. سجلاتكم ما تغيّرت.'),addChild:p('Add a child','ضيفوا طفل'),
  ageOld:p('{age}','{age}')
 };
 const icons={
  development:'M12 21v-8M12 13c0-4 3-7 7-7 0 4-3 7-7 7ZM12 15c0-3-2.5-5.5-6-5.5 0 3 2.5 5.5 6 5.5Z',speech:'M4 5h16v11H9l-5 4ZM8 9.5h8M8 12.5h5',behaviour:'M12 4a8 8 0 1 0 0 16 8 8 0 1 0 0-16Zm0 4a4 4 0 1 0 0 8 4 4 0 1 0 0-8Zm0 3.8h.01',
  emotional:'M12 20s-7-4.3-7-9.6A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4C19 15.7 12 20 12 20Z',learning:'M4 5.5C6.5 4.5 9.5 4.6 12 6.5c2.5-1.9 5.5-2 8-1v13c-2.5-1-5.5-.9-8 1-2.5-1.9-5.5-2-8-1ZM12 6.5v13',sensory:'M3 7c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0M3 12c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0M3 17c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0',
  feeding:'M6 3v5a2.5 2.5 0 0 0 5 0V3M8.5 10.5V21M8.5 3v4M16.5 3c-1.9 0-2.5 2.4-2.5 4.5S15 11 16.5 11 19 9.6 19 7.5 18.4 3 16.5 3ZM16.5 11v10',sleep:'M19.5 14.5A7.5 7.5 0 1 1 9.5 4.5a6 6 0 0 0 10 10ZM15 3h4l-4 4h4',medical:'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18ZM12 8v8M8 12h8',
  genetic:'M7 3c0 6 10 6 10 12 0 3-2 4.5-4 5.5M17 3c0 6-10 6-10 12 0 3 2 4.5 4 5.5M8.5 7h7M8 11.5h8M8.5 16h7',everyday:'M4 11 12 4l8 7M6 9.5V20h12V9.5M10 20v-5h4v5',monitoring:'M4 3v17h17M8 16v-4m5 4V8m5 8V5',
  diagnosed:'M8 4h8v3H8ZM6 5H5v16h14V5h-1M9 14l2 2 4-4',assessment:'M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9',concerns:'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18ZM9.6 9.5a2.4 2.4 0 1 1 3.4 2.2c-.6.3-1 .8-1 1.5v.4M12 16.6h.01',private:'M6 10h12v10H6ZM8.5 10V7.5a3.5 3.5 0 0 1 7 0V10',
  passport:'M12 4a8 8 0 1 0 0 16 8 8 0 1 0 0-16ZM9 14c1.6 1.5 4.4 1.5 6 0M9.5 10.2h.01M14.5 10.2h.01',routines:'M4 4h7v7H4ZM13 4h7v7h-7ZM4 13h7v7H4ZM13 13h7v7h-7Z',play:'M4 13h7v7H4ZM13 13h7v7h-7ZM8.5 4h7v7h-7Z',
  growth:'M4 3v17h17M8 16v-4m5 4V8m5 8V5',health:'M3 12h4l2-5 4 10 2-5h6',journey:'M5 19c4 0 3-6 7-6s3-6 7-6M5 17v4M19 5v4',appointments:'M4 5h16v16H4ZM8 2v6m8-6v6M4 11h16',specialists:'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21c0-4 3-7 7-7s7 3 7 7M19 8v6M16 11h6',memories:'M4 6h16v13H4ZM8 15l3-3 4 4 2-2 3 3M9 10h.01',
  star:'m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z',lock:'M6 10h12v10H6ZM8.5 10V7.5a3.5 3.5 0 0 1 7 0V10',check:'M5 12.5l4.2 4.2L19 7',arrow:'M5 12h14m-5-5 5 5-5 5'
 };
 icons.sleep2=icons.sleep;
 const lang=()=>document.documentElement.lang==='ar'?'ar':'en',t=v=>v&&typeof v==='object'?v[lang()]:String(v??'');
 const fill=(v,vars={})=>t(v).replace(/\{(\w+)\}/g,(m,k)=>vars[k]??m);
 const n=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined&&text!==null)el.textContent=text;if(cls)el.className=cls;return el;};
 function icon(key,cls='disc-icon'){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('class',cls);const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',icons[key]||icons.monitoring);svg.append(path);return svg;}
 // Age in the page language (the shared formatter is English-only).
 function ageLabel(age){const ar=lang()==='ar',parts=[[age.years,'year','سنة','سنتين','سنوات'],[age.months,'month','شهر','شهرين','أشهر']].filter(([v])=>v).map(([v,en,one,two,many])=>ar?(v===1?one:v===2?two:new Intl.NumberFormat('ar').format(v)+' '+(v<=10?many:one)):v+' '+en+(v===1?'':'s'));return parts.length?parts.join(ar?' و':', '):t(p('Under one month','أقل من شهر'));}
 function bdi(text){const b=n('bdi',text);b.setAttribute('data-user-content','');return b;}
 // Sentences with the child's name keep the name in its own isolated span.
 function named(tag,template,name,cls){const el=n(tag,undefined,cls),parts=t(template).split('{name}');el.append(parts[0]);for(let i=1;i<parts.length;i++){el.append(bdi(name),parts[i]);}return el;}

 const params=new URLSearchParams(location.search),root=document.getElementById('discovery'),errorBox=document.getElementById('discoveryError');
 let child,draft,step=0,view='flow',first=false,returnTo=null,flash=false,busy=false;
 const M=()=>window.RafiqSupportDiscovery,catalog=()=>window.RafiqSupportCatalog,services=()=>window.RafiqParentExperience.services;
 const topicOf=id=>catalog().topics.find(x=>x.id===id),areaOf=id=>catalog().categories.find(c=>c.id===id);

 function steps(){
  const list=['status'];if(draft.status==='diagnosed')list.push('diagnosis');list.push('areas');
  if(draft.areas.some(a=>catalog().topics.some(x=>x.category===a)))list.push('topics');
  if(M().hasAutism(draft)||M().priorityOptions(draft).length>1)list.push('priorities');
  return list;
 }
 function exitHref(){return returnTo==='profile'?'child-profile.html?child='+encodeURIComponent(child.id):'parent-dashboard.html';}
 // First-time setup ends here: finishing marks the welcome as done so Home opens normally.
 function leave(){
  if(first){try{const fresh=window.RafiqSetup.readChildren().find(c=>c.id===child.id);location.assign(window.RafiqSupportGuide.finish(child.id,'explore',window.RafiqActivityMatching.profile(fresh).focusSkills));return;}catch{}}
  location.assign(exitHref());
 }
 function showError(message,withReload){errorBox.replaceChildren(n('span',message));if(withReload){const b=n('button',t(C.reload),'disc-link');b.type='button';b.onclick=()=>location.reload();errorBox.append(b);}errorBox.hidden=false;errorBox.scrollIntoView({block:'nearest'});}
 function clearError(){errorBox.hidden=true;errorBox.replaceChildren();}

 // ---------- Shared pieces ----------
 function header(kicker,title,lead){
  const head=n('div',undefined,'disc-head'),copy=n('div');copy.append(n('span',t(kicker),'disc-kicker'));const h=named('h1',title,child.name);h.tabIndex=-1;h.id='discTitle';copy.append(h);if(lead)copy.append(named('p',lead,child.name,'disc-lead'));
  const chip=n('span',undefined,'disc-child');chip.append(n('span',undefined,'story-avatar'),bdi(child.name));head.append(copy,chip);return head;
 }
 function dots(list){
  const ol=n('ol',undefined,'disc-dots');ol.setAttribute('aria-label',t(p('Support questions','أسئلة الدعم')));
  [...list,'summary'].forEach((key,i)=>{const li=n('li',undefined,i<step?'is-done':i===step&&view==='flow'?'is-current':'');if(i===step&&view==='flow')li.setAttribute('aria-current','step');li.append(n('i'),n('span',t(C.dots[key])));ol.append(li);});
  return ol;
 }
 function toggle(list,value){const i=list.indexOf(value);if(i<0)list.push(value);else list.splice(i,1);}
 function choiceButton(content,pressed,onclick,cls='disc-option'){const b=n('button',undefined,cls);b.type='button';b.setAttribute('aria-pressed',String(pressed));b.append(...content);b.onclick=onclick;return b;}
 function footer(list,{nextLabel,onNext,skipLabel,onSkip}){
  const f=n('div',undefined,'disc-footer');
  const back=n('button',undefined,'disc-back');back.type='button';back.append(n('span','←','disc-arrow'),' ',step===0?(first?t(C.backStory):child.supportDiscovery?t(C.back):t(C.back)):t(C.back));
  back.onclick=()=>{clearError();if(step>0){step--;render(true);return;}if(first){location.assign('onboarding.html?edit='+encodeURIComponent(child.id)+'&section=story');return;}if(child.supportDiscovery){view='summary';draft=M().fromChild(child);render(true);return;}leave();};
  f.append(back);
  if(skipLabel){const s=n('button',skipLabel,'disc-skip');s.type='button';s.onclick=onSkip;f.append(s);}
  const next=n('button',undefined,'disc-next');next.type='button';next.append(nextLabel,' ',n('span','→','disc-arrow'));next.disabled=busy;next.onclick=onNext;f.append(next);return f;
 }
 function advance(){clearError();const list=steps();if(step<list.length-1){step++;render(true);}else finishFlow();}
 function finishFlow(){
  if(busy)return;busy=true;render();
  try{child=M().save(child,draft);draft=M().fromChild(child);view='summary';flash=true;busy=false;render(true);}
  catch(error){busy=false;render();showError(error.message==='stale'?fill(C.stale).replace('{name}',child.name):t(C.failed),error.message==='stale');}
 }

 // ---------- Steps ----------
 function statusStep(card){
  const group=n('div',undefined,'disc-status');group.setAttribute('role','radiogroup');group.setAttribute('aria-labelledby','discTitle');
  for(const s of M().statuses){const b=choiceButton([icon(s.id,'disc-option-icon'),(()=>{const c=n('span',undefined,'disc-option-copy');c.append(n('strong',t(s.title)),n('small',t(s.hint)));return c;})(),n('i',undefined,'disc-radio')],draft.status===s.id,()=>{draft.status=s.id;// Leaving "diagnosed" keeps the chosen topics as concerns rather than losing them.
if(s.id!=='diagnosed'){draft.topics=[...new Set([...draft.topics,...draft.diagnosed])];draft.diagnosed=[];draft.following=null;draft.diagnosisNote='';}if(s.id==='monitoring')draft.monitoring=true;clearError();render();document.querySelector(`[data-status="${s.id}"]`)?.focus();});b.setAttribute('role','radio');b.setAttribute('aria-checked',String(draft.status===s.id));b.dataset.status=s.id;group.append(b);}
  card.append(group);
  return {nextLabel:t(C.next),onNext:()=>{if(!draft.status){showError(t(C.statusNeeded));group.querySelector('button')?.focus();return;}advance();},skipLabel:t(p('Skip for now','تخطّي هلأ')),onSkip:leave};
 }
 function topicTile(topic,{pressed,onclick,tag}){
  const area=areaOf(topic.category),b=choiceButton([icon(topic.category,'disc-tile-icon'),(()=>{const c=n('span',undefined,'disc-tile-copy');c.append(n('strong',t(topic.title)),n('small',t(area.title)));return c;})(),n('i',undefined,'disc-check')],pressed,onclick,'disc-tile');b.dataset.topic=topic.id;if(tag)b.append(n('em',tag,'disc-tag'));return b;
 }
 function diagnosisStep(card){
  const pick=id=>()=>{toggle(draft.diagnosed,id);draft.topics=draft.topics.filter(x=>x!==id);const area=topicOf(id).category;if(draft.diagnosed.includes(id)&&!draft.areas.includes(area))draft.areas.push(area);render();document.querySelector(`[data-topic="${id}"]`)?.focus();};
  const main=catalog().topics.filter(x=>x.type==='diagnosis'),grid=n('div',undefined,'disc-tiles');for(const x of main)grid.append(topicTile(x,{pressed:draft.diagnosed.includes(x.id),onclick:pick(x.id)}));card.append(grid);
  const more=n('details',undefined,'disc-more');more.open=draft.diagnosed.some(id=>topicOf(id).type!=='diagnosis');more.append(n('summary',t(C.moreTopics)));
  for(const area of catalog().categories){const rest=catalog().topics.filter(x=>x.category===area.id&&x.type!=='diagnosis');if(!rest.length)continue;const g=n('div',undefined,'disc-chip-group');const h=n('h3');h.append(icon(area.id,'disc-mini-icon'),t(area.title));g.append(h);const row=n('div',undefined,'disc-chips');for(const x of rest){const c=choiceButton([n('i',undefined,'disc-check'),t(x.title)],draft.diagnosed.includes(x.id),pick(x.id),'disc-chip');c.dataset.topic=x.id;row.append(c);}g.append(row);more.append(g);}
  card.append(more);
  const label=n('label',t(C.note),'disc-note'),area=n('textarea');area.id='discoveryNote';area.maxLength=300;area.rows=2;area.placeholder=t(C.notePlaceholder);area.value=draft.diagnosisNote;area.oninput=()=>{draft.diagnosisNote=area.value;};label.append(area);card.append(label);
  if(draft.diagnosed.length){const fs=n('fieldset',undefined,'disc-follow');fs.append(named('legend',C.followTitle,child.name));const row=n('div',undefined,'disc-segment');for(const key of ['yes','no','private']){const b=choiceButton([t(C.follow[key])],draft.following===key,()=>{draft.following=key;render();document.querySelector(`[data-follow="${key}"]`)?.focus();},'disc-seg');b.dataset.follow=key;row.append(b);}fs.append(row);card.append(fs);}
  return {nextLabel:t(C.next),onNext:advance,skipLabel:t(C.skipQuestion),onSkip:()=>{draft.diagnosed=[];draft.following=null;advance();}};
 }
 function areasStep(card){
  const hinted=M().hints(child),grid=n('div',undefined,'disc-areas');
  for(const area of catalog().categories){
   const dx=draft.diagnosed.filter(id=>topicOf(id).category===area.id).length,b=choiceButton([icon(area.id,'disc-area-icon'),n('strong',t(area.title)),n('small',t(M().areaCopy[area.id])),n('i',undefined,'disc-check')],draft.areas.includes(area.id),()=>{toggle(draft.areas,area.id);if(!draft.areas.includes(area.id))draft.topics=draft.topics.filter(id=>topicOf(id).category!==area.id);render();document.querySelector(`[data-area="${area.id}"]`)?.focus();},'disc-area');
   b.dataset.area=area.id;if(hinted.has(area.id)){b.classList.add('is-hinted');b.append(n('em',t(C.mentioned),'disc-tag'));}else if(dx)b.append(n('em',t(C.diagnosisTag),'disc-tag is-diagnosis'));grid.append(b);
  }
  const g=choiceButton([icon('monitoring','disc-area-icon'),n('strong',t(C.general)),n('small',t(C.generalCopy)),n('i',undefined,'disc-check')],draft.monitoring,()=>{draft.monitoring=!draft.monitoring;render();document.querySelector('[data-area="general"]')?.focus();},'disc-area is-general');g.dataset.area='general';grid.append(g);
  card.append(grid);const empty=!draft.areas.length&&!draft.monitoring;
  return {nextLabel:empty?t(C.skip):t(C.next),onNext:advance};
 }
 function topicsStep(card){
  for(const area of catalog().categories.filter(a=>draft.areas.includes(a.id))){
   const group=n('section',undefined,'disc-topic-group'),h=n('h2');h.append(icon(area.id,'disc-mini-icon'),t(area.title));group.append(h);const row=n('div',undefined,'disc-chips');
   for(const x of catalog().topics.filter(y=>y.category===area.id)){const dx=draft.diagnosed.includes(x.id),c=choiceButton([n('i',undefined,'disc-check'),t(x.title)],dx||draft.topics.includes(x.id),()=>{toggle(draft.topics,x.id);render();document.querySelector(`.disc-chips [data-topic="${x.id}"]`)?.focus();},'disc-chip');c.dataset.topic=x.id;if(dx){c.disabled=true;c.append(n('em',t(C.diagnosisTag),'disc-tag is-diagnosis'));}row.append(c);}
   group.append(row);card.append(group);
  }
  return {nextLabel:draft.topics.length||draft.diagnosed.length?t(C.next):t(C.skip),onNext:advance};
 }
 function serviceCopy(id){const s=services()[id];return {title:t(s[0]),text:t(s[1])};}
 function prioritiesStep(card){
  const active=M().autismActive(draft),locked=id=>M().gated.includes(id)&&!active;
  if(M().hasAutism(draft)){
   const box=n('section',undefined,'disc-autism');box.append(n('h2',t(C.autismTitle)),named('p',C.autismLead,child.name,'disc-lead'));const grid=n('div',undefined,'disc-tiles');
   for(const area of M().autismAreas){const closed=area.services.every(locked),b=choiceButton([icon(area.services[0]==='speech'?'speech':area.services[0],'disc-tile-icon'),(()=>{const c=n('span',undefined,'disc-tile-copy');c.append(n('strong',t(area.title)),n('small',t(area.hint)));return c;})(),n('i',undefined,'disc-check')],draft.autismAreas.includes(area.id),()=>{toggle(draft.autismAreas,area.id);render();document.querySelector(`[data-autism="${area.id}"]`)?.focus();},'disc-tile');b.dataset.autism=area.id;if(closed){b.disabled=true;b.append(n('em',t(C.locked),'disc-tag is-locked'));}grid.append(b);}
   box.append(grid);card.append(box);
  }
  const options=M().priorityOptions(draft),full=draft.priorities.length>=3;
  if(options.length){const box=n('section',undefined,'disc-priorities');if(M().hasAutism(draft))box.append(n('h2',t(C.prioritiesTitle)),n('p',t(C.prioritiesLead),'disc-lead'));const grid=n('div',undefined,'disc-tiles');
   for(const id of options){const on=draft.priorities.includes(id),copy=serviceCopy(id),b=choiceButton([icon(id,'disc-tile-icon'),(()=>{const c=n('span',undefined,'disc-tile-copy');c.append(n('strong',copy.title),n('small',copy.text));return c;})(),icon('star','disc-star')],on,()=>{if(!on&&full)return;toggle(draft.priorities,id);render();document.querySelector(`[data-priority="${id}"]`)?.focus();},'disc-tile is-priority');b.dataset.priority=id;if(!on&&full)b.setAttribute('aria-disabled','true');grid.append(b);}
   box.append(grid);if(full)box.append(n('p',t(C.upTo),'disc-hint'));card.append(box);}
  return {nextLabel:fill(C.seeSummary).replace('{name}',child.name),onNext:advance};
 }

 // ---------- Summary ----------
 function renderSummary(){
  const d=M().fromChild(child),list=M().services(d),status=M().statuses.find(s=>s.id===d.status),age=window.RafiqSetup.childContext(child).chronological;
  const hero=n('section',undefined,'disc-hero');const avatar=n('span',undefined,'story-avatar disc-hero-avatar');const copy=n('div');
  copy.append(n('span',t(first?C.kicker:C.editKicker),'disc-kicker'));const h=named('h1',C.summaryTitle,child.name);h.tabIndex=-1;h.id='discTitle';copy.append(h);
  const meta=n('p',undefined,'disc-meta');if(age)meta.append(n('span',ageLabel(age)));if(flash){const s=n('span',undefined,'disc-saved');s.setAttribute('role','status');s.append(icon('check','disc-mini-icon'),t(C.saved));meta.append(s);}copy.append(meta,n('p',t(C.summaryLead),'disc-lead'));hero.append(avatar,copy);root.append(hero);
  // What the family shared
  const shared=n('section',undefined,'disc-shared');
  const tile=(label,key)=>{const s=n('article',undefined,'disc-panel');const h=n('h2');h.append(icon(key,'disc-mini-icon'),label);s.append(h);shared.append(s);return s;};
  const st=tile(t(C.statusLabel),status?.id||'private');st.append(n('p',status?t(status.title):t(C.notShared),'disc-status-text'));if(d.status==='diagnosed'&&d.following)st.append(n('p',t(C.following[d.following]),'disc-sub'));if(d.diagnosisNote){const note=n('p',d.diagnosisNote,'disc-sub');note.setAttribute('data-user-content','');st.append(note);}
  const ar=tile(t(C.areasLabel),'development'),arow=n('div',undefined,'disc-pills');for(const id of d.areas){const pill=n('span',undefined,'disc-pill');pill.append(icon(id,'disc-mini-icon'),t(areaOf(id).title));arow.append(pill);}if(d.monitoring){const pill=n('span',undefined,'disc-pill');pill.append(icon('monitoring','disc-mini-icon'),t(C.general2));arow.append(pill);}if(!arow.children.length)arow.append(n('span',t(C.noAreas),'disc-empty'));ar.append(arow);
  const tp=tile(t(C.topicsLabel),'learning'),trow=n('div',undefined,'disc-pills');for(const id of M().allTopics(d)){const pill=n('span',t(topicOf(id).title),'disc-pill'+(d.diagnosed.includes(id)?' is-diagnosis':''));if(d.diagnosed.includes(id))pill.append(n('em',t(C.diagnosisTag)));trow.append(pill);}if(!trow.children.length)trow.append(n('span',t(C.noTopics),'disc-empty'));tp.append(trow);
  const pr=tile(t(C.prioritiesLabel),'star'),prow=n('div',undefined,'disc-pills');for(const id of d.priorities){const pill=n('span',undefined,'disc-pill is-priority');pill.append(icon('star','disc-mini-icon'),serviceCopy(id).title);prow.append(pill);}for(const key of d.autismAreas){const pill=n('span',undefined,'disc-pill is-priority');pill.append(icon('star','disc-mini-icon'),t(M().autismAreas.find(a=>a.id===key).title));prow.append(pill);}if(!prow.children.length)prow.append(n('span',t(C.noPriorities),'disc-empty'));pr.append(prow);
  root.append(shared);
  // Relevant existing services
  const sv=n('section',undefined,'disc-services');sv.append(n('h2',t(C.servicesTitle)));const grid=n('div',undefined,'disc-service-grid');
  for(const s of list){const [title,text,page,action,kind]=services()[s.id],card=n('article',undefined,'disc-service'+(s.priority?' is-priority':'')+(s.locked?' is-locked':''));card.dataset.service=s.id;
   const top=n('div',undefined,'disc-service-top');top.append(icon(s.id,'disc-service-icon'),n('small',t(kind),'disc-kind'));if(s.priority){const tag=n('em',undefined,'disc-tag is-priority');tag.append(icon('star','disc-mini-icon'),t(C.priorityTag));top.append(tag);}card.append(top,n('h3',t(title)),n('p',t(text)));
   const topics=s.sources.filter(x=>topicOf(x)).map(x=>t(topicOf(x).title));if(topics.length){const f=n('p',undefined,'disc-for');f.append(n('b',t(C.forLabel)+': '),topics.slice(0,3).join(' · ')+(topics.length>3?' +'+(topics.length-3):''));card.append(f);}
   if(s.locked)card.append(n('p',t(C.locked),'disc-locked-note'));
   else if(s.id==='specialists'&&s.specialties.length){const row=n('div',undefined,'disc-spec-links');for(const sp of s.specialties){const a=n('a',t(M().specialties[sp]||p(sp,sp)),'disc-spec');a.href=M().specialistHref(sp);row.append(a);}card.append(row);}
   else{const a=n('a',undefined,'disc-action');a.href=page;a.append(t(action),' ',n('span','→','disc-arrow'));card.append(a);}
   grid.append(card);}
  sv.append(grid);const browse=n('a',t(C.browse),'disc-link');browse.href='support-areas.html?child='+encodeURIComponent(child.id);sv.append(browse);root.append(sv);
  // Next steps
  const first2=list.find(s=>s.priority&&!s.locked)||list.find(s=>!s.locked),ns=n('section',undefined,'disc-next-steps');ns.append(n('h2',t(C.stepsTitle)));const ol=n('ol',undefined,'disc-timeline');
  const stepItem=(label,href,key)=>{const li=n('li');li.append(icon(key,'disc-mini-icon'));if(href){const a=n('a',label);a.href=href;li.append(a);}else li.append(n('span',label));ol.append(li);};
  if(first2){const [title,,page]=services()[first2.id];stepItem(fill(C.stepStart).replace('{title}',t(title)),first2.id==='specialists'&&first2.specialties[0]?M().specialistHref(first2.specialties[0]):page,first2.id);}
  stepItem(t(first?C.stepActivity:C.stepActivityLater),first?'getting-started.html?child='+encodeURIComponent(child.id):'daily-activity.html','play');stepItem(t(C.stepHome),null,'everyday');ns.append(ol);root.append(ns);
  // Actions
  const actions=n('div',undefined,'disc-footer disc-summary-actions');const edit=n('button',t(C.edit),'disc-back');edit.type='button';edit.onclick=()=>{view='flow';step=0;flash=false;draft=M().fromChild(child);render(true);};
  const go=n('button',undefined,'disc-next');go.type='button';go.append(returnTo==='profile'?fill(C.toProfile).replace('{name}',child.name):t(C.home),' ',n('span','→','disc-arrow'));go.onclick=leave;go.id='discContinue';actions.append(edit,go);root.append(actions);
  root.append(named('p',C.disclaimer,child.name,'disc-disclaimer'));
 }

 function render(moveFocus){
  if(!child)return;root.replaceChildren();root.dataset.noTranslate='';document.body.dataset.discoveryView=view;
  document.getElementById('setupSteps').hidden=!first;const exit=document.getElementById('discoveryExit');exit.dataset.noTranslate='';exit.textContent=t(returnTo==='profile'?p('Back to profile','رجوع للملف'):view==='summary'?p('Go to home','روحوا للرئيسية'):first?p('Skip for now','تخطّي هلأ'):p('Back to home','رجوع للرئيسية'));exit.href=exitHref();exit.onclick=e=>{e.preventDefault();leave();};
  if(view==='summary')renderSummary();
  else{
   const list=steps();step=Math.min(step,list.length-1);const key=list[step];
   const titles={status:[C.statusTitle,C.statusLead],diagnosis:[C.diagnosisTitle,C.diagnosisLead],areas:[C.areasTitle[draft.status]||C.areasTitle.concerns,C.areasLead],topics:[C.topicsTitle,C.topicsLead],priorities:[M().hasAutism(draft)?p('What would you like to explore?','شو بتحبّوا تستكشفوا؟'):C.prioritiesTitle,M().hasAutism(draft)?null:C.prioritiesLead]};
   root.append(header(first?C.kicker:C.editKicker,...titles[key]),dots(list));
   const card=n('section',undefined,'disc-card disc-step-'+key);root.append(card);
   const config={status:statusStep,diagnosis:diagnosisStep,areas:areasStep,topics:topicsStep,priorities:prioritiesStep}[key](card);
   if(busy)config.nextLabel=t(C.saving);root.append(footer(list,config));
  }
  if(moveFocus){document.getElementById('discTitle')?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'auto'});}
 }
 document.addEventListener('DOMContentLoaded',()=>{
  try{
   const id=params.get('child')||window.RafiqFamily.selected();child=window.RafiqSetup.readChildren().find(c=>c.id===id);
   if(!child){root.append(n('p',t(C.missing),'disc-lead'));const a=n('a',t(C.addChild),'disc-next');a.href='onboarding.html';root.append(a);return;}
   window.RafiqFamily.select(child.id);first=params.get('first')==='1'&&!child.setupCompletedAt;returnTo=['profile','home'].includes(params.get('return'))?params.get('return'):null;
   draft=M().fromChild(child);view=child.supportDiscovery&&params.get('edit')!=='1'?'summary':'flow';
   render();new MutationObserver(()=>render()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  }catch{showError(t(C.failed));}
 });
})();
