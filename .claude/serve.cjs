// Minimal local static server for previewing the site (no dependencies).
// Files are cached in memory and the browser revalidates with ETag, so moving
// between pages reuses files instead of re-downloading ~100 scripts each time.
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = path.resolve(__dirname, '..'), port = Number(process.env.PORT || 5173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const compressible = new Set(['.html', '.js', '.css', '.json', '.svg']);
const cache = new Map(); // file -> { mtimeMs, size, etag, body, gzip }

function load(file, stat) {
  const hit = cache.get(file);
  if (hit && hit.mtimeMs === stat.mtimeMs && hit.size === stat.size) return hit;
  const body = fs.readFileSync(file);
  const entry = { mtimeMs: stat.mtimeMs, size: stat.size, etag: '"' + stat.size.toString(36) + '-' + Math.floor(stat.mtimeMs).toString(36) + '"', body, gzip: compressible.has(path.extname(file).toLowerCase()) ? zlib.gzipSync(body) : null };
  cache.set(file, entry);
  return entry;
}

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(req.url.split('?')[0]); } catch { return res.writeHead(400).end(); }
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  if (!file.startsWith(root)) return res.writeHead(403).end();
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) return res.writeHead(404).end('Not found');
    let entry;
    try { entry = load(file, stat); } catch { return res.writeHead(500).end(); }
    const headers = { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache', ETag: entry.etag, Vary: 'Accept-Encoding' };
    if (req.headers['if-none-match'] === entry.etag) return res.writeHead(304, headers).end();
    if (entry.gzip && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) { headers['Content-Encoding'] = 'gzip'; res.writeHead(200, headers); return res.end(entry.gzip); }
    res.writeHead(200, headers); res.end(entry.body);
  });
}).listen(port, '127.0.0.1', () => console.log('Rafiq preview: http://localhost:' + port));
