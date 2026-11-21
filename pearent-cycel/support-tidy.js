/* Support areas: one clear header with the two doors as the main choice, the 11 areas
   as tiles ("or browse by area"), a lighter filter row and tidy topic cards.
   The catalog re-renders on every filter change, so this re-applies after each render. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, a) => (ar() ? a : en);
  const name = () => { try { const id = window.RafiqFamily?.selected?.() || new URLSearchParams(location.search).get('child'); return window.RafiqSetup.readChildren().find(c => c.id === id)?.name || ''; } catch { return ''; } };
  const icons = { development: '🌱', speech: '💬', behaviour: '⚡', emotional: '💛', learning: '📚', sensory: '✋', feeding: '🥣', sleep: '🌙', medical: '🩺', genetic: '🧬', everyday: '🏡' };
  let busy = false;

  function apply() {
    const root = document.getElementById('supportCatalog');
    if (!root || new URLSearchParams(location.search).get('topic')) return;
    document.body.classList.add('support-tidy');
    const h1 = root.querySelector(':scope > h1'), lead = h1?.nextElementSibling?.tagName === 'P' ? h1.nextElementSibling : null, doors = root.querySelector(':scope > .support-doors, .sa-hero .support-doors');
    // Back link (the nav has Home) and the bottom notice (said in the header now)
    [...root.querySelectorAll(':scope > a.catalog-action')].forEach(a => { if (/parent-dashboard/.test(a.getAttribute('href') || '')) a.hidden = true; });
    root.querySelector(':scope > .catalog-notice')?.setAttribute('hidden', '');
    // Header card: title, one line, the two doors
    let hero = root.querySelector(':scope > .sa-hero');
    if (!hero && h1) { hero = document.createElement('section'); hero.className = 'sa-hero'; h1.before(hero); }
    if (hero) {
      if (h1 && h1.parentElement !== hero) hero.append(h1);
      if (lead && lead.parentElement !== hero) hero.append(lead);
      if (doors && doors.parentElement !== hero) hero.append(doors);
      const n = name();
      const title = hero.querySelector('h1'); if (title) { title.dataset.noTranslate = ''; title.textContent = n ? x('How can we help ' + n + '?', 'كيف نقدر نساعد ' + n + '؟') : x('How can we help?', 'كيف نقدر نساعدكم؟'); }
      const p = hero.querySelector('p'); if (p) { p.dataset.noTranslate = ''; p.textContent = x('Start from the door that fits you, or browse topics by area below. This is a guide to services — not a diagnosis.', 'ابدأوا من الباب اللي بيناسبكم، أو تصفّحوا المواضيع حسب المجال تحت. هاد دليل خدمات — مش تشخيص.'); }
      hero.querySelectorAll('.support-door').forEach(d => { if (!d.querySelector('.sa-go')) { const go = document.createElement('span'); go.className = 'sa-go'; d.append(go); } d.querySelector('.sa-go').textContent = d.classList.contains('is-diagnosis') ? x('See topics →', 'شوفوا المواضيع ←') : x('Start →', 'ابدأوا ←'); });
    }
    // Areas as tiles, always open, with a small heading
    const picker = document.getElementById('catalogAreaPicker');
    if (picker) {
      picker.open = true;
      let head = root.querySelector(':scope > .sa-areas-title');
      if (!head) { head = document.createElement('h2'); head.className = 'sa-areas-title'; picker.before(head); }
      head.dataset.noTranslate = ''; head.textContent = x('Or browse by area', 'أو تصفّحوا حسب المجال');
      picker.querySelectorAll('button[data-category]').forEach(b => { if (!b.querySelector('.sa-ic')) { const i = document.createElement('span'); i.className = 'sa-ic'; i.setAttribute('aria-hidden', 'true'); i.textContent = icons[b.dataset.category] || '•'; b.prepend(i); } });
      const form = root.querySelector(':scope > form.catalog-filters');
      if (form && form.previousElementSibling !== picker) picker.after(form);
    }
    // Results heading
    const count = document.getElementById('catalogCount');
    if (count) count.classList.add('sa-count');
    // Selected area -> start 'I have a concern' with this area already chosen.
    const active = root.querySelector('.catalog-categories button[aria-pressed="true"]');
    let link = root.querySelector(':scope > .sa-concern-link');
    if (active && count) {
      const label = [...active.childNodes].filter(n => !(n.classList && n.classList.contains('sa-ic'))).map(n => n.textContent).join('').trim();
      if (!link) { link = document.createElement('a'); link.className = 'sa-concern-link'; link.dataset.noTranslate = ''; }
      link.href = 'screening.html?area=' + encodeURIComponent(active.dataset.category);
      link.replaceChildren(); const s1 = document.createElement('strong'); s1.textContent = x('Worried about ' + label.toLowerCase() + '?', 'عندكم قلق بـ' + label + '؟'); const s2 = document.createElement('span'); s2.textContent = x('Answer 4 short questions and get a clear next step →', 'جاوبوا ٤ أسئلة قصيرة وخدوا خطوة واضحة ←'); link.append(s1, s2);
      if (link.nextElementSibling !== count || link.parentElement !== root) count.before(link);
    } else if (link) link.remove();
  }

  function run() { if (busy) { setTimeout(run, 40); return; } busy = true; try { apply(); } catch { /* keep the page as it was */ } finally { setTimeout(() => { busy = false; }, 0); } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', () => { run(); setTimeout(run, 300); });
  const root = () => document.getElementById('supportCatalog');
  const start = () => { const r = root(); if (r && !r.dataset.saWatch) { r.dataset.saWatch = '1'; r.addEventListener('click', e => { if (e.target.closest('.catalog-categories button, form.catalog-filters button')) setTimeout(run, 60); }); r.addEventListener('change', () => setTimeout(run, 60)); new MutationObserver(() => setTimeout(run, 0)).observe(r, { childList: true }); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  new MutationObserver(() => setTimeout(run, 60)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
