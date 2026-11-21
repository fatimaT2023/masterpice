// Phase 3 QA matrix: 5 scenarios × Arabic/English × 360/1280 px, plus multi-child isolation.
// Records every result (pass or fail) instead of stopping at the first failure.
// Usage: node output/parent-home-phase3-qa-matrix.cjs
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..'), out = path.join(__dirname, 'parent-home-phase3-qa-matrix');
fs.mkdirSync(out, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const types = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, data) => { if (err) { res.writeHead(404); res.end(); return; } res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(data); });
});
const allow = new Set(fs.readFileSync(path.join(root, 'pearent-cycel/parent-preview.js'), 'utf8').match(/const pages=new Set\(\[(.*?)\]/)[1].match(/'([^']+)'/g).map(s => s.slice(1, -1) + '.html'));
const results = [];
const record = (scenario, combo, check, ok, detail = '') => results.push({ scenario, combo, check, ok: !!ok, detail: ok ? '' : String(detail).slice(0, 300) });
let browser, socket;
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port, debug = 10000 + (process.pid * 13) % 20000, profile = path.join(out, 'browser-profile');
  fs.rmSync(profile, { recursive: true, force: true });
  browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--remote-debugging-port=' + debug, '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let targets;
  for (let n = 0; n < 60; n++) { try { targets = await fetch('http://127.0.0.1:' + debug + '/json', { signal: AbortSignal.timeout(700) }).then(r => r.json()); if (targets.some(t => t.type === 'page')) break; } catch {} await sleep(200); }
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => socket.addEventListener('open', r, { once: true }));
  let seq = 0; const pending = new Map(); let errors = [];
  socket.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map(a => a.value || a.description).join(' '));
    if (m.id && pending.has(m.id)) { const j = pending.get(m.id); clearTimeout(j.t); pending.delete(m.id); m.error ? j.rej(Error(JSON.stringify(m.error))) : j.res(m.result); }
  };
  const call = (method, params = {}) => new Promise((res, rej) => { const id = ++seq, t = setTimeout(() => rej(Error('Timed out: ' + method)), 15000); pending.set(id, { res, rej, t }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async expr => { const r = await call('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  const inner = code => evaluate(`(()=>{const w=document.getElementById('parentPreviewFrame')?.contentWindow,d=w?.document;if(!d?.documentElement)return null;${code}})()`);
  const waitFor = async (code, label) => { for (let n = 0; n < 80; n++) { try { if (await inner(code)) return true; } catch {} await sleep(120); } throw Error('Not ready: ' + label); };
  const viewport = async (width, height = 900) => { await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 }); await sleep(200); };
  const shot = async name => { const width = await evaluate('innerWidth'), h = await inner('return Math.ceil(d.documentElement.scrollHeight)'); await viewport(width, Math.min(4200, h + 60)); await sleep(300); fs.writeFileSync(path.join(out, name), Buffer.from((await call('Page.captureScreenshot', { format: 'png' })).data, 'base64')); await viewport(width); };
  await call('Page.enable'); await call('Runtime.enable');
  const open = async (demo, lang, width) => {
    await viewport(width);
    await call('Page.navigate', { url: `http://127.0.0.1:${port}/pearent-cycel/parent-preview.html?demo=${demo}&page=parent-dashboard.html` });
    await waitFor('return d.readyState==="complete"&&!!d.getElementById("parentExperience")', demo);
    if (await inner('return d.documentElement.lang') !== lang) { await evaluate('document.getElementById("previewLanguage").click()'); await waitFor(`return d.documentElement.lang===${JSON.stringify(lang)}&&d.documentElement.dir===${JSON.stringify(lang === 'ar' ? 'rtl' : 'ltr')}&&!!d.getElementById("parentExperience")`, lang); }
    await sleep(300);
  };
  // Everything Home renders, plus what the saved data says it should render.
  const snapshot = () => inner(`
    const D=w.RafiqSupportDiscovery,id=new w.URLSearchParams(w.location.search).get('child')||w.RafiqFamily.selected(),c=w.RafiqSetup.readChildren().find(x=>x.id===id),dd=D.fromChild(c),r=d.getElementById('parentExperience');
    const expected=D.services(dd).filter(s=>!s.locked).map(s=>s.id);
    const strip=(sel)=>{const n=r.cloneNode(true);n.querySelectorAll('[data-user-content],bdi'+(sel||'')).forEach(e=>e.remove());return n.innerText;};
    return {childId:c.id,childName:c.name,gender:c.gender,saved:c.supportDiscovery||null,profile:c.supportProfile||null,autismActive:D.autismActive(dd),expectedServices:expected,expectedTopics:D.allTopics(dd),
      journey:r.dataset.journey,heading:d.querySelector('#childOverview h1').textContent,pill:d.querySelector('.hm-pill').textContent,theme:d.documentElement.dataset.childAppearance,wallpaper:w.getComputedStyle(d.body).getPropertyValue('--child-wallpaper').trim(),
      next:{title:d.querySelector('#nextBestAction h2').textContent,service:d.getElementById('nextBestAction').dataset.service,href:d.querySelector('#nextBestAction>a').getAttribute('href'),reasons:[...d.querySelectorAll('#nextBestAction .hm-reasons span')].map(s=>s.textContent.trim())},
      services:[...d.querySelectorAll('#supportFocus [data-service]')].map(e=>e.dataset.service),topics:[...d.querySelectorAll('#supportFocus [data-topic]')].map(e=>e.dataset.topic),diagnosisLabels:r.querySelectorAll('.is-diagnosis').length,
      care:[...d.querySelectorAll('#careUpdates [data-care]')].map(e=>e.dataset.care),obsShown:d.querySelector('#growthNotes .hm-stat b')?.textContent,
      obsStored:(()=>{try{return JSON.parse(w.localStorage.getItem('rafiqAgeObservations_'+c.id)||'[]').length}catch{return -1}})(),
      links:[...r.querySelectorAll('a[href]')].map(a=>({href:a.getAttribute('href'),ext:/^https?:/.test(a.getAttribute('href')),target:a.target,rel:a.rel})),
      textAll:strip(''),textNoPlayer:strip(',#homeActivityPanel'),overflow:d.documentElement.scrollWidth>w.innerWidth+1,dir:d.documentElement.dir};`);
  // Checks that apply to every scenario and combination.
  async function common(scenario, combo, s, lang) {
    record(scenario, combo, 'Next step has why / what / where', s.next.reasons.length === 3 && s.next.reasons.every(x => x.length > 3), JSON.stringify(s.next.reasons));
    record(scenario, combo, 'Theme matches child (girl=pink, boy=blue)', (s.gender === 'female' && s.theme === 'girl' && s.wallpaper === '#fce1eb') || (s.gender === 'male' && s.theme === 'boy' && s.wallpaper === '#dceefb'), `${s.gender}/${s.theme}/${s.wallpaper}`);
    record(scenario, combo, 'No horizontal overflow', !s.overflow);
    record(scenario, combo, 'Direction matches language', s.dir === (lang === 'ar' ? 'rtl' : 'ltr'), s.dir);
    record(scenario, combo, 'Support topics match saved data', JSON.stringify(s.topics) === JSON.stringify(s.expectedTopics.filter(t => t)), `shown ${s.topics} expected ${s.expectedTopics}`);
    const allowed = new Set([...s.expectedServices, ...(s.journey === 'none' ? ['play', 'growth', 'health', 'speech', 'sleep', 'feeding', 'behaviour', 'passport', 'routines', 'sensory'] : [])]);
    record(scenario, combo, 'Services come from saved choices (or story goals if skipped)', s.services.every(x => allowed.has(x)), `shown ${s.services} allowed ${[...allowed]}`);
    record(scenario, combo, 'Next-step service not repeated below', !s.next.service || !s.services.includes(s.next.service));
    record(scenario, combo, 'Autism-only tools only when eligible', s.autismActive || !s.services.some(x => ['passport', 'routines', 'sensory', 'journey'].includes(x)), s.services);
    record(scenario, combo, 'Diagnosis label only for a reported diagnosis', s.saved?.status === 'diagnosed' || (s.profile?.situation || '').startsWith('diagnosed') ? true : s.diagnosisLabels === 0, `labels ${s.diagnosisLabels}`);
    record(scenario, combo, 'Observation count = this child’s records', Number(s.obsShown?.replace(/[^\d٠-٩]/g, '').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))) === s.obsStored, `shown ${s.obsShown} stored ${s.obsStored}`);
    // Destinations: every internal link exists on disk and is allowed by the preview frame; external links are https CDC, new tab, noopener.
    const bad = [];
    for (const l of s.links) {
      if (l.ext) { if (!/^https:\/\/www\.cdc\.gov\//.test(l.href) || l.target !== '_blank' || !l.rel.includes('noopener')) bad.push('external ' + l.href); continue; }
      const page = l.href.split(/[?#]/)[0];
      if (!page) continue;
      const status = (await fetch(`http://127.0.0.1:${port}/pearent-cycel/${page}`)).status;
      if (status !== 200) bad.push(page + ' ' + status); else if (!allow.has(page)) bad.push(page + ' not in preview allow-list');
    }
    record(scenario, combo, `All ${s.links.length} destinations exist and are reachable`, !bad.length, bad.join('; '));
    if (lang === 'ar') {
      const words = (txt) => (txt.replace(/CDC|AAP|UNICEF|Plus/g, '').match(/[A-Za-z]{4,}/g) || []);
      record(scenario, combo, 'Arabic: Home text (outside the activity player) has no English', !words(s.textNoPlayer).length, words(s.textNoPlayer).join(' '));
      record(scenario, combo, 'Arabic: original activity player has no English', !words(s.textAll).length, [...new Set(words(s.textAll))].join(' '));
    } else {
      const arabic = s.textAll.match(/[\u0600-\u06ff]{3,}/g) || [];
      record(scenario, combo, 'English: no Arabic text (outside names and family notes)', !arabic.length, arabic.join(' '));
    }
    record(scenario, combo, 'No JavaScript errors', !errors.length, errors.join(' | ')); errors = [];
  }
  const combos = [['en', 1280], ['en', 360], ['ar', 1280], ['ar', 360]];
  // 1–4: each scenario on a fresh demo, in both languages and both widths.
  const scenarios = [
    ['1 Diagnosed (autism)', 'case-autism', s => {
      return [['saved: diagnosed + autism + following', s.saved?.status === 'diagnosed' && s.saved.diagnosed.includes('autism') && s.profile?.focus === 'autism'],
        ['journey = diagnosed, status = reported diagnosis', s.journey === 'diagnosed'], ['autism tools shown (eligible)', ['passport', 'routines'].every(x => s.services.includes(x) || s.next.service === x)],
        ['unread report is the next step', s.next.href.startsWith('specialist-report.html') && s.next.href.includes('booking=showcase-autism-booking')], ['report listed under Coming up', s.care.includes('report')]];
    }],
    ['2 Concerns (speech delay)', 'case-speech', s => [['saved: concerns + speech-delay + priority speech', s.saved?.status === 'concerns' && s.saved.topics.includes('speech-delay') && s.saved.priorities.includes('speech')],
      ['journey = concerns', s.journey === 'concerns'], ['priority (speech directory) is the next step', s.next.service === 'speech' && s.next.href === 'specialists.html?specialty=speech'],
      ['no diagnosis label', s.diagnosisLabels === 0], ['empty care links to speech directory', s.care.join() === 'empty' && s.links.some(l => l.href === 'specialists.html?specialty=speech')]]],
    ['3 General development', 'case-typical', s => [['saved: monitoring', s.saved?.status === 'monitoring' && s.saved.monitoring === true],
      ['journey = development', s.journey === 'development'], ['only growth / play / health', [...s.services, s.next.service].filter(Boolean).every(x => ['growth', 'play', 'health'].includes(x))],
      ['next step is activity or observation', ['daily-activity.html', 'milestones.html'].includes(s.next.href)], ['no topics, no diagnosis label', !s.topics.length && s.diagnosisLabels === 0]]],
    ['4 Skipped Phase 2', 'family', s => [['saved: no supportDiscovery; support mode "skipped"', s.saved === null && s.profile?.situation === 'skipped'],
      ['journey = none', s.journey === 'none'], ['next step opens the support questions', s.next.href.startsWith('support-discovery.html') && s.next.href.includes('edit=1')],
      ['no topics, no diagnosis label', !s.topics.length && s.diagnosisLabels === 0]]]
  ];
  for (const [name, demo, specific] of scenarios) {
    for (const [lang, width] of combos) {
      const combo = `${lang}-${width}`;
      try {
        await open(demo, lang, width); const s = await snapshot();
        for (const [check, ok] of specific(s)) record(name, combo, check, ok, JSON.stringify({ journey: s.journey, next: s.next.href, services: s.services, saved: s.saved?.status }));
        await common(name, combo, s, lang);
        if (combo === 'ar-360' || combo === 'en-1280') await shot(`${demo}-${combo}.png`);
      } catch (error) { record(name, combo, 'Scenario ran', false, error.message); }
    }
  }
  // 5: multiple children. Give each of the three children different saved data, then switch.
  for (const [lang, width] of [['en', 1280], ['ar', 360]]) {
    const combo = `${lang}-${width}`, name = '5 Multiple children';
    try {
      await open('family', lang, width);
      const plan = await inner(`const D=w.RafiqSupportDiscovery,kids=w.RafiqSetup.readChildren();
        const answers={'demo-phase1-baby':{status:'monitoring',monitoring:true},'demo-phase1-toddler':{status:'concerns',areas:['speech'],topics:['speech-delay'],priorities:['speech']},'demo-phase1-child':{status:'diagnosed',diagnosed:['down-syndrome'],following:'no',areas:['genetic']}};
        for(const k of kids){if(answers[k.id])D.save(k,{...D.blank(),...answers[k.id]});}
        const today=new Date();const iso=new Date(today.getFullYear(),today.getMonth(),today.getDate()+3).toISOString().slice(0,10);
        w.localStorage.setItem('rafiqBookings',JSON.stringify([{id:'qa-boy-booking',childId:'demo-phase1-child',date:iso,time:'10:00',status:'confirmed',specialistName:'QA specialist'}]));
        w.localStorage.setItem('rafiqAgeObservations_demo-phase1-toddler',JSON.stringify([{id:'qa1',type:'observation',text:'QA note toddler',createdAt:today.toISOString()},{id:'qa2',type:'observation',text:'QA note toddler 2',createdAt:today.toISOString()}]));
        return kids.map(k=>({id:k.id,name:k.name,gender:k.gender}));`);
      for (const kid of plan) {
        const current = await inner('return new w.URLSearchParams(w.location.search).get("child")||w.RafiqFamily.selected()');
        if (current !== kid.id) {
          await inner(`[...d.querySelectorAll('.hm-sibling')].find(b=>b.textContent.includes(${JSON.stringify(kid.name)})).click();return true`);
          await waitFor(`return new w.URLSearchParams(w.location.search).get('child')===${JSON.stringify(kid.id)}&&d.readyState==='complete'&&!!d.getElementById('parentExperience')`, 'switch ' + kid.id);
          await sleep(250);
        } else { await inner('w.location.reload();return true'); await sleep(500); await waitFor('return d.readyState==="complete"&&!!d.getElementById("parentExperience")', 'reload'); }
        const s = await snapshot(), who = kid.name + ' (' + kid.id.replace('demo-phase1-', '') + ')';
        record(name, combo, `${who}: heading, theme and pressed sibling are this child`, s.childId === kid.id && s.heading === kid.name && await inner(`return d.querySelector('.hm-sibling[aria-pressed=true]').textContent.includes(${JSON.stringify(kid.name)})`), s.heading);
        const want = { 'demo-phase1-baby': ['development', []], 'demo-phase1-toddler': ['concerns', ['speech-delay']], 'demo-phase1-child': ['diagnosed', ['down-syndrome']] }[kid.id];
        record(name, combo, `${who}: journey and topics are this child’s own`, s.journey === want[0] && JSON.stringify(s.topics) === JSON.stringify(want[1]), `${s.journey} ${s.topics}`);
        record(name, combo, `${who}: appointment shown only for the boy`, (kid.id === 'demo-phase1-child') === s.care.includes('appointment'), s.care);
        record(name, combo, `${who}: observation count is this child’s`, Number(s.obsShown?.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))) === s.obsStored, `${s.obsShown} vs ${s.obsStored}`);
        await common(name, combo + ' ' + kid.id.replace('demo-phase1-', ''), s, lang);
      }
      if (width === 360) await shot(`family-multi-${combo}.png`);
    } catch (error) { record(name, combo, 'Scenario ran', false, error.message); }
  }
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2));
  const failed = results.filter(r => !r.ok);
  console.log(`checks: ${results.length}  passed: ${results.length - failed.length}  failed: ${failed.length}`);
  for (const f of failed) console.log(`FAIL [${f.scenario} | ${f.combo}] ${f.check} :: ${f.detail}`);
  await call('Browser.close').catch(() => {});
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { socket?.close(); browser?.kill(); server.close(); setTimeout(() => { try { fs.rmSync(path.join(out, 'browser-profile'), { recursive: true, force: true }); } catch {} }, 800); });
