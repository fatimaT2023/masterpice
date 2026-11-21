/* Phase 5 specialist actions on booking details, through the shared lifecycle:
   propose another time, mark an accepted session completed (creates the consultation record
   the report form needs), and clear states for waiting / awaiting demo payment / report.
   Accept and decline stay in the existing request card (specialist-practice.js). */
(() => {
 'use strict';
 const p=(en,ar)=>({en,ar}),lang=()=>document.documentElement.lang==='ar'?'ar':'en',t=v=>v[lang()];
 const copy={
  title:p('Next steps for this session','الخطوات الجاية لهالجلسة'),
  propose:p('Propose another time','اقترحوا وقت ثاني'),proposeHelp:p('The family can accept or decline. Demo: no email is sent.','العيلة بتقدر تقبل أو ترفض. عرض: ما في إيميل.'),
  date:p('Date','التاريخ'),time:p('Time','الوقت'),note:p('Note to the family (optional)','ملاحظة للعيلة (اختياري)'),send:p('Send proposal','ابعتوا الاقتراح'),
  waiting:p('You proposed {0}. Waiting for the family to answer.','اقترحتوا {0}. بانتظار رد العيلة.'),
  paid:p('The family confirmed with the demo payment.','العيلة أكّدت بالدفع التجريبي.'),due:p('Accepted. Waiting for the family’s demo payment to confirm.','مقبول. بانتظار الدفع التجريبي من العيلة للتأكيد.'),
  complete:p('Mark session completed','علّموا الجلسة مكتملة'),completeAsk:p('Mark this session as completed? You can then write the follow-up report.','نعلّم الجلسة مكتملة؟ بعدها بتقدروا تكتبوا تقرير المتابعة.'),yes:p('Yes, completed','أيوه، مكتملة'),no:p('Not yet','لسه'),
  demoComplete:p('Demo: you can mark it completed before the session time.','عرض: بتقدروا تعلّموها مكتملة قبل وقت الجلسة.'),
  write:p('Write the follow-up report','اكتبوا تقرير المتابعة'),view:p('View the submitted report','شوفوا التقرير المرسل'),sent:p('Report sent to the family.','التقرير انبعت للعيلة.'),
  done:{propose:p('Proposal sent. The family will see it in My appointments.','الاقتراح انبعت. العيلة بتشوفه بمواعيدها.'),complete:p('Session marked completed. Write the follow-up report next.','الجلسة انعلّمت مكتملة. اكتبوا تقرير المتابعة.')}
 };
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
 const A=()=>window.RafiqAppointments,sid=()=>window.RafiqSpecialistAccess?.profile?.id;
 const bookingId=()=>new URLSearchParams(location.search).get('booking')||sessionStorage.getItem('rafiqSelectedSpecialistBooking');
 function current(){if(!A())return null;return A().read().find(b=>b.id===bookingId()&&b.specialistId===sid())||null;}
 function act(action,extra,msg){try{A().act(bookingId(),action,{actor:'specialist',specialistId:sid(),...extra});sessionStorage.setItem('rafiqSpecialistFlash',t(copy.done[action]));location.reload();}catch(e){msg.textContent=e.message;msg.dataset.tone='error';}}
 function button(label,cls,fn){const b=el('button','practice-btn '+cls,label);b.type='button';b.addEventListener('click',fn);return b;}
 function proposeForm(b,open){
  const d=el('details','sa-propose');d.open=!!open;d.append(el('summary',undefined,t(copy.propose)));
  const form=el('form','sa-form');form.noValidate=true;const dl=el('label',undefined,t(copy.date)),di=el('input');di.type='date';di.id='saDate';di.required=true;const tomorrow=new Date(Date.now()+864e5);di.min=A().todayKey();di.value=[tomorrow.getFullYear(),String(tomorrow.getMonth()+1).padStart(2,'0'),String(tomorrow.getDate()).padStart(2,'0')].join('-');dl.htmlFor=di.id;
  const tl=el('label',undefined,t(copy.time)),ts=el('select');ts.id='saTime';for(let h=8;h<=18;h++){const v=String(h).padStart(2,'0')+':00',o=el('option',undefined,v);o.value=v;ts.append(o);}ts.value='10:00';tl.htmlFor=ts.id;
  const nl=el('label',undefined,t(copy.note)),na=el('textarea');na.id='saNote';na.rows=2;na.maxLength=500;nl.htmlFor=na.id;
  const msg=el('p','sa-msg');msg.setAttribute('role','status');
  form.append(el('p','sa-help',t(copy.proposeHelp)),dl,di,tl,ts,nl,na,button(t(copy.send),'primary',()=>form.requestSubmit()),msg);
  form.addEventListener('submit',e=>{e.preventDefault();act('propose',{date:di.value,time:ts.value,note:na.value},msg);});
  d.append(form);return d;
 }
 function render(){
  const b=current();if(!b)return;const state=A().stateOf(b);
  const hero=document.getElementById('heroStatus');if(hero){hero.dataset.noTranslate='';hero.textContent=t(A().labels[state]);hero.dataset.state=state;}
  if(['rejected','cancelled'].includes(state))return;
  let panel=document.getElementById('specialistNextSteps');if(!panel){panel=el('section','sa-panel');panel.id='specialistNextSteps';panel.dataset.noTranslate='';const anchor=document.getElementById('consultationActionCard');(anchor||document.getElementById('detailsView'))?.after(panel);}
  panel.replaceChildren(el('h3',undefined,t(copy.title)));
  const msg=el('p','sa-msg');msg.setAttribute('role','status');const flash=sessionStorage.getItem('rafiqSpecialistFlash');if(flash){msg.textContent=flash;sessionStorage.removeItem('rafiqSpecialistFlash');}
  if(state==='pending')panel.append(proposeForm(b,false));
  if(state==='reschedule_proposed')panel.append(el('p','sa-state',t(copy.waiting).replace('{0}',b.proposal.date+' · '+b.proposal.time)));
  if(state==='accepted'){
   panel.append(el('p','sa-state',t(A().isPaid(b)?copy.paid:copy.due)));
   const row=el('div','sa-row');const complete=button(t(copy.complete),'primary',()=>{row.replaceChildren(el('p','sa-ask',t(copy.completeAsk)),button(t(copy.yes),'primary',()=>act('complete',{},msg)),button(t(copy.no),'ghost',render));});complete.id='saComplete';
   row.append(complete,el('small','sa-help',t(copy.demoComplete)));panel.append(row,proposeForm(b,false));
  }
  if(state==='completed'){const report=A().reportFor(b);const a=el('a','practice-btn '+(report?'ghost':'primary'),t(report?copy.view:copy.write));a.href='report-form.html';a.id='saReport';a.addEventListener('click',()=>sessionStorage.setItem('rafiqSelectedSpecialistBooking',b.id));if(report)panel.append(el('p','sa-state',t(copy.sent)));panel.append(a);}
  panel.append(msg);
 }
 document.addEventListener('DOMContentLoaded',()=>{if(!document.getElementById('detailsView'))return;render();new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});});
 window.RafiqSpecialistAppointments={render,copy};
})();
