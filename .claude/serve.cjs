// Fast local static server for previewing the site (no dependencies).
// The project lives in OneDrive, where every disk check is slow. So files are kept
// in memory and only re-read when Windows reports that they changed (fs.watch),
// instead of checking the disk on every request. The browser revalidates with ETag
// and gets 304s, and text files are gzipped once.
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = path.resolve(__dirname, '..'), port = Number(process.env.PORT || 5173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8' };
const compressible = new Set(['.html', '.js', '.css', '.json', '.svg', '.md']);
const cache = new Map(); // absolute file -> { etag, body, gzip, type } | { missing: true }
let version = 0;

// Drop cached entries when files change on disk.
try {
  fs.watch(root, { recursive: true }, (event, file) => {
    if (!file) { cache.clear(); return; }
    cache.delete(path.join(root, String(file)));
    version++;
  });
} catch { /* without watch support we fall back to short-lived entries */ }

function load(file) {
  const hit = cache.get(file);
  if (hit && (!hit.expires || hit.expires > Date.now())) return hit;
  let entry;
  try {
    const stat = fs.statSync(file);
    if (!stat.isFile()) entry = { missing: true };
    else {
      const ext = path.extname(file).toLowerCase(), body = fs.readFileSync(file);
      entry = { etag: '"' + stat.size.toString(36) + '-' + Math.floor(stat.mtimeMs).toString(36) + '"', body, type: types[ext] || 'application/octet-stream', gzip: compressible.has(ext) ? zlib.gzipSync(body, { level: 6 }) : null };
    }
  } catch { entry = { missing: true }; }
  if (entry.missing) entry.expires = Date.now() + 2000; // re-check missing files soon
  cache.set(file, entry);
  return entry;
}

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(req.url.split('?')[0]); } catch { res.writeHead(400); return res.end(); }
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  const entry = load(file);
  if (entry.missing) { res.writeHead(404); return res.end('Not found'); }
  // Pages are always revalidated; scripts, styles and media are reused for 5 minutes so moving between pages
  // does not re-check ~100 files each time. After editing code, use Ctrl+Shift+R to reload them.
  const isPage = /\.html?$/i.test(file);
  const headers = { 'Content-Type': entry.type, 'Cache-Control': isPage ? 'no-cache' : 'public, max-age=300', ETag: entry.etag, Vary: 'Accept-Encoding' };
  if (req.headers['if-none-match'] === entry.etag) { res.writeHead(304, headers); return res.end(); }
  if (entry.gzip && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) { headers['Content-Encoding'] = 'gzip'; res.writeHead(200, headers); return res.end(entry.gzip); }
  res.writeHead(200, headers); res.end(entry.body);
}).listen(port, '127.0.0.1', () => {
  console.log('Rafiq preview: http://localhost:' + port);
  // Warm the cache in the background so the first visit is fast too.
  const warm = dir => { let list = []; try { list = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; } for (const d of list) { if (d.name.startsWith('.') || d.name === 'node_modules' || d.name === 'output') continue; const full = path.join(dir, d.name); if (d.isDirectory()) warm(full); else if (compressible.has(path.extname(d.name).toLowerCase())) load(full); } };
  setTimeout(() => { for (const dir of ['pearent-cycel', 'shared', 'piblic-pages', 'specialist-cycle', 'rafiq-home-transfer-20261013-211454']) warm(path.join(root, dir)); }, 50);
});
