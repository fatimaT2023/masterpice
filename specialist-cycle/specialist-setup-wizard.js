/* Guided profile setup, separate from the approved specialist workspace. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const get=id=>document.getElementById(id), form=get('specialistForm');
 const sections=[...form.querySelectorAll(':scope > .form-section')];
 const names=['Personal details','Professional profile','Consultation settings','Review & submit'];
 let step=-1;
 const profile=window.RafiqSpecialistAccess?.profile;
 const registration=window.RafiqSpecialistAccess?.user;
 const draftKey=registration?'rafiqSpecialistDraft_'+registration.id:null;
 get('notificationEmail').value=profile?.notificationEmail||registration?.email||get('email').value;
 if(draftKey&&(!profile||profile.status==='needs_changes')){try{const draft=JSON.parse(localStorage.getItem(draftKey)||'null');if(draft){for(const input of form.querySelectorAll('input,textarea,select')){if(input.type==='file'||input.readOnly)continue;const key=input.id||input.name+':'+input.value;if(Object.hasOwn(draft,key)){if(['checkbox','radio'].includes(input.type))input.checked=!!draft[key];else input.value=draft[key];}}}}catch{}}
 function saveDraft(){if(!draftKey)return;const values={};for(const input of form.querySelectorAll('input,textarea,select')){if(input.type==='file')continue;values[input.id||input.name+':'+input.value]=['checkbox','radio'].includes(input.type)?input.checked:input.value;}try{localStorage.setItem(draftKey,JSON.stringify(values));}catch{}}
 form.addEventListener('input',saveDraft);form.addEventListener('change',saveDraft);
 function summary(){
  const mount=get('setupSummary');mount.replaceChildren();
  const labels={fullName:'Full name',email:'Email address',phone:'Phone number',specialty:'Specialty',experience:'Years of experience',licenseNumber:'Professional license number',qualification:'Main qualification',bio:'Professional bio',sessionFee:'Session fee'};
  function detail(grid,label,value,wide=false){const item=document.createElement('div');item.className='review-detail'+(wide?' review-detail-wide':'');const term=document.createElement('dt'),description=document.createElement('dd');term.textContent=label;description.textContent=value||'Not provided';description.setAttribute('data-user-content','');item.append(term,description);grid.append(item);}
  for(const [index,fields] of [[0,['fullName','email','phone']],[1,['specialty','experience','licenseNumber','qualification','bio']],[2,['sessionFee']]]){
   const row=document.createElement('section'),header=document.createElement('header'),title=document.createElement('h4'),number=document.createElement('span');
   header.className='review-card-heading';number.className='review-card-number';number.textContent=String(index+1).padStart(2,'0');title.textContent=names[index];
   const edit=document.createElement('button');edit.type='button';edit.textContent='Edit details';edit.setAttribute('aria-label','Edit '+names[index].toLowerCase());edit.addEventListener('click',()=>show(index));header.append(number,title,edit);row.append(header);
   const grid=document.createElement('dl');grid.className='review-details';
   for(const id of fields){const input=get(id);let value=input.tagName==='SELECT'?input.selectedOptions[0]?.textContent.trim().replace(/\s+/g,' '):input.value.trim();if(id==='sessionFee'&&value)value+=' JOD';detail(grid,labels[id],value,id==='bio');}
   if(index===2){for(const [name,label] of [['consultationType','Consultation types'],['language','Languages']]){const values=[...form.querySelectorAll('input[name="'+name+'"]:checked')].map(input=>name==='consultationType'?(input.value==='online'?'Online':'In-person'):input.value);detail(grid,label,values.join(' · '));}}
   row.append(grid);
   if(index===1){const docs=document.createElement('div');docs.className='review-documents';for(const [key,label] of [['licenseProof','Professional license'],['qualificationProof','Academic qualification']]){const doc=window.RafiqCredentialProofs?.[key],card=document.createElement('div');card.className='review-document';const icon=document.createElement('span');icon.className='review-document-icon';icon.setAttribute('aria-hidden','true');icon.textContent=doc?'✓':'!';const copy=document.createElement('div'),name=document.createElement('strong'),file=document.createElement('span');name.textContent=label;file.textContent=doc?.name||'No document attached';file.setAttribute('data-user-content','');copy.append(name,file);card.append(icon,copy);docs.append(card);}row.append(docs);}
   mount.append(row);
  }
 }
 function show(index){
  step=index;get('setupWelcome').hidden=true;get('formView').hidden=false;get('setupProgress').hidden=false;get('setupFormHeading').hidden=false;
  get('registrationDetailsNote').hidden=index!==0||!registration;
  sections.forEach((section,i)=>section.hidden=i!==index);
  form.querySelector('.form-actions').hidden=index!==sections.length-1;
  get('setupNext').hidden=index===sections.length-1;get('setupBack').hidden=false;
  get('setupProgress').replaceChildren();
  names.forEach((name,i)=>{const item=document.createElement('span');item.textContent=(i+1)+'. '+name;if(i===index)item.setAttribute('aria-current','step');if(i<index)item.className='is-complete';get('setupProgress').append(item);});
  if(index===sections.length-1)summary();
  const heading=sections[index].querySelector('h3');heading.tabIndex=-1;heading.focus();window.scrollTo({top:0,behavior:'smooth'});
 }
 function next(){if(window.RafiqValidateSpecialistStep?.(sections[step])){saveDraft();show(step+1);}else{const error=[...sections[step].querySelectorAll('.field-error')].find(el=>el.textContent.trim());error?.previousElementSibling?.focus();error?.scrollIntoView({block:'center',behavior:'smooth'});}}
 get('setupBegin').addEventListener('click',()=>show(0));get('setupNext').addEventListener('click',next);
 get('setupBack').addEventListener('click',()=>{saveDraft();if(step>0)show(step-1);else welcome();});
 form.addEventListener('submit',event=>{if(step!==sections.length-1){event.preventDefault();event.stopImmediatePropagation();if(step>=0)next();}else{
  const valid=window.RafiqValidateSpecialistStep?.();if(!valid){event.preventDefault();event.stopImmediatePropagation();const index=sections.findIndex(section=>[...section.querySelectorAll('.field-error')].some(el=>el.textContent.trim()));if(index>=0)show(index);}
 }},true);
 function welcome(){step=-1;get('setupWelcome').hidden=false;get('formView').hidden=true;get('setupProgress').hidden=true;get('successView').hidden=true;}
 function status(){
  const current=(()=>{try{return JSON.parse(localStorage.getItem('rafiqSpecialistProfile')||'null');}catch{return null;}})();
  const state=current?.status||'pending';
  get('setupWelcome').hidden=true;get('setupProgress').hidden=true;get('formView').hidden=true;get('successView').hidden=false;
  const copy=state==='rejected'?['Your application was not approved','Thank you for your interest in joining Rafiq. Your application was not approved. Contact Help Center for clarification about the decision.','Not approved']:state==='suspended'?['Your workspace access is paused','Contact Help Center for assistance with your account status.','Access paused']:['Your application is under review','Thank you for completing your profile. Our administration team will review your professional information. Your workspace will be available after approval.','Pending Review'];
  get('applicationStatusTitle').textContent=copy[0];get('applicationStatusCopy').textContent=copy[1];
  if(state==='rejected'&&current?.rejectionReason){const reason=document.createElement('p');reason.textContent=current.rejectionReason;reason.setAttribute('data-user-content','');get('applicationStatusCopy').after(reason);}get('applicationStatusLabel').textContent=copy[2];
  get('successView').dataset.status=state;
  get('applicationEmail').textContent=(current?.notificationEmail||current?.email||'');
  if(draftKey){try{localStorage.removeItem(draftKey);}catch{}}
 }
 get('setupLogout').addEventListener('click',()=>{sessionStorage.clear();location.assign('../piblic-pages/login.html');});

 document.addEventListener('rafiq:application-submitted',status);
 window.addEventListener('storage',event=>{if(event.key==='rafiqSpecialists')location.reload();});
 if(profile?.status==='needs_changes'){
  const notice=document.createElement('div');notice.className='registration-details-note';
  const title=document.createElement('strong');title.textContent='Please update your application';
  const reason=document.createElement('p');reason.textContent=profile.changesRequestReason||'Contact Help Center for the requested details.';reason.setAttribute('data-user-content','');
  notice.append(title,reason);get('setupWelcome').prepend(notice);get('setupBegin').textContent='Update my application';
 }
 if(profile&&['pending','rejected','suspended'].includes(profile.status))status();else welcome();
});
