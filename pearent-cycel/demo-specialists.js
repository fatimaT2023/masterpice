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

 // Instagram-style public profile content for the demo (posts, reviews, credentials). Sample data only.
 const M='../rafiq-home-transfer-20261013-211454/assets/moments/';
 const showcase={
  showcase_speech_specialist:{sessions:146,families:58,
   posts:[
    {type:'video',src:M+'reading.mp4',poster:M+'reading.jpg',title:p('Reading together builds words','القراءة سوا بتبني كلمات'),caption:p('Point, name, wait. Give your child time to answer before you say the word.','أشّروا، سمّوا، واستنّوا. اعطوا طفلكم وقت يجاوب قبل ما تحكوا الكلمة.'),days:3,helpful:214},
    {type:'tip',tone:'mint',title:p('3 seconds rule','قاعدة الـ٣ ثواني'),caption:p('After you ask a question, count to three in your head. Many children answer when we wait a little longer.','بعد ما تسألوا سؤال، عدّوا لثلاثة بقلبكم. أطفال كثير بجاوبوا لما نستنّى شوي أكثر.'),days:6,helpful:331},
    {type:'video',src:M+'together.mp4',poster:M+'together.jpg',title:p('Talk while you play','احكوا وإنتوا بتلعبوا'),caption:p('Describe what your child is doing: "Big tower! Red block on top!" No questions, just words.','وصفوا شو طفلكم عم يعمل: «برج كبير! مكعب أحمر فوق!» بدون أسئلة، بس كلمات.'),days:10,helpful:187},
    {type:'tip',tone:'peach',title:p('Choices, not tests','خيارات مش امتحان'),caption:p('"Apple or banana?" gives your child a word to copy. "What is this?" can feel like a test.','«تفاحة ولا موزة؟» بتعطي طفلكم كلمة يقلّدها. «شو هاد؟» ممكن تحسسه إنه امتحان.'),days:14,helpful:276},
    {type:'tip',tone:'sky',title:p('Screens and first words','الشاشات والكلمات الأولى'),caption:p('Words grow from back-and-forth with people. Keep short screen time shared and talk about what you see.','الكلام بيكبر من الحكي مع الناس. خلّوا وقت الشاشة قصير ومشترك واحكوا عن اللي بتشوفوه.'),days:20,helpful:158},
    {type:'tip',tone:'lilac',title:p('When to ask a specialist','إمتى نسأل مختص؟'),caption:p('If by 2 years your child uses very few words or does not combine two words, a short consultation can help you plan.','إذا طفلكم بعمر سنتين بيستخدم كلمات قليلة كثير أو ما بركّب كلمتين، استشارة قصيرة بتساعدكم تخططوا.'),days:27,helpful:402}],
   reviews:[
    {who:p('Layth\'s mother','أم ليث'),age:p('child, 2½ years','طفل بعمر سنتين ونص'),stars:5,text:p('Very calm with my son. We left with three small things to try at home, and after two weeks he started saying "more".','هادي كثير مع ابني. طلعنا بثلاث أشياء صغيرة نجرّبها بالبيت، وبعد أسبوعين صار يحكي «كمان».'),days:5},
    {who:p('Karam\'s father','أبو كرم'),age:p('child, 3 years','طفل بعمر ٣ سنين'),stars:5,text:p('He explained everything simply and did not rush us. The report was clear.','شرحلنا كل إشي ببساطة وما استعجلنا. التقرير كان واضح.'),days:12},
    {who:p('Rana\'s mother','أم رنا'),age:p('child, 2 years','طفلة بعمر سنتين'),stars:4,text:p('Helpful online session. I wish there were evening times.','جلسة أونلاين مفيدة. بتمنى لو في مواعيد مسائية.'),days:19},
    {who:p('Yazan\'s mother','أم يزن'),age:p('child, 4 years','طفل بعمر ٤ سنين'),stars:5,text:p('My son usually hides from strangers, but he played with him from the first minutes.','ابني عادة بيتخبى من الغرباء، بس لعب معه من أول دقايق.'),days:33},
    {who:p('Hala\'s father','أبو هلا'),age:p('child, 3 years','طفلة بعمر ٣ سنين'),stars:5,text:p('The home tips were practical and fit our day.','نصايح البيت كانت عملية وبتمشي مع يومنا.'),days:41}],
   credentials:[
    {title:p('BSc in Speech and Language Pathology','بكالوريوس علاج النطق واللغة'),issuer:p('Faculty of Rehabilitation Sciences','كلية علوم التأهيل'),year:'2019'},
    {title:p('Professional practice licence (speech therapy)','رخصة مزاولة مهنة — علاج النطق'),issuer:p('Checked by the Rafiq team','تحقق منها فريق رفيق'),year:'2020'},
    {title:p('Early language intervention for parents (course)','دورة التدخل المبكر في اللغة للأهل'),issuer:p('Continuing education','تعليم مستمر'),year:'2023'}],
   approach:p('I coach parents to turn daily routines into talking time. Sessions are playful, short and end with one clear plan for home.','بدرّب الأهل يحوّلوا الروتين اليومي لوقت حكي. الجلسات فيها لعب، قصيرة، وبتنتهي بخطة وحدة واضحة للبيت.'),ages:p('1 to 6 years','من سنة لـ ٦ سنين'),first:p('We play together for 15 minutes, talk about what you noticed at home, and agree on one goal.','منلعب سوا ربع ساعة، منحكي عن اللي لاحظتوه بالبيت، ومنتفق على هدف واحد.'),duration:p('45 minutes','٤٥ دقيقة')},
  showcase_development_specialist:{sessions:203,families:91,
   posts:[
    {type:'video',src:M+'together.mp4',poster:M+'together.jpg',title:p('Blocks build more than towers','المكعبات بتبني أكثر من برج'),caption:p('Stacking practises hand control, patience and turn-taking. Take turns adding one block each.','التركيب بيدرّب اليدين والصبر وتبادل الأدوار. كل واحد يحط مكعب بدوره.'),days:2,helpful:265},
    {type:'tip',tone:'peach',title:p('Floor time every day','وقت ع الأرض كل يوم'),caption:p('Ten minutes on the floor at your child\'s level, following their lead, is one of the best things you can do.','عشر دقايق ع الأرض بمستوى طفلكم، وإنتوا ماشيين وراه، من أحسن الأشياء اللي بتعملوها.'),days:7,helpful:388},
    {type:'tip',tone:'mint',title:p('Corrected age for preemies','العمر المصحّح للخدّج'),caption:p('If your baby was born early, compare skills with their corrected age until about 2 years.','إذا طفلكم انولد بدري، قارنوا مهاراته بعمره المصحّح لحد عمر سنتين تقريبًا.'),days:12,helpful:219},
    {type:'video',src:M+'reading.mp4',poster:M+'reading.jpg',title:p('Routines that calm','روتين بهدّي'),caption:p('The same three steps before sleep every night help children feel safe.','نفس الثلاث خطوات قبل النوم كل ليلة بتخلي الطفل يحس بالأمان.'),days:16,helpful:174},
    {type:'tip',tone:'sky',title:p('Tummy time, little and often','اللعب ع البطن: شوي وكثير'),caption:p('Start with 1–2 minutes several times a day and lie face to face with your baby.','ابدؤوا بدقيقة أو دقيقتين كذا مرة باليوم، وناموا وجهكم لوجه البيبي.'),days:22,helpful:301},
    {type:'tip',tone:'lilac',title:p('Messy play is learning','اللعب الوسخ تعلّم'),caption:p('Sand, water and dough help children who are sensitive to textures get used to them slowly.','الرمل والمي والعجين بيساعدوا الأطفال الحسّاسين للملمس يتعوّدوا شوي شوي.'),days:30,helpful:143}],
   reviews:[
    {who:p('Tala\'s mother','أم تالا'),age:p('baby, 5 months','بيبي بعمر ٥ أشهر'),stars:5,text:p('She explained corrected age to us and we finally stopped worrying about every small thing.','شرحتلنا العمر المصحّح، وأخيرًا بطّلنا نقلق من كل إشي صغير.'),days:4},
    {who:p('Omar\'s father','أبو عمر'),age:p('child, 5 years','طفل بعمر ٥ سنين'),stars:5,text:p('Clear plan, kind words, and she checked in after two weeks.','خطة واضحة، كلام لطيف، وتابعت معنا بعد أسبوعين.'),days:15},
    {who:p('Leen\'s mother','أم لين'),age:p('child, 3 years','طفلة بعمر ٣ سنين'),stars:5,text:p('Great with sensory issues. My daughter now touches sand at the park.','ممتازة بموضوع الحواس. بنتي صارت تلمس الرمل بالحديقة.'),days:26},
    {who:p('Zaid\'s mother','أم زيد'),age:p('child, 22 months','طفل بعمر ٢٢ شهر'),stars:4,text:p('Very useful. The in-person clinic was a bit far for us.','مفيدة كثير. العيادة كانت بعيدة شوي علينا.'),days:38}],
   credentials:[
    {title:p('MSc in Early Childhood Development','ماجستير نمو الطفولة المبكرة'),issuer:p('Faculty of Educational Sciences','كلية العلوم التربوية'),year:'2017'},
    {title:p('Professional practice licence','رخصة مزاولة مهنة'),issuer:p('Checked by the Rafiq team','تحقق منها فريق رفيق'),year:'2018'},
    {title:p('Sensory processing in young children (course)','دورة المعالجة الحسّية عند الأطفال'),issuer:p('Continuing education','تعليم مستمر'),year:'2022'}],
   approach:p('I look at the whole child: play, movement, sleep and family routines, and we choose small changes that fit your home.','بشوف الطفل كامل: اللعب والحركة والنوم وروتين العيلة، ومنختار تغييرات صغيرة بتناسب بيتكم.'),ages:p('Birth to 7 years','من الولادة لـ ٧ سنين'),first:p('A relaxed play observation, your questions, and a short written summary.','مراقبة لعب مريحة، أسئلتكم، وملخص مكتوب قصير.'),duration:p('60 minutes','٦٠ دقيقة')},
  showcase_psychology_specialist:{sessions:178,families:72,
   posts:[
    {type:'tip',tone:'lilac',title:p('Name the feeling','سمّوا الشعور'),caption:p('"You are angry because the game ended." Naming feelings helps children calm down faster.','«إنت زعلان لأنه اللعبة خلصت.» لما نسمّي الشعور، الطفل بهدى أسرع.'),days:3,helpful:356},
    {type:'video',src:M+'reading.mp4',poster:M+'reading.jpg',title:p('A calm bedtime','نوم هادي'),caption:p('Dim lights, one story, the same goodnight words. Predictable evenings mean fewer battles.','ضو خفيف، حكاية وحدة، ونفس كلمات تصبحوا على خير. المسا المتوقّع يعني مشاكل أقل.'),days:9,helpful:241},
    {type:'tip',tone:'peach',title:p('Warn before transitions','نبّهوا قبل الانتقال'),caption:p('"Two more minutes, then bath." A short warning prevents many tantrums.','«كمان دقيقتين وبعدين حمّام.» تنبيه قصير بيمنع نوبات غضب كثير.'),days:13,helpful:298},
    {type:'tip',tone:'mint',title:p('You are not alone','إنتوا مش لحالكم'),caption:p('Parent stress is real. Asking for help early is a sign of care, not weakness.','ضغط الأهل حقيقي. إنكم تطلبوا مساعدة بدري علامة اهتمام، مش ضعف.'),days:18,helpful:420},
    {type:'video',src:M+'together.mp4',poster:M+'together.jpg',title:p('Special time, 10 minutes','وقت خاص، ١٠ دقايق'),caption:p('Ten minutes a day where your child leads the play can reduce difficult behaviour.','عشر دقايق باليوم يقود فيها طفلكم اللعب ممكن تخفف السلوك الصعب.'),days:24,helpful:205},
    {type:'tip',tone:'sky',title:p('Separation at nursery','الوداع عند الحضانة'),caption:p('Keep goodbyes short and warm, and always say goodbye. Sneaking out makes worry grow.','خلّوا الوداع قصير ودافي، ودايمًا ودّعوا. التسلل بيكبّر القلق.'),days:31,helpful:189}],
   reviews:[
    {who:p('Adam\'s mother','أم آدم'),age:p('child, 3½ years','طفل بعمر ٣ سنين ونص'),stars:5,text:p('Tantrums at bedtime went from every night to twice a week. He gave us words that actually work.','نوبات الغضب وقت النوم صارت مرتين بالأسبوع بدل كل ليلة. عطانا كلمات بتزبط فعلًا.'),days:6},
    {who:p('Hana\'s mother','أم هنا'),age:p('child, 5 years','طفلة بعمر ٥ سنين'),stars:5,text:p('He listened to me first, not only to my daughter. I felt understood.','سمعني أنا أول، مش بس بنتي. حسّيت حالي مفهومة.'),days:17},
    {who:p('Fares\'s father','أبو فارس'),age:p('child, 5½ years','طفل بعمر ٥ سنين ونص'),stars:4,text:p('Good advice. Online only, so the grandparents could not join.','نصايح منيحة. أونلاين بس، فما قدرت أجيب الجدّة والجدّ.'),days:29}],
   credentials:[
    {title:p('MA in Clinical Child Psychology','ماجستير علم نفس الطفل الإكلينيكي'),issuer:p('Faculty of Arts and Psychology','كلية الآداب وعلم النفس'),year:'2015'},
    {title:p('Professional practice licence','رخصة مزاولة مهنة'),issuer:p('Checked by the Rafiq team','تحقق منها فريق رفيق'),year:'2016'},
    {title:p('Parent coaching for behaviour (course)','دورة إرشاد الأهل في السلوك'),issuer:p('Continuing education','تعليم مستمر'),year:'2021'}],
   approach:p('We work as a team: you know your child best, I bring tools. Every session ends with one thing to try this week.','منشتغل كفريق: إنتوا بتعرفوا طفلكم أحسن، وأنا بجيب الأدوات. كل جلسة بتنتهي بإشي واحد نجرّبه هالأسبوع.'),ages:p('2 to 12 years, and parents','من سنتين لـ ١٢ سنة، والأهل'),first:p('We talk about what is hardest right now and agree on one small goal.','منحكي عن أصعب إشي هلّق ومنتفق على هدف صغير.'),duration:p('50 minutes','٥٠ دقيقة')}
 };
 function build(language='ar'){
  const t=v=>v[language==='ar'?'ar':'en'];
  const flat=v=>v&&typeof v==='object'?(Array.isArray(v)?v.map(flat):(Object.keys(v).length===2&&'en' in v&&'ar' in v?t(v):Object.fromEntries(Object.entries(v).map(([k,x])=>[k,flat(x)])))):v;
  const specialists=rows.map(r=>({id:r.id,registrationUserId:r.registrationUserId,fullName:t(r.name),email:r.email,specialtyKey:r.specialtyKey,specialty:t(r.specialty),status:'approved',verificationStatus:'approved',experience:r.experience,price:r.price,currency:'JOD',languages:['arabic','english'],consultationTypes:r.consultationTypes,bio:t(r.bio),about:t(r.bio),areas:t(r.areas),supportAreas:r.supportAreas,isDemo:true,demoAvailability:true,showcase:flat(showcase[r.id])}));
  const availability=Object.fromEntries(rows.map(r=>['rafiqAvailability_'+r.id,{specialistId:r.id,slotDuration:60,isDemo:true,weeklySchedule:Array.from({length:7},(_,dayIndex)=>({dayIndex,enabled:r.days.includes(dayIndex),start:r.start,end:r.end}))}]));
  return {specialists,availability};
 }
 // Demo logins: each opens the shared 'Saja' demo in that specialist's view (password = RafiqDemoCases.password).
 const logins=[['rami.speech@rafiq.test','showcase_speech_specialist'],['lina.development@rafiq.test','showcase_development_specialist'],['omar.family@rafiq.test','showcase_psychology_specialist']].map(([email,id])=>({email,id}));
 window.RafiqDemoSpecialists={build,ids:rows.map(r=>r.id),logins};
})();
