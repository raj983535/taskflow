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

## Phase 2 final checkpoint

After studying both lessons, explain these six items in your own words:

1. Explain the difference between Git and GitHub.
2. Describe the working tree, staging area, and local repository. Explain what `git add` and `git commit` each do.
3. Explain what a branch is and what `HEAD` identifies.
4. Compare `git fetch`, `git pull`, and `git push`. Explain what `origin/main` represents.
5. Describe a pull request, including its base branch, compare branch, review, approval, and automated checks.
6. Explain why merge conflicts occur and how you safely resolve one before completing the merge.

You should also be able to narrate this workflow without relying on a memorized command list:

```text
Update local main
  -> create a feature branch
  -> edit and inspect changes
  -> stage and commit
  -> push the branch
  -> open a pull request
  -> review and checks
  -> resolve any conflict
  -> merge into main
  -> update local main
```

**Pass standard:** Your explanation should correctly connect the local Git workflow to GitHub collaboration. If an answer reveals a misunderstanding, revisit that specific section and try again. Do not install tools or change the repository just to pass this theory checkpoint.

## Completion

Both lesson documents and the combined checkpoint are published. Learner study and assessment are deliberately deferred until the full curriculum has been authored. See [Learning Progress](../learning-progress.md). Publication does not imply that the learner has passed the checkpoint.
