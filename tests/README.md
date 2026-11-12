# TaskFlow tests

This directory is reserved for automated tests that span application and service boundaries.

---

## Test Locations and Hierarchy

- **Unit and Modular Tests:** Located close to the source they test (e.g., [`app/api/src/config/config.test.ts`](../app/api/src/config/config.test.ts) and [`app/api/src/modules/health/health.test.ts`](../app/api/src/modules/health/health.test.ts)), executed via Node.js native `node:test` runner.
- **[integration/](integration/README.md)**: Reserved for integration tests spanning API, database, and local services (introduced in Stage 2 with PostgreSQL).
- **[e2e/](e2e/README.md)**: Reserved for end-to-end browser-to-API user journeys (introduced in Stage 4 with the Kanban board).

---

## Running Existing Tests

```powershell
# Run from repository root (executes 18 automated tests in app/api)
npm test
```
