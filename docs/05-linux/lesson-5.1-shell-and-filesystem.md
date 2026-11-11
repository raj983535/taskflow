# Lesson 5.1 — Shell and Filesystem

**Phase:** 5 — Linux and Server Administration  
**Goal:** Understand how to work with a Linux server through a command-line shell, navigate its filesystem, and reason about users and file permissions.

## Start here: why a web developer needs a Linux shell

You already know how to work with files in Windows and PowerShell. A Linux server is another computer with its own operating system, directories, users, and running programs. When you connect to it over SSH, your commands run on that remote Linux machine, not on your Windows laptop.

The terminal is the window where you type. The shell reads your command and asks Linux to perform it. The filesystem is the tree of folders and files that Linux makes available.

Start with a simple mental picture:

- Windows PowerShell is your local command environment.
- SSH creates a remote session to a server.
- Once connected, the Linux shell runs commands on that server.
- Commands such as pwd, ls, and id let you inspect before you change anything.

This lesson is about becoming comfortable inspecting the machine safely. It is not about memorizing every Linux command.


## 1. Why does TaskFlow need Linux knowledge?

Imagine TaskFlow is deployed on a Linux server. The application stops responding.

You need to inspect the server:

- Where are the application files?
- Which user owns them?
- Is the disk full?
- Can the application read its configuration?
- Which command should you use to inspect a log?

This is why a developer needs basic server command-line knowledge, even when a deployment platform hides some operating-system details.

A **server** is a computer or virtual machine that provides a service to other devices or applications. Linux is a family of operating systems commonly used on servers.

## 2. What is the shell?

A **shell** is a program that accepts commands and asks the operating system to perform work.

A terminal is the interface window where you interact with a shell. A terminal is not itself the shell.

The relationship is:

    You type a command
           |
           v
        Terminal
           |
           v
          Shell
           |
           v
    Operating system
           |
           v
    Files / processes / network

Examples of shells include Bash and Zsh. Ubuntu commonly uses Bash for interactive command-line work.

A command normally has a name, optional options, and optional arguments:

    command [options] [arguments]

An **option** changes how a command behaves. An **argument** tells the command what to act on.

For example:

    ls -l /var/log

- ls lists directory contents.
- -l requests a long listing with more detail.
- /var/log is the directory to list.

## 3. Understand the Linux filesystem

Linux uses one directory tree that begins at the filesystem root, written as a single slash:

    /

This is different from Windows drive paths such as C:\.

Some common directories:

| Directory | General purpose |
|---|---|
| / | Root of the filesystem tree |
| /home | Regular users' home directories |
| /root | Home directory for the root administrator account |
| /etc | System and service configuration files |
| /var | Variable data such as logs, caches, and application state |
| /var/log | Common location for text log files |
| /tmp | Temporary files |
| /usr | Many installed programs and shared read-only resources |
| /opt | Optional third-party application software |
| /srv | Data served by system services, depending on system conventions |

Do not assume every application uses exactly the same directory layout. Learn the common locations and inspect the actual service configuration.

## 4. Absolute and relative paths

A **path** identifies where a file or directory is located.

An absolute path starts from the filesystem root:

    /var/log/syslog

A relative path is interpreted from your current directory:

    docs/README.md

Two useful path symbols:

- A single dot means the current directory.
- Two dots mean the parent directory.

For example, if your current folder is /home/developer/taskflow:

    cd docs
    cd ..
    cd /var/log

- cd changes the current directory.
- cd docs moves into the docs subdirectory.
- cd .. moves up one level.
- cd /var/log uses an absolute path to move directly to that directory.

Find your current directory:

    pwd

List files:

    ls

List hidden files and detailed metadata:

    ls -la

Linux filenames beginning with a dot are usually hidden from the normal ls listing. Hidden does not mean protected or secret.

## 5. Essential file and directory commands

| Command | Purpose |
|---|---|
| pwd | Print the current directory |
| ls -la | List files, including hidden files, with details |
| cd PATH | Change directory |
| mkdir NAME | Create a directory |
| touch FILE | Create an empty file if it does not exist, or update its timestamp |
| cp SOURCE DEST | Copy a file |
| mv SOURCE DEST | Move or rename a file |
| cat FILE | Print file contents |
| less FILE | View a file page by page |
| head FILE | Show the beginning of a file |
| tail FILE | Show the end of a file |
| grep PATTERN FILE | Search file content for matching lines |
| find PATH -name NAME | Search for files by name |
| rm FILE | Remove a file |

Be careful with rm. It removes files; it does not normally send them to a recycle bin. Recursive removal can delete an entire directory tree. Inspect the path before removing anything, especially when using sudo.

A few useful examples:

    mkdir taskflow
    cd taskflow
    touch README.md
    cp README.md README.backup
    mv README.backup README-old.md
    less README.md

These are examples to understand, not commands to run on an important server without checking the directory first.

## 6. Read file details

A long listing may look like:

    -rw-r----- 1 appuser developers 2048 Nov 11 10:30 config.json

The fields include:

- File type and permission bits.
- Number of hard links.
- Owner.
- Group.
- File size.
- Last modification time.
- Name.

The first permission characters might look unfamiliar. We will break them down below.

The command:

    id

shows your current user ID, primary group, and additional groups.

The command:

    whoami

shows the current username.

## 7. Users and groups

A Linux system can have many user accounts.

A **user** represents an identity under which commands and processes run.

A **group** is a named collection of users used to manage shared access.

For example:

- appuser may own TaskFlow application files.
- developers may be a group allowed to read or modify some project files.
- a database service may run under its own dedicated user.

Linux file permissions use three broad identity categories:

1. Owner: the user who owns the file.
2. Group: users who belong to the file's group.
3. Other: everyone else.

This allows an administrator to grant different levels of access to different people and services.

## 8. Read, write, and execute permissions

Linux uses three common permission types:

| Permission | For a file | For a directory |
|---|---|---|
| Read (r) | Read the contents | List names inside the directory |
| Write (w) | Modify the contents | Create, remove, or rename directory entries, subject to other permissions |
| Execute (x) | Run the file as a program/script, if applicable | Traverse or enter the directory |

The file mode is often displayed using letters:

    rwxr-x---

This means:

- Owner: rwx, read/write/execute.
- Group: r-x, read/execute.
- Other: ---, no permissions.

The same permissions can be represented numerically:

| Number | Permissions |
|---:|---|
| 7 | read + write + execute |
| 6 | read + write |
| 5 | read + execute |
| 4 | read only |
| 0 | no permission |

For example:

    chmod 640 config.json

The owner can read and write. The group can read. Other users have no access.

A directory often needs execute permission for a user to traverse it. A user may be unable to read a file even when the file itself is readable if they cannot traverse one of its parent directories.

## 9. chmod, chown, and sudo

Change permissions:

    chmod 640 config.json

- chmod means change mode.
- 640 is the owner/group/other permission value.
- config.json is the target file.

Change owner and group:

    sudo chown appuser:developers config.json

- chown means change owner.
- appuser is the new owner.
- developers is the new group.
- sudo runs the operation with administrator privileges when required.

**sudo** allows an authorized user to run a particular command with elevated privileges. It is not a reason to run everything as administrator.

Use the least privilege necessary. A wrong recursive chmod or chown command can break service access or expose private files.

Avoid permission values such as 777 as a routine fix. They grant broad access and often hide the real ownership or configuration problem.

## 10. Why not run everything as root?

The root account is the system administrator identity with broad control over the machine.

If an application runs as root and is compromised, the attacker may gain more power over the host than if the application used a restricted service account.

Prefer:

- A regular user for day-to-day administration.
- A dedicated service user for application processes.
- sudo only for the specific administrative operations that require it.
- Narrow file and directory permissions.

This is the principle of **least privilege**: give each user and process only the access it needs.

## 11. Disk space and basic inspection

Useful commands when a server behaves strangely:

    df -h

Shows filesystem disk space in human-readable units. A full disk can prevent applications from writing logs, temporary files, or database data.

    du -sh /var/log

Estimates the total size of a directory.

    free -h

Shows memory and swap usage.

    uname -a

Displays basic kernel and system information.

Do not delete logs or application data just because disk usage is high. First find what is using space, understand whether it is needed, and use the appropriate retention or cleanup process.

## 12. How this applies to TaskFlow

When TaskFlow runs on a Linux host, you may need to:

- Log in with a restricted administrative account.
- Inspect the application directories.
- Confirm ownership and permissions.
- Check disk and memory.
- Read service configuration.
- Locate logs.
- Use sudo only for a specific privileged task.

When TaskFlow is containerized, Docker manages container filesystems and processes, but the host still has its own files, users, permissions, processes, and logs. Host and container paths are not necessarily the same.

## 13. Common beginner mistakes

- **Confusing terminal and shell:** the terminal is the interface; the shell interprets commands.
- **Assuming / is the home folder:** / is the filesystem root; regular users usually have a home directory under /home.
- **Using relative paths without checking the current directory:** run pwd when unsure.
- **Using rm without inspecting the path:** deletion can be permanent.
- **Using sudo for everything:** this increases the impact of mistakes.
- **Using chmod 777 to fix access:** it grants excessive access instead of correcting ownership or needed permissions.
- **Forgetting directory execute permission:** users need it to traverse a directory.
- **Assuming hidden files are secure:** a leading dot only affects normal listing behavior.

## Guided example: inspect a TaskFlow server without changing it

Imagine you have connected to a Linux server as the regular user appadmin. You want to find where you are, inspect an application folder, and check who owns its files.

```bash
whoami
pwd
ls -la
cd /opt
ls -la
id
ls -l /opt/taskflow
df -h
```

Read what each step tells you:

1. `whoami` identifies the current account.
2. `pwd` prints the current directory. This prevents confusion about relative paths.
3. `ls -la` lists normal and hidden entries with ownership and permission details.
4. `cd /opt` changes into the optional application-software location. The path is absolute because it begins with /.
5. `id` displays the user's numeric identity and group memberships.
6. `ls -l /opt/taskflow` shows the owner, group, and permissions for the application folder.
7. `df -h` shows filesystem capacity and free space.

### How to read a permission example

Suppose a file begins with:

```text
-rw-r----- appuser developers config.json
```

The owner appuser can read and write. Members of the developers group can read. Other users have no permission. The leading dash indicates a regular file; a directory normally begins with d.

For a directory, execute permission means the user can traverse it. A user may be unable to open a file because a parent directory does not allow traversal, even when the file's own read bit is set.

Do not "fix" access problems by giving everyone full access with chmod 777. First identify which account the service runs as, which file it needs, and which minimum permission is missing.

## 14. Knowledge checkpoint

1. What is the difference between a terminal and a shell?
2. What is the Linux filesystem root?
3. How do absolute and relative paths differ?
4. What are /home, /etc, and /var/log commonly used for?
5. What do owner, group, and other mean?
6. What do read, write, and execute mean for a file versus a directory?
7. What does chmod 640 allow?
8. What does chown change?
9. Why should you avoid running an application as root when a restricted user is sufficient?
10. What would df -h help you investigate?

**Completion rule:** You should be able to navigate a Linux server, inspect files and ownership, interpret basic permissions, and explain when sudo is appropriate.

## Official references

- [Ubuntu command-line cheat sheet](https://ubuntu.com/server/docs/reference/cli-cheatsheet/)
- [Ubuntu terminal tutorial](https://ubuntu.com/server/docs/tutorial/welcome-to-the-terminal/)
- [Ubuntu user management](https://ubuntu.com/server/docs/security-users/)
- [Debian permissions overview](https://wiki.debian.org/Permissions)
