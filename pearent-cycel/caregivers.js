document.addEventListener('DOMContentLoaded',()=>{
'use strict';
const api=window.RafiqCaregiverPreview,$=id=>document.getElementById(id),form=$('caregiverInviteForm');
if(!form)return;
let child,ownerId;
function element(tag,text){const el=document.createElement(tag);el.textContent=text;return el;}
function feedback(text){$('caregiverFeedback').textContent=text;}
function render(){
 const list=$('caregiverInvitations');list.replaceChildren();
 const records=api.read().filter(r=>r.ownerId===ownerId&&r.childId===child.id);
 if(!records.length){list.append(element('p','No invitations yet.'));return;}
 records.slice().reverse().forEach(record=>{
  const row=element('article','');row.className='profile-caregiver caregiver-invitation';
  const info=element('div',''),email=element('strong',record.email);email.dataset.userContent='';
  info.append(email,element('p',({mother:'Mother',father:'Father',guardian:'Guardian',other:'Other caregiver'})[record.relationship]),element('p','Shared caregiver access'),element('p',({pending:'Pending',accepted:'Connected',declined:'Declined',cancelled:'Cancelled',expired:'Expired',revoked:'Access removed'})[api.status(record)]));
  row.append(info);
  if(window.RafiqFamily.canManage(child)&&api.status(record)==='accepted'&&record.email!==window.RafiqFamily.user()?.email?.toLowerCase()){
   const remove=element('button','Remove access');remove.type='button';remove.className='screen-flow-secondary';remove.addEventListener('click',()=>{if(!confirm('Remove this caregiver’s access to the child?'))return;try{api.update(record.id,'revoked',ownerId);render();feedback('Caregiver access removed.');}catch(error){feedback(error.message);}});row.append(remove);
  }
  if(window.RafiqFamily.canManage(child)&&api.status(record)==='pending'){
   const actions=element('div','');actions.className='screen-flow-actions';
   const preview=element('a','Preview invitation');preview.className='screen-flow-secondary';preview.target='_blank';preview.rel='noopener';preview.href='../piblic-pages/caregiver-invitation.html?invite='+encodeURIComponent(record.id);
   const cancel=element('button','Cancel invitation');cancel.type='button';cancel.className='screen-flow-secondary';cancel.addEventListener('click',()=>{try{api.update(record.id,'cancelled',ownerId);render();feedback('Invitation cancelled.');}catch(error){feedback(error.message);}});
   actions.append(preview,cancel);row.append(actions);
  }
  list.append(row);
 });
}
try{
 ownerId=window.RafiqSetup.parentOwner();const requested=new URLSearchParams(location.search).get('child')||(window.RafiqFamily ? window.RafiqFamily.selected() : localStorage.getItem('rafiqCurrentChildId'));
 child=window.RafiqSetup.readChildren().find(c=>c.id===requested);
 if(!child)throw Error('Choose a child before inviting a caregiver.');
 ownerId=child.parentId||'legacy-browser';
 const manager=window.RafiqFamily.canManage(child);$('caregiverInviteToggle').hidden=!manager;
 const choices=document.createElement('fieldset'),legend=element('legend','Children included in this invitation');choices.append(legend);
 for(const item of window.RafiqSetup.readChildren().filter(c=>window.RafiqFamily.canManage(c)&&window.RafiqFamily.familyId(c)===window.RafiqFamily.familyId(child))){const label=element('label',''),input=document.createElement('input'),name=element('span',item.name);name.dataset.userContent='';input.type='checkbox';input.name='childIds';input.value=item.id;input.checked=item.id===child.id;label.append(input,name);choices.append(label);}form.prepend(choices);
 $('caregiverInviteToggle').addEventListener('click',()=>{form.hidden=!form.hidden;$('caregiverInviteToggle').setAttribute('aria-expanded',String(!form.hidden));if(!form.hidden)form.elements.email.focus();});
 form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;try{
  const data=Object.fromEntries(new FormData(form));
  let profile={};try{profile=JSON.parse(localStorage.getItem(window.RafiqSetup.parentProfileKey())||'{}')||{};}catch{}
  if(data.email.trim().toLowerCase()===(window.RafiqFamily.user()?.email||profile.email||'').toLowerCase())throw Error('Enter the other caregiver’s email address.');
  const ids=[...form.querySelectorAll('[name="childIds"]:checked')].map(input=>input.value);if(!ids.length)throw Error('Select at least one child.');
  const groupId=crypto.randomUUID();let created=0;
  for(const id of ids){const target=window.RafiqFamily.child(id);if(!window.RafiqFamily.canManage(target))throw Error('Only the primary caregiver can invite or remove caregivers.');if(api.read().some(r=>r.childId===id&&r.email===data.email.trim().toLowerCase()&&['accepted','pending'].includes(api.status(r))))continue;api.create({...data,groupId,childId:id,childName:target.name||'Your child',ownerId:target.parentId||'legacy-browser'});created++;}
  if(!created)throw Error('The selected children already have a pending or accepted invitation for this email.');render();form.reset();form.hidden=true;$('caregiverInviteToggle').setAttribute('aria-expanded','false');feedback('Preview invitation created. No email was sent.');
 }catch(error){feedback(error.message);}});
 window.addEventListener('focus',()=>{try{render();}catch(error){feedback(error.message);}});
 window.addEventListener('storage',event=>{if(event.key==='rafiqCaregiverInvitationsPreview')try{render();}catch(error){feedback(error.message);}});
 render();
}catch(error){feedback(error.message);$('caregiverInviteToggle').disabled=true;}
});
