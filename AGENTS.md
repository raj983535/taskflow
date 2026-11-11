# TaskFlow instructions for AI coding agents

These instructions apply to every agent that reads, plans, edits, tests, reviews, or documents this repository. Follow them whether you use Codex, Cursor, Claude Code, Copilot, or another coding tool.

## Single source of truth: this file only

**The root `AGENTS.md` is the one and only instruction file for every coding agent working on TaskFlow.** It applies equally to Codex, Cursor, Claude Code, GitHub Copilot, Antigravity, IDE-integrated agents, terminal agents, and any future coding agent.

- All project rules, technical context, learning requirements, documentation requirements, coding standards, security rules, and definition-of-done requirements must live in this file.
- Do not create separate tool-specific instruction files such as `CLAUDE.md`, `.cursor/rules/*`, or `.github/copilot-instructions.md`.
- Do not create nested or duplicate agent instruction files elsewhere in the repository. There must be one canonical instruction source at the repository root.
- Every agent must read this file before doing repository work. **Do not assume every tool automatically discovers `AGENTS.md`.** When the tool does not load it automatically, the person launching the agent must explicitly tell it to open and follow the root `AGENTS.md` before planning or editing.
- If an agent tool offers a way to configure project instructions, point it to this root file where possible. Do not copy the rules into a second file.
- When project rules change, update this file only. Other project documentation may link to it, but must not maintain a second copy of its instructions.

This keeps the rules identical regardless of which coding agent is selected and prevents conflicting or outdated tool-specific versions.

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

Keep local development practical for a Windows 11 and PowerShell user with approximately 8 GB RAM. Prefer a lean toolchain and free or genuinely no-cost options. The mandatory installation/download and cost-approval gates in Section 8 apply to every task. A request to implement, build, test, deploy, or proceed does not waive those gates.

## 4. Folder structure is not implementation approval

The repository may contain folders and README placeholders for future components. **A folder, placeholder, proposed architecture, or learning example does not mean its application code is approved or implemented.**

- When the user asks only for structure, documentation, review, or planning, do not create application source code, package manifests, runtime configuration, database migrations, Dockerfiles, workflows, or cloud resources.
- Start coding only when the user explicitly assigns and approves an implementation task.
- Implement only the approved scope. Do not use the existence of a planned folder as permission to fill it with code.
- Keep Proposed, Planned, Implemented, and Verified states distinct.

## 5. Work in small, understandable slices

- Inspect existing code, documentation, tests, and Git status before planning.
- State the problem, outcome, approach, affected areas, and important unknowns before a meaningful architectural change.
- Build one understandable vertical slice at a time. A vertical slice follows a real user action through the relevant frontend, API, and data layers.
- Prefer a small working feature over a large speculative scaffold.
- Do not introduce infrastructure early merely because it appears later in the theory roadmap. Introduce it when the implementation has a reason for it, and document that reason.
- Do not add dependencies, abstractions, services, queues, caches, microservices, or frameworks without a concrete need. A concrete need does not waive the approval requirements for downloading or installing anything; follow Section 8 first.
- Preserve existing conventions unless there is a clear reason to change them.
- Explain trade-offs in plain language. Distinguish a project requirement from an agent preference.

## 6. Mandatory implementation documentation

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

## 7. Code, testing, and debugging expectations

- Keep code readable, typed, modular, and consistent with project conventions.
- Explain non-obvious code through clear names, small functions, and targeted comments. Comments should explain why, not narrate every line.
- Validate inputs at trust boundaries. Keep authentication and authorization distinct. Apply least privilege.
- Handle errors deliberately; do not silently swallow failures or expose secrets in responses or logs.
- Add or update tests for meaningful business logic, API behaviour, data changes, and important failure cases.
- Run the narrowest relevant checks first, then broader checks when practical.
- When a check cannot be run, state why. Never imply that code, a command, a container, a migration, a deployment, or a cloud resource was tested unless it was actually tested.
- When debugging, identify the symptom, gather evidence, isolate the failing layer, test a hypothesis, apply the smallest safe fix, and verify the result. Document reusable lessons in debugging/.

## 8. Mandatory permission gates, security, and cost rules

The two permission gates below are **hard requirements**, not suggestions. They apply to every AI agent, coding agent, builder tool, IDE agent, terminal agent, automation, delegated sub-agent, script, and service acting for the user. They apply regardless of the project, repository, programming language, technology, operating system, or tool being used. No agent may bypass them by delegating work, using another tool, running a script, or triggering an indirect operation.

### 8.1 Rule 1 — No local installations or downloads without explicit permission

**Do not download or install anything onto the user's local machine unless the user has first given explicit approval for that specific action.**

This prohibition includes, but is not limited to:

- Software, applications, developer tools, IDEs, plugins, and extensions.
- Language runtimes, SDKs, CLIs, compilers, build tools, and system utilities.
- Dependencies, libraries, packages, package-manager components, and global tools.
- Container images, virtual-machine images, model weights, datasets, browser drivers, and test binaries.
- Installers, archives, scripts, certificates, fonts, assets, and any other resources fetched onto local storage.
- Updates, upgrades, additional packages, or optional components that an installer or package manager may fetch automatically.

The restriction applies to every installation or download method, including GUI installers, browsers, PowerShell, terminal commands, package managers, IDEs, Docker, scripts, and builder tools. Examples of commands that may download or install content include `npm install`, `npx`, `pnpm add`, `yarn add`, `pip install`, `uv sync`, `winget install`, `choco install`, `scoop install`, `apt install`, and `docker pull`. This list is illustrative, not exhaustive.

Before any such action:

1. Stop before running the command or starting the download.
2. Explain why the exact item is necessary for the approved task and what it will enable.
3. Identify the exact software, tool, package, version, source/vendor, and command or installation method.
4. Explain known or estimated download size, disk usage, RAM/runtime impact, required permissions, and relevant security considerations. Be clear when an estimate is unknown.
5. Present a no-install or already-available alternative where practical, including whether the task can be completed with tools already present.
6. Ask the user for explicit permission and wait for the answer.

Approval must identify the proposed item and action clearly enough to understand what is being authorized. Approval to install one item is not approval to install other packages, optional dependencies, upgrades, or future tools. Do not interpret a general request to build, test, run, deploy, or complete a task as installation permission.

Do not run commands that silently download or install dependencies, update tools, pull images, or fetch additional resources unless the required permission has been obtained first. If an operation may trigger an automatic download or installation and this cannot be ruled out, treat it as requiring permission. When permission is not granted, do not proceed with that installation or download; use an available alternative or explain the limitation.

### 8.2 Rule 2 — No paid services, purchases, or cost-incurring actions without explicit permission

**Never initiate, activate, purchase, subscribe to, provision, deploy, build, or otherwise trigger an action that could incur a charge unless the user has first received the cost explanation and explicitly approved that specific action.**

This includes, but is not limited to:

- Paid subscriptions, plans, licenses, credits, add-ons, and upgrades.
- Purchases, paid APIs, AI model/API usage, paid build minutes, and metered services.
- Cloud resources and services, including compute, databases, storage, networking, load balancers, logs, monitoring, backups, and data transfer.
- Hosting, domains, certificates, email/SMS services, external integrations, and third-party services.
- Actions on an existing account or free-tier plan that could trigger usage charges, overages, auto-scaling, renewals, or billing.
- Any other activity whose direct or indirect result may be a payment, recurring commitment, or usage-based expense.

Always investigate and prioritize genuinely free, open-source, already-available, and no-cost free-tier options before recommending a paid alternative. Do not recommend a paid option merely because it is more convenient. Explain why the free options are unsuitable or insufficient before presenting a paid option.

Before any potentially chargeable action:

1. Stop before enabling billing, starting a paid build, provisioning the resource, deploying, purchasing, or triggering metered usage.
2. Explain why the action is needed and what user requirement it serves.
3. Compare suitable free or no-cost alternatives and explain why they do or do not meet the requirement.
4. State the expected cost in the provider's billing currency and, where practical, an approximate conversion to the user's currency. Separate one-time, recurring, and usage-based charges.
5. Explain the assumptions behind the estimate, likely usage, quotas, free-tier limits, possible overages, taxes where known, renewal terms, and any cost uncertainty. Use current provider pricing information when making a price claim.
6. Explain how the resource or subscription can be monitored, limited, cancelled, or cleaned up, including any residual charges that may remain.
7. Ask for explicit approval for the identified action and wait for the answer.

Approval for one purchase, subscription, resource, environment, build, usage limit, or time period does not authorize additional or recurring charges outside that scope. Do not assume that an attached payment method, existing subscription, free-tier eligibility, previous approval, or general implementation request is permission to spend. When a free tier can become chargeable after a quota is exceeded, explain that risk and obtain approval before enabling a billing path or triggering usage that could exceed the no-cost allowance.

If approval is not granted, do not trigger the expense. Continue with an appropriate no-cost alternative or explain what cannot be completed without paid resources.

### 8.3 Security and data handling

- Never commit real API keys, passwords, tokens, cookies, private keys, database URLs containing credentials, or real environment files.
- Commit safe example files only when useful; use placeholder values and explain how secrets are supplied locally.
- Never paste secrets into documentation, examples, test output, screenshots, or logs.
- Avoid destructive database, filesystem, Git, or cloud commands unless the task clearly requires them and consequences are understood.
- Treat migrations, data deletion, permission changes, public network access, and cloud resource creation as high-impact operations.
- Do not provision or modify paid AWS resources without following Rule 2 and receiving explicit approval.
- Document cost, security, and cleanup implications whenever infrastructure or paid services are introduced.

### 8.4 No bypasses and no implied consent

- These rules apply to direct actions and indirect actions performed through scripts, package managers, IDEs, browser automation, CI services, cloud consoles, APIs, plugins, external builders, and delegated agents.
- A user approving the overall project, folder structure, implementation phase, or a feature does not approve installations, downloads, subscriptions, purchases, paid builds, or chargeable infrastructure.
- Never split an unapproved action into smaller steps, disguise it as setup, or let another agent perform it to avoid asking.
- If the cost, download, installation, or side effects are uncertain, stop and ask rather than assume the action is safe.
- Record what was approved and what was actually performed. Do not claim that approval was received when it was not.

## 9. Keep the repository understandable

When a change affects layout, setup, developer workflow, architecture, or project status, update the relevant README and context document.

- Keep the root README as the simple public entry point.
- Keep docs/README.md as the map for theory and implementation documentation.
- Keep docs/learning-progress.md as the curriculum and learning-track status source.
- Keep docs/implementation/PROJECT-CONTEXT.md current as the concise handoff for a new coding agent.
- Keep implementation guides linked from the relevant index README files.
- Do not duplicate the theory course inside implementation documentation; explain the practical project use and link back to theory.
- Use relative Markdown links and verify changed links before finishing.

## 10. Definition of done for a meaningful change

Before reporting completion:

- [ ] The change matches an agreed requirement and does not invent unrelated scope.
- [ ] Code and configuration are internally consistent.
- [ ] Relevant tests and checks were run, or the reason they could not be run is stated.
- [ ] Required implementation documentation is created or updated in the same change.
- [ ] Documentation explains why, what, how, business logic, code locations, and debugging.
- [ ] Related theory lessons are linked where useful.
- [ ] README, project context, and progress status are updated when affected.
- [ ] No software, tools, dependencies, packages, or other resources were downloaded or installed without explicit approval.
- [ ] No paid subscription, purchase, paid build, cloud resource, or other potentially chargeable action was initiated without explicit approval.
- [ ] No secrets or unapproved paid resources were added.
- [ ] Changed Markdown links and paths are checked.
- [ ] The final report separates implemented, tested, untested, and deferred items.

When handing work to another agent or human, leave enough context in the repository for them to continue without needing this conversation.
