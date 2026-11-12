# TaskFlow

TaskFlow is a task-management application and a practical engineering learning project. The repository contains the application source code, theory curriculum, universal agent instructions, and comprehensive implementation documentation.

**Theory study and application development are parallel tracks.** You can study the theory at your own pace. Completing a theory phase is not a prerequisite for beginning implementation.

---

## Current Status: Stage 1 Application Foundation

The repository has completed **Stage 1 (Application Foundation)**:
- **`app/api/`**: Node.js + Express + TypeScript backend with Helmet security headers, CORS origin enforcement, strongly typed Zod environment validation, graceful shutdown lifecycle, and modular health probes (`/health/live`, `/health/ready`).
- **`app/web/`**: React 19 + Vite + TypeScript frontend with a responsive design system, client-side health indicator, accessible live regions, and local development proxy routing.
- **Root Monorepo**: npm workspaces managing `app/api` and `app/web` with unified type checking and built-in automated testing via `node:test`.

**Pending Work (Upcoming Stages):**
- Stage 2: PostgreSQL relational database persistence and versioned migrations under `database/`.
- Stage 3: Task CRUD endpoints, Zod request schemas, and server-side session authentication.
- Stage 4: Interactive React Kanban board.
- Stages 5–11: Docker, CI/CD, AWS cloud deployment, monitoring, scaling, and infrastructure as code.

---

## How to Use This Repository

### I want to run the application locally
1. Ensure **Node.js (>= 20.0.0)** and **npm (>= 10.0.0)** are installed.
2. Read the [Stage 1 Implementation Guide](docs/implementation/architecture/01-workspace-and-application-foundation.md).
3. Follow the [Quickstart commands](#local-development-quickstart) below.

### I want to contribute or build features
1. Read the root [AGENTS.md](AGENTS.md). It is the single source of truth for coding rules, security gates, and definition-of-done requirements.
2. Review the [Project Context](docs/implementation/PROJECT-CONTEXT.md) and accepted [Architecture Decision Records](docs/implementation/decisions/README.md).
3. Read [Implementation Documentation Guide](docs/implementation/README.md).

### I want to learn the theory
1. Read [Learning Scope](docs/LEARNING-SCOPE.md).
2. Follow the [Beginner's Map for Phases 3–11](docs/BEGINNER-MAP-PHASES-3-11.md).
3. Track your study using [Learning Progress](docs/learning-progress.md).

---

## Technology Stack

| Area | Current Implementation / Direction | Selected Tools | Status |
|---|---|---|---|
| Workspace | npm Workspaces | `app/api`, `app/web` | Implemented (ADR 0002) |
| Backend API | Node.js + Express + TypeScript | Express 4.21, TypeScript 5.7, Zod 3.24 | Implemented (Stage 1) |
| Web Frontend | React + TypeScript | React 19, Vite 6, Plain CSS | Implemented (Stage 1) |
| Testing | Native Test Runner | `node:test`, `node:assert`, `tsx` | Implemented (Stage 1) |
| Database | PostgreSQL | Planned `pg` driver + migrations | Open (Stage 2) |
| Cloud Path | AWS | VPC, ECS/EC2, RDS | Planned (Stage 7+) |

---

## Repository Structure

```text
taskflow/
├── AGENTS.md                # Universal instruction file for all AI coding agents
├── README.md                # Public project entry point
├── package.json             # Root monorepo workspace configuration
├── package-lock.json        # Dependency lockfile
├── folderstructure.md       # Detailed architectural responsibility guide
├── app/
│   ├── api/                 # Node.js + Express + TypeScript backend
│   │   ├── src/config/      # Validated environment configuration (Zod)
│   │   ├── src/modules/     # Feature-oriented modules (health, auth, tasks)
│   │   └── src/server.ts    # Server entry point with graceful shutdown
│   ├── web/                 # React 19 + TypeScript + Vite browser frontend
│   │   ├── src/app/         # Application entry and App component
│   │   └── src/styles/      # CSS design system (responsive, accessible)
│   └── shared/              # Reserved for shared contracts/types
├── database/                # PostgreSQL schema migrations and development seeds
│   ├── migrations/          # Ordered SQL migration files (Stage 2)
│   └── seeds/               # Development test fixtures (Stage 2)
├── infrastructure/          # Local, Docker, and Cloud configurations
│   ├── local/               # Local environment settings
│   ├── docker/              # Dockerfiles and Compose configurations
│   └── aws/                 # AWS deployment templates
├── .github/workflows/       # GitHub Actions CI/CD workflows (Stage 6)
├── tests/                   # Cross-service integration and end-to-end tests
├── scripts/                 # Repeatable operational scripts
└── docs/                    # Theory curriculum (Phases 0–11) and implementation guides
    └── implementation/
        ├── PROJECT-CONTEXT.md
        ├── architecture/
        ├── decisions/
        └── templates/
```

---

## Local Development Quickstart

Run all commands from the repository root (`E:\Taskflow`) in PowerShell:

```powershell
# 1. Install dependencies across workspaces
npm install

# 2. Run TypeScript type checks across all workspaces
npm run typecheck

# 3. Run automated tests (18 tests via node:test)
npm test

# 4. Start the backend API in watch mode (Port 5000)
npm run dev:api

# 5. Start the frontend web dev server in a separate terminal (Port 5173)
npm run dev:web
```

Open `http://localhost:5173` in your browser. The client will connect to `http://localhost:5000/health/live` via the Vite development proxy and display a live health status indicator.

---

## Important Links

- [Universal Agent Instructions](AGENTS.md)
- [Project Context & Decisions](docs/implementation/PROJECT-CONTEXT.md)
- [Stage 1 Implementation Guide](docs/implementation/architecture/01-workspace-and-application-foundation.md)
- [Decision 0001: Project Folder Structure](docs/implementation/decisions/0001-project-folder-structure.md)
- [Decision 0002: Stage 1 Application Foundation](docs/implementation/decisions/0002-stage-1-application-foundation.md)
- [Phase 1 Theory Curriculum](docs/01-application/README.md)
