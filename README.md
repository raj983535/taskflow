# TaskFlow — Full-Stack Application and Engineering Learning Project

TaskFlow is both a real application to build and a practical engineering learning project. The repository contains a structured theory course and a place to understand the actual implementation, code, business logic, tests, and debugging.

**The two tracks run in parallel. You do not need to complete the theory course before coding.** Study concepts at your own pace. When implementation introduces something unfamiliar, its purpose and working details must be explained beside the code in beginner-friendly documentation.

## Pick how you want to use the repository

### I want to work with the code

1. Read [AGENTS.md](AGENTS.md) before using an AI coding agent.
2. Read the [implementation documentation home](docs/implementation/README.md).
3. Read the [current project context](docs/implementation/PROJECT-CONTEXT.md).
4. Open the relevant implementation guide for the feature or technical area.

You can start with the code without finishing any theory phase. Every meaningful implementation should explain why it exists, what changed, how it works, the business logic, important files, and how to test and debug it.

### I want to learn the theory

1. Read the [learning scope and depth limits](docs/LEARNING-SCOPE.md).
2. Follow the [beginner's map for Phases 3–11](docs/BEGINNER-MAP-PHASES-3-11.md).
3. Start with [Phase 1 — Full-stack application fundamentals](docs/01-application/README.md).
4. Use [learning progress](docs/learning-progress.md) to find lessons and track study.

You can study in order at your own pace, or open a relevant lesson whenever an implementation introduces a concept you want to understand. Theory completion is not a gate for implementation.

### I want both

Move between the two tracks. Read an implementation guide to understand what TaskFlow actually does, then open its linked theory lesson for the broader concept. Or study the theory first and then see how the application uses it.

## What TaskFlow is aiming to become

A maintainable task-management web application that provides a real project for learning frontend, backend, database, testing, delivery, and operations.

The detailed feature list and business rules will be agreed and documented as implementation begins. Do not assume unrecorded roles, permissions, collaboration features, or workflows.

## Technology direction

| Area | Agreed direction |
|---|---|
| Frontend | React + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| Cloud path | AWS as the primary later cloud path |

The exact supporting libraries, project tooling, authentication design, database access approach, and deployment topology are not all decided. Important choices must be explained and recorded before they become hard-to-change assumptions.

## Learning roadmap

Phase 0 is the engineering foundations baseline. Phases 1–11 contain 30 planned lessons.

| Phase | Focus | Lessons | Material |
|---|---|---:|---|
| 0 | Engineering foundations | Baseline | Documented |
| 1 | Full-stack application fundamentals | 6 | Published; self-paced |
| 2 | Git and GitHub workflows | 2 | Published; self-paced |
| 3 | Docker fundamentals | 3 | Published; self-paced |
| 4 | Docker Compose | 2 | Published; self-paced |
| 5 | Linux and server administration | 3 | Published; self-paced |
| 6 | AWS cloud fundamentals | 3 | Published; self-paced |
| 7 | Cloud deployment | 2 | Published; self-paced |
| 8 | CI/CD with GitHub Actions | 2 | Published; self-paced |
| 9 | Monitoring and reliability | 2 | Published; self-paced |
| 10 | Scaling and high availability | 2 | Published; self-paced |
| 11 | Kubernetes and Terraform | 3 | Published; self-paced |
| **Total** | **Phases 1–11** | **30** | **All theory materials published** |

## Repository map

    taskflow/
    ├── AGENTS.md                         # Canonical instructions for all coding agents
    ├── CLAUDE.md                         # Claude agent entry point
    ├── .cursor/rules/                    # Cursor project rules
    ├── .github/copilot-instructions.md    # GitHub Copilot project rules
    ├── README.md                         # Public project entry point
    ├── apps/                              # Frontend and backend source code as created
    ├── infrastructure/                    # Local and later cloud configuration
    └── docs/
        ├── README.md                     # Documentation navigation
        ├── 00-foundations/ ... 11-*/      # Theory course
        ├── BEGINNER-MAP-PHASES-3-11.md
        ├── LEARNING-SCOPE.md
        ├── DOCUMENTATION-GUIDE.md
        ├── learning-progress.md
        └── implementation/
            ├── PROJECT-CONTEXT.md
            ├── architecture/
            ├── features/
            ├── infrastructure/
            ├── decisions/
            ├── debugging/
            └── templates/

The apps/ and infrastructure/ folders currently contain only their explanatory README files. Actual code and configuration will be added incrementally. Check the current branch before assuming a feature, test, service, or deployment exists.

## Documentation is part of the code

Every meaningful feature, business rule, new technical concept, architecture decision, database/API change, dependency, or infrastructure change must have a beginner-friendly explanation under [docs/implementation/](docs/implementation/README.md), committed with the code.

The guide must explain:

- Why the change was needed.
- What files, components, dependencies, services, and configuration were added or changed.
- How the full flow works and what business rules it follows.
- How important code locations fit together.
- What unfamiliar concepts mean in simple language.
- How to configure, run, test, inspect, and debug it.
- What was actually verified and what remains untested.
- Which theory lessons explain the broader concepts.

This rule applies whether the learner has studied that concept or not. See [AGENTS.md](AGENTS.md) for the full coding-agent contract and [the documentation guide](docs/DOCUMENTATION-GUIDE.md) for writing standards.

## Project status

- Theory material for Phases 1–11: published.
- Theory study: self-paced; not a prerequisite for coding.
- Implementation documentation system and agent instructions: prepared.
- Application source code and runtime: not yet implemented at the time of this update.
- Deployment and cloud resources: not provisioned.

Project status changes as verified implementation is added. Documentation must never claim that code, tests, containers, or infrastructure work unless they have been checked.

## Important links

- [Documentation home](docs/README.md)
- [Implementation guidebook](docs/implementation/README.md)
- [Project context for new agents](docs/implementation/PROJECT-CONTEXT.md)
- [Learning progress](docs/learning-progress.md)
- [Learning scope](docs/LEARNING-SCOPE.md)
- [Beginner's map](docs/BEGINNER-MAP-PHASES-3-11.md)
