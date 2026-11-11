# Lesson 10.2 — Data and Resilience

**Phase:** 10 — Scaling and High Availability  
**Goal:** Understand why databases become bottlenecks, how caching helps, and how backups and availability design protect TaskFlow from failures.

## 1. Why does scaling become a data problem?

Imagine TaskFlow has more API instances and more users.

All API instances connect to the same PostgreSQL database. The database now receives more concurrent queries and writes.

The database may become the slowest part of the system.

This is a **bottleneck**: a component whose capacity limits the performance of the wider system.

A larger API fleet does not automatically make the database faster.

## 2. How to recognize database bottlenecks

Useful evidence can include:

- Slow query duration.
- High number of active connections.
- Lock waits.
- High CPU or memory pressure.
- Storage I/O pressure.
- Connection pool exhaustion.
- Query timeouts.
- Long-running transactions.

A **connection pool** is a managed group of reusable database connections. It prevents the application from creating an unlimited new connection for every request.

A poorly configured pool can either overwhelm the database or leave application requests waiting for an available connection.

## 3. Fix query and data design before adding infrastructure

Before increasing database size, check the application and query design.

Examples:

- A query scans a very large table because an appropriate index is missing.
- The application requests more columns or rows than it needs.
- A page makes many repeated small database queries.
- A transaction remains open longer than necessary.
- An N+1 query pattern causes many repeated database round trips.

An **index** is a data structure that helps the database find rows more efficiently for selected query patterns. Indexes consume storage and add work to writes, so they should be chosen based on real queries.

Optimization should use query plans and measurements, not guesses.

## 4. What is caching?

A **cache** stores a copy of data so that future requests can retrieve it faster without repeating the original work.

Imagine a TaskFlow dashboard repeatedly requests a course list that changes only occasionally.

Without caching:

    Request
       |
       v
    API query
       |
       v
    Database
       |
       v
    Response

With a cache:

    Request
       |
       v
    API checks cache
       |
       +---- hit ----> Return cached value
       |
       +---- miss ---> Query database
                         |
                         v
                    Store result
                         |
                         v
                       Return

A **cache hit** means the required value was found in the cache.

A **cache miss** means it was not found and the application must retrieve or calculate it elsewhere.

Caching can reduce latency and database load, but it adds complexity.

## 5. Cache invalidation and stale data

A cache can contain old data.

This is called **stale data**.

Suppose a student changes their profile picture. If the old image URL remains cached, the interface may show the old image.

A cache strategy must decide:

- How long the value can remain cached.
- What event invalidates or refreshes it.
- Whether stale data is acceptable.
- What happens when the cache is unavailable.

**Cache invalidation** means removing or updating a cached entry so that later requests do not keep using an outdated value.

For TaskFlow:

- Public reference data may be safe to cache for a longer period.
- Authorization decisions and sensitive student data require much more careful rules.
- Task status changes may need prompt consistency.

Do not cache sensitive or user-specific data without an explicit design for authorization and isolation.

## 6. Common cache locations

| Cache type | Example |
|---|---|
| Browser cache | Static frontend assets |
| CDN/edge cache | Public images and static files near users |
| Application memory cache | Frequently used local values inside one process |
| Shared cache | A service such as Redis used by multiple API instances |
| Database cache/buffer | Database-managed memory for data pages and query execution |

An in-memory cache inside one API instance is not automatically shared with other replicas. A shared cache service can provide a common cache across instances, but it introduces another dependency to operate.

## 7. Database read replicas

A **read replica** is a copy of a database that can serve read queries.

A simplified primary/replica model:

    Application writes
          |
          v
       Primary DB
          |
          | replicate changes
          v
       Read replica
          |
          v
    Selected read queries

This can help distribute read load, but replication may be asynchronous. The replica can lag behind the primary, meaning a recent write might not be visible immediately.

This is called **replication lag**.

Read replicas are useful only when the application can tolerate the consistency behavior and routes suitable read queries to them.

Writes normally go to the primary database in a standard primary/read-replica architecture.

## 8. Backups versus replication

These solve different problems.

**Replication** copies data to another database system, often to provide read scaling or help with availability.

**Backup** preserves a recoverable copy of data from an earlier point.

If a user accidentally deletes important rows and that deletion is replicated, the replica may also contain the deletion. Replication alone is not protection against logical data corruption.

A backup can provide a recovery point from before the mistake, depending on its retention and backup strategy.

| Replication | Backup |
|---|---|
| Keeps another database copy updated | Preserves recoverable historical data |
| Can help read scaling or failover | Helps recover from deletion, corruption, or other data loss |
| May also copy unwanted changes | Can restore an earlier state |
| May lag behind the primary | Has a defined recovery point and retention |

Both may be needed.

## 9. Recovery point and recovery time

Two useful recovery terms:

- **RPO (Recovery Point Objective):** the maximum acceptable amount of data loss measured in time.
- **RTO (Recovery Time Objective):** the maximum acceptable time to restore service after a failure.

Example:

- RPO of 15 minutes means the recovery process should lose no more than 15 minutes of data.
- RTO of 2 hours means the service should be restored within 2 hours.

These are business requirements, not default technical guarantees. A tighter RPO/RTO may require more expensive architecture and operational work.

## 10. High availability and failure zones

**High availability** means designing a service to remain usable despite certain failures.

Examples:

- Running application replicas across multiple Availability Zones.
- Using a load balancer to route traffic to healthy targets.
- Using database configurations that support failover.
- Keeping backups and tested restore procedures.
- Avoiding a single server or network component as the only point of operation.

A system may be highly available but still lose recent data if it has no suitable backup or recovery design. Availability and durability are related but different.

A **single point of failure** is a component whose failure can make the whole service unavailable.

TaskFlow should identify critical single points of failure before paying for expensive redundancy.

## 11. Managed database availability options

Amazon RDS offers configurations such as Multi-AZ deployments designed to improve availability and durability. The exact behavior depends on the selected engine and deployment option.

A standby database in another Availability Zone is not simply a read replica for application queries. In a typical Multi-AZ standby configuration, the primary handles normal database traffic and the standby is used for failover.

Read replicas and Multi-AZ deployments solve different problems. The selected design should be based on availability, read demand, recovery objectives, and cost.

## 12. A practical decision sequence for TaskFlow

If TaskFlow's API becomes slow:

1. Measure request latency and error rate.
2. Determine whether the delay is in the API, database, or another dependency.
3. Inspect slow queries and connection usage.
4. Improve query design and indexes where evidence supports it.
5. Consider connection pooling and reducing repeated queries.
6. Consider caching suitable data with clear freshness rules.
7. Consider database capacity or read replicas if read load is the measured bottleneck.
8. Review backup, restore, failover, RPO, and RTO.
9. Estimate the cost and operational burden before adding another managed service.

Do not begin by adding every cache, replica, and availability feature. Use measurements and requirements.

## 13. Common beginner mistakes

- **Adding API servers when the database is the bottleneck:** measure the whole path.
- **Caching everything:** sensitive and frequently changing data needs careful rules.
- **Ignoring stale data:** define expiry and invalidation behavior.
- **Treating a read replica as a writable primary:** understand the read/write architecture.
- **Confusing replication with backup:** deletion and corruption can be replicated.
- **Assuming Multi-AZ replaces backups:** failover and point-in-time recovery have different goals.
- **Setting unrealistic RPO/RTO values:** recovery requirements have cost and operational impact.
- **Adding complex resilience features too early:** first understand the actual failure and business requirement.

## 14. Knowledge checkpoint

1. What is a database bottleneck?
2. What signs can indicate database pressure?
3. What is a connection pool?
4. What is a cache hit and cache miss?
5. What is stale data, and what does cache invalidation mean?
6. Why might one API instance's local memory cache not work across multiple replicas?
7. What is a read replica?
8. What is replication lag?
9. Why is replication not a substitute for backup?
10. Explain RPO and RTO.
11. What is a single point of failure?
12. How do Multi-AZ availability and database backups solve different problems?

**Completion rule:** You should be able to identify the likely data bottleneck and explain which tool—query optimization, caching, read replicas, backups, or failover—addresses which problem.

## Official references

- [AWS caching best practices](https://aws.amazon.com/caching/best-practices/)
- [Amazon RDS read replicas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html)
- [RDS Multi-AZ deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html)
- [RDS backup and restore](https://docs.aws.amazon.com/AmazonRDS/latest/gettingstartedguide/managing-backup-restore.html)
- [AWS Well-Architected Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
