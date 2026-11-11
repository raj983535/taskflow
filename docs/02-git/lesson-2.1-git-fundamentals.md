# Lesson 2.1 — Git Fundamentals

**Phase:** 2 — Git and GitHub Workflows  
**Goal:** Understand how Git records project history locally, how to inspect and stage changes, how commits work, and why branches are useful.

## 1. What problem does Git solve?

Imagine you are building TaskFlow. On Monday, the login page works. On Tuesday, you change the authentication flow and accidentally break it. On Wednesday, you want to compare the new version with Monday's working version.

Without version control, you might have folders such as:

- `taskflow-final`
- `taskflow-final-new`
- `taskflow-final-fixed`
- `taskflow-final-fixed-2`

This quickly becomes confusing. You do not know exactly what changed, when it changed, or which copy is reliable.

**Git solves this by keeping a history of project snapshots.** You can inspect changes, record a known state, compare versions, and move between branches of work.

Git is a **distributed version-control system**. A local clone has its own repository history; you can create commits locally without an internet connection. Sharing those commits with GitHub is a separate operation, covered in Lesson 2.2.

## 2. Git is not GitHub

| Git | GitHub |
|---|---|
| Version-control software | Hosted platform for repositories and collaboration |
| Runs on your computer | Runs as an online service |
| Records local commits and branches | Stores remote copies and provides pull requests, reviews, issues, and permissions |
| Can work offline after a repository exists | Requires a network connection for online collaboration |

Think of Git as the tool that records the history of your work. GitHub is one place where that repository can be shared with other people.

Other hosting services exist, but the Git concepts remain the same.

## 3. What is a Git repository?

A **repository** (often shortened to *repo*) is a project directory that Git is tracking, together with the history and metadata stored in its Git directory.

When you initialize a repository, Git creates a hidden `.git` directory. It stores the repository's internal data there, including objects, references, and configuration. Do not manually edit files inside `.git`.

A project folder can look like this:

```text
taskflow/
├── docs/
├── README.md
├── .gitignore
└── .git/             # Git's internal repository data
```

The files outside `.git` form the working copy you read and edit. The `.git` directory makes that working copy a Git repository.

### Two ways a repository commonly begins

**Create a repository from an existing folder:**

```powershell
cd C:\Projects\my-new-project
git init
```

- `cd` changes the current directory in PowerShell.
- `git init` creates an empty Git repository in the current directory. It does not automatically create a GitHub repository or upload files.

**Copy an existing remote repository:**

```powershell
git clone https://github.com/owner/repository.git
```

- `git clone` downloads a repository and its available history into a new local directory.
- The URL identifies the remote repository.
- A clone normally configures a remote named `origin`, which we will inspect in Lesson 2.2.

Use `git clone` when you are joining an existing project, as with TaskFlow. Use `git init` when you are starting version control inside a folder that is not already a Git repository. Do not run `git init` inside an existing clone just because you want to begin working.

## 4. The three important areas inside a local Git workflow

This is the central mental model for Git:

1. **Working tree:** the files you currently see and edit.
2. **Staging area (index):** the exact changes selected for the next commit.
3. **Repository history:** the commits already recorded by Git.

```text
                 You edit files
                       |
                       v
              +-------------------+
              |    Working tree   |
              | files on your disk|
              +-------------------+
                       |
              git add <path>
                       |
                       v
              +-------------------+
              |   Staging area    |
              | changes selected |
              +-------------------+
                       |
             git commit -m "..."
                       |
                       v
              +-------------------+
              | Local repository  |
              | recorded history  |
              +-------------------+
```

The staging area is a selection step. It lets you decide what belongs in the next commit instead of automatically recording every change in the folder.

A useful analogy:

- Working tree = your draft.
- Staging area = the exact pages you have selected for submission.
- Commit = the saved, named record of those selected pages.

A commit records what was staged when you created it. If you change a file after staging it, that newer edit is not automatically included. Stage it again to include the newer version.

## 5. Understand the file states

Git commonly reports files using these states:

| State | Meaning | Example |
|---|---|---|
| Untracked | Git sees the file but is not tracking it yet | You create `notes.md` |
| Modified | A tracked file differs from the last committed version | You edit `README.md` |
| Staged | You selected the current version of a change for the next commit | You run `git add README.md` |
| Committed | The selected snapshot has been recorded in local history | You run `git commit` |

The words *tracked* and *untracked* describe whether Git is following a file. The words *modified* and *staged* describe changes relative to the latest commit and the staging area.

### Inspect before you record

```powershell
git status
```

Shows the current branch and the state of files. This should be one of your most frequently used Git commands.

```powershell
git status -sb
```

- `-s` means short output.
- `-b` includes branch information.
- Together, they provide a compact status view.

## 6. The basic daily Git workflow

Imagine you update TaskFlow's project documentation.

**Step 1 — Inspect the repository**

```powershell
git status
```

Read the output before doing anything else. Check which branch you are on and which files have changed.

**Step 2 — Inspect the actual differences**

```powershell
git diff
```

Shows unstaged changes: the difference between the working tree and the staging area.

**Step 3 — Stage only the changes you intend to record**

```powershell
git add README.md
```

Stages the change to that specific file. You can stage multiple named files:

```powershell
git add README.md docs/learning-progress.md
```

You may see `git add .` in tutorials. The dot means the current directory and its contents. It can stage many files at once, so inspect `git status` first and be careful not to stage generated files, secrets, or unrelated work. For learning, staging named files is easier to reason about.

**Step 4 — Inspect what is staged**

```powershell
git diff --staged
```

Shows what will go into the next commit. It is different from plain `git diff`, which shows changes not yet staged.

**Step 5 — Record a commit**

```powershell
git commit -m "docs: update project setup guide"
```

- `commit` records the staged snapshot in local history.
- `-m` supplies the commit message directly instead of opening a text editor.
- The message briefly describes the purpose of the change.

**Step 6 — Verify the result**

```powershell
git status
git log --oneline -5
```

The first command checks whether anything remains uncommitted. The second displays the five most recent commits in compact form.

### The full cycle

```text
Edit → status → diff → add → diff --staged → commit → verify
```

Git does not automatically commit your changes. A file being saved in VS Code is not the same as being staged or committed.

## 7. What exactly is a commit?

A **commit** is a recorded snapshot of the project at a point in its history, with information such as:

- The content snapshot being recorded.
- A unique identifier (commit hash).
- The author and committer information.
- A commit message.
- A link to its parent commit or commits.

Normal commits usually point to the commit that came before them. This creates a history you can inspect.

Useful commands:

```powershell
git log --oneline
git log --oneline --decorate --graph --all
git show
git show <commit-hash>
```

- `git log --oneline` shows compact commit history.
- `--decorate` shows labels such as branch names.
- `--graph` draws a simple text graph of commit relationships.
- `--all` includes history reachable from all local references.
- `git show` displays details and changes from a commit.
- Replace `<commit-hash>` with the actual hash you want to inspect. The angle-bracket text is a placeholder, not something to type literally.

Do not think of a commit as a screenshot of the entire computer. It records a project snapshot and history metadata inside the repository; it does not record every file on your machine or every untracked file.

## 8. Configure your Git identity

Git needs an author name and email for commits. These identify the person associated with the commit; they are not your GitHub password or authentication token.

```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

- `config` edits Git configuration.
- `--global` applies the setting to your user account on this computer, across your repositories.
- Without `--global`, a setting can be applied only to the current repository.

Check the configured values:

```powershell
git config --global --list
```

If you want your commits attributed to GitHub while keeping your personal email private, GitHub offers a no-reply email address in account settings. Configure the exact address GitHub provides; do not guess one.

Git identity is separate from GitHub sign-in. A name and email do not grant permission to push to a repository.

## 9. Ignore files that should not be committed

A `.gitignore` file tells Git which **untracked** files or paths to ignore. It is commonly used for:

- Environment files containing secrets.
- Installed dependencies.
- Build output.
- Logs and temporary files.
- Local editor or operating-system clutter.

A simplified example for a future Node.js project:

```gitignore
node_modules/
dist/
coverage/
.env
.env.*
!.env.example
*.log
```

What the patterns mean:

- `node_modules/` ignores the dependency directory.
- `dist/` ignores generated build output.
- `coverage/` ignores test coverage output.
- `.env` ignores a typical local environment file.
- `.env.*` ignores other environment variants.
- `!.env.example` makes an example environment template an exception, so it can be committed.
- `*.log` ignores files ending in `.log`.

**Important:** `.gitignore` does not remove a file that Git is already tracking. If a secret was committed, adding its filename to `.gitignore` is not enough. Remove the secret from the repository history as appropriate, rotate the exposed credential immediately, and follow the incident process. Never put a real password, API key, token, or private key in TaskFlow's Git history.

## 10. Branches: separate lines of work

A **branch** is a lightweight movable reference to a commit. It gives you a separate line of development so you can work on a feature without making unfinished changes directly on the main branch.

For example:

- `main`: the shared, stable project line.
- `feature/task-filter`: work to add task filtering.
- `fix/login-validation`: work to correct login validation.

Create a branch and switch to it:

```powershell
git switch -c feature/task-filter
```

- `switch` changes the branch currently checked out.
- `-c` means create a new branch and switch to it.
- `feature/task-filter` is the new branch name.

See the current branch:

```powershell
git branch --show-current
git branch
```

Switch to an existing local branch:

```powershell
git switch main
```

A branch does not make a second complete copy of the repository. It is a movable name pointing to a commit. When you commit while on that branch, that branch's pointer moves to the new commit.

### What is HEAD?

`HEAD` is Git's reference to the current checkout. In the normal situation, it points to the local branch you currently have checked out.

A compact history may look like this:

```text
A---B---C  main
         \
          D---E  feature/task-filter
                  ^
                 HEAD
```

In this example, `HEAD` is on `feature/task-filter`. New commits made here advance that branch, not `main`.

A branch switch can change files in your working tree to match the destination branch. Commit or safely store important work before switching. Git normally stops if a switch would overwrite conflicting local changes.

### Branch naming

Choose names that explain the purpose:

- `feature/task-filter`
- `fix/login-validation`
- `docs/deployment-guide`
- `chore/update-dependencies`

The exact convention can vary by team. Clear names matter more than one universal naming rule.

## 11. Undo carefully: staged versus unstaged changes

Two commands are useful to understand, but one can discard work:

**Unstage a file while keeping the edits in your working tree:**

```powershell
git restore --staged README.md
```

This removes the file's changes from the staging area. It does not discard the edited file from your working directory.

**Discard unstaged edits to a tracked file:**

```powershell
git restore README.md
```

This restores the file in your working tree to the version in the index. If the edits were not staged or otherwise saved, they can be lost.

Do not run the second command casually. First inspect `git status` and `git diff`. In this lesson, understand the difference; do not experiment with discard commands on important work.

## 12. How this applies to TaskFlow

TaskFlow is currently a documentation-first repository. The same habits will apply when application code is added:

1. Start from a known branch.
2. Inspect the repository before editing.
3. Create a focused branch for a change.
4. Make a small, related set of edits.
5. Review the diff.
6. Stage only the intended files.
7. Commit with a meaningful message.
8. Share the branch through GitHub, which is covered in Lesson 2.2.

A commit is a local history record. It is not yet uploaded to GitHub. Do not confuse `git commit` with `git push`.

## 13. Essential command reference

| Command | What it does |
|---|---|
| `git --version` | Displays the installed Git version |
| `git init` | Creates a repository in the current folder |
| `git clone <url>` | Copies an existing repository |
| `git status` | Shows branch and file states |
| `git diff` | Shows unstaged changes |
| `git add <path>` | Stages a file or directory |
| `git diff --staged` | Shows staged changes |
| `git commit -m "message"` | Records a commit from staged changes |
| `git log --oneline` | Shows compact history |
| `git show` | Inspects a commit |
| `git branch` | Lists local branches |
| `git switch <branch>` | Switches to an existing branch |
| `git switch -c <branch>` | Creates and switches to a branch |
| `git restore --staged <path>` | Unstages a path without removing its working-tree edits |
| `git restore <path>` | Discards unstaged working-tree edits for a path; use cautiously |

## 14. Common beginner mistakes

- **Thinking Git equals GitHub:** local commits do not automatically upload anywhere.
- **Committing without checking:** you may include unrelated, generated, or sensitive files.
- **Assuming `git add` means upload:** it only stages a local change.
- **Editing after staging and forgetting to stage again:** the newer edit will not be in the staged snapshot.
- **Using `git restore` without checking:** it can discard work.
- **Working directly on `main` for every feature:** this mixes unfinished work with the shared stable line.
- **Committing secrets:** removing a secret in a later commit does not erase the earlier exposure.

## 15. Practice exercise

This is a reasoning exercise first; you do not need to install anything or run commands during the theory phase.

Imagine you have cloned TaskFlow and changed two files: `README.md` and `docs/learning-progress.md`. You also created a local file called `.env` containing a test API key.

Explain the safe sequence you would use to inspect and stage only the two documentation files, review the staged content, and create a commit. Explain why `.env` must not be committed and why a local commit is not the same as uploading to GitHub.

Then imagine you need to add a task-filter feature. Explain why you would create `feature/task-filter` instead of implementing the feature directly on `main`.

## 16. Knowledge checkpoint

You should be able to answer these in your own words:

1. What is the difference between Git and GitHub?
2. What are the working tree, staging area, and local repository?
3. What does `git add` do, and what does it not do?
4. What is the difference between `git diff` and `git diff --staged`?
5. What does a commit record?
6. What is a branch, and what does `HEAD` identify?
7. What is the difference between `git switch -c` and `git switch`?
8. Why is a `.gitignore` file not a complete solution after a secret has already been committed?

**Completion rule:** You do not need to memorize every Git command. You should be able to explain the three areas, perform the basic edit-stage-commit reasoning, inspect history, and explain why branches protect the main line of work.

## Official references

- [Pro Git — What is Git?](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git)
- [Pro Git — Recording Changes to the Repository](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)
- [Pro Git — Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
- [git init](https://git-scm.com/docs/git-init)
- [git status](https://git-scm.com/docs/git-status)
- [git switch](https://git-scm.com/docs/git-switch)
- [gitignore](https://git-scm.com/docs/gitignore)
