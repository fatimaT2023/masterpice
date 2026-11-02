/* Unified administrative finance workspace. Demo records only. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';const get=id=>document.getElementById(id),api=window.RafiqFinance;
 if(!get('financeSessions')||!api)return;
 let tab='sessions';
 const readRate=()=>{try{const n=Number(JSON.parse(localStorage.getItem('rafiqCommissionRate')||'10'));return Number.isFinite(n)&&n>=0&&n<=100?n:10;}catch{return 10;}};
 get('financeCommission').value=readRate();
 const isDue=b=>b.status==='completed'&&b.sessionPayment.status==='paid'&&b.sessionPayment.payoutStatus==='pending';
 const needsAction=b=>isDue(b)||b.sessionPayment.status==='refund_pending'||(b.status==='cancelled'&&b.sessionPayment.payoutStatus==='transferred');
 function sum(rows,key){return api.money(rows.reduce((total,b)=>total+(Number(b.sessionPayment[key])||0),0));}
 function cell(row,value){const td=document.createElement('td');td.textContent=value;row.append(td);return td;}
 let pendingAction=null;
 function notify(message){get('financeNotice').hidden=false;get('financeNotice').textContent=message;}
 const eligible=(b,action)=>action==='transfer'?isDue(b):b.sessionPayment.status==='refund_pending';
 function update(id,action){
  const booking=api.reconcile().find(b=>b.id===id);if(!booking?.sessionPayment||!eligible(booking,action)){notify('This record changed. Refresh and review its current status.');render();return;}
  const amount=action==='transfer'?Number(booking.sessionPayment.specialistNet):Number(booking.sessionPayment.amount);
  pendingAction={id,action,amount};get('financeConfirmError').textContent='';
  get('financeConfirmTitle').textContent=action==='transfer'?'Confirm specialist transfer':'Confirm full refund';
  get('financeConfirmDescription').textContent=action==='transfer'?'Record that this specialist settlement has been transferred.':'Record that the full session payment has been refunded.';
  const details=get('financeConfirmDetails');details.replaceChildren();
  for(const [label,value] of [['Booking',booking.id],['Specialist',booking.specialistName||'Specialist'],['Amount',api.money(amount)]]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;details.append(dt,dd);}
  get('financeConfirm').showModal();
 }
 get('financeConfirmSave').addEventListener('click',()=>{
  if(!pendingAction)return;const {id,action,amount}=pendingAction,rows=api.reconcile(),booking=rows.find(b=>b.id===id);
  if(!booking?.sessionPayment||!eligible(booking,action)||(action==='transfer'?Number(booking.sessionPayment.specialistNet):Number(booking.sessionPayment.amount))!==amount){get('financeConfirmError').textContent='This record changed. Cancel and review it again.';return;}
  const p=booking.sessionPayment,at=new Date().toISOString(),by=sessionStorage.getItem('rafiqAdminEmail')||'Preview administrator';
  if(action==='transfer'){p.payoutStatus='transferred';p.transferredAt=at;p.transferredBy=by;}
  else{p.status='refunded';p.refundedAt=at;p.refundedBy=by;p.payoutStatus='void';}
  p.auditTrail=[...(p.auditTrail||[]),{action,amount,currency:'JOD',at,by}];
  try{localStorage.setItem('rafiqBookings',JSON.stringify(rows));pendingAction=null;get('financeConfirm').close();window.dispatchEvent(new Event('rafiq-finance-change'));notify(action==='transfer'?'Demo transfer recorded successfully.':'Demo refund recorded successfully.');}
  catch{get('financeConfirmError').textContent='Could not save this demo action. Please try again.';}
 });
 get('financeConfirm').addEventListener('close',()=>{pendingAction=null;});
 const labels={paid:'Paid',pending:'Awaiting transfer',transferred:'Transferred',refund_pending:'Refund pending',refunded:'Refunded',void:'Not payable',completed:'Completed',confirmed:'Confirmed',cancelled:'Cancelled'};
 function badge(row,value){const td=cell(row,''),span=document.createElement('span');span.className='finance-badge finance-status-'+value;span.textContent=labels[value]||value.replaceAll('_',' ');td.append(span);}
 function inPeriod(value){const from=get('financeFrom').value,to=get('financeTo').value;const date=String(value||'').slice(0,10);return (!from&&!to)||!!date&&(!from||date>=from)&&(!to||date<=to);}
 window.RafiqFinancePeriod={includes:inPeriod};
 function select(name){const button=document.querySelector('[data-finance-tab="'+name+'"]');button?.click();}
 function render(){
  const all=api.reconcile().filter(b=>b.sessionPayment&&inPeriod(b.date)),paid=all.filter(b=>b.sessionPayment.status==='paid');
  get('financeCollected').textContent=sum(paid,'amount');get('financeDue').textContent=sum(all.filter(isDue),'specialistNet');get('financeEarned').textContent=sum(paid.filter(b=>b.status==='completed'),'commission');
  get('financeActionSummary').textContent=all.filter(needsAction).length+' session records need action.';
  get('financeAlerts').replaceChildren();
  for(const [label,list,target,status] of [['Awaiting transfer',all.filter(isDue),'settlements','pending'],['Refund pending',all.filter(b=>b.sessionPayment.status==='refund_pending'),'sessions','refund_pending']]){
   const button=document.createElement('button');button.type='button';const title=document.createElement('span'),count=document.createElement('strong');title.textContent=label;count.textContent=String(list.length);button.append(title,count);button.addEventListener('click',()=>{select(target);get('financeStatus').value=status;render();get('financeSessions').scrollIntoView({behavior:'smooth',block:'start'});});get('financeAlerts').append(button);
  }
  const query=get('financeSearch').value.trim().toLowerCase(),status=get('financeStatus').value;
  let rows=tab==='settlements'?all.filter(b=>isDue(b)||b.sessionPayment.payoutStatus==='transferred'):all;
  rows=rows.filter(b=>(!query||(b.id+' '+b.specialistName).toLowerCase().includes(query))&&(status==='all'||status==='action'&&needsAction(b)||status==='pending'&&isDue(b)||status==='transferred'&&b.sessionPayment.payoutStatus==='transferred'||!['action','pending','transferred'].includes(status)&&b.sessionPayment.status===status));
  const from=get('financeFrom').value,to=get('financeTo').value;
  rows=rows.filter(b=>(!from||String(b.date||'').slice(0,10)>=from)&&(!to||!!b.date&&String(b.date).slice(0,10)<=to));
  rows.sort((a,b)=>Number(needsAction(b))-Number(needsAction(a)));
  get('financeSessionRows').replaceChildren();get('financeEmpty').hidden=rows.length>0;
  for(const b of rows){const p=b.sessionPayment,tr=document.createElement('tr');
   cell(tr,b.id+' / '+(b.specialistName||'Specialist'));badge(tr,b.status);badge(tr,p.status);cell(tr,api.money(p.amount));cell(tr,api.money(p.commission)+' ('+p.commissionRate+'%)');cell(tr,api.money(p.specialistNet));badge(tr,p.payoutStatus);
   const action=cell(tr,'');
   if(isDue(b)||p.status==='refund_pending'){const button=document.createElement('button');button.type='button';const kind=isDue(b)?'transfer':'refund';button.textContent=kind==='transfer'?'Record demo transfer':'Record full demo refund';button.addEventListener('click',()=>update(b.id,kind));action.append(button);}
   else if(b.status==='cancelled'&&p.payoutStatus==='transferred')action.textContent='Manual review: already transferred';
   else if(p.status==='paid'&&b.status!=='completed'&&b.status!=='cancelled')action.textContent='Held until session completion';
   else action.textContent='No action needed';
   if(p.auditTrail?.length){const last=p.auditTrail[p.auditTrail.length-1],note=document.createElement('small');note.className='finance-audit';note.textContent=new Date(last.at).toLocaleString(document.documentElement.lang==='ar'?'ar-JO':'en-GB')+' · '+last.by;note.setAttribute('data-user-content','');action.append(note);}
   get('financeSessionRows').append(tr);
  }
 }
 document.querySelectorAll('[data-finance-tab]').forEach(button=>button.addEventListener('click',()=>{
  tab=button.dataset.financeTab;document.querySelectorAll('[data-finance-tab]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  const sessions=['sessions','settlements'].includes(tab);get('financeSessions').hidden=!sessions;
  window.RafiqAdminBilling?.selectTab(sessions?'overview':tab);
  get('financeSessionTitle').textContent=tab==='settlements'?'Specialist settlements':'Session payments';get('financeStatus').value='all';render();
 }));
 get('financeCommissionForm').addEventListener('submit',event=>{event.preventDefault();const input=get('financeCommission');if(!input.reportValidity()||input.value==='')return;try{localStorage.setItem('rafiqCommissionRate',JSON.stringify(Number(input.value)));get('financeSettingsStatus').textContent='Commission saved for new bookings.';}catch{get('financeSettingsStatus').textContent='Could not save settings. Please try again.';}});
 function periodChanged(){const from=get('financeFrom'),to=get('financeTo');to.min=from.value; if(from.value&&to.value&&from.value>to.value){notify('The end date must be on or after the start date.');return;}window.RafiqAdminBilling?.refresh();render();}
 get('financePeriod').addEventListener('change',()=>{const period=get('financePeriod').value;if(period==='all'){get('financeFrom').value='';get('financeTo').value='';}if(period==='month'){const now=new Date(),local=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');get('financeFrom').value=local(new Date(now.getFullYear(),now.getMonth(),1));get('financeTo').value=local(new Date(now.getFullYear(),now.getMonth()+1,0));}periodChanged();});
 for(const id of ['financeFrom','financeTo'])get(id).addEventListener('change',()=>{get('financePeriod').value='custom';periodChanged();});
 get('financeSearch').addEventListener('input',render);get('financeStatus').addEventListener('change',render);
 window.addEventListener('storage',render);window.addEventListener('rafiq-finance-change',render);window.addEventListener('focus',render);render();
 const queryParams=new URLSearchParams(location.search),requested=queryParams.get('view');
 if(['sessions','settlements','subscriptions','payments'].includes(requested))select(requested);
 if(['pending','refund_pending'].includes(queryParams.get('status'))){get('financeStatus').value=queryParams.get('status');render();}
});
