# Documentation Guide

TaskFlow is following a theory-first learning sequence. Documentation is the primary deliverable during the learning phases; application implementation comes later.

## Learning sequence

The roadmap is organized as:

- `docs/00-foundations/` — engineering foundations
- `docs/01-application/` — full-stack application fundamentals
- `docs/02-git-github/` — Git and GitHub workflows
- `docs/03-docker/` — Docker fundamentals
- `docs/04-docker-compose/` — multi-container applications
- `docs/05-linux/` — Linux and server administration
- `docs/06-aws/` — AWS cloud fundamentals
- `docs/07-cloud-deployment/` — DNS, reverse proxies, HTTPS, and deployment
- `docs/08-cicd/` — CI/CD and GitHub Actions
- `docs/09-monitoring/` — logs, metrics, health, and reliability
- `docs/10-scaling/` — scaling and high availability
- `docs/11-kubernetes-terraform/` — Kubernetes and Infrastructure as Code

Create a phase folder when that phase begins. Do not create empty folders just to reserve names.

## Suggested structure for a technical lesson

1. Learning objectives
2. The real problem being solved
3. Why the technology exists
4. Core concepts and terminology
5. How it works internally
6. Architecture, data flow, or sequence diagram
7. How it connects to earlier and later topics
8. TaskFlow use case and a real-world example
9. Commands: purpose, syntax, arguments, effect, and expected output
10. Common mistakes and troubleshooting
11. Exercises and interview questions
12. Key takeaways and a learner checkpoint

## Theory-first rules

- Explain a command before asking the learner to run it.
- During theory lessons, commands are examples to understand; do not ask the learner to install packages, start services, change system settings, or provision cloud resources unless the lesson explicitly enters a practical exercise.
- Label proposed architecture, sample configuration, and illustrative API contracts as proposals. Do not describe them as deployed or verified systems.
- Keep implementation code out of the repository until all theory phases are complete and the learner agrees to move to the build stage.
- When implementation begins, revisit the proposed designs and confirm current technology versions and official guidance.

## Accuracy and security rules

- Distinguish simplified mental models from exact implementation details.
- State assumptions such as operating system, protocol version, cloud region, and runtime when they matter.
- Use placeholders for secrets. Never add real credentials, tokens, private keys, or personal data.
- Explain destructive or cost-incurring effects before any command is run.
- Include a safe verification step and cleanup instructions for practical work.
- Do not call a design production-ready without security, reliability, and operational review.

## Progress tracking

Use `docs/learning-progress.md` as the single source of truth. A document existing in GitHub means reference material is available; it does not prove the learner has studied or completed the lesson. Record completion only after the explanation, exercises, and checkpoint have been reviewed with the learner.
