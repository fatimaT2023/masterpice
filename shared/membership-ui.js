/* Membership presentation; stored records remain readable on every plan. */
document.addEventListener('DOMContentLoaded',()=>{
 const api=window.RafiqMembership;if(!api)return;const page=location.pathname.split('/').pop();
 const note=document.createElement('p');note.className='membership-access-note';
 if(page==='subscription.html'){
  const state=api.state();note.textContent=state.active?'Plus access ends on '+new Date(state.record.expiresAt).toLocaleDateString()+'. This preview does not renew or charge automatically.':'Free includes one child, today’s activity and 3 Rafiq questions per family per day. Session fees are separate.';
  document.querySelector('.plans-grid')?.after(note);
  const lists=document.querySelectorAll('.plan-card .features-list');
  const free=['1 child profile','1 activity per child each day','3 Rafiq questions per family per day','Find, message and book specialists','Read saved records and session reports'];
  const plus=['Everything in Free','Up to 5 child profiles','Daily activity plus additional age-matched activities','30 Rafiq questions per family per day','Personal follow-up reminders in Today'];
  [free,plus].forEach((features,index)=>{if(!lists[index])return;lists[index].replaceChildren();for(const text of features){const li=document.createElement('li');li.textContent=text;lists[index].append(li);}});
  const table=document.querySelector('.comparison-table');if(table){table.replaceChildren();for(const row of [['Feature','Free','Plus'],['Child profiles','1','Up to 5'],['Rafiq questions per family per day','3','30'],['Activities','1 activity per child each day','Daily activity plus additional age-matched activities'],['Follow-up reminders','—','Included'],['Saved records and reports','Included','Included'],['Specialist messages','Included','Included'],['Session fees','Paid separately','Paid separately']]){const div=document.createElement('div');div.className='comparison-row';row.forEach(text=>{const span=document.createElement('span');span.textContent=text;div.append(span);});table.append(div);}}
 }
 if(page==='ai-assistant.html'){
  const form=document.getElementById('chatForm');if(!form)return;
  const update=()=>note.textContent=api.remaining()+' of '+api.state().aiLimit+' Rafiq questions remaining for this family today.';update();const usage=document.getElementById('chatUsage');if(usage)usage.append(note);else form.before(note);form.addEventListener('submit',()=>queueMicrotask(update));window.addEventListener('storage',update);
 }
 if(page==='onboarding.html'&&!new URLSearchParams(location.search).has('edit')){note.textContent='Free includes 1 child profile. Plus supports up to 5. Existing profiles and records remain accessible after a plan ends.';document.getElementById('childForm')?.before(note);
  let children=[];try{children=window.RafiqSetup.readChildren();}catch{}
  if(!api.canAdd(children)){
   document.getElementById('childForm')?.classList.remove('membership-blocked');
   note.textContent=api.state().active?'Plus supports up to 5 child profiles. Existing profiles remain accessible.':'The free plan includes one child. Upgrade to Plus to add up to 5 children. Existing records stay accessible.';
   const actions=document.createElement('p'),upgrade=document.createElement('a'),back=document.createElement('a');upgrade.href='subscription.html';upgrade.textContent='View plans';back.href='child-profile.html';back.textContent='Open existing child profile';actions.className='membership-actions';actions.append(upgrade,back);note.after(actions);
  }}
});
