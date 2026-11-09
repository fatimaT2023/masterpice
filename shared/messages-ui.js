document.addEventListener('DOMContentLoaded',()=>{
 'use strict';const get=id=>document.getElementById(id),api=window.RafiqDirectMessages,role=document.body.dataset.messagingRole;
 const drafts=new Map(); let viewer,selected=null,requestedSpecialist=null;const setStatus=message=>{get('messagesStatus').textContent=message;};
 const make=(tag,text)=>{const node=document.createElement(tag);if(text!=null)node.textContent=text;return node;};
 const format=timestamp=>new Date(timestamp).toLocaleString(document.documentElement.lang==='ar'?'ar-JO':'en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
 function open(id){if(selected)drafts.set(selected,get('messageText').value);selected=id;get('messageText').value=drafts.get(id)||'';get('messageCount').textContent=get('messageText').value.length+' / 2000';try{api.markRead(viewer,id);render();}catch(error){setStatus(error.message);}}

 function requestPrompt(thread){const mount=get('followupRequestPrompt');if(!mount)return;mount.replaceChildren();const care=thread?api.connection(thread):null,specialistId=thread?.specialistId||requestedSpecialist;mount.hidden=!specialistId||care?.status==='active';if(mount.hidden)return;const state=care?.status;const text=state==='pending'?'Your introduction is sent. More messages are available after the specialist accepts.':state==='declined'?'The specialist declined this request. The conversation is closed; you can request follow-up again later.':state==='revoked'?'Follow-up is stopped. Earlier messages remain readable.':'Messaging starts with a follow-up request. Booking a session does not open a chat.';mount.append(make('p',text));if(state!=='pending'){const link=make('a','Request follow-up');const child=thread?.childId||new URLSearchParams(location.search).get('child')||window.RafiqFamily?.selected()||'';link.href='follow-up-request.html?specialist='+encodeURIComponent(specialistId)+'&child='+encodeURIComponent(child);mount.append(link);}}
 function render(){
  const partition=role==='parent'?api.inbox(viewer):null,threads=partition?[...partition.current,...partition.past].map(e=>e.thread):api.list(viewer),mount=get('conversationList');mount.replaceChildren();if(role==='parent'){get('pastConversationList').replaceChildren();get('pastConversations').hidden=!partition.past.length;}get('conversationEmpty').hidden=role==='parent'?partition.current.length>0:threads.length>0;
  for(const thread of threads){const button=make('button');button.type='button';button.className='conversation-item';button.setAttribute('aria-pressed',String(thread.id===selected));
   const name=make('strong',role==='parent'?thread.specialistName:thread.parentName),child=make('span',thread.childName),preview=make('small',thread.messages.at(-1)?.text||'No messages yet');name.setAttribute('data-user-content','');child.setAttribute('data-user-content','');if(thread.messages.at(-1)?.text)preview.setAttribute('data-user-content','');button.append(name,child,preview);
   const count=api.unread(thread,viewer);if(count){const badge=make('span',String(count));badge.className='messages-unread';button.append(badge);}
   button.addEventListener('click',()=>open(thread.id));if(role==='parent'){const care=api.connection(thread),current=['pending','active'].includes(care?.status);const profile=api.specialists().find(s=>s.id===thread.specialistId);if(profile?.specialty){const specialty=make('small',profile.specialty);specialty.dataset.userContent='';button.append(specialty);}if(current){const chip=make('span',care.status==='pending'?'Waiting for the specialist':'Following your child');chip.className='followup-status-chip';button.append(chip);mount.append(button);}else {get('pastConversationList').append(button);if(thread.id===selected)get('pastConversations').open=true;}}else mount.append(button);
  }
  const thread=threads.find(t=>t.id===selected);get('conversationWelcome').hidden=!!thread;get('conversationPanel').hidden=!thread;if(role==='parent')requestPrompt(threads.find(t=>t.id===selected));window.dispatchEvent(new CustomEvent('rafiq:conversation',{detail:{viewer,threadId:thread?.id||null}}));if(!thread)return;
  get('conversationName').textContent=role==='parent'?thread.specialistName:thread.parentName;get('conversationChild').textContent=thread.childName;
  const context=window.RafiqCareJourney?.context(viewer,thread,new URLSearchParams(location.search).get('booking')),contextCard=get('conversationBooking');contextCard.replaceChildren();contextCard.hidden=!context;
  if(context){const {booking,report}=context;const heading=make('strong',report?'Your session report is ready':booking.status==='completed'?'Session completed':booking.status==='cancelled'?'Appointment cancelled':'Your appointment');
   const description=make('p',(booking.dateLabel||booking.date)+' · '+booking.time+' · '+(booking.consultationType==='online'?'Online':'In-person'));description.setAttribute('data-user-content','');
   const link=make('a','View appointment');link.className='journey-link';link.href=role==='parent'?'bookings.html?booking='+encodeURIComponent(booking.id):'booking-details.html';
   if(role==='specialist')link.addEventListener('click',()=>window.RafiqCareJourney.prepareSpecialist(booking));else link.addEventListener('click',()=>(window.RafiqFamily ? window.RafiqFamily.select(booking.childId) : localStorage.setItem('rafiqCurrentChildId',booking.childId)));contextCard.append(heading,description,link);
   if(report){const read=make('a','Read report');read.className='journey-link';read.href=role==='parent'?'specialist-report.html':'report-form.html';read.addEventListener('click',()=>role==='parent'?window.RafiqCareJourney.openReport(booking):window.RafiqCareJourney.prepareSpecialist(booking));contextCard.append(read);
    if(report.followUp){const followup=make('p',report.followUp);followup.setAttribute('data-user-content','');contextCard.append(make('small','Specialist follow-up'),followup);}
   }else if(booking.status==='completed'){const note=make('p',role==='parent'?'Your specialist’s report will appear here after they submit it.':'The session is complete. Write the report to share the next steps with the family.');contextCard.append(note);
    if(role==='specialist'){const write=make('a','Write session report');write.className='journey-link';write.href='report-form.html';write.addEventListener('click',()=>window.RafiqCareJourney.prepareSpecialist(booking));contextCard.append(write);}
   }
  }
  const log=get('conversationLog');log.replaceChildren();
  if(!thread.messages.length){const p=make('p',role==='parent'?'Say hello and tell the specialist how they can help.':'The parent has not sent a message yet.');p.className='messages-empty';log.append(p);}
  for(const message of thread.messages){const article=make('article');article.className='direct-message'+(message.senderId===viewer.id&&message.senderRole===viewer.role?' is-mine':'');const text=make('p',message.text),time=make('time',format(message.createdAt));text.setAttribute('data-user-content','');time.dateTime=message.createdAt;const sender=make('small',message.senderName||(message.senderRole==='specialist'?thread.specialistName:thread.parentName));sender.setAttribute('data-user-content','');article.append(sender,text,time);log.append(article);}
  if(role==='parent'&&window.RafiqCareConnections){
   try{
    const care=window.RafiqCareConnections,records=care.records(viewer,thread.id);
    const decisions={reviewed:'Reviewed — no further action',clarification:'Ask the family for clarification',adapt_activity:'Recommend an activity adjustment',appointment:'Recommend a follow-up appointment'};
    for(const review of care.reviews(viewer,thread.id)){
     const card=make('article');card.className='conversation-review';card.dataset.reviewId=review.id;
     const heading=make('div');heading.className='conversation-review-heading';
     const icon=make('span','✓');icon.setAttribute('aria-hidden','true');icon.className='conversation-review-icon';
     const title=make('div');title.append(make('strong','Your specialist replied to your observation'),make('small',review.specialistName||thread.specialistName));title.lastChild.dataset.userContent='';
     heading.append(icon,title);card.append(heading);
     const record=records.find(r=>r.id===review.recordId);
     const quote=make('blockquote',record?.text||review.recordTitle||'Parent observation');quote.dataset.userContent='';card.append(quote);
     const decision=make('span',decisions[review.decision]||review.decision);decision.className='conversation-review-decision';
     const body=make('p',review.note);body.dataset.userContent='';
     const time=make('time',format(review.createdAt));time.dateTime=review.createdAt;
     card.append(decision,body,time);
     if(review.activityGuidance){
      const guidance=make('p','This recommendation also guides activity suggestions.');guidance.className='conversation-review-guidance';card.append(guidance);
     }
     const reply=make('button','Reply to specialist');reply.type='button';reply.className='conversation-review-reply';reply.disabled=!api.canReply(viewer,thread);
     reply.addEventListener('click',()=>{get('messageText').focus();});card.append(reply);
     const later=[...log.children].find(node=>new Date(node.querySelector('time')?.dateTime).getTime()>new Date(review.createdAt).getTime());
     log.insertBefore(card,later||null);
    }
   }catch{/* Keep the conversation available if review access changed. */}
  }
  log.scrollTop=log.scrollHeight;
  const available=api.canReply(viewer,thread);get('messageText').disabled=!available;get('messageSend').disabled=!available;get('conversationUnavailable').hidden=available;if(!available)get('conversationUnavailable').textContent=role==='specialist'?'Accept follow-up to reply.':api.connection(thread)?.status==='pending'?'Your introduction is sent. More messages are available after the specialist accepts.':'This conversation is read-only. Request follow-up to message this specialist.';
 }
 try{viewer=api.identity(role);}catch(error){setStatus(error.message);get('messagesWorkspace').hidden=true;return;}
 if(role==='parent'){
  const params=new URLSearchParams(location.search);requestedSpecialist=params.get('specialist');if(requestedSpecialist){const child=params.get('child')||window.RafiqFamily?.selected();selected=api.list(viewer).find(t=>t.specialistId===requestedSpecialist&&(!child||t.childId===child))?.id||null;}
 }else {
  if(get('startConversation'))get('startConversation').hidden=true;
  const profile=window.RafiqSpecialistAccess.profile;
  for(const [id,value] of [['sidebarName',profile.fullName||'Specialist'],['sidebarSpecialty',profile.specialty||'Specialist'],['sidebarAvatar',(profile.fullName||'S').slice(0,1).toUpperCase()]]){const node=get(id);if(node)node.textContent=value;}
 }
 get('messageCompose').addEventListener('submit',event=>{event.preventDefault();try{api.send(viewer,selected,get('messageText').value);drafts.delete(selected);get('messageText').value='';get('messageCount').textContent='0 / 2000';setStatus('');render();get('messageText').focus();}catch(error){setStatus(error.message);}});
 get('messageText').addEventListener('input',()=>get('messageCount').textContent=get('messageText').value.length+' / 2000');
 get('messagesSearch').addEventListener('input',()=>{const query=get('messagesSearch').value.toLowerCase();document.querySelectorAll('#conversationList button,#pastConversationList button').forEach(button=>button.hidden=!button.textContent.toLowerCase().includes(query));});
 window.addEventListener('rafiq:care-updated',()=>{try{render();}catch(error){setStatus(error.message);}});
 window.addEventListener('storage',event=>{if(['rafiqDirectConversations','rafiqSpecialists','rafiqBookings','rafiqSpecialistReports','rafiqCareReviews','rafiqCareConnections'].includes(event.key)){try{const active=api.list(viewer).find(t=>t.id===selected);if(!document.hidden&&active&&api.unread(active,viewer))api.markRead(viewer,selected);render();}catch(error){setStatus(error.message);}}});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&selected){try{api.markRead(viewer,selected);render();}catch(error){setStatus(error.message);}}});
 try{const requestedThread=new URLSearchParams(location.search).get('thread');if(requestedThread){selected=api.list(viewer).find(t=>t.id===requestedThread)?.id||null;if(!selected)setStatus('This conversation is not available to your account.');}const bookingId=new URLSearchParams(location.search).get('booking');if(role==='specialist'&&bookingId){let bookings=[];try{bookings=JSON.parse(localStorage.getItem('rafiqBookings')||'[]');}catch{}const booking=Array.isArray(bookings)?bookings.find(b=>b.id===bookingId&&b.specialistId===viewer.id):null;if(booking)selected=api.list(viewer).find(t=>t.specialistId===viewer.id&&t.childId===booking.childId&&(!booking.parentId||t.parentId===booking.parentId))?.id||null;}if(!selected&&!requestedThread&&!requestedSpecialist)selected=(role==='parent'?api.inbox(viewer).current[0]?.thread:api.list(viewer)[0])?.id||null;if(selected)api.markRead(viewer,selected);render();}catch(error){setStatus(error.message);}
});
