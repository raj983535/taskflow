# Lesson 10.1 — Application Scaling

**Phase:** 10 — Scaling and High Availability  
**Goal:** Understand how an application handles increasing demand and how additional compute capacity can be added safely.

## Start here: capacity is about the workload, not just the number of users

Imagine TaskFlow is used by one class today and an entire campus tomorrow. More simultaneous users usually means more browser requests, API work, and database activity.

Scaling means changing capacity to meet the workload. It is not automatically the same as making the application faster. First find which component is limiting the user journey.

There are two basic ways to add compute capacity:

- **Vertical scaling:** give one machine more CPU or memory.
- **Horizontal scaling:** add more application instances and distribute requests across them.

The second approach introduces more moving parts. The application must be designed so that any healthy instance can handle the next request.


## 1. What does scaling mean?

Imagine TaskFlow initially has 100 active users. Later, a campus campaign brings 5,000 students to the application at the same time.

The application receives more requests:

- More login attempts.
- More task-list requests.
- More task updates.
- More database queries.
- More frontend traffic.

If one application server cannot handle the demand, response times increase or requests fail.

**Scaling** means adjusting system capacity so it can handle the required workload.

Scaling should solve a measured problem. Adding servers before understanding the bottleneck can increase cost without improving performance.

## 2. Vertical scaling

Vertical scaling means increasing the capacity of one machine.

For example:

    Before:
    2 vCPU + 4 GB RAM
            |
            v
    After:
    4 vCPU + 16 GB RAM

The server has more compute and memory capacity.

Advantages:

- Often simpler than distributing an application across multiple servers.
- May require fewer architecture changes.
- Can help when one process needs more CPU or memory.

Trade-offs:

- There is a practical upper limit to machine size.
- A single machine can remain a single point of failure.
- Larger instances may cost more.
- Some changes require restart or replacement.

## 3. Horizontal scaling

Horizontal scaling means adding more instances of an application.

Instead of one API server:

    One API instance
          |
          v
       Requests

You may run several:

    API instance A
          |
    API instance B
          |
    API instance C

A load balancer distributes incoming requests among healthy instances.

Advantages:

- More total application capacity.
- Can improve availability if instances are spread across failure zones.
- Can increase or decrease the number of instances as demand changes.

Trade-offs:

- More components to operate.
- Requires careful session, cache, and shared data design.
- All instances must use compatible application versions and configuration.
- The database or another shared dependency can become the bottleneck.

## 4. Why stateless services matter

A **stateless application instance** does not rely on one specific server's local memory or disk to remember important user state between requests.

Imagine a user logs in and the login session exists only in memory on API instance A. The next request is sent to API instance B. Instance B has no record of the session.

This is difficult to scale.

A more scalable design stores shared state in an appropriate shared system, such as:

- A database.
- A managed session store.
- A signed token with carefully designed expiry and revocation behavior.

The application instances can then handle requests more independently.

Stateless does not mean the application has no state. It means important state is not trapped on one replaceable application instance.

## 5. What does a load balancer do?

A **load balancer** receives traffic and distributes it across a set of targets.

It can check target health and avoid sending normal traffic to targets that fail the configured health checks.

    Browser requests
          |
          v
      Load balancer
       /    |    \
      v     v     v
    API A API B API C
       \    |    /
        Database

The load balancer is one public or internal entry point. It does not automatically make the application itself stateless or fix a slow database query.

In AWS, an Application Load Balancer can route requests to target groups containing registered targets such as EC2 instances or IP addresses.

## 6. Replicas and desired capacity

A **replica** is another running instance of the same application component.

If a service needs three API replicas, the system aims to keep three suitable instances available.

A desired capacity is the number of instances a system should aim to run.

For Kubernetes, this may be a Deployment replica count. For EC2, an Auto Scaling Group can maintain a desired instance count.

Replicas provide more capacity, but only if the surrounding architecture supports them:

- They need shared or externalized state.
- They need the same configuration.
- They need access to the same required dependencies.
- The load balancer must route requests correctly.
- The database must handle the resulting concurrency.

## 7. What is an Auto Scaling Group?

An EC2 Auto Scaling Group manages a group of EC2 instances according to configured rules.

It can:

- Maintain a desired number of instances.
- Replace unhealthy instances.
- Scale out by adding instances.
- Scale in by removing instances.

A simplified flow:

    Monitor demand / health
             |
             v
       Scaling policy
             |
       +-----+-----+
       |           |
       v           v
    Scale out   Scale in
    add server  remove excess
       |
       v
    Load balancer registers healthy targets

A scaling policy can be based on metrics such as CPU utilization or other selected signals. The correct metric depends on the application bottleneck.

Do not assume CPU alone is enough. An API may be waiting on a database or external service while CPU remains low.

## 8. Scale-out and scale-in

**Scale-out** means adding capacity.

**Scale-in** means reducing capacity.

An autoscaling system needs thresholds and cooldown/decision behavior so that it does not constantly add and remove instances due to small fluctuations.

This oscillation is sometimes called scaling thrash.

A good design considers:

- Sustained demand rather than one short spike.
- Time required to start an instance.
- Health-check readiness.
- Minimum and maximum capacity.
- Cost limits.
- Graceful removal of instances so active requests can finish.

## 9. Capacity is a full-stack problem

Adding API instances may increase the number of simultaneous database connections.

Imagine:

- One API instance creates 10 database connections.
- Five API instances may create up to 50 connections.
- A database with limited capacity may become overloaded.

The API tier has scaled, but the database has become the bottleneck.

This is why scaling requires measuring the full request path:

- Browser and edge.
- Load balancer.
- API compute.
- Database.
- External dependencies.

Scaling one component can move the bottleneck to another.

## 10. How this applies to TaskFlow

A later TaskFlow design may use:

- A load balancer for public traffic.
- Multiple API instances or containers.
- Stateless API behavior.
- A shared database.
- Autoscaling based on measured demand.
- Health checks to avoid routing traffic to unhealthy instances.

The exact number of instances and scaling thresholds cannot be chosen without workload measurements and cost expectations.

## 11. Common beginner mistakes

- **Thinking adding servers always fixes slowness:** the database or external service may be the bottleneck.
- **Storing sessions only in process memory:** another replica may not know the session.
- **Scaling on CPU alone:** the bottleneck may be latency, database connections, memory, or network.
- **Scaling too quickly on short spikes:** it can cause instability and unnecessary cost.
- **Removing instances abruptly:** active requests may be interrupted.
- **Ignoring minimum and maximum capacity:** an autoscaling policy needs cost and safety bounds.
- **Assuming replicas equal high availability:** failure zones and shared dependencies still matter.

## Guided example: prepare for a campus-wide TaskFlow login peak

Suppose many students open TaskFlow at 9:00 AM.

1. Request traffic rises. Measure request rate, latency, error rate, CPU, memory, and database connections.
2. If one API server is running out of CPU or memory, a larger instance may help. That is vertical scaling.
3. If the API is well suited to multiple independent instances, add replicas. That is horizontal scaling.
4. Put a load balancer in front of the replicas so traffic can be sent to healthy instances.
5. Keep important session and application state outside one server's local memory. Otherwise, a request sent to another replica may not recognize the user's state.
6. If demand remains high, an Auto Scaling Group or another autoscaling mechanism can add capacity according to a defined policy.
7. When demand falls, scale-in can remove excess capacity, but instances should be drained safely so active requests are not interrupted.

### A hidden bottleneck: the database

Suppose every API instance opens 20 database connections. Adding five instances could raise the potential connection count to 100. If PostgreSQL cannot handle that load, the API tier may become larger while the overall application becomes slower.

That is why scaling decisions must follow the full request path. Check the database and external dependencies before deciding that more API instances are the answer.

### What does "stateless" mean here?

It does not mean TaskFlow has no data. It means one API instance does not keep the only copy of important user/session state in its own memory or local disk. Shared database/session storage or carefully designed tokens let another healthy instance process the next request.

A load balancer distributes traffic; an autoscaling system changes capacity. These are related but separate jobs.

## 12. Knowledge checkpoint

1. What is scaling?
2. What is the difference between vertical and horizontal scaling?
3. Why does statelessness help horizontal scaling?
4. What does a load balancer do?
5. What is a replica?
6. What does an Auto Scaling Group manage?
7. What is scale-out and scale-in?
8. Why can adding API replicas overload a database?
9. What signals besides CPU might help decide to scale?
10. Why should a server be drained or marked unavailable before it is removed?

**Completion rule:** You should be able to explain how a request is distributed across multiple instances and recognize the shared dependencies that can limit scaling.

## Official references

- [Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)
- [ALB target groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html)
- [ALB target health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html)
