# TaskFlow documentation home

This folder contains two connected documentation tracks. You can use either one first. **There is no requirement to finish the theory course before opening, writing, running, or studying the code.**

## Choose your path

### I want to build or understand the application

1. Read the repository-root [AGENTS.md](../AGENTS.md) before asking a coding agent to work.
2. Read [Implementation documentation](implementation/README.md).
3. Read [Current project context](implementation/PROJECT-CONTEXT.md).
4. Open the relevant guide under implementation/ before or while exploring its code.

The implementation track explains the actual TaskFlow code: why a feature exists, what files were added, how the flow works, what business rules apply, how concepts fit together, and how to test and debug them.

### I want to study the concepts

1. [Learning scope and depth limits](LEARNING-SCOPE.md).
2. [Beginner's map for Phases 3–11](BEGINNER-MAP-PHASES-3-11.md).
3. [Phase 1 — Full-stack application fundamentals](01-application/README.md).
4. [Learning progress and all lessons](learning-progress.md).

Study at your own pace. You can start with any relevant topic when it helps you understand a feature. The phase order is a recommended learning sequence, not a gate that blocks coding.

## The two tracks work together

| Theory track | Implementation track |
|---|---|
| Teaches what a concept means and how the technology generally works. | Shows why TaskFlow uses the concept and how it appears in this codebase. |
| Uses guided examples and concept checkpoints. | Uses real files, functions, business rules, tests, and debugging evidence. |
| Can be studied in order or revisited as needed. | Grows as the application is implemented. |
| Does not require running the application. | Must distinguish verified behaviour from proposals or examples. |

For example, the Docker theory lessons teach images, containers, Dockerfiles, and Compose. A TaskFlow Docker implementation guide will explain why Docker was introduced at that point, which exact files configure it, how the TaskFlow services communicate, how to run and inspect them, and how to troubleshoot the actual setup.

## Documentation map

### Theory curriculum

- [00 — Engineering foundations](00-foundations/README.md)
- [01 — Full-stack application fundamentals](01-application/README.md)
- [02 — Git and GitHub](02-git/README.md)
- [03 — Docker](03-docker/README.md)
- [04 — Docker Compose](04-compose/README.md)
- [05 — Linux and servers](05-linux/README.md)
- [06 — AWS](06-aws/README.md)
- [07 — Deployment](07-deployment/README.md)
- [08 — CI/CD](08-cicd/README.md)
- [09 — Monitoring and reliability](09-monitoring/README.md)
- [10 — Scaling and resilience](10-scaling/README.md)
- [11 — Kubernetes and Terraform](11-kubernetes-terraform/README.md)

### Practical implementation documentation

- [Implementation overview and index](implementation/README.md)
- [Project context for coding agents](implementation/PROJECT-CONTEXT.md)
- [Architecture](implementation/architecture/README.md)
- [Features and business logic](implementation/features/README.md)
- [Infrastructure and delivery](implementation/infrastructure/README.md)
- [Architecture and engineering decisions](implementation/decisions/README.md)
- [Debugging guides](implementation/debugging/README.md)
- [Documentation templates](implementation/templates/README.md)

## Current repository status

The theory curriculum is published. The implementation-documentation structure and agent rules are now prepared. Application source code and runtime are added incrementally as implementation begins. Always inspect the actual repository before assuming a particular feature or technology has been implemented.

## Documentation rules

[DOCUMENTATION-GUIDE.md](DOCUMENTATION-GUIDE.md) defines how theory and implementation documents are written. [AGENTS.md](../AGENTS.md) defines the mandatory instructions for coding agents.
