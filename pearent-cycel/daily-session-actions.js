document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const get=id=>document.getElementById(id),daily=window.RafiqDailyMoments;
 function render(){
  try{
   const children=window.RafiqSetup.readChildren(),child=children.find(c=>c.id===(window.RafiqFamily ? window.RafiqFamily.selected() : localStorage.getItem('rafiqCurrentChildId')))||children[0];if(!child)return;
   const notes=JSON.parse(localStorage.getItem('rafiqAgeObservations_'+child.id)||'[]');if(!Array.isArray(notes))throw Error('Invalid moments');
   const today=notes.filter(n=>n&&n.type==='daily-moment'&&n.childId===child.id&&n.day===daily.dayKey());
   get('todayMore').hidden=!today.length;if(!today.length)return;
   const list=get('todayActivitiesList');list.replaceChildren();
   for(const record of today){
    const link=document.createElement('a'),title=document.createElement('strong'),label=document.createElement('span');
    link.className='today-saved-activity';link.href='daily-activity.html?activity='+encodeURIComponent(record.activityId);
    title.textContent=record.activityTitle;label.textContent=({tried:'We tried it',later:'Maybe later','not-for-us':'Not for us'})[record.outcome]||'Saved response';
    link.append(title,label);list.append(link);
   }
   const active=window.RafiqMembership.state().active,more=daily.additional(child,notes),action=get('todayMoreAction');
   action.hidden=active&&!more.length;
   action.href=active&&more.length?'daily-activity.html?activity='+encodeURIComponent(more[0].id):'subscription.html';
   action.textContent=active?'Try another activity →':'Explore Plus for more activities';
   get('todayMoreStatus').textContent=active?(more.length?'Each activity keeps its own response and note.':'You have explored all available ideas for this stage today. Your saved activities are still here.'):'Your free activity renews tomorrow. All saved responses remain available, even after a plan ends.';
  }catch{get('todayMoreStatus').textContent='Could not read today’s activities. Your saved records have not been changed.';}
 }
 get('todayMoreAction').addEventListener('click',event=>{
  // Recheck eligibility at the moment the link is used.
  if(window.rafiqTodayHasUnsavedMoment){event.preventDefault();get('todayMoreStatus').textContent='Save your current response before opening another activity.';return;}
  render();
 });
 render();window.addEventListener('rafiq:moment-saved',render);window.addEventListener('focus',render);
});
