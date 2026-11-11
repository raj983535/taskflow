# Phase 10 — Scaling and High Availability

**Two focused lessons.** This phase explains what happens when more users and requests arrive, where an application can become a bottleneck, and how a system can continue operating when a component fails.

## Where Phase 10 fits in the bigger picture

**You already know:** Phase 9 showed how to measure latency, traffic, errors, resource use, and failures. Those measurements help decide whether TaskFlow needs more capacity.

**This phase adds:** ways to respond to increasing demand and to protect data and availability.

Follow this chain:

```text
Measure workload
   -> identify bottleneck
   -> improve query / application behavior
   -> scale compute or add replicas
   -> consider cache / read replica when appropriate
   -> design backup and failover
```

Lesson 10.1 explains application capacity and stateless replicas. Lesson 10.2 explains database bottlenecks, caching, replicas, backups, RPO/RTO, and availability trade-offs.

**Important boundary:** more servers can make a database bottleneck worse. Identify the constrained component before adding capacity.

## Lesson sequence

| Lesson | Topic | Main outcome |
|---|---|---|
| 10.1 | [Application scaling](lesson-10.1-application-scaling.md) | Understand vertical and horizontal scaling, stateless services, load balancers, replicas, and autoscaling |
| 10.2 | [Data and resilience](lesson-10.2-data-and-resilience.md) | Understand caching, database bottlenecks, backups, failover, and availability trade-offs |

## TaskFlow connection

As TaskFlow gains users, one server may no longer handle the traffic comfortably. Scaling can add application capacity, but it does not automatically solve database limits, poor queries, or external dependency failures.

The goal is to understand how to scale the application layer while protecting data and keeping the system recoverable.

## Practical boundary

- These lessons are theory-first. Do not create Auto Scaling Groups, load balancers, read replicas, caches, or multi-AZ resources just to study.
- Additional capacity and high-availability features can increase cost and operational complexity.
- Scaling decisions should follow evidence from traffic, latency, resource use, and database behavior.
- A cache must have a clear data freshness and invalidation strategy.
- Backups and replication solve different problems; neither replaces tested recovery procedures.

## Phase 10 integrated checkpoint

Explain:

1. The difference between vertical and horizontal scaling.
2. Why stateless application instances are easier to replicate.
3. What a load balancer does.
4. How replicas and an Auto Scaling Group relate.
5. What triggers scale-out and scale-in decisions.
6. Why more application servers may not solve a database bottleneck.
7. What caching does and what stale data means.
8. The difference between a read replica, a backup, and a failover standby.
9. What an availability-zone failure might mean for the application.
10. Which additional costs and consistency trade-offs scaling can introduce.

**Pass standard:** You can explain the main scaling levers and identify which component needs attention based on evidence. Learner validation is deferred until the later study pass.

## Official references

- [EC2 Auto Scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)
- [Application Load Balancer target groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html)
- [AWS caching best practices](https://aws.amazon.com/caching/best-practices/)
- [Amazon RDS read replicas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html)
- [AWS Well-Architected Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)

## Continue the roadmap

**Previous:** [Phase 9 — Monitoring and reliability](../09-monitoring/README.md). **Next:** [Phase 11 — Kubernetes and Terraform](../11-kubernetes-terraform/README.md).
