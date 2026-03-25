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

**Current tools: KIN-001 through KIN-028 (28 tools). Next: KIN-029.**

Latest: KIN-028 · Scan — `sites/kin-028-scan/` — `https://scan.kintools.net`

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

3. Wrap `return (` in a Fragment and add the bug backdrop + sheet after the closing root `</div>`:
```tsx
return (
  <>
  <div ...> {/* root div */}
    ...
    {/* footer JSX above */}
  </div>

  {bugOpen && (
    <div onClick={() => setBugOpen(false)} style={{ display: "block", position: "fixed", inset: 0, zIndex: 901, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }} />
  )}
  <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 902, background: "#17171f", borderRadius: "20px 20px 0 0", border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none", padding: "0 20px 40px", boxShadow: "0 -8px 40px rgba(0,0,0,0.6)", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", transform: bugOpen ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s cubic-bezier(0.32,0.72,0,1)" }}>
    {!bugSuccess ? (
      <>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}><div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)" }} /></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 8px" }}>
          <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 600, margin: 0 }}>Report a bug</h2>
          <button onClick={() => setBugOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 22, cursor: "pointer", padding: "0 4px", lineHeight: 1, flex: "none", minHeight: 0 }}>×</button>
        </div>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          await fetch("https://script.google.com/macros/s/AKfycbxBRGfOmtQUxyaBGjYVj2mtKinI7qlGm1v921K49TiBDP5RUY9CWK_M-vpLCm2HWJxhuA/exec", { method: "POST", body: fd });
          setBugSuccess(true);
        }} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input type="hidden" name="tool" value="KIN-NNN Tool Name" />
          <textarea name="description" required placeholder="What went wrong? What did you expect?" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", height: 90 }} />
          <input type="email" name="email" placeholder="Email for follow-up (optional)" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
          <button type="submit" style={{ width: "100%", padding: 13, borderRadius: 12, background: "#5b5ef4", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.02em" }}>Send report</button>
        </form>
      </>
    ) : (
      <>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}><div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)" }} /></div>
        <div style={{ textAlign: "center", padding: "28px 0 8px" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ display: "block", margin: "0 auto 16px" }}><circle cx="12" cy="12" r="11" stroke="#2ea043" strokeWidth="1.5"/><path d="M7 12.5l3.5 3.5L17 9" stroke="#2ea043" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 600, margin: "0 0 8px" }}>Thanks for the report</h3>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.5, margin: "0 0 28px" }}>We'll take a look. Your feedback<br/>helps make Kin better for everyone.</p>
          <button onClick={() => setBugOpen(false)} style={{ padding: "11px 32px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Done</button>
        </div>
      </>
    )}
  </div>
  </>
);
```

**Google Sheets endpoint (both app types):**
`https://script.google.com/macros/s/AKfycbxBRGfOmtQUxyaBGjYVj2mtKinI7qlGm1v921K49TiBDP5RUY9CWK_M-vpLCm2HWJxhuA/exec`

**Rules:**
- The bug button uses `color:inherit; font:inherit; opacity:0.4` — never hard-coded colours
- Footer is never `position:fixed`
- The full bug sheet block (for plain HTML tools) is in `Kin Build Rules.md` under "Bug report feature"

### Creator rule
Always `Darren` unless the user explicitly specifies otherwise.

---

## Landing pages

Two files kept in sync — always edit both:
- `index.html` (root — kept in sync with sites/kin-landing/)
- `sites/kin-landing/index.html` (Cloudflare Pages deploy)

### Adding a new tool card
1. Add `--hb-NNN: #colour;` to `:root` CSS vars
2. Add `.release:nth-child(NNN) { animation-delay: Xs; }` (increment by 0.05s)
3. Update count: `<span class="catalog-count">N tools</span>`
4. Add card before closing `</div>` of `.catalog`
5. Card `href="#"` until Cloudflare URL is confirmed — then update both files

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
- No build command — static HTML files served directly

### Cloudflare Pages setup for each new tool — ALWAYS REMIND USER

When a new tool is ready to deploy, the user must create a new Cloudflare Pages project:

Steps to remind the user:
1. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → `Exit-Records/Kintools`
2. Build command: leave blank
3. Build output directory: `sites/kin-NNN-tool-name`
4. Set custom domain: `toolname.kintools.net`

### GitHub push rule — CRITICAL
**Always use the Git Tree API for pushes. Never use the Contents API (PUT per file).**
Every Contents API PUT = one commit = one Cloudflare Pages deploy per connected site (~35 sites).
Multiple individual pushes in a session burn through Cloudflare build minutes fast.

Correct approach — single batched commit for all files changed in a session:
1. Create blobs for each changed file (`POST /repos/.../git/blobs`)
2. Fetch current tree SHA (`GET /repos/.../git/ref/heads/main`)
3. Create new tree with all blob SHAs (`POST /repos/.../git/trees`)
4. Create commit pointing to new tree (`POST /repos/.../git/commits`)
5. Update ref (`PATCH /repos/.../git/refs/heads/main`)

This produces **1 commit → 1 deploy per site**, no matter how many files changed.

---

## User preferences

- Iterative development; ask before major architectural changes
- All changes pushed to GitHub before handing back
- Landing page Cloudflare URLs confirmed by user before updating card hrefs
- Description style: short conversational sentences, plain English, no jargon
- Never default new tools to dark mode

### Demo preview pattern
Whenever a tool gets a `?demo=true` mode, also update `artifacts/kin-preview/server.js` to:
1. Add a named `/demo-NNN` redirect route (e.g. `/demo-008`) that 302s to `/kin-preview/kin-008-flashcards/?demo=true`
2. Add a prominent button link in `buildIndex()` so it appears on the listing page — one tap from the Kin Static Preview thumbnail in the Replit mobile app

This is necessary because the Replit mobile preview pane has no URL bar for typing query params.

---

## System architecture (monorepo)

The repo is a pnpm workspace. Kin tools live in `sites/`. There are also artifact packages:

- `artifacts/api-server` — Express 5 / Node 24 API (PostgreSQL + Drizzle ORM)
- `artifacts/kin-preview` — Local preview of the landing page
- `artifacts/kin-qr-builder` — React/Vite QR builder tool
- `artifacts/mockup-sandbox` — Vite component preview server for canvas mockups

TypeScript 5.9, Zod v4, OpenAPI 3.1, Orval for React Query client generation. Two landing page copies kept in sync (`index.html` root and `sites/kin-landing/index.html`).
