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
get('profileAvatar').textContent=Array.from(child.name||'?')[0].toUpperCase();
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
get('profileContent').hidden=false;
}catch(error){get('profileError').textContent=error.message||'We could not load this profile. Please try again.';get('profileError').hidden=false;}
});