# TaskFlow implementation documentation

This is the practical guidebook for the actual TaskFlow application. It is written for two readers:

- A beginner who wants to understand what the code is doing and why.
- A developer or AI coding agent who needs enough context to change the project safely.

This documentation is maintained alongside the code. It is not a replacement for the theory course.

## Important: coding does not wait for theory

The learner may study theory phases at their own pace while the application is being built. No phase, lesson, or checkpoint must be completed before implementation can start.

When code introduces an unfamiliar concept, this guidebook must explain the concept in the context of the actual TaskFlow implementation. It must also link to the matching theory lesson for a broader explanation. A reader can learn from the code first, the theory first, or move between both.

## Start here as a new coding agent

Read these files in order:

1. [Root agent rules](../../AGENTS.md) — required behaviour for every coding agent.
2. [Project context](PROJECT-CONTEXT.md) — what TaskFlow is, what is known, what is undecided, and the current repository state.
3. [Root README](../../README.md) — public project overview.
4. [Documentation guide](../DOCUMENTATION-GUIDE.md) — writing standards.
5. The relevant implementation guide and theory lesson for the task.

Do not assume the old conversation is available. The repository is the handoff.

## Where each guide belongs

| Folder | Put these explanations here |
|---|---|
| [architecture/](architecture/README.md) | Overall system design, component boundaries, request/data flows, and cross-cutting technical design. |
| [features/](features/README.md) | A user-visible feature from the user's action through business rules, APIs, and data changes. |
| [infrastructure/](infrastructure/README.md) | Local developer setup, dependencies/tooling, Docker, Compose, Linux, AWS, deployment, CI/CD, monitoring, Kubernetes, and Terraform. |
| [decisions/](decisions/README.md) | Important decisions, alternatives, reasons, consequences, and review conditions. |
| [debugging/](debugging/README.md) | Reusable guides for investigating a real error or operational problem. |
| [templates/](templates/README.md) | Standard formats for implementation guides and decision records. |

If one change touches several areas, write one main guide in the best-fitting folder and link supporting guides. Do not copy large explanations between files.

## Minimum content for an implementation guide

For every meaningful change, document:

- Why the change was needed and which user or engineering problem it solves.
- What was introduced: files, components, endpoints, data structures, dependencies, services, or configuration.
- The business logic: rules, conditions, permissions, calculations, state transitions, and exceptional cases that apply.
- How it works, step by step, from the user's action to the final result.
- Which exact code locations implement each important step.
- New concepts, explained in simple language with a real TaskFlow example.
- Important settings, environment variable names, commands, and flags, including where commands run and what they do.
- Security, privacy, data safety, failure cases, and debugging steps relevant to the change.
- Tests/checks actually executed and their results; list what has not been verified.
- Alternatives and trade-offs that matter.
- Links to relevant theory lessons. These links are learning support, never prerequisites.

Use [the implementation guide template](templates/implementation-guide-template.md). A meaningful change is not complete until its required guide is created or updated in the same change as the code.

## How much documentation is enough?

Explain every meaningful new concept and the complete path through the system, but do not write a book about every line of code.

Good documentation helps a reader answer: What problem does this solve? Why this approach? What happens when a user uses it? Which files control it? Where does the data go? What can fail? How do I verify or debug it?

For tiny formatting or typo-only changes, update the relevant existing guide only when its meaning is affected. For a new frontend interaction, backend rule, database change, or infrastructure concept, write or update the relevant guide.

## Current status and truthfulness

This folder defines the documentation process; it does not prove that an application feature exists. Check the code and current project context. Mark documents clearly as **Proposed**, **Implemented**, or **Verified** where that distinction matters. Never describe a proposal as working code. Never claim tests, commands, containers, deployments, or cloud resources were verified unless they were actually run and observed.

## Keeping this index current

When adding a guide, link it from the relevant folder README and update [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md) if the change affects shared project context. Update the root README or learning progress only when the overall project status changes.
