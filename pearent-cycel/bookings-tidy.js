/* Appointments: one clear header (child's name, one line, one main button), the next
   appointment spotlighted on top, counts inside the filter chips instead of a separate
   row of cards, and friendly dates ("Today · Friday 20 November") and fees. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, a) => (ar() ? a : en);
  const childName = () => { try { const id = window.RafiqFamily?.selected?.() || new URLSearchParams(location.search).get('child'); return window.RafiqSetup.readChildren().find(c => c.id === id)?.name || ''; } catch { return ''; } };
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const nice = iso => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso).trim()); if (!m) return null;
    const d = new Date(+m[1], +m[2] - 1, +m[3]); const diff = Math.round((d - today()) / 864e5);
    const rel = diff === 0 ? x('Today', 'اليوم') : diff === 1 ? x('Tomorrow', 'بكرة') : diff === -1 ? x('Yesterday', 'مبارح') : '';
    const text = d.toLocaleDateString(ar() ? 'ar' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    return { diff, text: rel ? rel + ' · ' + text : text, rel };
  };
  let busy = false;

  function hero() {
    const top = document.querySelector('header.topbar'); if (!top) return;
    document.body.classList.add('bk-tidy');
    const n = childName();
    const kicker = top.querySelector('.page-kicker'); if (kicker) { kicker.dataset.noTranslate = ''; kicker.textContent = x('Appointments and reports', 'المواعيد والتقارير'); }
    const h1 = top.querySelector('h1'); if (h1) { h1.dataset.noTranslate = ''; h1.textContent = n ? x(n + '’s appointments', 'مواعيد ' + n) : x('Your appointments', 'مواعيدكم'); }
    let lead = top.querySelector('.bk-lead');
    if (!lead && h1) { lead = document.createElement('p'); lead.className = 'bk-lead'; h1.after(lead); }
    if (lead) { lead.dataset.noTranslate = ''; lead.textContent = x('Every session with its next step: get ready, join, then read the report and practise at home.', 'كل جلسة مع خطوتها الجاية: حضّروا، انضموا، وبعدها اقروا التقرير وطبّقوا بالبيت.'); }
    const btn = top.querySelector('.new-booking-button'); if (btn) { btn.dataset.noTranslate = ''; btn.textContent = x('+ Book a specialist', '+ احجزوا مع مختص'); }
  }

  function counts() {
    const grid = document.querySelector('.summary-grid'); if (!grid) return;
    const nums = [...grid.querySelectorAll('.summary-card')].map(c => (c.innerText.match(/\d+/) || ['0'])[0]);
    const map = { upcoming: nums[0], completed: nums[1], cancelled: nums[2] };
    document.querySelectorAll('.filter-tabs .filter-button').forEach((b, i) => {
      const key = ['all', 'upcoming', 'completed', 'cancelled'][i]; if (!key || key === 'all') return;
      let c = b.querySelector('.bk-count'); if (!c) { c = document.createElement('span'); c.className = 'bk-count'; c.dataset.noTranslate = ''; b.append(c); }
      c.textContent = map[key] ?? '';
    });
  }

  function cards() {
    document.querySelectorAll('#bookingsList .booking-card').forEach(card => {
      card.querySelectorAll('.booking-detail').forEach(row => {
        const label = row.querySelector('span')?.textContent.trim() || '', val = row.querySelector('strong'); if (!val) return;
        if (!val.dataset.bkRaw) val.dataset.bkRaw = val.textContent.trim();
        const raw = val.dataset.bkRaw;
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) { const n = nice(raw); if (n) { val.dataset.noTranslate = ''; val.textContent = n.text; card.dataset.bkDiff = n.diff; row.classList.add('bk-date'); } }
        else if (/^\d+(\.\d+)?$/.test(raw) && /رسوم|Fee|سعر|Price/i.test(label)) { val.dataset.noTranslate = ''; val.textContent = raw + x(' JOD', ' دينار'); }
      });
      const badge = card.querySelector('.status-badge.state-accepted'); if (badge && /مقبول|Accepted/.test(badge.textContent)) badge.textContent = x('Confirmed', 'مؤكّد');
      const diff = Number(card.dataset.bkDiff);
      const room = card.querySelector('.journey-link[href*="meeting"]');
      if (room) room.classList.toggle('bk-primary', diff === 0 && card.querySelector('.status-badge.upcoming') !== null);
    });
  }

  function spotlight() {
    const list = document.getElementById('bookingsList'); if (!list) return;
    let box = document.getElementById('bkNext');
    const next = [...list.querySelectorAll('.booking-card')].filter(c => c.querySelector('.status-badge.upcoming') && Number(c.dataset.bkDiff) >= 0).sort((a, b) => a.dataset.bkDiff - b.dataset.bkDiff)[0];
    if (!next) { box?.remove(); return; }
    if (!box) { box = document.createElement('section'); box.id = 'bkNext'; box.className = 'bk-next'; box.dataset.noTranslate = ''; }
    const anchor = document.querySelector('.page-body .booking-tools') || list;
    if (box.nextElementSibling !== anchor) anchor.before(box);
    const who = (next.querySelector('.specialist-info h3')?.textContent || '').split('—')[0].trim();
    const date = next.querySelector('.bk-date strong')?.textContent || '';
    const time = [...next.querySelectorAll('.booking-detail')].find(r => /الوقت|Time/.test(r.textContent))?.querySelector('strong')?.textContent.trim() || '';
    const diff = Number(next.dataset.bkDiff);
    box.replaceChildren();
    const k = document.createElement('p'); k.className = 'bk-next-kicker'; k.textContent = x('Your next appointment', 'موعدكم الجاي');
    const h = document.createElement('h2'); h.textContent = date + (time ? x(' at ', ' · الساعة ') + time : '');
    const p = document.createElement('p'); p.textContent = x('With ' + who + '. ', 'مع ' + who + '. ') + (diff === 0 ? x('Join from the video room when it is time.', 'انضموا من غرفة الفيديو لما يجي الوقت.') : x('Write down 2–3 questions to ask before the visit.', 'اكتبوا ٢–٣ أسئلة بدكم تسألوها قبل الزيارة.'));
    const acts = document.createElement('div'); acts.className = 'bk-next-actions';
    const room = next.querySelector('.journey-link[href*="meeting"]');
    if (diff === 0 && room) { const a = document.createElement('a'); a.href = room.getAttribute('href'); a.className = 'bk-btn'; a.textContent = x('Open the video room', 'افتحوا غرفة الفيديو'); acts.append(a); }
    const det = document.createElement('button'); det.type = 'button'; det.className = diff === 0 && room ? 'bk-btn is-ghost' : 'bk-btn';
    det.textContent = x('Appointment details', 'تفاصيل الموعد'); det.addEventListener('click', () => next.querySelector('.details-button')?.click()); acts.append(det);
    box.append(k, h, p, acts);
  }

  function apply() {
    if (busy) return; busy = true;
    try { hero(); counts(); cards(); spotlight(); } catch { /* leave the page as it was */ } finally { setTimeout(() => { busy = false; }, 0); }
  }
  const later = (ms = 60) => setTimeout(apply, ms);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => later(0)); else later(0);
  window.addEventListener('load', () => { later(100); later(600); });
  const watch = () => { const l = document.getElementById('bookingsList'); if (l) new MutationObserver(() => { if (!busy) later(30); }).observe(l, { childList: true }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();
  new MutationObserver(() => { document.querySelectorAll('[data-bk-raw]').forEach(v => { v.textContent = v.dataset.bkRaw; }); later(120); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
