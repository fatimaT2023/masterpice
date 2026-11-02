document.addEventListener('DOMContentLoaded',()=>{
'use strict';
const get=id=>document.getElementById(id),api=window.RafiqSetup,daily=window.RafiqDailyMoments;
let child,selected;
function status(message){get('dailyStatus').textContent=message;}
function readNotes(){const notes=JSON.parse(localStorage.getItem('rafiqAgeObservations_'+child.id)||'[]');if(!Array.isArray(notes))throw Error('Invalid notes');return notes;}
try{const children=api.readChildren();child=children.find(c=>c.id===localStorage.getItem('rafiqCurrentChildId'))||children[0];if(!child)return;const notes=readNotes();selected=daily.open(child,notes,new URLSearchParams(location.search).get('activity'));}catch{status('We couldn’t read your saved moments. Existing records have not been changed. Check browser storage and reload.');return;}
get('dailyAge').textContent=(child.name||'Your child')+' · '+api.formatAge(selected.context.chronological)+(selected.context.basis==='corrected'?' · Idea selected using corrected development age.':'');
if(!selected.item){get('dailyUnavailable').hidden=false;get('dailyReviewChild').href='onboarding.html?edit='+encodeURIComponent(child.id)+'&return=profile';status(selected.reason==='needs-due-date'?'Add the expected due date in child details to select an idea using corrected development age.':selected.reason==='no-suitable-idea'?'No different suitable idea is available in this small library right now. You can still enjoy familiar time together or ask for support.':'No daily play idea is selected for this age. Your saved moments are still available.');return;}
const item=selected.item;get('dailyDuration').textContent=item.duration;get('dailyTitle').textContent=item.title;get('dailyInsight').textContent=item.insight;get('dailyMaterials').textContent=item.duration+' · '+item.materials;get('dailyCare').textContent=item.care;get('dailySource').href=item.sourceUrl;
for(const line of item.steps){const li=document.createElement('li');li.textContent=line;get('dailySteps').append(li);}
let playStage=0;
const playStages=[{title:'A comfortable moment',text:item.materials+' · '+item.duration,symbol:'♡'},...item.steps.map((text,index)=>({title:item.steps.length>1?'Play together · '+(index+1):'Follow your child’s lead',text,symbol:'✦'})),{title:'How was your time together?',text:'There is no right result. A smile, a pause, or deciding to stop are all worth noticing.',symbol:'☀'}];
function showPlayStage(index,focus=false){
 playStage=Math.max(0,Math.min(index,playStages.length-1));const stage=playStages[playStage],last=playStage===playStages.length-1;
 get('playStageTitle').textContent=stage.title;get('playStageText').textContent=stage.text;get('playStageSymbol').textContent=stage.symbol;
 get('playStageCount').textContent='Step '+(playStage+1)+' of '+playStages.length;
 get('playPrevious').hidden=playStage===0;get('playNext').hidden=last;
 get('playNext').textContent=playStage===0?'We’re ready →':playStage===playStages.length-2?'Record our moment →':'Next step →';
 get('playFinish').hidden=last;get('dailyFeedbackForm').hidden=!last;
 for(let n=0;n<3;n++){const active=n===(playStage===0?0:last?2:1);get('playStage'+n).classList.toggle('is-current',active);if(active)get('playStage'+n).setAttribute('aria-current','step');else get('playStage'+n).removeAttribute('aria-current');}
 if(focus)get('playStageTitle').focus();
}
get('playPrevious').addEventListener('click',()=>showPlayStage(playStage-1,true));
get('playNext').addEventListener('click',()=>showPlayStage(playStage+1,true));
get('playFinish').addEventListener('click',()=>showPlayStage(playStages.length-1,true));
showPlayStage(0);
get('dailyIdea').hidden=false;
for(const reason of selected.reasons||[]){const li=document.createElement('li');li.textContent=reason;get('dailyReasons').append(li);}
const baby=selected.context.chronological.totalMonths<24;
get('dailyVideoDescription').textContent=baby?'UNICEF: how back-and-forth play supports time together. A general parent guide, not a demonstration of this exact activity.':'Sesame Workshop: ways to enjoy everyday time together. A general parent guide, not a demonstration of this exact activity.';
get('dailyVideoLink').href=baby?'https://www.unicef.org/lac/en/parenting-lac/early-learning/building-babies-brains-through-play-video':'https://sesameworkshop.org/resources/spending-time-together-2/';
if(selected.requestDenied)status('Save today’s free activity first. Additional activities require an active Plus plan. Your saved activities remain available.');
if(selected.selectionUnstored)status('This browser couldn’t remember today’s suggestion. Saving your response will keep a record of the activity.');
const outcomeLabels={tried:'We tried it',later:'Maybe later','not-for-us':'Not for us'};
function showSaved(record){
 get('dailySavedOutcome').textContent=record.activityTitle+' — '+outcomeLabels[record.outcome];
 get('dailySavedNote').textContent=record.note||'No additional note.';
 get('dailySaved').hidden=false;
 get('dailySave').textContent='Update our moment';
 get('dailyStart').textContent='Review activity steps';
}
get('dailyEdit').addEventListener('click',()=>{showPlayStage(playStages.length-1);get('dailyDetails').hidden=false;get('dailyStart').setAttribute('aria-expanded','true');get('dailyStart').textContent='Close activity details';get('dailyFeedbackForm').querySelector('input[name="dailyOutcome"]:checked')?.focus();});
if(selected.saved){showSaved(selected.saved);get('dailyNote').value=selected.saved.note||'';get('dailyFeedbackForm').querySelectorAll('input[name="dailyOutcome"]').forEach(input=>input.checked=input.value===selected.saved.outcome);status('Your response for today is saved. You can update it.');}
get('dailyStart').addEventListener('click',()=>{const expanded=get('dailyDetails').hidden;get('dailyDetails').hidden=!expanded;get('dailyStart').setAttribute('aria-expanded',String(expanded));get('dailyStart').textContent=expanded?'Close activity details':get('dailySaved').hidden?'Try this activity':'Review activity steps';});
window.rafiqTodayHasUnsavedMoment=false;
get('dailyNote').addEventListener('input',()=>{window.rafiqTodayHasUnsavedMoment=true;});
get('dailyFeedbackForm').querySelectorAll('input[name="dailyOutcome"]').forEach(input=>input.addEventListener('change',()=>{window.rafiqTodayHasUnsavedMoment=true;}));
get('dailyFeedbackForm').addEventListener('submit',event=>{
 event.preventDefault();const input=get('dailyFeedbackForm').querySelector('input[name="dailyOutcome"]:checked');if(!input||!Object.hasOwn(outcomeLabels,input.value)){status('Choose how it went, or select Maybe later.');return;}
 try{
 const latestChild=api.readChildren().find(c=>c.id===child.id);if(!latestChild)throw Error('Missing child');const context=api.childContext(latestChild,new Date(selected.day+'T12:00:00')),months=context.development?.totalMonths;if(!context.supported||!context.development||context.needsDueDate||months<item.minMonths||months>=item.maxMonthsExclusive){status('Your child’s age details changed. Reload Today before saving this moment.');return;}
 const notes=readNotes(),old=notes.find(n=>n?.type==='daily-moment'&&n.childId===child.id&&n.day===selected.day&&n.activityId===item.id);
 if(selected.isExtra&&!old&&!window.RafiqMembership.state().active){status('Your Plus plan is no longer active. This new activity was not saved. Existing records remain available.');return;}
 const id=old?.id||('daily_'+child.id+'_'+selected.day+(selected.isExtra?'_'+item.id:'')),note=get('dailyNote').value.trim();
 const record={id,isExtra:old?.isExtra??!!selected.isExtra,childId:child.id,type:'daily-moment',sourcePage:'parent-dashboard.html',day:selected.day,activityId:item.id,activityTitle:item.title,activitySource:item.sourceUrl,outcome:input.value,note,text:item.title+' — '+outcomeLabels[input.value]+(note?'\n'+note:''),createdAt:old?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString(),chronologicalAgeMonths:context.chronological.totalMonths,ageDays:context.chronological.days,ageBandId:context.band?.id||null,ageBasis:context.basis};
 const index=notes.findIndex(n=>n?.id===id);if(index>=0)notes[index]=record;else notes.push(record);localStorage.setItem('rafiqAgeObservations_'+child.id,JSON.stringify(notes));showSaved(record);get('dailyDetails').hidden=true;get('dailyStart').setAttribute('aria-expanded','false');get('dailyStart').textContent='Review activity steps';get('dailyEdit').focus();window.rafiqTodayHasUnsavedMoment=false;window.dispatchEvent(new Event('rafiq:moment-saved'));status(input.value==='not-for-us'?'Saved. We won’t suggest this idea again while it is marked Not for us.':input.value==='later'?'Saved for later. There’s no need to complete it today.':'Your moment is saved in your child’s personal observations.');
 if(daily.dayKey()!==selected.day)status('Your moment for '+selected.day+' is saved. Reload Today whenever you are ready for the new day.');
 }catch{status('We couldn’t save this moment. Existing records have not been removed. Please try again.');}
});

});
