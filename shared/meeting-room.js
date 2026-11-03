/* Local appointment checks. Real deployments must issue server-authorized room tokens. */
(()=>{'use strict';
 const read=key=>{const value=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(value))throw Error('Appointment data could not be read.');return value;};
 function appointment(id){
  const booking=read('rafiqBookings').find(b=>b.id===id);if(!booking)throw Error('Appointment not found.');
  const role=sessionStorage.getItem('rafiqRole');
  const account=window.RafiqAccountStatus?.current();if(account&&window.RafiqAccountStatus.inactive(account))throw Error('This account is deactivated. Contact support.');
  if(role==='parent'){
   const parent=sessionStorage.getItem('rafiqParentUserId');
   const child=read('rafiqChildren').find(c=>c.id===booking.childId&&c.parentId===parent);
   if(!parent||!child||(booking.parentId&&booking.parentId!==parent))throw Error('This appointment is not available to your account.');
  }else if(role==='specialist'){
   const specialist=sessionStorage.getItem('rafiqSpecialistId'),profile=read('rafiqSpecialists').find(s=>s.id===specialist&&s.status==='approved'&&s.verificationStatus!=='rejected');
   if(!profile||booking.specialistId!==specialist)throw Error('This appointment is not available to your account.');
  }else throw Error('Sign in to open your appointment.');
  return {booking,role};
 }
 function availability(booking,now=new Date()){
  if(booking.consultationType!=='online')return {allowed:false,message:'This is an in-person appointment. No video room is needed.'};
  if(['cancelled','canceled'].includes(booking.status))return {allowed:false,message:'This appointment was cancelled. The room is closed.'};
  if(booking.status==='completed')return {allowed:false,message:'This session is completed. Return to your appointment to read or prepare the report.'};
  if(!/^\d{4}-\d{2}-\d{2}$/.test(booking.date||''))return {allowed:false,message:'Check the appointment date before joining.'};
  const [y,m,d]=booking.date.split('-').map(Number),start=new Date(y,m-1,d);
  if(start.getFullYear()!==y||start.getMonth()!==m-1||start.getDate()!==d)return {allowed:false,message:'Check the appointment date before joining.'};
  const match=String(booking.time||'').trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if(!match)return {allowed:false,message:'Check the appointment time before joining.'};
  let hour=Number(match[1]);const minute=Number(match[2]);if(minute>59||hour>23||(match[3]&&(hour<1||hour>12)))return {allowed:false,message:'Check the appointment time before joining.'};
  if(match[3])hour=hour%12+(/pm/i.test(match[3])?12:0);start.setHours(hour,minute,0,0);
  const duration=Math.min(180,Math.max(10,Number(booking.durationMinutes)||30)),opens=new Date(start.getTime()-15*60000),closes=new Date(start.getTime()+(duration+60)*60000);
  if(now<opens)return {allowed:false,message:'The room opens 15 minutes before the appointment.',opens};
  if(now>closes)return {allowed:false,message:'The joining window has ended. Contact your specialist if the session needs to be rescheduled.'};
  return {allowed:true,message:'The room is ready. Allow camera and microphone access only when you want to use them.'};
 }
 function room(id,now=new Date()){
  const current=appointment(id),access=availability(current.booking,now);if(!access.allowed)throw Error(access.message);
  const rooms=read('rafiqMeetingRooms');let record=rooms.find(r=>r.bookingId===id);
  if(record&&!/^Rafiq-[a-f0-9-]{36}$/i.test(record.roomName))throw Error('The saved meeting room could not be read.');
  if(!record){record={bookingId:id,roomName:'Rafiq-'+crypto.randomUUID(),createdAt:new Date().toISOString()};rooms.push(record);localStorage.setItem('rafiqMeetingRooms',JSON.stringify(rooms));}
  return {...current,roomName:record.roomName};
 }
 const url=id=>'../meetingZoom/index.html?booking='+encodeURIComponent(id);
 window.RafiqMeetingRoom={appointment,availability,room,url};
})();
