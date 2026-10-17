/* One navigation component for every parent page. Load before page scripts. */
(() => {
  'use strict';
  const mount = document.getElementById('parentSidebarMount');
  if (!mount) return;
  const page = location.pathname.split('/').pop();
  const dashboard = page === 'parent-dashboard.html';
  const activePage = { 'booking.html':'specialists.html', 'payment.html':'subscription.html', 'specialist-report.html':'bookings.html' }[page] || page;
  const icon = path => `<span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${path}"/></svg></span>`;
  const links = [
    ['OVERVIEW', [
      ['parent-dashboard.html','Dashboard','M3 10 12 3l9 7v11h-6v-7H9v7H3Z'],
      ['ai-assistant.html','Rafiq AI','m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z'],
      ['milestones.html','Milestones','M5 3v18m0-17h13l-3 4 3 4H5'],
      ['screening.html','Screening','M9 3H5v18h14V3h-4M9 2h6v4H9Zm-1 12 3 3 5-6']
    ]],
    ['CARE & SUPPORT', [
      ['challenges.html','Challenges','M12 21 3 12a5 5 0 0 1 9-7 5 5 0 0 1 9 7Z'],
      ['health.html','Health','M12 4v16M4 12h16'],
      ['album.html','Child Album','M3 4h18v16H3Zm0 12 6-6 5 5 3-3 4 4M16 7h.01'],
      ['specialists.html','Find Specialist','M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8m8 1a4 4 0 0 1 0 8m1 3a4 4 0 0 1 4 4v2'],
      ['bookings.html','My Bookings','M4 5h16v16H4Zm4-3v6m8-6v6M4 11h16']
    ]],
    ['ACCOUNT', [
      ['subscription.html','Subscription','M3 5h18v14H3ZM3 10h18m-14 5h4'],
      ['onboarding.html','Add Child','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 21v-2a8 8 0 0 1 12-7m3 3v6m-3-3h6']
    ]]
  ];
  const link = ([href,label,path]) => `<a class="nav-link${activePage === href ? ' active' : ''}" href="${href}"${activePage === href ? ' aria-current="page"' : ''}>${icon(path)}<span>${label}</span></a>`;
  const childId = dashboard ? 'sidebarChild' : 'child';
  mount.outerHTML = `<aside class="sidebar parent-sidebar" id="sidebar" aria-label="Parent workspace">
    <div class="sidebar-top"><a class="brand" href="../rafiq-home-transfer-20261013-211454/index.html"><span class="brand-mark">R</span><span>RAFIQ</span></a><button type="button" class="sidebar-close" id="sidebarClose" aria-label="Close navigation">${icon('m6 6 12 12M6 18 18 6')}</button></div>
    <div class="child-switcher"><span class="small-label">CURRENT CHILD</span><button type="button" class="child-switcher-button" id="childSwitcherButton" aria-expanded="false" aria-controls="childDropdown"><span class="child-avatar" id="${childId}Avatar">?</span><span class="child-switcher-info"><strong id="${childId}Name">Child</strong><span id="${childId}Age">Select a child</span></span>${icon('m8 10 4 4 4-4')}</button><div class="child-dropdown" id="childDropdown" hidden><div id="childDropdownList"></div><a class="add-child-link" href="onboarding.html">+ Add another child</a></div></div>
    <nav class="sidebar-nav" aria-label="Parent navigation">${links.map(([title,items]) => `<span class="nav-section-title">${title}</span>${items.map(link).join('')}`).join('')}</nav>
    <div class="sidebar-bottom">${link(['settings.html','Settings','M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8m0-6 2 3 4 1 1 4 3 2-3 2-1 4-4 1-2 3-2-3-4-1-1-4-3-2 3-2 1-4 4-1Z'])}<button type="button" class="logout-button" id="logoutButton">${icon('M9 4H3v16h6m5-13 5 5-5 5M7 12h12')}<span>Log out</span></button></div>
  </aside>`;
  const sidebar = document.getElementById('sidebar');
  document.body.classList.add('has-parent-sidebar');
  function setOpen(open) {
    sidebar.classList.toggle('open',open);
    document.getElementById('sidebarOverlay')?.classList.toggle('show',open);
    document.body.classList.toggle('parent-navigation-open',open);
    document.getElementById('menuButton')?.setAttribute('aria-expanded',String(open));
    sidebar.inert = innerWidالth <= 950 && !open;
  }
  const dropdown = document.getElementById('childDropdown');
  const switcher = document.getElementById('childSwitcherButton');
  document.addEventListener('click',event => {
    const target = event.target.closest('#menuButton,#sidebarClose,#sidebarOverlay,#logoutButton');
    if (target) {
      event.preventDefault(); event.stopImmediatePropagation();
      if (target.id === 'logoutButton') { sessionStorage.clear(); location.replace('../piblic-pages/login.html'); return; }
      const open = target.id === 'menuButton'; setOpen(open);
      (open ? document.getElementById('sidebarClose') : document.getElementById('menuButton'))?.focus();
    }
    if (!dashboard) {
      if (event.target.closest('#childSwitcherButton')) { dropdown.hidden = !dropdown.hidden; switcher.setAttribute('aria-expanded',String(!dropdown.hidden)); }
      else if (!event.target.closest('.child-switcher')) { dropdown.hidden = true; switcher.setAttribute('aria-expanded','false'); }
    }
  }, true);
  document.addEventListener('keydown',event => {
    if (event.key === 'Escape') { dropdown.hidden = true; switcher.setAttribute('aria-expanded','false'); if (sidebar.classList.contains('open')) { setOpen(false); document.getElementById('menuButton')?.focus(); } }
    if (event.key === 'Tab' && innerWidth <= 950 && sidebar.classList.contains('open')) {
      const items = [...sidebar.querySelectorAll('a[href],button:not([disabled])')].filter(el => el.getClientRects().length);
      const first = items[0], last = items[items.length-1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  });
  window.addEventListener('resize',() => setOpen(innerWidth <= 950 && sidebar.classList.contains('open')));
  document.addEventListener('DOMContentLoaded',() => {
    if (!document.getElementById('sidebarOverlay')) {
      const overlay = document.createElement('div'); overlay.className = 'sidebar-overlay'; overlay.id = 'sidebarOverlay'; document.body.append(overlay);
    }
    if (!document.getElementById('menuButton')) {
      const header = document.querySelector('.topbar,.dashboard-topbar');
      if (header) { const button = document.createElement('button'); button.type = 'button'; button.id = 'menuButton'; button.className = 'menu-button'; button.innerHTML = icon('M4 6h16M4 12h16M4 18h16'); header.prepend(button); }
    }
    const menu = document.getElementById('menuButton');
    if (menu) { menu.innerHTML = icon('M4 6h16M4 12h16M4 18h16'); menu.setAttribute('aria-label','Open navigation'); menu.setAttribute('aria-controls','sidebar'); }
    const albumLabel = sidebar.querySelector('a[href="album.html"] > span:last-child');
    const childNameNode = document.getElementById(`${childId}Name`);
    const updateAlbumName = () => { if (albumLabel && childNameNode) { const name = childNameNode.textContent.trim(); albumLabel.textContent = name && name !== 'Child' ? name + "'s Album" : 'Child Album'; albumLabel.dir = 'auto'; } };
    if (childNameNode) new MutationObserver(updateAlbumName).observe(childNameNode,{childList:true,characterData:true,subtree:true});
    updateAlbumName();
    if (!dashboard) {
      try {
        const stored = JSON.parse(localStorage.getItem('rafiqChildren') || '[]');
        const children = Array.isArray(stored) ? stored : [];
        const id = localStorage.getItem('rafiqCurrentChildId');
        const child = children.find(c => c.id === id) || children[0];
        if (child) {
          document.getElementById('childAvatar').textContent = (child.name || '?').charAt(0).toUpperCase();
          document.getElementById('childName').textContent = child.name || 'Child';
          document.getElementById('childAge').textContent = 'Child profile';
        }
        children.forEach(c => {
          const button = document.createElement('button'); button.type = 'button'; button.className = 'dropdown-child-button'; button.textContent = c.name || 'Child';
          if (c.id === child?.id) { button.classList.add('active'); button.setAttribute('aria-current','true'); }
          button.onclick = () => { localStorage.setItem('rafiqCurrentChildId',c.id); location.reload(); };
          document.getElementById('childDropdownList').append(button);
        });
      } catch { /* Preserve usable navigation if local demo profiles are unavailable. */ }
    } else {
      new MutationObserver(() => switcher.setAttribute('aria-expanded',String(!dropdown.hidden))).observe(dropdown,{attributes:true,attributeFilter:['hidden']});
    }
    setOpen(false);
  });
})();
