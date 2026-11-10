# Bare Metal, Virtual Machines, and Containers: Understanding Compute

## Learning objectives

Understand the differences between physical servers, virtual machines, and containers. Explain what happens when a Docker container is started and how Docker fits on Windows 11.

## 1. Bare-metal server

A bare-metal server is a physical computer whose hardware resources are assigned directly to an operating system or workload rather than being divided among virtual machines by a hypervisor.

It has physical CPU, memory, storage, and network interfaces. Applications still normally run on an operating system.

## 2. Virtual machine (VM)

A virtual machine is a software-defined computer. A hypervisor allocates virtual CPU, memory, storage, and network devices to it.

Each conventional VM runs its own guest operating system and kernel.

```text
Physical hardware
       |
Hypervisor
       |
  +----+----------------+
  |                     |
  v                     v
VM 1                  VM 2
Guest OS + kernel     Guest OS + kernel
Application           Application
```

Cloud services such as AWS EC2 provide virtual machine instances. The cloud provider manages the underlying physical infrastructure and virtualization layer.

Virtualization is normally hardware-assisted; it is not simply emulating every hardware instruction in software.

## 3. Container

A container is an isolated environment for running a process. A container image packages an application and its user-space dependencies, configuration, and filesystem content.

Linux containers share the Linux kernel provided by their host environment. They do not each boot a separate Linux kernel like conventional VMs.

Common Linux kernel mechanisms include:

- **Namespaces:** Isolate views of resources such as process IDs, network interfaces, mount points, and hostnames.
- **Control groups (cgroups):** Account for and control resources such as CPU and memory. Exact controllers and capabilities depend on the kernel and configuration.
- **Capabilities, seccomp, and other security controls:** Restrict what a process can do.

A container is not automatically secure merely because it is isolated. Image hygiene, non-root execution, restricted capabilities, host patching, secrets management, and network policy still matter.

## 4. Docker on Windows 11

Windows 11 does not provide the Linux kernel that ordinary Linux containers expect.

With Docker Desktop configured for Linux containers, Docker commonly uses the WSL 2 Linux environment. The Linux containers share the kernel inside that Linux environment. The Windows host and WSL 2 environment cooperate to provide the developer experience.

This is why a Linux container can run on a Windows laptop without every container having its own full guest operating system.

## 5. Image vs container

| Term | Meaning |
|---|---|
| Dockerfile | Instructions used to build an image |
| Image | Immutable, layered package used as the basis for containers |
| Container | A created and running (or stopped) instance of an image, with its own writable layer and runtime configuration |
| Docker Engine | Software that manages images, containers, networks, and volumes |
| Container registry | Service that stores and distributes images, such as Amazon ECR or Docker Hub |

An image is not the same thing as a running container. One image can be used to create multiple containers.

## 6. What does "spin up a container" mean?

When you run:

```powershell
docker run --rm -p 8080:5000 taskflow-api
```

Docker broadly performs these tasks:

1. Finds the requested image locally or pulls it from a registry if needed.
2. Creates a container from the image and its configuration.
3. Adds a writable container layer.
4. Configures the container's filesystem, namespaces, resource controls, and networking.
5. Applies port publishing if requested.
6. Starts the container's main process.

The process is often managed through components such as Docker Engine, containerd, and an OCI runtime such as runc. The exact implementation can vary by Docker version and platform.

The container normally remains running while its main process is running. When that process exits, the container stops.

## 7. VM and container comparison

| Characteristic | Bare metal | Virtual machine | Container |
|---|---|---|---|
| Runs on | Physical hardware | Hypervisor-managed virtual hardware | Container runtime / host kernel |
| Operating system | Host OS | Separate guest OS per VM | Shares host kernel (for Linux containers) |
| Isolation | Physical machine boundary | Virtualization boundary | Process and kernel feature-based isolation |
| Startup | Hardware and OS boot | Guest OS boot | Usually process startup; often fast |
| Packaging | Hardware and OS dependent | VM image | Container image |
| Typical use | Specialized or dedicated workloads | General-purpose cloud compute | Application packaging and deployment |

Avoid treating startup times and image sizes as guaranteed constants. They depend on the application, image, storage, hardware, and runtime.

## 8. TaskFlow architecture

Our intended learning setup is:

```text
Windows 11 laptop
   |
   +-- Docker Desktop / WSL 2 Linux environment
          |
          +-- TaskFlow API container
          +-- PostgreSQL container
          +-- Frontend container (when needed)
```

Later, in AWS, the first deployment may use:

```text
AWS physical infrastructure (managed by AWS)
   |
EC2 virtual machine
   |
Docker Engine
   |
TaskFlow container(s)
```

This illustrates the distinction: AWS provides the cloud compute instance; Docker packages and runs the application process within the environment.

We will evaluate the actual deployment target and costs before creating cloud resources.

## 9. Practical inspection (after Docker Desktop is installed)

Check Docker client and server versions:

```powershell
docker version
```

Check the configured runtime and context:

```powershell
docker context ls
docker info
```

Run a lightweight Linux container:

```powershell
docker run --rm -it alpine sh
```

Inside the container, inspect the process list and hostname:

```sh
ps
hostname
exit
```

The container has its own process view and hostname. On Docker Desktop, these are within the Linux environment used by Docker.

If Docker Desktop is not installed or running, these commands will fail. We will install and configure it deliberately during the Docker phase rather than assuming it is already available.

## 10. Common errors

| Error | Possible cause | What to check |
|---|---|---|
| Cannot connect to Docker daemon | Docker Desktop or its Linux engine is not running | Docker Desktop status and selected context |
| Image not found | Image name/tag is incorrect or unavailable | Image name, tag, registry login |
| Container exits immediately | Its main process completed or crashed | `docker logs`, command, exit code |
| Port is already allocated | Another process or container uses the host port | Host listening ports and existing containers |
| Out of memory | Host or container memory limit is insufficient | Docker Desktop resources, container metrics, application usage |

## 11. Interview questions

1. What is the difference between a VM and a container?
2. Does a Linux container have its own kernel?
3. What is the difference between a Docker image and a container?
4. What does Docker do when you run a container?
5. Why does Docker Desktop need a Linux environment to run Linux containers on Windows?
6. What happens when the container's main process exits?

## 12. Key takeaways

- Bare metal is physical hardware; a VM is a virtual computer with its own guest OS; a container is an isolated process environment.
- Linux containers share the Linux kernel of their host environment.
- Docker images are packages; containers are runtime instances.
- "Spinning up" a container means creating/configuring it and starting its main process.
- On Windows 11, Docker Desktop commonly runs Linux containers using WSL 2.
