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
  ['separation',3,'daily','Separation worries','القلق وقت الانفصال',['behaviour'],'psychology'],
  ['anxiety',3,'symptom','Anxiety and emotional worries','القلق والصعوبات العاطفية',['behaviour','health'],'psychology'],
  ['early-learning',4,'development','Early learning concerns','قلق بشأن التعلّم المبكر',['growth','play'],'development'],
  ['learning-diagnosis',4,'diagnosis','Reported learning difficulties','صعوبات تعلّم مسجّلة',['growth','specialists'],'psychology'],
  ['sound',5,'symptom','Sound and light preferences','تفضيلات الصوت والضوء',['health','behaviour'],'development'],
  ['textures',5,'symptom','Touch and texture preferences','تفضيلات اللمس والملمس',['health'],'development'],
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
 const topics=rows.map(([id,category,type,en,ar,services,specialty])=>({id,category:categoryIds[category],type,title:p(en,ar),services,specialty}));
 const normalize=value=>String(value||'').toLowerCase().normalize('NFKD').replace(/[\u064b-\u065f\u0670\u0300-\u036f]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ـ/g,'').trim();
 function search({query='',category='',type=''}={}){const words=normalize(query).split(/\s+/).filter(Boolean);return topics.filter(topic=>(!category||topic.category===category)&&(!type||topic.type===type)&&words.every(word=>normalize([topic.title.en,topic.title.ar,categories.find(c=>c.id===topic.category).title.en,categories.find(c=>c.id===topic.category).title.ar].join(' ')).includes(word)));}
 window.RafiqSupportCatalog={categories,types,topics,search};
})();
