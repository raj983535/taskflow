# Phase 11 — Kubernetes and Terraform

**Three focused lessons.** This final phase introduces two tools used in more advanced infrastructure environments:

- **Kubernetes:** manages containerized application workloads across a cluster of machines.
- **Terraform:** describes and provisions infrastructure through version-controlled configuration.

These tools solve different problems. Kubernetes manages application workloads after a cluster exists. Terraform can create and manage the infrastructure, including networks, compute resources, and sometimes the cluster itself.

## Lesson sequence

| Lesson | Topic | Main outcome |
|---|---|---|
| 11.1 | [Kubernetes mental model](lesson-11.1-kubernetes-mental-model.md) | Understand clusters, control planes, nodes, Pods, Deployments, Services, and kubectl |
| 11.2 | [Running an app on Kubernetes](lesson-11.2-running-app-on-kubernetes.md) | Understand configuration, Secrets, probes, resource requests/limits, storage, Services, and Gateway/Ingress |
| 11.3 | [Terraform and infrastructure as code](lesson-11.3-terraform-and-infrastructure-as-code.md) | Understand providers, resources, variables, modules, state, backends, plan/apply, and safe infrastructure changes |

## How the two tools fit together

A simplified relationship:

    Terraform
       |
       | provisions infrastructure
       v
    Cloud network + compute + Kubernetes cluster
       |
       | Kubernetes manages workloads
       v
    TaskFlow Pods and Services
       |
       v
    Application traffic and persistent data

Terraform can provision an AWS VPC, subnets, IAM roles, ECR repositories, an EKS cluster, or other resources. Kubernetes then schedules and manages application workloads inside the cluster.

The actual boundary depends on the deployment architecture. Some teams use Terraform for infrastructure and a separate deployment workflow or GitOps tool for Kubernetes manifests.

## TaskFlow connection

Kubernetes is not automatically required for TaskFlow's first release. A single server with Docker and Compose may be a more practical starting point. Kubernetes introduces more moving parts and operating responsibility.

Terraform is useful when we want infrastructure changes to be repeatable, reviewable, and version controlled. It does not replace AWS knowledge or remove the need to review plans carefully.

## Practical boundary

- These lessons are theory-first. Do not create a Kubernetes cluster, install kubectl, provision EKS, or run Terraform against AWS just to study.
- Kubernetes and managed cluster services can create significant ongoing costs.
- A local Kubernetes environment is optional and is not required to understand these concepts.
- Never store Kubernetes credentials, private keys, cloud secrets, Terraform state, or saved sensitive plan files in Git.
- Kubernetes Secrets require additional security configuration; Base64 encoding is not encryption.
- Terraform state may contain sensitive values. Protect its storage and access.
- Treat \`terraform apply\` and especially \`terraform destroy\` as infrastructure-changing operations, not harmless commands.

## Phase 11 integrated checkpoint

Explain:

1. What a Kubernetes cluster, control plane, and node are.
2. Why a Pod is the smallest deployable unit and why Pods are replaceable.
3. What a Deployment maintains and how desired replicas are reconciled.
4. What a Service provides when Pod IP addresses change.
5. How ConfigMaps, Secrets, probes, and resource requests/limits affect an application.
6. What PersistentVolumes and PersistentVolumeClaims represent.
7. Why Gateway API is the forward-looking traffic-routing option while Ingress remains supported but frozen.
8. What Terraform providers, resources, data sources, variables, outputs, and modules are.
9. What Terraform state records and why it must be protected and shared safely.
10. The safe write, init, plan, review, apply, verify workflow.
11. The difference between infrastructure provisioning by Terraform and workload management by Kubernetes.

**Pass standard:** You can describe which tool owns which part of a deployment, read a basic Kubernetes manifest and Terraform configuration, and explain the safety checks required before changing cloud infrastructure. Learner validation is deferred until the later study pass.

## Official references

- [Kubernetes concepts](https://kubernetes.io/docs/concepts/)
- [Kubernetes cluster architecture](https://kubernetes.io/docs/concepts/architecture/)
- [Kubernetes Pods](https://kubernetes.io/docs/concepts/workloads/pods/)
- [Kubernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Kubernetes Gateway API](https://gateway-api.sigs.k8s.io/)
- [Terraform core workflow](https://developer.hashicorp.com/terraform/intro/core-workflow)
- [Terraform providers](https://developer.hashicorp.com/terraform/language/providers)
- [Terraform state backends](https://docs.hashicorp.com/terraform/language/state/backends)
