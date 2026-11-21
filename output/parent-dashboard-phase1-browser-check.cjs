const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const out = path.join(__dirname, process.argv[2] || 'parent-dashboard-phase1-qa');
fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : file.endsWith('.svg') ? 'image/svg+xml' : 'application/octet-stream');
    res.end(data);
  });
});
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let browser, socket;
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port, debug = 10000 + process.pid % 20000;
  browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=' + debug, '--user-data-dir=' + path.join(out, 'browser-profile'), 'about:blank'
  ], { windowsHide: true, stdio: 'ignore' });
  browser.on('error', error => { throw error; });
  let targets;
  for (let n = 0; n < 60; n++) {
    try { targets = await fetch('http://127.0.0.1:' + debug + '/json', { signal: AbortSignal.timeout(700) }).then(r => r.json()); if (targets.some(t => t.type === 'page')) break; } catch {}
    await sleep(200);
  }
  assert.ok(targets?.some(t => t.type === 'page'), 'Headless Edge is available');
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let sequence = 0;
  const pending = new Map(), errors = [], checks = [];
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if (message.method === 'Page.javascriptDialogOpening') call('Page.handleJavaScriptDialog', { accept: true }).catch(() => {});
    if (message.id) {
      const job = pending.get(message.id); if (!job) return;
      clearTimeout(job.timeout); pending.delete(message.id);
      if (message.error) job.reject(Error(JSON.stringify(message.error))); else job.resolve(message.result);
    }
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence, timeout = setTimeout(() => reject(Error('Timed out: ' + method)), 12000);
    pending.set(id, { resolve, reject, timeout }); socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  const inner = code => evaluate(`(()=>{const w=document.getElementById('parentPreviewFrame')?.contentWindow,d=w?.document;if(!d?.documentElement)return null;${code}})()`);
  const waitFor = async (code, label) => {
    for (let n = 0; n < 45; n++) { if (await inner(code)) return; await sleep(120); }
    throw Error('Not ready: ' + label + ' ' + await inner('return d.body?.innerText.slice(0,700)'));
  };
  const capture = async name => {
    fs.writeFileSync(path.join(out, name), Buffer.from((await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })).data, 'base64'));
  };
  const viewport = async width => { await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false }); await sleep(160); };
  const scenario = async key => {
    await evaluate(`(()=>{const s=document.getElementById('previewScenario');s.value=${JSON.stringify('case-' + key)};s.dispatchEvent(new Event('change'))})()`);
    await waitFor(`return d.readyState==='complete'&&!!d.getElementById('parentExperience')&&w.RafiqSetup.readChildren()[0]?.demoScenario===${JSON.stringify(key)}&&w.RafiqFamily.selected()===w.RafiqSetup.readChildren()[0]?.id&&d.querySelector('#sidebarChildName')?.textContent===w.RafiqSetup.readChildren()[0]?.name&&d.querySelector('#childOverview h1')?.textContent.includes(w.RafiqSetup.readChildren()[0]?.name)`, key);
  };
  await call('Page.enable'); await call('Runtime.enable'); await call('Network.enable');
  await call('Network.setBlockedURLs', { urls: ['*fonts.googleapis.com*', '*fonts.gstatic.com*'] });
  await viewport(1280);
  await call('Page.navigate', { url: 'http://127.0.0.1:' + port + '/pearent-cycel/parent-preview.html?demo=case-autism&page=parent-dashboard.html' });
  await waitFor('return !!d.getElementById("parentExperience")', 'initial dashboard');
  const nativeChildren = await evaluate('localStorage.getItem("rafiqChildren")');
  // Phase 3: support focus replaces goal cards (1–4 services); the 11 drawers became one link to the catalog.
  assert.equal(await inner('const k=d.querySelectorAll("#supportFocus [data-service]").length;return k>=1&&k<=4'), true);
  assert.equal(await inner('return !!d.querySelector("#supportFocus a[href*=support-areas]")&&!d.getElementById("supportAreas")'), true);
  assert.equal(await inner('return d.querySelector("#nextBestAction h2").textContent.includes("?")'), false, 'Arabic copy survives UTF-8');
  assert.equal(await inner('return d.querySelector("#childOverview .hm-kicker").textContent.startsWith("رئيسية العيلة")'), true);
  assert.deepEqual(await inner('const order=["childOverview","nextBestAction","todayPlan","careUpdates","supportFocus","growthNotes","homeShortcuts"];return [...d.querySelectorAll("#parentExperience section[id]")].map(e=>e.id).filter(id=>order.includes(id))'), ['childOverview', 'nextBestAction', 'todayPlan', 'careUpdates', 'supportFocus', 'growthNotes', 'homeShortcuts']);
  assert.equal(await inner('return !!d.querySelector("#todayPlan #dailyFeedbackForm")'), true, 'Original inline activity form retained');
  assert.equal(await inner('return d.querySelectorAll(".parent-primary-nav [aria-current=page]").length'), 1);
  assert.equal(await inner('return d.documentElement.scrollWidth<=1280'), true);
  await capture('dashboard-ar-desktop.png'); checks.push('Arabic desktop hierarchy (Phase 3 order), original activity player, support focus with catalog link, single active navigation');
 await evaluate('document.getElementById("previewLanguage").click()');
  await waitFor('return d.documentElement.lang==="en"&&d.querySelector("#childOverview .hm-kicker")?.textContent.startsWith("YOUR FAMILY HOME")', 'English');
  await capture('dashboard-en-desktop.png');
  for (const [key, id] of [['sleep', 'sleep'], ['feeding', 'feeding'], ['typical', 'play'], ['premature', 'growth'], ['attention', 'behaviour']]) {
    await scenario(key);
    // Phase 3: the service appears either as the next step or in the support focus.
    await waitFor(`return d.getElementById('nextBestAction').dataset.service===${JSON.stringify(id)}||!!d.querySelector('#supportFocus [data-service="${id}"]')`, 'recommendation ' + key);
    assert.ok(await inner('return d.querySelectorAll("#supportFocus [data-service]").length<=4'));
  }
  checks.push('Sleep, feeding, typical, prematurity and attention cases reach their own services from discovery answers');
  await scenario('typical'); await viewport(360);
  assert.equal(await inner('return d.documentElement.scrollWidth<=360'), true);
  assert.ok(await inner('return d.querySelector(".parent-navigation").getBoundingClientRect().height<=90'), 'Compact mobile header');
  assert.equal(await inner('return d.getElementById("parentPrimaryNav").hidden'), true);
  await capture('dashboard-en-mobile.png');
  await inner('d.querySelector(".parent-menu-toggle").click();return true');
  assert.equal(await inner('return d.getElementById("parentPrimaryNav").hidden'), false);
  assert.equal(await inner('return w.getComputedStyle(d.querySelector(".parent-menu-toggle svg")).display'), 'block');
  await waitFor('return d.readyState==="complete"&&!!d.getElementById("parentExperience")', 'stable mobile capture');
  await capture('navigation-en-mobile.png');
  await inner('d.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Escape",bubbles:true}));return true');
  assert.equal(await inner('return d.getElementById("parentPrimaryNav").hidden'), true);
  assert.equal(await inner('return d.activeElement.classList.contains("parent-menu-toggle")'), true);
  await evaluate('document.getElementById("previewLanguage").click()');
  await waitFor('return d.documentElement.lang==="ar"&&d.querySelector("#childOverview .hm-kicker")?.textContent.startsWith("رئيسية العيلة")', 'Arabic mobile');
  await capture('dashboard-ar-mobile.png');
  assert.equal(await inner('return d.documentElement.dir'), 'rtl');
  assert.equal(await inner('return d.documentElement.scrollWidth<=360'), true);
  await waitFor(`return d.querySelector('#homeActivityPanel>summary').textContent.includes('اختياري')`, 'inline activity Arabic');
  assert.equal(await inner(`return d.getElementById('dailyStart').textContent.includes('نبلّش')`), true, 'Original player controls translate in Arabic');
  checks.push('360px AR/EN without overflow, header <=90px, mobile disclosure, Escape and focus restoration');
  // Saving and changing language must retain the original form node and its input.
  await inner('w.__originalActivity=d.getElementById("dailyFeedbackForm");d.getElementById("dailyNote").value="Draft kept";return true');
  await evaluate('document.getElementById("previewLanguage").click()');
  await waitFor('return d.documentElement.lang==="en"', 'form language change');
  assert.equal(await inner('return d.getElementById("dailyFeedbackForm")===w.__originalActivity&&d.getElementById("dailyNote").value==="Draft kept"'), true);
  await waitFor(`return d.querySelector('#homeActivityPanel>summary').textContent.includes('Optional:')`, 'inline activity English');
  assert.equal(await inner(`return d.getElementById('dailyStart').textContent==='Try this activity'`), true, 'Original player controls translate back to English');
  checks.push('Activity form identity and unsaved input survive language switch');
  await inner(`d.getElementById('homeActivityPanel').open=true;d.getElementById('dailyStart').click();d.getElementById('playFinish').click();d.querySelector('input[name="dailyOutcome"][value="tried"]').click();d.getElementById('dailyFeedbackForm').requestSubmit();return true`);
  await waitFor(`return d.querySelector('#todayPlan .experience-pill')?.textContent==='Your response is saved'`, 'saved activity');
  assert.equal(await inner(`const child=w.RafiqSetup.readChildren()[0];return JSON.parse(w.localStorage.getItem('rafiqAgeObservations_'+child.id)).some(record=>record.type==='daily-moment'&&record.outcome==='tried'&&record.note==='Draft kept')`), true);
  checks.push('Original inline player saves an actual demo activity response and refreshes dashboard status');
  // Exercise report/appointment priority using only temporary demo records.
  await inner(`const child=w.RafiqSetup.readChildren()[0],today=w.RafiqDailyMoments.dayKey();w.localStorage.setItem('rafiqBookings',JSON.stringify([{id:'phase1-today',childId:child.id,date:today,time:'11:59 PM',status:'confirmed',specialistName:'Demo specialist'}]));w.localStorage.setItem('rafiqSpecialistReports',JSON.stringify([{id:'phase1-report',childId:child.id,bookingId:'phase1-old',specialistName:'Demo specialist',createdAt:new Date().toISOString()}]));w.dispatchEvent(new w.Event('rafiq:moment-saved'));return true`);
  assert.equal(await inner('return d.querySelector("#nextBestAction>a").getAttribute("href")'), 'bookings.html?booking=phase1-today');
  await inner(`w.localStorage.setItem('rafiqBookings','[]');w.dispatchEvent(new w.Event('rafiq:moment-saved'));return true`);
  assert.ok((await inner('return d.querySelector("#nextBestAction>a").getAttribute("href")')).includes('booking=phase1-old'));
  checks.push('Today appointment precedes new report; new report opens exact child/booking');
  await inner('d.querySelector(".parent-menu-toggle").click();d.querySelector(".parent-appointments-link").click();return true');
  await waitFor('return w.location.pathname.endsWith("bookings.html")&&!!d.querySelector(".parent-appointments-link[aria-current=page]")', 'appointments navigation');
  assert.equal(await inner('return d.querySelectorAll(".parent-primary-nav [aria-current=page]").length'), 1);
  await inner(`d.querySelector('.parent-menu-toggle').click();d.querySelector('.parent-primary-nav a[href="support-areas.html"]').click();return true`);
  await waitFor('return !!d.getElementById("supportCatalog")', 'support catalog');
  assert.equal(await inner('return w.RafiqSupportCatalog.categories.length'), 11);
  assert.equal(await inner('return w.RafiqSupportCatalog.topics.length'), 32);
  // Existing child switching still selects the child and opens the correct profile.
  await inner('d.getElementById("childSwitcherButton").click();return true');
  assert.equal(await inner('return d.getElementById("childDropdown").hidden'), false);
  await inner('d.querySelector("#childDropdownList button").click();return true');
  await waitFor(`return d.readyState==='complete'&&w.location.pathname.endsWith('child-profile.html')&&d.querySelector('.parent-primary-nav a[href="child-profile.html"][aria-current=page]')`, 'child profile');
  checks.push('Child switcher opens the selected child profile with active navigation');
  // Restore identity: switch real girl/boy fixtures in one family, then navigate.
  await evaluate(`(()=>{const s=document.getElementById('previewScenario');s.value='family';s.dispatchEvent(new Event('change'))})()`);
  await waitFor(`return d.readyState==='complete'&&!!d.getElementById('parentExperience')&&w.RafiqFamily.selected()==='demo-phase1-toddler'`, 'family dashboard');
  const themeRecords = [];
  const expectedThemes = {
    girl: { id: 'demo-phase1-toddler', background: '#fce1eb', accent: '#944367', asset: 'baby-pink.jpg' },
    boy: { id: 'demo-phase1-child', background: '#dceefb', accent: '#225f87', asset: 'baby-blue.jpg' }
  };
  const checkTheme = async (gender, label) => {
    const expected = expectedThemes[gender];
    const actual = await inner(`const style=w.getComputedStyle(d.body),wallpaper=d.querySelector('.parent-static-background'),card=d.querySelector('#supportFocus'),next=d.querySelector('#nextBestAction'),heading=d.querySelector('#childOverview h1');return {id:w.RafiqFamily.selected(),appearance:d.documentElement.dataset.childAppearance,background:style.getPropertyValue('--child-wallpaper').trim(),accent:style.getPropertyValue('--child-theme-accent').trim(),wallpaper:wallpaper?w.getComputedStyle(wallpaper).backgroundImage:'',card:card?{background:w.getComputedStyle(card).backgroundColor,blur:w.getComputedStyle(card).backdropFilter}:null,nextBlur:next?w.getComputedStyle(next).backdropFilter:null,headingSize:heading?parseFloat(w.getComputedStyle(heading).fontSize):null,nav:w.getComputedStyle(d.querySelector('.parent-navigation')).backgroundImage,overflow:d.documentElement.scrollWidth>w.innerWidth}`);
    assert.equal(actual.id, expected.id, label + ' selected child');
    assert.equal(actual.appearance, gender, label + ' profile appearance');
    assert.equal(actual.background, expected.background, label + ' original wallpaper color');
    assert.equal(actual.accent, expected.accent, label + ' original accent');
    assert.ok(actual.wallpaper.includes(expected.asset), label + ' original wallpaper asset');
    assert.equal(actual.overflow, false, label + ' no horizontal overflow');
    assert.ok(actual.nav.includes('rgba('), label + ' translucent navigation');
    if (actual.card) {
      assert.ok(actual.card.background.includes('0.48'), label + ' original glass opacity');
      assert.ok(actual.card.blur.includes('blur(16px)'), label + ' real backdrop blur');
      assert.ok(actual.nextBlur?.includes('blur(20px)'), label + ' priority glass');
      assert.ok(actual.headingSize<=29, label + ' compact heading');
    }
    themeRecords.push({ gender, label, ...actual });
  };
  const navTo = async href => {
    await inner(`const nav=d.getElementById('parentPrimaryNav');if(nav.hidden)d.querySelector('.parent-menu-toggle').click();const a=[...d.querySelectorAll('.parent-primary-nav a')].find(a=>a.getAttribute('href')===${JSON.stringify(href)});if(!a)throw Error('Missing navigation');const group=a.closest('details');if(group&&!group.open)group.querySelector('summary').click();a.click();return true`);
    await waitFor(`return d.readyState==='complete'&&w.location.pathname.endsWith(${JSON.stringify(href)})&&!!d.querySelector('.parent-navigation')`, href);
  };
  const language = async lang => {
    if (await inner('return d.documentElement.lang') !== lang) await evaluate('document.getElementById("previewLanguage").click()');
    await waitFor(`return d.documentElement.lang===${JSON.stringify(lang)}&&d.documentElement.dir===${JSON.stringify(lang === 'ar' ? 'rtl' : 'ltr')}`, lang);
  };
  for (const [gender, expected] of Object.entries(expectedThemes)) {
    if (await inner('return w.RafiqFamily.selected()') !== expected.id) {
      await inner(`d.getElementById('childSwitcherButton').click();const children=w.RafiqSetup.readChildren(),index=children.findIndex(c=>c.id===${JSON.stringify(expected.id)});d.querySelectorAll('#childDropdownList button')[index].click();return true`);
      // Phase 3: switching on Home stays on Home for the selected child.
      await waitFor(`return d.readyState==='complete'&&w.location.pathname.endsWith('parent-dashboard.html')&&new w.URLSearchParams(w.location.search).get('child')===${JSON.stringify(expected.id)}&&!!d.getElementById('parentExperience')`, 'switch to ' + gender);
      await checkTheme(gender, 'home after switch');
    }
    for (const width of [1280, 360]) {
      await viewport(width);
      for (const lang of ['ar', 'en']) {
        await language(lang); await checkTheme(gender, width + 'px ' + lang);
        await inner('w.scrollTo(0,0);return true'); await sleep(80);
        await capture('identity-' + gender + '-' + lang + '-' + width + '.png');
      }
    }
    for (const href of ['child-profile.html', 'activities.html', 'bookings.html', 'support-areas.html', 'parent-dashboard.html']) {
      await navTo(href);
      if (href === 'parent-dashboard.html') await waitFor('return !!d.getElementById("parentExperience")', 'home after pages');
      await checkTheme(gender, 'navigate ' + href);
    }
  }
  // Reload the inner page: account-scoped selection and the boy theme must persist.
  await inner('w.__identityReloadMarker=true;w.location.reload();return true');
  await waitFor('return !w.__identityReloadMarker&&d.readyState==="complete"&&!!d.getElementById("parentExperience")', 'reload selected boy');
  await checkTheme('boy', 'reload dashboard');
  // Switch back to the girl in the same family, rather than reset demo data.
  await inner(`d.getElementById('childSwitcherButton').click();const index=w.RafiqSetup.readChildren().findIndex(c=>c.id==='demo-phase1-toddler');d.querySelectorAll('#childDropdownList button')[index].click();return true`);
  await waitFor(`return d.readyState==='complete'&&new w.URLSearchParams(w.location.search).get('child')==='demo-phase1-toddler'&&w.location.pathname.endsWith('parent-dashboard.html')&&!!d.getElementById('parentExperience')`, 'switch back girl');
  await checkTheme('girl', 'return girl dashboard');
  fs.writeFileSync(path.join(out, 'theme-results.json'), JSON.stringify(themeRecords, null, 2));
  checks.push('Original girl/boy wallpaper assets, exact original palette and true glass blur verified in AR/EN at 360/1280px; same-family child switching, five-page navigation, reload and switch-back preserve theme');
  // Standalone support workspaces previously omitted the common theme resources.
  await scenario('autism'); await viewport(1280);
  for (const href of ['support-journey.html', 'support-visit.html', 'support-practice.html', 'support-tools.html', 'start-guide.html']) {
    await inner(`w.location.assign(${JSON.stringify(href)});return true`);
    await waitFor(`return d.readyState==='complete'&&w.location.pathname.endsWith(${JSON.stringify(href)})&&d.body.classList.contains('parent-cycle-video')`, 'support theme ' + href);
    for (const lang of ['ar', 'en']) {
      await language(lang);
      await waitFor(`return d.readyState==='complete'&&d.documentElement.dataset.childAppearance==='boy'`, 'support language ' + lang);
      assert.equal(await inner(`return w.getComputedStyle(d.body).getPropertyValue('--child-wallpaper').trim()`), '#dceefb');
      assert.equal(await inner(`return w.getComputedStyle(d.querySelector('.parent-static-background')).backgroundImage.includes('baby-blue.jpg')`), true);
      const glass = await inner(`const card=d.querySelector('.sj-card,.start-card,.av-service');return card?{background:w.getComputedStyle(card).backgroundColor,blur:w.getComputedStyle(card).backdropFilter}:null`);
      assert.ok(glass, 'Support content is available: ' + href);
      assert.ok(glass.background.includes('0.48')&&glass.blur.includes('blur(16px)'), 'Shared glass: ' + href);
    }
    if (href === 'support-tools.html') await capture('identity-support-tools-boy-en.png');
  }
  checks.push('Five standalone support workspaces retain selected-child wallpaper and glass surfaces across AR/EN switches');
  assert.equal(await evaluate('localStorage.getItem("rafiqChildren")'), nativeChildren);
  assert.deepEqual(errors, [], 'No JavaScript runtime exceptions');
  checks.push('Appointments and support navigation, 11 categories/32 topics, no persistent child writes, no JavaScript exceptions');
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ passed: true, checks, runtimeErrors: errors }, null, 2));
  console.log('PASS: ' + checks.join('; '));
  await call('Browser.close');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  socket?.close(); browser?.kill(); server.close();
});
