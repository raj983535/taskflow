# TaskFlow project context for coding agents

**Last reviewed:** 2026-11-11  
**Purpose:** Give a new human or AI coding agent enough context to begin work without relying on a previous chat.

## 1. What TaskFlow is

TaskFlow is a learning-oriented full-stack task-management application. It is also a public engineering learning repository. The application should be developed as a real, maintainable project while the learner studies the published theory material at their own pace.

The exact product requirements and detailed business rules must be written down as features are agreed. Do not invent complex roles, permissions, collaboration rules, billing, notifications, or enterprise features without a requirement.

## 1A. Initial application model from the theory design

The existing Phase 1 material contains a **proposed learning design** for a simple task-management application. It is useful context for the first implementation discussion, but it is not proof that any feature or endpoint has been implemented or that every proposed detail has been approved.

The illustrative first user journey is:

1. A person creates an account and signs in.
2. The application identifies the current user.
3. That user can create, list, update, and delete tasks that belong to them.
4. The backend validates each request and enforces ownership. The browser is not trusted to decide who owns a task.
5. PostgreSQL stores the user, session, and task records in the proposed relational model.

The teaching database model currently describes three entities:

- **Users:** account identity, a unique email, a password hash, and creation time.
- **Sessions:** a session record linked to a user, a token hash, and an expiry time. This is one conceptual session-based design, not a final authentication decision.
- **Tasks:** a task linked to its owner, with a title, optional description, status, priority, optional due date, and creation/update timestamps.

The Phase 1 API reference contains illustrative routes such as health checks, registration, login, current-user lookup, logout, listing tasks, creating tasks, updating a task, and deleting a task. Those routes are examples only. Final route names, request/response shapes, validation rules, and authentication behaviour must be reviewed during implementation.

Useful existing references:

- [Phase 1 overview and six lessons](../01-application/README.md)
- [Proposed full-stack architecture and task-creation flow](../01-application/architecture.md)
- [Illustrative API contract](../01-application/api-reference.md)
- [Proposed users, sessions, and tasks data model](../01-application/database-design.md)
- [Authentication and security learning notes](../01-application/authentication-and-security.md)
- [Migrations and testing learning notes](../01-application/migrations-and-testing.md)

Before implementing this model, confirm the first-version requirements and record any important decisions. Do not assume that all listed API routes, fields, session storage details, or security mechanisms are already final.

## 2. The learning and development model

There are two parallel tracks:

- **Theory:** the learner studies Phase 0–11 documents at their own pace.
- **Implementation:** the application is developed in small, working slices.

There is no dependency between completing a theory phase and starting implementation. When implementation introduces something unfamiliar, the agent must teach it in an implementation guide and link to its theory lesson. The person may read that guide immediately or study the theory later.

The repository must serve a person who only wants the code as well as a person who wants to learn the concepts. Neither reader should need private chat history.

## 3. Agreed technology direction

| Area | Direction | What remains to be decided |
|---|---|---|
| Frontend | React + TypeScript | Build tool, routing, styling/UI system, state strategy, form strategy |
| Backend | Node.js + Express + TypeScript | Runtime/package setup, API structure, validation, logging, error conventions |
| Database | PostgreSQL | Driver or ORM, migration tool, schema conventions, local setup |
| Cloud | AWS as the primary later cloud path | Exact hosting architecture, services, networking, cost, security, deployment sequence |

This is the known direction. Do not quietly substitute Next.js, another backend framework, another database, or another cloud provider. A meaningful change to the agreed direction needs a clear proposal, trade-off explanation, and recorded decision.

Do not pick a library merely because it is popular. At the point it is needed, compare a small number of suitable options against project needs, beginner understandability, maintenance, compatibility, cost, and the user's machine constraints. Explain the recommendation and record meaningful choices in decisions/.

## 4. Current repository state

At the time this context file was created:

- The complete Phase 0–11 theory material is present under docs/.
- Agent instructions and the implementation documentation system are now established.
- There is not yet an application scaffold or feature implementation on the main branch.
- There is no verified frontend runtime, backend runtime, database instance, Docker setup, CI pipeline, AWS deployment, Kubernetes cluster, or Terraform-managed infrastructure.

This snapshot must be updated as soon as implementation changes. Before each task, inspect the current branch rather than assuming this list is still current.

## 5. Development environment and cost constraints

The primary learner environment is Windows 11 with PowerShell. The machine has limited resources (around 8 GB RAM), and the project should remain affordable.

- Give PowerShell commands when the user is expected to run commands locally. Label commands for other shells clearly.
- Explain what important command flags do and which folder the command should run from.
- Keep local development light. Avoid unnecessary background services and heavy tools.
- Prefer free or low-cost options during local development.
- AWS is the intended cloud learning path, but paid resources must not be provisioned or modified without explicit approval.
- Explain resource cleanup and likely cost before any paid infrastructure action.

## 6. Proposed implementation shape — not yet a committed architecture

A simple monorepo layout may be appropriate:

    taskflow/
    ├── apps/
    │   ├── web/                 # React + TypeScript frontend
    │   └── api/                 # Node.js + Express + TypeScript backend
    ├── infrastructure/          # Local/container and later cloud configuration
    ├── docs/
    │   ├── theory phase folders
    │   └── implementation/
    ├── AGENTS.md
    └── README.md

This is a proposed organizing idea, not a requirement to create empty folders or add monorepo tooling immediately. Confirm the first implementation plan before locking package management, workspace tooling, or deployment structure. Add shared packages only when real reuse justifies them.

## 7. Suggested way to begin implementation

Start with a small end-to-end slice rather than generating the whole system at once:

1. Confirm a concise first-version feature list and the smallest useful user journey.
2. Agree on the initial architecture and project layout. Record important decisions.
3. Scaffold the frontend and API with a clear explanation of each file and command.
4. Establish a simple local development and configuration workflow.
5. Add one small feature that exercises the frontend, API, and database boundary.
6. Add tests and a repeatable debugging path.
7. Introduce Docker, cloud, CI/CD, monitoring, or orchestration when the application has a concrete need for them.

The exact first feature and details of the initial architecture should be confirmed from current project requirements. Do not build all future infrastructure in advance.

## 8. Mandatory implementation documentation

For every meaningful feature or new concept, create or update a beginner-friendly guide under this folder's implementation documentation tree in the same change as the code.

The guide must explain why it exists, what changed, how the full flow works, its business logic, important files/functions, unfamiliar concepts, configuration/commands, security, failure cases, debugging, verification evidence, trade-offs, and relevant theory links.

Start with [the implementation documentation index](README.md), follow [the mandatory agent rules](../../AGENTS.md), and use [the implementation guide template](templates/implementation-guide-template.md).

## 9. Source of truth

When information differs, use this order:

1. Current user-approved requirements and decisions.
2. Current code, tests, and configuration on the branch being changed.
3. Current decision records and implementation guides.
4. Project context and README summaries.
5. Older theory examples, drafts, or historical discussion.

If something important is ambiguous, do not silently invent a business rule or high-impact architecture choice. State the assumption and ask one focused question only when the work genuinely cannot proceed safely. Otherwise, make a small reversible proposal and label it clearly.
