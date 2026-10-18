/* Today reads existing feature records; it does not infer medical results. */
(() => {
'use strict';
const services={
 'milestones.html':{title:'Growth & milestones',description:'Return to your child’s growth observations.'},
 'challenges.html':{title:'Activities together',description:'Return to the guidance and activities you were exploring.'},
 'screening.html':{title:'Development questions',description:'Return to development questions and your observations.'},
 'health.html':{title:'Health & vaccinations',description:'Return to your child’s health records.'},
 'album.html':{title:'Memories',description:'Return to your child’s photos and special moments.'},
 'ai-assistant.html':{title:'Your conversation with Rafiq',description:'Return to your child’s conversation.'},
 'specialists.html':{title:'Specialist support',description:'Continue exploring specialists.'},
 'bookings.html':{title:'Appointments & reports',description:'Return to your child’s visits and reports.'}
};
function bookingMoment(booking){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(booking.date||''))return null;
 const [y,m,d]=booking.date.split('-').map(Number), date=new Date(y,m-1,d);
 if(date.getFullYear()!==y||date.getMonth()!==m-1||date.getDate()!==d)return null;
 const match=String(booking.time||'').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
 if(!match){date.setHours(23,59,59,999);return date;}
 let hour=Number(match[1]),minute=Number(match[2]);
 if(minute>59||hour>(match[3]?12:23)||(match[3]&&hour<1))return null;
 if(match[3])hour=hour%12+(match[3].toUpperCase()==='PM'?12:0);
 date.setHours(hour,minute,0,0);return date;
}
function build(child,storage=localStorage,now=new Date()){
 const warnings=[];
 function read(key,fallback){try{const raw=storage.getItem(key);return raw?JSON.parse(raw):fallback;}catch{warnings.push(key);return fallback;}}
 function array(key){const data=read(key,[]);if(!Array.isArray(data)){warnings.push(key);return [];}return data.filter(item=>item&&typeof item==='object');}
 const id=child.id,ageContext=window.RafiqSetup.childContext(child,now),age=ageContext.chronological;
 const resource=window.RafiqAgeContent.milestoneResource(ageContext);
 const storedStatuses=read('rafiqMilestones_'+id,{}),statuses=storedStatuses&&typeof storedStatuses==='object'&&!Array.isArray(storedStatuses)?storedStatuses:{};
 const legacyObservations=Object.values(statuses).filter(value=>['achieved','not-yet','not-sure'].includes(value)).length;
 const observations=array('rafiqAgeObservations_'+id).length;
 const healthCount=['rafiqVaccinations_','rafiqGrowth_','rafiqHealthNotes_'].reduce((count,key)=>count+array(key+id).filter(record=>!record._deletedAt).length,0);
 const chatCount=array('rafiqChat_'+id).length;
 const bookings=array('rafiqBookings').filter(item=>item.childId===id);
 const upcoming=bookings.filter(item=>['confirmed','upcoming','scheduled','accepted'].includes(item.status)&&!['refund_pending','refunded','failed','pending'].includes(item.sessionPayment?.status)).map(item=>({booking:item,date:bookingMoment(item)})).filter(item=>item.date&&item.date>=now).sort((a,b)=>a.date-b.date)[0]||null;
 const reports=array('rafiqSpecialistReports').filter(item=>item.childId===id&&typeof item.bookingId==='string'&&item.bookingId);
 const stamp=report=>{const value=Date.parse(report.createdAt||report.reportDate||'');return Number.isFinite(value)?value:0;};
 const report=reports.sort((a,b)=>stamp(b)-stamp(a))[0]||null;
 const savedFollowup=report?read('rafiqReportFollowup_'+id+'_'+report.bookingId,null):null;
 const personalFollowup=savedFollowup?.childId===id&&savedFollowup.bookingId===report?.bookingId?savedFollowup:null;
 const dueFollowup=reports.map(item=>({report:item,state:read('rafiqReportFollowup_'+id+'_'+item.bookingId,null)})).filter(item=>item.state?.childId===id&&item.state.bookingId===item.report.bookingId&&item.state.reminderDate&&window.RafiqSetup.ageFromBirth(item.state.reminderDate,now)).sort((a,b)=>a.state.reminderDate.localeCompare(b.state.reminderDate))[0]||null;
 const seen=read('rafiqTodaySeenReports_'+id,[]);
 const reportKey=report?String(report.id||report.bookingId)+'|'+String(report.createdAt||report.reportDate||''):null;
 const unseenReport=report&&(!Array.isArray(seen)||!seen.includes(reportKey));
 const last=read('rafiqLastVisit_'+id,null);
 const continuation=last&&Object.hasOwn(services,last.page)?{...services[last.page],url:last.page,visitedAt:last.visitedAt}:null;
 let returning=!!(continuation||observations||legacyObservations||healthCount||chatCount||report||bookings.length);
 const storedConcern=read('rafiqConcernJourney_'+id,null);
 const concernJourney=storedConcern?.childId===id&&storedConcern.version===1&&['draft','complete'].includes(storedConcern.status)?storedConcern:null;
 let screeningJourney=null;try{screeningJourney=window.RafiqScreeningTools?.readJourney(id,storage)||null;}catch{warnings.push('rafiqScreeningJourney_'+id);}
 const screening=window.RafiqScreeningTools?.choose(child,now)||null;
 returning=returning||!!screeningJourney||!!concernJourney;
 const choices={
 development:{title:observations?'Keep your child’s story growing':'Get to know your child’s development',description:observations?'Your saved observations are ready to revisit. Add what you notice when you’re ready.':'Explore growth information and record what you notice about your child.',url:'milestones.html',label:observations?'Review growth observations':'Explore growth & milestones',reason:'BECAUSE YOU CHOSE DEVELOPMENT'},
 activities:{title:'Make a little time together',description:'Check activity availability for your child’s stage, or save a personal observation. Content from a different age group will not be substituted.',url:'challenges.html',label:'Check activities for this stage',reason:'BECAUSE YOU CHOSE ACTIVITIES'},
 concern:{title:'Find a clear next step for your concern',description:'Check screening availability for your child’s age. You can also record what you’ve noticed or speak directly to a specialist.',url:'screening.html',label:'Check screening options',reason:'BECAUSE YOU WANTED TO DISCUSS A CONCERN'},
 health:{title:healthCount?'Your child’s records, ready when you need them':'Start your child’s health story',description:healthCount?'Review your saved notes, measurements, and vaccination records, or add a new entry.':'Add a health note, measurement, or vaccination record. A small entry can be useful at your next visit.',url:'health.html',label:healthCount?'Open health records':'Add a first health record',reason:'BECAUSE YOU CHOSE HEALTH RECORDS'},
 explore:{title:'Find your own starting point',description:'Choose what would help you most today: understanding growth, exploring activities, organizing records, or discussing a concern.',url:'getting-started.html?child='+encodeURIComponent(id),label:'Choose where to start',reason:'AT YOUR OWN PACE'}
 };
 let next={...(Object.hasOwn(choices,child.initialGoal)?choices[child.initialGoal]:choices.explore)};
 if(ageContext.supported&&(child.initialGoal==='concern'||concernJourney)){
 if(concernJourney?.status==='complete')next={title:'Your observations, ready for your next step',description:'Review the concern you described, edit your answers, or explore specialist support. Your summary is not a diagnosis or a screening score.',url:'screening.html',label:'Review my concern summary',reason:'YOUR SAVED CONCERN'};
 else if(concernJourney?.topic)next={title:'Continue describing your concern',description:'Return to the observations you started. You can also contact a specialist without finishing.',url:'screening.html',label:'Continue my observations',reason:'PICK UP WHERE YOU LEFT OFF'};
 else next={title:'What’s worrying you about your child?',description:'Start with your concern. Answer a few age-aware observation questions, then review a clear summary and options for support.',url:'screening.html',label:'Describe my concern',reason:'LET’S START WITH YOU'};
 }
 if(!ageContext.supported)next={title:'Your child’s records are still here',description:'Rafiq currently focuses on children from birth until their seventh birthday. You can still open existing records, reports and appointments.',url:'health.html',label:'Open health records',reason:'YOUR SAVED RECORDS'};
 const today=now.toDateString();
 if(upcoming&&upcoming.date.toDateString()===today)next={title:'Your specialist visit is today',description:'Take a moment to review the appointment details and note any questions you want to ask.',url:'bookings.html',label:'View appointment',reason:'YOUR APPOINTMENT TODAY'};
 else if(unseenReport)next={title:'Your latest specialist report is ready',description:'Read your specialist’s observations and recommendations, then review the next steps they shared.',url:'specialist-report.html',label:'Read specialist report',reason:'FROM YOUR SPECIALIST',report:true};
 else if(dueFollowup)next={title:'A follow-up you wanted to revisit',description:'Your chosen reminder for the visit with '+(dueFollowup.report.specialistName||'your specialist')+' has arrived. Review your own notes alongside the original recommendations.',url:'specialist-report.html',label:'Review my follow-up',reason:'YOUR PERSONAL REMINDER',report:true,reportBookingId:dueFollowup.report.bookingId};
 else if(!screeningJourney&&!concernJourney&&returning&&continuation&&(!child.initialGoal||child.initialGoal==='explore'))next={title:'A little more time for '+(child.name||'your child'),description:continuation.description,url:continuation.url,label:'Return to '+continuation.title,reason:'BASED ON YOUR LAST VISIT'};
 return {age,ageContext,resource,observations,legacyObservations,healthCount,upcoming,report,reportKey,unseenReport,continuation,returning,next,warnings,screening,screeningJourney,concernJourney,personalFollowup,dueFollowup};
}
window.RafiqToday={build,bookingMoment,services};
})();
