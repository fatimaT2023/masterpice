/* Health page: one clear header, then a two-column layout —
   vaccination schedule (wide) and height/weight + health notes (side) —
   with the full log underneath. Repeated cards are hidden; data and
   existing controls (add buttons, entry form, history) are reused. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const childName = () => { try { const id = window.RafiqFamily?.selected?.() || new URLSearchParams(location.search).get('child'); return window.RafiqSetup.readChildren().find(c => c.id === id)?.name || ''; } catch { return ''; } };

  function header() {
    const hero = document.querySelector('.health-hero-card');
    if (!hero) return;
    document.body.classList.add('health-compact');
    const name = childName();
    const title = hero.querySelector('h1'), desc = hero.querySelector('.health-hero-body p:not(.today-eyebrow):not(.screen-flow-eyebrow)');
    if (title) { title.dataset.noTranslate = ''; title.textContent = ar() ? ('صحة ' + (name || 'طفلكم') + ' بمكان واحد') : ((name ? name + '’s' : 'Your child’s') + ' health in one place'); }
    if (desc) { desc.dataset.noTranslate = ''; desc.textContent = ar() ? 'المطاعيم حسب جدول وزارة الصحة الأردنية، الطول والوزن، وملاحظات زيارات الطبيب — بتعرفوا شو الجاي، وبتكون جاهزة توروها للطبيب أو المختص.' : 'Vaccines on the Jordan Ministry of Health schedule, height and weight, and doctor-visit notes — so you know what is next and have it ready for the doctor or specialist.'; }
  }

  function layout() {
    const host = document.getElementById('healthContent'), overview = document.getElementById('healthOverview');
    if (!host || !overview) return;
    document.body.classList.add('health-layout');
    let grid = host.querySelector(':scope > .hx-layout');
    if (!grid) {
      grid = document.createElement('div'); grid.className = 'hx-layout';
      const main = document.createElement('div'); main.className = 'hx-main';
      const side = document.createElement('aside'); side.className = 'hx-side';
      grid.append(main, side); host.prepend(grid);
    }
    const main = grid.querySelector('.hx-main'), side = grid.querySelector('.hx-side');
    if (overview.parentElement !== side) side.append(overview);
    const schedule = document.getElementById('vaccineSchedule');
    if (schedule && schedule.parentElement !== main) main.prepend(schedule);
    // Full log title
    const historyTitle = document.querySelector('#healthHistory .health-history-header h2, #healthHistory h2');
    if (historyTitle) { historyTitle.dataset.noTranslate = ''; historyTitle.textContent = ar() ? 'السجل الكامل' : 'Full health log'; }
    // The log repeats the schedule and the side cards, so it starts folded.
    const history = document.getElementById('healthHistory');
    if (history) {
      let toggle = history.querySelector('.hx-log-toggle');
      if (!toggle) { toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'hx-log-toggle'; toggle.setAttribute('aria-controls', 'healthRecordList'); toggle.addEventListener('click', () => { history.classList.toggle('is-open'); paintToggle(); }); (historyTitle?.parentElement || history).append(toggle); }
      const count = document.querySelectorAll('#healthRecordList > *').length;
      function paintToggle() { const open = history.classList.contains('is-open'); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? (ar() ? 'سكّروا السجل' : 'Hide the log') : (ar() ? 'اعرضوا السجل الكامل (' + count + ')' : 'Show the full log (' + count + ')'); }
      paintToggle();
    }
  }

  const run = () => { try { header(); layout(); } catch { /* keep the page as it was */ } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', () => { run(); setTimeout(run, 400); setTimeout(run, 1200); });
  new MutationObserver(() => setTimeout(run, 120)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  window.RafiqHealthLayout = { run };
})();
