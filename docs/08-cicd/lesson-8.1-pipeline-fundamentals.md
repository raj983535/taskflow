# Lesson 8.1 — Pipeline Fundamentals

**Phase:** 8 — CI/CD with GitHub Actions  
**Goal:** Understand how GitHub Actions runs automated work when code changes.

## 1. Why automate project checks?

Imagine TaskFlow has several developers. One developer adds a feature. Another changes the database model. A third updates the frontend.

Before a change is merged into the shared branch, the team wants to check that:

- The code builds.
- The types are valid.
- Tests pass.
- Formatting and lint rules are satisfied.
- The change does not break an existing capability.

A person could run all these commands manually for every change, but that is easy to forget and difficult to repeat consistently.

A **CI pipeline** automates these checks.

CI means **Continuous Integration**. It is the practice of integrating small changes frequently and checking them using repeatable automated processes.

A **CD pipeline** continues beyond validation to prepare or deliver a release. CD can mean Continuous Delivery, where the software is always ready to deploy, or Continuous Deployment, where approved changes are deployed automatically.

## 2. What is GitHub Actions?

GitHub Actions is GitHub's automation platform. It can run tasks in response to repository events such as a push, pull request, release, or scheduled trigger.

A workflow is defined in a YAML file stored in the repository, normally under:

    .github/workflows/

Each YAML file defines an automation workflow.

A simplified flow:

    Developer pushes code
             |
             v
       GitHub event
             |
             v
       Workflow starts
             |
             v
          Runner
             |
             v
       Jobs and steps
             |
             v
        Checks finish
             |
             v
       Status reported to PR

The workflow is configuration. The runner is the environment where its jobs execute.

## 3. Essential terminology

| Term | Simple meaning |
|---|---|
| Workflow | The complete automation definition |
| Event/trigger | Something that starts a workflow |
| Runner | The machine/environment that executes a job |
| Job | A group of steps executed on a runner |
| Step | One command or action inside a job |
| Action | A reusable unit of automation |
| Artifact | A file or output saved by a workflow run |
| Cache | Saved dependencies or other files reused to speed up future runs |
| Secret | A protected value made available to an authorized workflow step |

A workflow can contain multiple jobs. A job contains steps. A step may run a shell command or call a reusable action.

## 4. Understand a simple workflow file

This is an illustrative workflow for a future Node.js project. The current TaskFlow repository has no application package.json or test scripts, so this example is not runnable in the current repository.

    name: TaskFlow CI

    on:
      pull_request:
        branches: [main]
      push:
        branches: [main]

    permissions:
      contents: read

    jobs:
      verify:
        name: Verify application
        runs-on: ubuntu-latest
        steps:
          - name: Check out repository
            uses: actions/checkout@v4

          - name: Set up Node.js
            uses: actions/setup-node@v4
            with:
              node-version: 22

          - name: Install dependencies
            run: npm ci

          - name: Run tests
            run: npm test

Read it from top to bottom:

**name**

A readable name for the workflow.

**on**

Defines the events that trigger the workflow.

Here, it runs when a pull request targets main or when a commit is pushed to main.

**permissions**

Controls what the built-in GitHub token can do. This example grants only read access to repository contents.

**jobs**

Defines the work to run. The job ID here is verify.

**runs-on**

Selects the runner environment. ubuntu-latest means a GitHub-hosted Ubuntu runner using the current image label. The exact image contents can change over time.

**steps**

The ordered tasks within the job.

**uses**

Calls a reusable action.

**with**

Supplies inputs to an action.

**run**

Executes shell commands on the runner.

The action version references shown are example major-version tags. A production workflow should review action provenance and pin dependencies appropriately, commonly to verified full commit SHAs.

## 5. What is a runner?

A runner is the machine that executes a workflow job.

Two broad options:

- GitHub-hosted runner: GitHub provides and maintains the execution environment.
- Self-hosted runner: the organization provides and manages the execution machine.

For TaskFlow's initial CI needs, a GitHub-hosted runner is likely simpler. Self-hosted runners introduce maintenance and security responsibilities and are not automatically cheaper or safer.

A runner receives the job, prepares its working directory, executes the steps, and reports the outcome.

Jobs normally run on separate runner environments. Do not assume that a file created by one job automatically exists in another job. Use artifacts or another explicit transfer mechanism when outputs need to move between jobs.

## 6. Jobs, steps, and dependencies

A workflow can contain multiple jobs:

    jobs:
      checks:
        runs-on: ubuntu-latest
        steps:
          - run: npm ci
          - run: npm test

      build:
        needs: checks
        runs-on: ubuntu-latest
        steps:
          - run: npm run build

The needs field says that build depends on checks. The build job starts only after the checks job succeeds.

Jobs without dependencies may run in parallel. Parallel jobs can reduce total workflow time, but they also consume runner usage and require clear inputs/outputs.

Steps within one job run in order. If a step fails, later steps in that job are normally skipped unless their condition says otherwise.

## 7. Events and triggers

Common GitHub Actions triggers include:

- push: code is pushed to a branch or tag.
- pull_request: a pull request is opened, synchronized, or changed according to the selected event types.
- workflow_dispatch: a user manually starts a workflow from GitHub.
- schedule: a workflow runs according to a cron schedule.
- release: a release event occurs.

Choose triggers deliberately. A deployment workflow should not publish production releases on every arbitrary branch push.

Pull request workflows from forks need particular care. Forked code is untrusted input. Do not expose deployment secrets to untrusted pull request code.

## 8. Artifacts and caches

These two terms are often confused.

**Artifact:** an output file retained from a workflow run, such as a test report, compiled package, or packaged build output.

**Cache:** data reused by later workflow runs to make repeated work faster, such as a dependency download cache.

A simplified distinction:

| Artifact | Cache |
|---|---|
| Preserves a workflow output for later download or jobs | Reuses data to speed up future work |
| Useful for reports and build outputs | Useful for dependency caches |
| Has an explicit retention/use case | Is an optimization, not a source of truth |

A cache miss should not break a correct build. The workflow must be able to recreate dependencies from its lockfile.

## 9. Environment variables and contexts

A workflow can use environment variables and GitHub contexts.

An **environment variable** is a named value available to a process.

A **context** is a structured set of values provided by GitHub Actions, such as the current branch, commit SHA, repository, or workflow run.

For example, a workflow might use the repository name or commit SHA to label a build.

Do not interpolate untrusted pull request titles, branch names, or user-provided text directly into shell scripts without safe handling. This can create command-injection risks.

## 10. Tokens, permissions, and secrets

The built-in GITHUB_TOKEN lets a workflow interact with GitHub according to the permissions granted to it.

Use the smallest permissions needed.

For example:

    permissions:
      contents: read

A workflow that only checks out source code does not need permission to delete repository contents.

A **secret** is a protected value, such as a deployment credential or signing key. Repository and environment secrets can be made available to workflows under the relevant rules.

Security rules:

- Do not print secrets into logs.
- Do not write them into artifacts.
- Do not place them in source files.
- Do not make them available to untrusted pull request code.
- Prefer short-lived identity federation over storing long-lived cloud access keys when supported.

GitHub security hardening guidance: https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions

## 11. Environments and approvals

A GitHub Actions environment can represent deployment targets such as development, staging, or production.

Environments can control secrets and apply protection rules, such as required reviewers or branch restrictions, depending on repository settings and plan availability.

A production workflow may require approval before its deployment job can access protected environment secrets or proceed.

This creates a separation:

- CI checks can run on pull requests.
- Production deployment can wait until changes are merged and approved.

## 12. How this applies to TaskFlow

A future TaskFlow CI workflow may:

1. Check out the source.
2. Set up the required Node.js version.
3. Install dependencies from lockfiles.
4. Run lint, type checks, and tests.
5. Build the frontend and backend.
6. Save useful reports or build artifacts.
7. Report check status to the pull request.

A separate deployment workflow can use approved release conditions and AWS authentication. That is Lesson 8.2.

## 13. Common beginner mistakes

- **Thinking a workflow is a runner:** the workflow describes automation; the runner executes it.
- **Confusing jobs and steps:** a job runs on a runner; steps are tasks within that job.
- **Assuming job files are shared:** transfer outputs explicitly using artifacts.
- **Giving GITHUB_TOKEN broad permissions:** grant the minimum required access.
- **Exposing secrets to fork pull requests:** untrusted code must not receive deployment credentials.
- **Treating cache as required output:** a cache should only optimize work.
- **Running deployment on every push:** restrict production deployment triggers and use approval gates.
- **Using unreviewed third-party actions:** actions execute code; verify and pin dependencies appropriately.

## 14. Knowledge checkpoint

1. What is CI, and why does TaskFlow need it?
2. What is the difference between a workflow and a runner?
3. What are a job and a step?
4. What does the on section configure?
5. What is the purpose of needs?
6. What is the difference between an artifact and a cache?
7. What is GITHUB_TOKEN, and why should permissions be limited?
8. What is a repository secret?
9. Why should fork pull request code not receive production secrets?
10. How can a GitHub environment protect production deployment?

**Completion rule:** You should be able to read a simple workflow YAML file and explain when it runs, where it runs, what work it performs, and which permissions it needs.

## Official references

- [GitHub Actions concepts](https://docs.github.com/en/actions/concepts)
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [Workflow artifacts](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts)
- [GitHub Actions security hardening](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
