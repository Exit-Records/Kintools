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

**Current tools: KIN-001 through KIN-039 (39 tools).**

Latest additions: KIN-037 Unclaimed · KIN-038 Wets Go! · KIN-039 Is This Real? (consumer reality index)

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
- **Android home screen icon fix**: 27 tools have a PWA icon patcher injected before `</head>` that intercepts the manifest after creation and replaces SVG icons with Canvas-generated PNGs. Android Chrome/Brave does not support SVG in PWA manifests. The patcher code is marked with the comment `/* PWA icon patch: replace SVG manifest icons with Canvas PNG for Android support */`.

### Web Audio API — required pattern for any tool using AudioContext

**Tools using Web Audio:** KIN-001 Ukulele, KIN-002 Metronome, KIN-006 Classroom Timer, KIN-007 Ambient, KIN-014 Breathing, KIN-025 Stretch, KIN-029 Nudge, KIN-034 Noise Meter.

All of the following rules apply to every tool that creates an `AudioContext`:

1. **Create only on user gesture** — `new AudioContext()` must be called inside a user event handler (click/touchend), never on page load.

2. **Always `await ctx.resume()`** — `resume()` returns a Promise. Any code that relies on the context running (e.g. `updateGains()`, starting oscillators) must come *after* the await. Make the enclosing function `async`:
   ```js
   async function play() {
     if (!ctx) initAudio();
     if (ctx.state === 'suspended' || ctx.state === 'interrupted') await ctx.resume();
     // now safe to start audio
   }
   ```

3. **Handle `'interrupted'` state** — iOS sets `ctx.state` to `'interrupted'` during phone calls or when the screen locks. Always check for it alongside `'suspended'`.

4. **Resume on `visibilitychange`** — iOS suspends the AudioContext when the PWA is backgrounded. Re-resume when the tab becomes visible again:
   ```js
   document.addEventListener('visibilitychange', () => {
     if (document.visibilityState === 'visible' && state.playing) {
       if (ctx && (ctx.state === 'suspended' || ctx.state === 'interrupted')) ctx.resume();
     }
   });
   ```

5. **iOS silent switch** — the iPhone ringer switch mutes Web Audio output in PWA mode. There is no programmatic bypass. Always display a hint near the play/start control: `"On iPhone, check your silent switch is off"` (small, low opacity — not alarming).

6. **Service worker absolute URL** — when caching a single-page tool, `ASSETS=['./']` resolves to the Blob URL origin (wrong). Inject the real URL at registration time:
   ```js
   const pageUrl = location.href.split('?')[0];
   const SW = `const CACHE='kinNNN-v1';const ASSETS=['${pageUrl}'];...`;
   ```

---

### Footer (every tool — canonical format)

The footer is always a single wrapper with three rows: badge · bug link · credit. Never use `position:fixed` on a footer element — it must flow naturally at the bottom of content.

**Single HTML tools** — place this block just before `</body>` (after all app HTML, bug sheet, and scripts):

```html
<div class="footer" style="text-align:center;padding:20px;font-size:12px;color:rgba(0,0,0,0.45)">
  <div style="display:flex;justify-content:center;margin-bottom:8px">
    <span style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;background:rgba(46,160,67,0.1);border:1px solid rgba(46,160,67,0.25);font-size:10px;font-weight:600;letter-spacing:0.08em;color:#2ea043;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif"><svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 0.5L0.5 2.25V5.25C0.5 7.75 2.25 10.05 4.5 10.5C6.75 10.05 8.5 7.75 8.5 5.25V2.25L4.5 0.5Z" fill="#2ea043" fill-opacity="0.15" stroke="#2ea043" stroke-width="0.75"/><path d="M2.5 5.5L3.75 6.75L6.5 4" stroke="#2ea043" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>Local Only · Verified</span>
  </div>
  <div><button id="kin-bug-btn" style="background:none;border:none;padding:0;color:inherit;font:inherit;opacity:0.4;font-size:11px;cursor:pointer;letter-spacing:0.04em;text-decoration:underline;text-underline-offset:3px;">Report a bug</button></div>
  <div style="margin-top:8px;opacity:0.5;font-size:10px;letter-spacing:0.08em;text-transform:uppercase">Kin · KIN-NNN · Creator</div>
</div>
```

**React tools** — in `App.tsx`:

1. Add bug state alongside other `useState` declarations:
```tsx
const [bugOpen, setBugOpen] = useState(false);
const [bugSuccess, setBugSuccess] = useState(false);
```

2. Replace any existing footer with this JSX (inside the root div, at the bottom, **never** `position: fixed`):
```tsx
<footer style={{ textAlign: "center", padding: "20px", fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
  <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: "rgba(46,160,67,0.1)", border: "1px solid rgba(46,160,67,0.25)", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "#2ea043" }}>
      <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 0.5L0.5 2.25V5.25C0.5 7.75 2.25 10.05 4.5 10.5C6.75 10.05 8.5 7.75 8.5 5.25V2.25L4.5 0.5Z" fill="#2ea043" fillOpacity="0.15" stroke="#2ea043" strokeWidth="0.75"/><path d="M2.5 5.5L3.75 6.75L6.5 4" stroke="#2ea043" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
      Local Only · Verified
    </span>
  </div>
  <div>
    <button onClick={() => { setBugOpen(true); setBugSuccess(false); }} style={{ background: "none", border: "none", padding: 0, color: "inherit", font: "inherit", opacity: 0.4, fontSize: 11, cursor: "pointer", letterSpacing: "0.04em", textDecoration: "underline", textUnderlineOffset: 3 }}>Report a bug</button>
  </div>
  <div style={{ marginTop: 8, opacity: 0.5, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>Kin · KIN-NNN · Creator</div>
</footer>
```

**Google Sheets endpoint (both app types):**
`https://script.google.com/macros/s/AKfycbxBRGfOmtQUxyaBGjYVj2mtKinI7qlGm1v921K49TiBDP5RUY9CWK_M-vpLCm2HWJxhuA/exec`

**Rules:**
- The bug button uses `color:inherit; font:inherit; opacity:0.4` — never hard-coded colours
- Footer is never `position:fixed`
- The full bug sheet block (for plain HTML tools) is in `Kin Build Rules.md` under "Bug report feature"

### Creator rule
Always `Darren` unless the user explicitly specifies otherwise.

Exceptions: KIN-015/018=Alice & Darren, KIN-017=Alice, KIN-028=Darren & Daisy, KIN-034=Liam, KIN-035/036/037/038=Darren, KIN-027=William & Darren, KIN-004=dBridge.

---

## Landing pages

Two files kept in sync — always edit both, then `cp sites/kin-landing/index.html index.html`:
- `index.html` (root — kept in sync with sites/kin-landing/)
- `sites/kin-landing/index.html` (canonical source)

### Adding a new tool card
1. Add `--hb-NNN: #colour;` to `:root` CSS vars
2. Add `.release:nth-child(NNN) { animation-delay: Xs; }` (increment by 0.05s)
3. Update count: `<span class="catalog-count">N tools</span>`
4. Add card before closing `</div>` of `.catalog`
5. Card `href="#"` until Cloudflare URL is confirmed — then update both files

### ver-badge pattern (for tools with changelog)
```html
<div class="ver-badge has-log" data-changes='[{"v":"X.Y","date":"DD Mon YYYY","note":"..."},{"v":"1.0","date":"Initial release","note":"First release"}]'>vX.Y</div>
```
Place inside `release-info` after `release-name`.

### Version update checklist — ALL THREE places must be updated together
When any tool receives a bug fix or new feature, bump the version in **all three locations**:
1. **Tool footer** (`sites/kin-NNN-name/index.html`) — the `KIN-NNN · vX.Y · ...` line in the `<footer>`
2. **Landing page card** (`sites/kin-landing/index.html` + sync to `index.html`) — replace plain version div with `ver-badge has-log` if not already present, or update the existing badge version and prepend new changelog entry
3. **`VERSIONS.md`** — update the version column and notes for that tool

Never push a version bump that is missing any of the three.

### Category labels (consistent set)
`Wellbeing` · `Utility` · `Music` · `Health` · `Design` · `Developer` · `Education` · `Learning` · `Shopping` · `Travel`

Never use: `Wellness`, `Utilities`

---

## Catalog files

- `Kin Catalog.md` — full record of every tool: URL, publish dir, summary, notes, fixes applied
- `Kin Build Rules.md` — LLM-facing build instructions, transforms checklist, common pitfalls
- `VERSIONS.md` — version history for all tools

Always update all three after a new tool is shipped.

---

## Repository & deployment

- GitHub repo: `Exit-Records/Kintools` (main branch)
- No build command — static HTML files served directly
- **Deployment: Fully automated via GitHub Actions** (`.github/workflows/deploy.yml`)

### How deployment works (CI/CD — active as of 31 Mar 2026)

Every push to `main` automatically deploys only changed tools to Cloudflare Workers.

- Detects which `sites/kin-*/index.html` files changed
- Generates a Cloudflare Worker script wrapping the HTML
- Deploys via `wrangler deploy` with `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets
- Worker names match directory names exactly (e.g. `kin-030-quote`)
- Landing page (`sites/kin-landing/index.html`) deploys as worker `kin-landing`

**Manual "Deploy All" trigger:** Go to GitHub Actions tab → Deploy to Cloudflare Workers → Run workflow → check "Deploy all workers". Redeploys all 38 tools in one run.

**No more manual Wrangler** needed from dbridge's local machine.

### GitHub Secrets (set 31 Mar 2026)
- `CLOUDFLARE_API_TOKEN` — Workers Scripts Edit + Pages Edit permissions
- `CLOUDFLARE_ACCOUNT_ID` — `ebf08e81432954472b0ee90383daa431`

### Start of session — CRITICAL: pull before any work
Before touching any file, always sync with the remote to avoid divergent commits:

```bash
git fetch origin
git status
```

If the output says "Your branch is behind" or shows divergent commits, merge first:

```bash
git merge origin/main
```

### GitHub push rule — CRITICAL
**NEVER push without user confirmation.** This rule was violated twice in a previous session.

**Also: never push `.github/workflows/` files via the Replit GitHub integration** — it lacks `workflow` scope. Workflow file changes must be pushed by dbridge from their local machine.

---

## KIN Verified Compliance Standard v1.0

Full rules in `Kin Build Rules.md`. Key points every agent must know:

### Data tier — declare on every tool
| Tier | When | Footer row 2 |
|------|------|--------------|
| **Stateless** | Nothing written anywhere | `"Nothing stored, nothing sent"` |
| **Local** | localStorage only | `"Your data stays on this device. Nothing is sent anywhere."` + shield badge + ⓘ popover |
| **Cloud** | Any external data/API | `"Some data is stored externally. See what, why, and how to delete it."` + cloud icon + ⓘ popover |

### Push gate — run before every push
```
[ ] Data tier declared in footer row 2
[ ] Universal checklist passed — no PROHIBITED items
[ ] Elevated checklist passed if Health / Wellbeing / Education / Finance
[ ] Footer rows 1+2+3 correct
[ ] Version bumped in tool footer, landing card, and VERSIONS.md
[ ] KIN Verified v1.0 declared in footer row 2
[ ] Commit message: "KIN-NNN Tool Name: summary"
```

### Absolute PROHIBITED items (any one blocks the push)
- Claimed features the tool does not have
- Technical complexity used to obscure data handling
- Pre-ticked consent boxes or implied consent
- Manufactured urgency, guilt language, or scarcity claims
- Repeated consent requests after decline
- Decline path harder than accept path
- `confirm()` / `alert()` / `prompt()` for destructive actions — use `kinConfirm()`
- Countdown timers or scarcity claims unless real
- Ads or promotional content disguised as tool output
- For Health/Wellbeing: shame/guilt around metrics or missed targets
- For Finance: handling of financial credentials

### Footer row 2 — ⓘ popover tools (localStorage tier)
KIN-002, 007, 009, 010, 013, 014, 015, 016, 018, 022, 024, 025, 026, 027, 030, 031, 032, 035 + any new Local tier tool.

---

## localStorage key convention
Always hyphens: `kin030-readings`, `kin036-theme`. Never underscores.

---

## User preferences

- Iterative development; ask before major architectural changes
- **NEVER push without explicit user confirmation** ("yes", "push it", "go ahead")
- Landing page Cloudflare URLs confirmed by user before updating card hrefs
- Description style: short conversational sentences, plain English, no jargon
- Never default new tools to dark mode

### Demo preview pattern
Whenever a tool gets a `?demo=true` mode, also update `artifacts/kin-preview/server.js` to:
1. Add a named `/demo-NNN` redirect route (e.g. `/demo-008`) that 302s to `/kin-preview/kin-008-flashcards/?demo=true`
2. Add a prominent button link in `buildIndex()` so it appears on the listing page

---

## System architecture (monorepo)

The repo is a pnpm workspace. Kin tools live in `sites/`. There are also artifact packages:

- `artifacts/api-server` — Express 5 / Node 24 API (PostgreSQL + Drizzle ORM)
- `artifacts/kin-preview` — Local preview of the landing page and all tools
- `artifacts/kin-qr-builder` — React/Vite QR builder tool
- `artifacts/mockup-sandbox` — Vite component preview server for canvas mockups

TypeScript 5.9, Zod v4, OpenAPI 3.1, Orval for React Query client generation. Two landing page copies kept in sync (`index.html` root and `sites/kin-landing/index.html`).

---

## Known issues / watch list

- **KIN-036 Blood Pressure** was overwritten by Wets Go content in a previous session (commit 43de278). Restored from git history (commit 96ce9cd) on 31 Mar 2026. localStorage keys `kin036-readings`, `kin036-theme`, `kin036-lastprint` — data is safe on user devices.
- **KIN-018 Kin Nest** and **KIN-027 Kin Gym** landing card SVG icons were not captured in the icon export (31 Mar 2026) due to different card HTML structure — their icons exist in the landing page but the extractor missed them.
- **Android PWA icons**: 27 tools have the Canvas PNG patcher. 11 tools (KIN-001, 004, 019, 020, 022, 024, 025, 026, 028, 033, 034, 035) either have no SVG manifest icon or were not patched — check these if Android icon issues reported.
