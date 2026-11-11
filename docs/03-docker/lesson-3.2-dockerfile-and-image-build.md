# Lesson 3.2 — Dockerfile and Image Build

**Phase:** 3 — Docker Fundamentals  
**Goal:** Understand how a Dockerfile describes an image build, what files a build can access, and how image layers and cache affect build speed and maintainability.

## 1. What is a Dockerfile?

In Lesson 3.1, you learned that an image is a template used to create containers.

A **Dockerfile** is a text file containing instructions that Docker's builder uses to build an image. Think of it as a recipe:

- Start from a base image.
- Set a working directory.
- Copy the files needed.
- Install dependencies.
- Add application files.
- Define the default startup command.

The common filename is exactly Dockerfile, normally with no extension.

## 2. A project-level example

This is an illustrative Dockerfile for a future Node.js API. It is not a file in the current TaskFlow repository, because application implementation has not started.

    # syntax=docker/dockerfile:1
    FROM node:22-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    ENV NODE_ENV=production
    EXPOSE 3000
    USER node
    CMD ["node", "dist/server.js"]

This example assumes the project has a lockfile, a build step that creates dist/server.js, and a base image where the node user exists. A real TaskFlow Dockerfile must be designed around the actual project and tested. Do not copy this example blindly.

## 3. Understand the important instructions

| Instruction | Purpose |
|---|---|
| FROM | Selects a base image for the build stage |
| WORKDIR | Sets the working directory for following instructions |
| COPY | Copies files from the build context into the image |
| RUN | Executes a command during image build |
| ENV | Sets an environment variable in the image configuration |
| ARG | Defines a build-time argument |
| EXPOSE | Documents the port the application is expected to listen on |
| USER | Selects the user for subsequent build/runtime instructions |
| CMD | Defines the default command/arguments for a container |
| ENTRYPOINT | Defines the executable the container is intended to run |

Three important distinctions:

**RUN versus CMD**

- RUN executes while Docker is building the image.
- CMD defines the default command when a container is started.

Installing dependencies is usually a build-time action. Starting the application is a runtime action.

**EXPOSE versus publishing a port**

- EXPOSE 3000 documents the port the application listens on inside the container.
- It does not by itself make that port reachable from your computer.
- Port publishing is configured when the container is run, using an option such as -p. That is covered in Lesson 3.3.

**CMD versus ENTRYPOINT**

- CMD provides a default command or default arguments.
- ENTRYPOINT configures the executable that the container is intended to run.
- They can be used together. The exact interaction depends on whether shell or exec form is used.

You do not need every edge case now. Recognize why a Dockerfile uses each instruction.

## 4. What is the base image?

The first FROM instruction selects the starting image.

    FROM node:22-alpine

The base image influences:

- Which operating-system user-space tools and libraries are available.
- Which runtime versions are installed.
- Image size.
- Security updates and vulnerabilities.
- Compatibility with dependencies that need native libraries.

Do not choose an image only because its download size is small. Prefer a trusted, maintained base image that suits your application. Pin versions deliberately and rebuild regularly to receive updates. Official and verified image sources are useful starting points.

## 5. What is the build context?

A Dockerfile does not automatically have access to every file on your computer.

The **build context** is the set of files the builder can access for instructions such as COPY. The final positional argument to docker build identifies the context.

    docker build -t taskflow-api:dev .

The dot (.) means the current directory is the build context.

Suppose the folder looks like this:

    taskflow-api/
    ├── Dockerfile
    ├── .dockerignore
    ├── package.json
    ├── package-lock.json
    ├── src/
    └── README.md

If you run docker build . inside taskflow-api, that folder is the context. Dockerfile instructions can copy files from it.

If a required file is outside the build context, a normal COPY instruction cannot reach out of the context to get it. Choose the right build context or reorganize the build input.

### Why build context matters

A large context can make builds slower and may accidentally include files the image does not need. It can also expose sensitive files to the builder unnecessarily.

Use a .dockerignore file to exclude files from the build context.

Example:

    node_modules/
    dist/
    coverage/
    .git/
    .env
    .env.*
    *.log

This is separate from .gitignore:

- .gitignore controls which untracked files Git should ignore.
- .dockerignore controls which files are excluded from the Docker build context.

Never copy real environment files or credentials into an image. Provide runtime configuration through an appropriate secret or environment mechanism instead.

## 6. How Docker build works

    Source files + Dockerfile
              |
              v
         Build context
              |
              v
         Docker builder
              |
              | execute instructions
              v
           Image layers
              |
              v
            Image tag
              |
              v
       Ready to run as a container

The command:

    docker build -t taskflow-api:dev .

Important parts:

- docker build asks Docker to build an image.
- -t assigns a name and tag to the resulting image.
- taskflow-api:dev is the image name and its tag.
- . is the build context.

A tag is a label for identifying an image reference. A tag such as dev, test, or 1.0.0 is a naming choice; it does not guarantee that the image is safe or immutable.

Choose a different Dockerfile:

    docker build -f Dockerfile.dev -t taskflow-api:dev .

- -f selects the Dockerfile path.
- The final dot still identifies the build context.

## 7. Image layers and build cache

Docker can reuse the result of earlier build steps when the instruction and its relevant inputs have not changed.

Consider this order:

    COPY package*.json ./
    RUN npm ci
    COPY . .

Why copy the package manifests before the rest of the source code?

Application source files may change frequently. Dependency manifests often change less frequently. Keeping dependency installation in a separate earlier step can allow Docker to reuse that step's cached result when only source code changes.

If you copy every source file before installing dependencies, a small source change may invalidate the dependency-installation step unnecessarily.

Cache behavior depends on the build instruction and the inputs that affect it. Do not treat cache reuse as a guarantee.

### Two build options that are easy to confuse

    docker build --pull -t taskflow-api:dev .
    docker build --no-cache -t taskflow-api:dev .

- --pull asks Docker to check for a newer version of the base image referenced by the Dockerfile.
- --no-cache prevents reuse of cached build layers.

They solve different problems. --no-cache does not, by itself, pull a fresh base image. You can combine the options when you deliberately need both behaviors, but a normal development build should not disable cache without a reason.

## 8. Multi-stage builds

A production application may need compilers, development packages, and build tools while it is being built. The final runtime may need only the compiled application and production dependencies.

A **multi-stage build** uses more than one FROM stage.

    Build stage
    +-----------------------------+
    | Runtime + build tools       |
    | Source code                 |
    | Build dependencies          |
    | Compile application         |
    +-----------------------------+
                  |
                  | copy required output
                  v
    Final runtime stage
    +-----------------------------+
    | Smaller runtime base        |
    | Compiled application        |
    | Production dependencies     |
    +-----------------------------+

This can produce a smaller final image and reduce the number of tools included in the runtime. It is especially useful for compiled frontend/backend projects.

We will use a multi-stage build only after the actual TaskFlow build process is known. The design should keep the final runtime image focused without sacrificing maintainability.

## 9. Common Dockerfile mistakes

- **Using latest without a reason:** the same Dockerfile may build from different base-image content at different times.
- **Copying everything into the image:** can include Git history, local dependencies, logs, and secrets.
- **Ignoring the build context:** a missing file may be outside the selected context.
- **Using RUN to start the long-running app:** RUN executes during image build, not as the normal container startup command.
- **Assuming EXPOSE publishes a port:** port publishing is configured when the container is created.
- **Running as root without need:** prefer a non-root runtime user when the application permits it.
- **Overusing no-cache:** it can make development builds unnecessarily slow.
- **Putting secrets in ARG or ENV:** these are not a safe secret-management mechanism for image builds or runtime secrets.

## 10. How this applies to TaskFlow

When implementation begins, we may have a separate build context and Dockerfile for the frontend and backend, depending on the final repository structure.

The Dockerfile must reflect:

- The actual runtime and supported version.
- The real package manager lockfile.
- The real build command.
- The real output directory.
- The correct runtime command.
- Appropriate non-root execution.
- Environment and secret handling.

We will not guess these details before the source project exists. A Dockerfile is executable configuration, not just documentation.

## 11. Knowledge checkpoint

1. What does a Dockerfile describe?
2. What is the difference between FROM, RUN, and CMD?
3. What is the build context, and what does the dot mean in docker build -t taskflow-api:dev .?
4. What is the purpose of .dockerignore and how is it different from .gitignore?
5. Why do dependency manifests often get copied before application source code?
6. What is the difference between --pull and --no-cache?
7. What does EXPOSE do, and what does it not do?
8. Why might a multi-stage build be useful?

**Completion rule:** You should be able to read a simple Dockerfile, explain the purpose of its main instructions, identify the build context, and explain one sensible cache optimization.

## Official references

- [Docker Docs — Dockerfile overview](https://docs.docker.com/build/concepts/dockerfile/)
- [Docker Docs — Build context](https://docs.docker.com/build/concepts/context/)
- [Docker Docs — Build best practices](https://docs.docker.com/build/building/best-practices/)
- [Docker Docs — Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [Docker Docs — Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
