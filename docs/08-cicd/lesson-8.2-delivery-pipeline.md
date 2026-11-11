# Lesson 8.2 — Delivery Pipeline

**Phase:** 8 — CI/CD with GitHub Actions  
**Goal:** Understand how a validated code change becomes a versioned container image and how an approved release can be deployed to AWS safely.

## Start here: validation is not the same as deployment

Lesson 8.1 explained how automated checks run when code changes. This lesson follows the next stage: how a version that passed those checks becomes a release on AWS.

Keep three results distinct:

- **CI passed:** the checked code met the configured validation steps.
- **Image published:** a container image was stored in a registry such as ECR.
- **Deployment verified:** the hosting environment is running the intended release and the application behaves as expected.

A green check on GitHub does not by itself mean that production is healthy. Every stage needs its own evidence.


## 1. From CI checks to delivery

Lesson 8.1 explained how GitHub Actions validates code.

Now imagine the checks pass and TaskFlow is ready for release.

The delivery path may be:

    Pull request merged
          |
          v
    CI validation
          |
          v
    Build application
          |
          v
    Build Docker image
          |
          v
    Publish image to ECR
          |
          v
    Approve deployment
          |
          v
    Deploy to AWS
          |
          v
    Verify health and release result

A deployment pipeline should not simply run commands because a branch changed. It should verify what is being deployed, which environment is targeted, and which identity is allowed to perform the operation.

## 2. Understand the release stages

A practical pipeline can be separated into stages:

| Stage | Purpose |
|---|---|
| Source | Identify the exact source commit |
| Validate | Run lint, type checks, tests, and security checks |
| Build | Compile frontend/backend and build container images |
| Publish | Push versioned images to a registry such as ECR |
| Approve | Wait for the required production review if configured |
| Deploy | Update the application environment to use the release |
| Verify | Check service health and basic application behavior |
| Roll back | Restore a previous known-good release if the new one fails |

Not every stage has to be a separate GitHub Actions job. The separation is a mental model that helps keep each responsibility clear.

## 3. Build once and identify the release

A **release artifact** is the output that will be delivered, such as a container image.

A good pipeline should identify the exact source commit and image that were tested.

For example, an image tag might include:

- A release version.
- A short Git commit SHA.
- A build number.

A Git commit SHA provides a strong link between source and the build. An image digest identifies the exact content stored in the registry.

Avoid deploying a moving tag such as latest without recording which exact image content was selected.

The principle is: know exactly which build passed validation and deploy that same build.

## 4. Publish to Amazon ECR

The pipeline needs to authenticate to AWS and push the image into the correct ECR repository.

A high-level sequence:

1. Authenticate the workflow to AWS.
2. Obtain permission to push to the intended ECR repository.
3. Log in to the ECR registry.
4. Tag the built image.
5. Push the image.
6. Record the published image reference or digest.

The role should not have unrestricted access to every AWS service. Scope it to the required repository and operations.

ECR stores the image; it does not run the application. A compute service later pulls the image and starts the container.

## 5. OIDC: access AWS without long-lived keys

A GitHub Actions workflow can authenticate to AWS using **OpenID Connect (OIDC)**.

OIDC is an identity federation protocol that lets one system provide a verifiable identity token to another system.

The rough flow:

    GitHub Actions workflow
             |
             | request short-lived identity token
             v
       GitHub OIDC provider
             |
             | signed token
             v
          AWS STS
             |
             | validate trusted identity
             v
        Assume IAM role
             |
             v
    Temporary AWS credentials
             |
             v
        Access allowed AWS resources

AWS STS means Security Token Service. It provides temporary security credentials when a trusted identity is allowed to assume a role.

Why is this useful?

Without OIDC, a workflow might need long-lived AWS access keys stored as repository secrets. If those keys leak, they can be used until revoked or expired.

With OIDC, GitHub can request a short-lived identity token, and AWS can exchange it for temporary role credentials.

GitHub's AWS OIDC guide: https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws

## 6. Trust policy and permissions

OIDC is not safe merely because it uses a signed token.

AWS must be configured to trust the intended GitHub identity. The IAM role trust policy should restrict which repository, branch, workflow environment, or other supported claims can assume the role.

The role's permission policy should also be narrow.

For example, a publish role may need permission to upload image layers to one ECR repository. It should not need permission to modify IAM users or delete unrelated databases.

Two separate controls matter:

- **Trust policy:** who is allowed to assume the role?
- **Permissions policy:** what may the assumed role do?

Do not create an OIDC trust policy with broad conditions that allow unrelated repositories or workflows to obtain deployment credentials.

AWS and GitHub's OIDC configuration guidance includes the required token permission and trust-policy restrictions.

## 7. Deployment environments and approvals

A release to development may be automatic. A release to production may need review.

GitHub environments can protect deployment jobs with rules such as:

- Required reviewers.
- Selected deployment branches.
- Environment-specific secrets.
- Deployment history.

A production workflow should not receive production credentials during an untrusted pull request check.

A safe process might be:

    Merge to main
         |
         v
    Build and publish image
         |
         v
    Production deployment job waits
         |
         v
    Required reviewer approves
         |
         v
    Job receives authorized environment access
         |
         v
    Deploy release

The exact protection features depend on GitHub repository settings and plan.

## 8. Deployment depends on the hosting platform

Publishing an image to ECR is not the same as deploying it.

The deployment stage must tell the hosting platform to run the new image.

Possible choices include:

- Updating a container on an EC2-hosted Docker environment.
- Updating an ECS service.
- Using another supported container hosting platform.

TaskFlow's final compute choice must be confirmed before a real pipeline is written. The repository's current plan studies EC2 and container concepts first; the actual choice should consider cost and operational complexity.

A deployment job may need to:

1. Identify the image digest.
2. Update the target service to that image.
3. Wait for the deployment to finish.
4. Check service and target health.
5. Report success or failure.

## 9. Verification after deployment

A deployment command returning success does not prove that users can use the application.

Verification should check:

- Did the intended image become active?
- Are the containers or tasks running?
- Are the load balancer targets healthy?
- Can the frontend be loaded through HTTPS?
- Can the API return a basic health response?
- Can the API connect to the database?
- Do important logs contain errors?
- Did the release change the expected application behavior?

A health endpoint should be designed deliberately. Avoid exposing private configuration, environment values, or detailed internal errors in public health responses.

## 10. Rollback

A **rollback** means returning the application to a previously working version.

Suppose release 1.5 deploys successfully at the infrastructure level but causes login failures.

If release 1.4 is still available and its database/application compatibility permits it, the team may deploy the previous image or revision.

A rollback plan should identify:

- The previous known-good image or release.
- How to restore it.
- Whether database migrations are backward-compatible.
- How to verify recovery.
- Who is allowed to make the rollback decision.

Database changes make rollback more complicated. A code rollback cannot necessarily undo a destructive database migration. Design migrations with compatibility and recovery in mind.

## 11. A high-level TaskFlow workflow shape

This is a conceptual workflow, not a ready-to-run YAML file:

    on:
      pull_request to main:
        validate and test

      push to main:
        validate
        build frontend/backend
        build container images
        publish images to ECR
        request production approval
        deploy selected image
        verify health

A real workflow must contain the correct project package commands, Docker build contexts, image names, AWS Region, ECR repository, IAM role ARN, target service, and secrets configuration. Those values do not exist yet because TaskFlow source code and deployment resources have not been implemented.

## 12. Security rules for delivery pipelines

- Use minimum GITHUB_TOKEN permissions.
- Do not expose deployment credentials to untrusted pull request code.
- Prefer OIDC and short-lived AWS credentials.
- Restrict IAM trust policies to the intended repository and branch/environment.
- Pin and review third-party actions.
- Avoid printing secrets or writing them into artifacts.
- Protect production environments.
- Deploy an identified image digest or release version.
- Keep a rollback path.

## 13. Cost and reliability

GitHub Actions usage, runner time, artifact storage, AWS compute, image storage, data transfer, and deployment services can all create costs.

A pipeline that runs expensive builds on every trivial event may waste time and money.

Use sensible triggers, dependency caching where useful, and limited artifact retention. Keep deployment jobs separate from pull request tests so that untrusted changes cannot accidentally deploy.

## 14. Common beginner mistakes

- **Thinking a green CI check means production deployment succeeded:** CI validates code; deployment is a separate operation.
- **Pushing an image and assuming it is running:** ECR stores images; a compute platform runs them.
- **Using long-lived cloud keys in workflow YAML:** use OIDC where supported.
- **Trusting every repository with an AWS role:** restrict the trust relationship.
- **Giving a deployment role administrator access:** scope permissions to the required resources.
- **Deploying latest without a release record:** identify the exact image or digest.
- **Skipping post-deployment checks:** verify the service and application after deployment.
- **Ignoring database migration compatibility:** rollback can fail if schema changes are not compatible.

## Guided example: follow one approved TaskFlow release

Imagine a pull request has been reviewed and merged into main.

1. **Identify the source:** the workflow records the exact commit SHA that will be built.
2. **Validate:** lint, type checks, tests, and application builds run.
3. **Build once:** the pipeline creates the TaskFlow image from that commit.
4. **Tag and publish:** the image receives an identifiable release tag and is pushed to ECR. The resulting image digest identifies the exact image content.
5. **Authenticate to AWS:** the workflow requests a GitHub OIDC identity token. AWS STS validates the token against the IAM role trust policy and issues temporary credentials if the claims meet the configured conditions.
6. **Deploy:** the deployment job tells the selected compute platform to use that exact image reference.
7. **Verify:** check deployment status, healthy targets, a basic API response, frontend access, and database connectivity.
8. **Recover if needed:** if the release causes user impact, use the approved rollback process to return to a known-good release, while considering whether any database migration is compatible with rollback.

### Trust policy versus permissions policy

These answer different questions:

- The **trust policy** controls which identity is allowed to assume the IAM role. Restrict it to the intended GitHub repository and branch or environment conditions.
- The **permissions policy** controls what the role can do after it is assumed, such as pushing to one ECR repository or updating one deployment target.

Do not store long-lived AWS access keys in the workflow when OIDC and a properly scoped role can be used. Do not expose deployment credentials to untrusted pull request code.

### What does a failed stage tell you?

- CI failure: the change has not passed the required checks; do not publish/deploy it.
- ECR push failure: inspect registry login, repository name, AWS role trust, and push permissions.
- Deployment failure: inspect the target platform's deployment events and image reference.
- Health-check failure: inspect application startup, ports, readiness endpoint, configuration, and database connection.
- Application regression after a healthy deployment: verify real user journeys and consider rollback.

The TaskFlow compute platform has not yet been selected, so a final deploy command or live workflow would be premature. The pipeline stages and security boundaries are the concepts to retain.

## 15. Knowledge checkpoint

1. What are the main stages between a merged pull request and a deployed release?
2. Why should a release be tied to a specific commit and image digest?
3. What is ECR's role in the pipeline?
4. What does OIDC solve?
5. What is AWS STS?
6. What is the difference between an IAM role trust policy and its permissions policy?
7. Why must the trust policy restrict the repository and workflow identity?
8. How can a GitHub environment add a production approval gate?
9. What does post-deployment verification check?
10. Why can a database migration make rollback difficult?

**Completion rule:** You should be able to narrate a secure pipeline from source validation through image publication, AWS authentication, deployment, verification, and rollback.

## Official references

- [GitHub Actions OIDC with AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)
- [GitHub Actions concepts](https://docs.github.com/en/actions/concepts)
- [GitHub Actions security hardening](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
- [AWS IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Configure AWS credentials action](https://github.com/aws-actions/configure-aws-credentials)
