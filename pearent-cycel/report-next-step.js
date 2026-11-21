/* After reading a specialist report, show every family one clear "what now?" card.
   Families in an active support journey already get the practice link from
   support-journey-integrations.js, so this card only fills the gap for everyone else. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') === 'ar';
  const t = (en, arText) => (ar() ? arText : en);
  const make = (tag, text, cls) => { const el = document.createElement(tag); if (text) el.textContent = text; if (cls) el.className = cls; return el; };

  function mount() {
    const view = document.getElementById('reportView');
    if (!view || view.hidden || !view.textContent.trim()) return;
    document.getElementById('reportNextStep')?.remove();
    if (document.getElementById('journeyEntry')) return;
    const box = make('section', undefined, 'report-next-step');
    box.id = 'reportNextStep';
    box.dataset.noTranslate = '';
    box.append(
      make('p', t('Station 4 · Follow up', 'المحطة ٤ · نتابع'), 'report-next-kicker'),
      make('h2', t('Now, practise at home', 'هلّق، طبّقوا بالبيت')),
      make('p', t('Pick one idea from the report, try it this week, then note how it went. Your notes stay in the growth journal and you can share them at the next visit.',
        'اختاروا فكرة وحدة من التقرير، جرّبوها هالأسبوع، وسجّلوا كيف مشيت. ملاحظاتكم بتضل بسجل النمو وبتقدروا تشاركوها بالزيارة الجاية.'))
    );
    const actions = make('div', undefined, 'report-next-actions');
    const link = (label, href, primary) => { const a = make('a', label, primary ? 'report-next-primary' : 'report-next-secondary'); a.href = href; return a; };
    actions.append(
      link(t('Note how it went at home', 'سجّلوا كيف مشيت بالبيت'), 'milestones.html', true),
      link(t('Try a matching activity', 'جرّبوا نشاط مناسب'), 'daily-activity.html')
    );
    box.append(actions);
    view.append(box);
  }

  const schedule = () => setTimeout(mount, 400);
  document.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
  new MutationObserver(() => { if (document.getElementById('reportNextStep')) schedule(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
