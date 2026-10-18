/* Age eligibility is explicit. Imported prototype templates are not age-reviewed. */
(() => {
'use strict';
const checkpoints=[2,4,6,9,12,15,18,24,30,36,48,60];
const resources=checkpoints.map((month,index)=>({
 id:'cdc-checklist-'+month,kind:'external-milestone-resource',
 minMonths:month,maxMonthsExclusive:checkpoints[index+1]||72,
 title:'CDC milestone checklist: '+(month>=24&&month%12===0?month/12+' years':month+' months'),
 source:{publisher:'Centers for Disease Control and Prevention',url:'https://www.cdc.gov/act-early/milestones/'+(month===12?'1-year':month>=24&&month%12===0?month/12+'-years':month+'-months')+'.html'},
 sourceCheckedAt:'2026-10-18',reviewStatus:'external-publisher',reviewedBy:null
}));
// Retained for provenance; never selected as personalized, reviewed content.
const legacy=[{id:'legacy-milestones',kind:'milestones'},{id:'legacy-challenges',kind:'activity'},{id:'legacy-screening',kind:'screening'}].map(item=>({...item,minMonths:0,maxMonthsExclusive:84,reviewStatus:'draft',source:null,reviewedBy:null,reviewedAt:null}));
function eligible(item,context,kind){return !!item&&!!context?.supported&&!!context.development&&item.kind===kind&&item.reviewStatus==='approved'&&!!item.source?.url&&!!item.reviewedBy&&!!item.reviewedAt&&Number.isFinite(item.minMonths)&&Number.isFinite(item.maxMonthsExclusive)&&context.development.totalMonths>=item.minMonths&&context.development.totalMonths<item.maxMonthsExclusive;}
function select(items,context,kind){return items.filter(item=>eligible(item,context,kind));}
function milestoneResource(context){if(!context?.supported||!context.development||context.needsDueDate)return null;const months=context.development.totalMonths;return resources.find(item=>months>=item.minMonths&&months<item.maxMonthsExclusive)||null;}
window.RafiqAgeContent={resources,legacy,eligible,select,milestoneResource};
})();
