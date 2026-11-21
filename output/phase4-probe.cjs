// Ad-hoc Phase 4 probe: node output/phase4-probe.cjs <demo> <page> <lang> <width> [js-to-run-before-capture]
const path = require('node:path');
const { start } = require('./phase4-harness.cjs');
const [demo = 'case-speech', page = 'daily-activity.html', lang = 'en', width = '1280', pre = '', mode = 'full', name = ''] = process.argv.slice(2);
(async () => {
  const h = await start(path.join(__dirname, 'parent-phase4-tour', 'probe'));
  try {
    await h.open(demo, page, lang, Number(width));
    if (pre) { await h.inner(pre); await h.sleep(700); }
    // English words left inside Arabic UI (ignores user content and isolated names).
    const leftovers = await h.inner(`if(d.documentElement.lang!=='ar')return [];const out=[];const walk=document.createTreeWalker(d.body,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode()){const t=n.data.trim();const e=n.parentElement;if(!t||!/[A-Za-z]{3,}/.test(t)||!e||e.closest('script,style,[hidden],[data-user-content],bdi,.parent-preview-banner,#previewDetails'))continue;if(e.closest('details:not([open])')&&!e.closest('summary'))continue;const r=e.getBoundingClientRect();if(!r.width&&!r.height)continue;out.push(t.slice(0,90));}return [...new Set(out)].slice(0,40)`);
    console.log(JSON.stringify({ leftovers, errors: h.errors, overflow: await h.inner('return d.documentElement.scrollWidth>w.innerWidth+1') }, null, 1));
    const file = name || `${lang}-${width}-${page.replace(/[?=&#]/g, '_')}.png`; if (mode === 'viewport') { await h.viewport(Number(width), Number(width) < 500 ? 820 : 860); await h.sleep(400); require('node:fs').writeFileSync(path.join(__dirname, 'parent-phase4-tour', 'probe', file), Buffer.from((await h.call('Page.captureScreenshot', { format: 'png' })).data, 'base64')); } else await h.capture(file); console.log('shot', file);
  } finally { await h.close(); }
})();
