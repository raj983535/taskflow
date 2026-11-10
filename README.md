# TaskFlow — Full-Stack, Cloud & DevOps Learning Project

TaskFlow is a task-management application built incrementally as an end-to-end software engineering learning project. The repository contains the working application and a structured technical notebook explaining the concepts, architecture, commands, verification, and troubleshooting behind it.

## Learning method

Each phase follows: problem → theory → architecture → implementation → verification → documentation → exercises.

We introduce infrastructure only when the application and the relevant fundamentals are understood. Phase 1 runs directly on Windows with PostgreSQL; Docker, AWS, and CI/CD come later.

## Current status

| Phase | Focus | Status |
|---|---|---|
| 0 | Engineering foundations | Reviewed; learner exercise tracking remains in the progress ledger |
| 1 | Full-stack application | **Implementation committed; local verification pending** |
| 2 | Git and GitHub workflows | Planned |
| 3 | Docker fundamentals | Planned |
| 4 | Docker Compose | Planned |
| 5 | Linux and server administration | Planned |
| 6 | AWS cloud fundamentals | Planned |
| 7 | First cloud deployment | Planned |
| 8 | CI/CD with GitHub Actions | Planned |
| 9 | Monitoring and reliability | Planned |
| 10 | Scaling and high availability | Planned |
| 11 | Kubernetes and Terraform | Planned |

See [the learning progress ledger](docs/learning-progress.md) for detailed lesson status and acceptance criteria.

## Phase 1 technology stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Node.js + Express 5 + TypeScript |
| Database | PostgreSQL 16+ |
| Database access | node-postgres connection pool |
| Validation | Zod |
| Authentication | bcrypt password hashes + server-side sessions |
| Testing | Node.js built-in test runner |
| Version control | Git + GitHub |

## Phase 1 features

- Account registration, sign-in, current-user lookup, and sign-out.
- HTTP-only session cookie with database-backed session records.
- Task create, list, edit, status update, filter, and delete.
- User-specific task ownership checks in backend/database queries.
- Input validation and centralized error handling.
- Health and database-readiness endpoints.
- SQL migrations and schema validation tests.
- Responsive browser interface.

## Run locally (Windows 11)

Requirements:
- Node.js 22.12+ (Node 26.13.0 is recorded in `.node-version`).
- PostgreSQL 16 or later.
- Git and PowerShell.

Follow the complete [Windows local development guide](docs/01-application/local-development-setup.md). In outline:

```powershell
git pull origin main
Copy-Item backend/.env.example backend/.env
# Edit backend/.env and set the local PostgreSQL DATABASE_URL.
npm install
npm run db:migrate
npm run dev
```

Open `http://127.0.0.1:5173`.

Run checks from the repository root:

```powershell
npm run typecheck
npm test
npm run build
```

The commands are provided in the repo, but local build/test results must be recorded only after they are actually executed on a configured machine. See the [Phase 1 completion report](docs/01-application/phase-1-completion-report.md).

## Repository structure

```text
taskflow/
├── backend/
│   ├── migrations/         # Versioned SQL schema
│   ├── src/                # Express API and database layer
│   └── test/               # Backend validation tests
├── frontend/
│   └── src/                # React app, components, API client, styles
├── docs/
│   ├── 00-foundations/     # Engineering foundations
│   ├── 01-application/     # Phase 1 theory and implementation docs
│   ├── DOCUMENTATION-GUIDE.md
│   └── learning-progress.md
├── package.json            # npm workspaces and common scripts
└── .gitignore
```

Future phase implementation folders and workflows are created when those phases begin; the roadmap does not mean those tools have already been configured.

## Security and engineering guardrails

- Never commit real secrets, passwords, cookies, tokens, or private keys.
- Variables prefixed with `VITE_` are public and must not contain secrets.
- Backend authorization must be enforced server-side and in resource queries.
- Database ports should not be exposed to the public internet.
- Review cloud costs before provisioning paid resources.
- Phase 1 is an educational application, not a security-audited production SaaS. Read [Authentication and Security](docs/01-application/authentication-and-security.md) before using it outside local learning.

## Documentation

- [Documentation standards](docs/DOCUMENTATION-GUIDE.md)
- [Engineering foundations index](docs/00-foundations/README.md)
- [Phase 1 application documentation](docs/01-application/README.md)
- [Phase 1 completion report](docs/01-application/phase-1-completion-report.md)
- [Learning progress](docs/learning-progress.md)
