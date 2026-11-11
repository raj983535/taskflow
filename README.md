# TaskFlow

TaskFlow is a task-management application and a practical engineering learning project. The repository contains the theory curriculum, project rules, planned application layout, and implementation documentation.

**Theory study and application development are parallel tracks.** You can study the theory at your own pace. Completing a phase is not a prerequisite for beginning implementation.

## How to use this repository

### I want to explore the project structure
1. Read [the project context](docs/implementation/PROJECT-CONTEXT.md).
2. Review the [application folder map](app/README.md).
3. Review [database responsibilities](database/README.md), [infrastructure responsibilities](infrastructure/README.md), and [testing responsibilities](tests/README.md).

### I want to build the application
1. Read the root [AGENTS.md](AGENTS.md). It is the single instruction file for every coding agent.
2. Read [the implementation documentation guide](docs/implementation/README.md).
3. Read [the project context](docs/implementation/PROJECT-CONTEXT.md).
4. Confirm the current milestone and explicit user approval before writing code.

### I want to learn the theory
1. Read [learning scope](docs/LEARNING-SCOPE.md).
2. Follow the [beginner's map for Phases 3–11](docs/BEGINNER-MAP-PHASES-3-11.md).
3. Use [learning progress](docs/learning-progress.md) to find lessons and record learning.

## Technology direction

| Area | Direction |
|---|---|
| Web frontend | React + TypeScript |
| Backend API | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| Later cloud path | AWS |

Supporting libraries, package manager, build tools, database driver, migration tool, authentication design, test tools, and deployment topology remain to be selected and documented when their stage is approved.

## Repository structure

```text
taskflow/
├── AGENTS.md
├── README.md
├── .gitignore
├── app/
│   ├── web/                 # Browser frontend structure
│   ├── api/                 # Backend HTTP API structure
│   └── shared/              # Shared contracts/types, only when justified
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
│   └── workflows/           # Future CI/CD workflow location
├── tests/
│   ├── integration/
│   └── e2e/
├── scripts/
└── docs/
    ├── 00-foundations/ ... 11-kubernetes-terraform/
    └── implementation/
        ├── PROJECT-CONTEXT.md
        ├── architecture/
        ├── features/
        ├── infrastructure/
        ├── decisions/
        ├── debugging/
        └── templates/
```

The directories currently contain explanatory README placeholders. **There is no application source code, package manifest, database schema, Docker configuration, CI workflow, or cloud infrastructure in this structure-only setup.** A folder indicates an intended responsibility, not an implemented feature.

## One instruction file for all coding agents

TaskFlow maintains one universal instruction file at the repository root: [AGENTS.md](AGENTS.md). It applies to Antigravity, OpenAI Codex, Cursor, Claude Code, GitHub Copilot, and other coding agents. Do not create tool-specific or nested instruction files.

## Documentation is part of implementation

When coding begins, every meaningful feature, business rule, architectural choice, data/API change, dependency, or infrastructure concept must be explained under [docs/implementation/](docs/implementation/README.md). Explain why it exists, what changed, how it works, the business logic, important code locations, how to test and debug it, and what was actually verified.

## Current project status

- Theory curriculum and beginner-friendly revisions: published.
- Universal agent instructions and implementation documentation system: present.
- Application/database/infrastructure/testing directory layout: prepared as README placeholders.
- Application source code: not started.
- Package manifests and dependency lockfiles: not created.
- PostgreSQL schema and migrations: not created.
- Docker, CI/CD, AWS, Kubernetes and Terraform implementation: not started.
- No cloud resources are provisioned.

Do not infer implementation progress from the presence of a folder or placeholder README.

## Important links

- [Documentation home](docs/README.md)
- [Project context for coding agents](docs/implementation/PROJECT-CONTEXT.md)
- [Implementation documentation guide](docs/implementation/README.md)
- [Learning progress](docs/learning-progress.md)
- [Application structure](app/README.md)
- [Implementation folder-layout decision](docs/implementation/decisions/0001-project-folder-structure.md)
