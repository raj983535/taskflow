# TaskFlow architecture and engineering decisions

Use this folder for meaningful choices that affect how TaskFlow is organized, built, secured, or operated.

---

## Accepted Architecture Decisions

- **[0001 — Project folder structure](0001-project-folder-structure.md)**: Establishes the repository's directory layout (`app/api`, `app/web`, `app/shared`, `database/`, `infrastructure/`, `tests/`, `scripts/`, `docs/`).
- **[0002 — Stage 1 application foundation and tooling](0002-stage-1-application-foundation.md)**: Establishes npm workspaces, Node.js (>=20), Express 4.21, React 19, Vite 6, TypeScript 5.7, Zod environment validation, and Node.js built-in `node:test` runner.

---

## When to create a decision record

Create one when a choice meaningfully affects architecture, security, cost, maintainability, developer experience, or future changes.

Each record should include:
- Status: Proposed, Accepted, Superseded, or Rejected.
- Date and context.
- The problem and requirements.
- Options considered.
- Selected option and reasons.
- Trade-offs and consequences.
- Conditions for revisiting the choice.
- Related implementation and theory guides.

Use [the decision record template](../templates/decision-record-template.md).
