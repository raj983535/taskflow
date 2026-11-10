# TaskFlow — Full-Stack, Cloud & DevOps Learning Project

TaskFlow is a guided software-engineering learning journey. We will first build a clear theoretical understanding of the complete software, cloud, and DevOps ecosystem. Only after all learning phases have been studied will we design and build the actual TaskFlow application.

**Current mode: theory and documentation only. The application has not been implemented.**

## Learning approach

For every phase, we will work through:

1. The problem the technology solves and why it exists.
2. Core concepts and terminology, explained from first principles.
3. Internal workings and how the pieces fit together.
4. Architecture and request/process-flow diagrams.
5. Commands, flags, arguments, expected output, and the effect of each command.
6. How the concept will relate to TaskFlow and to real engineering teams.
7. Common mistakes, troubleshooting, exercises, interview questions, and revision.
8. A learner checkpoint before marking the phase's theory complete.

We will not rush into writing the application while these concepts are still unfamiliar. Commands will be explained first; commands that create or change infrastructure will be run during the later practical stage, not during theory lessons.

## Current status

| Phase | Focus | Status |
|---|---|---|
| 0 | Engineering foundations | Reference notes available; learner checkpoint remains |
| 1 | Full-stack application fundamentals | **Theory in progress** |
| 2 | Git and GitHub workflows | Planned |
| 3 | Docker fundamentals | Planned |
| 4 | Docker Compose | Planned |
| 5 | Linux and server administration | Planned |
| 6 | AWS cloud fundamentals | Planned |
| 7 | Cloud deployment | Planned |
| 8 | CI/CD with GitHub Actions | Planned |
| 9 | Monitoring and reliability | Planned |
| 10 | Scaling and high availability | Planned |
| 11 | Kubernetes and Terraform | Planned |

See [Learning Progress](docs/learning-progress.md) for lesson-level status and checkpoints.

## Planned technology landscape

These are the technologies we intend to understand and evaluate, not a statement that they are installed or already connected:

| Area | Planned learning focus |
|---|---|
| Frontend | Browser fundamentals, HTML/CSS/JavaScript, React, TypeScript |
| Backend | Node.js runtime, Express, APIs, validation, application structure |
| Data | Relational database concepts, SQL, PostgreSQL |
| Identity | Authentication, authorization, sessions, cookies, security |
| Version control | Git and GitHub |
| Containers | Docker and Docker Compose |
| Operating systems | Linux, shell, processes, permissions, networking |
| Cloud | AWS as the primary hands-on cloud provider; Azure and GCP compared conceptually where useful |
| Delivery | DNS, reverse proxies, HTTPS, CI/CD |
| Operations | Logs, metrics, health checks, alerts, reliability |
| Scale and infrastructure | Load balancing, replicas, Kubernetes, Terraform |

The final technology choices and versions will be confirmed during the implementation-planning stage, using current official documentation.

## Repository structure

```text
taskflow/
├── docs/
│   ├── 00-foundations/       # Networking, client-server, compute foundations
│   ├── 01-application/       # Full-stack theory and proposed TaskFlow design
│   ├── DOCUMENTATION-GUIDE.md
│   └── learning-progress.md
└── .gitignore
```

Later phase folders will be added when their lessons begin. Application source code, dependency manifests, deployment files, and infrastructure configuration will be added only after the complete theory roadmap and implementation blueprint are finished.

## Important guardrails

- A diagram or proposed design is not evidence that a service has been built or deployed.
- A command in the notes is for understanding until we explicitly enter the practical stage.
- Never commit passwords, API keys, tokens, cookies, private keys, or real environment files.
- Prefer local, low-cost learning before creating paid cloud resources.
- Review costs, permissions, network exposure, and cleanup before provisioning anything.
- Mark a lesson complete only after the learner can explain the concepts and complete the agreed checkpoint.

## Documentation

- [Documentation standards](docs/DOCUMENTATION-GUIDE.md)
- [Engineering foundations](docs/00-foundations/README.md)
- [Phase 1 — Application fundamentals](docs/01-application/README.md)
- [Learning progress](docs/learning-progress.md)
