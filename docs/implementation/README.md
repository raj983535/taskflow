# TaskFlow implementation documentation

This is the practical guidebook for the actual TaskFlow application. It is written for a beginner and for developers or AI coding agents who need to understand and safely change the project.

## Coding and theory run in parallel

The learner studies the Phase 0–11 theory documents at their own pace. No phase or checkpoint is a prerequisite for implementation. When coding introduces an unfamiliar concept, explain it in the context of the actual TaskFlow implementation and link to the corresponding theory lesson.

## Current stage: folder structure only

The repository currently contains the planned project layout as explanatory README placeholders. There is no application source code, package manifest, database schema, Docker configuration, CI workflow, or cloud infrastructure yet. A folder name does not mean its feature has been implemented or approved.

## Start here as a new coding agent

1. [Root AGENTS.md](../../AGENTS.md) — the one universal instruction file.
2. [Project context](PROJECT-CONTEXT.md) — project goals, constraints, structure and status.
3. [Root README](../../README.md) — public project entry point.
4. [Documentation standards](../DOCUMENTATION-GUIDE.md).
5. The relevant implementation and theory guides for the assigned task.

## Where guides belong

| Folder | Responsibility |
|---|---|
| [architecture/](architecture/README.md) | Component boundaries, system design and request/data flows |
| [features/](features/README.md) | User-facing behaviour and business rules |
| [infrastructure/](infrastructure/README.md) | Local tooling, Docker, Linux, AWS, deployment, CI/CD, monitoring, Kubernetes and Terraform |
| [decisions/](decisions/README.md) | Important choices, alternatives, reasons and consequences |
| [debugging/](debugging/README.md) | Repeatable diagnosis and incident learning |
| [templates/](templates/README.md) | Reusable implementation-guide and decision-record templates |

## Minimum content for a meaningful implementation guide

Explain why a change was needed, what files/dependencies changed, the business logic, the end-to-end flow, the important code locations, unfamiliar concepts, configuration and commands, security and failure behaviour, debugging, checks actually run, trade-offs, next steps, and links to relevant theory.

Use [the implementation guide template](templates/implementation-guide-template.md). A meaningful implementation is not complete until its required explanation is maintained with the code.

## Current status and truthfulness

This folder defines documentation standards; it does not prove that a feature exists. Clearly distinguish **Planned**, **Implemented**, and **Verified**. Never claim a test, command, container, deployment, or cloud resource was checked unless it was actually executed and observed.

When adding a guide, link it from the relevant category README and update [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md) when shared project context changes.
