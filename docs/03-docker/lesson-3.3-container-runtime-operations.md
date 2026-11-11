# Lesson 3.3 — Container Runtime Operations

**Phase:** 3 — Docker Fundamentals  
**Goal:** Understand the commands and operating concepts used to run, inspect, debug, stop, and remove containers safely.

Lesson 3.1 explained images and containers. Lesson 3.2 explained how to build an image. This lesson covers what you do after an image exists.

## 1. A practical command workflow

Imagine you have a TaskFlow API image named taskflow-api:dev.

    Build or pull image
           |
           v
       Run container
           |
           v
    Check container status
           |
           +---- read logs
           |
           +---- inspect configuration
           |
           +---- execute debugging command
           |
           v
       Stop container
           |
           v
    Remove when no longer needed

The examples use illustrative names and ports. They do not require an existing TaskFlow app.

## 2. Inspect images and containers

List local images:

    docker image ls

List currently running containers:

    docker ps

List all containers, including stopped ones:

    docker ps -a

A stopped container does not appear in normal docker ps output, but it still exists until removed.

Useful information includes container ID, image used, container name, current status, and published port mappings.

## 3. Run a container

A basic command:

    docker run --name taskflow-api taskflow-api:dev

This asks Docker to create and start a container named taskflow-api from the image taskflow-api:dev.

The flags you should know:

| Option | Meaning |
|---|---|
| --name taskflow-api | Assigns a readable container name |
| -d | Runs the container in detached/background mode |
| -p HOST:CONTAINER | Publishes a container port through a host port |
| --rm | Automatically removes the container when it exits |
| -e NAME=value | Sets an environment variable for the container |
| --env-file path | Reads environment variables from a file |
| -v | Adds a mount, often a named volume or bind mount |
| --network | Connects the container to a selected Docker network |

A local web application example:

    docker run -d --name taskflow-api -p 127.0.0.1:3000:3000 taskflow-api:dev

- -d runs it in the background.
- --name gives it a recognizable name.
- -p 127.0.0.1:3000:3000 maps the host's loopback address and port 3000 to container port 3000.
- The final argument is the image reference.

Binding to 127.0.0.1 makes the published port available only through the host's loopback interface. This is a safer default for a local development example than publishing on every host network interface.

## 4. Understand port publishing

A service inside a container may listen on port 3000. That does not automatically mean your browser can reach it from your computer.

The -p option publishes a container port on the host.

    Browser on your computer
           |
           | http://127.0.0.1:3000
           v
       Host port 3000
           |
           | Docker port mapping
           v
      Container port 3000
           |
           v
      TaskFlow API process

The syntax is:

    -p HOST_PORT:CONTAINER_PORT

For local-only access:

    -p 127.0.0.1:3000:3000

The application must listen on the container port you publish to. Publishing a port does not fix an application that is listening on the wrong interface or port inside the container.

Also remember: EXPOSE in a Dockerfile is descriptive metadata. It does not publish a host port by itself.

## 5. Read logs and inspect a running container

If the application doesn't start, logs are often the first place to investigate.

    docker logs taskflow-api

Follow new log output:

    docker logs -f taskflow-api

- logs displays output from the container's main process.
- -f follows the output as new lines arrive. Press Ctrl+C to stop following; that does not normally stop the container.

Inspect detailed container configuration and state:

    docker inspect taskflow-api

This returns structured information such as settings, mounts, network attachments, state, and port configuration. It can be lengthy, so use it when you need detail that a short status listing does not provide.

See live resource usage:

    docker stats

This shows a live view of metrics such as CPU and memory for running containers.

## 6. Execute a command inside a running container

Sometimes the application is running, but you need to inspect files or environment inside the container.

    docker exec -it taskflow-api sh

- exec runs a new command inside an already-running container.
- -i keeps standard input open.
- -t allocates a terminal.
- sh starts a shell, if that shell exists in the image.

You can also run a single command without opening a shell:

    docker exec taskflow-api node --version

Do not assume every image includes Bash, curl, a package manager, or a text editor. Minimal images often omit debugging utilities deliberately.

Exit an interactive shell with the command exit. The shell process ends; the container's main application process continues unless the shell was the main process or you otherwise stop the container.

## 7. Stop, start, and remove containers

Stop a running container gracefully:

    docker stop taskflow-api

Start an existing stopped container:

    docker start taskflow-api

Remove a stopped container:

    docker rm taskflow-api

Remove an image that is no longer needed:

    docker rmi taskflow-api:dev

Important distinctions:

- docker stop stops the container.
- docker start starts an existing stopped container.
- docker rm removes a container.
- docker rmi removes an image reference/image data when it is no longer in use and eligible for removal.

Avoid commands such as docker rm -f or broad cleanup commands unless you understand their effect. They can remove running or otherwise useful resources. Never run a destructive cleanup command just because Docker lists unused items.

## 8. Volumes: keep important data beyond a container

A volume is a Docker-managed storage location that can exist independently of a container.

Imagine a PostgreSQL container stores all database files only in its own writable layer. If you remove that container, the database data in that layer is lost.

Create and inspect a named volume:

    docker volume create taskflow-db-data
    docker volume ls
    docker volume inspect taskflow-db-data

When running a database container later, that volume can be mounted at the database's data directory.

    PostgreSQL container
            |
            | reads and writes
            v
       Docker named volume
            |
            v
    Data survives container replacement

A volume is not a backup. Important data still needs a backup and restore strategy.

### Named volume versus bind mount

| Named volume | Bind mount |
|---|---|
| Managed by Docker | Uses a path from the host filesystem |
| Useful for persistent application/database data | Useful when a developer wants to share project files with a container |
| Identified by a Docker volume name | Identified by a host path and container path |

A bind mount example in PowerShell uses an absolute path:

    docker run --mount "type=bind,source=C:\Projects\taskflow,target=/app" ...

The ellipsis is a placeholder for remaining image/command arguments, not literal syntax. Bind mounts give a container access to host files. Mount only the paths it needs, and be careful about writable access.

## 9. Networks: let containers communicate

Containers often need to communicate with other containers. A future TaskFlow API service needs to connect to PostgreSQL.

Docker networks provide connectivity between containers.

List networks:

    docker network ls

Create a user-defined bridge network:

    docker network create taskflow-network

Inspect it:

    docker network inspect taskflow-network

A simplified view:

    taskflow-network
        /       \
       v         v
    API       Database
    container container
       |         ^
       +---------+
        DB request

On a user-defined bridge network, containers can generally reach each other by container name or network alias. The API can use a database service/container name as the hostname rather than an external public address.

Do not expose a database port to the host unless you need host access. Containers on an appropriate Docker network can communicate internally without publishing every service port.

Docker Compose will make multi-container networks easier to define in Phase 4.

## 10. A simple troubleshooting sequence

Suppose the TaskFlow API is not reachable from your browser.

1. **Does the container exist and run?**

       docker ps -a

2. **What did the application write to its logs?**

       docker logs taskflow-api

3. **What port mapping is configured?**

       docker port taskflow-api
       docker inspect taskflow-api

4. **Is the app listening on the expected container port and network interface?**

   Check the application configuration and, where available, inspect the container.

5. **Does it depend on another service?**

   Check network attachment, hostname/service name, port, database readiness, environment variables, and credentials. Do not print secrets into logs or share them in a support message.

6. **Is the container out of memory or repeatedly restarting?**

   Check docker stats, container status and logs. Inspect the host's available resources as well.

Avoid changing multiple settings at once. Check evidence, form one hypothesis, make one change, and inspect the result.

## 11. Common operational mistakes

- **Container exits immediately:** the main process may have completed or failed. Check docker ps -a and docker logs.
- **Browser cannot connect:** verify the application port, bind address, and port mapping.
- **Data disappears:** important data may have been stored only in the container writable layer rather than a volume.
- **Container cannot reach database:** verify network membership, hostname, port, credentials, and database readiness.
- **Image builds but container fails:** build-time success does not prove the runtime command or environment is correct.
- **Container runs as root:** use an appropriate non-root user when possible.
- **Cleanup deletes useful data:** understand the resource and any associated volume before removal.

## 12. Command reference

| Command | Purpose |
|---|---|
| docker image ls | List local images |
| docker pull IMAGE | Download an image |
| docker build -t NAME:TAG . | Build an image from current directory context |
| docker run IMAGE | Create and start a container |
| docker ps | List running containers |
| docker ps -a | List all containers |
| docker logs CONTAINER | Read container logs |
| docker logs -f CONTAINER | Follow container logs |
| docker inspect CONTAINER | Inspect detailed container configuration and state |
| docker exec -it CONTAINER sh | Open a shell in a running container, if available |
| docker stop CONTAINER | Stop a running container |
| docker start CONTAINER | Start a stopped container |
| docker rm CONTAINER | Remove a container |
| docker rmi IMAGE | Remove an image |
| docker volume ls | List volumes |
| docker network ls | List networks |
| docker stats | Inspect live container resource usage |

Replace placeholders such as IMAGE and CONTAINER with actual names. Do not type the placeholder words literally.

## 13. Knowledge checkpoint

1. What is the difference between docker ps and docker ps -a?
2. What does -d do in docker run?
3. Explain the meaning of -p 127.0.0.1:3000:3000.
4. How are docker logs, docker inspect, and docker exec different?
5. What is the difference between stopping and removing a container?
6. Why should a database use a persistent volume?
7. What is the difference between a named volume and a bind mount?
8. What is a user-defined Docker network used for?
9. Name a safe first set of checks when an application container is not reachable.

**Completion rule:** You should be able to inspect a container, find its logs, explain its port mapping, and describe how volumes and networks support application operations. You should also recognize which cleanup commands can delete useful resources.

## Official references

- [Docker Docs — docker run](https://docs.docker.com/reference/cli/docker/container/run/)
- [Docker Docs — docker ps](https://docs.docker.com/reference/cli/docker/container/ls/)
- [Docker Docs — docker logs](https://docs.docker.com/reference/cli/docker/container/logs/)
- [Docker Docs — docker exec](https://docs.docker.com/reference/cli/docker/container/exec/)
- [Docker Docs — Volumes](https://docs.docker.com/engine/storage/volumes/)
- [Docker Docs — Bind mounts](https://docs.docker.com/engine/storage/bind-mounts/)
- [Docker Docs — Bridge networks](https://docs.docker.com/engine/network/drivers/bridge/)
- [Docker Docs — Container networking](https://docs.docker.com/engine/network/)
