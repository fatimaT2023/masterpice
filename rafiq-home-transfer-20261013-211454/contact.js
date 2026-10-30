/* Uses the existing support API. With an empty apiBase all actions stay local. */
(() => {
 'use strict';
 const api=window.RafiqSupport,$=id=>document.getElementById(id);
 if(!api)return;
 const form=$('supportCreate'),category=$('contactCategory'),feedback=$('supportFeedback');
 const labels={new:'New',in_progress:'In progress',resolved:'Resolved'};
 let tickets=[],selected=null;
 const make=(tag,text,privateText=false)=>{const node=document.createElement(tag);node.textContent=text;if(privateText)node.setAttribute('data-no-translate','');return node;};
 function showFeedback(text){feedback.textContent=text;}
 function filterAnswers(){
  const term=$('contactSearch').value.trim().toLocaleLowerCase();
  let visible=0;
  document.querySelectorAll('.contact-answer').forEach(answer=>{answer.hidden=Boolean(term&&!answer.textContent.toLocaleLowerCase().includes(term));if(!answer.hidden)visible++;});
  $('contactEmpty').hidden=visible>0;
 }
 $('contactSearch').addEventListener('input',filterAnswers);
 function syncCategory(){document.querySelectorAll('[data-contact-category]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.contactCategory===category.value)));}
 document.querySelectorAll('[data-contact-category]').forEach(button=>button.addEventListener('click',()=>{
  category.value=button.dataset.contactCategory;syncCategory();
  $('supportPortal').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});
  category.focus({preventScroll:true});
 }));
 category.addEventListener('change',syncCategory);
 const queryCategory=new URLSearchParams(location.search).get('category');
 if(['account','booking','profile','technical','other'].includes(queryCategory))category.value=queryCategory;
 syncCategory();
 function renderDetail(){
  const ticket=tickets.find(item=>item.id===selected);$('supportDetail').hidden=!ticket;if(!ticket)return;
  $('ticketTitle').textContent=ticket.subject;
  $('ticketMeta').textContent=new Date(ticket.createdAt).toLocaleString(document.documentElement.lang==='ar'?'ar-JO':'en-GB');
  $('ticketReference').textContent=ticket.id;
  const messages=$('supportMessages');messages.replaceChildren();
  for(const message of ticket.messages||[]){
   const article=document.createElement('article');article.append(make('strong',message.authorRole==='admin'?'Support team':'You'),make('p',message.body,true));messages.append(article);
  }
 }
 function render(){
  const list=$('supportList');list.replaceChildren();
  const term=$('supportSearch').value.trim().toLowerCase(),state=$('supportFilter').value;
  const visible=tickets.filter(ticket=>(!state||state===ticket.status)&&[ticket.subject,ticket.id].some(value=>String(value).toLowerCase().includes(term)));
  if(!visible.length)list.append(make('p','No support requests to show.'));
  for(const ticket of visible){
   const button=document.createElement('button');button.type='button';button.className='support-ticket';button.setAttribute('aria-pressed',String(ticket.id===selected));
   button.append(make('span',ticket.subject,true),document.createTextNode(' · '),make('small',labels[ticket.status]||ticket.status));
   button.addEventListener('click',()=>{selected=ticket.id;render();renderDetail();});list.append(button);
  }
 }
 async function load(){try{tickets=await api.list();render();renderDetail();}catch(error){showFeedback(error.message);}}
 async function action(button,work){button.disabled=true;try{await work();await load();}catch(error){showFeedback(error.message);}finally{button.disabled=false;}}
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  action($('contactSubmit'),async()=>{
   const ticket=await api.create(Object.fromEntries(new FormData(form)));selected=ticket.id;
   form.reset();syncCategory();
   showFeedback(api.remote?'Request submitted. You can follow replies below.':'Request saved in local preview. No request has been delivered to a support team.');
  });
 });
 $('supportReply').addEventListener('submit',event=>{
  event.preventDefault();if(!event.currentTarget.reportValidity())return;
  action($('contactReply'),async()=>{
   if(!selected)throw Error('Select a request first.');
   await api.reply(selected,$('replyBody').value);$('supportReply').reset();
   showFeedback(api.remote?'Reply saved.':'Reply saved in local preview.');
  });
 });
 $('supportSearch').addEventListener('input',render);$('supportFilter').addEventListener('change',render);$('supportRefresh').addEventListener('click',load);
 window.addEventListener('storage',event=>{if(event.key==='rafiqSupportTickets')load();});
 new MutationObserver(()=>{render();renderDetail();queueMicrotask(filterAnswers);}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 $('supportNotice').hidden=api.remote;
 if(api.remote){$('contactSubmit').textContent='Submit request';$('contactReply').textContent='Send reply';}
 load();
})();
