/* Shared booking-to-follow-up context; reads the existing local preview records. */
(()=>{'use strict';
 const read=key=>{try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[];}catch{return [];}};
 const reportFor=booking=>read('rafiqSpecialistReports').find(r=>r.bookingId===booking.id&&r.childId===booking.childId&&r.specialistId===booking.specialistId);
 const belongs=(b,viewer,thread)=>b.childId===thread.childId&&b.specialistId===thread.specialistId&&(viewer.role==='specialist'?b.specialistId===viewer.id:window.RafiqFamily?window.RafiqFamily.canAccessId(b.childId,viewer.id):(!b.parentId||b.parentId===viewer.id));
 function context(viewer,thread,requested){
  const bookings=read('rafiqBookings').filter(b=>belongs(b,viewer,thread));
  const today=new Date();today.setHours(0,0,0,0);
  const upcoming=bookings.filter(b=>!['cancelled','completed'].includes(b.status)&&new Date(b.date+'T23:59:59')>=today).sort((a,b)=>String(a.date+' '+a.time).localeCompare(String(b.date+' '+b.time)));
  const booking=bookings.find(b=>b.id===requested)||upcoming[0]||bookings.sort((a,b)=>String(b.date).localeCompare(String(a.date)))[0];
  return booking?{booking,report:reportFor(booking)}:null;
 }
 function openReport(booking){sessionStorage.setItem('rafiqSelectedReportBooking',booking.id);(window.RafiqFamily ? window.RafiqFamily.select(booking.childId) : localStorage.setItem('rafiqCurrentChildId',booking.childId));}
 function prepareSpecialist(booking){sessionStorage.setItem('rafiqSelectedSpecialistBooking',booking.id);}
 window.RafiqCareJourney={context,reportFor,openReport,prepareSpecialist};
})();

/* Keep the specialist's next task visible while a session is being completed. */
document.addEventListener('DOMContentLoaded',()=>{
 if(!location.pathname.endsWith('/consultation.html'))return;
 const button=document.getElementById('reportButton'),target=document.querySelector('.session-bar');if(!button||!target)return;
 const card=document.createElement('section');card.className='session-next-step';target.before(card);
 function render(){
  let bookings;try{bookings=JSON.parse(localStorage.getItem('rafiqBookings')||'[]');}catch{return;}
  if(!Array.isArray(bookings))return;const id=sessionStorage.getItem('rafiqSelectedSpecialistBooking'),profile=window.RafiqSpecialistAccess?.profile;
  const booking=bookings.find(b=>b.id===id&&b.specialistId===profile?.id);if(!booking){card.hidden=true;return;}
  const report=window.RafiqCareJourney.reportFor(booking),heading=document.createElement('h2'),copy=document.createElement('p');card.replaceChildren();card.hidden=false;
  heading.textContent=report?'Report shared with the family':booking.status==='completed'?'Next: write the session report':'Complete the session, then share your report';
  copy.textContent=report?'The family can read your report from their appointments or conversation.':booking.status==='completed'?'Share the session summary, recommendations and follow-up with the family.':'Save your notes and complete the session before preparing the family report.';card.append(heading,copy);
  if(!button.disabled){const next=document.createElement('button');next.type='button';next.textContent=report?'Open session report':'Write session report';next.addEventListener('click',()=>button.click());card.append(next);}
  const messages=document.createElement('a');messages.href='messages.html?booking='+encodeURIComponent(booking.id);messages.textContent='Open messages';card.append(messages);
 }
 new MutationObserver(render).observe(button,{attributes:true,attributeFilter:['disabled'],childList:true});render();
});
