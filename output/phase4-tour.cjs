// Screenshot tour of Phase 4 service pages (inspection only, no assertions).
// Usage: node output/phase4-tour.cjs [label]
const path = require('node:path'), fs = require('node:fs');
const { start } = require('./phase4-harness.cjs');
const label = process.argv[2] || 'before';
const out = path.join(__dirname, 'parent-phase4-tour', label);
(async () => {
  const h = await start(out);
  const pages = ['activities.html', 'daily-activity.html', 'milestones.html', 'health.html', 'support-areas.html', 'support-detail.html?topic=sleep', 'support-detail.html?topic=autism'];
  const report = [];
  try {
    for (const [demo, lang, width] of [['case-speech', 'en', 1280], ['case-autism', 'ar', 390]]) {
      for (const page of pages) {
        try {
          await h.open(demo, page, lang, width);
          await h.sleep(500);
          const info = await h.inner(`return {title:d.title,h1:[...d.querySelectorAll('h1')].map(e=>e.textContent.trim()).join(' | '),len:d.body.innerText.length,overflow:d.documentElement.scrollWidth>w.innerWidth+1,url:w.location.pathname+w.location.search}`);
          report.push({ demo, lang, page, ...info });
          await h.capture(`${lang}-${width}-${page.replace(/[?=]/g, '_')}.png`);
        } catch (e) { report.push({ demo, lang, page, error: String(e.message || e) }); }
      }
    }
  } finally {
    report.push({ errors: h.errors });
    fs.writeFileSync(path.join(out, 'tour.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 1));
    await h.close();
  }
})();
