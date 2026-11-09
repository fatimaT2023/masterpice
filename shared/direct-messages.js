/* Local messaging preview. Server authentication and storage are required for cross-device use. */
(()=>{'use strict';
 const key='rafiqDirectConversations';
 const read=(name,fallback)=>{const raw=localStorage.getItem(name);if(!raw)return fallback;const value=JSON.parse(raw);return value;};
 const array=name=>{const value=read(name,[]);if(!Array.isArray(value))throw Error('Saved messages could not be read.');return value;};
 const specialists=()=>{const list=array('rafiqSpecialists'),current=read('rafiqSpecialistProfile',null);if(current?.id&&!list.some(p=>p.id===current.id))list.push(current);return list.filter(s=>!window.RafiqAccountStatus?.inactive({...s,role:'specialist'}));};
 function identity(role){
  if(role==='specialist'){const access=window.RafiqSpecialistAccess;if(!access?.approved||!access.profile||window.RafiqAccountStatus?.inactive({...access.profile,role:'specialist'}))throw Error('Specialist approval is required to open messages.');return {role,id:access.profile.id,name:access.profile.fullName||'Specialist'};}
  const id=sessionStorage.getItem('rafiqParentUserId'),account=id?array('rafiqUsers').find(u=>u.id===id&&u.role==='parent'):null;
  if(id&&!account)throw Error('Please sign in again to open messages.');
  if(account&&window.RafiqAccountStatus?.inactive(account))throw Error('This account is deactivated. Contact support.');
  if(account)return {role,id:account.id,name:account.fullName||'Parent'};
  let preview=localStorage.getItem('rafiqMessagingParentId');if(!preview){preview='parent_preview_'+crypto.randomUUID();localStorage.setItem('rafiqMessagingParentId',preview);}
  const profile=read('rafiqParentProfile',null);return {role,id:preview,name:profile?.name||'Parent'};
 }
 const owns=(thread,viewer)=>viewer.role==='parent'?(window.RafiqFamily?window.RafiqFamily.canAccessId(thread.childId,viewer.id):thread.parentId===viewer.id):thread.specialistId===viewer.id;
 function list(viewer){return array(key).filter(t=>owns(t,viewer)).sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));}
 function start(viewer,specialistId,childId){
  if(viewer.role!=='parent')throw Error('Parents start conversations with their specialist.');
  const specialist=specialists().find(s=>s.id===specialistId&&s.status==='approved'&&s.verificationStatus!=='rejected');if(!specialist)throw Error('This specialist is not currently available for messages.');
  const owner=sessionStorage.getItem('rafiqParentUserId')||'legacy-browser';
  const child=array('rafiqChildren').find(c=>c.id===childId&&(window.RafiqFamily?window.RafiqFamily.canAccess(c,owner):(c.parentId===owner||(owner==='legacy-browser'&&!c.parentId))));if(!child)throw Error('Choose a child before starting a conversation.');
  const all=array(key);let thread=all.find(t=>t.specialistId===specialistId&&t.childId===child.id);
  if(!thread){thread={id:crypto.randomUUID(),parentId:child.parentId||viewer.id,parentName:window.RafiqFamily?.user(child.parentId)?.fullName||viewer.name,specialistId,specialistName:specialist.fullName||'Specialist',childId:child.id,childName:child.name||'Your child',messages:[],readAt:{},updatedAt:new Date().toISOString()};all.push(thread);localStorage.setItem(key,JSON.stringify(all));}
  return thread;
 }
 function appendMessage(viewer,id,body,introduction=false){
  if(identity(viewer.role).id!==viewer.id)throw Error('Please sign in again to open messages.');
  const text=String(body||'').trim();if(!text||text.length>2000)throw Error('Write a message between 1 and 2000 characters.');
  const all=array(key),thread=all.find(t=>t.id===id&&owns(t,viewer));if(!thread)throw Error('Conversation not found.');
  if(!specialists().some(s=>s.id===thread.specialistId&&s.status==='approved'&&s.verificationStatus!=='rejected'))throw Error('This specialist is not currently available for messages.');
  if(!Array.isArray(thread.messages))throw Error('Saved messages could not be read.');const care=connection(thread);if(introduction){if(viewer.role!=='parent'||care?.status!=='pending'||thread.messages.some(m=>(m.introRequestId||m.introRequestAt)===(care.requestId||care.requestedAt)))throw Error('Only one introduction is allowed while the request is pending.');}else if(care?.status!=='active')throw Error('Messaging is available after the specialist accepts follow-up.');
  if(!Array.isArray(thread.messages))throw Error('Saved messages could not be read.');
  if(thread.messages.length>=500)throw Error('This preview conversation has reached its message limit.');
  const message={id:crypto.randomUUID(),senderRole:viewer.role,senderId:viewer.id,senderName:viewer.name,text,createdAt:new Date().toISOString()};if(introduction){message.introRequestAt=care.requestedAt;message.introRequestId=care.requestId||care.requestedAt;}thread.messages.push(message);thread.updatedAt=message.createdAt;thread.readAt={...thread.readAt,[viewer.role+':'+viewer.id]:message.createdAt};thread.readCounts={...thread.readCounts,[viewer.role+':'+viewer.id]:thread.messages.length};localStorage.setItem(key,JSON.stringify(all));try{const notices=array('rafiqNotifications');notices.unshift({id:crypto.randomUUID(),type:'message',childId:thread.childId,title:'New message about your child',message:viewer.name+' sent a message.',createdBy:viewer.id,createdAt:message.createdAt,link:'messages.html?thread='+encodeURIComponent(thread.id),readBy:viewer.role==='parent'?{[viewer.id]:true}:{}});localStorage.setItem('rafiqNotifications',JSON.stringify(notices.slice(0,500)));}catch{}return message;
 }

 function connection(thread){return array('rafiqCareConnections').find(c=>c.threadId===thread.id&&c.childId===thread.childId&&c.specialistId===thread.specialistId&&c.parentId===thread.parentId)||null;}
 function canReply(viewer,thread){return owns(thread,viewer)&&connection(thread)?.status==='active'&&specialists().some(s=>s.id===thread.specialistId&&s.status==='approved'&&s.verificationStatus!=='rejected');}
 function inbox(viewer){const current=[],past=[];for(const thread of list(viewer)){const care=connection(thread),entry={thread,connection:care};(['pending','active'].includes(care?.status)?current:past).push(entry);}const stamp=e=>[e.thread.updatedAt||'',e.connection?.updatedAt||''].sort().at(-1);for(const rows of [current,past])rows.sort((a,b)=>stamp(b).localeCompare(stamp(a)));return {current,past};}
 function send(viewer,id,body){return appendMessage(viewer,id,body);}
 function requestFollowUp(viewer,specialistId,childId,scopes=[],metadata={},intro=''){
  if(viewer.role!=='parent'||identity('parent').id!==viewer.id)throw Error('Only a signed-in parent can request follow-up.');
  intro=String(intro||'').trim();if(intro.length>500)throw Error('Keep the introduction to 500 characters or fewer.');
  const keys=[key,'rafiqCareConnections','rafiqNotifications'],before=keys.map(k=>localStorage.getItem(k));
  try{const thread=start(viewer,specialistId,childId),old=connection(thread);if(['pending','active'].includes(old?.status))return {thread,connection:old,existing:true};
   if(Object.hasOwn(metadata,'expectedConnection')&&metadata.expectedConnection!==JSON.stringify(old))throw Error('This care request changed in another tab. Reload before sending.');
   const care=window.RafiqCareConnections.change(viewer,thread.id,'request',scopes,{...metadata,includeEarlierRecords:metadata.includeEarlierRecords===true});
   if(intro)appendMessage(viewer,thread.id,intro,true);
   // A pending request itself reaches the specialist even without an introduction.
   const notices=array('rafiqNotifications');notices.unshift({id:crypto.randomUUID(),type:'followup',specialistId,childId,createdBy:viewer.id,title:'New follow-up request',message:'A parent requested ongoing follow-up.',link:'messages.html?thread='+encodeURIComponent(thread.id),createdAt:care.requestedAt,readBy:{[viewer.id]:true}});localStorage.setItem('rafiqNotifications',JSON.stringify(notices.slice(0,500)));
   return {thread:list(viewer).find(t=>t.id===thread.id),connection:care,existing:false};
  }catch(error){keys.forEach((k,i)=>{if(before[i]===null)localStorage.removeItem(k);else localStorage.setItem(k,before[i]);});throw error;}
 }
 function markRead(viewer,id){const all=array(key),thread=all.find(t=>t.id===id&&owns(t,viewer));if(!thread)return;thread.readAt={...thread.readAt,[viewer.role+':'+viewer.id]:new Date().toISOString()};thread.readCounts={...thread.readCounts,[viewer.role+':'+viewer.id]:thread.messages.length};localStorage.setItem(key,JSON.stringify(all));}
 const unread=(thread,viewer)=>(thread.messages||[]).filter((m,index)=>(m.senderRole!==viewer.role||m.senderId!==viewer.id)&&(Number.isInteger(thread.readCounts?.[viewer.role+':'+viewer.id])?index>=thread.readCounts[viewer.role+':'+viewer.id]:m.createdAt>(thread.readAt?.[viewer.role+':'+viewer.id]||''))).length;
 window.RafiqDirectMessages={identity,list,start,send,markRead,unread,specialists,connection,canReply,inbox,requestFollowUp};
})();
