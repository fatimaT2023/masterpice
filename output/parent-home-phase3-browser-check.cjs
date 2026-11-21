// Phase 3 (personalised Home) end-to-end check in headless Edge.
// Usage: node output/parent-home-phase3-browser-check.cjs
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..'), out = path.join(__dirname, 'parent-home-phase3-qa');
fs.mkdirSync(out, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const types = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, data) => { if (err) { res.writeHead(404); res.end(); return; } res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(data); });
});
let browser, socket;
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port, debug = 10000 + (process.pid * 11) % 20000, profile = path.join(out, 'browser-profile');
  fs.rmSync(profile, { recursive: true, force: true });
  browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--remote-debugging-port=' + debug, '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let targets;
  for (let n = 0; n < 60; n++) { try { targets = await fetch('http://127.0.0.1:' + debug + '/json', { signal: AbortSignal.timeout(700) }).then(r => r.json()); if (targets.some(t => t.type === 'page')) break; } catch {} await sleep(200); }
  assert.ok(targets?.some(t => t.type === 'page'), 'Headless Edge is available');
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => socket.addEventListener('open', r, { once: true }));
  let seq = 0; const pending = new Map(), errors = [], checks = [];
  socket.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map(a => a.value || a.description).join(' '));
    if (m.id && pending.has(m.id)) { const j = pending.get(m.id); clearTimeout(j.t); pending.delete(m.id); m.error ? j.rej(Error(JSON.stringify(m.error))) : j.res(m.result); }
  };
  const call = (method, params = {}) => new Promise((res, rej) => { const id = ++seq, t = setTimeout(() => rej(Error('Timed out: ' + method)), 15000); pending.set(id, { res, rej, t }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async expr => { const r = await call('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  const inner = code => evaluate(`(()=>{const w=document.getElementById('parentPreviewFrame')?.contentWindow,d=w?.document;if(!d?.documentElement)return null;${code}})()`);
  const waitFor = async (code, label) => { for (let n = 0; n < 80; n++) { try { if (await inner(code)) return; } catch {} await sleep(120); } throw Error('Not ready: ' + label); };
  const viewport = async (width, height = 900) => { await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 }); await sleep(200); };
  const capture = async name => { const width = await evaluate('innerWidth'), h = await inner('return Math.ceil(d.documentElement.scrollHeight)'); await viewport(width, Math.min(4200, h + 60)); await sleep(350); fs.writeFileSync(path.join(out, name), Buffer.from((await call('Page.captureScreenshot', { format: 'png' })).data, 'base64')); await viewport(width); };
  const home = 'return d.readyState==="complete"&&!!d.getElementById("parentExperience")';
  const open = async (demo, lang, width) => {
    await viewport(width);
    await call('Page.navigate', { url: `http://127.0.0.1:${port}/pearent-cycel/parent-preview.html?demo=${demo}&page=parent-dashboard.html` });
    await waitFor(home, demo);
    if (await inner('return d.documentElement.lang') !== lang) { await evaluate('document.getElementById("previewLanguage").click()'); await waitFor(`return d.documentElement.lang===${JSON.stringify(lang)}&&!!d.getElementById("parentExperience")`, lang); }
    await sleep(250);
  };
  const state = () => inner(`const r=d.getElementById('parentExperience');return {journey:r.dataset.journey,name:d.querySelector('#childOverview h1').textContent,pill:d.querySelector('.hm-pill').textContent,theme:d.documentElement.dataset.childAppearance,next:d.querySelector('#nextBestAction h2').textContent,nextService:d.getElementById('nextBestAction').dataset.service,cta:d.querySelector('#nextBestAction>a').getAttribute('href'),reasons:[...d.querySelectorAll('#nextBestAction .hm-reasons li span')].map(s=>s.textContent.trim()),services:[...d.querySelectorAll('#supportFocus [data-service]')].map(e=>e.dataset.service),topics:[...d.querySelectorAll('#supportFocus [data-topic]')].map(e=>e.dataset.topic),diagnosisTags:d.querySelectorAll('#parentExperience .is-diagnosis').length,care:[...d.querySelectorAll('#careUpdates [data-care]')].map(e=>e.dataset.care),overflow:d.documentElement.scrollWidth>w.innerWidth+1}`);
  const reasonsOk = s => { assert.equal(s.reasons.length, 3, 'Why / what / where'); assert.ok(s.reasons.every(x => x.length > 3), 'Every reason explained'); };
  const linksOk = () => inner(`return [...d.querySelectorAll('#parentExperience a')].every(a=>{const h=a.getAttribute('href')||'';return h&&h!=='#'&&!h.startsWith('javascript')})`);
  await call('Page.enable'); await call('Runtime.enable');

  // A. Reported autism diagnosis (boy, English, desktop): existing autism tools, report first.
  await open('case-autism', 'en', 1280);
  let s = await state(); reasonsOk(s);
  assert.equal(s.journey, 'diagnosed'); assert.equal(s.pill, 'Reported diagnosis'); assert.equal(s.theme, 'boy'); assert.deepEqual(s.topics, ['autism']); assert.ok(s.diagnosisTags >= 1);
  assert.ok(s.cta.startsWith('specialist-report.html') && s.cta.includes('booking=showcase-autism-booking'), 'Unread report is the next step');
  for (const id of ['passport', 'routines']) assert.ok(s.services.includes(id), 'Existing autism tool ' + id);
  assert.ok(s.services.includes('journey'), 'Existing autism support journey shown');
  assert.ok(s.care.includes('report')); assert.equal(await linksOk(), true); assert.equal(s.overflow, false);
  assert.equal(await inner('const a=d.querySelector("#stageGuide a");return a.href.startsWith("https://www.cdc.gov/")&&a.target==="_blank"&&a.rel.includes("noopener")'), true, 'Age checklist from its public source, external');
  await capture('A-diagnosed-autism-boy-en-1280.png');
  // Reading the report moves the next step to the eligible autism support tool.
  await inner(`const r=JSON.parse(w.localStorage.getItem('rafiqSpecialistReports'))[0],c=w.RafiqSetup.readChildren()[0];w.localStorage.setItem('rafiqTodaySeenReports_'+c.id,JSON.stringify([String(r.id)+'|'+String(r.createdAt)]));w.dispatchEvent(new w.Event('rafiq:moment-saved'));return true`);
  // The existing autism journey now leads (its own rule: review the report before choosing what to practise).
  s = await state(); reasonsOk(s);
  assert.equal(await inner(`const c=w.RafiqSetup.readChildren()[0];return d.querySelector('#nextBestAction>a').getAttribute('href')===w.RafiqToday.build(c).next.url&&w.RafiqToday.build(c).next.support===true`), true, 'Next step comes from the eligible autism journey');
  assert.ok(s.reasons[0].includes('autism'), 'Why: the family recorded an autism diagnosis');
  checks.push('A diagnosed autism: reported-diagnosis status, diagnosis chip, unread report first, then the eligible autism tool; existing autism tools and journey; CDC checklist external; blue theme; no overflow');
  // Autism chosen as a concern (no diagnosis): autism-only tools stay closed and nothing is labelled a diagnosis.
  await inner(`const c=w.RafiqSetup.readChildren()[0];w.RafiqSupportDiscovery.save(c,{...w.RafiqSupportDiscovery.blank(),status:'concerns',topics:['autism'],areas:['development']});w.dispatchEvent(new w.Event('rafiq:moment-saved'));return true`);
  s = await state();
  assert.equal(s.journey, 'concerns'); assert.equal(s.diagnosisTags, 0, 'No diagnosis label for a concern');
  for (const id of ['passport', 'routines', 'sensory', 'journey']) assert.ok(!s.services.includes(id), 'Closed without a recorded diagnosis: ' + id);
  checks.push('Autism as a concern: no diagnosis label, autism-only tools and journey not shown');

  // B. Concerns without a diagnosis (girl, Arabic, phone): her priority first, never labelled.
  await open('case-speech', 'ar', 360);
  s = await state(); reasonsOk(s);
  assert.equal(s.journey, 'concerns'); assert.equal(s.pill, 'مخاوفكم'); assert.equal(s.theme, 'girl'); assert.equal(s.diagnosisTags, 0);
  assert.equal(s.nextService, 'speech'); assert.equal(s.cta, 'specialists.html?specialty=speech'); assert.ok(!s.services.includes('speech'), 'Next-step service is not repeated');
  assert.deepEqual(s.topics, ['speech-delay']); assert.deepEqual(s.care, ['empty']);
  assert.equal(await inner(`return d.querySelector('#careUpdates a').getAttribute('href')`), 'specialists.html?specialty=speech', 'Empty care state points to the relevant directory');
  assert.equal(await inner(`const r=d.getElementById('parentExperience').cloneNode(true);r.querySelectorAll('[data-user-content],bdi,#homeActivityPanel').forEach(e=>e.remove());/* the original activity player is checked in Phase 4 */return /[A-Za-z]{4,}/.test(r.innerText.replace(/CDC|AAP|UNICEF|Plus/g,''))`), false, 'Home fully in Arabic');
  assert.equal(s.overflow, false); await capture('B-concerns-speech-girl-ar-360.png');
  checks.push('B concerns: "your concerns" status, no diagnosis label, chosen priority (speech directory) as next step and not repeated, topic chip, relevant empty-state link, fully Arabic, pink, 360px');

  // C. General development (girl, English, phone): age resources, activity, growth tracking.
  await open('case-typical', 'en', 360);
  s = await state(); reasonsOk(s);
  assert.equal(s.journey, 'development'); assert.equal(s.pill, 'Following general development'); assert.deepEqual(s.topics, []);
  assert.deepEqual([...s.services].sort(), ['growth', 'health', 'play'].filter(x => x !== s.nextService).sort());
  assert.ok(['daily-activity.html', 'milestones.html'].includes(s.cta), 'Activity or observation as next step');
  assert.equal(await inner('return !!d.getElementById("stageGuide")&&!!d.querySelector("#growthNotes .hm-stats")&&d.querySelectorAll("#growthNotes .hm-notes li").length>=1'), true, 'Growth tracking and saved observations');
  assert.equal(s.overflow, false); await capture('C-development-girl-en-360.png');
  checks.push('C general development: status, growth/play/health only, activity or observation next step, stage checklist, growth counts and recent observations');

  // D. Family that skipped discovery (Arabic desktop): invitation, then completed discovery, and sibling isolation.
  await open('family', 'ar', 1280);
  s = await state(); reasonsOk(s);
  assert.equal(s.journey, 'none'); assert.ok(s.cta.startsWith('support-discovery.html') && s.cta.includes('edit=1'), 'Skipped discovery: next step invites the support questions');
  assert.equal(await inner('return d.querySelectorAll(".hm-sibling").length'), 3);
  await capture('D-skipped-family-ar-1280.png');
  // Completing discovery for this child (saved through the Phase 2 model) changes Home on the next load.
  await inner(`const c=w.RafiqSetup.readChildren().find(x=>x.id===w.RafiqFamily.selected());w.RafiqSupportDiscovery.save(c,{...w.RafiqSupportDiscovery.blank(),status:'concerns',areas:['sleep'],topics:['bedtime'],priorities:['sleep']});w.location.reload();return true`);
  await sleep(600); await waitFor(home, 'reload');
  s = await state(); assert.equal(s.journey, 'concerns'); assert.deepEqual(s.topics, ['bedtime']); assert.equal(s.nextService, 'sleep');
  const girl = s.name;
  // Give the boy different answers, then switch: everything must follow the selected child only.
  await inner(`const boy=w.RafiqSetup.readChildren().find(x=>x.id==='demo-phase1-child');w.RafiqSupportDiscovery.save(boy,{...w.RafiqSupportDiscovery.blank(),status:'diagnosed',diagnosed:['down-syndrome'],following:'no',areas:['genetic']});return true`);
  await inner(`[...d.querySelectorAll('.hm-sibling')].find(b=>b.getAttribute('aria-pressed')==='false'&&b.textContent.includes(w.RafiqSetup.readChildren().find(x=>x.id==='demo-phase1-child').name)).click();return true`);
  await waitFor(`return new w.URLSearchParams(w.location.search).get('child')==='demo-phase1-child'&&d.readyState==='complete'&&!!d.getElementById('parentExperience')`, 'switched to boy');
  s = await state();
  assert.equal(s.theme, 'boy'); assert.notEqual(s.name, girl); assert.equal(s.journey, 'diagnosed'); assert.deepEqual(s.topics, ['down-syndrome']); assert.ok(!s.topics.includes('bedtime'), 'No data from the sister');
  assert.equal(await inner('return d.querySelector(".hm-sibling[aria-pressed=true]").textContent.includes(d.querySelector("#childOverview h1").textContent)'), true);
  for (const id of ['growth', 'health', 'speech']) assert.ok(s.services.includes(id) || s.nextService === id, 'Down syndrome catalog service ' + id);
  await capture('D-switched-boy-diagnosed-ar-1280.png');
  await inner(`[...d.querySelectorAll('.hm-sibling')].find(b=>b.textContent.includes(${JSON.stringify(girl)})).click();return true`);
  await waitFor(`return new w.URLSearchParams(w.location.search).get('child')!=='demo-phase1-child'&&d.readyState==='complete'&&!!d.getElementById('parentExperience')&&d.querySelector('#childOverview h1').textContent===${JSON.stringify(girl)}`, 'switched back');
  s = await state(); assert.equal(s.theme, 'girl'); assert.deepEqual(s.topics, ['bedtime']);
  checks.push('D skipped discovery: invitation as next step; completed discovery changes Home; sibling switch updates theme, name, journey, topics and services with no data from the other child; switch back restores');
  // Edit link opens the Phase 2 summary for this child and returns Home.
  assert.ok((await inner('return d.querySelector("#childOverview .hm-status a").getAttribute("href")')).startsWith('support-discovery.html?child='));
  assert.deepEqual(errors, [], 'No JavaScript errors');
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ passed: true, checks, runtimeErrors: errors }, null, 2));
  console.log('PASS:\n- ' + checks.join('\n- '));
  await call('Browser.close').catch(() => {});
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { socket?.close(); browser?.kill(); server.close(); setTimeout(() => { try { fs.rmSync(path.join(out, 'browser-profile'), { recursive: true, force: true }); } catch {} }, 800); });
