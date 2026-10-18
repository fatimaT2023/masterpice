/* Link to original, unmodified SWYC forms. No questionnaire or scoring is reproduced. */
(() => {
'use strict';
const rows=[[2,1,4],[4,4,6],[6,6,9],[9,9,12],[12,12,15],[15,15,18],[18,18,23],[24,23,29],[30,29,35],[36,35,47],[48,47,59],[60,59,66]];
const forms=rows.map(([month,min,max])=>Object.freeze({id:'swyc-'+month,month,minMonths:min,maxMonthsExclusive:max,language:'en',url:'https://www.teamupcenter.org/swyc-'+month+'-month-english-age-specific-2021/',publisher:'TEAM UP Center at Boston Medical Center',source:'https://www.teamupcenter.org/age-specific-forms/',checkedAt:'2026-10-18',delivery:'external-original-pdf'}));
function choose(child,today=new Date()){
 const api=window.RafiqSetup,age=api.ageFromBirth(child.dateOfBirth,today);
 const result={age,selectionAge:age,basis:'date-of-birth',form:null,status:'unavailable'};
 if(!api.isSupported(age))return {...result,reason:'outside-range'};
 if(age.totalMonths>=66)return {...result,reason:'outside-tool-range'};
 if(age.totalMonths<24){
  if(!['yes','no'].includes(child.bornBeforeDueDate))return {...result,status:'needs-details',reason:'confirm-prematurity'};
  if(child.bornBeforeDueDate==='yes'){
   const birth=child.dateOfBirth,due=child.expectedDueDate;
   if(!api.ageFromBirth(due,new Date(9999,11,31))||due<=birth)return {...result,status:'needs-details',reason:'expected-due-date'};
   const days=(Date.parse(due+'T00:00:00Z')-Date.parse(birth+'T00:00:00Z'))/86400000;
   if(days>=21){result.selectionAge=api.ageFromBirth(due,today);result.basis='corrected';}
  }
 }
 if(!result.selectionAge||result.selectionAge.totalMonths<1)return {...result,reason:'below-tool-range'};
 const form=forms.find(item=>result.selectionAge.totalMonths>=item.minMonths&&result.selectionAge.totalMonths<item.maxMonthsExclusive);
 return {...result,form:form||null,status:form?'available':'unavailable',reason:form?null:'outside-tool-range'};
}
function readJourney(childId,storage=localStorage){
 const raw=storage.getItem('rafiqScreeningJourney_'+childId);if(!raw)return null;
 const value=JSON.parse(raw);if(!value||value.childId!==childId||!['opened','parent-reported-complete'].includes(value.status)||!forms.some(form=>form.id===value.formId))return null;return value;
}
window.RafiqScreeningTools={forms,choose,readJourney};
})();
