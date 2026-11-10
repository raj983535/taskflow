# Phase 1 — Six-Lesson Learning Plan

**Goal:** Understand the application architecture and the technologies TaskFlow will use without turning this into an exhaustive web-development course.

## Lesson map

| Lesson | Topic | Required understanding |
|---|---|---|
| 1.1 | Full-stack architecture and request lifecycle | Identify the browser, frontend, backend, API, database, and trace one request end to end |
| 1.2 | Browser, React, and TypeScript | Understand the browser's role, components, props, state, rendering, and basic types |
| 1.3 | Node.js and Express backend | Understand runtime vs framework, routes, middleware, validation, and error handling |
| 1.4 | HTTP, REST-style APIs, and JSON | Understand methods, headers, bodies, status codes, endpoint design, and request/response flow |
| 1.5 | PostgreSQL and data modeling | Understand tables, rows, keys, relationships, SQL CRUD, constraints, and the purpose of indexes |
| 1.6 | Identity, security, and quality basics | Understand authentication vs authorization, sessions/cookies, secrets, validation, migrations, and test levels |

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

Explain the lifecycle:

A signed-in user opens TaskFlow, creates a task, refreshes the browser, and later signs out.

Your explanation should identify:
- What the browser and frontend do.
- What HTTP request is sent and what the API endpoint represents.
- What Node.js and Express do.
- Where identity and task ownership are checked.
- What PostgreSQL stores and returns.
- How the response reaches the browser.
- Why the task remains after a refresh.
- What changes when the user signs out.

## Completion rule

You do not need to memorize every React hook, Express option, SQL feature, or security standard. You need to explain the normal flow, understand the core vocabulary, recognize the important security boundary, and complete the final exercise.

After this lesson sequence, move to Phase 2. Do not add more Phase 1 lessons unless a concrete TaskFlow requirement exposes a genuine gap.
