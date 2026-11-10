# Phase 1 — Theory Learning Plan

**Goal:** Be able to explain a complete web application before building one.

## Learning objectives

By the end of Phase 1, the learner should be able to:
- Describe the role of the browser and frontend.
- Explain React and TypeScript at a conceptual level.
- Explain Node.js as a runtime and Express as a backend framework.
- Describe how an HTTP API connects frontend and backend.
- Understand JSON, methods, headers, status codes, and request/response bodies.
- Explain relational tables, keys, constraints, SQL, and PostgreSQL.
- Distinguish authentication, authorization, cookies, sessions, and token-based approaches.
- Explain the purpose of packages, environment variables, migrations, and different test levels.
- Trace a user's action through the full request lifecycle.

## Lesson order

| Lesson | Focus | Main question |
|---|---|---|
| 1.1 | Full-stack architecture | What are all the parts of a web application, and how do they communicate? |
| 1.2 | Browser and frontend | What happens inside the browser, and what does React help us organize? |
| 1.3 | JavaScript runtime and backend | Why is Node.js needed, and what does Express add? |
| 1.4 | HTTP and APIs | How does one part of the system request work from another? |
| 1.5 | SQL and PostgreSQL | How is application data stored, related, and retrieved? |
| 1.6 | Authentication and security | How does the system recognize users and protect their data? |
| 1.7 | Development toolchain | What are Node, npm, packages, scripts, environment variables, and command-line tools? |
| 1.8 | Migrations and testing | How do teams safely change a database and check software behavior? |
| 1.9 | System walkthrough | Can we explain TaskFlow end to end without relying on code? |

## How each lesson will be taught

Each lesson will include:
1. A plain-language explanation.
2. The technical terms and their relationships.
3. A diagram or request/data flow.
4. A TaskFlow example.
5. A real-world example from software teams.
6. Relevant commands and every important argument explained.
7. Common misconceptions and troubleshooting.
8. A small exercise and review questions.

Theory lessons do not require installing tools or writing application code. Some commands will be explained as preparation for the practical stage.

## Phase 1 final exercise

Explain this scenario step by step:

A signed-in user opens TaskFlow, creates a task, refreshes the browser, and later signs out.

In the explanation, identify:
- What the browser and frontend do.
- What request is sent and what an API endpoint means.
- What Node.js and Express are responsible for.
- Where authentication and authorization are checked.
- What PostgreSQL stores and returns.
- How the response reaches the frontend.
- Why the task remains after a browser refresh.
- What changes when the user signs out.

## Completion rule

Phase 1 is complete only after the concepts and final exercise are understood. Completing Phase 1 does not begin application implementation. The remaining roadmap phases are still studied theoretically first. The application is built after the final theory phase and after the overall implementation blueprint is reviewed.
