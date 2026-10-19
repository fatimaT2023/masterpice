/* Shared parent navigation; legacy IDs keep existing page controllers compatible. */
(() => {
'use strict';
const mount=document.getElementById('parentSidebarMount'); if(!mount)return;
const page=location.pathname.split('/').pop(), dashboard=page==='parent-dashboard.html', prefix=dashboard?'sidebarChild':'child';
const groups=[['Growth',[
['milestones.html','Growth & milestones','Understand your child’s stage'],['challenges.html','Activities together','Find something to try together'],['screening.html','Development questions','Record observations about development']]],
['Records',[
['health.html','Health & vaccinations','Keep health notes and measurements'],['album.html','Memories','Save photos and special moments'],['bookings.html','Visits & reports','Find appointments and specialist reports']]],
['Specialists',[
['specialists.html','Find a specialist','Explore specialists and book a visit'],['bookings.html','My appointments','Manage visits and read reports']]]];
const active=({'specialist-report.html':'bookings.html','booking.html':'specialists.html'})[page]||page;
const link=([href,title,description])=>`<a href="${href}"${page===href?' aria-current="page"':''}><strong>${title}</strong><span>${description}</span></a>`;
mount.outerHTML=`<header class="parent-navigation" id="sidebar"><div class="parent-navigation-top">
<a class="parent-brand" href="parent-dashboard.html" aria-label="Rafiq today"><span>R</span> RAFIQ</a>
<div class="child-switcher"><div class="parent-child-control"><a href="child-profile.html" class="parent-child-button" id="childProfileLink" aria-label="View child profile"><span class="parent-child-avatar" id="${prefix}Avatar">?</span><span class="parent-child-copy"><strong id="${prefix}Name">Your child</strong><span id="${prefix}Age">Choose a child</span></span></a><button type="button" id="childSwitcherButton" class="parent-child-toggle" aria-expanded="false" aria-controls="childDropdown" aria-label="Switch child"><svg class="parent-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div id="childDropdown" class="parent-child-dropdown" hidden><div id="childDropdownList"></div><a href="onboarding.html">+ Add another child</a></div></div>
<div class="parent-header-actions"><a class="parent-ask" href="ai-assistant.html"${page==='ai-assistant.html'?' aria-current="page"':''}>Ask Rafiq</a><details class="parent-account"><summary>My account <svg class="parent-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="parent-nav-panel">${link(['settings.html','Settings','Account, language & privacy'])}${link(['subscription.html','My plan & payments','View your subscription options'])}${link(['onboarding.html','Add a child','Create another child profile'])}${link(['../piblic-pages/help-center.html?from=parent','Help Center','Guides & registration support'])}<button id="logoutButton" type="button">Log out</button></div></details></div>
<nav class="parent-primary-nav" aria-label="Parent navigation"><a class="parent-today${dashboard?' is-active':''}" href="parent-dashboard.html"${dashboard?' aria-current="page"':''}>Today</a>${groups.map(([title,items],index)=>`<details class="parent-nav-group${items.some(item=>item[0]===active)&&!(index===1&&active==='bookings.html')?' is-active':''}"><summary>${title}<svg class="parent-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="parent-nav-panel">${items.map(link).join('')}</div></details>`).join('')}</nav></div><button id="sidebarClose" type="button" hidden tabindex="-1">Close</button></header>`;
document.body.classList.add('has-parent-navigation');
const header=document.getElementById('sidebar');document.body.prepend(header);
const dropdown=document.getElementById('childDropdown'),switcher=document.getElementById('childSwitcherButton'),menus=[...header.querySelectorAll('details')];
const closeMenus=except=>menus.forEach(item=>{if(item!==except)item.open=false;});
menus.forEach(item=>item.addEventListener('toggle',()=>{if(item.open){closeMenus(item);dropdown.hidden=true;}}));
document.addEventListener('click',event=>{
if(!header.contains(event.target))closeMenus();
if(!dashboard){if(event.target.closest('#childSwitcherButton')){dropdown.hidden=!dropdown.hidden;if(!dropdown.hidden)closeMenus();}else if(!event.target.closest('.child-switcher'))dropdown.hidden=true;}
if(event.target.closest('#logoutButton')){event.preventDefault();event.stopImmediatePropagation();sessionStorage.clear();location.replace('../piblic-pages/login.html');}
},true);
new MutationObserver(()=>{switcher.setAttribute('aria-expanded',String(!dropdown.hidden));if(!dropdown.hidden)closeMenus();}).observe(dropdown,{attributes:true,attributeFilter:['hidden']});
document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const open=menus.find(item=>item.open);if(open){open.open=false;open.querySelector('summary').focus();}if(!dropdown.hidden){dropdown.hidden=true;switcher.focus();}});
document.addEventListener('DOMContentLoaded',()=>{
// Existing controllers still bind these controls during the gradual migration.
if(!document.getElementById('menuButton')){const button=document.createElement('button');button.id='menuButton';button.hidden=true;button.type='button';header.append(button);}
if(!document.getElementById('sidebarOverlay')){const overlay=document.createElement('div');overlay.id='sidebarOverlay';overlay.hidden=true;document.body.append(overlay);}
if(dashboard)return;
try{const stored=JSON.parse(localStorage.getItem('rafiqChildren')||'[]'),children=Array.isArray(stored)?stored:[],id=(page==='child-profile.html'?new URLSearchParams(location.search).get('child'):null)||localStorage.getItem('rafiqCurrentChildId'),child=children.find(item=>item.id===id)||children[0];
if(child){localStorage.setItem('rafiqCurrentChildId',child.id);
const visitPages=['milestones.html','challenges.html','screening.html','health.html','album.html','ai-assistant.html','specialists.html','bookings.html'];
if(visitPages.includes(page))localStorage.setItem('rafiqLastVisit_'+child.id,JSON.stringify({page,visitedAt:new Date().toISOString()}));
document.getElementById('childAvatar').textContent=(child.name||'?').charAt(0).toUpperCase();document.getElementById('childName').textContent=child.name||'Your child';document.getElementById('childAge').textContent=window.RafiqSetup.formatAge(window.RafiqSetup.childContext(child).chronological)||'Review date of birth';}else document.getElementById('childName').textContent='Add your child';
children.forEach(item=>{const button=document.createElement('button');button.type='button';button.className='dropdown-child-button';button.textContent=item.name||'Your child';if(item.id===child?.id){button.classList.add('active');button.setAttribute('aria-current','true');}button.addEventListener('click',()=>{localStorage.setItem('rafiqCurrentChildId',item.id);location.assign('child-profile.html?child='+encodeURIComponent(item.id));});document.getElementById('childDropdownList').append(button);});
}catch{/* Keep navigation usable when browser storage is unavailable. */}
});
})();
