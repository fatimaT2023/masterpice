/* Parent-reported background is separate from activity readiness and never interpreted clinically. */
(() => {
 'use strict';
 Object.assign(window.RafiqHomeArabic=window.RafiqHomeArabic||{},{'Child unavailable':'ملف الطفل مش متاح.','Invalid health records':'ما قدرنا نقرأ السجل الصحي. راجعوا السجل قبل المحاولة مرة ثانية.'});
 const fields={birthStory:'الحمل والولادة',childHealth:'الحالات الصحية والمتابعة',allergies:'الحساسية',medicines:'الأدوية والمكملات',hospitalCare:'العمليات أو دخول المستشفى',hearingVision:'السمع والنظر',familyHistory:'التاريخ الصحي بالعيلة',familyDetails:'تفاصيل بتحبّي تضيفيها عن العيلة',previousSupport:'المتابعة السابقة',careInstructions:'تعليمات فريق الرعاية',interests:'الألعاب والأشياء اللي بحبّها',dailyLife:'النوم والأكل والروتين',parentGoal:'شو حابة نساعدك فيه؟'};
 Object.assign(fields,{sleepRoutine:'النوم والراحة',mealtime:'التغذية وأوقات الأكل',communication:'طريقة تواصل طفلكم',everydayParticipation:'المشاركة باللحظات اليومية'});
 function normalize(values){const out={};for(const key of Object.keys(fields))out[key]=typeof values[key]==='string'?values[key].trim().slice(0,1500):'';if(!['','yes','no','unknown','prefer_not'].includes(out.familyHistory))out.familyHistory='';return out;}
 function migrate(values={}){
  const legacy=values.version===2?{...values.legacy}:normalize(values);
  return {...normalize(values),version:2,legacy,answers:JSON.parse(JSON.stringify(values.answers||{})),cursor:values.cursor||'about.siblings',birth:{...(values.birth||{})},allergies:typeof values.allergies==='object'&&values.allergies?{...values.allergies}:{has:'unknown',details:legacy.allergies||''},medication:values.medication||{has:'unknown',details:legacy.medicines||''},goals:values.goals||{choices:[],details:legacy.parentGoal||''}};
 }
 function saveStructured(childId,values){
  const children=window.RafiqSetup.readChildren(),index=children.findIndex(c=>c.id===childId);
  if(index<0)throw Error('ملف الطفل مش متاح لهالحساب.');
  const history={...migrate(values),updatedAt:new Date().toISOString(),updatedBy:window.RafiqFamily.owner()};
  children[index]={...children[index],backgroundHistory:history};window.RafiqSetup.writeChildren(children);return history;
 }
 function writeBirth(child,history,confirmed){
  if(confirmed!==true)return false;
  if(!window.RafiqSetup.readChildren().some(c=>c.id===child.id))throw Error('Child unavailable');
  const birth=history.birth||{},weight=Number(birth.weightGrams),height=Number(birth.lengthCm);
  if(!(weight>0||height>0))return false;
  const key='rafiqGrowth_'+child.id,records=JSON.parse(localStorage.getItem(key)||'[]');
  if(!Array.isArray(records))throw Error('Invalid health records');
  if(records.some(r=>r.id==='interview-birth-'+child.id||r.date===child.dateOfBirth))return false;
  records.push({id:'interview-birth-'+child.id,childId:child.id,date:child.dateOfBirth,weight:weight>0?weight/1000:null,height:height>0?height:null,createdAt:new Date().toISOString(),createdBy:window.RafiqFamily.owner(),source:'child-interview'});
  localStorage.setItem(key,JSON.stringify(records));return true;
 }
 window.RafiqChildHistory={fields,normalize,migrate,save:saveStructured,writeBirth};
})();
