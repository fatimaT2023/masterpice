/* Play together: a step-by-step session for the existing daily play idea.
   One instruction per screen, optional preparation, pause/resume, then the parent's
   observation. Saving goes through the existing dailyFeedbackForm, so the original
   validation, per-day record, Plus rules and "Not for us" exclusion all still apply.
   Requires parent-services-kit.js, activity-card.js, activity-play-kit.js. */
(() => {
 'use strict';
 const K=window.RafiqServicesKit,{p,t,num,el,svg}=K;
 const copy={
  eyebrow:p('Play together','نلعب سوا'),
  start:p('Start activity','ابدأوا النشاط'),resume:p('Resume at step {0}','كمّلوا من الخطوة {0}'),again:p('Play it again','العبوه مرة ثانية'),restart:p('Start from the beginning','ابدأوا من الأول'),
  startHelp:p('One short instruction per screen. You can pause at any time.','تعليمة قصيرة بكل شاشة. بتقدروا توقفوا أي وقت.'),
  prep:p('Before you start (optional)','قبل ما تبدأوا (اختياري)'),
  prepCalm:p('A calm moment when your child is awake and comfortable','وقت هادي وطفلكم صاحي ومرتاح'),
  prepNeed:p('You need: {0}','بتحتاجوا: {0}'),prepClose:p('Sit close, at your child’s level','اقعدوا قريب، على مستوى طفلكم'),
  stepOf:p('Step {0} of {1}','الخطوة {0} من {1}'),
  back:p('Back','رجوع'),next:p('Next','التالي'),finish:p('We’re done','خلصنا'),pause:p('Pause','إيقاف مؤقت'),
  paused:p('Paused','متوقف مؤقتًا'),pausedHelp:p('Take your time. Your place is kept for today on this device.','خذوا وقتكم. مكانكم محفوظ لليوم على هالجهاز.'),
  resumeNow:p('Resume','كمّلوا'),closeForNow:p('Close for now','سكّروا هلّق'),
  how:p('How did it go?','كيف كانت؟'),howHelp:p('There is no right result. Stopping early is fine too.','ما في نتيجة صح أو غلط. إنكم توقفوا بكير كمان تمام.'),
  outcomes:{tried:p('We tried it','جرّبناه'),later:p('Maybe later','بوقت ثاني'),'not-for-us':p('Not for us','مش إلنا')},
  save:p('Save our moment','احفظوا لحظتنا'),chooseFirst:p('Choose how it went to save.','اختاروا كيف كانت لتحفظوا.'),
  doneTitle:{tried:p('Lovely time together','وقت حلو سوا'),later:p('Saved for later','انحفظ لوقت ثاني'),'not-for-us':p('Thanks for telling us','شكرًا إنكم حكيتولنا')},
  doneText:{tried:p('Every shared moment counts. A new idea comes tomorrow.','كل لحظة سوا إلها قيمة. فكرة جديدة بتيجي بكرا.'),later:p('No need to finish today. You can come back to it.','مش لازم تكملوه اليوم. بترجعوله وقت ما بدكم.'),'not-for-us':p('We won’t suggest this idea again while it is marked “Not for us”.','ما رح نقترح هالفكرة طول ما هي معلّمة «مش إلنا».')},
  closeSession:p('Pause and close','أوقفوا وسكّروا'),
  saveError:p('We couldn’t save this moment. Your choices are still here; please try again.','ما قدرنا نحفظ اللحظة. اختياراتكم لسه هون؛ جرّبوا مرة ثانية.')
 };
 const fill=(s,...v)=>v.reduce((o,x,i)=>o.split('{'+i+'}').join(x),s);
 const split=s=>String(s||'').split(/(?<=[.!?؟])\s+/).map(x=>x.trim()).filter(Boolean);
 let dialog,state=null,pendingNoticed=null;
 const childId=()=>window.RafiqFamily?.selected?.()||'';
 const child=()=>{try{return window.RafiqSetup.readChildren().find(c=>c.id===childId());}catch{return null;}};
 const dayKey=()=>window.RafiqDailyMoments?.dayKey?.()||new Date().toISOString().slice(0,10);
 const pauseKey=()=>'rafiqActivityPause_'+childId();
 function readPause(item){try{const v=JSON.parse(localStorage.getItem(pauseKey())||'null');return v&&v.activityId===item.id&&v.day===dayKey()&&Number.isInteger(v.index)?v:null;}catch{return null;}}
 function writePause(index){try{localStorage.setItem(pauseKey(),JSON.stringify({activityId:state.item.id,day:dayKey(),index}));}catch{/* Resume is a convenience. */}}
 function clearPause(){try{localStorage.removeItem(pauseKey());}catch{/* Nothing to clear. */}}
 // Instructions in the page language; illustrations chosen from the English wording.
 function instructions(item){const texts=item.steps.flatMap(s=>split(K.dict(s))),icons=item.steps.flatMap(s=>split(s).map(x=>window.RafiqActivityCard.stepIcon(x)));return texts.map((text,i)=>({text,icon:icons[Math.min(i,icons.length-1)]||'heart'}));}
 function button(label,cls,fn,icon){const b=el('button',cls);b.type='button';if(icon)b.innerHTML=svg(icon,18);b.append(el('span',undefined,label));b.addEventListener('click',fn);return b;}
 function ensureDialog(){
  if(dialog)return dialog;
  dialog=el('dialog','pk-session');dialog.id='playSessionDialog';dialog.dataset.noTranslate='';dialog.setAttribute('aria-labelledby','pkTitle');
  dialog.addEventListener('cancel',e=>{e.preventDefault();if(state?.screen==='step')go('pause');else closeDialog();});
  document.body.append(dialog);return dialog;
 }
 function closeDialog(){if(state?.screen==='step')writePause(state.index);dialog?.close();document.getElementById('playStartBar')?.querySelector('button')?.focus();paintStart();}
 function frame(body,nav=[]){
  const top=el('div','pk-top');const x=button(t(copy.closeSession),'pk-close',closeDialog,'x');x.setAttribute('aria-label',t(copy.closeSession));top.append(el('span','pk-eyebrow',t(copy.eyebrow)),window.RafiqPlayKit.soundToggle(),x);
  const main=el('div','pk-body');main.append(...body);
  const foot=el('div','pk-nav');foot.append(...nav);
  dialog.replaceChildren(top,main,foot);
  const focus=dialog.querySelector('[data-autofocus]')||dialog.querySelector('h2');if(focus){if(!focus.hasAttribute('tabindex')&&focus.tagName==='H2')focus.tabIndex=-1;focus.focus();}
 }
 function render(){
  const P=window.RafiqPlayKit,{item}=state,steps=instructions(item),title=K.dict(item.title);
  state.total=steps.length;if(state.index>=steps.length)state.index=steps.length-1;
  dialog.dataset.screen=state.screen;
  if(state.screen==='intro'){
   const h=el('h2',undefined,title);h.id='pkTitle';
   const chips=el('div','pk-chip-row');chips.append(el('span','ps-badge',window.RafiqActivityCard.ageRange(item)),el('span','ps-badge',K.dict(item.duration)));
   const prep=el('fieldset','pk-prep');prep.append(el('legend',undefined,t(copy.prep)));
   for(const [i,text] of [t(copy.prepCalm),fill(t(copy.prepNeed),K.dict(item.materials)),t(copy.prepClose)].entries()){const id='pkPrep'+i,l=el('label'),c=el('input');c.type='checkbox';c.id=id;c.checked=!!state.prep[i];c.addEventListener('change',()=>{state.prep[i]=c.checked;});l.htmlFor=id;l.append(c,el('span',undefined,text));prep.append(l);}
   const paused=readPause(item);
   const startBtn=button(paused?fill(t(copy.resume),num(paused.index+1)):t(copy.start),'pk-primary',()=>{state.index=paused?paused.index:0;go('step');},'heart');startBtn.dataset.autofocus='';startBtn.id='pkStart';
   const nav=[startBtn];if(paused)nav.push(button(t(copy.restart),'pk-secondary',()=>{clearPause();state.index=0;go('step');}));
   frame([P.scene(steps[0]?.icon||'heart'),h,el('p','pk-lead',K.dict(item.insight)),chips,prep,el('p','pk-help',t(copy.startHelp))],nav);
  }
  if(state.screen==='step'){
   const s=steps[state.index],h=el('h2','pk-sr',title);h.id='pkTitle';
   const text=el('p','pk-instruction',s.text);text.setAttribute('aria-live','polite');
   const label=fill(t(copy.stepOf),num(state.index+1),num(steps.length));
   const last=state.index===steps.length-1;
   const next=button(last?t(copy.finish):t(copy.next),'pk-primary',()=>{if(last)go('finish');else{state.index++;window.RafiqPlayKit.sound.play();go('step');}},last?'check':null);next.dataset.autofocus='';next.id='pkNext';
   const back=button(t(copy.back),'pk-secondary',()=>{if(state.index===0)go('intro');else{state.index--;go('step');}});back.id='pkBack';
   const pause=button(t(copy.pause),'pk-ghost',()=>go('pause'),'clock');pause.id='pkPause';
   frame([P.progress(state.index,steps.length,label),P.scene(s.icon,'is-step'),h,text],[back,pause,next]);
   writePause(state.index);
  }
  if(state.screen==='pause'){
   writePause(state.index);const h=el('h2',undefined,t(copy.paused));h.id='pkTitle';
   const resume=button(t(copy.resumeNow),'pk-primary',()=>go('step'),'heart');resume.dataset.autofocus='';resume.id='pkResume';
   frame([P.scene('clock'),h,el('p','pk-lead',t(copy.pausedHelp))],[button(t(copy.closeForNow),'pk-secondary',closeDialog),resume]);
  }
  if(state.screen==='finish'){
   const h=el('h2',undefined,t(copy.how));h.id='pkTitle';
   const outs=el('div','pk-outcomes');outs.setAttribute('role','radiogroup');outs.setAttribute('aria-labelledby','pkTitle');
   for(const [key,icon] of [['tried','check'],['later','clock'],['not-for-us','skip']]){const b=el('button','pk-outcome');b.type='button';b.setAttribute('role','radio');b.dataset.outcome=key;b.setAttribute('aria-checked',String(state.outcome===key));b.innerHTML=svg(icon,26);b.append(el('span',undefined,t(copy.outcomes[key])));b.addEventListener('click',()=>{state.outcome=key;outs.querySelectorAll('.pk-outcome').forEach(o=>o.setAttribute('aria-checked',String(o===b)));msg.textContent='';});outs.append(b);}
   const note=P.noteField('pkNote',state.note);note.querySelector('textarea').addEventListener('input',e=>{state.note=e.target.value;});
   const msg=el('p','pk-error');msg.setAttribute('role','status');
   const save=button(t(copy.save),'pk-primary',()=>{if(!state.outcome){msg.textContent=t(copy.chooseFirst);return;}saveMoment(msg);},'check');save.id='pkSave';
   frame([el('p','pk-help',t(copy.howHelp)),h,outs,P.noticedPicker(state.noticed),note,msg],[button(t(copy.back),'pk-secondary',()=>go('step')),save]);
   outs.querySelector('.pk-outcome')?.setAttribute('data-autofocus','');outs.querySelector('.pk-outcome')?.focus();
  }
  if(state.screen==='done'){
   const P2=window.RafiqPlayKit,c=child();
   const hist=K.link(t(window.RafiqPlayKit.copy.history),'activities.html?tab=history','pk-primary');hist.id='pkHistory';
   const box=P2.completion({title:t(copy.doneTitle[state.outcome]),message:t(copy.doneText[state.outcome]),child:c,noticedKeys:[...state.noticed]});
   box.querySelector('h2').id='pkTitle';
   const close=button(t(window.RafiqPlayKit.copy.close),'pk-secondary',closeDialog);close.dataset.autofocus='';
   frame([box],[close,hist]);
  }
 }
 function go(screen){state.screen=screen;render();}
 function saveMoment(msg){
  const form=document.getElementById('dailyFeedbackForm'),radio=form?.querySelector('input[name="dailyOutcome"][value="'+state.outcome+'"]');
  if(!form||!radio){msg.textContent=t(copy.saveError);return;}
  radio.checked=true;document.getElementById('dailyNote').value=state.note.trim();
  pendingNoticed=[...state.noticed];let saved=false;const onSaved=()=>{saved=true;};
  window.addEventListener('rafiq:moment-saved',onSaved,{once:true});
  form.requestSubmit();window.removeEventListener('rafiq:moment-saved',onSaved);
  if(!saved){pendingNoticed=null;msg.textContent=document.getElementById('dailyStatus')?.textContent||t(copy.saveError);return;}
  clearPause();paintStart();window.RafiqPlayKit.sound.play('done');go('done');
 }
 function open(){
  const item=window.RafiqActivityCard?.current;if(!item)return;
  const saved=readSaved(item);
  state={item,screen:'intro',index:0,prep:{},outcome:saved?.outcome||null,noticed:new Set(saved?.noticed||[]),note:saved?.note||'',total:0};
  ensureDialog();render();if(!dialog.open)dialog.showModal();
 }
 function readSaved(item){try{const notes=JSON.parse(localStorage.getItem('rafiqAgeObservations_'+childId())||'[]');return notes.find(n=>n?.type==='daily-moment'&&n.activityId===item.id&&n.day===dayKey())||null;}catch{return null;}}
 // Start bar under the activity card; replaces the older "Try this activity" toggle visually.
 function paintStart(){
  const bar=document.getElementById('playStartBar'),item=window.RafiqActivityCard?.current;if(!bar||!item)return;
  const oldStart=document.getElementById('dailyStart'),paused=readPause(item),saved=readSaved(item);
  const b=button(paused?fill(t(copy.resume),num(paused.index+1)):saved?t(copy.again):t(copy.start),'pk-start',open,'heart');b.id='playStartButton';b.disabled=!!oldStart?.disabled;
  bar.replaceChildren(b,el('span','pk-help',t(copy.startHelp)));
 }
 function mount(){
  const glance=document.getElementById('activityGlance');if(!glance||!window.RafiqActivityCard?.current)return;
  let bar=document.getElementById('playStartBar');if(!bar){bar=el('div','pk-start-bar');bar.id='playStartBar';bar.dataset.noTranslate='';glance.after(bar);}
  document.getElementById('dailyIdea')?.classList.add('has-play-session');
  paintStart();
  K.onLang(()=>{paintStart();if(dialog?.open&&state)render();});
  window.addEventListener('rafiq:moment-saved',paintStart);
 }
 document.addEventListener('DOMContentLoaded',mount);
 // Read once by daily-moment-ui when it builds the saved record.
 window.RafiqActivitySession={open,mount,takeNoticed(){const v=pendingNoticed;pendingNoticed=null;return v;},instructions,split,copy};
})();
