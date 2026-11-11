# Phase 9 — Monitoring and Reliability

**Two focused lessons.** A deployed application needs more than working code and a successful deployment. The team must be able to see whether it is healthy, detect problems, and respond when users are affected.

This phase introduces observability and the practical operating loop for TaskFlow.

## Where Phase 9 fits in the bigger picture

**You already know:** Phase 7 exposed the application and Phase 8 described how releases are delivered. Now TaskFlow needs to be operated after deployment.

**This phase adds:** evidence and response practices that show whether the service is healthy and help the team investigate failures.

Follow this chain:

```text
Request
   -> logs + metrics + traces
   -> dashboard / alert
   -> incident triage
   -> mitigation + verification
   -> post-incident improvements
```

Lesson 9.1 explains the signals and service goals. Lesson 9.2 explains how a human responder uses those signals, runbooks, and communication to recover service.

**Important boundary:** a dashboard shows evidence; it does not fix the problem. An alert should point to an action and an owner.

## Lesson sequence

| Lesson | Topic | Main outcome |
|---|---|---|
| 9.1 | [Observability basics](lesson-9.1-observability-basics.md) | Distinguish logs, metrics, traces, health/readiness checks, SLIs, and SLOs |
| 9.2 | [Operational response](lesson-9.2-operational-response.md) | Understand dashboards, CloudWatch, alarms, runbooks, incident triage, and follow-up |

## TaskFlow connection

For TaskFlow, useful signals could include:

- Application error rate.
- Request latency.
- Request volume.
- API availability.
- Database connection failures.
- CPU, memory, and disk pressure.
- Container restarts and health state.
- Deployment success or failure.

The aim is to detect a real user-impacting problem, understand where it occurs, and respond in a controlled way.

## Practical boundary

- These lessons are theory-first. Do not create CloudWatch dashboards, custom metrics, alarms, or paid telemetry resources just to study.
- Logs and telemetry can create storage, ingestion, query, and retention costs.
- Never record passwords, tokens, session cookies, private keys, or unnecessary personal data in logs.
- A health check is a limited signal, not proof that every application feature works.
- Monitoring choices should begin with user impact and service goals, not collecting every possible metric.

## Phase 9 integrated checkpoint

Explain:

1. What observability means.
2. How logs, metrics, and traces differ.
3. What a correlation/request ID helps with.
4. The difference between liveness and readiness.
5. What an SLI and SLO represent.
6. How a dashboard and alarm support operations.
7. What CloudWatch can collect and display.
8. How to triage an alert by checking impact, recent changes, logs, metrics, and dependencies.
9. What a runbook is and why it should be tied to an alert.
10. What should happen after an incident is resolved.

**Pass standard:** You can explain how TaskFlow's team discovers, investigates, and learns from a production problem. Learner validation is deferred until the later study pass.

## Official references

- [CloudWatch concepts and metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html)
- [Getting started with CloudWatch](https://aws.amazon.com/cloudwatch/getting-started/)
- [CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Intro.html)
- [AWS Well-Architected Operational Excellence](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html)
- [AWS runbook guidance](https://docs.aws.amazon.com/wellarchitected/2023-10-03/framework/ops_ready_to_support_use_runbooks.html)
