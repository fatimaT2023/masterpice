/* An educational starting path based on explicit preferences, never a diagnosis. */
(() => {
 'use strict';
 const messages={},t=(en,ar)=>{messages[en]=ar;return en;};
 const areas={
  communication:{title:t('Communication and language','التواصل واللغة'),copy:t('Use everyday sounds, words, gestures and shared stories during play.','ندعم التواصل من خلال الأصوات والكلمات والإشارات والحكايات وقت اللعب.')},
  social:{title:t('Connection and taking turns','التفاعل وتبادل الأدوار'),copy:t('Make room for shared attention and back-and-forth moments at your child’s pace.','نخلق لحظات انتباه مشترك وأخذ وعطا حسب راحة طفلكم.')},
  fine_motor:{title:t('Hand use and coordination','استخدام الإيدين والتنسيق'),copy:t('Explore age-appropriate play materials, with the help your child needs.','نجرب مواد لعب مناسبة للعمر مع المساعدة اللي بحتاجها طفلكم.')},
  thinking:{title:t('Attention and exploration','الانتباه والاستكشاف'),copy:t('Explore, notice and try simple play ideas together without a test or score.','نستكشف ونلاحظ ونجرب أفكار لعب بسيطة بدون اختبار أو علامات.')},
  creativity:{title:t('Imagination and expression','الخيال والتعبير'),copy:t('Find age-appropriate ways to enjoy stories, playful sounds and creative play.','نلاقي طرق مناسبة للعمر للاستمتاع بالحكايات والأصوات واللعب الإبداعي.')},
  self_help:{title:t('Joining everyday routines','المشاركة بالروتين اليومي'),copy:t('Invite comfortable participation in everyday moments, with your support.','نشجع مشاركة مريحة باللحظات اليومية مع دعمكم.')}
 };
 const routes={activities:'daily-activity.html',development:'milestones.html',concern:'screening.html',explore:'parent-dashboard.html'};
 function build(child){
  if(!window.RafiqFamily.canAccessId(child.id))throw Error('This child profile is unavailable.');
  const ageContext=window.RafiqSetup.childContext(child),profile=window.RafiqActivityMatching.profile(child),stage=window.RafiqChildHistoryAge.forChild(child).stage;
  return {child,ageContext,stage,profile,focusSkills:profile.focusSkills.filter(key=>Object.hasOwn(areas,key)),parentGoal:child.backgroundHistory?.parentGoal||'',hasHistory:!!child.backgroundHistory};
 }
 function preview(child){let notes=JSON.parse(localStorage.getItem('rafiqAgeObservations_'+child.id)||'[]');if(!Array.isArray(notes))throw Error('Saved observations could not be read.');return window.RafiqDailyMoments.choose(child,notes);}
 function saveFocus(child,focusSkills){const fresh=window.RafiqSetup.readChildren().find(c=>c.id===child.id);if(!fresh)throw Error('This child profile is unavailable.');const profile=window.RafiqActivityMatching.profile(fresh);return window.RafiqActivityMatching.saveProfile(fresh,{...profile,focusSkills});}
 function finish(childId,goal,focusSkills){
  if(!Object.hasOwn(routes,goal))throw Error('Choose an available next step.');
  const children=window.RafiqSetup.readChildren(),index=children.findIndex(c=>c.id===childId);if(index<0)throw Error('This child profile is unavailable.');
  const child=children[index],beforeChildren=localStorage.getItem('rafiqChildren'),beforeProfile=localStorage.getItem('rafiqActivityProfile_'+childId);
  try{saveFocus(child,focusSkills);if(goal==='activities'){const idea=preview(child);if(!idea.item||idea.noLongerSuggested)throw Error('Review age and readiness or choose another next step.');}children[index]={...child,initialGoal:goal,setupCompletedAt:child.setupCompletedAt||new Date().toISOString(),supportGuideReviewedAt:new Date().toISOString()};window.RafiqSetup.writeChildren(children);window.RafiqFamily.select(childId);}catch(error){if(beforeChildren!==null)localStorage.setItem('rafiqChildren',beforeChildren);if(beforeProfile===null)localStorage.removeItem('rafiqActivityProfile_'+childId);else localStorage.setItem('rafiqActivityProfile_'+childId,beforeProfile);throw error;}
  if(localStorage.getItem('rafiqSetupPendingChildId')===childId)localStorage.removeItem('rafiqSetupPendingChildId');
  return routes[goal];
 }
 Object.assign(window.RafiqHomeArabic=window.RafiqHomeArabic||{},messages);
 function summary(child){
  const history=child.backgroundHistory||{},answers=history.answers||{},legacy=history.legacy||{};
  const meaningful=a=>a&&a.value!==undefined&&!['skip','unknown',''].includes(a.value)&&(!Array.isArray(a.value)||a.value.length>0);
  const labels={yes:'Yes',no:'No',other:'Other',comfortable:'Comfortable for us',support:'We would like support',settled:'Usually settled',varies:'It varies',breast:'Breast milk',formula:'Formula',mixed:'Mixed',review:'We would like to review the record',sleep:'Sleep',feeding:'Feeding',speech:'Speech',behaviour:'Behaviour',play:'Play',growth:'General growth','with_support':'Comfortable with my help','not_yet':'Not comfortable with this right now'};
  const fieldLabels={allergies:'Allergies',conditions:'Current care',medicines:'Medicines',hospital:'Hospital care',hearing:'Hearing',vision:'Vision',instructions:'Care instructions',milk:'Milk',solids:'Solid foods',meals:'Meals',preferences:'Food preferences',difficulty:'Feeding comfort',pattern:'Sleep',naps:'Naps',helps:'Sleep support',hard:'Sleep comfort',childHealth:'Current care',hospitalCare:'Hospital care',hearingVision:'Hearing and vision',careInstructions:'Care instructions',mealtime:'Meals',sleepRoutine:'Sleep'};
  for(const [key,area] of Object.entries(areas))labels[key]=area.title;
  function parts(prefixes,oldKeys){const out=[];for(const [id,a] of Object.entries(answers)){if(!prefixes.some(p=>id.startsWith(p+'.'))||!meaningful(a))continue;const label=fieldLabels[id.split('.')[1]];if(a.details)out.push({text:a.details,user:true,label});else for(const v of (Array.isArray(a.value)?a.value:[a.value]))if(labels[v])out.push({text:labels[v],user:false,label});}for(const key of oldKeys){const value=typeof history[key]==='string'?history[key]:legacy[key];if(value?.trim()&&!out.some(p=>p.text===value))out.push({text:value.trim(),user:true,label:fieldLabels[key]});}return out;}
  const context=window.RafiqSetup.childContext(child),age=window.RafiqSetup.formatAge(context.chronological);
  const rows=[{id:'age',icon:'◷',title:'Age and stage',section:'details',parts:age?[{text:age,age:true}]:[]},
   {id:'health',icon:'♡',title:'Health and allergies',section:'health',parts:parts(['health'],['childHealth','allergies','medicines','hospitalCare','hearingVision','careInstructions'])},
   {id:'feeding',icon:'☾',title:'Feeding and sleep',section:'feeding,sleep',parts:parts(['feeding','sleep'],['mealtime','sleepRoutine'])},
   {id:'play',icon:'✧',title:'Play and interests',section:'play',parts:parts(['play'],['interests','dailyLife','communication','everydayParticipation'])},
   {id:'goals',icon:'◎',title:'What you’d like help with',section:'goals',parts:parts(['goals'],['parentGoal'])}];
  // Also read structured fields saved by other version-2 clients without answer entries.
  const health=rows[1];for(const [key,label] of [['allergies','Allergies'],['medication','Medicines']]){const value=history[key];if(value&&typeof value==='object'&&!answers['health.'+(key==='medication'?'medicines':key)]){if(value.details&&!health.parts.some(p=>p.text===value.details))health.parts.push({text:value.details,user:true,label});else if(['yes','no'].includes(value.has))health.parts.push({text:labels[value.has],label});}}
  if(!rows[4].parts.length){for(const choice of history.goals?.choices||[])if(labels[choice])rows[4].parts.push({text:labels[choice]});if(history.goals?.details)rows[4].parts.push({text:history.goals.details,user:true});}
  for(const row of rows){row.recorded=row.parts.length>0;row.parts=row.parts.slice(0,2);row.href='onboarding.html?edit='+encodeURIComponent(child.id)+'&return=guide&section='+(row.section==='details'?'details':'story')+(row.section==='details'?'':'&interviewSection='+encodeURIComponent(row.section));}
  return {rows,answeredSections:rows.filter(row=>row.recorded).length,mostlyEmpty:rows.filter(row=>row.recorded).length<3};
 }
 window.RafiqSupportGuide={areas,routes,build,preview,saveFocus,finish,summary};
})();
