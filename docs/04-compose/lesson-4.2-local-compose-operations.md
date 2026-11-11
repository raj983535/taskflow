# Lesson 4.2 — Local Compose Operations

**Phase:** 4 — Docker Compose  
**Goal:** Understand how to validate, start, inspect, troubleshoot, stop, and clean up a multi-service application managed by Compose.

Lesson 4.1 explained the Compose file. This lesson explains how to operate the project described by that file.

## 1. The Compose command

Compose uses a command group:

    docker compose

Notice the space between docker and compose. This is the modern Docker Compose CLI plugin syntax. Older tutorials may show a separate docker-compose command; for this roadmap, use docker compose.

Compose reads the project configuration, normally from a compose.yaml file in the current directory.

## 2. Validate before starting

Before creating containers, ask Compose to parse and render the configuration:

    docker compose config

This checks the Compose file structure and resolves variable interpolation. It is a useful early check for YAML indentation, invalid fields, and missing variable values.

It does not prove that:

- The application code builds.
- The database can accept connections.
- The supplied credentials are correct.
- Every service will become healthy.
- The application works correctly.

The rendered output may include interpolated environment values. Do not paste it into public issue reports if it contains real secrets.

For configuration using variables, required interpolation can provide a clear error if a value has not been supplied:

    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?Set POSTGRES_PASSWORD before starting}

## 3. Start the whole project

The main command:

    docker compose up

Compose reads the file, builds or pulls required images, creates required resources, and starts the services.

The command usually attaches to the services' output in the terminal. You can stop attached output with Ctrl+C; the services are stopped as part of the attached run.

For background operation:

    docker compose up -d

The -d option means detached mode. Services run in the background and PowerShell returns to the prompt.

If you changed a Dockerfile or application files that are part of an image build, you may want:

    docker compose up --build -d

The --build option asks Compose to build images before starting the services. Without a need to rebuild, the ordinary up -d command is sufficient.

## 4. Check the project and service status

See services in the Compose project:

    docker compose ps

See all services including ones that have exited:

    docker compose ps -a

The output helps answer:

- Which services are running?
- Which container has exited?
- Which ports are published?
- Is a health check reporting healthy or unhealthy?

Compare this with the Phase 3 command docker ps. The Docker command can list containers across the host. Compose commands focus on the current Compose project.

## 5. Read logs

If the API is not working, check its logs:

    docker compose logs api

Follow the logs as new messages appear:

    docker compose logs -f api

See logs from all services:

    docker compose logs

You can also limit the output to recent lines:

    docker compose logs --tail 100 api

- logs reads service container output.
- -f follows new output.
- --tail 100 shows the latest 100 lines.
- api selects the service whose logs you want.

Logs are often the first place to investigate a failed startup, missing environment variable, refused database connection, or application exception. Never expose passwords, tokens, or session data in logs.

## 6. Execute a command inside a service

To open a shell in the running API service:

    docker compose exec api sh

This is similar to docker exec, but Compose selects the container belonging to the api service in the current project.

Run a one-off command:

    docker compose exec api node --version

The service container must be running for exec to work. Minimal production images may not include a shell or debugging utilities.

For a one-time task in a service context, Compose also has run:

    docker compose run --rm api npm test

This creates a one-off container using the service configuration, runs the command, and removes that one-off container after it exits because of --rm. It is different from exec, which runs a command inside an existing container.

## 7. Stop, start, restart, and down

These commands have different effects.

**Stop services but keep their containers:**

    docker compose stop

**Start existing stopped services:**

    docker compose start

**Restart services:**

    docker compose restart

**Stop and remove the containers and project network:**

    docker compose down

A named volume is normally kept when you run docker compose down. This means persistent database data can remain available when the containers are recreated.

Do not assume every resource is removed by down. Named volumes and images generally have their own lifecycle.

## 8. The dangerous cleanup option: down -v

You may see:

    docker compose down -v

The -v option also removes named volumes declared by the Compose project and anonymous volumes attached to its containers.

If PostgreSQL data is stored in the Compose named volume, removing that volume can delete your local database data.

Use this only when you deliberately want to discard the data and have confirmed that it is not needed.

A safe rule:

- docker compose down: remove containers and project network; retain named volumes.
- docker compose down -v: also remove project volumes; potentially destructive to database data.

Do not use down -v as a routine way to restart an application.

## 9. Build, pull, and inspect service images

Build or rebuild images defined by services:

    docker compose build

Build a specific service:

    docker compose build api

Pull service images that are available from registries:

    docker compose pull

Show the service names and image references after configuration is resolved:

    docker compose config --services
    docker compose config --images

- build builds images from configured build contexts.
- pull downloads referenced images from registries.
- config --services lists configured service names.
- config --images lists image references used by the configuration.

Building does not necessarily start a container. Pulling does not mean a service is running.

## 10. Project names and running more than one copy

Compose groups resources into a project. The project name is normally based on the directory name, but you can set one explicitly:

    docker compose -p taskflow-dev up -d

Here -p sets the project name to taskflow-dev.

Project names help separate resources when you run multiple Compose projects on one Docker host.

For example, you might have a development stack and a separate test stack. Be careful with ports and shared external resources so the projects do not conflict or accidentally connect to each other's data.

## 11. Profiles: optional services

Sometimes a project contains a tool that should not run all the time, such as a database viewer or a debugging service.

Compose profiles allow optional services to be enabled only when requested.

Simplified example:

    services:
      api:
        build: ./backend

      db:
        image: postgres:17-alpine

      adminer:
        image: adminer
        profiles:
          - debug
        ports:
          - "127.0.0.1:8080:8080"

The adminer service is associated with the debug profile. Start the usual services:

    docker compose up -d

Start the debug profile as well:

    docker compose --profile debug up -d

Profiles help keep optional tools out of the default development stack. They are not a replacement for security controls. A debugging interface should still be restricted appropriately.

Official explanation: https://docs.docker.com/compose/how-tos/profiles/

## 12. A systematic troubleshooting flow

Suppose the browser can load the frontend but the API cannot read from PostgreSQL.

Use evidence rather than guessing.

1. **Check the service state.**

       docker compose ps -a

2. **Read the API and database logs.**

       docker compose logs --tail 100 api
       docker compose logs --tail 100 db

3. **Confirm the resolved configuration.**

       docker compose config

   Be careful: this output can reveal interpolated secrets.

4. **Check network and service names.**

   Does the API use the database service name, such as db, rather than localhost? Are both services on a network they share?

5. **Check credentials and database settings.**

   Confirm the API and database have compatible database name, username, password, and port settings. Do not print secrets into a shared report.

6. **Check readiness.**

   Is the database healthy? Is the health check appropriate for the database version and configuration?

7. **Check data storage.**

   Is the expected named volume mounted? Did someone accidentally recreate the project with a new project name or remove the old volume?

8. **Make one targeted correction and re-check.**

   Avoid changing ports, credentials, networks, and volumes all at once. Change one likely cause, then inspect logs and status again.

## 13. A practical local workflow for TaskFlow

When TaskFlow's source code and Compose configuration exist, the normal developer cycle may look like:

    # Validate configuration
    docker compose config

    # Build images and start all services in the background
    docker compose up --build -d

    # Check service status
    docker compose ps

    # Read API logs
    docker compose logs -f api

    # Open a shell in the API service if needed
    docker compose exec api sh

    # Stop and remove containers/network when finished
    docker compose down

The final command normally keeps named volumes. Do not append -v unless the database data is intentionally being discarded.

## 14. Common mistakes

- **Running Compose from the wrong directory:** Compose may not find the intended configuration file. Change to the project directory or use -f to specify the file.
- **Confusing up and start:** up creates or reconciles services from the configuration; start starts existing stopped containers.
- **Assuming up proves application readiness:** inspect service health and application logs.
- **Using exec on a stopped service:** exec needs a running container.
- **Using down -v casually:** this can delete named database volumes.
- **Forgetting to rebuild:** changing source files copied into an image does not always change an already-created container's image. Rebuild when the image contents need to change.
- **Confusing pull and build:** pull downloads an existing image; build creates an image from a build context.
- **Sharing docker compose config output:** it may include real interpolated configuration values.

## 15. Command reference

| Command | Purpose |
|---|---|
| docker compose config | Validate and render the resolved configuration |
| docker compose up | Create/reconcile and start services |
| docker compose up -d | Start services in the background |
| docker compose up --build -d | Build images, then start services in the background |
| docker compose ps -a | List project containers, including stopped ones |
| docker compose logs -f api | Follow API service logs |
| docker compose exec api sh | Run a shell in the running API container |
| docker compose run --rm api COMMAND | Run a one-off container for a service command, then remove it |
| docker compose build | Build service images |
| docker compose pull | Pull configured images from registries |
| docker compose stop | Stop services without removing containers |
| docker compose start | Start existing stopped containers |
| docker compose restart | Restart services |
| docker compose down | Stop/remove project containers and network; normally preserve named volumes |
| docker compose down -v | Also remove project volumes; can delete database data |
| docker compose --profile debug up -d | Start services with the selected optional profile |
| docker compose -p taskflow-dev up -d | Run the stack with an explicit project name |

## 16. Knowledge checkpoint

1. What does docker compose config do, and what does it not prove?
2. What is the difference between docker compose up and docker compose start?
3. What does -d change?
4. How do docker compose ps, logs, and exec help you investigate a problem?
5. What is the difference between docker compose run and docker compose exec?
6. What is the difference between docker compose down and docker compose down -v?
7. When would you use build rather than pull?
8. What does a Compose project name help separate?
9. What is a profile useful for?
10. Explain a safe sequence for investigating an API-to-database connection failure.

**Completion rule:** You should be able to choose the right Compose command for validation, startup, inspection, troubleshooting, and cleanup, while protecting persistent data.

## Official references

- [Docker Compose CLI reference](https://docs.docker.com/reference/cli/docker/compose/)
- [docker compose up](https://docs.docker.com/reference/cli/docker/compose/up/)
- [docker compose down](https://docs.docker.com/reference/cli/docker/compose/down/)
- [docker compose logs](https://docs.docker.com/reference/cli/docker/compose/logs/)
- [docker compose exec](https://docs.docker.com/reference/cli/docker/compose/exec/)
- [Compose profiles](https://docs.docker.com/compose/how-tos/profiles/)
- [Compose startup order and health checks](https://docs.docker.com/compose/how-tos/startup-order/)
