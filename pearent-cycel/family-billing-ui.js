document.addEventListener('DOMContentLoaded',()=>{
'use strict';
const family=window.RafiqFamily,plans=window.RafiqMembership;
const mount=document.getElementById('familyBillingMount');if(!mount)return;
const panel=document.createElement('section');panel.className='screen-flow-card family-settings-panel';mount.append(panel);
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
const status=el('p','');status.setAttribute('role','status');status.className='billing-feedback';
function button(text,work){const b=el('button',text);b.type='button';b.className='screen-flow-secondary';b.onclick=()=>{try{work();render();status.textContent=text==='Accept billing responsibility'?'Billing responsibility accepted.':'Billing responsibility declined.';}catch(error){status.textContent=error.message;}};return b;}
function render(){
 panel.replaceChildren();
 const state=plans.state(),id=state.familyId,workspace=family.family(id),manager=family.user(workspace.billingOwnerId);
 document.getElementById('subscriptionPlanStatus').textContent=state.active?'Plus benefits active':'Free benefits active';
 document.getElementById('subscriptionAIStatus').textContent=String(plans.remaining());
 document.getElementById('subscriptionPeriodLabel').textContent=state.record?'Paid period ends':'Renewal';
 document.getElementById('subscriptionPeriodStatus').textContent=state.record?new Date(state.record.expiresAt).toLocaleDateString(document.documentElement.lang||'en'):'No renewal - Free plan';
 panel.append(el('h2','Billing & family'));
 const intro=el('p','One family plan covers the linked caregivers. Session appointments are paid separately.');intro.className='billing-intro';panel.append(intro);
 const grid=el('div');grid.className='family-billing-grid';const management=el('div');management.className='billing-management';
 const spaces=new Set(['family_'+family.owner(),...window.RafiqSetup.readChildren().map(c=>family.familyId(c))]);
 if(spaces.size>1){const label=el('label','Family workspace'),select=el('select');for(const space of spaces){const person=family.user(family.family(space).ownerId),option=el('option',person?.fullName||'My family');option.dataset.userContent='';option.value=space;select.append(option);}select.value=id;select.onchange=()=>{location.href='subscription.html?family='+encodeURIComponent(select.value);};label.append(select);management.append(label);}
 const identity=el('p',manager?.fullName||manager?.email||'Primary caregiver');identity.dataset.userContent='';identity.className='billing-manager-name';
 management.append(el('strong','Billing manager'),identity);
 if(workspace.billingResetReason)management.append(el('p',workspace.billingResetReason));
 if(state.record)management.append(el('p',state.record.cancelAtPeriodEnd?'Renewal is cancelled. Benefits continue until the paid period ends.':'Renewal preference is enabled. This local demo does not charge automatically.'));
 if(state.canManage){
  const others=family.members(id).filter(u=>u.id!==family.owner());
  if(others.length){const form=el('form'),label=el('label','Transfer billing responsibility'),select=el('select');select.required=true;for(const person of others){const option=el('option',person.fullName||person.email);option.value=person.id;option.dataset.userContent='';select.append(option);}label.append(select);const send=el('button','Request billing transfer');send.type='submit';send.className='screen-flow-secondary';form.append(label,send);form.onsubmit=event=>{event.preventDefault();try{family.proposeBilling(select.value,id);render();status.textContent='Billing transfer requested. The other person must accept.';}catch(error){status.textContent=error.message;}};management.append(form);}
 }else management.append(el('p','Your family benefits are shared. Only the billing manager can buy or change the plan.'));
 for(const transfer of family.array('rafiqFamilyBillingTransfers').filter(t=>t.familyId===id&&t.status==='pending')){management.append(el('p','A billing transfer is awaiting acceptance.'));if(transfer.to===family.owner())management.append(button('Accept billing responsibility',()=>family.respondBilling(transfer.id,true)),button('Decline billing responsibility',()=>family.respondBilling(transfer.id,false)));}
 const history=el('details'),summary=el('summary','Family payment history');history.className='billing-history';history.append(summary);
 const subscriptions=family.array('rafiqSubscriptions').filter(s=>s.familyId===id||(!s.familyId&&s.parentId===workspace.ownerId));
 if(!subscriptions.length)history.append(el('p','No family subscription payments yet.'));
 for(const payment of subscriptions){const row=el('article'),payer=family.user(payment.payerId||payment.parentId);row.append(el('p',(payment.price??payment.amount??0)+' '+(payment.currency||'JOD')),el('p',new Date(payment.activatedAt||payment.createdAt).toLocaleDateString()));const who=el('p',payer?.fullName||payment.parentName||'Caregiver');who.dataset.userContent='';row.append(who);if((payment.payerId||payment.parentId)===family.owner())row.append(el('p',payment.paymentReference||payment.id));history.append(row);}
 grid.append(management,history);panel.append(grid,status);
}
render();document.addEventListener('rafiq:family-plan',render);document.addEventListener('rafiq:family-change',render);window.addEventListener('focus',render);window.addEventListener('storage',event=>{if(['rafiqFamilies','rafiqFamilyMemberships','rafiqSubscriptions','rafiqFamilyBillingTransfers','rafiqAIUsage'].includes(event.key))render();});
});