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
- On Windows, Docker Desktop provides a managed Docker Engine experience and can use the WSL 2 backend. We will confirm current installation requirements and resource settings only when we are ready to run the project.
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

## Completion

Study material for all three lessons is published in this directory. The learner checkpoints are tracked separately in [Learning Progress](../learning-progress.md). Published material is not automatically a passed checkpoint.
