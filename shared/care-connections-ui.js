document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const api=window.RafiqCareConnections,mount=document.getElementById('careConnectionPanel');let viewer,threadId;
 const make=(tag,text)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;return e;};
 function draw(message=''){
  mount.replaceChildren();mount.hidden=!threadId;if(!threadId)return;
  try{
   const state=api.state(viewer,threadId),parent=viewer.role==='parent',active=state?.status==='active',pending=state?.status==='pending';
   const title=make('h3','Optional ongoing follow-up'),copy=make('p','A conversation or appointment does not automatically share the child’s journal. Ongoing follow-up needs a parent request and specialist acceptance.');
   const status=make('p',({pending:'Follow-up request awaiting specialist acceptance.',active:'Ongoing follow-up accepted.',declined:'The specialist declined this request. You can continue with a one-time consultation.',revoked:'Ongoing sharing is stopped. Previously sent messages remain in the conversation.'})[state?.status]||'No ongoing follow-up. You can use Rafiq and have a one-time consultation without a regular doctor.');
   const notice=make('p',message);notice.setAttribute('role','status');mount.append(title,copy,status);
   function button(text,handler){const b=make('button',text);b.type='button';b.addEventListener('click',()=>{try{handler();}catch(error){notice.textContent=error.message;}});return b;}
   if(parent){
    const form=make('form'),legend=make('strong','Choose ongoing sharing (optional)'),explain=make('p','Selected categories include existing and future entries for this child only, after the specialist accepts. Photos, health records and reports are not included. You can stop sharing at any time.'),choices=[];
    form.append(legend,explain);
    for(const [value,text] of [['observations','Growth observations and concerns'],['activities','Activity results and reactions']]){const label=make('label'),input=make('input');input.type='checkbox';input.value=value;input.checked=(state?.scopes||[]).includes(value);input.disabled=pending;label.append(input,make('span',text));form.append(label);choices.push(input);}
    if(!pending){const submit=make('button',active?'Save sharing permissions':'Request ongoing follow-up');submit.type='submit';form.append(submit);form.addEventListener('submit',event=>{event.preventDefault();try{api.change(viewer,threadId,active?'sharing':'request',choices.filter(c=>c.checked).map(c=>c.value));draw('Your choice is saved.');}catch(error){notice.textContent=error.message;}});}
    mount.append(form);
    if(pending||active)mount.append(button(pending?'Cancel follow-up request':'Stop ongoing sharing',()=>{api.change(viewer,threadId,'revoke');draw('Ongoing access is stopped. Previously sent messages remain available.');}));
    const details=make('details'),summary=make('summary','Share selected notes for this consultation'),shareForm=make('form'),help=make('p','Only the entries you select are sent as a message. This does not give access to future entries. Sent copies remain in this conversation.'),inputs=[];
    details.append(summary,help);const records=api.records(viewer,threadId);
    for(const record of records.filter(r=>r.id)){const label=make('label'),input=make('input'),text=make('span',record.text);input.type='checkbox';input.value=record.id;text.setAttribute('data-user-content','');label.append(input,text);shareForm.append(label);inputs.push(input);}
    if(!inputs.length)details.append(make('p','No growth observations or activity results to share yet.'));
    else{const submit=make('button','Send selected entries');submit.type='submit';shareForm.append(submit);shareForm.addEventListener('submit',event=>{event.preventDefault();try{api.share(viewer,threadId,inputs.filter(i=>i.checked).map(i=>i.value));window.dispatchEvent(new Event('rafiq:care-updated'));draw('Selected entries were sent in this conversation.');}catch(error){notice.textContent=error.message;}});details.append(shareForm);}
    mount.append(details);
   }else{
    if(pending){mount.append(button('Accept follow-up request',()=>{api.change(viewer,threadId,'accept');draw('Follow-up request accepted.');}),button('Decline follow-up request',()=>{api.change(viewer,threadId,'decline');draw('Follow-up request declined.');}));}
    if(active){const records=api.records(viewer,threadId);mount.append(make('h4','Entries shared by the parent'),make('p','These are parent observations, not a clinical assessment. Access does not mean that entries are monitored continuously.'));
     if(!records.length)mount.append(make('p','No entries are available under the current sharing permissions.'));
     for(const record of records){const article=make('article'),date=make('small',String(record.createdAt||'').slice(0,10)),text=make('p',record.text);text.setAttribute('data-user-content','');article.append(date,text);mount.append(article);}
    }
   }
   mount.append(make('p','Sharing is not an instant review. Send a message when you need a reply.'),notice);
  }catch(error){mount.append(make('p',error.message));}
 }
 window.addEventListener('rafiq:conversation',event=>{viewer=event.detail.viewer;threadId=event.detail.threadId;draw();});
 window.addEventListener('storage',event=>{if(event.key===null||event.key==='rafiqCareConnections'||event.key?.startsWith('rafiqAgeObservations_'))draw();});
});
