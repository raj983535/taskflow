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
| 0 | Engineering foundations | Baseline | **Completed** |
| 1 | Full-stack application fundamentals | 6 | **In progress: Lesson 1.3** |
| 2 | Git and GitHub workflows | 2 | Planned |
| 3 | Docker fundamentals | 3 | Planned |
| 4 | Docker Compose | 2 | Planned |
| 5 | Linux and server administration | 3 | Planned |
| 6 | AWS cloud fundamentals | 3 | Planned |
| 7 | Cloud deployment | 2 | Planned |
| 8 | CI/CD with GitHub Actions | 2 | Planned |
| 9 | Monitoring and reliability | 2 | Planned |
| 10 | Scaling and high availability | 2 | Planned |
| 11 | Kubernetes and Terraform | 3 | Planned |
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
│   ├── LEARNING-SCOPE.md
│   ├── DOCUMENTATION-GUIDE.md
│   └── learning-progress.md
└── .gitignore
```

Only learning documentation is present at this stage. Application source code and infrastructure configuration will be added when the theory roadmap is complete and the implementation blueprint is agreed.

## Guardrails

- A design is not a running or deployed system.
- Commands are explained before they are used.
- Avoid unnecessary installations and paid cloud resources during theory.
- Never commit credentials, tokens, cookies, private keys, or real environment files.
- Mark a lesson complete when the learner can explain and apply the required concepts, not when every edge case is memorized.

## Start here

1. [Learning scope and depth limits](docs/LEARNING-SCOPE.md)
2. [Phase 1 — Full-stack application fundamentals](docs/01-application/README.md)
3. [Lesson 1.3 — Node.js and the Express Backend](docs/01-application/lesson-1.3-nodejs-express-backend.md)
4. [Learning progress](docs/learning-progress.md)
