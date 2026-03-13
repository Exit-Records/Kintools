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
