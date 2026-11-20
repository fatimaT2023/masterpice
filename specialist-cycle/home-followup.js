/* Specialist appointment page: "From home" — what the family tried after earlier reports with
   this specialist, and their latest notes about the child. This closes the loop
   report -> practise at home -> the specialist sees it at the next visit.
   Read-only: it only shows what the parent saved for this child. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, a) => (ar() ? a : en);
  const J = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch { return d; } };
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const when = iso => { const t = Date.parse(iso || ''); if (!t) return ''; return new Date(t).toLocaleDateString(ar() ? 'ar' : 'en-GB', { day: 'numeric', month: 'long' }); };

  function render() {
    const view = document.getElementById('detailsView'); if (!view || view.hidden) return;
    const id = sessionStorage.getItem('rafiqSelectedSpecialistBooking'); if (!id) return;
    const bookings = J('rafiqBookings', []); const booking = bookings.find(b => b.id === id); if (!booking?.childId) return;
    const me = sessionStorage.getItem('rafiqSpecialistId') || booking.specialistId;
    const mine = new Set(bookings.filter(b => b.childId === booking.childId && b.specialistId === me).map(b => b.id));
    // Home follow-up on this specialist's earlier reports
    const follow = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || ''; const pre = 'rafiqReportFollowup_' + booking.childId + '_';
      if (!k.startsWith(pre)) continue; const bid = k.slice(pre.length); if (!mine.has(bid) || bid === id) continue;
      const v = J(k, null); if (v && (v.responses?.length || v.note)) follow.push(v);
    }
    follow.sort((a, b) => Date.parse(b.updatedAt || 0) - Date.parse(a.updatedAt || 0));
    const since = Date.now() - 30 * 864e5;
    const notes = J('rafiqAgeObservations_' + booking.childId, []).filter(r => r && !r._deletedAt && r.text && !/^My follow-up after a visit/.test(r.text) && Date.parse(r.createdAt || r.updatedAt || 0) >= since).sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0)).slice(0, 4);

    let card = document.getElementById('homeFollowupCard');
    if (!follow.length && !notes.length) { card?.remove(); return; }
    if (!card) {
      card = el('section', 'details-card home-followup'); card.id = 'homeFollowupCard'; card.dataset.noTranslate = '';
      const anchor = document.getElementById('bookingReason')?.closest('section, article, .details-card') || view.firstElementChild;
      anchor ? anchor.after(card) : view.prepend(card);
    }
    card.replaceChildren();
    card.append(el('p', 'hf-kicker', x('From home', 'من البيت')), el('h2', '', x('What the family tried since your report', 'شو جرّبت العيلة من بعد تقريرك')));
    const statusText = s => ({ tried: x('Tried ✓', 'جرّبوها ✓'), planned: x('Not tried yet', 'لسّا'), question: x('Has a question', 'عندهم سؤال') }[s] || s);
    follow.slice(0, 2).forEach(f => {
      const box = el('div', 'hf-block');
      box.append(el('p', 'hf-date', x('Updated ', 'آخر تحديث ') + when(f.updatedAt)));
      const ul = el('ul', 'hf-list');
      (f.responses || []).forEach(r => { const li = el('li', 'is-' + r.status); li.append(el('span', 'hf-rec', r.recommendation || ''), el('b', 'hf-status', statusText(r.status))); ul.append(li); });
      box.append(ul);
      if (f.note) { const q = el('blockquote', 'hf-note', f.note); box.append(q); }
      card.append(box);
    });
    if (notes.length) {
      card.append(el('h3', '', x('Recent notes from home', 'آخر ملاحظات من البيت')));
      const ul = el('ul', 'hf-notes');
      notes.forEach(n => { const li = el('li'); li.append(el('span', '', n.text), el('small', '', when(n.createdAt))); ul.append(li); });
      card.append(ul);
    }
    card.append(el('p', 'hf-foot', x('Shared by the family for this child. Use it to plan the session — it is not a clinical record.', 'العيلة شاركتها عن هالطفل. استعملها لتخطيط الجلسة — مش سجل سريري.')));
  }

  const run = () => { try { render(); } catch { /* leave the page as it was */ } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(run, 50)); else setTimeout(run, 50);
  window.addEventListener('load', () => { setTimeout(run, 150); setTimeout(run, 800); });
  new MutationObserver(() => setTimeout(run, 120)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  const watch = () => { const v = document.getElementById('detailsView'); if (v) new MutationObserver(() => setTimeout(run, 60)).observe(v, { attributes: true, attributeFilter: ['hidden'] }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();
})();
