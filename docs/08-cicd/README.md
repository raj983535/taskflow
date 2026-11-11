# Phase 8 — CI/CD with GitHub Actions

**Two focused lessons.** This phase explains how code changes can be checked automatically and how a reviewed application release can be built and delivered through a repeatable pipeline.

CI means Continuous Integration. CD commonly means Continuous Delivery or Continuous Deployment. The exact meaning depends on the team's process.

## Where Phase 8 fits in the bigger picture

**You already know:** Phase 2 introduced commits, branches, and pull requests. Phase 3 introduced container images. Phase 7 introduced the deployment destination.

**This phase adds:** automation that checks code and moves an identified release through build, publish, deploy, and verification.

Follow this chain:

```text
Git push / pull request
   -> workflow trigger
   -> runner + jobs + steps
   -> tests and build
   -> image published to ECR
   -> approved AWS identity
   -> deployment
   -> health verification
```

Lesson 8.1 explains the workflow and runner model. Lesson 8.2 follows a release and explains OIDC, permissions, approval, deployment, and rollback.

**Important boundary:** a CI check passing is not the same as production deployment succeeding. A published image is not yet a running application.

## Lesson sequence

| Lesson | Topic | Main outcome |
|---|---|---|
| 8.1 | [Pipeline fundamentals](lesson-8.1-pipeline-fundamentals.md) | Understand workflow files, events, jobs, steps, runners, actions, artifacts, permissions, and environments |
| 8.2 | [Delivery pipeline](lesson-8.2-delivery-pipeline.md) | Understand test, build, image publication, AWS authentication, deployment, and rollback flow |

## TaskFlow connection

A future TaskFlow pipeline may:

1. Run when code is pushed or a pull request is opened.
2. Install dependencies using the lockfile.
3. Run linting, type checks, and tests.
4. Build the frontend and backend.
5. Build container images.
6. Publish approved images to ECR.
7. Deploy to the chosen AWS compute platform.
8. Verify service health and report the result.

We will not create a live workflow until the actual application and tests exist.

## Practical boundary

- The repository is currently documentation-only. No real build/test/deploy workflow is claimed.
- Workflow YAML can execute commands and access secrets. Treat changes to workflows as security-sensitive code.
- Use minimal GITHUB_TOKEN permissions.
- Prefer OpenID Connect (OIDC) and short-lived AWS role credentials instead of long-lived AWS access keys stored as GitHub secrets.
- Restrict AWS role trust to the intended repository, branch, and/or deployment environment.
- Review action dependencies and pin third-party actions to a verified full commit SHA for production workflows.
- GitHub-hosted runner usage and artifact storage can have usage limits or charges depending on plan and configuration.

## Phase 8 integrated checkpoint

Explain:

1. What CI and CD mean.
2. What a workflow, event, runner, job, step, and action are.
3. How jobs and steps are connected and when jobs can run in parallel.
4. What artifacts and caches are used for.
5. How GITHUB_TOKEN permissions and repository secrets affect security.
6. How deployment environments and approval gates protect production.
7. How a pipeline tests and builds TaskFlow before publishing an image.
8. How OIDC lets GitHub Actions obtain short-lived AWS credentials without storing long-lived AWS keys.
9. Why the AWS trust policy must restrict which repository/workflow can assume the role.
10. How a failed deployment can be detected and rolled back.

**Pass standard:** You can explain the journey from a pull request to an approved release and identify which pipeline steps need permissions, secrets, and verification. Learner validation is deferred until the later study pass.

## Official references

- [GitHub Actions concepts](https://docs.github.com/en/actions/concepts)
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [Workflow artifacts](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts)
- [GitHub Actions security hardening](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
- [GitHub Actions OIDC with AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)

## Continue the roadmap

**Previous:** [Phase 7 — Cloud deployment](../07-deployment/README.md). **Next:** [Phase 9 — Monitoring and reliability](../09-monitoring/README.md).
