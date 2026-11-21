// Interactive activities check (headless Edge, demo preview): Play together session and
// Play on screen games, end to end. Usage: node output/parent-activities-interactive-check.cjs
const path = require('node:path'), fs = require('node:fs');
const { start } = require('./phase4-harness.cjs');
const out = path.join(__dirname, 'parent-activities-qa');
const results = []; let failed = 0;
const record = (area, name, ok, detail = '') => { results.push({ area, name, ok, detail }); if (!ok) failed++; console.log((ok ? 'PASS ' : 'FAIL ') + area + ' · ' + name + (!ok && detail ? ' → ' + JSON.stringify(detail).slice(0, 320) : '')); };
const check = async (area, name, fn) => { try { const r = await fn(); record(area, name, r === true, r); } catch (e) { record(area, name, false, String(e.message || e)); } };

(async () => {
  const h = await start(out);
  const { inner, waitFor, sleep } = h;
  const shot = async name => { await sleep(350); fs.writeFileSync(path.join(out, name), Buffer.from((await h.call('Page.captureScreenshot', { format: 'png' })).data, 'base64')); };
  const leftovers = sel => inner(`const root=d.querySelector(${JSON.stringify(sel)});if(!root)return ['missing'];const out=[];const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){const e=n.parentElement;const t=n.data.trim();if(!t||!/[A-Za-z]{3,}/.test(t)||!e||e.closest('[hidden],[data-user-content],bdi,script,style'))continue;const r=e.getBoundingClientRect();if(!r.width&&!r.height)continue;out.push(t.slice(0,80));}return [...new Set(out)]`);
  const screen = () => inner('return d.getElementById("playSessionDialog")?.dataset.screen');
  const nav = async (url, ready) => { await inner(`w.__old=1;w.location.href=${JSON.stringify(url)};return 1`); await waitFor(`return !w.__old&&d.readyState==='complete'`, url); await waitFor(ready, url); await sleep(300); };
  try {
    // ================= PLAY TOGETHER (girl, EN, desktop) =================
    await h.open('case-typical', 'daily-activity.html', 'en', 1280, 'return !!d.getElementById("playStartButton")');
    await check('Together', 'Clear “Start activity” button; older toggle hidden; sound off by default', async () => {
      const s = await inner(`return {label:d.getElementById('playStartButton').textContent,old:d.getElementById('dailyStart').getClientRects().length,sound:w.localStorage.getItem('rafiqActivitySound')}`);
      return s.label.includes('Start activity') && s.old === 0 && s.sound === null ? true : s;
    });
    await inner('d.getElementById("playStartButton").click();return 1'); await sleep(300);
    await check('Together', 'Intro: title, age range, time, optional 3-item preparation checklist, sound toggle off', async () => {
      const s = await inner(`const g=d.getElementById('playSessionDialog');return {open:g.open,screen:g.dataset.screen,title:g.querySelector('h2').textContent===d.getElementById('dailyTitle').textContent,prep:g.querySelectorAll('.pk-prep input[type=checkbox]').length,sound:g.querySelector('.pk-sound').getAttribute('aria-pressed'),chips:g.querySelectorAll('.pk-chip-row .ps-badge').length}`);
      return s.open && s.screen === 'intro' && s.title && s.prep === 3 && s.sound === 'false' && s.chips === 2 ? true : s;
    });
    await inner('d.querySelector(".pk-prep input").click();return 1');
    await check('Together', 'Preparation is optional: Start works with items unticked', async () => { await inner('d.getElementById("pkStart").click();return 1'); await sleep(200); return (await screen()) === 'step' || await screen(); });
    const steps = await inner(`return w.RafiqActivitySession.instructions(w.RafiqActivityCard.current).length`);
    await check('Together', 'One instruction per screen with large visual, progress and Next/Back/Pause', async () => {
      const s = await inner(`const g=d.getElementById('playSessionDialog');return {text:g.querySelector('.pk-instruction').textContent,first:w.RafiqActivitySession.instructions(w.RafiqActivityCard.current)[0].text,scene:!!g.querySelector('.pk-scene svg'),bar:g.querySelector('.pk-bar').getAttribute('aria-valuenow'),max:g.querySelector('.pk-bar').getAttribute('aria-valuemax'),buttons:['pkBack','pkPause','pkNext'].every(id=>!!d.getElementById(id)),focus:d.activeElement?.id}`);
      return s.text === s.first && s.scene && s.bar === '1' && Number(s.max) === steps && s.buttons && s.focus === 'pkNext' ? true : s;
    });
    if (steps > 1) await check('Together', 'Next then Back returns to the previous instruction', async () => { await inner('d.getElementById("pkNext").click();return 1'); const two = await inner('return d.querySelector(".pk-bar").getAttribute("aria-valuenow")'); await inner('d.getElementById("pkBack").click();return 1'); const one = await inner('return d.querySelector(".pk-bar").getAttribute("aria-valuenow")'); return two === '2' && one === '1' ? true : { two, one }; });
    if (steps > 1) await inner('d.getElementById("pkNext").click();return 1');
    const at = steps > 1 ? 1 : 0;
    await check('Together', 'Pause keeps the place; closing and reopening offers “Resume at step N”', async () => {
      await inner('d.getElementById("pkPause").click();return 1');
      const paused = await screen();
      const stored = await inner(`return JSON.parse(w.localStorage.getItem('rafiqActivityPause_'+w.RafiqFamily.selected()))`);
      await inner('d.querySelector(".pk-nav .pk-secondary").click();return 1'); await sleep(200);
      const bar = await inner('return {open:d.getElementById("playSessionDialog").open,label:d.getElementById("playStartButton").textContent}');
      await inner('d.getElementById("playStartButton").click();return 1'); await sleep(200);
      const intro = await inner('return d.getElementById("pkStart").textContent');
      await inner('d.getElementById("pkStart").click();return 1'); await sleep(200);
      const now = await inner('return d.querySelector(".pk-bar").getAttribute("aria-valuenow")');
      return paused === 'pause' && stored.index === at && !bar.open && bar.label.includes('Resume at step ' + (at + 1)) && intro.includes('Resume') && now === String(at + 1) ? true : { paused, stored, bar, intro, now };
    });
    await check('Together', 'Escape during a step pauses instead of losing the session', async () => { await inner('d.getElementById("playSessionDialog").dispatchEvent(new Event("cancel",{cancelable:true}));return 1'); const s = await screen(); await inner('d.getElementById("pkResume").click();return 1'); return s === 'pause' && (await screen()) === 'step' ? true : s; });
    await check('Together', 'Sound is optional: toggling turns it on and off and is remembered', async () => { await inner('d.querySelector("#playSessionDialog .pk-sound").click();return 1'); const on = await inner('return [w.localStorage.getItem("rafiqActivitySound"),d.querySelector("#playSessionDialog .pk-sound").getAttribute("aria-pressed")]'); await inner('d.querySelector("#playSessionDialog .pk-sound").click();return 1'); const off = await inner('return w.localStorage.getItem("rafiqActivitySound")'); return on[0] === 'on' && on[1] === 'true' && off === 'off' ? true : { on, off }; });
    await inner('for(let i=0;i<10&&d.getElementById("playSessionDialog").dataset.screen==="step";i++)d.getElementById("pkNext").click();return 1');
    await check('Together', 'Last step leads to “How did it go?” with outcomes and optional observations', async () => { const s = await inner(`const g=d.getElementById('playSessionDialog');return {screen:g.dataset.screen,outcomes:g.querySelectorAll('.pk-outcome').length,chips:g.querySelectorAll('.pk-chip').length,note:!!g.querySelector('#pkNote')}`); return s.screen === 'finish' && s.outcomes === 3 && s.chips === 6 && s.note ? true : s; });
    await check('Together', 'Save is blocked until an outcome is chosen', async () => { await inner('d.getElementById("pkSave").click();return 1'); return (await screen()) === 'finish' && (await inner('return d.querySelector("#playSessionDialog .pk-error").textContent.length>0')) ? true : false; });
    await shot('T1-together-finish-girl-en.png');
    await check('Together', 'Save → encouraging completion; record saved with outcome, note and noticed chips; pause cleared', async () => {
      await inner(`const g=d.getElementById('playSessionDialog');g.querySelector('.pk-outcome[data-outcome="tried"]').click();g.querySelector('.pk-chip[data-noticed="smiled"]').click();g.querySelector('.pk-chip[data-noticed="joined"]').click();const n=d.getElementById('pkNote');n.value='Interactive QA: clapped back';n.dispatchEvent(new Event('input'));d.getElementById('pkSave').click();return 1`);
      await sleep(300);
      const s = await inner(`const c=w.RafiqFamily.selected(),rows=JSON.parse(w.localStorage.getItem('rafiqAgeObservations_'+c)),r=rows.find(x=>x.type==='daily-moment'&&x.note==='Interactive QA: clapped back');return {screen:d.getElementById('playSessionDialog').dataset.screen,title:d.querySelector('#playSessionDialog .pk-complete h2')?.textContent,outcome:r?.outcome,noticed:r?.noticed,pause:w.localStorage.getItem('rafiqActivityPause_'+c),done:d.getElementById('activityDone')?.dataset.outcome,history:!!d.querySelector('#playSessionDialog a[href="activities.html?tab=history"]')}`);
      return s.screen === 'done' && s.title === 'Lovely time together' && s.outcome === 'tried' && JSON.stringify(s.noticed) === '["smiled","joined"]' && s.pause === null && s.done === 'tried' && s.history ? true : s;
    });
    await check('Together', 'After saving, the page button offers “Play it again” (not a stale resume)', async () => { const l = await inner('return d.getElementById("playStartButton").textContent'); return l.includes('Play it again') ? true : l; });
    await check('Together', 'Girl theme: pink accent inside the session', async () => { const a = await inner('return getComputedStyle(d.getElementById("playSessionDialog")).getPropertyValue("--ps-accent").trim().toLowerCase()'); return a === '#944367' ? true : a; });
    await shot('T2-together-done-girl-en.png');
    await nav('activities.html?tab=history', 'return !!d.querySelector("[data-record=daily-moment]")');
    await check('Together', 'Saved result visible in activity history with “Played together”, note and noticed chips', async () => { const s = await inner(`const c=[...d.querySelectorAll('[data-record=daily-moment]')].find(a=>a.textContent.includes('Interactive QA: clapped back'));return c?{kind:c.querySelector('small').textContent,chips:[...c.querySelectorAll('.hub-noticed .ps-badge')].map(x=>x.textContent)}:null`); return s && s.kind.includes('Played together') && s.chips.join('|') === 'Smiled or laughed|Joined in' ? true : s; });

    // Arabic, boy, mobile: same session.
    await h.open('case-autism', 'daily-activity.html', 'ar', 390, 'return !!d.getElementById("playStartButton")');
    await inner('d.getElementById("playStartButton").click();return 1'); await sleep(250);
    const introAr = await leftovers('#playSessionDialog');
    await inner('d.getElementById("pkStart").click();return 1'); await sleep(250);
    await check('Together', 'AR 390: intro and step fully Arabic, RTL, full-screen on mobile, blue', async () => {
      const l = [...introAr, ...await leftovers('#playSessionDialog')];
      const s = await inner(`const g=d.getElementById('playSessionDialog'),r=g.getBoundingClientRect();return {dir:getComputedStyle(g).direction,w:Math.round(r.width),vw:w.innerWidth,arabic:/[\\u0600-\\u06FF]/.test(g.querySelector('.pk-instruction').textContent),accent:getComputedStyle(g).getPropertyValue('--ps-accent').trim().toLowerCase(),overflow:g.scrollWidth>g.clientWidth+1}`);
      return !l.length && s.dir === 'rtl' && s.w >= s.vw - 1 && s.arabic && s.accent === '#225f87' && !s.overflow ? true : { l, ...s };
    });
    await shot('T3-together-step-boy-ar-390.png');
    // Home inline player uses the same session.
    await h.open('case-autism', 'parent-dashboard.html', 'en', 1280, 'return !!d.getElementById("parentExperience")');
    await check('Together', 'Home: today’s activity panel opens the same session', async () => { await inner('d.getElementById("homeActivityPanel").open=true;d.getElementById("playStartButton").click();return 1'); await sleep(250); return (await screen()) === 'intro' ? true : await screen(); });

    // ================= PLAY ON SCREEN (girl 26 months, EN, desktop) =================
    await h.open('case-typical', 'activities.html', 'en', 1280, 'return !!d.querySelector(".hub-modes")');
    const todayBefore = await inner(`const c=w.RafiqSetup.readChildren().find(x=>x.id===w.RafiqFamily.selected());return w.RafiqDailyMoments.choose(c,JSON.parse(w.localStorage.getItem('rafiqAgeObservations_'+c.id)||'[]')).item?.id`);
    await nav('play-on-screen.html', 'return !!d.querySelector(".sp-game")');
    await check('Screen', 'Game list: 3 games; age-unsuitable game is shown but not playable', async () => { const s = await inner(`return [...d.querySelectorAll('.sp-game')].map(g=>[g.dataset.game,!!g.querySelector('.pk-primary')])`); return JSON.stringify(s) === '[["shapes",true],["sizes",true],["feelings",false]]' ? true : s; });
    await inner('d.querySelector(".sp-game[data-game=shapes] .pk-primary").click();return 1'); await sleep(200);
    await check('Screen', 'Intro explains: sit together, 4 short rounds, sound off by default', async () => { const s = await inner('return {txt:d.getElementById("screenPlay").innerText,sound:d.querySelector(".pk-sound").getAttribute("aria-pressed")}'); return /4 short rounds/.test(s.txt) && /Sit together/.test(s.txt) && s.sound === 'false' ? true : s; });
    await inner('d.getElementById("spStart").click();return 1'); await sleep(200);
    await check('Screen', 'Wrong tap: gentle wiggle and “try another”, no progress, no penalty', async () => {
      await inner(`const r=d.querySelector('.sp-choices');const target=[...r.children];const st=w.document;return 1`);
      const s = await inner(`const target=d.querySelector('.sp-target');const keys=[...d.querySelectorAll('.sp-choice')].map(b=>b.dataset.key);const html=target.innerHTML;const right=keys.find(k=>html.includes(w.RafiqScreenPlay.shapes[k].d.slice(0,20)));const wrong=[...d.querySelectorAll('.sp-choice')].find(b=>b.dataset.key!==right);wrong.click();return {cls:wrong.className,fb:d.querySelector('.sp-feedback').textContent,next:d.getElementById('spNext').hidden}`);
      return s.cls.includes('is-try') && s.fb === 'Let’s try another one.' && s.next ? true : s;
    });
    await shot('S1-shapes-round-girl-en.png');
    await check('Screen', 'Right tap: visual confirmation, name of the shape, Next appears; all 4 rounds play', async () => {
      let ok = true, info = [];
      for (let i = 0; i < 4; i++) {
        const s = await inner(`const target=d.querySelector('.sp-target');const right=[...d.querySelectorAll('.sp-choice')].find(b=>target.innerHTML.includes(w.RafiqScreenPlay.shapes[b.dataset.key].d.slice(0,20)));right.click();return {right:right.className.includes('is-right'),filled:target.className.includes('is-filled'),fb:d.querySelector('.sp-feedback').textContent,next:!d.getElementById('spNext').hidden}`);
        info.push(s); ok = ok && s.right && s.filled && /^Yes! It’s the /.test(s.fb) && s.next;
        await inner('d.getElementById("spNext").click();return 1'); await sleep(150);
      }
      return ok && !!(await inner('return d.getElementById("spHow")')) ? true : info;
    });
    await check('Screen', 'Save → completion counts rounds played, never correct answers', async () => {
      await inner(`d.querySelector('.pk-outcome[data-outcome="tried"]').click();d.querySelector('.pk-chip[data-noticed="watched"]').click();d.getElementById('spSave').click();return 1`); await sleep(250);
      const s = await inner(`const c=w.RafiqFamily.selected(),r=JSON.parse(w.localStorage.getItem('rafiqAgeObservations_'+c)).filter(x=>x.type==='screen-play').pop();return {r,title:d.querySelector('.pk-complete h2')?.textContent,msg:d.querySelector('.pk-complete .pk-lead')?.textContent}`);
      const keys = Object.keys(s.r || {}); const scoreLike = keys.filter(k => /correct|wrong|score|error|mistake|accuracy/i.test(k));
      return s.r && s.r.activityId === 'screen-shapes' && s.r.roundsPlayed === 4 && s.r.outcome === 'tried' && JSON.stringify(s.r.noticed) === '["watched"]' && !scoreLike.length && s.title === 'Nice playing together' && /not which answers were right/.test(s.msg) ? true : { ...s, scoreLike };
    });
    await shot('S2-shapes-done-girl-en.png');
    await nav('activities.html', 'return !!d.querySelector(".hub-modes")');
    await check('Screen', 'Screen play does not change today’s Play together idea', async () => { const after = await inner(`const c=w.RafiqSetup.readChildren().find(x=>x.id===w.RafiqFamily.selected());return w.RafiqDailyMoments.choose(c,JSON.parse(w.localStorage.getItem('rafiqAgeObservations_'+c.id)||'[]')).item?.id`); return after === todayBefore ? true : { todayBefore, after }; });
    await nav('activities.html?tab=history', 'return !!d.querySelector("[data-record=screen-play]")');
    await check('Screen', 'History shows “Played on screen · Shape match” with chips and Play again', async () => { const s = await inner(`const c=d.querySelector('[data-record=screen-play]');return {kind:c.querySelector('small').textContent,title:c.querySelector('h2').textContent,chips:c.querySelector('.hub-noticed')?.textContent,again:c.querySelector('a[href="play-on-screen.html?game=shapes"]')?.textContent}`); return s.kind.includes('Played on screen') && s.title === 'Shape match' && s.chips === 'Watched closely' && s.again === 'Play again' ? true : s; });
    await nav('milestones.html?filter=all', 'return !!d.querySelector(".growth-entry")');
    await check('Screen', 'Growth journal lists it as “Played on screen” (family observation, no score)', async () => inner(`return [...d.querySelectorAll('.growth-entry')].some(a=>a.querySelector('.growth-kind')?.textContent==='Played on screen'&&a.querySelector('.ps-badge.is-parent'))`));
    await nav('activities.html', 'return !!d.querySelector(".hub-modes")');
    await check('Screen', 'Activities hub offers two ways to play; library cards say “Play together”', async () => inner(`return d.querySelectorAll('.hub-mode').length===2&&!!d.querySelector('.hub-mode[data-mode=screen] a[href="play-on-screen.html"]')&&!!d.querySelector('.hub-mode[data-mode=together] a[href="daily-activity.html"]')&&[...d.querySelectorAll('#hubResults .catalog-kind')].every(s=>s.textContent.includes('Play together'))`));
    await h.capture('S3-hub-modes-girl-en.png');

    // Arabic, boy 4 years, mobile: Feelings faces; stop early.
    await h.open('case-autism', 'play-on-screen.html?game=feelings', 'ar', 390, 'return !!d.getElementById("spStart")');
    await inner('d.getElementById("spStart").click();return 1'); await sleep(200);
    await check('Screen', 'AR 390 Feelings: Arabic prompt and labels, RTL, blue, no overflow', async () => { const l = await leftovers('#screenPlay'); const s = await inner(`return {prompt:d.querySelector('.sp-prompt').textContent,labels:[...d.querySelectorAll('.sp-choice')].map(b=>b.getAttribute('aria-label')),dir:getComputedStyle(d.getElementById('screenPlay')).direction,accent:getComputedStyle(d.getElementById('screenPlay')).getPropertyValue('--ps-accent').trim().toLowerCase(),overflow:d.documentElement.scrollWidth>w.innerWidth+1}`); return !l.length && /دوّروا على الوجه/.test(s.prompt) && s.labels.every(x => /[؀-ۿ]/.test(x)) && s.dir === 'rtl' && s.accent === '#225f87' && !s.overflow ? true : { l, ...s }; });
    await inner(`const t=Object.entries(w.RafiqScreenPlay.faces).find(([k,f])=>d.querySelector('.sp-prompt').textContent.includes(f.label.ar))[0];d.querySelector('.sp-choice[data-key="'+t+'"]').click();return 1`); await sleep(150);
    await check('Screen', 'Feelings: after a match, a parent talking prompt appears (no score)', async () => { const fb = await inner('return d.querySelector(".sp-feedback").textContent'); return /اسألوه|اعملوا/.test(fb) ? true : fb; });
    await shot('S4-feelings-boy-ar-390.png');
    await check('Screen', 'Stop here → save “stopped early” records rounds actually played', async () => {
      await inner('d.getElementById("spNext").click();return 1'); await sleep(150);
      await inner('[...d.querySelectorAll(".pk-top-inline .pk-ghost")][0].click();return 1'); await sleep(150);
      await inner(`d.querySelector('.pk-outcome[data-outcome="later"]').click();d.getElementById('spSave').click();return 1`); await sleep(200);
      const r = await inner(`return JSON.parse(w.localStorage.getItem('rafiqAgeObservations_'+w.RafiqFamily.selected())).filter(x=>x.type==='screen-play').pop()`);
      return r.activityId === 'screen-feelings' && r.outcome === 'later' && r.roundsPlayed === 1 ? true : r;
    });
    // Under 2 years: no screen games.
    await h.open('case-premature', 'play-on-screen.html', 'en', 1280, 'return !!d.getElementById("screenPlay")?.children.length');
    await check('Screen', 'Under 2 years: no screen games, points to Play together instead', async () => inner(`return !d.querySelector('.sp-game')&&d.getElementById('screenPlay').innerText.includes('2 years and older')&&!!d.querySelector('#screenPlay a[href="daily-activity.html"]')`));
    await check('Stability', 'No JavaScript errors during the run', async () => h.errors.length ? h.errors : true);
  } catch (e) { record('Run', 'Unexpected stop', false, String(e.stack || e)); }
  finally {
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ passed: results.length - failed, failed, total: results.length, results, errors: h.errors }, null, 2));
    console.log(`\n${results.length - failed}/${results.length} checks passed`);
    await h.close(); process.exitCode = failed ? 1 : 0;
  }
})();
