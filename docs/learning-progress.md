# TaskFlow — Learning Progress

This is the source of truth for the TaskFlow curriculum.

## Curriculum authoring status

**All planned study materials published.**

- **Phase 0:** Engineering foundations baseline documented.
- **Phases 1–11:** All **30 planned lessons** and their phase guides are published in GitHub.
- **Phases 3–11 beginner revision:** All 21 lesson files now include a plain-language bridge to prior knowledge and a guided TaskFlow walkthrough that connects the concepts end to end. Phase guides also link backward/forward through the roadmap.
- **Beginner's map:** [How Phases 3–11 fit together](BEGINNER-MAP-PHASES-3-11.md).
- **Learner study:** Deferred by the learner until the entire curriculum has been authored.
- **Checkpoint assessments:** Deferred. No Phase 1–11 learner checkpoint is being recorded as passed merely because its material has been published or explained.
- **Recommended starting point:** Phase 1, Lesson 1.1 — Full-stack architecture and request lifecycle.
- **Application implementation:** Not started. It remains after the later study pass and architecture review.
- **Repository state:** Curriculum documentation only; no application runtime or AWS infrastructure is claimed.

## Fixed roadmap

| Phase | Focus | Lessons | Material status |
|---|---|---:|---|
| 0 | Engineering foundations | Baseline | Documented baseline |
| 1 | Full-stack application fundamentals | 6 | Published; study deferred |
| 2 | Git and GitHub workflows | 2 | Published; study deferred |
| 3 | Docker fundamentals | 3 | Published; study deferred |
| 4 | Docker Compose | 2 | Published; study deferred |
| 5 | Linux and server administration | 3 | Published; study deferred |
| 6 | AWS cloud fundamentals | 3 | Published; study deferred |
| 7 | Cloud deployment | 2 | Published; study deferred |
| 8 | CI/CD with GitHub Actions | 2 | Published; study deferred |
| 9 | Monitoring and reliability | 2 | Published; study deferred |
| 10 | Scaling and high availability | 2 | Published; study deferred |
| 11 | Kubernetes and Terraform | 3 | Published; study deferred |
| **Total** | **Phases 1–11** | **30** | **All materials published** |

## Phase 0 — Engineering foundations

**Status: Completed baseline.**

The foundation notes cover:

- Client-server architecture and frontend/backend responsibilities.
- How a browser reaches a server.
- DNS, IP addresses, ports, and networking.
- HTTP and HTTPS.
- Bare-metal servers, virtual machines, containers, and cloud/hosting concepts.

Reference: [Phase 0 foundation notes](00-foundations/README.md).

## Phase 1 — Full-stack application fundamentals (6 lessons)

**Material status: All six lesson documents published. Study and assessment deferred.**

| Lesson | Topic | Material |
|---|---|---|
| 1.1 | Full-stack architecture and request lifecycle | [Open lesson](01-application/lesson-1.1-full-stack-architecture.md) |
| 1.2 | Browser, React, and TypeScript | [Open lesson](01-application/lesson-1.2-browser-react-typescript.md) |
| 1.3 | Node.js and Express backend | [Open lesson](01-application/lesson-1.3-nodejs-express-backend.md) |
| 1.4 | HTTP, REST APIs, and JSON | [Open lesson](01-application/lesson-1.4-http-rest-apis-json.md) |
| 1.5 | PostgreSQL and data modeling | [Open lesson](01-application/lesson-1.5-postgresql-data-modeling.md) |
| 1.6 | Identity, security, and quality basics | [Open lesson](01-application/lesson-1.6-identity-security-quality.md) |

Phase guide: [Phase 1 overview](01-application/README.md). Reference material includes [architecture](01-application/architecture.md), [API contract](01-application/api-reference.md), [database design](01-application/database-design.md), [authentication and security](01-application/authentication-and-security.md), and [migrations and testing](01-application/migrations-and-testing.md).

## Phase 2 — Git and GitHub workflows (2 lessons)

**Material status: Both lessons and the integrated checkpoint published. Study and assessment deferred.**

| Lesson | Topic | Material |
|---|---|---|
| 2.1 | Git fundamentals | [Open lesson](02-git/lesson-2.1-git-fundamentals.md) |
| 2.2 | GitHub team workflow | [Open lesson](02-git/lesson-2.2-github-team-workflow.md) |

Phase guide and integrated checkpoint: [Phase 2 overview](02-git/README.md).

## Phase 3 — Docker fundamentals (3 lessons)

**Material status: All three lessons and the connected walkthrough published. Study and assessment deferred.**

| Lesson | Topic | Material |
|---|---|---|
| 3.1 | Containers and images | [Open lesson](03-docker/lesson-3.1-containers-and-images.md) |
| 3.2 | Dockerfile and image build | [Open lesson](03-docker/lesson-3.2-dockerfile-and-image-build.md) |
| 3.3 | Container runtime operations | [Open lesson](03-docker/lesson-3.3-container-runtime-operations.md) |

Phase guide and integrated checkpoint: [Phase 3 overview](03-docker/README.md).

## Phase 4 — Docker Compose (2 lessons)

**Material status: Both lessons and the integrated checkpoint published. Study deferred.**

| Lesson | Topic | Material |
|---|---|---|
| 4.1 | Multi-service application | [Open lesson](04-compose/lesson-4.1-multi-service-application.md) |
| 4.2 | Local Compose operations | [Open lesson](04-compose/lesson-4.2-local-compose-operations.md) |

Phase guide: [Phase 4 overview](04-compose/README.md).

## Phase 5 — Linux and server administration (3 lessons)

**Material status: All three lessons and the integrated checkpoint published. Study deferred.**

| Lesson | Topic | Material |
|---|---|---|
| 5.1 | Shell and filesystem | [Open lesson](05-linux/lesson-5.1-shell-and-filesystem.md) |
| 5.2 | Processes and services | [Open lesson](05-linux/lesson-5.2-processes-and-services.md) |
| 5.3 | Server access and networking | [Open lesson](05-linux/lesson-5.3-server-access-and-networking.md) |

Phase guide: [Phase 5 overview](05-linux/README.md).

## Phase 6 — AWS cloud fundamentals (3 lessons)

**Material status: All three lessons and the integrated checkpoint published. Study deferred.**

| Lesson | Topic | Material |
|---|---|---|
| 6.1 | Cloud model and IAM | [Open lesson](06-aws/lesson-6.1-cloud-model-and-iam.md) |
| 6.2 | AWS networking and compute | [Open lesson](06-aws/lesson-6.2-aws-networking-and-compute.md) |
| 6.3 | Container and database services | [Open lesson](06-aws/lesson-6.3-container-and-database-services.md) |

Phase guide: [Phase 6 overview](06-aws/README.md).

## Phase 7 — Cloud deployment (2 lessons)

**Material status: Both lessons and the integrated checkpoint published. Study deferred.**

| Lesson | Topic | Material |
|---|---|---|
| 7.1 | Public web access | [Open lesson](07-deployment/lesson-7.1-public-web-access.md) |
| 7.2 | TaskFlow deployment design | [Open lesson](07-deployment/lesson-7.2-taskflow-deployment-design.md) |

Phase guide: [Phase 7 overview](07-deployment/README.md).

## Phase 8 — CI/CD with GitHub Actions (2 lessons)

**Material status: Both lessons and the integrated checkpoint published. Study deferred.**

| Lesson | Topic | Material |
|---|---|---|
| 8.1 | Pipeline fundamentals | [Open lesson](08-cicd/lesson-8.1-pipeline-fundamentals.md) |
| 8.2 | Delivery pipeline | [Open lesson](08-cicd/lesson-8.2-delivery-pipeline.md) |

Phase guide: [Phase 8 overview](08-cicd/README.md).

## Phase 9 — Monitoring and reliability (2 lessons)

**Material status: Both lessons and the integrated checkpoint published. Study deferred.**

| Lesson | Topic | Material |
|---|---|---|
| 9.1 | Observability basics | [Open lesson](09-monitoring/lesson-9.1-observability-basics.md) |
| 9.2 | Operational response | [Open lesson](09-monitoring/lesson-9.2-operational-response.md) |

Phase guide: [Phase 9 overview](09-monitoring/README.md).

## Phase 10 — Scaling and high availability (2 lessons)

**Material status: Both lessons and the integrated checkpoint published. Study deferred.**

| Lesson | Topic | Material |
|---|---|---|
| 10.1 | Application scaling | [Open lesson](10-scaling/lesson-10.1-application-scaling.md) |
| 10.2 | Data and resilience | [Open lesson](10-scaling/lesson-10.2-data-and-resilience.md) |

Phase guide: [Phase 10 overview](10-scaling/README.md).

## Phase 11 — Kubernetes and Terraform (3 lessons)

**Material status: All three lessons and the integrated checkpoint published. Study deferred.**

| Lesson | Topic | Material |
|---|---|---|
| 11.1 | Kubernetes mental model | [Open lesson](11-kubernetes-terraform/lesson-11.1-kubernetes-mental-model.md) |
| 11.2 | Running an app on Kubernetes | [Open lesson](11-kubernetes-terraform/lesson-11.2-running-app-on-kubernetes.md) |
| 11.3 | Terraform and infrastructure as code | [Open lesson](11-kubernetes-terraform/lesson-11.3-terraform-and-infrastructure-as-code.md) |

Phase guide: [Phase 11 overview](11-kubernetes-terraform/README.md).

## Completion rule and later study plan

A lesson is considered learned only after the learner studies it, can explain its main flow, understands the important vocabulary and commands, and completes its checkpoint. Publishing a lesson does not count as learner completion.

The learner has explicitly deferred study and checkpoint assessment until all planned materials are authored. When study begins, follow the phases in order, starting with Phase 1, Lesson 1.1. Record checkpoint results only after they are actually reviewed.

## After Phase 11 — Build and ship TaskFlow

After the study pass and architecture review:

- [ ] Freeze the theory syllabus and confirm technology versions.
- [ ] Agree on the implementation blueprint and deployment architecture.
- [ ] Build the minimum full-stack application.
- [ ] Add Docker and Docker Compose.
- [ ] Provision infrastructure using the agreed AWS design.
- [ ] Deploy the application.
- [ ] Add CI/CD.
- [ ] Add health checks, logs, metrics, and alerts.
- [ ] Demonstrate the basic scaling and recovery path.
- [ ] Verify and document the running application.

## Learning log

### Curriculum authoring completed — 2026-11-11

- Confirmed the fixed roadmap of 30 planned lessons across Phases 1–11.
- Published the guides and lesson documents for Phases 1–11.
- Added integrated phase checkpoints and official reference links to the phase guides.
- Revised all 21 Phase 3–11 lessons with prior-knowledge bridges, guided end-to-end TaskFlow examples, clearer failure diagnosis, and concept boundaries. Added the connected beginner map and previous/next phase navigation.
- Updated the documentation standard to require first-use jargon explanations, complete workflows, command/flag explanations, and a practical failure path.
- Updated repository navigation to point to the first study lesson, Phase 1 Lesson 1.1.
- Deferred learner study and assessments at the learner's direction. No Phase 1–11 lesson is recorded as passed by publication alone.
- Kept the repository documentation-only. No application code, Docker runtime, Kubernetes cluster, Terraform apply, or AWS infrastructure is claimed.
