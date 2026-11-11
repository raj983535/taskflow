# Lesson 6.2 — AWS Networking and Compute

**Phase:** 6 — AWS Cloud Fundamentals  
**Goal:** Understand the AWS network where TaskFlow resources live and the virtual server concept used to run applications.

## Start here: reuse the network ideas you already know

You already learned about IP addresses, ports, routes, DNS, and firewalls. An AWS VPC uses those same networking ideas, but AWS gives you cloud resources to build and control the network.

Think of the VPC as the private network boundary. Subnets divide its address range. Route tables choose a path. Gateways provide paths to other networks. Security groups and network ACLs decide which traffic is allowed.

The terms public and private describe routing and reachability, not whether a subnet is named public in a diagram. A public subnet normally has a route to an Internet Gateway. A resource still needs suitable addressing and security rules to be reachable from the internet.


## 1. Begin with a normal network

From Phase 0 and Phase 5, you already know these ideas:

- A device has an IP address.
- A route decides where network traffic goes.
- A port identifies a service.
- A firewall allows or blocks traffic.

AWS uses these ideas to build a virtual network for your cloud resources.

The main service is **Amazon VPC**, which stands for Virtual Private Cloud.

A VPC is a logically isolated network that you define inside an AWS Region. It lets you choose address ranges, subnets, routes, and network security controls.

## 2. What is a VPC?

Think of a VPC as the private network boundary for a group of AWS resources.

    AWS Region
       |
       v
    TaskFlow VPC
       |
       +---- Subnet A
       |
       +---- Subnet B
       |
       +---- Subnet C

A VPC has an IP address range expressed using CIDR notation.

**CIDR** means Classless Inter-Domain Routing. It describes a block of IP addresses, such as 10.0.0.0/16.

You do not need to calculate large address ranges yet. Understand that a VPC needs a planned private address range and that overlapping ranges can complicate connections to other networks.

A VPC spans a Region, while each subnet is created in one Availability Zone.

## 3. What is a subnet?

A **subnet** is a smaller IP address range inside a VPC.

You can put resources into different subnets according to their network and availability needs.

A common design separates public-facing resources from private application and database resources.

    TaskFlow VPC
       |
       +---- Public subnet
       |       |
       |       +---- Public entry / load balancer
       |
       +---- Private application subnet
       |       |
       |       +---- API compute
       |
       +---- Private database subnet
               |
               +---- Database

A public subnet is commonly understood as a subnet whose route table provides a path to an Internet Gateway. A private subnet does not have a direct route to the Internet Gateway.

Important nuance: the subnet label alone does not make an instance reachable from the internet. Routing, public addressing, security groups, and the service's own listening configuration must also permit access.

For resilience, a production design may use subnets in multiple Availability Zones.

## 4. What is a route table?

A **route table** is a set of rules that tells network traffic where to go.

For example:

- Traffic for resources inside the VPC uses the local VPC route.
- Public internet traffic may use an Internet Gateway route.
- Some private subnet traffic may use a NAT Gateway for outbound internet access.

A simplified table might look like:

| Destination | Target | Meaning |
|---|---|---|
| VPC CIDR range | local | Stay inside the VPC |
| 0.0.0.0/0 | Internet Gateway | Route other IPv4 traffic toward the internet |

The entry 0.0.0.0/0 represents the default IPv4 route. It matches addresses not covered by a more specific route.

Routes do not replace firewall rules. A route tells traffic where to go; security controls determine whether the traffic is allowed.

## 5. What is an Internet Gateway?

An **Internet Gateway (IGW)** is a VPC component that allows communication between a VPC and the internet when the route and addressing requirements are also in place.

For an internet-facing EC2 instance, a typical path needs:

1. An Internet Gateway attached to the VPC.
2. A route from the subnet's route table to that gateway.
3. A public IPv4 address or suitable public addressing.
4. Security-group rules that allow the intended inbound traffic.
5. The application or SSH service listening on the target port.

If one of these pieces is missing, the service may not be reachable.

## 6. What is a NAT Gateway?

A private application server may need outbound internet access to download updates or retrieve external resources, but should not accept unsolicited inbound connections from the public internet.

A **NAT Gateway** can provide outbound connectivity for resources in a private subnet through a public subnet.

Simplified flow:

    Private application subnet
              |
              | outbound request
              v
          NAT Gateway
              |
              v
        Internet Gateway
              |
              v
           Internet

A NAT Gateway is a managed resource with costs. Do not create one merely for practice. The exact design depends on whether private workloads need outbound internet access and whether VPC endpoints or other approaches are suitable.

## 7. Security groups

A **security group** is a stateful virtual firewall associated with supported network interfaces and resources.

Stateful means that when an allowed connection is established, response traffic for that connection is automatically allowed, subject to the security-group model.

Example rules for a TaskFlow API:

- Allow HTTPS from an approved public entry point.
- Allow API traffic from the web/reverse-proxy layer where required.
- Allow PostgreSQL traffic only from the API security group.

Avoid rules that allow every source to reach every port.

A database security group should normally accept connections only from the application layer that needs the database.

## 8. Network ACLs

A **network access control list (network ACL or NACL)** is a subnet-level traffic filter.

Security groups and network ACLs differ:

| Security group | Network ACL |
|---|---|
| Attached to network interfaces/resources | Applied at subnet boundary |
| Stateful | Stateless |
| Rules are allow-based | Supports allow and deny rules |
| Return traffic for an allowed connection is automatically tracked | Return traffic must be allowed by the relevant rules |

For TaskFlow's initial architecture, security groups are the main rule set to understand. NACLs are an additional network layer, not a replacement for good security-group design.

## 9. What is EC2?

Amazon EC2 means Elastic Compute Cloud. It provides virtual servers called **instances**.

An EC2 instance is a virtual machine you can configure with:

- Operating system image (Amazon Machine Image, or AMI).
- Instance type, which determines compute and memory capacity.
- Network placement.
- Storage volumes.
- Identity and access roles.
- Security groups.
- Startup configuration.

A simplified EC2 launch model:

    Choose AMI
       |
       v
    Choose instance type
       |
       v
    Choose VPC and subnet
       |
       v
    Configure security group and identity
       |
       v
    Attach storage
       |
       v
    Launch instance

## 10. AMI, instance type, and EBS

Three terms are important:

- **AMI (Amazon Machine Image):** a template used to launch an EC2 instance, including operating-system and software configuration.
- **Instance type:** the hardware capacity profile, such as CPU and memory resources.
- **EBS (Elastic Block Store):** persistent block storage volumes that can be attached to EC2 instances.

An EC2 instance is the virtual server. EBS provides storage attached to it.

Stopping or terminating an instance can have different effects depending on the storage and termination settings. Do not assume all data disappears or all charges stop when an instance is stopped. Storage volumes and snapshots may continue to incur costs.

## 11. How TaskFlow may use EC2

One possible early deployment design:

- A Linux EC2 instance runs Docker Engine.
- Docker runs the TaskFlow containers.
- Security groups allow only intended public and internal traffic.
- A database may be placed on a separate managed service rather than on the same server.
- IAM role credentials allow the instance to access only required AWS services.

This is a learning architecture, not a final production choice. A managed container service could be considered later, but the roadmap first builds the core network and compute understanding.

## 12. A secure high-level TaskFlow network

    Internet
       |
       v
    Internet Gateway
       |
       v
    Public subnet
       |
       +---- Public entry point
                 |
                 v
           Private app subnet
                 |
                 +---- TaskFlow API compute
                           |
                           v
                     Private DB subnet
                           |
                           +---- Database

The goal is to avoid exposing the database directly to the public internet. The application communicates with the database over private network paths, and security groups limit which sources can connect.

## 13. Common beginner mistakes

- **Thinking a VPC is a server:** it is a network boundary, not compute.
- **Thinking a subnet is automatically public because of its name:** route tables and addressing determine reachability.
- **Confusing route tables and security groups:** routes select a path; security groups control allowed traffic.
- **Opening all inbound ports:** expose only the intended services and sources.
- **Putting the database in a public subnet without a strong reason:** keep data services private by default.
- **Assuming a private subnet has no outbound path:** a NAT Gateway or other controlled route may provide outbound access.
- **Ignoring Availability Zones:** AZ placement matters for resilience.
- **Assuming stopping EC2 removes every cost:** attached storage and other resources may remain billable.

## Guided example: trace one request through a TaskFlow VPC

Imagine a student opens TaskFlow and the request reaches an Application Load Balancer in a public subnet. The API runs on private compute, and PostgreSQL runs in private database subnets.

1. DNS directs the browser to the public load balancer.
2. The load balancer receives the HTTPS connection through its listener.
3. Its security group permits the intended inbound web traffic.
4. The load balancer forwards the request to a healthy API target in the private application subnet.
5. The API's security group permits the database connection to PostgreSQL on its database port.
6. The database security group accepts that connection only from the API's security group, not from every public IP.

Now separate the network controls:

- The **route table** tells traffic where to go.
- An **Internet Gateway** provides a path between the VPC and the internet when routes and public addressing are also configured.
- A **NAT Gateway** can provide outbound internet access for private resources. It is not a way to accept new inbound internet connections to those resources.
- A **security group** is a stateful allow-rule firewall associated with network interfaces/resources.
- A **network ACL** is a stateless subnet-level filter; return traffic rules need to be considered separately.

An EC2 instance is a virtual server placed into this network. Its AMI is the starting machine image, its instance type determines compute capacity, and EBS provides block storage.

Before you draw a subnet as public, check the route table. Before you call a server publicly reachable, also check its public address, security group, and whether the application is listening on the intended port.

## 14. Knowledge checkpoint

1. What problem does a VPC solve?
2. What is a subnet?
3. What does CIDR describe?
4. What is a route table?
5. What does an Internet Gateway provide?
6. What is a NAT Gateway used for?
7. How does a security group differ from a network ACL?
8. What is an EC2 instance?
9. What are an AMI, instance type, and EBS volume?
10. Sketch a simple TaskFlow network where the API can reach a private database but the public internet cannot directly reach it.

**Completion rule:** You should be able to explain the path of traffic into and through an AWS VPC and identify which resource controls routing, compute, and network access.

## Official references

- [What is Amazon VPC?](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [VPC subnets](https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html)
- [Internet Gateways](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)
- [NAT Gateways](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)
- [Security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html)
- [Network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)
- [Amazon EC2 concepts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html)
