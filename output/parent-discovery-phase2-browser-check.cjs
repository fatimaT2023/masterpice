// Phase 2 (support discovery and summary) end-to-end check in headless Edge.
// Usage: node output/parent-discovery-phase2-browser-check.cjs
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..'), out = path.join(__dirname, 'parent-discovery-phase2-qa');
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
  const port = server.address().port, debug = 10000 + (process.pid * 5) % 20000, profile = path.join(out, 'browser-profile');
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
    if (m.method === 'Page.javascriptDialogOpening') call('Page.handleJavaScriptDialog', { accept: true }).catch(() => {});
    if (m.id && pending.has(m.id)) { const j = pending.get(m.id); clearTimeout(j.t); pending.delete(m.id); m.error ? j.rej(Error(JSON.stringify(m.error))) : j.res(m.result); }
  };
  const call = (method, params = {}) => new Promise((res, rej) => { const id = ++seq, t = setTimeout(() => rej(Error('Timed out: ' + method)), 15000); pending.set(id, { res, rej, t }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async expr => { const r = await call('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  const inner = code => evaluate(`(()=>{const w=document.getElementById('parentPreviewFrame')?.contentWindow,d=w?.document;if(!d?.documentElement)return null;${code}})()`);
  const waitFor = async (code, label) => { for (let n = 0; n < 80; n++) { try { if (await inner(code)) return; } catch {} await sleep(120); } throw Error('Not ready: ' + label + ' :: ' + await inner('return d.body?.innerText.slice(0,400)').catch(() => '')); };
  const viewport = async (width, height = 900) => { await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 }); await sleep(200); };
  const capture = async (name, height) => { const width = await evaluate('innerWidth'); if (height) await viewport(width, height); await sleep(250); fs.writeFileSync(path.join(out, name), Buffer.from((await call('Page.captureScreenshot', { format: 'png' })).data, 'base64')); if (height) await viewport(width); };
  const click = sel => inner(`const e=d.querySelector(${JSON.stringify(sel)});if(!e)throw Error('missing '+${JSON.stringify(sel)});e.click();return true`);
  const next = () => click('.disc-next');
  const stepTitle = () => inner('return d.getElementById("discTitle")?.textContent');
  const noOverflow = async label => assert.equal(await inner('return d.documentElement.scrollWidth<=w.innerWidth+1'), true, 'No horizontal overflow: ' + label);
  const saved = () => inner('const c=w.RafiqSetup.readChildren()[0];return {disc:c.supportDiscovery||null,profile:c.supportProfile||null,setup:!!c.setupCompletedAt}');
  const language = async lang => { if (await inner('return d.documentElement.lang') !== lang) await evaluate('document.getElementById("previewLanguage").click()'); await waitFor(`return d.documentElement.lang===${JSON.stringify(lang)}&&d.documentElement.dir===${JSON.stringify(lang === 'ar' ? 'rtl' : 'ltr')}`, lang); };
  // A new family completes Phase 1 (basics, then Next through the optional story).
  async function newChild(name, gender, lang, width, mention) {
    await viewport(width);
    await call('Page.navigate', { url: `http://127.0.0.1:${port}/pearent-cycel/parent-preview.html?demo=new&page=onboarding.html` });
    await waitFor('return d.readyState==="complete"&&!!d.getElementById("childForm")', 'onboarding');
    await language(lang);
    await inner(`const n=d.getElementById('childName');n.value=${JSON.stringify(name)};n.dispatchEvent(new Event('input',{bubbles:true}));d.querySelector('input[name=gender][value=${gender}]').click();d.querySelector('.basics-page:not([hidden]) [data-next]').click();const x=d.getElementById('dateOfBirth');x.value='2023-02-10';x.dispatchEvent(new Event('input',{bubbles:true}));d.querySelector('.basics-page:not([hidden]) [data-next]').click();d.querySelector('input[name=relationshipChoice][value=mother]').click();d.getElementById('createButton').click();return true`);
    await waitFor('return !d.getElementById("profileStoryInline").hidden&&!!d.querySelector("#historyFields h2")', 'story');
    for (let n = 0; n < 120; n++) {
      if (await inner(`return !!d.querySelector('#historyFields .story-summary')`)) break;
      if (mention && await inner(`return d.querySelector('#historyFields .story-section-name')?.textContent.match(/Sleep|النوم/)&&!!d.querySelector('#historyFields [data-value="support"]')`)) await click('#historyFields [data-value="support"]');
      else await inner(`d.getElementById('historyNext').click();return true`);
      await sleep(25);
    }
    await inner(`d.getElementById('historyNext').click();return true`);
    await waitFor('return w.location.pathname.endsWith("support-discovery.html")&&!!d.querySelector(".disc-status")', 'discovery');
    assert.ok(await inner('return w.location.search.includes("first=1")'), 'Story leads to discovery for a first-time family');
    assert.equal(await inner('return d.getElementById("setupSteps").hidden===false&&d.querySelectorAll("#setupSteps li")[2].getAttribute("aria-current")==="step"'), true, 'Journey bar shows step 3');
  }

  // A. Girl, English, desktop: autism diagnosis → follow-up → extra area → topic → autism exploration → summary → Home.
  await newChild('Layan', 'female', 'en', 1280, true);
  await capture('01-status-girl-en-1280.png', 1100);
  await next(); assert.ok((await inner('return d.getElementById("discoveryError").textContent')).length > 5, 'Status is explained when missing');
  await click('[data-status="diagnosed"]'); await next();
  assert.equal(await stepTitle(), 'Which diagnosis?');
  assert.equal(await inner('return d.querySelectorAll(".disc-step-diagnosis .disc-tiles .disc-tile").length'), 7, 'Seven diagnosis topics first');
  await click('details.disc-more summary'); assert.equal(await inner('return d.querySelectorAll(".disc-more .disc-chip").length'), 25, 'All other 25 topics are reachable');
  await click('.disc-more summary');
  await click('.disc-tiles [data-topic="autism"]'); await click('[data-follow="no"]');
  await inner(`const a=d.getElementById('discoveryNote');a.value='Developmental paediatrician, 2026';a.dispatchEvent(new Event('input'));return true`);
  await capture('02-diagnosis-girl-en-1280.png', 1100); await next();
  assert.equal(await inner('return d.querySelectorAll(".disc-area").length'), 12, '11 areas plus general development');
  assert.equal(await inner('return d.querySelector("[data-area=sleep]").classList.contains("is-hinted")'), true, 'Sleep is highlighted from the story');
  assert.equal(await inner('return ["emotional","sensory","genetic"].some(a=>d.querySelector(`[data-area=${a}]`).classList.contains("is-hinted"))'), false, 'Never hinted: emotional, sensory, genetic');
  assert.equal(await inner('return d.querySelector("[data-area=development]").getAttribute("aria-pressed")'), 'true', 'Diagnosis area is pre-selected');
  await click('[data-area="emotional"]'); await capture('03-areas-girl-en-1280.png', 1100);
  // Language switch keeps every answer mid-flow.
  await language('ar'); assert.equal(await inner('return d.querySelector("[data-area=emotional]").getAttribute("aria-pressed")'), 'true'); await language('en');
  await next(); await click('.disc-chips [data-topic="separation"]');
  assert.equal(await inner('return d.querySelector(".disc-chips [data-topic=autism]").disabled'), true, 'Diagnosed topic shown as fixed');
  await capture('04-topics-girl-en-1280.png', 1100); await next();
  assert.equal(await inner('return d.querySelectorAll("[data-autism]").length'), 6, 'Six autism exploration areas');
  assert.equal(await inner('return [...d.querySelectorAll("[data-priority]")].some(b=>["passport","routines","sensory","play","speech","behaviour","specialists"].includes(b.dataset.priority))'), false, 'No duplicate of the autism areas');
  for (const a of ['communication', 'routines', 'sensory']) await click(`[data-autism="${a}"]`);
  await capture('05-explore-girl-en-1280.png', 1300); await next();
  await waitFor('return !!d.querySelector(".disc-hero")', 'summary');
  let s = await saved();
  assert.equal(s.disc.status, 'diagnosed'); assert.deepEqual(s.disc.diagnosed, ['autism']); assert.equal(s.disc.diagnosisNote, 'Developmental paediatrician, 2026');
  assert.deepEqual(s.profile && [s.profile.situation, s.profile.focus], ['diagnosed_no_followup', 'autism'], 'Mapped to the existing autism support mode');
  const cards = await inner('return [...d.querySelectorAll(".disc-service")].map(c=>({id:c.dataset.service,locked:c.classList.contains("is-locked"),priority:c.classList.contains("is-priority"),link:c.querySelector("a")?.getAttribute("href")}))');
  for (const id of ['passport', 'routines', 'sensory']) assert.ok(cards.find(c => c.id === id && !c.locked && c.priority && c.link), 'Autism tool open and prioritised: ' + id);
  assert.ok(cards.find(c => c.id === 'journey'), 'Existing autism support journey offered');
  assert.ok(await inner('return [...d.querySelectorAll(".disc-spec")].map(a=>a.getAttribute("href")).includes("specialists.html?specialty=psychology")'), 'Separation worries add the psychology directory filter');
  assert.ok((await inner('return d.querySelector(".disc-lead").textContent')).startsWith('Based on the information you shared'));
  assert.ok(await inner('return /not an assessment or a diagnosis/.test(d.querySelector(".disc-disclaimer").textContent)'));
  await inner('w.scrollTo(0,0);return true'); await capture('06-summary-girl-en-1280.png', 2300); await noOverflow('summary A');
  await click('#discContinue');
  await waitFor('return w.location.pathname.endsWith("parent-dashboard.html")&&!!d.getElementById("parentExperience")', 'home');
  assert.equal((await saved()).setup, true, 'Setup is complete, so Home does not send the parent back to a welcome page');
  assert.equal(await inner('return !!d.getElementById("supportModeCard")'), true, 'Home shows the support card for the active autism choice');
  checks.push('A girl/en/1280: required status, 7+25 diagnosis topics, note and follow-up, 12 tiles with story hint (never emotional/sensory/genetic), language switch keeps answers, fixed diagnosis chip, 6 autism areas without duplicates, saved record mapped to existing autism mode, autism tools unlocked and prioritised, psychology filter, Home without welcome redirect');
  // Edit later from the child profile: summary first, then edit and return to the profile.
  await inner(`w.location.assign('child-profile.html?child='+w.RafiqSetup.readChildren()[0].id);return true`);
  await waitFor('return w.location.pathname.endsWith("child-profile.html")&&!!d.querySelector("#supportModeCard button")', 'profile');
  await click('#supportModeCard button');
  await waitFor('return w.location.pathname.endsWith("support-discovery.html")&&!!d.querySelector(".disc-hero")', 'summary from profile');
  assert.ok((await inner('return d.getElementById("discContinue").textContent')).includes('profile'), 'Edit from profile returns to the profile');
  await click('.disc-summary-actions .disc-back');
  await click('[data-status="concerns"]'); await next(); await next(); await next(); await next();
  await waitFor('return !!d.querySelector(".disc-hero")', 'resaved summary');
  s = await saved(); assert.equal(s.disc.revision, 2); assert.equal(s.profile.situation, 'worried');
  const locked = await inner('return [...d.querySelectorAll(".disc-service.is-locked")].map(c=>[c.dataset.service,!!c.querySelector("a")])');
  assert.deepEqual(locked.map(x => x[1]), locked.map(() => false), 'Locked tools show no link'); assert.ok(locked.length >= 1, 'Autism as a concern keeps autism-only tools locked');
  await click('#discContinue'); await waitFor('return w.location.pathname.endsWith("child-profile.html")', 'back to profile');
  checks.push('Edit later from the child profile: summary first, edit to "concerns", revision 2, autism-only tools locked without links, returns to the profile');

  // B. Boy, Arabic, phone: concerns → speech + sensory topics → priorities → summary, all in Arabic.
  await newChild('Omar', 'male', 'ar', 360, false);
  await capture('07-status-boy-ar-360.png', 1300); await noOverflow('status B');
  await click('[data-status="concerns"]'); await next();
  await click('[data-area="speech"]'); await click('[data-area="sensory"]'); await capture('08-areas-boy-ar-360.png', 1900); await noOverflow('areas B');
  await next(); await click('.disc-chips [data-topic="speech-delay"]'); await click('.disc-chips [data-topic="sound"]'); await capture('09-topics-boy-ar-360.png', 1300);
  await next(); await click('[data-priority="speech"]'); await click('[data-priority="play"]'); await capture('10-priorities-boy-ar-360.png', 1600); await next();
  await waitFor('return !!d.querySelector(".disc-hero")', 'summary B');
  s = await saved(); assert.deepEqual(s.disc.topics, ['speech-delay', 'sound']); assert.deepEqual(s.disc.priorities, ['speech', 'play']); assert.equal(s.profile.situation, 'worried');
  const ids = await inner('return [...d.querySelectorAll(".disc-service")].map(c=>c.dataset.service)');
  assert.deepEqual(ids.slice(0, 2).sort(), ['play', 'speech'], 'Priorities come first'); for (const id of ['specialists', 'health', 'behaviour']) assert.ok(ids.includes(id), 'Topic service ' + id);
  assert.equal(await inner('return /[A-Za-z]{4,}/.test(d.getElementById("discovery").innerText.replaceAll("Omar","").replaceAll("Plus",""))'), false, 'Summary fully in Arabic');
  assert.equal(await inner('return d.getElementById("discoveryExit").textContent'), 'روحوا للرئيسية');
  await inner('w.scrollTo(0,0);return true'); await capture('11-summary-boy-ar-360.png', 3600); await noOverflow('summary B');
  checks.push('B boy/ar/360: concerns path, speech + sensory topics, priorities first, topic services and directory, fully Arabic summary, no overflow');

  // C. Monitoring, English phone: General development pre-selected; summary lists growth, play and health.
  await newChild('Salma', 'female', 'en', 360, false);
  await click('[data-status="monitoring"]'); await next();
  assert.equal(await inner('return d.querySelector("[data-area=general]").getAttribute("aria-pressed")'), 'true');
  assert.equal(await inner('return d.querySelector(".disc-next").textContent.trim().startsWith("Next")'), true);
  for (let n = 0; n < 4 && !(await inner('return !!d.querySelector(".disc-hero")')); n++) await next();
  await waitFor('return !!d.querySelector(".disc-hero")', 'summary C');
  assert.deepEqual((await inner('return [...d.querySelectorAll(".disc-service")].map(c=>c.dataset.service)')).sort(), ['growth', 'health', 'play']);
  s = await saved(); assert.equal(s.profile.situation, 'none'); assert.equal(s.disc.monitoring, true);
  await inner('w.scrollTo(0,0);return true'); await capture('12-summary-monitoring-en-360.png', 2400);
  checks.push('C monitoring: general development pre-selected, growth/play/health only, support mode "none"');

  // D. Back to the story, then Skip for now: no support record, setup complete, Home opens.
  await newChild('Kareem', 'male', 'en', 1280, false);
  await click('.disc-back');
  await waitFor('return w.location.pathname.endsWith("onboarding.html")&&w.location.search.includes("section=story")&&d.getElementById("profileStoryInline")?.hidden===false&&!!d.querySelector("#historyFields .story-summary")', 'back to story');
  checks.push('D Back on the first question returns to the story');
  await inner('d.getElementById("historyNext").click();return true');
  await waitFor('return w.location.pathname.endsWith("support-discovery.html")&&!!d.querySelector(".disc-status")', 'discovery again');
  await click('.disc-skip');
  await waitFor('return w.location.pathname.endsWith("parent-dashboard.html")&&!!d.getElementById("parentExperience")', 'home after skip');
  s = await saved(); assert.equal(s.disc, null, 'Skip writes no support answers'); assert.equal(s.setup, true);
  assert.equal(await inner('return !!d.getElementById("supportModeCard")'), true, 'Home keeps inviting the optional support question');
  checks.push('D Skip for now: nothing saved, setup completed, Home opens and still offers the support question');

  // E. Private answer: no diagnosis fields, everything still explorable.
  await newChild('Mira', 'female', 'ar', 1280, false);
  await click('[data-status="private"]'); await next();
  assert.ok((await stepTitle()).includes('تستكشفوا'), 'Arabic optional area question');
  for (let n = 0; n < 4 && !(await inner('return !!d.querySelector(".disc-hero")')); n++) await next();
  s = await saved(); assert.equal(s.disc.status, 'private'); assert.equal(s.profile.situation, 'skipped'); assert.deepEqual(s.disc.diagnosed, []);
  checks.push('E prefer not to answer: saved as private/skipped, no diagnosis data, general resources shown');
  assert.deepEqual(errors, [], 'No JavaScript runtime exceptions');
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ passed: true, checks, runtimeErrors: errors }, null, 2));
  console.log('PASS:\n- ' + checks.join('\n- '));
  await call('Browser.close').catch(() => {}); // a slow shutdown never hides a pass
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { socket?.close(); browser?.kill(); server.close(); setTimeout(() => { try { fs.rmSync(path.join(out, 'browser-profile'), { recursive: true, force: true }); } catch {} }, 800); });
