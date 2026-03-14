# Kin Build Prompt

Use this file as a prompt with any AI assistant to build a new Kin tool.
Fill in the section marked **[YOUR APP]** below, then paste this entire file as your prompt.

---

## [YOUR APP]

**Describe what your app does:**

> _Replace this line with a plain-English description of your tool.
> Example: "A metronome that lets you set BPM with a tap button, choose a time signature, and hear an audio click. The beat should be generated using the Web Audio API."_

**Tool name:** _(e.g. Unit Price Calculator)_
**Category:** _(e.g. Music / Shopping / Education / Visual / Travel / Everyday)_
**Your name:** _(this appears as the creator credit)_

---

## Your task

Build the tool described above as a **single self-contained HTML file** that follows the Kin design system and standards exactly as specified below. Output only the complete HTML file — no explanations, no separate CSS files, no separate JS files.

---

## Kin standards — non-negotiable

Every Kin tool must:

- Work entirely in the browser with no server, no backend, no API calls to external services
- Require no account, login, or registration of any kind
- Collect no data — no cookies, no localStorage used for tracking, no analytics
- Contain no ads, upsells, or monetisation
- Work offline after the first visit (no external runtime dependencies)
- Be a single self-contained HTML file with all CSS and JS inlined
- Do one thing well — no feature creep
- Credit the creator in the footer

---

## Design system

### Fonts

Load from Google Fonts (this is the only permitted external resource):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
```

- **UI text:** `DM Sans` — weights 400, 500, 600, 700
- **Display / headings:** `Instrument Serif` — weight 400, italic available

### Colour system — dark first

The tool is dark by default. Light mode is toggled by adding `.light` to `<html>`.

```css
:root {
  --bg:          #111110;
  --surface:     #1c1c1a;
  --surface2:    #252522;
  --border:      #2e2e2b;
  --border-hover:#3d3d39;
  --text:        #f0efe8;
  --text-mid:    #9c9a90;
  --text-dim:    #5c5b54;
  --accent:      #7eb88a;
  --accent-dim:  #2a4030;
  --radius:      12px;
  --radius-sm:   8px;
}

html.light {
  --bg:          #FAFAF7;
  --surface:     #FFFFFF;
  --surface2:    #F3F2EE;
  --border:      #E4E2DC;
  --border-hover:#CCCAC2;
  --text:        #1A1A18;
  --text-mid:    #5C5B56;
  --text-dim:    #9C9A94;
  --accent:      #2D5A3D;
  --accent-dim:  #E8F0EB;
}
```

Every colour in the UI must use these CSS variables — no hardcoded hex values except for `--bg` and the variables themselves.

### Theme toggle button

Fixed in the top-right corner. Switches between dark and light by toggling `.light` on `<html>`.

```html
<button id="theme-btn" aria-label="Toggle theme">☀️</button>
```

```css
#theme-btn {
  position: fixed;
  top: 14px;
  right: 14px;
  z-index: 999;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: border-color 0.2s, background 0.2s;
}
#theme-btn:hover { border-color: var(--border-hover); }
```

```js
const themeBtn = document.getElementById('theme-btn');
let isDark = true;
themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.classList.toggle('light', !isDark);
  themeBtn.textContent = isDark ? '☀️' : '🌙';
});
```

### Layout

```css
body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100dvh;
  -webkit-font-smoothing: antialiased;
}

.wrap {
  max-width: 680px;
  margin: 0 auto;
  padding: 52px 20px 80px;
}
```

Mobile-first. Large tap targets (minimum 44px). No horizontal scrolling.

### Header block

Every tool starts with this header pattern inside `.wrap`:

```html
<div class="kin-header">
  <div class="kin-label">Kin</div>
  <h1 class="kin-title">Tool Name</h1>
  <p class="kin-sub">One sentence describing what it does.</p>
</div>
```

```css
.kin-header { margin-bottom: 36px; }

.kin-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 8px;
}

.kin-title {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(26px, 6vw, 36px);
  font-weight: 400;
  color: var(--text);
  line-height: 1.1;
  margin-bottom: 8px;
}

.kin-sub {
  font-size: 14px;
  color: var(--text-mid);
  line-height: 1.6;
}
```

### Footer block

Every tool ends with this footer inside `.wrap`:

```html
<footer class="kin-footer">
  <div class="foot-brand">Kin</div>
  <div class="foot-meta">[Tool Name]<br>by [Creator] · No tracking · Works offline</div>
</footer>
```

```css
.kin-footer {
  margin-top: 64px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.foot-brand {
  font-family: 'Instrument Serif', serif;
  font-size: 16px;
  color: var(--text-dim);
}

.foot-meta {
  font-size: 11px;
  color: var(--text-dim);
  text-align: right;
  line-height: 1.7;
}
```

### Input / control styling

```css
input, select, textarea {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  padding: 10px 12px;
  width: 100%;
  transition: border-color 0.15s;
  -webkit-appearance: none;
  appearance: none;
}

input::placeholder { color: var(--text-dim); }

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--accent);
}
```

### Primary button

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--text);
  color: var(--bg);
  border: none;
  border-radius: 100px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.82; }
.btn-primary:disabled { opacity: 0.35; cursor: not-allowed; }
```

### Ghost button

```css
.btn-ghost {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 100px;
  color: var(--text-mid);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 18px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.btn-ghost:hover { border-color: var(--border-hover); color: var(--text); }
```

### Surface cards

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}
```

### Section labels (small caps above a block)

```css
.section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 12px;
}
```

### Accent / highlight

Use `var(--accent)` for active states, best-value indicators, key results, and interactive highlights. Use `var(--accent-dim)` as the background of highlighted blocks.

### Entry animation

Apply to the main wrapper:

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.wrap { animation: fadeUp 0.4s ease-out both; }
```

---

## PWA — install to home screen + offline

Every Kin tool must be installable to a phone's home screen and work offline after the first visit. Because each tool is a single HTML file, both the manifest and the service worker are inlined — no separate files needed.

### Meta tags (add to `<head>`)

```html
<!-- PWA / install -->
<meta name="theme-color" content="#111110" id="theme-color-meta">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="[Tool Name]">

<!-- Inline manifest via data URI -->
<link rel="manifest" id="manifest-link">
```

### Inline manifest + service worker (add to `<script>`)

Paste this block into your `<script>` tag. Fill in `TOOL_NAME` and `CACHE_NAME`.

```js
// ---- PWA SETUP ----
const TOOL_NAME  = '[Tool Name]';       // e.g. "Unit Price Calculator"
const CACHE_NAME = 'kin-tool-v1';      // e.g. "kin-unit-price-v1" — unique per tool
const THEME_DARK  = '#111110';
const THEME_LIGHT = '#FAFAF7';

// Inline manifest
const manifest = {
  name: `${TOOL_NAME} — Kin`,
  short_name: TOOL_NAME,
  description: `Free, offline, no accounts.`,
  start_url: './',
  display: 'standalone',
  background_color: THEME_DARK,
  theme_color: THEME_DARK,
  icons: [
    { src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' fill='%23111110'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='120' fill='%23f0efe8'%3EK%3C/text%3E%3C/svg%3E", sizes: '192x192', type: 'image/svg+xml' },
    { src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' fill='%23111110'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='320' fill='%23f0efe8'%3EK%3C/text%3E%3C/svg%3E", sizes: '512x512', type: 'image/svg+xml' }
  ]
};
document.getElementById('manifest-link').setAttribute('href',
  'data:application/json,' + encodeURIComponent(JSON.stringify(manifest)));

// Update theme-color meta when dark/light toggles
function updateThemeMeta(dark) {
  document.getElementById('theme-color-meta').setAttribute('content', dark ? THEME_DARK : THEME_LIGHT);
  manifest.background_color = dark ? THEME_DARK : THEME_LIGHT;
  manifest.theme_color       = dark ? THEME_DARK : THEME_LIGHT;
}

// Inline service worker via Blob URL (enables offline after first visit)
if ('serviceWorker' in navigator) {
  const swCode = `
    const CACHE = '${CACHE_NAME}';
    self.addEventListener('install', e => {
      self.skipWaiting();
      e.waitUntil(caches.open(CACHE).then(c => c.addAll([self.location.href])));
    });
    self.addEventListener('activate', e => {
      e.waitUntil(caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
      ));
    });
    self.addEventListener('fetch', e => {
      e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })));
    });`;
  const swBlob = new Blob([swCode], { type: 'text/javascript' });
  navigator.serviceWorker.register(URL.createObjectURL(swBlob));
}
// ---- END PWA SETUP ----
```

**Wire the theme toggle to `updateThemeMeta`** — call it inside your existing toggle handler:

```js
themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.classList.toggle('light', !isDark);
  themeBtn.textContent = isDark ? '☀️' : '🌙';
  updateThemeMeta(isDark); // add this line
});
```

---

## Full file structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Tool Name] — Kin</title>
  <meta name="description" content="[One sentence description]. Free, offline, no accounts.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <style>
    /* paste full CSS here — :root, html.light, body, .wrap,
       #theme-btn, .kin-header, .kin-footer, all component styles */
  </style>
</head>
<body>

  <button id="theme-btn" aria-label="Toggle theme">☀️</button>

  <div class="wrap">

    <div class="kin-header">
      <div class="kin-label">Kin</div>
      <h1 class="kin-title">[Tool Name]</h1>
      <p class="kin-sub">[One sentence description.]</p>
    </div>

    <!-- YOUR TOOL UI HERE -->

    <footer class="kin-footer">
      <div class="foot-brand">Kin</div>
      <div class="foot-meta">[Tool Name]<br>by [Creator] · No tracking · Works offline</div>
    </footer>

  </div>

  <script>
    // Theme toggle
    const themeBtn = document.getElementById('theme-btn');
    let isDark = true;
    themeBtn.addEventListener('click', () => {
      isDark = !isDark;
      document.documentElement.classList.toggle('light', !isDark);
      themeBtn.textContent = isDark ? '☀️' : '🌙';
    });

    // YOUR TOOL LOGIC HERE
  </script>

</body>
</html>
```

---

## Rules for the AI building this

1. Output a single complete `.html` file — nothing else
2. All CSS and JS must be inlined — no `<link>` tags except the Google Fonts `<link>`
3. Use only the CSS variables defined above — no hardcoded colours
4. The dark/light toggle must work exactly as specified
5. The header and footer must match the spec exactly, with the correct catalog number, tool name, and creator name
6. The tool must be fully functional — no placeholder logic, no `TODO` comments
7. Target file size under 100 KB
8. No `console.log` statements in the final output
9. No external JS libraries — use vanilla JS and Web APIs only
10. Test mentally: does it work offline? Does it require an account? Does it collect any data? If any answer is not favourable, revise before outputting
