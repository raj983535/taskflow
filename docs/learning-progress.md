# TaskFlow — Learning Progress

This file is the single source of truth for what has actually been studied and verified. A topic being documented does not automatically mean the learner has completed it.

## Current checkpoint

- **Current phase:** 0 — Engineering Foundations
- **Current lesson:** 0.1 — Client-Server Architecture
- **Next lesson:** 0.2 — Frontend vs Backend
- **Environment:** Windows 11, PowerShell, VS Code
- **Project status:** Repository and initial foundation notes exist; practical checkpoints still need learner verification.

## Phase roadmap

| Phase | Focus | Status | Evidence / deliverables |
|---|---|---|---|
| 0 | Engineering foundations | In progress | Network and compute concepts; practical observations and quizzes |
| 1 | Full-stack application | Planned | React + TypeScript, Express + TypeScript, PostgreSQL |
| 2 | Git and GitHub workflows | Planned | Branches, commits, pull requests, reviews, conflict resolution |
| 3 | Docker fundamentals | Planned | Dockerfile, images, containers, layers, lifecycle |
| 4 | Docker Compose | Planned | Multi-service development environment, networks, volumes, health checks |
| 5 | Linux and server administration | Planned | Shell, processes, permissions, SSH, firewall basics |
| 6 | AWS fundamentals | Planned | IAM, VPC, subnets, security groups, EC2, ECR, RDS |
| 7 | Cloud deployment | Planned | Deploy TaskFlow with a documented network and security design |
| 8 | CI/CD | Planned | GitHub Actions tests, image build, registry push, controlled deployment |
| 9 | Monitoring and reliability | Planned | Health checks, structured logs, CloudWatch, alarms |
| 10 | Scaling and high availability | Planned | Load balancing, replicas, autoscaling, database considerations |
| 11 | Kubernetes and Terraform | Planned | Pods, Deployments, Services, configuration, declarative infrastructure |

## Phase 0 — Engineering foundations

| Lesson | Topic | Documentation | Learning status |
|---|---|---|---|
| 0.1 | Client-server architecture | [client-server-architecture.md](00-foundations/client-server-architecture.md) | Notes available; practical and quiz verification pending |
| 0.2 | Frontend vs backend | To be created | Not started |
| 0.3 | How websites work | To be created | Not started |
| 0.4 | DNS and IP addresses | [http-https-dns.md](00-foundations/http-https-dns.md) | Notes available; lesson not yet verified |
| 0.5 | Ports and networking | [ports-and-networking.md](00-foundations/ports-and-networking.md) | Notes available; lesson not yet verified |
| 0.6 | HTTP and HTTPS | [http-https-dns.md](00-foundations/http-https-dns.md) | Notes available; lesson not yet verified |
| 0.7 | Physical servers, VMs, containers | [bare-metal-vs-vm-vs-containers.md](00-foundations/bare-metal-vs-vm-vs-containers.md) | Notes available; lesson not yet verified |
| 0.8 | Cloud computing | To be created | Not started |
| 0.9 | How the architecture fits together | To be created | Not started |

## Learning log

### Initial repository setup
- Repository created and initial Phase 0 documentation committed.
- README, ignore rules, and progress ledger are present.
- Future application and infrastructure directories should be introduced when needed, not represented as existing before implementation.

### Repository review and documentation maintenance — 2026-11-10
- Reviewed the repository structure, README, ignore rules, foundation notes, and commit history.
- Aligned the README and progress ledger with the files that actually exist.
- Corrected explanations covering client/server roles, CORS, modern TLS key agreement, HTTP/3 over QUIC, ports, Docker Desktop networking on Windows, and container isolation.
- Added a foundations lesson index and a documentation guide.
- Expanded ignore rules for environment files, credentials, local database data, and Terraform state.
- No application runtime code or cloud infrastructure has been created yet.
- **Verification status:** Repository changes were fetched again from GitHub; learner exercises are still pending.

### Lesson 0.1 — Client-server architecture
- **Concepts:** client, server, request-response, database interaction.
- **Practical verification:** inspect a real request in Chrome DevTools and identify URL, method, status, response, and content type.
- **Knowledge check:** learner completes the lesson quiz.
- **Completion:** pending learner confirmation.

## Definition of done for each lesson

- [ ] Explain the problem the concept solves in plain language.
- [ ] Explain how it works and how it relates to earlier concepts.
- [ ] Complete the practical exercise.
- [ ] Verify the expected result.
- [ ] Review and understand the Markdown documentation.
- [ ] Answer the knowledge-check questions.
- [ ] Record any errors and their solutions.

## Decisions and guardrails

- Start with one cloud provider (AWS); do not learn AWS, Azure, and GCP simultaneously.
- Keep the early local environment lightweight.
- Do not create paid cloud resources until costs, region, access, and cleanup are understood.
- Never commit credentials, tokens, private keys, or real production secrets.
- Kubernetes and Terraform remain advanced topics after Docker, Linux, and a first deployment.
