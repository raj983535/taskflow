# TaskFlow instructions for AI coding agents

These instructions apply to every agent that reads, plans, edits, tests, reviews, or documents this repository. Follow them whether you use Codex, Cursor, Claude Code, Copilot, or another coding tool.

## 1. Read the project context before changing anything

At the start of a task, inspect the current repository and read:

1. This file.
2. [Project README](README.md).
3. [Documentation home](docs/README.md).
4. [Implementation documentation guide](docs/implementation/README.md).
5. [Current project context and decisions](docs/implementation/PROJECT-CONTEXT.md).
6. [Documentation standards](docs/DOCUMENTATION-GUIDE.md).
7. [Learning progress](docs/learning-progress.md).
8. The relevant theory lessons and existing implementation documents for the area you will change.

Do not assume that a file, service, feature, dependency, deployment, or infrastructure resource exists just because an old document describes a proposal. Inspect the current branch and code first. When repository reality and documentation disagree, establish what is actually present, then update the affected documentation.

## 2. Mission and learning approach

TaskFlow is both a real full-stack application and a practical learning repository. It must help a beginner understand decisions, code, business logic, tools, tests, and debugging.

**Theory learning and application development run in parallel.** The learner studies the published Phase 0–11 material at their own pace. Completing a phase, lesson, or checkpoint is never a prerequisite for writing code or implementing a project requirement.

Do not block useful implementation by telling the learner to finish the theory course first. When implementation introduces a concept the learner may not know, teach that concept in the matching implementation document and link to the related theory lesson. The learner can study that explanation immediately or return to it later.

The same documentation must help an outside developer who has never seen the conversation understand the project without private context.

## 3. Known project baseline and limits

The repository began as a documentation-only curriculum. At the time this instruction set was added, there was no application source code, package manifest, Docker runtime configuration, CI workflow, Terraform configuration, or deployed infrastructure. Re-check the current branch before each task; this statement will become outdated as implementation proceeds.

The agreed technology direction is:

| Area | Current direction |
|---|---|
| Frontend | React with TypeScript |
| Backend | Node.js with Express and TypeScript |
| Database | PostgreSQL |
| Cloud direction | AWS is the primary cloud path for later deployment work |

These are project directions, not permission to silently select every library or service. Important details still need architecture decisions when implementation reaches them. Examples include frontend build tool, routing, styling, state management, API validation, database driver or ORM, migration tool, authentication design, test stack, package manager, and hosting topology.

Do not replace the agreed direction with another framework, database, or cloud provider without explaining the reason and recording the decision. Do not invent product requirements, roles, permissions, workflows, or business rules that have not been agreed or documented.

Keep local development practical for a Windows 11 and PowerShell user with limited machine resources. Prefer a lean toolchain, explain required installations, and avoid unnecessary paid services. Never create paid cloud resources or incur a bill without explicit approval.

## 4. Work in small, understandable slices

- Inspect existing code, documentation, tests, and Git status before planning.
- State the problem, outcome, approach, affected areas, and important unknowns before a meaningful architectural change.
- Build one understandable vertical slice at a time. A vertical slice follows a real user action through the relevant frontend, API, and data layers.
- Prefer a small working feature over a large speculative scaffold.
- Do not introduce infrastructure early merely because it appears later in the theory roadmap. Introduce it when the implementation has a reason for it, and document that reason.
- Do not add dependencies, abstractions, services, queues, caches, microservices, or frameworks without a concrete need.
- Preserve existing conventions unless there is a clear reason to change them.
- Explain trade-offs in plain language. Distinguish a project requirement from an agent preference.

## 5. Mandatory implementation documentation

Documentation is part of the implementation, not optional follow-up work.

Whenever a change introduces or materially changes a feature, user flow, business rule, architecture, data model, API contract, security behaviour, testing approach, developer tool, dependency, deployment step, or unfamiliar technical concept, create or update the matching guide under **docs/implementation/** in the same change.

This applies regardless of whether the learner has already studied the concept. Do not skip documentation because a concept is considered basic by an experienced developer.

Choose the relevant location:

- **architecture/** — system boundaries, component relationships, request/data flows, and cross-cutting design.
- **features/** — user-facing features, business rules, and end-to-end behaviour.
- **infrastructure/** — local environment, Docker, Compose, servers, cloud, deployment, CI/CD, monitoring, Kubernetes, and Terraform.
- **decisions/** — meaningful choices, alternatives, reasons, consequences, and later review.
- **debugging/** — repeatable investigation guides for errors or operational problems.
- **templates/** — standard formats used for new implementation guides and decision records.

For a change spanning multiple areas, create one main guide and link related documents. Avoid copying the same explanation into several files.

Use [the implementation guide template](docs/implementation/templates/implementation-guide-template.md) for a new guide. A guide must explain in beginner-friendly language:

1. **Why:** the problem or user need that made this change necessary.
2. **What:** what was introduced or changed, including important files, components, services, and dependencies.
3. **Business logic:** what the application is meant to do, the rules it follows, important conditions, and normal and exceptional cases.
4. **How:** the end-to-end flow, in order. Explain how frontend, backend, database, and infrastructure interact when relevant.
5. **Code map:** which important files, functions, components, routes, schemas, migrations, or configuration sections do what. Use current paths and stable names; do not invent line numbers.
6. **Concept teaching:** define unfamiliar terms in simple language, explain why the concept fits here, and distinguish commonly confused concepts.
7. **Configuration and commands:** explain important settings, environment variable names, commands, and flags. Say where a command runs and what it changes.
8. **Security and failure behaviour:** explain relevant validation, authorization, secret handling, data safety, likely failures, and how to investigate them.
9. **Verification:** list tests and checks actually run, their results, and what remains unverified.
10. **Theory connection:** link to relevant Phase 0–11 lessons, but never present those lessons as a prerequisite for using the code.
11. **Trade-offs:** record important alternatives and why this implementation was selected.
12. **Next steps:** mention known limitations or a reasonable next improvement.

A typo, formatting, or local naming-only change does not need a new standalone guide. Update an existing guide when its explanation is affected. If uncertain whether a concept is significant, prefer documenting it.

**Do not mark a feature complete while its required implementation guide is missing or materially out of date.** Code and its explanation should be committed together.

## 6. Code, testing, and debugging expectations

- Keep code readable, typed, modular, and consistent with project conventions.
- Explain non-obvious code through clear names, small functions, and targeted comments. Comments should explain why, not narrate every line.
- Validate inputs at trust boundaries. Keep authentication and authorization distinct. Apply least privilege.
- Handle errors deliberately; do not silently swallow failures or expose secrets in responses or logs.
- Add or update tests for meaningful business logic, API behaviour, data changes, and important failure cases.
- Run the narrowest relevant checks first, then broader checks when practical.
- When a check cannot be run, state why. Never imply that code, a command, a container, a migration, a deployment, or a cloud resource was tested unless it was actually tested.
- When debugging, identify the symptom, gather evidence, isolate the failing layer, test a hypothesis, apply the smallest safe fix, and verify the result. Document reusable lessons in debugging/.

## 7. Security, data, and cost rules

- Never commit real API keys, passwords, tokens, cookies, private keys, database URLs containing credentials, or real environment files.
- Commit safe example files only when useful; use placeholder values and explain how secrets are supplied locally.
- Never paste secrets into documentation, examples, test output, screenshots, or logs.
- Avoid destructive database, filesystem, Git, or cloud commands unless the task clearly requires them and consequences are understood.
- Treat migrations, data deletion, permission changes, public network access, and cloud resource creation as high-impact operations.
- Do not provision or modify paid AWS resources without explicit approval.
- Document cost and cleanup implications whenever infrastructure or paid services are introduced.

## 8. Keep the repository understandable

When a change affects layout, setup, developer workflow, architecture, or project status, update the relevant README and context document.

- Keep the root README as the simple public entry point.
- Keep docs/README.md as the map for theory and implementation documentation.
- Keep docs/learning-progress.md as the curriculum and learning-track status source.
- Keep docs/implementation/PROJECT-CONTEXT.md current as the concise handoff for a new coding agent.
- Keep implementation guides linked from the relevant index README files.
- Do not duplicate the theory course inside implementation documentation; explain the practical project use and link back to theory.
- Use relative Markdown links and verify changed links before finishing.

## 9. Definition of done for a meaningful change

Before reporting completion:

- [ ] The change matches an agreed requirement and does not invent unrelated scope.
- [ ] Code and configuration are internally consistent.
- [ ] Relevant tests and checks were run, or the reason they could not be run is stated.
- [ ] Required implementation documentation is created or updated in the same change.
- [ ] Documentation explains why, what, how, business logic, code locations, and debugging.
- [ ] Related theory lessons are linked where useful.
- [ ] README, project context, and progress status are updated when affected.
- [ ] No secrets or unapproved paid resources were added.
- [ ] Changed Markdown links and paths are checked.
- [ ] The final report separates implemented, tested, untested, and deferred items.

When handing work to another agent or human, leave enough context in the repository for them to continue without needing this conversation.
