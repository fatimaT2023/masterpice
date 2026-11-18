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
