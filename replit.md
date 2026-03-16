# Kin — Everyday tools. No strings.

## What Kin is

Kin is a curated collection of simple, free web tools that work without subscriptions, accounts, or tracking. A tuner. A timer. A colour picker. A drum machine. A unit converter. Small, useful things you open in a browser, use, and close.

Kin is structured like a record label. There is a catalog. Each tool has a number, a creator credit, and a consistent visual identity. There is an editorial standard for what gets in. The curation is the value.

Every tool on Kin:
- Works in any modern browser on any device
- Requires no account, login, or registration
- Collects no user data — no analytics, no tracking
- Contains no ads, upsells, or monetisation of any kind
- Works offline after the first visit (Service Worker)
- Is installable to a phone's home screen as a PWA
- Does one thing well
- Credits its creator

These are not aspirational guidelines. They are entry requirements.

**External resources policy:** Fonts, audio libraries, and open frameworks are permitted if they do not track users. Google Fonts — fine. An analytics script — not fine. The test: does this resource work without knowing anything about the person using it?

**Current tools: KIN-001 through KIN-025 (25 tools). Next: KIN-026.**

Latest: KIN-025 · Stretch — `sites/kin-025-stretch/` — `https://kinstretch.netlify.app`

---

## Build standards (applied to every tool)

### HTML / structure
- Single `index.html` file per tool. No build step.
- `<title>`: `KIN-NNN — Tool Name — Kin`
- `<meta name="description">` always present
- `viewport-fit=cover` on viewport meta
- `<link rel="apple-touch-icon" id="apple-touch-icon">` in `<head>`
- `<link rel="manifest" id="manifest-link">` in `<head>` (no `href` — set by JS Blob)

### CSS
- CSS custom properties use double-hyphen `--var`, never en-dash `–var`
- Light mode default. `body.dark` class for dark theme.
- `min-height: 44px` on all interactive elements (tap targets)
- `env(safe-area-inset-*)` padding on body for notched devices
- No markdown fences (` ``` `) embedded in HTML — strip before pushing

### Theme toggle
- Light mode: show 🌙 (moon) — clicking switches to dark
- Dark mode: show ☀ (sun) — clicking switches to light
- localStorage key namespaced per tool: `kin0NN-theme`

### PWA
- **Manifest**: Generated as Blob in JS, not a static file. Set on `#manifest-link` href.
- **Icons**: Canvas-generated PNG (not SVG data URIs). Rounded rect with tool's gradient, initials centred. 192×192 and 512×512 for manifest; 180×180 for apple-touch-icon.
- **Apple-touch-icon**: Canvas drawn at 180×180, same gradient as landing page cover card, tool initials in serif. Set on `#apple-touch-icon` href.
- **Service worker**: Blob SW pattern. Cache key `kin0NN-v1`. Never use `data:` URI SW.

### Footer (every tool)
```
<footer class="kin-footer">
  <div class="foot-brand">Kin</div>
  <div class="foot-meta">KIN-NNN · Tool Name<br>by Darren · No tracking · Works offline</div>
</footer>
```

### Creator rule
Always `Darren` unless the user explicitly specifies otherwise.

---

## Landing pages

Two files kept in sync — always edit both:
- `index.html` (root — Netlify deploy)
- `sites/kin-landing/index.html` (local preview)

### Adding a new tool card
1. Add `--hb-NNN: #colour;` to `:root` CSS vars
2. Add `.release:nth-child(NNN) { animation-delay: Xs; }` (increment by 0.05s)
3. Update count: `<span class="catalog-count">N tools</span>`
4. Add card before closing `</div>` of `.catalog`
5. Card `href="#"` until Netlify URL is confirmed — then update both files

### Category labels (consistent set)
`Wellbeing` · `Utility` · `Music` · `Health` · `Design` · `Developer` · `Education` · `Learning` · `Shopping` · `Travel`

Never use: `Wellness`, `Utilities`

---

## Catalog files

- `Kin Catalog.md` — full record of every tool: URL, publish dir, summary, notes, fixes applied
- `Kin Build Rules.md` — LLM-facing build instructions, transforms checklist, common pitfalls

Always update both after a new tool is shipped.

---

## Repository & deployment

- GitHub repo: `Exit-Records/Kintools` (main branch)
- Netlify publish dir per tool: `sites/kin-NNN-tool-name`
- No build command — static HTML files served directly
- Pushes via GitHub Git Data API (Blob → Tree → Commit → Patch ref)

---

## User preferences

- Iterative development; ask before major architectural changes
- All changes pushed to GitHub before handing back
- Landing page Netlify URLs confirmed by user before updating card hrefs
- Description style: short conversational sentences, plain English, no jargon
- Never default new tools to dark mode

---

## System architecture (monorepo)

The repo is a pnpm workspace. Kin tools live in `sites/`. There are also artifact packages:

- `artifacts/api-server` — Express 5 / Node 24 API (PostgreSQL + Drizzle ORM)
- `artifacts/kin-preview` — Local preview of the landing page
- `artifacts/kin-qr-builder` — React/Vite QR builder tool
- `artifacts/mockup-sandbox` — Vite component preview server for canvas mockups

TypeScript 5.9, Zod v4, OpenAPI 3.1, Orval for React Query client generation. Two landing page copies kept in sync (`index.html` root and `sites/kin-landing/index.html`).
