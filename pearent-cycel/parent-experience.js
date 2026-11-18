/* Service discovery uses explicit family choices. Existing controllers and data
   remain authoritative; this view never writes child/clinical records. */
(() => {
 'use strict';const p=(en,ar)=>({en,ar});
 const services={
  passport:[p('Get to know my child','تعرّفوا على طفلي'),p('Keep ways of communicating, interests and preferences together.','بطاقة بالصور بتعرّف بطفلكم: شو بحب، كيف بتواصل وشو بساعده يرتاح.'),'about-me.html',p('Open my child’s card','افتحوا بطاقة طفلي'),p('Profile','ملف')],
  routines:[p('Visual routines','روتين بصري'),p('Create a first–then board for everyday transitions.','اعملوا لوحة «أولًا، بعدين» للانتقالات اليومية.'),'support-tools.html?tool=boards',p('Create a visual board','اعملوا لوحة بصرية'),p('Tool','أداة')],
  sensory:[p('Sensory preferences','التفضيلات الحسّية'),p('Record what feels comfortable in About Me. A dedicated sensory tool is not available yet.','سجّلوا اللي بريح طفلكم في بطاقة «تعرّفوا على طفلي». أداة حسّية متخصصة لسه مش متاحة.'),'about-me.html',p('Review preferences','راجعوا التفضيلات'),p('Profile','ملف')],
  play:[p('Play together','نلعب سوا'),p('Try an activity selected by age and reported readiness, then save your observation.','جرّبوا نشاط حسب العمر والجاهزية المسجّلة واحفظوا ملاحظتكم.'),'daily-activity.html',p('Open today’s activity','افتحوا نشاط اليوم'),p('Activity','نشاط')],
  speech:[p('Speech and communication','النطق والتواصل'),p('Explore the speech directory and review a specialist’s experience before choosing.','شوفوا دليل النطق وراجعوا خبرة المختص قبل الاختيار.'),'specialists.html?specialty=speech',p('Explore speech specialists','شوفوا مختصّي النطق'),p('Specialist service','خدمة مختص')],
  sleep:[p('Sleep observations','ملاحظات النوم'),p('Keep routine observations and visit questions in a health note. A dedicated sleep diary is not available yet.','احفظوا ملاحظات الروتين وأسئلة الزيارة بملاحظة صحية. يوميات نوم متخصصة لسه مش متاحة.'),'health.html?record=note',p('Add a sleep note','أضيفوا ملاحظة نوم'),p('Tracking','متابعة')],
  feeding:[p('Feeding observations','ملاحظات التغذية'),p('Organize mealtime observations for your care team; no diet is generated.','رتّبوا ملاحظات الأكل لفريق الرعاية؛ بدون توليد حمية.'),'health.html?record=note',p('Add a feeding note','أضيفوا ملاحظة تغذية'),p('Tracking','متابعة')],
  behaviour:[p('Describe a concern','اوصفوا اللي مقلقكم'),p('Keep your own description and choose whether to seek specialist support.','احفظوا وصفكم واختاروا إذا بدكم تتواصلوا مع مختص.'),'screening.html',p('Organize my concern','رتّبوا ملاحظات القلق'),p('Observation','ملاحظة')],
  growth:[p('Developmental observations','ملاحظات النمو'),p('Explore your child’s stage and save what you notice, without a diagnostic score.','تعرّفوا على مرحلة طفلكم واحفظوا ملاحظاتكم بدون علامة تشخيصية.'),'milestones.html',p('Open the growth journal','افتحوا سجل النمو'),p('Tracking','متابعة')],
  health:[p('Health records','السجل الصحي'),p('Keep dated measurements, vaccines and family health notes.','اجمعوا القياسات المؤرخة والمطاعيم والملاحظات الصحية.'),'health.html',p('View health records','شوفوا السجل الصحي'),p('Tracking','متابعة')],
  journey:[p('Autism support journey','مسار دعم التوحد'),p('Connect the family profile, visit preparation, home observations and follow-up.','اربطوا ملف العيلة وتحضير الزيارة وملاحظات البيت والمتابعة.'),'support-journey.html',p('Open the support journey','افتحوا مسار الدعم'),p('Support','دعم')],
  appointments:[p('Appointments and reports','المواعيد والتقارير'),p('Review sessions, original reports and your follow-up notes.','راجعوا الجلسات والتقارير الأصلية وملاحظات المتابعة.'),'bookings.html',p('View appointments and reports','شوفوا المواعيد والتقارير'),p('Specialist service','خدمة مختص')],
  specialists:[p('Find a specialist','لاقوا مختص'),p('Review the directory, experience, fees and demo booking details.','راجعوا الدليل والخبرة والرسوم وتفاصيل الحجز التجريبي.'),'specialists.html',p('Browse specialists','تصفّحوا المختصين'),p('Specialist service','خدمة مختص')],
  memories:[p('Family memories','ذكريات العيلة'),p('Save photos and meaningful family moments.','احفظوا الصور ولحظات العيلة المهمة.'),'album.html',p('Open memories','افتحوا الذكريات'),p('Memory','ذكرى')]
 };
 const categories=[['Development','النمو والتطوّر','growth'],['Speech and language','النطق واللغة','speech'],['Behaviour and attention','السلوك والانتباه','behaviour'],['Emotional wellbeing','المشاعر والصحة النفسية','behaviour'],['Learning','التعلّم','play'],['Sensory differences','الاختلافات الحسّية','health'],['Feeding','التغذية','feeding'],['Sleep','النوم','sleep'],['Physical and medical','الصحة الجسدية والطبية','health'],['Genetic syndromes','المتلازمات الوراثية','growth'],['Social and everyday life','التفاعل والحياة اليومية','play']];
 function recommend(child){const choices=window.RafiqQuestionMap.project(child).goals.map(g=>g.key),autism=window.RafiqSupportJourney?.active(child)===true;const ids=autism?['passport','routines','sensory']:[...new Set(choices.map(k=>({speech:'speech',sleep:'sleep',feeding:'feeding',behaviour:'behaviour',play:'play',growth:'growth',other:'health'})[k]).filter(Boolean))];if(!ids.length)ids.push('play','growth','health');return ids.slice(0,3).map(id=>({id,reason:autism?p('Your family selected autism support.','عيلتكم اختارت مسار دعم التوحد.'):choices.length?p('Based on a goal your family selected.','حسب هدف اختارته عيلتكم.'):p('Explore by age; no support need was inferred.','استكشاف حسب العمر؛ ما استنتجنا احتياج دعم.')}));}
 // Presentation priority only: existing records and service models stay authoritative.
 function nextAction(model,now=new Date()){
  if(model.upcoming&&model.upcoming.date.toDateString()===now.toDateString())return {kind:'appointment',booking:model.upcoming.booking};
  if(model.unseenReport&&model.report)return {kind:'report',report:model.report};
  return {kind:'next',...model.next};
 }
 window.RafiqParentExperience={services,categories,recommend,nextAction};
 if(!location.pathname.endsWith('/parent-dashboard.html'))return;
 /* ---------- Phase 3 Home ----------
    One child at a time. Everything below reads that child's own records:
    supportDiscovery (Phase 2), the Today model (bookings, reports, observations,
    health records), and the existing daily-activity player. Nothing is inferred. */
 const lang=()=>window.RafiqLanguage?.getLanguage?.()||document.documentElement.lang||'ar',t=v=>v[lang()==='ar'?'ar':'en'];
 const n=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined&&text!==null)el.textContent=text;if(cls)el.className=cls;return el;};
 const bdi=value=>{const b=n('bdi',value);b.setAttribute('data-user-content','');return b;};
 // Sentences keep the child's name isolated, so it is never translated or reordered.
 const named=(tag,pair,name,cls)=>{const el=n(tag,undefined,cls),parts=t(pair).split('{name}');el.append(parts[0]);for(let i=1;i<parts.length;i++)el.append(bdi(name),parts[i]);return el;};
 const ageText=a=>[[a.years,'year','سنة','سنتان','سنوات'],[a.months,'month','شهر','شهران','أشهر']].filter(([count])=>count).map(([count,en,one,two,many])=>lang()==='ar'?(count===2?two:new Intl.NumberFormat('ar').format(count)+' '+(count===1?one:count<=10?many:one)):count+' '+en+(count===1?'':'s')).join(lang()==='ar'?' و':', ')||t(p('Under one month','أقل من شهر'));
 const C={
  kicker:p('YOUR FAMILY HOME','رئيسية العيلة'),switchChild:p('Switch child','بدّلوا الطفل'),corrected:p('Corrected age: {n} months','العمر المصحّح: {n} شهر'),reviewBirth:p('Review the date of birth','راجعوا تاريخ الولادة'),profile:p('Child profile','ملف الطفل'),
  status:{diagnosed:p('Reported diagnosis','تشخيص مسجّل من الأهل'),assessment:p('Assessment in progress','تقييم قيد الإجراء'),concerns:p('Your concerns','مخاوفكم'),development:p('Following general development','متابعة النمو العام'),private:p('Exploring support','استكشاف الدعم'),none:p('Support not set yet','الدعم لسه ما انحدّد')},
  editSupport:p('Edit','تعديل'),
  nextEyebrow:p('YOUR NEXT STEP','خطوتكم الجايّة'),why:p('Why','ليش'),what:p('What you’ll do','شو رح تعملوا'),where:p('Where it leads','وين بتوصلوا'),
  todayTitle:p('Today together','اليوم سوا'),todayKind:p('TODAY’S ACTIVITY','نشاط اليوم'),todayFallback:p('A little moment at your child’s pace','لحظة بسيطة على راحة طفلكم'),todayNone:p('No activity matches this age and play readiness today. You can save a short observation instead.','ما في نشاط مناسب للعمر والجاهزية اليوم. بتقدروا تحفظوا ملاحظة قصيرة بدالها.'),
  saved:p('Your response is saved','تفاعلكم محفوظ'),enough:p('A little time is enough','وقت بسيط بكفّي'),tryIt:p('Try it together','جرّبوه سوا'),review:p('Review today’s activity','راجعوا نشاط اليوم'),options:p('View activity options','شوفوا خيارات النشاط'),browse:p('Browse activities','تصفّحوا الأنشطة'),sourced:p('Each idea lists its public source (CDC, AAP or UNICEF).','كل فكرة إلها مصدر عام (CDC أو AAP أو UNICEF).'),
  careTitle:p('Coming up','الجاي'),appointment:p('Appointment','موعد'),viewAppointment:p('View appointment','شوفوا الموعد'),newReport:p('New report','تقرير جديد'),latestReport:p('Latest report','آخر تقرير'),readReport:p('Read the report','اقرؤوا التقرير'),yourSpecialist:p('Your specialist','مختصكم'),
  noCare:p('No appointments or reports yet.','ما في مواعيد أو تقارير لهلأ.'),findSpecialist:p('Find a specialist','لاقوا مختص'),allAppointments:p('All appointments','كل المواعيد'),
  supportTitle:p('Support for {name}','الدعم لـ{name}'),topicsLabel:p('Topics you chose','المواضيع اللي اخترتوها'),diagnosisTag:p('Diagnosis','تشخيص'),forTopic:p('For','لـ'),priority:p('Your priority','أولويتكم'),
  noTopics:p('No topics chosen yet.','لسه ما اخترتوا مواضيع.'),generalLine:p('Age-based resources for everyday growth, play and health.','مصادر حسب العمر للنمو واللعب والصحة.'),storyLine:p('Based on the goals in {name}’s story. Share what you’d like support with to make this more personal.','حسب أهداف حكاية {name}. شاركوا بشو بدكم دعم لنخصّص هالقسم أكثر.'),
  summary:p('Full support summary','ملخص الدعم الكامل'),allTopics:p('All 32 support topics','كل مواضيع الدعم الـ٣٢'),shareSupport:p('Share what you’d like support with','شاركوا بشو بدكم دعم'),
  growthTitle:p('Growth and observations','النمو والملاحظات'),obsCount:p('saved observations','ملاحظات محفوظة'),healthCount:p('health records','سجلات صحية'),recent:p('Recent','الأحدث'),addObservation:p('Add an observation','أضيفوا ملاحظة'),allObservations:p('All observations','كل الملاحظات'),noObs:p('No observations yet. One small note is a good start.','لسه ما في ملاحظات. ملاحظة صغيرة بداية حلوة.'),
  obsType:{observation:p('Observation','ملاحظة'),concern:p('Question','سؤال'),'daily-moment':p('Activity','نشاط')},outcome:{tried:p('We tried today’s activity','جرّبنا نشاط اليوم'),later:p('Saved the activity for later','أجّلنا النشاط لبعدين'),'not-for-us':p('This activity was not for us','النشاط ما ناسبنا')},
  stageTitle:p('Milestones around {age}','مراحل النمو حوالين {age}'),stageText:p('A checklist from the CDC, a public-health source. It is not a test; use it to talk with your care team.','قائمة من CDC، مصدر صحة عامة. مش اختبار؛ استخدموها للحديث مع فريق الرعاية.'),stageLink:p('Open the CDC checklist','افتحوا قائمة CDC'),external:p('External site · English','موقع خارجي · بالإنجليزي'),stageCorrected:p('Using corrected age, as recorded in the profile.','حسب العمر المصحّح المسجّل بالملف.'),
  shortcuts:p('More for your family','أكثر لعيلتكم'),
  footer:p('Educational support, not a diagnosis or emergency care. Your family chooses what to share.','دعم تثقيفي، مش تشخيص ولا رعاية طوارئ. عيلتكم بتختار شو تشارك.'),
  warning:p('Some records could not be read. Your saved records were not changed.','ما قدرنا نقرأ بعض السجلات. بياناتكم المحفوظة ما تغيّرت.'),
  loadError:p('Home could not load. Your records were not changed; use the navigation or reload.','ما قدرنا نحمّل الرئيسية. سجلاتكم ما تغيّرت؛ استخدموا التنقّل أو حدّثوا الصفحة.'),
  reportError:p('Could not open the report. Open it from appointments.','ما قدرنا نفتح التقرير. افتحوه من المواعيد.')
 };
 // Next-step copy: why it matters, what the parent does, and where it leads.
 const N={
  appointment:[p('Your appointment is today','موعدكم اليوم'),p('Your visit with {specialist} is today.','زيارتكم مع {specialist} اليوم.'),p('Check the time and note the questions you want to ask.','تأكّدوا من الوقت وسجّلوا الأسئلة اللي بدكم تسألوها.'),p('Appointment details','تفاصيل الموعد')],
  report:[p('A new report is ready','تقرير جديد جاهز'),p('{specialist} sent a report for {name}.','{specialist} بعت تقرير عن {name}.'),p('Read the original observations and recommendations.','اقرؤوا الملاحظات والتوصيات الأصلية.'),p('Specialist report','تقرير المختص')],
  followup:[p('A follow-up you wanted to revisit','متابعة حابين ترجعولها'),p('The reminder you set has arrived.','وصل التذكير اللي حطّيتوه.'),p('Review your notes next to the original report.','راجعوا ملاحظاتكم جنب التقرير الأصلي.'),p('Specialist report','تقرير المختص')],
  unsupported:[p('Your records are still here','سجلاتكم لسه هون'),p('Rafeeq’s age content covers birth to seven years.','محتوى رفيق حسب العمر بغطّي من الولادة لسبع سنين.'),p('Open health records, reports and appointments.','افتحوا السجل الصحي والتقارير والمواعيد.'),p('Health records','السجل الصحي')],
  supportTool:[null,p('You recorded an autism diagnosis and chose support tools.','سجّلتوا تشخيص توحد واخترتوا أدوات دعم.'),null,null],
  concern:[null,p('You started describing a concern.','بلّشتوا توصفوا قلقكم.'),p('Pick up where you left off; nothing is shared automatically.','كمّلوا من وين وقفتوا؛ ما في مشاركة تلقائية.'),p('Concern notes','ملاحظات القلق')],
  discover:[p('Tell us what you’d like support with','احكولنا بشو بدكم دعم'),p('Home can then show resources that fit {name}.','هيك الرئيسية بتعرض مصادر بتناسب {name}.'),p('Answer a few short questions. All are optional.','جاوبوا كم سؤال قصير. كلها اختيارية.'),p('Support questions','أسئلة الدعم')],
  topics:[p('Choose the topics on your mind','اختاروا المواضيع اللي شاغلة بالكم'),p('You shared that you have concerns, but no topics yet.','شاركتوا إنه عندكم مخاوف، بس بدون مواضيع لهلأ.'),p('Pick any topics; a topic is not a diagnosis.','اختاروا أي مواضيع؛ الموضوع مش تشخيص.'),p('Support questions','أسئلة الدعم')],
  priority:[null,p('You chose this as a priority for {topic}.','اخترتوه كأولوية لـ{topic}.'),null,null],
  priorityGeneral:[null,p('You chose this as a priority.','اخترتوه كأولوية.'),null,null],
  activity:[p('A little play, at {name}’s pace','لعب بسيط على راحة {name}'),p('A short idea matched to {name}’s age and play readiness.','فكرة قصيرة مناسبة لعمر {name} وجاهزيته للعب.'),p('Try it together, then save how it went.','جرّبوها سوا، وبعدين احفظوا كيف كانت.'),p('Today’s activity','نشاط اليوم')],
  // Destination names for "Where it leads" (the page, not the service title again).
  places:{passport:p('Your child’s card','بطاقة طفلكم'),routines:p('Support tools','أدوات الدعم'),sensory:p('Your child’s card','بطاقة طفلكم'),play:p('Today’s activity','نشاط اليوم'),speech:p('Speech specialist directory','دليل مختصّي النطق'),sleep:p('Health notes','الملاحظات الصحية'),feeding:p('Health notes','الملاحظات الصحية'),behaviour:p('Concern notes','ملاحظات القلق'),growth:p('Growth journal','سجل النمو'),health:p('Health records','السجل الصحي'),journey:p('Autism support journey','مسار دعم التوحد'),appointments:p('Appointments','المواعيد'),specialists:p('Specialist directory','دليل المختصين'),memories:p('Memories','الذكريات')},
  observe:[p('Keep a small observation','احفظوا ملاحظة صغيرة'),p('Short notes help you see {name}’s growth over time.','الملاحظات القصيرة بتساعدكم تشوفوا نمو {name} مع الوقت.'),p('Write one thing you noticed today.','اكتبوا إشي واحد لاحظتوه اليوم.'),p('Growth journal','سجل النمو')]
 };
 const fill=(pair,vars)=>t(pair).replace(/\{(\w+)\}/g,(m,k)=>vars[k]??m);
 const iconPaths={
  calendar:'M4 5h16v16H4ZM8 2v6m8-6v6M4 11h16',report:'M6 3h9l4 4v14H6ZM10 11h5m-5 4h5',why:'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3Z',what:'M8 13V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5V4a1.5 1.5 0 0 1 3 0v6m0-3.5a1.5 1.5 0 0 1 3 0V13a7 7 0 0 1-7 7c-2.5 0-4-1-5.4-3L4 13.6a1.5 1.5 0 0 1 2.6-1.5L8 14',where:'M5 12h14m-5-5 5 5-5 5',
  arrow:'M5 12h14m-5-5 5 5-5 5',external:'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',check:'M5 12.5l4.2 4.2L19 7',
  passport:'M12 4a8 8 0 1 0 0 16 8 8 0 1 0 0-16ZM9 14c1.6 1.5 4.4 1.5 6 0M9.5 10.2h.01M14.5 10.2h.01',routines:'M4 4h7v7H4ZM13 4h7v7h-7ZM4 13h7v7H4ZM13 13h7v7h-7Z',sensory:'M3 7c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0M3 12c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0M3 17c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0',play:'M4 13h7v7H4ZM13 13h7v7h-7ZM8.5 4h7v7h-7Z',speech:'M4 5h16v11H9l-5 4ZM8 9.5h8M8 12.5h5',sleep:'M19.5 14.5A7.5 7.5 0 1 1 9.5 4.5a6 6 0 0 0 10 10Z',feeding:'M6 3v5a2.5 2.5 0 0 0 5 0V3M8.5 10.5V21M8.5 3v4M16.5 3c-1.9 0-2.5 2.4-2.5 4.5S15 11 16.5 11 19 9.6 19 7.5 18.4 3 16.5 3ZM16.5 11v10',behaviour:'M6 3h9l4 4v14H6ZM10 11h5m-5 4h5',growth:'M4 3v17h17M8 16v-4m5 4V8m5 8V5',health:'M3 12h4l2-5 4 10 2-5h6',journey:'M5 19c4 0 3-6 7-6s3-6 7-6M5 17v4M19 5v4',appointments:'M4 5h16v16H4ZM8 2v6m8-6v6M4 11h16',specialists:'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21c0-4 3-7 7-7s7 3 7 7M19 8v6M16 11h6',memories:'M4 6h16v13H4ZM8 15l3-3 4 4 2-2 3 3M9 10h.01',
  topics:'M4 5.5C6.5 4.5 9.5 4.6 12 6.5c2.5-1.9 5.5-2 8-1v13c-2.5-1-5.5-.9-8 1-2.5-1.9-5.5-2-8-1ZM12 6.5v13',guide:'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18ZM9.6 9.5a2.4 2.4 0 1 1 3.4 2.2c-.6.3-1 .8-1 1.5v.4M12 16.6h.01',stage:'M12 21v-8M12 13c0-4 3-7 7-7 0 4-3 7-7 7ZM12 15c0-3-2.5-5.5-6-5.5 0 3 2.5 5.5 6 5.5Z',star:'m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z'
 };
 function icon(key,cls='hm-icon'){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('class',cls);const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',iconPaths[key]||iconPaths.growth);svg.append(path);return svg;}
 function avatar(child,cls){const a=n('span',undefined,'hm-avatar '+(child.gender==='female'?'is-girl':child.gender==='male'?'is-boy':'is-neutral')+(cls?' '+cls:''));a.setAttribute('aria-hidden','true');if(!['female','male'].includes(child.gender))a.textContent=Array.from(child.name||'?')[0];return a;}
 function link(label,href,cls='hm-link'){const a=n('a',undefined,cls);a.href=href;a.append(label);return a;}
 function recentNotes(child){try{const list=JSON.parse(localStorage.getItem('rafiqAgeObservations_'+child.id)||'[]');return Array.isArray(list)?list.filter(x=>x&&typeof x==='object'&&(!x.childId||x.childId===child.id)).sort((a,b)=>(Date.parse(b.updatedAt||b.createdAt)||0)-(Date.parse(a.updatedAt||a.createdAt)||0)):[];}catch{return [];}}
 // Which of the three journeys this child is on, from the family's own Phase 2 answers.
 function journeyOf(child,d){const known=!!child.supportDiscovery||['worried','none','diagnosed_no_followup','diagnosed_following'].includes(child.supportProfile?.situation);if(!known||!d?.status)return 'none';return d.status==='diagnosed'?'diagnosed':['assessment','concerns'].includes(d.status)?'concerns':d.status==='monitoring'?'development':'private';}

 function render(){try{
  const children=window.RafiqSetup.readChildren(),requested=new URLSearchParams(location.search).get('child'),child=children.find(c=>c.id===requested)||children.find(c=>c.id===window.RafiqFamily.selected());if(!child)return;
  const model=window.RafiqToday.build(child),D=window.RafiqSupportDiscovery,d=D?D.fromChild(child):null,journey=journeyOf(child,d);
  const catalog=window.RafiqSupportCatalog,topicOf=id=>catalog?.topics.find(x=>x.id===id);
  const old=document.getElementById('parentExperience'),focused=document.activeElement,inlineActivity=document.getElementById('homeActivityPanel');
  const root=n('div',undefined,'experience hm');root.id='parentExperience';root.dataset.journey=journey;
  const section=(id,cls)=>{const s=n('section',undefined,'hm-section '+(cls||''));s.id=id;s.dataset.noTranslate='';root.append(s);return s;};
  const reportLink=(label,report,cls)=>{const a=link(label,'specialist-report.html?child='+encodeURIComponent(child.id)+'&booking='+encodeURIComponent(report.bookingId),cls);
   a.onclick=event=>{try{const fresh=window.RafiqSetup.readChildren().find(c=>c.id===child.id);if(!fresh||!window.RafiqFamily.canAccessId(child.id))throw Error('Unavailable child');
    sessionStorage.setItem('rafiqSelectedReportBooking',report.bookingId);const key='rafiqTodaySeenReports_'+child.id;let seen=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(seen))seen=[];
    const stamp=String(report.id||report.bookingId)+'|'+String(report.createdAt||report.reportDate||'');if(!seen.includes(stamp))seen.push(stamp);localStorage.setItem(key,JSON.stringify(seen.slice(-100)));
   }catch{event.preventDefault();const error=document.getElementById('todayError');error.hidden=false;error.textContent=t(C.reportError);}};return a;};
  const appointmentURL=booking=>'bookings.html?booking='+encodeURIComponent(booking.id);
  const available=document.getElementById('dailyIdea')?.hidden===false,savedToday=document.getElementById('dailySaved')?.hidden===false;
  const translate=value=>lang()==='ar'?(window.RafiqHomeArabic?.[value]||value):value;
  const discoveryURL='support-discovery.html?child='+encodeURIComponent(child.id)+'&return=home';

  // 1. Child hero: who, how old, which support journey, and siblings.
  const hero=section('childOverview','hm-hero');const heroCopy=n('div',undefined,'hm-hero-copy');
  heroCopy.append(n('p',t(C.kicker)+' · '+new Intl.DateTimeFormat(lang(),{weekday:'long',day:'numeric',month:'long'}).format(new Date()),'hm-kicker'));
  const h1=n('h1');h1.id='childOverviewTitle';h1.append(bdi(child.name));heroCopy.append(h1);
  const ctx=window.RafiqSetup.childContext(child),meta=n('p',undefined,'hm-meta');meta.append(n('span',ctx.chronological?ageText(ctx.chronological):t(C.reviewBirth)));
  if(ctx.basis==='corrected'&&ctx.development)meta.append(n('span',fill(C.corrected,{n:new Intl.NumberFormat(lang()).format(ctx.development.totalMonths)}),'hm-soft'));
  heroCopy.append(meta);
  const status=n('div',undefined,'hm-status');const pill=n('span',undefined,'hm-pill is-'+journey);pill.append(icon(journey==='diagnosed'?'topics':journey==='concerns'?'guide':journey==='development'?'growth':'stage','hm-mini'),t(journey==='concerns'&&d.status==='assessment'?C.status.assessment:C.status[journey]));status.append(pill);
  status.append(link(t(journey==='none'?C.shareSupport:C.editSupport),journey==='none'?discoveryURL:discoveryURL,'hm-link'));heroCopy.append(status);
  hero.append(avatar(child,'hm-avatar-lg'),heroCopy);
  if(children.length>1){const nav=n('nav',undefined,'hm-siblings');nav.setAttribute('aria-label',t(C.switchChild));for(const other of children){const b=n('button',undefined,'hm-sibling');b.type='button';b.append(avatar(other),bdi(other.name));b.setAttribute('aria-pressed',String(other.id===child.id));b.onclick=()=>{if(other.id===child.id)return;try{window.RafiqFamily.select(other.id);location.assign('parent-dashboard.html?child='+encodeURIComponent(other.id));}catch{const e=document.getElementById('todayError');e.hidden=false;e.textContent=t(C.loadError);}};nav.append(b);}hero.append(nav);}

  // 2. One next step, with why / what / where. Time-sensitive care always wins.
  const services=D?D.services(d).filter(s=>!s.locked):[];
  const action=nextAction(model),step={};const set=(copy,vars,href,label)=>Object.assign(step,{title:copy[0]?fill(copy[0],vars):step.title,why:fill(copy[1],vars),what:copy[2]?fill(copy[2],vars):step.what,where:copy[3]?fill(copy[3],vars):step.where,href:href||step.href,label:label||step.label});
  const names={name:child.name};
  if(action.kind==='appointment'){set(N.appointment,{...names,specialist:action.booking.specialistName||t(C.yourSpecialist)},appointmentURL(action.booking),t(C.viewAppointment));}
  else if(action.kind==='report'){set(N.report,{...names,specialist:action.report.specialistName||t(C.yourSpecialist)},null,t(C.readReport));step.report=action.report;}
  else if(model.next.reportBookingId&&model.dueFollowup?.report){set(N.followup,names,null,translate(model.next.label));step.report=model.dueFollowup.report;}
  else if(!model.ageContext.supported){set(N.unsupported,names,'health.html',t(p('Open health records','افتحوا السجل الصحي')));}
  else if(model.next.support){Object.assign(step,{title:translate(model.next.title),what:translate(model.next.description),where:translate(model.next.title)});set(N.supportTool,names,model.next.url,translate(model.next.title));}
  else if(model.concernJourney&&journey!=='diagnosed'){Object.assign(step,{title:translate(model.next.title),what:t(N.concern[2])});set(N.concern,names,'screening.html',translate(model.next.label));}
  else if(journey==='none'){set(N.discover,names,discoveryURL+'&edit=1',t(p('Start the questions','ابدؤوا الأسئلة')));}
  else if(journey==='concerns'&&!D.allTopics(d).length&&!d.areas.length){set(N.topics,names,discoveryURL+'&edit=1',t(p('Choose topics','اختاروا المواضيع')));}
  else{
   const first=services.find(s=>s.priority&&s.id!=='journey');
   if(first){const [title,description,page,actionLabel]=window.RafiqParentExperience.services[first.id],topic=first.sources.map(topicOf).find(Boolean);
    Object.assign(step,{title:t(title),what:t(description),where:t(N.places[first.id]||title)});set(topic?N.priority:N.priorityGeneral,{topic:topic?t(topic.title):''},first.id==='specialists'&&first.specialties[0]?D.specialistHref(first.specialties[0]):page,t(actionLabel));step.service=first.id;}
   else if(available&&!savedToday)set(N.activity,names,'daily-activity.html',t(C.tryIt));
   else set(N.observe,names,'milestones.html',t(C.addObservation));
  }
  // 1b. The family journey: four stations, so parents always see where they are.
  {const diagnosed=journey==='diagnosed',href=String(step.href||'');
   const current=(['appointment','report'].includes(action.kind)||step.report||/bookings|report|follow-up/.test(href))?3:(journey==='none'&&/discovery/.test(href))?0:/activit|milestones|play|growth/.test(href)?1:/child-profile|about-me|onboarding|health/.test(href)?0:(diagnosed||model.concernJourney||journey==='concerns'||/screening|support-|specialist|discovery/.test(href))?2:journey==='none'?0:1;
   const stations=[[p('Get to know','نتعرّف'),p('Who is '+child.name+'?','مين '+child.name+'؟'),'child-profile.html'],[p('Play and observe','نلعب ونلاحظ'),p('What do we do today?','شو نعمل اليوم؟'),'activities.html'],diagnosed?[p('Diagnosis support','دعم التشخيص'),p('Tools for daily life','أدوات لحياتكم اليومية'),'support-journey.html']:[p('Ask for support','نطلب دعم'),p('Something worries us','في إشي مقلقنا'),'support-areas.html'],[p('Follow up','نتابع'),p('What did the specialist say?','شو قال المختص؟'),'bookings.html']];
   const bar=section('familyJourney','hm-journey');bar.append(n('p',t(p('Your journey with Rafiq','رحلتكم مع رفيق')),'hm-kicker'));
   const list=n('ol',undefined,'hm-journey-steps');stations.forEach(([title,question,url],i)=>{const li=n('li',undefined,'hm-journey-step'+(i===current?' is-current':i<current?' is-past':''));const a=n('a');a.href=url;if(i===current){a.setAttribute('aria-current','step');a.dataset.here=t(p('You are here','أنتم هون'));}a.append(n('span',String(i+1),'hm-journey-num'),n('strong',t(title)),n('span',t(question),'hm-journey-q'));li.append(a);list.append(li);});
   bar.append(list);if(diagnosed)bar.append(n('p',t(p('Rafiq walks with families before and after a diagnosis. Your support tools are in station 3.','رفيق بيرافق العيلة قبل التشخيص وبعده. أدوات الدعم تبعكم بالمحطة ٣.')),'hm-journey-note'));}
  const next=section('nextBestAction','hm-next');next.dataset.service=step.service||'';next.append(n('p',t(C.nextEyebrow),'hm-kicker'));const nextTitle=n('h2',step.title);nextTitle.id='nextBestActionTitle';next.append(nextTitle);
  const reasons=n('ul',undefined,'hm-reasons');for(const [key,label] of [['why',C.why],['what',C.what],['where',C.where]]){const li=n('li');li.dataset.reason=key;li.append(icon(key,'hm-reason-icon'),n('strong',t(label)),n('span',step[key]));reasons.append(li);}next.append(reasons);
  const cta=step.report?reportLink(step.label,step.report,'hm-primary'):link(step.label,step.href,'hm-primary');cta.append(icon('arrow','hm-mini hm-flip'));next.append(cta);

  // 2b. This week: a small, honest summary of what the family recorded (proof that the effort adds up).
  try{const DAY=86400000,since=Date.now()-7*DAY,recent=r=>Date.parse(r&&(r.updatedAt||r.createdAt)||'')>=since;
   const rows=(()=>{try{const v=JSON.parse(localStorage.getItem('rafiqAgeObservations_'+child.id)||'[]');return Array.isArray(v)?v:[];}catch{return [];}})().filter(recent);
   const reports=(()=>{try{const v=JSON.parse(localStorage.getItem('rafiqSpecialistReports')||'[]');return Array.isArray(v)?v:[];}catch{return [];}})().filter(r=>r.childId===child.id&&recent(r));
   const moments=rows.filter(r=>r.type==='daily-moment'),notes=rows.filter(r=>r.type!=='daily-moment');
   const week=section('weekSummary','hm-week');week.append(n('p',t(p('This week','هالأسبوع')),'hm-kicker'));const wh=n('h2',t(p('What happened with '+child.name,'شو صار مع '+child.name)));week.append(wh);
   const tiles=n('div',undefined,'hm-week-tiles');const fmt=v=>new Intl.NumberFormat(lang()).format(v);
   for(const [value,label,href] of [[moments.length,p('activities together','أنشطة سوا'),'activities.html'],[notes.length,p('notes from home','ملاحظات من البيت'),'milestones.html'],[reports.length,p('specialist reports','تقارير مختص'),'bookings.html']]){const a=n('a',undefined,'hm-week-tile');a.href=href;a.append(n('b',fmt(value)),n('span',t(label)));tiles.append(a);}
   week.append(tiles);
   const latest=[...rows].sort((a,b)=>String(b.updatedAt||b.createdAt).localeCompare(String(a.updatedAt||a.createdAt)))[0];
   if(latest){const line=n('p',undefined,'hm-week-latest');line.append(n('strong',t(p('Latest: ','آخر إشي: '))),n('span',String(latest.activityTitle||latest.text||'').split(/\r?\n/)[0].slice(0,140)));week.append(line);}
   else week.append(n('p',t(p('Nothing recorded yet this week. One small activity or note is enough to start.','لسا ما في إشي مسجّل هالأسبوع. نشاط صغير أو ملاحظة وحدة بكفّوا للبداية.')),'hm-week-latest'));
   const weekActs=n('div',undefined,'hm-actions hm-week-actions');weekActs.append(link(t(p('Add a note','أضيفوا ملاحظة')),'milestones.html','hm-button'),link(t(p('All notes','كل الملاحظات')),'milestones.html#savedObservations'));week.append(weekActs);
  }catch{}
  // 3. Today together (the original activity player, moved intact) and Coming up.
  const row=n('div',undefined,'hm-row');root.append(row);
  const today=n('section',undefined,'hm-section hm-today');today.id='todayPlan';const todayHead=n('h2',t(C.todayTitle));todayHead.dataset.noTranslate='';today.append(todayHead);
  const activity=n('article',undefined,'hm-card hm-activity');activity.dataset.noTranslate='';const copy=n('div');
  copy.append(n('small',t(C.todayKind),'hm-kind'),n('h3',available?translate(document.getElementById('dailyTitle')?.textContent):t(C.todayFallback)));
  if(available)copy.append(n('p',translate(document.getElementById('dailyInsight')?.textContent||'')),n('span',translate(document.getElementById('dailyDuration')?.textContent||''),'hm-soft'));else copy.append(n('p',t(C.todayNone)));
  copy.append(n('span',t(savedToday?C.saved:C.enough),'experience-pill hm-pill'));
  const acts=n('div',undefined,'hm-actions');acts.append(link(t(savedToday?C.review:available?C.tryIt:C.options),available?'daily-activity.html':'activities.html','hm-button'),link(t(C.browse),'activities.html'));copy.append(acts,n('p',t(C.sourced),'hm-note'));
  const art=n('img',undefined,'hm-art');art.src='assets/visual-play.svg';art.alt='';art.width=120;art.height=90;art.setAttribute('aria-hidden','true');activity.append(art,copy);today.append(activity);
  if(inlineActivity)today.append(inlineActivity);row.append(today);
  const care=n('section',undefined,'hm-section hm-care');care.id='careUpdates';care.dataset.noTranslate='';care.append(n('h2',t(C.careTitle)));
  if(model.upcoming){const b=model.upcoming.booking,date=model.upcoming.date,item=n('article',undefined,'hm-card hm-care-item'),chip=n('span',undefined,'hm-date');chip.append(n('b',new Intl.DateTimeFormat(lang(),{day:'numeric'}).format(date)),n('small',new Intl.DateTimeFormat(lang(),{month:'short'}).format(date)));const body=n('div');body.append(n('small',t(C.appointment),'hm-kind'),n('strong',b.specialistName||t(C.yourSpecialist)),n('span',b.time||'','hm-soft'),link(t(C.viewAppointment),appointmentURL(b)));item.dataset.care='appointment';item.append(chip,body);care.append(item);}
  // Phase 5: an open request (waiting for a reply, a new time to answer, or a demo payment due).
  const RA=window.RafiqAppointments,open=RA?RA.read().filter(b=>b.childId===child.id&&(['pending','reschedule_proposed'].includes(RA.stateOf(b))||RA.paymentDue(b))).sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||''))):[];
  if(open.length){const b=open[0],state=RA.stateOf(b),item=n('article',undefined,'hm-card hm-care-item'),body=n('div');item.dataset.care='request';item.dataset.state=state;item.append(icon('calendar','hm-care-icon'));body.append(n('small',t(RA.labels[state]),'hm-kind is-new'),n('strong',b.specialistName||t(C.yourSpecialist)),n('span',(b.proposal&&state==='reschedule_proposed'?b.proposal.date+' · '+b.proposal.time:b.date+' · '+b.time),'hm-soft'),link(t(state==='reschedule_proposed'?p('Answer the new time','ردّوا على الوقت الجديد'):RA.paymentDue(b)?p('Confirm with demo payment','أكّدوا بالدفع التجريبي'):p('View request','شوفوا الطلب')),'bookings.html?booking='+encodeURIComponent(b.id)));item.append(body);care.append(item);}
  if(model.report){const item=n('article',undefined,'hm-card hm-care-item'),body=n('div');item.append(icon('report','hm-care-icon'));body.append(n('small',t(model.unseenReport?C.newReport:C.latestReport),'hm-kind'+(model.unseenReport?' is-new':'')),n('strong',model.report.specialistName||t(C.yourSpecialist)),reportLink(t(C.readReport),model.report));item.dataset.care='report';item.append(body);care.append(item);}
  if(!model.upcoming&&!model.report&&!open.length){const item=n('article',undefined,'hm-card hm-care-item is-empty');item.dataset.care='empty';item.append(icon('calendar','hm-care-icon'));const body=n('div');const specialty=services.find(s=>s.id==='specialists')?.specialties[0];body.append(n('p',t(C.noCare)),link(t(C.findSpecialist),D&&specialty?D.specialistHref(specialty):'specialists.html'));item.append(body);care.append(item);}
  else care.append(link(t(C.allAppointments),'bookings.html'));
  row.append(care);

  // 4. Support for this child: the family's own topics and the services they lead to.
  const support=section('supportFocus','hm-support');support.append(named('h2',C.supportTitle,child.name));
  const chosen=D&&journey!=='none'?D.allTopics(d):[];
  if(journey==='none')support.append(named('p',C.storyLine,child.name,'hm-lead'));
  else if(journey==='development'&&!chosen.length)support.append(n('p',t(C.generalLine),'hm-lead'));
  if(chosen.length){const row2=n('div',undefined,'hm-chips');row2.setAttribute('aria-label',t(C.topicsLabel));for(const id of chosen){const topic=topicOf(id);if(!topic)continue;const chip=n('span',undefined,'hm-chip'+(d.diagnosed.includes(id)?' is-diagnosis':''));chip.dataset.topic=id;chip.append(icon('topics','hm-mini'),t(topic.title));if(d.diagnosed.includes(id))chip.append(n('em',t(C.diagnosisTag)));row2.append(chip);}support.append(row2);}
  else if(journey==='concerns'||journey==='diagnosed')support.append(n('p',t(C.noTopics),'hm-soft'));
  // Priorities first, then the existing autism journey when it is open to this child, then the rest.
  const ordered=journey==='none'?recommend(child).map(r=>({id:r.id,sources:[],specialties:[],priority:false})):[...services.filter(s=>s.priority),...services.filter(s=>!s.priority&&s.id==='journey'),...services.filter(s=>!s.priority&&s.id!=='journey')];
  const list=ordered.filter(s=>s.id!==step.service).slice(0,4);
  const grid=n('div',undefined,'hm-services');for(const s of list){const [title,description,page,actionLabel]=window.RafiqParentExperience.services[s.id],card=n('article',undefined,'hm-card hm-service'+(s.priority?' is-priority':''));card.dataset.service=s.id;
   const top=n('div',undefined,'hm-service-top');top.append(icon(s.id,'hm-service-icon'));if(s.priority){const tag=n('em',undefined,'hm-tag');tag.append(icon('star','hm-mini'),t(C.priority));top.append(tag);}card.append(top,n('h3',t(title)),n('p',t(description)));
   const topics=s.sources.map(topicOf).filter(Boolean);if(topics.length){const f=n('p',undefined,'hm-for');f.append(n('b',t(C.forTopic)+': '),topics.slice(0,2).map(x=>t(x.title)).join(' · '));card.append(f);}
   card.append(link(t(actionLabel),s.id==='specialists'&&s.specialties?.[0]?D.specialistHref(s.specialties[0]):page,'hm-link hm-card-action'));grid.append(card);}
  support.append(grid);const more=n('div',undefined,'hm-actions');if(journey!=='none')more.append(link(t(C.summary),discoveryURL));more.append(link(t(C.allTopics),'support-areas.html?child='+encodeURIComponent(child.id)));support.append(more);

  // 5. Growth and observations, plus the age checklist from its public source.
  const row3=n('div',undefined,'hm-row');root.append(row3);
  const growth=n('section',undefined,'hm-section hm-growth');growth.id='growthNotes';growth.dataset.noTranslate='';growth.append(n('h2',t(C.growthTitle)));
  const stats=n('div',undefined,'hm-stats');for(const [value,label,key] of [[model.observations,C.obsCount,'growth'],[model.healthCount,C.healthCount,'health']]){const s=n('div',undefined,'hm-stat');s.append(icon(key,'hm-stat-icon'),n('b',new Intl.NumberFormat(lang()).format(value)),n('span',t(label)));stats.append(s);}growth.append(stats);
  const notes=recentNotes(child).slice(0,2);if(notes.length){const ul=n('ul',undefined,'hm-notes');ul.setAttribute('aria-label',t(C.recent));for(const note of notes){const li=n('li'),type=C.obsType[note.type]||C.obsType.observation,when=Date.parse(note.updatedAt||note.createdAt),text=(note.text||note.note||'').trim();li.append(n('small',t(type)+(Number.isFinite(when)?' · '+new Intl.DateTimeFormat(lang(),{day:'numeric',month:'short'}).format(when):''),'hm-kind'));const body=n('span',text?text.slice(0,110)+(text.length>110?'…':''):t(C.outcome[note.outcome]||C.obsType[note.type]||C.obsType.observation));if(text)body.setAttribute('data-user-content','');li.append(body);ul.append(li);}growth.append(ul);}
  else growth.append(n('p',t(C.noObs),'hm-soft'));
  const gActs=n('div',undefined,'hm-actions');gActs.append(link(t(C.addObservation),'milestones.html','hm-button'),link(t(C.allObservations),'milestones.html#savedObservations'));growth.append(gActs);row3.append(growth);
  const resource=model.resource;if(resource){const months=resource.minMonths,label=months>=24&&months%12===0?ageText({years:months/12,months:0}):ageText({years:0,months});const stage=n('section',undefined,'hm-section hm-stage');stage.id='stageGuide';stage.dataset.noTranslate='';stage.append(icon('stage','hm-stage-icon'),n('h2',fill(C.stageTitle,{age:label})),n('p',t(C.stageText)));if(ctx.basis==='corrected')stage.append(n('p',t(C.stageCorrected),'hm-soft'));const a=link(t(C.stageLink),resource.source.url,'hm-link');a.target='_blank';a.rel='noopener noreferrer';a.append(' ',icon('external','hm-mini'));stage.append(a,n('small',t(C.external),'hm-soft'));row3.append(stage);}else growth.classList.add('is-wide');

  // 6. Shortcuts that are not already in the top navigation.
  const shortcuts=section('homeShortcuts','hm-shortcuts');shortcuts.append(n('h2',t(C.shortcuts)));const nav=n('nav',undefined,'hm-shortcut-grid');nav.setAttribute('aria-label',t(C.shortcuts));
  for(const [key,label,href] of [['health',p('Health records','السجل الصحي'),'health.html'],['memories',p('Memories','الذكريات'),'album.html'],['topics',p('Support topics','مواضيع الدعم'),'support-areas.html?child='+encodeURIComponent(child.id)],['guide',p('How to use Rafeeq','كيف تستخدموا رفيق'),'guide.html']]){const a=link('',href,'hm-shortcut');a.replaceChildren(icon(key,'hm-shortcut-icon'),n('span',t(label)));a.dataset.shortcut=key;nav.append(a);}
  shortcuts.append(nav);
  // Keep Home short: these sections repeated the cards above or links already in the navigation.
  for(const id of ['supportFocus','growthNotes','stageGuide','homeShortcuts'])root.querySelector('#'+id)?.remove();if(!row3.children.length)row3.remove();
  const footer=n('footer',t(C.footer),'hm-footer');footer.dataset.noTranslate='';root.append(footer);
  if(model.warnings.length){const warning=n('p',t(C.warning),'hm-warning');warning.setAttribute('role','status');root.prepend(warning);}
  old?.remove();document.getElementById('parentDashboardView').append(root);document.documentElement.dataset.parentExperience='services';
  if(focused&&focused!==document.body&&root.contains(focused))focused.focus({preventScroll:true});
 }catch(error){const box=document.getElementById('todayError');if(box){box.hidden=false;box.textContent=t(C.loadError);}console.error(error);}}
 document.addEventListener('DOMContentLoaded',()=>{render();new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});});
 window.addEventListener('rafiq:moment-saved',render);
})();
