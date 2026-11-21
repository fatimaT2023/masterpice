const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const out = path.join(__dirname, process.argv[2] || 'parent-complete-qa');
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
    await capture('failure.png');
    throw Error('Not ready: ' + label + ' ' + await inner('return (d.getElementById("bookingError")?.textContent||"")+" | "+d.body?.innerText.slice(-1500)'));
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
  await call('Page.navigate',{url:'http://127.0.0.1:'+port+'/pearent-cycel/parent-preview.html?demo=case-speech&page=parent-dashboard.html'});
  await waitFor('return d.readyState==="complete"&&!!d.getElementById("parentExperience")','dashboard');
  const nativeBefore=await evaluate('localStorage.getItem("rafiqChildren")');
  const go=async href=>{
    await inner('w.__parentQALeaving=true;w.location.assign('+JSON.stringify(href)+');return true');
    const expected=href.split('?')[0];
    await waitFor('return !w.__parentQALeaving&&d.readyState==="complete"&&(w.location.pathname.split("/").pop()+w.location.search)==='+JSON.stringify(href),'page '+href);
    await sleep(80);
  };
  const switchLanguage=async lang=>{
    if(await inner('return d.documentElement.lang')!==lang)await evaluate('document.getElementById("previewLanguage").click()');
    await waitFor('return d.readyState==="complete"&&d.documentElement.lang==='+JSON.stringify(lang),'language '+lang);
  };
  const chooseScenario=async key=>{
    await evaluate('(()=>{const s=document.getElementById("previewScenario");s.value='+JSON.stringify(key)+';s.dispatchEvent(new Event("change"))})()');
    await waitFor('return d.readyState==="complete"&&!!d.getElementById("parentExperience")&&w.RafiqSetup.readChildren()[0]?.demoScenario==='+JSON.stringify(key.replace('case-','')),'scenario '+key);
  };
  const fill=async(selector,value)=>inner('const el=d.querySelector('+JSON.stringify(selector)+');if(!el)throw Error("Missing field");el.value='+JSON.stringify(value)+';el.dispatchEvent(new w.Event("input",{bubbles:true}));el.dispatchEvent(new w.Event("change",{bubbles:true}));return true');
  const click=selector=>inner('const el=d.querySelector('+JSON.stringify(selector)+');if(!el)throw Error("Missing control '+selector.replaceAll('"','')+'");el.click();return true');
  const submit=selector=>inner('d.querySelector('+JSON.stringify(selector)+').requestSubmit();return true');
  const pass=label=>{checks.push(label);console.log('CHECK: '+label);};
  await switchLanguage('en');

  // All 11 categories and 32 topic pages lead to existing services.
  await go('support-areas.html');
  await waitFor('return !!d.getElementById("catalogSearch")','catalog');
  const topics=await inner('return w.RafiqSupportCatalog.topics.map(t=>({id:t.id,category:t.category}))');
  assert.equal(topics.length,32);
  const categories=[...new Set(topics.map(t=>t.category))];assert.equal(categories.length,11);
  for(const category of categories){
    await fill('#catalogCategory',category);
    assert.ok(await inner('return d.querySelectorAll("#catalogResults article").length>0'));
  }
  await fill('#catalogSearch','this-does-not-exist');
  assert.equal(await inner('return d.querySelectorAll("#catalogResults article").length'),0);
  for(const topic of topics){
    await go('support-detail.html?topic='+encodeURIComponent(topic.id));
    assert.ok(await inner('return d.querySelectorAll("#supportCatalog .catalog-result").length>0'),'Topic outcome '+topic.id);
    const links=await inner('return [...d.querySelectorAll("#supportCatalog a")].map(a=>a.getAttribute("href"))');
    for(const href of links.filter(h=>h&&!h.startsWith('#')))assert.ok(fs.existsSync(path.join(root,'pearent-cycel',href.split(/[?#]/)[0])),href);
  }
  pass('11 category filters, empty search, all 32 topic details and existing service destinations');

  await go('support-detail.html?topic=bedtime');
  await click('#supportCatalog a[href="health.html?record=note"]');
  await waitFor('return d.readyState==="complete"&&!!d.getElementById("healthEntry")&&!d.getElementById("healthEntry").hidden','topic to health note');
  await waitFor('return !!d.getElementById("parentServiceContext")&&!!d.getElementById("parentActionGuide").closest("details")','compact optional health guidance');
  await fill('#recordNoteTitle','QA sleep observation');await fill('#recordDetails','A fictional family observation for the next visit.');
  await submit('#healthEntryForm');
  await waitFor('return !d.getElementById("healthSaved").hidden','health save');
  assert.equal(await inner('return w.RafiqHealthRecords.read("note",w.RafiqFamily.selected()).some(r=>r.title==="QA sleep observation")'),true);
  await waitFor('return !!d.getElementById("parentJourneyResult")&&!d.getElementById("parentJourneyResult").hidden','health result');
  assert.equal(await inner('return d.querySelector("#parentJourneyResult [data-result-link]").getAttribute("href")'),'#healthRecordList');
  await capture('health-saved-en-desktop.png');
  pass('Topic → health note → saved record → exact result and next service');

  await go('milestones.html');
  await fill('#growthNote','QA observation: enjoyed a shared story.');await submit('#growthNoteForm');
  await waitFor('return d.getElementById("growthTimeline").textContent.includes("QA observation")','growth save');
  assert.equal(await inner('return JSON.parse(w.localStorage.getItem("rafiqAgeObservations_"+w.RafiqFamily.selected())).some(n=>n.text.includes("QA observation"))'),true);
  pass('Development observation is saved to the selected child and visible in history');

  await go('screening.html');
  await click('#topicForm input[type=radio]');await submit('#topicForm');
  for(let index=0;index<12;index++){
    if(await inner('return !d.getElementById("summaryView").hidden'))break;
    await inner('const f=d.getElementById("concernQuestionForm");for(const e of f.querySelectorAll("textarea,input[type=text]")){e.value="Fictional QA observation";e.dispatchEvent(new w.Event("input",{bubbles:true}));}for(const e of f.querySelectorAll("select")){if(e.options.length>1)e.selectedIndex=1;}const r=f.querySelector("input[type=radio]");if(r)r.click();return true');
    await submit('#concernQuestionForm');await sleep(80);
  }
  await waitFor('return !d.getElementById("summaryView").hidden','concern summary');
  assert.ok(await inner('return !!JSON.parse(w.localStorage.getItem("rafiqConcernJourney_"+w.RafiqFamily.selected()))?.answers'));
  pass('Concern questions → saved non-diagnostic summary and specialist action');

  await go('daily-activity.html');
  await waitFor('return !d.getElementById("dailyIdea").hidden','daily activity');
  await click('#dailyStart');await click('#playFinish');await click('input[name="dailyOutcome"][value="tried"]');
  await fill('#dailyNote','QA activity moment');await submit('#dailyFeedbackForm');
  await waitFor('return !d.getElementById("dailySaved").hidden','activity saved');
  await go('activities.html');
  assert.ok(await inner('return !!d.getElementById("activityHub")'));
  pass('Play steps → real saved activity response → activity library/history');

  await go('album.html');await waitFor('return !d.getElementById("openUpload").disabled','album ready');
  const photoCount=await inner('return Number(d.getElementById("photoCount").textContent)');
  await click('#openUpload');
  await inner('const bytes=Uint8Array.from(w.atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN2kAAAAASUVORK5CYII="),c=>c.charCodeAt(0));const file=new w.File([bytes],"qa-memory.png",{type:"image/png"}),transfer=new w.DataTransfer();transfer.items.add(file);const input=d.getElementById("photoFiles");input.files=transfer.files;input.dispatchEvent(new w.Event("change",{bubbles:true}));return true');
  await fill('#uploadDescription','QA fictional memory');await submit('#uploadForm');
  await waitFor('return Number(d.getElementById("photoCount").textContent)==='+String(photoCount+1),'album photo saved');
  pass('A real PNG test file is saved in the temporary child album');

  await go('specialists.html');
  await fill('#searchInput','no-match-qa-9999');
  assert.equal(await inner('return !d.getElementById("emptyState").hidden'),true);
  await click('#clearFilters');
  await go('specialist-profile.html?specialist=showcase_speech_specialist');
  await click('#clinicBook');
  await waitFor('return d.readyState==="complete"&&w.location.pathname.endsWith("booking.html")&&d.querySelectorAll(".date-button").length>0','bookable fictional schedule');
  await waitFor('return !!d.getElementById("parentJourneyResult")&&d.getElementById("parentJourneyResult").hidden','no booking success before confirmation');
  await click('.consultation-option');await click('.date-button');await click('.time-button');await fill('#bookingReason','QA selected appointment note');
  await click('#confirmBookingButton');await waitFor('return d.getElementById("appointmentReview").open','booking review');
  await click('#reviewEdit');assert.equal(await inner('return d.getElementById("bookingReason").value'),'QA selected appointment note');
  await click('#confirmBookingButton');await click('#reviewContinue');
  await waitFor('return !!d.querySelector(".sf-dialog[open]")','simulated session payment');
  await click('.sf-dialog [data-fail]');assert.equal(await inner('return JSON.parse(w.localStorage.getItem("rafiqBookings")||"[]").length'),0);
  await click('.sf-dialog [data-cancel]');
  await waitFor('return !d.getElementById("confirmBookingButton").disabled','cancel retains choices');
  await click('#confirmBookingButton');await click('#reviewContinue');
  await waitFor('return !!d.querySelector(".sf-dialog[open]")','payment retry');
  await click('.sf-dialog input[type=checkbox]');await submit('.sf-dialog form');
  await waitFor('return d.getElementById("successView").getClientRects().length>0','booking success');
  const bookingId=await inner('return JSON.parse(w.localStorage.getItem("rafiqBookings")).at(-1).id');
  assert.ok(bookingId);await capture('booking-success-en-desktop.png');
  await click('#confirmedMessageLink');
  await waitFor('return d.readyState==="complete"&&w.location.pathname.endsWith("bookings.html")','exact appointment');
  assert.equal(await inner('return new w.URLSearchParams(w.location.search).get("booking")'),bookingId);
  pass('Directory empty/reset → specialist → date/time → review/edit → failed/cancelled/retried demo payment → exact saved appointment');

  await go('ai-assistant.html');await waitFor('return !!d.getElementById("parentServiceContext")','AI guidance');
  await fill('#chatForm textarea','play ideas');await submit('#chatForm');
  await waitFor('return d.querySelectorAll(".message-row.ai").length>=2&&!!d.querySelector(".message-row.ai:last-child .parent-ai-service-link[href=\\"activities.html\\"]")','AI demo response');
  assert.ok(await inner('return d.querySelector(".message-row.ai:last-child .message-text").textContent.includes("Demo response")'));
  await fill('#chatForm textarea','Unsent QA draft');await switchLanguage('ar');
  await waitFor('return d.querySelector(".message-row.ai:last-child .message-text").textContent.includes("رد تجريبي")','Arabic generated response');
  assert.equal(await inner('return d.querySelector("#chatForm textarea").value'),'Unsent QA draft');
  await sleep(450);await capture('ai-demo-ar-desktop.png');await switchLanguage('en');
  const savedChat=await inner('return w.localStorage.getItem(w.RafiqFamily.privateChatKey(w.RafiqFamily.selected()))');
  await inner('w.localStorage.setItem(w.RafiqFamily.privateChatKey(w.RafiqFamily.selected()),"{invalid");w.__parentQALeaving=true;w.location.reload();return true');
  await waitFor('return !w.__parentQALeaving&&d.readyState==="complete"&&!!d.getElementById("parentAIStorageError")','unreadable chat preserved');
  await fill('#chatForm textarea','A retry must not overwrite existing data');await submit('#chatForm');
  assert.equal(await inner('return w.localStorage.getItem(w.RafiqFamily.privateChatKey(w.RafiqFamily.selected()))'),'{invalid');
  await inner('w.localStorage.setItem(w.RafiqFamily.privateChatKey(w.RafiqFamily.selected()),'+JSON.stringify(savedChat)+');return true');
  pass('Simulated AI response with real activity link; generated reply translates, user draft remains intact');

  await go('subscription.html');await click('#plusPlanButton');
  await waitFor('return d.readyState==="complete"&&w.location.pathname.endsWith("payment.html")','subscription checkout');
  await click('#fillDemoDetails');await click('#payButton');
  assert.equal(await inner('return w.RafiqMembership.state().active'),false,'Terms required');
  await click('#termsCheckbox');await fill('#expiryDate','01/20');await click('#payButton');
  assert.equal(await inner('return w.RafiqMembership.state().active'),false,'Expired demo card rejected');
  assert.ok(await inner('return d.getElementById("expiryError").textContent.length>0'));
  await click('#fillDemoDetails');await click('#payButton');
  await waitFor('return d.getElementById("successView").getClientRects().length>0&&w.RafiqMembership.state().active','Plus activation');
  assert.equal(await inner('return w.RafiqMembership.state().active'),true);
  assert.equal(await inner('return d.getElementById("cardNumber").value+d.getElementById("cvv").value'),'');
  await capture('subscription-success-en-desktop.png');
  await go('subscription.html');assert.equal(await inner('return w.RafiqMembership.state().active'),true);
  pass('Select Plus → review/sample details → terms validation → simulated activation → preserved family subscription status, cleared card fields');

  await go('settings.html');await fill('#parentName','QA Parent');await fill('#parentEmail','qa-parent@rafiq.example');
  await submit('#accountForm');
  assert.equal(await inner('return JSON.parse(w.localStorage.getItem(w.RafiqSetup.parentProfileKey())).name'),'QA Parent');
  pass('Account form persists valid changes using existing account storage');

  await chooseScenario('case-autism');await switchLanguage('en');
  await go('specialist-report.html?booking=showcase-autism-booking');
  const originalReports=await inner('return w.localStorage.getItem("rafiqSpecialistReports")');
  await waitFor('return !!d.getElementById("followupParentNote")','report follow-up');
  await fill('#followupParentNote','QA question after the visit');await submit('.report-followup-card form');
  assert.equal(await inner('return w.localStorage.getItem("rafiqSpecialistReports")'),originalReports);
  assert.ok(await inner('return JSON.parse(w.localStorage.getItem("rafiqAgeObservations_"+w.RafiqFamily.selected())).some(n=>n.type==="follow-up"&&n.text.includes("QA question"))'));
  await go('follow-up-request.html?specialist=showcase_speech_specialist');
  await fill('#followupIntro','QA request for follow-up');await submit('#followupForm');
  await waitFor('return !d.getElementById("followupSent").hidden','follow-up pending');
  await click('#openFollowupMessages');
  await waitFor('return d.readyState==="complete"&&w.location.pathname.endsWith("messages.html")','pending conversation');
  const thread=await inner('return new w.URLSearchParams(w.location.search).get("thread")');
  assert.ok(thread);assert.equal(await inner('return d.querySelector("#messageCompose textarea").disabled'),true,'Pending sending disabled');
  // Fixture-only acceptance represents the other role; no Specialist source or UI is changed.
  await inner('const rows=JSON.parse(w.localStorage.getItem("rafiqCareConnections"));for(const row of rows)if(row.threadId==='+JSON.stringify(thread)+'){row.status="active";row.acceptedAt=new Date().toISOString();}w.localStorage.setItem("rafiqCareConnections",JSON.stringify(rows));return true');
  await go('messages.html?thread='+encodeURIComponent(thread));
  await waitFor('return !!d.querySelector("#messageCompose textarea")&&!d.querySelector("#messageCompose textarea").disabled','accepted demo conversation');
  await fill('#messageCompose textarea','QA parent message');await submit('#messageCompose');
  await waitFor('return d.body.textContent.includes("QA parent message")','saved parent message');
  pass('Original report preserved; personal follow-up saved; request pending blocks sending; accepted demo fixture allows a real saved parent message');

  // Actual onboarding: required details, optional questionnaire, save for later.
  await evaluate('(()=>{const s=document.getElementById("previewScenario");s.value="new";s.dispatchEvent(new Event("change"))})()');
  await waitFor('return d.readyState==="complete"&&!!d.getElementById("childForm")','new family');
  await fill('#childName','QA Child');await fill('#dateOfBirth','2024-06-01');await fill('#relationship','mother');await click('input[name="gender"][value="female"]');
  await submit('#childForm');await waitFor('return !d.getElementById("historyForm").closest("[hidden]")','optional story');
  await click('#historyLater');await waitFor('return d.readyState==="complete"&&w.location.pathname.endsWith("child-profile.html")','saved child profile');
  assert.equal(await inner('return w.RafiqSetup.readChildren()[0].name'),'QA Child');
  assert.equal(await inner('return d.documentElement.dataset.childAppearance'),'girl');
  pass('New child form → optional nine-section interview → save for later → correct child profile and girl theme');

  if(process.argv.includes('--flows-only')){
    assert.equal(await evaluate('localStorage.getItem("rafiqChildren")'),nativeBefore);assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({passed:true,checks,runtimeErrors:errors},null,2));
    console.log('PASS: '+checks.length+' final transaction checks.');await call('Browser.close');return;
  }

  // Responsive/language smoke checks across all primary parent services.
  const allSweepPages=['parent-dashboard.html','child-profile.html','activities.html','daily-activity.html','milestones.html','health.html','screening.html','specialists.html','specialist-profile.html?specialist=showcase_speech_specialist','booking.html','bookings.html','specialist-report.html?booking=showcase-autism-booking','follow-up-request.html?specialist=showcase_speech_specialist','messages.html','ai-assistant.html','subscription.html','payment.html','settings.html','album.html','support-areas.html','support-detail.html?topic=speech-delay','getting-started.html','guide.html','challenges.html'];
  const sweepPages=process.argv.includes('--quick')?['health.html','booking.html','ai-assistant.html','payment.html','settings.html','parent-dashboard.html']:allSweepPages;
  const layoutFailures=[];
  for(const key of ['case-speech','case-autism']){
    await chooseScenario(key);
    for(const width of [1280,768,360]){
      await viewport(width);
      for(const lang of ['ar','en']){
        await switchLanguage(lang);
        for(const href of sweepPages){
          await go(href);
          const layout=await inner('return {width:w.innerWidth,scroll:d.documentElement.scrollWidth,dir:d.documentElement.dir,theme:d.documentElement.dataset.childAppearance}');
          if(layout.scroll>width)layoutFailures.push({page:href,width,lang,...layout});
          assert.equal(layout.theme,key==='case-speech'?'girl':'boy');
          assert.equal(layout.dir,lang==='ar'?'rtl':'ltr');
        }
        await go('health.html');await capture('health-'+key+'-'+lang+'-'+width+'.png');
      }
    }
  }
  fs.writeFileSync(path.join(out,'layout-results.json'),JSON.stringify(layoutFailures,null,2));
  assert.deepEqual(layoutFailures,[],'No horizontal page overflow');
  pass(sweepPages.length+' parent destinations at desktop/tablet/mobile, both languages and both child themes');
  assert.equal(await evaluate('localStorage.getItem("rafiqChildren")'),nativeBefore);
  assert.deepEqual(errors,[],'No runtime JavaScript exceptions');
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({passed:true,checks,runtimeErrors:errors},null,2));
  console.log('PASS: '+checks.length+' complete parent workflow checks.');
  await call('Browser.close');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>{socket?.close();browser?.kill();server.close();});
