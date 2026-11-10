# Database Migrations, Build, and Tests

## 1. Why migrations?

The database schema is part of the application. A migration is a version-controlled change to that schema.

Without migrations, each developer or environment may have a different database shape. That makes collaboration and deployment difficult.

TaskFlow stores SQL migration files in `backend/migrations/`.

## 2. Current migration

`001_initial_schema.sql` creates:
- `users`
- `sessions`
- `tasks`
- Their keys, constraints, and indexes

The migration runner records successfully applied filenames in `schema_migrations`.

## 3. Run the migration

From the repository root:

```powershell
npm run db:migrate
```

The runner executes from the backend workspace and reads files in `backend/migrations/`.

Run it a second time. It should report that the existing migration is skipped.

## 4. Rules for future migrations

- Give every new migration a unique ordered filename, for example `002_add_task_archived_at.sql`.
- Never rewrite a migration that has already run in a shared environment.
- Make the change forward-only where practical.
- Think about locks, data backfills, default values, and compatibility with the application version during rollout.
- Back up important databases before risky schema changes.
- Document rollback strategy. Some data transformations cannot be safely reversed automatically.

## 5. Type checking

```powershell
npm run typecheck
```

This runs TypeScript checks for the API and frontend. Type checking catches many programming mistakes before runtime, but it does not prove that database queries or browser workflows work correctly.

## 6. Automated tests

```powershell
npm test
```

Phase 1 includes Node's built-in test runner for input-schema behavior:
- Email normalization.
- Password length validation.
- Login input validation.
- Task defaults.
- Impossible date rejection.
- Empty task-update rejection.

These tests do not require a running PostgreSQL server because they exercise pure validation functions.

## 7. Build

```powershell
npm run build
```

This compiles the backend TypeScript and creates an optimized frontend build in `frontend/dist/`.

## 8. Manual integration verification

A complete local verification also needs PostgreSQL and the running web/API processes:
1. Check `/health/live`.
2. Check `/health/ready`.
3. Register a new user.
4. Confirm `GET /api/auth/me` identifies that user.
5. Create and list a task.
6. Update the task title, status, priority, and due date.
7. Delete the task.
8. Confirm unauthenticated task requests return 401.
9. Sign in with a second account and confirm it cannot see, edit, or delete the first account's task.

The second-account ownership check is especially important. It verifies the authorization boundary, not just the UI.

## 9. Evidence to record

After completing local checks, add the date and results to `docs/learning-progress.md`. Do not claim a build or test passed unless it was actually run and the output was reviewed.
