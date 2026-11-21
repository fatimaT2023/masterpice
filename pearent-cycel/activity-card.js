/* Phase 4: a visual "at a glance" view of the existing daily play idea.
   It only presents fields already in RafiqDailyMoments (age range, duration,
   materials, skill, steps, source). Play ideas are not tests or treatment.
   Requires parent-services-kit.js. */
(() => {
 'use strict';
 const K=window.RafiqServicesKit,{p,t,num,el,svg}=K,ar=K.dict;
 const copy={
  glance:p('Today’s activity at a glance','نشاط اليوم بلمحة'),
  age:p('Suits ages','مناسب لعمر'),time:p('Time','المدة'),need:p('You need','بتحتاجوا'),skill:p('Supports','بيدعم'),
  why:p('Why try it','ليش نجرّبه'),how:p('How to play','كيف نلعب'),
  safety:p('Stay together and follow your child’s cues. Stop whenever either of you needs a break.','خلّيكم مع بعض وانتبهوا لإشارات طفلكم. وقّفوا أي وقت حدا فيكم بحتاج استراحة.'),
  record:p('After playing, choose how it went and save it. It goes into this child’s growth journal.','بعد اللعب، اختاروا كيف كانت التجربة واحفظوها. بتنحفظ بسجل نمو هالطفل.'),
  months:p('months','شهر'),
  done:{tried:p('Saved: you tried it together','انحفظ: جرّبتوه سوا'),later:p('Saved for later','انحفظ لوقت ثاني'),'not-for-us':p('Saved: we won’t suggest this idea again','انحفظ: ما رح نقترح هالفكرة مرة ثانية')},
  doneHelp:{tried:p('Your note is in the growth journal. A new idea comes tomorrow.','ملاحظتكم صارت بسجل النمو. فكرة جديدة بتيجي بكرا.'),later:p('No need to finish today. You can come back and update it.','مش لازم تكملوه اليوم. بتقدروا ترجعوا وتعدّلوه.'),'not-for-us':p('Ideas marked “Not for us” are left out on future days.','الأفكار اللي اخترتوا إنها «مش إلنا» ما بترجع بالأيام الجاية.')},
  journal:p('See it in the growth journal','شوفوه بسجل النمو'),more:p('Browse other activities','تصفّحوا أنشطة ثانية'),
  stepOf:p('Step {0} of {1}','الخطوة {0} من {1}'),
  notTest:p('A play idea, not a developmental test.','فكرة لعب، مش اختبار نمو.')
 };
 // Pick an illustration from words already in the step; default is a shared moment.
 function stepIcon(text){const s=String(text).toLowerCase();if(/book|read|page|story/.test(s))return 'book';if(/sing|song|rhyme|tune|music/.test(s))return 'music';if(/block|stack|cup|ball|toy|sort|match|puzzle|sock/.test(s))return 'blocks';if(/look|picture|point|gaze|watch|see/.test(s))return 'look';if(/jump|walk|move|dance|clap|crawl|roll|throw/.test(s))return 'move';if(/say|talk|sound|word|voice|name|ask|speak|echo/.test(s))return 'talk';return 'heart';}
 function ageRange(item){return num(item.minMonths)+'–'+num(item.maxMonthsExclusive-1)+' '+t(copy.months);}
 function fact(icon,label,value,cls=''){const li=el('li','ac-fact '+cls);li.innerHTML=svg(icon);const box=el('span');box.append(el('small',undefined,label),el('strong',undefined,value));li.append(box);return li;}
 let current=null;
 function render(host,item){
  host.replaceChildren();host.dataset.noTranslate='';host.className='activity-glance';host.setAttribute('aria-label',t(copy.glance));
  const facts=el('ul','ac-facts');
  facts.append(fact('child',t(copy.age),ageRange(item),'is-age'),fact('clock',t(copy.time),ar(item.duration)),fact('bag',t(copy.need),ar(item.materials),'is-wide'));
  const skill=window.RafiqActivityMatching?.skills?.[item.targetSkill];if(skill)facts.append(fact('star',t(copy.skill),ar(skill)));
  const why=el('div','ac-why');why.append(el('h3',undefined,t(copy.why)),el('p',undefined,ar(item.insight)));
  const how=el('div','ac-how');how.append(el('h3',undefined,t(copy.how)));const list=el('ol','ac-steps');
  item.steps.forEach((step,i)=>{const li=el('li','ac-step'),pic=el('span','ac-step-pic');pic.innerHTML=svg(stepIcon(step),26);pic.append(el('span','ac-step-num',num(i+1)));li.append(pic,el('p',undefined,ar(step)));list.append(li);});
  how.append(list);
  const note=el('p','ac-note');note.innerHTML=svg('info',18);note.append(el('span',undefined,t(copy.safety)+' '+t(copy.record)));
  host.append(facts,why,how,note);
 }
 function mount(item){
  const anchor=document.getElementById('dailyStart');if(!anchor||!item)return null;
  let host=document.getElementById('activityGlance');
  if(!host){host=el('section');host.id='activityGlance';(anchor.closest('.daily-start-wrap')||anchor).before(host);}
  current=item;render(host,item);return host;
 }
 // Outcome-specific completion state shown inside the existing saved panel.
 let lastRecord=null;
 function done(record){
  const panel=document.getElementById('dailySaved');if(!panel||!record)return;lastRecord=record;
  let box=document.getElementById('activityDone');if(!box){box=el('div','activity-done');box.id='activityDone';box.dataset.noTranslate='';box.setAttribute('role','status');panel.prepend(box);}
  const outcome=Object.hasOwn(copy.done,record.outcome)?record.outcome:'tried';box.dataset.outcome=outcome;box.replaceChildren();
  const icon=el('span','activity-done-icon');icon.innerHTML=svg(outcome==='tried'?'check':outcome==='later'?'clock':'skip',26);
  const text=el('div');text.append(el('strong',undefined,t(copy.done[outcome])),el('p',undefined,t(copy.doneHelp[outcome])));
  const links=el('div','activity-done-links');links.append(K.link(t(copy.journal),'milestones.html?filter=daily-moment#savedObservations'),K.link(t(copy.more),'activities.html'));
  text.append(links);box.append(icon,text);
 }
 const stepCount=(n,total)=>t(copy.stepOf).replace('{0}',num(n)).replace('{1}',num(total));
 K.onLang(()=>{const host=document.getElementById('activityGlance');if(host&&current)render(host,current);if(lastRecord&&document.getElementById('activityDone'))done(lastRecord);});
 window.RafiqActivityCard={mount,done,stepCount,ageRange,stepIcon,copy,get current(){return current;}};
})();
