# Stage 1: Workspace and Application Foundation

> **Status:** Implemented & Verified  
> **Area:** Architecture & Foundation  
> **Date:** 2026-11-12  
> **Applicable Decisions:** [ADR 0001 (Folder Structure)](../decisions/0001-project-folder-structure.md), [ADR 0002 (Application Foundation)](../decisions/0002-stage-1-application-foundation.md)

---

## 1. Why

TaskFlow requires an isolated, maintainable structure that supports full-stack development without mixing frontend and backend dependencies or making local development complex.

Per [ADR 0001](../decisions/0001-project-folder-structure.md), application code is organized under `app/`:
1. `app/web/` — React 19 browser frontend client.
2. `app/api/` — Node.js + Express backend service.
3. Clean separation of concerns between client presentation and server logic.
4. Single-command dependency management and unified type-checking via npm workspaces.

---

## 2. What Was Added

- **Root Monorepo Configuration:**
  - [`package.json`](../../../package.json): Configures npm workspaces targeting `["app/api", "app/web"]`, defining unified commands (`dev:api`, `dev:web`, `build:api`, `build:web`, `typecheck`, `test`).
  - [`package-lock.json`](../../../package-lock.json): Pinned dependency tree.
- **`app/api/` (Express + TypeScript Backend):**
  - [`package.json`](../../../app/api/package.json): `@taskflow/api` dependencies (`express`, `cors`, `helmet`, `cookie-parser`, `dotenv`, `zod`).
  - [`tsconfig.json`](../../../app/api/tsconfig.json): Strict NodeNext TypeScript configuration with `noEmitOnError: true`.
  - [`.env.example`](../../../app/api/.env.example): Documented environment template with explicit port and origin guidance.
  - [`src/config/config.ts`](../../../app/api/src/config/config.ts): Strongly typed Zod environment validation (PORT integer bounds 1–65535, clean origin check).
  - [`src/modules/health/health.routes.ts`](../../../app/api/src/modules/health/health.routes.ts): Modular liveness (`/health/live`) and readiness (`/health/ready`) probes.
  - [`src/app.ts`](../../../app/api/src/app.ts): Express pipeline with Helmet, restricted CORS origin, body limit, foundation cookie-parser, root endpoint, and centralized error handling.
  - [`src/server.ts`](../../../app/api/src/server.ts): HTTP listener with shutdown guard and 10s fallback timer.
  - [`src/config/config.test.ts`](../../../app/api/src/config/config.test.ts): Unit tests for configuration schema validation.
  - [`src/modules/health/health.test.ts`](../../../app/api/src/modules/health/health.test.ts): Integration tests for endpoints, security headers, and 404 responses.
- **`app/web/` (React + TypeScript + Vite Frontend):**
  - [`package.json`](../../../app/web/package.json): `@taskflow/web` with React 19 and Vite 6.
  - [`tsconfig.json`](../../../app/web/tsconfig.json): Strict bundler-oriented TypeScript configuration.
  - [`vite.config.ts`](../../../app/web/vite.config.ts): Development proxy routing `/health` and `/api` to port 5000.
  - [`index.html`](../../../app/web/index.html): HTML entry point.
  - [`src/main.tsx`](../../../app/web/src/main.tsx): DOM mount with React StrictMode and defensive `#root` existence check.
  - [`src/app/App.tsx`](../../../app/web/src/app/App.tsx): Health status dashboard with accessible live region (`aria-live="polite"`), manual re-check, and unmount cancellation via `AbortController`.
  - [`src/styles/index.css`](../../../app/web/src/styles/index.css): Responsive CSS design system (<3 KB) supporting `:focus-visible` and `prefers-reduced-motion`.

---

## 3. Business Logic

At Stage 1, business logic governs operational health, process lifecycle, and security boundaries:
- **Liveness (`GET /health/live`)**: Responds with HTTP 200 `{"status": "alive"}` as long as the Node process is running. Strictly independent of external dependencies so orchestrators do not restart healthy containers during downstream outages.
- **Readiness (`GET /health/ready`)**: In Stage 1, confirms that Express is initialized and processing traffic (`stage: "stage-1-process-only"`). In Stage 2, this will actively probe PostgreSQL connection pool health.
- **Root Informational Endpoint (`GET /`)**: Returns service metadata and endpoint directory (`endpoints: { healthLive, healthReady }`).
- **Configuration Boundary**: If `PORT` is out of bounds (not integer 1–65535) or `FRONTEND_ORIGIN` contains paths/queries, server startup halts with an informative error.
- **Graceful Shutdown**: Traps `SIGINT`/`SIGTERM`, closes the HTTP server, and uses an unreferenced 10-second timer to force exit if connections stall.

---

## 4. How the Flow Works

1. Developer launches API (`npm run dev:api`) on port 5000.
2. Developer launches frontend (`npm run dev:web`) on port 5173.
3. User opens `http://localhost:5173` in a browser.
4. `main.tsx` validates `#root` and renders `App.tsx` inside React StrictMode.
5. `App.tsx` initializes an `AbortController` and requests `/health/live`.
6. Vite's local dev server intercepts the `/health` prefix and proxies the request to `http://localhost:5000/health/live`.
7. Express applies Helmet headers, checks CORS origin, and returns `{"status": "alive"}`.
8. `App.tsx` validates the response shape and updates state with the browser-observed timestamp.
9. The UI displays `API Status: ALIVE` in an accessible live region.

---

## 5. Code Map

| File Path | Role | Key Export / Feature |
|---|---|---|
| [`package.json`](../../../package.json) | Monorepo root | Workspace targets `app/api`, `app/web` |
| [`app/api/src/config/config.ts`](../../../app/api/src/config/config.ts) | Environment management | `config` object, `envSchema`, `validateConfig()` |
| [`app/api/src/modules/health/health.routes.ts`](../../../app/api/src/modules/health/health.routes.ts) | Health probes | Express Router for `/live` and `/ready` |
| [`app/api/src/app.ts`](../../../app/api/src/app.ts) | Express application | Security middleware pipeline, CORS, 404, error handler |
| [`app/api/src/server.ts`](../../../app/api/src/server.ts) | Server entry point | `app.listen()`, shutdown lifecycle, timeout fallback |
| [`app/web/vite.config.ts`](../../../app/web/vite.config.ts) | Bundler configuration | Development proxy for `/health` and `/api` |
| [`app/web/src/main.tsx`](../../../app/web/src/main.tsx) | Frontend entry point | Defensive DOM mounting and React StrictMode |
| [`app/web/src/app/App.tsx`](../../../app/web/src/app/App.tsx) | Frontend UI component | Connection check, manual re-check, accessible status |
| [`app/web/src/styles/index.css`](../../../app/web/src/styles/index.css) | Global stylesheet | CSS custom properties, focus states, reduced motion |

---

## 6. Concept Teaching

### What is a Development Proxy vs Production Routing?
- **Development Proxy (Vite `server.proxy`):** In local development, the frontend runs on `localhost:5173` and the API runs on `localhost:5000`. Browsers enforce the Same-Origin Policy. Vite's proxy intercepts requests to `/api` or `/health` and forwards them to `localhost:5000` on the backend, avoiding CORS friction during development.
- **Production Routing:** In production, Vite's dev server does not exist. The built static files are served by a web server (e.g., Nginx, AWS CloudFront, or S3). The production reverse proxy must route `/api/*` to the backend container or load balancer.

### Client Observation Time vs Server Timestamps
- The timestamp in `App.tsx` (`observedAt`) records when the browser received and parsed the response. It does not represent server clock time. Clearly separating client observation time from server timestamps prevents confusion when diagnosing distributed latency or clock drift.

---

## 7. Configuration and Commands

### Environment Variables (`app/api/.env`)
| Variable | Type | Allowed Values | Default | Purpose |
|---|---|---|---|---|
| `PORT` | Integer | `1` – `65535` | `5000` | HTTP listener port |
| `NODE_ENV` | String | `development` \| `production` \| `test` | `development` | Runtime mode |
| `FRONTEND_ORIGIN` | URL (Origin) | Scheme + host `[:port]` (no path) | `http://localhost:5173` | Allowed CORS origin |

### Commands (PowerShell from `E:\Taskflow`):
```powershell
# Install all dependencies across workspaces
npm install

# Typecheck both workspaces
npm run typecheck

# Run backend automated tests (18 tests)
npm test

# Run backend API in dev mode
npm run dev:api

# Run frontend client in dev mode
npm run dev:web

# Build production bundles
npm run build:api
npm run build:web
```

---

## 8. Security and Failure Behavior

- **Information Disclosure:** Express `X-Powered-By` header disabled; Helmet applies strict security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- **CORS Lockdown:** Restricted strictly to `config.FRONTEND_ORIGIN`. Credentials enabled for upcoming session cookies.
- **Invalid Environment:** Server refuses to start if `PORT` or `FRONTEND_ORIGIN` is invalid.
- **Unhandled Routes:** 404 handler returns structured JSON: `{"message": "Route not found."}`.
- **Centralized Error Handling:** Production hides internal stack traces; development exposes helpful messages.

---

## 9. Verification Results

Actual commands executed on Windows 11 (PowerShell) with Node.js `v24.20.0` and npm `11.19.0`:

| Command | Status | Result / Evidence |
|---|---|---|
| `npm run typecheck` | Passed | Exited with code 0. Both `@taskflow/api` and `@taskflow/web` clean. |
| `npm test` | Passed | Exited with code 0. 18 tests passed across 4 suites in 480ms. |
| `npm run build:api` | Passed | TypeScript compiled to `app/api/dist/` cleanly. |
| `npm run build:web` | Passed | Vite production bundle generated (227 kB JS, 2.77 kB CSS). |
| Runtime API Probe | Passed | `GET /` returned 200 with online status; `GET /health/live` returned 200 alive. |

---

## 10. Theory Connection

- [Phase 0 — Engineering Foundations: Client-Server Architecture](../../00-foundations/client-server-architecture.md)
- [Phase 0 — HTTP, HTTPS, and DNS](../../00-foundations/http-https-dns.md)
- [Phase 1 — Lesson 1.1: Full-Stack Architecture](../../01-application/lesson-1.1-full-stack-architecture.md)
- [Phase 1 — Lesson 1.3: Node.js & Express Backend](../../01-application/lesson-1.3-nodejs-express-backend.md)

---

## 11. Design Trade-offs and Implementation Decisions

- **npm Workspaces over Turborepo:** Standard npm workspaces avoid heavy background daemons and keep memory under 100MB on an 8 GB RAM machine.
- **Native `node:test` over Jest:** Using Node's native test runner eliminates hundreds of transitive dependencies, executes instantly, and avoids build delays.
- **Plain CSS over Tailwind/Component Library:** Avoids extra compiler plugins and provides full control over accessibility and CSS variables.

---

## 12. Current Limitations

1. **Readiness Probe Scope:** `/health/ready` currently checks process-level readiness only. PostgreSQL connection verification will be introduced in Stage 2.
2. **Development Proxy Scope:** Vite's `server.proxy` is for local development only. Production deployments require a reverse proxy (e.g. Nginx).
3. **Cookie Parser:** `cookie-parser` is active as foundation middleware, but active session validation begins in Stage 3.

---

## 13. Next Steps

- **Stage 2:** PostgreSQL connection pooling (`pg`), schema design (`users`, `sessions`, `tasks`), and SQL migrations under `database/`.
