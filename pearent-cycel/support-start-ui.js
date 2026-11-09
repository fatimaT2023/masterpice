(() => {
 'use strict';
 const C=window.RafiqSupportStartContent,M=window.RafiqSupportStart;
 function language(){return localStorage.getItem('rafiqLanguage_'+sessionStorage.getItem('rafiqParentUserId'))||localStorage.getItem('rafiqLanguage')||document.documentElement.lang||'ar';}
 function t(block,child={},key,vars={}){let value=block[language()==='ar'?'ar':'en'];if(key)value=value[key];return Object.entries({name:child.name||'',...vars}).reduce((s,[k,v])=>s.replaceAll('{'+k+'}',String(v)),value);}
 const u=(id,child,vars)=>t(C.ui[id],child,null,vars);
 function node(tag,text){const el=document.createElement(tag);if(text)el.textContent=text;return el;}
 function button(text,fn){const b=node('button',text);b.type='button';b.onclick=fn;return b;}
 function draft(host,block){if(block.reviewStatus==='draft'&&window.RAFIQ_SHOW_DRAFT_LABELS!==false){const s=node('small',u('draft'));s.className='start-draft';host.append(s);}}
 function href(route,child){if(route.startsWith('#'))return route;const url=new URL(route,location.href);url.searchParams.set('child',child.id);return url.pathname.split('/').pop()+url.search+url.hash;}
 function types(host,child,options={}){
  if(!M.enabled(child))return;
  const list=options.types||C.specialists,grid=node('div');grid.className='start-type-grid';
  for(const type of list){const card=node('article');card.className='start-type';card.append(node(options.level||'h3',t(type,child,'title')),node('p',t(type,child,'description')));
   const question=C.questionGroups.flatMap(g=>g.questions).find(q=>q.id===type.ask);const ask=node('p',u('ask')+': '+t(question,child));ask.className='start-ask';card.append(ask);
   const a=node('a',t(type,child,'action'));a.href=M.directoryUrl(type);a.addEventListener('click',()=>{try{const fresh=window.RafiqSetup.readChildren().find(c=>c.id===child.id);M.save(fresh,{directoryVisitedAt:new Date().toISOString()});}catch{/* Opening a directory does not require saving a progress flag. */}});card.append(a);draft(card,type);grid.append(card);
  }host.append(grid);
 }
 function dialog(child,trigger){
  if(!M.enabled(child))return;const d=node('dialog');d.className='start-dialog';d.dir=language()==='ar'?'rtl':'ltr';const h=node('h2',u('who'));h.id='startTypeDialogTitle';d.setAttribute('aria-labelledby',h.id);d.append(h,node('p',u('idea')));types(d,child);const close=()=>{d.close();d.remove();trigger?.focus();};d.append(button(u('close'),close));d.addEventListener('cancel',()=>{d.remove();trigger?.focus();});document.body.append(d);d.showModal();
 }
 function resources(host,entries,child){
  const verified=M.verifiedResources(entries);if(!verified.length)return false;
  const section=node('section');section.id='startResources';section.className='start-card';section.append(node('h2',u('resources')));
  for(const r of verified){const article=node('article');article.append(node('h3',r.title[language()==='ar'?'ar':'en']),node('p',r.summary[language()==='ar'?'ar':'en']),node('p',r.organization));if(r.howToApply?.length){article.append(node('h4',u('apply')));const ol=node('ol');for(const step of r.howToApply)ol.append(node('li',step[language()==='ar'?'ar':'en']));article.append(ol);}for(const key of ['phone','address'])if(r.contact?.[key])article.append(node('p',r.contact[key]));const a=node('a',u('source'));a.href=r.sourceUrl;a.target='_blank';a.rel='noopener noreferrer';article.append(a,node('p',u('verified',child,{date:r.verifiedAt})));section.append(article);}host.append(section);return true;
 }
 window.RafiqSupportStartUI={language,t,u,types,dialog,resources,href};
 document.addEventListener('DOMContentLoaded',()=>{
  const app=document.getElementById('startApp');if(!app)return;
  const status=document.getElementById('startStatus');let child,blocked=false;
  document.documentElement.lang=language();document.documentElement.dir=language()==='ar'?'rtl':'ltr';
  function save(patch){if(blocked)return false;try{child=M.save(child,patch);status.textContent=u('saved');return true;}catch{blocked=true;status.textContent=u('error');return false;}}
  function current(){return M.build(child);}
  function markDirectory(){save({directoryVisitedAt:new Date().toISOString()});}
  function renderPlan(){
   const plan=document.getElementById('startPlan');plan.replaceChildren(node('h2',u('plan')));const model=current(),selected=model.state.period,tabs=node('div');tabs.className='start-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label',u('plan'));
   model.periods.forEach((period,index)=>{const tab=button(t(period.label),()=>{if(save({period:period.id})){renderPlan();document.getElementById('start-tab-'+period.id).focus({preventScroll:true});}});tab.id='start-tab-'+period.id;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','start-panel-'+period.id);tab.setAttribute('aria-selected',String(selected===period.id));tab.tabIndex=selected===period.id?0:-1;tab.onkeydown=e=>{const delta=e.key==='ArrowRight'?(language()==='ar'?-1:1):e.key==='ArrowLeft'?(language()==='ar'?1:-1):0;if(delta||['Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?model.periods.length-1:(index+delta+model.periods.length)%model.periods.length;if(save({period:model.periods[next].id})){renderPlan();document.getElementById('start-tab-'+model.periods[next].id).focus({preventScroll:true});}}};tabs.append(tab);});plan.append(tabs);
   for(const period of model.periods){const panel=node('section');panel.id='start-panel-'+period.id;panel.className='start-period';panel.hidden=period.id!==selected;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby','start-tab-'+period.id);panel.append(node('h3',t(period.label)),node('p',u('progress',child,{done:period.done,total:period.total})));
    const ol=node('ol');ol.className='start-checklist';for(const step of period.steps){const li=node('li');li.className='start-step';const label=node('label'),check=node('input'),words=node('span');check.type='checkbox';check.id='start-step-'+step.id;check.checked=step.done;check.disabled=step.autoDone;words.append(node('strong',t(step,child,'title')),node('p',t(step,child,'help')));const help=node('small',u(step.autoDone?'automatic':'manual'));help.id='start-help-'+step.id;check.setAttribute('aria-describedby',help.id);words.append(help);label.append(check,words);li.append(label);check.onchange=()=>{const manual={...M.state(child).manual,[step.id]:check.checked};if(save({manual})){renderPlan();document.getElementById(check.id)?.focus({preventScroll:true});}else check.checked=!check.checked;};
     if(step.route&&(step.automatic!=='resources'||M.verifiedResources().length)){const a=node('a',t(step,child,'action'));a.href=href(step.route,child);if(step.route.startsWith('specialists.html'))a.addEventListener('click',markDirectory);li.append(a);}draft(li,step);ol.append(li);
    }panel.append(ol);plan.append(panel);
   }
   const b=button(u('print'),()=>{document.body.dataset.startPrint='checklists';window.print();});b.dataset.startScreenOnly='';plan.append(b);
  }
  function renderChooser(){
   const area=document.getElementById('startChooser');area.replaceChildren();const fieldset=node('fieldset');fieldset.append(node('legend',u('chooser')),node('p',u('chooseHint')));
   const selected=new Set(M.state(child).chooser);for(const choice of C.chooser){const label=node('label');label.className='start-choice';const check=node('input');check.type='checkbox';check.checked=selected.has(choice.choice);label.append(check,node('span',t(choice)));check.onchange=()=>{if(check.checked&&selected.size>=3){check.checked=false;status.textContent=u('chooseHint');return;}const ids=check.checked?[...selected,choice.choice]:[...selected].filter(id=>id!==choice.choice);if(save({chooser:ids}))renderChooser();else check.checked=!check.checked;document.getElementById('choice-'+choice.choice)?.focus({preventScroll:true});};check.id='choice-'+choice.choice;fieldset.append(label);}area.append(fieldset);
   const chosen=M.choose([...selected]);if(chosen.length){area.append(node('h3',u('result')),node('p',u('idea')));types(area,child,{types:chosen,level:'h4'});}draft(area,C.ui.idea);
  }
  function updateQuestions(){
   const list=document.getElementById('myQuestionList');list.replaceChildren();for(const q of M.questions(child)){const li=node('li'),span=node('span',q.custom?q.text:t(q,child));span.dataset.userContent='';li.append(span);if(q.custom){const b=button(u('remove'),()=>{if(save({customQuestions:M.state(child).customQuestions.filter(v=>v.id!==q.id)})){updateQuestions();renderPlan();}});li.append(b);}list.append(li);}
  }
  function renderQuestions(){
   const area=document.getElementById('startQuestions');area.replaceChildren();area.className='start-card';area.append(node('h2',u('questions')),node('p',u('questionHint')));
   const options=node('div');options.className='start-question-options';for(const group of C.questionGroups){const details=node('details');details.className='start-question-group';details.append(node('summary',t(group.title)));const field=node('fieldset');field.append(node('legend',t(group.title)));for(const q of group.questions){const label=node('label');label.className='start-choice';const input=node('input');input.type='checkbox';input.checked=M.state(child).selectedQuestions.includes(q.id);label.append(input,node('span',t(q,child)));input.onchange=()=>{const chosen=M.state(child).selectedQuestions;const next=input.checked?[...chosen,q.id]:chosen.filter(id=>id!==q.id);if(save({selectedQuestions:next})){updateQuestions();renderPlan();}else input.checked=!input.checked;};field.append(label);}draft(field,group.title);details.append(field);options.append(details);}area.append(options);
   const form=node('form');form.className='start-own-form';const label=node('label',u('own'));label.className='start-own-label';const input=node('textarea');input.id='startOwnQuestion';input.maxLength=500;label.htmlFor=input.id;const add=node('button',u('add'));add.type='submit';form.append(label,input,add);form.onsubmit=e=>{e.preventDefault();const value=input.value.trim();if(!value)return;const custom=[...M.state(child).customQuestions,{id:'own-'+crypto.randomUUID(),text:value}];if(save({customQuestions:custom})){input.value='';updateQuestions();renderPlan();}};area.append(form,node('h3',u('mine')));const list=node('ol');list.id='myQuestionList';list.className='start-question-list';area.append(list);
   area.append(button(u('copy'),async()=>{try{await navigator.clipboard.writeText(M.questionText(child,q=>t(q,child)));status.textContent=u('copyDone');}catch{status.textContent=u('copyError');}}),button(u('printQuestions'),()=>{document.body.dataset.startPrint='questions';window.print();}));updateQuestions();
  }
  try{
   const id=new URLSearchParams(location.search).get('child')||window.RafiqFamily.selected();child=window.RafiqSetup.readChildren().find(c=>c.id===id);const home=node('a',u('home'));home.href='parent-dashboard.html';home.dataset.startScreenOnly='';app.append(home);
   if(!M.enabled(child)){const a=node('a',u('profile'));a.href='child-profile.html';app.append(node('p',u('unavailable')),a);return;}
   window.RafiqFamily.select(child.id);document.title=u('title',child)+' | RAFIQ';app.append(node('h1',u('title',child)));const hint=node('p',u('hint'));hint.className='start-hint';hint.dataset.startScreenOnly='';app.append(hint);
   const opening=node('section');opening.className='start-opening';opening.append(node('p',u('opening')),node('p',u('education')));draft(opening,C.ui.opening);app.append(opening);
   const caution=node('aside',u('caution'));caution.className='start-card start-caution';draft(caution,C.ui.caution);app.append(caution);
   const plan=node('section');plan.id='startPlan';plan.className='start-card';app.append(plan);renderPlan();
   const specialists=node('section');specialists.id='startSpecialists';specialists.className='start-card start-type-section';specialists.append(node('h2',u('types')));const chooser=node('div');chooser.id='startChooser';specialists.append(chooser);app.append(specialists);renderChooser();
   const cards=node('details');cards.append(node('summary',u('who')));types(cards,child);specialists.append(cards);
   const questions=node('section');questions.id='startQuestions';app.append(questions);renderQuestions();resources(app,window.RafiqSupportResources,child);
   const footer=node('footer',u('footer'));app.append(footer);
   const hash=location.hash;if(hash){const target=document.getElementById(hash==='#questions'?'startQuestions':hash==='#specialists'?'startSpecialists':hash==='#resources'?'startResources':'startPlan');if(target){target.tabIndex=-1;target.scrollIntoView({block:'start'});target.focus({preventScroll:true});}}
   app.addEventListener('click',e=>{const anchor=e.target.closest('a');if(!anchor?.getAttribute('href')?.startsWith('#'))return;const map={'#questions':'startQuestions','#specialists':'startSpecialists','#resources':'startResources'};const target=document.getElementById(map[anchor.getAttribute('href')]);if(target){e.preventDefault();history.replaceState(null,'',anchor.getAttribute('href'));target.tabIndex=-1;target.scrollIntoView({block:'start'});target.focus({preventScroll:true});}});
  }catch{status.textContent=u('error');}
  window.addEventListener('storage',e=>{if(e.key==='rafiqChildren'&&child){try{const fresh=window.RafiqSetup.readChildren().find(c=>c.id===child.id);if(!M.enabled(fresh)){location.reload();return;}if(JSON.stringify(fresh.supportStart)!==JSON.stringify(child.supportStart)){if(blocked||document.getElementById('startOwnQuestion')?.value.trim()){blocked=true;status.textContent=u('error');}else{child=fresh;renderPlan();renderChooser();renderQuestions();status.textContent=u('saved');}}else{child=fresh;renderPlan();}}catch{blocked=true;status.textContent=u('error');}}else if(['rafiqBookings','rafiqCaregiverInvitationsPreview','rafiqCareConnections','rafiqHealthNotes_'+child?.id,'rafiqAgeObservations_'+child?.id].includes(e.key)){try{renderPlan();}catch{status.textContent=u('error');}}});
 });
})();
