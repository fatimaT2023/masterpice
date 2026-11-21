/* Phase 5: one appointment-request lifecycle shared by the Parent and Specialist cycles.
   Frontend demonstration only: data lives in this browser's storage (inside the demo
   preview it is the shared in-memory demo store). Nothing is emailed, texted or charged.

   Stored statuses stay compatible with existing pages:
     requested            -> Pending
     confirmed            -> Accepted
     reschedule_proposed  -> Reschedule proposed
     completed            -> Completed
     cancelled + cancelledBy:'specialist' + declinedAt -> Rejected
     cancelled            -> Cancelled                                              */
(() => {
 'use strict';
 const p=(en,ar)=>({en,ar});
 const KEY='rafiqBookings';
 const STATES=['pending','accepted','rejected','reschedule_proposed','completed','cancelled'];
 const labels={pending:p('Pending','بانتظار الرد'),accepted:p('Accepted','مقبول'),rejected:p('Rejected','مرفوض'),reschedule_proposed:p('New time proposed','موعد جديد مقترح'),completed:p('Completed','مكتمل'),cancelled:p('Cancelled','ملغي')};
 const help={
  pending:p('Waiting for the specialist to reply. You can cancel any time.','بانتظار رد المختص. بتقدروا تلغوا أي وقت.'),
  accepted:p('The specialist accepted. Confirm with the demo payment to hold the session.','المختص وافق. أكّدوا بالدفع التجريبي لتثبيت الجلسة.'),
  acceptedPaid:p('Confirmed. Join or prepare from the appointment details.','مؤكد. جهّزوا أو انضموا من تفاصيل الموعد.'),
  rejected:p('The specialist could not take this request. You can choose another time or specialist.','المختص ما قدر ياخد هالطلب. بتقدروا تختاروا وقت أو مختص ثاني.'),
  reschedule_proposed:p('The specialist suggested another time. Accept it or decline.','المختص اقترح وقت ثاني. اقبلوه أو ارفضوه.'),
  completed:p('Session completed. The follow-up report appears here when it is ready.','الجلسة خلصت. تقرير المتابعة بيظهر هون لما يجهز.'),
  cancelled:p('This appointment was cancelled.','هالموعد انلغى.')
 };
 const lang=()=>document.documentElement.lang==='ar'?'ar':'en';
 const t=v=>v[lang()];
 const nowIso=()=>new Date().toISOString();
 const ymd=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
 function read(storage=localStorage){try{const v=JSON.parse(storage.getItem(KEY)||'[]');return Array.isArray(v)?v.filter(b=>b&&typeof b==='object'&&typeof b.id==='string'):[];}catch{return [];}}
 function write(rows,storage=localStorage){storage.setItem(KEY,JSON.stringify(rows));}
 function stateOf(b){
  if(!b)return null;const s=b.status;
  if(s==='requested'||s==='pending')return 'pending';
  if(s==='reschedule_proposed')return 'reschedule_proposed';
  if(s==='completed')return 'completed';
  if(s==='cancelled'||s==='canceled')return b.cancelledBy==='specialist'&&b.declinedAt?'rejected':'cancelled';
  return 'accepted';
 }
 const isPaid=b=>b?.sessionPayment?.status==='paid';
 const paymentDue=b=>stateOf(b)==='accepted'&&!!b.sessionPayment&&!['paid','refund_pending','refunded','not_charged'].includes(b.sessionPayment.status);
 // Accepts "14:30", "2:30 PM", "02:30 pm".
 function minutes(time){const m=String(time||'').trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);if(!m)return null;let h=Number(m[1]);const mm=Number(m[2]);if(m[3]){if(h<1||h>12)return null;h=h%12+(/pm/i.test(m[3])?12:0);}if(h>23||mm>59)return null;return h*60+mm;}
 function startOf(date,time){const mins=minutes(time);if(!/^\d{4}-\d{2}-\d{2}$/.test(String(date))||mins===null)return null;const d=new Date(date+'T00:00:00');if(Number.isNaN(d.getTime()))return null;d.setMinutes(mins);return d;}
 const err=(en,ar,field)=>Object.assign(Error(lang()==='ar'?ar:en),{en,ar,field});
 function validateSlot(date,time,now=new Date()){
  if(!date)throw err('Choose a date.','اختاروا تاريخ.','date');
  if(!time)throw err('Choose a time.','اختاروا وقت.','time');
  const at=startOf(date,time);if(!at)throw err('This date or time is not valid.','التاريخ أو الوقت مش صحيح.','date');
  if(at.getTime()<=now.getTime())throw err('Choose a time in the future.','اختاروا وقت بالمستقبل.','date');
  return at;
 }
 // ---------- Notifications (in-app only; nothing is sent outside this browser) ----------
 function notifyParent(b,kind,title,message,storage=localStorage){
  try{const list=JSON.parse(storage.getItem('rafiqNotifications')||'[]');const rows=Array.isArray(list)?list:[];const sourceId='appt_'+kind+'_'+b.id+'_'+(b.history?.length||0);if(rows.some(n=>n.sourceId===sourceId))return;
   rows.unshift({id:'notification_'+Date.now()+'_'+Math.random().toString(36).slice(2,7),sourceId,type:kind==='report'?'report':'booking',title:title.en,titleAr:title.ar,message:message.en,messageAr:message.ar,link:'bookings.html?booking='+encodeURIComponent(b.id),childId:b.childId,bookingId:b.id,read:false,createdAt:nowIso()});storage.setItem('rafiqNotifications',JSON.stringify(rows.slice(0,200)));}catch{/* Notifications never block the change itself. */}
 }
 function notifySpecialist(b,kind,title,message,storage=localStorage){
  try{const key='rafiqSpecialistNotifications_'+b.specialistId,list=JSON.parse(storage.getItem(key)||'[]'),rows=Array.isArray(list)?list:[];const id='appt_'+kind+'_'+b.id+'_'+(b.history?.length||0);if(rows.some(n=>n.id===id))return;
   rows.push({id,type:'booking',title:title.en,titleAr:title.ar,message:message.en,messageAr:message.ar,bookingId:b.id,read:false,createdAt:nowIso(),destination:'booking-details.html'});storage.setItem(key,JSON.stringify(rows));}catch{/* Same as above. */}
 }
 const when=b=>(b.date||'')+' · '+(b.time||'');
 // ---------- Request ----------
 let inFlight=false;
 function request({child,specialist,consultationType,date,time,note='',parentId=null,createdBy=null},storage=localStorage){
  if(inFlight)throw err('Your request is already being sent.','طلبكم عم ينبعت.','submit');
  inFlight=true;
  try{
   if(!child?.id)throw err('Choose the child receiving the session.','اختاروا الطفل اللي رح ياخد الجلسة.','child');
   if(!specialist?.id||specialist.status!=='approved')throw err('This specialist is not available for requests.','هالمختص مش متاح للطلبات.','specialist');
   const types=Array.isArray(specialist.consultationTypes)&&specialist.consultationTypes.length?specialist.consultationTypes:['online'];
   if(!types.includes(consultationType))throw err('Choose a session type this specialist offers.','اختاروا نوع جلسة بيقدّمه المختص.','type');
   validateSlot(date,time);
   const text=String(note||'').trim();if(text.length>500)throw err('Keep the note under 500 characters.','خلّوا الملاحظة أقل من ٥٠٠ حرف.','note');
   const rows=read(storage);
   if(rows.some(b=>b.childId===child.id&&b.specialistId===specialist.id&&b.date===date&&b.time===time&&['pending','accepted','reschedule_proposed'].includes(stateOf(b))))throw err('This child already has a request for this time.','هالطفل عنده طلب لهالوقت.','duplicate');
   if(rows.some(b=>b.childId===child.id&&b.specialistId===specialist.id&&stateOf(b)==='pending'))throw err('You already have a pending request with this specialist for this child. Wait for a reply or cancel it first.','عندكم طلب بانتظار الرد مع هالمختص لهالطفل. استنّوا الرد أو الغوه أول.','duplicate');
   const price=Number(specialist.price);const at=nowIso();
   const b={id:'RFQ-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase(),status:'requested',childId:child.id,childName:child.name,parentId:parentId||child.parentId||null,createdBy:createdBy||parentId||null,
    specialistId:specialist.id,specialistName:specialist.fullName||specialist.name,specialty:specialist.specialty||'',consultationType,date,dateLabel:date,time,durationMinutes:60,reason:text,
    price:Number.isFinite(price)?price:null,currency:specialist.currency||'JOD',requestedAt:at,createdAt:at,updatedAt:at,isDemo:!!(child.isDemo||specialist.isDemo),
    sessionPayment:Number.isFinite(price)?{status:'pending',amount:price,currency:specialist.currency||'JOD',payoutStatus:'not_due',isDemo:true}:null,
    history:[{at,by:'parent',action:'requested',date,time}]};
   rows.unshift(b);write(rows,storage);
   notifyParent(b,'requested',p('Request sent','انبعت الطلب'),p('Your request to '+b.specialistName+' for '+b.childName+' is waiting for a reply ('+when(b)+').','طلبكم لـ'+b.specialistName+' عن '+b.childName+' بانتظار الرد ('+when(b)+').'),storage);
   return b;
  }finally{inFlight=false;}
 }
 // ---------- Transitions ----------
 const allowed={
  accept:{by:'specialist',from:['pending']},reject:{by:'specialist',from:['pending']},propose:{by:'specialist',from:['pending','accepted']},complete:{by:'specialist',from:['accepted']},
  cancel:{by:'parent',from:['pending','accepted','reschedule_proposed']},acceptProposal:{by:'parent',from:['reschedule_proposed']},declineProposal:{by:'parent',from:['reschedule_proposed']},pay:{by:'parent',from:['accepted']}
 };
 function act(id,action,{actor,specialistId=null,childIds=null,reason='',date=null,time=null,note='',payment=null}={},storage=localStorage){
  const rule=allowed[action];if(!rule)throw err('Unknown action.','إجراء غير معروف.');
  if(actor!==rule.by)throw err('This action is not available for your role.','هالإجراء مش متاح لدوركم.');
  const rows=read(storage),b=rows.find(x=>x.id===id);if(!b)throw err('This appointment was not found. Reload and try again.','ما لقينا الموعد. حدّثوا الصفحة وجرّبوا.');
  if(actor==='specialist'&&b.specialistId!==specialistId)throw err('This request belongs to another specialist.','هالطلب لمختص ثاني.');
  if(actor==='parent'&&Array.isArray(childIds)&&!childIds.includes(b.childId))throw err('This appointment belongs to another family.','هالموعد لعيلة ثانية.');
  const state=stateOf(b);if(!rule.from.includes(state))throw err('This appointment changed. Reload to see its current status.','الموعد تغيّر. حدّثوا الصفحة لتشوفوا حالته.');
  const at=nowIso(),entry={at,by:actor,action};b.history=Array.isArray(b.history)?b.history:[];
  const text=String(reason||note||'').trim().slice(0,500);
  if(action==='accept'){b.status='confirmed';b.acceptedAt=at;if(b.sessionPayment&&b.sessionPayment.status==='pending')b.sessionPayment.status='due';}
  if(action==='reject'){b.status='cancelled';b.cancelledBy='specialist';b.cancelledAt=at;b.declinedAt=at;b.declineReason=text;if(b.sessionPayment&&!isPaid(b)){b.sessionPayment.status='not_charged';b.sessionPayment.payoutStatus='not_due';}entry.reason=text;}
  if(action==='propose'){validateSlot(date,time);if(date===b.date&&time===b.time)throw err('Choose a different date or time.','اختاروا تاريخ أو وقت مختلف.','date');b.proposal={date,time,note:text,proposedAt:at,previous:{date:b.date,time:b.time,status:b.status}};b.status='reschedule_proposed';Object.assign(entry,{date,time,reason:text});}
  if(action==='complete'){b.status='completed';b.completedAt=at;ensureConsultation(b,storage);}
  if(action==='cancel'){b.status='cancelled';b.cancelledBy='parent';b.cancelledAt=at;b.cancelReason=text;if(b.sessionPayment&&!isPaid(b)){b.sessionPayment.status='not_charged';b.sessionPayment.payoutStatus='not_due';}entry.reason=text;}
  if(action==='acceptProposal'){const pr=b.proposal;validateSlot(pr.date,pr.time);b.date=pr.date;b.dateLabel=pr.date;b.time=pr.time;b.status='confirmed';b.acceptedAt=at;b.proposal={...pr,acceptedAt:at};if(b.sessionPayment&&b.sessionPayment.status==='pending')b.sessionPayment.status='due';Object.assign(entry,{date:pr.date,time:pr.time});}
  if(action==='declineProposal'){b.status='cancelled';b.cancelledBy='parent';b.cancelledAt=at;b.cancelReason='Declined the proposed time';b.proposal={...b.proposal,declinedAt:at};if(b.sessionPayment&&!isPaid(b)){b.sessionPayment.status='not_charged';b.sessionPayment.payoutStatus='not_due';}}
  if(action==='pay'){if(!payment||payment.status!=='paid')throw err('The demo payment was not completed.','الدفع التجريبي ما اكتمل.');b.sessionPayment={...(b.sessionPayment||{}),...payment,status:'paid',payoutStatus:'held'};b.paidAt=at;}
  b.updatedAt=at;b.history.push(entry);write(rows,storage);
  const who=b.specialistName||'The specialist',child=b.childName||'';
  const messages={
   accept:[p('Request accepted','انقبل الطلب'),p(who+' accepted the session for '+child+' ('+when(b)+'). Confirm with the demo payment.',who+' قبل جلسة '+child+' ('+when(b)+'). أكّدوا بالدفع التجريبي.')],
   reject:[p('Request not accepted','الطلب ما انقبل'),p(who+' could not take the request for '+child+'.'+(text?' Note: '+text:''),who+' ما قدر ياخد طلب '+child+'.'+(text?' ملاحظة: '+text:''))],
   propose:[p('New time proposed','في موعد جديد مقترح'),p(who+' suggested '+date+' · '+time+' for '+child+'.',who+' اقترح '+date+' · '+time+' لـ'+child+'.')],
   complete:[p('Session completed','الجلسة خلصت'),p('The session with '+who+' for '+child+' is marked completed. The report will follow.','جلسة '+child+' مع '+who+' انعلّمت مكتملة. التقرير جاي.')]
  };
  if(messages[action])notifyParent(b,action,...messages[action],storage);
  const toSpecialist={
   cancel:[p('Appointment cancelled by the family','العيلة ألغت الموعد'),p(child+' · '+when(b),child+' · '+when(b))],
   acceptProposal:[p('Family accepted the new time','العيلة قبلت الموعد الجديد'),p(child+' · '+when(b),child+' · '+when(b))],
   declineProposal:[p('Family declined the new time','العيلة رفضت الموعد الجديد'),p(child+' · the request is now closed.',child+' · الطلب انسكّر.')],
   pay:[p('Session confirmed with demo payment','الجلسة تأكدت بالدفع التجريبي'),p(child+' · '+when(b),child+' · '+when(b))]
  };
  if(toSpecialist[action])notifySpecialist(b,action,...toSpecialist[action],storage);
  if(action==='acceptProposal')notifyParent(b,action,p('New time confirmed','الموعد الجديد تأكد'),p('You accepted '+when(b)+' with '+who+'.','قبلتوا '+when(b)+' مع '+who+'.'),storage);
  if(action==='declineProposal')notifyParent(b,action,p('Proposed time declined','رفضتوا الموعد المقترح'),p('The request with '+who+' is closed. You can request another time.','الطلب مع '+who+' انسكّر. بتقدروا تطلبوا وقت ثاني.'),storage);
  if(action==='cancel')notifyParent(b,action,p('Appointment cancelled','انلغى الموعد'),p('You cancelled the appointment with '+who+' for '+child+'.','ألغيتوا موعد '+child+' مع '+who+'.'),storage);
  return b;
 }
 // Same workspace shape as consultation.js, so report-form.js can open the completed session.
 function ensureConsultation(b,storage=localStorage){
  try{const list=JSON.parse(storage.getItem('rafiqConsultations')||'[]'),rows=Array.isArray(list)?list:[];const existing=rows.find(c=>c.bookingId===b.id&&c.specialistId===b.specialistId);const at=b.completedAt||nowIso();
   if(existing){existing.status='completed';existing.completedAt=existing.completedAt||at;existing.updatedAt=at;}
   else rows.push({id:'consultation_'+Date.now(),bookingId:b.id,specialistId:b.specialistId,childId:b.childId,childName:b.childName,status:'completed',sessionNotes:'',observations:'',nextSteps:'',createdAt:at,updatedAt:at,completedAt:at,markedCompletedOutsideRoom:true});
   storage.setItem('rafiqConsultations',JSON.stringify(rows));}catch{/* Report form shows its own empty state if this fails. */}
 }
 function reportFor(b,storage=localStorage){try{const rows=JSON.parse(storage.getItem('rafiqSpecialistReports')||'[]');return (Array.isArray(rows)?rows:[]).find(r=>r.bookingId===b.id&&r.childId===b.childId&&r.specialistId===b.specialistId&&r.status==='submitted')||null;}catch{return null;}}
 // ---------- Transparent recommendation rules ----------
 // Uses only what the family entered (support questions, story goals). Never a diagnosis.
 const specialtyNames={speech:p('Speech and language specialists','مختصّو النطق واللغة'),development:p('Child development specialists','مختصّو نمو الطفل'),psychology:p('Child and family psychologists','مختصّو علم نفس الطفل والعيلة'),pediatrician:p('Child health (paediatric) specialists','مختصّو صحة الطفل')};
 const priorityMap={speech:'speech',behaviour:'psychology',sleep:'psychology',feeding:'pediatrician',health:'pediatrician',growth:'development',play:'development'};
 function recommend(child){
  const out=new Map(),add=(key,reason,weight)=>{if(!specialtyNames[key])return;const r=out.get(key)||{specialty:key,score:0,reasons:[]};r.score+=weight;if(!r.reasons.some(x=>x.en===reason.en))r.reasons.push(reason);out.set(key,r);};
  const d=child?.supportDiscovery,catalog=window.RafiqSupportCatalog;
  if(d&&catalog){
   const topicTitle=id=>catalog.topics.find(t=>t.id===id)?.title;
   for(const id of [...(d.diagnosed||[]),...(d.topics||[])]){const topic=catalog.topics.find(t=>t.id===id);if(topic){const title=topicTitle(id);add(topic.specialty,p('You chose “'+title.en+'” in the support questions.','اخترتوا «'+title.ar+'» بأسئلة الدعم.'),(d.diagnosed||[]).includes(id)?3:2);}}
   for(const pr of d.priorities||[]){const key=priorityMap[pr];if(key)add(key,p('It is one of the priorities you picked.','هاد من الأولويات اللي اخترتوها.'),3);}
  }
  const list=[...out.values()].sort((a,b)=>b.score-a.score);
  if(list.length){const months=window.RafiqSetup?.childContext?.(child)?.chronological?.totalMonths;if(Number.isFinite(months)&&months<24&&!out.has('pediatrician'))list.push({specialty:'pediatrician',score:0,reasons:[p('Under 2 years, a child health check-in can be a useful first step.','تحت عمر السنتين، مراجعة صحة الطفل ممكن تكون خطوة أولى مفيدة.')]});}
  return list.slice(0,3).map(r=>({...r,title:specialtyNames[r.specialty]}));
 }
 window.RafiqAppointments={STATES,labels,help,stateOf,read,write,request,act,validateSlot,startOf,minutes,isPaid,paymentDue,reportFor,recommend,specialtyNames,ensureConsultation,todayKey:()=>ymd(new Date()),t,p};
})();
