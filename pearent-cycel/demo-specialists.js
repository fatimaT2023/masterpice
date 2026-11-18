/* Fictional presentation specialists for the demo preview (case and family modes).
   No licences, credentials, ratings or verified qualifications. Hours are demo-only. */
(() => {
 'use strict';
 const p=(en,ar)=>({en,ar});
 // supportAreas use the 11 support-area ids from support-catalog-data.js.
 const rows=[
  {id:'showcase_speech_specialist',registrationUserId:'showcase_specialist_login',email:'specialist@rafiq.example',specialtyKey:'speech',name:p('Rami Haddad — speech therapist','رامي حداد — أخصائي نطق'),specialty:p('Speech and language','النطق واللغة'),
   bio:p('Talks with families about early words, sounds and everyday communication.','بيحكي مع العيلات عن الكلمات الأولى والأصوات والتواصل اليومي.'),
   areas:p(['Speech','Language','Communication'],['النطق','اللغة','التواصل']),supportAreas:['speech','development','everyday'],consultationTypes:['online','in-person'],price:20,experience:5,days:[0,1,2,3,4],start:'09:00',end:'15:00'},
  {id:'showcase_development_specialist',registrationUserId:'showcase_development_login',email:'development@rafiq.example',specialtyKey:'development',name:p('Lina Saleh — child development','لينا صالح — مختصة نمو أطفال'),specialty:p('Child development','نمو الطفل'),
   bio:p('Helps families think about play, movement, early learning and daily routines.','بتساعد العيلات تفكّر باللعب والحركة والتعلّم المبكر والروتين اليومي.'),
   areas:p(['Development','Play','Movement'],['النمو','اللعب','الحركة']),supportAreas:['development','learning','sensory','genetic','everyday'],consultationTypes:['in-person','online'],price:25,experience:7,days:[0,2,4,6],start:'10:00',end:'17:00'},
  {id:'showcase_psychology_specialist',registrationUserId:'showcase_psychology_login',email:'family@rafiq.example',specialtyKey:'psychology',name:p('Omar Nasser — family psychologist','عمر ناصر — أخصائي نفسي للعيلة'),specialty:p('Child and family psychology','علم نفس الطفل والعيلة'),
   bio:p('Talks with parents about feelings, behaviour, sleep routines and transitions.','بيحكي مع الأهل عن المشاعر والسلوك وروتين النوم والانتقالات.'),
   areas:p(['Behaviour','Emotions','Parent guidance'],['السلوك','المشاعر','إرشاد الأهل']),supportAreas:['behaviour','emotional','sleep','everyday'],consultationTypes:['online'],price:30,experience:9,days:[1,3,5],start:'12:00',end:'18:00'}
 ];
 function build(language='ar'){
  const t=v=>v[language==='ar'?'ar':'en'];
  const specialists=rows.map(r=>({id:r.id,registrationUserId:r.registrationUserId,fullName:t(r.name),email:r.email,specialtyKey:r.specialtyKey,specialty:t(r.specialty),status:'approved',verificationStatus:'approved',experience:r.experience,price:r.price,currency:'JOD',languages:['arabic','english'],consultationTypes:r.consultationTypes,bio:t(r.bio),about:t(r.bio),areas:t(r.areas),supportAreas:r.supportAreas,isDemo:true,demoAvailability:true}));
  const availability=Object.fromEntries(rows.map(r=>['rafiqAvailability_'+r.id,{specialistId:r.id,slotDuration:60,isDemo:true,weeklySchedule:Array.from({length:7},(_,dayIndex)=>({dayIndex,enabled:r.days.includes(dayIndex),start:r.start,end:r.end}))}]));
  return {specialists,availability};
 }
 window.RafiqDemoSpecialists={build,ids:rows.map(r=>r.id)};
})();
