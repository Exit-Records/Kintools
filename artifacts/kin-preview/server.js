import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT || "18754", 10);
const BASE_PATH = (process.env.BASE_PATH || "/kin-preview/").replace(/\/$/, "");
const SITES_DIR = path.resolve(__dirname, "../../sites");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function serve(req, res) {
  let url = req.url.split("?")[0];

  if (url.startsWith(BASE_PATH)) {
    url = url.slice(BASE_PATH.length) || "/";
  }
  if (!url.startsWith("/")) url = "/" + url;

  let filePath = path.join(SITES_DIR, url);

  if (!filePath.startsWith(SITES_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (url === "/") {
    const listing = buildIndex();
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(listing);
    return;
  }

  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
  } catch {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 Not Found</h1>");
    return;
  }

  try {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end("Server error");
  }
}

function buildIndex() {
  let dirs = [];
  try {
    dirs = fs.readdirSync(SITES_DIR).filter((d) => {
      return fs.statSync(path.join(SITES_DIR, d)).isDirectory();
    });
  } catch {}

  const items = dirs
    .map((d) => `<li><a href="${BASE_PATH}/${d}/">${d}</a></li>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Kin Preview — Static Sites</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 600px; margin: 3rem auto; padding: 0 1rem; }
    h1 { font-size: 1.5rem; margin-bottom: 1rem; }
    ul { list-style: none; padding: 0; }
    li { margin: .5rem 0; }
    a { color: #4f46e5; text-decoration: none; font-size: 1rem; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Kin Static Preview</h1>
  <ul>${items}</ul>
</body>
</html>`;
}

http.createServer(serve).listen(PORT, "0.0.0.0", () => {
  console.log(`Kin Preview → http://localhost:${PORT}`);
  console.log(`Base path: ${BASE_PATH}`);
  console.log(`Serving sites/ from: ${SITES_DIR}`);
});
