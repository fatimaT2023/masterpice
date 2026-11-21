// Phase 1 (registration hand-off + onboarding) end-to-end check in headless Edge.
// Usage: node output/parent-onboarding-phase1-browser-check.cjs
// Walks a brand-new demo family through the three basics screens and the nine-topic
// story in Arabic and English, at 360px and 1280px, with a girl and a boy.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..'), out = path.join(__dirname, 'parent-onboarding-phase1-qa');
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
  const port = server.address().port, debug = 10000 + (process.pid * 3) % 20000, profile = path.join(out, 'browser-profile');
  fs.rmSync(profile, { recursive: true, force: true });
  browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--remote-debugging-port=' + debug, '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let targets;
  for (let n = 0; n < 60; n++) { try { targets = await fetch('http://127.0.0.1:' + debug + '/json', { signal: AbortSignal.timeout(700) }).then(r => r.json()); if (targets.some(t => t.type === 'page')) break; } catch {} await sleep(200); }
  assert.ok(targets?.some(t => t.type === 'page'), 'Headless Edge is available');
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => socket.addEventListener('open', r, { once: true }));
  let seq = 0; const pending = new Map(), errors = [], checks = [], themes = [];
  socket.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Page.javascriptDialogOpening') call('Page.handleJavaScriptDialog', { accept: true }).catch(() => {});
    if (m.id && pending.has(m.id)) { const j = pending.get(m.id); clearTimeout(j.t); pending.delete(m.id); m.error ? j.rej(Error(JSON.stringify(m.error))) : j.res(m.result); }
  };
  const call = (method, params = {}) => new Promise((res, rej) => { const id = ++seq, t = setTimeout(() => rej(Error('Timed out: ' + method)), 15000); pending.set(id, { res, rej, t }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async expr => { const r = await call('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  const inner = code => evaluate(`(()=>{const w=document.getElementById('parentPreviewFrame')?.contentWindow,d=w?.document;if(!d?.documentElement)return null;${code}})()`);
  const waitFor = async (code, label) => { for (let n = 0; n < 70; n++) { try { if (await inner(code)) return; } catch {} await sleep(120); } throw Error('Not ready: ' + label + ' :: ' + await inner('return d.body?.innerText.slice(0,400)').catch(() => '')); };
  const viewport = async (width, height = 900) => { await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 }); await sleep(200); };
  const capture = async (name, height) => { const width = await evaluate('innerWidth'); if (height) await viewport(width, height); await sleep(200); fs.writeFileSync(path.join(out, name), Buffer.from((await call('Page.captureScreenshot', { format: 'png' })).data, 'base64')); if (height) await viewport(width); };
  const noOverflow = async label => assert.equal(await inner('return d.documentElement.scrollWidth<=w.innerWidth+1'), true, 'No horizontal overflow: ' + label);
  const visiblePage = () => inner(`return [...d.querySelectorAll('.basics-page')].findIndex(p=>!p.hidden)`);
  const theme = async (expected, label) => {
    const t = await inner(`const s=w.getComputedStyle(d.body);return {appearance:d.documentElement.dataset.childAppearance,wallpaper:s.getPropertyValue('--child-wallpaper').trim(),accent:s.getPropertyValue('--ob-accent').trim()||s.getPropertyValue('--child-theme-accent').trim(),image:w.getComputedStyle(d.querySelector('.parent-static-background')).backgroundImage,mark:w.getComputedStyle(d.querySelector('.rafiq-unified-mark')).backgroundColor,blur:w.getComputedStyle(d.querySelector('.form-card:not([hidden]), .interview-card')).backdropFilter}`);
    const want = { cream: ['#f6eef7', '#6d4f86', 'linear-gradient'], girl: ['#fce1eb', '#944367', 'baby-pink.jpg'], boy: ['#dceefb', '#225f87', 'baby-blue.jpg'] }[expected];
    assert.equal(t.appearance, expected, label + ' appearance'); assert.equal(t.wallpaper, want[0], label + ' wallpaper colour');
    assert.ok(t.image.includes(want[2]), label + ' wallpaper ' + t.image);
    assert.ok(t.blur.includes('blur('), label + ' glass blur');
    const rgb = want[1].match(/\w\w/g).map(h => parseInt(h, 16)).join(', ');
    assert.equal(t.mark, 'rgb(' + rgb + ')', label + ' brand mark follows the child colour');
    themes.push({ label, ...t });
  };
  await call('Page.enable'); await call('Runtime.enable');
  await call('Network.enable'); await call('Network.setBlockedURLs', { urls: ['*fonts.googleapis.com*', '*fonts.gstatic.com*'] });

  for (const [width, lang, gender, childName] of [[1280, 'en', 'female', 'Layan'], [360, 'ar', 'male', 'Omar'], [360, 'en', 'female', 'Salma'], [1280, 'ar', 'male', 'Kareem']]) {
    const tag = `${gender === 'female' ? 'girl' : 'boy'}-${lang}-${width}`, kind = gender === 'female' ? 'girl' : 'boy', tall = width < 500 ? 1400 : 1000;
    await viewport(width);
    await call('Page.navigate', { url: `http://127.0.0.1:${port}/pearent-cycel/parent-preview.html?demo=new&page=onboarding.html` });
    await waitFor('return d.readyState==="complete"&&!!d.getElementById("childForm")', 'onboarding');
    if (await inner('return d.documentElement.lang') !== lang) { await evaluate('document.getElementById("previewLanguage").click()'); await waitFor(`return d.documentElement.lang==="${lang}"&&d.documentElement.dir==="${lang === 'ar' ? 'rtl' : 'ltr'}"`, 'language'); }
    await sleep(300);
    assert.equal(await inner('return w.RafiqSetup.readChildren().length'), 0, 'New family starts with no child');
    // Screen 1: neutral lilac until girl/boy is chosen; both babies shown.
    await theme('cream', tag + ' before choice');
    assert.equal(await visiblePage(), 0); assert.equal(await inner('return d.querySelectorAll("#basicsTabs button:disabled").length'), 2, 'Later screens locked for a new profile');
    await capture(`01-name-empty-${tag}.png`, tall); await noOverflow(tag + ' screen 1');
    await inner(`d.querySelector('.basics-page:not([hidden]) [data-next]').click();return true`);
    assert.equal(await visiblePage(), 0, 'Empty name blocks Next');
    assert.equal(await inner('return d.getElementById("nameField").classList.contains("has-error")&&d.activeElement===d.getElementById("childName")'), true, 'Error shown and focus moved to the name');
    await inner(`const n=d.getElementById('childName');n.value=${JSON.stringify(childName)};n.dispatchEvent(new Event('input',{bubbles:true}));return true`);
    assert.equal(await inner('return d.getElementById("nameField").classList.contains("has-error")'), false, 'Error clears once the name is valid');
    await inner(`d.querySelector('input[name=gender][value=${gender}]').click();return true`); await sleep(500);
    await theme(kind, tag + ' after choice');
    assert.equal(await inner('return d.getElementById("previewName").textContent'), childName, 'Live child card shows the name');
    await capture(`02-name-chosen-${tag}.png`, tall);
    // Enter on screen 1 moves forward; it never saves half a profile.
    await inner('d.getElementById("childForm").requestSubmit();return true'); await sleep(150);
    assert.equal(await visiblePage(), 1, 'Enter moves to the birthday screen'); assert.equal(await inner('return w.RafiqSetup.readChildren().length'), 0, 'Nothing saved yet');
    // Screen 2: date errors, age preview, born-early card drives the original select and due date.
    await inner(`d.querySelector('.basics-page:not([hidden]) [data-next]').click();return true`);
    assert.equal(await visiblePage(), 1, 'Missing birthday blocks Next');
    await inner(`const x=d.getElementById('dateOfBirth');x.value='2015-01-01';x.dispatchEvent(new Event('input',{bubbles:true}));d.querySelector('.basics-page:not([hidden]) [data-next]').click();return true`);
    assert.ok((await inner('return d.getElementById("dobError").textContent')).length > 5, 'Over-seven birthday is explained');
    await inner(`const x=d.getElementById('dateOfBirth');x.value='2024-03-10';x.dispatchEvent(new Event('input',{bubbles:true}));d.querySelector('input[name=bornEarlyChoice][value=yes]').click();return true`);
    assert.equal(await inner('return d.getElementById("bornBeforeDueDate").value'), 'yes'); assert.equal(await inner('return d.getElementById("dueDateField").hidden'), false, 'Due date appears for an early birth');
    const age = await inner('return d.getElementById("previewAge").textContent');
    assert.ok(lang === 'ar' ? /[\u0600-\u06ff]/.test(age) && !/year|month/.test(age) : /year/.test(age), 'Age shown in the page language: ' + age);
    await inner(`const x=d.getElementById('expectedDueDate');x.value='2024-02-01';x.dispatchEvent(new Event('input',{bubbles:true}));d.querySelector('.basics-page:not([hidden]) [data-next]').click();return true`);
    assert.equal(await visiblePage(), 1, 'Due date before birth is rejected');
    await inner(`const x=d.getElementById('expectedDueDate');x.value='2024-04-20';d.querySelector('.basics-page:not([hidden]) [data-next]').click();return true`);
    await capture(`03-birthday-${tag}.png`, tall);
    assert.equal(await visiblePage(), 2);
    // Screen 3: relationship cards; Back keeps answers.
    await inner('d.getElementById("createButton").click();return true'); await sleep(150);
    assert.equal(await inner('return d.getElementById("relationshipField").classList.contains("has-error")'), true, 'Relationship is required');
    assert.equal(await inner('return w.RafiqSetup.readChildren().length'), 0);
    await inner(`d.querySelector('input[name=relationshipChoice][value=mother]').click();return true`);
    assert.equal(await inner('return d.getElementById("relationship").value'), 'mother');
    await inner(`d.querySelector('.basics-page:not([hidden]) [data-back]').click();return true`);
    assert.equal(await visiblePage(), 1); assert.equal(await inner('return d.getElementById("dateOfBirth").value'), '2024-03-10', 'Back keeps the birthday');
    await inner(`d.querySelector('#basicsTabs [data-goto="2"]').click();return true`); assert.equal(await visiblePage(), 2);
    await capture(`04-you-${tag}.png`, tall); await noOverflow(tag + ' screen 3');
    if (lang === 'ar') assert.equal(await inner('return /\\?{3,}/.test(d.body.innerText)'), false, 'No corrupted Arabic on the basics screens');
    // Save: same record shape as before, then straight into the story.
    await inner('d.getElementById("createButton").click();return true');
    await waitFor('return !d.getElementById("profileStoryInline").hidden&&!!d.querySelector("#historyFields h2")', 'story');
    const saved = await inner('const c=w.RafiqSetup.readChildren()[0];return {name:c.name,dob:c.dateOfBirth,gender:c.gender,relationship:c.relationship,early:c.bornBeforeDueDate,due:c.expectedDueDate,selected:w.RafiqFamily.selected()===c.id}');
    assert.deepEqual(saved, { name: childName, dob: '2024-03-10', gender, relationship: 'mother', early: 'yes', due: '2024-04-20', selected: true }, 'Saved child matches every basics answer');
    assert.equal(await inner('return !!d.querySelector("dialog.support-dialog")'), false, 'Support question no longer covers the first story question');
    assert.equal(await inner('return d.getElementById("historyExit").hidden'), true, 'No link to a profile the parent has not seen yet');
    assert.equal(await inner('return d.querySelector(".setup-steps li[aria-current=step]")===d.querySelectorAll(".setup-steps li")[1]'), true, 'Journey bar shows step 2');
    assert.equal(await inner('return d.querySelectorAll(".story-track .story-bead").length'), 9, 'Nine story topics');
    await theme(kind, tag + ' story');
    await inner('w.scrollTo(0,0);return true'); await capture(`05-story-question-${tag}.png`, width < 500 ? 1150 : 1000); await noOverflow(tag + ' story');
    // Previous on the first question returns to screen 3 of the basics.
    await inner('d.getElementById("historyPrevious").click();return true');
    await waitFor('return d.getElementById("profileStoryInline").hidden&&!d.querySelector(".journey-basics").hidden', 'back to basics');
    assert.equal(await visiblePage(), 2, 'Previous returns to the last basics screen');
    await inner('d.getElementById("createButton").click();return true');
    await waitFor('return !d.getElementById("profileStoryInline").hidden&&!!d.querySelector("#historyFields h2")', 'story again');
    assert.equal(await inner('return w.RafiqSetup.readChildren().length'), 1, 'Re-continuing edits the same child');
    // Answer About, see the checkpoint, then move on with Next only (everything optional).
    await inner(`d.querySelector('#historyFields [data-value="1"]').click();d.querySelector('#historyFields [data-value="parents"]').click();return true`);
    await waitFor('return !!d.querySelector("#historyFields .story-done")', 'checkpoint');
    await capture(`06-story-checkpoint-${tag}.png`, width < 500 ? 1000 : 1000);
    for (let n = 0; n < 80; n++) { if (await inner('return !!d.querySelector("#historyFields .interview-choices.is-multi")')) break; await inner('d.getElementById("historyNext").click();return true'); await sleep(40); }
    await inner(`d.querySelector('#historyFields [data-value="communication"]').click();return true`);
    await capture(`07-story-multi-${tag}.png`, width < 500 ? 1300 : 1000);
    for (let n = 0; n < 80; n++) { if (await inner('return !!d.querySelector("#historyFields .story-summary")')) break; await inner('d.getElementById("historyNext").click();return true'); await sleep(40); }
    assert.equal(await inner('return d.querySelectorAll("#historyFields .story-summary .family-summary dt:not(.is-empty)").length'), 4, 'Review lists only the four real answers');
    if (lang === 'ar') assert.equal(await inner('return [...d.querySelectorAll(".story-answer")].every(s=>/[\\u0600-\\u06ff]/.test(s.textContent))'), true, 'Every review answer is in Arabic');
    await inner('w.scrollTo(0,0);return true'); await capture(`08-story-review-${tag}.png`, width < 500 ? 2000 : 1500); await noOverflow(tag + ' review');
    const history = await inner('return w.RafiqSetup.readChildren()[0].backgroundHistory');
    assert.equal(history.answers['about.siblings'].value, '1'); assert.equal(history.answers['about.caregiver'].value, 'parents');
    assert.deepEqual(history.answers['play.focus'].value, ['communication']);
    await inner('d.getElementById("historyNext").click();return true');
    // Phase 2: the story continues to support discovery for this child.
    await waitFor('return w.location.pathname.endsWith("support-discovery.html")&&d.readyState==="complete"&&!!d.querySelector(".disc-status")', 'support discovery');
    assert.ok(await inner('return w.location.search.includes("child=")&&w.location.search.includes("first=1")'), 'Story ends on support discovery for this child');
    checks.push(`${tag}: lilac→${kind} theme, validation/focus, Enter safety, live card, ${lang} age, saved record, no pop-up, 9-topic story, Previous to basics, checkpoint, review hides skipped answers, continues to support discovery`);
  }

  // Editing an existing child: all screens open, cards reflect saved values, and saving returns to the profile.
  await viewport(1280);
  const id = await inner('return w.RafiqSetup.readChildren()[0].id');
  await inner(`w.location.assign('onboarding.html?edit='+encodeURIComponent(${JSON.stringify(id)})+'&section=details&return=profile');return true`);
  await waitFor('return d.readyState==="complete"&&!!d.getElementById("childForm")&&d.getElementById("childName").value==="Kareem"', 'edit');
  assert.equal(await inner('return d.querySelectorAll("#basicsTabs button:disabled").length'), 0, 'Edit mode can jump to any screen');
  assert.equal(await inner('return d.querySelector("input[name=relationshipChoice][value=mother]").checked&&d.querySelector("input[name=bornEarlyChoice][value=yes]").checked&&d.querySelector("input[name=gender][value=male]").checked'), true, 'Cards show saved values');
  await theme('boy', 'edit');
  await inner(`d.querySelector('#basicsTabs [data-goto="2"]').click();d.querySelector('input[name=relationshipChoice][value=father]').click();d.getElementById('createButton').click();return true`);
  await waitFor('return w.location.pathname.endsWith("child-profile.html")&&d.readyState==="complete"', 'profile after edit');
  assert.equal(await inner('return w.RafiqSetup.readChildren()[0].relationship'), 'father');
  checks.push('Edit mode: unlocked screens, cards prefilled from the saved child, change saved, returns to child profile');
  // This child left before finishing discovery, so Home sends a first-time family to the welcome page (existing rule).
  await inner(`w.location.assign('parent-dashboard.html');return true`);
  await waitFor('return d.readyState==="complete"&&(!!d.getElementById("parentExperience")||w.location.pathname.endsWith("getting-started.html"))&&!!d.getElementById("supportModeCard")', 'home or welcome');
  checks.push('Unfinished setup: Home opens the welcome page, which still offers the optional support question');
  assert.deepEqual(errors, [], 'No JavaScript runtime exceptions');
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ passed: true, checks, themes, runtimeErrors: errors }, null, 2));
  console.log('PASS:\n- ' + checks.join('\n- '));
  await call('Browser.close').catch(() => {}); // a slow shutdown never hides a pass
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { socket?.close(); browser?.kill(); server.close(); try { fs.rmSync(path.join(out, 'browser-profile'), { recursive: true, force: true }); } catch {} });
