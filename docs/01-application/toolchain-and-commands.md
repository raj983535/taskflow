# Development Toolchain and Commands

**Status:** Theory and command reference. Do not install or run anything for this lesson unless we explicitly begin a practical exercise.

## 1. Runtime, package manager, and project manifest

A development toolchain is the set of tools used to create, run, check, and package an application.

For the proposed JavaScript/TypeScript stack:

- **Node.js** is the runtime that executes JavaScript outside the browser.
- **npm** is a package manager distributed with Node.js. It installs dependencies and runs scripts declared by a project.
- **package.json** is a project manifest. It describes project metadata, dependencies, and named scripts.
- **node_modules** is a directory commonly used to store installed JavaScript packages.
- **TypeScript compiler/tooling** checks TypeScript and transforms it into JavaScript or supports a build tool that does so.

The exact runtime version and package versions should be chosen from supported releases when implementation begins, not frozen prematurely in theory notes.

## 2. Understand a command before running it

A command usually has:
- A program name, such as `node`, `npm`, `git`, or `psql`.
- A command or subcommand, such as `--version`, `install`, or `run`.
- Optional flags, such as `--help`.
- Optional arguments, such as a package name or file path.

The command's working directory can matter. For example, npm looks for a project manifest in the current directory or its parent directories according to its command behavior.

## 3. Read-only version and help commands

These commands are common ways to inspect tools:

```powershell
node --version
npm --version
git --version
npm --help
```

- `--version` asks a program to print its version.
- `--help` asks a program to describe available commands and options.
- These are informational commands; they do not create the application.

## 4. Common npm command patterns

```powershell
npm install
npm install <package-name>
npm uninstall <package-name>
npm run <script-name>
```

Meaning:
- `npm install` installs the dependencies declared by the project manifest.
- `npm install <package-name>` adds a dependency to the project and installs it.
- `npm uninstall <package-name>` removes a dependency from the project manifest and installed packages.
- `npm run <script-name>` executes a named script that the project author defined in `package.json`.

Important: a script such as `dev`, `test`, or `build` is not a universal npm command. It exists only when the project defines it.

## 5. Environment variables

An environment variable is a named value made available to a process at runtime. It is often used for configuration that differs between environments, such as:
- Port numbers.
- Database connection settings.
- Public application URLs.
- Secret keys and credentials.

A local `.env` file is one common way to provide environment variables during development, but it is not itself a security boundary. Real secrets must not be committed to Git or exposed in browser-delivered frontend variables.

## 6. Database command-line client

PostgreSQL provides a command-line client named `psql`. A connection command can look like this:

```powershell
psql -h 127.0.0.1 -p 5432 -U <database-user> -d <database-name>
```

Conceptually:
- `-h` selects the database host.
- `-p` selects the port.
- `-U` selects the database user.
- `-d` selects the database name.

This example only makes sense after PostgreSQL is installed and a database exists. It does not create either one by itself.

## 7. Safe command habits

Before running a command in a later practical lesson:
1. Confirm the current directory.
2. Understand whether it reads, creates, changes, or deletes something.
3. Check whether it installs packages, consumes network data, or creates cloud charges.
4. Check whether administrator permissions are required.
5. Know what output or state change should confirm success.
6. Know how to stop or undo it where possible.

Commands that delete files, change permissions, alter a database, expose a service, or provision paid resources deserve extra care.
