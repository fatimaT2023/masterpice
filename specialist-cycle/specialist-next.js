/* Specialist dashboard: one "Your next step" card (the most important thing to do now) and
   "Your families" — each child with the four stages of the work: request -> session -> report
   -> home follow-up, with a check mark on the stages that are done. Mirrors the parent journey. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, a) => (ar() ? a : en);
  const J = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch { return d; } };
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const iso = d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  const nice = s => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); if (!m) return s || ''; const d = new Date(+m[1], +m[2] - 1, +m[3]); const diff = Math.round((d - new Date(new Date().toDateString())) / 864e5); const rel = diff === 0 ? x('Today', 'اليوم') : diff === 1 ? x('Tomorrow', 'غدًا') : ''; const t = d.toLocaleDateString(ar() ? 'ar' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); return rel ? rel + ' · ' + t : t; };
  const open = (id, page) => { try { sessionStorage.setItem('rafiqSelectedSpecialistBooking', id); } catch {} location.href = page; };

  function data() {
    const me = sessionStorage.getItem('rafiqSpecialistId');
    const all = J('rafiqBookings', []).filter(b => b && b.specialistId === me && !b._deletedAt);
    const reports = J('rafiqSpecialistReports', []).filter(r => r && r.specialistId === me);
    const hasReport = b => reports.some(r => r.bookingId === b.id && r.status !== 'draft');
    const homeFor = (childId, bookingIds) => bookingIds.some(id => { const v = J('rafiqReportFollowup_' + childId + '_' + id, null); return v && (v.note || v.responses?.some(r => r.status !== 'planned')); });
    return { me, all, reports, hasReport, homeFor };
  }

  function nextStep({ all, hasReport, homeFor }) {
    const today = iso(new Date());
    const reqs = all.filter(b => b.status === 'requested' || b.status === 'pending');
    const todays = all.filter(b => ['confirmed', 'accepted', 'upcoming'].includes(b.status) && b.date === today).sort((a, b) => String(a.time).localeCompare(String(b.time)));
    const noReport = all.filter(b => b.status === 'completed' && !hasReport(b)).sort((a, b) => String(b.date).localeCompare(String(a.date)));
    if (todays.length) {
      const b = todays[0]; const home = homeFor(b.childId, all.filter(o => o.childId === b.childId && o.id !== b.id).map(o => o.id));
      return { kicker: x('Session today', 'جلسة اليوم'), title: x(b.childName + ' at ' + b.time, b.childName + ' · الساعة ' + b.time), text: home ? x('The family tried your recommendations at home — see what they wrote before you start.', 'العائلة جرّبت توصياتك في البيت — اطّلع على ما كتبته قبل أن تبدأ.') : x('Review the reason for the visit before you start.', 'راجع سبب الزيارة قبل أن تبدأ.'), cta: x('Open the session', 'افتح الجلسة'), go: () => open(b.id, 'booking-details.html') };
    }
    if (reqs.length) {
      const b = reqs[0];
      return { kicker: x('New request', 'طلب جديد'), title: x('The family of ' + b.childName + ' is waiting for your reply', 'عائلة ' + b.childName + ' تنتظر ردّك'), text: (b.reason ? '«' + b.reason + '» · ' : '') + nice(b.date) + ' · ' + b.time, cta: x('Review the request', 'راجع الطلب'), go: () => open(b.id, 'booking-details.html') };
    }
    if (noReport.length) {
      const b = noReport[0];
      return { kicker: x('Report to write', 'تقرير بانتظارك'), title: x('Write ' + b.childName + '’s session report', 'اكتب تقرير جلسة ' + b.childName), text: x('The family is waiting for it. Each recommendation becomes a checklist they try at home.', 'العائلة تنتظره. كل توصية تكتبها تصبح بندًا تجرّبه العائلة في البيت.'), cta: x('Write the report', 'اكتب التقرير'), go: () => open(b.id, 'report-form.html') };
    }
    const up = all.filter(b => ['confirmed', 'accepted'].includes(b.status) && b.date >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
    if (up) return { kicker: x('Next appointment', 'الموعد القادم'), title: up.childName + ' · ' + nice(up.date), text: x('Nothing urgent now. ', 'لا شيء عاجل الآن. ') + up.time, cta: x('Open', 'افتح'), go: () => open(up.id, 'booking-details.html') };
    return { kicker: x('All done', 'كل شيء جاهز'), title: x('No tasks right now', 'لا مهام الآن'), text: x('Keep your availability up to date so families can book.', 'حدّث أوقاتك المتاحة حتى تتمكّن العائلات من الحجز.'), cta: x('Availability', 'التوافر'), go: () => { location.href = 'availability.html'; } };
  }

  function render() {
    const anchor = document.getElementById('todayCount')?.closest('section, .stats-grid, .dashboard-stats') || document.getElementById('heroName')?.closest('section');
    if (!anchor || !sessionStorage.getItem('rafiqSpecialistId')) return;
    document.body.classList.add('sn-on');
    const d = data(); const step = nextStep(d);
    let card = document.getElementById('specialistNext');
    if (!card) { card = el('section', 'sn-next'); card.id = 'specialistNext'; card.dataset.noTranslate = ''; anchor.before(card); }
    card.replaceChildren(el('p', 'sn-kicker', x('Your next step', 'خطوتك التالية') + ' · ' + step.kicker), el('h2', '', step.title), el('p', 'sn-text', step.text));
    const btn = el('button', 'sn-btn', step.cta + x(' →', ' ←')); btn.type = 'button'; btn.addEventListener('click', step.go); card.append(btn);

    // Families and their stages
    const byChild = new Map(); d.all.forEach(b => { if (!byChild.has(b.childId)) byChild.set(b.childId, []); byChild.get(b.childId).push(b); });
    let fam = document.getElementById('specialistFamilies');
    if (!byChild.size) { fam?.remove(); return; }
    if (!fam) { fam = el('section', 'sn-families'); fam.id = 'specialistFamilies'; fam.dataset.noTranslate = ''; card.after(fam); }
    fam.replaceChildren(el('h2', '', x('Your families', 'عائلاتك')), el('p', 'sn-sub', x('Each child’s path with you: request, session, report, then what the family tried at home.', 'مسار كل طفل معك: الطلب، الجلسة، التقرير، ثم ما جرّبته العائلة في البيت.')));
    const list = el('ul', 'sn-list');
    byChild.forEach(rows => {
      const name = rows[0].childName;
      const accepted = rows.some(b => b.status !== 'requested' && b.status !== 'pending' && b.status !== 'declined');
      const done = rows.filter(b => b.status === 'completed');
      const reported = done.some(d.hasReport);
      const home = d.homeFor(rows[0].childId, done.map(b => b.id));
      const stages = [[x('Request', 'الطلب'), accepted], [x('Session', 'الجلسة'), done.length > 0], [x('Report', 'التقرير'), reported], [x('From home', 'من البيت'), home]];
      const li = el('li', 'sn-row');
      const who = el('button', 'sn-who', name); who.type = 'button';
      const target = rows.find(b => b.status === 'requested') || rows.filter(b => ['confirmed', 'accepted'].includes(b.status)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0] || rows.find(b => b.status === 'completed' && !d.hasReport(b)) || rows[0];
      who.addEventListener('click', () => open(target.id, target.status === 'completed' && !d.hasReport(target) ? 'report-form.html' : 'booking-details.html'));
      const ol = el('ol', 'sn-stages');
      let current = stages.findIndex(s => !s[1]);
      stages.forEach(([label, ok], i) => { const s = el('li', ok ? 'is-done' : i === current ? 'is-current' : ''); s.append(el('span', 'sn-dot', ok ? '✓' : String(i + 1)), el('span', '', label)); ol.append(s); });
      li.append(who, ol); list.append(li);
    });
    fam.append(list);
  }

  const run = () => { try { render(); } catch { /* keep the dashboard as it was */ } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(run, 60)); else setTimeout(run, 60);
  addEventListener('load', () => { setTimeout(run, 200); setTimeout(run, 900); });
  new MutationObserver(() => setTimeout(run, 120)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  addEventListener('storage', () => setTimeout(run, 100));
})();
