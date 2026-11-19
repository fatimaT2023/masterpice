/* Growth journal: a short header that states the goal, the CDC skills for the child's
   age as something the parent can tick ("seen it" / "not yet"), a gentle prompt when
   several skills are not yet seen, and notes (timeline + form) side by side.
   Ticks are family observations saved per child; they are not a test or a diagnosis. */
(() => {
  'use strict';
  const ar = () => (document.documentElement.lang || 'ar') !== 'en';
  const x = (en, a) => (ar() ? a : en);
  const child = () => { try { const id = window.RafiqFamily?.selected?.() || new URLSearchParams(location.search).get('child'); return window.RafiqSetup.readChildren().find(c => c.id === id) || null; } catch { return null; } };
  const key = c => 'rafiqMilestoneChecks_' + c.id;
  const read = c => { try { const v = JSON.parse(localStorage.getItem(key(c)) || '{}'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
  const write = (c, v) => { try { localStorage.setItem(key(c), JSON.stringify(v)); } catch {} };

  function header(c) {
    const head = document.querySelector('header.growth-heading');
    if (!head) return;
    document.body.classList.add('growth-tidy');
    const h1 = head.querySelector('h1');
    if (h1) { h1.dataset.noTranslate = ''; h1.textContent = x((c?.name ? c.name + '’s' : 'Your child’s') + ' growth journal', 'سجل نمو ' + (c?.name || 'طفلكم')); }
    let lead = head.querySelector('.growth-lead');
    if (!lead) { lead = document.createElement('p'); lead.className = 'growth-lead'; lead.dataset.noTranslate = ''; (document.getElementById('growthChild') || h1)?.after(lead); }
    lead.textContent = x('See what most children do at this age, tick what you have noticed, and keep short notes from your day — ready to share with a doctor or specialist.', 'شوفوا شو أغلب الأطفال بيعملوا بهالعمر، علّموا اللي لاحظتوه، واكتبوا ملاحظات قصيرة من يومكم — جاهزة تشاركوها مع الطبيب أو المختص.');
  }

  function skills(c) {
    const grid = document.getElementById('stageSkillsGrid');
    if (!grid || !c) return;
    const state = read(c);
    const items = [...grid.querySelectorAll('li')];
    const ageNum = ((document.querySelector('#growthStageSection .stage-skills-title-row')?.textContent || '').match(/[0-9٠-٩]+/) || ['x'])[0].replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    for (const li of items) {
      const label0 = (li.querySelector('.gx-skill')?.textContent || li.textContent).trim();
      const area = li.closest('[data-area]')?.dataset.area || 'x', idx = [...li.parentElement.children].indexOf(li);
      const text = 'cdc' + ageNum + ':' + area + ':' + idx;
      li.dataset.skill = text;
      if (!li.querySelector('.gx-tick')) {
        const label = document.createElement('span'); label.className = 'gx-skill'; label.textContent = label0;
        const box = document.createElement('span'); box.className = 'gx-tick'; box.setAttribute('role', 'group'); box.dataset.noTranslate = '';
        for (const value of ['yes', 'not_yet']) {
          const b = document.createElement('button'); b.type = 'button'; b.dataset.value = value;
          b.addEventListener('click', () => { const s = read(c); if (s[text]?.state === value) delete s[text]; else s[text] = { state: value, at: new Date().toISOString() }; write(c, s); skills(c); });
          box.append(b);
        }
        li.replaceChildren(label, box);
      }
      const current = state[text]?.state || '';
      li.classList.toggle('is-yes', current === 'yes'); li.classList.toggle('is-not-yet', current === 'not_yet');
      li.querySelectorAll('.gx-tick button').forEach(b => { const on = b.dataset.value === current; b.setAttribute('aria-pressed', String(on)); b.textContent = b.dataset.value === 'yes' ? x('Seen it ✓', 'شفتها ✓') : x('Not yet', 'لسا'); b.setAttribute('aria-label', (b.dataset.value === 'yes' ? x('Seen it: ', 'شفتها: ') : x('Not yet: ', 'لسا: ')) + label0); });
    }
    // Summary at the top of the stage card
    const seen = items.filter(li => li.classList.contains('is-yes')).length, notYet = items.filter(li => li.classList.contains('is-not-yet')).length;
    const card = document.getElementById('growthStageSection');
    let sum = card?.querySelector('.gx-summary');
    if (card && !sum) { sum = document.createElement('div'); sum.className = 'gx-summary'; sum.dataset.noTranslate = ''; card.querySelector('.stage-skills-title-row')?.after(sum); }
    if (sum) {
      sum.replaceChildren();
      const line = document.createElement('strong'); line.textContent = x(seen + ' of ' + items.length + ' noticed', 'لاحظتوا ' + seen + ' من ' + items.length) + (notYet ? x(' · ' + notYet + ' not yet', ' · ' + notYet + ' لسا') : '');
      const bar = document.createElement('span'); bar.className = 'gx-bar'; const fill = document.createElement('span'); fill.style.width = (items.length ? Math.round(seen / items.length * 100) : 0) + '%'; bar.append(fill);
      sum.append(line, bar);
      if (notYet >= 2) {
        const note = document.createElement('p'); note.className = 'gx-note';
        note.append(x('Some skills are not showing yet. Every child has their own pace — it can help to talk it through with your doctor or a specialist. ', 'في كم مهارة لسا ما بيّنت. كل طفل إله وتيرته — ممكن يفيد تحكوها مع الطبيب أو مختص. '));
        const a = document.createElement('a'); a.href = 'screening.html'; a.textContent = x('Describe what you notice →', 'احكوا شو لاحظتوا ←'); note.append(a);
        sum.append(note);
      } else if (!seen && !notYet) {
        const hint = document.createElement('p'); hint.className = 'gx-hint'; hint.textContent = x('Tap “Seen it” or “Not yet” on each skill. It is not a test — just what you notice at home.', 'اضغطوا «شفتها» أو «لسا» على كل مهارة. مش اختبار — بس اللي بتلاحظوه بالبيت.'); sum.append(hint);
      }
    }
  }

  function layout() {
    const compose = document.querySelector('.growth-compose'), saved = document.getElementById('savedObservations'), host = document.getElementById('growthContent');
    if (!compose || !saved || !host) return;
    let grid = host.querySelector(':scope > .gx-layout');
    if (!grid) { grid = document.createElement('div'); grid.className = 'gx-layout'; const main = document.createElement('div'); main.className = 'gx-main'; const side = document.createElement('aside'); side.className = 'gx-side'; grid.append(main, side); saved.before(grid); }
    const main = grid.querySelector('.gx-main'), side = grid.querySelector('.gx-side');
    if (saved.parentElement !== main) main.append(saved);
    if (compose.parentElement !== side) side.append(compose);
  }

  function run() { try { const c = child(); header(c); skills(c); layout(); } catch { /* keep the page as it was */ } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', () => { run(); setTimeout(run, 400); setTimeout(run, 1200); });
  const watch = () => { const g = document.getElementById('stageSkillsGrid'); if (g && !g.dataset.gxWatch) { g.dataset.gxWatch = '1'; new MutationObserver(() => setTimeout(run, 30)).observe(g, { childList: true }); } };
  window.addEventListener('load', watch); setTimeout(watch, 800);
  new MutationObserver(() => setTimeout(run, 100)).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
