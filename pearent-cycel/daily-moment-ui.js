document.addEventListener('DOMContentLoaded',()=>{
'use strict';
const get=id=>document.getElementById(id),api=window.RafiqSetup,daily=window.RafiqDailyMoments;
let child,selected;
function status(message){get('dailyStatus').textContent=message;}
function readNotes(){const notes=JSON.parse(localStorage.getItem('rafiqAgeObservations_'+child.id)||'[]');if(!Array.isArray(notes))throw Error('Invalid notes');return notes;}
function history(notes){get('dailyHistoryList').replaceChildren();const records=notes.filter(n=>n?.type==='daily-moment'&&n.childId===child.id).sort((a,b)=>String(b.day).localeCompare(String(a.day)));if(!records.length){const p=document.createElement('p');p.textContent='Your moments will appear here when you choose to save one.';get('dailyHistoryList').append(p);}for(const record of records){const article=document.createElement('article'),title=document.createElement('strong'),text=document.createElement('p');title.textContent=record.day+' · '+(record.activityTitle||'A moment together');text.textContent=record.text||'';article.append(title,text);get('dailyHistoryList').append(article);}}
try{const children=api.readChildren();child=children.find(c=>c.id===localStorage.getItem('rafiqCurrentChildId'))||children[0];if(!child)return;const notes=readNotes();selected=daily.choose(child,notes);history(notes);}catch{status('We couldn’t read your saved moments. Existing records have not been changed. Check browser storage and reload.');return;}
get('dailyAge').textContent=(child.name||'Your child')+' · '+api.formatAge(selected.context.chronological)+(selected.context.basis==='corrected'?' · Idea selected using corrected development age.':'');
if(!selected.item){status(selected.reason==='needs-due-date'?'Add the expected due date in child details to select an idea using corrected development age.':selected.reason==='no-suitable-idea'?'No different suitable idea is available in this small library right now. You can still enjoy familiar time together or ask for support.':'No daily play idea is selected for this age. Your saved moments are still available.');return;}
const item=selected.item;get('dailyTitle').textContent=item.title;get('dailyInsight').textContent=item.insight;get('dailyMaterials').textContent=item.duration+' · '+item.materials;get('dailyCare').textContent=item.care;get('dailySource').href=item.sourceUrl;
for(const line of item.steps){const li=document.createElement('li');li.textContent=line;get('dailySteps').append(li);}
get('dailyIdea').hidden=false;
const outcomeLabels={tried:'We tried it',later:'Maybe later','not-for-us':'Not for us'};
if(selected.saved){get('dailyNote').value=selected.saved.note||'';get('dailyFeedbackForm').querySelectorAll('input[name="dailyOutcome"]').forEach(input=>input.checked=input.value===selected.saved.outcome);status('Your response for today is saved. You can update it.');}
get('dailyStart').addEventListener('click',()=>{const expanded=get('dailyDetails').hidden;get('dailyDetails').hidden=!expanded;get('dailyStart').setAttribute('aria-expanded',String(expanded));get('dailyStart').textContent=expanded?'Close activity details':'Let’s try it →';});
window.rafiqTodayHasUnsavedMoment=false;
get('dailyNote').addEventListener('input',()=>{window.rafiqTodayHasUnsavedMoment=true;});
get('dailyFeedbackForm').querySelectorAll('input[name="dailyOutcome"]').forEach(input=>input.addEventListener('change',()=>{window.rafiqTodayHasUnsavedMoment=true;}));
get('dailyFeedbackForm').addEventListener('submit',event=>{
 event.preventDefault();const input=get('dailyFeedbackForm').querySelector('input[name="dailyOutcome"]:checked');if(!input||!Object.hasOwn(outcomeLabels,input.value)){status('Choose how it went, or select Maybe later.');return;}
 try{
 const latestChild=api.readChildren().find(c=>c.id===child.id);if(!latestChild)throw Error('Missing child');const context=api.childContext(latestChild,new Date(selected.day+'T12:00:00')),months=context.development?.totalMonths;if(!context.supported||!context.development||context.needsDueDate||months<item.minMonths||months>=item.maxMonthsExclusive){status('Your child’s age details changed. Reload Today before saving this moment.');return;}
 const notes=readNotes(),id='daily_'+child.id+'_'+selected.day,note=get('dailyNote').value.trim(),old=notes.find(n=>n?.id===id);
 const record={id,childId:child.id,type:'daily-moment',sourcePage:'parent-dashboard.html',day:selected.day,activityId:item.id,activityTitle:item.title,activitySource:item.sourceUrl,outcome:input.value,note,text:item.title+' — '+outcomeLabels[input.value]+(note?'\n'+note:''),createdAt:old?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString(),chronologicalAgeMonths:context.chronological.totalMonths,ageDays:context.chronological.days,ageBandId:context.band?.id||null,ageBasis:context.basis};
 const index=notes.findIndex(n=>n?.id===id);if(index>=0)notes[index]=record;else notes.push(record);localStorage.setItem('rafiqAgeObservations_'+child.id,JSON.stringify(notes));history(notes);window.rafiqTodayHasUnsavedMoment=false;status(input.value==='not-for-us'?'Saved. We won’t suggest this idea again while it is marked Not for us.':input.value==='later'?'Saved for later. There’s no need to complete it today.':'Your moment is saved in your child’s personal observations.');
 if(daily.dayKey()!==selected.day)status('Your moment for '+selected.day+' is saved. Reload Today whenever you are ready for the new day.');
 }catch{status('We couldn’t save this moment. Existing records have not been removed. Please try again.');}
});
const next=get('nextAction');if(['activities','explore'].includes(child.initialGoal)&&next&&!['screening.html','bookings.html','specialist-report.html'].includes(next.getAttribute('href'))){get('nextTitle').textContent='A little moment, together.';get('nextDescription').textContent='A simple idea for your child’s stage, with space to save what you notice. Try it when it suits your day.';get('nextReason').textContent='TODAY AT YOUR OWN PACE';next.href='#dailyMoment';next.textContent='See today’s moment →';}
});
