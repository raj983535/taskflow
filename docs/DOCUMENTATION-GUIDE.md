# Documentation Guide

TaskFlow uses a bounded, project-focused learning sequence. The purpose of each document is to help the learner understand enough to build, deploy, debug, and explain TaskFlow.

## Scope comes first

Read [Learning Scope](LEARNING-SCOPE.md) before expanding a topic. It defines the target outcome, the fixed 30-lesson curriculum across Phases 1–11, the depth boundary, and when to stop studying a concept.

Do not create extra sub-lessons for every technical term. Group related concepts into the planned lesson and teach deeper details only when TaskFlow requires them.

## Standard lesson structure

1. What problem this solves.
2. The plain-language mental model.
3. Important terms and how they relate.
4. One useful diagram or flow.
5. How TaskFlow will use it.
6. Essential commands/configuration, with important arguments explained.
7. Common errors, security/cost implications, and practical trade-offs.
8. A short exercise and checkpoint.

Keep the lesson focused. The learner should finish knowing what the technology is for, how it fits into the system, and how to use or discuss the project-relevant parts.

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
