/* Shared pieces for interactive parent activities (Play together and Play on screen).
   No scoring: results record only that the family played and what the parent noticed.
   Sound is optional and off by default. Requires parent-services-kit.js. */
(() => {
 'use strict';
 const K=window.RafiqServicesKit,{p,t,num,el,svg}=K;
 const copy={
  soundOn:p('Sound on','الصوت شغّال'),soundOff:p('Sound off','الصوت مطفي'),
  noticedTitle:p('What did you notice? (optional)','شو لاحظتوا؟ (اختياري)'),
  noticedHelp:p('Your own observation. Nothing here is a score or a test.','هاي ملاحظتكم إنتو. ما في هون علامة ولا اختبار.'),
  noteLabel:p('Anything to remember? (optional)','بدكم تتذكروا شي؟ (اختياري)'),
  notePlaceholder:p('A little reaction or something to remember…','ردة فعل صغيرة أو شي بدكم تتذكروه…'),
  history:p('See activity history','شوفوا سجل الأنشطة'),close:p('Close','سكّروا'),
  savedFor:p('Saved in {0}’s activity history.','انحفظ بسجل أنشطة {0}.')
 };
 // Neutral things a parent might notice. Never interpreted or counted as development.
 const noticed=[
  ['smiled','smile',p('Smiled or laughed','ابتسم أو ضحك')],
  ['watched','look',p('Watched closely','تابع باهتمام')],
  ['joined','people',p('Joined in','شارك معنا')],
  ['sounds','talk',p('Made sounds or words','طلّع أصوات أو كلمات')],
  ['led','star',p('Led the play','قاد اللعب')],
  ['stop','skip',p('Wanted to stop','حب يوقف')]
 ];
 const noticedLabel=key=>{const row=noticed.find(n=>n[0]===key);return row?t(row[2]):'';};
 // Gentle, optional tones made in the browser; nothing loads from the network.
 const sound={
  key:'rafiqActivitySound',
  on(){try{return localStorage.getItem(this.key)==='on';}catch{return false;}},
  set(v){try{localStorage.setItem(this.key,v?'on':'off');}catch{/* Preference is optional. */}},
  play(kind='step'){
   if(!this.on())return;
   try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;this.ctx=this.ctx||new C();const c=this.ctx,notes=kind==='done'?[523,659,784]:kind==='soft'?[392]:[587];
    notes.forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain(),at=c.currentTime+i*.14;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.05,at+.03);g.gain.exponentialRampToValueAtTime(.0001,at+.35);o.connect(g).connect(c.destination);o.start(at);o.stop(at+.4);});
   }catch{/* Sound never blocks play. */}
  }
 };
 function soundToggle(){
  const b=el('button','pk-sound');b.type='button';
  const paint=()=>{const on=sound.on();b.setAttribute('aria-pressed',String(on));b.innerHTML=svg(on?'speaker':'mute',18);b.append(el('span',undefined,t(on?copy.soundOn:copy.soundOff)));};
  b.addEventListener('click',()=>{sound.set(!sound.on());paint();sound.play('soft');});paint();return b;
 }
 // A large, calm illustration: tinted circle, the step's icon, three soft dots.
 function scene(icon,cls=''){const s=el('div','pk-scene '+cls);s.setAttribute('aria-hidden','true');s.innerHTML='<span class="pk-dot a"></span><span class="pk-dot b"></span><span class="pk-dot c"></span>'+svg(icon,88);return s;}
 function progress(value,total,label){const wrap=el('div','pk-progress');const bar=el('div','pk-bar');bar.setAttribute('role','progressbar');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax',String(total));bar.setAttribute('aria-valuenow',String(Math.min(total,value+1)));bar.setAttribute('aria-label',label);const fill=el('span');fill.style.width=Math.round(100*Math.min(total,value+1)/Math.max(1,total))+'%';bar.append(fill);const dots=el('ol','pk-dots');dots.setAttribute('aria-hidden','true');for(let i=0;i<total;i++)dots.append(el('li',i<value?'is-done':i===value?'is-current':''));wrap.append(el('span','pk-progress-label',label),bar,dots);return wrap;}
 function noticedPicker(selected){
  const box=el('fieldset','pk-noticed');box.append(el('legend',undefined,t(copy.noticedTitle)),el('p','pk-help',t(copy.noticedHelp)));
  const grid=el('div','pk-chip-grid');
  for(const [key,icon,label] of noticed){const b=el('button','pk-chip');b.type='button';b.dataset.noticed=key;b.setAttribute('aria-pressed',String(selected.has(key)));b.innerHTML=svg(icon,18);b.append(el('span',undefined,t(label)));b.addEventListener('click',()=>{selected.has(key)?selected.delete(key):selected.add(key);b.setAttribute('aria-pressed',String(selected.has(key)));});grid.append(b);}
  box.append(grid);return box;
 }
 function noteField(id,value=''){const wrap=el('div','pk-note');const label=el('label',undefined,t(copy.noteLabel));label.htmlFor=id;const area=el('textarea');area.id=id;area.rows=2;area.maxLength=1000;area.placeholder=t(copy.notePlaceholder);area.value=value;wrap.append(label,area);return wrap;}
 // Encouraging, non-evaluative completion screen.
 function completion({title,message,child,noticedKeys=[],extra=[]}){
  const box=el('div','pk-complete');box.append(scene('check','is-done'),el('h2',undefined,title),el('p','pk-lead',message));
  if(noticedKeys.length){const row=el('div','pk-chip-row');for(const k of noticedKeys)row.append(el('span','ps-badge',noticedLabel(k)));box.append(row);}
  if(child){const saved=el('p','pk-help');const [a,b='']=t(copy.savedFor).split('{0}');saved.append(a,K.name(child),b);box.append(saved);}
  box.append(...extra);return box;
 }
 window.RafiqPlayKit={copy,noticed,noticedLabel,sound,soundToggle,scene,progress,noticedPicker,noteField,completion};
})();
