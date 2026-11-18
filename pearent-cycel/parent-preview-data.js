/* Phase 1: fictional fixtures only. This file contains no real family records. */
(() => {
 'use strict';
 function fixtures(mode='new',now=new Date(),language='ar'){
  if(mode.startsWith('case-'))return window.RafiqDemoCases.fixtures(mode.slice(5),now,language);
  // One fictional mother, three children, three different journeys (for the presentation).
  if(mode==='mother'){
   const owner='demo-mother-parent',familyId='family_'+owner,name=(en,ar)=>language==='ar'?ar:en,values={};
   const parts=['premature','speech','autism'].map(key=>{const part=window.RafiqDemoCases.fixtures(key,now,language),old=part.owner;return JSON.parse(JSON.stringify(part.values),(k,v)=>v===old?owner:v==='family_'+old?familyId:v);});
   for(const part of parts)for(const [key,value] of Object.entries(part)){
    if(/^rafiqCurrentChildId/.test(key)||['rafiqUsers','rafiqFamilies','rafiqFamilyMemberships'].includes(key))continue;
    if(Array.isArray(value)){const list=values[key]||(values[key]=[]);for(const row of value)if(!row||!row.id||!list.some(r=>r&&r.id===row.id))list.push(row);}
    else if(value&&typeof value==='object'&&!Array.isArray(value))values[key]={...(values[key]||{}),...value};
    else values[key]=value;
   }
   values.rafiqChildren.forEach(c=>{c.relationship='mother';c.isDemo=true;});
   const ago=days=>new Date(now.getTime()-days*86400000).toISOString(),notes={premature:[[1,name('Held her head up longer during tummy time today.','رفعت راسها أطول وقت اللعب على بطنها اليوم.')],[4,name('Smiled back when I sang to her.','ردّت بابتسامة لما غنّيتلها.')]],speech:[[0,name('Said "more" twice at lunch.','حكت «كمان» مرتين على الغدا.')],[2,name('Pointed at the cat picture and made the sound.','أشّرت على صورة البسة وعملت صوتها.')],[5,name('Got frustrated when we did not understand her.','تضايقت لما ما فهمنا عليها.')]],autism:[[1,name('The first/then board helped at bath time.','لوحة «أولًا، بعدين» ساعدت وقت الحمّام.')],[3,name('Stayed calm in the quiet corner after school.','هدي بالزاوية الهادية بعد الروضة.')]]};
   for(const c of values.rafiqChildren){const key=Object.keys(notes).find(k=>c.id.includes(k));if(!key)continue;const list=values['rafiqAgeObservations_'+c.id]||(values['rafiqAgeObservations_'+c.id]=[]);list.forEach(r=>{if(r&&r.type!=='daily-moment')r.createdAt=ago(6);});notes[key].forEach(([days,text],i)=>list.push({id:c.id+'_home_note_'+i,childId:c.id,type:'observation',text,createdBy:owner,createdAt:ago(days),isDemo:true}));}
   values.rafiqUsers=[{id:owner,role:'parent',fullName:name('Saja','سجى'),email:'mother@rafiq.example',status:'active',isDemo:true}];
   values.rafiqFamilies=[{id:familyId,ownerId:owner,billingOwnerId:owner,name:name('Saja’s family','عيلة سجى')}];
   values.rafiqFamilyMemberships={[familyId]:{id:'demo-mother-plus',familyId,parentId:owner,plan:'plus',status:'active',expiresAt:new Date(now.getTime()+30*86400000).toISOString(),isDemo:true}};
   // A realistic week for the three demo specialists, using Saja's children (sample data only).
   {const kid=k=>values.rafiqChildren.find(c=>c.id.includes(k)),day=n=>{const d=new Date(now.getTime()+n*86400000);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
    const docs=Object.fromEntries((values.rafiqSpecialists||[]).map(s=>[s.id,s])),paid=(price,days)=>({status:'paid',amount:price,commissionRate:10,commission:price/10,specialistNet:price*0.9,payoutStatus:'pending',payerId:owner,paidAt:ago(days)});
    const book=(id,child,docId,dayOffset,time,type,status,reason,createdDays)=>{const s=docs[docId];if(!child||!s)return null;const price=Number(s.price)||20;return {id,parentId:owner,createdBy:owner,childId:child.id,childName:child.name,specialistId:s.id,specialistName:s.fullName,specialty:s.specialty,date:day(dayOffset),dateLabel:day(dayOffset),time,consultationType:type,status,price,currency:'JOD',sessionPayment:paid(price,createdDays),reason,createdAt:ago(createdDays),isDemo:true};};
    const noor=kid('premature'),salma=kid('speech'),mustafa=kid('autism');
    const extra=[
     book('demo-salma-speech-next',salma,'showcase_speech_specialist',1,'11:00','online','confirmed',name('Few words at 2½ years; would like a plan for home.','كلمات قليلة بعمر سنتين ونص؛ بدنا خطة للبيت.'),2),
     book('demo-noor-development-past',noor,'showcase_development_specialist',-8,'10:00','in-person','completed',name('Born early; checking milestones with corrected age.','انولدت بدري؛ بدنا نتطمّن على مراحل النمو بالعمر المصحّح.'),12),
     book('demo-noor-development-next',noor,'showcase_development_specialist',6,'10:00','in-person','confirmed',name('Follow-up visit after the first session.','زيارة متابعة بعد الجلسة الأولى.'),3),
     book('demo-mustafa-psychology-request',mustafa,'showcase_psychology_specialist',3,'16:00','online','requested',name('Hard transitions after nursery; ideas for calmer evenings.','الانتقالات صعبة بعد الروضة؛ بدنا أفكار لمسا أهدى.'),0)
    ].filter(Boolean);
    values.rafiqBookings=[...(values.rafiqBookings||[]),...extra];
    const lina=docs.showcase_development_specialist;
    if(noor&&lina)values.rafiqSpecialistReports=[...(values.rafiqSpecialistReports||[]),{id:'demo-noor-development-report',bookingId:'demo-noor-development-past',childId:noor.id,childName:noor.name,parentId:owner,specialistId:lina.id,specialistName:lina.fullName,specialty:lina.specialty,consultationType:'in-person',consultationDate:day(-8),reportDate:day(-7),createdAt:ago(7),summary:name('Noor is progressing well for her corrected age. Head control and social smiles are on track.','نور ماشية منيح حسب عمرها المصحّح. التحكم بالراس والابتسامة الاجتماعية بمكانهم.'),observations:[name('Enjoys face-to-face play and follows voices.','بتحب اللعب وجه لوجه وبتلحق الأصوات.'),name('Tummy time is still short; she tires quickly.','وقت اللعب ع البطن لسا قصير وبتتعب بسرعة.')],recommendations:[name('Tummy time 1–2 minutes, several times a day.','لعب ع البطن دقيقة أو دقيقتين، كذا مرة باليوم.'),name('Talk and sing during nappy changes.','احكوا وغنّوا وقت تغيير الحفاض.')],followUp:name('Review in 4 weeks.','مراجعة بعد ٤ أسابيع.'),status:'submitted',submittedAt:ago(7),isDemo:true}];
   }
   const start=values.rafiqChildren.find(c=>c.id.includes('speech'))||values.rafiqChildren[0];
   values['rafiqCurrentChildId_'+owner]=start.id;values.rafiqCurrentChildId=start.id;
   return {owner,values,session:{rafiqRole:'parent',rafiqParentUserId:owner}};
  }
  const owner='demo-phase1-parent',coparent='demo-phase1-coparent',familyId='family_'+owner;
  const name=(en,ar)=>language==='ar'?ar:en;
  const users=[{id:owner,role:'parent',fullName:name('Demo parent','ولي أمر تجريبي'),email:'parent@rafiq.example',status:'active'},{id:coparent,role:'parent',fullName:name('Demo caregiver','مقدّم رعاية تجريبي'),email:'caregiver@rafiq.example',status:'active'}];
  const dob=months=>{const d=new Date(now.getFullYear(),now.getMonth()-months,1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-01';};
  const children=mode==='family'?[
   {id:'demo-phase1-baby',name:name('Noor','نور'),dateOfBirth:dob(3),gender:'female',bornBeforeDueDate:'unknown'},
   {id:'demo-phase1-toddler',name:name('Layan','ليان'),dateOfBirth:dob(24),gender:'female',bornBeforeDueDate:'no'},
   {id:'demo-phase1-child',name:name('Adam','آدم'),dateOfBirth:dob(60),gender:'male',bornBeforeDueDate:'no'}
  ].map(c=>({...c,parentId:owner,familyId,relationship:'mother',isDemo:true,ageProfileVersion:2,setupCompletedAt:now.toISOString(),supportProfile:{version:1,situation:'skipped',focus:null}})):[];
  const values={rafiqUsers:users,rafiqChildren:children,rafiqFamilies:[{id:familyId,ownerId:owner,billingOwnerId:owner,name:name('Demo family','عيلة تجريبية')}],rafiqCaregiverInvitationsPreview:children.map((c,i)=>({id:'demo-link-'+i,childId:c.id,ownerId:owner,acceptedUserId:coparent,email:users[1].email,relationship:'father',permission:'contribute',status:'accepted'}))};
  // Phase 5: the same fictional specialists as the case demos, so families can request sessions.
  if(mode==='family'&&window.RafiqDemoSpecialists){const demo=window.RafiqDemoSpecialists.build(language);values.rafiqSpecialists=demo.specialists;values.rafiqBookings=[];values.rafiqSpecialistReports=[];Object.assign(values,demo.availability);}
  if(mode==='family'){values.rafiqFamilyMemberships={[familyId]:{id:'demo-plus',familyId,parentId:owner,plan:'plus',status:'active',expiresAt:new Date(now.getTime()+30*86400000).toISOString(),isDemo:true}};values['rafiqCurrentChildId_'+owner]=children[1].id;values.rafiqCurrentChildId=children[1].id;}
  return {owner,values,session:{rafiqRole:'parent',rafiqParentUserId:owner}};
 }
 window.RafiqParentPreviewFixtures=fixtures;
})();
