# Phase 4 — Docker Compose

**Two focused lessons.** Phase 3 taught how to build and operate one container at a time. This phase teaches how to describe and manage a whole local application made of multiple services.

TaskFlow is not one process. It has a frontend, an API, and a database. Docker Compose lets us define the services and resources they share in one YAML configuration, then operate the application stack with a small set of commands.

## Outcomes

By the end of Phase 4, you should be able to:

- Explain why multi-container applications benefit from a local orchestration tool.
- Distinguish a Compose project, service, container, network, and volume.
- Read and write a practical compose.yaml file.
- Understand service names, ports, networks, persistent volumes, and environment configuration.
- Explain depends_on, health checks, and the difference between started and ready.
- Validate a Compose file before starting services.
- Start, inspect, view logs, execute commands in, stop, and remove a stack safely.
- Understand rebuilds, project names, profiles, and safe cleanup.

## Lesson sequence

| Lesson | Topic | Main outcome |
|---|---|---|
| 4.1 | [Multi-service application](lesson-4.1-multi-service-application.md) | Understand Compose files, services, networks, volumes, environment, dependencies, and health checks |
| 4.2 | [Local Compose operations](lesson-4.2-local-compose-operations.md) | Operate and troubleshoot a Compose project safely using essential commands |

## TaskFlow connection

The planned local TaskFlow stack has three main services:

- **Web:** serves the built React frontend.
- **API:** runs the Node.js and Express backend.
- **Database:** runs PostgreSQL with persistent storage.

A browser runs outside the containers. Browser-side JavaScript cannot normally resolve a Docker-only service name such as api. The frontend needs a host-accessible API URL or a web-server/reverse-proxy route. We will make that routing choice when the real application structure is implemented.

Compose helps manage the services together. It does not replace application code, Dockerfiles, Docker images, or a production deployment platform.

## Practical boundary

- These lessons are theory-first. Do not install Docker Desktop or run a stack just to read the material.
- The examples are illustrative. TaskFlow source code and Dockerfiles have not been created yet.
- A Compose file must be validated against the actual Compose version and application configuration before use.
- Do not commit passwords, tokens, private keys, or production credentials.
- Sample database image tags and data directories are teaching examples. Final versions and storage paths must match the database version chosen for implementation.

## Phase 4 integrated checkpoint

After both lessons, explain:

1. What a Compose project and service are, and how a service relates to its container.
2. How the Compose file describes services, networks, volumes, ports, and environment.
3. Why services can reach each other by service name on the project network.
4. The difference between depends_on startup order and a health check that confirms readiness.
5. The difference between Compose's .env interpolation file and a service's env_file.
6. What docker compose config, up, ps, logs, exec, stop, and down do.
7. Why down -v is destructive and when it should not be used.
8. How you would investigate an API that cannot connect to PostgreSQL.

**Pass standard:** You can describe how Compose brings a multi-service local application together and choose safe commands to inspect and manage it. Learner validation is deferred until the later study pass.

## Completion

Both lesson documents and the integrated checkpoint are published in this directory. Learner assessment is tracked separately in [Learning Progress](../learning-progress.md). Published material is not automatically a passed learner checkpoint.

## Official references

- [Docker Compose overview](https://docs.docker.com/compose/)
- [Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Compose services reference](https://docs.docker.com/reference/compose-file/services/)
- [Compose startup order and health checks](https://docs.docker.com/compose/how-tos/startup-order/)
