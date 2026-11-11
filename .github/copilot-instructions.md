# TaskFlow instructions for GitHub Copilot

Before making changes, read the repository-root AGENTS.md. It is the canonical and complete instruction set. Also read docs/implementation/README.md and docs/implementation/PROJECT-CONTEXT.md.

TaskFlow is both an application and a beginner-friendly learning project. Theory study and coding run in parallel; completing any learning phase is not a prerequisite for implementation.

Follow the agreed direction: React + TypeScript frontend, Node.js + Express + TypeScript backend, PostgreSQL database, and AWS as the later primary cloud path. Do not silently change the stack or invent undecided architecture choices.

Work in small vertical slices. For every meaningful feature, business rule, architecture/data/API/security change, dependency, infrastructure tool, or unfamiliar concept, create or update a beginner-friendly implementation guide under docs/implementation/ in the same change as the code. Explain why, what, how, business logic, code locations, concepts, important configuration and commands, failure diagnosis, verification actually performed, trade-offs, and links to related theory lessons.

Never claim unrun tests or unverified behaviour. Protect secrets and do not create paid cloud resources without explicit approval. Keep README, implementation indexes, and project context current. AGENTS.md contains the full definition of done.
