/* Shared specialist navigation, based on the Earnings sidebar. */
(() => {
  'use strict';
  const mount = document.getElementById('specialistSidebarMount');
  if (!mount) return;
  mount.outerHTML = "<aside\r\n    class=\"sidebar\"\r\n    id=\"sidebar\"\r\n  >\r\n\r\n    <div class=\"sidebar-top\">\r\n\r\n      <a\r\n        href=\"../rafiq-home-transfer-20261013-211454/index.html\"\r\n        class=\"brand\"\r\n      >\r\n        <div class=\"brand-mark\">\r\n          R\r\n        </div>\r\n\r\n        <span>\r\n          RAFIQ\r\n        </span>\r\n      </a>\r\n\r\n\r\n      <button\r\n        type=\"button\"\r\n        class=\"sidebar-close\"\r\n        id=\"sidebarClose\" aria-label=\"Close navigation\"\r\n      >×</button>\r\n\r\n    </div>\r\n\r\n\r\n    <div class=\"specialist-mini-card\">\r\n\r\n      <div\r\n        class=\"specialist-avatar\"\r\n        id=\"sidebarAvatar\"\r\n      >\r\n        DR\r\n      </div>\r\n\r\n\r\n      <div class=\"specialist-info\">\r\n\r\n        <span>\r\n          SPECIALIST\r\n        </span>\r\n\r\n        <strong id=\"sidebarName\">\r\n          Specialist\r\n        </strong>\r\n\r\n        <small id=\"sidebarSpecialty\">\r\n          Specialty\r\n        </small>\r\n\r\n      </div>\r\n\r\n    </div>\r\n\r\n\r\n    <div\r\n      class=\"sidebar-status\"\r\n      id=\"sidebarStatus\"\r\n    >\r\n      <span class=\"status-dot\"></span>\r\n\r\n      <span id=\"sidebarStatusText\">\r\n        Approved\r\n      </span>\r\n    </div>\r\n\r\n\r\n    <nav class=\"sidebar-nav\">\r\n\r\n      <span class=\"nav-section-title\">\r\n        OVERVIEW\r\n      </span>\r\n\r\n\r\n      <a\r\n        href=\"specialist-dashboard.html\"\r\n        class=\"nav-link\"\r\n      >\r\n        <span class=\"nav-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M3 10 12 3l9 7v11h-6v-7H9v7H3Z\"/></svg></span>\r\n        Dashboard\r\n      </a>\r\n\r\n\r\n      <a\r\n        href=\"schedule.html\"\r\n        class=\"nav-link\"\r\n      >\r\n        <span class=\"nav-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M4 5h16v16H4Zm4-3v6m8-6v6M4 11h16\"/></svg></span>\r\n        Schedule\r\n      </a>\r\n\r\n\r\n      <span class=\"nav-section-title second\">\r\n        PRACTICE\r\n      </span>\r\n\r\n\r\n      <a\r\n        href=\"specialist-bookings.html\"\r\n        class=\"nav-link\"\r\n      >\r\n        <span class=\"nav-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M4 5h16v16H4Zm4-3v6m8-6v6m-8 9 3 3 5-5\"/></svg></span>\r\n        Bookings\r\n      </a>\r\n\r\n\r\n      <a\r\n        href=\"clients.html\"\r\n        class=\"nav-link\"\r\n      >\r\n        <span class=\"nav-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8m8 1a4 4 0 0 1 0 8m1 3a4 4 0 0 1 4 4v2\"/></svg></span>\r\n        Clients / Cases\r\n      </a>\r\n\r\n\r\n      <a\r\n        href=\"availability.html\"\r\n        class=\"nav-link\"\r\n      >\r\n        <span class=\"nav-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m0 4v5l3 2\"/></svg></span>\r\n        Availability\r\n      </a>\r\n\r\n\r\n      <span class=\"nav-section-title second\">\r\n        BUSINESS\r\n      </span>\r\n\r\n\r\n      <a\r\n        href=\"earnings.html\"\r\n        class=\"nav-link\"\r\n      >\r\n        <span class=\"nav-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M12 2v20m5-16H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H6\"/></svg></span>\r\n        Earnings\r\n      </a>\r\n\r\n    </nav>\r\n\r\n\r\n    <div class=\"sidebar-bottom\">\r\n\r\n      <a\r\n        href=\"profile.html\"\r\n        class=\"nav-link\"\r\n      >\r\n        <span class=\"nav-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 21v-2a8 8 0 0 1 16 0v2\"/></svg></span>\r\n        Profile\r\n      </a>\r\n\r\n\r\n      <a\r\n        href=\"specialist-settings.html\"\r\n        class=\"nav-link\"\r\n      >\r\n        <span class=\"nav-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\"><path d=\"M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8m0-6 2 3 4 1 1 4 3 2-3 2-1 4-4 1-2 3-2-3-4-1-1-4-3-2 3-2 1-4 4-1Z\"/></svg></span>\r\n        Settings\r\n      </a>\r\n\r\n\r\n      <button\r\n        type=\"button\"\r\n        class=\"logout-button\"\r\n        id=\"logoutButton\"\r\n      ><span aria-hidden=\"true\">↪</span>\r\n        Log Out\r\n      </button>\r\n\r\n    </div>\r\n\r\n  </aside>";
  const helpNav = document.querySelector('#sidebar nav');
  if (helpNav) {
    const helpLink = document.createElement('a'); helpLink.className = 'nav-link';
    helpLink.href = '../piblic-pages/help-center.html?from=specialist';
    helpLink.innerHTML = '<span class="nav-icon" aria-hidden="true">?</span>Help Center';helpNav.append(helpLink);
  }
  const sidebar = document.getElementById('sidebar');
  document.body.dataset.specialistLanguageInSettings='true';
  const oldProfile=sidebar.querySelector('.sidebar-bottom a[href="profile.html"]');oldProfile?.remove();
  const mini=sidebar.querySelector('.specialist-mini-card');
  const profileCard=document.createElement('a');profileCard.className=mini.className;profileCard.href='profile.html';profileCard.title='View your profile';profileCard.setAttribute('aria-label','View your profile');
  while(mini.firstChild)profileCard.append(mini.firstChild);mini.replaceWith(profileCard);
  const messagesLink=document.createElement('a');messagesLink.href='messages.html';messagesLink.className='nav-link';
  messagesLink.innerHTML='<span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 4h16v12H8l-4 4Z"/></svg></span><span>Messages</span>';
  const bookingsLink=sidebar.querySelector('a[href="specialist-bookings.html"]');if(bookingsLink)bookingsLink.before(messagesLink);
  const careLink=document.createElement('a');careLink.href='follow-up.html';careLink.className='nav-link';careLink.innerHTML='<span class="nav-icon" aria-hidden="true">♡</span><span>Ongoing follow-up</span>';if(bookingsLink)bookingsLink.after(careLink);
  const casesLink=sidebar.querySelector('a[href="clients.html"]');if(casesLink){const label=casesLink.lastChild;if(label&&label.nodeType===3)label.textContent='Consultation history';}
  // Desktop rail and grouped workspace navigation.
  sidebar.setAttribute('aria-label','Specialist navigation');
  sidebar.querySelectorAll('.nav-link').forEach(link=>{
    const label=link.textContent.trim().replace(/\s+/g,' ');
    link.setAttribute('aria-label',label);link.title=label;
    [...link.childNodes].forEach(node=>{if(node.nodeType===3&&node.textContent.trim()){const span=document.createElement('span');span.className='nav-label';span.textContent=node.textContent.trim();node.replaceWith(span);}});
    link.querySelectorAll(':scope > span:not(.nav-icon)').forEach(span=>span.classList.add('nav-label'));
  });
  const logout=sidebar.querySelector('#logoutButton');
  [...logout.childNodes].forEach(node=>{if(node.nodeType===3&&node.textContent.trim()){const span=document.createElement('span');span.className='nav-label';span.textContent=node.textContent.trim();node.replaceWith(span);}});
  logout.innerHTML='<span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M14 8l4 4-4 4M8 12h13"/></svg></span><span class="nav-label">Log out</span>';
  logout.title='Log out';logout.setAttribute('aria-label','Log out');
  const toggle=document.createElement('button');toggle.type='button';toggle.className='sidebar-collapse-toggle';toggle.setAttribute('aria-controls','sidebar');
  toggle.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>';
  sidebar.querySelector('.sidebar-top').append(toggle);
  function collapse(value){document.documentElement.classList.toggle('specialist-sidebar-collapsed',value);toggle.setAttribute('aria-expanded',String(!value));toggle.setAttribute('aria-label',value?'Expand navigation':'Collapse navigation');toggle.title=value?'Expand navigation':'Collapse navigation';}
  let savedCollapsed=false;
  try{savedCollapsed=localStorage.getItem('rafiqSpecialistSidebarCollapsed')==='true';}catch{}
  collapse(savedCollapsed);
  // Hover previews the full navigation without changing the saved rail preference.
  const hoverRail=window.matchMedia('(min-width:951px) and (hover:hover) and (pointer:fine)');
  let pointerInside=false;
  function preview(open){
    const expanded=open&&savedCollapsed&&hoverRail.matches;
    document.documentElement.classList.toggle('specialist-sidebar-preview',expanded);
    collapse(savedCollapsed&&!expanded);
  }
  sidebar.addEventListener('pointerenter',event=>{
    if(event.pointerType==='touch')return;
    pointerInside=true;preview(true);
  });
  sidebar.addEventListener('pointerleave',()=>{
    pointerInside=false;
    if(document.activeElement===toggle||!sidebar.contains(document.activeElement))preview(false);
  });
  sidebar.addEventListener('focusin',()=>preview(true));
  sidebar.addEventListener('focusout',event=>{
    if(!sidebar.contains(event.relatedTarget)&&!pointerInside)preview(false);
  });
  hoverRail.addEventListener('change',()=>{pointerInside=false;preview(false);});
  toggle.addEventListener('click',()=>{
    savedCollapsed=!savedCollapsed;
    document.documentElement.classList.remove('specialist-sidebar-preview');
    collapse(savedCollapsed);
    try{localStorage.setItem('rafiqSpecialistSidebarCollapsed',String(savedCollapsed));}catch{}
  });
  const page = location.pathname.split('/').pop();
  const activePage = {'booking-details.html':'specialist-bookings.html','consultation.html':'specialist-bookings.html','report-form.html':'specialist-bookings.html'}[page] || page;
  sidebar.querySelectorAll('a.nav-link').forEach(link => {
    const active = link.getAttribute('href') === activePage;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current','page');
  });
  if(page==='profile.html')profileCard.setAttribute('aria-current','page');
  function setOpen(open) {
    sidebar.classList.toggle('open',open);
    document.getElementById('sidebarOverlay')?.classList.toggle('show',open);
    document.getElementById('menuButton')?.setAttribute('aria-expanded',String(open));
    if (innerWidth <= 950) sidebar.inert = !open;
  }
  const logoutDialog=document.createElement('dialog');
  logoutDialog.className='specialist-logout-dialog';
  logoutDialog.setAttribute('aria-labelledby','specialistLogoutTitle');
  logoutDialog.setAttribute('aria-describedby','specialistLogoutDescription');
  logoutDialog.innerHTML=`<form method="dialog">
    <span class="specialist-logout-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4m5-12 4 4-4 4M8 12h13"/></svg></span>
    <h2 id="specialistLogoutTitle">Are you sure you want to log out?</h2>
    <p id="specialistLogoutDescription">You can sign in again whenever you need.</p>
    <div class="specialist-logout-actions">
      <button type="submit" value="cancel" autofocus>Cancel</button>
      <button type="submit" value="logout" class="specialist-logout-confirm">Log out</button>
    </div>
  </form>`;
  document.body.append(logoutDialog);
  function showLogoutConfirmation(){
    if(logoutDialog.open)return;
    logoutDialog.returnValue='';
    document.documentElement.classList.add('specialist-logout-open');
    logoutDialog.showModal();
  }
  logoutDialog.addEventListener('close',()=>{
    document.documentElement.classList.remove('specialist-logout-open');
    if(logoutDialog.returnValue==='logout'){
      sessionStorage.clear();location.href='../piblic-pages/login.html';
    }else logout.focus();
  });
  logoutDialog.addEventListener('click',event=>{
    if(event.target!==logoutDialog)return;
    const rect=logoutDialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)logoutDialog.close('cancel');
  });
  document.addEventListener('click',event => {
    const target = event.target.closest('#menuButton,#sidebarClose,#sidebarOverlay,#logoutButton');
    if (!target) return;
    event.stopImmediatePropagation();
    if (target.id === 'logoutButton') {event.preventDefault();showLogoutConfirmation();return;}
    setOpen(target.id === 'menuButton');
    if (target.id !== 'menuButton') document.getElementById('menuButton')?.focus();
    else document.getElementById('sidebarClose').focus();
  },true);
  document.addEventListener('keydown',event => {if(logoutDialog.open)return;if(event.key==='Escape'&&sidebar.classList.contains('open')){setOpen(false);document.getElementById('menuButton')?.focus();}});
  window.addEventListener('resize',() => {if(innerWidth>950){setOpen(false);sidebar.inert=false;}else sidebar.inert=!sidebar.classList.contains('open');});
  document.addEventListener('DOMContentLoaded',() => {
    const menu=document.getElementById('menuButton');
    menu?.setAttribute('aria-controls','sidebar');menu?.setAttribute('aria-expanded','false');
    if(page==='specialist-onboarding.html') {
      try {const profile=JSON.parse(localStorage.getItem('rafiqSpecialistProfile')||'null');if(profile){document.getElementById('sidebarName').textContent=profile.fullName||'Specialist';document.getElementById('sidebarSpecialty').textContent=profile.specialty||'Specialty';}}
      catch { /* Keep the default labels when no saved profile is available. */ }
      document.getElementById('sidebarStatusText').textContent='Profile setup';
    }
    setOpen(false);
  });
})();
