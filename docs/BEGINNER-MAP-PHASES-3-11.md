# Beginner's Map — Phases 3–11

This guide connects the later TaskFlow curriculum into one story. Read it before starting Phase 3, and return to it whenever a new tool feels like an unrelated topic.

The goal is not to memorize product names. The goal is to understand what problem each tool solves, where it fits, what talks to it, and how to recognize when something fails.

## Start from the application you already know

TaskFlow has three main parts:

- **Frontend:** React presents the user interface in the browser.
- **Backend:** Node.js and Express receive requests, check permissions, apply business rules, and communicate with other services.
- **Database:** PostgreSQL stores the application data.

A student clicks Save on a task. The browser sends a request to the API. The API validates it and writes the task to PostgreSQL. The database result returns through the API to the browser.

Everything from Phase 3 onward explains how to package, connect, host, release, observe, scale, and manage that same application.

## The complete journey

\`\`\`text
TaskFlow source code
       |
       v
Git and GitHub record and review changes
       |
       v
Dockerfile builds an application image
       |
       v
Docker container runs the application
       |
       v
Docker Compose connects local services
       |
       v
Linux and AWS provide the operating environment
       |
       v
DNS + HTTPS + proxy/load balancer expose the application
       |
       v
GitHub Actions tests, builds, publishes, and deploys releases
       |
       v
Monitoring shows health, errors, and performance
       |
       v
Scaling and resilience help handle more load and failures
       |
       v
Kubernetes manages cluster workloads when justified
Terraform manages the infrastructure those workloads use
\`\`\`

This is a learning map, not a claim that TaskFlow has already been built or deployed.

## What question does each phase answer?

| Phase | The question it answers | Familiar mental model |
|---|---|---|
| 3. Docker | How do I package an app and run it consistently? | An application package and a running instance |
| 4. Docker Compose | How do I start related containers together? | One instruction file for a local multi-service application |
| 5. Linux | How do I inspect and operate the computer running the app? | Files, users, processes, services, logs, and network |
| 6. AWS foundations | What cloud resources exist, and who may use them? | A rented infrastructure environment with identity and network rules |
| 7. Deployment | How does a browser reach the application securely? | Domain → DNS → HTTPS → entry point → app |
| 8. CI/CD | How does a reviewed change become a controlled release? | Automated quality checks, image build, publish, deploy, verify |
| 9. Monitoring | How do we know the app is healthy and investigate failures? | Logs, metrics, traces, alerts, and incident response |
| 10. Scaling | What changes when usage grows or components fail? | More capacity, bottleneck management, backup and recovery |
| 11. Kubernetes and Terraform | How are cluster workloads and infrastructure managed? | Kubernetes runs app workloads; Terraform describes infrastructure |

### Phase guide links

| Phase | Guide |
|---|---|
| 3 | [Docker fundamentals](03-docker/README.md) |
| 4 | [Docker Compose](04-compose/README.md) |
| 5 | [Linux and server administration](05-linux/README.md) |
| 6 | [AWS cloud fundamentals](06-aws/README.md) |
| 7 | [Cloud deployment](07-deployment/README.md) |
| 8 | [CI/CD with GitHub Actions](08-cicd/README.md) |
| 9 | [Monitoring and reliability](09-monitoring/README.md) |
| 10 | [Scaling and high availability](10-scaling/README.md) |
| 11 | [Kubernetes and Terraform](11-kubernetes-terraform/README.md) |

## How the pieces fit together

### 1. Docker and Docker Compose are related, but different

Docker images package application files and required runtime components. A container is a running instance created from an image.

Docker Compose describes multiple services and the networks and volumes they use. It makes a local development stack repeatable. Compose is not the same as Kubernetes and does not create a cloud platform by itself.

### 2. Linux and AWS are different layers

Linux is an operating system. It manages files, users, processes, memory, and network behavior on a machine.

AWS is a cloud provider. It supplies services such as virtual servers, virtual networks, image registries, databases, and identity controls. An EC2 instance can run Linux; Docker can run containers on that Linux host.

### 3. DNS does not host the app

DNS helps a browser find the public destination for a domain name. HTTPS protects the browser connection. A reverse proxy or load balancer receives requests and forwards them to the correct application service. The API still needs to be running and the database still needs to be reachable.

### 4. CI/CD is not the application runtime

GitHub Actions can check code, build images, publish them to a registry, and trigger a deployment. It does not normally serve the TaskFlow website to users. The deployed runtime performs that job.

### 5. Monitoring and scaling depend on evidence

Monitoring records what the system is doing. Metrics and traces help identify bottlenecks. Scaling changes capacity after you understand the demand and the constrained component. Adding more API instances will not automatically fix a database bottleneck.

### 6. Kubernetes and Terraform solve different problems

Kubernetes schedules and maintains application workloads in a cluster. Terraform provisions infrastructure such as networks, compute, identity, databases, and sometimes the cluster itself. They can work together, but neither is automatically required for a small first release.

## One request, from a user's browser to the database

Keep this path in mind across Phases 3–11:

1. A student opens the TaskFlow domain in a browser.
2. DNS resolves the domain to the public entry point.
3. The browser establishes an HTTPS connection.
4. A load balancer or reverse proxy routes the request to the web frontend or API.
5. The frontend JavaScript runs in the browser and sends an API request.
6. The API validates the request and checks the user's permissions.
7. The API reaches PostgreSQL through a private network connection.
8. PostgreSQL stores or reads the requested data.
9. The API returns a response to the browser.
10. Logs, metrics, traces, and health checks provide evidence about the request and the system.

A browser is outside the private Docker or Kubernetes service network. Browser-side JavaScript cannot normally resolve an internal service name such as \`api\` or \`db\`. It needs a public or host-accessible API URL, or a same-domain proxy route.

## A small glossary for the later phases

| Term | Plain meaning |
|---|---|
| Runtime | The software environment that executes a program |
| Image | The packaged template used to create a container |
| Container | An isolated running instance created from an image |
| Compose service | A named component configuration in a multi-container project |
| Host | The computer that runs the container engine or virtual machine |
| Volume | Storage that can outlive a container |
| IAM | AWS identity and permission management |
| VPC | A logically isolated network in AWS |
| DNS | The naming system that helps a client find a network destination |
| TLS | The security protocol that protects HTTPS connections |
| Reverse proxy | A server that receives requests and forwards them to another service |
| Runner | The machine/environment that executes a GitHub Actions job |
| OIDC | A way for one system to prove its identity to another using signed tokens |
| Trace | A record of how one request moves through multiple operations |
| Replica | Another running copy of an application workload |
| Pod | Kubernetes' smallest deployable unit, containing one or more containers |
| Terraform state | The record connecting Terraform configuration to the real infrastructure it manages |

## How to read each lesson

For every lesson, use the same five questions:

1. **What problem are we solving?** Start with the real situation, not the command.
2. **What do the new words mean?** Translate each technical term into a simple role.
3. **Where does it fit?** Identify whether it belongs to the browser, application, container, host, cloud network, or automation pipeline.
4. **What is the complete flow?** Follow one TaskFlow scenario from the first action to the final result.
5. **How would I know it failed?** Identify the first useful status, log, metric, or configuration check.

You do not need to memorize every option or specialist detail. You should be able to explain the main flow in your own words, choose the right first check, and know which layer to investigate next.

## What is deliberately not required yet?

- Do not install every tool while reading.
- Do not create paid AWS resources for theory exercises.
- Do not build a Kubernetes cluster just because Phase 11 introduces Kubernetes.
- Do not use Terraform against a real AWS account before the architecture, cost limit, permissions, and cleanup plan are reviewed.
- Do not mistake sample configuration for a working TaskFlow deployment.

The active repository remains a learning curriculum. Real implementation begins after the study pass and a separate architecture decision.

## Recommended order

Start with [Phase 3 — Docker fundamentals](03-docker/README.md), then follow the phase order through [Phase 11 — Kubernetes and Terraform](11-kubernetes-terraform/README.md).

The complete lesson checklist is in [Learning Progress](learning-progress.md). The root [README](../README.md) links back to the start of the whole curriculum.
