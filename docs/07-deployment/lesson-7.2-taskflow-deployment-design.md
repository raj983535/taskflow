# Lesson 7.2 — TaskFlow Deployment Design

**Phase:** 7 — Cloud Deployment  
**Goal:** Combine the cloud, networking, containers, database, DNS, HTTPS, and security concepts into one coherent deployment design for TaskFlow.

## 1. What does deployment mean?

Deployment is the process of making an application available in an environment where its users can access it.

A development computer is not the same as a public deployment environment.

A deployment needs:

- A place to run the application.
- A way to deliver application images or files.
- Network connectivity.
- Domain and HTTPS configuration where public access is needed.
- Runtime configuration and secrets.
- Data storage.
- A way to check whether the application is running.
- A way to update or roll back a release.

Deployment is not just copying source files onto a server.

## 2. Start from the TaskFlow application

The planned architecture has:

- React frontend.
- Node.js and Express API.
- PostgreSQL database.

The responsibilities remain separate:

| Component | Responsibility |
|---|---|
| Frontend | Presents the user interface in the browser |
| API | Authenticates requests, validates input, applies business rules |
| Database | Persists users, tasks, and application data |

The React frontend is commonly built into static files. A web server or hosting layer serves those files to the browser. The React code then executes in the browser.

The API runs as a backend service. PostgreSQL stores persistent data.

## 3. Map the architecture into AWS

A possible first AWS design:

    Internet
       |
       v
    Route 53 DNS
       |
       v
    Public Application Load Balancer
       |
       | HTTPS / certificate
       v
    Private application subnet
       |
       +---- Web service or web server
       |
       +---- TaskFlow API container on compute
                    |
                    | private DB connection
                    v
              Private database subnets
                    |
                    v
              Amazon RDS PostgreSQL

Additional supporting services:

- ECR stores container images.
- IAM roles control access to AWS APIs.
- Security groups restrict network communication.
- CloudWatch can later collect logs and metrics.
- Backup configuration protects database data.

This is a reference architecture for learning. The actual first deployment may be simpler if an Application Load Balancer or separate web tier would add unnecessary cost. We should make the final decision after the application exists and the expected traffic and budget are known.

## 4. Public and private boundaries

A key design goal is to expose only the parts of the system that users need to reach.

A possible division:

| Resource | Network exposure |
|---|---|
| Domain / public load balancer | Public |
| Web entry point | Public through the approved entry layer |
| API compute | Private where possible; traffic comes from the approved entry layer |
| Database | Private; accepts traffic only from the API security group |
| ECR | AWS service accessed through authorized identity/network paths |
| Management access | Restricted administrative path, not general public application traffic |

The database should not be directly exposed to the public internet simply because the application needs to connect to it.

A security group can allow database traffic only from the API's security group. Database authentication still controls which database user may perform SQL operations.

## 5. How the application image gets deployed

The image path may look like:

    Developer changes source code
              |
              v
       GitHub repository
              |
              v
       Build application
              |
              v
       Build Docker image
              |
              v
       Publish image to ECR
              |
              v
       Compute retrieves image
              |
              v
       Start or replace container

The image should have a deliberate version or digest for each release. The running server should not depend on a developer's untracked local image.

The compute role should have only the permissions required to retrieve the intended image. The build/deployment role should have only the permissions required to publish the image and perform the deployment.

CI/CD automation is covered in Phase 8.

## 6. Runtime configuration and secrets

The same image may run in development, staging, and production with different configuration.

Examples of non-secret configuration:

- Environment name.
- Log level.
- Public API URL.
- Database hostname or port.

Examples of secrets:

- Database password.
- Third-party API token.
- Private signing key.
- Credentials for an external service.

Do not bake production secrets into a Docker image, Dockerfile, Git repository, or public logs.

Use a suitable secret-management mechanism and inject the required values at runtime. On AWS, a service such as Secrets Manager or Systems Manager Parameter Store may be suitable depending on the secret and use case.

The application should have permission to read only the secrets it actually needs. This access should be provided through a workload role where possible, not through a long-lived key embedded in source code.

## 7. Database design and protection

TaskFlow stores important application data. The deployment plan must decide:

- Database engine and supported version.
- Private network placement.
- Database user and permission design.
- Application connection settings.
- Encryption in transit and at rest.
- Backup retention.
- Recovery process.
- Migration strategy.
- Monitoring and maintenance windows.

RDS may reduce infrastructure administration compared with hosting PostgreSQL yourself, but it does not remove the need for database operations.

Backups must be restorable. A backup policy that has never been tested is not a complete recovery plan.

## 8. How a request reaches TaskFlow

The normal flow may be:

1. A student opens the TaskFlow domain.
2. DNS resolves the domain to the public entry point.
3. The browser establishes HTTPS.
4. The load balancer or reverse proxy forwards the request to the web layer.
5. The browser loads the React application.
6. The browser sends an API request to the configured API hostname or same-domain API path.
7. The public entry layer forwards the API request to the backend.
8. The backend checks identity and authorization.
9. The backend accesses PostgreSQL through the private network.
10. The backend returns a response to the browser.

The browser is not given direct access to the database. The backend enforces the application's business rules and database permissions.

## 9. Health and recovery design

A deployment should provide health signals at several levels:

- Infrastructure health: is the compute resource available?
- Container health: is the container running and passing its configured health check?
- Target health: is the load balancer able to reach the service?
- Application readiness: can the API safely accept requests?
- Dependency health: can the API reach the database?

A process can be alive while the application is not ready. Health checks should reflect the actual readiness condition without causing cascading failures or unnecessary restarts.

Recovery planning should consider:

- How a failed container is replaced.
- How a failed compute instance is recovered.
- How a database is restored.
- How a bad application release is rolled back.
- How secrets are rotated after exposure.

## 10. Deployment sequence

A sensible high-level sequence after the application is ready:

1. Confirm the application builds and tests locally.
2. Create the required AWS network and identity resources.
3. Create ECR repositories and publish a known image.
4. Provision compute for the application.
5. Provision the database in private network locations.
6. Configure security groups and workload roles.
7. Supply runtime configuration and secrets.
8. Configure the public entry point, DNS, and TLS.
9. Start the application and verify its health.
10. Test login, API access, database operations, backups, and logs.
11. Document cost, monitoring, recovery, and cleanup procedures.

Do not create everything in one unverified step. Build the path in small stages and verify each boundary.

## 11. Cost and architecture trade-offs

A design with more managed components may reduce the work you operate yourself, but it can introduce additional recurring charges.

For example:

- A load balancer has a cost.
- Compute resources cost money while running.
- RDS compute and storage cost money.
- NAT Gateway, public IP, data transfer, logs, snapshots, and backups can add charges.

For a small first deployment, the simplest architecture that meets security and reliability needs may be preferable to a more complex architecture.

Do not choose based on the word production alone. Choose based on actual requirements and cost. Before launch, use the current AWS pricing calculator and define an explicit monthly budget and resource cleanup plan.

## 12. What is not finalized yet?

We have not selected:

- Exact EC2 or container hosting option.
- Final frontend serving and proxy approach.
- Whether an Application Load Balancer is justified for the first release.
- Exact subnet sizes and Availability Zone layout.
- Exact database instance class and storage configuration.
- Final certificate and DNS setup.
- Production backup retention and recovery objectives.
- Monthly cost.

These choices require the real application, expected usage, security requirements, and current pricing. Do not mistake an architecture sketch for an implemented system.

## 13. Common beginner mistakes

- **Putting every resource in a public subnet:** keep internal services private where possible.
- **Exposing PostgreSQL to the internet:** allow only required application sources.
- **Using the same credentials everywhere:** separate identities and permissions.
- **Embedding secrets in images:** supply sensitive values at runtime.
- **Deploying a floating latest tag:** identify releases deliberately.
- **Assuming a healthy instance means a healthy application:** check the full request and dependency path.
- **Ignoring rollback:** a deployment plan needs a route back to a known working version.
- **Building a costly architecture too early:** match complexity to actual requirements.

## 14. Knowledge checkpoint

1. What is deployment, and why is copying source files not enough?
2. Draw the request path from TaskFlow's domain to the database response.
3. Which resources should be public and which should remain private?
4. Why does the browser never connect directly to PostgreSQL?
5. What is ECR's role in the release path?
6. How should an application receive AWS permissions?
7. How should runtime secrets be supplied?
8. What should a database backup and recovery plan cover?
9. Name the health signals you would monitor across the request path.
10. Which architecture and cost decisions must be finalized before deployment?

**Completion rule:** You should be able to explain the proposed TaskFlow deployment at a component and request-flow level, identify the trust boundaries, and distinguish confirmed design decisions from items that still require implementation research.

## Official references

- [Route 53 routing](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-routing-traffic-to-resources.html)
- [ACM public certificates](https://docs.aws.amazon.com/acm/latest/userguide/acm-public-certificates.html)
- [ALB target groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html)
- [ECR User Guide](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
- [RDS User Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html)
- [IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
