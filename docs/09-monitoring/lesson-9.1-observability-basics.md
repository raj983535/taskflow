# Lesson 9.1 — Observability Basics

**Phase:** 9 — Monitoring and Reliability  
**Goal:** Understand how to tell whether TaskFlow is working, where a request is slow or failing, and what evidence helps explain the problem.

## Start here: running is not the same as working

A deployment can be successful and a process can be running while users still experience failures. For example, TaskFlow may return HTTP 200 for its health endpoint while the task-saving feature is timing out against PostgreSQL.

That is why we need evidence from the running system.

This lesson introduces three views of the same activity:

- **Logs** record individual events.
- **Metrics** summarize measurements over time.
- **Traces** show the path and timing of one request across components.

These signals are related. They are not three different names for the same thing.


## 1. Why do we need observability?

Imagine TaskFlow is deployed and a student reports:

"The task page takes 20 seconds to load."

The application is technically running. The server may even respond to a basic health check. But the user is experiencing a problem.

You need to know:

- How many requests are failing?
- Is the API slow or is the database slow?
- Is the problem affecting one user or everyone?
- Did a new release introduce the problem?
- Is the application running out of memory?
- Which request and service should be investigated?

This is why we need monitoring and observability.

**Monitoring** means collecting and watching selected signals so you can detect known problems.

**Observability** means having enough useful evidence from a system's outputs to investigate why it behaves the way it does, including problems you did not predict in advance.

## 2. The three common signal types

Three signals are often introduced together:

- Logs.
- Metrics.
- Traces.

They answer different questions.

| Signal | Main question | TaskFlow example |
|---|---|---|
| Logs | What happened? | API returned a validation error |
| Metrics | How much or how often? | 4% of requests returned errors |
| Traces | Where did one request spend time? | API spent most of its time waiting for PostgreSQL |

### Logs

A **log** is a timestamped record of an event.

Example:

    2026-11-11T10:15:30Z level=error service=taskflow-api request_id=req-123 message="database query timeout"

This is a simplified structured log.

A structured log stores fields such as timestamp, level, service, request ID, and message in a consistent format. This makes it easier to search and group related events.

A log level describes the severity or purpose of a message:

- DEBUG: detailed diagnostic information.
- INFO: normal application events.
- WARN: unusual condition that may need attention.
- ERROR: an operation failed.
- FATAL/CRITICAL: a severe failure that may prevent the service from continuing.

Exact levels and behavior depend on the logging library.

Logs should be useful but safe. Do not log credentials, access tokens, full session cookies, private keys, or unnecessary personal information.

### Metrics

A **metric** is a numeric measurement collected over time.

Examples:

- Request count.
- Error count.
- Error rate.
- Response time.
- CPU usage.
- Memory usage.
- Database connection count.

A metric is useful for spotting trends and thresholds.

For example:

    Request error rate
    0.2% -> 0.3% -> 4.5%

A sudden increase may indicate a deployment problem, dependency failure, or traffic issue.

A metric name and the way it is grouped matter. A metric for the whole service can hide one failing endpoint or one unhealthy instance.

### Traces

A **trace** follows one request through the services it touches.

Imagine a task page request:

    Browser
       |
       v
    API gateway / proxy
       |
       v
    TaskFlow API
       |
       v
    PostgreSQL
       |
       v
    API response

A trace can show how long each part took and where time was spent.

A **span** is one timed operation inside a trace. A trace is usually made up of multiple related spans.

This is useful when a request crosses multiple services and you need to find the slow component.

## 3. Correlation and request IDs

Imagine a request produces one log entry in the API and another error entry in the database client.

How do you know those log lines belong to the same request?

A **request ID** or **correlation ID** is a unique identifier attached to the request and passed through related application operations.

Example:

    request_id=req-123 service=api event="request_received"
    request_id=req-123 service=api event="database_query_started"
    request_id=req-123 service=api event="database_query_timeout"

The shared identifier helps connect the events.

Do not use sensitive personal information as a request ID. Generate an opaque identifier and avoid exposing confidential data.

Distributed tracing systems can also propagate trace context between services so spans can be joined into one trace.

## 4. The four golden signals

A practical starting point for service monitoring is the four golden signals:

1. **Latency:** how long requests take.
2. **Traffic:** how much demand the service receives.
3. **Errors:** how many requests fail.
4. **Saturation:** how close the service is to its resource limits.

Examples for TaskFlow:

| Signal | Example measurement |
|---|---|
| Latency | API request duration |
| Traffic | Requests per minute |
| Errors | HTTP 5xx response rate |
| Saturation | CPU, memory, connection pool usage |

These signals help distinguish a problem caused by high demand from one caused by errors or resource exhaustion.

## 5. Health checks: liveness and readiness

A **health check** asks whether a service meets a defined condition.

Two common concepts:

**Liveness:** Is the process alive enough that it should continue running, or is it stuck and needs restarting?

**Readiness:** Is the service ready to accept real traffic right now?

For example:

- The API process may be alive.
- But it may still be waiting for configuration or a required dependency.
- In that situation, liveness may pass while readiness fails.

Do not make a liveness check depend on every downstream service. Otherwise, a temporary database problem could cause every API instance to restart repeatedly.

A readiness check may include selected dependencies if traffic should not be sent until they are available. The check should be designed thoughtfully to avoid unnecessary cascading failures.

## 6. What is uptime and availability?

**Uptime** usually refers to the time a service is running.

**Availability** refers to whether users can successfully use the service over a defined period.

A process can be running but the service can still be unavailable because DNS, routing, dependencies, authentication, or application behavior is broken.

A rough availability calculation:

    Availability =
      Successful eligible service time
      ---------------------------------
      Total eligible service time

Real service definitions must specify which requests count, how maintenance is treated, and what constitutes a successful outcome.

## 7. SLI, SLO, and SLA

These terms are often used together.

| Term | Meaning |
|---|---|
| SLI | Service Level Indicator: a measured signal |
| SLO | Service Level Objective: the target for that signal |
| SLA | Service Level Agreement: a formal commitment, often with consequences if missed |

Example:

- SLI: percentage of eligible API requests that succeed.
- SLO: target success rate over a defined period.
- SLA: contractual promise to customers about availability or response.

Do not pick an arbitrary 99.99% target simply because it sounds impressive. The target must reflect real user needs, architecture, operational maturity, and cost.

## 8. What is Amazon CloudWatch?

Amazon CloudWatch is an AWS monitoring and observability service.

It provides capabilities for:

- Metrics.
- Logs.
- Alarms.
- Dashboards.
- Application monitoring features.

Many AWS services publish metrics to CloudWatch. An application can also publish custom metrics or send logs through configured agents and integrations.

A **namespace** groups related metrics. A **dimension** identifies a particular variation or resource for a metric, such as an EC2 instance ID.

An **alarm** watches a metric or expression and changes state when its configured threshold conditions are met.

CloudWatch metrics and alarms can have costs depending on the type, resolution, volume, retention, and related features. Check current pricing before enabling detailed or custom telemetry.

Official documentation: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html

## 9. How TaskFlow might be observed

A first practical signal set could include:

| Layer | Example signals |
|---|---|
| Frontend | Page load failures, client-side errors, user-facing latency |
| API | Request count, response time, error rate, process memory |
| Database | Connection usage, query latency, storage, health |
| Containers/compute | CPU, memory, restarts, disk space |
| Public entry | Target health, request count, response errors |

You need both service metrics and user-facing outcomes. A server can show low CPU while the application is broken because a dependency is unavailable.

## 10. Common beginner mistakes

- **Collecting every possible metric:** choose signals tied to user impact and operational decisions.
- **Using logs as the only signal:** logs explain individual events but are not always good for trends.
- **Using metrics without context:** a CPU percentage alone does not explain user impact.
- **Ignoring request correlation:** it becomes difficult to follow a request across services.
- **Treating liveness as readiness:** a process can be alive but unable to handle traffic.
- **Logging secrets:** telemetry itself can become a security incident.
- **Setting SLOs without evidence:** targets should match real service needs and capabilities.
- **Ignoring telemetry cost:** high-volume logs and detailed metrics can become expensive.

## Guided example: investigate one slow TaskFlow request

A student clicks Save. The browser waits for five seconds and then displays an error.

Imagine that the API attaches request ID req-123 to the operation.

**Logs** might show:

```text
10:15:30 request_id=req-123 event=request_received
10:15:30 request_id=req-123 event=database_query_started
10:15:35 request_id=req-123 level=error event=database_timeout
```

These event records help answer what happened to this particular request.

**Metrics** might show that API request latency and database timeout count increased during the same five-minute window. Metrics help answer whether this is one isolated request or a wider pattern.

**Trace** might show the request spent most of its five seconds waiting for the database call. A trace helps answer where the time was spent across the request path.

### Move from evidence to service goals

Suppose the team decides the important user-facing measure is the percentage of task-save requests that succeed. That percentage is the SLI (the measured indicator). The team may then set a target over a stated time window; that target is the SLO.

An SLO needs a precise definition: which requests count, what qualifies as success, and what time window is used. "99.9% availability" without those definitions is not a useful operational goal.

### Keep health checks in the right role

- Liveness asks whether a process is stuck and may need restarting.
- Readiness asks whether the instance should receive traffic now.
- User-facing metrics and tests tell you whether the full TaskFlow journey actually works.

A liveness check should not fail every time PostgreSQL is temporarily slow; that could restart all API instances and amplify the incident.

## 11. Knowledge checkpoint

1. What is the difference between monitoring and observability?
2. What question do logs answer?
3. What is a metric?
4. What is a trace and what is a span?
5. Why is a request ID useful?
6. Explain latency, traffic, errors, and saturation.
7. What is the difference between liveness and readiness?
8. What do SLI and SLO mean?
9. What is CloudWatch used for?
10. Why is a running process not proof that TaskFlow is available to its users?

**Completion rule:** You should be able to select a useful signal for a problem and explain how logs, metrics, traces, and health checks work together.

## Official references

- [CloudWatch metrics concepts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html)
- [Getting started with CloudWatch](https://aws.amazon.com/cloudwatch/getting-started/)
- [CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Intro.html)
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/)
