document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const get=id=>document.getElementById(id);
 try{
  const children=window.RafiqSetup.readChildren(),child=children.find(c=>c.id===localStorage.getItem('rafiqCurrentChildId'))||children[0];
  if(!child){location.replace('onboarding.html');return;}
  if(!child.setupCompletedAt||localStorage.getItem('rafiqSetupPendingChildId')===child.id){location.replace('getting-started.html?child='+encodeURIComponent(child.id));return;}
  localStorage.setItem('rafiqCurrentChildId',child.id);
  get('todayHeading').textContent='Activity with my child';
  get('todayChildContext').textContent=child.name+' · '+window.RafiqSetup.formatAge(window.RafiqSetup.childContext(child).chronological);
  get('todayDate').textContent=new Intl.DateTimeFormat(document.documentElement.lang==='ar'?'ar-JO':'en',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
  get('todayContent').hidden=false;
 }catch{get('todayError').textContent='We couldn’t read your child’s profile. Check browser storage and try again.';get('todayError').hidden=false;}
});
