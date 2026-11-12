# TaskFlow implementation documentation

This is the practical guidebook for the actual TaskFlow application. It is written for two readers:
- A beginner who wants to understand what the code is doing and why.
- A developer or AI coding agent who needs enough context to change the project safely.

This documentation is maintained alongside the code. It is not a replacement for the theory course.

---

## Coding and theory run in parallel

The learner studies the Phase 0–11 theory documents at their own pace. No phase or checkpoint is a prerequisite for implementation. When coding introduces an unfamiliar concept, explain it in the context of the actual TaskFlow implementation and link to the corresponding theory lesson.

---

## Current stage: Stage 1 Application Foundation

The repository has established the initial full-stack application foundation:
- Application workspaces under `app/api` and `app/web` are scaffolded, typed, and operational.
- The Express API exposes validated configuration, Helmet security headers, CORS origin checks, and health endpoints (`/health/live`, `/health/ready`).
- The React frontend connects to the backend via Vite's development proxy and displays verified connection status.
- Automated tests using Node.js built-in `node:test` verify configuration and endpoint contracts.

See the [Stage 1 Implementation Guide](architecture/01-workspace-and-application-foundation.md) for complete technical details.

---

## Start here as a new coding agent

1. [Root AGENTS.md](../../AGENTS.md) — the one universal instruction file.
2. [Project context](PROJECT-CONTEXT.md) — project goals, constraints, structure, and current status.
3. [Root README](../../README.md) — public project entry point.
4. [Documentation standards](../DOCUMENTATION-GUIDE.md).
5. The relevant implementation and theory guides for the assigned task.

---

## Where guides belong

| Folder | Responsibility | Current Guides |
|---|---|---|
| [architecture/](architecture/README.md) | Component boundaries, system design, and request/data flows | [01-workspace-and-application-foundation.md](architecture/01-workspace-and-application-foundation.md) |
| [features/](features/README.md) | User-facing behaviour and business rules | Planned (Stage 3+) |
| [infrastructure/](infrastructure/README.md) | Local tooling, Docker, Linux, AWS, deployment, CI/CD, monitoring, Kubernetes, and Terraform | Planned (Stage 5+) |
| [decisions/](decisions/README.md) | Important choices, alternatives, reasons, and consequences | [ADR 0001](decisions/0001-project-folder-structure.md), [ADR 0002](decisions/0002-stage-1-application-foundation.md) |
| [debugging/](debugging/README.md) | Repeatable diagnosis and incident learning | Diagnostic guides as issues arise |
| [templates/](templates/README.md) | Reusable implementation-guide and decision-record templates | Reference templates |

---

## Minimum content for a meaningful implementation guide

Explain why a change was needed, what files/dependencies changed, the business logic, the end-to-end flow, the important code locations, unfamiliar concepts, configuration and commands, security and failure behaviour, debugging, checks actually run, trade-offs, next steps, and links to relevant theory.

Use [the implementation guide template](templates/implementation-guide-template.md). A meaningful implementation is not complete until its required explanation is maintained with the code.
