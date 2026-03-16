# Kin Build Rules

A single source of truth for building, updating, and deploying tools in the Kin ecosystem.

---

## 1. General

- Every Kin tool is a **single self-contained HTML file** with no external runtime dependencies.
- All processing is **client-side only** — nothing stored server-side, nothing sent anywhere.
- Tools live in `sites/kin-NNN-tool-name/index.html` within the monorepo.
- The current count is **KIN-001 through KIN-020**. Next is **KIN-021**.

---

## 2. Workflow Order

1. Build locally → preview in Replit → get user sign-off
2. Only then push to GitHub
3. User deploys to Netlify independently and provides the live URL — **never guess Netlify URLs**

---

## 3. Files to Update on Every New Tool

Always update all four locations when adding a new tool:

| File | What to update |
|---|---|
| `index.html` (root) | New release card, count, `--hb-NN` color, nth-child delay |
| `sites/kin-landing/index.html` | Same as above — keep both in sync at all times |
| `Kin Catalog.md` | New entry with full spec |
| `replit.md` | Update current tool count and latest tool reference |

Both landing pages must always be identical. Never update one without the other.

---

## 4. Landing Page Release Cards

Each new tool card follows this structure:

```html
<!-- KIN-NNN: Tool Name -->
<a href="https://[netlify-url]/" target="_blank" rel="noopener" class="release">
  <div class="release-cover">
    <div class="cover-bg" style="background: linear-gradient(145deg, var(--hb-NN), [darker-shade]);"></div>
    <span class="cover-category">Utility</span>
    <span class="cover-number">KIN-NNN</span>
    <div class="cover-icon"><!-- SVG icon --></div>
    <span class="kin-mark">Kin</span>
  </div>
  <div class="release-info">
    <div class="release-name">Tool Name</div>
    <div class="release-creator">by Darren</div>
    <div class="release-desc">Brief description in the style of other cards — short, conversational sentences, no feature-list dumps.</div>
    <div class="release-replaces">Replaces <span>thing it replaces</span></div>
  </div>
</a>
```

**Description style:** Short punchy sentences matching the tone of existing cards. Never comma-separated feature lists. Compare against existing cards before writing.

---

## 5. Colors and Animation Delays

Each tool gets a unique CSS custom property and nth-child animation delay. Continue the sequence:

| Tool | Variable | nth-child delay |
|---|---|---|
| KIN-019 | `--hb-19` | `1.10s` |
| KIN-020 | `--hb-20` | `1.15s` |
| KIN-021 | `--hb-21` | `1.20s` |
| KIN-022 | `--hb-22` | `1.25s` |

Pattern: delay = `1.10s + (N-19) * 0.05s`. Choose a new color for each `--hb-NN` variable.

---

## 6. Creator Attribution

- Default creator is always **Darren** unless the user explicitly specifies someone else.
- Creator appears in three places inside the tool file: meta description, the `kin-label` div, and the `foot-meta` div.
- Creator also appears in both landing page cards and in `Kin Catalog.md`.
- Known exceptions: KIN-017 = Alice, KIN-018 = Alice and Darren.

---

## 7. Default Theme — Light Mode

All new tools must open in **light mode**. Dark is never the default unless the spec explicitly requires it.

Checklist:
- `<html class="light">` — not `dark`
- `<meta name="theme-color" content="[light value]" id="theme-color-meta">` — use the light background color
- In JS: `let dark = false`
- Toggle button starts as `🌙` (moon = switch to dark)

---

## 8. PWA — Required on Every Tool

Every tool must include full PWA support. If pasted code is missing any of these, add them before shipping.

### Required files alongside `index.html`:
- `icon.svg` — the tool's icon, used by the manifest
- `manifest.json` — name, short_name (KIN-NNN format), icons, display, theme_color

### Required in `<head>`:
```html
<link rel="manifest" id="manifest-link">
<link rel="apple-touch-icon" id="apple-touch-icon" href="">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Short Name">
```

### Apple touch icon canvas script (CRITICAL — add automatically if missing):

If pasted code does not include the apple-touch-icon canvas script, **always add it**. It must be added before the service worker registration block:

```js
(function () {
  try {
    var sz = 180, c = document.createElement('canvas');
    c.width = sz; c.height = sz;
    var ctx = c.getContext('2d');
    var g = ctx.createLinearGradient(0, 0, sz, sz);
    g.addColorStop(0, '[tool gradient start]');
    g.addColorStop(1, '[tool gradient end]');
    ctx.fillStyle = g;
    var r = 36;
    ctx.beginPath();
    ctx.moveTo(r,0); ctx.lineTo(sz-r,0); ctx.arcTo(sz,0,sz,r,r);
    ctx.lineTo(sz,sz-r); ctx.arcTo(sz,sz,sz-r,sz,r);
    ctx.lineTo(r,sz); ctx.arcTo(0,sz,0,sz-r,r);
    ctx.lineTo(0,r); ctx.arcTo(0,0,r,0,r); ctx.closePath(); ctx.fill();
    var svg = '<!-- tool icon SVG string, 96x96 -->';
    var img = new Image();
    var blob = new Blob([svg], { type: 'image/svg+xml' });
    var url = URL.createObjectURL(blob);
    img.onload = function () {
      ctx.drawImage(img, 42, 42, 96, 96);
      URL.revokeObjectURL(url);
      var el = document.getElementById('apple-touch-icon');
      if (el) el.href = c.toDataURL('image/png');
    };
    img.src = url;
  } catch (e) {}
})();
```

- Gradient colors must match the tool's landing page cover card colors.
- The SVG icon must match the cover card icon.
- Icon drawn at 96×96, offset 42px from top-left (centers it on the 180×180 canvas).

---

## 9. Dates — Timezone Bug Prevention

Never use `toISOString()` for user-visible dates — it returns UTC and will show the wrong date for users west of UTC.

Always use local date components:
```js
const d = new Date();
const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
```

---

## 10. Netlify URLs

- Never guess a Netlify URL. Always wait for the user to provide it after deploying.
- Past wrong guesses serve as a reminder: `kinmarkdowndl` (KIN-019 wrong), `kinpwgen` (KIN-020 wrong).
- Once provided, update both landing pages, `Kin Catalog.md`, and any in-tool references.

---

## 11. GitHub Push Process

Use the GitHub Git Data API (OAuth token via `listConnections('github')`). Steps:

1. Get current HEAD SHA from `refs/heads/main`
2. Get base tree SHA from the commit
3. Create blobs for each changed file
4. Create a new tree from the base tree + blob SHAs
5. Create a commit pointing to the new tree
6. PATCH `refs/heads/main` to the new commit SHA (`force: true`)

---

## 12. Web3Forms

- Key: `bee35860-0b11-4196-89d4-2ec55bc8b269`
- Email: `dbridge@mac.com`

---

## 13. Kin Catalog.md

Every new tool gets a full entry including: tool number, name, URL, Netlify publish dir, summary paragraph, and notes (single file, PWA, creator, color scheme, category, any notable technical details).

---

## 14. Service Workers

- All tools include an inline service worker registered via `URL.createObjectURL(new Blob([...]))`.
- After significant updates, bump the cache version string (e.g. `kin-toolname-v1` → `v2`) to force cache invalidation.
