// Phase 4: services data quality (topics, CDC milestone examples, activity Arabic, age labels).
const assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm');
const read = f => fs.readFileSync(f, 'utf8');
const ctx = { window: null, location: { pathname: '/unit.html', search: '' }, console, Intl, Date,
  document: { addEventListener() {}, documentElement: { lang: 'en' } }, localStorage: { getItem: () => null }, MutationObserver: class { observe() {} } };
ctx.window = ctx; vm.createContext(ctx);
const run = f => vm.runInContext(read(f), ctx, { filename: f });

// 1. All 11 areas and 32 topics: meaning in both languages, icon, real services and destinations.
for (const f of ['pearent-cycel/parent-experience.js', 'pearent-cycel/support-catalog-data.js']) run(f);
const catalog = ctx.RafiqSupportCatalog, services = ctx.RafiqParentExperience.services;
const allowed = new Set(read('pearent-cycel/parent-preview.js').match(/const pages=new Set\(\[([^\]]+)\]/)[1].match(/'([a-z-]+)'/g).map(s => s.slice(1, -1) + '.html'));
assert.equal(catalog.categories.length, 11); assert.equal(catalog.topics.length, 32);
for (const c of catalog.categories) assert.ok(c.icon, 'Area icon ' + c.id);
const banned = /\b(cure|treat(?:s|ment)?|causes?|guarantee|percent|%|prevent)\b/i;
for (const topic of catalog.topics) {
  assert.ok(topic.about?.en?.length > 20 && topic.about?.ar?.length > 10, 'Meaning for ' + topic.id);
  assert.ok(!banned.test(topic.about.en), 'No treatment or causal claim in ' + topic.id);
  assert.ok(topic.services.length >= 1 && new Set(topic.services).size === topic.services.length, 'Distinct services for ' + topic.id);
  for (const id of topic.services) {
    const page = services[id][2].split('?')[0];
    assert.ok(fs.existsSync('pearent-cycel/' + page), id + ' destination exists');
    assert.ok(allowed.has(page), id + ' destination opens in the preview');
  }
  assert.ok(topic.dedicated.every(id => topic.services.includes(id)), 'Dedicated tools are among services: ' + topic.id);
  if (topic.id !== 'autism') assert.equal(topic.dedicated.length, 0, 'Only autism has dedicated tools');
}
assert.deepEqual(Array.from(catalog.topics.find(t => t.id === 'anxiety').services), ['behaviour', 'growth']);

// 2. CDC milestone examples: every checkpoint, four areas, both languages, CDC source.
run('pearent-cycel/age-content.js'); run('pearent-cycel/milestones-cdc.js');
const guide = ctx.RafiqMilestoneGuide;
assert.ok(guide.source.url.startsWith('https://www.cdc.gov/'));
for (const resource of ctx.RafiqAgeContent.resources) {
  const items = guide.checkpoints[resource.minMonths];
  assert.ok(items, 'Examples for CDC checkpoint ' + resource.minMonths);
  assert.ok(resource.source.url.startsWith('https://www.cdc.gov/act-early/milestones/'));
  for (const key of Object.keys(guide.domains)) {
    assert.ok(items[key]?.length >= 1, resource.minMonths + ' months: ' + key);
    for (const item of items[key]) { assert.ok(item.en && item.ar, 'Bilingual example'); assert.ok(!/delay|behind|late|abnormal/i.test(item.en), 'No comparison wording'); }
  }
}
const ctxFor = months => ({ supported: true, development: { totalMonths: months } });
assert.equal(guide.forContext(ctxFor(31)).month, 30); assert.equal(guide.forContext(ctxFor(1)), null); assert.equal(guide.forContext({ supported: false }), null);
assert.equal(guide.forContext(ctxFor(31)).resource.minMonths, 30, 'Examples and CDC link use the same checkpoint');

// 3. Activity library: age range, steps, public source, and Arabic for every shown string.
ctx.RafiqActivityMatching = { annotate() {}, skills: {}, levels: {} };
for (const f of ['rafiq-home-transfer-20261013-211454/home-ar.js', 'shared/site-ar.js', 'pearent-cycel/parent-journey-ar.js', 'pearent-cycel/daily-moments.js', 'pearent-cycel/today-ar.js', 'pearent-cycel/activity-hub-ar.js', 'pearent-cycel/support-guide-copy.js', 'pearent-cycel/parent-services-ar.js']) run(f);
const dict = ctx.RafiqHomeArabic, norm = s => s.replace(/\s+/g, ' ').trim();
const library = ctx.RafiqDailyMoments.library; let strings = 0;
for (const item of library) {
  assert.ok(item.minMonths < item.maxMonthsExclusive, 'Age range ' + item.id);
  assert.ok(item.steps.length >= 1 && /^https:\/\//.test(item.sourceUrl), 'Steps and source ' + item.id);
  for (const s of [item.title, item.insight, item.duration, item.materials, item.care, ...item.steps]) { strings++; assert.ok(dict[norm(s)] && !/\?{3}/.test(dict[norm(s)]), 'Arabic for: ' + s); }
}
for (const s of ['A play idea, not a developmental test.', 'Open steps', 'Try it together', 'Save reaction', 'Play together']) assert.ok(dict[s], 'Arabic for page text: ' + s);
const html = read('pearent-cycel/parent-dashboard.html') + read('pearent-cycel/daily-activity.html');
assert.ok(!/Read the source ↗<\/a> · A play idea/.test(html), 'Footnote is no longer a composite string');
for (const page of ['parent-dashboard.html', 'daily-activity.html']) {
  const src = read('pearent-cycel/' + page), at = name => src.indexOf(name);
  assert.ok(at('support-guide-copy.js') > 0 && at('support-guide-copy.js') < at('shared/site-language.js'), page + ': step Arabic loads before the translator');
  assert.ok(at('parent-services-ar.js') < at('shared/site-language.js') && at('activity-card.js') < at('daily-moment-ui.js'), page + ': Phase 4 order');
}

// 4. Kit: bilingual age labels and number formatting.
run('pearent-cycel/parent-services-kit.js'); const K = ctx.RafiqServicesKit;
assert.equal(K.ageLabel({ years: 2, months: 6, days: 1 }), '2 years, 6 months, 1 day');
ctx.document.documentElement.lang = 'ar';
assert.equal(K.ageLabel({ years: 2, months: 1, days: 0 }), 'سنتين وشهر');
assert.equal(K.t(K.p('a', 'ب')), 'ب'); ctx.document.documentElement.lang = 'en';

// 5. Activity card: age range and illustration choice come from existing fields only.
run('pearent-cycel/activity-card.js');
assert.equal(ctx.RafiqActivityCard.ageRange({ minMonths: 24, maxMonthsExclusive: 36 }), '24–35 months');
assert.equal(ctx.RafiqActivityCard.stepIcon('Hold a picture book yourself'), 'book');
assert.equal(ctx.RafiqActivityCard.stepIcon('Sing a familiar short song'), 'music');
console.log(`PASS: 11 areas/32 topics with meanings and working destinations, CDC examples for ${ctx.RafiqAgeContent.resources.length} checkpoints, ${library.length} activities (${strings} strings) with Arabic, bilingual kit and activity card.`);
