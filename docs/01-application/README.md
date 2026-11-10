# Phase 1 — Full-Stack Application Fundamentals

**Six focused lessons.** The goal is to understand the moving parts of a web application well enough to design and explain TaskFlow before implementation.

This is not an exhaustive web-development course. We cover the project-relevant behavior of the browser, React, TypeScript, Node.js, Express, HTTP APIs, PostgreSQL, authentication, and basic quality practices.

## The proposed stack

| Layer | Technology | What you need to understand |
|---|---|---|
| User interface | Browser + React | Rendering, components, state, and user interaction |
| Types | TypeScript | Basic static typing and why it helps |
| Server runtime | Node.js | Running JavaScript outside the browser |
| Backend framework | Express | Routes, middleware, request handling, and errors |
| Communication | HTTP, REST-style API, JSON | How the frontend and backend exchange data |
| Database | PostgreSQL + SQL | Tables, relationships, queries, constraints, and indexes |
| Identity | Sessions/cookies and authorization | Recognizing users and protecting their data |
| Quality | Validation, migrations, tests | Preventing bad input and checking changes |

These are proposed technology choices, not installed services or a completed application.

## Six-lesson sequence

Start with [Lesson 1.1 — Full-stack architecture and request lifecycle](lesson-1.1-full-stack-architecture.md), then continue to [Lesson 1.2 — Browser, React, and TypeScript](lesson-1.2-browser-react-typescript.md) and [Lesson 1.3 — Node.js and the Express Backend](lesson-1.3-nodejs-express-backend.md). The general [architecture reference](architecture.md) complements Lesson 1.1.

| Lesson | Topic |
|---|---|
| 1.1 | Full-stack architecture and request lifecycle |
| 1.2 | [Browser, React, and TypeScript](lesson-1.2-browser-react-typescript.md) |
| 1.3 | [Node.js and Express backend](lesson-1.3-nodejs-express-backend.md) |
| 1.4 | HTTP, REST-style APIs, and JSON |
| 1.5 | PostgreSQL and data modeling |
| 1.6 | Identity, security, and quality basics |

## Reference notes

- [Architecture](architecture.md)
- [Illustrative API contract](api-reference.md)
- [Database design](database-design.md)
- [Authentication and security](authentication-and-security.md)
- [Toolchain and commands](toolchain-and-commands.md)
- [Migrations and testing](migrations-and-testing.md)
- [Phase 1 lesson plan](phase-1-learning-plan.md)

## The end-to-end mental model

```text
User
  |
  v
Browser and React frontend
  |  HTTP request / JSON response
  v
Node.js and Express backend
  |  SQL query / result
  v
PostgreSQL database
```

The backend is responsible for enforcing business rules and access permissions. The browser is controlled by the user and is not a trusted security boundary.

## What is deliberately out of scope

We will not study browser-engine internals, React reconciliation internals, Node.js event-loop internals in depth, database query-planner internals, every API style, or advanced identity-provider design. We will learn the relevant operational mental model and return to deeper details only if TaskFlow requires them.

## Completion

Phase 1 ends after the six lessons and one end-to-end TaskFlow walkthrough. We then move to Phase 2, not into an open-ended collection of extra web-development topics.
