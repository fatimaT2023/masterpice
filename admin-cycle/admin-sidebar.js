/* Shared admin navigation enhancements; page scripts retain their data logic. */
(() => {
  'use strict';
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  const icons = {
    'admin-dashboard.html':'M3 10 12 3l9 7v11h-6v-7H9v7H3Z',
    'reports-analytics.html':'M4 3v18h17M8 16v-5m5 5V7m5 9v-8',
    'specialist-approvals.html':'M9 3H5v18h14V3h-4M9 2h6v4H9Zm-1 12 3 3 5-6',
    'specialists-management.html':'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8m8 1a4 4 0 0 1 0 8m1 3a4 4 0 0 1 4 4v2',
    'content-management.html':'M4 3h16v18H4ZM8 7h8M8 11h8M8 15h5',
    'ai-governance.html':'M12 2 21 6v6c0 5-9 10-9 10S3 17 3 12V6ZM8 12l3 3 5-6',
    'bookings-management.html':'M4 5h16v16H4Zm4-3v6m8-6v6M4 11h16m-11 4h2',
    'billing-management.html':'M3 5h18v14H3ZM3 10h18m-14 5h4',
    'admin-settings.html':'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8m0-6 2 3 4 1 1 4 3 2-3 2-1 4-4 1-2 3-2-3-4-1-1-4-3-2 3-2 1-4 4-1Z',
    'appearance.html':'M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h4a4 4 0 0 0 4-4c0-3-4-6-9-6ZM7 9h.01M11 6h.01M16 7h.01M6 14h.01'
  };
  const svg = path => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
  const page = location.pathname.split('/').pop();
  sidebar.querySelectorAll('a.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    const icon = link.querySelector('.nav-icon');
    if (icon && icons[href]) {icon.innerHTML = svg(icons[href]);icon.setAttribute('aria-hidden','true');}
    link.classList.toggle('active',href === page);
    if (href === page) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  sidebar.querySelector('nav')?.setAttribute('aria-label','Admin navigation');
  const logout = document.getElementById('logoutButton');
  if (logout) logout.innerHTML = `<span class="nav-icon" aria-hidden="true">${svg('M9 4H3v16h6m5-13 5 5-5 5M7 12h12')}</span><span>Log out</span>`;
  const close = document.getElementById('sidebarClose');
  if (close) {close.innerHTML = svg('m6 6 12 12M6 18 18 6');close.setAttribute('aria-label','Close navigation');}
  const menu = document.getElementById('menuButton');
  menu?.setAttribute('aria-label','Open navigation');
  menu?.setAttribute('aria-controls','sidebar');
  function setOpen(open) {
    sidebar.classList.toggle('open',open);
    document.getElementById('sidebarOverlay')?.classList.toggle('show',open);
    document.body.classList.toggle('admin-navigation-open',open);
    menu?.setAttribute('aria-expanded',String(open));
    sidebar.inert = innerWidth <= 950 && !open;
  }
  document.addEventListener('click',event => {
    const target = event.target.closest('#menuButton,#sidebarClose,#sidebarOverlay,#logoutButton');
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (target.id === 'logoutButton') {
      sessionStorage.clear();
      location.replace('../piblic-pages/login.html');
      return;
    }
    const open = target.id === 'menuButton';
    setOpen(open);
    (open ? close : menu)?.focus();
  },true);
  document.addEventListener('keydown',event => {
    if (event.key === 'Escape' && sidebar.classList.contains('open')) {setOpen(false);menu?.focus();}
    if (event.key === 'Tab' && innerWidth <= 950 && sidebar.classList.contains('open')) {
      const items = [...sidebar.querySelectorAll('a[href],button:not([disabled])')].filter(el => el.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {event.preventDefault();last?.focus();}
      else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first?.focus();}
    }
  });
  window.addEventListener('resize',() => setOpen(innerWidth <= 950 && sidebar.classList.contains('open')));
  setOpen(false);
})();
