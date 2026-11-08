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
 window.RafiqSupportGuide={areas,routes,build,preview,saveFocus,finish};
})();
