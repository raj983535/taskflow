# Phase 7 — Cloud Deployment

**Two focused lessons.** Phase 6 introduced AWS building blocks. This phase connects those building blocks to a public web application.

The goal is to understand how someone enters a domain name in a browser and reaches TaskFlow securely, and how the application's services are placed behind public and private network boundaries.

## Where Phase 7 fits in the bigger picture

**You already know:** Phase 6 introduced AWS networks, compute, IAM, ECR, and RDS. Phase 1 introduced the browser/API/database request flow.

**This phase adds:** the public path that lets a user reach the application securely.

Follow this chain:

```text
Domain
   -> DNS destination
   -> HTTPS/TLS connection
   -> public listener
   -> reverse proxy / load balancer
   -> web or API target
   -> private database connection
```

Lesson 7.1 traces a browser request. Lesson 7.2 maps the TaskFlow components onto an example deployment and compares simpler and more managed hosting shapes.

**Important boundary:** DNS finds the destination; it does not run the app. HTTPS protects the connection; it does not prove the app is healthy. The target still needs to be running and ready.

## Lesson sequence

| Lesson | Topic | Main outcome |
|---|---|---|
| 7.1 | [Public web access](lesson-7.1-public-web-access.md) | Understand domain/DNS, HTTPS/TLS, reverse proxies, load balancers, listeners, target groups, and health checks |
| 7.2 | [TaskFlow deployment design](lesson-7.2-taskflow-deployment-design.md) | Map frontend, backend, database, network boundaries, secrets, images, and deployment steps into AWS |

## TaskFlow connection

The intended request path is broadly:

    Browser
       |
       v
    Domain name / DNS
       |
       v
    Public HTTPS entry point
       |
       v
    Reverse proxy or load balancer
       |
       v
    Application service
       |
       v
    Private database service

The actual architecture could use an Application Load Balancer, a reverse proxy on a server, or another suitable entry service. The final choice depends on the agreed hosting design, expected traffic, operational needs, and cost.

## Practical boundary

- This is deployment design, not a live AWS deployment.
- Do not buy additional infrastructure or change production DNS during the theory phase.
- A domain name does not automatically create a server or HTTPS certificate.
- DNS routing, firewall rules, listener configuration, application ports, and health checks must agree.
- AWS-managed certificates for integrated services have Region and service-integration requirements. Verify those requirements before deployment.
- All live prices and service availability must be checked before any real launch.

## Phase 7 integrated checkpoint

Explain:

1. What DNS does and how a domain name reaches an IP address or AWS resource.
2. The difference between a DNS record and a web server.
3. What TLS and HTTPS provide.
4. What a reverse proxy does.
5. How a load balancer listener and target group relate.
6. Why a health check matters.
7. How TaskFlow's public and private components should be separated.
8. Where the frontend, API, and database belong in the request path.
9. Which configuration values are secrets and how they should be supplied.
10. How you would investigate a site that resolves correctly but fails to load.

**Pass standard:** You can draw the external request path and explain which layer is responsible for DNS, encryption, routing, application execution, and data storage. Learner validation is deferred until the later study pass.

## Official references

- [Amazon Route 53 routing](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-routing-traffic-to-resources.html)
- [AWS Certificate Manager public certificates](https://docs.aws.amazon.com/acm/latest/userguide/acm-public-certificates.html)
- [Application Load Balancer target groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html)
- [Application Load Balancer health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html)
- [NGINX reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
