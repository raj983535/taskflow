# Stage 1: Workspace and Application Foundation

> **Status:** Implemented & Verified  
> **Area:** Architecture & Foundation  
> **Date:** 2026-11-12

---

## 1. Why

TaskFlow requires an isolated, maintainable structure that supports full-stack development without mixing frontend and backend dependencies or making local development complex.

Per [Decision Record 0001 (Project Folder Structure)](../decisions/0001-project-folder-structure.md) and [`folderstructure.md`](../../../folderstructure.md), the application code lives under `app/`:
1. `app/web/` — Browser frontend client (React + Vite + TypeScript).
2. `app/api/` — Backend API service (Node.js + Express + TypeScript).
3. Clear separation of concerns between client presentation and server logic.
4. Single-command dependency management and unified type-checking via npm workspaces.

---

## 2. What Was Added

- **Root `package.json`**: Configures npm workspaces targeting `app/api` and `app/web`, defining scripts (`dev:api`, `dev:web`, `build:api`, `build:web`, `typecheck`).
- **`app/api/` (Express + TypeScript Backend)**:
  - `package.json`: Minimal runtime dependencies (`express`, `cors`, `helmet`, `cookie-parser`, `dotenv`, `zod`).
  - `tsconfig.json`: Modern NodeNext TypeScript setup.
  - `src/config/config.ts`: Strongly typed environment parser with Zod defaults.
  - `src/modules/health/health.routes.ts`: Modular health probes (`/health/live`, `/health/ready`).
  - `src/app.ts`: Express application with Helmet security headers, CORS origin check, and health router.
  - `src/server.ts`: HTTP server entry point with graceful shutdown handling.
  - `.env.example`: Safe configuration template.
- **`app/web/` (React + TypeScript + Vite Frontend)**:
  - `package.json`: React 19 and Vite tooling.
  - `tsconfig.json`: Bundler-compatible TypeScript configuration.
  - `vite.config.ts`: Development server proxy routing `/health` and `/api` to port 5000.
  - `src/app/App.tsx`: Connection check dashboard verifying communication with the backend.
  - `src/styles/index.css`: Lightweight plain CSS design system (<3 KB).

---

## 3. Business Logic

At Stage 1, the business logic focuses on system health and network boundaries:
- **Liveness (`/health/live`)**: Responds with `200 OK` (`{"status": "alive"}`) as long as the Node.js event loop is running. It does not depend on database or third-party availability.
- **Readiness (`/health/ready`)**: Verifies whether the process can receive requests (in Stage 2, it will check the PostgreSQL connection pool).
- **Graceful Shutdown**: The API captures `SIGINT` and `SIGTERM` signals, closes the HTTP listener cleanly, and exits without dropping in-flight requests.

---

## 4. How the Flow Works

1. The developer starts the API on port 5000 (`npm run dev:api`).
2. The developer starts the frontend on port 5173 (`npm run dev:web`).
3. When `app/web` loads in the browser, `App.tsx` dispatches a `fetch('/health/live')` request.
4. Vite's dev server intercepts the `/health` prefix and proxies the request to `http://localhost:5000/health/live`.
5. The Express backend receives the request, passes it through security middleware (Helmet, CORS), and returns JSON.
6. The frontend renders a green `API Status: ALIVE` indicator.

---

## 5. Code Map

| File Path | Role | Key Function / Export |
|---|---|---|
| [`package.json`](file:///e:/taskflow/package.json) | Monorepo root | Workspace definitions (`app/api`, `app/web`) |
| [`app/api/src/config/config.ts`](file:///e:/taskflow/app/api/src/config/config.ts) | Environment management | `config` object validated via Zod |
| [`app/api/src/modules/health/health.routes.ts`](file:///e:/taskflow/app/api/src/modules/health/health.routes.ts) | Health probes | Express Router for `/live` and `/ready` |
| [`app/api/src/app.ts`](file:///e:/taskflow/app/api/src/app.ts) | Express application | Middleware pipeline and route mounts |
| [`app/api/src/server.ts`](file:///e:/taskflow/app/api/src/server.ts) | Entry point | `app.listen()` and graceful shutdown handlers |
| [`app/web/vite.config.ts`](file:///e:/taskflow/app/web/vite.config.ts) | Bundler configuration | Dev server proxy rules |
| [`app/web/src/app/App.tsx`](file:///e:/taskflow/app/web/src/app/App.tsx) | Client component | Healthcheck polling and status rendering |

---

## 6. Configuration and Commands

### Running Locally (PowerShell):
```powershell
# From project root: E:\Taskflow
npm install

# Terminal 1: Run the backend API
npm run dev:api

# Terminal 2: Run the frontend web client
npm run dev:web

# Run typechecks
npm run typecheck
```

---

## 7. Next Steps

- **Stage 2:** Introduce PostgreSQL persistence under `database/`, connection pooling (`pg`), and migration management.
