/* Age-aware conversation prompts, not milestone targets or a screening score. */
(() => {
 'use strict';
 const messages={};
 const text=(en,ar)=>{messages[en]=ar;messages[en+' (optional)']=ar+' (اختياري)';return en;};
 const stages=[
  {id:'birth-6',min:0,max:6,label:text('Birth to 6 months','من الولادة لست شهور'),
   prompts:{
    interests:text('Which voices, faces or quiet moments seem to interest your baby?','أي أصوات أو وجوه أو لحظات هادية بتلفت انتباه طفلكم؟'),
    dailyLife:text('What helps your baby feel settled during the day? Tell us about comforting and care routines.','شو بيريّح طفلكم بالنهار؟ احكولنا عن التهدئة وروتين العناية.'),
    sleepRoutine:text('What is your baby’s current sleep and waking routine? What would you like help with?','كيف نوم وصحيان طفلكم هالفترة؟ وبشو بتحبّوا مساعدة؟'),
    mealtime:text('How are feeding times going for your family? Add any preferences or questions you want to remember.','كيف أوقات الرضاعة أو التغذية معكم؟ سجّلوا أي تفضيلات أو أسئلة بتحبّوا تتذكروها.'),
    communication:text('How does your baby show comfort, interest or a need for you?','كيف طفلكم بعبّر عن راحته أو اهتمامه أو حاجته إلكم؟'),
    everydayParticipation:text('Which care moments does your baby enjoy, and when do they seem to need a break?','أي لحظات عناية بيرتاح فيها طفلكم؟ ومتى بتحسّوا إنه محتاج استراحة؟')
   }},
  {id:'6-12',min:6,max:12,label:text('6 to 12 months','من ست شهور لسنة'),prompts:{
   interests:text('What catches your baby’s attention: familiar songs, faces or age-appropriate toys?','شو بلفت انتباه طفلكم: أغاني مألوفة، وجوه أو ألعاب مناسبة لعمره؟'),
   dailyLife:text('What do play, rest and care times look like in a usual day?','كيف بتكون أوقات اللعب والراحة والعناية بيومكم العادي؟'),
   sleepRoutine:text('How are naps and bedtime going? What helps your baby settle?','كيف القيلولة ووقت النوم؟ وشو بيساعد طفلكم يهدأ؟'),
   mealtime:text('How are your baby’s current feeding routines going? Record textures or experiences you have already tried, if any.','كيف روتين تغذية طفلكم؟ إذا جرّبتوا قوامات أو تجارب أكل، احكوا عنها.'),
   communication:text('How does your baby get your attention during play or care?','كيف طفلكم بلفت انتباهكم وقت اللعب أو العناية؟'),
   everydayParticipation:text('How does your baby like to explore with you nearby? What support makes this comfortable?','كيف طفلكم بحب يستكشف وإنتوا جنبه؟ وشو المساعدة اللي بتريّحه؟')
  }},
  {id:'12-24',min:12,max:24,label:text('1 to 2 years','من سنة لسنتين'),prompts:{
   interests:text('Which toys, songs or simple shared games does your child choose?','أي ألعاب أو أغاني أو لعب بسيط معكم بختاره طفلكم؟'),
   dailyLife:text('How do transitions between play, meals and rest go for your child?','كيف الانتقال بين اللعب والأكل والراحة مع طفلكم؟'),
   sleepRoutine:text('What is your child’s nap and bedtime routine? What feels easy or difficult?','كيف روتين القيلولة والنوم؟ شو المريح أو الصعب فيه؟'),
   mealtime:text('What does your child enjoy about mealtimes, and what help do they prefer?','شو بحب طفلكم بوقت الأكل؟ وأي مساعدة بفضّل؟'),
   communication:text('How does your child show you what they want: sounds, gestures, words or another way?','كيف طفلكم بيوصلكم شو بده: أصوات، إشارات، كلمات أو طريقة ثانية؟'),
   everydayParticipation:text('Does your child like joining dressing, tidying or other daily moments? Describe what you do together.','هل طفلكم بحب يشارك باللبس أو الترتيب أو لحظات يومية ثانية؟ احكوا شو بتعملوا سوا.')
  }},
  {id:'24-36',min:24,max:36,label:text('2 to 3 years','من سنتين لثلاث سنين'),prompts:{
   interests:text('Which pretend games, books or hands-on activities does your child enjoy?','أي لعب تمثيلي أو كتب أو أنشطة بإيديه بحبها طفلكم؟'),
   dailyLife:text('How does your child respond to changes in plans or moving between activities?','كيف طفلكم بتعامل مع تغيير الخطط أو الانتقال بين الأنشطة؟'),
   sleepRoutine:text('What helps with naps, bedtime or waking during the night?','شو بيساعد بالقيلولة أو وقت النوم أو الصحيان بالليل؟'),
   mealtime:text('What is comfortable at mealtimes? Any preferences or family routines to keep in mind?','شو المريح بوقت الأكل؟ في تفضيلات أو روتين للعيلة بتحبّوا نراعيه؟'),
   communication:text('How does your child share choices, ask for help or join a conversation in their own way?','كيف طفلكم بعبّر عن اختياراته أو بطلب مساعدة أو بشارك بالحكي بطريقته؟'),
   everydayParticipation:text('What does your child enjoy trying with your help, such as dressing, washing hands or tidying?','شو بحب طفلكم يجرّب بمساعدتكم، مثل اللبس أو غسل الإيدين أو الترتيب؟')
  }},
  {id:'36-60',min:36,max:60,label:text('3 to 5 years','من ثلاث لخمس سنين'),prompts:{
   interests:text('Which stories, imaginative games, drawing or play with others does your child enjoy?','أي قصص أو لعب خيالي أو رسم أو لعب مع غيره بحب طفلكم؟'),
   dailyLife:text('What is a usual home or nursery day like? Which transitions need extra support?','كيف يوم طفلكم بالبيت أو الروضة؟ وأي انتقالات بتحتاج مساعدة أكثر؟'),
   sleepRoutine:text('What is the bedtime and morning routine? What would you like to make easier?','كيف روتين النوم والصبح؟ وشو بتحبّوا يصير أسهل؟'),
   mealtime:text('How does your child take part in family meals or simple preparation with supervision?','كيف طفلكم بشارك بأكل العيلة أو بتحضير بسيط تحت إشرافكم؟'),
   communication:text('How does your child share ideas, feelings or stories, using any way of communicating?','كيف طفلكم بشارك أفكاره أو مشاعره أو قصصه، بأي طريقة تواصل؟'),
   everydayParticipation:text('Which daily tasks does your child choose to try? Where do they prefer your help?','أي شغلات يومية طفلكم بحب يجرّبها؟ ووين بفضّل مساعدتكم؟')
  }},
  {id:'60-84',min:60,max:84,label:text('5 to 7 years','من خمس لسبع سنين'),prompts:{
   interests:text('What does your child choose in free time: making things, stories, games or playing with friends?','شو بختار طفلكم بوقته: يصنع أشياء، قصص، ألعاب أو يلعب مع صحابه؟'),
   dailyLife:text('How do home, school or nursery routines fit together? What helps with changes and busy days?','كيف روتين البيت والمدرسة أو الروضة مع بعض؟ وشو بيساعد بالتغييرات والأيام المزدحمة؟'),
   sleepRoutine:text('How are evening, sleep and morning routines working for your child and family?','كيف روتين المسا والنوم والصبح مع طفلكم والعيلة؟'),
   mealtime:text('What helps your child feel comfortable at meals at home or outside?','شو بيريّح طفلكم وقت الأكل بالبيت أو برا؟'),
   communication:text('How does your child explain an idea, share a worry or ask for support in their preferred way?','كيف طفلكم بشرح فكرة أو بحكي عن إشي مقلقه أو بطلب مساعدة بطريقته المفضّلة؟'),
   everydayParticipation:text('How does your child take part in getting ready, organizing belongings or shared tasks? What help do they want?','كيف طفلكم بشارك بالتجهيز أو ترتيب أغراضه أو شغل مشترك؟ وأي مساعدة بحب؟')
  }}
 ];
 text('Your observations (optional)','ملاحظاتكم (اختياري)');
 const labels={sleepRoutine:text('Sleep and rest','النوم والراحة'),mealtime:text('Feeding and mealtimes','التغذية وأوقات الأكل'),communication:text('Your child’s way of communicating','طريقة تواصل طفلكم'),everydayParticipation:text('Joining everyday moments','المشاركة باللحظات اليومية')};
 const note=text('Saved answers may describe an earlier stage. Review them as your child grows; changing age never clears your answers.','الإجابات المحفوظة ممكن تكون من مرحلة سابقة. راجعوها مع نمو طفلكم؛ تغيير العمر ما بمسح إجاباتكم.');
 const corrected=text('These prompts follow the adjusted age in your child’s profile. Health records and appointments still use date of birth.','هاي الأسئلة حسب العمر المصحّح بملف طفلكم. السجل الصحي والمواعيد بضلّوا حسب تاريخ الولادة.');
 const unavailable=text('Review your child’s age details to see stage-specific questions. You can still save general observations below.','راجعوا بيانات عمر طفلكم عشان تظهر أسئلة المرحلة. بتقدروا تحفظوا ملاحظات عامة هون.');
 function forAge(months){return Number.isFinite(months)&&months>=0&&months<84?stages.find(stage=>months>=stage.min&&months<stage.max):null;}
 function forChild(child,date=new Date()){const context=window.RafiqSetup.childContext(child,date);return {stage:forAge(context.development?.totalMonths),context};}
 Object.assign(window.RafiqHomeArabic=window.RafiqHomeArabic||{},messages);
 window.RafiqChildHistoryAge={stages,labels,note,corrected,unavailable,forAge,forChild};
})();
