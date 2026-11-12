# TaskFlow Project Folder Structure — Architecture Baseline

> **Document status:** Accepted architecture baseline (Recorded in [ADR 0001](docs/implementation/decisions/0001-project-folder-structure.md))  
> **Repository:** `raj983535/taskflow`  
> **Current implementation state:** Stage 1 Application Foundation implemented within `app/api/` and `app/web/` (Recorded in [ADR 0002](docs/implementation/decisions/0002-stage-1-application-foundation.md))  
> **Scope:** Defines repository directory responsibilities, component boundaries, and future extension points. Supporting toolchain choices are documented in their respective implementation guides and ADRs.

---

## 1. What we are designing and why

TaskFlow is intended to serve two connected purposes:

1. A real full-stack task-management application that can be developed incrementally.
2. A long-term learning project through which the learner can understand the software development lifecycle, from application fundamentals through delivery, operations, cloud infrastructure, and advanced DevOps practices.

The repository therefore needs to organize more than frontend and backend source code. It must give clear homes to application modules, database work, automated tests, developer scripts, infrastructure, delivery automation, learning material, and implementation documentation.

The design should be understandable today and expandable later. It should not force us to install or operate advanced tools before they are needed.

### Design constraints and known learning context

The structure is based on the following project context:

- Local development environment: Windows 11 and PowerShell.
- Available machine resources: approximately 8 GB RAM.
- Application direction: React with TypeScript for the web frontend.
- API direction: Node.js, Express, and TypeScript.
- Database direction: PostgreSQL.
- Later cloud-learning path: AWS.
- Learning topics: full-stack application development, Git/GitHub, Docker, Docker Compose, Linux, AWS, deployment, CI/CD, monitoring, scaling, Kubernetes, and Terraform.
- Learning and implementation are parallel tracks. Completing every theory lesson is not a prerequisite for beginning an approved implementation task.
- The repository already contains the theory curriculum, root `AGENTS.md`, and implementation-documentation guidance.

Some supporting technology choices are deliberately still open. These include the package manager, workspace tooling, frontend build and routing tools, state management, validation library, database driver or ORM, migration tool, authentication design, test runner, container topology, and deployment topology. A folder should not silently make one of those decisions.

### The central design principle

**Organize the repository around responsibilities and learning boundaries, not around tools we have not selected yet.**

The structure should make it easy to answer:

- Where does browser-facing code belong?
- Where does server/API code belong?
- Where do database changes live?
- Where are automated tests kept?
- Where do local-development and cloud infrastructure definitions belong?
- Where do CI/CD workflows live?
- Where can a learner find the explanation of a technical decision or implementation?

---

## 2. How I approached the design

The design follows seven steps.

### Step 1 — Separate the application from its environment

The application itself belongs under `app/`. Database assets, infrastructure, repository automation, tests that span services, scripts, and learning documentation have different responsibilities and lifecycles. They therefore have their own top-level homes.

This makes the difference between *building the product* and *running the product* visible in the repository.

### Step 2 — Separate browser code from server code

Frontend code executes in the user's browser. Backend code executes on the server and handles HTTP requests, business rules, authorization, and data access. They may share contracts, but they should not be mixed together.

That is why `app/web/` and `app/api/` are separate.

### Step 3 — Keep application modules understandable

Within the API, related work is grouped into modules such as `tasks/`, `auth/`, and `health/`. On the frontend, the `features/` area groups user-facing functionality, beginning with a planned `tasks/` feature.

These are planned locations, not a final feature specification. The actual requirements and behavior must be agreed before implementation.

### Step 4 — Give data and infrastructure their own boundaries

PostgreSQL schema changes and seed data belong under `database/`. Docker, Linux, AWS, deployment, monitoring, Kubernetes, and Terraform learning and configuration belong under `infrastructure/`.

This keeps a database migration from being confused with application code, and keeps an AWS deployment definition separate from a React component.

### Step 5 — Support different levels of testing

Tests close to a component or API module are useful for focused unit-level checks. Tests that validate interactions between the web application, API, and database belong in shared integration or end-to-end locations.

The structure allows both without forcing every kind of test into one directory.

### Step 6 — Keep learning documentation beside the project, not mixed into source

The existing `docs/` curriculum explains broader concepts. The `docs/implementation/` area explains how those concepts are applied in TaskFlow, records architecture decisions, and captures debugging lessons.

This creates a bridge between learning theory and a real implementation.

### Step 7 — Add complexity only when the project earns it

Kubernetes, Terraform, advanced monitoring, and production deployment have places in the design, but their tools and configurations should be introduced only when the relevant learning stage and application needs are approved.

With an approximately 8 GB RAM development machine, a lightweight local workflow is more practical than running every infrastructure component at once.

---

## 3. Exact proposed repository structure

This is the proposed logical layout. README placeholders keep the directories visible in Git. A folder does not mean that its application code or configuration exists.

```text
taskflow/
│
├── AGENTS.md
├── README.md
├── folderstructure.md
├── .gitignore
│
├── app/
│   ├── web/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   │   └── tasks/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── styles/
│   │   │   └── types/
│   │   └── tests/
│   │
│   ├── api/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── db/
│   │   │   ├── middleware/
│   │   │   ├── modules/
│   │   │   │   ├── health/
│   │   │   │   ├── auth/
│   │   │   │   └── tasks/
│   │   │   └── shared/
│   │   └── tests/
│   │
│   └── shared/
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── infrastructure/
│   ├── local/
│   ├── docker/
│   ├── linux/
│   ├── aws/
│   ├── deployment/
│   ├── monitoring/
│   ├── kubernetes/
│   └── terraform/
│
├── .github/
│   └── workflows/
│
├── tests/
│   ├── integration/
│   └── e2e/
│
├── scripts/
│
└── docs/
    ├── 00-foundations/
    ├── 01-application/
    ├── 02-git/
    ├── 03-docker/
    ├── 04-compose/
    ├── 05-linux/
    ├── 06-aws/
    ├── 07-deployment/
    ├── 08-cicd/
    ├── 09-monitoring/
    ├── 10-scaling/
    ├── 11-kubernetes-terraform/
    │
    └── implementation/
        ├── PROJECT-CONTEXT.md
        ├── architecture/
        ├── features/
        ├── infrastructure/
        ├── decisions/
        ├── debugging/
        └── templates/
```

The `docs/00-foundations/` through `docs/11-kubernetes-terraform/` directories represent the existing learning curriculum. Their lesson files and supporting learning documents remain in place; this proposal does not replace or reorganize that curriculum.

---

## 4. What each major directory is for

### Root files

| Path | Purpose | Why it belongs at the root |
|---|---|---|
| `README.md` | Project overview, entry points, current status, and navigation. | Every contributor should understand the project before opening its modules. |
| `AGENTS.md` | The one universal instruction file for AI coding agents. | One canonical source prevents conflicting rules across tools. |
| `.gitignore` | Excludes secrets, dependencies, build outputs, local data, and local infrastructure state from Git. | These ignore rules apply across the whole repository. |
| `folderstructure.md` | Explains the repository layout and the reasoning behind it. | A single discoverable reference for the architecture and its learning value. |

The root `AGENTS.md` remains the only agent-instruction file. Tool-specific copies or nested instruction files should not be introduced.

### `app/` — application source boundary

This is the home for code that makes TaskFlow an application. It contains the browser frontend, backend API, and only those shared contracts that genuinely need to be shared.

#### `app/web/` — browser frontend

| Path | Intended responsibility |
|---|---|
| `public/` | Static files served as-is, such as a favicon or other public assets. |
| `src/` | Frontend source code. |
| `src/app/` | Application entry, route composition, layouts, and page-level wiring. This name alone does not select Next.js or another routing framework. |
| `src/components/` | Reusable interface components that are not tied to one specific feature. |
| `src/features/` | Feature-oriented frontend code. |
| `src/features/tasks/` | Task-specific screens, UI, and feature logic when the task feature is defined. |
| `src/hooks/` | Reusable React hooks shared by multiple frontend areas. |
| `src/services/` | Frontend service functions for communicating with the API or other external interfaces. |
| `src/styles/` | Global styles, design tokens, and shared styling resources if the selected styling approach needs them. |
| `src/types/` | Frontend-only TypeScript types. |
| `tests/` | Frontend-focused tests that do not need the repository-wide integration or end-to-end environment. |

**Why this works for learning:** The learner can follow a feature from its page and components to hooks and API services. Feature-specific code stays together, while truly reusable interface elements remain separate.

The structure does not decide whether the frontend will use Next.js, Vite, a particular router, CSS framework, or state library. Those choices need a separate decision.

#### `app/api/` — backend HTTP API

| Path | Intended responsibility |
|---|---|
| `src/` | Backend application source. |
| `src/config/` | Validated application configuration and environment-variable loading. |
| `src/db/` | Database connection setup and the application's database access boundary. |
| `src/middleware/` | Express middleware such as request logging, validation integration, authentication enforcement, and centralized error handling. |
| `src/modules/` | Business capabilities grouped into modules. |
| `src/modules/health/` | A simple health/status endpoint location for service availability checks. |
| `src/modules/auth/` | Authentication and authorization functionality, after its requirements are decided. |
| `src/modules/tasks/` | Task-management API behavior, validation, and business rules once specified. |
| `src/shared/` | Backend-only helpers, errors, and common server types. |
| `tests/` | Backend-focused tests for API modules and server behavior. |

**Why modules matter:** A task-related endpoint, validation rule, and business operation should be easy to find together. As the application grows, more modules can be introduced based on real product capabilities rather than creating dozens of empty folders in advance.

The `health`, `auth`, and `tasks` directories indicate planned areas only. They do not establish endpoint contracts, authentication rules, or finished features.

#### `app/shared/` — cross-application contracts

This area is reserved for definitions that genuinely need to be used by both frontend and backend, for example a stable API request/response contract or a shared domain type.

It should not become a general dumping ground. Frontend-specific types belong in `app/web/src/types/`; backend-specific types belong in `app/api/src/shared/`. Share a definition only when there is a real need and a clear ownership model.

### `database/` — database lifecycle

| Path | Intended responsibility |
|---|---|
| `migrations/` | Ordered, version-controlled database schema changes. |
| `seeds/` | Repeatable development or test data setup. |

The database directory is separate from `app/api/src/db/` on purpose:

- `app/api/src/db/` contains the server's connection and data-access code.
- `database/migrations/` contains the schema changes that shape the PostgreSQL database.
- `database/seeds/` contains controlled data used to prepare a local or test database.

This separation helps teach the difference between application-level database access and database structure/lifecycle management.

The database driver, query builder or ORM, migration tool, schema, and seed strategy have not been selected by this folder design.

### `infrastructure/` — how the application is run and operated

This directory supports the journey from local development to cloud and production operations.

| Path | Intended responsibility | Learning connection |
|---|---|---|
| `local/` | Local environment notes and supporting setup that should not live inside application source. | Reproducible development on Windows/PowerShell and local services. |
| `docker/` | Docker-related shared files and guidance, including a future Compose setup if appropriate. | Images, containers, volumes, networks, and multi-container development. |
| `linux/` | Linux server notes, scripts, and operational configuration. | Shell, users, permissions, processes, services, logs, and server administration. |
| `aws/` | AWS-specific architecture notes and configuration. | IAM, networking, compute, load balancing, managed databases, and cloud operations. |
| `deployment/` | Deployment environment definitions and release-related operational guidance. | Moving a verified build into a target environment and managing releases. |
| `monitoring/` | Monitoring and observability configuration and guidance. | Logs, metrics, traces, dashboards, alerts, and operational response. |
| `kubernetes/` | Kubernetes manifests and cluster-related configuration when that stage is approved. | Workloads, services, configuration, secrets, health probes, and orchestration. |
| `terraform/` | Infrastructure-as-code configuration and reusable Terraform modules when justified. | Declarative infrastructure, plans, state, modules, and repeatable provisioning. |

**Why these live outside `app/`:** The application expresses product behavior. Infrastructure describes the environment in which the application is built, deployed, connected, secured, and operated. They change for different reasons and should be reviewable separately.

Do not assume all these tools will run locally at the same time. Docker and Compose can be introduced before Kubernetes. AWS resources and Terraform should be used only after the architecture, access controls, costs, and cleanup plan are reviewed.

### `.github/workflows/` — repository automation

This is the standard location for future GitHub Actions workflow definitions.

A future pipeline may be introduced incrementally to:

1. Validate pull requests.
2. Install dependencies using the approved package manager.
3. Run formatting, linting, type checks, and tests.
4. Build the application.
5. Build and publish container images after that process is approved.
6. Deploy to an approved environment only after security and release requirements are defined.

The workflow directory currently contains documentation placeholders only. No CI/CD pipeline is implemented by the presence of this folder.

### `tests/` — tests that cross module boundaries

| Path | Intended responsibility |
|---|---|
| `integration/` | Tests that verify interactions between multiple parts of the application, such as API and database behavior. |
| `e2e/` | End-to-end tests that validate a user journey through the system from an external interface. |

A useful distinction:

- Unit tests check a small function or component in isolation and can live near the code they test.
- Integration tests check that collaborating parts work together.
- End-to-end tests check a complete user-visible flow.

This avoids treating every test as the same kind of test. The eventual test runner and tooling remain open.

### `scripts/` — repeatable developer and operations tasks

This directory is for small, repeatable scripts that support the repository, such as setup checks, safe data utilities, or maintenance tasks.

A script should exist because it removes a repeated manual task. It should not contain the application's core business logic or become an unstructured collection of one-off commands.

### `docs/` — learning and project knowledge

The existing learning curriculum remains organized by phase:

| Path | Learning focus |
|---|---|
| `00-foundations/` | Engineering and development foundations. |
| `01-application/` | Full-stack application fundamentals. |
| `02-git/` | Git and GitHub workflows. |
| `03-docker/` | Docker fundamentals. |
| `04-compose/` | Docker Compose. |
| `05-linux/` | Linux and server administration. |
| `06-aws/` | AWS cloud fundamentals. |
| `07-deployment/` | Cloud deployment. |
| `08-cicd/` | CI/CD and GitHub Actions. |
| `09-monitoring/` | Monitoring and reliability. |
| `10-scaling/` | Scaling and high availability. |
| `11-kubernetes-terraform/` | Kubernetes and Terraform. |

The implementation guidebook is separate from the theory course:

| Path | Intended responsibility |
|---|---|
| `implementation/PROJECT-CONTEXT.md` | A concise project brief for a new developer or coding agent. |
| `implementation/architecture/` | System architecture diagrams, boundaries, and technical flows. |
| `implementation/features/` | Feature requirements, user journeys, and behavior. |
| `implementation/infrastructure/` | TaskFlow-specific infrastructure and operations explanations. |
| `implementation/decisions/` | Architecture Decision Records (ADRs), including why important choices were made. |
| `implementation/debugging/` | Reusable debugging notes and lessons learned. |
| `implementation/templates/` | Templates for consistent implementation and decision documentation. |

**The distinction is important:** the theory course teaches what a concept means; implementation documentation explains how and why TaskFlow uses it. A meaningful implementation should update its explanation alongside the change.

---

## 5. How the directories connect

The repository has two connected flows: the runtime application flow and the engineering delivery flow.

### A. Runtime application flow

```text
User
  |
  v
app/web
  |
  | HTTP request through frontend services
  v
app/api
  |
  +--> middleware and configuration
  |
  +--> modules (tasks, auth, health)
  |
  v
app/api/src/db
  |
  v
PostgreSQL
  ^
  |
database/migrations and database/seeds
  (define and prepare the database structure/data)

app/shared
  |
  +--> shared contracts/types where genuinely required
```

A typical future task-management request would travel from a frontend interaction to an API endpoint, through server-side rules and validation, to database access, and then return a response to the frontend. This is an explanatory flow, not an implemented feature or a finalized API design.

### B. Engineering and delivery flow

```text
Developer changes
      |
      v
Git branch and pull request
      |
      v
.github/workflows
      |
      +--> formatting / lint / type checks
      +--> unit tests
      +--> integration tests
      +--> end-to-end tests
      +--> build verification
      |
      v
Approved build artifact / container image
      |
      v
infrastructure/deployment
      |
      +--> local or test environment
      +--> AWS environment when approved
      |
      v
infrastructure/monitoring
      |
      +--> logs
      +--> metrics
      +--> traces
      +--> alerts and operational feedback
```

Docker provides a repeatable way to package and run the application. AWS provides cloud infrastructure. Terraform can describe infrastructure as code. Kubernetes can orchestrate containers when the scale and learning objective justify it. GitHub Actions can automate checks and delivery. These tools have different responsibilities; the folders keep those responsibilities visible.

### C. The documentation feedback loop

```text
Learn a concept in docs/phase-*
          |
          v
Apply it in an approved TaskFlow change
          |
          v
Explain the implementation in docs/implementation
          |
          v
Record important trade-offs in decisions/
          |
          v
Capture reusable failures/fixes in debugging/
          |
          v
Update learning progress and project context
```

This is what connects the project to a learning journey rather than turning it into a code repository with no explanation.

---

## 6. How the structure supports the learning roadmap

| Learning stage | Main repository locations | What the learner practices |
|---|---|---|
| Full-stack fundamentals | `app/web/`, `app/api/`, `app/shared/`, `database/`, `tests/` | UI, HTTP, API design, server-side logic, data modeling, validation, and testing. |
| Git and GitHub | Root files, branches, pull requests, `.github/` | Version control, change review, collaboration, and repository hygiene. |
| Docker | `infrastructure/docker/`, application directories | Dockerfiles, images, containers, ports, volumes, networks, and container debugging. |
| Docker Compose | `infrastructure/docker/` | Running the web app, API, and database together in a controlled local environment. |
| Linux | `infrastructure/linux/` | Server administration, shell usage, permissions, processes, system services, and logs. |
| AWS | `infrastructure/aws/` | IAM, networking, compute, load balancers, managed databases, and security boundaries. |
| Deployment | `infrastructure/deployment/` | Environment configuration, release processes, deployment validation, and rollback thinking. |
| CI/CD | `.github/workflows/` | Automated validation, build pipelines, artifact creation, and controlled delivery. |
| Monitoring | `infrastructure/monitoring/` and application instrumentation | Logs, metrics, traces, alerting, health checks, and incident investigation. |
| Scaling | `app/api/`, `database/`, `infrastructure/aws/`, `tests/` | Bottleneck analysis, performance testing, database capacity, caching decisions, and resilience. |
| Kubernetes and Terraform | `infrastructure/kubernetes/`, `infrastructure/terraform/` | Container orchestration and repeatable infrastructure provisioning. |

The repository can support this complete path without requiring all phases to be implemented together. Start with the application and basic tests; introduce containers, cloud resources, and delivery automation in manageable steps.

---

## 7. Future technologies and how the structure can grow

The current layout provides extension points without selecting every future tool today.

| Future need | Likely location | Add it when |
|---|---|---|
| More frontend features | `app/web/src/features/<feature>/` | A real user-facing capability is specified. |
| More backend capabilities | `app/api/src/modules/<module>/` | A real API/business capability is specified. |
| Shared API contracts | `app/shared/` | Both frontend and backend need the same owned contract. |
| New database changes | `database/migrations/` | A reviewed schema change is required. |
| Local multi-service setup | `infrastructure/docker/` | Multiple local services need coordinated startup. |
| Environment-specific deployment | `infrastructure/deployment/` | Development, staging, or production deployment needs distinct configuration. |
| AWS infrastructure modules | `infrastructure/terraform/` and `infrastructure/aws/` | The AWS design and Terraform adoption are approved. |
| Kubernetes packaging | `infrastructure/kubernetes/` | The application has a concrete reason and learning milestone for Kubernetes. |
| Helm charts | Under `infrastructure/kubernetes/` | Helm is actually selected for packaging Kubernetes resources. |
| Configuration management | A future `infrastructure/ansible/` | Ansible is selected for a real configuration-management need. |
| Security automation | `.github/workflows/` and relevant infrastructure documentation | Specific scanning, policy, or compliance checks are selected. |
| Performance and load tests | A dedicated area under `tests/` | Performance testing becomes a real project requirement. |

These are possible extensions, not folders to create now. We should resist adding every technology's directory just because it appears in the learning roadmap.

### Why we are not adding more directories immediately

A directory with no clear owner or practical use becomes noise. For example, adding separate folders for Helm, Ansible, service mesh, GitOps, multiple cloud providers, and several monitoring products before choosing those technologies would make the repository look more advanced without improving the project.

The existing `infrastructure/` boundary is sufficient for the current stages. A new subdirectory should be added when a concrete technology or responsibility is approved.

---

## 8. How we should maintain the structure as TaskFlow grows

Use these rules to prevent the repository from becoming confusing.

1. **Keep one responsibility per area.** Browser UI goes in `app/web/`; API behavior goes in `app/api/`; schema changes go in `database/`; infrastructure definitions go in `infrastructure/`.
2. **Prefer feature-oriented grouping.** Keep related files for a frontend feature or backend module together. Do not create a generic top-level folder for every new file type.
3. **Do not over-share.** Only place genuinely cross-application contracts in `app/shared/`. Avoid circular dependencies between frontend and backend.
4. **Keep tests at the right level.** Focused tests can live near the code. Cross-module integration and user-journey tests belong under root `tests/`.
5. **Record significant decisions.** When a choice is difficult to reverse, create an ADR under `docs/implementation/decisions/` explaining context, options, trade-offs, and the decision.
6. **Document meaningful changes.** Update the relevant implementation guide, project context, and learning progress when a change affects architecture, workflow, or learner understanding.
7. **Keep secrets out of Git.** Use local environment variables and approved secret-management mechanisms. Commit only safe example values when needed. Never commit real credentials, private keys, or production state.
8. **Keep infrastructure changes reviewable.** Review access permissions, costs, state handling, exposure, backups, and cleanup before provisioning resources.
9. **Use pull requests for meaningful changes.** Keep changes small enough to review. Run the checks that actually exist; never claim a check passed if it was not run.
10. **Avoid speculative folders.** Add a new folder when a concrete responsibility appears, not merely because a technology might be used someday.

### A practical rule for adding a folder

Before adding one, answer:

- What responsibility will this folder own?
- Why does that responsibility not fit an existing directory?
- Which files or components will live here?
- Which other parts of the system depend on it?
- Does adding it create a new technology or operational commitment?
- Which documentation should explain it?

If those questions do not have clear answers, the folder is probably premature.

---

## 9. Why this structure is valuable for you

### As a full-stack developer

You learn to see the complete path of a feature: user interface, API request, server-side behavior, database operation, and tests. The separation makes it easier to understand where a bug belongs and how the pieces communicate.

### As a software engineer

You learn boundaries, ownership, modularity, test layers, configuration management, version control, architecture decisions, and maintainability. These are skills that remain useful even when frameworks and libraries change.

### As a DevOps learner

You can follow the same application through local development, containers, Linux, cloud infrastructure, automated delivery, monitoring, scaling, orchestration, and infrastructure as code. The repository gives each operational concern a visible place rather than treating DevOps as a disconnected collection of tutorials.

### As someone learning the full software development lifecycle

You can connect requirements and design to code, tests, builds, deployment, monitoring, troubleshooting, and future improvement. The theory curriculum explains the concepts; the implementation documentation records how they appear in this project.

### With your current development environment

The structure is intentionally lightweight at the start. It does not require a Kubernetes cluster, a continuously running cloud environment, or a large set of services on an 8 GB RAM machine. We can begin with a small application and a local database, then introduce Docker and cloud services when the learning stage calls for them.

**The main value is continuity:** one project can carry you from full-stack fundamentals into production-style engineering without forcing you to rebuild the repository every time you learn a new discipline.

---

## 10. What this proposal does and does not decide

### It proposes

- One repository with a clear `app/` boundary.
- Separate frontend and backend application areas.
- A reserved shared-contract area.
- Separate database, infrastructure, repository automation, cross-cutting tests, scripts, and documentation areas.
- A progressive route into DevOps and cloud learning.
- Documentation and decision-record practices to preserve learning.

### It does not decide or implement

- The exact MVP, user journeys, task fields, roles, or business rules.
- Next.js versus another React setup.
- Package manager, monorepo/workspace tooling, build tool, or dependency versions.
- Routing, styling, state management, or form libraries.
- Authentication provider or authorization model.
- PostgreSQL schema, driver/ORM, or migration framework.
- Unit, integration, and end-to-end testing tools.
- Dockerfiles, Compose services, or production container topology.
- AWS service selection, network architecture, or cloud account setup.
- CI/CD workflow definitions, deployment targets, or secret configuration.
- Kubernetes manifests, Helm charts, Terraform modules, or cloud resources.

The presence of a directory is not permission to create any of these.

---

## 11. Review and approval sequence

The recommended sequence is:

1. Review this document and confirm that the responsibility of each major directory makes sense.
2. Approve or request changes to the proposed layout.
3. Reconcile the approved layout with the current repository tree. Do not overwrite local files without first checking the local Git status and existing files.
4. Finalize the initial implementation decisions that are actually needed for the first application milestone.
5. Only then begin an explicitly approved implementation task, one small vertical slice at a time.

Until the layout is approved, treat this document as a proposal. The existing folder-only structure on `main` remains unchanged.

---

## 12. Final recommendation

The current TaskFlow layout is a suitable foundation for the learning path because it separates the application, data, infrastructure, tests, automation, and documentation while keeping the initial toolchain undecided.

I recommend **keeping the current major directory boundaries** rather than making the repository more complex now. Expand their contents gradually as the application and learning milestones require them.

That gives the project enough structure to grow into a full-stack and DevOps learning environment, while keeping the first implementation understandable, affordable, and practical on the current machine.
