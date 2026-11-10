# TaskFlow: Full-Stack, Cloud & DevOps Learning Project

TaskFlow is a practical task-management application that we will build incrementally while learning how software moves from local development to production infrastructure.

The repository is both:
- a working application (introduced in Phase 1), and
- a structured engineering notebook containing the theory, commands, architecture decisions, troubleshooting notes, and lessons learned.

## Learning approach

Every phase follows: problem → theory → architecture → implementation → verification → documentation → exercises.

We will not introduce cloud services or paid infrastructure until the relevant concepts are understood and the costs have been reviewed.

## Planned application stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| Version control | Git + GitHub |
| Containers | Docker + Docker Compose |
| Cloud | AWS |
| CI/CD | GitHub Actions |
| Monitoring | Application logs + Amazon CloudWatch |
| Orchestration / IaC | Kubernetes + Terraform (advanced phase) |

## Repository structure

```text
taskflow/
├── docs/                   # Learning notes and project decisions
│   ├── 00-foundations/
│   ├── 01-application/
│   ├── 02-git-github/
│   ├── 03-docker/
│   ├── 04-linux/
│   ├── 05-aws/
│   ├── 06-cicd/
│   ├── 07-monitoring/
│   ├── 08-scaling/
│   ├── 09-kubernetes/
│   ├── 10-terraform/
│   └── troubleshooting/
├── frontend/               # Added in Phase 1
├── backend/                # Added in Phase 1
├── database/               # Added in Phase 1
├── infrastructure/         # Added when infrastructure is introduced
├── .github/workflows/      # Added with CI/CD
├── README.md
└── .gitignore
```

Directories for future phases will be created when we reach them; the documentation index is maintained in `docs/learning-progress.md`.

## Learning roadmap

| Phase | Focus | Status |
|---|---|---|
| 0 | Engineering foundations | In progress |
| 1 | Full-stack application | Planned |
| 2 | Git and GitHub workflows | Planned |
| 3 | Docker fundamentals | Planned |
| 4 | Docker Compose | Planned |
| 5 | Linux and server administration | Planned |
| 6 | AWS fundamentals | Planned |
| 7 | First cloud deployment | Planned |
| 8 | CI/CD with GitHub Actions | Planned |
| 9 | Monitoring and reliability | Planned |
| 10 | Scaling and high availability | Planned |
| 11 | Kubernetes and Terraform | Planned |

## Getting started

The initial lessons are theory and safe local diagnostics. Application runtime dependencies will be pinned and documented when Phase 1 begins.

See [Learning Progress](docs/learning-progress.md) for the current lesson and completion criteria.

## Engineering conventions

- Keep secrets, credentials, private keys, and local environment files out of Git.
- Document commands with their purpose, expected result, and common failure modes.
- Prefer small, reviewable commits with meaningful messages.
- Verify changes locally before considering a lesson complete.
- Use least-privilege access and avoid exposing databases to the public internet.
- Review AWS costs before creating resources; delete resources that are no longer needed.
