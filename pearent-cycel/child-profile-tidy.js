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

    // 7. Rebuild the body as: header facts · child story (wide) · measurements + care team (side).
    const mainCol = document.querySelector('.child-profile-main'), side = document.querySelector('.child-profile-side');
    if (!mainCol || !side) return;
    const byTitle = (root, re) => [...root.querySelectorAll(':scope > section, :scope > div')].find(s => re.test(s.querySelector('h2')?.textContent || ''));

    // "About your child" -> small fact chips in the header.
    const aboutCard = byTitle(mainCol, /عن طفلك|About your child/i);
    if (aboutCard && info && !info.querySelector('.profile-facts')) {
      const facts = document.createElement('ul'); facts.className = 'profile-facts'; facts.dataset.noTranslate = '';
      const dts = [...aboutCard.querySelectorAll('dt')];
      for (const dt of dts) {
        const dd = dt.nextElementSibling; if (!dd) continue;
        const label = dt.textContent.trim(), value = dd.textContent.trim();
        if (!value || /^(—|-|Not provided)$/i.test(value)) continue;
        let text = value;
        if (/تاريخ الميلاد|Date of birth/i.test(label)) text = (ar() ? 'مواليد ' : 'Born ') + value;
        else if (/قبل الموعد|before the expected/i.test(label)) { const girl = child?.gender === 'female'; text = /^(نعم|yes)$/i.test(value) ? (ar() ? (girl ? 'انولدت قبل موعدها' : 'انولد قبل موعده') : 'Born early') : /^(لا|no)$/i.test(value) ? (ar() ? (girl ? 'انولدت بموعدها' : 'انولد بموعده') : 'Born on time') : ''; }
        else if (/المعدل|corrected/i.test(label)) text = (ar() ? 'العمر المصحّح: ' : 'Corrected age: ') + value;
        else if (/موعد الولادة المتوقع|due date/i.test(label)) continue;
        if (!text) continue;
        const li = document.createElement('li'); li.textContent = text; facts.append(li);
      }
      const age = info.querySelector('#profileAge');
      (age || info.firstElementChild).after(facts);
    }
    if (aboutCard) aboutCard.hidden = true;

    // Sections that repeat the tabs, the Health page or the navigation.
    byTitle(mainCol, /التفاصيل الصحية|Health details/i)?.setAttribute('hidden', '');
    byTitle(side, /السجلات المفتوحة|Open records/i)?.setAttribute('hidden', '');
    document.getElementById('questionFeatureSummary')?.setAttribute('hidden', '');

    // Measurements go to the side column, above the care team.
    const measures = byTitle(mainCol, /الطول والوزن|Height and weight|Growth measurements/i);
    if (measures && measures.parentElement !== side) side.prepend(measures);

    // Child story with progress.
    const story = mainCol.querySelector('.rafiq-child-story');
    if (story && child) {
      const title = story.querySelector('h2');
      if (title) { title.dataset.noTranslate = ''; title.textContent = (ar() ? 'حكاية ' : 'About ') + (child.name || ''); }
      const rows = [...story.querySelectorAll('.rafiq-story-row')];
      let done = 0;
      rows.forEach(row => { const empty = /لسّه ما|لسا ما|لسه ما|not (yet )?(added|recorded)|no information|nothing recorded/i.test(row.querySelector('p')?.textContent || ''); row.classList.toggle('is-empty', empty); row.classList.toggle('is-done', !empty); if (!empty) done++; });
      let bar = story.querySelector('.story-progress');
      if (!bar) { bar = document.createElement('div'); bar.className = 'story-progress'; bar.dataset.noTranslate = ''; title?.after(bar); }
      bar.replaceChildren();
      const label = document.createElement('span'); label.textContent = ar() ? (done + ' من ' + rows.length + ' مكتملة') : (done + ' of ' + rows.length + ' complete');
      const track = document.createElement('span'); track.className = 'story-progress-track';
      const fill = document.createElement('span'); fill.style.width = (rows.length ? Math.round(done / rows.length * 100) : 0) + '%'; track.append(fill);
      const hint = document.createElement('small'); hint.textContent = ar() ? 'كل ما كمّلتوا الحكاية، رفيق بيقترح أنشطة وخطوات أدق لطفلكم.' : 'The more you add, the better Rafiq can suggest activities and next steps.';
      bar.append(label, track, hint);
    }
  }

  const run = () => { try { tidy(); } catch { /* keep the original layout */ } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', () => { run(); setTimeout(run, 400); });
  new MutationObserver(() => { document.querySelector('.profile-facts')?.remove(); setTimeout(run, 150); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  new MutationObserver(() => { if (document.getElementById('supportModeCard')?.parentElement?.classList.contains('profile-hero-info') === false) run(); })
    .observe(document.documentElement, { childList: true, subtree: true });
})();
