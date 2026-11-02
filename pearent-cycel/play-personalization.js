document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const api=window.RafiqDailyMoments,get=id=>document.getElementById(id);
 let child;
 try{const children=window.RafiqSetup.readChildren();child=children.find(c=>c.id===localStorage.getItem('rafiqCurrentChildId'))||children[0];}catch{return;}
 if(!child)return;
 const preferences=api.preferences(child),inputs=[];
 for(const [key,title] of Object.entries(api.comfortLabels)){
  const label=document.createElement('label'),input=document.createElement('input'),text=document.createElement('span');
  input.type='checkbox';input.value=key;input.checked=preferences.comfortable.includes(key);text.textContent=title;
  label.append(input,text);get('playComfortChoices').append(label);inputs.push(input);
 }
 if(preferences.unavailable)get('playPreferencesStatus').textContent='Saved preferences could not be read. You can select and save them again.';
 get('playPreferencesForm').addEventListener('submit',event=>{
  event.preventDefault();
  try{localStorage.setItem('rafiqPlayPreferences_'+child.id,JSON.stringify({comfortable:inputs.filter(input=>input.checked).map(input=>input.value),updatedAt:new Date().toISOString()}));
   get('playPreferencesStatus').textContent='Preferences saved. They will help choose your next day’s idea; today’s activity stays here so you can finish it.';
  }catch{get('playPreferencesStatus').textContent='Could not save your preferences. Please try again.';}
 });
 function week(){
  try{
   const notes=JSON.parse(localStorage.getItem('rafiqAgeObservations_'+child.id)||'[]');if(!Array.isArray(notes))throw Error('Invalid observations');
   const now=new Date(),days=new Set();for(let n=0;n<7;n++){const date=new Date(now.getFullYear(),now.getMonth(),now.getDate()-n);days.add(api.dayKey(date));}
   const tried=new Set(notes.filter(note=>note?.childId===child.id&&note.type==='daily-moment'&&note.outcome==='tried'&&days.has(note.day)).map(note=>note.day));
   get('dailyWeek').textContent=tried.size?tried.size+' shared play '+(tried.size===1?'day':'days')+' in the last 7 days. Every little moment counts.':'A fresh chance to enjoy a little time together. Even a short moment counts.';
  }catch{get('dailyWeek').textContent='Take it at your own pace. Your saved moments are still yours.';}
 }
 function history(){
 const list=get('dailyHistoryList');list.replaceChildren();
 try{
  const notes=JSON.parse(localStorage.getItem('rafiqAgeObservations_'+child.id)||'[]');if(!Array.isArray(notes))throw Error('Invalid moments');
  const previous=notes.filter(n=>n&&n.type==='daily-moment'&&n.childId===child.id&&typeof n.day==='string'&&n.day<api.dayKey()).sort((a,b)=>b.day.localeCompare(a.day));
  get('dailyHistoryStatus').textContent=previous.length?'Your most recent saved moments.':'Your first saved moment will appear here tomorrow. Today’s response stays with today’s activity.';
  const labels={tried:'We tried it',later:'Maybe later','not-for-us':'Not for us'};
  for(const record of previous.slice(0,7)){
   const card=document.createElement('article'),date=document.createElement('time'),title=document.createElement('h3'),outcome=document.createElement('p'),note=document.createElement('p');
   date.dateTime=record.day;date.textContent=record.day;title.textContent=record.activityTitle||'A shared moment';outcome.textContent=labels[record.outcome]||'Saved response';note.textContent=record.note||'';note.setAttribute('data-user-content','');
   card.append(date,title,outcome,note);list.append(card);
  }
 }catch{get('dailyHistoryStatus').textContent='We couldn’t read your previous moments. Existing records have not been changed.';}
}
week();history();window.addEventListener('rafiq:moment-saved',()=>{week();history();});
});
