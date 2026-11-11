# TaskFlow Learning Scope and Depth Limits

## 1. The outcome we are aiming for

By the end of this roadmap, you should be able to:

- Explain the architecture of a modern web application from browser to database.
- Understand the role of the frontend, backend, API, database, containers, servers, cloud services, and delivery pipeline.
- Read and discuss common project configuration, Dockerfiles, Compose files, CI/CD workflows, cloud diagrams, and deployment plans.
- Use the essential commands and know what they change.
- Recognize common failures and know where to investigate.
- Discuss practical trade-offs with senior engineers and use AI coding tools with clear technical instructions.
- Build, deploy, verify, monitor, and make a basic scaling plan for TaskFlow.

This is a project-focused engineering foundation. It is not a promise that 30 lessons alone make someone a senior engineer or architect. Senior judgment develops through implementation, production incidents, reviews, and repeated experience. This roadmap prepares you to participate in those discussions with useful context and vocabulary.

## 2. Fixed lesson count

Phase 0 is the completed foundation baseline. Phases 1–11 contain 30 planned lessons. A lesson is a complete learning unit. We do not create another lesson just because a term has deeper internals.

| Phase | Focus | Planned lessons |
|---|---|---:|
| 0 | Engineering foundations | Completed baseline |
| 1 | Full-stack application fundamentals | 6 |
| 2 | Git and GitHub workflows | 2 |
| 3 | Docker fundamentals | 3 |
| 4 | Docker Compose | 2 |
| 5 | Linux and server administration | 3 |
| 6 | AWS cloud fundamentals | 3 |
| 7 | Cloud deployment | 2 |
| 8 | CI/CD with GitHub Actions | 2 |
| 9 | Monitoring and reliability | 2 |
| 10 | Scaling and high availability | 2 |
| 11 | Kubernetes and Terraform | 3 |
| **Total remaining** | **Phases 1–11** | **30** |

We may correct a misconception or add a short explanation when needed, but we will not expand the roadmap into an unbounded course.

## 3. What every lesson includes

Each lesson will cover only the pieces needed for TaskFlow:

1. **Purpose:** what problem the concept solves.
2. **Mental model:** how it works and where it fits.
3. **Vocabulary:** the important terms and how they relate.
4. **Architecture:** one useful diagram or flow where it helps.
5. **TaskFlow connection:** how we will use the concept.
6. **Commands/configuration:** important commands and flags explained, with expected effects.
7. **Engineering judgment:** common mistakes, security/cost implications, and practical trade-offs.
8. **Checkpoint:** a small exercise or a few questions to confirm understanding.

A lesson may use examples, but it will not turn each term into a separate lesson.

## 4. Depth boundaries

### We will cover

- The purpose and core operating model of each technology.
- The normal request, data, deployment, and failure flows.
- The most commonly used terminology and configuration.
- Commands that we will actually need to build, run, inspect, debug, and deploy TaskFlow.
- Common mistakes and security basics.
- Decisions a project engineer should be able to explain.

### We will not study by default

- The full internals of programming language runtimes or browser engines.
- Operating-system kernel internals.
- Every Docker flag, Linux command, AWS service, or Kubernetes resource.
- Deep networking protocol specifications.
- Advanced database internals and query optimizer implementation.
- Every architecture pattern or enterprise-scale design variation.
- Certification-level coverage unrelated to the project.

When a real implementation or debugging issue requires one of these topics, we will learn the relevant slice at that time.

## 5. The stop rule

We move on when you can:

- Explain what the concept is and why TaskFlow needs it.
- Describe the main flow in your own words.
- Recognize and use the important terms correctly.
- Understand the relevant command/configuration at a practical level.
- Answer the checkpoint and identify where you would investigate a common failure.

You do not need to memorize every option, know every edge case, or explain source-code internals.

## 6. The build-and-learn rule

**Implementation can begin at any point. It does not wait for Phase 11 or for the learner to pass a theory checkpoint.** The learner studies at their own pace while the application grows in small, understandable steps.

A practical development path is:

1. Confirm the smallest useful first-version feature and user journey.
2. Agree on the initial architecture and record important technology decisions.
3. Build the frontend, API, and data path in small vertical slices.
4. Add tests and learn debugging against real behaviour.
5. Introduce Docker, Compose, Linux, AWS, CI/CD, monitoring, scaling, Kubernetes, or Terraform when the application has a real reason to use them.
6. Document every meaningful implementation and connect it to the relevant theory lesson.
7. Verify and document what actually works. Learn additional theory just in time when implementation exposes a gap.

The curriculum remains bounded, but implementation is not held until the curriculum is completed. A working application and its implementation guides are another way to learn the concepts.

## 7. Teaching style

- Use plain English first, then introduce the correct technical term.
- Connect new topics to concepts already covered.
- Explain acronyms on first use.
- Use realistic examples from TaskFlow and normal engineering teams.
- Keep explanations focused and avoid unnecessary academic detail.
- Be honest about what is a simplified model versus a production decision.
