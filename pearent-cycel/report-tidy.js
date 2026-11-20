/* Specialist report: read first, then act. One header (whose report, for which child, when),
   the report itself, then "Did you try it at home?" (the follow-up the specialist will see),
   then the next step. Removes the duplicate hero, the step-by-step box and the demo banner. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, a) => (ar() ? a : en);
  const set = (el, text) => { if (el && el.textContent !== text) { el.dataset.noTranslate = ''; el.textContent = text; } };
  const niceDate = iso => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso).trim()); if (!m) return ''; return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString(ar() ? 'ar' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); };
  let busy = false;

  function apply() {
    const view = document.getElementById('reportView'); if (!view || view.hidden) return;
    document.body.classList.add('rp-tidy');
    const child = document.getElementById('heroChildName')?.textContent.trim() || '';
    const card = view.querySelector('.appointment-card');
    const who = (card?.querySelector('h2, h3, strong')?.textContent || [...(card?.querySelectorAll('*') || [])].map(e => e.childElementCount ? '' : e.textContent.trim()).find(t => /—/.test(t)) || '').split('—')[0].trim();
    // Date cell: show a readable date
    card?.querySelectorAll('strong, span, p, dd').forEach(el => { if (el.childElementCount) return; if (!el.dataset.rpRaw && /^\d{4}-\d{2}-\d{2}$/.test(el.textContent.trim())) el.dataset.rpRaw = el.textContent.trim(); if (el.dataset.rpRaw) set(el, niceDate(el.dataset.rpRaw)); });
    const dateText = card?.querySelector('[data-rp-raw]')?.textContent || '';
    // Header
    const top = document.querySelector('header.topbar');
    if (top) {
      set(top.querySelector('.page-kicker'), x('Specialist report', 'تقرير المختص') + (dateText ? ' · ' + dateText : ''));
      set(top.querySelector('h1'), child ? x(child + '’s session report', 'تقرير جلسة ' + child) : x('Session report', 'تقرير الجلسة'));
      let lead = top.querySelector('.rp-lead'); if (!lead) { lead = document.createElement('p'); lead.className = 'rp-lead'; top.querySelector('h1')?.after(lead); }
      set(lead, (who ? x('From ' + who + '. ', 'من ' + who + '. ') : '') + x('Read the summary and recommendations, then mark what you tried at home.', 'اقرأوا الملخص والتوصيات، وبعدها علّموا شو جرّبتوا بالبيت.'));
      const back = top.querySelector('.back-button'); if (back) set(back, x('← My appointments', 'مواعيدي ←'));
    }
    // Follow-up card: after the report, in plain words
    const follow = view.querySelector('.report-followup-card'), layout = view.querySelector('.report-layout');
    if (follow && layout && layout.nextElementSibling !== follow) layout.after(follow);
    if (follow) {
      set(follow.querySelector('h2'), x('Did you try it at home?', 'جرّبتوا التوصيات بالبيت؟'));
      set(follow.querySelector(':scope > p'), x('Mark each recommendation after you try it and write a question for next time. Your specialist sees this at the follow-up.', 'علّموا كل توصية بعد ما تجرّبوها، واكتبوا سؤال للمرة الجاية. المختص بيشوف هالمتابعة.'));
      follow.querySelectorAll('option').forEach(o => set(o, { planned: x('Not tried yet', 'لسّا ما جرّبنا'), tried: x('We tried it', 'جرّبناها'), question: x('I have a question', 'عندي سؤال') }[o.value] || o.textContent));
      set(follow.querySelector('label[for="followupParentNote"]'), x('What do you want to remember or ask next time?', 'شو بدكم تتذكروا أو تسألوا المرة الجاية؟'));
      set(follow.querySelector('label[for="followupReminder"]'), x('Remind me on (optional)', 'ذكّروني بتاريخ (اختياري)'));
      set(follow.querySelector('.followup-help'), x('A personal reminder on your Home page — not an appointment.', 'تذكير إلكم بالرئيسية — مش موعد.'));
      set(follow.querySelector('button[type="submit"]'), x('Save my follow-up', 'احفظوا متابعتي'));
      follow.querySelectorAll(':scope > a[href^="specialist-profile"], :scope > a[href="bookings.html"]').forEach(a => { a.hidden = true; });
    }
  }

  function run() { if (busy) return; busy = true; try { apply(); } catch { /* keep the page as it was */ } finally { setTimeout(() => { busy = false; }, 0); } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(run, 0)); else setTimeout(run, 0);
  window.addEventListener('load', () => { setTimeout(run, 80); setTimeout(run, 600); });
  new MutationObserver(() => setTimeout(run, 120)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  const watch = () => { const v = document.getElementById('reportView'); if (v) new MutationObserver(() => { if (!busy) setTimeout(run, 40); }).observe(v, { childList: true, attributes: true, attributeFilter: ['hidden'] }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();
})();
