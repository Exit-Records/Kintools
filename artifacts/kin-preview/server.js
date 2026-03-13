import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITES_DIR = path.resolve(__dirname, '../../sites');
const PORT = Number(process.env.PORT) || 5000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
};

function listSites() {
  try {
    return fs.readdirSync(SITES_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort();
  } catch { return []; }
}

function indexPage(sites) {
  const items = sites.map(s =>
    `<li><a href="/${s}/">${s}</a></li>`
  ).join('\n      ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Kin Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0d1117; color: #e2e8f0; padding: 40px; }
    h1 { font-size: 20px; font-weight: 400; color: #6aa3c8; margin-bottom: 24px; }
    ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
    a { color: #e2e8f0; text-decoration: none; padding: 12px 20px; background: #161b24;
        border: 1px solid #2a3241; border-radius: 8px; display: inline-block;
        transition: border-color .15s; }
    a:hover { border-color: #4a7fa5; color: #6aa3c8; }
    .tag { font-size: 11px; color: #6b7c93; margin-left: 10px; }
  </style>
</head>
<body>
  <h1>Kin Static Preview</h1>
  <ul>
      ${items || '<li style="color:#6b7c93">No sites found in sites/ directory</li>'}
  </ul>
  <p style="margin-top:40px;font-size:12px;color:#6b7c93">Serving from <code>sites/</code> — changes are live on reload.</p>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let urlPath = decodeURIComponent(url.pathname);

  // Root → directory listing
  if (urlPath === '/') {
    const html = indexPage(listSites());
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  // Strip leading slash, resolve to sites dir
  const relative = urlPath.replace(/^\//, '');
  let filePath = path.resolve(SITES_DIR, relative);

  // Guard against directory traversal
  if (!filePath.startsWith(SITES_DIR)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  // Directory → serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    if (!urlPath.endsWith('/')) {
      res.writeHead(301, { Location: urlPath + '/' }); res.end(); return;
    }
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return;
  }

  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': mime,
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Kin Preview → http://localhost:${PORT}`);
  console.log(`Serving sites/ from: ${SITES_DIR}`);
});
