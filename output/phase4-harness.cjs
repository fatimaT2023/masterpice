// Shared headless-Edge harness for Phase 4 parent checks (preview iframe, CDP).
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const types = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };

async function start(outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const fetched = [];
  const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (err, data) => { fetched.push({ url: req.url, ok: !err }); if (err) { res.writeHead(404); res.end(); return; } res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(data); });
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port, debug = 10000 + (process.pid * 13) % 20000, profile = path.join(require('node:os').tmpdir(), 'rafiq-phase4-edge-' + process.pid);
  fs.rmSync(profile, { recursive: true, force: true });
  const browser = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--remote-debugging-port=' + debug, '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let targets;
  for (let n = 0; n < 60; n++) { try { targets = await fetch('http://127.0.0.1:' + debug + '/json', { signal: AbortSignal.timeout(700) }).then(r => r.json()); if (targets.some(t => t.type === 'page')) break; } catch {} await sleep(200); }
  if (!targets?.some(t => t.type === 'page')) throw Error('Headless Edge unavailable');
  const socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => socket.addEventListener('open', r, { once: true }));
  let seq = 0; const pending = new Map(), errors = [], dialogs = [], listeners = [];
  socket.onmessage = e => {
    const m = JSON.parse(e.data);
    for (const fn of listeners) { try { fn(m); } catch {} }
    if (m.method === 'Page.javascriptDialogOpening') { dialogs.push(m.params.message); socket.send(JSON.stringify({ id: ++seq, method: 'Page.handleJavaScriptDialog', params: { accept: true } })); }
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map(a => a.value || a.description).join(' '));
    if (m.id && pending.has(m.id)) { const j = pending.get(m.id); clearTimeout(j.t); pending.delete(m.id); m.error ? j.rej(Error(JSON.stringify(m.error))) : j.res(m.result); }
  };
  const call = (method, params = {}) => new Promise((res, rej) => { const id = ++seq, t = setTimeout(() => rej(Error('Timed out: ' + method)), 20000); pending.set(id, { res, rej, t }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async expr => { const r = await call('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  const inner = code => evaluate(`(()=>{const w=document.getElementById('parentPreviewFrame')?.contentWindow,d=w?.document;if(!d?.documentElement)return null;${code}})()`);
  const innerAsync = code => evaluate(`(async()=>{const w=document.getElementById('parentPreviewFrame')?.contentWindow,d=w?.document;if(!d?.documentElement)return null;${code}})()`);
  const waitFor = async (code, label, tries = 90) => { for (let n = 0; n < tries; n++) { try { if (await inner(code)) return; } catch {} await sleep(120); } throw Error('Not ready: ' + label); };
  const viewport = async (width, height = 900) => { await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 }); await sleep(150); };
  const capture = async name => { const width = await evaluate('innerWidth'); const h = await inner('return Math.ceil(d.documentElement.scrollHeight)'); await viewport(width, Math.min(5200, (h || 900) + 60)); await sleep(350); fs.writeFileSync(path.join(outDir, name), Buffer.from((await call('Page.captureScreenshot', { format: 'png' })).data, 'base64')); await viewport(width); };
  await call('Page.enable'); await call('Runtime.enable');
  const base = `http://127.0.0.1:${port}/pearent-cycel/`;
  // Open a parent page inside the preview with a demo scenario and language.
  const open = async (demo, page, lang = 'en', width = 1280, ready = 'return d.readyState==="complete"') => {
    await viewport(width);
    // Set the preview language before load (same origin) instead of toggling afterwards.
    await call('Page.navigate', { url: `${base}parent-preview.css` }); await sleep(150);
    await evaluate(`localStorage.setItem('rafiqLanguage',${JSON.stringify(lang)});true`);
    await call('Page.navigate', { url: `${base}parent-preview.html?demo=${demo}&page=${encodeURIComponent(page)}` });
    await waitFor(ready, demo + ' ' + page);
    for (let attempt = 0; attempt < 3 && await inner('return d.documentElement.lang') !== lang; attempt++) {
      await evaluate('document.getElementById("previewLanguage").click()');
      try { await waitFor(`return d.documentElement.lang===${JSON.stringify(lang)}`, lang, 60); } catch (e) { if (attempt === 2) throw e; await sleep(500); }
    }
    await waitFor(ready, page + ' after language');
    await sleep(300);
  };
  const go = async (page, ready = 'return d.readyState==="complete"') => { await inner(`w.location.href=${JSON.stringify(page)};return true`); await sleep(250); await waitFor(`return d.readyState==='complete'&&w.location.href.includes(${JSON.stringify(page.split('?')[0])})`, page); await waitFor(ready, page); await sleep(250); };
  const close = async () => { try { await call('Browser.close').catch(() => {}); } catch {} try { browser.kill(); } catch {} server.close(); await sleep(400); try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} };
  return { on: fn => listeners.push(fn), dialogs, call, evaluate, inner, innerAsync, waitFor, viewport, capture, open, go, close, errors, fetched, port, base, sleep };
}
module.exports = { start, root, sleep };
