# Phase 2 — Git and GitHub Workflows

**Two focused lessons.** This phase teaches how to record work safely on your computer and how to collaborate through GitHub without losing changes or making the main branch unstable.

Git and GitHub are related, but they are not the same thing:

- **Git** is the version-control system. It records project history on your computer.
- **GitHub** is a hosting and collaboration platform. It stores remote repositories and adds pull requests, reviews, issues, and team controls.

## What you will be able to do

By the end of these lessons, you should be able to:

- Explain the working tree, staging area, local repository, commits, branches, and `HEAD`.
- Inspect changes before recording them.
- Make useful commits and understand what a commit contains.
- Create and switch branches safely.
- Explain local branches, remote branches, and tracking branches.
- Clone a repository, fetch remote updates, pull changes, and push your work.
- Open a pull request, understand a review, and resolve a basic merge conflict.
- Follow a safe team workflow that protects the shared `main` branch.

## Lesson sequence

| Lesson | Topic | Main outcome |
|---|---|---|
| 2.1 | [Git fundamentals](lesson-2.1-git-fundamentals.md) | Understand local repository structure, the file lifecycle, commits, history, and branches |
| 2.2 | [GitHub team workflow](lesson-2.2-github-team-workflow.md) | Work with remotes, pull requests, reviews, and merge conflicts |

## Recommended learning order

1. Complete Lesson 2.1 first. It explains what Git is recording and how local history works.
2. Complete Lesson 2.2 next. It builds on commits and branches to explain collaboration through GitHub.
3. Complete the short Phase 2 workflow exercise and checkpoint in Lesson 2.2.

The command examples use **Windows PowerShell** and modern Git commands such as `git switch`. The same Git concepts apply on macOS and Linux.

## What we are not covering

This phase is not a deep dive into Git's internal object formats, advanced history rewriting, submodules, hooks, Git LFS, complex release branching, or every possible merge strategy. Those topics are outside TaskFlow's current needs. We will return to a specialist feature only if implementation creates a real requirement.

## Completion

Study material for both lessons is published. The learning checkpoints are recorded separately in [Learning Progress](../learning-progress.md). A published lesson is not automatically a passed learner checkpoint.
