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

// Map every kintools.net subdomain → local sites/ directory name
const SUBDOMAIN_MAP = {
  "ukulele":      "kin-001-ukulele",
  "metronome":    "kin-002-metronome",
  "bpm":          "kin-003-bpm",
  "colour":       "kin-004-colour-picker",
  "qr":           "kin-005-qr-builder",
  "timer":        "kin-006-classroom-timer",
  "ambient":      "kin-007-ambient",
  "flashcards":   "kin-008-flashcards",
  "jetlag":       "kin-009-jetlag",
  "audiocalc":    "kin-010-audio-calc",
  "unitprice":    "kin-011-unit-price",
  "namepicker":   "kin-012-name-picker",
  "mood":         "kin-013-mood-slider",
  "breathing":    "kin-014-breathing",
  "quietcycle":   "kin-015-quiet-cycle",
  "recipescale":  "kin-016-recipe-scaler",
  "decision":     "kin-017-decision-flip",
  "nest":         "kin-018-kin-nest",
  "markdown":     "kin-019-markdown-download",
  "passgen":      "kin-020-password-generator",
  "textcounter":  "kin-021-text-counter",
  "fairshare":    "kin-022-fair-share",
  "json":         "kin-023-json",
  "thoughtloop":  "kin-024-thought-loop",
  "stretch":      "kin-025-stretch",
  "ground":       "kin-026-kin-ground",
  "gym":          "kin-027-kin-gym",
  "scan":         "kin-028-scan",
  "nudge":        "kin-029-nudge",
  "quote":        "kin-030-quote",
  "invoice":      "kin-031-invoice",
  "receipt":      "kin-032-receipt",
  "pagesurgeon":  "kin-033-page-surgeon",
  "noise":        "kin-034-noise-meter",
  "randomacts":   "kin-035-random-acts",
};

// Rewrite all https://SUBDOMAIN.kintools.net/... → BASE_PATH/DIR/...
function rewriteLandingHtml(html) {
  return html.replace(
    /https:\/\/([a-z0-9-]+)\.kintools\.net(\/[^"')]*)?/g,
    (match, sub, rest) => {
      const dir = SUBDOMAIN_MAP[sub];
      if (!dir) return match; // leave unknown subdomains alone
      return BASE_PATH + "/" + dir + "/" + (rest && rest !== "/" ? rest.slice(1) : "");
    }
  );
}

function serve(req, res) {
  let url = req.url.split("?")[0];
  const query = req.url.includes("?") ? "?" + req.url.split("?")[1] : "";

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
    try {
      const landingPath = path.join(SITES_DIR, "kin-landing", "index.html");
      const raw = fs.readFileSync(landingPath, "utf-8");
      const rewritten = rewriteLandingHtml(raw);
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
      res.end(rewritten);
    } catch {
      res.writeHead(500);
      res.end("Landing page not found");
    }
    return;
  }

  if (url === "/demo") {
    res.writeHead(302, { Location: BASE_PATH + "/kin-008-flashcards/?demo=true" });
    res.end();
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

http.createServer(serve).listen(PORT, "0.0.0.0", () => {
  console.log(`Kin Preview → http://localhost:${PORT}`);
  console.log(`Base path: ${BASE_PATH}`);
  console.log(`Serving sites/ from: ${SITES_DIR}`);
});
