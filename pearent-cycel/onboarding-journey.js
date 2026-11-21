/* Phase 1 onboarding: three short visual screens over the existing child form.
   onboarding.js still owns saving, editing, quota checks and the story hand-off;
   this file only paces the form, mirrors choices into the original fields and
   draws the live child card. No child data is written here. */
(() => {
 'use strict';
 // New copy only; existing labels and validation messages already live in shared/site-ar.js.
 Object.assign(window.RafiqHomeArabic=window.RafiqHomeArabic||{},{
  'Your child':'طفلكم','Your child’s story':'حكاية طفلكم','How Rafiq helps':'كيف بساعدكم رفيق',
  'A LITTLE INTRODUCTION':'تعارف صغير','your child.':'طفلكم.',
  // shared/site-ar.js holds a corrupted ("????") copy of this sentence; the parent page supplies a readable one.
  'Free includes 1 child profile. Plus supports up to 5. Existing profiles and records remain accessible after a plan ends.':'الخطة المجانية بتشمل ملف طفل واحد، وPlus لحد ٥ أطفال. الملفات والسجلات الموجودة بتضل متاحة بعد ما تنتهي الخطة.',
  'Three quick screens. You can change anything later.':'ثلاث شاشات سريعة. بتقدروا تغيّروا أي إشي بعدين.',
  'Name':'الاسم','Birthday':'الميلاد','You':'أنتم',
  'Who are we meeting?':'مين رح نتعرّف عليه؟','Girl or boy?':'بنت ولا ولد؟','Girl':'بنت','Boy':'ولد',
  'Optional. It sets the pink or blue look of your child’s space.':'اختياري. بيحدّد إذا مساحة طفلكم وردية ولا زرقاء.',
  'When was your child born?':'إمتى انولد طفلكم؟','On time':'بموعده','Early':'قبل موعده','Not sure':'مش متأكدين',
  'And you are…':'وأنتم…','Father':'الأب','Back':'رجوع','Next':'التالي',
  'Next: your child’s story':'الجاية: حكاية طفلكم',
  'Add a birthday to see their age':'ضيفوا تاريخ الولادة لنشوف العمر',
  'Details so far':'التفاصيل لهلأ','Born early':'انولد قبل موعده','Born on time':'انولد بموعده',
  'STEP 2 OF 3':'الخطوة ٢ من ٣',
  'Short topics, one question at a time. Skip anything you prefer not to answer.':'مواضيع قصيرة، سؤال بكل مرة. تخطّوا أي سؤال ما بتحبّوا تجاوبوا عليه.',
  'Saved as you go. You can finish any time from your child’s profile.':'كل إجابة بتنحفظ لحالها. بتقدروا تكمّلوا بأي وقت من ملف طفلكم.',
  'Your relationship to the child':'صلتكم بالطفل','Was your child born before their due date?':'طفلكم انولد قبل موعده؟',
  'Please use 80 characters or fewer.':'استخدموا ٨٠ حرف أو أقل.'
 });
 document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('childForm');if(!form||!form.querySelector('.basics-page'))return;
  const get=id=>document.getElementById(id),pages=[...form.querySelectorAll('.basics-page')],tabs=[...document.querySelectorAll('#basicsTabs button')];
  const name=get('childName'),dob=get('dateOfBirth'),relationship=get('relationship'),early=get('bornBeforeDueDate'),due=get('expectedDueDate');
  // Text is written in English; shared/site-language.js translates new text nodes.
  // Ages are the exception: the shared translator handles only two units, so both
  // age labels are formatted here in the page language.
  let current=0,reached=0;
  const arabic=()=>document.documentElement.lang==='ar';
  function ageLabel(age){
   const ar=arabic(),parts=[[age.years,'year','سنة','سنتين','سنوات'],[age.months,'month','شهر','شهرين','أشهر'],[age.days,'day','يوم','يومين','أيام']].filter(([n])=>n).map(([n,en,one,two,many])=>ar?(n===1?one:n===2?two:new Intl.NumberFormat('ar').format(n)+' '+(n<=10?many:one)):n+' '+en+(n===1?'':'s'));
   return parts.length?parts.join(ar?' و':', '):(ar?'أقل من يوم':'Under one day');
  }
  for(const id of ['previewAge','ageText'])get(id)?.setAttribute('data-no-translate','');
  // Move the plan note next to the save button, where the one-child limit matters.
  function placeNote(){const note=document.querySelector('.membership-access-note');if(note&&!pages[2].contains(note))get('formStatus').before(note);}
  placeNote();window.addEventListener('load',placeNote);
  // Clear a field's error as soon as its value becomes valid.
  name.addEventListener('input',()=>{if(get('nameField').classList.contains('has-error')&&name.value.trim()&&name.value.trim().length<=80)setError('nameField','nameError','');});
  dob.addEventListener('input',()=>{if(get('dobField').classList.contains('has-error')&&window.RafiqSetup.ageFromBirth(dob.value))setError('dobField','dobError','');});

  // Family workspace only matters when the parent belongs to more than one family.
  const workspace=get('childFamily')?.closest('label');
  if(workspace){const help=workspace.nextElementSibling?.classList.contains('screen-flow-small')?workspace.nextElementSibling:null;
   if(get('childFamily').options.length<2){workspace.hidden=true;if(help)help.hidden=true;}
   else{const host=pages[2].querySelector('#relationshipField');workspace.classList.add('workspace-field');host.after(workspace);if(help)workspace.after(help);}}

  // Card choices mirror the original selects, so onboarding.js reads the same values.
  function syncCards(){
   for(const input of form.querySelectorAll('input[name="bornEarlyChoice"]'))input.checked=input.value===early.value;
   for(const input of form.querySelectorAll('input[name="relationshipChoice"]'))input.checked=input.value===relationship.value;
  }
  form.addEventListener('change',event=>{
   const t=event.target;
   if(t.name==='bornEarlyChoice'){early.value=t.value;early.dispatchEvent(new Event('change',{bubbles:true}));}
   if(t.name==='relationshipChoice'){relationship.value=t.value;relationship.dispatchEvent(new Event('change',{bubbles:true}));setError('relationshipField','relationshipError','');}
   if(t.name==='gender')setError('genderField','genderError','');
   preview();
  });

  function setError(fieldId,errorId,text){const field=get(fieldId),error=get(errorId);field.classList.toggle('has-error',!!text);error.textContent=text;const control=errorId==='dueDateError'?due:fieldId==='relationshipField'?form.querySelector('input[name="relationshipChoice"]'):field.querySelector('input,select');control?.setAttribute('aria-invalid',String(!!text));return text?control:null;}
  // Same rules and wording as onboarding.js, checked one screen at a time.
  function check(page){
   const S=window.RafiqSetup,problems=[];
   if(page===0){const value=name.value.trim();problems.push(setError('nameField','nameError',!value?'Please enter your child’s first name.':value.length>80?'Please use 80 characters or fewer.':''));}
   if(page===1){const age=S.ageFromBirth(dob.value);problems.push(setError('dobField','dobError',!age?'Please enter a valid date of birth that is not in the future.':!S.isSupported(age)?'Rafiq currently supports children from birth until their seventh birthday.':''));
    const badDue=early.value==='yes'&&due.value&&(!S.ageFromBirth(due.value,new Date(9999,11,31))||due.value<=dob.value);problems.push(setError('prematurityField','dueDateError',badDue?'Please enter the expected due date given by your care team, after the date of birth.':''));}
   if(page===2)problems.push(setError('relationshipField','relationshipError',!['mother','father','guardian','other'].includes(relationship.value)?'Please select your relationship to the child.':''));
   const first=problems.find(Boolean);if(first){first.focus();return false;}return true;
  }
  function go(target,{focus=true}={}){
   current=Math.max(0,Math.min(pages.length-1,target));reached=Math.max(reached,current);
   pages.forEach((page,i)=>{page.hidden=i!==current;});
   tabs.forEach((tab,i)=>{tab.closest('li').className=i<current?'is-done':i===current?'is-current':'';if(i===current)tab.setAttribute('aria-current','step');else tab.removeAttribute('aria-current');tab.disabled=i>reached;});
   document.documentElement.dataset.basicsPage=String(current);
   if(focus){const title=pages[current].querySelector('.page-title');title?.focus({preventScroll:true});if(window.innerWidth<900)form.closest('.form-card').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
  }
  form.addEventListener('click',event=>{
   if(event.target.closest('[data-next]')){event.preventDefault();if(check(current))go(current+1);}
   if(event.target.closest('[data-back]')){event.preventDefault();go(current-1);}
  });
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{if(i<=current){go(i);return;}for(let p=current;p<i;p++){if(!check(p)){go(p,{focus:false});check(p);return;}}go(i);}));
  // Enter on an earlier screen moves forward instead of saving half a profile.
  form.addEventListener('submit',event=>{
   if(current<pages.length-1){event.preventDefault();event.stopImmediatePropagation();if(check(current))go(current+1);return;}
   for(let p=0;p<pages.length;p++){if(!check(p)){event.preventDefault();event.stopImmediatePropagation();go(p,{focus:false});check(p);return;}}
  },true);

  // Live card: the child takes shape on the left while the parent answers.
  function chip(text,kind){const li=document.createElement('li');li.className='preview-chip '+kind;li.textContent=text;return li;}
  function preview(){
   const value=name.value.trim(),gender=form.querySelector('input[name="gender"]:checked')?.value;
   get('previewName').textContent=value;get('previewName').hidden=!value;get('previewNameEmpty').hidden=!!value;
   const age=window.RafiqSetup.ageFromBirth(dob.value),previewAge=get('previewAge');
   if(age){previewAge.setAttribute('data-no-translate','');previewAge.textContent=ageLabel(age);get('ageText').textContent=ageLabel(age);}
   else{previewAge.removeAttribute('data-no-translate');previewAge.textContent='Add a birthday to see their age';}
   const chips=get('previewChips');chips.replaceChildren();
   if(gender)chips.append(chip(gender==='female'?'Girl':'Boy','is-gender'));
   if(early.value==='yes')chips.append(chip('Born early','is-birth'));else if(early.value==='no')chips.append(chip('Born on time','is-birth'));
   const role={mother:'Mother',father:'Father',guardian:'Guardian',other:'Other caregiver'}[relationship.value];if(role)chips.append(chip(role,'is-role'));
   chips.hidden=!chips.children.length;
  }
  name.addEventListener('input',preview);dob.addEventListener('input',preview);
  new MutationObserver(preview).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  // Returning from the story keeps the parent on the last basics screen.
  document.addEventListener('rafiq:basics-reopen',()=>go(pages.length-1,{focus:false}));
  syncCards();preview();
  // Editing an existing profile can move freely; a new profile unlocks screens in order.
  if(new URLSearchParams(location.search).has('edit')&&name.value)reached=pages.length-1;
  go(0,{focus:false});
 });
})();
