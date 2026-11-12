# 0002 — Stage 1 application foundation and tooling

> **Status:** Accepted  
> **Date:** 2026-11-12  
> **Decision owners:** TaskFlow Core Engineering

---

## Context and problem

[ADR 0001](0001-project-folder-structure.md) established the repository directory layout (`app/api`, `app/web`, `database/`, etc.), but deliberately left package management, build tooling, frontend bundler, configuration validation, and testing infrastructure open.

To implement Stage 1 (Application Foundation), concrete technical choices were required to:
1. Provide unified script management across frontend and backend.
2. Support modern TypeScript compilation.
3. Validate runtime configuration defensively.
4. Establish automated testing without exceeding the learner's hardware limits (~8 GB RAM on Windows 11).

---

## Requirements and constraints

- **Resource Efficiency:** The toolchain must stay fast and lightweight on an 8 GB RAM machine.
- **Strict Permission Gates:** Comply with `AGENTS.md` Rule 1 (minimize downloads, no unnecessary packages).
- **Type Safety:** Full TypeScript coverage across server and client.
- **Defensive Boundaries:** The backend API must be the authoritative boundary for security and configuration.
- **Clear Modularity:** Clean separation between browser code (`app/web`) and server code (`app/api`).

---

## Options considered

### Package Management & Workspace Architecture
- **Option A: Turborepo / Nx / Lerna:** Feature-rich monorepo tools.
  - *Costs and risks:* Excessive background daemons, heavy disk footprint, steep learning curve.
- **Option B: npm Workspaces (Selected):** Built into standard Node.js / npm.
  - *Benefits:* Zero additional dependencies, native workspace script delegation, lightweight memory footprint.

### Backend Framework & Validation
- **Option A: Fastify / NestJS:**
  - *Costs and risks:* NestJS is heavily abstracted and memory-intensive; Fastify differs from the agreed Express learning curriculum.
- **Option B: Node.js + Express + Zod (Selected):**
  - *Benefits:* Matches Phase 1 theory curriculum, widely understood, and Zod provides robust runtime parsing for environment variables and request bodies.

### Frontend Tooling
- **Option A: Next.js:** Full-stack framework.
  - *Costs and risks:* Blurs the client/server boundary, violates the agreed React + Express separation.
- **Option B: React 19 + Vite 6 (Selected):**
  - *Benefits:* Pure client-side SPA, instant HMR, built-in development server proxy (`server.proxy`).

### Automated Testing
- **Option A: Jest / Vitest:**
  - *Costs and risks:* Large dependency trees (hundreds of transitive packages), slower startup on low-memory hardware.
- **Option B: Native `node:test` with `tsx` (Selected):**
  - *Benefits:* Built directly into Node.js 20+, zero external test packages, executes 18 tests in under 500ms.

---

## Decision

1. Use **npm workspaces** configured in root `package.json` with targets `["app/api", "app/web"]`.
2. Require **Node.js >= 20.0.0** and **npm >= 10.0.0**.
3. Implement the backend API using **Node.js, Express 4.21.x, TypeScript 5.7, and Zod 3.24**.
4. Implement the frontend using **React 19, TypeScript 5.7, and Vite 6**.
5. Validate environment configuration with **Zod**, enforcing integer TCP port bounds (1–65535) and clean origin syntax for `FRONTEND_ORIGIN`.
6. Use **Node.js native test runner (`node:test`, `node:assert`)** executed via `tsx --test` for automated verification.

---

## Reasons

This foundation balances high engineering rigor with minimal resource consumption:
- Native features (npm workspaces, `node:test`) were chosen over heavy external platforms, strictly adhering to the "lean toolchain" mandate in `AGENTS.md`.
- Express and React SPA preserve clean architectural separation between browser and server.
- Zod prevents invalid configurations (e.g. malformed ports or insecure origins) from starting the server.

---

## Consequences

- **Positive:** Fast development startup (<1s), instantaneous type checking, zero test dependency overhead, clean separation of concerns.
- **Operational Responsibility:** Vite development proxy is explicitly limited to development; production routing must be established at the deployment stage.
- **TypeScript Convention:** NodeNext module resolution requires explicit `.js` extensions in local relative imports within TypeScript source files.

---

## Revisit when

- Stage 2: When selecting the PostgreSQL driver/access library (`pg` vs lightweight ORM) and SQL migration runner.
- Stage 5: When containerizing the services with Docker and Docker Compose.

---

## Related material

- [ADR 0001: Project Folder Structure](0001-project-folder-structure.md)
- [Stage 1 Implementation Guide](../architecture/01-workspace-and-application-foundation.md)
- [Phase 1 Theory: Full-Stack Architecture](../../01-application/lesson-1.1-full-stack-architecture.md)
