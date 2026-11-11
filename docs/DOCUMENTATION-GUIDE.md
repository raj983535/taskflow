# TaskFlow documentation guide

TaskFlow maintains two related kinds of documentation:

1. **Theory lessons** explain the general concepts and technologies.
2. **Implementation guides** explain how and why those concepts are used in the actual TaskFlow codebase.

Both tracks are maintained in parallel. Neither track is a prerequisite for the other.

## 1. Scope comes first

Read [Learning Scope](LEARNING-SCOPE.md) before expanding the theory course. It defines the fixed 30-lesson curriculum across Phases 1–11 and its depth limits.

The theory course should remain bounded. Do not create extra sub-lessons for every technical term. Teach the relevant depth in the planned lessons and learn additional details when a real implementation or debugging issue requires them.

## 2. Theory lesson structure

A standard theory lesson should:

1. **Start from the familiar:** connect the new topic to previously introduced knowledge.
2. **Explain the problem:** show why the concept or tool exists.
3. **Build a mental model:** define important terms in plain language and show how they relate.
4. **Show the complete flow:** use a diagram or ordered sequence from the first action to the result.
5. **Use a TaskFlow example:** explain the scenario and important commands/configuration.
6. **Explain boundaries:** distinguish concepts that are easy to confuse.
7. **Show failure investigation:** explain what status, log, metric, or configuration to inspect first.
8. **Connect to other phases:** explain what this topic builds on and what it enables.
9. **Checkpoint:** ask the learner to explain the flow or reason about a realistic situation.

Keep the lesson focused. A beginner should be able to explain the main purpose, follow the example, recognize important vocabulary, and identify the next useful check when something fails. Memorising every flag or specialist edge case is not required.

## 3. Beginner-friendly theory depth

- Define a technical word the first time it appears, then use it consistently.
- Do not introduce a command without saying where to run it, what it changes, and what success or failure looks like.
- Explain important flags and arguments.
- Keep examples connected to one TaskFlow scenario where practical.
- Prefer one complete workflow over a long list of unrelated commands.
- Use comparisons when two terms are easy to confuse.
- Label examples as illustrative when the real TaskFlow code, cloud resources, or deployment do not yet exist.

## 4. Implementation documentation is mandatory

Implementation guides explain the actual codebase and must be committed with the meaningful code change.

When a change introduces or materially changes any of the following, create or update a guide under [docs/implementation/](implementation/README.md):

- User-facing features or business rules.
- Frontend interactions, state, routing, or component patterns that matter to the feature.
- Backend endpoints, validation, authorization, service logic, or error handling.
- Database schemas, migrations, queries, or data lifecycle.
- Architecture boundaries, integrations, dependencies, or developer tooling.
- Security controls, configuration, secrets handling, or privacy behaviour.
- Docker, Compose, servers, AWS, deployment, CI/CD, monitoring, Kubernetes, or Terraform.
- Testing strategy or debugging techniques that materially affect the project.

Tiny formatting, typo, and local naming-only edits do not need a new standalone guide. Update an existing guide when the explanation becomes inaccurate. If a meaningful change spans multiple areas, write one main guide and link supporting documents rather than duplicating the same material.

## 5. What an implementation guide must teach

Use [the implementation guide template](implementation/templates/implementation-guide-template.md). A guide should answer:

1. **Why:** What user or engineering problem made the change necessary? Why now?
2. **What:** Which files, components, services, dependencies, APIs, data structures, or configuration changed?
3. **Business logic:** What rules, conditions, permissions, calculations, validations, or state transitions apply?
4. **How:** What happens from a user's action to the final result, step by step?
5. **Code map:** Where is each important part implemented and how do the parts connect?
6. **Concepts:** What new terminology means in plain English and why the concept is used here.
7. **Configuration:** What important settings, environment variable names, commands, and flags do.
8. **Security and failure:** What can go wrong, what is protected, and how should the reader investigate?
9. **Verification:** Which checks were actually run and what was the result?
10. **Trade-offs:** What alternatives mattered and why was this approach selected?
11. **Theory links:** Which lesson explains the broader concept? The lesson is optional support, not a coding gate.
12. **Next steps:** What remains limited, undecided, or deferred?

Explain important code rather than narrating every line. Use simple diagrams or sequence steps when they help a beginner understand how frontend, backend, database, and infrastructure fit together.

## 6. Accuracy and evidence

- Distinguish Proposed, Implemented, and Verified where the difference matters.
- A sample configuration or design is not proof of a running system.
- Do not claim a test, command, migration, container, deployment, or cloud resource was verified unless it was actually executed and observed.
- Separate observed facts from assumptions and possible causes.
- Explain security boundaries, least privilege, secrets, cost, and cleanup where relevant.
- Never include real credentials, tokens, cookies, private keys, or personal data.

## 7. Theory and coding run in parallel

The learner may begin implementation immediately and study the published theory lessons at their own pace. Agents must not wait for theory completion.

When an implementation introduces a concept the learner may not know:

- Explain that concept in the implementation guide.
- Show the exact TaskFlow files and flow that use it.
- Link to the relevant theory lesson for a broader explanation.
- Explain how to inspect and debug the actual implementation.

A reader may follow the code first, theory first, or alternate between them.

## 8. Repository and progress maintenance

- Root README is the public entry point.
- [docs/README.md](README.md) is the map for both documentation tracks.
- [docs/implementation/README.md](implementation/README.md) indexes practical implementation guides.
- [docs/implementation/PROJECT-CONTEXT.md](implementation/PROJECT-CONTEXT.md) is the concise handoff for new coding agents.
- [docs/learning-progress.md](learning-progress.md) tracks theory material and learning progress.
- [AGENTS.md](../AGENTS.md) is the canonical set of mandatory coding-agent instructions.

When repository layout, architecture, or project status changes, update the affected README and project context. Verify changed relative links before completing the work.

## 9. Definition of done

A meaningful implementation is not complete until its required code and explanation are both present. The final report must say what changed, what was tested, what was not tested, and what remains. Never present documentation quality as proof that the underlying code works.
