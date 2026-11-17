(() => {
 'use strict';
 const nativeLocal=window.localStorage,nativeSession=window.sessionStorage,nativeDatabase=window.indexedDB,C=window.RafiqParentPreviewCopy,get=id=>document.getElementById(id),frame=get('parentPreviewFrame');
 const cases=window.RafiqDemoCases?.cases||[];for(const item of cases){C['case-'+item.key]=[item.label.en,item.label.ar];const option=document.createElement('option');option.value='case-'+item.key;get('previewScenario').append(option);}
 let signedInCase;try{if(nativeSession.getItem('rafiqRole')==='parent'){const user=JSON.parse(nativeLocal.getItem('rafiqUsers')||'[]').find(u=>u.id===nativeSession.getItem('rafiqParentUserId'));if(user?.isDemo&&user.demoSet===window.RafiqDemoCases?.tag&&(cases.some(c=>c.key===user.demoScenario)||(window.RafiqDemoCases?.families||[]).some(c=>c.key===user.demoScenario)))signedInCase=user.demoScenario;}}catch{}
 const params=new URLSearchParams(location.search);let requested=params.get('page')||'parent-dashboard.html',mode=params.get('demo')||(signedInCase?(signedInCase==='mother'?'mother':'case-'+signedInCase):(/^onboarding\.html(?:\?|$)/.test(requested)&&!requested.includes('edit=')?'new':'family')),runtime,database,allowLeave=false;
 if(!['new','family','mother','legacy',...cases.map(c=>'case-'+c.key)].includes(mode))mode='new';
 let language=nativeLocal.getItem('rafiqLanguage_'+nativeSession.getItem('rafiqParentUserId'))||nativeLocal.getItem('rafiqLanguage')||'ar';if(!['ar','en'].includes(language))language='ar';
 const t=key=>C[key][language==='ar'?1:0];
 const guide=document.createElement('a');guide.href='../piblic-pages/demo-showcase.html';guide.target='_blank';guide.rel='noopener';guide.style.cssText='padding:8px;color:#28675f;min-height:44px;display:inline-flex;align-items:center';get('previewExit').after(guide);const updateGuide=()=>{guide.textContent=language==='ar'?'حسابات العرض وخطواتها':'Presentation accounts and steps';};updateGuide();new MutationObserver(updateGuide).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 const pages=new Set(['support-areas','support-detail','support-discovery','about-me','activities','ai-assistant','album','booking','bookings','challenges','child-history','child-profile','daily-activity','play-on-screen','follow-up-request','getting-started','guide','health','invited-child','messages','milestones','onboarding','parent-dashboard','payment','screening','settings','specialist-profile','specialist-report','specialists','start-guide','subscription','support-journey','support-practice','support-tools','support-visit'].map(p=>p+'.html'));
 // Phase 5: specialist pages open inside the same demo (shared store) when viewing as a specialist.
 const specialistPages=new Set(['specialist-dashboard','specialist-bookings','booking-details','report-form','consultation','schedule','clients','availability','earnings','profile','messages','follow-up','specialist-settings'].map(p=>p+'.html'));
 function route(value){try{const url=new URL(value,location.href),file=url.pathname.split('/').pop();if(url.origin!==location.origin)return null;if(url.pathname.startsWith(new URL('.',location.href).pathname)&&pages.has(file))return file+url.search+url.hash;if(url.pathname.startsWith(new URL('../specialist-cycle/',location.href).pathname)&&specialistPages.has(file))return '../specialist-cycle/'+file+url.search+url.hash;return null;}catch{return null;}}
 const isSpecialistPage=value=>String(value||'').startsWith('../specialist-cycle/');
 // Fictional demo modes are kept in this tab (sessionStorage) so a refresh keeps the demo. Reset clears it.
 const STATE_KEY='rafiqPreviewState';let role='parent',parentOwner=null,saveTimer;
 const roleCopy={label:['View as','عرض كـ'],parent:['Parent','ولي الأمر'],specialist:['Specialist (demo)','مختص (عرض)'],hint:['Switch roles to follow the same request from both sides. Demo data stays in this browser tab.','بدّلوا الدور لتتابعوا نفس الطلب من الطرفين. بيانات العرض بتضل بهالتبويب.']};
 const rt=key=>roleCopy[key][language==='ar'?1:0];
 function readSnapshot(){try{const s=JSON.parse(nativeSession.getItem(STATE_KEY)||'null');return s&&s.mode===mode&&s.values?s:null;}catch{return null;}}
 function save(){if(mode==='legacy'||!runtime)return;clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{const d=runtime.dump(frame.contentWindow);if(d)nativeSession.setItem(STATE_KEY,JSON.stringify({...d,role,savedAt:new Date().toISOString()}));}catch{notify('error');}},120);}
 function clearSnapshot(){try{nativeSession.removeItem(STATE_KEY);}catch{/* Nothing saved. */}}
 function approvedSpecialists(){try{const rows=JSON.parse(runtime.connect(frame.contentWindow).local.getItem('rafiqSpecialists')||'[]');return Array.isArray(rows)?rows.filter(s=>s?.status==='approved'&&s.id):[];}catch{return [];}}
 function paintRole(){
  const box=get('previewRoleBox'),select=get('previewRole');if(!box||!select||!runtime)return;
  const list=mode==='legacy'?[]:approvedSpecialists();box.hidden=!list.length;if(!list.length)return;
  get('previewRoleLabel').textContent=rt('label');box.title=rt('hint');select.replaceChildren();
  const add=(value,text)=>{const o=document.createElement('option');o.value=value;o.textContent=text;select.append(o);};
  add('parent',rt('parent'));for(const s of list)add('specialist:'+s.id,rt('specialist')+' · '+(s.fullName||s.id));
  let current='parent';try{const id=runtime.connect(frame.contentWindow).session.getItem('rafiqSpecialistId');if(role==='specialist'&&id)current='specialist:'+id;}catch{}
  select.value=current;document.documentElement.dataset.previewRole=role;
 }
 function switchRole(value){
  try{const session=runtime.connect(frame.contentWindow).session;
   if(value==='parent'){session.removeItem('rafiqSpecialistId');session.removeItem('rafiqSpecialistRegistrationUserId');session.setItem('rafiqRole','parent');if(parentOwner)session.setItem('rafiqParentUserId',parentOwner);role='parent';frame.src='bookings.html';}
   else{const id=value.slice('specialist:'.length);if(!approvedSpecialists().some(s=>s.id===id))return;session.setItem('rafiqRole','specialist');session.setItem('rafiqSpecialistId',id);session.removeItem('rafiqSpecialistRegistrationUserId');role='specialist';frame.src='../specialist-cycle/specialist-dashboard.html';}
   save();paintRole();
  }catch{notify('error');}
 }
 function paint(){get('previewToggle').textContent=language==='ar'?'خيارات التجربة':'Demo controls';document.documentElement.lang=language;document.documentElement.dir=language==='ar'?'rtl':'ltr';get('previewBadge').textContent=t('badge');get('previewNotice').textContent=t(mode==='legacy'?'readonly':'notice');get('scenarioLabel').textContent=t('scenario');for(const option of get('previewScenario').options)option.textContent=t(option.value);get('previewScenario').value=mode;get('previewLanguage').textContent=language==='ar'?'English':'العربية';get('previewLanguage').setAttribute('aria-label',t('language'));get('previewReset').textContent=t('reset');get('previewExit').textContent=t('exit');frame.title=t('frame');document.title=t('title')+' | RAFIQ';paintRole();}
 function notify(key){get('previewStatus').textContent=t(key);}
 function host(){return Object.assign({version:1,connect:target=>({...runtime.connect(target),indexedDB:database,readOnly:runtime.readOnly}),isParentURL:value=>!!route(value),languageChanged(value){if(['ar','en'].includes(value)&&value!==language){language=value;paint();}},boundary(value){notify('unavailable');const dialog=document.createElement('dialog');dialog.className='preview-error';const p=document.createElement('p');p.textContent=t('unavailable');const open=document.createElement('a');open.textContent=t('open');open.href=value;open.target='_blank';open.rel='noopener noreferrer';const close=document.createElement('button');close.type='button';close.textContent=t('back');close.onclick=()=>{dialog.close();dialog.remove();};dialog.append(p,open,close);document.body.append(dialog);dialog.showModal();},signOut(){nativeSession.removeItem('rafiqRole');nativeSession.removeItem('rafiqParentUserId');allowLeave=true;},notify},{role:()=>role,isDemoRole:value=>mode!=='legacy'&&value===role,viewAs:value=>switchRole(value)});}
 function start(page,fresh=false){
  try{if(fresh)clearSnapshot();const snapshot=fresh||mode==='legacy'?null:readSnapshot();role=snapshot?.role==='specialist'?'specialist':'parent';
   runtime=window.RafiqParentPreviewStore.create({mode,nativeLocal,nativeSession,language,notify,restore:snapshot,onChange:save});database=mode==='legacy'?window.RafiqParentPreviewDatabase.readOnly(nativeDatabase,notify):window.RafiqParentPreviewDatabase.memory();
   const connected=runtime.connect(frame.contentWindow);parentOwner=connected.session.getItem('rafiqParentUserId');if(mode!=='legacy'){connected.local.setItem('rafiqLanguage_'+connected.session.getItem('rafiqParentUserId'),language);connected.local.setItem('rafiqLanguage',language);}
   let routed=route(page);if(routed&&isSpecialistPage(routed)!==(role==='specialist'))routed=null;
   if(role==='specialist'){const target=routed||'../specialist-cycle/specialist-dashboard.html';window.RafiqParentPreview=host();get('previewStatus').textContent='';paint();requested=target;frame.src=target;save();return;}
   const target=new URL(routed||'parent-dashboard.html',location.href);if(mode!=='legacy'){const children=JSON.parse(connected.local.getItem('rafiqChildren')||'[]'),selected=connected.local.getItem('rafiqCurrentChildId')||children[0]?.id;for(const key of ['child','edit'])if(target.searchParams.has(key)&&!children.some(c=>c.id===target.searchParams.get(key))){if(selected)target.searchParams.set(key,selected);else target.searchParams.delete(key);}}
   window.RafiqParentPreview=host();
   get('previewStatus').textContent='';paint();requested=target.pathname.split('/').pop()+target.search+target.hash;frame.src=requested;save();
  }catch{if(runtime){mode=runtime.mode;paint();}notify(mode==='legacy'?'legacyUnavailable':'error');}
 }
 frame.addEventListener('load',()=>{try{const url=frame.contentWindow.location.href;if(url==='about:blank')return;const page=route(url);if(page){requested=page;history.replaceState(null,'','parent-preview.html?page='+encodeURIComponent(page)+'&demo='+mode);document.title=frame.contentDocument.title||t('title');paintRole();}else if(url.includes('/piblic-pages/login.html')){allowLeave=true;location.assign(url);}else notify('unavailable');}catch{notify('unavailable');}});
 get('previewScenario').onchange=()=>{const selected=get('previewScenario').value;if(selected==='legacy'&&(nativeSession.getItem('rafiqRole')!=='parent'||!nativeSession.getItem('rafiqParentUserId'))){get('previewScenario').value=mode;notify('legacyUnavailable');return;}if(runtime?.changed&&!confirm(t('resetConfirm'))){get('previewScenario').value=mode;return;}mode=selected;start(mode==='new'?'onboarding.html':mode==='legacy'?'child-profile.html':'parent-dashboard.html',true);};
 get('previewLanguage').onclick=()=>{language=language==='ar'?'en':'ar';nativeLocal.setItem('rafiqLanguage',language);paint();try{const win=frame.contentWindow;win.localStorage.setItem('rafiqLanguage_'+win.sessionStorage.getItem('rafiqParentUserId'),language);win.localStorage.setItem('rafiqLanguage',language);if(win.RafiqLanguage)win.RafiqLanguage.setLanguage(language);else win.location.reload();}catch{notify('error');}};
 get('previewReset').onclick=()=>{if(confirm(t('resetConfirm')))start(mode==='new'?'onboarding.html':mode==='legacy'?'child-profile.html':'parent-dashboard.html',true);};
 get('previewRole')?.addEventListener('change',event=>switchRole(event.target.value));
 get('previewExit').onclick=()=>{if(!runtime?.changed||confirm(t('leave'))){allowLeave=true;location.assign('../rafiq-home-transfer-20261013-211454/index.html');}};
 window.addEventListener('beforeunload',e=>{if(runtime?.changed&&!allowLeave){e.preventDefault();e.returnValue='';}});
 paint();start(requested);
})();
