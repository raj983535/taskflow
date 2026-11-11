# 0001 — TaskFlow project folder structure

> **Status:** Accepted directory layout  
> **Scope:** Repository organization only  
> **Does not approve:** Application source code, package manifests, dependencies, runtime configuration, schema, workflows, containers, or cloud resources.

## Context

TaskFlow needs a clear monorepo layout that a human or any supported AI coding agent can navigate. The learner works on Windows 11 in `E:\Taskflow`, has approximately 8 GB RAM, and studies the theory curriculum independently while development progresses.

The repository already contains the theory curriculum, universal root `AGENTS.md`, and implementation documentation system.

## Decision

Use one major `app/` directory for application-related areas:

- `app/web/` — React + TypeScript browser frontend.
- `app/api/` — Node.js + Express + TypeScript backend API.
- `app/shared/` — reserved for genuinely shared contracts/types if required.

Keep supporting concerns at the repository root:

- `database/` — migrations and development seeds.
- `infrastructure/` — local development, Docker, Linux/server administration, AWS, deployment, monitoring, Kubernetes and Terraform.
- `.github/workflows/` — future GitHub Actions workflow files.
- `tests/` — integration and end-to-end tests; unit tests may live close to the source they test.
- `scripts/` — repeatable project scripts when a concrete need exists.
- `docs/` — existing theory curriculum and implementation guidebook.

## Why this layout fits

- One `app/` root makes frontend, backend and shared application concerns easy to discover.
- Separate `web/` and `api/` areas prevent browser code and server code from becoming mixed together.
- Database and infrastructure stay outside application source because they have different responsibilities and lifecycles.
- CI workflows live in GitHub's conventional `.github/workflows/` location.
- Cross-application tests have a shared location while unit tests can stay near the relevant module.
- Later learning topics have clear places without requiring them to be implemented now.

## Important boundaries

1. Directories are represented by README placeholders because Git does not track empty directories.
2. No package manager, npm workspace, build tool, routing library, validation library, database driver, migration tool, test runner, or deployment topology is selected by this directory decision.
3. Do not add framework-specific files unless the implementation stage needs them.
4. A folder or placeholder does not authorize an agent to write code. Follow the exact user-approved task and root `AGENTS.md`.
5. Update this record if the agreed product architecture materially changes.

## Related documentation

- [Project context](../PROJECT-CONTEXT.md)
- [Universal coding-agent rules](../../../AGENTS.md)
- [Phase 1 application fundamentals](../../01-application/README.md)
- [Docker and Compose](../../03-docker/README.md) and [Phase 4](../../04-compose/README.md)
- [Linux](../../05-linux/README.md), [AWS](../../06-aws/README.md), [deployment](../../07-deployment/README.md)
- [CI/CD](../../08-cicd/README.md), [monitoring](../../09-monitoring/README.md), [scaling](../../10-scaling/README.md)
- [Kubernetes and Terraform](../../11-kubernetes-terraform/README.md)
