# TaskFlow — Full-Stack, Cloud & DevOps Learning Project

TaskFlow is a guided learning-and-building project. The goal is to gain the practical engineering understanding needed to design, build, deploy, operate, and explain a modern web application.

**Learning strategy: bounded theory first, then build the real application.** We will cover the concepts TaskFlow needs, not every detail of every technology. The target is confident project-level engineering fluency and the ability to discuss architecture and trade-offs with experienced engineers. Senior-level judgment still comes from building, debugging, operating, and learning from real systems.

## The fixed learning boundary

- Phase 0 is complete as the foundation baseline.
- Phases 1–11 contain **30 planned lessons in total**.
- Each lesson is one focused learning unit, not a chain of endless sub-lessons.
- We go deep enough to understand purpose, architecture, normal operation, essential commands, common failures, and project trade-offs.
- We skip specialist internals and unrelated theory unless a real TaskFlow requirement makes them necessary.
- After the theory roadmap, we build, deploy, test, and improve TaskFlow. We do not keep extending the syllabus instead of shipping.

See [Learning Scope](docs/LEARNING-SCOPE.md) for the exact boundaries and [Learning Progress](docs/learning-progress.md) for the lesson checklist.

## Roadmap

| Phase | Focus | Lessons | Status |
|---|---|---:|---|
| 0 | Engineering foundations | Baseline | **Completed baseline** |
| 1 | Full-stack application fundamentals | 6 | **Materials published; study deferred** |
| 2 | Git and GitHub workflows | 2 | **Materials published; study deferred** |
| 3 | Docker fundamentals | 3 | **Materials published; study deferred** |
| 4 | Docker Compose | 2 | **Materials published; study deferred** |
| 5 | Linux and server administration | 3 | **Materials published; study deferred** |
| 6 | AWS cloud fundamentals | 3 | **Materials published; study deferred** |
| 7 | Cloud deployment | 2 | **Materials published; study deferred** |
| 8 | CI/CD with GitHub Actions | 2 | **Materials published; study deferred** |
| 9 | Monitoring and reliability | 2 | **Materials published; study deferred** |
| 10 | Scaling and high availability | 2 | **Materials published; study deferred** |
| 11 | Kubernetes and Terraform | 3 | **Materials published; study deferred** |
| **Total** | **Phases 1–11** | **30** | |

## Technology landscape

These are the planned technologies and concepts to understand. Final versions and exact architecture choices will be confirmed before implementation.

| Area | Project focus |
|---|---|
| Frontend | Browser, HTML/CSS/JavaScript essentials, React, TypeScript |
| Backend | Node.js, Express, API design, validation, error handling |
| Data | SQL, PostgreSQL, schema design, migrations, indexes |
| Identity and security | Authentication, authorization, sessions/cookies, secrets, common web risks |
| Version control | Git, GitHub, branches, pull requests, code review |
| Containers | Docker images/containers, Dockerfiles, volumes, networks, registries |
| Local multi-service setup | Docker Compose, service configuration, health checks |
| Server | Linux shell, files, users, permissions, processes, SSH, networking |
| Cloud | AWS as the primary cloud path; Azure/GCP only compared when useful |
| Delivery | DNS, HTTPS, reverse proxy, CI/CD |
| Operations | Logs, metrics, health checks, alerts, incident basics |
| Scale | Load balancing, replicas, autoscaling, caching, database limits |
| Orchestration and IaC | Kubernetes fundamentals and Terraform fundamentals |

## Repository structure

```text
taskflow/
├── docs/
│   ├── 00-foundations/
│   ├── 01-application/
│   ├── 02-git/
│   ├── 03-docker/
│   ├── 04-compose/
│   ├── 05-linux/
│   ├── 06-aws/
│   ├── 07-deployment/
│   ├── 08-cicd/
│   ├── 09-monitoring/
│   ├── 10-scaling/
│   ├── 11-kubernetes-terraform/
│   ├── BEGINNER-MAP-PHASES-3-11.md
│   ├── LEARNING-SCOPE.md
│   ├── DOCUMENTATION-GUIDE.md
│   └── learning-progress.md
└── .gitignore
```

All planned study materials for Phases 1–11 are published. The learner has chosen to defer studying and checkpoint assessments until the complete curriculum is available. Application source code and infrastructure configuration have not been created; they will be added after the learner's study pass and an agreed implementation blueprint.

## Guardrails

- A design is not a running or deployed system.
- Commands are explained before they are used.
- Avoid unnecessary installations and paid cloud resources during theory.
- Never commit credentials, tokens, cookies, private keys, or real environment files.
- Mark a lesson complete when the learner can explain and apply the required concepts, not when every edge case is memorized.

## Start here

The full curriculum is now available. Begin learning in order when ready.

1. [Learning scope and depth limits](docs/LEARNING-SCOPE.md)
2. [Beginner's map for Phases 3–11](docs/BEGINNER-MAP-PHASES-3-11.md)
3. [Phase 1 — Full-stack application fundamentals](docs/01-application/README.md)
4. [Lesson 1.1 — Full-stack architecture and request lifecycle](docs/01-application/lesson-1.1-full-stack-architecture.md)
5. [Learning progress and all phase links](docs/learning-progress.md)
