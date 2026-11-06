(()=>{'use strict';
 function render(mount,booking,role){
  mount.replaceChildren();mount.className='session-next-actions';
  const make=(tag,text)=>{const e=document.createElement(tag);if(text)e.textContent=text;return e;};
  const link=(text,url)=>{const a=make('a',text);a.href=url;return a;};
  if(booking.status==='cancelled'){mount.append(make('p','This appointment is cancelled. Choose another appointment if you still need support.'));return;}
  if(booking.status==='completed'){
   let records;try{records=JSON.parse(localStorage.getItem('rafiqSpecialistReports')||'[]');if(!Array.isArray(records))throw Error('Invalid reports');}catch{mount.append(make('p','Reports could not be read. Reload the appointment and try again.'));return;}
   const report=records.find(r=>r.bookingId===booking.id&&r.childId===booking.childId&&r.specialistId===booking.specialistId&&r.status==='submitted');
   mount.append(make('strong',report?'Session completed · report ready':'Session completed · report pending'));
   if(role==='parent'){
    if(report){const a=link('Read report and record my follow-up','specialist-report.html');a.addEventListener('click',()=>{sessionStorage.setItem('rafiqSelectedReportBooking',booking.id);(window.RafiqFamily ? window.RafiqFamily.select(booking.childId) : localStorage.setItem('rafiqCurrentChildId',booking.childId));});mount.append(a);}
    else mount.append(make('p','Your specialist’s report will appear after they submit it. You can send a message if you have a question.'));
   }else{const a=link(report?'Review submitted report':'Write the session report','report-form.html');a.addEventListener('click',()=>sessionStorage.setItem('rafiqSelectedSpecialistBooking',booking.id));mount.append(a);}
   return;
  }
  const calendarButton=make('button','Add appointment to my calendar');calendarButton.type='button';calendarButton.addEventListener('click',()=>{
 try{const latest=window.RafiqMeetingRoom.appointment(booking.id).booking;if(['cancelled','completed'].includes(latest.status))throw Error('This appointment is no longer open.');const match=String(latest.time||'').match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);if(!match||!/^\d{4}-\d{2}-\d{2}$/.test(latest.date))throw Error('Check the appointment date and time.');let hour=Number(match[1]);if(match[3])hour=hour%12+(/pm/i.test(match[3])?12:0);const start=new Date(latest.date+'T'+String(hour).padStart(2,'0')+':'+match[2]+':00'),end=new Date(start.getTime()+(Number(latest.durationMinutes)||30)*60000);const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const text=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//RAFIQ//Appointments//EN','BEGIN:VEVENT','UID:'+String(latest.id).replace(/[^a-zA-Z0-9_-]/g,'')+'@rafiq.local','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:Rafiq appointment','DESCRIPTION:Open Rafiq appointment details for session access.','BEGIN:VALARM','TRIGGER:-PT15M','ACTION:DISPLAY','DESCRIPTION:Rafiq appointment in 15 minutes','END:VALARM','END:VEVENT','END:VCALENDAR',''].join('\r\n');const url=URL.createObjectURL(new Blob([text],{type:'text/calendar;charset=utf-8'})),a=link('',url);a.download='rafiq-appointment.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }catch(error){const p=make('p',error.message);p.setAttribute('role','status');mount.append(p);}
 });mount.append(calendarButton,make('p','Import the calendar file to set a 15-minute reminder in your calendar app.'));
 const now=new Date(),today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
  mount.append(make('strong',booking.date===today?'Your appointment is today':booking.date<today?'Appointment awaiting completion':'Your appointment is scheduled'));
  if(booking.consultationType==='online'){
   const availability=window.RafiqMeetingRoom.availability(booking);mount.append(make('p',availability.message),link('Open video room',window.RafiqMeetingRoom.url(booking.id)));
  }else mount.append(make('p','Attend at the specialist’s practice. No video room is needed.'));
  if(role==='specialist'&&location.pathname.endsWith('/booking-details.html')){const a=link('Open consultation workspace','consultation.html');a.addEventListener('click',()=>sessionStorage.setItem('rafiqSelectedSpecialistBooking',booking.id));mount.append(a);}
 }
 window.RafiqAppointmentUI={render};
})();
