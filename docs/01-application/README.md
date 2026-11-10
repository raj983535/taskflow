# Phase 1 — Application Development

Phase 1 turns TaskFlow from a documentation-only repository into a working full-stack application.

## What we are building

- A React + TypeScript single-page frontend.
- A Node.js + Express + TypeScript REST API.
- A PostgreSQL relational database.
- Email/password registration and login using server-side sessions.
- User-owned task creation, reading, updating, and deletion.
- Input validation, error handling, health checks, and automated schema tests.

## Architecture

```text
Windows 11 browser
    |
    | http://127.0.0.1:5173
    v
Vite development server
    |
    | /api/* and /health/* proxy
    v
Express API (127.0.0.1:5000)
    |
    | node-postgres connection pool
    v
PostgreSQL (127.0.0.1:5432)
```

The browser does not connect directly to PostgreSQL. It sends requests to the API. The API authenticates the caller, validates input, enforces task ownership, and performs parameterized SQL queries.

## Documentation in this phase

1. [Application architecture](architecture.md)
2. [Local setup on Windows 11](local-development-setup.md)
3. [Database design](database-design.md)
4. [API reference](api-reference.md)
5. [Authentication and security](authentication-and-security.md)
6. [Migrations and tests](migrations-and-testing.md)
7. [Phase 1 implementation report](phase-1-completion-report.md)

## Where the code lives

- `frontend/`: React interface, API client, TypeScript types, Vite configuration.
- `backend/`: Express application, routes, middleware, PostgreSQL pool, migrations, tests.
- Root `package.json`: npm workspace and development/build/test commands.

## What Phase 1 deliberately does not include

- Docker or Docker Compose (Phase 3/4).
- Linux server administration (Phase 5).
- AWS infrastructure or cloud deployment (Phase 6/7).
- CI/CD automation (Phase 8).
- Monitoring, load balancing, Kubernetes, or Terraform (later phases).

We will add those only after the application can be run and understood locally.

## Definition of done

- [ ] Install the supported Node.js runtime and PostgreSQL locally.
- [ ] Install npm dependencies and create the local database.
- [ ] Apply the database migration.
- [ ] Run the frontend and backend.
- [ ] Register, sign in, and sign out.
- [ ] Create, list, update, filter, and delete tasks.
- [ ] Verify user A cannot read or modify user B's tasks.
- [ ] Run build, typecheck, and automated tests.
- [ ] Record local verification in `docs/learning-progress.md`.

The files and tests are committed. Do not mark local execution complete until these checks have actually been performed.
