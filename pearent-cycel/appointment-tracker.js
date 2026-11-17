/* Phase 5 parent tracker for My appointments: exact status, a short progress line and the one
   next action that fits (cancel, answer a proposed time, confirm with demo payment, read the
   report, request again). Changes go through RafiqAppointments only. Load before bookings.js. */
(() => {
 'use strict';
 const A=()=>window.RafiqAppointments,p=(en,ar)=>({en,ar});
 const lang=()=>document.documentElement.lang==='ar'?'ar':'en',t=v=>v[lang()];
 const copy={
  steps:[p('Requested','انطلب'),p('Specialist reply','رد المختص'),p('Session','الجلسة'),p('Report','التقرير')],
  proposed:p('Proposed time','الوقت المقترح'),note:p('Specialist’s note','ملاحظة المختص'),
  cancel:p('Cancel request','ألغوا الطلب'),cancelAppt:p('Cancel appointment','ألغوا الموعد'),confirmCancel:p('Yes, cancel','أيوه، ألغوا'),keep:p('Keep it','خلّوه'),
  sureCancel:p('Cancel this request? The specialist will see that you cancelled.','نلغي هالطلب؟ المختص رح يشوف إنكم ألغيتوه.'),
  acceptTime:p('Accept new time','اقبلوا الوقت الجديد'),declineTime:p('Decline','ارفضوا'),
  pay:p('Confirm with demo payment','أكّدوا بالدفع التجريبي'),payHelp:p('Simulated payment. No real money is collected.','دفع تجريبي. ما في فلوس حقيقية.'),
  payCancelled:p('Payment was not completed. Your appointment is still accepted; you can confirm later.','الدفع ما اكتمل. الموعد لسه مقبول؛ بتقدروا تأكّدوا بعدين.'),
  report:p('Read the follow-up report','اقرأوا تقرير المتابعة'),reportPending:p('Report not ready yet','التقرير لسه مش جاهز'),
  again:p('Request another time','اطلبوا وقت ثاني'),browse:p('Browse specialists','تصفّحوا المختصين'),
  done:{cancel:p('Cancelled. The specialist can see this change.','انلغى. المختص بيشوف هالتغيير.'),acceptProposal:p('New time accepted. Confirm with the demo payment when ready.','قبلتوا الوقت الجديد. أكّدوا بالدفع التجريبي لما تكونوا جاهزين.'),declineProposal:p('You declined the new time. The request is closed.','رفضتوا الوقت الجديد. الطلب انسكّر.'),pay:p('Confirmed. The session is booked (demo).','تأكدت الجلسة (عرض).')},
  demo:p('Demo: nothing is emailed or texted. Updates show here and in your notifications.','عرض: ما في إيميل ولا رسائل. التحديثات بتظهر هون وبالإشعارات.')
 };
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
 // A notification link (bookings.html?booking=ID) opens the right child first.
 try{const id=new URLSearchParams(location.search).get('booking');if(id&&window.RafiqFamily&&window.RafiqSetup){const b=JSON.parse(localStorage.getItem('rafiqBookings')||'[]').find(x=>x?.id===id);if(b&&window.RafiqSetup.readChildren().some(c=>c.id===b.childId)&&window.RafiqFamily.selected()!==b.childId)window.RafiqFamily.select(b.childId);}}catch{/* Opens the selected child as before. */}
 const childIds=()=>{try{return window.RafiqSetup.readChildren().map(c=>c.id);}catch{return [];}};
 const flash=new Map();
 function changed(id,message){if(message)flash.set(id,message);window.dispatchEvent(new Event('rafiq:appointments-changed'));}
 function run(id,action,extra={}){try{A().act(id,action,{actor:'parent',childIds:childIds(),...extra});changed(id,t(copy.done[action]));}catch(e){changed(id,e.message);}}
 function progress(state,hasReport){
  const idx={pending:1,reschedule_proposed:1,accepted:2,completed:hasReport?4:3}[state];if(idx==null)return null;
  const ol=el('ol','appt-steps');copy.steps.forEach((s,i)=>{const li=el('li',i<idx?'is-done':i===idx?'is-current':'',t(s));if(i===idx)li.setAttribute('aria-current','step');ol.append(li);});return ol;
 }
 function button(label,cls,fn){const b=el('button','appt-btn '+cls,label);b.type='button';b.addEventListener('click',fn);return b;}
 function confirmCancel(id,actions,label){actions.replaceChildren(el('p','appt-ask',t(copy.sureCancel)),button(t(copy.confirmCancel),'is-danger',()=>run(id,'cancel')),button(t(copy.keep),'is-ghost',()=>paint()));actions.querySelector('.is-danger').focus();}
 function render(mount,b){
  const state=A().stateOf(b),report=state==='completed'?A().reportFor(b):null;mount.replaceChildren();mount.dataset.noTranslate='';mount.dataset.state=state;
  const steps=progress(state,!!report);if(steps)mount.append(steps);
  const help=state==='accepted'&&A().isPaid(b)?A().help.acceptedPaid:A().help[state];mount.append(el('p','appt-help',t(help)));
  if(state==='reschedule_proposed'&&b.proposal){const box=el('div','appt-proposal');box.append(el('strong',undefined,t(copy.proposed)),el('span',undefined,b.proposal.date+' · '+b.proposal.time));if(b.proposal.note){const n=el('p',undefined,b.proposal.note);n.setAttribute('data-user-content','');box.append(n);}mount.append(box);}
  if(state==='rejected'&&b.declineReason){const n=el('p','appt-reason');n.append(el('strong',undefined,t(copy.note)+': '));const r=el('span',undefined,b.declineReason);r.setAttribute('data-user-content','');n.append(r);mount.append(n);}
  const actions=el('div','appt-actions');
  if(state==='pending')actions.append(button(t(copy.cancel),'is-ghost',()=>confirmCancel(b.id,actions)));
  if(state==='reschedule_proposed')actions.append(button(t(copy.acceptTime),'is-primary',()=>run(b.id,'acceptProposal')),button(t(copy.declineTime),'is-ghost',()=>run(b.id,'declineProposal')));
  if(state==='accepted'){
   if(A().paymentDue(b)){const pay=button(t(copy.pay),'is-primary',async()=>{pay.disabled=true;try{const payment=await window.RafiqFinance?.checkout(Number(b.price),{Child:b.childName,Specialist:b.specialistName,Date:b.date,Time:b.time});if(!payment){changed(b.id,t(copy.payCancelled));return;}run(b.id,'pay',{payment});}finally{pay.disabled=false;}});actions.append(pay,el('small','appt-small',t(copy.payHelp)));}
   actions.append(button(t(copy.cancelAppt),'is-ghost',()=>confirmCancel(b.id,actions)));
  }
  if(state==='completed'){if(report){const a=el('a','appt-btn is-primary',t(copy.report));a.href='specialist-report.html';a.dataset.reportBooking=b.id;actions.append(a);}else actions.append(el('span','appt-small',t(copy.reportPending)));}
  if(state==='rejected'||state==='cancelled'){const again=el('a','appt-btn is-primary',t(copy.again));again.href='specialist-profile.html?specialist='+encodeURIComponent(b.specialistId);const browse=el('a','appt-btn is-ghost',t(copy.browse));browse.href='specialists.html';actions.append(again,browse);}
  if(actions.childNodes.length)mount.append(actions);
  const msg=el('p','appt-status');msg.setAttribute('role','status');if(flash.has(b.id)){msg.textContent=flash.get(b.id);flash.delete(b.id);}mount.append(msg);
 }
 function paint(){
  if(!A())return;const rows=A().read();
  document.querySelectorAll('[data-appt-state]').forEach(badge=>{const b=rows.find(x=>x.id===badge.dataset.apptState);if(!b)return;const state=A().stateOf(b);badge.dataset.noTranslate='';badge.textContent=t(A().labels[state]);badge.classList.add('state-'+state);});
  document.querySelectorAll('[data-appt]').forEach(mount=>{const b=rows.find(x=>x.id===mount.dataset.appt);if(b)render(mount,b);});
  const focus=new URLSearchParams(location.search).get('booking'),card=focus&&document.querySelector('[data-appt="'+CSS.escape(focus)+'"]')?.closest('.booking-card');if(card&&!card.classList.contains('is-focus')){card.classList.add('is-focus');card.scrollIntoView({block:'center'});}
  let note=document.getElementById('apptDemoNote');const list=document.getElementById('bookingsList');if(list&&!note){note=el('p','appt-demo-note');note.id='apptDemoNote';note.dataset.noTranslate='';list.before(note);}if(note)note.textContent=t(copy.demo);
 }
 new MutationObserver(paint).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 window.RafiqAppointmentTracker={paint,copy};
})();
