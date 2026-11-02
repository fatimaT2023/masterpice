/* Local preview permissions. Production must enforce these checks on the server. */
(()=>{'use strict';
 const key='rafiqCareConnections',allowed=['observations','activities'];
 const read=name=>{const value=JSON.parse(localStorage.getItem(name)||'[]');if(!Array.isArray(value))throw Error('Saved care information could not be read.');return value;};
 function threadFor(viewer,id){
  const current=window.RafiqDirectMessages.identity(viewer.role);
  if(current.id!==viewer.id)throw Error('Please sign in again.');
  const thread=window.RafiqDirectMessages.list(current).find(t=>t.id===id);if(!thread)throw Error('Conversation not found.');
  const child=read('rafiqChildren').find(c=>c.id===thread.childId&&(c.parentId===thread.parentId||(!c.parentId&&!sessionStorage.getItem('rafiqParentUserId')&&viewer.role==='parent')));
  if(!child)throw Error('This child is not linked to this parent.');return thread;
 }
 const scopes=value=>allowed.filter(name=>Array.isArray(value)&&value.includes(name));
 function state(viewer,id){const thread=threadFor(viewer,id);return read(key).find(c=>c.threadId===id&&c.parentId===thread.parentId&&c.childId===thread.childId&&c.specialistId===thread.specialistId)||null;}
 function change(viewer,id,operation,value=[]){
  const thread=threadFor(viewer,id),all=read(key),index=all.findIndex(c=>c.threadId===id&&c.parentId===thread.parentId&&c.childId===thread.childId&&c.specialistId===thread.specialistId),old=index>=0?all[index]:null;
  if(!window.RafiqDirectMessages.specialists().some(s=>s.id===thread.specialistId&&s.status==='approved'))throw Error('This specialist is unavailable.');
  let next;
  if(operation==='request'&&viewer.role==='parent'&&!['pending','active'].includes(old?.status))next={...old,status:'pending',scopes:scopes(value),requestedAt:new Date().toISOString()};
  else if(['accept','decline'].includes(operation)&&viewer.role==='specialist'&&old?.status==='pending')next={...old,status:operation==='accept'?'active':'declined',respondedAt:new Date().toISOString()};
  else if(operation==='revoke'&&viewer.role==='parent'&&['pending','active'].includes(old?.status))next={...old,status:'revoked',scopes:[],revokedAt:new Date().toISOString()};
  else if(operation==='sharing'&&viewer.role==='parent'&&old?.status==='active')next={...old,scopes:scopes(value)};
  else throw Error('This care request has changed. Reload the conversation.');
  next={...next,threadId:id,parentId:thread.parentId,childId:thread.childId,specialistId:thread.specialistId,updatedAt:new Date().toISOString()};
  if(index>=0)all[index]=next;else all.push(next);localStorage.setItem(key,JSON.stringify(all));return next;
 }
 function records(viewer,id){
  const thread=threadFor(viewer,id),connection=state(viewer,id);
  if(viewer.role==='specialist'&&connection?.status!=='active')return [];
  const permitted=viewer.role==='parent'?allowed:scopes(connection.scopes);
  return read('rafiqAgeObservations_'+thread.childId).filter(n=>n&&(!n.childId||n.childId===thread.childId)&&((n.type==='daily-moment'&&permitted.includes('activities'))||(['observation','concern'].includes(n.type||'observation')&&permitted.includes('observations')))).map(n=>({id:n.id,type:n.type||'observation',text:String(n.text||''),createdAt:n.createdAt,activityTitle:n.activityTitle,outcome:n.outcome})).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
 }
 function share(viewer,id,ids){
  if(viewer.role!=='parent')throw Error('Only parents choose records to share.');
  const chosen=records(viewer,id).filter(n=>n.id&&Array.isArray(ids)&&ids.includes(n.id));if(!chosen.length)throw Error('Choose at least one observation or activity.');
  const text='Selected child observations shared by the parent:\n'+chosen.map(n=>(n.createdAt?String(n.createdAt).slice(0,10)+' · ':'')+n.text).join('\n\n');
  if(text.length>2000)throw Error('These notes are too long for one message. Choose fewer notes.');
  return window.RafiqDirectMessages.send(viewer,id,text);
 }
 window.RafiqCareConnections={state,change,records,share};
})();
