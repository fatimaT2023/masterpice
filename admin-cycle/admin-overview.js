/* Daily operations and historical performance have separate responsibilities. */
(()=>{'use strict';
 const read=key=>{try{const data=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(data)?data:[];}catch{return [];}};
 const day=value=>{if(!value)return '';const date=new Date(value);return Number.isNaN(+date)?'':date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');};
 const localDate=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
 const dates={specialists:x=>x.createdAt,bookings:x=>x.date||x.createdAt,reports:x=>x.createdAt||x.reportDate,payments:x=>x.createdAt,subscriptions:x=>x.startedAt||x.createdAt||x.activatedAt};
 window.RafiqAnalyticsFilter=data=>{
  const get=id=>document.getElementById(id),from=get('analyticsFrom').value,to=get('analyticsTo').value;
  if(from&&to&&from>to){get('analyticsPeriodMessage').textContent='The end date must be on or after the start date.';return Object.fromEntries(Object.keys(data).map(key=>[key,[]]));}
  const filtered=Object.fromEntries(Object.entries(data).map(([key,items])=>[key,items.filter(item=>{const date=day(dates[key](item));return !from&&!to||!!date&&(!from||date>=from)&&(!to||date<=to);})]));
  const mount=get('analyticsComparison');mount.replaceChildren();
  let previous=null,previousLabel='All-time view; no comparison period.';
  if(from&&to){const begin=new Date(from+'T00:00:00'),end=new Date(to+'T00:00:00');const days=Math.round((end-begin)/86400000)+1;const previousEnd=new Date(begin);previousEnd.setDate(previousEnd.getDate()-1);const previousStart=new Date(begin);previousStart.setDate(previousStart.getDate()-days);const low=localDate(previousStart),high=localDate(previousEnd);previous=Object.fromEntries(Object.entries(data).map(([key,items])=>[key,items.filter(item=>{const date=day(dates[key](item));return !!date&&date>=low&&date<=high;})]));previousLabel=low+' → '+high;}
  const metrics=[['New specialist applications','specialists',items=>items.length],['Scheduled appointments','bookings',items=>items.length],['Submitted reports','reports',items=>items.length]];
  for(const [label,key,count] of metrics){const article=document.createElement('article'),title=document.createElement('span'),value=document.createElement('strong'),comparison=document.createElement('p'),link=document.createElement('a');title.textContent=label;value.textContent=String(count(filtered[key]));comparison.textContent=previous?'Previous period: '+count(previous[key]):'All-time view; no comparison period.';link.textContent='View details';link.href=key==='specialists'?'#specialistPerformance':key==='bookings'?'#bookingPerformance':'#reportPerformance';article.append(title,value,comparison,link);mount.append(article);}
  const missing=Object.entries(data).reduce((sum,[key,items])=>sum+items.filter(item=>!day(dates[key](item))).length,0);
  get('analyticsPeriodMessage').textContent=previous?'Compared with the previous equal-length period: '+previousLabel:'All-time view; no comparison period.';
  if(missing&&(from||to)){const note=document.createElement('span');note.textContent=' '+missing+' records without valid dates are excluded.';get('analyticsPeriodMessage').append(note);}
  return filtered;
 };
 document.addEventListener('DOMContentLoaded',()=>{
  if(document.body.classList.contains('admin-operations')){
   const mount=document.getElementById('operationsActions');
   function render(){
    const specialists=read('rafiqSpecialists'),bookings=read('rafiqBookings'),tickets=read('rafiqSupportTickets');
    const current=(()=>{try{return JSON.parse(localStorage.getItem('rafiqSpecialistProfile')||'null');}catch{return null;}})();if(current?.id&&!specialists.some(s=>s.id===current.id))specialists.push(current);
    const counts=[['Applications awaiting review',specialists.filter(s=>(s.status||'pending')==='pending').length,'specialist-approvals.html','Review applications'],['New support requests',tickets.filter(t=>t.status==='new').length,'support-requests.html','Open support requests'],['Settlements awaiting transfer',bookings.filter(b=>b.status==='completed'&&b.sessionPayment?.status==='paid'&&b.sessionPayment.payoutStatus==='pending').length,'billing-management.html?view=settlements&status=pending','Review settlements'],['Refunds awaiting action',bookings.filter(b=>b.sessionPayment?.status==='refund_pending').length,'billing-management.html?view=sessions&status=refund_pending','Review refunds']];
    mount.replaceChildren();for(const [label,count,href,action] of counts){const card=document.createElement('a'),title=document.createElement('span'),value=document.createElement('strong'),link=document.createElement('small');card.href=href;title.textContent=label;value.textContent=String(count);link.textContent=action;card.append(title,value,link);mount.append(card);}
   }
   render();window.addEventListener('storage',()=>location.reload());window.addEventListener('focus',render);
   document.querySelector('.topbar .icon-button')?.setAttribute('hidden','');
  }
  if(document.body.classList.contains('admin-performance')){
   const get=id=>document.getElementById(id),now=new Date();
   function setDates(){const kind=get('analyticsPeriod').value;if(kind==='all'){get('analyticsFrom').value='';get('analyticsTo').value='';}else if(kind!=='custom'){const start=kind==='30'?new Date(now.getFullYear(),now.getMonth(),now.getDate()-29):new Date(now.getFullYear(),now.getMonth(),1);get('analyticsFrom').value=localDate(start);get('analyticsTo').value=localDate(now);}}
   setDates();get('analyticsPeriod').addEventListener('change',()=>{setDates();get('refreshButton').click();});
   for(const id of ['analyticsFrom','analyticsTo'])get(id).addEventListener('change',()=>{get('analyticsPeriod').value='custom';get('refreshButton').click();});
   const headingFor=(id,title)=>{const section=get(id)?.closest('section');if(section){section.id=title;return section;}};
   headingFor('approvedBar','specialistPerformance');headingFor('bookingDonut','bookingPerformance');headingFor('reportsMetric','reportPerformance');
   for(const id of ['milestoneContentValue','knowledgeValue']){const section=get(id)?.closest('section');if(!section)continue;const wrapper=document.createElement('details'),summary=document.createElement('summary');wrapper.className='performance-inventory';summary.textContent=id==='knowledgeValue'?'Current AI inventory (all time)':'Current content inventory (all time)';section.before(wrapper);wrapper.append(summary,section);}
  }
 });
})();
