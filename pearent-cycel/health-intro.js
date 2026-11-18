/* Health page header: one line that says what the page is for and why it helps. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  function apply() {
    const hero = document.querySelector('.health-hero-card');
    if (!hero) return;
    document.body.classList.add('health-compact');
    let name = '';
    try { const id = window.RafiqFamily?.selected?.() || new URLSearchParams(location.search).get('child'); name = window.RafiqSetup.readChildren().find(c => c.id === id)?.name || ''; } catch {}
    const title = hero.querySelector('h1'), desc = hero.querySelector('.health-hero-body p:not(.today-eyebrow):not(.screen-flow-eyebrow)');
    if (title) { title.dataset.noTranslate = ''; title.textContent = ar() ? ('صحة ' + (name || 'طفلكم') + ' بمكان واحد') : ((name ? name + '’s' : 'Your child’s') + ' health in one place'); }
    if (desc) { desc.dataset.noTranslate = ''; desc.textContent = ar() ? 'المطاعيم حسب جدول وزارة الصحة الأردنية، الطول والوزن، وملاحظات زيارات الطبيب — بتعرفوا شو الجاي، وبتكون جاهزة توروها للطبيب أو المختص.' : 'Vaccines on the Jordan Ministry of Health schedule, height and weight, and doctor-visit notes — so you know what is next and have it ready for the doctor or specialist.'; }
  }
  const run = () => { try { apply(); } catch {} };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', run);
  new MutationObserver(() => setTimeout(run, 50)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
