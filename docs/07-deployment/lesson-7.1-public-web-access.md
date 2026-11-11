# Lesson 7.1 — Public Web Access

**Phase:** 7 — Cloud Deployment  
**Goal:** Understand how a browser reaches an application through DNS, HTTPS, a public entry point, and a reverse proxy or load balancer.

## Start here: separate the name, the destination, and the application

You already know what an IP address and port are. Now imagine a student types a name such as taskflow.example.com instead of an IP address.

Several different systems are involved, and they do different jobs:

- **Domain registration** gives you control of the name.
- **DNS** helps the browser find the destination for that name.
- **The public entry point** receives the network connection.
- **TLS/HTTPS** protects the web connection and authenticates the server name.
- **A reverse proxy or load balancer** decides which application service should receive the request.
- **The application** processes the request and returns a response.

Buying a domain does not automatically create DNS records, a server, a certificate, or a running website. Those are separate pieces that must be connected correctly.


## 1. Start with the browser

Imagine a student opens:

    https://taskflow.example.com

The browser needs to find the server or service that handles this domain, establish a secure connection, and send an HTTP request.

The full journey may look like:

    Browser
       |
       | 1. Resolve hostname
       v
      DNS
       |
       | 2. Receive destination
       v
    Public entry point
       |
       | 3. Establish HTTPS connection
       v
    Load balancer / reverse proxy
       |
       | 4. Forward request
       v
    Frontend or API service
       |
       | 5. Application request
       v
    Backend and database

This section connects the networking and HTTP concepts from earlier phases.

## 2. What is a domain name?

A domain name is a human-readable name used to identify an internet resource.

Examples:

- example.com
- www.example.com
- api.example.com

A hostname is one specific name within a domain. A domain name does not itself contain the application or the server. It gives users a name that DNS can resolve.

Buying a domain and hosting an application are separate things:

- Domain registration gives you control over the domain name for the registration period.
- DNS records describe where names should resolve or route.
- Hosting provides the compute or managed service that runs or serves the application.

A domain can exist even when no website is running.

## 3. What is DNS?

DNS means Domain Name System.

It helps translate names into records that clients can use to locate services. For a simple website, the browser may need an address record that identifies an IPv4 or IPv6 destination, or an alias to another service.

Common record types:

| Record | General purpose |
|---|---|
| A | Maps a name to an IPv4 address |
| AAAA | Maps a name to an IPv6 address |
| CNAME | Makes one DNS name an alias of another DNS name |
| MX | Identifies mail exchangers for a domain |
| TXT | Stores text data used for verification and other purposes |
| NS | Identifies authoritative name servers for a zone |

A DNS zone is a portion of the DNS namespace for which records are managed together. A hosted zone is the AWS Route 53 resource that stores DNS records for a domain or subdomain.

In AWS, Route 53 can route a domain to AWS resources or other endpoints. A public hosted zone is used for internet-facing DNS; a private hosted zone is for DNS resolution within associated VPCs.

Official guide: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-routing-traffic-to-resources.html

## 4. What happens after DNS resolves?

DNS provides a destination. It does not run the website.

After resolving the hostname, the browser connects to the destination using a network protocol and port.

For a typical secure website:

    https://taskflow.example.com

The default HTTPS port is 443. The service receiving the connection must be configured to accept that traffic.

If DNS points to an old or incorrect IP address, the browser can reach the wrong server. If DNS is correct but the server is down, the site still fails.

A correct DNS record is necessary for a normal domain-based deployment, but it is not sufficient to prove the application is healthy.

## 5. What is HTTPS and TLS?

HTTP is the protocol used for web requests and responses.

HTTPS is HTTP protected by TLS (Transport Layer Security).

TLS helps provide:

- Encryption: network observers should not be able to read the protected traffic.
- Integrity: traffic tampering can be detected.
- Server authentication: the client can verify that it is talking to the service named in the certificate, subject to certificate trust and validation.

A TLS certificate binds a public key to a domain or set of names. The certificate must be issued by a trusted certificate authority and be valid for the hostname the browser is visiting.

The browser verifies the certificate and establishes the encrypted connection before normal HTTPS application traffic is exchanged.

A certificate is not a firewall and does not protect a vulnerable application by itself.

## 6. Certificate management in AWS

AWS Certificate Manager (ACM) can issue and manage public certificates for supported AWS-integrated services.

For example, a public certificate can be associated with an Application Load Balancer HTTPS listener, subject to ACM's Region and integration requirements.

A common process is:

1. Request a certificate for a domain you control.
2. Prove domain control, commonly using DNS validation.
3. Wait until the certificate is issued.
4. Attach the certificate to a supported service, such as a load balancer HTTPS listener.
5. Configure HTTP-to-HTTPS behavior if required.
6. Test that the expected hostname presents the correct certificate.

For public ACM certificates used with services such as Elastic Load Balancing, certificate use is tied to service integration and Region. Do not assume an AWS-issued public certificate can simply be downloaded and installed on any EC2 instance. Verify the supported use case before design.

Official guide: https://docs.aws.amazon.com/acm/latest/userguide/acm-public-certificates.html

## 7. What is a reverse proxy?

A **proxy** is an intermediary that receives a request and passes it to another system.

A **reverse proxy** sits in front of application servers. It accepts client requests, forwards them to the appropriate backend, and returns the backend response to the client.

Example:

    Browser
       |
       v
    NGINX reverse proxy
       |
       +---- /        -> frontend files
       |
       +---- /api     -> TaskFlow API

The browser talks to the public proxy. The proxy talks to the internal service.

This can help:

- Keep internal application ports private.
- Route different URL paths to different services.
- Terminate TLS at the public entry point.
- Add request headers and other proxy behavior.
- Provide one external entry point for multiple application services.

NGINX is one common reverse proxy. Its proxy_pass directive forwards requests to an upstream server. Official documentation: https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/

## 8. Reverse proxy and browser-side React

A critical point for TaskFlow:

React code runs in the user's browser. If the frontend JavaScript calls a URL such as http://api:3000, the browser tries to resolve api using the user's own network and DNS. It does not automatically know Docker Compose service names.

There are two common designs:

**Design A: public API hostname**

- Website: https://taskflow.example.com
- API: https://api.taskflow.example.com

The browser calls the public API hostname. DNS and routing direct the request to the API entry point.

**Design B: same-domain reverse proxy**

- Website: https://taskflow.example.com
- API path: https://taskflow.example.com/api

The reverse proxy receives the browser request and forwards /api requests to the internal API service using the private service network.

Both approaches can work. The implementation choice depends on hosting, security, cookie/CORS strategy, and how the frontend is built.

## 9. What is a load balancer?

A load balancer distributes incoming requests across one or more application targets.

An AWS Application Load Balancer (ALB) operates at the application layer and supports HTTP/HTTPS routing rules.

It uses concepts such as:

- Listener: the port and protocol that accept incoming connections.
- Listener rule: a condition that decides where a request should go.
- Target group: a named group of destinations that receives forwarded traffic.
- Target: a server or IP address registered to receive requests.
- Health check: a repeated test that determines whether a target is healthy enough to receive traffic.

A simplified path:

    Browser
       |
       v
    ALB HTTPS listener
       |
       | rule matches host/path
       v
    Target group
       |
       +---- API instance A
       |
       +---- API instance B

A target group can contain multiple targets. The load balancer uses the configured routing and health information to decide where to send traffic.

Official guide: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html

## 10. What is a health check?

A health check is a repeated test that asks whether a service or target is healthy according to a defined condition.

For an HTTP application, the check may request an endpoint such as /health.

A successful health check should indicate that the target can perform the basic job expected of it. A weak health check that always returns success can hide a broken dependency.

For example, the application may be alive but unable to connect to PostgreSQL. Depending on the design, a readiness endpoint may report that the API is not ready to handle requests.

An ALB target group performs health checks on registered targets and routes traffic according to the health configuration. Health checks are not a guarantee that all user journeys work. They are one signal. Official guide: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html

## 11. HTTP versus HTTPS entry design

A common public web design:

- HTTP port 80 accepts a request and redirects it to HTTPS.
- HTTPS port 443 presents a valid certificate and forwards secure application traffic.

The HTTP-to-HTTPS redirect should preserve the intended hostname and path. The backend may receive forwarded headers describing the original protocol, host, or client address, depending on the proxy configuration.

The application must trust forwarded headers only from known proxies. Otherwise, client-supplied headers can be misleading.

## 12. TaskFlow example request path

A possible later architecture:

    Student browser
          |
          v
    taskflow.example.com
          |
          v
    DNS record / Route 53
          |
          v
    AWS public load balancer
          |
          | HTTPS listener + certificate
          v
    Target group / reverse proxy
          |
          +---- web service (static React)
          |
          +---- API service (Node.js/Express)
                       |
                       | private network
                       v
                 PostgreSQL database

This is a design-level example, not a deployed TaskFlow system. A simpler or different architecture may be chosen based on actual implementation requirements and cost.

## 13. Troubleshooting the public access path

Imagine the domain resolves but the web application does not load.

Work from the outside inward:

1. Does DNS resolve to the expected AWS resource?
2. Is the resource available and reachable?
3. Is the intended listener active on the correct port?
4. Is the TLS certificate valid for the hostname?
5. Does the listener rule point to the correct target group?
6. Are the targets healthy?
7. Can the reverse proxy reach the application?
8. Is the application listening on the expected port?
9. Do application logs show a request or error?

Do not change DNS and security-group rules at the same time. Find the layer that failed first.

## 14. Common beginner mistakes

- **Thinking DNS hosts the website:** DNS only helps locate the destination.
- **Thinking a domain purchase creates hosting:** domain registration and application hosting are separate.
- **Using HTTP for login or sensitive traffic:** use HTTPS for public application access.
- **Assuming certificate issuance proves the application is working:** it only proves certificate validation and issuance.
- **Confusing listener and target group:** the listener accepts traffic; the target group identifies where traffic is forwarded.
- **Thinking a healthy target means every feature works:** health checks are limited tests.
- **Using internal Docker DNS names in browser JavaScript:** browser requests need a user-accessible hostname or a proxy path.
- **Trusting forwarded headers from any source:** accept them only from known reverse proxies.

## Guided example: follow the browser request step by step

Imagine a student visits `https://taskflow.example.com`.

1. **DNS lookup:** the browser asks DNS for the records associated with taskflow.example.com. DNS returns or aliases to the public entry destination.
2. **Network connection:** the browser connects to that destination using the HTTPS port, commonly TCP 443.
3. **TLS check:** the server presents a certificate for the hostname. The browser checks its validity and trust, then establishes encrypted communication.
4. **Listener:** a load balancer or reverse proxy accepts the connection on its configured HTTPS listener.
5. **Routing rule:** the entry layer decides whether the request is for the web frontend or an API path/hostname.
6. **Target group or upstream:** the request is forwarded to a healthy application target.
7. **Response:** the application creates the response, which travels back through the entry layer to the browser.

### Where would you look if it fails?

| Symptom | First layer to check |
|---|---|
| Domain does not resolve | DNS records, hosted zone, nameserver delegation |
| Domain resolves, but connection times out | Public entry point, routing, security rules, listener |
| Browser reports certificate warning | Certificate hostname, validity, and listener attachment |
| Load balancer reports unhealthy targets | Health-check path/port and application readiness |
| Frontend loads, API call fails | API URL/path, proxy route, CORS/cookies if separate origins, API target health |

A health check is a limited test of a target, not proof that every TaskFlow feature works. If the entry layer forwards `/api` to the API, the API's health endpoint and network path must be configured consistently.

The browser is outside Docker or Kubernetes internal DNS. A browser-side React application must call a user-accessible API hostname or a same-domain route handled by a reverse proxy. It cannot normally use a private container service name such as api.

## 15. Knowledge checkpoint

1. What is the difference between domain registration, DNS, and hosting?
2. What is the purpose of an A record and CNAME record?
3. What does HTTPS add to HTTP?
4. What does a TLS certificate prove to the browser?
5. What does a reverse proxy do?
6. What are a load balancer listener and target group?
7. What does a health check test?
8. Why can't browser-side React code normally use a Docker service name such as api?
9. Describe how a request reaches TaskFlow from a domain name to the API.
10. Where would you investigate if DNS is correct but the target group reports unhealthy targets?

**Completion rule:** You should be able to trace a browser request across DNS, HTTPS, public routing, proxy/load balancer, and the application service.

## Official references

- [Route 53 routing](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-routing-traffic-to-resources.html)
- [ACM public certificates](https://docs.aws.amazon.com/acm/latest/userguide/acm-public-certificates.html)
- [ALB target groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html)
- [ALB health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html)
- [NGINX reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
