/* Shared parent navigation; legacy IDs keep existing page controllers compatible. */
(() => {
'use strict';
const groups=[['My child’s records',[['health.html','Health and vaccines','Keep health notes and measurements'],['album.html','Memories','Save photos and special moments']]],['Activity and growth',[['daily-activity.html','Activity with my child','Try an activity and save their reaction'],['milestones.html','Growth journal','Understand their stage and save observations'],['screening.html','I have a concern','Organize your notes and choose a next step']]],['Specialists',[['specialists.html','Find a specialist','Choose a specialist for a consultation'],['bookings.html','Appointments and reports','View appointments, reports and follow-up']]]];
// Primary groups open their first page; their sections stay in the page tab strip.
groups.splice(0,2,groups[1],groups[0]);
function navigationBadges(account,storage=localStorage,now=new Date()){const read=key=>{try{const a=JSON.parse(storage.getItem(key)||'[]');return Array.isArray(a)?a:[];}catch{return [];}};const accessible=id=>window.RafiqFamily?.canAccessId(id,account)===true;const care=read('rafiqCareConnections'),threads=read('rafiqDirectConversations').filter(t=>accessible(t.childId)&&care.some(c=>c.threadId===t.id&&c.childId===t.childId&&c.specialistId===t.specialistId&&c.parentId===t.parentId&&['pending','active'].includes(c.status)));let messages=0;for(const thread of threads)messages+=(thread.messages||[]).filter((m,i)=>(m.senderRole!=='parent'||m.senderId!==account)&&(Number.isInteger(thread.readCounts?.['parent:'+account])?i>=thread.readCounts['parent:'+account]:m.createdAt>(thread.readAt?.['parent:'+account]||''))).length;messages+=read('rafiqNotifications').filter(n=>n.type!=='message'&&n.title==='Your specialist reviewed a shared entry'&&accessible(n.childId)&&!n.readBy?.[account]&&threads.some(t=>new URLSearchParams(String(n.link||'').split('?')[1]||'').get('thread')===t.id)).length;
const alerts=new Set();for(const r of read('rafiqSpecialistReports').filter(r=>accessible(r.childId)&&!r._deletedAt)){const key=String(r.id||r.bookingId)+'|'+String(r.createdAt||r.reportDate||'');if(!read('rafiqTodaySeenReports_'+r.childId).includes(key))alerts.add(r.bookingId||key);}for(const booking of read('rafiqBookings').filter(b=>accessible(b.childId)&&['confirmed','upcoming','scheduled','accepted'].includes(b.status)&&!['pending','failed','refunded','refund_pending'].includes(b.sessionPayment?.status))){const match=String(booking.time||'').match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);let date=new Date(booking.date+'T23:59:00');if(match){let hours=Number(match[1]);if(match[3])hours=hours%12+(match[3].toUpperCase()==='PM'?12:0);date.setHours(hours,Number(match[2]),0,0);}if(date>=now&&date-now<=86400000)alerts.add(booking.id);}return {messages,appointments:alerts.size};}
window.RafiqParentNavigation={groups,badges:navigationBadges};
const mount=document.getElementById('parentSidebarMount'); if(!mount)return;
if(!window.RafiqChildAvatar&&!document.querySelector('script[data-child-avatar]')){const script=document.createElement('script');script.src=new URL('child-avatar.js',document.currentScript.src).href;script.dataset.childAvatar='';document.head.append(script);}
const page=location.pathname.split('/').pop(), dashboard=page==='parent-dashboard.html', prefix=dashboard?'sidebarChild':'child';
const active=({'specialist-report.html':'bookings.html','booking.html':'specialists.html','specialist-profile.html':'specialists.html','follow-up-request.html':'messages.html'})[page]||page;
const isCurrent=href=>href==='daily-activity.html'?(page==='activities.html'||page==='daily-activity.html'):href.split('?')[0]===active;
const link=([href,title,description])=>`<a href="${href}"${isCurrent(href)?' aria-current="page"':''}><strong>${title}</strong><span>${description}</span></a>`;
mount.outerHTML=`<header class="parent-navigation" id="sidebar"><div class="parent-navigation-top">
<a class="parent-brand" href="parent-dashboard.html" aria-label="Rafiq today"><span>R</span> RAFIQ</a>
<div class="child-switcher"><div class="parent-child-control"><a href="child-profile.html" class="parent-child-button" id="childProfileLink" aria-label="View child profile"><span class="parent-child-avatar" id="${prefix}Avatar">?</span><span class="parent-child-copy"><strong id="${prefix}Name">Your child</strong><span id="${prefix}Age">Choose a child</span></span></a><button type="button" id="childSwitcherButton" class="parent-child-toggle" aria-expanded="false" aria-controls="childDropdown" aria-label="Switch child"><svg class="parent-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div id="childDropdown" class="parent-child-dropdown" hidden><div id="childDropdownList"></div><a href="onboarding.html">+ Add another child</a></div></div>
<div class="parent-header-actions"><a class="parent-ask" href="ai-assistant.html"${page==='ai-assistant.html'?' aria-current="page"':''}>Ask Rafiq</a><details class="parent-account"><summary>My account <svg class="parent-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="parent-nav-panel">${link(['settings.html','Settings','Account, language & privacy'])}${link(['subscription.html','My plan and payments','View your subscription options'])}${link(['../piblic-pages/help-center.html?from=parent','Help Center','Guides & registration support'])}<button id="logoutButton" type="button">Log out</button></div></details></div>
<nav class="parent-primary-nav" aria-label="Parent navigation"><a class="parent-today${dashboard?' is-active':''}" href="parent-dashboard.html"${dashboard?' aria-current="page"':''}>Home</a>${groups.map(([title,items],index)=>`<a data-nav-group="${index===2?'specialists':index===0?'play':'child'}" class="parent-records-link${items.some(item=>isCurrent(item[0]))?' is-active':''}" href="${items[0][0]}"${page===items[0][0]?' aria-current="page"':''}>${title}</a>`).join('')}<a class="parent-messages-link" href="messages.html"${active==='messages.html'?' aria-current="page"':''}>Messages</a></nav></div><button id="sidebarClose" type="button" hidden tabindex="-1">Close</button></header>`;
document.body.classList.add('has-parent-navigation');
const header=document.getElementById('sidebar');document.body.prepend(header);
 // Opt in only this parent Navbar; no sounds on page load or other controls.
 if(window.RafiqUISounds)window.RafiqUISounds.attachNavigation(header);
 else{
  const soundScript=document.createElement('script');
  soundScript.src=new URL('../shared/ui-sounds.js',document.currentScript.src).href;
  soundScript.onload=()=>window.RafiqUISounds?.attachNavigation(header);
  document.head.append(soundScript);
 }

// Decorative line icons keep the existing links and menu controllers intact.
const navIcon=paths=>`<svg class="parent-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
const icons=[
 ['.parent-today','<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>'],
 ['.parent-messages-link','<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5A8.5 8.5 0 0 1 10.5 3h2a8.5 8.5 0 0 1 8.5 8.5Z"/><path d="M7 10h10M7 14h6"/>'],
 ['[data-nav-group="child"]','<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6"/>'],
 ['[data-nav-group="play"]','<rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 5V3h6v2M9 11h6M9 15h6"/>'],
 ['[data-nav-group="specialists"]','<path d="M6 3v5a6 6 0 0 0 12 0V3M4 3h4m8 0h4M12 14v3a4 4 0 0 0 8 0v-2"/><circle cx="20" cy="12" r="3"/>'],
 ['.parent-ask','<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/>'],
 ['.parent-account>summary','<circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>']
];
icons.forEach(([selector,paths])=>header.querySelector(selector)?.insertAdjacentHTML('afterbegin',navIcon(paths)));
const accountPanel=header.querySelector('.parent-account>.parent-nav-panel');
accountPanel.classList.add('parent-account-card');
accountPanel.insertAdjacentHTML('afterbegin',`<div class="parent-account-card-heading"><span class="parent-account-emblem" aria-hidden="true">${navIcon('<circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>')}</span><div><strong>My account</strong><p>Account, language & privacy</p></div></div>`);
const accountIcons=[
 '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',
 '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>',
 '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 17h.01"/>'
];
accountPanel.querySelectorAll(':scope > a').forEach((item,index)=>{
 const copy=document.createElement('div');copy.className='parent-account-item-copy';
 while(item.firstChild)copy.append(item.firstChild);
 item.append(copy);
 item.insertAdjacentHTML('afterbegin',`<span class="parent-account-item-icon">${navIcon(accountIcons[index])}</span>`);
 item.insertAdjacentHTML('beforeend',navIcon('<path d="m9 6 6 6-6 6"/>'));
});
accountPanel.querySelector('#logoutButton').insertAdjacentHTML('afterbegin',navIcon('<path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M10 12h11m-4-4 4 4-4 4"/>'));
// Keep the guide available from every parent page, including returning visits.
(window.RafiqArabicTemplates=window.RafiqArabicTemplates||[]).push({en:'{0} unread messages and recommendations',ar:'{0} رسائل وتوصيات غير مقروءة'},{en:'{0} appointment and report updates',ar:'{0} تحديثات للمواعيد والتقارير'});
const registerGuideCopy=()=>Object.assign(window.RafiqHomeArabic=window.RafiqHomeArabic||{}, {'How to use Rafiq':'كيف تستخدموا رفيق','Learn about the services anytime':'تعرّفوا على الخدمات بأي وقت','Messages':'الرسائل','My child’s records':'سجلات طفلي','Activity and growth':'الأنشطة والنمو','Specialists':'المختصون','My specialists':'مختصّيني','Child profile':'ملف الطفل','Health and vaccines':'الصحة والمطاعيم','Growth journal':'سجل النمو','Activity with my child':'نشاط مع طفلي','I have a concern':'عندي قلق','Find a specialist':'البحث عن مختص','Appointments and reports':'المواعيد والتقارير','My plan and payments':'خطتي والمدفوعات','My account':'حسابي','Ask Rafiq':'اسألوا رفيق','Review your child’s information':'راجعوا معلومات طفلكم','Follow-up conversations with your specialists':'محادثات المتابعة مع مختصّيكم'});registerGuideCopy();document.addEventListener('DOMContentLoaded',registerGuideCopy);
const permanentGuide=document.createElement('a');permanentGuide.href='guide.html';permanentGuide.className='parent-guide-link';permanentGuide.innerHTML='<span class="parent-account-item-icon">'+navIcon(accountIcons[2])+'</span><div class="parent-account-item-copy"><strong>How to use Rafiq</strong><span>Learn about the services anytime</span></div>'+navIcon('<path d="m9 6 6 6-6 6"/>');accountPanel.insertBefore(permanentGuide,accountPanel.querySelector('#logoutButton'));
const dropdown=document.getElementById('childDropdown'),switcher=document.getElementById('childSwitcherButton'),menus=[...header.querySelectorAll('details')];
const closeMenus=except=>menus.forEach(item=>{if(item!==except)item.open=false;});
const logoutDialog=document.createElement('dialog');
logoutDialog.className='parent-logout-dialog';
logoutDialog.setAttribute('aria-labelledby','logoutDialogTitle');
logoutDialog.setAttribute('aria-describedby','logoutDialogDescription');
logoutDialog.innerHTML=`<form method="dialog"><span class="parent-logout-emblem">${navIcon('<path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M10 12h11m-4-4 4 4-4 4"/>')}</span><h2 id="logoutDialogTitle"></h2><p id="logoutDialogDescription"></p><div class="parent-logout-actions"><button type="submit" value="cancel" class="parent-logout-cancel" autofocus></button><button type="submit" value="confirm" class="parent-logout-confirm"></button></div></form>`;
document.body.append(logoutDialog);
logoutDialog.addEventListener('close',()=>{
 document.body.classList.remove('parent-logout-open');
 if(logoutDialog.returnValue==='confirm'){sessionStorage.clear();location.replace('../piblic-pages/login.html');}
});
logoutDialog.addEventListener('click',event=>{if(event.target!==logoutDialog)return;const box=logoutDialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)logoutDialog.close('cancel');});
menus.forEach(item=>item.addEventListener('toggle',()=>{if(item.open){closeMenus(item);dropdown.hidden=true;}}));
document.addEventListener('click',event=>{
if(!header.contains(event.target))closeMenus();
if(!dashboard){if(event.target.closest('#childSwitcherButton')){dropdown.hidden=!dropdown.hidden;if(!dropdown.hidden)closeMenus();}else if(!event.target.closest('.child-switcher'))dropdown.hidden=true;}
if(event.target.closest('#logoutButton, #privacyLogoutButton')){
 event.preventDefault();event.stopImmediatePropagation();
 if(logoutDialog.open)return;
 const arabic=document.documentElement.lang==='ar';
 logoutDialog.querySelector('h2').textContent=arabic?'تسجيل الخروج؟':'Log out of Rafiq?';
 logoutDialog.querySelector('p').textContent=arabic?'هل أنت متأكد أنك تريد إنهاء جلستك الحالية؟':'Are you sure you want to end your current session?';
 logoutDialog.querySelector('.parent-logout-cancel').textContent=arabic?'إلغاء':'Cancel';
 logoutDialog.querySelector('.parent-logout-confirm').textContent=arabic?'تسجيل الخروج':'Log out';
 logoutDialog.returnValue='';
 document.body.classList.add('parent-logout-open');
 logoutDialog.showModal();
}
},true);
new MutationObserver(()=>{switcher.setAttribute('aria-expanded',String(!dropdown.hidden));if(!dropdown.hidden)closeMenus();}).observe(dropdown,{attributes:true,attributeFilter:['hidden']});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const open=menus.find(item=>item.open);if(open){open.open=false;open.querySelector('summary').focus();}if(!dropdown.hidden){dropdown.hidden=true;switcher.focus();}});
function renderNavigationBadges(){const account=sessionStorage.getItem('rafiqParentUserId');if(!account)return;const counts=navigationBadges(account);document.querySelectorAll('.parent-nav-badge').forEach(n=>n.remove());function badge(selector,count,label){if(!count)return;document.querySelectorAll(selector).forEach(target=>{const b=document.createElement('span');b.className='parent-nav-badge';b.textContent=String(count);b.setAttribute('aria-label',count+' '+label);target.append(b);});}badge('[data-nav-group="specialists"],.parent-primary-nav a[href="messages.html"],.parent-records-tabs a[href="messages.html"]',counts.messages,'unread messages and recommendations');badge('.parent-primary-nav a[href="bookings.html"],.parent-records-tabs a[href="bookings.html"]',counts.appointments,'appointment and report updates');}
window.addEventListener('storage',renderNavigationBadges);window.addEventListener('focus',renderNavigationBadges);window.addEventListener('rafiq:conversation',renderNavigationBadges);window.addEventListener('rafiq:care-updated',renderNavigationBadges);window.addEventListener('rafiqNotificationsChanged',renderNavigationBadges);document.addEventListener('DOMContentLoaded',renderNavigationBadges);
document.addEventListener('DOMContentLoaded',()=>{
const currentGroup=groups.find(([,items])=>items.some(item=>isCurrent(item[0])));
if(currentGroup){
 const [title,items]=currentGroup;
 const tabs=document.createElement('nav');
 tabs.className='parent-records-tabs';
 tabs.setAttribute('aria-label',title);
 tabs.innerHTML=items.map(([href,label])=>`<a href="${href}"${isCurrent(href)?' aria-current="page"':''}>${label}</a>`).join('');
 document.querySelector('main.main-content')?.prepend(tabs);
}
renderNavigationBadges();
// Existing controllers still bind these controls during the gradual migration.
if(!document.getElementById('menuButton')){const button=document.createElement('button');button.id='menuButton';button.hidden=true;button.type='button';header.append(button);}
if(!document.getElementById('sidebarOverlay')){const overlay=document.createElement('div');overlay.id='sidebarOverlay';overlay.hidden=true;document.body.append(overlay);}
if(dashboard)return;
try{const stored=window.RafiqSetup.readChildren(),children=Array.isArray(stored)?stored:[],id=(page==='child-profile.html'?new URLSearchParams(location.search).get('child'):null)||(window.RafiqFamily ? window.RafiqFamily.selected() : localStorage.getItem('rafiqCurrentChildId')),child=children.find(item=>item.id===id)||children[0];
if(child){(window.RafiqFamily ? window.RafiqFamily.select(child.id) : localStorage.setItem('rafiqCurrentChildId',child.id));
const visitPages=['milestones.html','challenges.html','screening.html','health.html','album.html','ai-assistant.html','specialists.html','bookings.html'];
if(visitPages.includes(page))localStorage.setItem('rafiqLastVisit_'+child.id,JSON.stringify({page,visitedAt:new Date().toISOString()}));
document.getElementById('childAvatar').textContent=(child.name||'?').charAt(0).toUpperCase();document.getElementById('childName').textContent=child.name||'Your child';document.getElementById('childAge').textContent=window.RafiqSetup.formatAge(window.RafiqSetup.childContext(child).chronological)||'Review date of birth';}else document.getElementById('childName').textContent='Add your child';
children.forEach(item=>{const button=document.createElement('button');button.type='button';button.className='dropdown-child-button';button.textContent=item.name||'Your child';if(item.id===child?.id){button.classList.add('active');button.setAttribute('aria-current','true');}button.addEventListener('click',()=>{(window.RafiqFamily ? window.RafiqFamily.select(item.id) : localStorage.setItem('rafiqCurrentChildId',item.id));location.assign('child-profile.html?child='+encodeURIComponent(item.id));});document.getElementById('childDropdownList').append(button);});
}catch{/* Keep navigation usable when browser storage is unavailable. */}
});
})();
