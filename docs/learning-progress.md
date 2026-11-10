# TaskFlow DevOps & Cloud Engineering Progress Ledger

| Phase | Module Name | Status | Key Deliverables & Documentation |
| :---: | :--- | :---: | :--- |
| **0** | **Engineering Foundations** | 🟢 *Completed* | `client-server-architecture.md`, `http-https-dns.md`, `ports-and-networking.md`, `bare-metal-vs-vm-vs-containers.md` |
| **1** | **Application Development** | ⚪ *Queued* | Node.js + Express backend, React + TS frontend, PostgreSQL schemas & migrations |
| **2** | **Git & GitHub Workflows** | ⚪ *Queued* | Branching strategy, PR templates, commit discipline, merge conflict recovery |
| **3** | **Docker Fundamentals** | ⚪ *Queued* | Multi-stage Dockerfiles, image layers, non-root users, container lifecycle |
| **4** | **Docker Compose Orchestration**| ⚪ *Queued* | Multi-container bridge network, health checks, persistent volumes, environment configs |
| **5** | **Linux & Server Administration**| ⚪ *Queued* | SSH keys, systemd daemon management, permissions, firewall rules, package managers |
| **6** | **AWS Cloud Fundamentals** | ⚪ *Queued* | IAM least-privilege, VPC & subnets, Security Groups, ECR, RDS database |
| **7** | **Cloud Deployment (Production)**| ⚪ *Queued* | EC2 instance provisioning, Nginx reverse proxy, SSL certs with Let's Encrypt |
| **8** | **CI/CD Pipelines (GitHub Actions)**| ⚪ *Queued* | Automated test runs, image builds, pushing to ECR/GHCR, SSH auto-deployment |
| **9** | **Monitoring & Reliability** | ⚪ *Queued* | Health endpoints, Winston/Pino structured logging, AWS CloudWatch metrics & alarms |
| **10**| **Scaling & High Availability** | ⚪ *Queued* | Application Load Balancer (ALB), Target Groups, Auto-Scaling Groups, session handling |
| **11**| **Kubernetes & Terraform (IaC)**| ⚪ *Queued* | Pods, Deployments, Services, Ingress, Declarative cloud provisioning with Terraform |

---

## 📌 Active Learning Log

### [Phase 0: Engineering Foundations]
- **Goal**: Demystify what happens under the hood when a user opens a web browser, requests a resource, resolves DNS, connects through a port, and hits a server process vs container.
- **Why this matters for Vercel/Supabase developers**: In Vercel and Supabase, routing, ports, SSL termination, and process sandboxing are completely abstracted away. To control real infrastructure and troubleshoot cloud failures, we must understand every layer of the network and compute stack.
