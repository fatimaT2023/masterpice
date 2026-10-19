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
  const page = location.pathname.split('/').pop();
  const activePage = {'booking-details.html':'specialist-bookings.html','consultation.html':'specialist-bookings.html','report-form.html':'clients.html'}[page] || page;
  sidebar.querySelectorAll('a.nav-link').forEach(link => {
    const active = link.getAttribute('href') === activePage;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current','page');
  });
  function setOpen(open) {
    sidebar.classList.toggle('open',open);
    document.getElementById('sidebarOverlay')?.classList.toggle('show',open);
    document.getElementById('menuButton')?.setAttribute('aria-expanded',String(open));
    if (innerWidth <= 950) sidebar.inert = !open;
  }
  document.addEventListener('click',event => {
    const target = event.target.closest('#menuButton,#sidebarClose,#sidebarOverlay,#logoutButton');
    if (!target) return;
    event.stopImmediatePropagation();
    if (target.id === 'logoutButton') {sessionStorage.clear();location.href='../piblic-pages/login.html';return;}
    setOpen(target.id === 'menuButton');
    if (target.id !== 'menuButton') document.getElementById('menuButton')?.focus();
    else document.getElementById('sidebarClose').focus();
  },true);
  document.addEventListener('keydown',event => {if(event.key==='Escape'&&sidebar.classList.contains('open')){setOpen(false);document.getElementById('menuButton')?.focus();}});
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
