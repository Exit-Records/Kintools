# Kin Build Rules

> Single source of truth for building, updating, and deploying tools in the Kin Ecosystem.
> Current as of KIN-028. Next tool: KIN-029.

---

## 1. Project Context

- **Repo:** `Exit-Records/Kintools` (GitHub, private)
- **Deployment:** Netlify — each tool is its own Netlify site, a single `index.html` file
- **Tools completed:** KIN-001 through KIN-028
- **Architecture:** Every tool is a single self-contained HTML file. No external runtime dependencies. All processing is client-side only — nothing stored server-side, nothing transmitted.
- **Creator:** Always `Darren` unless explicitly specified otherwise
  - KIN-015 = Alice and Darren
  - KIN-017 = Alice
  - KIN-018 = Alice and Darren
  - KIN-028 = Darren and Daisy

---

## 2. Workflow Order

1. Apply all transforms to the source file locally
2. Run syntax checks — do not push a broken file
3. Push to GitHub via the Git Data API
4. User deploys to Netlify independently and provides the live URL
5. **Never guess a Netlify URL** — wait for the user to confirm

---

## 3. Files to Update for Every New Tool

| File | What changes |
|---|---|
| `index.html` (root) | New release card, tool count string, `--hb-NN` colour, nth-child animation delay |
| `sites/kin-landing/index.html` | Identical changes — always keep both in sync |
| `Kin Catalog.md` | Full tool entry (number, name, URL, summary, tech notes) |
| `replit.md` | Update current tool count and latest tool reference |

Both landing pages must always be identical. Never update one without the other.

---

## 4. Standard Transforms — Apply to Every Pasted File

Apply every step in order before writing the output file.

### 4.1 Strip markdown fences

Remove any ` ``` ` lines accidentally embedded in the pasted source:

```js
src = src.split('\n').filter(l => l.trim() !== '```').join('\n');
```

### 4.2 Fix curly / smart quotes

Curly quotes inside JS strings cause syntax errors:

```js
src = src.replace(/\u2018/g, "'").replace(/\u2019/g, "'");
src = src.replace(/\u201C/g, '"').replace(/\u201D/g, '"');
```

### 4.3 Fix CSS en dashes

CSS custom properties pasted from rich text often use `–` (U+2013) instead of `--`:

```js
src = src.replace(/\u2013([a-zA-Z])/g, '--$1');
```

### 4.4 Fix the broken universal CSS selector

Copy-paste often drops the `*` and produces `- {` instead of `*, *::before, *::after {`:

```js
src = src.replace(/^- \{/m, '*, *::before, *::after {');
```

### 4.5 `@import` must be first in `<style>`

CSS `@import` is silently ignored if it appears after any other rule inside `<style>`. Move it to the top of the style block if needed.

### 4.6 The `String.replace()` dollar-sign trap — CRITICAL

When calling `.replace(needle, replacementString)`, any `$'`, `$`` `, `$&`, `$1`–`$9` in the replacement string triggers special substitution behaviour and corrupts the output. This has happened before and is hard to debug.

**Rule: whenever the replacement contains `$` (CSS variables, JS expressions, dollar currency), always use a function:**

```js
// WRONG — corrupts output if replacement contains $' or $`
src = src.replace('</head>', pwaScript + '\n</head>');

// CORRECT — function form, no special substitution
src = src.replace('</head>', () => pwaScript + '\n</head>');
```

Apply the function form to every `.replace()` call whose replacement string may contain a `$`.

### 4.7 Service workers — never use `data:` URIs

`data:text/javascript;...` URIs are rejected by browsers for service worker scope. Always use a Blob URL:

```js
var _sw = "const C='kin0NN-v1';" + "/* ... sw code ... */";
navigator.serviceWorker.register(
  URL.createObjectURL(new Blob([_sw], {type: 'application/javascript'}))
).catch(function(){});
```

Build the SW code string by concatenation, not template literals, if there is any risk of `$` characters appearing in the code.

### 4.8 Service worker replacement — avoid regex for block replacement

If replacing an existing SW block inside a pasted file, do not use a regex like `[\s\S]*?\}` — the non-greedy `}` matches the first closing brace inside the block and corrupts surrounding code.

Use exact string matching instead:

```js
const idx = src.indexOf(exactOldBlock);
if (idx !== -1) src = src.slice(0, idx) + newBlock + src.slice(idx + exactOldBlock.length);
```

### 4.9 Timezone-safe date strings

`toISOString()` returns UTC and shows the wrong day for users west of UTC. Always build dates from local parts:

```js
const d = new Date();
const iso = d.getFullYear() + '-' +
  String(d.getMonth()+1).padStart(2,'0') + '-' +
  String(d.getDate()).padStart(2,'0');
```

---

## 5. Required HTML Changes

### 5.1 `<html>` tag

```html
<html lang="en" class="light">
```

Always add `class="light"` so the default light state is explicit.

### 5.2 `<title>`

Format: `KIN-NNN — Tool Name — Kin`

```html
<title>KIN-022 — Fair Share — Kin</title>
```

### 5.3 Viewport with safe-area support

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

### 5.4 Theme colour

Default to the light background. Give it an `id` so JS can update it when dark mode activates:

```html
<meta name="theme-color" id="theme-color-meta" content="#f5f4f0">
```

### 5.5 Remove non-Blob manifests

Delete any of these non-compliant patterns and replace with the Blob URL approach (Section 7):

- `<link rel="manifest" href="data:application/json;base64,...">` — base64 data URI
- `<link rel="manifest" href="./manifest.json">` — external static file
- Any `data:application/json,...` href on a manifest link

The Blob URL pattern (Section 7) is the **only** permitted approach. External `manifest.json` and `sw.js` files must not be created or referenced.

### 5.6 Add apple-touch-icon placeholder

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Short Name">
<link rel="apple-touch-icon" id="apple-touch-icon" href="">
```

The `href` is populated at runtime by the canvas script (Section 7).

---

## 6. Default Light Mode

All new tools must open in light mode. Dark is never the default.

| Element | Light-mode value |
|---|---|
| `<html>` | `class="light"` |
| Theme-color meta | Light background hex |
| JS dark flag | `let dark = false` |
| Toggle button | `🌙` (moon = press to go dark) |
| localStorage | Read key on init; default to `'light'` if absent |

**Dark mode approach** — three patterns are in use across the Kin tools. Preserve whichever pattern the source uses:

- `body.dark` class (used in KIN-020, KIN-021)
- `[data-theme="dark"]` attribute on `<html>` (used in some tools)
- `html.dark` / `html.light` class toggle (used in KIN-022, KIN-023)

**localStorage key** must be tool-specific, e.g. `kin022-theme`, `kin023-theme`, to avoid cross-tool interference.

**Dark mode `!important` rule:** All CSS property values inside `body.dark { }` (and `[data-theme="dark"]` if used) must carry `!important`. Without it, light-mode specificity can win and the dark theme will partially fail:

```css
/* Correct */
body.dark { background: #111 !important; color: #f0f0f0 !important; }

/* Wrong — !important missing */
body.dark { background: #111; color: #f0f0f0; }
```

CSS variable declarations (e.g. `body.dark { --bg: #111; }`) do not need `!important` — only property assignments do.

---

## 7. PWA Script Block

Inject this `<script>` block immediately before `</head>`. Use the function form of `.replace()`:

```js
src = src.replace('</head>', () => pwaScript + '\n</head>');
```

Template:

```html
<script>
(function(){
  /* Blob manifest */
  var m = {
    name: "KIN-NNN — Tool Name — Kin",
    short_name: "Tool Name",
    start_url: ".",
    display: "standalone",
    background_color: "#f5f4f0",
    theme_color: "#f5f4f0"
  };
  var b = new Blob([JSON.stringify(m)], {type: "application/json"});
  var lk = document.createElement("link");
  lk.rel = "manifest";
  lk.href = URL.createObjectURL(b);
  document.head.appendChild(lk);
})();

(function(){
  /* Apple touch icon — 180×180 rounded rect in tool gradient colours */
  var c = document.createElement("canvas"); c.width = 180; c.height = 180;
  var ctx = c.getContext("2d");
  var r = 36;
  ctx.beginPath();
  ctx.moveTo(r,0); ctx.lineTo(180-r,0); ctx.quadraticCurveTo(180,0,180,r);
  ctx.lineTo(180,180-r); ctx.quadraticCurveTo(180,180,180-r,180);
  ctx.lineTo(r,180); ctx.quadraticCurveTo(0,180,0,180-r);
  ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
  ctx.closePath();
  var g = ctx.createLinearGradient(0,0,180,180);
  g.addColorStop(0,"#TOOL_COLOR_1");
  g.addColorStop(1,"#TOOL_COLOR_2");
  ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 46px sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("AB",90,94);   /* 2-letter initials for the tool */
  var el = document.getElementById("apple-touch-icon");
  if (el) el.href = c.toDataURL("image/png");
})();

if ("serviceWorker" in navigator) {
  var _sw =
    "const C='kin0NN-v1';" +
    "self.addEventListener('install',function(){self.skipWaiting();});" +
    "self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C;}).map(function(k){return caches.delete(k);}));}));});" +
    "self.addEventListener('fetch',function(e){if(e.request.method!=='GET')return;e.respondWith(caches.open(C).then(function(c){return c.match(e.request).then(function(r){return r||fetch(e.request).then(function(res){c.put(e.request,res.clone());return res;});});}));});";
  navigator.serviceWorker.register(
    URL.createObjectURL(new Blob([_sw],{type:"application/javascript"}))
  ).catch(function(){});
}
</script>
```

**Gradient colours:** Use the tool's landing page card gradient colours (`--hb-NN` accent, and its darker shade). If the tool has its own `--accent` CSS variable, match that.

**Initials:** 2-letter abbreviation of the tool name (e.g. `FS` for Fair Share, `PG` for PassGen, `MD` for Markdown Download).

---

## 8. Footer

Add immediately before `</body>`. Use the function form of `.replace()`:

```js
src = src.replace('</body>', () => footer + '\n</body>');
```

Template:

```html
<footer style="text-align:center;padding:16px 16px 32px;font-family:-apple-system,sans-serif;font-size:11px;letter-spacing:0.04em;color:#9c9c96">
  KIN-NNN &nbsp;·&nbsp; <a href="https://kintools.netlify.app/" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">Kin Tools</a> &nbsp;·&nbsp; by Darren
</footer>
```

### Local Only · Verified badge (mandatory on every tool)

Every Kin tool must display the **Local Only · Verified** badge. Place it inside the `<footer>` element. For tools that have no `<footer>`, place it in a centred wrapper immediately before `</body>`.

**Inside a footer:**
```html
<div style="display:flex;justify-content:center;margin-top:8px"><span style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;background:rgba(46,160,67,0.1);border:1px solid rgba(46,160,67,0.25);font-size:10px;font-weight:600;letter-spacing:0.08em;color:#2ea043;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif"><svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 0.5L0.5 2.25V5.25C0.5 7.75 2.25 10.05 4.5 10.5C6.75 10.05 8.5 7.75 8.5 5.25V2.25L4.5 0.5Z" fill="#2ea043" fill-opacity="0.15" stroke="#2ea043" stroke-width="0.75"/><path d="M2.5 5.5L3.75 6.75L6.5 4" stroke="#2ea043" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>Local Only · Verified</span></div>
```

**No footer (before `</body>`):**
```html
<div style="text-align:center;padding:10px 16px 28px"><span style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;background:rgba(46,160,67,0.1);border:1px solid rgba(46,160,67,0.25);font-size:10px;font-weight:600;letter-spacing:0.08em;color:#2ea043;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif"><svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 0.5L0.5 2.25V5.25C0.5 7.75 2.25 10.05 4.5 10.5C6.75 10.05 8.5 7.75 8.5 5.25V2.25L4.5 0.5Z" fill="#2ea043" fill-opacity="0.15" stroke="#2ea043" stroke-width="0.75"/><path d="M2.5 5.5L3.75 6.75L6.5 4" stroke="#2ea043" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>Local Only · Verified</span></div>
```

The badge uses fully inline styles so it works in any CSS environment without requiring class definitions.

---

## 9. Mobile Optimisation Checklist

Every tool must pass all of these before shipping:

| Item | Requirement |
|---|---|
| Touch targets | All tappable elements ≥ 44px height (`min-height: 44px`) |
| Viewport | `viewport-fit=cover` in the meta viewport tag |
| Safe-area padding | Body or container uses `env(safe-area-inset-*)` |
| Input font size | `font-size: 16px` minimum on all `<input>` and `<select>` — prevents iOS auto-zoom |
| Tap highlight | `-webkit-tap-highlight-color: transparent` on interactive elements |
| Appearance reset | `-webkit-appearance: none` on buttons, inputs, selects |
| Horizontal scroll rows | `-webkit-overflow-scrolling: touch` on scroll containers |

---

## 10. Syntax Verification — Mandatory Before Push

After all transforms, check every `<script>` block for syntax errors. Using Node.js `vm`:

```js
const vm = await import('vm');
const blocks = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)];
for (const [, code] of blocks) {
  try { new vm.Script(code); }
  catch (e) {
    // Log e.message (includes line:col), show context lines, and fix before proceeding
    throw e;
  }
}
```

Also verify structural integrity:
- `src.indexOf('</head>') < src.indexOf('<body>')` — head closes before body opens
- Script open/close count matches: `(src.match(/<script>/g)||[]).length === (src.match(/<\/script>/g)||[]).length`
- No `data:application/json;base64` manifest remaining
- Title contains the correct `KIN-NNN` number
- No leftover KIN-NNN references from the source that should have been updated (e.g. old localStorage keys)

---

## 11. Landing Page — New Tool Card

Add to both `index.html` (root) and `sites/kin-landing/index.html`.

### Colour and animation delay sequence

| Tool | Variable | Colour | nth-child delay |
|---|---|---|---|
| KIN-021 | `--hb-21` | *(varies)* | `1.20s` |
| KIN-022 | `--hb-22` | *(varies)* | `1.25s` |
| KIN-023 | `--hb-23` | *(varies)* | `1.30s` |
| KIN-024 | `--hb-24` | `#4a5e72` | `1.35s` |
| KIN-025 | `--hb-25` | `#c45d3e` | `1.40s` |
| KIN-026 | `--hb-26` | `#1d3a5c` | `1.45s` |
| KIN-027 | `--hb-27` | `#c0293a` | `1.50s` |
| KIN-028 | `--hb-028` | *(use existing accent)* | `1.55s` |
| KIN-025 | `--hb-25` | `#c45d3e` | `1.40s` |
| KIN-026 | `--hb-26` | `#1d3a5c` | `1.45s` |
| KIN-027 | `--hb-27` | `#c0293a` | `1.50s` |
| KIN-028 | `--hb-028` | *(use existing accent)* | `1.55s` |

Pattern: `delay = 1.10s + (N - 19) × 0.05s`. Choose a distinct colour for each new `--hb-NN` variable.

### Card HTML structure

```html
<div class="card" style="--c:var(--hb-NN)" onclick="location.href='https://NETLIFY_URL.netlify.app'">
  <div class="icon">EMOJI</div>
  <div class="name">KIN-NNN</div>
  <div class="tool-name">Tool Name</div>
  <div class="desc">Short conversational description. One or two sentences. No feature-dump lists.</div>
</div>
```

**Description style:** Match the tone of existing cards — short, plain sentences. Avoid comma-separated feature lists.

Also update the tool count string in both landing pages from `"NN tools"` to `"NN+1 tools"`.

---

## 12. GitHub Push Pattern

Use the Git Data API (not CLI git). Steps in order:

```
GET  /repos/{owner}/{repo}/git/refs/heads/main         → headSha
GET  /repos/{owner}/{repo}/git/commits/{headSha}        → baseTreeSha
POST /repos/{owner}/{repo}/git/blobs                    → blobSha (one per file)
POST /repos/{owner}/{repo}/git/trees                    → treeSha
POST /repos/{owner}/{repo}/git/commits                  → commitSha
PATCH /repos/{owner}/{repo}/git/refs/heads/main         → update ref to commitSha
```

Commit message format:
```
KIN-NNN Tool Name: brief one-line summary

- bullet detail 1
- bullet detail 2
```

---

## 13. Web3Forms

- Access key: `bee35860-0b11-4196-89d4-2ec55bc8b269`
- Destination email: `dbridge@mac.com`

---

## 14. Service Worker Cache Versioning

After significant updates to an existing tool, bump the cache version string to force cache invalidation:

```js
// Before
const C = 'kin022-v1';
// After update
const C = 'kin022-v2';
```

---

## 15. Common Pitfalls — Quick Reference

| Symptom | Root cause | Fix |
|---|---|---|
| CSS custom properties do nothing | En dashes instead of double hyphens | Section 4.3 |
| JS syntax error on page load | Curly quotes in string literals | Section 4.2 |
| Manifest not found / ignored | `data:` base64 href | Replace with Blob (Section 7) |
| Service worker fails to register | `data:text/javascript` scope rejected | Blob URL (Section 4.7) |
| iOS home screen icon is blank | Missing `apple-touch-icon` link or canvas script | Sections 5.6, 7 |
| Dark mode is the default | Missing `class="light"` or wrong JS initial state | Sections 5.1, 6 |
| File body HTML appears inside a JS string | `$'` in `.replace()` replacement triggers substitution | Section 4.6 |
| Service worker block replaced incorrectly | Regex `[\s\S]*?}` matches first brace | Section 4.8 |
| Wrong date shown for users west of UTC | `toISOString()` returns UTC | Section 4.9 |
| `@import` silently ignored | Not first rule in `<style>` | Section 4.5 |
| Universal selector broken as `- {` | Copy-paste dropped the `*` | Section 4.4 |
| Cross-tool dark mode bleed | localStorage key not tool-specific | Section 6 |
| Dark mode partially applies / some props stay light | `!important` missing from `body.dark` property values | Section 6 |
| External `sw.js` or `manifest.json` fails in Blob context | Static file references disallowed — use inline Blob URL | Sections 4.7, 5.5, 7 |

  ## 16. "How it works" Copy — Landing Page Card

  Every Kin tool must have a plain-language description of how it works. This copy lives **on the landing page card only** — not inside the tool itself.

  **Where it goes:** The `release-desc` div on the landing page card, plus the `desc` and `features` array in the JS `KIN` data object. When a user taps the card's info area on the landing page, a detail sheet slides up showing this copy.

  **Do not** add an ℹ button or info panel inside the individual tool HTML.

  **Content rules:**
  - Describe what the tool does and how to use it, in plain language
  - Content is supplied by the user in the build brief
  - **If the "how it works" copy is not provided, do not invent filler text — remind the user to generate it before building the landing card**

  **Pitfall:** Adding an info overlay to the tool itself is wrong — the landing page already provides this context.
  
