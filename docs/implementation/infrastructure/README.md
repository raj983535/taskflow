# TaskFlow infrastructure and developer-environment guides

This folder explains tools and infrastructure used to develop, run, test, deliver, and operate TaskFlow.

## What belongs here

- Local development setup and required tools.
- Dependency and package-manager choices.
- Environment configuration and secret handling.
- Dockerfiles, images, containers, volumes, networks, and registries.
- Docker Compose and service-to-service communication.
- Linux server setup and SSH.
- AWS accounts, IAM, networking, compute, storage, and databases.
- DNS, HTTPS, reverse proxies, and deployment.
- CI/CD workflows.
- Logs, metrics, traces, health checks, alerts, and incident response.
- Kubernetes and Terraform, if and when the implementation needs them.

## Required explanation

For every introduced tool or infrastructure concept, explain why it is needed now, what problem it solves, which files configure it, how the pieces connect, the important settings and commands, security and cost implications, common failures, cleanup, and what was actually verified.

Link to the relevant theory phase. Introducing a tool does not require the learner to have completed that phase first.

## Safety

Never include real secrets. Never create or modify paid cloud resources without explicit approval. Make clear whether a configuration is proposed, local-only, tested, or deployed.
