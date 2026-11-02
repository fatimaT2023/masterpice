document.addEventListener('DOMContentLoaded',()=>{
'use strict';
const get=id=>document.getElementById(id),text=(id,value)=>{get(id).textContent=value;};
let children,child,model;
function fail(message){text('todayError',message);get('todayError').hidden=false;}
try{
 children=window.RafiqSetup.readChildren();if(!children.length){location.replace('onboarding.html');return;}
 child=children.find(item=>item.id===localStorage.getItem('rafiqCurrentChildId'))||children[0];
 localStorage.setItem('rafiqCurrentChildId',child.id);
 if(localStorage.getItem('rafiqSetupPendingChildId')===child.id||!child.setupCompletedAt){location.replace('getting-started.html?child='+encodeURIComponent(child.id));return;}
 model=window.RafiqToday.build(child);
}catch{fail('We couldn’t read your saved profile in this browser. Check that browser storage is available, then reload this page.');return;}
const initial=Array.from(child.name||'?')[0].toUpperCase(), age=window.RafiqSetup.formatAge(model.age);
text('sidebarChildAvatar',initial);text('sidebarChildName',child.name||'Your child');text('sidebarChildAge',age||'Check date of birth');
text('todayHeading','Today with '+(child.name||'your child'));
text('todayChildContext',age ? age+' · Activities selected for your child’s development age.' : 'Review your child’s date of birth to personalize activities.');
text('todayDate',new Intl.DateTimeFormat('en',{weekday:'long',day:'numeric',month:'long'}).format(new Date()));
// Time-sensitive appointments and reports appear first.
let priority=null;
if(model.next.report || (model.upcoming && model.upcoming.date.toDateString()===new Date().toDateString())){
 priority={title:model.next.title,description:model.next.description,label:model.next.label,url:model.next.url,reason:model.next.reason,report:model.next.report};
}else if(model.upcoming){
 const booking=model.upcoming.booking;
 priority={title:'Your next appointment',description:(booking.specialistName||'Your specialist')+' · '+new Intl.DateTimeFormat('en',{day:'numeric',month:'short'}).format(model.upcoming.date)+(booking.time?' · '+booking.time:''),label:'View appointment',url:'bookings.html',reason:'COMING UP'};
}
if(priority){
 get('todayPriority').hidden=false;
 text('priorityTitle',priority.title);text('priorityDescription',priority.description);text('priorityReason',priority.reason);text('priorityAction',priority.label);get('priorityAction').href=priority.url;
 if(priority.report)get('priorityAction').addEventListener('click',event=>{
  const report=model.next.reportBookingId?model.dueFollowup?.report:model.report;
  if(!report)return;
  try{
   sessionStorage.setItem('rafiqSelectedReportBooking',report.bookingId);
   const key='rafiqTodaySeenReports_'+child.id;
   let seen;try{seen=JSON.parse(localStorage.getItem(key)||'[]');}catch{seen=[];}
   if(!Array.isArray(seen))seen=[];
   const reportKey=String(report.id||report.bookingId)+'|'+String(report.createdAt||report.reportDate||'');
   if(!seen.includes(reportKey))seen.push(reportKey);
   localStorage.setItem(key,JSON.stringify(seen.slice(-100)));
  }catch{event.preventDefault();fail('We couldn’t open the report. Please open it from My appointments.');}
 });
}
if(model.warnings.length)fail('Some saved records couldn’t be read. Your existing records have not been changed.');
const dropdown=get('childDropdown'),switcher=get('childSwitcherButton');
switcher.addEventListener('click',()=>{dropdown.hidden=!dropdown.hidden;});
document.addEventListener('click',event=>{if(!event.target.closest('.child-switcher'))dropdown.hidden=true;});
children.forEach(item=>{const button=document.createElement('button');button.type='button';button.className='dropdown-child-button';button.textContent=item.name||'Your child';if(item.id===child.id){button.classList.add('active');button.setAttribute('aria-current','true');}button.addEventListener('click',()=>{try{localStorage.setItem('rafiqCurrentChildId',item.id);location.assign('child-profile.html?child='+encodeURIComponent(item.id));}catch{fail('We couldn’t switch profiles. Check browser storage and try again.');}});get('childDropdownList').append(button);});
get('todayContent').hidden=false;
// Refresh age context when Today remains open across a local calendar day.
const calendarDay=new Date().toDateString();
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!window.rafiqTodayHasUnsavedMoment&&new Date().toDateString()!==calendarDay)location.reload();});
const nextDay=new Date();nextDay.setHours(24,0,1,0);window.setTimeout(()=>{if(!document.hidden&&!window.rafiqTodayHasUnsavedMoment)location.reload();},nextDay-Date.now());
window.addEventListener('storage',event=>{if(event.key===null||event.key?.startsWith('rafiq')){if(window.rafiqTodayHasUnsavedMoment)fail('Saved information changed in another tab. Finish saving your moment, then reload Today.');else location.reload();}});
});
