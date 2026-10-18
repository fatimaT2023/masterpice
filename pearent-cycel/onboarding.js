document.addEventListener('DOMContentLoaded', () => {
'use strict';
const {ageFromBirth,formatAge,readChildren}=window.RafiqSetup;
const get=id=>document.getElementById(id);
const form=get('childForm'), name=get('childName'), dob=get('dateOfBirth'), relationship=get('relationship'), button=get('createButton'), status=get('formStatus');
const today=new Date();
const earliest=new Date(today.getFullYear()-7,today.getMonth(),today.getDate()+1);dob.min=[earliest.getFullYear(),String(earliest.getMonth()+1).padStart(2,'0'),String(earliest.getDate()).padStart(2,'0')].join('-');
dob.max=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
let profileId=null, savedProfile=null;
function message(text){status.textContent=text;status.className='form-status'+(text?' show error':'');}
function field(id,error,text){get(id).classList.toggle('has-error',!!text);get(error).textContent=text;const input=get(id).querySelector('input,select');input.setAttribute('aria-invalid',String(!!text));return !text;}
function preview(){
 const value=name.value.trim();get('avatarInitial').textContent=value?Array.from(value)[0].toUpperCase():'+';get('avatarPreview').classList.toggle('has-name',!!value);
 const age=ageFromBirth(dob.value);get('agePreview').hidden=!age;get('ageText').textContent=age?formatAge(age):'';
}
const bornEarly=get('bornBeforeDueDate'),due=get('expectedDueDate');
function syncDueDate(){get('dueDateField').hidden=bornEarly.value!=='yes';due.min=dob.value;}
bornEarly.addEventListener('change',syncDueDate);dob.addEventListener('input',syncDueDate);
const editId=new URLSearchParams(location.search).get('edit');
if(editId){try{savedProfile=readChildren().find(child=>child.id===editId);if(!savedProfile)throw new Error('Missing profile');profileId=savedProfile.id;bornEarly.value=savedProfile.bornBeforeDueDate||'unknown';due.value=savedProfile.expectedDueDate||'';syncDueDate();name.value=savedProfile.name||'';dob.value=savedProfile.dateOfBirth||'';relationship.value=savedProfile.relationship||'';form.querySelectorAll('input[name="gender"]').forEach(input=>input.checked=input.value===(savedProfile.gender||''));preview();}catch{message('We couldn’t load this child’s details. Please return to your child’s profile and try again.');button.disabled=true;return;}}
if(editId&&new URLSearchParams(location.search).get('return')==='profile'){button.textContent='Save changes';const heading=document.querySelector('h1');if(heading)heading.textContent='Edit child details';}
name.addEventListener('input',preview);dob.addEventListener('input',preview);
form.addEventListener('submit',event=>{
 event.preventDefault();if(button.disabled)return;message('');
 const age=ageFromBirth(dob.value);
 const validName=field('nameField','nameError',!name.value.trim()?'Please enter your child’s first name.':name.value.trim().length>80?'Please use 80 characters or fewer.':'');
 const validDob=field('dobField','dobError',!age?'Please enter a valid date of birth that is not in the future.':!window.RafiqSetup.isSupported(age)?'Rafiq currently supports children from birth until their seventh birthday.':'');
 const validRelationship=field('relationshipField','relationshipError',!['mother','father','guardian','other'].includes(relationship.value)?'Please select your relationship to the child.':'');
 const dueProvided=bornEarly.value==='yes'&&due.value;
 const validDue=field('prematurityField','dueDateError',dueProvided&&(!window.RafiqSetup.ageFromBirth(due.value,new Date(9999,11,31))||due.value<=dob.value)?'Please enter the expected due date given by your care team, after the date of birth.':'');
 bornEarly.setAttribute('aria-invalid','false');due.setAttribute('aria-invalid',String(!validDue));
 if(!validName||!validDob||!validRelationship||!validDue){form.querySelector('[aria-invalid="true"]').focus();return;}
 button.disabled=true;button.textContent='Saving…';form.setAttribute('aria-busy','true');
 try{
 const children=readChildren();profileId=profileId||('child_'+(globalThis.crypto?.randomUUID?.()||Date.now()+'_'+Math.random().toString(36).slice(2)));
 const child={...savedProfile,id:profileId,name:name.value.trim(),dateOfBirth:dob.value,relationship:relationship.value,gender:form.querySelector('input[name="gender"]:checked')?.value||'',ageBandId:window.RafiqSetup.bandForAge(age).id,ageProfileVersion:2,bornBeforeDueDate:bornEarly.value,expectedDueDate:bornEarly.value==='yes'?due.value:'',createdAt:savedProfile?.createdAt||new Date().toISOString()};
 const index=children.findIndex(item=>item.id===profileId);if(index<0)children.push(child);else children[index]=child;
 localStorage.setItem('rafiqChildren',JSON.stringify(children));
 localStorage.setItem('rafiqCurrentChildId',child.id);
 if(!editId||new URLSearchParams(location.search).get('return')!=='profile')localStorage.setItem('rafiqSetupPendingChildId',child.id);
 localStorage.setItem('rafiqParentOnboardingComplete','true');
 location.assign(editId&&new URLSearchParams(location.search).get('return')==='profile'?'child-profile.html?child='+encodeURIComponent(child.id):'getting-started.html?child='+encodeURIComponent(child.id));
 }catch{message('We couldn’t save the profile in this browser. Check that browser storage is available, then try again.');button.disabled=false;button.textContent='Continue';form.setAttribute('aria-busy','false');}
});
});
