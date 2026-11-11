# Phase 3 — Docker Fundamentals

**Three focused lessons.** This phase explains how to package an application and its runtime dependencies into images, run those images as containers, and inspect and operate containers safely.

Docker will matter when TaskFlow moves from source code on a developer's laptop to a consistent environment that can later run locally, in CI, and on a cloud server.

## What you will be able to do

By the end of Phase 3, you should be able to:

- Explain the difference between an image and a container.
- Describe the Docker CLI, Engine/daemon, image layers, and registry.
- Explain why containers are not full virtual machines.
- Read and write a project-level Dockerfile.
- Understand build context, .dockerignore, build layers, and caching.
- Build, tag, run, inspect, stop, and remove containers.
- Read container logs and execute a command inside a running container.
- Explain port publishing, volumes, bind mounts, and Docker networks.
- Recognize common container problems and investigate them safely.

## Lesson sequence

| Lesson | Topic | Main outcome |
|---|---|---|
| 3.1 | [Containers and images](lesson-3.1-containers-and-images.md) | Explain Docker architecture, images, containers, layers, registries, and lifecycle |
| 3.2 | [Dockerfile and image build](lesson-3.2-dockerfile-and-image-build.md) | Read and write a Dockerfile; understand build context, caching, tags, and multi-stage builds |
| 3.3 | [Container runtime operations](lesson-3.3-container-runtime-operations.md) | Use essential commands for running, inspecting, debugging, storing data, networking, and cleanup |

## How this connects to TaskFlow

TaskFlow is planned as a web application with a frontend, backend API, and PostgreSQL database. A later implementation may package these as separate services with separate images and containers.

This phase focuses on Docker itself. **Docker Compose is Phase 4**, where we will connect multiple services and manage them together.

## Practical boundary

- These lessons are theory-first. Do not install Docker Desktop or start containers just to read the material.
- On Windows, Docker Desktop provides a managed Docker Engine experience and supports a WSL 2 backend. Read the [official Docker Desktop WSL 2 guide](https://docs.docker.com/desktop/features/wsl/) when we are ready to check installation requirements and resource settings.
- Do not download large images or allocate cloud resources during this phase.
- Treat example image names, ports, and application paths as examples, not as a completed TaskFlow configuration.

## Phase 3 final checkpoint

After the three lessons, you should be able to explain:

1. How an image differs from a container and where a registry fits.
2. Why a container is lighter than a typical virtual machine, and what it shares with the host.
3. How a Dockerfile and build context produce an image.
4. What the core Dockerfile instructions do and how layer caching affects build order.
5. How to run and inspect a container, read its logs, and enter it for troubleshooting.
6. Why port publishing, volumes, and networks are needed, and how to remove resources without losing important data.

**Pass standard:** You can describe the path from source files to an image, from an image to a running container, and from a running container to safe inspection and cleanup.

## One connected TaskFlow walkthrough

Keep this sequence in mind as you study the three lessons:

```text
TaskFlow source code
        |
        v
Dockerfile + build context
        |
        v
Docker builder creates image layers
        |
        v
TaskFlow image
        |
        v
Docker creates and starts a container
        |
        +---- publish a port for host/browser access
        |
        +---- attach a volume for data that must persist
        |
        +---- attach a network for service-to-service communication
        |
        v
Inspect status, logs, configuration and resource usage
        |
        v
Stop, replace or remove the container safely
```

For TaskFlow, the frontend build will normally produce static files that a web server can serve. React runs in the user's browser. The backend container runs the Node.js API. A database service needs persistent storage. The exact images, base versions, ports, build steps, and runtime configuration must be chosen from the real application; the examples in these lessons are not implemented TaskFlow configuration.

## Phase 3 integrated checkpoint

Explain this scenario from beginning to end, in your own words:

TaskFlow has a React frontend, a Node.js/Express API, and PostgreSQL. You want a repeatable local environment that can later be deployed to a server.

1. What does Docker solve in this scenario? Explain the role of the Docker CLI, Engine/daemon, image, container, and registry.
2. Explain the difference between an image, its read-only layers, and the writable layer of a running container. What happens to data held only in that writable layer when the container is removed?
3. Describe how a Dockerfile and build context become an image. Explain the purpose of FROM, WORKDIR, COPY, RUN, EXPOSE, USER, and CMD.
4. Why do we use .dockerignore? Why might copying dependency manifests before source files make builds faster?
5. Explain the difference between a build-time action and the command that starts an application at runtime. Also distinguish --pull from --no-cache.
6. The API listens on port 3000 inside its container. Explain what -p 127.0.0.1:3000:3000 does and what EXPOSE does not do.
7. PostgreSQL must keep its data when its container is replaced. Explain why a named volume is used, and how that differs from a bind mount.
8. The API must contact PostgreSQL. Explain how a Docker network helps, then describe how you would investigate an API container that is not reachable.

**Pass standard:** Your explanation connects all three lessons into one operational flow. You should be able to explain why each resource exists, what it changes, and where you would look when something fails. Perfect command memorization is not required.

## Completion

Study material for all three lessons and the connected walkthrough are published in this directory. The learner checkpoint is tracked separately in [Learning Progress](../learning-progress.md). Published or presented material is not automatically a passed checkpoint.
