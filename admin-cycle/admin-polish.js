/* Admin area polish (every admin page):
   - menu of five places instead of eleven links: Dashboard, People, Operations, Reports,
     Platform — each group opens with tabs for its pages (same pattern as parent/specialist);
   - "Your next step" card on the dashboard (approval waiting, new support request, transfers);
   - loads the Arabic fixes (admin-lang.js) and the shared next-step toast. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, a) => (ar() ? a : en);
  const page = location.pathname.split('/').pop() || 'admin-dashboard.html';
  const here = document.currentScript?.src || location.href;
  for (const [tag, file] of [['script', 'admin-lang.js'], ['script', '../pearent-cycel/next-step-toast.js'], ['link', '../pearent-cycel/next-step-toast.css'], ['link', 'admin-polish.css']]) {
    if (document.querySelector((tag === 'script' ? 'script[src*="' : 'link[href*="') + file.split('/').pop() + '"]')) continue;
    const e = document.createElement(tag); if (tag === 'script') e.src = new URL(file, here).href; else { e.rel = 'stylesheet'; e.href = new URL(file, here).href; } document.head.append(e);
  }
  const read = k => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; } };
  const GROUPS = [
    { key: 'people', en: 'People', ar: 'الناس', home: 'users-management.html', pages: [['users-management.html', 'Users', 'المستخدمون'], ['specialists-management.html', 'Specialists', 'الأخصائيون'], ['specialist-approvals.html', 'Approvals', 'اعتماد الأخصائيين']] },
    { key: 'ops', en: 'Operations', ar: 'العمليات', home: 'bookings-management.html', pages: [['bookings-management.html', 'Bookings', 'الحجوزات'], ['billing-management.html', 'Finance', 'المالية'], ['support-requests.html', 'Support', 'طلبات الدعم']] },
    { key: 'platform', en: 'Platform', ar: 'المنصة', home: 'content-management.html', pages: [['content-management.html', 'Content', 'المحتوى'], ['ai-governance.html', 'Assistant rules', 'حوكمة المساعد'], ['appearance.html', 'Appearance', 'المظهر'], ['admin-settings.html', 'Settings', 'الإعدادات']] }
  ];
  const counts = () => ({ people: read('rafiqSpecialists').filter(s => s && s.status === 'pending').length, ops: read('rafiqSupportTickets').filter(t => t && t.status === 'new').length });

  function menu() {
    const nav = document.querySelector('.sidebar-nav'); if (!nav) return;
    document.querySelectorAll('#sidebar .nav-label, .sidebar .nav-label').forEach(l => { if (!l.closest('a')) l.classList.add('ap-hidden'); });
    const all = [...document.querySelectorAll('#sidebar a.nav-link, .sidebar a.nav-link')];
    const find = href => all.find(a => a.getAttribute('href') === href);
    const c = counts();
    GROUPS.forEach(g => {
      const lead = find(g.home); if (!lead) return;
      g.pages.forEach(([href]) => { const a = find(href); if (a && a !== lead) a.classList.add('ap-hidden'); });
      const label = [...lead.querySelectorAll('span')].find(s => !s.classList.contains('nav-icon') && !s.classList.contains('ap-badge'));
      if (label) { label.dataset.noTranslate = ''; label.textContent = x(g.en, g.ar); }
      lead.title = x(g.en, g.ar); lead.setAttribute('aria-label', x(g.en, g.ar));
      const active = g.pages.some(([href]) => href === page);
      all.forEach(a => { if (g.pages.some(([href]) => href === a.getAttribute('href')) && a !== lead) { a.classList.remove('active'); a.removeAttribute('aria-current'); } });
      lead.classList.toggle('active', active); if (active) lead.setAttribute('aria-current', 'page'); else lead.removeAttribute('aria-current');
      let badge = lead.querySelector('.ap-badge'); const n = c[g.key] || 0;
      if (n) { if (!badge) { badge = document.createElement('span'); badge.className = 'ap-badge'; lead.append(badge); } badge.textContent = n; } else badge?.remove();
      if (lead.parentElement === nav) nav.append(lead);
    });
    const reports = find('reports-analytics.html'); const people = find('users-management.html');
    const dash = find('admin-dashboard.html');
    // Order: Dashboard, People, Operations, Reports, Platform
    [dash, people, find('bookings-management.html'), reports, find('content-management.html')].forEach(a => { if (a && a.parentElement !== nav) nav.append(a); else if (a) nav.append(a); });
  }

  function tabs() {
    const g = GROUPS.find(gr => gr.pages.some(([href]) => href === page)); if (!g) return;
    const main = document.querySelector('main.main-content, main'); if (!main) return;
    let nav = document.getElementById('adminTabs');
    if (!nav) { nav = document.createElement('nav'); nav.id = 'adminTabs'; nav.className = 'ap-tabs'; nav.dataset.noTranslate = ''; const top = main.querySelector(':scope > header.topbar'); top ? top.after(nav) : main.prepend(nav); }
    nav.setAttribute('aria-label', x(g.en, g.ar));
    nav.replaceChildren(...g.pages.map(([href, en, a]) => { const l = document.createElement('a'); l.href = href; l.textContent = x(en, a); if (href === page) l.setAttribute('aria-current', 'page'); return l; }));
  }

  function nextStep() {
    if (page !== 'admin-dashboard.html') return;
    const top = document.querySelector('main header.topbar'); if (!top) return;
    const pending = read('rafiqSpecialists').filter(s => s && s.status === 'pending');
    const fresh = read('rafiqSupportTickets').filter(t => t && t.status === 'new');
    const due = read('rafiqBookings').filter(b => b && b.status === 'completed' && b.sessionPayment?.status === 'paid' && b.sessionPayment?.payoutStatus !== 'transferred');
    let s;
    if (pending.length) s = { k: x('Approval waiting', 'اعتماد بانتظارك'), t: x(pending[0].fullName.split('—')[0].trim() + ' applied to join', pending[0].fullName.split('—')[0].trim() + ' تنتظر الاعتماد'), p: x('Check the licence and qualifications. Once approved, families can find and book them.', 'تحقّق من الرخصة والمؤهلات. بعد الاعتماد تستطيع العائلات إيجادها والحجز معها.'), b: x('Review the application', 'راجع الطلب'), go: () => { try { localStorage.setItem('rafiqAdminSelectedSpecialistId', pending[0].id); } catch {} location.href = 'specialist-approvals.html'; } };
    else if (fresh.length) s = { k: x('Support request', 'طلب دعم جديد'), t: x(fresh[0].name + ': ' + fresh[0].subject, fresh[0].name + ': ' + fresh[0].subject), p: x('A quick reply keeps families on track.', 'الرد السريع يُبقي العائلات على المسار.'), b: x('Reply', 'رُد'), go: () => { location.href = 'support-requests.html'; } };
    else if (due.length) s = { k: x('Transfers', 'تحويلات'), t: x(due.length + ' completed sessions awaiting transfer', due.length + ' جلسات مكتملة بانتظار التحويل'), p: x('Record the transfer to each specialist.', 'سجّل التحويل لكل أخصائي.'), b: x('Open finance', 'افتح المالية'), go: () => { location.href = 'billing-management.html'; } };
    else s = { k: x('All clear', 'كل شيء على ما يرام'), t: x('No actions waiting', 'لا إجراءات معلّقة'), p: x('Open the reports to see how the platform is doing.', 'افتح التقارير لمتابعة أداء المنصة.'), b: x('Reports', 'التقارير'), go: () => { location.href = 'reports-analytics.html'; } };
    let card = document.getElementById('adminNext');
    if (!card) { card = document.createElement('section'); card.id = 'adminNext'; card.className = 'ap-next'; card.dataset.noTranslate = ''; top.after(card); }
    card.replaceChildren();
    const k = document.createElement('p'); k.className = 'ap-kicker'; k.textContent = x('Your next step', 'خطوتك التالية') + ' · ' + s.k;
    const h = document.createElement('h2'); h.textContent = s.t; const p = document.createElement('p'); p.className = 'ap-text'; p.textContent = s.p;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'ap-btn'; b.textContent = s.b + x(' →', ' ←'); b.addEventListener('click', s.go);
    card.append(k, h, p, b);
  }

  let busy = false;
  const run = () => { if (busy) return; busy = true; try { menu(); tabs(); nextStep(); } catch {} finally { setTimeout(() => { busy = false; }, 0); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(run, 30)); else setTimeout(run, 30);
  addEventListener('load', () => { setTimeout(run, 120); setTimeout(run, 800); });
  new MutationObserver(() => setTimeout(run, 150)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  addEventListener('storage', () => setTimeout(run, 100));
  // Refresh counts after the admin acts on this page
  addEventListener('click', () => setTimeout(run, 600), true);
})();
