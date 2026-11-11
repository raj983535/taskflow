# TaskFlow implementation architecture

This folder describes the intended system boundaries and, later, the architecture that exists in code. Always label proposed and implemented designs separately.

## Current structure decision

- [Project directory layout](../decisions/0001-project-folder-structure.md) — accepted folder responsibilities for the web app, API, shared contracts, database, infrastructure, CI/CD, and tests.

## What belongs here

- System context and component diagrams.
- Frontend, backend and database responsibilities.
- Request and data flows across application boundaries.
- Module and folder responsibilities.
- API and integration boundaries.
- Authentication, authorization, configuration, logging and error-handling architecture.

## Technology direction

React + TypeScript is the frontend direction. Node.js + Express + TypeScript is the backend direction. PostgreSQL is the database direction. AWS is the later cloud path.

Supporting libraries and runtime architecture remain to be decided when implementation is approved. The current repository has folder placeholders only; no application runtime is implemented.
