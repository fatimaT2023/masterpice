// Interactive activities: every library activity works in the step-by-step session (EN/AR),
// screen games have complete bilingual content, age limits and no scoring fields.
const assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm');
const read = f => fs.readFileSync(f, 'utf8');
const ctx = { console, Intl, Date, URL, URLSearchParams, location: { search: '', href: 'http://x/', pathname: '/x' }, history: { replaceState() {} },
  document: { addEventListener() {}, documentElement: { lang: 'en' }, getElementById: () => null }, localStorage: { getItem: () => null, setItem() {}, removeItem() {} }, MutationObserver: class { observe() {} } };
ctx.window = ctx; vm.createContext(ctx);
const run = f => vm.runInContext(read(f), ctx, { filename: f });
ctx.RafiqActivityMatching = { annotate() {}, skills: {}, levels: {} };
for (const f of ['rafiq-home-transfer-20261013-211454/home-ar.js', 'shared/site-ar.js', 'pearent-cycel/parent-journey-ar.js', 'pearent-cycel/daily-moments.js', 'pearent-cycel/today-ar.js', 'pearent-cycel/activity-hub-ar.js', 'pearent-cycel/support-guide-copy.js', 'pearent-cycel/parent-services-ar.js',
  'pearent-cycel/parent-services-kit.js', 'pearent-cycel/activity-card.js', 'pearent-cycel/activity-play-kit.js', 'pearent-cycel/activity-session.js', 'pearent-cycel/screen-play.js']) run(f);
const S = ctx.RafiqActivitySession, lib = ctx.RafiqDailyMoments.library, icons = ctx.RafiqServicesKit.icons;
let screens = 0;
for (const item of lib) {
  for (const lang of ['en', 'ar']) {
    ctx.document.documentElement.lang = lang;
    const steps = S.instructions(item);
    assert.ok(steps.length >= 1 && steps.length <= 6, `${item.id} ${lang}: 1–6 screens`);
    for (const s of steps) {
      assert.ok(s.text.length > 3 && s.text.length < 260, `${item.id} ${lang}: short instruction`);
      assert.ok(icons[s.icon], `${item.id}: illustration ${s.icon}`);
      if (lang === 'ar') assert.ok(/[؀-ۿ]/.test(s.text) && !/[A-Za-z]{4,}/.test(s.text), `${item.id}: Arabic instruction`);
    }
    if (lang === 'en') screens += steps.length;
  }
}
ctx.document.documentElement.lang = 'en';
assert.deepEqual(Array.from(S.split('One. Two? Three!')), ['One.', 'Two?', 'Three!']);
assert.deepEqual(Array.from(S.split('أولًا. ثانيًا؟ ثالثًا')), ['أولًا.', 'ثانيًا؟', 'ثالثًا']);
// Screen games: content, age limits (none under 2 years), bilingual copy.
const P = ctx.RafiqScreenPlay;
assert.deepEqual(Object.keys(P.games), ['shapes', 'sizes', 'feelings']);
for (const g of Object.values(P.games)) {
  assert.ok(g.minMonths >= 24, g.id + ' starts at 2 years or later');
  for (const k of ['title', 'about', 'tip']) assert.ok(g[k].en && g[k].ar, g.id + ' ' + k);
  for (const seed of [1, 77, 4021]) {
    const rounds = g.rounds(seed); assert.equal(rounds.length, 4, g.id + ' 4 rounds');
    for (const r of rounds) {
      const prompt = g.prompt(r); assert.ok(prompt.en && prompt.ar, g.id + ' prompt');
      if (g.id !== 'sizes') { assert.ok(r.choices.includes(r.target) && new Set(r.choices).size === 3, g.id + ' 3 distinct choices with the answer'); }
    }
  }
}
assert.equal(P.suitable(P.games.feelings, 30), false); assert.equal(P.suitable(P.games.shapes, 30), true); assert.equal(P.suitable(P.games.shapes, 12), false);
for (const k of Object.keys(P.faces)) assert.ok(P.faces[k].label.ar && P.faces[k].ask.ar, 'face ' + k);
// Parent observations are neutral and bilingual; no scoring vocabulary anywhere in the save code.
for (const [, , label] of ctx.RafiqPlayKit.noticed) assert.ok(label.en && label.ar);
const save = read('pearent-cycel/screen-play.js').match(/function saveResult\(\)\{[\s\S]*?\n \}/)[0];
assert.ok(!/correct|score|wrong|accuracy|mistake/i.test(save), 'Screen results never store correctness');
assert.equal(ctx.RafiqPlayKit.sound.on(), false, 'Sound is off by default');
// The new page is reachable in the preview and highlighted under Activities.
assert.ok(/'play-on-screen'/.test(read('pearent-cycel/parent-preview.js')));
assert.ok(read('pearent-cycel/parent-sidebar.js').includes("'play-on-screen.html':'activities.html'"));
console.log(`PASS: ${lib.length} activities → ${screens} one-instruction screens in EN and AR with illustrations; 3 screen games (2+ years) with bilingual rounds; no scoring; sound off by default.`);
