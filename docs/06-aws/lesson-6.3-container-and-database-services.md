# Lesson 6.3 — Container and Database Services

**Phase:** 6 — AWS Cloud Fundamentals  
**Goal:** Understand where TaskFlow's container images can be stored and how a managed database service can reduce infrastructure work.

## Start here: Docker images and databases need cloud services too

From Phase 3, you know how to build an image and run it as a container. From Phase 4, you know that an application may contain several services. When TaskFlow moves to AWS, two practical questions appear:

1. Where does the compute environment download the exact image it should run?
2. Where should important relational data live, and who manages the database infrastructure?

Amazon ECR answers the first question by storing container images. Amazon RDS can answer the second by operating a managed relational database such as PostgreSQL.

ECR stores an image; it does not execute it. RDS manages database infrastructure; it does not remove your responsibility for schema design, database users, data access, or recovery planning.


## 1. Connect the Docker and AWS ideas

In Phase 3, you learned how to build a Docker image. In Phase 4, you learned how to connect multiple containers with Compose.

A cloud server needs access to the image it will run.

We need an image registry.

A production application also needs a database that remains available and keeps data safe. AWS provides a managed relational database service.

This lesson introduces two services:

- Amazon ECR: stores container images.
- Amazon RDS: manages relational database instances.

## 2. What is Amazon ECR?

ECR means Elastic Container Registry.

It is a managed container image registry. It stores Docker-compatible container images and makes them available to authorized compute services and users.

The usual flow:

    Developer or CI workflow
              |
              | build image
              v
         Local image
              |
              | push image
              v
        Amazon ECR repository
              |
              | pull image
              v
         Compute service
              |
              v
        Running container

A repository in ECR is a named place for images. Image tags can identify versions, such as dev, staging, or a release number.

For controlled deployments, prefer deliberate release tags or immutable image digests rather than relying only on a moving latest tag.

## 3. Why use a registry?

Without a registry, a deployment process has no controlled place to retrieve the image built by the development or CI system.

A registry helps provide:

- Central storage.
- Access control.
- Distribution to deployment environments.
- Version/tag organization.
- Image lifecycle management.

ECR access is controlled through AWS identity permissions and repository policies. A deployment role should receive only the permissions needed to publish or retrieve the intended repository.

Do not give every developer or instance broad account-level permissions just to pull one image.

Official guide: https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html

## 4. Image security and lifecycle

A container image may contain old operating-system packages or vulnerable application dependencies.

An image registry is not automatically proof that an image is secure.

A responsible image process should:

- Use trusted base images.
- Build from reviewed source and lockfiles.
- Scan images where appropriate.
- Rebuild to receive security updates.
- Avoid embedding secrets.
- Use clear release tags or digests.
- Remove old images according to a retention policy.

A **lifecycle policy** is a rule that helps expire or remove older images according to defined criteria. Do not remove images still needed for rollback or compliance.

## 5. What is Amazon RDS?

RDS means Relational Database Service.

Amazon RDS is a managed service for running supported relational database engines. It can manage infrastructure tasks such as provisioning, backups, patching options, monitoring integration, and recovery features, depending on the configuration.

It supports database engines such as PostgreSQL and MySQL, among others.

TaskFlow already uses PostgreSQL in its proposed application stack. RDS for PostgreSQL is therefore a possible managed database path.

Managed does not mean no database administration. You still need to understand:

- Database users and permissions.
- Schema and migrations.
- Network access.
- Password/secret storage.
- Backup and restore needs.
- Database performance and capacity.
- Maintenance windows and engine versions.

## 6. Why might TaskFlow use RDS?

Running PostgreSQL in a container on the same EC2 host as the API is possible for local development and some small deployments, but it leaves the project responsible for more of the database's operations.

Using RDS can reduce the work of managing database infrastructure.

A simplified design:

    TaskFlow API compute
             |
             | private network connection
             v
       Amazon RDS for PostgreSQL
             |
             +---- managed storage
             |
             +---- backup configuration
             |
             +---- monitoring and maintenance options

The API should connect to the database using the RDS endpoint, database port, database name, and appropriate credentials. The database should normally be placed in private subnets and accept connections only from the API's security group.

## 7. RDS networking and security

A managed database is still a network service.

A secure pattern:

- Place the database in a private network location.
- Disable public accessibility unless a specific reviewed requirement exists.
- Allow the database port only from the application security group or other required internal sources.
- Use database-specific users with limited privileges.
- Protect passwords using a suitable secret-management approach.
- Use encrypted connections where required and supported.
- Encrypt storage and backups using the appropriate service settings.

Do not expose PostgreSQL port 5432 to every IP address on the internet.

Network access and database authentication are separate. A security group may allow a TCP connection, but the database still checks whether the username and password have permission to access the database.

## 8. Backups, snapshots, and recovery

A backup is a copy of data that helps recover after accidental deletion, corruption, or failure.

RDS supports automated backups and manual snapshots, depending on service and configuration.

A **snapshot** is a point-in-time backup image of the database storage state that can be used to restore an instance.

Important terms:

- Backup retention: how long automated backups are retained.
- Point-in-time recovery: restore to a supported point within the backup retention window.
- Snapshot: a user-initiated recovery point.
- Multi-AZ: a deployment configuration designed to improve availability by using another Availability Zone.

Backups and high availability solve different problems:

- Backups help recover data after loss or corruption.
- Multi-AZ is primarily about availability and resilience during certain infrastructure failures.

A backup is useful only if you know how to restore it and have tested the recovery process. AWS documentation: https://docs.aws.amazon.com/AmazonRDS/latest/gettingstartedguide/managing-backup-restore.html

## 9. RDS cost and capacity

RDS charges depend on factors such as:

- Database instance class and running time.
- Storage size and storage type.
- Backup storage and retention.
- Data transfer and related resources.
- Multi-AZ or additional replicas.
- Selected engine and configuration.

A database may continue incurring costs even when no users are actively using TaskFlow.

Do not create an RDS instance for a theory exercise. Before any later use, choose an appropriate small instance, verify the live pricing for the selected Region, set budgets/alerts, decide how to back up the data, and plan how to delete resources safely.

## 10. Cost awareness across AWS

A cloud bill can contain charges from several resource categories:

| Resource | What may be billed |
|---|---|
| EC2 | Instance runtime and related compute usage |
| EBS | Provisioned storage and snapshots |
| ECR | Image storage and data transfer, depending on usage |
| RDS | Database compute, storage, backups and additional options |
| NAT Gateway | Hourly usage and processed data |
| Load balancer | Hours and processed capacity/data |
| Public IPv4 | Public address usage under current AWS pricing |
| Data transfer | Traffic between locations or to the internet, depending on path |

Avoid assuming that stopping one instance stops the entire bill. Other resources can remain active.

Cost controls to plan before deployment:

1. Create billing budgets and alerts.
2. Tag resources with project and environment names.
3. Keep a resource inventory.
4. Use the smallest appropriate capacity for development.
5. Remove unused resources.
6. Review storage, snapshots, NAT Gateways, and public addresses.
7. Verify the final bill after cleanup.

Always consult current regional AWS pricing and the AWS Pricing Calculator before launching resources. No fixed price is assumed in this lesson.

## 11. How ECR and RDS fit into TaskFlow

A possible future deployment flow:

    Source code
        |
        v
    CI build process
        |
        v
    Docker image
        |
        | push
        v
    Amazon ECR
        |
        | pull
        v
    TaskFlow compute
        |
        | private database connection
        v
    Amazon RDS PostgreSQL

IAM roles control which AWS operations the build or compute processes can perform. Network rules control connectivity. Database credentials control SQL access. Backups and monitoring support operations.

These are different security layers; one does not replace the others.

## 12. Common beginner mistakes

- **Treating ECR as a runtime:** ECR stores images; a compute service runs containers.
- **Using moving tags as the only deployment identifier:** a tag can change. Use deliberate release versions or digests.
- **Giving an EC2 instance broad ECR permissions:** use a narrowly scoped IAM role.
- **Exposing RDS publicly for convenience:** prefer private connectivity from the application.
- **Thinking a security group replaces database users:** network rules and database permissions protect different layers.
- **Assuming RDS backups mean zero data loss:** understand the configured recovery window and test restores.
- **Confusing backups with Multi-AZ:** recovery and availability are related but separate goals.
- **Ignoring image retention:** deleting images too aggressively can make rollbacks impossible.
- **Assuming stopped compute means zero cost:** storage and other resources may remain billable.

## Guided example: one TaskFlow release reaches its database

Imagine the TaskFlow API has been built into a container image and is ready for deployment.

1. A build system tags the image with a deliberate release identifier, such as a version or commit-based tag.
2. The image is pushed to an ECR repository. ECR stores it and controls access through IAM and repository policies.
3. The API compute environment obtains permission to pull that repository's image and starts a container from it.
4. The API connects to an RDS for PostgreSQL endpoint over a private network path.
5. A security group allows the connection from the API layer, while PostgreSQL authentication checks the database username and password.
6. RDS backup and availability settings determine which recovery options exist if data or infrastructure is lost.

Notice the separate controls:

- IAM permissions allow access to AWS resources such as ECR and RDS management APIs.
- Security groups control which network connections can reach the database.
- PostgreSQL users and privileges decide which database operations are allowed.
- Backups help recover earlier data. Multi-AZ configurations aim to improve availability. A read replica can serve suitable read traffic but may lag behind the primary.

Before using any of these managed resources, estimate the monthly cost for the chosen Region and configuration. EC2, RDS, storage, snapshots, ECR storage, NAT Gateway, load balancers, and data transfer may all add charges. Stopping a compute instance does not automatically remove every billable resource.

This lesson is about how the pieces connect, not about creating them now. The actual TaskFlow image, repository, database version, network, and budget are still implementation decisions.

## 13. Knowledge checkpoint

1. What is ECR, and why does TaskFlow need an image registry?
2. What is the difference between an image tag and an image digest?
3. What does a lifecycle policy help manage?
4. What is RDS?
5. Which database responsibilities still belong to the application team when using RDS?
6. Why should an RDS database normally be private?
7. How do a security group and database credentials protect different layers?
8. What is the difference between an automated backup, a snapshot, and Multi-AZ?
9. Name at least five AWS resources that may create charges.
10. Why should you configure budgets and a cleanup plan before creating cloud resources?

**Completion rule:** You should be able to explain the image distribution path, the managed database role, and the access, recovery, and cost decisions that TaskFlow needs.

## Official references

- [Amazon ECR User Guide](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
- [Amazon ECR image scanning](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html)
- [Amazon RDS User Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html)
- [RDS security best practices](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.Security.html)
- [RDS backup and restore](https://docs.aws.amazon.com/AmazonRDS/latest/gettingstartedguide/managing-backup-restore.html)
- [AWS Pricing Calculator](https://calculator.aws/)
