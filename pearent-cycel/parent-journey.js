/* Explain the parent's next action without replacing each page's controller. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const page=location.pathname.split('/').pop(),main=document.querySelector('main');if(!main)return;
 const routes={
  'activities.html':['Activities together','Choose an idea. Today’s free activity is available from Home; additional activities are included in Plus.'],
  'milestones.html':['Follow my child’s growth','Read about this stage, save one observation, then find it in your saved observations below.'],
  'screening.html':['Discuss a concern','Describe what worries you. Your summary is saved before you choose whether to contact a specialist.'],
  'specialists.html':['Specialist support · 1 of 4','Choose a specialist and review their experience, fee and availability. Choosing a profile does not book a session.'],
  'booking.html':['Specialist support · 2 of 4','Choose the session details, review the price and confirm. After confirmation, open your appointment details.'],
  'bookings.html':['Specialist support · 3 of 4','Open your appointment to see its details or message the specialist. After the session, the report appears when the specialist submits it.'],
  'specialist-report.html':['Specialist support · 4 of 4','Read the report, record your personal follow-up, or ask the specialist a question. Your follow-up stays separate from their original report.'],
  'health.html':['Health records','Choose the record you want to add. After saving, review it in this child’s health record.'],
  'album.html':['Memories','Add a memory, then find it in this child’s album.'],
  'messages.html':['My specialists','Read your follow-up conversations and reply after the specialist accepts.'],
  'child-profile.html':['Child profile','Review this child’s information or edit it, then return to Home to choose your next action.'],
  'subscription.html':['My plan','Compare Free and Plus before choosing. Your saved records remain accessible after a plan ends.'],
  'settings.html':['Account settings','Choose the setting to change and use its save action. Return to Home when you are done.'],
  'ai-assistant.html':['Ask Rafiq','Ask an educational question. If you want to discuss a developmental concern, use the concern journey from Home.']
 };
 if(page==='parent-dashboard.html'){
  const panel=document.getElementById('homeActivityPanel');
  const openActivity=()=>{if(location.hash==='#dailyMoment'||new URLSearchParams(location.search).has('activity')){panel.open=true;document.getElementById('dailyMoment').scrollIntoView({block:'start'});}};
  openActivity();window.addEventListener('hashchange',openActivity);
  return;
 }
 if(['messages.html','milestones.html','child-profile.html','ai-assistant.html','specialists.html','booking.html','album.html','screening.html','daily-activity.html','health.html'].includes(page))return;
 const route=routes[page];if(!route)return;
 const guide=document.createElement('section');guide.className='parent-journey-guide';guide.setAttribute('aria-label','Your path');
 const home=document.createElement('a');home.href='parent-dashboard.html';home.textContent='← Home: choose what you need';
 const heading=document.createElement('strong'),copy=document.createElement('p');heading.textContent=route[0];copy.textContent=route[1];guide.append(home,heading,copy);
 const header=main.querySelector('header');if(header)header.after(guide);else main.prepend(guide);
 const exit=document.createElement('nav');exit.className='parent-journey-exit';exit.setAttribute('aria-label','Continue your journey');
 const exits=[['parent-dashboard.html','Return to Home']];
 if(['activities.html','milestones.html','screening.html','specialist-report.html'].includes(page))exits.push(['milestones.html?filter=all#savedObservations','Open my child’s saved observations']);
 for(const [href,label] of exits){const link=document.createElement('a');link.href=href;link.textContent=label;exit.append(link);}
 main.append(exit);
});
