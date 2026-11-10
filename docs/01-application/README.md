# Phase 1 — Full-Stack Application Fundamentals

**Purpose:** Understand how a modern web application works before writing TaskFlow's application code.

This phase is theory and system design only. The actual frontend, backend, database setup, and deployment will be built after all learning phases are complete.

## What we are learning

The proposed TaskFlow learning stack is:

| Layer / concept | Technology or subject | What we need to understand |
|---|---|---|
| User interface | Browser, HTML, CSS, JavaScript | How a browser renders a page and handles user interaction |
| Frontend framework | React | Components, state, props, rendering, and frontend structure |
| Types | TypeScript | Static types and how they help catch mistakes |
| Runtime | Node.js | How JavaScript can run outside the browser |
| Backend framework | Express | Routing, middleware, request handling, and server structure |
| Communication | HTTP, REST-style APIs, JSON | How frontend and backend exchange requests and responses |
| Database | PostgreSQL and SQL | How persistent, relational data is organized and queried |
| Identity | Authentication and authorization | How a user proves identity and what that user is allowed to do |
| Quality | Testing, validation, migrations | How we check behavior and safely evolve an application |

These are study choices and a proposed design, not installed dependencies or a completed application.

## Lesson sequence

1. [Architecture and request lifecycle](architecture.md)
2. Browser, frontend, React, and TypeScript
3. Node.js runtime, backend responsibilities, and Express
4. HTTP, REST-style APIs, JSON, and status codes using the [proposed API contract](api-reference.md)
5. Relational database concepts, SQL, and the [proposed data model](database-design.md)
6. [Authentication, authorization, and security concepts](authentication-and-security.md)
7. [Development toolchain and commands](toolchain-and-commands.md)
8. [Migrations, testing, and quality checks](migrations-and-testing.md)
9. Connect the complete design using the [Phase 1 theory plan](phase-1-learning-plan.md)

## The big picture

```text
Person
  |
  v
Browser / Frontend
  |  HTTP request and response (often JSON)
  v
Backend application
  |  SQL query
  v
Relational database
```

The backend is the trusted application boundary. The browser is controlled by the user and must never be trusted to enforce permissions or protect secrets.

## What Phase 1 does not ask you to do yet

- Do not create the React application or Express server.
- Do not install npm packages or configure a local database.
- Do not run migrations or start development servers.
- Do not deploy anything.

We will understand the purpose and meaning of these tools and commands first. Implementation comes after the full theory roadmap.

## Phase 1 theory checkpoint

The phase is ready to be considered understood only when the learner can describe the complete request lifecycle, explain each technology's role, understand the proposed database and API design, and complete the exercises in [the learning plan](phase-1-learning-plan.md).
