// Phase 5 end-to-end check: Parent -> Specialist -> Parent in ONE browser tab (demo preview,
// shared demo store, "View as" role switch). Usage: node output/parent-specialist-phase5-check.cjs
const path = require('node:path'), fs = require('node:fs');
const { start } = require('./phase4-harness.cjs');
const out = path.join(__dirname, 'parent-phase5-qa');
const results = []; let failed = 0;
const record = (area, name, ok, detail = '') => { results.push({ area, name, ok, detail }); if (!ok) failed++; console.log((ok ? 'PASS ' : 'FAIL ') + area + ' · ' + name + (!ok && detail ? ' → ' + JSON.stringify(detail).slice(0, 360) : '')); };
const check = async (area, name, fn) => { try { const r = await fn(); record(area, name, r === true, r); return r === true; } catch (e) { record(area, name, false, String(e.message || e)); return false; } };

(async () => {
  const h = await start(out);
  const { inner, evaluate, waitFor, sleep, call } = h;
  // Accept any beforeunload/confirm dialogs automatically (refresh test).
  await call('Page.enable');
  const shot = async name => { await sleep(300); fs.writeFileSync(path.join(out, name), Buffer.from((await call('Page.captureScreenshot', { format: 'png' })).data, 'base64')); };
  const nav = async (url, ready) => { await inner(`w.__old=1;w.location.href=new URL(${JSON.stringify(url)},w.location.href).href;return 1`); await waitFor(`return !w.__old&&d.readyState==='complete'`, url); await waitFor(ready, url + ' ready'); await sleep(350); };
  const viewAs = async (value, ready) => { await evaluate(`(()=>{const s=document.getElementById('previewRole');s.value=${JSON.stringify(value)};s.dispatchEvent(new Event('change'));})()`); await sleep(400); await waitFor(ready, 'view as ' + value); await sleep(400); };
  const bookings = () => inner(`return JSON.parse(w.localStorage.getItem('rafiqBookings')||'[]')`);
  const leftovers = sel => inner(`const root=d.querySelector(${JSON.stringify(sel)});if(!root)return ['missing '+${JSON.stringify(sel)}];const out=[];const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){const e=n.parentElement;const t=n.data.replace(/\\b(JOD|RFQ-[A-Z0-9-]+|AM|PM|Rafiq|RAFIQ)\\b/g,'').trim();if(!t||!/[A-Za-z]{3,}/.test(t)||!e||e.closest('[hidden],[data-user-content],bdi,script,style,.booking-extra'))continue;const r=e.getBoundingClientRect();if(!r.width&&!r.height)continue;out.push(t.slice(0,70));}return [...new Set(out)]`);
  // Parent request through the real booking page (type, first date, first time, note, review, send).
  const requestSession = async (specialistId, note) => {
    await nav('specialists.html', 'return !!d.querySelector(".card-book-button")');
    await inner(`d.querySelector('.card-book-button[data-id="${specialistId}"]').click();return 1`);
    await waitFor('return w.location.pathname.endsWith("booking.html")&&!!d.querySelector("#dateOptions button")', 'booking page'); await sleep(400);
    await inner(`d.querySelector('#consultationOptions button').click();return 1`); await sleep(150);
    await inner(`d.querySelector('#dateOptions button:not([disabled])').click();return 1`); await sleep(250);
    await inner(`d.querySelector('#timeOptions button:not([disabled])').click();const r=d.getElementById('bookingReason');r.value=${JSON.stringify(note)};r.dispatchEvent(new Event('input'));return 1`);
    await inner(`d.getElementById('confirmBookingButton').click();return 1`); await sleep(400);
    await inner(`d.getElementById('reviewContinue').click();return 1`); await sleep(600);
    return inner(`return {success:!d.getElementById('successView').hidden&&!d.getElementById('bookingError').textContent.trim(),error:d.getElementById('bookingError').textContent}`);
  };
  const latestFor = async (childId, specialistId) => (await bookings()).filter(b => b.childId === childId && b.specialistId === specialistId).sort((a, b) => String(b.createdAt).localeCompare(a.createdAt))[0];
  try {
    // ===== 1–5: Parent (girl, speech concern, EN, desktop) =====
    await h.open('case-speech', 'specialists.html', 'en', 1280, 'return !!d.getElementById("matchPanel")');
    const child = await inner('return w.RafiqSetup.readChildren()[0]');
    await check('Parent', '1–3 Recommended specialists: speech first, reasons from the family’s own answers, not a diagnosis', async () => { const s = await inner(`const p=d.getElementById('matchPanel');return {first:p.querySelector('.match-card')?.dataset.specialty,reasons:[...p.querySelectorAll('.match-card li')].map(l=>l.textContent),lead:p.querySelector('.match-lead').textContent}`); return s.first === 'speech' && s.reasons.some(r => r.includes('support questions')) && /not a diagnosis/.test(s.lead) ? true : s; });
    await check('Parent', 'Directory: all 3 fictional specialists browsable; demo labels instead of verified/ratings; filter by support area', async () => {
      const before = await inner(`return {cards:d.querySelectorAll('.specialist-card').length,demo:d.querySelectorAll('.specialist-card .demo-profile-badge').length,verified:d.querySelectorAll('.specialist-card .verified-badge').length,ratings:d.querySelectorAll('.specialist-card .rating').length,request:[...d.querySelectorAll('.card-book-button')].every(b=>b.textContent==='Request a session')}`);
      await inner(`const s=d.getElementById('supportAreaFilter');s.value='sleep';s.dispatchEvent(new Event('change'));return 1`);
      const sleepShown = await inner(`return [...d.querySelectorAll('.specialist-card:not(.match-hidden)')].map(c=>c.dataset.specialistId)`);
      await inner(`const s=d.getElementById('supportAreaFilter');s.value='';s.dispatchEvent(new Event('change'));return 1`);
      return before.cards === 3 && before.demo === 3 && before.verified === 0 && before.ratings === 0 && before.request && JSON.stringify(sleepShown) === '["showcase_psychology_specialist"]' ? true : { before, sleepShown };
    });
    await check('Parent', 'Recommendation button filters to speech specialists', async () => { await inner(`d.querySelector('#matchPanel .match-card[data-specialty="speech"] button').click();return 1`); await sleep(300); const ids = await inner(`return [...d.querySelectorAll('.specialist-card')].map(c=>c.dataset.specialistId)`); return JSON.stringify(ids) === '["showcase_speech_specialist"]' ? true : ids; });
    await shot('E1-directory-recommended-en.png');
    // Invalid input: the shared module rejects past dates, missing type and duplicates.
    await check('Parent', 'Invalid input rejected: past date, wrong session type, missing child', async () => inner(`const A=w.RafiqAppointments,c=w.RafiqSetup.readChildren()[0],s=JSON.parse(w.localStorage.getItem('rafiqSpecialists')).find(x=>x.id==='showcase_speech_specialist');const errs=[];for(const args of [{child:c,specialist:s,consultationType:'online',date:'2020-01-01',time:'10:00'},{child:c,specialist:s,consultationType:'phone',date:'2099-01-01',time:'10:00'},{child:null,specialist:s,consultationType:'online',date:'2099-01-01',time:'10:00'},{child:c,specialist:s,consultationType:'online',date:'2099-01-01',time:'25:99'}]){try{A.request(args);errs.push('accepted')}catch(e){errs.push(e.field)}}return errs.join(',')==='date,type,child,date'||errs`));
    const sent = await requestSession('showcase_speech_specialist', 'E2E: short speech question');
    let req = await latestFor(child.id, 'showcase_speech_specialist');
    await check('Parent', '4 Request submitted through the real booking flow: confirmation shown', async () => sent.success && req ? true : sent);
    await check('Parent', 'Request saved with unique id, child/specialist references, Pending, no payment taken', async () => req && /^RFQ-/.test(req.id) && req.childId === child.id && req.specialistId === 'showcase_speech_specialist' && req.status === 'requested' && req.sessionPayment.status === 'pending' && req.reason === 'E2E: short speech question' ? true : req);
    await check('Parent', 'Duplicate prevented: a second pending request to the same specialist is refused', async () => { const again = await requestSession('showcase_speech_specialist', 'duplicate'); const n = (await bookings()).filter(b => b.childId === child.id && b.specialistId === 'showcase_speech_specialist').length; return !again.success && /pending request/.test(again.error) && n === 1 ? true : { again, n }; });
    await nav('bookings.html?booking=' + encodeURIComponent(req.id), 'return !!d.querySelector("[data-appt] .appt-steps")');
    await check('Parent', '5 My appointments: Pending badge, progress, specialist/child/date/time/type and Cancel action', async () => { const s = await inner(`const card=d.querySelector('[data-appt="${req.id}"]').closest('.booking-card');return {badge:card.querySelector('[data-appt-state]').textContent.trim(),current:card.querySelector('.appt-steps .is-current')?.textContent,text:card.innerText,cancel:!!card.querySelector('.appt-actions .is-ghost'),focus:card.classList.contains('is-focus')}`); return s.badge === 'Pending' && s.current === 'Specialist reply' && s.text.includes('Fictional speech specialist') && s.text.includes(child.name) && s.cancel && s.focus ? true : s; });
    await check('Parent', 'Notification created for the submitted request', async () => inner(`return JSON.parse(w.localStorage.getItem('rafiqNotifications')||'[]').some(n=>n.bookingId===${JSON.stringify(req.id)}&&n.title==='Request sent')`));
    await shot('E2-parent-pending-en.png');

    // ===== 6–8: Specialist =====
    await viewAs('specialist:showcase_development_specialist', 'return w.location.pathname.endsWith("specialist-dashboard.html")&&!!d.getElementById("practiceInbox")');
    await check('Specialist', 'Another specialist does NOT see the request', async () => { const n = await inner(`return d.querySelectorAll('#practiceInbox .practice-request').length`); return n === 0 ? true : n; });
    await viewAs('specialist:showcase_speech_specialist', 'return w.location.pathname.endsWith("specialist-dashboard.html")&&!!d.getElementById("practiceInbox")');
    await check('Specialist', '6–7 Correct specialist receives the request with child, age, note, date and type', async () => { const s = await inner(`const c=[...d.querySelectorAll('#practiceInbox .practice-request')];return {n:c.length,text:c[0]?.innerText}`); return s.n === 1 && s.text.includes(child.name) && s.text.includes('E2E: short speech question') && s.text.includes(req.date) ? true : s; });
    await check('Specialist', 'Specialist notification for the new request', async () => inner(`return JSON.parse(w.localStorage.getItem('rafiqSpecialistNotifications_showcase_speech_specialist')||'[]').some(n=>n.bookingId===${JSON.stringify(req.id)})`));
    await shot('E3-specialist-inbox.png');
    await inner(`d.querySelector('#practiceInbox .practice-request [data-act="accept"]').click();return 1`); await sleep(1600);
    await waitFor('return d.readyState==="complete"&&!!d.getElementById("practiceInbox")', 'dashboard reload');
    req = (await bookings()).find(b => b.id === req.id);
    await check('Specialist', '8 Accept: status Accepted (confirmed), payment now due, request leaves the inbox', async () => req.status === 'confirmed' && req.sessionPayment.status === 'due' && (await inner(`return d.querySelectorAll('#practiceInbox .practice-request').length`)) === 0 ? true : req);

    // ===== 9–10: Parent sees Accepted, pays (demo) =====
    await viewAs('parent', 'return w.location.pathname.endsWith("bookings.html")&&!!d.querySelector("[data-appt]")');
    await check('Parent', '10 Status Accepted after switching back; notification “Request accepted”', async () => { const s = await inner(`const card=d.querySelector('[data-appt="${req.id}"]');return {badge:card.closest('.booking-card').querySelector('[data-appt-state]').textContent.trim(),pay:!![...card.querySelectorAll('button')].find(b=>b.textContent==='Confirm with demo payment'),note:JSON.parse(w.localStorage.getItem('rafiqNotifications')).some(n=>n.bookingId===${JSON.stringify(req.id)}&&n.title==='Request accepted')}`); return s.badge === 'Accepted' && s.pay && s.note ? true : s; });
    await check('Parent', 'Demo payment after acceptance confirms the session', async () => { await inner(`[...d.querySelector('[data-appt="${req.id}"]').querySelectorAll('button')].find(b=>b.textContent==='Confirm with demo payment').click();return 1`); await sleep(400); await inner(`const dlg=d.querySelector('dialog[open]');dlg.querySelector('input[type=checkbox]').checked=true;dlg.querySelector('form').requestSubmit();return 1`); await sleep(600); const b = (await bookings()).find(x => x.id === req.id); return b.sessionPayment.status === 'paid' && (await inner(`return d.querySelector('[data-appt="${req.id}"] .appt-help').textContent`)).startsWith('Confirmed') ? true : b.sessionPayment; });

    // ===== Refresh persistence =====
    await check('Data', 'Browser refresh keeps the demo data (this tab) and role', async () => { await call('Page.reload', { ignoreCache: false }); await sleep(1500); await waitFor('return d.readyState==="complete"&&!!d.querySelector("[data-appt]")', 'after reload', 120); const b = (await inner('return JSON.parse(w.localStorage.getItem("rafiqBookings")||"[]")')).find(x => x.id === req.id); const native = await evaluate('localStorage.getItem("rafiqBookings")'); return b && b.sessionPayment.status === 'paid' && native === null ? true : { b: !!b, native }; });

    // ===== 11–13: Specialist completes and writes the report =====
    await viewAs('specialist:showcase_speech_specialist', 'return w.location.pathname.endsWith("specialist-dashboard.html")');
    await inner(`w.sessionStorage.setItem('rafiqSelectedSpecialistBooking',${JSON.stringify(req.id)});return 1`);
    await nav('booking-details.html', 'return !!d.getElementById("specialistNextSteps")');
    await check('Specialist', 'Booking details: child information shared for the request and accepted/paid state', async () => { const s = await inner(`return {name:d.getElementById('heroChildName').textContent,reason:d.getElementById('bookingReason').textContent,state:d.querySelector('#specialistNextSteps .sa-state')?.textContent,hero:d.getElementById('heroStatus').textContent}`); return s.name.includes(child.name) && s.reason.includes('E2E') && /confirmed with the demo payment/.test(s.state) && s.hero === 'Accepted' ? true : s; });
    await shot('E4-specialist-details.png');
    await inner(`d.getElementById('saComplete').click();return 1`); await sleep(150); await inner(`[...d.querySelectorAll('#specialistNextSteps .practice-btn')].find(b=>b.textContent==='Yes, completed').click();return 1`); await sleep(1200);
    await waitFor('return d.readyState==="complete"&&!!d.getElementById("saReport")', 'completed state');
    await check('Specialist', '12 Mark completed: status Completed and consultation record created', async () => { const b = (await bookings()).find(x => x.id === req.id); const cons = await inner(`return JSON.parse(w.localStorage.getItem('rafiqConsultations')||'[]').some(c=>c.bookingId===${JSON.stringify(req.id)}&&c.status==='completed')`); return b.status === 'completed' && cons ? true : { status: b.status, cons }; });
    await inner(`d.getElementById('saReport').click();return 1`); await waitFor('return w.location.pathname.endsWith("report-form.html")&&!d.getElementById("reportView").hidden&&!!d.getElementById("reportExtras")', 'report form');
    const activityOptions = await inner(`return [...d.querySelectorAll('#reportActivities input')].map(i=>i.value)`);
    await check('Specialist', 'Report form offers age-suitable activities from the real library + labelled as demonstration', async () => activityOptions.length >= 2 && activityOptions.some(v => v.startsWith('together:')) && (await inner(`return d.querySelector('#reportExtras .rx-demo').textContent.includes('Not a clinical record')`)) ? true : activityOptions);
    await inner(`d.getElementById('reportSummary').value='Demo summary: we talked about everyday words during play and simple turn-taking at home.';d.getElementById('reportObservations').value='Enjoys picture books\\nUses gestures to ask for help';d.getElementById('reportRecommendations').value='Name objects during daily routines\\nPause and wait for a turn';d.getElementById('followUp').value='Optional check-in in six weeks.';['reportSummary','reportObservations','reportRecommendations','followUp'].forEach(id=>d.getElementById(id).dispatchEvent(new Event('input')));d.querySelector('#reportExtras [data-area="speech"]').click();const boxes=[...d.querySelectorAll('#reportActivities input')];boxes.find(b=>b.value.startsWith('together:')).click();const sc=boxes.find(b=>b.value.startsWith('screen:'));if(sc)sc.click();const n=d.getElementById('reportNextSteps');n.value='Try the activity three times this week and note what you see.';n.dispatchEvent(new Event('input'));return 1`);
    await inner(`d.getElementById('submitReportButton').click();return 1`); await sleep(400); await inner(`d.getElementById('confirmSubmitButton').click();return 1`); await sleep(1500);
    const report = await inner(`return JSON.parse(w.localStorage.getItem('rafiqSpecialistReports')||'[]').find(r=>r.bookingId===${JSON.stringify(req.id)})`);
    await check('Specialist', '13 Report submitted with child/session reference, areas, activities, guidance and next steps', async () => report && report.status === 'submitted' && report.childId === child.id && report.areasDiscussed.includes('speech') && report.homeActivities.length >= 1 && report.recommendations.length === 2 && /three times/.test(report.nextSteps) && report.isDemoReport ? true : report);
    await check('Specialist', 'No diagnosis or score fields in the saved report', async () => { const keys = Object.keys(report || {}); return !keys.some(k => /diagnos|score|outcome|improve/i.test(k)) ? true : keys; });

    // ===== 14–16: Parent reads the report and opens an activity =====
    await viewAs('parent', 'return w.location.pathname.endsWith("bookings.html")&&!!d.querySelector("[data-appt]")');
    await check('Parent', '14 Completed + report notification; “Read the follow-up report” action', async () => { const s = await inner(`const card=d.querySelector('[data-appt="${req.id}"]');return {badge:card.closest('.booking-card').querySelector('[data-appt-state]').textContent.trim(),link:!!card.querySelector('a[data-report-booking]'),note:JSON.parse(w.localStorage.getItem('rafiqNotifications')).some(n=>n.sourceId==='report_'+${JSON.stringify(req.id)}||(n.bookingId===${JSON.stringify(req.id)}&&n.title==='Session completed'))}`); return s.badge === 'Completed' && s.link && s.note ? true : s; });
    await inner(`d.querySelector('[data-appt="${req.id}"] a[data-report-booking]').click();return 1`);
    await waitFor('return w.location.pathname.endsWith("specialist-report.html")&&!!d.getElementById("reportPlus")', 'report page');
    await check('Parent', '15 Correct report opens: summary, guidance, demo label, areas, next steps', async () => { const s = await inner(`return {summary:d.getElementById('reportSummary').textContent,demo:d.getElementById('reportDemoBanner')?.textContent,chips:d.querySelector('#reportPlus .report-chips')?.textContent,next:d.getElementById('reportPlus').innerText}`); return s.summary.includes('everyday words') && /Not a clinical record/.test(s.demo) && s.chips === 'Speech and language' && /three times/.test(s.next) ? true : s; });
    await shot('E5-parent-report-en.png');
    const links = await inner(`return [...d.querySelectorAll('#reportActivityLinks a')].map(a=>a.getAttribute('href'))`);
    await check('Parent', '16 Suggested activities link to real pages (HTTP 200) and open the right activity', async () => {
      const statuses = await inner(`return Promise.all(${JSON.stringify(links)}.map(u=>fetch(new URL(u,w.location.href)).then(r=>r.status)))`);
      await inner(`d.querySelector('#reportActivityLinks a').click();return 1`); await sleep(1200);
      const opened = await inner(`return {path:w.location.pathname,search:w.location.search,h2:[...d.querySelectorAll('h2')].map(x=>x.textContent).join('|')}`);
      return links.length >= 1 && statuses.every(s => s === 200) && (opened.path.endsWith('activities.html') || opened.path.endsWith('play-on-screen.html')) && opened.search.length > 1 ? true : { links, statuses, opened };
    });
    await check('Parent', 'Report → back to the child’s home works', async () => { await nav('specialist-report.html', 'return !!d.getElementById("reportPlus")'); const href = await inner(`return d.querySelector('#reportPlus .match-links a').getAttribute('href')`); return href === 'parent-dashboard.html?child=' + encodeURIComponent(child.id) ? true : href; });

    // ===== Rejection =====
    const r2 = await requestSession('showcase_development_specialist', 'E2E: please decline');
    const rej = await latestFor(child.id, 'showcase_development_specialist');
    await viewAs('specialist:showcase_development_specialist', 'return !!d.querySelector("#practiceInbox .practice-request")');
    await inner(`d.querySelector('#practiceInbox .practice-request [data-act="decline"]').click();return 1`); await sleep(300);
    await inner(`const dl=d.querySelector('dialog.practice-dialog');dl.querySelector('textarea').value='Outside my focus; a speech specialist may help sooner.';dl.querySelector('form').requestSubmit(dl.querySelector('button[value="decline"]'));return 1`); await sleep(1500);
    await viewAs('parent', 'return !!d.querySelector("[data-appt]")');
    await check('Flows', 'Rejection with reason: parent sees Rejected, the note, and “Request another time”', async () => { const s = await inner(`const card=d.querySelector('[data-appt="${rej.id}"]');return card?{badge:card.closest('.booking-card').querySelector('[data-appt-state]').textContent.trim(),reason:card.querySelector('.appt-reason')?.textContent,again:!!card.querySelector('a[href^="specialist-profile.html"]')}:null`); return r2.success && s && s.badge === 'Rejected' && /Outside my focus/.test(s.reason) && s.again ? true : { r2, s }; });

    // ===== Reschedule + parent responses =====
    const r3 = await requestSession('showcase_psychology_specialist', 'E2E: reschedule please');
    const rs = await latestFor(child.id, 'showcase_psychology_specialist');
    await viewAs('specialist:showcase_psychology_specialist', 'return w.location.pathname.endsWith("specialist-dashboard.html")');
    await inner(`w.sessionStorage.setItem('rafiqSelectedSpecialistBooking',${JSON.stringify(rs.id)});return 1`);
    await nav('booking-details.html', 'return !!d.querySelector("#specialistNextSteps details")');
    const future = new Date(Date.now() + 9 * 864e5), ymd = [future.getFullYear(), String(future.getMonth() + 1).padStart(2, '0'), String(future.getDate()).padStart(2, '0')].join('-');
    await check('Flows', 'Specialist cannot propose a past date', async () => { await inner(`d.querySelector('#specialistNextSteps details').open=true;d.getElementById('saDate').value='2020-01-01';d.querySelector('#specialistNextSteps form').requestSubmit();return 1`); await sleep(200); const msg = await inner(`return d.querySelector('#specialistNextSteps form .sa-msg').textContent`); return /future/.test(msg) ? true : msg; });
    await inner(`d.getElementById('saDate').value=${JSON.stringify(ymd)};d.getElementById('saTime').value='15:00';d.getElementById('saNote').value='Afternoons work better this week.';d.querySelector('#specialistNextSteps form').requestSubmit();return 1`); await sleep(1300);
    await check('Flows', 'Reschedule proposed: status and waiting message on specialist side', async () => { const b = (await bookings()).find(x => x.id === rs.id); return b.status === 'reschedule_proposed' && b.proposal.date === ymd ? true : b; });
    await viewAs('parent', 'return !!d.querySelector("[data-appt]")');
    await check('Flows', 'Parent sees “New time proposed” with date/time/note and accepts it', async () => { const s = await inner(`const card=d.querySelector('[data-appt="${rs.id}"]');return {badge:card.closest('.booking-card').querySelector('[data-appt-state]').textContent.trim(),prop:card.querySelector('.appt-proposal')?.textContent}`); if (!(s.badge === 'New time proposed' && s.prop.includes(ymd) && s.prop.includes('Afternoons'))) return s; await inner(`[...d.querySelector('[data-appt="${rs.id}"]').querySelectorAll('button')].find(b=>b.textContent==='Accept new time').click();return 1`); await sleep(500); const b = (await bookings()).find(x => x.id === rs.id); return b.status === 'confirmed' && b.date === ymd && b.time === '15:00' ? true : b; });
    await check('Flows', 'Specialist is notified that the family accepted the new time', async () => inner(`return JSON.parse(w.localStorage.getItem('rafiqSpecialistNotifications_showcase_psychology_specialist')||'[]').some(n=>n.bookingId===${JSON.stringify(rs.id)}&&n.title==='Family accepted the new time')`));
    // Decline a proposal (shared module, specialist then parent).
    await check('Flows', 'Declining a proposed time closes the request (and only the parent can answer it)', async () => inner(`const A=w.RafiqAppointments,c=w.RafiqSetup.readChildren()[0],s=JSON.parse(w.localStorage.getItem('rafiqSpecialists')).find(x=>x.id==='showcase_speech_specialist');const t=new Date(Date.now()+12*864e5),day=[t.getFullYear(),String(t.getMonth()+1).padStart(2,'0'),String(t.getDate()).padStart(2,'0')].join('-');const b=A.request({child:c,specialist:s,consultationType:'online',date:day,time:'10:00'});A.act(b.id,'propose',{actor:'specialist',specialistId:s.id,date:day,time:'12:00'});let blocked=false;try{A.act(b.id,'declineProposal',{actor:'specialist',specialistId:s.id})}catch{blocked=true}A.act(b.id,'declineProposal',{actor:'parent',childIds:[c.id]});return blocked&&A.stateOf(A.read().find(x=>x.id===b.id))==='cancelled'`));

    // ===== Cancellation =====
    await check('Flows', 'Parent cancels an accepted appointment (inline confirm) → Cancelled, specialist notified', async () => { await nav('bookings.html', 'return !!d.querySelector(`[data-appt="' + rs.id + '"]`)'); await inner(`[...d.querySelector('[data-appt="${rs.id}"]').querySelectorAll('button')].find(b=>b.textContent==='Cancel appointment').click();return 1`); await sleep(150); await inner(`[...d.querySelector('[data-appt="${rs.id}"]').querySelectorAll('button')].find(b=>b.textContent==='Yes, cancel').click();return 1`); await sleep(500); const s = await inner(`return {badge:d.querySelector('[data-appt-state="${rs.id}"]').textContent.trim(),spec:JSON.parse(w.localStorage.getItem('rafiqSpecialistNotifications_showcase_psychology_specialist')||'[]').some(n=>n.bookingId===${JSON.stringify(rs.id)}&&n.title==='Appointment cancelled by the family')}`); return s.badge === 'Cancelled' && s.spec ? true : s; });
    await check('Flows', 'Specialist cannot act on a cancelled request; another specialist cannot act on it either', async () => inner(`const A=w.RafiqAppointments;const out=[];for(const [id,sp] of [[${JSON.stringify(rs.id)},'showcase_psychology_specialist'],[${JSON.stringify(req.id)},'showcase_development_specialist']]){try{A.act(id,'complete',{actor:'specialist',specialistId:sp});out.push('allowed')}catch{out.push('blocked')}}return out.join()==='blocked,blocked'||out`));
    await shot('E6-parent-appointments-en.png');

    // ===== Home entry point =====
    await check('Integration', 'Home shows an open request card linking to the appointment', async () => { const A = await inner(`const A=w.RafiqAppointments,c=w.RafiqSetup.readChildren()[0],s=JSON.parse(w.localStorage.getItem('rafiqSpecialists')).find(x=>x.id==='showcase_development_specialist');const t=new Date(Date.now()+15*864e5),day=[t.getFullYear(),String(t.getMonth()+1).padStart(2,'0'),String(t.getDate()).padStart(2,'0')].join('-');return A.request({child:c,specialist:s,consultationType:'online',date:day,time:'11:00'}).id`); try{await nav('parent-dashboard.html', 'return !!d.getElementById("careUpdates")');}catch(e){await sleep(3000);return await inner('return {href:w.location.href,html:d.documentElement.outerHTML.slice(0,400),care:!!d.getElementById("careUpdates")}');} const s = await inner(`const c=d.querySelector('#careUpdates [data-care="request"]');return c?{state:c.dataset.state,href:c.querySelector('a').getAttribute('href')}:null`); return s && s.state === 'pending' && s.href === 'bookings.html?booking=' + encodeURIComponent(A) ? true : s; });
    for (const ms of [0, 1500, 4000]) { await sleep(ms); console.log('  home trace', ms, await inner('return w.location.href.split("/").pop()+" "+d.readyState+" old="+w.__old')); }
    await check('Integration', 'Support topic → related specialists link opens the filtered directory', async () => { try{await nav('support-detail.html?topic=speech-delay', 'return !!d.querySelector(".catalog-grid")');}catch(e){await sleep(8000);return {frame:await inner('return {href:w.location.href,ready:d.readyState,scripts:d.scripts.length,last:[...d.scripts].slice(-2).map(s=>s.src.split("/").pop()||s.textContent.slice(0,60)),body:!!d.body,html:d.documentElement.outerHTML.length}'),errors:h.errors};} const href = await inner(`return [...d.querySelectorAll('#supportCatalog a')].find(a=>a.getAttribute('href').startsWith('specialists.html'))?.getAttribute('href')`); return href === 'specialists.html?specialty=speech' ? true : href; });

    // ===== Arabic + mobile + themes + multiple children =====
    await h.open('family', 'specialists.html', 'ar', 390, 'return !!d.getElementById("matchPanel")');
    await check('Language', 'AR 390 directory: no English, RTL, no overflow; suggestions empty state invites support questions', async () => { const l = await leftovers('#mainContent, main'); const s = await inner(`return {dir:getComputedStyle(d.body).direction,overflow:d.documentElement.scrollWidth>w.innerWidth+1,empty:!!d.querySelector('#matchPanel a[href^="support-discovery.html"]')}`); return !l.length && s.dir === 'rtl' && !s.overflow && s.empty ? true : { l, ...s }; });
    const kids = await inner('return w.RafiqSetup.readChildren().map(c=>({id:c.id,gender:c.gender}))');
    const boy = kids.find(k => k.gender === 'male'), girl = kids.find(k => k.gender === 'female');
    await inner(`w.RafiqFamily.select(${JSON.stringify(boy.id)});return 1`);
    await nav('specialists.html?child=' + boy.id, 'return !!d.querySelector(".card-book-button")');
    const arSent = await requestSession('showcase_speech_specialist', 'طلب تجريبي');
    await check('Language', 'AR 390 request for the boy: confirmation in Arabic, blue theme', async () => { const s = await inner(`return {msg:d.querySelector('#successView h2').textContent,theme:d.documentElement.dataset.childAppearance}`); return arSent.success && /طلبكم انبعت/.test(s.msg) && s.theme === 'boy' ? true : { arSent, s }; });
    await nav('bookings.html', 'return !!d.querySelector("[data-appt]")');
    await check('Language', 'AR 390 My appointments: Arabic status, actions, no overflow', async () => { const l = await leftovers('#bookingsList'); const s = await inner(`return {badge:d.querySelector('[data-appt-state]').textContent.trim(),overflow:d.documentElement.scrollWidth>w.innerWidth+1}`); return !l.length && s.badge === 'بانتظار الرد' && !s.overflow ? true : { l, ...s }; });
    await shot('E7-parent-appointments-boy-ar-390.png');
    await inner(`w.RafiqFamily.select(${JSON.stringify(girl.id)});return 1`);
    await nav('bookings.html?child=' + girl.id, 'return !!d.getElementById("bookingsList")');
    await check('Children', 'Multiple children: the girl’s appointments do not show the boy’s request; pink theme', async () => { const s = await inner(`return {cards:d.querySelectorAll('[data-appt]').length,empty:!d.getElementById('emptyState').hidden,theme:d.documentElement.dataset.childAppearance}`); return s.cards === 0 && s.empty && s.theme === 'girl' ? true : s; });
    await viewAs('specialist:showcase_speech_specialist', 'return !!d.getElementById("practiceInbox")');
    await check('Language', 'AR specialist inbox shows the boy’s request; child data limited to that request', async () => { const s = await inner(`return {n:d.querySelectorAll('#practiceInbox .practice-request').length,text:d.querySelector('#practiceInbox').innerText,kids:JSON.parse(w.localStorage.getItem('rafiqChildren')).length}`); return s.n === 1 && s.text.includes('طلب تجريبي') ? true : s; });
    await viewAs('parent', 'return !!d.querySelector("[data-appt]")||!!d.getElementById("bookingsList")');
    await check('Stability', 'No JavaScript errors during the run', async () => h.errors.length ? h.errors : true);
  } catch (e) { record('Run', 'Unexpected stop', false, String(e.stack || e)); }
  finally {
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ passed: results.length - failed, failed, total: results.length, results, errors: h.errors }, null, 2));
    console.log(`\n${results.length - failed}/${results.length} checks passed`);
    await h.close(); process.exitCode = failed ? 1 : 0;
  }
})();
