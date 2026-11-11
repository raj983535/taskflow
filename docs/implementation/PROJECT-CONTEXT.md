# TaskFlow project context

**Purpose:** Give a new human or AI coding agent the project context without requiring access to previous conversations.

## 1. Project identity

TaskFlow is a task-management web application and a practical engineering learning project. It is intended to help the learner understand frontend, backend, databases, testing, Docker, Linux, cloud deployment, CI/CD, monitoring, scaling, Kubernetes, and Terraform through one evolving project.

The theory curriculum and application development are parallel tracks. The learner studies at their own pace; theory completion is not a prerequisite for coding.

The initial product direction is a personal task-management application. The detailed MVP, user journeys, task fields, business rules, authentication, and acceptance criteria must be finalized before feature implementation.

## 2. Environment and constraints

- Local operating system: Windows 11.
- Preferred shell: PowerShell.
- Local project folder: `E:\Taskflow`.
- Hardware: approximately 8 GB RAM.
- Cost preference: keep local development lightweight and avoid paid services unless approved.
- GitHub repository: [raj983535/taskflow](https://github.com/raj983535/taskflow).
- Use one local repository with a working branch. Do not create a second clone unless the learner requests it.

Before reconciling a local folder with a remote branch, inspect Git status, current branch, remotes, existing files, and untracked/ignored content. Never overwrite or delete local files without reporting the exact conflict and receiving approval.

## 3. Agreed technology direction

| Area | Agreed direction | Still open |
|---|---|---|
| Web frontend | React + TypeScript | Build tool, routing, styling, state and form approach |
| Backend API | Node.js + Express + TypeScript | Runtime/package setup, module conventions, validation and error format |
| Database | PostgreSQL | Driver/query library, migration tool, schema, local setup |
| Cloud | AWS as the later primary cloud path | Exact architecture, services, networking, cost and deployment sequence |

These are technology directions, not a selection of every supporting library. Record meaningful decisions in `docs/implementation/decisions/` before hard-to-change assumptions are introduced.

## 4. Current repository stage

**Current stage: folder-structure preparation only.**

The repository contains:
- Published Phase 0–11 theory documentation.
- Root universal `AGENTS.md`.
- Implementation documentation categories and templates.
- A planned application folder layout under `app/`.
- Planned database, infrastructure, CI/CD, and testing directories.

The folder layout is represented by explanatory README placeholders. It does not contain application source code or runtime setup.

Not yet implemented:
- React application source code or frontend package manifest.
- Express API source code or backend package manifest.
- Root package manifest, package manager workspace configuration, or dependency lockfile.
- PostgreSQL connection, schema, migrations, or seed scripts.
- Authentication, sessions, or task CRUD.
- Unit/integration/e2e test implementation or test runner configuration.
- Dockerfiles, Compose configuration, CI workflows, AWS resources, Kubernetes manifests, or Terraform code.

Check the current branch and repository contents before relying on this snapshot.

## 5. Planned top-level structure

```text
taskflow/
├── app/
│   ├── web/                 # Browser frontend
│   ├── api/                 # Backend HTTP API
│   └── shared/              # Shared contracts/types if genuinely needed
├── database/
│   ├── migrations/
│   └── seeds/
├── infrastructure/
│   ├── local/
│   ├── docker/
│   ├── linux/
│   ├── aws/
│   ├── deployment/
│   ├── monitoring/
│   ├── kubernetes/
│   └── terraform/
├── .github/
│   └── workflows/           # Future CI/CD workflows
├── tests/
│   ├── integration/
│   └── e2e/
├── scripts/
└── docs/
    ├── theory phases 0–11
    └── implementation/
```

Each folder README explains its intended responsibility and whether it is only planned. The structure does not force an immediate choice of package manager, workspace tool, or application library.

Unit tests may live close to the code they test. Cross-application tests belong in the root `tests/` area.

## 6. Application areas

### `app/web/`

Reserved for the React + TypeScript browser application. The proposed organization separates application entry/routing, reusable components, user-facing features, hooks, API clients/services, styles, types, public assets, and frontend tests.

### `app/api/`

Reserved for the Node.js + Express + TypeScript backend API. The proposed organization separates configuration, database access, middleware, and feature modules. Initial module areas are health, authentication, and tasks; their presence as folders does not mean their endpoints or behaviour are implemented.

### `app/shared/`

Reserved for contracts or types genuinely shared between the web and API. Do not add abstractions here before a real reuse case exists.

## 7. Database, infrastructure, and testing responsibilities

- `database/migrations/`: ordered schema changes after the schema and migration approach are approved.
- `database/seeds/`: safe fictional development/test data.
- `infrastructure/local/`: local environment documentation/configuration.
- `infrastructure/docker/`: Dockerfiles and related build resources at the Docker stage.
- `infrastructure/linux/`: server administration and host configuration when needed.
- `infrastructure/aws/`: approved AWS infrastructure.
- `infrastructure/deployment/`: deployment and reverse-proxy/TLS configuration.
- `infrastructure/monitoring/`: logs, metrics, traces, health and alerts.
- `infrastructure/kubernetes/`: Kubernetes manifests when that stage begins.
- `infrastructure/terraform/`: Terraform infrastructure code when approved.
- `.github/workflows/`: GitHub Actions workflow files after CI decisions.
- `tests/integration/`: tests across application boundaries.
- `tests/e2e/`: complete browser-to-API user journeys.
- `scripts/`: repeatable maintenance/development scripts only when a concrete need exists.

## 8. Implementation sequence

The proposed delivery sequence is:

1. Confirm MVP scope, user journeys, task business rules, and acceptance criteria.
2. Finalize UI/UX wireframes and API/data contracts.
3. Select necessary supporting libraries and record decisions.
4. Set up the web and API applications using the approved project tooling.
5. Establish the database schema and migrations.
6. Implement authentication and authorization if included in the approved MVP.
7. Deliver task workflows as small end-to-end vertical slices.
8. Add and run automated tests and document debugging.
9. Introduce Docker and Compose after the application works locally.
10. Add CI/CD, then AWS deployment after reviewing security, cost, and cleanup.
11. Add monitoring, scaling, Kubernetes, and Terraform progressively.

This is a plan, not an instruction to generate all layers at once. The learner can study theory in parallel.

## 9. Documentation requirements

For every meaningful implementation slice, maintain a beginner-friendly guide under `docs/implementation/` in the same change. Explain why it was needed, what changed, the business logic, how the full flow works, which code files matter, how to configure/run/test/debug it, relevant security and failure cases, what was actually verified, trade-offs, and links to theory.

Start with [the implementation documentation guide](README.md), follow the root [AGENTS.md](../../AGENTS.md), and use the implementation guide template.

## 10. Source of truth

When information differs, use:
1. Current user-approved requirements and decisions.
2. Current code/tests/configuration on the branch being changed.
3. Accepted decision records and current implementation guides.
4. This project context and the root README.
5. Older theory examples and historical discussions.

Never treat a folder placeholder or theory example as proof that an implementation decision has been finalized.
