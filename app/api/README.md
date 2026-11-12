# Backend API (`app/api/`)

The TaskFlow backend service implemented in Node.js, Express, and TypeScript.

---

## Directory Structure

```text
api/
├── package.json             # Workspace package manifest (@taskflow/api)
├── tsconfig.json            # NodeNext TypeScript compiler options
├── .env.example             # Safe environment variable template
├── src/
│   ├── config/              # Validated environment configuration (Zod)
│   ├── modules/             # Feature-oriented modules
│   │   ├── health/          # Healthcheck routes (/health/live, /health/ready)
│   │   ├── auth/            # Planned Stage 3 authentication routes
│   │   └── tasks/           # Planned Stage 3 task management routes
│   ├── middleware/          # Planned custom request middlewares
│   ├── db/                  # Planned Stage 2 PostgreSQL connection pool
│   ├── shared/              # API-specific utilities and helpers
│   ├── app.ts               # Express application pipeline (Helmet, CORS, Error Handler)
│   └── server.ts            # HTTP server startup with graceful shutdown
└── tests/                   # Automated tests (using node:test and tsx)
```

---

## Implemented Endpoints (Stage 1)

| Method | Endpoint | Description | Status |
|---|---|---|---|
| `GET` | `/` | Root informational endpoint listing active routes | Implemented |
| `GET` | `/health/live` | Process liveness probe (HTTP 200 `{"status": "alive"}`) | Implemented |
| `GET` | `/health/ready` | Process readiness probe (HTTP 200 `{"status": "ready"}`) | Implemented (Stage 1) |

---

## Running and Testing

```powershell
# Run from repository root
npm run dev:api       # Start API in dev watch mode
npm run build:api     # Compile TypeScript to dist/
npm run test:api      # Run automated tests (18 tests via node:test)
```
