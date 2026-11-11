/* One question at a time, using the existing profile cards and translation dictionary. */
(() => {
'use strict';
const t=(en,ar)=>{(window.RafiqHomeArabic=window.RafiqHomeArabic||{})[en]=ar;return en;};
const common={yes:t('Yes','نعم'),no:t('No','لا'),other:t('Other','غير هيك'),unknown:t('Not sure','مش متأكدين'),skip:t('Skip','تخطّي')};
const sections=[['about','About your child','عن طفلكم'],['birth','Birth','الولادة'],['health','Health','الصحة'],['vaccinations','Vaccinations','المطاعيم'],['feeding','Feeding','التغذية'],['sleep','Sleep','النوم'],['play','Play and routine','اللعب والروتين'],['family','Family','العيلة'],['goals',"What you’d like help with",'شو بتحبّوا نساعدكم فيه']].map(([id,en,ar])=>({id,title:t(en,ar)}));
const choices=(...items)=>items.map(([value,en,ar])=>({value,label:t(en,ar)}));
const yesno=choices(['yes','Yes','نعم'],['no','No','لا']);
const detail=t('Add details if you like','ضيفوا تفاصيل إذا بتحبّوا');
const next=t('Next','التالي'),back=t('Previous','السابق'),edit=t('Edit','تعديل'),saved=t('Thank you. This helps us get to know your child.','شكرًا إلكم، هيك بنتعرّف على طفلكم أكثر.');
const reviewTitle=t('Getting to know','خلّينا نتعرّف على'),unrecorded=t('Not recorded','ما تم تسجيله');
(window.RafiqArabicTemplates=window.RafiqArabicTemplates||[]).push({en:'Getting to know {0}',ar:'خلّينا نتعرّف على {0}'});
const confirmation=t('Add birth measurements to Health?','نضيف قياسات الولادة للسجل الصحي؟');
const addVaccines=t('Add vaccination details in Health','ضيفوا تفاصيل المطاعيم بالسجل الصحي');
const finish=t('Save and see next steps','حفظ ومشاهدة الخطوات الجايّة');
const errorText=t('We could not save. Please try again.','ما قدرنا نحفظ. جرّبوا مرة ثانية.');
const conflict=t('This child’s story changed in another tab. Refresh before saving to keep those changes.','حكاية طفلكم تغيّرت بصفحة ثانية. حدّثوا الصفحة قبل الحفظ حتى نحافظ على التعديلات.');
const readyConflict=t('Play readiness changed in another tab. Refresh before saving.','جاهزية اللعب تغيّرت بصفحة ثانية. حدّثوا الصفحة قبل الحفظ.');
const numberError=t('Please enter a positive number.','سجّلوا رقم أكبر من صفر.');
function questions(child){
 const info=window.RafiqChildHistoryAge.forChild(child),age=info.context.development?.totalMonths,stage=info.stage,q=[];
 const add=(id,en,ar,options=yesno,extra={})=>q.push({id,section:id.split('.')[0],prompt:window.RafiqHomeArabic?.[en]?en:t(en,ar),options,...extra});
 add('about.siblings','How many siblings does your child have?','كم أخ وأخت عند طفلكم؟',choices(['0','None','ولا واحد'],['1','One','واحد'],['2','Two','اثنين'],['3+','Three or more','ثلاثة أو أكثر']));
 add('about.caregiver','Who mainly looks after your child?','مين غالبًا بعتني بطفلكم؟',choices(['parents','Parents','الأهل'],['family','Family members','أفراد العيلة'],['nursery','Nursery or caregiver','الحضانة أو مقدّم رعاية'],['other','Other','غير هيك']));
 add('birth.termStatus','Was your child born at full term or early?','طفلكم انولد بموعده أو قبل موعده؟',choices(['term','At full term','بموعده'],['early','Early','قبل موعده']));
 add('birth.weeks','Do you know the pregnancy week at birth?','بتعرفوا بأي أسبوع من الحمل انولد طفلكم؟',yesno,{number:true});
 add('birth.delivery','How was your child born?','كيف كانت ولادة طفلكم؟',choices(['vaginal','Vaginal birth','ولادة طبيعية'],['caesarean','Caesarean birth','ولادة قيصرية'],['other','Other','غير هيك']));
 add('birth.weightGrams','Do you know the birth weight in grams?','بتعرفوا وزن الولادة بالغرام؟',yesno,{number:true});
 add('birth.lengthCm','Do you know the birth length in centimeters?','بتعرفوا طول الولادة بالسنتيمتر؟',yesno,{number:true});
 add('birth.nicu','Did your child spend time in neonatal care?','طفلكم احتاج يقعد بقسم رعاية حديثي الولادة؟');
 add('birth.complications','Were there any birth complications you want to record?','في مضاعفات بالولادة بتحبّوا تسجّلوها؟');
 for(const [key,en,ar] of [
 ['allergies','Does your child have any known allergies?','عند طفلكم أي حساسية معروفة؟'],['conditions','Does your child have an ongoing condition or follow-up?','عند طفلكم حالة صحية أو متابعة مستمرة؟'],['medicines','Does your child take regular medicines or supplements?','طفلكم بياخد أدوية أو مكملات بشكل منتظم؟'],['hospital','Has your child had hospital stays or operations?','طفلكم دخل المستشفى أو عمل عملية؟'],['hearing','Has your child had a hearing check?','طفلكم عمل فحص سمع؟'],['vision','Has your child had a vision check?','طفلكم عمل فحص نظر؟'],['instructions','Are there care team instructions you want to keep?','في تعليمات من فريق الرعاية بتحبّوا تحفظوها؟']])add('health.'+key,en,ar);
 add('vaccinations.status','Is vaccination up to date?','مطاعيم طفلكم محدّثة؟',choices(['yes','Yes','نعم'],['review','We would like to review the record','بنحب نراجع سجل المطاعيم']));
 if(Number.isFinite(age)&&age<24)add('feeding.milk','What milk does your child have?','أي حليب بياخد طفلكم؟',choices(['breast','Breast milk','حليب الأم'],['formula','Formula','حليب صناعي'],['mixed','Mixed','النوعين'],['other','Other','غير هيك']));
 if(Number.isFinite(age)&&age>=6&&age<24)add('feeding.solids','Has your child started solid foods?','طفلكم بلّش بالأكل؟');
 if(!Number.isFinite(age)||age>=6){add('feeding.meals',stage?.prompts.mealtime||'How are mealtimes going?','كيف أمور الأكل مع طفلكم؟',choices(['comfortable','Comfortable','مرتاح'],['support','We would like support','بنحب مساعدة'],['other','Other','غير هيك']));add('feeding.preferences','Are there foods your child likes or dislikes?','في أكلات بحبّها طفلكم أو ما بحبّها؟');}
 add('feeding.difficulty','Is anything about feeding difficult?','في إشي صعب بالتغذية؟');
 add('sleep.pattern',stage?.prompts.sleepRoutine||'How is sleep going?','كيف أمور النوم مع طفلكم؟',choices(['settled','Usually settled','غالبًا مريح'],['varies','It varies','بتغيّر'],['support','We would like support','بنحب مساعدة'],['other','Other','غير هيك']));
 add('sleep.naps','Does your child nap during the day?','طفلكم بنام قيلولة بالنهار؟');
 add('sleep.helps','Is there something that helps your child sleep?','في إشي بيساعد طفلكم ينام؟');
 add('sleep.hard','Is anything about sleep difficult?','في إشي صعب بالنوم؟');
 for(const key of ['interests','dailyLife','communication','everydayParticipation']){const prompt=stage?.prompts[key]||window.RafiqChildHistoryCopy.english(window.RafiqChildHistory.fields[key]);q.push({id:'play.'+key,section:'play',prompt,options:choices(['comfortable','Comfortable for us','مريح إلنا'],['support','We would like support','بنحب مساعدة'],['other','Other','غير هيك'])});}
 const minimums={handling:12,turns:24,pretend:18,ideas:36,matching:24};
 for(const [key,label] of Object.entries(window.RafiqActivityMatching.abilities)){if(!Number.isFinite(age)||age<minimums[key])continue;q.push({id:'play.ready-'+key,section:'play',prompt:t(label,({handling:'التعامل مع أغراض كبيرة مناسبة للعمر',turns:'المشاركة بلعبة فيها تبادل أدوار',pretend:'المشاركة بلعب تمثيلي بسيط',ideas:'التعبير عن فكرة بكلمة أو إشارة أو رسمة',matching:'تجربة مطابقة بسيطة بمساعدتكم'})[key]),ability:key,options:choices(['comfortable','Comfortable now','مرتاح فيها'],['with_support','Comfortable with my help','مرتاح بمساعدتنا'],['not_yet','Not comfortable with this right now','مش مرتاح فيها هالفترة'])});}
 add('play.focus','What would you like to support through play?','شو بتحبّوا تدعموا من خلال اللعب؟',choices(['communication','Communication and language','التواصل واللغة'],['social','Interaction and turn-taking','التفاعل وتبادل الأدوار'],['fine_motor','Hand use and coordination','استخدام الإيدين والتنسيق'],['thinking','Attention and problem-solving','الانتباه وحل المشكلات'],['creativity','Imagination and storytelling','الخيال والحكايات'],['self_help','Participation in everyday tasks','المشاركة بالأشياء اليومية']),{multi:true});
 add('play.level','How do you like to play together?','كيف بتحبّوا تشاركوا باللعب؟',choices(['1','I lead and support the play','بنقود اللعب وبنساعده'],['2','We participate together','بنشارك سوا'],['3','My child leads more when comfortable','طفلكم بقود اللعب أكثر حسب راحته']));
 add('family.history','Are there family health conditions you want to record?','في حالات صحية بالعيلة بتحبّوا تسجّلوها؟');
 add('family.support','Has your child received therapy or professional follow-up?','طفلكم تلقّى علاج أو متابعة من مختص؟');
 add('goals.choices','What would you like help with?','شو بتحبّوا نساعدكم فيه؟',choices(['sleep','Sleep','النوم'],['feeding','Feeding','التغذية'],['speech','Speech','النطق'],['behaviour','Behaviour','السلوك'],['play','Play','اللعب'],['growth','General growth','النمو بشكل عام'],['other','Other','غير هيك']),{multi:true});
 return q;
}
window.RafiqChildInterview={questions,sections};
function mount(options={}){
 const get=id=>document.getElementById(id),model=window.RafiqChildHistory;
 const node=(tag,text)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;return el;};
 const button=(text,fn)=>{const b=node('button',text);b.type='button';b.className='secondary';b.onclick=fn;return b;};
 let dirty=false;
 try{
 const child=window.RafiqSetup.readChildren().find(c=>c.id===(options.childId||new URLSearchParams(location.search).get('child')||window.RafiqFamily.selected()));if(!child)throw Error(t('This child profile is unavailable.','ملف الطفل مش متاح.'));
 window.RafiqFamily.select(child.id);document.documentElement.dataset.childAppearance=child.gender==='female'?'girl':child.gender==='male'?'boy':'cream';
 get('historyChild').textContent=child.name+' · '+window.RafiqSetup.formatAge(window.RafiqSetup.childContext(child).chronological);window.RafiqQuestionMap?.refreshContext(child);get('historyExit').href='child-profile.html?child='+encodeURIComponent(child.id);
 let values=options.draft?model.migrate(options.draft.values):model.fromBasics(child,child.backgroundHistory||{}),baseline=JSON.stringify(child.backgroundHistory||{}),ready=window.RafiqActivityMatching.profile(child),readyStamp=ready.updatedAt;
 const requestedSections=new URLSearchParams(location.search).get('interviewSection')?.split(',');const qs=questions(child).filter(q=>!requestedSections||requestedSections.includes(q.section));if(!qs.length)throw Error(errorText);if(requestedSections)values.cursor=qs[0].id;let index=qs.findIndex(q=>q.id===values.cursor);if(values.cursor==='summary')index=qs.length;if(index<0)index=0;
 let editing=null,phase='question',selected=null,input=null,checkbox=null;
 const leave=event=>{if(dirty){event.preventDefault();event.returnValue='';}};window.addEventListener('beforeunload',leave);
 function persist(){
  const latest=window.RafiqSetup.readChildren().find(c=>c.id===child.id);if(JSON.stringify(latest?.backgroundHistory||{})!==baseline)throw Error(conflict);
  if(window.RafiqActivityMatching.profile(child).updatedAt!==readyStamp)throw Error(readyConflict);
  const keys=['rafiqChildren','rafiqActivityProfile_'+child.id,'rafiqGrowth_'+child.id],before=keys.map(k=>localStorage.getItem(k));
  try{if(readyChanged){ready=window.RafiqActivityMatching.saveProfile(child,ready);}const result=model.save(child.id,values);if(checkbox?.checked)model.writeBirth(child,result,true);values=result;baseline=JSON.stringify(result);readyStamp=ready.updatedAt;readyChanged=false;dirty=false;}
  catch(error){keys.forEach((k,i)=>{if(before[i]===null)localStorage.removeItem(k);else localStorage.setItem(k,before[i]);});throw error;}
 }
 let readyChanged=false;
 function attempt(fn){try{get('historyStatus').textContent='';fn();}catch(error){get('historyStatus').textContent=error.message||errorText;}}
 function answer(value){selected=value;dirty=true;if(input)input.hidden=!(value==='yes'||value==='other'||(Array.isArray(value)&&value.includes('other')));if(!qs[index].multi&&value!=='yes'&&value!=='other')advance();else {record();attempt(persist);}}
 function record(){if(index>=qs.length||phase!=='question')return;const q=qs[index];if(selected===null)return;const details=input&&!input.hidden?input.value.trim().slice(0,1500):'';if(q.number&&selected==='yes'&&details&&(!Number.isFinite(Number(details))||Number(details)<=0))throw Error(numberError);const answer={value:selected,details};values.answers[q.id]=answer;
  if(q.section==='birth'){const key=q.id.split('.')[1];values.birth[key]=q.number?(selected==='yes'&&details?Number(details):null):selected;}
  if(q.id==='health.allergies')values.allergies={has:selected,details};if(q.id==='health.medicines'){values.medication={has:selected,details};values.medicines=details;}
  if(q.id==='goals.choices'){values.goals={choices:Array.isArray(selected)?selected:[],details};values.parentGoal=details;}
  if(q.id==='play.focus'&&Array.isArray(selected)){ready={...ready,focusSkills:selected};readyChanged=true;}
  if(q.id==='play.level'&&['1','2','3'].includes(selected)){ready={...ready,maxDifficulty:Number(selected)};readyChanged=true;}
  if(q.ability&&selected!=='skip'){ready={...ready,abilities:{...ready.abilities,[q.ability]:selected}};readyChanged=true;}
 }
 function advance(){attempt(()=>{record();const oldIndex=index,oldPhase=phase;const q=qs[index];if(phase==='confirmation'){phase='question';}else if(index<qs.length){index++;if(editing&&qs[index]?.section!==editing){index=qs.length;editing=null;}else if(qs[index]?.section!==q.section)phase='confirmation';}
 values.cursor=index>=qs.length?'summary':qs[index].id;try{persist();}catch(error){index=oldIndex;phase=oldPhase;throw error;}show();});}
 function show(){
 get('historyFields').replaceChildren();input=null;checkbox=null;get('historyNext').disabled=false;get('historyLater').hidden=false;get('historyPrevious').hidden=index===0&&!options.onBack;get('historyNext').textContent=index>=qs.length&&phase!=='confirmation'?finish:next;
 const panel=node('section');panel.className='family-card interview-card';get('historyFields').append(panel);
 const q=qs[index],section=sections.find(s=>s.id===(phase==='confirmation'?qs[index-1]?.section:q?.section));get('historyProgress').textContent=section?.title||reviewTitle;
 if(phase==='confirmation'){const h=node('h2',saved);h.tabIndex=-1;panel.append(h);h.focus();return;}
 if(index>=qs.length){const h=node('h2',reviewTitle+' '+child.name);h.tabIndex=-1;panel.append(h);
 for(const section of sections){const heading=node('h3',section.title);panel.append(heading,button(edit,()=>{editing=section.id;index=qs.findIndex(q=>q.section===editing);phase='question';show();}));const dl=node('dl');dl.className='family-summary';for(const question of qs.filter(q=>q.section===section.id)){const a=values.answers[question.id];const label=v=>question.options.find(o=>o.value===v)?.label||common[v]||v;dl.append(node('dt',question.prompt),node('dd',a?[(Array.isArray(a.value)?a.value.map(label).join('، '):label(a.value)),a.details].filter(Boolean).join(' · '):unrecorded));}panel.append(dl);}
 const legacy=Object.entries(values.legacy||{}).filter(([,v])=>v);if(legacy.length){panel.append(node('h3',t('Earlier answers','إجاباتكم السابقة')));const dl=node('dl');dl.className='family-summary';for(const [key,value] of legacy)dl.append(node('dt',window.RafiqChildHistoryCopy.english(model.fields[key])),node('dd',value));panel.append(dl);}
 if(values.birth.weightGrams>0||values.birth.lengthCm>0){const label=node('label');checkbox=node('input');checkbox.type='checkbox';label.append(checkbox,node('span',confirmation));panel.append(label);}h.focus();return;}
 const h=node('h2',q.prompt);h.tabIndex=-1;panel.append(h);
 if(q.id==='birth.termStatus'&&window.RafiqQuestionMap){const map=window.RafiqQuestionMap,a=values.answers[q.id];if(a?.prefilledFrom)panel.append(map.phrase('p',map.copy.prefilled));const basic=child.bornBeforeDueDate==='yes'?'early':child.bornBeforeDueDate==='no'?'term':null;if(basic&&a&&['early','term','late'].includes(a.value)&&a.value!==basic){panel.append(map.phrase('p',map.copy.conflict));const link=map.phrase('a',map.copy.editBasics);link.href='onboarding.html?edit='+encodeURIComponent(child.id)+'&section=details&return=profile';panel.append(link);}}
 if(q.section==='play'){const ageInfo=window.RafiqChildHistoryAge.forChild(child);panel.append(node('p',ageInfo.stage?.label||window.RafiqChildHistoryAge.unavailable));if(ageInfo.context.basis==='corrected')panel.append(node('p',window.RafiqChildHistoryAge.corrected));}
 if(q.id==='family.history')panel.append(node('p',t('A family condition does not mean your child has it.','وجود حالة صحية بالعيلة ما بيعني إن طفلكم عنده نفس الحالة.')));
 const a=values.answers[q.id];selected=a?.value??null;const group=node('div');group.className='interview-choices';group.setAttribute('role','group');group.setAttribute('aria-label',q.prompt);
 for(const option of [...q.options,{value:'unknown',label:common.unknown},{value:'skip',label:common.skip}]){const b=button(option.label,()=>{if(q.multi&&!['unknown','skip'].includes(option.value)){const list=Array.isArray(selected)?[...selected]:[];const pos=list.indexOf(option.value);if(pos<0)list.push(option.value);else list.splice(pos,1);answer(list);for(const child of group.children)child.setAttribute('aria-pressed',String(list.includes(child.dataset.value)));}else answer(option.value);});b.dataset.value=option.value;b.setAttribute('aria-pressed',String(Array.isArray(selected)?selected.includes(option.value):selected===option.value));group.append(b);}panel.append(group);
 const label=node('label',detail);input=node('input');input.id='interview-details';label.htmlFor=input.id;input.maxLength=1500;if(q.number){input.type='number';input.min='0.01';input.step='any';}input.value=a?.details||'';input.hidden=!(selected==='yes'||selected==='other'||(Array.isArray(selected)&&selected.includes('other')));label.append(input);panel.append(label);label.hidden=input.hidden;
 // Reveal the label with its input after Yes or Other, and save each detail edit.
 for(const b of group.children){const click=b.onclick;b.onclick=()=>{click();label.hidden=input?.hidden!==false;for(const optionButton of group.children)optionButton.setAttribute('aria-pressed',String(Array.isArray(selected)?selected.includes(optionButton.dataset.value):selected===optionButton.dataset.value));};}
 input.oninput=()=>{dirty=true;attempt(()=>{record();persist();});};
 if(q.section==='vaccinations'){const link=node('a',addVaccines);link.href='health.html?record=vaccine';link.className='interview-health-link';link.onclick=event=>{try{record();persist();}catch(error){event.preventDefault();get('historyStatus').textContent=error.message||errorText;}};panel.append(link);}window.RafiqQuestionMap?.renderHint(panel,q,child,()=>{record();persist();});h.focus();
 }
 get('historyForm').onsubmit=event=>{event.preventDefault();if(index>=qs.length&&phase!=='confirmation'){attempt(()=>{persist();location.assign((((new URLSearchParams(location.search).get('return')==='profile'&&new URLSearchParams(location.search).has('interviewSection'))||localStorage.getItem('rafiqWelcomeSeen_'+(sessionStorage.getItem('rafiqParentUserId')||'local')+'_'+child.id)==='true')?'child-profile.html?child=':'getting-started.html?child=')+encodeURIComponent(child.id));});}else if(phase==='question'&&selected===null)answer('skip');else advance();};
 get('historyPrevious').onclick=()=>{attempt(()=>{record();persist();if(index===0&&options.onBack){options.onBack();return;}index=Math.max(0,index-1);phase='question';values.cursor=qs[index].id;persist();show();});};
 get('historyLater').onclick=()=>attempt(()=>{record();persist();sessionStorage.removeItem?.('rafiqFirstWelcomeChildId_'+sessionStorage.getItem('rafiqParentUserId'));location.assign('child-profile.html?child='+encodeURIComponent(child.id));});show();
 return {draft:()=>{record();return {values,ready};},dispose:()=>{dirty=false;window.removeEventListener?.('beforeunload',leave);}};
 }catch(error){get('historyStatus').textContent=error.message||errorText;get('historyNext').disabled=true;}
}
window.RafiqChildStoryForm={mount};
document.addEventListener('DOMContentLoaded',()=>{if(location.pathname.endsWith('/child-history.html'))mount();});
})();
