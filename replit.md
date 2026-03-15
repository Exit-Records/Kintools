# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Kin Ecosystem — Rules & Gotchas

### Landing page — TWO copies, always edit both
The repo has two copies of the landing page:
| File | Purpose |
|---|---|
| `index.html` (repo root) | **What Netlify actually deploys** — this is the live site |
| `sites/kin-landing/index.html` | Local preview server only (served by kin-preview) |

**Always edit both files together.** The root file is the source of truth for production. When adding a new tool card, apply changes to `index.html` first, then sync `sites/kin-landing/index.html`.

When adding a new KIN tool to the landing page checklist:
- [ ] Add `--hb-N` CSS variable to `:root`
- [ ] Add `nth-child(N)` animation-delay entry
- [ ] Update `catalog-count` span (e.g. "11 tools" → "12 tools")
- [ ] Add the tool card before the closing `</div>` of `.catalog`
- [ ] Push the **root** `index.html` to GitHub (triggers Netlify deploy)
- [ ] Sync `sites/kin-landing/index.html` (for local preview)

### PWA / Add to Home Screen — REQUIRED on every new tool

Every new Kin tool **must** ship with home screen support. Apply this at build time, before pushing to GitHub.

**Three files to create in `sites/kin-NNN-<slug>/`:**

#### 1. `icon.svg`
Use the tool's landing page card design — gradient background + the card SVG icon centred at scale 5.33×:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="<--hb-N value>"/>
      <stop offset="100%" stop-color="<card gradient end colour>"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <g transform="translate(128,128) scale(5.33)"><!-- card SVG inner paths here --></g>
</svg>
```

#### 2. `manifest.json`
```json
{
  "name": "KIN-NNN · Tool Name",
  "short_name": "KIN-NNN",
  "description": "One-line description. Works offline.",
  "start_url": "./",
  "display": "standalone",
  "background_color": "<--hb-N value>",
  "theme_color": "<--hb-N value>",
  "icons": [
    { "src": "./icon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any" },
    { "src": "./icon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "maskable" }
  ]
}
```

#### 3. HTML `<head>` meta tags (add after `<title>`)
```html
<link rel="manifest" href="./manifest.json">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="KIN-NNN">
<link rel="apple-touch-icon" id="apple-touch-icon">
```

#### 4. Canvas apple-touch-icon generator (add before `</body>`)
Generates a 180×180 PNG at runtime — required for iOS "Add to Home Screen".
```html
<script>
(function(){try{
var sz=180,c=document.createElement('canvas');c.width=sz;c.height=sz;
var ctx=c.getContext('2d');
var g=ctx.createLinearGradient(0,0,sz,sz);
g.addColorStop(0,'<c1>');g.addColorStop(1,'<c2>');
ctx.fillStyle=g;
var r=36;ctx.beginPath();ctx.moveTo(r,0);ctx.lineTo(sz-r,0);ctx.arcTo(sz,0,sz,r,r);ctx.lineTo(sz,sz-r);ctx.arcTo(sz,sz,sz-r,sz,r);ctx.lineTo(r,sz);ctx.arcTo(0,sz,0,sz-r,r);ctx.lineTo(0,r);ctx.arcTo(0,0,r,0,r);ctx.closePath();ctx.fill();
var svgStr='<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 48 48"><!-- inner SVG paths --></svg>';
var img=new Image(),blob=new Blob([svgStr],{type:'image/svg+xml'}),url=URL.createObjectURL(blob);
img.onload=function(){ctx.drawImage(img,42,42,96,96);URL.revokeObjectURL(url);var el=document.getElementById('apple-touch-icon');if(el)el.href=c.toDataURL('image/png');};img.src=url;
}catch(e){}})();
</script>
```

**Short name rule:** Always `KIN-NNN` (e.g. `KIN-015`). This is what appears under the icon on the home screen.

### Adding a tool to the local kin-preview server
React apps (KIN-004+) build with absolute `/assets/` paths which break under the preview's subpath. After building and copying to `sites/`:
```bash
NODE_ENV=production pnpm --filter @workspace/<slug> run build
mkdir -p sites/<folder>
cp -r artifacts/<slug>/dist/public/. sites/<folder>/
# Fix absolute asset paths → relative so they work under /kin-preview/<folder>/
sed -i 's|src="/assets/|src="./assets/|g; s|href="/assets/|href="./assets/|g; s|href="/manifest.json"|href="./manifest.json"|g' sites/<folder>/index.html
```
Tools using `viteSingleFile` (KIN-004) produce one self-contained HTML — no path fix needed, just copy the single file.

### GitHub push rules
- **Preview before pushing** — always build, preview locally in the kin-preview server, and get user sign-off before pushing anything to GitHub.
- **After pushing** — always tell the user the Netlify publish directory so they can configure the site immediately. For static HTML tools it is the folder containing `index.html` (e.g. `sites/kin-013-mood-slider`). For React/Vite tools it is `artifacts/<slug>/dist/public`.
- **Never push in parallel** — concurrent PUTs to the same repo cause 409 SHA conflicts. Always `await` each push before starting the next.
- Always fetch the current SHA before a PUT — never assume the file doesn't exist.
- Push order for multi-file changes: dependencies first (e.g. `netlify.toml` before `index.html`).

### Service worker cache busting
Tools with an external `sw.js` (KIN-003, KIN-004, KIN-005) cache aggressively. After any significant change, bump the cache version string inside `sw.js` (e.g. `kin-bpm-v1` → `kin-bpm-v2`). Without this, users see stale content until the old SW expires.

### Creator name
Always `dBridge` — lowercase **d**, uppercase **B**. No exceptions.

### Tool catalogue (current)
| # | Name | Netlify URL | Type |
|---|---|---|---|
| KIN-001 | Ukulele Tuner | mayatuner.netlify.app | Static HTML |
| KIN-002 | Metronome | kinmetronome.netlify.app | Static HTML |
| KIN-003 | BPM Counter | kinbpm.netlify.app | Static HTML + SW |
| KIN-004 | Colour Picker | kincolour.netlify.app | React/Vite |
| KIN-005 | QR Builder | kinqr.netlify.app | React/Vite |
| KIN-006 | Classroom Timer | kinclasstimer.netlify.app | React/Vite |
| KIN-007 | Ambient Mixer | kinambientmix.netlify.app | Static HTML |
| KIN-008 | Flashcards | kinflashcards.netlify.app | Static HTML |
| KIN-009 | Jet Lag Planner | kinjetlag.netlify.app | Static HTML |
| KIN-010 | Audio Calculators | kinaudiocalc.netlify.app | Static HTML |
| KIN-011 | Unit Price Calc | kinunitcalc.netlify.app | Static HTML |
| KIN-012 | Name Picker | kinnamepick.netlify.app | Static HTML |
| KIN-013 | Mood Slider | kinmoodslider.netlify.app | Static HTML |
| KIN-014 | Breathing Exercise | kinbreathing.netlify.app | Static HTML |
| KIN-015 | Quiet Cycle | kinquietcycle.netlify.app | Static HTML |
| KIN-016 | Recipe Scaler | kinrecipescaler.netlify.app | Static HTML |
| KIN-017 | Decision Flip | kindecisionflip.netlify.app | Static HTML |
| KIN-018 | Kin Nest | kinnestapp.netlify.app | Static HTML |

---

## Netlify Deployment — Lessons Learned

When deploying any Kin tool from this monorepo to Netlify, apply these fixes upfront:

### 1. `netlify.toml` — always run from workspace root
```toml
[build]
  command = "pnpm install && pnpm --filter @workspace/<slug> run build"
  publish = "artifacts/<slug>/dist/public"

[build.environment]
  NODE_VERSION = "20"
  PNPM_VERSION = "10"
  BASE_PATH    = "/"
```
- **Do NOT** set `base = "artifacts/<slug>"` — pnpm workspaces must install from the root
- Set `PNPM_VERSION` explicitly so Netlify uses pnpm instead of npm
- Set `BASE_PATH = "/"` so vite.config.ts gets it during build

### 2. `pnpm-lock.yaml` must be pushed to GitHub
- Netlify detects the package manager from the lockfile
- Without it, Netlify defaults to npm and the install fails
- Always include `pnpm-lock.yaml` in the repo (do not add it to `.gitignore`)

### 3. `vite.config.ts` — never hard-throw on missing env vars
Replit injects `PORT` and `BASE_PATH` at runtime, but Netlify doesn't set `PORT` during a static build. Always make them optional:
```ts
const port     = process.env.PORT     ? Number(process.env.PORT) : 3000;
const basePath = process.env.BASE_PATH ?? "/";
```
Never use a hard `throw new Error(...)` for these — it crashes the build.

### 4. GitHub push for monorepo
- Use the GitHub Git Data API (trees → commit → ref update) to push many files at once
- For an empty repo, create a seed file first (e.g. README.md via PUT /contents/), then use the tree API with `base_tree`
- Always push `pnpm-lock.yaml` alongside code changes

---

## Artifacts

### `artifacts/kin-qr-builder` — Kin QR Builder (KIN-005)

A privacy-first QR code generator for the Kin ecosystem. Single-page React app, no backend.

- Creator: dBridge · Catalog: KIN-005
- Input types: URL, Text, Email, Phone, Wi-Fi, Contact (vCard)
- Live QR generation as you type using the `qrcode` library
- Export: PNG, SVG, Copy to clipboard, Print
- Options: size slider, error correction (L/M/Q/H), foreground/background colour pickers, quiet zone toggle
- Contrast ratio warning if colours are too similar for reliable scanning
- PWA: service worker + manifest included
- All processing is in-browser — no data leaves the device
- Preview path: `/`

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
