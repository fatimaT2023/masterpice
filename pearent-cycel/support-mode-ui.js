(() => {
 'use strict';
 if(window.RAFIQ_SHOW_DRAFT_LABELS===undefined)window.RAFIQ_SHOW_DRAFT_LABELS=true;
 const copy={
 title:['Support for {name}','دعم لـ {name}'],add:['Add support tools','إضافة أدوات دعم'],change:['Change','تغيير'],dismiss:['Not now','مش هلأ'],
 question:['Is there something you would like Rafiq to tailor for {name}?','في شي بتحبوا رفيق يخصّصه لـ {name}؟'],
 diagnosed:["{name} has a diagnosis I’d like support with",'{name} عنده تشخيص وبدنا دعم'],worried:["We’re worried about {name}’s development",'قلقانين على نموّ {name}'],
 diagnosis:['What diagnosis?','شو التشخيص؟'],autism:['Autism','توحد'],speech:['Speech and language delay','تأخر بالنطق واللغة'],other:['Other','غير ذلك'],private:['Prefer not to say','بنفضّل ما نحكي'],
 where:['Where are you right now?','وين وصلتوا هلأ؟'],noFollow:['{name} has a diagnosis and we are not following with anyone yet','{name} عنده تشخيص وما عنا متابعة مع حدا لسا'],following:['{name} has a diagnosis and we follow with specialists, and would like more support','{name} عنده تشخيص وعنا متابعة مع مختصين وبدنا دعم أكثر'],
 skip:['Skip','تخطّي'],back:['Back','رجوع'],close:['Close','إغلاق'],clear:['Turn support off','إيقاف أدوات الدعم'],
 invitation:['Would you like tools tailored to {name}?','بتحبوا أدوات مخصّصة لـ {name}؟'],on:['Support for {name} is on.','أدوات الدعم لـ {name} مفعّلة.'],
 thanks:['Thank you. Rafiq will keep offering age-matched activities and the specialist directory. More support tools for this are being prepared.','شكرًا إلكم. رفيق رح يضل يقدّم أنشطة مناسبة للعمر ودليل المختصين. أدوات دعم إضافية لهذا المسار قيد التجهيز.'],
 coming:['This support path is being prepared. You can use the existing concern flow.','مسار الدعم هذا قيد التجهيز. بتقدروا تستخدموا مسار القلق الحالي.'],concern:['Discuss a concern','احكوا عن قلقكم'],
 saved:['Your support choice is saved.','حفظنا اختياركم للدعم.'],error:['Could not save, or the choice changed in another tab. Close and reopen to try again.','ما قدرنا نحفظ، أو تغيّر الاختيار بنافذة ثانية. سكّروا وافتحوا مرة ثانية للمحاولة.'],
 next:['Your next step','خطوتكم الجايّة'],draft:['Draft: pending specialist review','مسودة: بانتظار مراجعة مختص'],
 footer:['Rafiq offers educational support. It does not diagnose or treat, and it does not replace your specialists.','رفيق بقدّم دعم تعليمي. ما بشخّص ولا بعالج، وما بحلّ محل مختصّيكم.'],
 filter:['Mentions autism in the profile','يذكر التوحد في ملفه'],banner:['Showing specialists who mention autism','بنعرض المختصين اللي بذكروا التوحد بملفاتهم'],all:['Show everyone','عرض الجميع'],
 roles:['Developmental pediatrician: development and health. Speech specialist: communication and language. Occupational therapist: participation in daily routines. Psychologist: emotional support. Behavior specialist: understanding everyday behavior.','طبيب أطفال نمائي: النمو والصحة. أخصائي نطق: التواصل واللغة. علاج وظيفي: المشاركة بالروتين اليومي. أخصائي نفسي: الدعم النفسي. أخصائي سلوك: فهم السلوك اليومي.']
 };
 Object.values(copy).forEach(([en,ar])=>{(window.RafiqHomeArabic=window.RafiqHomeArabic||{})[en]=ar;});
 function ar(){const id=sessionStorage.getItem('rafiqParentUserId');return (localStorage.getItem('rafiqLanguage_'+id)||localStorage.getItem('rafiqLanguage')||document.documentElement.lang)==='ar';}
 function text(key,name=''){return copy[key][ar()?1:0].replaceAll('{name}',name);}
 function node(tag,value){const el=document.createElement(tag);if(value)el.textContent=value;return el;}
 function button(key,fn,name){const el=node('button',text(key,name));el.type='button';el.className='today-secondary';el.onclick=fn;return el;}
 function open(child,trigger){
  const dialog=node('dialog');dialog.className='support-dialog';dialog.dir=ar()?'rtl':'ltr';let step=0,focus=null;
  const done=answer=>{try{child=window.RafiqSupportMode.save(child,answer);renderMessage(answer);}catch{const e=node('p',text('error'));e.role='alert';dialog.append(e);}};
  function heading(key){dialog.replaceChildren();const h=node('h2',text(key,child.name));h.id='supportQuestion';h.tabIndex=-1;dialog.setAttribute('aria-labelledby',h.id);dialog.append(h);h.focus();}
  function finish(){dialog.close();dialog.remove();trigger?.focus();if(location.pathname.endsWith('/parent-dashboard.html')){location.reload();return;}window.dispatchEvent(new Event('rafiq-support-change'));}
  function renderMessage(answer){heading('saved');dialog.append(node('p',text(answer.situation==='worried'?'coming':window.RafiqSupportServices.active(child)?'on':'thanks',child.name)));if(answer.situation==='worried'){const a=node('a',text('concern'));a.href='screening.html';dialog.append(a);}dialog.append(button('close',finish));}
  function show(){
   heading(['question','diagnosis','where'][step]);
   const option=(key,fn)=>dialog.append(button(key,fn,child.name));
   if(step===0){option('diagnosed',()=>{step=1;show();});option('worried',()=>done({situation:'worried',focus:null}));option('dismiss',()=>done({situation:'none',focus:null}));}
   if(step===1){option('autism',()=>{focus='autism';step=2;show();});for(const [key,value] of [['speech','speech_language'],['other','other'],['private','not_said']])option(key,()=>done({situation:'diagnosed_no_followup',focus:value}));}
   if(step===2){option('noFollow',()=>done({situation:'diagnosed_no_followup',focus}));option('following',()=>done({situation:'diagnosed_following',focus}));}
   option('skip',()=>done({situation:'skipped',focus:null}));option('back',()=>{if(step){step--;show();}else finish();});if(child.supportProfile)option('clear',()=>done({situation:'none',focus:null}));
   dialog.append(node('small',text('footer')));
  }
  document.body.append(dialog);dialog.addEventListener('cancel',()=>{setTimeout(()=>dialog.remove(),0);});dialog.showModal();show();
 }
 function mount(){
  const page=location.pathname.split('/').pop();if(!['parent-dashboard.html','child-profile.html','getting-started.html','specialists.html','child-history.html'].includes(page))return;
  const children=window.RafiqSetup.readChildren(),id=new URLSearchParams(location.search).get('child')||window.RafiqFamily.selected(),child=children.find(c=>c.id===id)||children[0];if(!child)return;
  if(page==='specialists.html'){directory(child);return;}
  if(page==='child-history.html'){if(!child.supportProfile&&!document.querySelector('.support-dialog'))open(child);return;}
  document.getElementById('supportModeCard')?.remove();
  const home=page==='parent-dashboard.html',active=window.RafiqSupportServices.active(child);if(home&&child.supportProfile&&!active)return;
  const card=node('section');card.id='supportModeCard';card.className='today-card family-card support-mode-card';card.dir=ar()?'rtl':'ltr';
  card.append(node('h2',text(home&&!child.supportProfile?'invitation':'title',child.name)));
  if(active)card.append(node('p',text('on',child.name)));
  const edit=button(child.supportProfile?'change':'add',()=>open(child,edit));card.append(edit);
  if(home&&!child.supportProfile)card.append(button('dismiss',()=>{try{window.RafiqSupportMode.save(child,{situation:'skipped',focus:null});mount();}catch{card.append(node('p',text('error')));}}));
  if(home&&active&&window.RafiqSupportJourneyUI){window.RafiqSupportJourneyUI.home(card,child);}else if(home&&active){const next=window.RafiqSupportServices.next(child);if(next)card.append(node('h3',text('next')));for(const s of window.RafiqSupportServices.available(child)){const a=node('a',(ar()?s.titleAr:s.title).replaceAll('{name}',child.name));a.className='today-secondary';a.dataset.supportService=s.id;a.href=s.destination;card.append(a,node('p',ar()?s.descriptionAr:s.description));if(s.reviewStatus==='draft'&&window.RAFIQ_SHOW_DRAFT_LABELS)card.append(node('small',text('draft')));}card.append(node('p',text('footer')));}
  const anchor=home?document.getElementById('todayPriority'):document.querySelector('#profileContent, main');if(home)anchor?.after(card);else anchor?.prepend(card);
 }
 function directory(child){
  if(document.getElementById('supportDirectoryFilter'))return;
  const holder=node('section');holder.id='supportDirectoryFilter';holder.className='today-card support-mode-card';
  const label=node('label'),check=node('input');check.type='checkbox';check.id='supportMentionsFilter';check.checked=window.RafiqSupportServices.active(child);label.append(check,document.createTextNode(text('filter')));holder.append(label);
  const banner=node('p',text('banner')),all=button('all',()=>{check.checked=false;check.dispatchEvent(new Event('change'));});holder.append(banner,all,node('p',text('roles')));
  function change(){banner.hidden=all.hidden=!check.checked;document.getElementById('searchInput')?.dispatchEvent(new Event('input'));}check.onchange=change;
  document.getElementById('specialistGrid')?.before(holder);change();
  document.getElementById('clearFilters')?.addEventListener('click',()=>{check.checked=false;change();});
 }
 window.RafiqSupportUI={open,copy,mount};
 document.addEventListener('DOMContentLoaded',mount);window.addEventListener('rafiq-support-change',mount);window.addEventListener('storage',e=>{if(e.key==='rafiqChildren')mount();});
})();
