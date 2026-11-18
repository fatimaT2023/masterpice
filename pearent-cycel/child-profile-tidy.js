/* "My child" page tidy-up: station tabs first, the support choice as a small row
   inside the child header, the same baby illustration as Home when there is no
   photo, and no repeated helper/back links. Data and existing controls are reused. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';

  function childNow() {
    try {
      const id = new URLSearchParams(location.search).get('child') || window.RafiqFamily?.selected?.();
      return window.RafiqSetup?.readChildren?.().find(c => c.id === id) || null;
    } catch { return null; }
  }

  function tidy() {
    const main = document.querySelector('main');
    const hero = document.querySelector('.child-profile-hero');
    if (!main || !hero) return;
    document.body.classList.add('profile-tidy');

    // 1. Station tabs at the very top.
    const tabs = main.querySelector(':scope > .parent-records-tabs');
    if (tabs && main.firstElementChild !== tabs) main.prepend(tabs);

    // 2. Support choice: a compact row inside the header instead of a big card above the tabs.
    const support = document.getElementById('supportModeCard');
    const info = hero.querySelector('.profile-hero-info');
    if (support && info && support.parentElement !== info) { support.classList.add('is-compact'); info.append(support); }

    // 3. Baby illustration when no photo was added (same as Home).
    const avatar = document.getElementById('profileAvatar');
    const child = childNow();
    if (avatar && child && !avatar.querySelector('img')) {
      avatar.classList.add('has-illustration', child.gender === 'male' ? 'is-boy' : child.gender === 'female' ? 'is-girl' : 'is-neutral');
      avatar.classList.remove(child.gender === 'male' ? 'is-girl' : 'is-boy');
      avatar.setAttribute('aria-label', (ar() ? 'رسم توضيحي لـ ' : 'Illustration for ') + (child.name || ''));
    }

    // 4. Repeated helpers: the page already has clear sections and the nav has Home.
    hero.querySelector('.parent-cycle-help')?.setAttribute('hidden', '');
    [...main.querySelectorAll(':scope > a.screen-flow-link')].forEach(a => { if (/parent-dashboard\.html/.test(a.getAttribute('href') || '')) a.hidden = true; });

    // 5. Archive button and storage note go together in a quiet footer.
    const box = document.getElementById('profileContent') || main;
    const archive = [...box.querySelectorAll(':scope > button.screen-flow-secondary')].find(b => /archive|أرشف/i.test(b.textContent));
    const note = [...box.querySelectorAll(':scope > p.screen-flow-small')][0];
    if (archive && !archive.closest('.profile-footer')) {
      const foot = document.createElement('div'); foot.className = 'profile-footer';
      box.append(foot); if (note) foot.append(note); foot.append(archive);
    }

    // 6. Say what the support choice actually is.
    const head = support?.querySelector('h2');
    if (head && child) {
      const sp = child.supportProfile || {}, sit = sp.situation, focus = sp.focus;
      const sitText = /^diagnosed/.test(sit) ? (ar() ? 'عنده تشخيص' : 'Has a diagnosis') : sit === 'worried' ? (ar() ? 'عندنا قلق' : 'We have a concern') : sit === 'none' ? (ar() ? 'ماشي تمام' : 'All good for now') : (ar() ? 'لسا ما اخترتوا' : 'Not chosen yet');
      const focusText = { autism: ['Autism', 'التوحد'], speech_language: ['Speech and language', 'النطق واللغة'], social: ['Social communication', 'التواصل الاجتماعي'], other: ['Other', 'غير ذلك'] }[focus];
      head.dataset.noTranslate = '';
      head.textContent = (ar() ? 'الدعم: ' : 'Support: ') + sitText + (focusText ? ' · ' + focusText[ar() ? 1 : 0] : '');
    }
  }

  const run = () => { try { tidy(); } catch { /* keep the original layout */ } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', () => { run(); setTimeout(run, 400); });
  new MutationObserver(() => { if (document.getElementById('supportModeCard')?.parentElement?.classList.contains('profile-hero-info') === false) run(); })
    .observe(document.documentElement, { childList: true, subtree: true });
})();
