# Kin Build Rules & Compliance Reference

**Repo:** `Exit-Records/Kintools` (GitHub)  
**Deploy target:** Cloudflare Pages — `<toolname>.kintools.net`  
**Last updated:** 2026-06-11

---

## 1. What Kin Is

Kin is a curated collection of free, browser-only tools. It is structured like a record label — every tool has a catalogue number, a creator credit, and a consistent editorial standard. The curation is the value.

**Every Kin tool must:**

- Work in any modern browser on any device
- Require no account, login, or registration
- Collect no user data — no analytics, no tracking
- Contain no ads, upsells, or monetisation of any kind
- Work offline after first visit (Service Worker)
- Be installable to a phone home screen as a PWA
- Do one thing well
- Credit its creator

These are **entry requirements**, not aspirational guidelines.

---

## 2. Tool Numbering & Naming

| Field | Format | Example |
|-------|--------|---------|
| Catalogue number | `KIN-NNN` (zero-padded to 3 digits) | `KIN-073` |
| Directory | `sites/kin-NNN-slug/` | `sites/kin-073-vunique/` |
| Subdomain | `slug.kintools.net` | `vunique.kintools.net` |
| Page `<title>` | `KIN-NNN — Tool Name — Kin` | `KIN-073 — Vunique — Kin` |
| VERSIONS.md row | See §13 | — |

**Next available number:** KIN-074

---

## 3. The Single-File HTML Standard

Every tool is **one `index.html` file**. No build step, no external JS bundles, no static `manifest.json`, no static `sw.js`.

**Exceptions:**
- KIN-073 Vunique is built from a Vite + React source tarball (`attached_assets/vunique-src.tar_*.gz`). Its output is still a single `index.html`. Follow the Vunique build process in §14.
- Workers live separately in `workers/<name>/` (Cloudflare Workers, not Pages).

---

## 4. Required `<head>` Structure

```html
<!DOCTYPE html>
<html lang="en" class="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>KIN-NNN — Tool Name — Kin</title>
<meta name="description" content="…one sentence, plain English…">
<link rel="apple-touch-icon" id="apple-touch-icon">
<link rel="manifest" id="manifest-link">
<meta name="theme-color" id="theme-color-meta" content="…light-bg value…">
```

**Rules:**
- `viewport` must **not** contain `maximum-scale=1` or `user-scalable=no`
- `apple-touch-icon` and `manifest-link` have no `href` — set by inline JS
- `theme-color` uses the light-mode background value; toggled in JS; has `id="theme-color-meta"`

---

## 5. Open Graph Block (Section 19 Template)

Place immediately before `</head>`, after the manifest/SW script:

```html
<link rel="canonical" href="https://SLUG.kintools.net/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://SLUG.kintools.net/">
<meta property="og:title" content="KIN-NNN — Tool Name — Kin">
<meta property="og:description" content="…same as meta description…">
<meta property="og:image" content="https://kintools.net/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Kin Tools">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="KIN-NNN — Tool Name — Kin">
<meta name="twitter:description" content="…same as meta description…">
<meta name="twitter:image" content="https://kintools.net/og-image.png">
```

---

## 6. CSS Rules

- **CSS custom properties:** always double-hyphen `--var`. Never en-dash `–var`.
- **Light mode default:** `:root { }` defines light colours. `html.dark { }` overrides for dark. Never default a new tool to dark mode.
- **Touch targets:** `min-height: 44px` on all interactive elements.
- **Safe area:** `padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)` on body (or equivalent) for notched devices.
- **No markdown fences** (` ``` `) embedded in HTML — strip before pushing.
- **No Google Fonts** — all existing tools that had Google Fonts had them removed during stress-test. Do not add them to new tools.

---

## 7. Theme Toggle

```
Light mode  →  show 🌙 icon  →  click  →  Dark mode
Dark mode   →  show ☀ icon   →  click  →  Light mode
```

- Toggle applies `html.dark` class on `<html>`.
- Persisted in localStorage: key `kin0NN-theme` (hyphens, zero-padded number).
- `theme-color` meta toggled in JS on switch.

---

## 8. PWA — Manifest (Blob Pattern)

**No static `manifest.json` file.** Generate and inject inline:

```js
(function(){
  var m = {
    name: "KIN-NNN Tool Name",
    short_name: "Tool Name",
    start_url: ".",
    display: "standalone",
    background_color: "#FAFAF7",
    theme_color: "#FAFAF7",
    icons: [
      { src: icon192, sizes: "192x192", type: "image/png" },
      { src: icon512, sizes: "512x512", type: "image/png" }
    ]
  };
  var b = new Blob([JSON.stringify(m)], { type: "application/json" });
  var lk = document.createElement("link");
  lk.rel = "manifest";
  lk.href = URL.createObjectURL(b);
  document.head.appendChild(lk);
})();
```

- Icons must be **canvas-generated PNGs** (not SVG data URIs). Android Chrome/Brave does not support SVG in PWA manifests.
- Rounded rect with tool's gradient, tool initials centred in serif font. 192×192 and 512×512 sizes.
- If the manifest initially uses SVG icons, inject the Android PWA icon patcher before `</head>` — marked with comment `/* PWA icon patch: replace SVG manifest icons with Canvas PNG for Android support */`.

---

## 9. PWA — Service Worker (Blob Pattern)

**No static `sw.js` file.** Register inline via Blob:

```js
if ("serviceWorker" in navigator) {
  var _sw =
    "const C='kin0NN-v1';" +
    "self.addEventListener('install',function(){self.skipWaiting();});" +
    "self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C;}).map(function(k){return caches.delete(k);}));}));});" +
    "self.addEventListener('fetch',function(e){if(e.request.method!=='GET')return;e.respondWith(caches.open(C).then(function(c){return c.match(e.request).then(function(r){return r||fetch(e.request).then(function(res){c.put(e.request,res.clone());return res;});});}));});";
  navigator.serviceWorker.register(
    URL.createObjectURL(new Blob([_sw], { type: "application/javascript" }))
  ).catch(function(){});
}
```

- Cache key format: `kin0NN-v1`. Bump to `v2`, `v3` etc. on breaking changes.
- Never use `data:` URI for SW registration — use `URL.createObjectURL`.
- SW must include `activate` handler to clean old caches.

---

## 10. Apple-Touch-Icon (Canvas Pattern)

180×180 canvas-drawn PNG. Must match the tool's landing page cover card gradient. Injected via inline `<script>` placed immediately before `<meta name="description">`:

```html
<script>
(function(){
  var c=document.createElement('canvas');c.width=180;c.height=180;
  var x=c.getContext('2d');
  var g=x.createLinearGradient(0,0,180,180);
  g.addColorStop(0,'#STARTCOLOUR');g.addColorStop(1,'#ENDCOLOUR');
  x.fillStyle=g;x.fillRect(0,0,180,180);
  /* draw icon here */
  var l=document.createElement('link');
  l.rel='apple-touch-icon';l.href=c.toDataURL('image/png');
  document.head.appendChild(l);
})();
</script>
```

- Set `id="apple-touch-icon"` on the `<link>` element in `<head>` (the placeholder).
- The canvas script appends a second link element — this is correct behaviour.
- Gradient colours must match the tool's `--hb-NNN` house-bag colour on the landing page.

---

## 11. Footer Structure (3 Rows)

```html
<footer style="text-align:center">
  KIN-NNN · vX.X · <a href="https://kintools.net/" target="_blank" rel="noopener">Kin Tools</a> · by Creator

  <!-- Row 2: Local Only badge + ⓘ popover (for tools that store data locally) -->
  <div style="text-align:center;margin-top:8px;position:relative">
    <span>
      <span id="kin-local-badge">🛡 Local Only · Verified</span>
      <button id="kin-storage-info-btn" onclick="kinToggleStorageInfo(event)">ⓘ</button>
    </span>
    <div id="kin-storage-popover">
      Data is stored in this browser only. Clearing browser storage will remove it permanently.
    </div>
  </div>

  <!-- Row 3: Bug report -->
  <div style="margin-top:10px">
    <button id="kin-bug-btn">Report a bug</button>
  </div>
</footer>
```

**Row 2 (ⓘ storage popover)** is required for all tools in the Local Storage tier:  
KIN-002, 007, 009, 010, 013, 014, 015, 016, 018, 022, 024, 025, 026, 027, 030, 031, 032, 035 + any new tool that persists data locally.

---

## 12. Bug Report Button

The bug report submits to a Formspree-style endpoint. Required fields and format:

```js
fetch(BUG_REPORT_ENDPOINT, {
  method: 'POST',
  mode: 'no-cors',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    form_type: 'bug_report',
    subject: 'KIN-NNN \u2014 Tool Name',
    app: 'KIN-NNN',
    type: typeRaw,
    description: data.get('description') || '',
    name: anon ? '' : (data.get('name') || '')
  })
}).catch(function(){});
```

**Rules:**
- `form_type: 'bug_report'` — always present, always this exact string
- `mode: 'no-cors'` — always
- `Content-Type: application/json` — always
- **No email field** — removed from all tools during stress-test
- Submit anonymously by default; name is optional

---

## 13. localStorage Key Convention

Always hyphens. Never underscores.

| Key type | Format | Example |
|----------|--------|---------|
| Theme | `kin0NN-theme` | `kin036-theme` |
| Data | `kin0NN-<dataname>` | `kin036-readings` |
| SW cache | `kin0NN-v1` | `kin036-v1` |

When renaming keys (e.g. from a generic name to the `kin0NN-` prefixed version), always **migrate** on first load — read old key, write to new key, delete old key.

---

## 14. VERSIONS.md — Keeping the Register Current

Every tool has one row. Update on every version bump. Column order:

```
| KIN-NNN | Tool Name | vX.Y | Creator | slug.kintools.net | STATUS | Notes |
```

Status symbols:

| Symbol | Meaning |
|--------|---------|
| ✅ | Stress tested, all issues fixed |
| 🔄 | Not yet stress tested / newly added |
| 🔨 | Needs rebuild (not single-file HTML standard) |
| ⚠️ | Known issue noted |

Update `Last updated` date and tool count in the header when adding a new tool.

---

## 15. Landing Page Card

When a new tool ships, add a card to `sites/kin-landing/index.html` (and keep the root `index.html` in sync — both copies must match).

Card checklist:
- House-bag CSS variable `--hb-NNN` defined in `:root` with the tool's accent colour
- Apple-touch-icon canvas script matches the cover card gradient
- Card `href` points to the confirmed Cloudflare Pages URL (confirm with user before adding)
- Description: short, conversational, plain English, no jargon, no sentence fragments

---

## 16. Web Audio API Pattern

Required for any tool using `AudioContext` (KIN-001, 002, 006, 007, 014, 025, 029, 034):

```js
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

// Resume on user gesture (iOS requires this)
document.addEventListener('click', function() {
  var ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();
}, { once: true });
```

- Never create `AudioContext` outside a user gesture handler on first load
- Always call `.resume()` after a page-visibility resume or interruption
- Provide a visible hint when audio is blocked by the silent switch (iOS)

---

## 17. Security Requirements (Applies to All Data-Handling Tools)

Established during KIN-073 v1.3 stress-test. Any tool that accepts user input or imports external data must apply:

### Input sanitisation
- Strip or encode `<`, `>`, `"`, `'`, `&` before inserting into innerHTML
- Use an `esc(str)` helper or equivalent — never raw `.innerHTML = userValue`

### URL validation
- Validate URLs before storing or rendering as links
- Permitted schemes: `https://`, `http://`. Reject `javascript:`, `data:`, `vbscript:`, and empty strings silently

### Import caps
- Hard limit on imported entries: 500 per import (`MAX_ENTRIES_PER_IMPORT = 500`)
- Silently truncate to cap — do not error

### Prototype pollution prevention
- When parsing JSON imports, strip keys that start with `__` or equal `constructor`, `prototype`, `__proto__` before processing

### Worker output
- Escape all user-supplied strings with `escapeHtml()` before inserting into generated HTML pages
- Never trust stored data — re-sanitise on read

---

## 18. Vunique (KIN-073) — Build Process

Vunique is the only tool built from source. Source tarball: `attached_assets/vunique-src.tar_*.gz`.

**Every rebuild must follow this sequence exactly:**

```
1. Extract tarball to /tmp/vsrc
   tar -xzf attached_assets/vunique-src.tar_*.gz -C /tmp/vsrc

2. Install dependencies
   cd /tmp/vsrc/vunique && pnpm install

3. Pre-generate CSS (Tailwind v4 requires this in the Replit environment)
   node --input-type=module << 'EOF'
   import postcss from './node_modules/.pnpm/postcss@.../postcss.js'
   import tailwind from './node_modules/.pnpm/@tailwindcss+postcss@.../index.mjs'
   import { readFileSync, writeFileSync } from 'fs'
   const css = readFileSync('./src/index.css', 'utf8')
   const result = await postcss([tailwind]).process(css, { from: './src/index.css' })
   writeFileSync('./src/generated.css', result.css)
   EOF

4. Swap CSS import
   sed -i "s|import './index.css'|import './generated.css'|g" src/main.tsx

5. Build
   node_modules/.bin/vite build

6. Copy output
   cp dist/index.html /path/to/sites/kin-073-vunique/index.html

7. Inject apple-touch-icon canvas script
   Insert immediately before <meta name="description"> — navy gradient
   (#1e2a3a → #0d1117) + list/document SVG in steel blue rgba(160,185,210,0.9)

8. Revert CSS import
   sed -i "s|import './generated.css'|import './index.css'|g" src/main.tsx

9. Repack tarball (exclude node_modules, dist, generated.css)
   tar --exclude='vunique/node_modules' \
       --exclude='vunique/dist' \
       --exclude='vunique/src/generated.css' \
       -czf attached_assets/vunique-src.tar_*.gz vunique
```

**Version bumps:** Update `VERSIONS.md` entry. Bump follows `vX.Y` (minor for features/fixes, no major bumps unless full rewrite).

---

## 19. Vunique — Handle Rules

| Function | Behaviour | Used for |
|----------|-----------|----------|
| `formatHandle(s)` | Strips invalid chars, collapses separators, **preserves capitalisation** | Display, storage, JSON export |
| `normaliseHandle(s)` | Same as formatHandle + `.toLowerCase()` | URL slugs, Worker path generation |

All handle **comparisons** must be case-insensitive: `.toLowerCase()` on both sides.

Valid handle characters: `a-z A-Z 0-9 -`  
Max length enforced on import.

---

## 20. Vunique Share Worker

Lives at `workers/vunique-share/`. Deployed as a Cloudflare Worker (not Pages).

**Endpoints:**

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/upload` | Upload a Vunique JSON file to R2 |
| GET | `/u/:slug` | Preview page (HTML) |
| GET | `/u/:slug/raw` | Raw JSON download |
| DELETE | `/u/:slug` | Delete file (requires `X-Delete-Token` header) |
| GET/POST | `/report` | Abuse report form |

**Scheduled:** Cron `0 2 * * *` — delete files not re-uploaded in 90 days.

**Security:**
- Rate limiting on `/upload` (in-memory, resets on cold start)
- Blocklist checked before serving (`BLOCKLIST` KV namespace)
- All user-supplied strings escaped with `escapeHtml()` before HTML output
- `normaliseHandle()` (lowercase) used for all slug generation

---

## 21. External Resources Policy

| Resource type | Permitted? | Condition |
|---------------|-----------|-----------|
| Google Fonts | ✅ Yes | Does not track users |
| Open audio libraries (e.g. Tone.js CDN) | ✅ Yes | No user tracking |
| Analytics scripts (GA, Plausible, etc.) | ❌ No | Always |
| Third-party auth / identity SDKs | ❌ No | Always |
| CDN frameworks (React, Vue, etc.) | ✅ Yes | No tracking, pinned version preferred |

**Test:** Does this resource work without knowing anything about the person using it? If yes, permitted. If no, not permitted.

---

## 22. Prohibited Patterns

These must never appear in any Kin tool:

- `confirm()`, `alert()`, `prompt()` for destructive actions — use `kinConfirm()` pattern instead
- Countdown timers or scarcity messaging (unless real and user-set)
- Ads or promotional content disguised as tool output
- Shame or guilt language around metrics or missed targets (health/wellbeing tools)
- Handling of financial credentials (finance tools)
- Dark patterns: decline path harder than accept path
- Google Fonts, analytics, or tracking scripts added to existing compliant tools

---

## 23. Git & Push Rules

- **NEVER push without explicit user confirmation.** Wait for the user to say "push", "go ahead", or equivalent.
- Always commit before asking for push confirmation.
- Commit message format: `KIN-NNN Tool Name vX.Y — short description\n\nDetail lines`
- Use `code_execution` sandbox for git operations (not bash), with `git config --global user.email/name` set first.
- Push command uses the GitHub token from the environment — never hardcode in files.

---

## 24. Stress-Test Checklist (Per Tool)

When stress-testing an existing tool, verify and fix all of the following:

- [ ] Viewport — no `maximum-scale` or `user-scalable`
- [ ] Blob manifest — no static `manifest.json`
- [ ] Blob SW — no static `sw.js`, cache key `kin0NN-v1`
- [ ] Apple-touch-icon — canvas-generated, 180×180, matches landing card gradient
- [ ] `theme-color` meta — light value, `id="theme-color-meta"`, JS-toggled
- [ ] Footer row 1 — credit · Kin Tools link · creator name
- [ ] Footer row 2 — Local Only badge + ⓘ popover (if data stored locally)
- [ ] Footer row 3 — bug report button
- [ ] Bug report — `form_type:'bug_report'`, `no-cors`, JSON, no email field
- [ ] OG block — full Section 19 template (canonical, description, og:*, twitter:*)
- [ ] Theme toggle — light-first CSS, `kin0NN-theme` key, emoji icons
- [ ] No Google Fonts
- [ ] localStorage keys — `kin0NN-` prefix, hyphens only
- [ ] XSS — innerHTML uses escaped values, no raw user input
- [ ] iOS input zoom — `font-size: 16px` on all `<input>` and `<textarea>`
- [ ] Touch targets — `min-height: 44px` on all interactive elements
- [ ] Android PWA icon — Canvas PNG patcher injected if manifest uses SVG icons

---

## 25. Known Issues & Watch List

| Tool | Issue |
|------|-------|
| KIN-027 Kin Gym | Deferred — custom modal, `esc()` incomplete, OG missing |
| KIN-036 Blood Pressure | Was overwritten in a past session; restored from git history. Storage keys: `kin036-readings`, `kin036-theme`, `kin036-lastprint` — data safe on devices |
| KIN-018, KIN-027 | Landing card SVG icons not captured in the icon export (31 Mar 2026) — icons exist in landing page but extractor missed them |
| KIN-001, 004, 019, 020, 022, 024, 025, 026, 028, 033, 034, 035 | May not have Android PWA Canvas PNG patcher — check if Android icon issues reported |

---

*This document is the single source of truth for Kin build compliance. Update it whenever a new pattern is established or an existing rule changes.*
