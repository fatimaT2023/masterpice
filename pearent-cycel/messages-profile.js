/* Public specialist information from the active conversation only. */
document.addEventListener('DOMContentLoaded',()=>{
  const trigger=document.getElementById('conversationName'),api=window.RafiqDirectMessages;
  if(!trigger||document.body.dataset.messagingRole!=='parent'||!api)return;
  let current=null;
  window.addEventListener('rafiq:conversation',event=>{
    current=event.detail.threadId?api.list(event.detail.viewer).find(t=>t.id===event.detail.threadId):null;
  });
  const make=(tag,text,user=false)=>{const node=document.createElement(tag);if(text!=null)node.textContent=String(text);if(user)node.dataset.userContent='';return node;};
  const dialog=make('dialog');dialog.id='conversationProfileDialog';dialog.className='conversation-profile-dialog';dialog.setAttribute('aria-labelledby','conversationProfileTitle');
  document.body.append(dialog);
  trigger.addEventListener('click',()=>{
    if(!current)return;
    const profile=api.specialists().find(p=>p.id===current.specialistId);
    dialog.replaceChildren();
    const heading=make('div');heading.className='conversation-profile-dialog-heading';
    const title=make('h2',profile?.fullName||current.specialistName,true);title.id='conversationProfileTitle';
    const close=make('button','×');close.type='button';close.setAttribute('aria-label','Close profile');close.addEventListener('click',()=>dialog.close());
    heading.append(title,close);dialog.append(heading);
    if(profile){
      if(profile.specialty)dialog.append(make('p',profile.specialty,true));
      if(profile.bio)dialog.append(make('p',profile.bio,true));
      const list=make('dl');
      for(const [label,value] of [['Experience',profile.experience!=null?profile.experience+' years':null],['Languages',Array.isArray(profile.languages)?profile.languages.join(', '):profile.languages],['Session fee',profile.price!=null?profile.price+' '+(profile.currency||'JOD'):null]]){
        if(value){list.append(make('dt',label),make('dd',value));}
      }
      dialog.append(list);
      const link=make('a','View full specialist profile');link.href='specialists.html?specialist='+encodeURIComponent(profile.id);link.className='journey-link';dialog.append(link);
    }else dialog.append(make('p','This specialist profile is not currently available.'));
    dialog.showModal();
  });
  dialog.addEventListener('close',()=>trigger.focus());
});
