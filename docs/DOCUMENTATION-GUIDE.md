# Documentation Guide

TaskFlow documentation is part of the engineering deliverable. It should explain not only what command was run, but why it was needed and how to verify the result.

## Where documentation belongs

- Foundation concepts: `docs/00-foundations/`
- Application design and implementation: `docs/01-application/`
- Git workflows: `docs/02-git-github/`
- Docker: `docs/03-docker/`
- Linux: `docs/04-linux/`
- AWS: `docs/05-aws/`
- CI/CD: `docs/06-cicd/`
- Monitoring: `docs/07-monitoring/`
- Scaling: `docs/08-scaling/`
- Kubernetes: `docs/09-kubernetes/`
- Terraform: `docs/10-terraform/`
- Cross-cutting errors: `docs/troubleshooting/`

Create folders and files as they are needed. Git does not track empty directories.

## Suggested structure for a technical lesson

1. Learning objectives
2. Problem being solved
3. Core concepts and terminology
4. How it works internally (at the learner's current level)
5. Architecture or sequence diagram
6. TaskFlow application
7. Practical commands and expected output
8. Verification checklist
9. Common mistakes and troubleshooting
10. Interview questions
11. Key takeaways
12. Completion status

## Accuracy and safety rules

- Distinguish a simplified mental model from an exact implementation detail.
- State assumptions such as operating system, protocol version, cloud region, and runtime where they matter.
- Do not put real credentials, access tokens, private keys, or personal data in examples.
- Use placeholders for secrets.
- Explain what a command changes before asking the learner to run it.
- Include a verification command or expected observable result.
- Review cloud costs before creating resources and include cleanup instructions.
- Mark a lesson complete only after the practical work and knowledge check have been verified with the learner.

## Progress tracking

Use `docs/learning-progress.md` as the source of truth for lesson status. A file existing in the repository means notes are available; it does not by itself prove the learner has completed the lesson.
