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
 const owns=(thread,viewer)=>viewer.role==='parent'?thread.parentId===viewer.id:thread.specialistId===viewer.id;
 function list(viewer){return array(key).filter(t=>owns(t,viewer)).sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));}
 function start(viewer,specialistId,childId){
  if(viewer.role!=='parent')throw Error('Parents start conversations with their specialist.');
  const specialist=specialists().find(s=>s.id===specialistId&&s.status==='approved');if(!specialist)throw Error('This specialist is not currently available for messages.');
  const owner=sessionStorage.getItem('rafiqParentUserId')||'legacy-browser';
  const child=array('rafiqChildren').find(c=>c.id===childId&&(c.parentId===owner||(owner==='legacy-browser'&&!c.parentId)));if(!child)throw Error('Choose a child before starting a conversation.');
  const all=array(key);let thread=all.find(t=>t.parentId===viewer.id&&t.specialistId===specialistId&&t.childId===child.id);
  if(!thread){thread={id:crypto.randomUUID(),parentId:viewer.id,parentName:viewer.name,specialistId,specialistName:specialist.fullName||'Specialist',childId:child.id,childName:child.name||'Your child',messages:[],readAt:{},updatedAt:new Date().toISOString()};all.push(thread);localStorage.setItem(key,JSON.stringify(all));}
  return thread;
 }
 function send(viewer,id,body){
  const text=String(body||'').trim();if(!text||text.length>2000)throw Error('Write a message between 1 and 2000 characters.');
  const all=array(key),thread=all.find(t=>t.id===id&&owns(t,viewer));if(!thread)throw Error('Conversation not found.');
  if(!specialists().some(s=>s.id===thread.specialistId&&s.status==='approved'))throw Error('This specialist is not currently available for messages.');
  if(!Array.isArray(thread.messages))throw Error('Saved messages could not be read.');
  if(thread.messages.length>=500)throw Error('This preview conversation has reached its message limit.');
  const message={id:crypto.randomUUID(),senderRole:viewer.role,senderId:viewer.id,text,createdAt:new Date().toISOString()};thread.messages.push(message);thread.updatedAt=message.createdAt;thread.readAt={...thread.readAt,[viewer.role]:message.createdAt};thread.readCounts={...thread.readCounts,[viewer.role]:thread.messages.length};localStorage.setItem(key,JSON.stringify(all));return message;
 }
 function markRead(viewer,id){const all=array(key),thread=all.find(t=>t.id===id&&owns(t,viewer));if(!thread)return;thread.readAt={...thread.readAt,[viewer.role]:new Date().toISOString()};thread.readCounts={...thread.readCounts,[viewer.role]:thread.messages.length};localStorage.setItem(key,JSON.stringify(all));}
 const unread=(thread,viewer)=>(thread.messages||[]).filter((m,index)=>m.senderRole!==viewer.role&&(Number.isInteger(thread.readCounts?.[viewer.role])?index>=thread.readCounts[viewer.role]:m.createdAt>(thread.readAt?.[viewer.role]||''))).length;
 window.RafiqDirectMessages={identity,list,start,send,markRead,unread,specialists};
})();
