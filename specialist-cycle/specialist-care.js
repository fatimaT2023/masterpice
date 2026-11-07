document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 if(!window.RafiqSpecialistAccess?.approved)return;
 const dm=window.RafiqDirectMessages,api=window.RafiqCareConnections,viewer=dm.identity('specialist'),page=location.pathname.split('/').pop();
 const make=(tag,text)=>{const node=document.createElement(tag);if(text!=null)node.textContent=text;return node;};
 const get=id=>document.getElementById(id),main=document.querySelector('main');if(!main)return;
 const read=key=>{const value=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(value))throw Error('Saved care information could not be read.');return value;};
 const link=(text,href)=>{const a=make('a',text);a.href=href;a.className='care-link';return a;};
 const conversation=thread=>'messages.html?thread='+encodeURIComponent(thread.id);
 function connections(){
  const rows=[];
  for(const thread of dm.list(viewer)){
   try{const state=api.state(viewer,thread.id);if(state)rows.push({thread,state});}
   catch{/* A stale or inaccessible thread must not hide other families. */}
  }
  return rows;
 }
 function profile(){const p=window.RafiqSpecialistAccess.profile;for(const [id,text] of [['sidebarName',p.fullName||'Specialist'],['sidebarSpecialty',p.specialty||'Specialist'],['sidebarAvatar',(p.fullName||'S').charAt(0)]])if(get(id))get(id).textContent=text;}
 let filter=new URLSearchParams(location.search).get('tab')==='active'?'active':'pending',selected=new URLSearchParams(location.search).get('case');
 function followUps(message=''){
  const status=get('careStatus');
  try{
   const all=connections(),rows=all.filter(row=>filter==='closed'?['declined','revoked'].includes(row.state.status):row.state.status===filter);
   document.querySelectorAll('[data-care-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.careFilter===filter)));
   const list=get('careList');list.replaceChildren();get('careEmpty').textContent=rows.length?'':filter==='pending'?'No new requests. Families can request optional follow-up from their conversation.':filter==='active'?'No accepted ongoing follow-up yet. A booking alone does not create ongoing access.':'No declined or stopped requests.';
   if(!rows.some(row=>row.thread.id===selected))selected=rows[0]?.thread.id||null;
   for(const row of rows){const b=make('button');b.type='button';b.className='care-case';b.setAttribute('aria-pressed',String(selected===row.thread.id));const name=make('strong',row.thread.childName),parent=make('span',row.thread.parentName);name.setAttribute('data-user-content','');parent.setAttribute('data-user-content','');b.append(name,parent);if(row.state.status==='active'){const reviewed=api.reviews(viewer,row.thread.id),waiting=api.records(viewer,row.thread.id).filter(record=>!reviewed.some(review=>review.recordId===record.id&&review.recordFingerprint===api.fingerprint(record))).length;b.append(make('span','Entries awaiting review: '+waiting));}b.addEventListener('click',()=>{selected=row.thread.id;followUps();});list.append(b);}
   const detail=get('careDetail');detail.replaceChildren();const row=rows.find(row=>row.thread.id===selected);status.textContent=message;
   if(!row){detail.append(make('p','Choose a request or child to see the next action.'));return;}
   const title=make('h2',row.thread.childName);title.setAttribute('data-user-content','');detail.append(title,make('p',({pending:'Awaiting your decision. Journal access starts only after acceptance and only for categories allowed by the parent.',active:'Accepted ongoing follow-up. The parent controls which entries you can see.',declined:'You declined ongoing follow-up. One-time consultation remains available.',revoked:'The parent stopped ongoing sharing. Live journal entries are no longer available.'})[row.state.status]),link('Open family conversation',conversation(row.thread)));
   if(row.state.previousRelationshipSince)detail.append(make('p','Followed before RAFIQ (family-reported): '+row.state.previousRelationshipSince));
   if(row.state.acceptedAt||row.state.respondedAt)detail.append(make('p','Sharing accepted on RAFIQ: '+String(row.state.acceptedAt||row.state.respondedAt).slice(0,10)));
   if(row.state.status==='pending')for(const [op,text] of [['accept','Accept follow-up'],['decline','Decline follow-up']]){const b=make('button',text);b.type='button';b.addEventListener('click',()=>{try{api.change(viewer,row.thread.id,op);followUps(op==='accept'?'Request accepted. Find this child under Children I follow.':'Request declined. The parent can see the response in their conversation.');}catch(error){followUps(error.message);}});detail.append(b);}
   if(row.state.status==='active'){
    detail.append(make('h3','Parent sharing permissions'),make('p',row.state.scopes?.length?row.state.scopes.map(scope=>scope==='activities'?'Activity results and reactions':'Growth observations and concerns').join(' · '):'No journal categories are shared. Use the conversation to ask the parent.'));
    const readiness=api.activityProfile(viewer,row.thread.id);if(readiness){detail.append(make('h3','Activity readiness reported by the family'));for(const [key,value] of Object.entries(readiness.abilities)){if(window.RafiqActivityMatching?.abilities[key])detail.append(make('p',window.RafiqActivityMatching.abilities[key]+' · '+({comfortable:'Comfortable now',with_support:'Comfortable with help',not_yet:'Not comfortable in this activity now',unknown:'Not sure / not recorded'})[value]));}}
    const records=api.records(viewer,row.thread.id);detail.append(make('h3','Shared observations and activity results'));const reviewed=api.reviews(viewer,row.thread.id);detail.append(make('p','Entries awaiting review: '+records.filter(r=>!reviewed.some(v=>v.recordId===r.id&&v.recordFingerprint===api.fingerprint(r))).length));
    if(!records.length)detail.append(make('p','No entries are available under the current sharing permissions.'));
    for(const record of records){const article=make('article'),type=make('strong',record.type==='daily-moment'?'Activity result':'Parent observation'),date=make('time',String(record.createdAt||'').slice(0,10)),text=make('p',record.text);text.setAttribute('data-user-content','');article.append(type,date,text);if(record.activityTitle){const name=make('h4',record.activityTitle);name.dataset.userContent='';article.prepend(name);}if(record.createdByName){const author=make('p',record.createdByName);author.dataset.userContent='';article.append(make('small','Recorded by'),author);}if(record.targetSkill&&window.RafiqActivityMatching?.skills[record.targetSkill])article.append(make('p',window.RafiqActivityMatching.skills[record.targetSkill]),make('small',window.RafiqActivityMatching.levels[record.difficulty]||''));if(record.outcome)article.append(make('p',({tried:'We tried it',later:'Maybe later','not-for-us':'Not for us'})[record.outcome]||record.outcome));window.RafiqCareReviewUI?.history(article,viewer,row.thread.id,record.id);if(record.id)window.RafiqCareReviewUI?.editor(article,viewer,row.thread.id,record,action=>followUps(action==='discard'?'Review draft discarded.':'Your recommendation was shared with the family.'));detail.append(article);}
    detail.append(make('p','Read these entries as parent observations. Send recommendations or questions in the conversation; shared access does not promise continuous monitoring.'));
   }
  }catch(error){get('careList').replaceChildren();get('careDetail').replaceChildren();status.textContent=error.message;}
 }
 const dashboardCard=make('section');dashboardCard.className='care-task-card';
 function dashboard(){
  dashboardCard.replaceChildren();dashboardCard.hidden=true;
  const mount=get('attentionList');if(!mount)return;mount.replaceChildren();
  try{
   const rows=[],validThreads=[];
   for(const thread of dm.list(viewer)){
    try{const state=api.state(viewer,thread.id);validThreads.push(thread);if(state)rows.push({thread,state});}catch{/* Skip inaccessible threads. */}
   }
   const reports=read('rafiqSpecialistReports').filter(r=>r.specialistId===viewer.id&&r.status==='submitted');
   const unfinished=read('rafiqBookings').filter(b=>b.specialistId===viewer.id&&b.status==='completed'&&!reports.some(r=>r.bookingId===b.id));
   const pending=rows.filter(r=>r.state.status==='pending').length;
   const unread=validThreads.reduce((sum,thread)=>sum+dm.unread(thread,viewer),0);
   for(const [count,text,href] of [[unfinished.length,'Completed sessions awaiting a report','report-form.html'],[pending,'New follow-up requests','follow-up.html?tab=pending'],[unread,'Unread messages','messages.html']]){
    if(!count)continue;
    const row=make('div');row.className='attention-row';const action=link(text,href);
    if(href==='report-form.html')action.addEventListener('click',()=>sessionStorage.setItem('rafiqSelectedSpecialistBooking',unfinished[0].id));
    row.append(make('strong',String(count)),action);mount.append(row);
   }
   if(!mount.childElementCount){const line=make('p','All caught up');line.className='attention-clear';mount.append(line);}
  }catch{mount.replaceChildren();}
 }
 const contextCard=make('section');contextCard.className='care-task-card';
 function sessionContext(){
  contextCard.replaceChildren();
  try{
   const id=sessionStorage.getItem('rafiqSelectedSpecialistBooking'),booking=read('rafiqBookings').find(b=>b.id===id&&b.specialistId===viewer.id);if(!booking){contextCard.hidden=true;return;}contextCard.hidden=false;
   contextCard.append(make('h2','Family context for this session'),make('strong','Note shared with this booking'));
   const note=make('p',booking.reason||'No booking note was shared.');note.setAttribute('data-user-content','');contextCard.append(note);
   const sessionActions=make('section');window.RafiqAppointmentUI?.render(sessionActions,booking,'specialist');contextCard.append(sessionActions);
   const row=connections().find(r=>r.thread.childId===booking.childId&&r.thread.parentId===booking.parentId);
   if(row?.state.status==='active'){contextCard.append(link('Review this child’s shared journal','follow-up.html?tab=active&case='+encodeURIComponent(row.thread.id)));}
   else contextCard.append(make('p','This appointment does not grant access to the child’s journal.'));
   if(row)contextCard.append(link('Open family conversation',conversation(row.thread)));
   if(page==='report-form.html'){
    const submitted=read('rafiqSpecialistReports').some(r=>r.bookingId===booking.id&&r.specialistId===viewer.id&&r.status==='submitted');
    contextCard.append(make('p',submitted?'The submitted report is available to the parent. They can record their own follow-up or send you a question.':'A draft is private. Submit the report when it is ready to become available to the parent.'));
   }
  }catch(error){contextCard.hidden=false;contextCard.append(make('p',error.message));}
 }
 profile();
 let refresh=()=>{};
 if(page==='follow-up.html'){document.querySelectorAll('[data-care-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.careFilter;selected=null;followUps();}));refresh=followUps;}
 else if(page==='specialist-dashboard.html'){refresh=dashboard;}
 else if(['booking-details.html','consultation.html','report-form.html'].includes(page)){main.append(contextCard);refresh=sessionContext;}
 else if(page==='clients.html'){const heading=main.querySelector('h1');if(heading)heading.textContent='Consultation history';const note=make('p','These children have consultation records. Ongoing follow-up is managed separately.');note.className='care-history-note';note.append(link('Open ongoing follow-up','follow-up.html?tab=active'));if(heading)heading.after(note);}
 if(page==='report-form.html'&&get('reportStatus')&&typeof MutationObserver!=='undefined')new MutationObserver(()=>sessionContext()).observe(get('reportStatus'),{attributes:true,childList:true,subtree:true});
 refresh();window.addEventListener('focus',()=>{if(!window.rafiqCareReviewDirty)refresh();});window.addEventListener('storage',event=>{if(event.key===null||event.key?.startsWith('rafiq')){if(window.rafiqCareReviewDirty){if(get('careStatus'))get('careStatus').textContent='New information is available. Your review draft is kept; reload after saving or copying it.';}else refresh();}});
});
