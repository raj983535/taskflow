# TaskFlow — Learning Progress

This is the source of truth for the roadmap. The goal is project-ready engineering fluency, not exhaustive mastery of every technology.

## Current checkpoint

- **Phase 0:** Completed as the engineering-foundations baseline.
- **Current phase:** 2 — Git and GitHub workflows.
- **Current lesson:** 2.1 — Git fundamentals.
- **Lesson 1.1:** Material published; learner checkpoint remains pending and can be revisited.
- **Lesson 1.2:** Material published; learner checkpoint remains pending and can be revisited.
- **Lesson 1.3:** Material published; learner checkpoint remains pending and can be revisited.
- **Lesson 1.4 material:** Published in GitHub; learner checkpoint and explanation exercise pending.
- **Lesson 1.5 material:** Published in GitHub; learner checkpoint and data-modeling exercise pending.
- **Lesson 1.6 material:** Published in GitHub; learner checkpoint and Phase 1 final walkthrough pending.
- **Phase 1 progression:** Moved to Phase 2 at the learner's direction. Phase 1's individual learner checkpoints and final walkthrough were not separately validated or recorded in this tracker; this is a progression decision, not an assessment result.
- **Phase 2 study material:** Both lesson documents are published. The learner checkpoints and workflow exercise remain open for study and review.
- **Application implementation:** Not started; intentionally postponed until all 30 planned lessons are complete.
- **Repository state:** Learning documentation only.
- **Depth limit:** Follow [Learning Scope](LEARNING-SCOPE.md). Do not expand lessons into an endless syllabus.

## Fixed roadmap

| Phase | Focus | Lessons | Status |
|---|---|---:|---|
| 0 | Engineering foundations | Baseline | **Completed** |
| 1 | Full-stack application fundamentals | 6 | **Progressed to Phase 2; checkpoints not validated** |
| 2 | Git and GitHub workflows | 2 | **In progress: Lesson 2.1** |
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

## Phase 0 — Engineering foundations

**Status: Completed baseline.**

Covered and documented:
- Client-server architecture and frontend/backend responsibilities.
- How a browser reaches a server.
- DNS, IP addresses, ports, and networking.
- HTTP and HTTPS.
- Bare-metal servers, virtual machines, containers, and the cloud/hosting model.

The [Phase 0 notes](00-foundations/README.md) remain a reference. We will revisit a foundation briefly when a later topic depends on it, without reopening Phase 0.

## Phase 1 — Full-stack application fundamentals (6 lessons)

| Lesson | Topic | Main outcome | Status |
|---|---|---|---|
| 1.1 | Full-stack architecture and request lifecycle | Trace a browser action through frontend, API, backend, and database | Study material published; checkpoint pending |
| 1.2 | Browser, React, and TypeScript | Understand UI rendering, components, state, and type safety | Study material published; checkpoint pending |
| 1.3 | Node.js and Express backend | Understand runtime, routes, middleware, validation, and error handling | Study material published; checkpoint pending |
| 1.4 | HTTP, REST-style APIs, and JSON | Design and inspect request/response contracts | Study material published; checkpoint pending |
| 1.5 | PostgreSQL and data modeling | Understand tables, relationships, SQL, constraints, and indexes | Study material published; checkpoint pending |
| 1.6 | Identity, security, and quality basics | Understand sessions/cookies, authorization, secrets, migrations, and testing | Study material published; checkpoint and final walkthrough pending |

Lesson 1.1: [Full-stack architecture and request lifecycle](01-application/lesson-1.1-full-stack-architecture.md). Lesson 1.2: [Browser, React, and TypeScript](01-application/lesson-1.2-browser-react-typescript.md). Lesson 1.3: [Node.js and the Express Backend](01-application/lesson-1.3-nodejs-express-backend.md). Lesson 1.4: [HTTP, REST APIs, and JSON](01-application/lesson-1.4-http-rest-apis-json.md). Lesson 1.5: [PostgreSQL and data modeling](01-application/lesson-1.5-postgresql-data-modeling.md). Lesson 1.6: [Identity, security, and quality basics](01-application/lesson-1.6-identity-security-quality.md). Reference notes: [architecture](01-application/architecture.md), [API contract](01-application/api-reference.md), [database design](01-application/database-design.md), [security](01-application/authentication-and-security.md), [toolchain](01-application/toolchain-and-commands.md), [migrations and testing](01-application/migrations-and-testing.md).

## Phase 2 — Git and GitHub workflows (2 lessons)

| Lesson | Topic | Main outcome | Status |
|---|---|---|---|
| 2.1 | Git fundamentals | Understand working tree, staging, commits, history, and remotes | Study material published; learner checkpoint pending |
| 2.2 | GitHub team workflow | Understand remotes, branches, pull requests, reviews, conflicts, and safe collaboration | Study material published; learner checkpoint pending |

Lesson guides: [Phase 2 overview](02-git/README.md), [Lesson 2.1 — Git fundamentals](02-git/lesson-2.1-git-fundamentals.md), and [Lesson 2.2 — GitHub team workflow](02-git/lesson-2.2-github-team-workflow.md).

## Phase 3 — Docker fundamentals (3 lessons)

| Lesson | Topic | Main outcome | Status |
|---|---|---|---|
| 3.1 | Containers and images | Explain image vs container, layers, registry, and lifecycle | Planned |
| 3.2 | Dockerfile and image build | Read and write the project Dockerfile; understand build context and caching | Planned |
| 3.3 | Runtime operations | Use essential run, logs, exec, stop, inspect, volume, and network concepts | Planned |

## Phase 4 — Docker Compose (2 lessons)

| Lesson | Topic | Main outcome | Status |
|---|---|---|---|
| 4.1 | Multi-service application | Understand services, networks, volumes, and Compose configuration | Planned |
| 4.2 | Local operations | Understand startup order, environment, health checks, logs, and cleanup | Planned |

## Phase 5 — Linux and server administration (3 lessons)

| Lesson | Topic | Main outcome | Status |
|---|---|---|---|
| 5.1 | Shell and filesystem | Navigate files, inspect content, and understand users and permissions | Planned |
| 5.2 | Processes and services | Inspect processes, manage services, and read system logs | Planned |
| 5.3 | Server access and networking | Understand SSH, firewall basics, ports, and basic troubleshooting | Planned |

## Phase 6 — AWS cloud fundamentals (3 lessons)

| Lesson | Topic | Main outcome | Status |
|---|---|---|---|
| 6.1 | Cloud model and IAM | Understand regions, availability zones, shared responsibility, users, roles, and least privilege | Planned |
| 6.2 | AWS networking and compute | Understand VPC, subnets, route tables, security groups, and EC2 | Planned |
| 6.3 | Container and database services | Understand ECR and RDS, basic backups, access, and cost controls | Planned |

AWS is the primary hands-on cloud path. Azure and Google Cloud are comparison points, not additional implementation targets.

## Phase 7 — Cloud deployment (2 lessons)

| Lesson | Topic | Main outcome | Status |
|---|---|---|---|
| 7.1 | Public web access | Connect domain/DNS, HTTPS/TLS, reverse proxy, and application ports | Planned |
| 7.2 | TaskFlow deployment design | Map frontend, backend, database, network boundaries, and secrets into AWS | Planned |

## Phase 8 — CI/CD with GitHub Actions (2 lessons)

| Lesson | Topic | Main outcome | Status |
|---|---|---|---|
| 8.1 | Pipeline fundamentals | Understand workflow YAML, triggers, jobs, steps, runners, and artifacts | Planned |
| 8.2 | Delivery pipeline | Understand test, build, image publish, deploy, secrets, and rollback flow | Planned |

## Phase 9 — Monitoring and reliability (2 lessons)

| Lesson | Topic | Main outcome | Status |
|---|---|---|---|
| 9.1 | Observability basics | Distinguish logs, metrics, traces, and health/readiness checks | Planned |
| 9.2 | Operational response | Understand alerts, dashboards, CloudWatch basics, and incident triage | Planned |

## Phase 10 — Scaling and high availability (2 lessons)

| Lesson | Topic | Main outcome | Status |
|---|---|---|---|
| 10.1 | Application scaling | Understand load balancers, replicas, stateless services, and autoscaling | Planned |
| 10.2 | Data and resilience | Understand caching, database bottlenecks, backups, and availability trade-offs | Planned |

## Phase 11 — Kubernetes and Terraform (3 lessons)

| Lesson | Topic | Main outcome | Status |
|---|---|---|---|
| 11.1 | Kubernetes mental model | Understand cluster, node, Pod, Deployment, and Service | Planned |
| 11.2 | Running an application on Kubernetes | Understand configuration, secrets, probes, storage, and ingress at project level | Planned |
| 11.3 | Terraform and infrastructure as code | Understand providers, resources, plan/apply, variables, outputs, and state | Planned |

## Completion rule for a lesson

A lesson is complete when the learner can explain the purpose, trace the main flow, use the essential vocabulary, understand the relevant commands/configuration, and pass a short checkpoint. Memorizing every option or learning specialist internals is not required.

## After Phase 11 — Build and ship TaskFlow

- [ ] Freeze the theory syllabus and review the architecture.
- [ ] Agree on the implementation blueprint and supported technology versions.
- [ ] Build the minimum full-stack application.
- [ ] Add Docker and Docker Compose.
- [ ] Deploy to AWS with appropriate security boundaries.
- [ ] Add CI/CD.
- [ ] Add health checks, logs, metrics, and alerts.
- [ ] Demonstrate the basic scaling path.
- [ ] Verify and document the deployed application.

## Learning log

### Phase 2 published — 2026-11-11
- Added the Phase 2 guide and both planned lesson documents: Git fundamentals and GitHub team workflow.
- Updated the repository navigation to start Phase 2 at Lesson 2.1.
- Progress moved from Phase 1 to Phase 2 at the learner's direction. The Phase 1 checkpoint results were not individually recorded or independently validated in this tracker.
- Phase 2 lesson materials are published; learner checkpoints and the workflow exercise remain open.

### Repository scope update — 2026-11-10
- Confirmed Phase 0 as the completed foundation baseline.
- Reduced Phases 1–11 to a fixed set of 30 project-relevant lessons.
- Added explicit depth limits and a stop rule to prevent endless theory.
- Confirmed that implementation and deployment follow the bounded theory roadmap.
- Published Phase 1 Lesson 1.1 as a standalone theory document; its learner checkpoint remains pending.
- Published Phase 1 Lesson 1.2 as a standalone theory document; its learner checkpoint remains pending.
- Published Phase 1 Lesson 1.3 as a standalone theory document; its learner checkpoint remains pending.
- Published Phase 1 Lesson 1.4 as a standalone theory document covering HTTP semantics, REST-style API design, JSON, API contracts, request inspection, and common status codes; its learner checkpoint remains pending.
- Published Phase 1 Lesson 1.5 as a standalone theory document covering PostgreSQL, relational modeling, SQL CRUD, keys, constraints, transactions, indexes, and backend/database boundaries; its learner checkpoint remains pending.
- Published Phase 1 Lesson 1.6 as the final study-material unit, covering authentication, authorization, sessions, cookies, security risks, secrets, migrations, and testing; its learner checkpoint and the Phase 1 final walkthrough remain pending.
- No application code or deployment is claimed.
