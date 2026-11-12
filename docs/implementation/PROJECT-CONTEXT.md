# TaskFlow project context for coding agents

**Last reviewed:** 2026-11-12  
**Current state:** Stage 1 Application Foundation (Implemented & Verified)  
**Purpose:** Give a human or AI coding agent complete, accurate context to begin work safely without relying on a private chat history.

---

## 1. What TaskFlow is

TaskFlow is a learning-oriented full-stack task-management application and a practical engineering learning repository. The application is developed as a real, maintainable project while the learner studies the published theory material at their own pace.

The detailed product requirements and business rules are introduced in incremental vertical slices. Do not invent complex roles, permissions, collaboration rules, billing, notifications, or enterprise features without explicit approval.

---

## 2. The learning and development model

There are two parallel tracks:
- **Theory Track:** The learner studies Phase 0–11 curriculum documents at their own pace. Completing theory is not a prerequisite for implementing code.
- **Implementation Track:** The application is developed in small, verified vertical slices. When an unfamiliar concept is introduced, an implementation guide under `docs/implementation/` explains it in context and links to the relevant theory lesson.

The repository must serve both a reader who wants to understand the code and a reader who wants to study the concepts.

---

## 3. Technology direction and accepted decisions

| Area | Direction | Selected Tooling | Decision Status |
|---|---|---|---|
| Project Structure | Monorepo layout under `app/` | `app/api`, `app/web`, `app/shared` | Accepted ([ADR 0001](decisions/0001-project-folder-structure.md)) |
| Application Foundation | npm Workspaces | Node.js (>=20), npm | Accepted ([ADR 0002](decisions/0002-stage-1-application-foundation.md)) |
| Backend API | Express + TypeScript | Express 4.21, TypeScript 5.7, Helmet, CORS, Zod | Implemented (Stage 1) |
| Web Frontend | React + TypeScript | React 19, Vite 6, Plain CSS | Implemented (Stage 1) |
| Testing Stack | Native Test Runner | `node:test`, `node:assert`, `tsx` | Implemented (Stage 1) |
| Database | PostgreSQL | Planned `pg` driver + migrations | Open (Stage 2) |
| Cloud Path | AWS | VPC, ECS/EC2, RDS | Open (Stage 7+) |

Do not quietly substitute other frameworks, databases, or cloud providers without an explicit proposal and accepted decision record.

---

## 4. Current repository state (Stage 1 Foundation)

### Implemented and Verified:
- **Workspace Monorepo:** Root `package.json` with npm workspaces (`app/api`, `app/web`).
- **Backend API (`app/api`):**
  - Express application with Helmet, CORS restricted to validated frontend origin, JSON body parser, and foundation cookie-parser.
  - Validated runtime configuration with Zod (`PORT` validated as integer between 1–65535, `FRONTEND_ORIGIN` validated as scheme://host[:port]).
  - Modular health endpoints: `/health/live` (process liveness probe) and `/health/ready` (Stage 1 process readiness probe).
  - Server entry point with graceful shutdown (`SIGINT`/`SIGTERM`) and forced shutdown timeout fallback.
  - Automated test suite using `node:test` covering configuration validation, route responses, 404 handling, and security headers (18 passing tests).
- **Web Frontend (`app/web`):**
  - React 19 + TypeScript browser application bundled with Vite.
  - Responsive, accessible CSS design system (<3 KB) supporting `:focus-visible` and `prefers-reduced-motion`.
  - Application dashboard component (`App.tsx`) with live API connection check, accessible live region (`aria-live="polite"`), and local Vite development proxy (`/health` and `/api` -> `http://localhost:5000`).
  - StrictMode-safe `useEffect` lifecycle with `AbortController` cleanup and clear client-side observation timestamp labeling.
- **Documentation:** Root `README.md`, `folderstructure.md`, [Stage 1 Implementation Guide](architecture/01-workspace-and-application-foundation.md), ADR 0001, and ADR 0002.

### Pending Implementation (Upcoming Stages):
- **Stage 2:** PostgreSQL connection pool, relational schema (`users`, `sessions`, `tasks`), and versioned SQL migrations under `database/`.
- **Stage 3:** Task CRUD endpoints, Zod request schemas, and server-side session authentication.
- **Stage 4:** Interactive React Kanban board (Todo, In Progress, Completed).
- **Stage 5:** Docker multi-stage builds and Docker Compose orchestration.
- **Stage 6:** GitHub Actions CI/CD workflows for automated linting, testing, and builds.
- **Stages 7–11:** AWS deployment, monitoring, scaling, Kubernetes, and Terraform.

---

## 5. Directory layout and responsibilities

```text
taskflow/
├── AGENTS.md                # Single source of truth for all coding agents
├── README.md                # Public project overview
├── folderstructure.md       # Full architectural directory responsibilities
├── app/
│   ├── web/                 # React 19 browser application
│   ├── api/                 # Express backend HTTP API
│   └── shared/              # Reserved for future shared types/contracts
├── database/
│   ├── migrations/          # Ordered SQL migration files (Stage 2)
│   └── seeds/               # Development test fixtures (Stage 2)
├── infrastructure/
│   ├── local/               # Local environment configuration
│   ├── docker/              # Dockerfiles and Compose configurations (Stage 5)
│   └── aws/                 # AWS deployment templates (Stage 7+)
├── .github/workflows/       # GitHub Actions CI workflows (Stage 6)
├── tests/
│   ├── integration/         # Cross-application integration tests
│   └── e2e/                 # End-to-end browser tests
├── scripts/                 # Repeatable operational scripts
└── docs/
    ├── 00-foundations/ ... 11-kubernetes-terraform/
    └── implementation/
```

---

## 6. Development environment and resource constraints

The primary learner environment is **Windows 11 with PowerShell** on a machine with **~8 GB RAM**.
- Provide PowerShell commands from the correct working directory.
- Keep the local development stack lightweight; avoid unnecessary background services.
- The two hard permission gates from `AGENTS.md` (No unauthorized downloads/installations, No unauthorized paid services/costs) apply to every task.
- Verification commands must be executed and their actual results recorded before claiming success.

---

## 7. Source of truth precedence

When information differs, use this order:
1. Current explicit user-approved requirements and decisions.
2. The root `AGENTS.md` instruction file.
3. Current verified code, tests, and configuration on the active branch.
4. Accepted architecture decision records under `docs/implementation/decisions/`.
5. Current implementation guides under `docs/implementation/`.
6. Project context and README summaries.
7. Older theory examples, drafts, or historical discussion.
