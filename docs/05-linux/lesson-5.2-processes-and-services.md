# Lesson 5.2 — Processes and Services

**Phase:** 5 — Linux and Server Administration  
**Goal:** Understand what is running on a Linux server, how background services are managed, and where to look when an application fails.

## Start here: a file is not the same as a running program

You already know that a Node.js backend is source code stored in files. When someone starts that backend, the operating system creates a **process**, which is the running instance of the program.

A **service** is the longer-running function the server provides, such as SSH, a web server, a database, or a TaskFlow API. On many Linux systems, systemd manages services and can start them during boot.

Keep the layers separate:

- Program file: the code or executable stored on disk.
- Process: the currently running instance with a process ID.
- Service: the managed application function and its service configuration.
- systemd: the service manager that starts, stops, and watches supported services.

This distinction becomes especially important when TaskFlow is containerized: a Linux host service such as Docker Engine can manage containers, while the Node.js process runs inside an API container.


## 1. What is a process?

A **process** is a running instance of a program.

When you start a command, the operating system creates a process to execute it. A process has information such as:

- A process ID (PID), which identifies it while it exists.
- The user account under which it runs.
- Memory and other resources it uses.
- Its current state.
- The program or command it is executing.

For example, when a Node.js backend starts, Linux runs a Node.js process. That process handles the application's work.

A process is a runtime instance, not the source-code file on disk.

## 2. Process versus service

A **service** is a program or group of processes that provides a function, often continuously in the background.

Examples include:

- SSH server.
- Web server.
- Database server.
- Background worker.
- TaskFlow API service.

A service is commonly managed by a service manager. On many Linux distributions, including Ubuntu, this is systemd.

Relationship:

    Service definition / unit
             |
             v
       systemd manager
             |
             v
      Start or stop process
             |
             v
       Running process

A service can start one or more processes. A process can also exist without being managed as a long-running system service.

## 3. Inspect running processes

Show a snapshot of processes:

    ps aux

This lists processes across the system with details such as user, PID, CPU/memory figures, and command.

Find a process by name:

    pgrep -a node

This looks for processes whose command matches node and prints the PID and command line.

See a live updating process view:

    top

The top command refreshes the display so you can see changing resource usage. Some systems also use htop, which may need to be installed separately.

Useful system checks:

    uptime
    free -h
    df -h

- uptime shows how long the system has been running and gives a load average.
- free -h shows memory and swap information.
- df -h shows filesystem space.

The **load average** is a measure related to how many tasks are runnable or waiting for certain resources over time. It is not simply a CPU percentage.

## 4. Understand process signals

Linux can send signals to processes to request that they do something.

A common example is asking a process to stop.

    kill -TERM 1234

- kill sends a signal to a process.
- -TERM requests graceful termination.
- 1234 is an example PID; use the real PID you have identified.

A graceful termination gives the application a chance to stop accepting work, close connections, and clean up.

A forceful signal:

    kill -KILL 1234

KILL cannot be caught or handled by the process. Use it only when a process will not stop normally and you understand the consequences.

Do not use kill on a process simply because its name looks unfamiliar. Identify the process and its role first. Killing a database or system process can cause an outage or data recovery work.

## 5. What is systemd?

systemd is a system and service manager used by many Linux distributions.

It can:

- Start services during boot.
- Stop and restart services.
- Track service state.
- Manage dependencies.
- Collect service logs through the journal.

A **unit** is a configuration and management object known to systemd. A service unit describes a service, often using a .service file.

The common command for interacting with systemd is systemctl.

## 6. Essential systemctl commands

Inspect a service:

    systemctl status ssh

This shows the service state, recent log information, and other details. The exact service name may vary by distribution.

Start a service:

    sudo systemctl start SERVICE

Stop a service:

    sudo systemctl stop SERVICE

Restart a service:

    sudo systemctl restart SERVICE

Enable startup at boot:

    sudo systemctl enable SERVICE

Disable automatic startup at boot:

    sudo systemctl disable SERVICE

Understand the difference:

| Command | Meaning |
|---|---|
| start | Start the service now |
| stop | Stop the service now |
| restart | Stop and start the service again |
| enable | Configure it to start during boot |
| disable | Remove its automatic boot enablement |
| status | Inspect current state |

Starting and enabling are different. A service can be started now without being configured to start automatically after a reboot.

Similarly, stopping a service does not necessarily disable it at boot.

Be careful restarting SSH or networking services on a remote server. A configuration mistake can interrupt your only administrative connection.

## 7. Read logs with journalctl

A **log** is a record of events produced by a system or application.

systemd commonly stores service and system messages in a journal that you can inspect with journalctl.

See the system journal:

    journalctl

Show logs for one service:

    journalctl -u ssh

- journalctl reads the systemd journal.
- -u filters the output to a selected unit, here ssh.

Follow new logs:

    journalctl -u ssh -f

Show recent entries:

    journalctl -u ssh --since "1 hour ago"

Show only the latest lines:

    journalctl -u ssh -n 100

If a TaskFlow service fails, a useful sequence is:

    systemctl status taskflow-api
    journalctl -u taskflow-api -n 100

The service name is illustrative. The actual unit must exist and may be named differently.

Logs can contain sensitive values. Never write passwords, tokens, private keys, session cookies, or personal data to logs.

## 8. Service configuration and reloads

A service often reads configuration from a file. If that file changes, the service may need to reload or restart.

These actions differ:

- **Reload:** ask the running service to re-read configuration, if supported.
- **Restart:** stop and start the service process.

systemctl can request a reload:

    sudo systemctl reload SERVICE

Some services do not support reload. Always check the service documentation and status before choosing.

For systemd unit-file changes, the system manager may need to reload its unit definitions:

    sudo systemctl daemon-reload

This is different from asking the application to reload its own configuration.

Do not edit an unknown service unit or restart it without understanding its purpose and recovery procedure.

## 9. Check disk, memory, and resource pressure

An application may fail because the server runs out of resources.

Useful commands:

    free -h
    df -h
    top
    uptime

Look for:

- Very low available memory.
- Full filesystems.
- A process consuming unusually high CPU.
- A process using a large amount of memory.
- A service repeatedly crashing or restarting.

A full disk can prevent a database from writing data or an application from writing logs. Memory pressure can cause slow responses or processes to be terminated by the system.

A process that exits can have many causes: invalid configuration, missing environment variables, unavailable dependencies, permission problems, or memory pressure. Logs and exit status help distinguish them.

## 10. How this applies to TaskFlow

Later, TaskFlow may run under Docker, as a service on a Linux host, or in a cloud-managed environment.

Even with Docker, Linux process and service concepts remain useful:

- The host has system services and Docker Engine processes.
- Containers run application processes.
- systemd may manage Docker Engine on a Linux host.
- Docker logs show container application output.
- journalctl can show host service logs, including Docker Engine logs where configured.

Do not confuse a container's application process with the host's Docker service. They are different layers.

## 11. Common beginner mistakes

- **Confusing a process and a service:** a service is the managed function/configuration; processes are running instances.
- **Using kill before inspecting the process:** you may stop a critical component.
- **Assuming enable starts a service immediately:** enable configures boot behavior; start runs it now.
- **Assuming start enables boot startup:** those are separate actions.
- **Restarting SSH remotely without a fallback:** a bad configuration can lock you out.
- **Reading only application logs:** host service logs and resource usage may reveal another cause.
- **Treating load average as CPU percentage:** it measures a different concept.
- **Ignoring full disks:** storage exhaustion can cause many unrelated-looking failures.

## Guided example: find out why TaskFlow is not responding

There are two different deployment styles. First identify which one you are investigating.

### Case A: the API is installed directly as a Linux service

```bash
systemctl status taskflow-api
journalctl -u taskflow-api -n 50 --no-pager
ps aux
free -h
df -h
```

- `systemctl status` shows whether the service is active, failed, or restarting.
- `journalctl -u taskflow-api -n 50 --no-pager` shows the latest 50 journal entries for that service without opening an interactive pager.
- `ps aux` lists processes so you can see whether the expected program is running.
- `free -h` and `df -h` help identify memory or disk pressure.

### Case B: the API runs in a Docker container

In this case, systemd may manage Docker Engine, but the TaskFlow API process is inside a container. Start by checking the container and its logs:

```bash
systemctl status docker
docker ps -a
docker logs taskflow-api
```

Do not expect `systemctl status taskflow-api` to work unless you actually created a systemd unit with that name.

### Choose the least disruptive action

If the service is failed, read the error before restarting it. A restart may restore service temporarily, but it can hide evidence or repeat the same failure. Use `restart` only after understanding the likely cause and any impact on users. Do not use `kill -KILL` as your first response.

## 12. Knowledge checkpoint

1. What is a process?
2. What is a service, and how does it relate to a process?
3. What does a PID identify?
4. What do ps aux, pgrep, and top help you inspect?
5. What is the difference between TERM and KILL?
6. What is systemd?
7. What is the difference between systemctl start and enable?
8. What does journalctl -u SERVICE show?
9. How would you inspect a TaskFlow service that repeatedly fails to start?
10. Why should you check disk and memory when an application behaves unexpectedly?

**Completion rule:** You should be able to identify a process, inspect a service, read its logs, and choose safe service operations based on evidence.

## Official references

- [Ubuntu command-line cheat sheet](https://ubuntu.com/server/docs/reference/cli-cheatsheet/)
- [systemctl manual](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html)
- [journalctl manual](https://www.freedesktop.org/software/systemd/man/latest/journalctl.html)
- [Linux procps-ng project](https://gitlab.com/procps-ng/procps)
