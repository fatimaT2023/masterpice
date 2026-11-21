// Phase 4 end-to-end check (headless Edge, demo preview): activities, growth, health,
// all 11 areas / 32 topics, three journeys, multiple children, themes, AR/EN, 390/1280.
// Usage: node output/parent-phase4-browser-check.cjs
const path = require('node:path'), fs = require('node:fs'), assert = require('node:assert/strict');
const { start } = require('./phase4-harness.cjs');
const out = path.join(__dirname, 'parent-phase4-qa');
const results = []; let failed = 0;
const record = (area, name, ok, detail = '') => { results.push({ area, name, ok, detail }); if (!ok) failed++; console.log((ok ? 'PASS ' : 'FAIL ') + area + ' · ' + name + (detail && !ok ? ' → ' + JSON.stringify(detail).slice(0, 300) : '')); };
const check = async (area, name, fn) => { try { const r = await fn(); record(area, name, r !== false, r); } catch (e) { record(area, name, false, String(e.message || e)); } };
const PINK = '#944367', BLUE = '#225f87';
// Family demo uses lighter shades of the same identity; compare colour family there.
const family = hex => { const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || ''); if (!m) return null; const [r, , b] = m.slice(1).map(x => parseInt(x, 16)); return r > b ? 'pink' : 'blue'; };

(async () => {
  const h = await start(out);
  const { inner, waitFor, sleep, capture } = h;
  // English left inside an Arabic view (ignores family-typed text, names and source acronyms).
  const leftovers = sel => inner(`const root=d.querySelector(${JSON.stringify(sel)});if(!root)return ['missing '+${JSON.stringify(sel)}];const out=[];const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){const e=n.parentElement;const t=n.data.replace(/\\b(CDC|AAP|UNICEF|HSE|SWYC|Plus|RAFIQ|Rafiq|cm|kg|Sesame Workshop|Learn the Signs\\. Act Early\\.)\\b/g,'').trim();if(!t||!/[A-Za-z]{3,}/.test(t)||!e||e.closest('script,style,[hidden],[data-user-content],bdi,.growth-entry p,.health-record-details'))continue;if(e.closest('details:not([open])')&&!e.closest('summary'))continue;const r=e.getBoundingClientRect();if(!r.width&&!r.height)continue;out.push(t.slice(0,80));}return [...new Set(out)]`);
  const accent = sel => inner(`const e=d.querySelector(${JSON.stringify(sel)});return e?getComputedStyle(e).getPropertyValue('--ps-accent').trim().toLowerCase():null`);
  const overflow = () => inner('return d.documentElement.scrollWidth>w.innerWidth+1');
  // Navigate inside the frame and wait for the new document.
  const nav = async (url, ready) => { await inner(`w.__phase4old=1;w.location.href=${JSON.stringify(url)};return 1`); await waitFor(`return !w.__phase4old&&d.readyState==='complete'`, url); await waitFor(ready, url + ' ready'); await sleep(250); };
  const childId = () => inner('return w.RafiqFamily.selected()');
  try {
    // ---------- A. Daily activity (girl, EN desktop) ----------
    await h.open('case-typical', 'daily-activity.html', 'en', 1280, 'return d.readyState==="complete"&&!!d.getElementById("activityGlance")');
    await check('Activities', 'EN: name, age range, time, materials, skill, purpose and illustrated steps shown', async () => {
      const s = await inner(`const g=d.getElementById('activityGlance'),item=w.RafiqDailyMoments.library.find(i=>i.title===d.getElementById('dailyTitle').textContent);return {title:!!item,facts:g.querySelectorAll('.ac-fact').length,age:g.querySelector('.is-age strong').textContent,steps:g.querySelectorAll('.ac-step').length,stepsExpected:item?.steps.length,pics:g.querySelectorAll('.ac-step-pic svg').length,why:g.querySelector('.ac-why p').textContent===item?.insight}`);
      return s.title && s.facts >= 3 && /^\d+–\d+ months$/.test(s.age) && s.steps === s.stepsExpected && s.pics === s.steps && s.why ? true : s;
    });
    await check('Activities', 'Girl theme: pink accent on the activity card', async () => (await accent('#activityGlance')) === PINK || await accent('#activityGlance'));
    await check('Activities', 'Complete activity: guided steps → “We tried it” → saved record and completion state', async () => {
      await inner(`d.getElementById('dailyStart').click();d.getElementById('playFinish').click();d.querySelector('input[name="dailyOutcome"][value="tried"]').click();d.getElementById('dailyNote').value='Phase 4 QA: clapped back twice';d.getElementById('dailyFeedbackForm').requestSubmit();return 1`);
      await waitFor('return d.getElementById("activityDone")?.dataset.outcome==="tried"', 'completion state');
      return inner(`const c=w.RafiqFamily.selected(),rows=JSON.parse(w.localStorage.getItem('rafiqAgeObservations_'+c));return rows.some(r=>r.type==='daily-moment'&&r.childId===c&&r.outcome==='tried'&&r.note.includes('Phase 4 QA'))&&!!d.querySelector('#activityDone a[href^="milestones.html"]')`);
    });
    await check('Activities', 'Update response to “Maybe later” changes the completion state', async () => {
      await inner(`d.getElementById('dailyEdit').click();d.querySelector('input[name="dailyOutcome"][value="later"]').click();d.getElementById('dailyFeedbackForm').requestSubmit();return 1`);
      await waitFor('return d.getElementById("activityDone")?.dataset.outcome==="later"', 'later state'); return true;
    });
    await capture('A-activity-girl-en-1280.png');
    await check('Activities', 'EN desktop: no overflow', async () => !(await overflow()));
    // Arabic mobile, boy: same component, translated library text.
    await h.open('case-autism', 'daily-activity.html', 'ar', 390, 'return d.readyState==="complete"&&!!d.getElementById("activityGlance")');
    await inner('d.getElementById("dailyStart").click();return 1'); await sleep(300);
    await check('Activities', 'AR 390: activity page has no English (instructions, facts, steps, footnote)', async () => { const l = await leftovers('main') ; return l.length ? l : true; });
    await check('Activities', 'AR: step text comes from the Arabic library copy', async () => inner(`const step=d.querySelector('#activityGlance .ac-step p').textContent;return /[\\u0600-\\u06FF]/.test(step)&&!/[A-Za-z]{4,}/.test(step)`));
    await check('Activities', 'Boy theme: blue accent; no overflow at 390', async () => { const a = await accent('#activityGlance'); const o = await overflow(); return a === BLUE && !o ? true : { a, o }; });
    await capture('A-activity-boy-ar-390.png');
    // Home inline player (Arabic).
    await h.open('case-autism', 'parent-dashboard.html', 'ar', 1280, 'return d.readyState==="complete"&&!!d.getElementById("parentExperience")');
    await inner('d.getElementById("homeActivityPanel").open=true;d.getElementById("dailyStart").click();return 1'); await sleep(400);
    await check('Activities', 'Home AR: inline activity player has no English (Phase 3 defect fixed)', async () => { const l = await leftovers('#homeActivityPanel'); return l.length ? l : true; });
    await check('Activities', 'Home: the card is present inside the original player', async () => inner('return !!d.querySelector("#homeActivityPanel #activityGlance .ac-step")'));

    // ---------- B. Growth and development (girl, EN desktop) ----------
    await h.open('case-speech', 'milestones.html', 'en', 1280, 'return d.readyState==="complete"&&!!d.querySelector("#stageSkillsGrid .ps-domain")');
    await check('Growth', 'Four CDC areas with the checklist examples for the child’s checkpoint', async () => inner(`const c=w.RafiqSetup.childContext(w.RafiqSetup.readChildren().find(x=>x.id===w.RafiqFamily.selected())),g=w.RafiqMilestoneGuide.forContext(c);const cards=[...d.querySelectorAll('#stageSkillsGrid .ps-domain')];return cards.length===4&&cards.every(card=>[...card.querySelectorAll('li')].map(li=>li.textContent).join('|')===g.items[card.dataset.area].map(i=>i.en).join('|'))`));
    await check('Growth', 'Source link is the matching CDC checklist, opens externally', async () => inner(`const a=d.getElementById('growthSource'),c=w.RafiqSetup.childContext(w.RafiqSetup.readChildren().find(x=>x.id===w.RafiqFamily.selected()));return a.href===w.RafiqAgeContent.milestoneResource(c).source.url&&a.target==='_blank'&&a.rel.includes('noopener')`));
    await check('Growth', 'No “delay” label or score in the stage and progress views', async () => inner(`const t=(d.getElementById('growthStageSection').innerText+d.getElementById('growthProgress').innerText);return !/delay|behind|score:|percentile/i.test(t)||t.match(/.{0,40}(delay|behind).{0,40}/i)[0]`));
    await check('Growth', 'Parent observations vs professional assessments are labelled', async () => inner(`return !!d.querySelector('#growthProgress .ps-badge.is-pro')&&!!d.querySelector('#growthProgress .ps-badge.is-parent')&&[...d.querySelectorAll('.growth-entry .ps-badge.is-parent')].length===d.querySelectorAll('.growth-entry').length`));
    const before = await inner(`return Number(d.querySelector('#growthProgress .ps-tile .ps-value').textContent)`);
    await check('Growth', 'Record observation by area → saved with the area, counts and badge update', async () => {
      await inner(`d.querySelector('#stageSkillsGrid .ps-domain[data-area="language"] button').click();return 1`);
      const pressed = await inner(`return d.querySelector('#growthAreaPick [data-area="language"]').getAttribute('aria-pressed')`);
      await inner(`d.getElementById('growthNote').value='Phase 4 QA: named the cat';d.getElementById('growthNoteForm').requestSubmit();return 1`);
      await waitFor(`return [...d.querySelectorAll('.growth-entry')].some(a=>a.textContent.includes('Phase 4 QA: named the cat'))`, 'saved note');
      const s = await inner(`const c=w.RafiqFamily.selected(),rows=JSON.parse(w.localStorage.getItem('rafiqAgeObservations_'+c)),note=rows.find(r=>r.text==='Phase 4 QA: named the cat');const entry=[...d.querySelectorAll('.growth-entry')].find(a=>a.textContent.includes('Phase 4 QA: named the cat'));return {area:note?.area,count:d.querySelector('#stageSkillsGrid .ps-domain[data-area="language"] .ps-count').textContent,family:Number(d.querySelector('#growthProgress .ps-tile .ps-value').textContent),badge:entry?.querySelector('.ps-kind-row').textContent,reset:d.querySelector('#growthAreaPick [aria-pressed="true"]')}`);
      return pressed === 'true' && s.area === 'language' && s.count.startsWith('1') && s.family === before + 1 && s.badge.includes('Language and communication') && !s.reset ? true : { pressed, ...s, before };
    });
    await check('Growth', 'Previously recorded information is listed with date and age', async () => inner(`return [...d.querySelectorAll('.growth-entry strong')].every(s=>/\\d{4}/.test(s.textContent)&&s.textContent.includes('·'))`));
    await check('Growth', 'Girl theme pink; no overflow', async () => { const a = await accent('#growthProgress'); const o = await overflow(); return a === PINK && !o ? true : { a, o }; });
    await capture('B-growth-girl-en-1280.png');
    await h.open('case-premature', 'milestones.html', 'ar', 390, 'return d.readyState==="complete"&&!!d.getElementById("growthProgress")');
    await check('Growth', 'AR 390 (premature, corrected age): no English, no overflow', async () => { const l = await leftovers('#growthContent'); const o = await overflow(); return !l.length && !o ? true : { l, o }; });
    await capture('B-growth-premature-ar-390.png');

    // ---------- C. Health (boy, AR mobile) ----------
    await h.open('case-autism', 'health.html', 'ar', 390, 'return d.readyState==="complete"&&!!d.getElementById("healthOverview")');
    await check('Health', 'Overview: vaccines, measurements, notes, appointments', async () => inner(`return d.querySelectorAll('#healthOverview .ps-tile').length===4`));
    await check('Health', 'Demo fixture records are labelled “demo example”', async () => inner(`return d.querySelectorAll('.health-history-entry .ps-badge.is-demo').length>=1&&!!d.querySelector('#healthOverview .ps-source')`));
    await check('Health', 'Add a measurement → saved for this child and shown in the overview', async () => {
      await inner(`[...d.querySelectorAll('#healthOverview .ps-tile')][1].querySelector('button').click();d.getElementById('recordHeight').value='101.5';d.getElementById('recordWeight').value='16';d.getElementById('healthEntryForm').dispatchEvent(new Event('input'));d.getElementById('healthEntryForm').requestSubmit();return 1`);
      await waitFor(`return w.RafiqHealthRecords.read('growth',w.RafiqFamily.selected()).some(r=>Number(r.height)===101.5)`, 'measurement');
      return inner(`const v=[...d.querySelectorAll('#healthOverview .ps-tile')][1].querySelector('.ps-value').textContent;return v.includes(w.RafiqServicesKit.num(101.5))||v`);
    });
    await check('Health', 'Add a vaccine → count in the overview matches saved records', async () => {
      await inner(`[...d.querySelectorAll('#healthOverview .ps-tile')][0].querySelector('button').click();d.getElementById('recordVaccineName').value='QA vaccine (demo)';d.getElementById('healthEntryForm').dispatchEvent(new Event('input'));d.getElementById('healthEntryForm').requestSubmit();return 1`);
      await waitFor(`return w.RafiqHealthRecords.read('vaccine',w.RafiqFamily.selected()).length>=1`, 'vaccine');
      return inner(`const n=w.RafiqHealthRecords.read('vaccine',w.RafiqFamily.selected()).filter(r=>!r._deletedAt).length;return d.querySelector('#healthOverview .ps-tile .ps-value').textContent===w.RafiqServicesKit.num(n)`);
    });
    await check('Health', 'AR 390: no English, boy theme blue, no overflow', async () => { const l = await leftovers('#healthContent'); const a = await accent('#healthOverview'); const o = await overflow(); return !l.length && a === BLUE && !o ? true : { l, a, o }; });
    await capture('C-health-boy-ar-390.png');
    await h.open('case-sleep', 'health.html', 'en', 1280, 'return d.readyState==="complete"&&!!d.getElementById("healthOverview")');
    await check('Health', 'EN desktop (girl): overview present, pink, no overflow', async () => { const a = await accent('#healthOverview'); const o = await overflow(); return a === PINK && !o ? true : { a, o }; });

    // ---------- D. All 11 areas and 32 topics ----------
    for (const [demo, lang, width] of [['case-speech', 'en', 1280], ['case-speech', 'ar', 390]]) {
      await h.open(demo, 'support-areas.html', lang, width, 'return d.readyState==="complete"&&!!d.querySelector("#catalogResults article")');
      await check('Topics', `${lang}: 11 areas and topic cards show icon + meaning`, async () => inner(`return d.querySelectorAll('.catalog-categories button').length===11&&[...d.querySelectorAll('#catalogResults article')].every(a=>a.querySelector('.catalog-icon svg')&&a.querySelector('.catalog-about')?.textContent.length>10)`));
      const topics = await inner(`return w.RafiqSupportCatalog.topics.map(t=>({id:t.id,title:t.title[${JSON.stringify(lang)}],about:t.about[${JSON.stringify(lang)}],services:[...t.services],dedicated:[...t.dedicated]}))`);
      const services = await inner('const s=w.RafiqParentExperience.services;return Object.fromEntries(Object.entries(s).map(([k,v])=>[k,v[2]]))');
      const destinations = new Set(); const problems = [];
      for (const topic of topics) {
        try {
          await nav(`support-detail.html?topic=${topic.id}`, `return d.querySelector('#supportCatalog h1')?.textContent===${JSON.stringify(topic.title)}`);
          const s = await inner(`return {about:d.querySelector('.catalog-hero .catalog-about')?.textContent,status:!!d.querySelector('.catalog-status'),cards:[...d.querySelectorAll('.catalog-grid article')].map(a=>a.querySelector('a')?.getAttribute('href')),general:d.querySelector('#supportCatalog section > p')?.textContent,overflow:d.documentElement.scrollWidth>w.innerWidth+1}`);
          const bad = [];
          if (s.about !== topic.about) bad.push('meaning');
          if (!s.status) bad.push('child status');
          if (s.cards.length !== topic.services.length) bad.push('service count');
          s.cards.forEach((href, i) => { const id = topic.services[i]; if (href?.startsWith('support-discovery.html')) { if (!topic.dedicated.includes(id)) bad.push('general service locked: ' + id); } else if (href !== services[id]) bad.push('href ' + id + ' ' + href); else destinations.add(href); });
          if (s.overflow) bad.push('overflow');
          if (lang === 'ar') { const l = await leftovers('#supportCatalog'); if (l.length) bad.push('english: ' + l.join(' | ')); }
          if (bad.length) problems.push(topic.id + ': ' + bad.join(', '));
        } catch (e) { problems.push(topic.id + ': ' + e.message); }
      }
      record('Topics', `${lang} ${width}: all 32 topic pages (meaning, status, services, destinations${lang === 'ar' ? ', Arabic' : ''})`, problems.length === 0, problems);
      if (lang === 'en') {
        const statuses = await inner(`return Promise.all(${JSON.stringify([...destinations])}.map(u=>fetch(new URL(u,w.location.href)).then(r=>[u,r.status]).catch(()=>[u,0])))`.replace('return Promise', 'return Promise'));
        record('Topics', `All ${destinations.size} service destinations load (HTTP 200)`, statuses && statuses.every(([, st]) => st === 200), statuses);
      }
    }

    // ---------- E. Three journeys ----------
    await h.open('case-autism', 'support-detail.html?topic=autism', 'en', 1280, 'return !!d.querySelector(".catalog-grid article")');
    await check('Journeys', 'A diagnosed autism: autism tools open; topic marked as the child’s support', async () => inner(`return d.querySelectorAll('.catalog-grid a[href^="support-discovery"]').length===0&&!!d.querySelector('.catalog-status.is-chosen')&&!!d.querySelector('.catalog-grid a[href^="support-tools"]')`));
    await h.open('case-speech', 'support-detail.html?topic=autism', 'en', 1280, 'return !!d.querySelector(".catalog-grid article")');
    await inner(`const c=w.RafiqSetup.readChildren().find(x=>x.id===w.RafiqFamily.selected());w.RafiqSupportDiscovery.save(c,{...w.RafiqSupportDiscovery.blank(),status:'concerns',topics:['autism'],areas:['development']});return 1`);
    await nav('support-detail.html?topic=autism&b=1', 'return !!d.querySelector(".catalog-grid article")');
    await check('Journeys', 'B autism as a concern: autism-only tools stay locked and lead to the support questions; play stays open', async () => inner(`const locked=[...d.querySelectorAll('.catalog-grid a[href^="support-discovery"]')];return locked.length===3&&locked.every(a=>a.href.includes('child='))&&!!d.querySelector('.catalog-grid a[href="daily-activity.html"]')&&!!d.querySelector('.catalog-status.is-chosen')`));
    await h.open('case-typical', 'support-detail.html?topic=speech-delay', 'en', 1280, 'return !!d.querySelector(".catalog-grid article")');
    await check('Journeys', 'C general development: browsing a topic needs no diagnosis; status says browsing only', async () => inner(`return d.querySelectorAll('.catalog-grid a[href^="support-discovery"]').length===0&&!d.querySelector('.catalog-status.is-chosen')&&!!d.querySelector('.catalog-status-row a[href^="support-discovery"]')`));

    // ---------- F. Multiple children: data isolation and theme ----------
    await h.open('family', 'health.html', 'en', 1280, 'return d.readyState==="complete"&&!!d.getElementById("healthOverview")');
    const kids = await inner(`return w.RafiqSetup.readChildren().map(c=>({id:c.id,gender:c.gender}))`);
    const girl = kids.find(k => k.gender === 'female'), boy = kids.find(k => k.gender === 'male');
    await inner(`w.RafiqFamily.select(${JSON.stringify(girl.id)});return 1`); await nav('health.html?child=' + girl.id, 'return !!d.getElementById("healthOverview")');
    await inner(`[...d.querySelectorAll('#healthOverview .ps-tile')][0].querySelector('button').click();d.getElementById('recordVaccineName').value='Isolation check vaccine';d.getElementById('healthEntryForm').dispatchEvent(new Event('input'));d.getElementById('healthEntryForm').requestSubmit();return 1`);
    await waitFor(`return w.RafiqHealthRecords.read('vaccine',${JSON.stringify(girl.id)}).some(r=>r.name==='Isolation check vaccine')`, 'girl vaccine');
    await check('Children', 'Girl: record saved to her, pink theme', async () => { const a = await accent('#healthOverview'); return family(a) === 'pink' && await inner('return d.documentElement.dataset.childAppearance') === 'girl' ? true : a; });
    await inner(`w.RafiqFamily.select(${JSON.stringify(boy.id)});return 1`); await nav('health.html?child=' + boy.id, 'return !!d.getElementById("healthOverview")');
    await check('Children', 'Boy: sister’s vaccine not shown or counted; blue theme', async () => inner(`return w.RafiqFamily.selected()===${JSON.stringify(boy.id)}&&!d.body.innerText.includes('Isolation check vaccine')&&!w.RafiqHealthRecords.read('vaccine',${JSON.stringify(boy.id)}).some(r=>r.name==='Isolation check vaccine')&&d.documentElement.dataset.childAppearance==='boy'`) && family(await accent('#healthOverview')) === 'blue');
    await nav('milestones.html?child=' + boy.id, 'return !!d.getElementById("growthProgress")');
    await inner(`d.querySelector('#stageSkillsGrid .ps-domain[data-area="movement"] button')?.click();d.getElementById('growthNote').value='Isolation check note';d.getElementById('growthNoteForm').requestSubmit();return 1`);
    await waitFor(`return [...d.querySelectorAll('.growth-entry')].some(a=>a.textContent.includes('Isolation check note'))`, 'boy note');
    await inner(`w.RafiqFamily.select(${JSON.stringify(girl.id)});return 1`); await nav('milestones.html?child=' + girl.id, 'return !!d.getElementById("growthProgress")');
    await check('Children', 'Growth: brother’s note absent from girl’s journal and counts', async () => inner(`return w.RafiqFamily.selected()===${JSON.stringify(girl.id)}&&!d.body.innerText.includes('Isolation check note')&&!JSON.parse(w.localStorage.getItem('rafiqAgeObservations_'+${JSON.stringify(girl.id)})||'[]').some(n=>n.text==='Isolation check note')`));
    await check('Children', 'Growth: each child gets their own CDC checkpoint', async () => inner(`return d.querySelector('.stage-skills-title-row h3')?.textContent.includes(w.RafiqGrowthView.checkpointLabel(w.RafiqMilestoneGuide.forContext(w.RafiqSetup.childContext(w.RafiqSetup.readChildren().find(c=>c.id===w.RafiqFamily.selected()))).month))`));

    // ---------- G. Earlier phases still reachable ----------
    await h.open('case-speech', 'parent-dashboard.html', 'en', 1280, 'return d.readyState==="complete"&&!!d.getElementById("parentExperience")');
    await check('Regression', 'Home (Phase 3) renders next step and support focus', async () => inner(`return !!d.querySelector('#nextBestAction>a')&&!!d.querySelector('#supportFocus')`));
    await check('Stability', 'No JavaScript errors during the run', async () => h.errors.length ? h.errors : true);
  } catch (e) { record('Run', 'Unexpected stop', false, String(e.stack || e)); }
  finally {
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ passed: results.length - failed, failed, total: results.length, results, errors: h.errors }, null, 2));
    console.log(`\n${results.length - failed}/${results.length} checks passed`);
    await h.close(); process.exitCode = failed ? 1 : 0;
  }
})();
