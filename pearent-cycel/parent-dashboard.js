document.addEventListener('DOMContentLoaded',()=>{
'use strict';
const get=id=>document.getElementById(id),text=(id,value)=>{get(id).textContent=value;};
let children,child,model;
function fail(message){text('todayError',message);get('todayError').hidden=false;}
try{
 children=window.RafiqSetup.readChildren();if(!children.length){location.replace('onboarding.html');return;}
 child=children.find(item=>item.id===localStorage.getItem('rafiqCurrentChildId'))||children[0];
 localStorage.setItem('rafiqCurrentChildId',child.id);
 if(localStorage.getItem('rafiqSetupPendingChildId')===child.id){location.replace('getting-started.html?child='+encodeURIComponent(child.id));return;}
 model=window.RafiqToday.build(child);
}catch{fail('We couldn’t read your saved profile in this browser. Check that browser storage is available, then reload this page.');return;}
const initial=Array.from(child.name||'?')[0].toUpperCase(), age=window.RafiqSetup.formatAge(model.age);
text('sidebarChildAvatar',initial);text('sidebarChildName',child.name||'Your child');text('sidebarChildAge',age||'Check date of birth');
text('screeningAgeContext',(child.name||'Your child')+' · '+(age||'Review date of birth')+'. Start by telling us what you have noticed.');
get('screeningEntry').hidden=model.next.url==='screening.html';
text('todayAvatar',initial);text('todayChildName',child.name||'Your child');text('todayChildAge',age||'Check date of birth');
text('todayDate',new Intl.DateTimeFormat('en',{weekday:'long',day:'numeric',month:'long'}).format(new Date()));
text('nextTitle',model.next.title);text('nextDescription',model.next.description);text('nextReason',model.next.reason);text('nextAction',model.next.label+' →');get('nextAction').href=model.next.url;
get('changeGoal').href='getting-started.html?child='+encodeURIComponent(child.id);
text('stageTitle',model.ageContext.band?.label||'Your child’s development age');
text('stageDescription',model.ageContext.basis==='corrected'?'Development resources use corrected age: '+window.RafiqSetup.formatAge(model.ageContext.development)+'. The age shown in your child’s profile is calculated from date of birth.':model.ageContext.needsDueDate?'Your child was born before their due date. Add the expected due date in child details to select development resources using corrected age.':model.ageContext.beforeDueDate?'The expected due date has not arrived. No milestone checklist is selected.':'Your child’s current content band is based on their exact age. Each resource also has its own age range.');
text('stageMeta',model.observations?model.observations+' saved personal '+(model.observations===1?'observation':'observations')+'. Your notes are not a developmental score.':model.resource?'Available original resource: '+model.resource.title+'. No older child’s checklist is applied.':'A reviewed checklist or activity has not been selected for this stage. You can still save observations and ask for support.');
function prepareReport(event,targetReport=model.report){
 if(!targetReport)return;
 try{sessionStorage.setItem('rafiqSelectedReportBooking',targetReport.bookingId);const key='rafiqTodaySeenReports_'+child.id;let seen;try{seen=JSON.parse(localStorage.getItem(key)||'[]');}catch{seen=[];}if(!Array.isArray(seen))seen=[];if(!seen.includes((String(targetReport.id||targetReport.bookingId)+'|'+String(targetReport.createdAt||targetReport.reportDate||''))))seen.push((String(targetReport.id||targetReport.bookingId)+'|'+String(targetReport.createdAt||targetReport.reportDate||'')));localStorage.setItem(key,JSON.stringify(seen.slice(-100)));}
 catch{event.preventDefault();fail('We couldn’t open the report in this browser. Please open it from My appointments.');}
}
if(model.next.report)get('nextAction').addEventListener('click',event=>prepareReport(event,model.next.reportBookingId?model.dueFollowup.report:model.report));
if(model.upcoming){
 const booking=model.upcoming.booking;get('appointmentCard').hidden=false;
 text('appointmentTitle','A visit with '+(booking.specialistName||'your specialist'));
 const date=new Date(booking.date+'T00:00:00');
 const label=new Intl.DateTimeFormat('en',{weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(date);
 text('appointmentDetails',label+(booking.time?' · '+booking.time:' · See appointment for time')+(booking.consultationType?' · '+booking.consultationType:''));
 text('appointmentPayment',booking.sessionPayment?.status==='paid'?'Demo session payment recorded. View the appointment for full details.':'View appointment details and any payment information.');
}
if(model.personalFollowup){text('reportFollowupStatus','Your personal follow-up is saved.'+(model.personalFollowup.reminderDate?' Your chosen reminder: '+model.personalFollowup.reminderDate+'.':''));}
if(model.report){get('reportCard').hidden=false;text('reportDescription','Your latest saved report from '+(model.report.specialistName||'your specialist')+'. Review their recommendations and follow-up notes.');get('reportAction').href='specialist-report.html';get('reportAction').addEventListener('click',event=>prepareReport(event));}
if(model.continuation){get('continueCard').hidden=false;get('firstStepsCard').hidden=true;text('continueTitle',model.continuation.title);text('continueDescription',model.continuation.description);get('continueAction').href=model.continuation.url;}
else if(model.returning){text('firstStepsTitle','Your notes are here when you need them');get('firstStepsCard').querySelector('p').textContent='Come back to your saved observations, records, or specialist support at your own pace.';}
text('recordsDescription',model.healthCount?model.healthCount+' saved health '+(model.healthCount===1?'entry':'entries')+' for '+(child.name||'your child')+'. Keep adding notes and measurements when you have something to record.':'Start with a health note, measurement, or vaccination record. You can also save a special moment in your child’s album.');
if(model.warnings.length)fail('Some saved records couldn’t be read. The information below may be incomplete. Your existing records have not been changed.');
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
