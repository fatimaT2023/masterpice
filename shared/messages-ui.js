document.addEventListener('DOMContentLoaded',()=>{
 'use strict';const get=id=>document.getElementById(id),api=window.RafiqDirectMessages,role=document.body.dataset.messagingRole;
 const drafts=new Map(); let viewer,selected=null;const setStatus=message=>{get('messagesStatus').textContent=message;};
 const make=(tag,text)=>{const node=document.createElement(tag);if(text!=null)node.textContent=text;return node;};
 const format=timestamp=>new Date(timestamp).toLocaleString(document.documentElement.lang==='ar'?'ar-JO':'en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
 function open(id){if(selected)drafts.set(selected,get('messageText').value);selected=id;get('messageText').value=drafts.get(id)||'';get('messageCount').textContent=get('messageText').value.length+' / 2000';try{api.markRead(viewer,id);render();}catch(error){setStatus(error.message);}}
 function render(){
  const threads=api.list(viewer),mount=get('conversationList');mount.replaceChildren();get('conversationEmpty').hidden=threads.length>0;
  for(const thread of threads){const button=make('button');button.type='button';button.className='conversation-item';button.setAttribute('aria-pressed',String(thread.id===selected));
   const name=make('strong',role==='parent'?thread.specialistName:thread.parentName),child=make('span',thread.childName),preview=make('small',thread.messages.at(-1)?.text||'Start the conversation');name.setAttribute('data-user-content','');child.setAttribute('data-user-content','');preview.setAttribute('data-user-content','');button.append(name,child,preview);
   const count=api.unread(thread,viewer);if(count){const badge=make('span',String(count));badge.className='messages-unread';button.append(badge);}
   button.addEventListener('click',()=>open(thread.id));mount.append(button);
  }
  const thread=threads.find(t=>t.id===selected);get('conversationWelcome').hidden=!!thread;get('conversationPanel').hidden=!thread;window.dispatchEvent(new CustomEvent('rafiq:conversation',{detail:{viewer,threadId:thread?.id||null}}));if(!thread)return;
  get('conversationName').textContent=role==='parent'?thread.specialistName:thread.parentName;get('conversationChild').textContent=thread.childName;
  const context=window.RafiqCareJourney?.context(viewer,thread,new URLSearchParams(location.search).get('booking')),contextCard=get('conversationBooking');contextCard.replaceChildren();contextCard.hidden=!context;
  if(context){const {booking,report}=context;const heading=make('strong',report?'Your session report is ready':booking.status==='completed'?'Session completed':booking.status==='cancelled'?'Appointment cancelled':'Your appointment');
   const description=make('p',(booking.dateLabel||booking.date)+' · '+booking.time+' · '+(booking.consultationType==='online'?'Online':'In-person'));description.setAttribute('data-user-content','');
   const link=make('a','View appointment');link.className='journey-link';link.href=role==='parent'?'bookings.html?booking='+encodeURIComponent(booking.id):'booking-details.html';
   if(role==='specialist')link.addEventListener('click',()=>window.RafiqCareJourney.prepareSpecialist(booking));else link.addEventListener('click',()=>localStorage.setItem('rafiqCurrentChildId',booking.childId));contextCard.append(heading,description,link);
   if(report){const read=make('a','Read report');read.className='journey-link';read.href=role==='parent'?'specialist-report.html':'report-form.html';read.addEventListener('click',()=>role==='parent'?window.RafiqCareJourney.openReport(booking):window.RafiqCareJourney.prepareSpecialist(booking));contextCard.append(read);
    if(report.followUp){const followup=make('p',report.followUp);followup.setAttribute('data-user-content','');contextCard.append(make('small','Specialist follow-up'),followup);}
   }else if(booking.status==='completed'){const note=make('p',role==='parent'?'Your specialist’s report will appear here after they submit it.':'The session is complete. Write the report to share the next steps with the family.');contextCard.append(note);
    if(role==='specialist'){const write=make('a','Write session report');write.className='journey-link';write.href='report-form.html';write.addEventListener('click',()=>window.RafiqCareJourney.prepareSpecialist(booking));contextCard.append(write);}
   }
  }
  const log=get('conversationLog');log.replaceChildren();
  if(!thread.messages.length){const p=make('p',role==='parent'?'Say hello and tell the specialist how they can help.':'The parent has not sent a message yet.');p.className='messages-empty';log.append(p);}
  for(const message of thread.messages){const article=make('article');article.className='direct-message'+(message.senderId===viewer.id&&message.senderRole===viewer.role?' is-mine':'');const text=make('p',message.text),time=make('time',format(message.createdAt));text.setAttribute('data-user-content','');time.dateTime=message.createdAt;article.append(text,time);log.append(article);}
  log.scrollTop=log.scrollHeight;
  const available=api.specialists().some(s=>s.id===thread.specialistId&&s.status==='approved');get('messageText').disabled=!available;get('messageSend').disabled=!available;get('conversationUnavailable').hidden=available;
 }
 try{viewer=api.identity(role);}catch(error){setStatus(error.message);get('messagesWorkspace').hidden=true;return;}
 if(role==='parent'){
  const select=get('messageSpecialist');for(const specialist of api.specialists().filter(s=>s.status==='approved')){const option=make('option',specialist.fullName||'Specialist');option.value=specialist.id;select.append(option);}
  let children=[];try{children=window.RafiqSetup.readChildren();}catch{}if(!Array.isArray(children))children=[];
  for(const child of children){const option=make('option',child.name||'Your child');option.value=child.id;get('messageChild').append(option);}
  const requestedChild=new URLSearchParams(location.search).get('child');get('messageChild').value=(children.some(child=>child.id===requestedChild)?requestedChild:null)||localStorage.getItem('rafiqCurrentChildId')||children[0]?.id||'';
  get('startConversation').addEventListener('submit',event=>{event.preventDefault();try{const thread=api.start(viewer,select.value,get('messageChild').value);setStatus('');open(thread.id);}catch(error){setStatus(error.message);}});
  const requested=new URLSearchParams(location.search).get('specialist');if(requested){select.value=requested;try{selected=api.start(viewer,requested,get('messageChild').value).id;}catch(error){setStatus(error.message);}}
 }else {
  get('startConversation').hidden=true;
  const profile=window.RafiqSpecialistAccess.profile;
  for(const [id,value] of [['sidebarName',profile.fullName||'Specialist'],['sidebarSpecialty',profile.specialty||'Specialist'],['sidebarAvatar',(profile.fullName||'S').slice(0,1).toUpperCase()]]){const node=get(id);if(node)node.textContent=value;}
 }
 get('messageCompose').addEventListener('submit',event=>{event.preventDefault();try{api.send(viewer,selected,get('messageText').value);drafts.delete(selected);get('messageText').value='';get('messageCount').textContent='0 / 2000';setStatus('');render();get('messageText').focus();}catch(error){setStatus(error.message);}});
 get('messageText').addEventListener('input',()=>get('messageCount').textContent=get('messageText').value.length+' / 2000');
 get('messagesSearch').addEventListener('input',()=>{const query=get('messagesSearch').value.toLowerCase();get('conversationList').querySelectorAll('button').forEach(button=>button.hidden=!button.textContent.toLowerCase().includes(query));});
 window.addEventListener('rafiq:care-updated',()=>{try{render();}catch(error){setStatus(error.message);}});
 window.addEventListener('storage',event=>{if(['rafiqDirectConversations','rafiqSpecialists','rafiqBookings','rafiqSpecialistReports'].includes(event.key)){try{const active=api.list(viewer).find(t=>t.id===selected);if(!document.hidden&&active&&api.unread(active,viewer))api.markRead(viewer,selected);render();}catch(error){setStatus(error.message);}}});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&selected){try{api.markRead(viewer,selected);render();}catch(error){setStatus(error.message);}}});
 try{const requestedThread=new URLSearchParams(location.search).get('thread');if(requestedThread){selected=api.list(viewer).find(t=>t.id===requestedThread)?.id||null;if(!selected)setStatus('This conversation is not available to your account.');}const bookingId=new URLSearchParams(location.search).get('booking');if(role==='specialist'&&bookingId){let bookings=[];try{bookings=JSON.parse(localStorage.getItem('rafiqBookings')||'[]');}catch{}const booking=Array.isArray(bookings)?bookings.find(b=>b.id===bookingId&&b.specialistId===viewer.id):null;if(booking)selected=api.list(viewer).find(t=>t.specialistId===viewer.id&&t.childId===booking.childId&&(!booking.parentId||t.parentId===booking.parentId))?.id||null;}if(!selected&&!requestedThread)selected=api.list(viewer)[0]?.id||null;if(selected)api.markRead(viewer,selected);render();}catch(error){setStatus(error.message);}
});
