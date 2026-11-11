/* Phase 1: fictional fixtures only. This file contains no real family records. */
(() => {
 'use strict';
 function fixtures(mode='new',now=new Date(),language='ar'){
  if(mode.startsWith('case-'))return window.RafiqDemoCases.fixtures(mode.slice(5),now,language);
  const owner='demo-phase1-parent',coparent='demo-phase1-coparent',familyId='family_'+owner;
  const name=(en,ar)=>language==='ar'?ar:en;
  const users=[{id:owner,role:'parent',fullName:name('Demo parent','ولي أمر تجريبي'),email:'parent@rafiq.example',status:'active'},{id:coparent,role:'parent',fullName:name('Demo caregiver','مقدّم رعاية تجريبي'),email:'caregiver@rafiq.example',status:'active'}];
  const dob=months=>{const d=new Date(now.getFullYear(),now.getMonth()-months,1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-01';};
  const children=mode==='family'?[
   {id:'demo-phase1-baby',name:name('Noor','نور'),dateOfBirth:dob(3),gender:'female',bornBeforeDueDate:'unknown'},
   {id:'demo-phase1-toddler',name:name('Layan','ليان'),dateOfBirth:dob(24),gender:'female',bornBeforeDueDate:'no'},
   {id:'demo-phase1-child',name:name('Adam','آدم'),dateOfBirth:dob(60),gender:'male',bornBeforeDueDate:'no'}
  ].map(c=>({...c,parentId:owner,familyId,relationship:'mother',isDemo:true,ageProfileVersion:2,setupCompletedAt:now.toISOString(),supportProfile:{version:1,situation:'skipped',focus:null}})):[];
  const values={rafiqUsers:users,rafiqChildren:children,rafiqFamilies:[{id:familyId,ownerId:owner,billingOwnerId:owner,name:name('Fictional demo family','عيلة عرض وهمية')}],rafiqCaregiverInvitationsPreview:children.map((c,i)=>({id:'demo-link-'+i,childId:c.id,ownerId:owner,acceptedUserId:coparent,email:users[1].email,relationship:'father',permission:'contribute',status:'accepted'}))};
  if(mode==='family'){values.rafiqFamilyMemberships={[familyId]:{id:'demo-plus',familyId,parentId:owner,plan:'plus',status:'active',expiresAt:new Date(now.getTime()+30*86400000).toISOString(),isDemo:true}};values['rafiqCurrentChildId_'+owner]=children[1].id;values.rafiqCurrentChildId=children[1].id;}
  return {owner,values,session:{rafiqRole:'parent',rafiqParentUserId:owner}};
 }
 window.RafiqParentPreviewFixtures=fixtures;
})();
