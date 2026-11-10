# TaskFlow API

Node.js + Express + TypeScript API for TaskFlow.

## Responsibilities

- Registration, login, session lookup, and logout.
- Task CRUD with authenticated-user ownership checks.
- Request validation, safe errors, rate limiting, and health endpoints.
- PostgreSQL access through a bounded connection pool.

## Local commands

Run these from the repository root:

```powershell
Copy-Item backend/.env.example backend/.env
# Edit backend/.env and set DATABASE_URL to your local PostgreSQL credentials.
npm install
npm run db:migrate
npm run dev:api
```

The API listens on `http://127.0.0.1:5000`.

## Health endpoints

- `GET /health/live`: process is running.
- `GET /health/ready`: database connection is working.

## Structure

- `src/app.ts`: Express middleware and route registration.
- `src/server.ts`: process startup and graceful shutdown.
- `src/routes/`: HTTP route handlers.
- `src/middleware/`: authentication and centralized error handling.
- `src/validation/`: Zod request schemas.
- `src/db/`: PostgreSQL pool and migration runner.
- `migrations/`: ordered SQL migrations.
- `test/`: backend tests.
