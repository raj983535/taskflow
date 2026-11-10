# TaskFlow — Learning Progress

This file is the single source of truth for what has been studied, implemented, and verified. Code existing in GitHub does not automatically mean it has run successfully on the learner's machine.

## Current checkpoint

- **Current phase:** 1 — Application Development
- **Implementation status:** Phase 1 code and documentation committed
- **Local verification status:** Pending learner execution on Windows 11
- **Environment:** Windows 11, PowerShell, VS Code
- **Next phase:** Phase 2 — Git and GitHub Workflows, after Phase 1 acceptance checks

## Phase roadmap

| Phase | Focus | Status | Evidence / deliverables |
|---|---|---|---|
| 0 | Engineering foundations | Reviewed | Foundation notes committed; practical exercise record is learner-verified separately |
| 1 | Full-stack application | Implementation committed; local verification pending | React frontend, Express API, PostgreSQL migration, auth, task CRUD, docs, validation tests |
| 2 | Git and GitHub workflows | Planned | Branches, commits, pull requests, reviews, conflict resolution |
| 3 | Docker fundamentals | Planned | Dockerfile, images, containers, layers, lifecycle |
| 4 | Docker Compose | Planned | Multi-service development environment, networks, volumes, health checks |
| 5 | Linux and server administration | Planned | Shell, processes, permissions, SSH, firewall basics |
| 6 | AWS fundamentals | Planned | IAM, VPC, subnets, security groups, EC2, ECR, RDS |
| 7 | Cloud deployment | Planned | Deploy TaskFlow with a documented network and security design |
| 8 | CI/CD | Planned | GitHub Actions tests, image build, registry push, controlled deployment |
| 9 | Monitoring and reliability | Planned | Health checks, structured logs, CloudWatch, alarms |
| 10 | Scaling and high availability | Planned | Load balancing, replicas, autoscaling, database considerations |
| 11 | Kubernetes and Terraform | Planned | Pods, Deployments, Services, configuration, declarative infrastructure |

## Phase 0 — Engineering foundations

| Lesson | Topic | Documentation | Status |
|---|---|---|---|
| 0.1 | Client-server architecture | [Client-server architecture](00-foundations/client-server-architecture.md) | Notes reviewed; lesson quiz/practical record pending |
| 0.2 | Frontend vs backend | Planned | Not started as a standalone lesson |
| 0.3 | How websites work | Planned | Not started as a standalone lesson |
| 0.4 | DNS and IP addresses | [HTTP, HTTPS, and DNS](00-foundations/http-https-dns.md) | Notes available; practical record pending |
| 0.5 | Ports and networking | [Ports and networking](00-foundations/ports-and-networking.md) | Notes available; practical record pending |
| 0.6 | HTTP and HTTPS | [HTTP, HTTPS, and DNS](00-foundations/http-https-dns.md) | Notes available; practical record pending |
| 0.7 | Physical servers, VMs, containers | [Bare metal, VMs, and containers](00-foundations/bare-metal-vs-vm-vs-containers.md) | Notes available; practical record pending |
| 0.8 | Cloud computing | Planned | Not started as a standalone lesson |
| 0.9 | Connecting the architecture | Planned | Not started as a standalone lesson |

Phase 0 reference material has been reviewed and is available. Where a Phase 0 concept is needed for later implementation, it will be explained again in context.

## Phase 1 — Application development

| Deliverable | Location | Implementation |
|---|---|---|
| React + TypeScript frontend | `frontend/` | Added |
| Express + TypeScript API | `backend/src/` | Added |
| PostgreSQL schema | `backend/migrations/` | Added |
| Registration/login/logout | `backend/src/routes/auth.routes.ts` | Added |
| Server-side session middleware | `backend/src/middleware/auth.ts` | Added |
| Authenticated task CRUD | `backend/src/routes/task.routes.ts` | Added |
| Request validation | `backend/src/validation/` | Added |
| Health endpoints | `backend/src/app.ts` | Added |
| Validation tests | `backend/test/` | Added |
| Phase 1 documentation | `docs/01-application/` | Added |

### Phase 1 acceptance checklist

- [ ] Confirm Node version is at least 22.12.
- [ ] Install PostgreSQL locally and create the `taskflow` database.
- [ ] Create local `backend/.env` from the example; keep it untracked.
- [ ] Run `npm install` and review the generated lockfile.
- [ ] Run `npm run db:migrate`; run it again to verify skipping.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Start the app and check liveness/readiness endpoints.
- [ ] Register, log in, create/edit/filter/delete tasks.
- [ ] Verify a second user cannot read or modify the first user's tasks.
- [ ] Record actual command outputs and date below.

### Phase 1 verification log

No local runtime/build/test results have been reported by the learner yet. The GitHub-connected environment could not install dependencies from the package registry, so it did not run the application or tests.

## Learning log

### Repository audit and documentation maintenance
- README and learning progress aligned with the actual repository.
- Foundation explanations reviewed and clarified.
- Added documentation standards and lesson index.

### Phase 1 implementation — 2026-11-10
- Added React + TypeScript frontend and Vite development proxy.
- Added Express + TypeScript API and PostgreSQL pool.
- Added user registration, login, logout, and database-backed sessions.
- Added user-scoped task CRUD, input validation, error handling, and health checks.
- Added initial PostgreSQL migration and schema-focused tests.
- Added Phase 1 setup, architecture, API, security, database, migration, and completion documentation.
- **Verification:** implementation files are committed; local execution is still pending.

## Definition of done for each phase

- [ ] Explain the problems the technologies solve.
- [ ] Understand the architecture and how components communicate.
- [ ] Complete the practical implementation.
- [ ] Run the verification steps successfully.
- [ ] Review and understand the documentation.
- [ ] Complete the knowledge checks.
- [ ] Record evidence and troubleshooting notes.

## Decisions and guardrails

- Use one cloud provider (AWS) for the learning project, not three at once.
- Keep Phase 1 local and lightweight; do not add Docker early.
- Do not provision paid cloud services until costs, access, security, and cleanup are understood.
- Never commit credentials, tokens, cookies, private keys, or real production secrets.
- Do not call Phase 1 production-ready without a separate security and operational review.
- Introduce Docker, Linux, AWS, CI/CD, Kubernetes, and Terraform in their scheduled phases.
