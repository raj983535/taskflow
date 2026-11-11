# Lesson 11.3 — Terraform and Infrastructure as Code

**Phase:** 11 — Kubernetes and Terraform  
**Goal:** Understand how Terraform describes infrastructure, previews changes, provisions resources, and tracks the real infrastructure it manages.

## Start here: Kubernetes manages workloads; Terraform prepares infrastructure

In the previous lessons, Kubernetes managed Pods and application Services inside a cluster. But where did the cluster, network, compute nodes, IAM roles, and database come from?

Those are infrastructure resources. Creating them by clicking through a console is possible, but repeating the exact setup consistently is difficult.

**Infrastructure as Code (IaC)** means describing infrastructure in configuration files so the changes can be reviewed, version-controlled, repeated, and managed over time.

Terraform reads those declarations and works with providers such as the AWS provider to create or update real infrastructure. It does not automatically run the TaskFlow application inside that infrastructure. Kubernetes or another runtime manages the application workload.


## 1. What problem does Terraform solve?

Imagine you need to create TaskFlow's cloud environment:

- A VPC.
- Subnets.
- Route tables.
- Security groups.
- IAM roles.
- ECR repositories.
- Compute resources.
- A database.

You could create each resource manually in the AWS console.

But manual setup is difficult to repeat. You may forget a setting, create slightly different development and production environments, or be unsure exactly what exists.

**Infrastructure as Code (IaC)** means describing infrastructure in files that can be reviewed, version-controlled, and used to create or update resources.

Terraform is an infrastructure-as-code tool. It uses configuration files to describe resources and works with providers that communicate with cloud platforms and other APIs.

## 2. What does Terraform manage?

Terraform can create, update, and delete supported infrastructure resources.

For TaskFlow, a Terraform configuration might describe:

- AWS VPC and subnets.
- Security groups.
- IAM roles and policies.
- ECR repositories.
- Compute resources.
- RDS database settings.
- DNS records.
- Load balancer resources.

Terraform does not run the TaskFlow application process itself. It creates and manages infrastructure. Docker or Kubernetes runs the application workloads inside the infrastructure.

## 3. What is a provider?

A **provider** is a plugin that lets Terraform interact with a particular platform or API.

Examples:

- AWS provider.
- Azure provider.
- Google Cloud provider.
- Kubernetes provider.
- GitHub provider.

The provider understands how to communicate with the service and how to create or inspect its resources.

The AWS provider exposes resource types such as VPCs, subnets, security groups, and EC2 instances.

Provider versions change independently from Terraform itself. Production configurations should declare version constraints and commit the dependency lock file so the team uses reviewed provider versions.

Official guide: https://developer.hashicorp.com/terraform/language/providers

## 4. What is a resource?

A **resource** is an infrastructure object Terraform manages.

Examples:

- An AWS VPC.
- An EC2 instance.
- An S3 bucket.
- An RDS database instance.
- An IAM role.

A simplified Terraform configuration:

    terraform {
      required_providers {
        aws = {
          source  = "hashicorp/aws"
          version = "~> 6.0"
        }
      }
    }

    provider "aws" {
      region = "ap-south-1"
    }

    resource "aws_vpc" "taskflow" {
      cidr_block = "10.20.0.0/16"

      tags = {
        Name = "taskflow-vpc"
      }
    }

This is illustrative configuration. Provider versions and region must be checked and selected during implementation. It has not been applied to AWS.

Read the parts:

- terraform: Terraform-level configuration.
- required_providers: tells Terraform which provider plugin is needed.
- source: provider identity in the registry.
- version: acceptable provider versions.
- provider: configures the AWS provider, here with a Region.
- resource: declares a resource Terraform should manage.
- aws_vpc: resource type provided by the AWS provider.
- taskflow: local resource name inside this Terraform configuration.
- cidr_block: VPC address range.
- tags: metadata used to identify the resource.

The label taskflow is not the AWS resource's globally unique ID. Terraform uses a resource address based on the type and local name.

## 5. Data sources, variables, locals, outputs, and modules

These are common configuration building blocks.

| Term | Purpose |
|---|---|
| Variable | Input supplied to the configuration |
| Local value | Named expression reused inside the configuration |
| Output | Value exposed after Terraform operations |
| Data source | Reads information about an existing object without managing its lifecycle as a resource |
| Module | A reusable group of Terraform configuration files |

### Variables

Variables let a configuration accept different values without editing every resource block.

Example:

    variable "aws_region" {
      description = "AWS Region for TaskFlow"
      type        = string
      default     = "ap-south-1"
    }

The provider can then refer to the variable:

    provider "aws" {
      region = var.aws_region
    }

The expression var.aws_region means read the value of the aws_region input variable.

### Locals

A local value gives a name to an expression used within the configuration.

    locals {
      project_name = "taskflow"
      environment  = "dev"
    }

It can help keep repeated naming or configuration consistent.

### Outputs

Outputs expose useful results after Terraform creates or reads resources.

    output "vpc_id" {
      value = aws_vpc.taskflow.id
    }

The expression references the ID of the VPC resource.

Avoid exposing passwords, private keys, tokens, or other sensitive values as outputs. Marking an output sensitive changes display behavior but does not make an unsafe data flow safe.

### Data sources

A data source reads information about something that already exists. For example, a configuration might look up an existing AWS availability zone or VPC rather than creating another one.

### Modules

A module is a reusable collection of Terraform configuration that can be called from another module.

A VPC module might create the VPC, subnets, routes, and related resources through a reusable interface.

Modules help reduce duplication, but a module is not automatically safe or correct. Review its source, version, provider requirements, and planned changes.

## 6. What is Terraform state?

This is one of Terraform's most important concepts.

Terraform needs to remember which real infrastructure objects correspond to the resource blocks in your configuration.

It stores this mapping in a **state** file or state backend.

Example:

    Terraform address                Real infrastructure
    aws_vpc.taskflow          --->   vpc-012345...
    aws_instance.api          --->   i-012345...
    aws_db_instance.primary   --->   database endpoint/id

The state helps Terraform compare:

1. What the configuration says should exist.
2. What Terraform previously recorded about real resources.
3. What the provider currently reports exists.

Terraform uses these inputs to calculate a plan.

State is not just a cache. It is an important record of the infrastructure Terraform manages.

## 7. Why is state sensitive?

Terraform state may contain resource attributes and, depending on the resource/provider, sensitive data such as passwords or connection details.

Treat it as confidential infrastructure data.

Rules:

- Do not commit terraform.tfstate to Git.
- Do not publish state in build artifacts or issue comments.
- Restrict who can read and modify the state.
- Use encrypted storage and backups.
- Use a shared remote backend for team workflows.
- Never manually edit the state file unless following a carefully reviewed recovery procedure.

Terraform also creates a .terraform directory for provider plugins, modules, and local metadata. Do not normally commit that directory.

Commit .terraform.lock.hcl, which records selected provider dependency versions and checksums for reproducible initialization.

## 8. Local state versus remote state

By default, Terraform can store state locally in the working directory.

This may be acceptable for a temporary personal experiment, but it becomes unsafe for shared infrastructure work:

- Another teammate may not have the latest state.
- Two people may try to change the same resources.
- State can be lost with the laptop or folder.
- Sensitive information can be exposed.

A **backend** determines where and how Terraform stores state.

A remote backend stores state in a shared service or storage system. Some backends support **state locking**, which prevents concurrent operations from changing the same state at the same time.

For AWS, an S3-based backend with an appropriate locking design is a common option. The exact backend and locking feature should be selected using current Terraform and AWS documentation. Credentials should be provided through secure identity mechanisms, not written in backend configuration files.

Official references:
- https://docs.hashicorp.com/terraform/language/state/backends
- https://docs.hashicorp.com/terraform/language/backend

## 9. The core Terraform workflow

The normal workflow is:

    Write configuration
            |
            v
       terraform fmt
            |
            v
       terraform init
            |
            v
      terraform validate
            |
            v
       terraform plan
            |
            | review exact changes
            v
       terraform apply
            |
            v
      Verify resources
            |
            v
    Record and review state

Let's understand each command.

### terraform fmt

    terraform fmt

Formats Terraform files to a consistent style.

The check-only option:

    terraform fmt -check

Checks formatting without changing the files.

### terraform init

    terraform init

Initializes the working directory. It downloads required provider plugins and modules, configures the backend, and creates or updates the dependency lock file.

It is normally the first Terraform command after creating or cloning a new configuration. It can be run again when dependencies or backend configuration change.

### terraform validate

    terraform validate

Checks whether the configuration is syntactically valid and internally consistent for the initialized providers.

It does not prove that the infrastructure can be created or that permissions and quotas are sufficient.

### terraform plan

    terraform plan

Compares the configuration with known state and provider information, then previews proposed changes.

A plan may say:

- Add resources.
- Change resources.
- Destroy resources.

This is the point where you should carefully review what Terraform intends to do.

You can save a plan:

    terraform plan -out=tfplan

A saved plan is a file containing planned changes and can include sensitive values. Protect it. Do not commit it or publish it as an artifact without a deliberate security decision.

### terraform apply

    terraform apply

Terraform creates an execution plan and asks for confirmation before making changes, unless automation/approval options are used. Applying makes real infrastructure changes.

For a saved plan:

    terraform apply tfplan

This applies the reviewed saved plan. The plan can become stale if the infrastructure or state changes before application, in which case it may need to be generated again.

Official workflow overview: https://developer.hashicorp.com/terraform/intro/core-workflow

## 10. Understand terraform destroy

The command:

    terraform destroy

Creates a plan to destroy resources managed by the current Terraform configuration and asks for confirmation unless configured otherwise.

This is destructive. It can remove networks, compute, databases, and other real infrastructure. Data and service availability can be affected.

Never run it casually as a cleanup shortcut. Before destroying anything:

- Confirm the account, Region, workspace, and state backend.
- Review the destroy plan carefully.
- Confirm backups and data-retention requirements.
- Confirm no shared production resources are included.
- Obtain the required approval.

## 11. What is drift?

**Drift** means real infrastructure has changed away from the configuration/state Terraform expects.

For example:

- Terraform created a security group that allows only HTTPS.
- Someone manually changes the security group in the AWS console.
- The actual resource no longer matches the configuration.

A later Terraform plan may detect the difference and propose changes to reconcile it.

This is one reason infrastructure should be managed through controlled, reviewed workflows instead of mixing manual changes and Terraform changes without a process.

## 12. Terraform and Kubernetes: who manages what?

They complement each other.

| Terraform | Kubernetes |
|---|---|
| Provisions cloud infrastructure | Manages workloads in a cluster |
| Creates networks, IAM, compute, databases, and cluster infrastructure | Schedules Pods and manages Deployments and Services |
| Tracks cloud resource mapping in Terraform state | Tracks desired application resources through the Kubernetes API |
| Uses providers to interact with APIs | Uses controllers and the Kubernetes API |

A common high-level pattern:

    Terraform
       |
       v
    AWS network + identity + cluster
       |
       v
    Kubernetes
       |
       v
    TaskFlow application Pods and Services

Terraform can also manage some Kubernetes resources through a Kubernetes provider, but the team must define clear ownership boundaries to avoid two tools managing the same resource in conflicting ways.

## 13. How this applies to TaskFlow

A future Terraform repository area might contain:

- Provider and version requirements.
- VPC and subnet definitions.
- Security groups.
- IAM roles and policies.
- ECR repositories.
- Compute or EKS infrastructure.
- Database infrastructure.
- Backend configuration for shared state.
- Variables and outputs.

The final module structure, provider versions, Region, state backend, and hosting resources will be confirmed after architecture review. We should not create a real infrastructure plan until the AWS design and cost budget are agreed.

## 14. Common beginner mistakes

- **Thinking Terraform itself is the cloud provider:** providers are plugins that connect Terraform to infrastructure APIs.
- **Thinking a resource block means the resource already exists:** it is the desired declaration; apply makes changes.
- **Skipping plan review:** a plan can include destruction or replacement.
- **Committing Terraform state:** it may contain sensitive data and internal infrastructure details.
- **Ignoring the lock file:** provider dependency versions can change unexpectedly.
- **Using local state for shared team infrastructure:** teammates need a common, protected state backend and safe locking.
- **Treating outputs marked sensitive as safe to publish:** sensitive display settings do not remove the underlying value from state.
- **Running destroy without verifying the workspace and plan:** it can remove real infrastructure.
- **Letting Terraform and another tool own the same resource:** define clear ownership.

## Guided example: trace one small Terraform change safely

Imagine the agreed TaskFlow design needs an AWS VPC. A Terraform configuration declares a VPC resource. The following is a simplified example and has not been applied to AWS:

```hcl
provider "aws" {
  region = "ap-south-1"
}

resource "aws_vpc" "taskflow" {
  cidr_block = "10.20.0.0/16"

  tags = {
    Name = "taskflow-vpc"
  }
}
```

Read it:

- The provider block selects the AWS provider and a Region.
- The resource block declares an AWS VPC that Terraform should manage.
- aws_vpc is the provider's resource type.
- taskflow is the local name Terraform uses to refer to this resource in the configuration.
- cidr_block supplies the VPC network range.
- tags add useful resource metadata.

Now follow the workflow:

1. `terraform fmt` formats the files.
2. `terraform init` prepares the folder and downloads the required provider.
3. `terraform validate` checks the configuration structure and consistency. It does not prove AWS will allow the change.
4. `terraform plan` compares the configuration with state and current provider information, then previews the proposed actions.
5. Review the plan. A plus sign generally indicates an add, a tilde a change, and a minus a destroy. A replacement can involve both destruction and creation.
6. `terraform apply` executes the approved plan and updates state.
7. Verify the VPC and related settings in AWS, then keep the configuration and state workflow under team control.

### Why state matters

The configuration says what should exist. State records which real objects Terraform manages and their identifiers. If the state file is lost or two people modify it concurrently, Terraform may no longer have a safe and accurate view of the infrastructure.

For shared work, use a protected remote backend with supported state locking. State can contain sensitive information, so it needs access control, encryption, and backup. Commit the provider lock file .terraform.lock.hcl, but do not commit local state, saved plans, or the .terraform directory.

### The safety rule

Never run `terraform apply` or `terraform destroy` without confirming the AWS account, Region, workspace, backend, and exact plan. These commands can change or delete real resources and may create charges or data loss.

Terraform provisions infrastructure. Kubernetes manages application workloads. Define which tool owns each resource so two tools do not fight over the same configuration.

## 15. Knowledge checkpoint

1. What does Infrastructure as Code mean?
2. What is a Terraform provider?
3. What is the difference between a resource and a data source?
4. What are variables, locals, outputs, and modules?
5. Why does Terraform need state?
6. Why should Terraform state be protected?
7. What is a backend, and why might a team use remote state?
8. What is state locking?
9. What is the difference between init, validate, plan, and apply?
10. Why must a plan be reviewed before apply?
11. What does destroy do, and why is it dangerous?
12. What is drift?
13. What does Terraform manage compared with Kubernetes?

**Completion rule:** You should be able to describe the full Terraform workflow and explain how configuration, provider, plan, state, and real infrastructure relate to each other.

## Official references

- [Terraform core workflow](https://developer.hashicorp.com/terraform/intro/core-workflow)
- [Terraform providers](https://developer.hashicorp.com/terraform/language/providers)
- [terraform init](https://developer.hashicorp.com/terraform/cli/commands/init)
- [Terraform state backends](https://docs.hashicorp.com/terraform/language/state/backends)
- [Terraform backend configuration](https://docs.hashicorp.com/terraform/language/backend)
- [Terraform glossary](https://docs.hashicorp.com/terraform/docs/glossary)
