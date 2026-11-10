# TaskFlow — Learning Progress

This is the source of truth for the learning journey. It distinguishes reference notes, topics discussed, learner-understood concepts, and practical implementation. These are different states.

## Current checkpoint

- **Current mode:** Theory first
- **Current phase:** 1 — Full-stack application fundamentals
- **Current lesson:** To begin — Lesson 1.1, understanding full-stack architecture
- **Application implementation:** Not started by design
- **GitHub repository:** Documentation and learning notes only
- **Implementation stage:** Starts only after all phases 0–11 have been studied and the implementation blueprint is agreed
- **Environment:** Windows 11 and PowerShell are the assumed learning environment unless a lesson says otherwise

## Roadmap

| Phase | Focus | Status | Main learning outcome |
|---|---|---|---|
| 0 | Engineering foundations | Reference notes available; checkpoint pending | Understand how clients, servers, networks, protocols, compute, and cloud fit together |
| 1 | Full-stack application fundamentals | **Theory in progress** | Explain the browser, frontend, backend, API, database, runtime, authentication, and testing |
| 2 | Git and GitHub workflows | Planned | Understand version control, branches, commits, remotes, pull requests, and collaboration |
| 3 | Docker fundamentals | Planned | Understand images, containers, layers, registries, volumes, and networks |
| 4 | Docker Compose | Planned | Understand how multiple services are described and run together |
| 5 | Linux and server administration | Planned | Understand shell, files, users, permissions, processes, SSH, and server basics |
| 6 | AWS cloud fundamentals | Planned | Understand IAM, VPC, subnets, security groups, EC2, ECR, and RDS |
| 7 | Cloud deployment | Planned | Understand DNS, reverse proxies, HTTPS, hosting, and deployment architecture |
| 8 | CI/CD | Planned | Understand automated checks, build pipelines, artifacts, registries, and deployment |
| 9 | Monitoring and reliability | Planned | Understand logs, metrics, health checks, alerts, and operational response |
| 10 | Scaling and high availability | Planned | Understand load balancing, replicas, autoscaling, caching, and database scaling |
| 11 | Kubernetes and Terraform | Planned | Understand orchestration and declarative infrastructure |

AWS is the primary cloud provider for hands-on learning. Azure and Google Cloud will be compared conceptually when that comparison helps build transferable understanding.

## Phase 0 — Engineering foundations

| Lesson | Topic | Documentation | Status |
|---|---|---|---|
| 0.1 | Client-server architecture | [Client-server architecture](00-foundations/client-server-architecture.md) | Reference notes available; learner checkpoint pending |
| 0.2 | Frontend vs backend | To be connected to Phase 1 | Covered again in Phase 1 |
| 0.3 | How websites work | To be connected to Phase 1 | Covered again in Phase 1 |
| 0.4 | DNS and IP addresses | [HTTP, HTTPS, and DNS](00-foundations/http-https-dns.md) | Reference notes available; checkpoint pending |
| 0.5 | Ports and networking | [Ports and networking](00-foundations/ports-and-networking.md) | Reference notes available; checkpoint pending |
| 0.6 | HTTP and HTTPS | [HTTP, HTTPS, and DNS](00-foundations/http-https-dns.md) | Reference notes available; checkpoint pending |
| 0.7 | Physical servers, VMs, and containers | [Bare metal, VMs, and containers](00-foundations/bare-metal-vs-vm-vs-containers.md) | Reference notes available; checkpoint pending |
| 0.8 | Cloud computing | To be covered in the cloud phases | Planned |
| 0.9 | Connect the full architecture | Across Phase 1 and later phases | Planned |

The foundation notes are available for study. They are not automatically marked as learner-completed.

## Phase 1 — Full-stack application fundamentals

| Lesson | Topic | Documentation | Status |
|---|---|---|---|
| 1.1 | Full-stack architecture and request lifecycle | [Architecture](01-application/architecture.md) | Next |
| 1.2 | Browser, frontend, React, and TypeScript | [Phase 1 guide](01-application/README.md) | Planned |
| 1.3 | Runtime, Node.js, backend, and Express | [Phase 1 guide](01-application/README.md) | Planned |
| 1.4 | HTTP, APIs, REST, JSON, and status codes | [Proposed API contract](01-application/api-reference.md) | Planned |
| 1.5 | Relational databases, SQL, and PostgreSQL | [Database design](01-application/database-design.md) | Planned |
| 1.6 | Authentication, authorization, sessions, and security | [Security concepts](01-application/authentication-and-security.md) | Planned |
| 1.7 | Packages, environment variables, and development commands | [Toolchain and commands](01-application/toolchain-and-commands.md) | Planned |
| 1.8 | Migrations, testing, and quality checks | [Migrations and testing](01-application/migrations-and-testing.md) | Planned |
| 1.9 | Connect the concepts into a complete system design | [Phase 1 learning plan](01-application/phase-1-learning-plan.md) | Planned |

### Phase 1 theory checkpoint

- [ ] Explain the difference between a browser, frontend, backend, API, database, runtime, and framework.
- [ ] Trace a user's request from the browser through the backend to the database and back.
- [ ] Explain where React, TypeScript, Node.js, Express, and PostgreSQL fit.
- [ ] Distinguish authentication from authorization.
- [ ] Explain what HTTP methods, status codes, JSON, and REST mean.
- [ ] Explain tables, rows, primary keys, foreign keys, and SQL at a conceptual level.
- [ ] Explain what package managers, environment variables, migrations, and tests are for.
- [ ] Walk through the proposed TaskFlow architecture without relying on implementation code.
- [ ] Complete the lesson exercises and review questions.

Do not mark this checkpoint complete until the learner can explain these topics in their own words.

## Later implementation stage

After the theory in every phase is complete:

1. Review and finalize the complete TaskFlow architecture.
2. Choose current supported versions and confirm the stack.
3. Create an implementation plan and repository structure.
4. Build the application in small, verified steps.
5. Add Docker, cloud infrastructure, CI/CD, monitoring, and scaling in the order studied.
6. Record actual test, build, deployment, and operational evidence.

## Learning log

### Repository correction — 2026-11-10
- Aligned the repository with the agreed theory-first learning sequence.
- Removed the premature application source folders and runtime/package setup from the active branch.
- Retained and reframed useful Phase 1 material as proposed architecture and conceptual learning notes.
- Changed progress tracking so Phase 1 is theory in progress and no application implementation is claimed.
- No application build, test, or deployment is claimed.

## Definition of done for a theory phase

- [ ] Understand why the technology exists.
- [ ] Explain its key concepts and internal workings.
- [ ] Understand its role in the end-to-end architecture.
- [ ] Read and understand the relevant diagrams.
- [ ] Understand commands, arguments, effects, and expected output.
- [ ] Complete exercises and review questions.
- [ ] Explain the topic in the learner's own words.
- [ ] Update this ledger only after the checkpoint is reviewed.

## Decisions and guardrails

- Complete all theory phases before beginning application implementation.
- Explain commands before execution; avoid unnecessary installs and paid resources during theory.
- Use AWS as the primary cloud learning path, with conceptual comparisons to Azure and Google Cloud.
- Keep local learning resource-conscious, especially on the 8 GB Windows machine.
- Never commit credentials, tokens, cookies, private keys, or real environment files.
- Do not call an unimplemented design working, tested, deployed, or production-ready.
