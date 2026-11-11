# Documentation Guide

TaskFlow uses a bounded, project-focused learning sequence. The purpose of each document is to help the learner understand enough to build, deploy, debug, and explain TaskFlow.

## Scope comes first

Read [Learning Scope](LEARNING-SCOPE.md) before expanding a topic. It defines the target outcome, the fixed 30-lesson curriculum across Phases 1–11, the depth boundary, and when to stop studying a concept.

Do not create extra sub-lessons for every technical term. Group related concepts into the planned lesson and teach deeper details only when TaskFlow requires them.

## Standard lesson structure

1. **Start from the familiar:** state what the learner already knows from the previous phase and what new problem this lesson introduces.
2. **Explain the problem first:** show why the concept/tool exists before introducing its name.
3. **Build the mental model:** explain important terms in plain English on first use and show how they relate.
4. **Show the complete flow:** use one diagram or ordered sequence from the first action to the final result.
5. **Work through one TaskFlow example:** explain the scenario step by step, including what each important command or configuration field does.
6. **Explain the boundary:** distinguish concepts that are easy to confuse, such as image/container, route/firewall, build/deploy, backup/replica, or Kubernetes/Terraform.
7. **Show how to investigate failure:** explain which status, log, metric, or configuration to check first and what common results mean.
8. **Connect forward:** explain what the learner will use this concept for in the next phase.
9. **Checkpoint:** ask the learner to explain the flow and reason about one realistic situation.

Keep the lesson focused. A first-time learner should be able to explain the main purpose, follow the complete example, recognize the important vocabulary, and identify the next useful check when something fails. Do not require memorizing every flag or specialist edge case.

## Beginner-friendly depth rule

For every new concept from Phase 3 onward:

- Define a technical word the first time it appears, then use the correct term consistently.
- Do not introduce a command without saying where to run it, what it changes, and what success or failure looks like.
- Explain important flags and arguments instead of expecting the learner to infer their purpose.
- Keep one connected TaskFlow example through the lesson rather than presenting unrelated examples.
- Explain how the new concept connects to the previous phase and what it enables in the next phase.
- Prefer one complete, realistic workflow over a long list of unexplained commands.
- Use a short comparison table when two terms are easy to confuse.
- Label examples as illustrative when the real TaskFlow code, cloud resources, or deployment do not yet exist.

## Theory-first rules

- Explain commands before asking the learner to run them.
- During theory, commands are primarily examples; avoid unnecessary installations, system changes, and paid cloud resources.
- Clearly label proposed architecture, sample configuration, and illustrative contracts as designs, not implemented systems.
- Implementation code belongs in the repository only after the fixed theory roadmap is complete and the implementation plan is agreed.
- Verify current versions and official guidance before implementation.

## Accuracy, safety, and engineering judgment

- Distinguish simplified mental models from exact implementation details.
- Explain security boundaries, least privilege, secrets, cost, and cleanup where relevant.
- Never include real credentials, tokens, cookies, private keys, or personal data.
- Do not describe a system as tested, deployed, reliable, or production-ready without evidence.
- Explain the important trade-offs, but do not attempt to cover every possible architecture variation.

## Progress tracking

Use `docs/learning-progress.md` as the single source of truth. A lesson is complete when the learner can explain the main flow, use the essential terms, understand the relevant commands, and pass its checkpoint. Exhaustive memorization is not required.
