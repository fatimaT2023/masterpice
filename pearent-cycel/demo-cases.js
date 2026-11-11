/* Fictional presentation scenarios. No diagnoses are inferred. Clinical demo data
   is generated in RAM; only fictional login credentials are installed separately. */
(() => {
 'use strict';
 const p=(en,ar)=>({en,ar});
 const cases=[
  ['autism','Autism support','دعم التوحد','Mustafa','مصطفى',48,['speech','play'],'autism','support-journey.html'],
  ['typical','Everyday development','النمو المعتاد','Layan','ليان',26,['play'],'none','daily-activity.html'],
  ['tantrums','Difficult behaviour / tantrums','سلوك صعب ونوبات غضب','Adam','آدم',42,['behaviour'],'other','screening.html'],
  ['speech','Speech and language delay','تأخر النطق واللغة','Salma','سلمى',30,['speech'],'speech_language','specialists.html?specialty=speech'],
  ['premature','Premature birth','ولادة مبكرة','Noor','نور',5,['growth'],'other','milestones.html'],
  ['attention','Attention / hyperactivity concern','قلق بشأن الانتباه وفرط الحركة','Omar','عمر',66,['behaviour','play'],'other','screening.html'],
  ['development','Developmental delay','تأخر النمو','Yazan','يزن',22,['growth','play'],'other','milestones.html'],
  ['emotional','Emotional worries','قلق وصعوبات عاطفية','Hana','هنا',60,['other'],'other','screening.html'],
  ['learning','Learning challenges','صعوبات التعلّم','Karam','كرم',72,['play','growth'],'other','daily-activity.html'],
  ['sensory','Sensory preferences','اختلافات وتفضيلات حسّية','Leen','لين',38,['other'],'other','child-profile.html'],
  ['feeding','Feeding difficulties','صعوبات التغذية','Jad','جاد',20,['feeding'],'other','health.html?record=note'],
  ['sleep','Sleep difficulties','صعوبات النوم','Sara','سارة',32,['sleep'],'other','health.html?record=note'],
  ['hearing','Hearing concern','صعوبة سمع','Rami','رامي',36,['speech'],'other','health.html'],
  ['vision','Vision concern','صعوبة نظر','Tala','تالا',44,['other'],'other','health.html'],
  ['genetic','Genetic syndrome / Down syndrome','متلازمة وراثية / متلازمة داون','Zaid','زيد',34,['growth','speech'],'other','child-profile.html'],
  ['social','Social and daily transitions','التفاعل الاجتماعي والانتقالات اليومية','Maya','مايا',54,['play','other'],'social','daily-activity.html']
 ].map(([key,en,ar,nameEn,nameAr,months,goals,focus,page])=>({key,label:p(en,ar),name:p(nameEn,nameAr),months,goals,focus,page,email:key+'.show@rafiq.test',owner:'rafiq_showcase_'+key}));
 const journeys={
  autism:p('Open the autism journey, review About Me, prepare a visit, then try a visual board or add a family observation.','افتحي مسار التوحد، راجعي «عنّي»، حضّري زيارة، وبعدين جرّبي لوحة بصرية أو أضيفي ملاحظة من العيلة.'),
  typical:p('Open today’s activity, record a fictional observation, then show it in the saved observations.','افتحي نشاط اليوم، سجّلي ملاحظة وهمية، وبعدين ورجيها بالملاحظات المحفوظة.'),
  tantrums:p('Describe a concern in your own words, save an observation, then explore the specialist directory.','اوصفِي القلق بكلماتك، احفظي ملاحظة، وبعدين افتحي دليل المختصين.'),
  speech:p('Show the selected speech goal, open the speech directory, review a fictional profile and the demo booking steps.','ورجي هدف النطق المختار، افتحي دليل النطق، راجعي ملف مختص وهمي وخطوات الحجز التجريبي.'),
  development:p('Show the developmental observations, record what the family noticed, then open age-appropriate play.','ورجي الملاحظات النمائية، سجّلي اللي لاحظته العيلة، وبعدين افتحي اللعب المناسب للعمر.'),
  premature:p('Review birth and expected due dates, compare chronological and corrected age, then show the relevant developmental observations.','راجعي تاريخ الولادة والموعد المتوقع، ورجي العمر الزمني والمصحّح، وبعدين الملاحظات النمائية المناسبة.'),
  attention:p('Show the family-selected behaviour/play goals, record an observation and describe a concern. This demo does not diagnose ADHD.','ورجي أهداف السلوك واللعب، احفظي ملاحظة واوصفي القلق. التجربة ما بتشخّص فرط الحركة.'),
  emotional:p('Use the existing concern and observation pages, then review directory options. A dedicated emotional-support tool is not built yet.','استخدمي صفحة القلق والملاحظات الحالية وبعدين دليل المختصين. أداة دعم عاطفي متخصصة لسه مش مبنية.'),
  learning:p('Show age-based play and family observations. There is no learning-disorder test or specialist learning programme here yet.','ورجي اللعب حسب العمر وملاحظات العيلة. فحص صعوبات التعلّم أو برنامج متخصص لسه مش موجود.'),
  sensory:p('Review the family’s profile note and save an observation. A dedicated sensory tool is not built yet.','راجعي ملاحظة العيلة بالملف واحفظي ملاحظة. الأداة الحسّية المتخصصة لسه مش مبنية.'),
  feeding:p('Open the feeding goal, add a health note and show the saved record. No diet or swallowing advice is generated.','افتحي هدف التغذية، أضيفي ملاحظة صحية وورجي السجل المحفوظ. ما بنولّد حمية أو تعليمات بلع.'),
  sleep:p('Open the sleep goal, add a health note and show the saved record. A dedicated sleep diary is not built yet.','افتحي هدف النوم، أضيفي ملاحظة صحية وورجي السجل. يوميات نوم متخصصة لسه مش مبنية.'),
  hearing:p('Review the hearing note, prepare a question for the care team, and explore the existing directory. This is not a hearing test.','راجعي ملاحظة السمع، جهّزي سؤال لفريق الرعاية وافتحي الدليل الحالي. هذا مش فحص سمع.'),
  vision:p('Review the vision note and prepare a care-team question. This is not a vision test or a vision-specific programme.','راجعي ملاحظة النظر وجهّزي سؤال لفريق الرعاية. هذا مش فحص نظر أو برنامج نظر متخصص.'),
  genetic:p('Review the fictional family-reported background, developmental observations and directory. No syndrome-specific treatment plan is provided.','راجعي الخلفية الوهمية اللي سجّلتها العيلة وملاحظات النمو والدليل. ما في خطة علاج خاصة بالمتلازمة.'),
  social:p('Show play goals, choose an activity and record a daily-transition observation. A dedicated social-stories tool is not built yet.','ورجي أهداف اللعب، اختاري نشاط وسجّلي ملاحظة عن انتقال يومي. أداة قصص اجتماعية متخصصة لسه مش مبنية.')
 };
 function fixtures(key,now=new Date(),language='ar'){
  const item=cases.find(c=>c.key===key);if(!item)throw Error('Unknown fictional scenario');
  const t=pair=>pair[language==='ar'?'ar':'en'],stamp=now.toISOString(),owner=item.owner,familyId='family_'+owner,id=owner+'_child';
  const date=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  const birth=new Date(now.getFullYear(),now.getMonth()-item.months,1),due=new Date(birth.getFullYear(),birth.getMonth()+2,1);
  const note=t(p('Fictional family observation for '+item.label.en+'. Not a clinical assessment.', 'ملاحظة عيلة وهمية لعرض '+item.label.ar+'، مش تقييم طبي.'));
  const child={id,parentId:owner,familyId,createdBy:owner,name:t(item.name),dateOfBirth:date(birth),gender:['typical','speech','premature','emotional','sensory','sleep','vision','social'].includes(key)?'female':'male',relationship:'mother',bornBeforeDueDate:key==='premature'?'yes':'no',expectedDueDate:key==='premature'?date(due):'',isDemo:true,demoScenario:key,ageProfileVersion:2,setupCompletedAt:stamp,supportGuideReviewedAt:stamp,initialGoal:'activities',supportProfile:{version:1,situation:key==='typical'?'none':key==='autism'?'diagnosed_following':'worried',focus:item.focus==='none'?null:item.focus,setAt:stamp,updatedAt:stamp},backgroundHistory:{version:2,cursor:'summary',updatedAt:stamp,legacy:{},birth:{termStatus:key==='premature'?'early':'term'},answers:{'about.caregiver':{value:'parents',details:''},'birth.termStatus':{value:key==='premature'?'early':'term',details:''},'health.conditions':{value:key==='typical'?'no':'other',details:key==='typical'?'':note},'goals.choices':{value:[...item.goals],details:''}},allergies:{has:'unknown',details:''},medication:{has:'unknown',details:''},goals:{choices:[...item.goals],details:''}}};
  if(key==='autism'){
   child.aboutMe={version:1,cursor:9,sectionsDone:['name','communication','loves','strengths','calm'],sections:{name:{nickname:t(item.name)},communication:{ways:['few','gestures'],understands:['short','wait'],help:t(p('Fictional family note: points or uses a few words to ask for help.','ملاحظة عيلة وهمية: بأشّر أو بستخدم كم كلمة لما بده مساعدة.'))},loves:{ideas:['bubbles','stories'],activities:t(p('Fictional example: picture books and blocks.','مثال وهمي: كتب مصوّرة ومكعبات.'))},strengths:{strengths:t(p('Fictional family note: enjoys building towers.','ملاحظة عيلة وهمية: بحب يبني أبراج.'))},calm:{helps:t(p('Fictional family preference: a quiet corner.','تفضيل عيلة وهمي: مكان هادي.'))}}};
   child.supportJourney={version:1,planReviewedAt:stamp,visits:[{id:'showcase-visit',specialist:t(p('Fictional outside specialist','مختص خارجي وهمي')),date:date(now),questions:t(p('How can we prepare for transitions? Demo question.','كيف نتحضّر للانتقالات؟ سؤال عرض وهمي.')),learned:t(p('Fictional example only: the family recorded a short shared-play idea.','مثال وهمي فقط: العيلة سجّلت فكرة لعب مشترك قصيرة.')),done:true,createdAt:stamp,updatedAt:stamp,updatedBy:owner}],practices:[],logs:[],moments:[],wins:[{id:'showcase-win',text:t(p('Fictional proud moment: shared a favourite story.','لحظة فخر وهمية: شارك بحكاية بحبها.')),createdAt:stamp,updatedBy:owner}],boards:[{id:'showcase-board',first:t(p('Read a story','نقرأ حكاية')),then:t(p('Play with blocks','نلعب بالمكعبات')),day:'',createdAt:stamp,updatedBy:owner}],care:[],seenReports:[]};
  }
  child.backgroundHistory.answers['health.conditions']={value:key==='typical'?'no':['autism','genetic','hearing','vision','development'].includes(key)?'yes':'unknown',details:['autism','genetic','hearing','vision','development'].includes(key)?note:''};
  if(key==='hearing'||key==='vision')child.backgroundHistory.answers['health.'+key]={value:'yes',details:note};
  const specialist={id:'showcase_speech_specialist',registrationUserId:'showcase_specialist_login',fullName:t(p('Fictional speech specialist','مختص نطق وهمي')),email:'specialist@rafiq.example',specialtyKey:'speech',specialty:t(p('Speech and language','النطق واللغة')),status:'approved',verificationStatus:'approved',experience:5,price:20,currency:'JOD',languages:['arabic','english'],consultationTypes:['online'],bio:t(p('Fictional demo profile. Not a real clinician.','ملف وهمي للعرض، مش مختص حقيقي.')),isDemo:true};
  const values={rafiqUsers:[{id:owner,role:'parent',email:item.email,fullName:t(p('Fictional '+item.name.en+' family','عيلة '+item.name.ar+' الوهمية')),status:'active',isDemo:true,demoScenario:key}],rafiqChildren:[child],rafiqFamilies:[{id:familyId,ownerId:owner,billingOwnerId:owner}],rafiqSpecialists:[specialist],rafiqBookings:[],rafiqSpecialistReports:[],rafiqCaregiverInvitationsPreview:[],['rafiqCurrentChildId_'+owner]:id,rafiqCurrentChildId:id};
  if(key==='autism'){
   const bookingId='showcase-autism-booking';Object.assign(child.supportJourney.visits[0],{bookingId,specialist:specialist.fullName});
   values.rafiqBookings=[{id:bookingId,parentId:owner,createdBy:owner,childId:id,childName:child.name,specialistId:specialist.id,specialistName:specialist.fullName,specialty:specialist.specialty,date:date(now),dateLabel:date(now),time:'10:00',consultationType:'online',status:'completed',price:20,currency:'JOD',sessionPayment:{status:'paid',amount:20,commissionRate:10,commission:2,specialistNet:18,payoutStatus:'pending',payerId:owner,paidAt:stamp},reason:t(p('Fictional demonstration visit','زيارة وهمية للعرض')),createdAt:stamp,isDemo:true}];
   values.rafiqSpecialistReports=[{id:'showcase-autism-report',bookingId,childId:id,childName:child.name,parentId:owner,specialistId:specialist.id,specialistName:specialist.fullName,specialty:specialist.specialty,consultationType:'online',consultationDate:date(now),reportDate:date(now),createdAt:stamp,summary:t(p('Fictional demonstration report, not a clinical assessment.','تقرير وهمي للعرض، مش تقييم طبي.')),observations:[t(p('The fictional family described favourite play.','العيلة الوهمية وصفت اللعب المفضّل.'))],recommendations:[t(p('Fictional example: record a family observation for the next visit.','مثال وهمي: تسجيل ملاحظة من العيلة للزيارة الجايّة.'))],followUp:t(p('Demo follow-up only.','متابعة تجريبية فقط.')),isDemo:true}];
  }
  values['rafiqHealthNotes_'+id]=[{id:id+'_note',childId:id,date:date(now),title:t(item.label),details:note,category:'other',createdBy:owner,createdAt:stamp,isDemo:true}];
  values['rafiqAgeObservations_'+id]=[{id:id+'_observation',childId:id,type:'observation',text:note,createdBy:owner,createdAt:stamp,isDemo:true}];
  return {owner,values,session:{rafiqRole:'parent',rafiqParentUserId:owner}};
 }
 window.RafiqDemoCases={cases,journeys,fixtures,password:'RafiqShow2026!',tag:'rafiq-showcase-v1'};
})();
