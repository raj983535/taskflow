# TaskFlow implementation architecture

This folder explains the architecture that actually exists in the codebase. Keep proposed designs clearly separate from implemented and verified designs.

## What belongs here

- System context and component diagrams.
- Frontend, backend, and database responsibilities.
- Request and data flows across application boundaries.
- Module and folder responsibilities.
- API and integration boundaries.
- Cross-cutting topics such as authentication, authorization, configuration, logging, and error handling.

## Current baseline

The intended technology direction is React + TypeScript for the frontend, Node.js + Express + TypeScript for the backend, PostgreSQL for persistence, and AWS as the later primary cloud path.

The detailed architecture and implementation choices are not yet locked. See [Project Context](../PROJECT-CONTEXT.md). Do not treat a proposed diagram as a deployed or implemented system.

## When adding an architecture guide

Explain the problem the design solves, the responsibilities of each component, the direction of requests and data, key trust/security boundaries, important trade-offs, and how to verify or debug the flow. Link to feature guides and relevant theory lessons.

Update this index when a new architecture document is added.
