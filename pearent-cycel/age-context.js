/* Shared age context. Existing records remain intact when content coverage changes. */
(() => {
'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const page=location.pathname.split('/').pop();
 if(['onboarding.html','getting-started.html','screening.html','milestones.html','health.html','child-profile.html'].includes(page))return;
 let child,context;
 try{const children=window.RafiqSetup.readChildren();child=children.find(item=>item.id===localStorage.getItem('rafiqCurrentChildId'))||children[0];if(!child)return;context=window.RafiqSetup.childContext(child);}catch{return;}
 if(page==='parent-dashboard.html'&&context.supported)return;
 const main=document.querySelector('main');if(!main)return;
 const notice=document.createElement('section');notice.className='rafiq-age-context';notice.setAttribute('aria-label','Your child’s age context');
 const title=document.createElement('strong');title.textContent=context.supported?(context.band?.label||'Your child’s development age'):'Rafiq currently focuses on ages 0–6';
 const detail=document.createElement('p');detail.textContent=context.supported?'Age today: '+window.RafiqSetup.formatAge(context.chronological)+'. '+(context.basis==='corrected'?'Development resources use corrected age: '+window.RafiqSetup.formatAge(context.development)+'. Health records and appointment details use age from date of birth.':context.beforeDueDate?'The expected due date has not arrived. No developmental checklist is selected.':context.needsDueDate?'Add the expected due date to use corrected age for development resources.':'Content availability depends on the age range of each resource.'): 'Personalized age-based content is available from birth until the seventh birthday. Existing records, appointments, payments and reports remain accessible.';
 notice.append(title,detail);
 const edit=document.createElement('a');edit.href='onboarding.html?edit='+encodeURIComponent(child.id);edit.textContent='Review child details';notice.append(edit);
 const header=main.querySelector('header');if(header)header.after(notice);else main.prepend(notice);
 const gated=['milestones.html','challenges.html','screening.html'].includes(page);
 if(!gated)return;
 document.body.classList.add('age-content-gated','age-page-'+page.split('.')[0]);
 const panel=document.createElement('section');panel.className='rafiq-age-panel';
 const heading=document.createElement('h2');heading.textContent=page==='milestones.html'?'Growth observations, at your child’s pace':page==='challenges.html'?'Activities matched to your child’s stage':'Development questions for the right age';
 const explanation=document.createElement('p');explanation.textContent=!context.supported?'This child is outside the current age range. You can still access their saved records and specialist support.':page==='screening.html'?'An age-validated developmental screening tool has not been configured for this stage. The earlier demo questions do not provide a reliable screening result. You can discuss your observations with a specialist.':page==='challenges.html'?'Age-specific activities for this stage are being prepared for review. We won’t show a different age group’s activities in their place. You can save an observation or ask for support.':'Keep your own observations here. The earlier broad age-group templates are not used to assess your child. Where available, an original CDC checklist is linked below.';
 panel.append(heading,explanation);
 if(page==='screening.html'){
 heading.textContent='Screening options for '+(child.name||'your child');
 explanation.textContent='We check your child’s age and the available tool before starting. A milestone checklist or a saved concern is not a developmental screening result.';
 const steps=document.createElement('ol');steps.className='rafiq-screening-steps';
 for(const text of ['Confirm your child and age','Check screening availability','Complete questions and review next steps, when a suitable tool is available']){const step=document.createElement('li');step.textContent=text;steps.append(step);}panel.append(steps);
 const availability=document.createElement('div');availability.className='rafiq-screening-availability';availability.setAttribute('role','status');
 const statusTitle=document.createElement('strong');statusTitle.textContent=context.supported?'No screening tool is available for this age in Rafiq yet':'This age is outside Rafiq’s current screening coverage';
 const statusCopy=document.createElement('p');statusCopy.textContent=context.supported?'No validated, age-appropriate English screening tool has been configured in this preview. There are no screening questions to start and no screening result will be generated. You can save your concern below or speak directly to a specialist.':'Your existing records and appointments remain accessible. A specialist can advise on an appropriate assessment.';
 availability.append(statusTitle,statusCopy);panel.append(availability);
 if(context.supported){const record=document.createElement('a');record.href='#ageObservation';record.className='rafiq-record-concern';record.textContent='Record my concern ↓';panel.append(record);}
 }

 const resource=window.RafiqAgeContent.milestoneResource(context);
 if(resource){const box=document.createElement('div');box.className='rafiq-age-resource';const label=document.createElement('strong');label.textContent=(page==='screening.html'?'Optional milestone resource — not a screening test: ':'')+resource.title;const description=document.createElement('p');description.textContent='This is the most recent CDC checklist age reached by your child, not a checklist created for every month. Use it to organize observations, not as a diagnosis or a screening score.';const source=document.createElement('a');source.href=resource.source.url;source.target='_blank';source.rel='noopener noreferrer';source.textContent='Open the original CDC checklist ↗';box.append(label,description,source);panel.append(box);}
 else if(context.supported){const gap=document.createElement('p');gap.textContent=context.needsDueDate?'Add the expected due date or discuss the right developmental checklist with your child’s clinician.':context.beforeDueDate?'No checklist is selected before the expected due date.':context.development?.totalMonths<2?'CDC milestone checklists start at 2 months. We do not apply the 2-month checklist to a younger baby.':'No original checklist has been selected for this age. Discuss age-specific questions with your child’s clinician.';panel.append(gap);}
 const support=document.createElement('div');support.className='rafiq-age-actions';for(const [href,label] of [['specialists.html','Find a specialist'],['health.html','Open health records'],['ai-assistant.html','Ask Rafiq']]){const link=document.createElement('a');link.href=href;link.textContent=label;support.append(link);}panel.append(support);
 notice.after(panel);
 // A parent-authored note is a record, not a scored milestone or validated screening answer.
 const journal=document.createElement('section');journal.className='rafiq-age-panel';const journalTitle=document.createElement('h2');journalTitle.textContent=page==='screening.html'?'Tell us what concerns you':'What have you noticed?';
 const form=document.createElement('form');const label=document.createElement('label');label.htmlFor='ageObservation';label.textContent=page==='screening.html'?'What have you noticed, and when did it start?':'A moment, a question, or something you want to remember';const input=document.createElement('textarea');input.id='ageObservation';input.rows=3;input.maxLength=2000;input.required=true;input.placeholder='Write an observation in your own words…';const button=document.createElement('button');button.type='submit';button.textContent=page==='screening.html'?'Save my concern':'Save observation';const status=document.createElement('p');status.setAttribute('role','status');const list=document.createElement('div');list.className='rafiq-age-notes';form.append(label,input,button,status);journal.append(journalTitle,form,list);panel.after(journal);
 if(!context.supported){form.hidden=true;button.disabled=true;journalTitle.textContent='Your saved observations';}
 const key='rafiqAgeObservations_'+child.id;let notes=[];
 function read(){const saved=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(saved))throw Error('Invalid observations');return saved.filter(item=>item&&typeof item.text==='string');}
 function render(){list.replaceChildren();notes.slice().reverse().forEach(note=>{const article=document.createElement('article');const date=document.createElement('small');date.textContent=note.createdAt?new Date(note.createdAt).toLocaleDateString('en'):'';const text=document.createElement('p');text.textContent=note.text;article.append(date,text);list.append(article);});}
 try{notes=read();render();}catch{status.textContent='We couldn’t read your saved observations. Existing records have not been changed.';button.disabled=true;}
 form.addEventListener('submit',event=>{event.preventDefault();if(!input.value.trim()||button.disabled)return;try{notes=read();const current=window.RafiqSetup.childContext(child);const entry={id:'observation_'+(globalThis.crypto?.randomUUID?.()||Date.now()),text:input.value.trim(),type:page==='screening.html'?'concern':'observation',sourcePage:page,createdAt:new Date().toISOString(),chronologicalAgeMonths:current.chronological.totalMonths,ageDays:current.chronological.days,developmentAgeMonths:current.development?.totalMonths??null,ageBandId:current.band?.id??null,ageBasis:current.basis};const next=[...notes,entry];localStorage.setItem(key,JSON.stringify(next));notes=next;input.value='';status.textContent=page==='screening.html'?'Your concern is saved in this browser. This is a personal note, not a screening result.':'Observation saved in this browser.';render();}catch{status.textContent='We couldn’t save this observation. Check browser storage and try again.';}});
});
})();
