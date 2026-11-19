/* Rafiq AI: quick steps above the message box (one tap to the right place),
   and ?q=<text> pre-fills the question when coming from the "Need help?" panel. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, a) => (ar() ? a : en);
  const steps = () => [
    ['🎯', x('Today’s activity', 'نشاط اليوم'), 'daily-activity.html'],
    ['📈', x('Skills for this age', 'مهارات هالعمر'), 'milestones.html'],
    ['💉', x('Next vaccine', 'المطعوم الجاي'), 'health.html'],
    ['🧩', x('I have a concern', 'عندي قلق'), 'screening.html'],
    ['📅', x('My appointments', 'مواعيدي'), 'bookings.html'],
    ['🩺', x('Find a specialist', 'لاقوا مختص'), 'specialists.html']
  ];
  function render() {
    const form = document.getElementById('chatForm');
    if (!form) return;
    let row = document.getElementById('aiQuickSteps');
    if (!row) { row = document.createElement('nav'); row.id = 'aiQuickSteps'; row.className = 'ai-quick'; row.dataset.noTranslate = ''; form.before(row); }
    row.setAttribute('aria-label', x('Quick steps', 'خطوات سريعة'));
    row.replaceChildren(...steps().map(([icon, label, href]) => { const a = document.createElement('a'); a.href = href; a.className = 'ai-quick-chip'; const i = document.createElement('span'); i.textContent = icon; i.setAttribute('aria-hidden', 'true'); a.append(i, document.createTextNode(label)); return a; }));
  }
  function prefill() {
    const q = new URLSearchParams(location.search).get('q');
    const input = document.getElementById('messageInput');
    if (q && input && !input.value) { input.value = q.slice(0, 500); input.dispatchEvent(new Event('input', { bubbles: true })); input.focus(); }
  }
  const start = () => { try { render(); prefill(); } catch {} };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 100)); else setTimeout(start, 100);
  new MutationObserver(() => setTimeout(render, 60)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
