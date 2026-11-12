# Health Module (`app/api/src/modules/health/`)

Provides operational liveness and readiness health endpoints for monitoring and orchestrator integration.

---

## Implemented Endpoints

### 1. `GET /health/live`
- **Purpose:** Process liveness probe.
- **Contract:** Returns HTTP 200 with `{"status": "alive"}` as long as the Node.js event loop is running and accepting HTTP requests.
- **Behavior:** Strictly decoupled from external services or databases so the process is not pointlessly killed if a downstream dependency is temporarily unreachable.

### 2. `GET /health/ready`
- **Purpose:** Readiness probe.
- **Contract (Stage 1):** Returns HTTP 200 with `{"status": "ready", "stage": "stage-1-process-only", "timestamp": "..."}`.
- **Note on Stage 1 Scope:** In Stage 1, this probe confirms that Express is initialized and capable of receiving traffic. Full dependency readiness (checking the active PostgreSQL connection pool) will be added in Stage 2.

---

## Automated Tests

Covered by `health.test.ts` using Node.js built-in `node:test` runner.
