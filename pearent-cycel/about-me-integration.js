/* Optional family-controlled exports. No automatic sharing or new permission scope. */
(() => {
 'use strict';
 const M=window.RafiqAboutMe,C=window.RafiqAboutCopy;
 const language=()=>localStorage.getItem('rafiqLanguage_'+sessionStorage.getItem('rafiqParentUserId'))||localStorage.getItem('rafiqLanguage')||document.documentElement.lang||'ar';
 const tr=s=>language()==='ar'?(C.messages[s]||s):s;
 const text=(key,child)=>tr(C.ui[key]).replaceAll('{name}',child.name||'');
 const el=(tag,value)=>{const n=document.createElement(tag);if(value)n.textContent=value;return n;};
 function link(child,view=false){return 'about-me.html?child='+encodeURIComponent(child.id)+(view?'&view=1':'');}
 function selected(){const id=new URLSearchParams(location.search).get('child')||window.RafiqFamily.selected();return window.RafiqSetup.readChildren().find(c=>c.id===id);}
 function card(child){const c=el('section');c.className='about-integration';c.id='aboutProfileCard';c.append(el('h2',text('title',child)),el('p',tr(C.ui.done).replace('{count}',M.profile(child).sectionsDone.length)));const a=el('a',text('edit',child));a.href=link(child);c.append(a);return c;}
 function offer(child,note){
  if(document.getElementById('aboutNoteOffer'))return;
  const box=el('section');box.id='aboutNoteOffer';box.className='about-integration';const label=el('label'),include=el('input');include.type='checkbox';label.append(include,document.createTextNode(text('include',child)));box.append(label);
  const panel=el('div');panel.hidden=true;let selection=M.defaults(),added='';const preview=el('pre');preview.setAttribute('data-user-content','');
  for(const s of C.sections){const l=el('label'),check=el('input');check.type='checkbox';check.checked=true;l.append(check,document.createTextNode(tr(s.title).replaceAll('{name}',child.name)));panel.append(l);check.onchange=()=>{selection.sections=check.checked?[...selection.sections,s.id]:selection.sections.filter(id=>id!==s.id);refresh();};}
  for(const key of ['phones','allergies']){const l=el('label'),check=el('input');check.type='checkbox';l.append(check,document.createTextNode(text(key,child)));panel.append(l);check.onchange=()=>{selection[key]=check.checked;refresh();};}
  panel.append(el('h3',text('preview',child)),preview);const apply=el('button',text('apply',child)),status=el('p');apply.type='button';status.role='status';
  function refresh(){preview.textContent=M.snapshot(child,selection,tr);}
  include.onchange=()=>{panel.hidden=!include.checked;if(!include.checked&&added&&note.value.endsWith(added)){note.value=note.value.slice(0,-added.length);added='';note.dispatchEvent(new Event('input',{bubbles:true}));}};
  apply.onclick=()=>{const base=added&&note.value.endsWith(added)?note.value.slice(0,-added.length):note.value;const append=(base?'\n\n':'')+preview.textContent;const max=note.maxLength>0?note.maxLength:500;if((base+append).length>max){status.textContent=text('long',child);return;}note.value=base+append;added=append;note.dispatchEvent(new Event('input',{bubbles:true}));const concern=document.getElementById('includeConcernSummary');if(concern){concern.checked=true;concern.dispatchEvent(new Event('change'));}status.textContent=text('saved',child);};panel.append(apply,status);box.append(panel);note.after(box);refresh();
 }
 function reminder(child){
  if(!M.due(child)||document.getElementById('aboutReviewReminder'))return;
  const support=document.getElementById('supportModeCard');if(!support)return;
  const box=el('aside');box.id='aboutReviewReminder';box.append(el('p',text('review',child)));const a=el('a',text('view',child));a.href=link(child,true);const b=el('button',text('dismiss',child));b.type='button';b.onclick=()=>{try{M.save(child,{reviewDismissedFor:M.profile(child).updatedAt});box.remove();}catch{box.append(el('p',text('error',child)));}};box.append(a,b);support.append(box);
 }
 function mount(){
  try{const page=location.pathname.split('/').pop(),child=selected();if(!child)return;
   if(page==='child-profile.html'&&(child.supportProfile?.focus==='autism'||M.hasContent(child))&&!document.getElementById('aboutProfileCard'))document.getElementById('profileContent')?.append(card(child));
   if(page==='parent-dashboard.html')reminder(child);
   if(M.hasContent(child)&&['booking.html','screening.html'].includes(page)){const note=document.getElementById(page==='booking.html'?'bookingReason':'bookingNoteText');if(note)offer(child,note);}
  }catch{/* Existing page remains available if optional passport data cannot be read. */}
 }
 document.addEventListener('DOMContentLoaded',()=>{mount();if(location.pathname.endsWith('/screening.html')){const observer=new MutationObserver(mount);observer.observe(document.getElementById('concernSummaryAnswers')||document.body,{childList:true,subtree:true});}});
 window.addEventListener('rafiq-support-change',mount);
 window.addEventListener('rafiq:conversation',event=>conversation(event.detail));
 function conversation(detail){
  document.getElementById('aboutConversationLink')?.remove();
  try{const api=window.RafiqDirectMessages,viewer=api.identity('parent');const id=typeof detail==='string'?detail:detail?.threadId||detail?.id||new URLSearchParams(location.search).get('thread');const thread=api.list(viewer).find(t=>t.id===id),child=thread&&window.RafiqSetup.readChildren().find(c=>c.id===thread.childId);if(!child||!M.hasContent(child)||!api.canReply(viewer,thread))return;const a=el('a',text('sendAbout',child));a.id='aboutConversationLink';a.className='about-integration';a.href=link(child,true)+'&thread='+encodeURIComponent(id);document.getElementById('messageCompose')?.before(a);}catch{}
 }
})();
