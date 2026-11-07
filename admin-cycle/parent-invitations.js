/* Registration-link preparation only; no account creation or email sending. */
(()=>{'use strict';
 const get=id=>document.getElementById(id),form=get('parentInviteForm');if(!form)return;
 const dialog=get('parentInviteDialog'),open=get('openParentInvite');
 if(dialog&&open){
  open.addEventListener('click',()=>{if(!dialog.open){dialog.showModal();get('inviteName').focus();}});
  get('closeParentInvite').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>open.focus());
 }
 const input=get('invitePublicUrl'),status=get('inviteStatus'),preview=get('invitePreview'),message=get('inviteMessage'),draft=get('inviteEmailDraft');
 const hosted=['https:','http:'].includes(location.protocol)&&!['localhost','127.0.0.1','[::1]'].includes(location.hostname);
 if(hosted)input.value=new URL('../piblic-pages/register.html?role=parent',location.href).href;input.required=true;
 form.addEventListener('submit',event=>{
  event.preventDefault();if(sessionStorage.getItem('rafiqRole')!=='admin')return;if(!form.reportValidity())return;
  preview.hidden=false;draft.hidden=true;draft.removeAttribute('href');get('copyInvite').disabled=true;message.value='';
  try{
   const name=get('inviteName').value.trim(),email=get('inviteEmail').value.trim().toLowerCase();if(!name)throw Error('Enter the parent’s name.');
   const url=new URL(input.value);if(!['https:','http:'].includes(url.protocol)||url.username||url.password||['localhost','127.0.0.1','[::1]','0.0.0.0'].includes(url.hostname)||url.hostname.endsWith('.local'))throw Error('Use the public registration link, not a localhost address.');
   const users=JSON.parse(localStorage.getItem('rafiqUsers')||'[]');if(!Array.isArray(users))throw Error('The account directory could not be read.');
   const existing=users.find(u=>u?.role==='parent'&&u.email?.toLowerCase()===email);if(existing)throw Error(window.RafiqAccountStatus.inactive(existing)?'This parent account is inactive. Reactivate it from the directory instead of sending a new invitation.':'This parent is already registered. Find their account in the directory.');
   message.value='Hello '+name+',\n\nYou are invited to join RAFIQ as a parent.\nCreate your account here: '+url.href+'\n\nChoose Parent and set your own password.\n\nThe RAFIQ team';
   draft.href='mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent('Your invitation to join RAFIQ')+'&body='+encodeURIComponent(message.value);draft.hidden=false;get('copyInvite').disabled=false;get('inviteHostingNote').hidden=true;status.textContent='Invitation prepared. Nothing has been sent and no account has been created.';
  }catch(error){status.textContent=error.message;}
 });
 form.addEventListener('input',()=>{preview.hidden=true;draft.removeAttribute('href');});
 get('copyInvite').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message.value);status.textContent='Invitation copied. You can share it with the parent.';}catch{message.focus();message.select();status.textContent='Select and copy the invitation message manually.';}});
})();
