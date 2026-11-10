# Phase 1 — Six-Lesson Learning Plan

**Goal:** Understand the application architecture and the technologies TaskFlow will use without turning this into an exhaustive web-development course.

## Lesson map

| Lesson | Topic | Required understanding |
|---|---|---|
| 1.1 | [Full-stack architecture and request lifecycle](lesson-1.1-full-stack-architecture.md) | Identify the browser, frontend, backend, API, database, and trace one request end to end |
| 1.2 | [Browser, React, and TypeScript](lesson-1.2-browser-react-typescript.md) | Understand the browser's role, components, props, state, rendering, and basic types |
| 1.3 | [Node.js and Express backend](lesson-1.3-nodejs-express-backend.md) | Understand runtime vs framework, routes, middleware, validation, and error handling |
| 1.4 | [HTTP, REST-style APIs, and JSON](lesson-1.4-http-rest-apis-json.md) | Understand methods, headers, bodies, status codes, endpoint design, and request/response flow |
| 1.5 | [PostgreSQL and data modeling](lesson-1.5-postgresql-data-modeling.md) | Understand tables, rows, keys, relationships, SQL CRUD, constraints, and the purpose of indexes |
| 1.6 | [Identity, security, and quality basics](lesson-1.6-identity-security-quality.md) | Understand authentication vs authorization, sessions/cookies, secrets, validation, migrations, and test levels |

## Standard format for each lesson

- Explain the purpose and mental model in plain English.
- Introduce the essential technical terms.
- Show one diagram or request/data flow if it adds clarity.
- Connect the subject to TaskFlow.
- Explain only the commands and configuration we are likely to use.
- Cover common mistakes and the practical trade-offs.
- Finish with a small exercise and a short checkpoint.

No extra lesson is created for every term. Advanced internals are deferred unless they become necessary for a real implementation or debugging problem.

## Final Phase 1 exercise

Complete the end-to-end walkthrough and knowledge checkpoint in [Lesson 1.6 — Identity, security, and quality basics](lesson-1.6-identity-security-quality.md). It brings together the browser, frontend, HTTP API, backend, PostgreSQL, identity, authorization, and test coverage in one TaskFlow lifecycle.

## Completion rule

You do not need to memorize every React hook, Express option, SQL feature, or security standard. You need to explain the normal flow, understand the core vocabulary, recognize the important security boundary, and complete the final exercise.

After this lesson sequence, move to Phase 2. Do not add more Phase 1 lessons unless a concrete TaskFlow requirement exposes a genuine gap.
