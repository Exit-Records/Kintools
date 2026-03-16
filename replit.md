# Overview

This project is a pnpm workspace monorepo utilizing TypeScript for building a collection of web tools, collectively known as the "Kin Ecosystem." The primary goal is to provide a robust, scalable, and maintainable platform for developing and deploying these tools. The project emphasizes a privacy-first approach, with all processing occurring client-side. The vision is to expand the ecosystem with more privacy-conscious and user-centric applications.

**Current tools: KIN-001 through KIN-019 (19 tools live). Next: KIN-020.**

Latest: KIN-019 · Markdown Download — `sites/kin-019-markdown-download/` — `https://kinmarkdowndl.netlify.app`

## User Preferences

I prefer iterative development, with a strong emphasis on testing and validation at each step. I value clear, concise explanations and direct communication. Please ask before making any major architectural changes or significant modifications to existing features. Ensure that all new tools include PWA support and adhere to the specified naming conventions and deployment procedures. I expect all changes to be previewed locally and signed off before pushing to GitHub.

## System Architecture

The system is structured as a pnpm monorepo with individual packages managing their own dependencies.

### Core Technologies:
- **Monorepo Management**: pnpm workspaces
- **Backend**: Node.js 24, Express 5
- **Database**: PostgreSQL with Drizzle ORM
- **Type Safety & Validation**: TypeScript 5.9, Zod (`zod/v4`), `drizzle-zod`
- **API Definition**: OpenAPI 3.1
- **API Client Generation**: Orval for React Query hooks and Zod schemas
- **Bundling**: esbuild (CJS bundle)

### UI/UX Decisions:
- **Landing Page**: The project maintains two synchronized copies of `index.html` (root for deployment, `sites/kin-landing/index.html` for local preview) to ensure consistency between development and production environments.
- **PWA Support**: Every new Kin tool *must* include Progressive Web Application (PWA) features, including `icon.svg`, `manifest.json`, and specific HTML meta tags for home screen installation. A JavaScript snippet generates a 180x180 PNG `apple-touch-icon` at runtime for iOS.
- **Tool Naming**: Short names for PWA installations consistently follow the `KIN-NNN` format (e.g., `KIN-015`).
- **Creator Name**: Always `Darren` with a lowercase 'd' and uppercase 'B'.

### Technical Implementations:
- **API Server (`@workspace/api-server`)**: An Express 5 server handling API requests, utilizing `@workspace/api-zod` for request/response validation and `@workspace/db` for data persistence.
- **Database Layer (`@workspace/db`)**: Manages PostgreSQL interactions via Drizzle ORM, defining schema models and handling migrations.
- **API Specification (`@workspace/api-spec`)**: Centralizes the OpenAPI 3.1 specification and Orval configuration for generating API clients and Zod schemas.
- **API Client (`@workspace/api-client-react`)**: Provides generated React Query hooks and a fetch client for interacting with the API.
- **API Schemas (`@workspace/api-zod`)**: Contains generated Zod schemas for API request and response validation.
- **TypeScript Configuration**: Utilizes TypeScript composite projects, extending a base configuration, ensuring proper type-checking across the monorepo via root-level `tsc --build --emitDeclarationOnly`.

### Deployment & Build Process:
- **Netlify Deployment**: Automated deployments to Netlify are configured via `netlify.toml`, specifying pnpm for dependency installation and `artifacts/<slug>/dist/public` as the publish directory. `pnpm-lock.yaml` is crucial for Netlify to correctly identify the package manager.
- **Asset Path Handling**: For local previews, asset paths in built React applications are transformed from absolute to relative to ensure correct loading under subpaths.
- **Service Worker Cache Busting**: Tools employing service workers require manual cache version bumping in `sw.js` after significant changes to ensure users receive the latest content.

## External Dependencies

- **Netlify**: Used for continuous deployment and hosting of the Kin tools.
- **PostgreSQL**: The primary relational database for backend services.
- **pnpm**: Package manager for the monorepo.
- **Express**: Web application framework for the API server.
- **Drizzle ORM**: TypeScript ORM for interacting with PostgreSQL.
- **Zod**: TypeScript-first schema declaration and validation library.
- **Orval**: OpenAPI to TypeScript client code generator.
- **esbuild**: Extremely fast JavaScript bundler.
- **React**: JavaScript library for building user interfaces (for specific tools like KIN-004, KIN-005, KIN-006).
- **Vite**: Next-generation frontend tooling (for specific React tools).
- **GitHub Git Data API**: Used for programmatic pushes and managing repository content.
- **`qrcode` library**: Used client-side for QR code generation in KIN-005.