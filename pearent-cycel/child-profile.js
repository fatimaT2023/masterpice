document.addEventListener('DOMContentLoaded',()=>{
'use strict';
const get=id=>document.getElementById(id);
try{
const children=window.RafiqSetup.readChildren(),requested=new URLSearchParams(location.search).get('child');
const selected=requested||(window.RafiqFamily ? window.RafiqFamily.selected() : localStorage.getItem('rafiqCurrentChildId'));
const child=children.find(item=>item.id===selected)||(!selected?children[0]:null);
if(!child)throw Error('This child profile could not be found. Choose a child using the arrow beside the child’s name.');
(window.RafiqFamily ? window.RafiqFamily.select(child.id) : localStorage.setItem('rafiqCurrentChildId',child.id));
const context=window.RafiqSetup.childContext(child);
get('profileName').textContent=child.name||'Your child';
window.RafiqChildAvatar.render(get('profileAvatar'),child);
get('changeChildPhoto').onclick=()=>window.RafiqChildAvatar.pick(window.RafiqFamily.child(child.id)||child,updated=>window.RafiqChildAvatar.render(get('profileAvatar'),updated));
document.addEventListener('rafiq-child-change',()=>{const updated=window.RafiqSetup.readChildren().find(c=>c.id===child.id);if(updated)window.RafiqChildAvatar.render(get('profileAvatar'),updated);});
get('profileAge').textContent=window.RafiqSetup.formatAge(context.chronological)||'Review date of birth';
get('editChildProfile').href='onboarding.html?edit='+encodeURIComponent(child.id)+'&return=profile';
const date=value=>{if(!window.RafiqSetup.ageFromBirth(value,new Date(9999,11,31)))return 'Not provided';return new Date(value+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});};
const early={yes:'Yes',no:'No',unknown:'Not sure'};
const details={'Date of birth':date(child.dateOfBirth||child.dob||child.birthDate),'Your relationship':({mother:'Mother',father:'Father',guardian:'Guardian',other:'Other'})[child.relationship]||'Not provided','Gender':({male:'Male',female:'Female',boy:'Boy',girl:'Girl'})[child.gender]||'Not provided','Born before the expected due date':early[child.bornBeforeDueDate]||'Not provided'};
if(child.bornBeforeDueDate==='yes'){details['Expected due date']=date(child.expectedDueDate);if(context.basis==='corrected')details['Adjusted age for development']=window.RafiqSetup.formatAge(context.development);}
Object.entries(details).forEach(([label,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;get('childDetails').append(dt,dd);});
// Use only this account's profile; an invalid optional profile must not hide the child.
const managerId=child.primaryManagerId||child.parentId||'legacy-browser';
let caregiverProfile={};
try{const saved=JSON.parse(localStorage.getItem('rafiqParentProfile_'+managerId)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))caregiverProfile=saved;}catch{}
if(!caregiverProfile.name)caregiverProfile.name=window.RafiqFamily.user(managerId)?.fullName;
get('caregiverName').textContent=typeof caregiverProfile.name==='string'&&caregiverProfile.name.trim()?caregiverProfile.name:'Your account';
get('caregiverRelationship').textContent=({mother:'Mother',father:'Father',guardian:'Guardian',other:'Other caregiver'})[managerId===child.parentId?window.RafiqFamily.child(child.id)?.relationship:window.RafiqFamily.link(window.RafiqFamily.child(child.id),managerId)?.relationship]||'Relationship not provided';
get('caregiverRole').textContent=child.responsibilityHold?'Primary caregiver follow-up required':'Primary caregiver';
window.RafiqChildProfileHealth.render(child);
const sections=[...get('profileContent').children].filter(el=>el.tagName==='SECTION');
const layout=document.createElement('div'),main=document.createElement('div'),side=document.createElement('aside');
layout.className='child-profile-layout';main.className='child-profile-main';side.className='child-profile-side';
sections[0].after(layout);layout.append(main,side);
// sections[0] is hero; sections[1]=About, sections[2]=Measurements, sections[3]=Health, sections[4]=Open records
main.append(sections[1],sections[2],sections[3]);
const careMount=document.createElement('div');careMount.id='childCareTeamMount';
side.append(careMount,sections[4]);
const detailList=get('childDetails');for(const dt of [...detailList.querySelectorAll('dt')]){const dd=dt.nextElementSibling,row=document.createElement('div');row.append(dt,dd);detailList.append(row);}
const story=sections[4];
if(story){
  story.querySelector('h2').textContent='Open records';story.querySelector('p')?.remove();
  const symbols=['↗','+','▤','♡','?','⌂'];story.querySelectorAll('a').forEach((link,index)=>{const icon=document.createElement('span');icon.className='profile-record-icon';icon.textContent=symbols[index]||'↗';icon.setAttribute('aria-hidden','true');link.prepend(icon);});
}
if(get('profileWeight').textContent==='Not recorded yet'&&get('profileHeight').textContent==='Not recorded yet'){
 const grid=sections[2]?.querySelector('.profile-measurement-grid');
 if(grid){
   grid.hidden=true;
   const empty=document.createElement('div');empty.className='profile-measurement-empty';const link=document.createElement('a');link.href='health.html';link.className='screen-flow-secondary';link.textContent='Add first measurement';empty.append(link);grid.after(empty);
 }
}
const invitations=get('caregiverInvitations');
function compactInvitations(){
  if(!invitations)return;
  for(const row of invitations.querySelectorAll('.caregiver-invitation:not([data-compact])')){
    row.dataset.compact='true';
    const info=row.firstElementChild;
    if(info)info.classList.add('caregiver-invitation-info');
    const lines=info?[...info.querySelectorAll('p')]:[];
    const status=lines.pop();
    lines.forEach(line=>line.remove());
    
    const metaGroup=document.createElement('div');
    metaGroup.className='caregiver-invitation-meta';
    
    if(status){
      status.className='caregiver-status-pill';
      const stText=(status.textContent||'').trim().toLowerCase();
      if(stText.includes('connect')||stText.includes('متصل')||stText.includes('accept')){
        status.classList.add('status-connected');
      }else if(stText.includes('remov')||stText.includes('أزيل')||stText.includes('إزالة')||stText.includes('declin')||stText.includes('cancel')){
        status.classList.add('status-removed');
      }else if(stText.includes('pend')||stText.includes('انتظار')){
        status.classList.add('status-pending');
      }
      metaGroup.append(status);
    }
    
    for(const button of row.querySelectorAll('button')){
      button.setAttribute('aria-label',button.textContent);
      button.title=button.textContent;
      button.classList.remove('screen-flow-secondary');
      button.classList.add('caregiver-icon-action');
      button.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      metaGroup.append(button);
    }
    
    for(const link of row.querySelectorAll('a')){
      link.setAttribute('aria-label',link.textContent);
      link.title=link.textContent;
      link.classList.remove('screen-flow-secondary');
      link.classList.add('caregiver-icon-action');
      link.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';
      metaGroup.append(link);
    }
    
    const oldActions=row.querySelector('.screen-flow-actions');
    if(oldActions)oldActions.remove();
    row.append(metaGroup);
  }
}
if(invitations){new MutationObserver(compactInvitations).observe(invitations,{childList:true,subtree:true});compactInvitations();}

// Caregivers modal dialog wiring
const caregiversModal=get('caregiversModal');
const openModalBtn=get('openCaregiversModal');
const closeModalBtn=get('closeCaregiversModal');
if(caregiversModal&&openModalBtn){
  openModalBtn.addEventListener('click',()=>caregiversModal.showModal());
}
if(caregiversModal&&closeModalBtn){
  closeModalBtn.addEventListener('click',()=>caregiversModal.close());
}
if(caregiversModal){
  caregiversModal.addEventListener('click',event=>{
    const card=caregiversModal.querySelector('.caregivers-dialog-card');
    if(card&&!card.contains(event.target)){
      caregiversModal.close();
    }
  });
}

get('profileContent').hidden=false;
}catch(error){get('profileError').textContent=error.message||'We could not load this profile. Please try again.';get('profileError').hidden=false;}
});
