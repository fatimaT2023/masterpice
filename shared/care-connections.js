/* Local preview permissions. Production must enforce these checks on the server. */
(()=>{'use strict';
 const key='rafiqCareConnections',allowed=['observations','activities'];
 const read=name=>{const value=JSON.parse(localStorage.getItem(name)||'[]');if(!Array.isArray(value))throw Error('Saved care information could not be read.');return value;};
 function threadFor(viewer,id){
  const current=window.RafiqDirectMessages.identity(viewer.role);
  if(current.id!==viewer.id)throw Error('Please sign in again.');
  const thread=window.RafiqDirectMessages.list(current).find(t=>t.id===id);if(!thread)throw Error('Conversation not found.');
  const child=read('rafiqChildren').find(c=>c.id===thread.childId&&(c.parentId===thread.parentId||(viewer.role==='parent'&&window.RafiqFamily?.canAccess(c,viewer.id))||(!c.parentId&&!sessionStorage.getItem('rafiqParentUserId')&&viewer.role==='parent')));
  if(!child)throw Error('This child is not linked to this parent.');return thread;
 }
 const scopes=value=>allowed.filter(name=>Array.isArray(value)&&value.includes(name));
 function state(viewer,id){const thread=threadFor(viewer,id);return read(key).find(c=>c.threadId===id&&c.parentId===thread.parentId&&c.childId===thread.childId&&c.specialistId===thread.specialistId)||null;}
 function change(viewer,id,operation,value=[],metadata={}){
  const thread=threadFor(viewer,id),all=read(key),index=all.findIndex(c=>c.threadId===id&&c.parentId===thread.parentId&&c.childId===thread.childId&&c.specialistId===thread.specialistId),old=index>=0?all[index]:null;
  if(!window.RafiqDirectMessages.specialists().some(s=>s.id===thread.specialistId&&s.status==='approved'&&s.verificationStatus!=='rejected'))throw Error('This specialist is unavailable.');
  let next;const now=new Date().toISOString();
  let previousRelationshipSince=old?.previousRelationshipSince||null;
  if(['request','sharing'].includes(operation)&&Object.hasOwn(metadata,'previousRelationshipSince')){previousRelationshipSince=metadata.previousRelationshipSince||null;if(previousRelationshipSince){const date=new Date(previousRelationshipSince+'T12:00:00'),child=read('rafiqChildren').find(c=>c.id===thread.childId),birth=child?.dateOfBirth||child?.dob||child?.birthDate;if(!/^\d{4}-\d{2}-\d{2}$/.test(previousRelationshipSince)||Number.isNaN(date.getTime())||date.getFullYear()!==Number(previousRelationshipSince.slice(0,4))||date.getMonth()+1!==Number(previousRelationshipSince.slice(5,7))||date.getDate()!==Number(previousRelationshipSince.slice(8,10))||previousRelationshipSince>new Date().toLocaleDateString('en-CA')||(birth&&previousRelationshipSince<birth))throw Error('Choose a previous follow-up date between the child’s birth and today.');}}

  if(operation==='request'&&viewer.role==='parent'&&!['pending','active'].includes(old?.status))next={...old,status:'pending',scopes:scopes(value),requestedAt:new Date().toISOString()};
  else if(['accept','decline'].includes(operation)&&viewer.role==='specialist'&&old?.status==='pending')next={...old,status:operation==='accept'?'active':'declined',respondedAt:new Date().toISOString(),acceptedAt:operation==='accept'?now:null};
  else if(operation==='revoke'&&viewer.role==='parent'&&['pending','active'].includes(old?.status))next={...old,status:'revoked',scopes:[],revokedAt:new Date().toISOString()};
  else if(operation==='sharing'&&viewer.role==='parent'&&old?.status==='active')next={...old,scopes:scopes(value)};
  else throw Error('This care request has changed. Reload the conversation.');
  if(['request','sharing'].includes(operation)){const reset=operation==='request',prior=reset?{}:(old?.scopeSince||{}),times={};for(const scope of next.scopes)times[scope]=!reset&&old?.scopes?.includes(scope)?prior[scope]||old.sharingSince||old.requestedAt||now:now;next={...next,scopeSince:times,sharingSince:reset?now:(old?.sharingSince||old?.requestedAt||now),allowActivityGuidance:Object.hasOwn(metadata,'allowActivityGuidance')?metadata.allowActivityGuidance===true:old?.allowActivityGuidance===true,includeEarlierRecords:Object.hasOwn(metadata,'includeEarlierRecords')?metadata.includeEarlierRecords===true:(old?old.includeEarlierRecords!==false:false),previousRelationshipSince,relationshipReportedBy:viewer.id};}
  next={...next,threadId:id,parentId:thread.parentId,childId:thread.childId,specialistId:thread.specialistId,updatedAt:new Date().toISOString()};
  if(index>=0)all[index]=next;else all.push(next);localStorage.setItem(key,JSON.stringify(all));return next;
 }
 function records(viewer,id){
  const thread=threadFor(viewer,id),connection=state(viewer,id);
  if(viewer.role==='specialist'&&(connection?.status!=='active'||!window.RafiqDirectMessages.specialists().some(s=>s.id===viewer.id&&s.status==='approved'&&s.verificationStatus!=='rejected')))return [];
  const permitted=viewer.role==='parent'?allowed:scopes(connection.scopes);
  return read('rafiqAgeObservations_'+thread.childId).filter(n=>{
   if(!n||n._deletedAt||(n.childId&&n.childId!==thread.childId))return false;const scope=n.type==='daily-moment'?'activities':['observation','concern'].includes(n.type||'observation')?'observations':null;if(!scope||!permitted.includes(scope))return false;
   if(viewer.role==='specialist'&&connection.includeEarlierRecords===false){const since=connection.scopeSince?.[scope]||connection.sharingSince||connection.requestedAt||connection.respondedAt;if(!since||!n.createdAt||String(n.createdAt)<since)return false;}return true;
  }).map(n=>({id:n.id,type:n.type||'observation',text:String(n.text||''),note:n.note||'',createdAt:n.createdAt,updatedAt:n.updatedAt,createdBy:n.createdBy,createdByName:n.createdByName,updatedByName:n.updatedByName,activityId:n.activityId,targetSkill:n.targetSkill,difficulty:n.difficulty,activityTitle:n.activityTitle,outcome:n.outcome})).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));

 }
 function share(viewer,id,ids){
  if(viewer.role!=='parent')throw Error('Only parents choose records to share.');
  const chosen=records(viewer,id).filter(n=>n.id&&Array.isArray(ids)&&ids.includes(n.id));if(!chosen.length)throw Error('Choose at least one observation or activity.');
  const text='Selected child observations shared by the parent:\n'+chosen.map(n=>(n.createdAt?String(n.createdAt).slice(0,10)+' · ':'')+n.text).join('\n\n');
  if(text.length>2000)throw Error('These notes are too long for one message. Choose fewer notes.');
  return window.RafiqDirectMessages.send(viewer,id,text);
 }
 function fingerprint(record){return JSON.stringify([record.id,record.text,record.note||'',record.outcome||'',record.updatedAt||record.createdAt]);}
 function reviews(viewer,id){threadFor(viewer,id);if(viewer.role==='specialist'&&state(viewer,id)?.status!=='active')return [];return read('rafiqCareReviews').filter(r=>r.threadId===id).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));}
 function review(viewer,id,recordId,decision,note,expectedFingerprint,activityGuidance=null){
  if(viewer.role!=='specialist')throw Error('Only the following specialist can review shared entries.');const thread=threadFor(viewer,id),record=records(viewer,id).find(r=>r.id===recordId);if(!record)throw Error('This entry is no longer shared. Reload the follow-up page.');if(!['reviewed','clarification','adapt_activity','appointment'].includes(decision))throw Error('Choose a review decision.');note=String(note||'').trim();if(note.length<5||note.length>3000)throw Error('Write a recommendation between 5 and 3000 characters.');if(expectedFingerprint&&expectedFingerprint!==fingerprint(record))throw Error('The parent updated this entry. Reload and review the latest version.');
  let guidance=null;if(activityGuidance?.mode&&activityGuidance.mode!=='none'){const connection=state(viewer,id);if(!connection.allowActivityGuidance||!connection.scopes?.includes('activities'))throw Error('The family has not allowed specialist guidance to change activity suggestions.');if(!['prefer_skill','supported_level','pause_activity','confirmed_readiness'].includes(activityGuidance.mode))throw Error('Choose a valid activity suggestion.');const days=Number(activityGuidance.days||14);if(![7,14,30].includes(days))throw Error('Choose a suggestion duration.');guidance={mode:activityGuidance.mode,expiresAt:new Date(Date.now()+days*86400000).toISOString()};if(guidance.mode==='prefer_skill'){if(!['communication','social','fine_motor','thinking','creativity','self_help'].includes(activityGuidance.skill))throw Error('Choose a supported skill.');guidance.skill=activityGuidance.skill;}if(guidance.mode==='pause_activity'){if(record.type!=='daily-moment'||!record.activityId)throw Error('Only the reviewed activity can be paused.');guidance.activityId=record.activityId;}if(guidance.mode==='supported_level')guidance.maxDifficulty=1;if(guidance.mode==='confirmed_readiness'){if(!['handling','turns','pretend','ideas','matching'].includes(activityGuidance.ability)||!['comfortable','with_support','not_yet'].includes(activityGuidance.readiness))throw Error('Choose an observed readiness state.');guidance.ability=activityGuidance.ability;guidance.readiness=activityGuidance.readiness;}}
  const all=read('rafiqCareReviews'),entry={id:crypto.randomUUID(),threadId:id,childId:thread.childId,specialistId:viewer.id,specialistName:viewer.name,recordId,recordFingerprint:fingerprint(record),recordType:record.type,recordTitle:record.activityTitle||'Parent observation',decision,note,activityGuidance:guidance,createdAt:new Date().toISOString()};all.push(entry);localStorage.setItem('rafiqCareReviews',JSON.stringify(all));
  try{const notices=read('rafiqNotifications');notices.unshift({id:crypto.randomUUID(),type:'child',childId:thread.childId,title:'Your specialist reviewed a shared entry',message:'Open the family conversation to read the recommendation.',link:'messages.html?thread='+encodeURIComponent(id),createdAt:entry.createdAt,readBy:{}});localStorage.setItem('rafiqNotifications',JSON.stringify(notices));}catch{}return entry;
 }
 function activityProfile(viewer,id){const thread=threadFor(viewer,id),connection=state(viewer,id);if(viewer.role==='specialist'&&(connection?.status!=='active'||!connection.allowActivityGuidance||!connection.scopes?.includes('activities')))return null;const value=JSON.parse(localStorage.getItem('rafiqActivityProfile_'+thread.childId)||'{}');return {abilities:value.abilities||{},maxDifficulty:value.maxDifficulty||2,focusSkills:value.focusSkills||[],updatedAt:value.updatedAt,updatedByName:value.updatedByName};}
 window.RafiqCareConnections={state,change,records,share,reviews,review,fingerprint,activityProfile};
})();
