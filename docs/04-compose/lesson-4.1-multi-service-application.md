# Lesson 4.1 — Multi-service Application

**Phase:** 4 — Docker Compose  
**Goal:** Understand how one configuration describes multiple containers that together make up an application.

## Start here: move from one container to a complete application

In Phase 3, you learned to build one image and run one container. A real application usually needs more than one component. TaskFlow has a web frontend, an API, and a database. Each component has its own image, settings, ports, and storage needs.

You could start each one with a long docker run command, but then you would have to remember how they connect every time. Docker Compose gives you one project description that brings the related services and shared resources together.

Keep this relationship clear:

- A **service** is the named configuration for a component, such as api or db.
- A **container** is the actual runtime instance created for that service.
- A **project** is the group of services Compose manages together.
- A **network** lets the containers communicate.
- A **volume** keeps important data outside a replaceable container.

A Compose file does not contain your whole application. It describes how the already-built application components should be created and connected.


## 1. Why do we need Docker Compose?

In Phase 3, you learned how to build and run a container.

Imagine TaskFlow has three parts:

- A frontend website.
- A backend API.
- A PostgreSQL database.

You could start each container separately using multiple docker run commands. But then you must remember all of their settings:

- Which image or Dockerfile does each use?
- Which ports must be published?
- Which network connects them?
- Which database volume must be mounted?
- Which environment variables are required?
- Which service depends on another?
- How do you start and stop the whole application together?

This becomes difficult to repeat and easy to misconfigure.

**Docker Compose** is a tool for defining and running multi-container applications. You describe the application's services and resources in a Compose file, then use Compose commands to operate the group. See the official overview: https://docs.docker.com/compose/

Think of it as one instruction sheet for the local application stack.

## 2. Understand the vocabulary

| Term | Simple meaning |
|---|---|
| Compose project | The application stack managed together by Compose |
| Service | A named component described in the Compose file, such as api or db |
| Container | The actual runtime instance created for a service |
| Image | The package used to create a container |
| Network | The connection that lets containers communicate |
| Volume | Storage that can live independently of a container |
| Compose file | The YAML configuration that describes the stack |

A **service is not the same as a container**. A service is the desired configuration for an application component. Compose creates one or more containers to run that service.

    TaskFlow Compose project
       |
       +---- web service ---- web container
       |
       +---- api service ---- API container
       |
       +---- db service ----- PostgreSQL container
       |
       +---- project network
       |
       +---- database volume

The project groups the services and the resources they use.

## 3. What is a Compose file?

A Compose file is usually named compose.yaml. It is written in **YAML**, a human-readable format for structured configuration.

YAML uses indentation to show which settings belong inside other settings. Spaces matter. Use consistent spaces, not tabs, when writing YAML.

A simplified example:

    services:
      api:
        image: taskflow-api:dev
        ports:
          - "127.0.0.1:3000:3000"

      db:
        image: postgres:17-alpine

This says the project has two services: api and db.

The top-level services section is where application services are defined. The service names become useful network names for container-to-container communication.

Modern Compose uses the Compose Specification. Older tutorials often start with a top-level version field. That field is now obsolete in the current specification and should normally be omitted from a new Compose file. Reference: https://docs.docker.com/reference/compose-file/

## 4. A TaskFlow-shaped example

The following is a teaching example for an API and a database. The current TaskFlow repository is documentation-only, so these paths and configuration values are not real application files and have not been executed.

    services:
      api:
        build: ./backend
        ports:
          - "127.0.0.1:3000:3000"
        environment:
          DATABASE_HOST: db
          DATABASE_PORT: "5432"
          DATABASE_NAME: taskflow
          DATABASE_USER: taskflow
          DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
        depends_on:
          db:
            condition: service_healthy

      db:
        image: postgres:17-alpine
        environment:
          POSTGRES_DB: taskflow
          POSTGRES_USER: taskflow
          POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
        volumes:
          - db-data:/var/lib/postgresql/data
        healthcheck:
          test: ["CMD-SHELL", "pg_isready -U \"$${POSTGRES_USER}\" -d \"$${POSTGRES_DB}\""]
          interval: 5s
          timeout: 3s
          retries: 10
          start_period: 10s

    volumes:
      db-data:

This example demonstrates the main pieces:

- api is built from a backend folder that must contain a suitable Dockerfile.
- db is created from a PostgreSQL image.
- ports publishes the API port on the local computer.
- environment supplies configuration to the containers.
- depends_on describes an API dependency on the database.
- healthcheck tests whether PostgreSQL is ready.
- db-data is a named volume for database persistence.

The example uses PostgreSQL 17's familiar data directory for teaching purposes. Do not copy a database data-directory path blindly across major versions. Verify the official image documentation for the exact version selected during implementation.

The password variable is illustrative. A real setup needs a local secret/configuration approach, a suitable ignored local file or secret store, and a deliberate production secret strategy.

## 5. Understand the top-level sections

### services

Defines what application components should run.

    services:
      api:
        build: ./backend

      db:
        image: postgres:17-alpine

Here api and db are service names. build tells Compose to build an image from a directory containing a Dockerfile. image tells Compose which existing image to use or tag.

A service can use build, image, or both for different purposes. The exact behavior depends on the configuration.

### volumes

Defines named storage resources used by services.

    volumes:
      db-data:

The service mounts it:

    services:
      db:
        volumes:
          - db-data:/var/lib/postgresql/data

The left side is the named volume. The right side is the directory inside the container where the data is stored.

### networks

Defines virtual networks used to connect services.

    services:
      api:
        networks:
          - app-network

      db:
        networks:
          - app-network

    networks:
      app-network:

When no custom network is declared, Compose normally creates a default project network and attaches the services to it. Explicit networks are useful when you need separate communication groups or clearer network boundaries.

## 6. How services find each other

This connects to DNS and networking from Phase 0 and Docker networks from Phase 3.

Inside the Compose project network, a service can normally be reached by its service name.

In the example:

    DATABASE_HOST: db
    DATABASE_PORT: "5432"

The API uses db as the hostname for PostgreSQL because db is the database service name.

Do not use localhost for the database hostname from inside the API container. Inside a container, localhost refers to that same container, not the other database container.

The database's port 5432 is used for container-to-container communication. It does not need to be published to the Windows host for the API container to connect to it.

## 7. Understand ports in a Compose file

Example:

    ports:
      - "127.0.0.1:3000:3000"

The structure is:

    HOST_ADDRESS:HOST_PORT:CONTAINER_PORT

- Host address: where the host exposes the port.
- Host port: port on your computer.
- Container port: port inside the service container.

A browser on the same computer can access the API at http://127.0.0.1:3000, assuming the API listens on the correct container interface and port.

A database service does not need a published port simply because the API connects to it. Publish only the ports that need host access.

Important frontend distinction: React code runs in the user's browser. The browser cannot resolve the Compose-only hostname api unless some host-level DNS or proxy arrangement makes it available. A browser-facing frontend should use a host-accessible API address or a reverse proxy that forwards requests to the API from inside the Docker network.

## 8. Environment variables and .env

The application needs configuration such as database hostname, port, username, and password.

Compose supports variable interpolation in the Compose file. For example:

    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

Compose can read interpolation values from the shell environment and a project .env file.

Example local .env:

    POSTGRES_PASSWORD=replace-with-a-local-development-password

Do not commit this real local file. Add it to .gitignore. You can provide a safe .env.example containing placeholder values to show which variables are required.

Two features are easy to confuse:

| Feature | What it does |
|---|---|
| Compose project .env file | Supplies values used to replace variables inside the Compose configuration |
| Service env_file | Loads variables into the environment of a container |

For example:

    services:
      api:
        env_file:
          - ./backend/.env

This makes variables from that file available inside the API container. It is not the same operation as using a root .env file to interpolate the Compose YAML.

Neither a plain .env file nor the environment field is a complete production secret-management solution. Do not bake credentials into images or commit them. Use an appropriate secrets system for production. Compose also has a secrets feature for granting services access to secret values as files; its actual protection depends on the deployment environment and how the secrets are supplied.

## 9. Startup order versus readiness

Imagine Compose starts the API and database at the same time.

The API tries to connect immediately. PostgreSQL's container exists, but the database process is still initializing. The connection fails.

This is a **startup race**: one component tries to use another before it is ready.

Compose's short depends_on syntax can control the order in which services are started, but a started container is not necessarily ready to handle requests.

A **health check** is a repeated test that reports whether a service is ready or healthy according to the test you configure.

In the example:

    depends_on:
      db:
        condition: service_healthy

Compose waits for the database health check to pass before starting the API.

The database health check uses pg_isready, a PostgreSQL utility that checks whether the server is accepting connections. The double dollar signs in the command prevent Compose from interpolating those variables first; the container shell expands them when the health check runs.

Important distinction:

- service_started: the dependency container has started.
- service_healthy: the dependency has passed its configured health check.
- service_completed_successfully: the dependency task has exited successfully.

Even with health checks, an application should handle a database connection dropping after startup. Health checks are not a substitute for application-level retry and error handling.

Official explanation: https://docs.docker.com/compose/how-tos/startup-order/

## 10. What Compose creates for you

When the stack is brought up, Compose typically creates:

- A project network.
- Containers for the services.
- Named volumes declared by the configuration, if needed.
- Any images that must be built or pulled.

Compose uses the project name to group resources. By default, the project name is usually derived from the project directory. You can override it when needed.

Names are commonly prefixed with the project name, which helps keep two Compose projects separate on the same Docker host.

## 11. How TaskFlow fits together

A planned local setup may look like:

    Windows developer computer
             |
             | browser uses localhost / configured API URL
             v
        Web container
        (serves built React files)
             |
             | HTTP API requests through chosen route
             v
        API container
        (Node.js + Express)
             |
             | database connection over project network
             v
        PostgreSQL container
             |
             v
        Named database volume

The browser is outside the Docker network. The backend and database can communicate by service name inside the network. The database files are held in a named volume rather than only in the container's writable layer.

A real implementation must also decide how the frontend routes API requests, how configuration is supplied, which database image version is supported, and how data is backed up.

## 12. Common beginner mistakes

- **Using localhost for the database hostname inside the API container:** localhost points to the API container itself. Use the database service name on the shared network.
- **Publishing every port:** internal services often do not need host-published ports.
- **Assuming depends_on means ready:** basic startup order does not prove the database can accept connections.
- **Mixing .env and env_file:** one is commonly used for Compose interpolation; the other populates a container environment.
- **Committing secrets:** local passwords and tokens must not enter Git history.
- **Treating a service as a container:** a service is the configuration; containers are runtime instances created from it.
- **Assuming a volume is a backup:** persistent storage can still be corrupted or deleted. Backups are separate.
- **Copying an old Compose version field from tutorials:** modern Compose uses the Compose Specification; a top-level version field is generally unnecessary.

## Guided example: follow one API request to PostgreSQL

Imagine a student opens TaskFlow and clicks Save on a task. The browser sends an HTTP request to the API. The API needs to write the task to PostgreSQL.

A Compose project describes how those parts are connected:

1. Compose creates the database service from a PostgreSQL image and the API service from the backend build context.
2. Both services join the project's default network unless the file specifies another network.
3. The API's database host is the service name db. Inside the API container, localhost would mean the API container itself, not the database.
4. The database listens on its internal port 5432. The API can reach that port over the Compose network without publishing PostgreSQL to your Windows host.
5. The API port may be published to the host so your browser can reach the API through a local URL.
6. The database service mounts a named volume so replacing the container does not automatically remove the database files.

The key connection is that **network, port publishing, and storage solve three different problems**:

- Network: which containers can talk to one another?
- Port publishing: which container port can be reached from outside the Docker host?
- Volume: which data must survive container replacement?

The browser is not inside the Compose network. A React app running in the browser cannot normally call the hostname db or api directly. It needs a host-accessible API URL or a reverse proxy that forwards the browser's request to the API.

This is a design walkthrough, not a running TaskFlow stack. The repository does not yet contain the application code or Dockerfiles.

## 13. Knowledge checkpoint

1. What problem does Docker Compose solve?
2. What is the difference between a Compose project, service, and container?
3. What is the role of services, networks, and volumes in a Compose file?
4. Why can the API use db as the database hostname?
5. Why does the database not need a host-published port for the API to connect to it?
6. What is the difference between a Compose .env file and a service env_file?
7. Why is depends_on alone not always enough for a database dependency?
8. What does a service_healthy condition add?
9. Why should the database use a named volume?

**Completion rule:** You should be able to read a Compose file and narrate how its services, network, database volume, environment settings, and readiness relationship fit together.

## Official references

- [Docker Compose overview](https://docs.docker.com/compose/)
- [Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Compose services reference](https://docs.docker.com/reference/compose-file/services/)
- [Compose startup order](https://docs.docker.com/compose/how-tos/startup-order/)
- [Compose environment variables](https://docs.docker.com/compose/how-tos/environment-variables/)
- [Compose secrets](https://docs.docker.com/compose/how-tos/use-secrets/)
