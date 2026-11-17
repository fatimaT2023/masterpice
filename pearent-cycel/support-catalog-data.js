/* Service-discovery metadata, not clinical assessment or treatment content. */
(() => {
 'use strict';const p=(en,ar)=>({en,ar});
 const categoryIds=['development','speech','behaviour','emotional','learning','sensory','feeding','sleep','medical','genetic','everyday'];
 const categories=window.RafiqParentExperience.categories.map(([en,ar],i)=>({id:categoryIds[i],title:p(en,ar)}));
 const types={diagnosis:p('Diagnoses and syndromes','تشخيصات ومتلازمات'),symptom:p('Symptoms and difficulties','أعراض وصعوبات'),development:p('Developmental concerns','مخاوف نمائية'),daily:p('Everyday challenges','تحديات يومية')};
 const rows=[
  ['autism',0,'diagnosis','Autism support','دعم التوحد',['passport','routines','sensory','play'],'speech'],
  ['development-delay',0,'development','Developmental delay','تأخر النمو',['growth','play'],'development'],
  ['motor',0,'development','Movement and coordination concerns','قلق بشأن الحركة والتناسق',['growth','health'],'development'],
  ['prematurity',0,'development','Development after premature birth','النمو بعد الولادة المبكرة',['growth','health'],'pediatrician'],
  ['speech-delay',1,'development','Speech and language delay','تأخر النطق واللغة',['speech','play'],'speech'],
  ['speech-sounds',1,'symptom','Speech sound difficulties','صعوبات أصوات الكلام',['speech'],'speech'],
  ['stuttering',1,'symptom','Stuttering concerns','قلق بشأن التأتأة',['speech'],'speech'],
  ['communication',1,'development','Social communication concerns','قلق بشأن التواصل الاجتماعي',['speech','growth'],'speech'],
  ['adhd',2,'diagnosis','ADHD support','دعم فرط الحركة وتشتت الانتباه',['behaviour','play'],'psychology'],
  ['tantrums',2,'daily','Tantrums and transitions','نوبات الغضب والانتقالات',['behaviour','growth'],'psychology'],
  ['impulsivity',2,'symptom','Impulsivity and following instructions','الاندفاع وصعوبة اتباع التعليمات',['behaviour'],'psychology'],
  ['separation',3,'daily','Separation worries','القلق وقت الانفصال',['behaviour','growth'],'psychology'],
  ['anxiety',3,'symptom','Anxiety and emotional worries','القلق والصعوبات العاطفية',['behaviour','growth'],'psychology'],
  ['early-learning',4,'development','Early learning concerns','قلق بشأن التعلّم المبكر',['growth','play'],'development'],
  ['learning-diagnosis',4,'diagnosis','Reported learning difficulties','صعوبات تعلّم مسجّلة',['growth','specialists'],'psychology'],
  ['sound',5,'symptom','Sound and light preferences','تفضيلات الصوت والضوء',['health','behaviour'],'development'],
  ['textures',5,'symptom','Touch and texture preferences','تفضيلات اللمس والملمس',['growth','health'],'development'],
  ['sensory-seeking',5,'symptom','Sensory-seeking observations','ملاحظات البحث عن الإحساس',['growth','health'],'development'],
  ['selective-eating',6,'daily','Selective eating','الانتقائية بالأكل',['feeding'],'pediatrician'],
  ['swallowing',6,'symptom','Chewing or swallowing concerns','قلق بشأن المضغ أو البلع',['health','specialists'],'pediatrician'],
  ['allergies',6,'diagnosis','Reported food allergies','حساسية طعام مسجّلة',['health'],'pediatrician'],
  ['bedtime',7,'daily','Bedtime routines','روتين وقت النوم',['sleep'],'pediatrician'],
  ['waking',7,'symptom','Night waking and sleep concerns','الاستيقاظ الليلي وصعوبات النوم',['sleep','health'],'pediatrician'],
  ['hearing',8,'symptom','Hearing concerns','قلق بشأن السمع',['health','speech'],'pediatrician'],
  ['vision',8,'symptom','Vision concerns','قلق بشأن النظر',['health'],'pediatrician'],
  ['ongoing-health',8,'diagnosis','An ongoing medical condition','حالة صحية مستمرة',['health','appointments'],'pediatrician'],
  ['down-syndrome',9,'diagnosis','Down syndrome support','دعم متلازمة داون',['growth','health','speech'],'development'],
  ['genetic-syndromes',9,'diagnosis','Other reported genetic syndromes','متلازمات وراثية أخرى مسجّلة',['health','growth','specialists'],'pediatrician'],
  ['friendships',10,'daily','Friendships and shared play','الصداقات واللعب المشترك',['play','behaviour'],'psychology'],
  ['preschool',10,'daily','Starting preschool','البدء بالحضانة أو الروضة',['behaviour','play'],'psychology'],
  ['independence',10,'daily','Independence and daily participation','الاستقلالية والمشاركة اليومية',['growth','play'],'development'],
  ['toileting',10,'daily','Toileting routines','روتين استخدام الحمّام',['health','growth'],'pediatrician']
 ];
 // Phase 4: what each topic means, in parent-friendly words. Descriptions only; no causes, prevalence or treatment claims.
 const about={
  autism:p('Support for families of a child with a reported autism diagnosis: routines, communication and preferences.','دعم لعيلة طفل عنده تشخيص توحد مسجّل: الروتين والتواصل والتفضيلات.'),
  'development-delay':p('When several skills seem to come more slowly than you expected, or a professional mentioned a delay.','لما كذا مهارة تبيّن إنها جاية أبطأ من اللي توقعتوه، أو حكى مختص عن تأخر.'),
  motor:p('Questions about sitting, walking, balance, or using hands in everyday tasks.','أسئلة عن القعدة أو المشي أو التوازن أو استعمال الإيدين بالمهام اليومية.'),
  prematurity:p('Following development and health after an early birth, using corrected age where it applies.','متابعة النمو والصحة بعد ولادة مبكرة، بالعمر المصحّح لما ينطبق.'),
  'speech-delay':p('When your child understands or uses fewer words than you expected for their age.','لما يفهم طفلكم أو يستعمل كلمات أقل من اللي توقعتوه لعمره.'),
  'speech-sounds':p('When some sounds are unclear, so others find words hard to understand.','لما بعض الأصوات مش واضحة، فالناس بيصعب عليهم يفهموا الكلام.'),
  stuttering:p('Repeating sounds or words, stretching sounds, or getting stuck when starting to talk.','تكرار أصوات أو كلمات، أو مطّ الأصوات، أو التعلّق ببداية الكلام.'),
  communication:p('Questions about eye contact, sharing attention, back-and-forth play or responding to their name.','أسئلة عن النظر بالعيون، مشاركة الانتباه، اللعب المتبادل أو الاستجابة لاسمه.'),
  adhd:p('Support for families of a child with a reported ADHD diagnosis: attention, activity and daily routines.','دعم لعيلة طفل عنده تشخيص مسجّل بفرط الحركة وتشتت الانتباه: الانتباه والنشاط والروتين.'),
  tantrums:p('Big feelings, meltdowns, or hard moments when moving from one activity to the next.','مشاعر قوية أو نوبات غضب، أو لحظات صعبة بالانتقال من نشاط لنشاط.'),
  impulsivity:p('Acting before thinking, finding it hard to wait, or not following instructions.','التصرّف قبل التفكير، صعوبة الانتظار، أو عدم اتباع التعليمات.'),
  separation:p('Strong worry when a parent leaves, for example at bedtime or at childcare.','قلق قوي لما يبعد الأهل، مثلًا وقت النوم أو بالحضانة.'),
  anxiety:p('Fears, worries or sadness that seem to affect your child’s day.','مخاوف أو قلق أو حزن مأثّر على يوم طفلكم.'),
  'early-learning':p('Questions about early skills like listening to stories, colours, counting or solving small problems.','أسئلة عن مهارات مبكرة مثل سماع القصص، الألوان، العدّ أو حل مشاكل صغيرة.'),
  'learning-diagnosis':p('Support when a professional has reported a learning difficulty.','دعم لما يكون مختص سجّل صعوبة تعلّم.'),
  sound:p('Strong reactions to noise, bright light or busy places.','ردود فعل قوية على الأصوات أو الضو القوي أو الأماكن المزدحمة.'),
  textures:p('Strong likes or dislikes for clothes, food textures, touch or messy play.','حب أو نفور قوي من أواعي أو ملمس أكل أو لمس أو لعب بأشياء بتوسّخ.'),
  'sensory-seeking':p('Looking for a lot of movement, touch, spinning or crashing into things.','بيدوّر على حركة كثير أو لمس أو دوران أو الارتطام بالأشياء.'),
  'selective-eating':p('Eating only a few foods, or mealtimes that feel like a struggle.','بياكل أنواع قليلة، أو وقت الأكل متعب.'),
  swallowing:p('Coughing, gagging or difficulty chewing or swallowing at meals. If eating or breathing ever seems unsafe, contact a doctor straight away.','كحّة أو ترجيع أو صعوبة بالمضغ أو البلع وقت الأكل. إذا الأكل أو التنفّس بيّن مش آمن، تواصلوا مع طبيب فورًا.'),
  allergies:p('Keeping a reported food allergy and your care team’s instructions in one place.','حفظ حساسية الطعام المسجّلة وتعليمات فريق الرعاية بمكان واحد.'),
  bedtime:p('Settling to sleep and building a calm, predictable bedtime routine.','التهدئة للنوم وبناء روتين نوم هادي ومتوقّع.'),
  waking:p('Waking often at night, waking very early, or sleep that worries you.','الصحيان كثير بالليل، أو الصحيان بكير كثير، أو نوم مقلقكم.'),
  hearing:p('Questions about how your child responds to sounds, voices or their name.','أسئلة عن استجابة طفلكم للأصوات أو للكلام أو لاسمه.'),
  vision:p('Questions about how your child looks at things, follows objects or sees at a distance.','أسئلة عن كيف طفلكم بيطّلع على الأشياء، بيتابعها، أو بيشوف عن بعد.'),
  'ongoing-health':p('Keeping visits, medicines and questions together for a long-term health condition.','حفظ الزيارات والأدوية والأسئلة مع بعض لحالة صحية مستمرة.'),
  'down-syndrome':p('Support for families of a child with a reported Down syndrome diagnosis.','دعم لعيلة طفل عنده تشخيص مسجّل بمتلازمة داون.'),
  'genetic-syndromes':p('Support for families when another genetic condition has been reported.','دعم للعيلة لما تكون حالة وراثية ثانية مسجّلة.'),
  friendships:p('Playing with other children, sharing, taking turns and making friends.','اللعب مع الأطفال، المشاركة، الدور وتكوين صحاب.'),
  preschool:p('Getting ready for nursery or preschool, and settling in.','التحضير للحضانة أو الروضة والتأقلم فيها.'),
  independence:p('Everyday self-care like dressing, eating and helping at home.','العناية بالنفس يوميًا مثل اللبس والأكل والمساعدة بالبيت.'),
  toileting:p('Learning to use the toilet, and questions about readiness or accidents.','تعلّم استعمال الحمّام، وأسئلة عن الجاهزية أو الحوادث.')
 };
 const icons={development:'child',speech:'talk',behaviour:'wave',emotional:'smile',learning:'puzzle',sensory:'ear',feeding:'spoon',sleep:'moon',medical:'steth',genetic:'dna',everyday:'home'};
 categories.forEach(c=>{c.icon=icons[c.id];});
 // Tools built for one topic only; every other topic uses Rafiq's shared services.
 const dedicated={autism:['passport','routines','sensory']};
 const topics=rows.map(([id,category,type,en,ar,services,specialty])=>({id,category:categoryIds[category],type,title:p(en,ar),services,specialty,about:about[id],dedicated:dedicated[id]||[]}));
 const normalize=value=>String(value||'').toLowerCase().normalize('NFKD').replace(/[\u064b-\u065f\u0670\u0300-\u036f]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ـ/g,'').trim();
 function search({query='',category='',type=''}={}){const words=normalize(query).split(/\s+/).filter(Boolean);return topics.filter(topic=>(!category||topic.category===category)&&(!type||topic.type===type)&&words.every(word=>normalize([topic.title.en,topic.title.ar,categories.find(c=>c.id===topic.category).title.en,categories.find(c=>c.id===topic.category).title.ar].join(' ')).includes(word)));}
 window.RafiqSupportCatalog={categories,types,topics,search};
})();
