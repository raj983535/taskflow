# Lesson 3.1 — Containers and Images

**Phase:** 3 — Docker Fundamentals  
**Goal:** Understand what Docker packages, what an image and a container are, and how Docker components work together.

## 1. Why do we need containers?

Imagine you build TaskFlow on your laptop. It works because your computer already has the right Node.js version, packages, environment settings, and supporting tools.

You give the project to another developer. Their machine has a different Node.js version, missing packages, and different libraries. The application behaves differently or does not start.

This is the familiar problem: **It works on my machine, but not on yours.**

A container helps make the runtime environment more consistent. You define an image that includes the application and dependencies it needs. Docker can then create containers from that image on systems with a compatible container runtime.

Containers do not eliminate every environmental difference. They make a large part of the application runtime more repeatable.

## 2. What is Docker?

Docker is a platform and set of tools for building, distributing, and running containers.

| Term | Meaning |
|---|---|
| Docker CLI | The command-line client you use, such as docker ps |
| Docker Engine | The software responsible for building and running containers |
| Docker daemon (dockerd) | The background service that manages images, containers, networks, and volumes |
| Image | The packaged, read-only template used to create containers |
| Container | An isolated runtime instance created from an image |
| Registry | A service that stores and distributes images, such as Docker Hub or a private registry |
| Volume | A Docker-managed storage location for persistent data |
| Network | A virtual network that lets containers and other endpoints communicate |

A simplified architecture:

    You type a command
           |
           v
       Docker CLI
           |
           | Docker API
           v
    Docker Engine / daemon
           |
           +------ Images
           +------ Containers
           +------ Networks
           +------ Volumes
           |
           v
    Registry (when pulling or pushing images)

The CLI is the client you interact with. The Engine performs the work. A registry distributes images; it is not the same thing as the Engine running your container.

## 3. What is an image?

A **Docker image** is a packaged template used to create containers.

An image typically contains:

- A base filesystem.
- Required application runtime components.
- Installed dependencies.
- Your application files.
- Default runtime configuration, such as the command to start the application.

A future TaskFlow API image could include a suitable Node.js runtime, production dependencies, compiled backend files, and a default command to start the API.

An image is not a running application. It is the packaged template from which a container can be created.

Download an example image:

    docker pull node:22-alpine

This asks Docker to download the node image with the 22-alpine tag. It is illustrative, not yet the version decision for TaskFlow. Tags such as latest can point to different content over time, so image versions must be selected deliberately.

List local images:

    docker image ls

## 4. What is a container?

A **container** is an isolated runtime instance created from an image.

Think of the difference like this:

- Image = the recipe or packaged template.
- Container = one instance created from that template.

You can create multiple containers from the same image. Each container has its own runtime state and writable container layer.

A container can be created, started, paused, stopped, and removed. Stopping a container does not automatically delete it.

One image can produce many containers:

    Node application image
       |          |          |
       v          v          v
    Container A Container B Container C
    local test  staging    another test

The containers use the same image template but have separate runtime instances.

## 5. Image versus container

| Image | Container |
|---|---|
| Template used to create a container | Instance created from an image |
| Built or pulled from a registry | Created and started by a container runtime |
| Read-only image content | Has a writable container layer |
| Can be tagged and distributed | Can be started, stopped, inspected, and removed |
| Not itself a running process | Runs the configured application process when started |

A useful analogy: an image is like a class definition and a container is like an instance. It is only an analogy; Docker images are not programming-language classes.

## 6. How image layers work

Docker images are made from layers. A layer represents filesystem changes produced during the image build.

A simplified image:

    +----------------------------+
    | TaskFlow application files |
    +----------------------------+
    | Node.js dependencies       |
    +----------------------------+
    | Base filesystem/runtime    |
    +----------------------------+

Each layer builds on earlier results. When images share compatible layers, Docker can reuse layer data rather than storing a completely separate copy for every image.

Why this matters:

- Shared layers can save storage.
- Reusable build steps can speed up image builds.
- A changed build instruction may invalidate later cached steps.
- Smaller, sensibly organized images are easier to transfer and maintain.

Do not assume every Dockerfile line always creates a separate layer in exactly the same way. Modern builders can optimize the process. Learn the layer and cache mental model, not the builder internals.

## 7. Container writable layer and persistence

An image provides the base filesystem. A container also has a writable layer for changes made while it runs.

That writable layer belongs to the container. If you remove the container, changes held only in that layer are removed with it.

This matters for databases. If PostgreSQL stores its database files only inside a container's writable layer, removing that container can remove those files too.

For persistent data, use a **volume** or another appropriate external storage mechanism. Volumes are covered in Lesson 3.3 and multi-service use in Phase 4.

**Do not rely on a container's writable layer as permanent storage for important TaskFlow data.**

## 8. Container versus virtual machine

A virtual machine (VM) virtualizes a full operating-system environment. A typical container shares the host's kernel while using operating-system isolation features to isolate processes, filesystem views, and other resources.

    Virtual machines
    +------------------------------+
    | Application | Guest OS       |
    +------------------------------+
    | Application | Guest OS       |
    +------------------------------+
    | Hypervisor                   |
    +------------------------------+
    | Host hardware / host OS      |
    +------------------------------+

    Containers
    +------------------------------+
    | App + dependencies           |
    +------------------------------+
    | App + dependencies           |
    +------------------------------+
    | Container runtime            |
    +------------------------------+
    | Shared host kernel           |
    +------------------------------+
    | Host hardware / host OS      |
    +------------------------------+

| Virtual machine | Container |
|---|---|
| Typically includes a guest OS | Usually shares the host kernel |
| More complete OS environment | Packages application and required user-space dependencies |
| Often has more overhead | Usually starts with less overhead |
| Virtualization boundary depends on hypervisor and configuration | Isolation depends on kernel and runtime configuration |

Containers are not tiny virtual machines. They use the host operating system's kernel. This is one reason they can be lighter, but it also means the host OS and CPU architecture matter.

Containers are not automatically a perfect security boundary. Isolation requires correct configuration, least privilege, patched images and hosts, and careful handling of mounts, capabilities, and secrets.

## 9. What is a registry?

A **container registry** stores and distributes images.

    Developer machine
       |
       | build image
       v
    Local image
       |
       | docker push
       v
    Container registry
       |
       | docker pull
       v
    Another machine / server
       |
       | create container
       v
    Running application

Docker Hub is a public registry service. Private registries can store images for an organization or project.

Later in TaskFlow's cloud path, Amazon Elastic Container Registry (ECR) is a possible image registry. We will cover it in the AWS phase.

An image reference commonly looks like:

    registry/repository:tag

For example, node:22-alpine identifies the node repository and the 22-alpine tag in the default registry namespace.

## 10. Basic container lifecycle

    Image available
         |
         v
    Create container
         |
         v
    Start container
         |
         v
       Running
         |
         +---- stop ----> Stopped
         |                    |
         |                    +---- start ----> Running
         |
         +---- remove ----> Removed

Remember:

- Pull or build an image.
- Create and start a container from it.
- Inspect and operate that container.
- Stop it when needed.
- Remove it when you no longer need it.

The image can remain after the container is removed.

## 11. How TaskFlow will use Docker

When TaskFlow's application exists, the planned separation may look like:

- Frontend image and container.
- Backend API image and container.
- PostgreSQL service/container for local development, with persistent storage.

Separate containers give each service its own runtime environment and lifecycle. They can communicate over a Docker network.

We will not define their combined startup and dependency configuration here. That is Phase 4 — Docker Compose.

## 12. Common misunderstandings

- **"The image is running."** An image is a template; a container is the runtime instance.
- **"Stopping a container deletes it."** Stop and remove are different operations.
- **"The registry runs my container."** A registry distributes images; a Docker Engine runs containers.
- **"Container data is automatically permanent."** Data stored only in the writable layer can disappear when the container is removed.
- **"Containers are complete VMs."** They generally share the host kernel.
- **"Containers are automatically secure."** Isolation requires correct configuration and maintenance.

## 13. Knowledge checkpoint

1. What problem does Docker solve?
2. What is the difference between an image and a container?
3. What does the Docker CLI do, and what does the Docker daemon do?
4. Why are image layers useful?
5. What can happen to data stored only in a container's writable layer when the container is removed?
6. How does a container differ from a virtual machine?
7. What is the purpose of a container registry?
8. What are the main stages in a container's lifecycle?

**Completion rule:** Explain how source code and dependencies become an image, how the image becomes a container, and why important application data should be stored outside the container's disposable writable layer.

## Official references

- [Docker Docs — What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)
- [Docker Docs — What is an image?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/)
- [Docker Docs — Docker Engine](https://docs.docker.com/engine/)
- [Docker Docs — Image layers](https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/)
- [Docker Docs — Storage](https://docs.docker.com/engine/storage/)
