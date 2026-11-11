# Lesson 2.2 — GitHub Team Workflow

**Phase:** 2 — Git and GitHub Workflows  
**Goal:** Understand how a local Git repository connects to GitHub, how teams share changes safely, and how pull requests and merge conflicts fit into normal engineering work.

This lesson builds on Lesson 2.1. You should already understand commits, branches, the working tree, and the staging area.

## 1. Local repository versus remote repository

In Lesson 2.1, you learned that Git records commits in a local repository. But TaskFlow is hosted on GitHub, and a team needs a shared place to exchange commits.

A **remote** is a named reference to another repository. A remote is usually hosted on GitHub or another Git server.

```text
Your computer                              GitHub
+--------------------------+              +--------------------------+
| Local repository         |              | Remote repository        |
|                          |              |                          |
| working tree              |   push ----> | shared branch: main      |
| staging area              |              |                          |
| local commits             | <--- fetch -- | teammates' commits       |
| local branches            | <--- pull --- | remote branch updates    |
+--------------------------+              +--------------------------+
```

The local and remote repositories are separate copies. A commit on your computer does not instantly appear on GitHub. You choose when to share it.

## 2. The remote name: origin

When you clone a repository, Git normally creates a remote named `origin`. It points to the URL from which you cloned.

Inspect configured remotes:

```powershell
git remote -v
```

- `remote` manages named repository connections.
- `-v` means verbose: show the URLs used for fetch and push.

The word `origin` is a conventional name, not a special server or a fixed GitHub address. A repository can have multiple remotes.

For the TaskFlow repository, the remote URL is the GitHub repository address:

```text
https://github.com/raj983535/taskflow.git
```

Do not expose credentials embedded in a remote URL. Use a secure authentication method supported by GitHub, such as a credential manager or SSH key.

## 3. Clone: get the repository onto your computer

To create your local working copy:

```powershell
git clone https://github.com/raj983535/taskflow.git
cd taskflow
```

- `git clone` downloads the repository and sets up the local Git metadata.
- The URL identifies the repository.
- `cd taskflow` moves PowerShell into the downloaded folder.

After cloning, verify:

```powershell
git status
git remote -v
git branch --show-current
```

Cloning is usually a one-time setup for each working directory. You do not need to reclone after every change.

## 4. Local branches and remote-tracking branches

These branch types are related but different:

- **Local branch:** a branch you work on in your local repository, such as `main` or `feature/task-filter`.
- **Remote-tracking branch:** your local record of where a branch on a remote was last observed, such as `origin/main`.
- **Remote branch (on GitHub):** the branch stored in the remote repository.

`origin/main` does not mean you are currently working on the remote computer. It is a local reference showing the last known state of GitHub's `main` branch.

Inspect branches:

```powershell
git branch
git branch -r
git branch -a
```

- `git branch` lists local branches.
- `-r` lists remote-tracking branches.
- `-a` lists both local and remote-tracking branches.

## 5. The four remote commands you must understand

### Fetch: download information without integrating it

```powershell
git fetch origin
```

Fetch downloads new commits and updates your remote-tracking references. It does not merge those changes into your current branch or rewrite your working files.

Use it when you want to learn what changed on GitHub before deciding how to integrate it.

### Pull: fetch and integrate

```powershell
git pull
```

Pull obtains remote changes and integrates them into your current branch according to its upstream and your Git configuration. Conceptually, it combines a fetch step with an integration step.

For a conservative update of a local branch when you expect it can move forward without divergence, you can use:

```powershell
git pull --ff-only
```

- `--ff-only` allows the update only when Git can move the current branch forward without creating a merge commit.
- If local and remote history have diverged, this command stops rather than guessing how you want to integrate them.

Do not run `git pull` blindly in the middle of uncommitted work. Check `git status` first and understand what branch you are updating.

### Push: upload your local commits

```powershell
git push
```

Push sends local commits to the configured remote branch, subject to access permissions and repository rules. It does not mean that a pull request has been reviewed or merged.

When publishing a new branch for the first time, use:

```powershell
git push -u origin feature/task-filter
```

- `origin` identifies the remote.
- `feature/task-filter` is the branch being published.
- `-u` sets the upstream relationship so future `git push` and `git pull` commands can usually infer the remote branch.

### Quick comparison

| Command | Main purpose | Automatically changes your current working files? |
|---|---|---|
| `git fetch origin` | Download remote commits and update remote-tracking refs | No |
| `git pull` | Fetch and integrate remote changes into the current branch | It can |
| `git push` | Publish local commits to the remote | No; it updates the remote |

A common source of confusion is thinking fetch and pull are identical. Fetch updates your information about the remote. Pull also integrates remote changes into the current branch.

## 6. The team workflow: feature branch to pull request

A team should avoid having everyone make feature changes directly on the shared `main` branch.

A typical workflow looks like this:

```text
             GitHub: main
                  |
          create feature branch
                  |
                  v
        feature/task-filter
                  |
          edit, stage, commit
                  |
              git push
                  |
                  v
          Open a Pull Request
                  |
         review + discussion + checks
                  |
             approved?
              /     \
            no       yes
            |         |
         revise    merge PR
            |         |
            +-----> main
```

### Step-by-step example

**Step 1 — Start from an updated main branch**

```powershell
git switch main
git pull --ff-only
git status
```

This switches to `main`, attempts a fast-forward-only update, and checks your working tree. If the pull stops because histories diverged, pause and inspect the situation instead of forcing it.

**Step 2 — Create a feature branch**

```powershell
git switch -c feature/task-filter
```

Now your changes are isolated from `main`.

**Step 3 — Make a focused change and commit it**

```powershell
git status
git diff
git add src/components/TaskFilter.tsx
git diff --staged
git commit -m "feat: add task filter"
```

The path is an illustrative future TaskFlow source file. It does not exist in the current documentation-only repository.

**Step 4 — Publish the branch**

```powershell
git push -u origin feature/task-filter
```

The branch is now available on GitHub. You have not yet merged it into `main`.

**Step 5 — Open a pull request on GitHub**

A **pull request (PR)** is a proposal to merge changes from one branch into another. For this example:

- **Base branch:** `main` — the branch that should receive the changes.
- **Compare branch:** `feature/task-filter` — the branch containing the proposed work.

A pull request is not simply a command to upload files. It gives the team a place to inspect the changes, discuss the reasoning, request improvements, and check whether the work is ready to merge.

A useful PR description should explain:

- What changed?
- Why was it necessary?
- How was it checked?
- Is there anything a reviewer should pay particular attention to?

**Step 6 — Review the proposed changes**

Reviewers should inspect the actual diff and consider:

- Does the change solve the stated problem?
- Is the implementation understandable and consistent with the project?
- Are there security, privacy, or data-integrity risks?
- Are relevant tests or checks included?
- Are there unrelated changes that should be removed?

A review can approve the change, leave comments, or request changes. The author can push more commits to the same PR branch; the PR updates with those new commits.

**Step 7 — Merge after requirements are satisfied**

Once the discussion is resolved and required checks/approvals are satisfied, an authorized contributor can merge the PR. GitHub supports different merge methods depending on repository settings.

After the merge, update your local `main` branch:

```powershell
git switch main
git pull --ff-only
```

You may then delete the local feature branch after confirming the PR is merged:

```powershell
git branch -d feature/task-filter
```

Do not delete a branch just because a PR exists. Confirm that the intended work has actually been merged or that the branch is no longer needed.

## 7. What a code review is for

A **code review** is an engineering discussion about a proposed change. It is not a personal judgement of the author.

A good review aims to catch defects and make the shared code easier to maintain. Comments should identify a concrete issue, explain why it matters, and suggest a direction when possible.

As an author:

- Keep the PR focused and reasonably small.
- Explain the purpose and relevant design choice.
- Respond to comments with evidence or a clear explanation.
- Make requested changes in the PR branch.
- Do not treat an approval as proof that a change is bug-free.

As a reviewer:

- Read the surrounding context, not just isolated lines.
- Check behavior, edge cases, security, and maintainability.
- Distinguish blocking defects from optional suggestions.
- Be specific and respectful.

A pull request can include automated checks such as tests, formatting, or builds. A green check is evidence that a configured check passed; it is not proof that every possible defect is absent.

## 8. Protect the main branch

The shared `main` branch is usually the stable integration line. GitHub can apply **branch protection rules** or repository rulesets to require conditions before changes can be merged.

Depending on the repository and its plan/settings, rules can require:

- Pull requests instead of direct pushes.
- One or more approving reviews.
- Passing status checks.
- Resolved review conversations.
- Restrictions on who can push or delete the branch.

The important engineering idea is to protect the central branch so changes are reviewed and validated before becoming part of the shared project.

For TaskFlow, we should adopt a simple rule when actual application development begins: feature work happens on a focused branch, and changes enter `main` through a reviewed pull request. We can configure the exact GitHub rules once the team and project checks are known.

## 9. Merge conflicts: why they happen

Git can automatically combine many changes. A **merge conflict** occurs when Git cannot safely decide how competing changes should be combined.

A common example:

- You change a sentence in `README.md` on your feature branch.
- Another contributor changes the same sentence on `main`.
- Git cannot know which wording the project should keep.

A conflict is not a Git failure that destroys the repository. It is a request for a person to decide what the final content should be.

### What conflict markers mean

A conflicted file may contain markers like:

```text
<<<<<<< HEAD
Current branch version
=======
Incoming branch version
>>>>>>> main
```

- `<<<<<<<` starts one side of the conflict.
- `=======` separates the competing versions.
- `>>>>>>>` ends the other side and labels its source.

These markers are temporary instructions for resolving the conflict. They should not remain in the final file.

### Basic command-line resolution flow

Suppose you are merging `main` into your feature branch and Git reports a conflict.

1. Check which files are conflicted:

```powershell
git status
```

2. Open each conflicted file in your editor. Decide on the correct final content. You may keep one side, the other side, or combine both. Remove all conflict markers.

3. Stage the resolved file:

```powershell
git add README.md
```

4. Check the status and review the resolution:

```powershell
git status
git diff --staged
```

5. Complete the merge if Git requires a merge commit:

```powershell
git commit
```

If the conflict occurred while updating a pull request branch, push the resolved commit:

```powershell
git push
```

Do not blindly choose "ours" or "theirs". The right final content depends on what the project needs. If you do not understand the change, stop and ask the author or reviewer before resolving it.

Some simple conflicts can be resolved in GitHub's web editor. More complex ones are usually easier to resolve in a local clone and then push back to the pull request branch.

## 10. Merge, squash, and rebase at project level

GitHub may offer different ways to integrate a pull request. The repository settings determine which options are available.

- **Merge commit:** joins the branch histories and records a merge commit.
- **Squash and merge:** combines the PR's commits into one commit on the target branch.
- **Rebase and merge:** reapplies the PR commits onto the target branch to create a linear sequence.

These are different ways of organizing project history. None is universally best for every team. For TaskFlow, we can use the repository's chosen default rather than spending time on advanced history rewriting now.

A key safety rule: do not rewrite commits that other people already depend on unless the team explicitly agrees. Avoid force-pushing shared branches, especially `main`.

## 11. Fork versus clone

These terms are not interchangeable:

- **Clone:** downloads a repository to your computer.
- **Fork:** creates a separate GitHub repository under another account or organization.

A contributor with write access to a shared repository may create a feature branch in that repository and open a PR. A contributor without write access often forks the repository, pushes a branch to their fork, and opens a PR from the fork back to the original repository.

You clone a repository to work on it locally. You fork a repository on GitHub to create your own hosted copy.

## 12. Authentication and safe access

GitHub authentication is separate from the author name and email in Git configuration.

For Git operations over HTTPS, GitHub uses supported authentication methods rather than your account password. A credential manager can store and provide credentials securely. SSH keys are another supported option.

Safety rules:

- Never paste a personal access token into a source file or commit.
- Do not place passwords or tokens directly in a remote URL.
- Do not share private SSH keys.
- Use the smallest permissions needed.
- If a credential is exposed, revoke or rotate it; deleting the visible line in a later commit does not undo the exposure in history.

We will handle the specific authentication setup when we are ready to work locally. This lesson explains the workflow; it does not ask you to install or configure anything now.

## 13. A safe daily workflow checklist

Before starting work:

1. Check the current branch: `git branch --show-current`.
2. Check the repository state: `git status`.
3. Update your base branch: `git switch main` followed by `git pull --ff-only`.
4. Create a focused branch: `git switch -c feature/short-description`.

While working:

1. Make a small, related set of changes.
2. Inspect changes with `git diff`.
3. Stage intentionally with `git add <path>`.
4. Inspect the staged patch with `git diff --staged`.
5. Commit with a message that explains the change.

When sharing:

1. Publish the branch with `git push -u origin <branch>`.
2. Open a PR against the correct base branch.
3. Explain the change and how it was checked.
4. Respond to review feedback.
5. Merge only when the required checks and approvals are satisfied.

After merging:

1. Update local `main`.
2. Confirm the feature is present.
3. Delete the finished local feature branch when it is no longer needed.

## 14. Practice exercise: simulate a TaskFlow change

Assume TaskFlow has a new feature request: users need to filter tasks by status.

Describe the workflow from beginning to end:

1. How do you make sure your local `main` is current?
2. What branch would you create?
3. Which commands would you use to inspect and commit your work?
4. How would you publish the branch to GitHub?
5. What is the base branch and compare branch of the pull request?
6. What should a reviewer inspect?
7. What would you do if Git reports a conflict in a file that both you and another contributor edited?
8. After the pull request is merged, how do you bring the updated `main` to your computer?

You do not need an application source code file to answer this exercise. The goal is to understand the collaboration sequence.

## 15. Knowledge checkpoint

Explain these concepts in your own words:

1. What is a remote, and why is `origin` commonly used?
2. What is the difference between `origin/main` and your local `main`?
3. What does `git fetch` do that `git pull` does not do by itself?
4. What does `git push -u origin feature/task-filter` do?
5. What is a pull request, and why is it useful?
6. What are the base branch and compare branch?
7. What does a reviewer check, and what is the difference between approval and automated checks?
8. Why might Git report a merge conflict?
9. What should you do with conflict markers before staging the resolution?
10. What is the difference between a fork and a clone?

**Completion rule:** You should be able to narrate the full path from a local feature branch to a reviewed pull request merged into `main), and explain the purpose of fetch, pull, push, reviews, and conflict resolution. A memorized command list alone is not enough.

## Official references

- [GitHub Docs — Pull requests](https://docs.github.com/en/pull-requests)
- [GitHub Docs — About pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
- [GitHub Docs — Merge conflicts](https://docs.github.com/en/pull-requests/reference/merge-conflicts)
- [GitHub Docs — Resolve a merge conflict using the command line](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/resolving-a-merge-conflict-using-the-command-line)
- [GitHub Docs — Protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [git clone](https://git-scm.com/docs/git-clone)
- [git pull](https://git-scm.com/docs/git-pull)
