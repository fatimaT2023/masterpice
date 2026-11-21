/* "I have a concern": say the goal in one line, show what the parent gets at the end,
   and keep the header short so the five choices are visible straight away. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, arText) => (ar() ? arText : en);

  function apply() {
    const hero = document.querySelector('.screening-hero');
    if (!hero) return;
    document.body.classList.add('concern-compact');
    const body = hero.querySelector('.screening-hero-body') || hero;
    const title = body.querySelector('h1');
    const desc = body.querySelector('p:not(.screen-flow-eyebrow):not(.today-eyebrow)') || body.querySelector('p');
    if (title) { title.dataset.noTranslate = ''; title.textContent = x('Worried about something? Let’s sort it out together', 'عندكم قلق؟ خلّونا نرتّبه سوا'); }
    if (desc) { desc.dataset.noTranslate = ''; desc.textContent = x('Pick what is on your mind, answer a few questions about everyday moments, and get a clear summary with one next step: keep watching at home, or talk to a specialist.', 'اختاروا شو اللي شاغل بالكم، جاوبوا على كم سؤال عن مواقف يومية، وبالآخر بيطلعلكم ملخص مرتّب وخطوة واضحة: نراقب بالبيت، أو نحكي مع مختص.'); }
    let chips = hero.querySelector('.concern-promise');
    if (!chips) { chips = document.createElement('ul'); chips.className = 'concern-promise'; chips.dataset.noTranslate = ''; (desc || title || body).after(chips); }
    chips.replaceChildren(...[
      x('3 short steps', '٣ خطوات قصيرة'),
      x('About 3 minutes', 'حوالي ٣ دقايق'),
      x('A summary you can share with a specialist', 'ملخص بتقدروا تشاركوه مع مختص'),
      x('Not a diagnosis', 'مش تشخيص')
    ].map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  }

  const run = () => { try { apply(); } catch { /* keep the original page */ } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', run);
  new MutationObserver(run).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
