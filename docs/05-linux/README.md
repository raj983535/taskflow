# Phase 5 — Linux and Server Administration

**Three focused lessons.** Docker helps package an application. Linux and server administration explain the operating environment where many containers and web applications run.

This phase gives you the practical command-line knowledge needed to inspect a Linux server, manage files and permissions, monitor processes and services, and diagnose basic access and networking problems.

## Where Phase 5 fits in the bigger picture

**You already know:** Docker packages applications, and Compose connects local containers. A container still runs on a computer with an operating system.

**This phase adds:** the practical knowledge needed to inspect and manage that computer when it is Linux.

Follow this chain:

```text
Remote connection (SSH)
   -> shell and filesystem
   -> users and permissions
   -> processes and services
   -> logs, ports, routes, DNS, firewall
```

Lesson 5.1 teaches safe navigation and permissions. Lesson 5.2 connects running programs to systemd services and logs. Lesson 5.3 follows the path from remote access to network troubleshooting.

**Important boundary:** Linux host commands and container commands operate at different layers. When TaskFlow runs in Docker, systemd may manage Docker Engine while Docker logs show the API process inside its container.

## Outcomes

By the end of Phase 5, you should be able to:

- Navigate a Linux filesystem and understand common system directories.
- Read, create, copy, move, search, and remove files safely.
- Understand users, groups, ownership, and read/write/execute permissions.
- Explain why normal work should use a regular user and when sudo is needed.
- Inspect running processes and resource usage.
- Understand services and use systemctl to inspect and manage them.
- Read system and service logs with journalctl.
- Connect to a server using SSH and understand public/private key authentication.
- Inspect IP addresses, routes, listening ports, DNS, and basic firewall state.
- Follow a safe troubleshooting sequence without changing many settings blindly.

## Lesson sequence

| Lesson | Topic | Main outcome |
|---|---|---|
| 5.1 | [Shell and filesystem](lesson-5.1-shell-and-filesystem.md) | Navigate the Linux shell, understand paths, files, users, groups, and permissions |
| 5.2 | [Processes and services](lesson-5.2-processes-and-services.md) | Inspect processes, manage systemd services, and read logs |
| 5.3 | [Server access and networking](lesson-5.3-server-access-and-networking.md) | Understand SSH, IP routes, listening ports, DNS, firewalls, and troubleshooting |

## How this connects to TaskFlow

Later, TaskFlow may run on a Linux-based cloud server or on a Linux host that runs Docker. You will need to know how to:

- Connect securely to the server.
- Inspect available disk, memory, and CPU.
- Find the process or service responsible for a failure.
- Read logs.
- Check whether the expected port is listening.
- Determine whether DNS, routing, or firewall rules are blocking access.

Docker commands manage containers. Linux commands help you understand and operate the host underneath them.

## Practical boundary

- These lessons are theory-first. Do not install Linux, enable WSL, create users, change firewall rules, or connect to a cloud server just to read them.
- Examples use common Linux and Ubuntu commands. Details can vary across distributions.
- Never run an unfamiliar command with sudo just because a tutorial suggests it.
- Avoid destructive file operations and remote firewall changes without a recovery path.
- AWS-specific security groups and cloud networking are covered in Phase 6.

## Phase 5 integrated checkpoint

Explain:

1. What the Linux filesystem root, home directories, and common system directories represent.
2. How absolute and relative paths differ.
3. What owner, group, and other mean in file permissions.
4. What read, write, and execute permissions mean for files and directories.
5. Why sudo should be used carefully.
6. How a process differs from a service.
7. How systemctl and journalctl help operate and troubleshoot services.
8. How SSH public-key authentication works and why the private key must remain private.
9. How you would investigate a server that is reachable by IP but whose web application cannot be reached.
10. Why changing a firewall over SSH without checking the access rules can lock you out.

**Pass standard:** You can describe a safe first-response workflow for a Linux server problem and identify which command or log would provide the next useful piece of evidence. Learner validation is deferred until the later study pass.

## Completion

All three lesson documents and this integrated checkpoint are published in this directory. Learner assessment is tracked separately in [Learning Progress](../learning-progress.md).

## Official references

- [Ubuntu Server documentation](https://ubuntu.com/server/docs/)
- [Ubuntu command-line cheat sheet](https://ubuntu.com/server/docs/reference/cli-cheatsheet/)
- [Ubuntu users and permissions](https://ubuntu.com/server/docs/security-users/)
- [Ubuntu networking documentation](https://ubuntu.com/server/docs/how-to/networking/)
- [OpenSSH manual pages](https://www.openssh.org/manual.html)

## Continue the roadmap

**Previous:** [Phase 4 — Docker Compose](../04-compose/README.md). **Next:** [Phase 6 — AWS cloud fundamentals](../06-aws/README.md).
