document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const get=id=>document.getElementById(id),service=window.RafiqMeetingRoom,id=new URLSearchParams(location.search).get('booking');
 let api=null,loading=false,loader=null,current=null;
 const status=text=>get('roomStatus').textContent=text;
 function dispose(){if(api){const instance=api;api=null;instance.dispose();}get('meet').hidden=true;}
 function validate(){
  current=service.appointment(id);const access=service.availability(current.booking);if(!access.allowed)throw Error(access.message);return current;
 }
 function left(){dispose();get('afterSession').hidden=false;get('joinPanel').hidden=false;get('joinRoom').disabled=!get('videoConsent').checked;status('You have left the video room. You may rejoin while the appointment is still open.');}
 function load(){
  if(window.JitsiMeetExternalAPI)return Promise.resolve();if(loader)return loader;
  loader=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://meet.jit.si/external_api.js';script.referrerPolicy='no-referrer';const timer=setTimeout(()=>{script.remove();loader=null;reject(Error('The video service did not respond. Check your connection and retry.'));},15000);script.onload=()=>{clearTimeout(timer);resolve();};script.onerror=()=>{clearTimeout(timer);script.remove();loader=null;reject(Error('The video service could not load. Check your connection and retry.'));};document.head.append(script);});return loader;
 }
 try{
  current=service.appointment(id);const b=current.booking,parent=current.role==='parent';
  get('backLink').href=parent?'../pearent-cycel/bookings.html?booking='+encodeURIComponent(id):'../specialist-cycle/booking-details.html';
  get('nextStep').href=parent?get('backLink').href:'../specialist-cycle/consultation.html';
  if(!parent)sessionStorage.setItem('rafiqSelectedSpecialistBooking',id);
  get('appointmentInfo').textContent=(b.specialistName||'Specialist')+' · '+(b.dateLabel||b.date)+' · '+b.time;
  const access=service.availability(b);status(access.message);get('joinPanel').hidden=!access.allowed;
 }catch(error){status(error.message);return;}
 get('videoConsent').addEventListener('change',()=>{get('joinRoom').disabled=!get('videoConsent').checked||loading||!!api;get('openExternal').hidden=!get('videoConsent').checked||!get('openExternal').href;});
 get('joinRoom').addEventListener('click',async()=>{
  if(loading||api||!get('videoConsent').checked)return;loading=true;get('joinRoom').disabled=true;
  try{
   const room=service.room(id);get('openExternal').href='https://meet.jit.si/'+encodeURIComponent(room.roomName);get('openExternal').hidden=false;status('Connecting to the video service…');await load();validate();
   get('meet').hidden=false;get('afterSession').hidden=true;get('openExternal').href='https://meet.jit.si/'+encodeURIComponent(room.roomName);get('openExternal').hidden=false;
   api=new window.JitsiMeetExternalAPI('meet.jit.si',{roomName:room.roomName,width:'100%',height:'100%',parentNode:get('meet'),userInfo:{displayName:room.role==='parent'?'Parent':'Specialist'},configOverwrite:{startWithAudioMuted:true,startWithVideoMuted:true,prejoinConfig:{enabled:true}}});
   api.addListener('videoConferenceJoined',()=>{status('You joined the video room.');get('joinPanel').hidden=true;});
   api.addListener('readyToClose',left);
   api.addListener('cameraError',()=>status('Camera access is unavailable. Check browser permissions; audio may still be available.'));
   api.addListener('micError',()=>status('Microphone access is unavailable. Check browser permissions.'));
   api.addListener('errorOccurred',()=>status('The video service reported a problem. Try opening the same room in a new tab.'));
   status('The video service is open. Complete its pre-join steps or wait for the host.');
  }catch(error){dispose();status(error.message);try{validate();get('joinPanel').hidden=false;}catch{get('joinPanel').hidden=true;get('openExternal').hidden=true;}} 
  finally{loading=false;get('joinRoom').disabled=!!api||!get('videoConsent').checked;}
 });
 get('openExternal').addEventListener('click',event=>{try{validate();if(!get('videoConsent').checked)throw Error('Choose to connect before opening the room.');}catch(error){event.preventDefault();status(error.message);}});
 function recheck(){try{validate();}catch(error){dispose();get('joinPanel').hidden=true;get('openExternal').hidden=true;status(error.message);}}
 window.addEventListener('storage',event=>{if(event.key===null||['rafiqBookings','rafiqSpecialists','rafiqChildren'].includes(event.key))recheck();});
 window.addEventListener('pagehide',dispose);window.addEventListener('focus',recheck);
});
