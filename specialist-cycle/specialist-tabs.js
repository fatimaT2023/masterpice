/* Specialist workspace polish, loaded by the sidebar on every specialist page:
   - tabs inside the two grouped places (Bookings: bookings / schedule / history;
     My practice: public profile / availability / earnings), matching the parent side;
   - the last English words in the Arabic view (week days, "1 case", session type) and
     internal booking codes hidden from view;
   - the shared next-step toast and header style. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, a) => (ar() ? a : en);
  const page = location.pathname.split('/').pop() || '';
  const here = document.currentScript?.src || location.href;
  // Shared toast + header look from the parent cycle
  for (const [tag, file] of [['script', '../pearent-cycel/next-step-toast.js'], ['link', '../pearent-cycel/next-step-toast.css'], ['link', 'specialist-unified.css']]) {
    if (document.querySelector((tag === 'script' ? 'script[src*="' : 'link[href*="') + file.split('/').pop() + '"]')) continue;
    const e = document.createElement(tag); if (tag === 'script') e.src = new URL(file, here).href; else { e.rel = 'stylesheet'; e.href = new URL(file, here).href; } document.head.append(e);
  }
  const GROUPS = [
    [['specialist-bookings.html', 'Bookings', 'الحجوزات'], ['schedule.html', 'Schedule', 'الجدول'], ['clients.html', 'Consultation history', 'سجل الاستشارات']],
    [['profile.html', 'Public profile', 'الملف العام'], ['availability.html', 'Availability', 'التوافر'], ['earnings.html', 'Earnings', 'الأرباح']]
  ];
  function tabs() {
    const group = GROUPS.find(g => g.some(([href]) => href === page)); if (!group) return;
    const main = document.querySelector('main.main-content, main'); if (!main) return;
    let nav = document.getElementById('specialistTabs');
    if (!nav) { nav = document.createElement('nav'); nav.id = 'specialistTabs'; nav.className = 'sp-tabs'; nav.dataset.noTranslate = ''; main.prepend(nav); }
    nav.setAttribute('aria-label', x('In this section', 'في هذا القسم'));
    nav.replaceChildren(...group.map(([href, en, a]) => { const l = document.createElement('a'); l.href = href; l.textContent = x(en, a); if (href === page) l.setAttribute('aria-current', 'page'); return l; }));
  }
  function menuLabel() {
    const l = document.querySelector('#sidebar a[href="profile.html"].nav-link .nav-label, #sidebar nav a[href="profile.html"] span:not(.nav-icon)');
    if (l) { l.dataset.noTranslate = ''; l.textContent = x('My practice', 'عيادتي'); }
  }
  const WORDS = { Sunday: 'الأحد', Monday: 'الاثنين', Tuesday: 'الثلاثاء', Wednesday: 'الأربعاء', Thursday: 'الخميس', Friday: 'الجمعة', Saturday: 'السبت', Available: 'متاح', Unavailable: 'غير متاح', Scheduled: 'مجدول', 'In-person': 'حضوري', Online: 'عن بُعد', online: 'عن بُعد' };
  const orig = new WeakMap();
  function words() {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; const nodes = [];
    while ((n = w.nextNode())) nodes.push(n);
    for (const node of nodes) {
      const el = node.parentElement; if (!el || el.closest('script,style,textarea,select,input')) continue;
      const s = node.textContent, t = s.trim(); if (!t) continue;
      if (ar()) {
        let next = s;
        if (WORDS[t]) next = s.replace(t, WORDS[t]);
        else if (/^(\d+) cases?$/.test(t)) next = s.replace(t, t.replace(/^(\d+) cases?$/, '$1 ' + 'حالة'));
        else if (/\b(In-person|Online)\b/.test(t) && /\d{4}-\d{2}-\d{2}/.test(t)) next = s.replace(/In-person/g, 'حضوري').replace(/Online/g, 'عن بُعد');
        if (next !== s) { if (!orig.has(node)) orig.set(node, s); node.textContent = next; }
      } else if (orig.has(node)) { node.textContent = orig.get(node); orig.delete(node); }
      // Internal booking codes mean nothing to the specialist
      if (/^(demo|showcase)[-_][\w-]+$/.test(t) && !el.children.length && !el.closest('a,button,option')) el.classList.add('sp-code');
    }
  }
  // The fictional "Adam" follow-up example is only useful when the specialist has no real families yet.
  function example() {
    const ex = document.getElementById('careLongTermExample'); if (!ex) return;
    let real = false; try { const me = sessionStorage.getItem('rafiqSpecialistId'); real = JSON.parse(localStorage.getItem('rafiqBookings') || '[]').some(b => b?.specialistId === me); } catch {}
    ex.hidden = real;
  }
  let busy = false;
  const run = () => { if (busy) return; busy = true; try { tabs(); menuLabel(); words(); example(); } catch {} finally { setTimeout(() => { busy = false; }, 0); } };
  let timer = 0; const later = ms => { clearTimeout(timer); timer = setTimeout(run, ms); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => later(60)); else later(60);
  addEventListener('load', () => { later(150); setTimeout(run, 900); });
  new MutationObserver(() => later(150)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  const watch = () => document.body && new MutationObserver(m => { if (!busy && m.some(r => r.addedNodes.length)) later(250); }).observe(document.body, { childList: true, subtree: true });
  if (document.body) watch(); else document.addEventListener('DOMContentLoaded', watch);
})();
