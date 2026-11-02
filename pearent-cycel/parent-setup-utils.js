/* Calendar age and storage helpers shared by the two setup steps. */
(() => {
'use strict';
function ageFromBirth(value, today = new Date()) {
 if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
 const [y,m,d] = value.split('-').map(Number);
 const birth = new Date(y,m-1,d);
 if (birth.getFullYear()!==y || birth.getMonth()!==m-1 || birth.getDate()!==d) return null;
 const now = new Date(today.getFullYear(),today.getMonth(),today.getDate());
 if (birth>now) return null;
 let totalMonths=(now.getFullYear()-y)*12+now.getMonth()-(m-1);
 const anniversary=n=>{ const month=m-1+n; const last=new Date(y,month+1,0).getDate(); return new Date(y,month,Math.min(d,last)); };
 if (anniversary(totalMonths)>now) totalMonths--;
 const anchor=anniversary(totalMonths);
 const days=Math.round((Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())-Date.UTC(anchor.getFullYear(),anchor.getMonth(),anchor.getDate()))/86400000);
 return {years:Math.floor(totalMonths/12),months:totalMonths%12,totalMonths,days};
}
function formatAge(age) {
 if(!age||!Number.isInteger(age.totalMonths))return '';
 const parts=[];
 for(const [value,unit] of [[age.years,'year'],[age.months,'month'],[age.days,'day']]) if(value)parts.push(value+' '+unit+(value===1?'':'s'));
 return (parts.length?parts.join(', '):'0 days')+' old';
}
function readAllChildren() {
 const value=JSON.parse(localStorage.getItem('rafiqChildren')||'[]');
 if(!Array.isArray(value)||value.some(child=>!child||typeof child.id!=='string'))throw new Error('Invalid child profiles');
 return value;
}
function parentOwner(){return sessionStorage.getItem('rafiqParentUserId')||'legacy-browser';}
function ownsChild(child){const owner=parentOwner();return child.parentId===owner||(owner==='legacy-browser'&&!child.parentId);}
function readChildren(){return readAllChildren().filter(ownsChild);}
function writeChildren(children){
 if(!Array.isArray(children)||children.some(child=>!child||typeof child.id!=='string'||(child.parentId&&child.parentId!==parentOwner())))throw Error('Invalid child ownership');
 const all=readAllChildren(),others=all.filter(child=>!ownsChild(child));
 if(children.some(child=>others.some(other=>other.id===child.id)))throw Error('Child belongs to another account');
 localStorage.setItem('rafiqChildren',JSON.stringify([...others,...children.map(child=>({...child,parentId:parentOwner()}))]));
}
function parentProfileKey(){return 'rafiqParentProfile_'+parentOwner();}
const MAX_MONTHS=84;
function isSupported(age){return !!age&&age.totalMonths>=0&&age.totalMonths<MAX_MONTHS;}
const bands=[];
function addBand(min,max,label){bands.push(Object.freeze({id:'months-'+min+'-'+max,minMonths:min,maxMonthsExclusive:max,label}));}
for(let m=0;m<12;m++)addBand(m,m+1,m===0?'Birth to 1 month':m+' to '+(m+1)+' months');
for(let m=12;m<24;m+=3)addBand(m,m+3,m+' to '+(m+3)+' months');
for(let m=24;m<48;m+=6)addBand(m,m+6,m+' to '+(m+6)+' months');
for(let m=48;m<84;m+=12)addBand(m,m+12,(m/12)+' to '+(m/12+1)+' years');
function bandForAge(age){return isSupported(age)?bands.find(b=>age.totalMonths>=b.minMonths&&age.totalMonths<b.maxMonthsExclusive)||null:null;}
function childContext(child,today=new Date()){
 const chronological=ageFromBirth(child.dateOfBirth||child.dob||child.birthDate,today);
 let development=chronological,basis='date-of-birth',beforeDueDate=false,needsDueDate=false;
 const due=child.expectedDueDate;
 if(child.bornBeforeDueDate==='yes'&&chronological&&chronological.totalMonths<24){
  const validDue=!!ageFromBirth(due,new Date(9999,11,31))&&due>(child.dateOfBirth||child.dob||child.birthDate);
  if(!validDue)needsDueDate=true;
  else {const corrected=ageFromBirth(due,today);if(corrected){development=corrected;basis='corrected';}else{development=null;basis='before-due-date';beforeDueDate=true;}}
 }
 return {chronological,development,band:bandForAge(development),chronologicalBand:bandForAge(chronological),supported:isSupported(chronological),basis,beforeDueDate,needsDueDate};
}
document.addEventListener('DOMContentLoaded',()=>{
 const exit=document.querySelector('[data-setup-exit]');
 if(exit){exit.textContent='Log out';exit.addEventListener('click',event=>{event.preventDefault();sessionStorage.clear();location.replace('../piblic-pages/login.html');});}
 const page=location.pathname.split('/').pop();
 if(['onboarding.html','getting-started.html'].includes(page))return;
 try{
  const id=sessionStorage.getItem('rafiqSetupCompletedChildId'),child=readChildren().find(c=>c.id===id);
  if(!child||localStorage.getItem('rafiqCurrentChildId')!==child.id)return;
  const main=document.querySelector('main');if(!main)return;
  const notice=document.createElement('section');notice.className='setup-complete-notice';notice.setAttribute('role','status');
  const title=document.createElement('strong');title.textContent='Setup complete for '+child.name;
  const copy=document.createElement('p');copy.textContent='Your child’s profile and starting point are saved. You can return to Today anytime or choose a different starting point.';
  const home=document.createElement('a');home.href='parent-dashboard.html';home.textContent='Go to Today';
  const change=document.createElement('a');change.href='getting-started.html?child='+encodeURIComponent(child.id);change.textContent='Change starting point';
  notice.append(title,copy,home,document.createTextNode(' · '),change);main.prepend(notice);
  sessionStorage.removeItem('rafiqSetupCompletedChildId');
 }catch{/* The page controller supplies storage errors. */}
});
window.RafiqSetup={writeChildren,parentProfileKey,parentOwner,ageFromBirth,formatAge,readChildren,isSupported,bandForAge,childContext,bands,MAX_MONTHS};
})();
