# Lesson 6.1 — Cloud Model and IAM

**Phase:** 6 — AWS Cloud Fundamentals  
**Goal:** Understand what AWS provides, how its global infrastructure is organized, and how identities and permissions are controlled.

## 1. What changes when TaskFlow moves to the cloud?

So far, TaskFlow has been discussed as an application on a developer computer or a Linux server.

When you use a cloud provider, you rent or consume computing resources operated in the provider's data centers. Instead of buying and maintaining all the physical servers yourself, you use services through a console, command line, or API.

Cloud does not mean that the application is floating somewhere without computers. It still runs on physical hardware, storage, and networks. The cloud provider operates that physical infrastructure and exposes managed services.

AWS (Amazon Web Services) is the cloud provider selected as the primary learning path for TaskFlow.

## 2. What is a cloud service?

A cloud service provides a capability through an on-demand interface.

Examples:

| Need | AWS example |
|---|---|
| Virtual server | Amazon EC2 |
| Private cloud network | Amazon VPC |
| Container image registry | Amazon ECR |
| Managed relational database | Amazon RDS |
| Object storage | Amazon S3 |
| Identity and access control | AWS IAM |
| Monitoring and logs | Amazon CloudWatch |

A **managed service** means AWS takes responsibility for some operational tasks for the service. It does not mean the customer has no responsibility for configuration, security, backups, or cost.

For example, with RDS AWS manages much of the database infrastructure, but you still select access permissions, networking, backup retention, database configuration, and application credentials.

## 3. Region and Availability Zone

AWS has a global infrastructure divided into geographic **Regions**.

A Region is a separate geographic area where AWS operates infrastructure. You choose a Region when you create many AWS resources.

Within a Region are multiple **Availability Zones (AZs)**. An Availability Zone is an isolated location made up of one or more data centers with independent infrastructure.

Simplified view:

    AWS global infrastructure
          |
          +---- Region A
          |       |
          |       +---- Availability Zone A
          |       +---- Availability Zone B
          |       +---- Availability Zone C
          |
          +---- Region B
                  |
                  +---- Availability Zone A
                  +---- Availability Zone B

Why does this matter?

If your application uses only one Availability Zone, an outage in that location can affect availability. Spreading suitable resources across multiple AZs can improve resilience, but it may increase cost and operational complexity.

For early TaskFlow learning, understand the design choice. We do not need to build a multi-AZ production system during theory.

Choose a Region based on user latency, service availability, legal/data requirements, and cost. Do not assume the closest city automatically has every service.

Official overview: https://aws.amazon.com/about-aws/global-infrastructure/

## 4. What is the shared responsibility model?

The cloud provider and customer have different responsibilities.

AWS secures the underlying cloud infrastructure. The customer is responsible for how services are configured and used. The exact division depends on the service.

This is called the **shared responsibility model**.

A simplified comparison:

| AWS is responsible for | The customer is responsible for |
|---|---|
| Physical data centers | Application code and configuration |
| Physical hardware | Identity and permission choices |
| Foundational infrastructure | Data classification and access |
| Managed service infrastructure | Service settings and secure use |
| Underlying cloud network infrastructure | Network rules and exposure decisions |

The amount AWS manages varies.

With EC2, you manage the guest operating system, patches, application runtime, and data. With RDS, AWS manages more of the database host infrastructure, but you still manage database users, schema, application access, and backup/recovery decisions.

Never assume that putting an application in AWS automatically makes it secure.

## 5. What is an AWS account?

An AWS account is an administrative and billing boundary for AWS resources.

It contains resources, identities, policies, and billing information. Organizations can manage multiple accounts for separation, but a small learning project does not need an elaborate multi-account design immediately.

The account has a special root user identity. The root user has broad authority and must be protected carefully.

Do not use the root user for everyday administration. Secure it with multi-factor authentication (MFA), protect its recovery methods, and use an appropriate separate identity for routine work.

## 6. What is IAM?

IAM means **Identity and Access Management**.

It answers two questions:

1. Who or what is requesting access?
2. What is that identity allowed to do?

Examples:

- A developer needs permission to view deployment logs.
- A deployment process needs permission to read an image from ECR.
- A backend workload needs access to a particular AWS resource.
- An administrator needs permission to manage network settings.

IAM lets you define identities and permissions instead of giving everyone unrestricted access.

## 7. User, group, role, and policy

| Term | Simple explanation |
|---|---|
| IAM user | An identity representing a person or long-term programmatic identity |
| IAM group | A collection of IAM users that can share permissions |
| IAM role | An identity with permissions that can be assumed temporarily by a trusted principal |
| IAM policy | A set of rules describing allowed or denied actions and resources |

A **principal** is the identity making a request, such as a user or role.

A policy may say that an identity can read certain ECR images but cannot delete repositories or change account-wide security settings.

Policies can specify:

- Actions: what operation is allowed.
- Resources: which AWS resources it applies to.
- Conditions: under which circumstances it applies.
- Effect: allow or deny.

A policy is not simply a password. It is an authorization rule.

## 8. What is least privilege?

**Least privilege** means giving an identity only the permissions it needs to perform its job.

Imagine a deployment workflow needs to download an image from ECR.

It probably needs permission to authenticate to the registry and read a specific image repository. It does not need permission to delete all EC2 instances or modify every IAM policy.

Too much permission increases the damage possible if an account or workload is compromised.

AWS recommends temporary credentials for human users and workloads where possible, MFA, and least-privilege permissions. See: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html

## 9. What are temporary credentials and roles?

Credentials are the information used to prove an identity.

Long-term access keys can remain valid until revoked or rotated. If copied into source code, logs, or Git history, they can be abused.

Temporary credentials expire after a limited period. An identity can assume a role and receive temporary credentials for the permissions associated with that role.

Example mental model:

    Application workload
           |
           | trusted identity
           v
       Assume IAM role
           |
           v
    Temporary credentials
           |
           v
    Access permitted AWS service

For workloads running on supported AWS compute services, IAM roles can provide temporary credentials without putting long-lived access keys inside the application.

For TaskFlow, the eventual goal is to use an appropriate role for the deployed workload rather than hard-coding access keys into Node.js configuration.

## 10. MFA and credential safety

MFA means multi-factor authentication. It requires more than one proof of identity, such as a password plus a security key or authenticator.

Practical rules:

- Protect root user credentials and enable MFA.
- Use temporary credentials and roles where practical.
- Avoid long-lived access keys when a role can do the job.
- Never commit access keys or secrets.
- Review permissions and remove unused identities.
- If a credential leaks, revoke or rotate it immediately and investigate its use.

AWS documentation: https://docs.aws.amazon.com/IAM/latest/UserGuide/security-creds.html

## 11. How this applies to TaskFlow

A future TaskFlow environment may have:

- A developer identity that can inspect resources and deploy through an approved workflow.
- A deployment role allowed to publish or retrieve specific images.
- An application role allowed to access only the AWS resources the application needs.
- A separate database identity for database login.

Do not confuse an AWS IAM identity with a PostgreSQL database user. IAM controls access to AWS APIs and resources. The database also has its own users, roles, and permissions for SQL data.

## 12. Common beginner mistakes

- **Using root for normal work:** it creates unnecessary risk.
- **Giving AdministratorAccess to every workload:** workloads should use narrow permissions.
- **Putting access keys in .env and committing the file:** credentials must be kept out of Git history.
- **Thinking IAM secures database rows:** database authorization is a separate layer.
- **Assuming AWS secures the application automatically:** customer configuration remains important.
- **Confusing Region and Availability Zone:** an AZ is a location within a Region.
- **Assuming managed means no operations:** backups, access, monitoring, and cost still need decisions.

## 13. Knowledge checkpoint

1. What is AWS, and what does a cloud provider actually provide?
2. What is a Region?
3. What is an Availability Zone, and why might a service span more than one?
4. Explain the shared responsibility model using EC2 and RDS as examples.
5. What is an AWS account?
6. What are IAM users, groups, roles, and policies?
7. What does least privilege mean?
8. Why are temporary credentials generally safer than embedding long-lived access keys?
9. What is MFA?
10. Why is an IAM role different from a PostgreSQL database user?

**Completion rule:** You should be able to describe the AWS identity and responsibility model and explain how TaskFlow services should receive only the access they need.

## Official references

- [AWS global infrastructure](https://aws.amazon.com/about-aws/global-infrastructure/)
- [AWS shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/)
- [IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
- [AWS security credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/security-creds.html)
