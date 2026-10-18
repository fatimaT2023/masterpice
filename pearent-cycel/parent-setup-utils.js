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
function readChildren() {
 const value=JSON.parse(localStorage.getItem('rafiqChildren')||'[]');
 if(!Array.isArray(value)||value.some(child=>!child||typeof child.id!=='string'))throw new Error('Invalid child profiles');
 return value;
}
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
window.RafiqSetup={ageFromBirth,formatAge,readChildren,isSupported,bandForAge,childContext,bands,MAX_MONTHS};
})();
