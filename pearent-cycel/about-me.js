(() => {
 'use strict';
 const C=window.RafiqAboutCopy,M=window.RafiqAboutMe;
 const lang=()=>localStorage.getItem('rafiqLanguage_'+sessionStorage.getItem('rafiqParentUserId'))||localStorage.getItem('rafiqLanguage')||'ar';
 const tr=s=>lang()==='ar'?(C.messages[s]||s):s;window.RafiqAboutTranslate=tr;
 const text=(key,vars={})=>Object.entries(vars).reduce((s,[k,v])=>s.replaceAll('{'+k+'}',v),tr(C.ui[key]));
 const el=(tag,value)=>{const n=document.createElement(tag);if(value)n.textContent=value;return n;};
 const button=(label,fn)=>{const b=el('button',label);b.type='button';b.onclick=fn;return b;};
 let child,app,status,selection=M.defaults(),mode='edit',blocked=false;
 const name=()=>child.name||'',label=s=>tr(s).replaceAll('{name}',name());
 const statusText=(key)=>{status.textContent=text(key);};
 function persist(patch){if(blocked)return false;try{child=M.save(child,patch);statusText('saved');return true;}catch{blocked=true;statusText('error');return false;}}
 function fieldSave(section,id,value){const data=M.profile(child);data.sections[section]={...data.sections[section],[id]:value};return persist({sections:data.sections});}
 function changeStep(cursor,done=false){const data=M.profile(child),id=C.sections[data.cursor]?.id;const completed=done&&id?[...data.sectionsDone,id]:data.sectionsDone;if(persist({cursor,sectionsDone:completed}))draw();}
 function header(){
  app.replaceChildren();const home=el('a',text('home'));home.href='parent-dashboard.html';app.append(home,el('h1',text('title',{name:name()})),el('p',text('intro')));
  if(window.RafiqAutismVisual)app.append(button(tr('Back to my child’s card'),()=>{mode='overview';draw();}));
  const data=M.profile(child);app.append(el('p',text('done',{count:data.sectionsDone.length})));
  if(data.updatedAt)app.append(el('small',text('edited',{person:data.updatedByName||text('family'),date:new Date(data.updatedAt).toLocaleDateString(lang())})));
  if(M.due(child)){const box=el('aside',text('review',{name:name()}));box.className='about-card';box.append(button(text('dismiss'),()=>{if(persist({reviewDismissedFor:data.updatedAt}))draw();}),button(text('reviewed'),()=>{if(persist({reviewedAt:new Date().toISOString()}))draw();}));app.append(box);}
 }
 function footer(){if(window.RAFIQ_SHOW_DRAFT_LABELS!==false)app.append(el('small',text('draft')));app.append(el('p',text('footer')));}
 function draw(){if(mode==='overview'&&window.RafiqAutismVisual){app.replaceChildren();window.RafiqAutismVisual.passport(app,child,{edit(id){mode='edit';changeStep(C.sections.findIndex(s=>s.id===id));},share(){mode='view';draw();},photo(updated){child=updated;draw();}});if(M.due(child)){const data=M.profile(child),box=el('aside',text('review',{name:name()}));box.className='about-card';box.append(button(text('dismiss'),()=>{if(persist({reviewDismissedFor:data.updatedAt}))draw();}),button(text('reviewed'),()=>{if(persist({reviewedAt:new Date().toISOString()}))draw();}));app.append(box);}footer();return;}header();if(mode==='view')reading();else if(M.profile(child).cursor===9)finish();else builder();footer();}
 function builder(){
  const data=M.profile(child),section=C.sections[data.cursor],list=el('ol');list.className='about-progress';list.setAttribute('aria-label',text('title',{name:name()}));
  C.sections.forEach((s,i)=>{const li=el('li'),b=button(label(s.title),()=>changeStep(i));if(i===data.cursor)b.setAttribute('aria-current','step');li.append(b);list.append(li);});app.append(list);
  const card=el('section');card.className='about-card';const h=el('h2',label(section.title));h.tabIndex=-1;card.append(h,el('p',text('optional')));if(section.hint)card.append(el('p',tr(section.hint)));
  const values=data.sections[section.id]||{};
  for(const f of section.fields){
   if(f.type==='chips'){
    const group=el('fieldset');group.append(el('legend',label(f.label)),el('small',text('chipHint')));const picked=new Set(values[f.id]||[]);
    for(const o of f.options){const b=button(tr(o.label),()=>{if(picked.has(o.id))picked.delete(o.id);else picked.add(o.id);if(fieldSave(section.id,f.id,[...picked]))b.setAttribute('aria-pressed',String(picked.has(o.id)));});b.setAttribute('aria-pressed',String(picked.has(o.id)));group.append(b);}card.append(group);continue;
   }
   const wrap=el('label');wrap.className='about-field';wrap.append(el('span',label(f.label)));let input;
   if(f.type==='select'){input=el('select');const empty=el('option','—');empty.value='';input.append(empty);for(const o of f.options){const option=el('option',tr(o.label));option.value=o.id;input.append(option);}input.value=values[f.id]||'';}
   else if(f.type==='boolean'){input=el('input');input.type='checkbox';input.checked=values[f.id]===true;}
   else {input=el('textarea');input.maxLength=500;input.rows=2;input.value=values[f.id]||'';if(f.id==='phone')input.inputMode='tel';}
   input.addEventListener(f.type==='text'?'input':'change',()=>fieldSave(section.id,f.id,f.type==='boolean'?input.checked:input.value));wrap.append(input,el('small',text(f.type==='boolean'?'photo':'fieldHint')));card.append(wrap);
   const exampleKey=section.id==='loves'&&f.id==='songs'?'song':section.id==='calm'&&f.id==='helps'?'hug':section.id==='calm'&&f.id==='overwhelms'?'vacuum':null;
   if(exampleKey){const b=button(text(exampleKey),()=>{input.value=text(exampleKey);fieldSave(section.id,f.id,input.value);});b.setAttribute('aria-label',text('examples')+': '+text(exampleKey));card.append(b);}
  }
  if(section.id==='name'&&/^data:image\/(png|jpeg|webp|gif);base64,/i.test(child.photo||'')){const img=el('img');img.src=child.photo;img.alt=name();img.className='about-photo';card.append(img);}
  if(section.id==='safety'){
   try{const candidate=M.prefill(child);if(candidate.allergies||candidate.medicines){const box=el('aside');box.append(el('p',text('prefill')));const pre=el('pre',Object.entries(candidate).filter(([,v])=>v).map(([k,v])=>label(section.fields.find(f=>f.id===k).label)+': '+v).join('\n'));pre.className='about-preview';box.append(pre,button(text('confirm'),()=>{try{child=M.confirmPrefill(child,true);draw();}catch{blocked=true;statusText('error');}}));card.append(box);}}catch{card.append(el('p',text('error')));}
  }
  if(section.id==='people'){
   const active=activeThreads();if(active.length){card.append(el('h3',text('specialists')));for(const t of active){const a=el('a',t.specialistName);a.href='messages.html?thread='+encodeURIComponent(t.id);card.append(a);}}
  }
  card.append(button(text('back'),()=>{if(data.cursor>0)changeStep(data.cursor-1);}));card.append(button(text('skip'),()=>changeStep(data.cursor+1)),button(text('next'),()=>changeStep(data.cursor+1,true)),button(text('view'),()=>{mode='view';draw();}));if(window.RafiqAutismVisual)card.append(button(tr('Back to my child’s card'),()=>{mode='overview';draw();}));app.append(card);h.focus();
 }
 function finish(){app.append(el('h2',text('ready',{name:name()})),button(text('view'),()=>{mode='view';draw();}),button(text('edit'),()=>{mode='edit';changeStep(0);}));if(window.RafiqSupportJourneyUI?.afterAboutReady)window.RafiqSupportJourneyUI.afterAboutReady(app,child);else window.RafiqSupportStartUI?.afterAboutReady(app,child);reading();}
 function activeThreads(){try{const api=window.RafiqDirectMessages,viewer=api.identity('parent');return api.list(viewer).filter(t=>t.childId===child.id&&api.canReply(viewer,t));}catch{return [];}}
 function reading(){
  const controls=el('section');controls.className='about-card';controls.append(el('h2',text('selection')));
  const addCheck=(title,checked,fn)=>{const l=el('label'),input=el('input');input.type='checkbox';input.checked=checked;input.onchange=()=>{fn(input.checked);refresh();};l.append(input,document.createTextNode(title));controls.append(l);};
  for(const s of C.sections)addCheck(label(s.title),selection.sections.includes(s.id),checked=>{selection.sections=checked?[...selection.sections,s.id]:selection.sections.filter(id=>id!==s.id);});
  for(const key of ['phones','allergies','photo'])addCheck(text(key),selection[key],checked=>selection[key]=checked);
  const preview=el('pre');preview.className='about-preview';preview.setAttribute('data-user-content','');const previewHeading=el('h3',text('preview'));controls.append(previewHeading,preview);
  controls.append(button(text('copy'),async()=>{try{await navigator.clipboard.writeText(preview.textContent);statusText('copied');}catch{statusText('shareError');}}),button(text('share'),async()=>{const content=preview.textContent;try{if(navigator.share)await navigator.share({title:text('title',{name:name()}),text:content});else window.open('https://wa.me/?text='+encodeURIComponent(content),'_blank','noopener,noreferrer');}catch{statusText('shareError');}}));
  const threads=activeThreads();if(threads.length){const wrap=el('label',text('choose')),select=el('select');for(const thread of threads){const option=el('option',thread.specialistName);option.value=thread.id;select.append(option);}const requested=new URLSearchParams(location.search).get('thread');if(threads.some(t=>t.id===requested))select.value=requested;wrap.append(select);controls.append(wrap,button(text('send'),()=>{try{M.send(child,selection,preview.textContent,select.value);statusText('sent');}catch{statusText('shareError');}}));}
  controls.append(button(text('print'),()=>print('a4')),button(text('wallet'),()=>print('wallet')),button(text('edit'),()=>{mode='edit';if(M.profile(child).cursor===9)changeStep(0);else draw();}));app.append(controls);
  const documentView=el('article');documentView.id='aboutPrint';documentView.className='about-document';documentView.setAttribute('data-user-content','');const wallet=el('div');wallet.className='wallet-sheet';app.append(documentView,wallet);
  function refresh(){
   preview.textContent=M.snapshot(child,selection,tr);documentView.replaceChildren();wallet.replaceChildren();
   if(selection.photo&&M.profile(child).sections.name?.photo&&/^data:image\/(png|jpeg|webp|gif);base64,/i.test(child.photo||'')){const img=el('img');img.src=child.photo;img.alt=name();img.className='about-photo';documentView.append(img);}
   documentView.append(el('h1',text('title',{name:name()})),el('p',text('intro')));
   const rows=M.rows(child,selection,tr),strip=el('section');strip.className='about-summary';strip.append(el('h2',text('thirty',{name:name()})));
   for(const id of ['communication','calm','safety']){const row=rows.find(r=>r.id===id),keys=id==='communication'?['ways']:id==='calm'?['helps','overwhelms']:['wanders','tips','waterTraffic'];const labels=C.sections.find(s=>s.id===id).fields.filter(f=>keys.includes(f.id)).map(f=>label(f.label));if(row){const brief=row.entries.filter(e=>labels.includes(e.label));if(brief.length)strip.append(el('p',brief.map(e=>e.label+': '+e.text).join(' · ')));}}documentView.append(strip);
   const columns=el('div');columns.className='about-print-columns';for(const row of rows){const section=el('section');section.append(el('h2',row.title));const dl=el('dl');for(const entry of row.entries)dl.append(el('dt',entry.label),el('dd',entry.text));section.append(dl);columns.append(section);}documentView.append(columns);
   const data=M.profile(child);documentView.append(el('footer',text('written',{person:data.updatedByName||text('family'),date:data.updatedAt?new Date(data.updatedAt).toLocaleDateString(lang()):new Date().toLocaleDateString(lang())})+' '+text('footer')));
   const front=el('section'),back=el('section');front.className=back.className='wallet-side';front.append(el('h2',name()),el('p',text('walletText')));
   for(const id of ['communication','calm']){const row=rows.find(r=>r.id===id),wanted=label(C.sections.find(s=>s.id===id).fields.find(f=>f.id===(id==='communication'?'ways':'helps')).label);if(row)(id==='communication'?front:back).append(el('p',row.entries.filter(e=>e.label===wanted).map(e=>e.label+': '+e.text).join('\n')));}
   const safe=rows.find(r=>r.id==='safety');if(safe)back.append(el('p',safe.entries.filter(e=>[label(C.sections[6].fields.find(f=>f.id==='allergies').label),label(C.sections[6].fields.find(f=>f.id==='phone').label)].includes(e.label)).map(e=>e.label+': '+e.text).join('\n')));back.append(el('small',text('intro')));wallet.append(front,back);
  }
  function print(layout){
   if(layout==='a4'){
    const measure=documentView.cloneNode(true);measure.removeAttribute('id');measure.classList.add('about-print-measure');document.body.append(measure);const limit=277*96/25.4,fits=measure.getBoundingClientRect().height<=limit;measure.remove();if(!fits){statusText('printLong');return;}
   }else{
    wallet.style.cssText='display:flex;position:absolute;left:-10000px;top:0';const fits=[...wallet.children].every(n=>n.scrollHeight<=n.clientHeight&&n.scrollWidth<=n.clientWidth);wallet.removeAttribute('style');if(!fits){statusText('printLong');return;}
   }
   document.body.dataset.print=layout;window.print();
  }
  refresh();
 }
 document.addEventListener('DOMContentLoaded',()=>{app=document.getElementById('aboutApp');status=document.getElementById('aboutStatus');document.documentElement.lang=lang();document.documentElement.dir=lang()==='ar'?'rtl':'ltr';document.title=tr(C.ui.title).replaceAll('{name}','')+' | RAFIQ';try{const id=new URLSearchParams(location.search).get('child')||window.RafiqFamily.selected();child=window.RafiqSetup.readChildren().find(c=>c.id===id);if(!child)throw Error('Unavailable');document.title=text('title',{name:name()})+' | RAFIQ';mode=new URLSearchParams(location.search).get('view')==='1'?'view':new URLSearchParams(location.search).get('edit')==='1'?'edit':'overview';draw();}catch{statusText('error');}});
 window.addEventListener('storage',e=>{if(e.key==='rafiqChildren'&&child){try{const fresh=window.RafiqSetup.readChildren().find(c=>c.id===child.id);if(!fresh||JSON.stringify(fresh.aboutMe)!==JSON.stringify(child.aboutMe)){blocked=true;statusText('error');}else child=fresh;}catch{blocked=true;statusText('error');}}});
})();
