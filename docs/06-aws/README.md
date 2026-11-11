# Phase 6 — AWS Cloud Fundamentals

**Three focused lessons.** This phase introduces the AWS services and cloud architecture concepts that TaskFlow may use later. AWS is the primary cloud learning path; Azure and Google Cloud are comparison points only.

The goal is not to memorize every AWS service. It is to understand where TaskFlow's network, servers, container images, and database would live, how access is controlled, and what can create cost or security risk.

## Where Phase 6 fits in the bigger picture

**You already know:** Phase 5 taught the operating-system and network concepts used by a server. Phase 3 introduced container images.

**This phase adds:** AWS's cloud resources, identity model, and network layout.

Follow this chain:

```text
AWS account + Region
   -> IAM identity and role
   -> VPC + subnets + routes
   -> security groups
   -> compute (EC2)
   -> ECR images + RDS database
```

Lesson 6.1 explains who is allowed to do what. Lesson 6.2 explains where network traffic can travel and where compute runs. Lesson 6.3 explains where container images and relational database services fit.

**Important boundary:** IAM permission, network access, and database login are separate controls. A service must pass the relevant checks at each layer.

## Lesson sequence

| Lesson | Topic | Main outcome |
|---|---|---|
| 6.1 | [Cloud model and IAM](lesson-6.1-cloud-model-and-iam.md) | Understand regions, Availability Zones, shared responsibility, accounts, IAM users, roles, policies, and least privilege |
| 6.2 | [AWS networking and compute](lesson-6.2-aws-networking-and-compute.md) | Understand VPCs, subnets, routes, internet gateways, security groups, network ACLs, and EC2 |
| 6.3 | [Container and database services](lesson-6.3-container-and-database-services.md) | Understand ECR, RDS, backups, access boundaries, and basic cost controls |

## TaskFlow connection

A likely AWS architecture for TaskFlow will involve:

- A VPC to provide a network boundary.
- Public-facing entry components and private application/data resources.
- Compute to run the application containers.
- ECR to store container images.
- RDS as a managed relational database option.
- IAM roles and policies to control access.

This is a conceptual design, not a deployed architecture. Final service choices and network layout will be agreed before implementation.

## Cost and safety boundary

- These lessons are theory-first. Do not create EC2 instances, RDS databases, NAT Gateways, load balancers, or ECR repositories just to study.
- AWS resources can create charges even when an application is not receiving traffic.
- Stopping an instance does not necessarily remove storage, snapshots, public IPv4, or other billable resources.
- Do not use root credentials for routine administration. Prefer temporary credentials and narrowly scoped roles.
- Never put AWS access keys, secrets, SSH private keys, or database passwords into GitHub.
- Before any later hands-on work, we will review the live AWS pricing pages, configure budgets and alerts, and define a cleanup checklist.

## Phase 6 integrated checkpoint

Explain:

1. What an AWS Region and Availability Zone are.
2. How the shared responsibility model divides duties between AWS and the customer.
3. What IAM users, roles, policies, and temporary credentials do.
4. What a VPC and subnet represent.
5. How route tables and an Internet Gateway affect connectivity.
6. How security groups differ from network ACLs.
7. What an EC2 instance is and how EBS storage relates to it.
8. Why ECR and RDS are useful for TaskFlow.
9. Why a database should normally be private and what backups protect against.
10. Which resources or activities could create ongoing AWS charges.

**Pass standard:** You can explain the main AWS building blocks and sketch a secure high-level network for TaskFlow without launching resources. Learner validation is deferred until the later study pass.

## Official references

- [AWS global infrastructure](https://aws.amazon.com/about-aws/global-infrastructure/)
- [IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Amazon VPC User Guide](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [Amazon EC2 User Guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html)
- [Amazon ECR User Guide](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
- [Amazon RDS User Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html)
