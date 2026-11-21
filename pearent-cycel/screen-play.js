/* Play on screen: three short, calm games a parent plays WITH their child (2 years+).
   No timers, no scores, no "wrong" sounds. A wrong tap gets a gentle "try another".
   The saved result records only that you played and what the parent noticed — never
   which answers were right. Requires parent-services-kit.js and activity-play-kit.js. */
(() => {
 'use strict';
 const K=window.RafiqServicesKit,{p,t,num,el,svg}=K;
 const shapes={
  circle:{label:p('circle','دائرة'),d:'<circle cx="50" cy="50" r="38"/>'},
  square:{label:p('square','مربّع'),d:'<rect x="14" y="14" width="72" height="72" rx="8"/>'},
  triangle:{label:p('triangle','مثلّث'),d:'<path d="M50 10 L90 86 H10 Z"/>'},
  star:{label:p('star','نجمة'),d:'<path d="M50 8l12 26 28 3-21 19 6 28-25-14-25 14 6-28-21-19 28-3z"/>'},
  heart:{label:p('heart','قلب'),d:'<path d="M50 86C20 64 8 46 14 30 20 14 40 12 50 28 60 12 80 14 86 30 92 46 80 64 50 86z"/>'}
 };
 const faces={
  happy:{label:p('happy','مبسوط'),mouth:'<path d="M30 60 Q50 80 70 60" />',eyes:'<circle cx="36" cy="40" r="5"/><circle cx="64" cy="40" r="5"/>',ask:p('Ask: “What makes you happy?”','اسألوه: «شو بيفرّحك؟»')},
  sad:{label:p('sad','زعلان'),mouth:'<path d="M32 72 Q50 56 68 72" />',eyes:'<circle cx="36" cy="42" r="5"/><circle cx="64" cy="42" r="5"/><path d="M28 35 L42 30 M72 35 L58 30"/>',ask:p('Ask: “What helps when you feel sad?”','اسألوه: «شو بيساعدك لما تزعل؟»')},
  surprised:{label:p('surprised','متفاجئ'),mouth:'<circle cx="50" cy="68" r="9" />',eyes:'<circle cx="36" cy="40" r="7"/><circle cx="64" cy="40" r="7"/>',ask:p('Make a surprised face together!','اعملوا وجه متفاجئ مع بعض!')},
  sleepy:{label:p('sleepy','نعسان'),mouth:'<path d="M42 68 H58" />',eyes:'<path d="M28 42 Q36 48 44 42 M56 42 Q64 48 72 42"/>',ask:p('Ask: “What do you do when you feel sleepy?”','اسألوه: «شو بتعمل لما تنعس؟»')}
 };
 const colours=['#e07a9b','#5b8fd6','#f0b54a','#5fb58a','#9b7bd1'];
 const shuffle=(a,seed)=>{const r=[...a];let s=seed||Date.now()%9973;for(let i=r.length-1;i>0;i--){s=(s*9301+49297)%233280;const j=Math.floor(s/233280*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;};
 const shapeSvg=(key,{outline=false,colour='#5b8fd6',size=96}={})=>'<svg viewBox="0 0 100 100" width="'+size+'" height="'+size+'" aria-hidden="true" focusable="false"><g fill="'+(outline?'none':colour)+'" stroke="'+(outline?'currentColor':'rgba(0,0,0,.08)')+'" stroke-width="'+(outline?5:2)+'" stroke-dasharray="'+(outline?'9 7':'0')+'" stroke-linejoin="round">'+shapes[key].d+'</g></svg>';
 const faceSvg=key=>'<svg viewBox="0 0 100 100" width="104" height="104" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="44" fill="#ffe3b3" stroke="rgba(0,0,0,.12)" stroke-width="2"/><g fill="#3d3a36" stroke="#3d3a36" stroke-width="4" stroke-linecap="round">'+faces[key].eyes+'</g><g fill="none" stroke="#3d3a36" stroke-width="5" stroke-linecap="round">'+faces[key].mouth+'</g></svg>';
 const sizeSvg=(scale,colour)=>'<svg viewBox="0 0 100 100" width="'+Math.round(130*scale)+'" height="'+Math.round(130*scale)+'" aria-hidden="true" focusable="false"><g fill="'+colour+'" stroke="rgba(0,0,0,.08)" stroke-width="2">'+shapes.star.d+'</g></svg>';
 // Each game: age range, rounds built from fixed content, prompt + choices per round.
 const games={
  shapes:{id:'shapes',icon:'puzzle',minMonths:24,maxMonthsExclusive:84,title:p('Shape match','نطابق الأشكال'),about:p('Find the shape that fits the dotted outline.','دوّروا على الشكل اللي بيركب على الخط المنقّط.'),tip:p('Say the shape’s name together as you find it.','احكوا اسم الشكل مع بعض لما تلاقوه.'),
   rounds(seed){return shuffle(Object.keys(shapes),seed).slice(0,4).map((target,i)=>({target,choices:shuffle([target,...shuffle(Object.keys(shapes).filter(k=>k!==target),seed+i).slice(0,2)],seed+7*i)}));},
   prompt:r=>p('Which shape fits the outline?','أي شكل بيركب على الخط؟'),
   stage:r=>{const s=el('div','sp-target');s.innerHTML=shapeSvg(r.target,{outline:true,size:132});return s;},
   choice:(key,i)=>({html:shapeSvg(key,{colour:colours[i%colours.length]}),label:t(shapes[key].label)}),
   right:r=>p('Yes! It’s the {0}.','أيوه! هاي {0}.'),value:r=>t(shapes[r.target].label)},
  sizes:{id:'sizes',icon:'star',minMonths:24,maxMonthsExclusive:60,title:p('Big and small','كبير وصغير'),about:p('Tap the big star, then the small one.','اضغطوا على النجمة الكبيرة، وبعدين الصغيرة.'),tip:p('Show “big” and “small” with your arms too.','فرجوا «كبير» و«صغير» بإيديكم كمان.'),
   rounds(seed){return ['big','small','big','small'].map((ask,i)=>({ask,order:shuffle(['big','small'],seed+i),colour:colours[(seed+i)%colours.length]}));},
   prompt:r=>r.ask==='big'?p('Tap the big star','اضغطوا على النجمة الكبيرة'):p('Tap the small star','اضغطوا على النجمة الصغيرة'),
   stage:()=>null,
   choice:(key,i,r)=>({html:sizeSvg(key==='big'?1:.5,r.colour),label:t(key==='big'?p('big star','نجمة كبيرة'):p('small star','نجمة صغيرة'))}),
   right:r=>r.ask==='big'?p('Yes, that’s the big one!','أيوه، هاي الكبيرة!'):p('Yes, that’s the small one!','أيوه، هاي الصغيرة!'),value:()=>''},
  feelings:{id:'feelings',icon:'smile',minMonths:36,maxMonthsExclusive:84,title:p('Feelings faces','وجوه المشاعر'),about:p('Find the face that matches the feeling, then talk about it.','دوّروا على الوجه اللي بيطابق الشعور، وبعدين احكوا عنه.'),tip:p('Copy each face together in a mirror or with each other.','قلّدوا كل وجه مع بعض.'),
   rounds(seed){return shuffle(Object.keys(faces),seed).map((target,i)=>({target,choices:shuffle([target,...shuffle(Object.keys(faces).filter(k=>k!==target),seed+i).slice(0,2)],seed+3*i)}));},
   prompt:r=>({en:'Find the '+faces[r.target].label.en+' face',ar:'دوّروا على الوجه ال'+faces[r.target].label.ar}),
   stage:()=>null,
   choice:key=>({html:faceSvg(key),label:t(faces[key].label)}),
   right:r=>faces[r.target].ask,value:()=>''}
 };
 const copy={
  title:p('Play on screen','نلعب على الشاشة'),
  lead:p('Short games to play side by side. Your child taps; you read the words and talk together.','ألعاب قصيرة تلعبوها جنب بعض. طفلكم بيضغط، وإنتو بتقرأوا الكلام وبتحكوا سوا.'),
  rules:p('No timer, no score. A wrong tap just means “let’s try another”.','بدون وقت ولا علامات. الضغطة الغلط معناها «يلا نجرّب غيرها».'),
  age:p('Ages {0}','لأعمار {0}'),from2:p('Rafiq keeps screen games for children 2 years and older. Try a Play together activity instead.','رفيق بيخلّي ألعاب الشاشة للأطفال من سنتين وفوق. جرّبوا نشاط «نلعب سوا» بدالها.'),
  notYet:p('Suits ages {0}. Not available for {1}’s age.','مناسب لأعمار {0}. مش متاح لعمر {1}.'),
  play:p('Play','العبوا'),start:p('Start','ابدأوا'),rounds:p('{0} short rounds · about 3 minutes','{0} جولات قصيرة · حوالي ٣ دقايق'),
  sit:p('Sit together and let your child tap. Stop whenever they want.','اقعدوا سوا وخلّوا طفلكم يضغط. وقّفوا وقت ما بده.'),
  round:p('Round {0} of {1}','الجولة {0} من {1}'),tryAgain:p('Let’s try another one.','يلا نجرّب وحدة ثانية.'),
  next:p('Next round','الجولة الجاية'),finishBtn:p('Finish','خلصنا'),stop:p('Stop here','وقّفوا هون'),
  how:p('How was it?','كيف كانت؟'),
  outcomes:{tried:p('We played together','لعبنا سوا'),later:p('We stopped early','وقّفنا بكير')},
  save:p('Save','احفظوا'),chooseFirst:p('Choose one to save.','اختاروا وحدة لتحفظوا.'),
  doneTitle:p('Nice playing together','حلو لعبكم سوا'),doneText:p('You played {0} rounds side by side. Rafiq saved that you played, not which answers were right.','لعبتوا {0} جولات جنب بعض. رفيق حفظ إنكم لعبتوا، مش أي أجوبة كانت صح.'),
  again:p('Play again','العبوا كمان مرة'),others:p('Other games','ألعاب ثانية'),together:p('Prefer to play away from the screen? Open today’s Play together activity.','بتفضّلوا تلعبوا بعيد عن الشاشة؟ افتحوا نشاط «نلعب سوا» تبع اليوم.'),
  saveError:p('We couldn’t save. Your choices are still here; please try again.','ما قدرنا نحفظ. اختياراتكم لسه هون؛ جرّبوا مرة ثانية.'),
  back:p('Back to activities','رجوع للأنشطة'),noChild:p('Add a child first to play.','أضيفوا طفل أول لتلعبوا.')
 };
 const fill=(s,...v)=>v.reduce((o,x,i)=>o.split('{'+i+'}').join(x),s);
 const range=g=>{const a=g.minMonths>=24&&g.minMonths%12===0?g.minMonths/12:null,b=g.maxMonthsExclusive/12;return K.lang()==='ar'?(a?num(a):num(g.minMonths/12))+'–'+num(b)+' سنوات':(a??g.minMonths/12)+'–'+b+' years';};
 let root,child,months,state=null;
 function suitable(g){return Number.isFinite(months)&&months>=g.minMonths&&months<g.maxMonthsExclusive;}
 function btn(label,cls,fn,icon){const b=el('button',cls);b.type='button';if(icon)b.innerHTML=svg(icon,18);b.append(el('span',undefined,label));b.addEventListener('click',fn);return b;}
 function focusHeading(){const h=root.querySelector('h1,h2');if(h){h.tabIndex=-1;h.focus({preventScroll:false});}}
 // Game list.
 function list(){
  state=null;const P=window.RafiqPlayKit;root.replaceChildren();
  const head=el('header','sp-head');head.append(K.icon('puzzle','ps-icon'),(()=>{const d=el('div');d.append(el('h1',undefined,t(copy.title)),el('p','pk-lead',t(copy.lead)),el('p','pk-help',t(copy.rules)));return d;})());
  root.append(K.link(t(copy.back),'activities.html','pk-back'),head);
  if(!child){root.append(el('p','pk-error',t(copy.noChild)));return;}
  if(!(months>=24)){const box=el('div','ps-panel');box.append(P.scene('people'),el('p','pk-lead',t(copy.from2)),K.link(t(p('Open today’s activity','افتحوا نشاط اليوم')),'daily-activity.html','pk-primary'));root.append(box);return;}
  const grid=el('div','sp-games');
  for(const g of Object.values(games)){
   const card=el('article','sp-game');card.dataset.game=g.id;const ok=suitable(g);if(!ok)card.classList.add('is-unavailable');
   card.append(P.scene(g.icon),el('h2',undefined,t(g.title)),el('p',undefined,t(g.about)),el('span','ps-badge',fill(t(copy.age),range(g))));
   if(ok)card.append(btn(t(copy.play),'pk-primary',()=>intro(g.id),'heart'));else{const n=el('p','pk-help');const [a,b='']=fill(t(copy.notYet),range(g)).split('{1}');n.append(a,K.name(child),b);card.append(n);}
   grid.append(card);
  }
  root.append(grid,(()=>{const n=el('p','pk-help sp-together');n.append(K.link(t(copy.together),'daily-activity.html'));return n;})());
  const url=new URL(location.href);url.searchParams.delete('game');history.replaceState(null,'',url);
 }
 function intro(id){
  const g=games[id];if(!g||!suitable(g)){list();return;}const P=window.RafiqPlayKit;
  state={g,round:0,rounds:g.rounds(Date.now()%9973),played:0,answered:false,outcome:null,noticed:new Set(),note:''};
  const url=new URL(location.href);url.searchParams.set('game',id);history.replaceState(null,'',url);
  root.replaceChildren();const box=el('section','sp-stage');
  const start=btn(t(copy.start),'pk-primary',()=>play(),'heart');start.id='spStart';
  box.append(el('div','pk-top-inline',),P.scene(g.icon),el('h2',undefined,t(g.title)),el('p','pk-lead',t(g.about)),el('p','pk-help',fill(t(copy.rounds),num(state.rounds.length))),el('p','pk-help',t(copy.sit)),el('p','pk-tip',t(g.tip)));
  box.querySelector('.pk-top-inline').append(P.soundToggle());
  const nav=el('div','pk-nav');nav.append(btn(t(copy.others),'pk-secondary',list),start);box.append(nav);
  root.append(box);start.focus();
 }
 function play(){
  const P=window.RafiqPlayKit,{g}=state,r=state.rounds[state.round];state.answered=false;
  root.replaceChildren();const box=el('section','sp-stage is-playing');box.dataset.game=g.id;
  const top=el('div','pk-top-inline');top.append(P.soundToggle(),btn(t(copy.stop),'pk-ghost',finish,'clock'));
  const h=el('h2','sp-prompt',t(g.prompt(r)));h.setAttribute('aria-live','polite');
  const stage=g.stage(r);
  const choices=el('div','sp-choices');const keys=g.id==='sizes'?r.order:r.choices;
  const feedback=el('p','sp-feedback');feedback.setAttribute('role','status');
  const next=btn(state.round===state.rounds.length-1?t(copy.finishBtn):t(copy.next),'pk-primary sp-next',()=>{state.round++;if(state.round>=state.rounds.length)finish();else play();},'heart');next.hidden=true;next.id='spNext';
  keys.forEach((key,i)=>{const c=g.choice(key,i,r),b=el('button','sp-choice');b.type='button';b.dataset.key=key;b.innerHTML=c.html;b.setAttribute('aria-label',c.label);
   b.addEventListener('click',()=>{if(state.answered)return;const right=g.id==='sizes'?key===r.ask:key===r.target;
    if(right){state.answered=true;state.played=state.round+1;b.classList.add('is-right');choices.querySelectorAll('.sp-choice').forEach(o=>{if(o!==b)o.classList.add('is-faded');o.setAttribute('aria-disabled','true');});if(stage&&g.id==='shapes')stage.classList.add('is-filled');feedback.textContent=fill(t(g.right(r)),g.value(r));next.hidden=false;next.focus();P.sound.play();}
    else{b.classList.remove('is-try');void b.offsetWidth;b.classList.add('is-try');feedback.textContent=t(copy.tryAgain);P.sound.play('soft');}
   });choices.append(b);});
  box.append(top,P.progress(state.round,state.rounds.length,fill(t(copy.round),num(state.round+1),num(state.rounds.length))),h);if(stage)box.append(stage);box.append(choices,feedback,next);
  root.append(box);h.tabIndex=-1;h.focus();
 }
 function finish(){
  const P=window.RafiqPlayKit,{g}=state;root.replaceChildren();const box=el('section','sp-stage');
  const h=el('h2',undefined,t(copy.how));h.id='spHow';
  const outs=el('div','pk-outcomes');outs.setAttribute('role','radiogroup');outs.setAttribute('aria-labelledby','spHow');
  for(const [key,icon] of [['tried','check'],['later','clock']]){const b=el('button','pk-outcome');b.type='button';b.setAttribute('role','radio');b.dataset.outcome=key;b.setAttribute('aria-checked',String(state.outcome===key));b.innerHTML=svg(icon,26);b.append(el('span',undefined,t(copy.outcomes[key])));b.addEventListener('click',()=>{state.outcome=key;outs.querySelectorAll('.pk-outcome').forEach(o=>o.setAttribute('aria-checked',String(o===b)));msg.textContent='';});outs.append(b);}
  const note=P.noteField('spNote',state.note);note.querySelector('textarea').addEventListener('input',e=>{state.note=e.target.value;});
  const msg=el('p','pk-error');msg.setAttribute('role','status');
  const save=btn(t(copy.save),'pk-primary',()=>{if(!state.outcome){msg.textContent=t(copy.chooseFirst);return;}if(saveResult())done();else msg.textContent=t(copy.saveError);},'check');save.id='spSave';
  const nav=el('div','pk-nav');nav.append(save);
  box.append(P.scene(g.icon),h,outs,P.noticedPicker(state.noticed),note,msg,nav);root.append(box);outs.querySelector('button').focus();
 }
 // Saved alongside other activity results; correctness is never stored.
 function saveResult(){
  try{
   const {g}=state,key='rafiqAgeObservations_'+child.id,notes=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(notes))throw Error('Invalid notes');
   const latest=window.RafiqSetup.readChildren().find(c=>c.id===child.id);if(!latest)throw Error('Child missing');
   const ctx=window.RafiqSetup.childContext(latest),now=new Date(),day=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
   const note=state.note.trim(),labels={tried:'We played together',later:'We stopped early'};
   const record=window.RafiqFamily.stamp({id:'screen_'+child.id+'_'+g.id+'_'+now.getTime(),type:'screen-play',mode:'screen',childId:child.id,day,activityId:'screen-'+g.id,activityTitle:g.title.en,outcome:state.outcome,note,noticed:[...state.noticed],roundsPlayed:state.played,roundsOffered:state.rounds.length,text:g.title.en+' — '+labels[state.outcome]+(note?'\n'+note:''),sourcePage:'play-on-screen.html',createdAt:now.toISOString(),updatedAt:now.toISOString(),chronologicalAgeMonths:ctx.chronological?.totalMonths??null,ageDays:ctx.chronological?.days??null});
   notes.push(record);localStorage.setItem(key,JSON.stringify(notes));window.RafiqFamily.notify(child.id,'Activity response saved','activities.html?tab=history');window.dispatchEvent(new Event('rafiq:screen-play-saved'));return true;
  }catch{return false;}
 }
 function done(){
  const P=window.RafiqPlayKit,{g}=state;root.replaceChildren();const box=el('section','sp-stage');
  const again=btn(t(copy.again),'pk-secondary',()=>intro(g.id),'heart'),others=btn(t(copy.others),'pk-secondary',list),hist=K.link(t(P.copy.history),'activities.html?tab=history','pk-primary');hist.id='spHistory';
  const nav=el('div','pk-nav');nav.append(others,again,hist);
  box.append(P.completion({title:t(copy.doneTitle),message:fill(t(copy.doneText),num(state.played)),child,noticedKeys:[...state.noticed]}),nav);
  root.append(box);P.sound.play('done');focusHeading();
 }
 function rerender(){if(!state)list();else if(root.querySelector('.sp-stage.is-playing'))play();else if(root.querySelector('#spHow'))finish();else if(root.querySelector('.pk-complete'))done();else intro(state.g.id);}
 document.addEventListener('DOMContentLoaded',()=>{
  root=document.getElementById('screenPlay');if(!root)return;root.dataset.noTranslate='';
  try{const requested=new URLSearchParams(location.search).get('child')||window.RafiqFamily.selected();child=window.RafiqSetup.readChildren().find(c=>c.id===requested)||window.RafiqSetup.readChildren()[0];if(child)window.RafiqFamily.select(child.id);const ctx=child?window.RafiqSetup.childContext(child):null;months=ctx?.development?.totalMonths??ctx?.chronological?.totalMonths;}catch{child=null;}
  const id=new URLSearchParams(location.search).get('game');if(id&&games[id])intro(id);else list();
  K.onLang(rerender);
 });
 window.RafiqScreenPlay={games,shapes,faces,suitable:(g,m)=>m>=g.minMonths&&m<g.maxMonthsExclusive,copy};
})();
