/* Parent-reported background is separate from activity readiness and never interpreted clinically. */
(() => {
 'use strict';
 const fields={birthStory:'الحمل والولادة',childHealth:'الحالات الصحية والمتابعة',allergies:'الحساسية',medicines:'الأدوية والمكملات',hospitalCare:'العمليات أو دخول المستشفى',hearingVision:'السمع والنظر',familyHistory:'التاريخ الصحي بالعيلة',familyDetails:'تفاصيل بتحبّي تضيفيها عن العيلة',previousSupport:'المتابعة السابقة',careInstructions:'تعليمات فريق الرعاية',interests:'الألعاب والأشياء اللي بحبّها',dailyLife:'النوم والأكل والروتين',parentGoal:'شو حابة نساعدك فيه؟'};
 Object.assign(fields,{sleepRoutine:'النوم والراحة',mealtime:'التغذية وأوقات الأكل',communication:'طريقة تواصل طفلكم',everydayParticipation:'المشاركة باللحظات اليومية'});
 function normalize(values){const out={};for(const key of Object.keys(fields))out[key]=typeof values[key]==='string'?values[key].trim().slice(0,1500):'';if(!['','yes','no','unknown','prefer_not'].includes(out.familyHistory))out.familyHistory='';return out;}
 function save(childId,values){const children=window.RafiqSetup.readChildren(),index=children.findIndex(c=>c.id===childId);if(index<0)throw Error('ملف الطفل مش متاح لهالحساب.');const history={...normalize(values),version:1,updatedAt:new Date().toISOString(),updatedBy:window.RafiqFamily.owner()};children[index]={...children[index],backgroundHistory:history};window.RafiqSetup.writeChildren(children);return history;}
 window.RafiqChildHistory={fields,normalize,save};
})();
