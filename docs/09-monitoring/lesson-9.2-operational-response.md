# Lesson 9.2 — Operational Response

**Phase:** 9 — Monitoring and Reliability  
**Goal:** Understand how to turn monitoring signals into useful alerts, investigate incidents systematically, and improve the system after recovery.

## Start here: what should happen after an alert?

Lesson 9.1 introduced the signals that help us notice a problem. This lesson connects those signals to a human response.

An alert does not automatically tell you the cause. It tells you that a condition worth investigating has occurred. The responder must confirm user impact, gather evidence, reduce the damage, verify recovery, and record what should improve.

Keep these terms distinct:

- Dashboard: a visual view of selected system signals.
- Alert: a notification that a configured condition needs attention.
- Incident: an event that disrupts or threatens normal service.
- Triage: the first structured effort to understand impact and likely cause.
- Runbook: documented steps for handling a known operational task or failure.


## 1. Monitoring must lead to action

Imagine TaskFlow's API error rate suddenly increases.

A dashboard can show the problem. But what happens next?

Someone needs to:

- Understand whether users are affected.
- Decide how serious the problem is.
- Investigate the likely cause.
- Reduce the impact.
- Verify that the system recovered.
- Record what was learned.

This is operational response.

A useful monitoring system is not just a wall of graphs. Its signals must connect to an action and an owner.

## 2. What is a dashboard?

A **dashboard** is a visual collection of important metrics and status information.

A TaskFlow dashboard might show:

- Successful request rate.
- API latency.
- API error count.
- Database connection usage.
- CPU and memory.
- Container restarts.
- Load balancer target health.
- Recent deployments.

A dashboard should help answer a specific question. Avoid putting dozens of graphs on one screen without explaining what matters.

A good starting dashboard has a small number of signals that reflect user experience and service health.

## 3. What is an alert?

An **alert** notifies someone or initiates an action when a monitored condition indicates a possible problem.

For example:

- API error rate exceeds a threshold.
- No healthy API targets remain.
- Database storage is close to full.
- Request latency remains above the expected target.
- A critical service stops reporting health.

An alert should include:

- What condition triggered it?
- Which service or environment is affected?
- When did it start?
- How severe is it?
- Where should the responder investigate?
- What action or runbook is recommended?

Avoid alerting on every harmless variation. Too many low-value alerts create **alert fatigue**, where people begin ignoring notifications.

## 4. What does CloudWatch provide?

Amazon CloudWatch can collect metrics and logs, display dashboards, and evaluate alarms.

A metric represents values over time. An alarm evaluates a configured condition over selected periods.

For example, an alarm might evaluate whether API errors remain above a threshold for a chosen number of periods rather than reacting to one brief spike.

An alarm may notify through a connected notification service or trigger a supported action. The exact behavior depends on how it is configured.

CloudWatch can also support application-level monitoring through features such as Application Signals and integration with tracing. These features can have additional pricing and configuration requirements.

## 5. Choose alert conditions carefully

An alert should represent a condition that someone needs to investigate.

A few examples:

| Signal | Possible alert purpose |
|---|---|
| High API 5xx rate | Users may be unable to complete requests |
| High API latency | User actions are taking too long |
| No healthy targets | Public traffic may have nowhere to go |
| Database storage nearly full | Writes may fail soon |
| Repeated container restarts | An application or configuration problem may exist |
| Failed backup or recovery process | Data recovery protection may be at risk |

Thresholds should be based on baseline behavior, service goals, and impact. These examples are not universal threshold values.

## 6. What is an incident?

An **incident** is an event that disrupts or threatens the normal service.

Examples:

- TaskFlow website is unavailable.
- Users cannot log in.
- Task creation fails.
- Data is missing or incorrect.
- The API response becomes too slow for normal use.
- A security credential is exposed.

A useful incident response has a few stages:

    Alert / report
          |
          v
    Confirm impact
          |
          v
    Prioritize severity
          |
          v
    Investigate evidence
          |
          v
    Mitigate or recover
          |
          v
    Verify service health
          |
          v
    Communicate and document
          |
          v
    Follow-up improvements

The goal during an incident is to restore safe service and protect users, not to prove who made a mistake.

## 7. Severity and prioritization

A simple severity model might be:

| Level | Example |
|---|---|
| Critical | Entire application unavailable or serious data/security impact |
| High | A core feature is unavailable for many users |
| Medium | A feature is degraded or a limited group is affected |
| Low | Minor issue with a workaround and limited user impact |

The exact labels and response times should be set by the organization. Do not invent a strict SLA before the team has the people and operations process to meet it.

Prioritize based on customer impact, data risk, scope, and urgency.

## 8. Incident triage: collect evidence in order

Triage is the first structured investigation of a problem.

Suppose students report that submitting tasks is failing.

A sensible sequence:

1. Confirm the issue and determine how many users or requests are affected.
2. Check whether the problem started after a recent release.
3. Inspect API error rate and latency.
4. Search application logs using a request ID or time window.
5. Check database connectivity and resource signals.
6. Check public entry and target health.
7. Form one likely hypothesis.
8. Apply a controlled mitigation.
9. Verify the user-facing behavior.
10. Continue investigating the root cause after service is stable.

Do not change several unrelated settings at once. Preserve useful evidence before restarting or removing affected resources.

## 9. Mitigation versus root-cause correction

A **mitigation** reduces user impact, even when the underlying cause is not yet fully understood.

Examples:

- Roll back a faulty release.
- Temporarily disable a broken feature.
- Add capacity if resource saturation is confirmed.
- Restore a service from a known-good configuration.

A **root-cause correction** addresses the underlying failure so it is less likely to happen again.

For example:

- Mitigation: roll back an API release that causes database query failures.
- Root-cause correction: fix the query or schema change and add a regression test.

Restoring service is the first priority. A complete root-cause investigation may continue after recovery.

## 10. What is a runbook?

A **runbook** is a documented set of steps for a known operational task or problem.

Example: API service not responding.

    1. Confirm the affected environment and hostname.
    2. Check the service/target health.
    3. Inspect the latest API logs.
    4. Check database connectivity.
    5. Check recent deployments.
    6. Follow the approved rollback or recovery procedure.
    7. Confirm the health check and a real user flow.
    8. Record the outcome.

A runbook should include:

- Purpose and symptoms.
- Required access.
- Safety warnings.
- Diagnostic commands or dashboards.
- Decision points.
- Recovery steps.
- Escalation path.
- Verification steps.

A runbook is not a random list of commands. It should be reviewed and updated as the system changes.

AWS recommends documented runbooks and playbooks for operational events. Reference: https://docs.aws.amazon.com/wellarchitected/2023-10-03/framework/ops_ready_to_support_use_runbooks.html

## 11. Runbook versus playbook

These terms are often used differently by teams, but a useful distinction is:

- **Runbook:** a repeatable procedure for a known task.
- **Playbook:** a broader guide for investigating or responding to a class of events that may require judgment.

Example:

- Runbook: how to restart a specific service safely.
- Playbook: how to investigate elevated API error rates across the full stack.

The important thing is to document who should do what, what permissions are needed, and how to verify the result.

## 12. What is a post-incident review?

After an incident, the team should record:

- What happened?
- When did it start and end?
- Which users or systems were affected?
- How was it detected?
- What mitigated the impact?
- What was the root cause, if known?
- What follow-up work will prevent recurrence or improve detection?

A **blameless review** focuses on system conditions, processes, and improvements rather than personal blame.

Possible follow-ups:

- Add a test for the failure.
- Improve a health check.
- Add a useful alert.
- Update the runbook.
- Add safer deployment checks.
- Improve database migration compatibility.
- Reduce permissions or close unnecessary public access.

Not every incident needs a long report. The depth should match the impact and learning value.

## 13. Cost and alert quality

Monitoring resources can incur costs through:

- Log ingestion and storage.
- Metric volume and custom metrics.
- Detailed monitoring.
- Alarm count and high-resolution evaluation.
- Dashboards or advanced application monitoring features.
- Trace ingestion and analysis.

Choose telemetry based on questions you need to answer. Set retention periods and avoid collecting unnecessary data.

## 14. How this applies to TaskFlow

A practical operational loop for TaskFlow could be:

1. Monitor API availability, latency, errors, and resource use.
2. Monitor database health, connections, storage, and backups.
3. Alert when a condition threatens an important user journey.
4. Use dashboards and logs to investigate.
5. Follow the incident runbook.
6. Mitigate safely and verify recovery.
7. Document the incident and improve tests, alerts, or architecture.

This is the start of operating software responsibly, not just deploying it once.

## 15. Common beginner mistakes

- **Making every warning an alert:** alerts should prompt a meaningful action.
- **Alerting without an owner:** every important alert needs a responder or escalation path.
- **Restarting before collecting evidence:** logs and process state may be lost or changed.
- **Changing many variables at once:** this makes cause and effect hard to understand.
- **Confusing mitigation with root-cause correction:** the service may recover while the underlying bug remains.
- **Treating dashboards as incident response:** dashboards show evidence; people and procedures use it.
- **Not verifying recovery:** an alert clearing does not prove users can complete their workflow.
- **Blaming an individual:** improve the system and procedures that allowed the failure.

## Guided example: TaskFlow task creation starts returning errors

Imagine a dashboard alert reports that the TaskFlow API's HTTP 5xx error rate has increased.

Follow the response in order:

1. **Confirm impact.** Is the alert real? Are students unable to create tasks? Which environment and endpoints are affected?
2. **Set priority.** A failure of the main task workflow for many users is more urgent than a minor issue in an optional admin screen.
3. **Check recent changes.** Did a new release, configuration change, database migration, or infrastructure update happen just before the errors began?
4. **Compare signals.** Look at error rate, latency, traffic, CPU/memory, database connections, and target health for the same time window.
5. **Inspect related logs.** Search by time, service, endpoint, and request ID. Avoid copying secrets or personal data into an incident report.
6. **Form one hypothesis.** For example, the latest API release may have changed a query that now times out.
7. **Mitigate.** If evidence supports it, use the approved rollback or recovery process. Do not make several unrelated changes at once.
8. **Verify recovery.** Confirm that the error rate has fallen and a real task-creation request succeeds.
9. **Communicate and record.** Tell affected people what is known, what is being done, and when the next update will come.
10. **Improve afterward.** Add a regression test, improve the alert or health check, and update the runbook if that would reduce future impact.

### Mitigation is not the same as root-cause correction

Rolling back may restore service quickly. It does not explain why the release failed or prevent the same bug from returning. A post-incident review records the causes and follow-up work.

A blameless review looks at the conditions, gaps, and safeguards in the system. Its purpose is to make future failures less likely or easier to detect and recover from.

## 16. Knowledge checkpoint

1. What is a dashboard?
2. What makes an alert useful?
3. What is alert fatigue?
4. What is an incident?
5. How should incident severity be determined?
6. What is triage?
7. What is the difference between mitigation and root-cause correction?
8. What should a runbook contain?
9. What is the purpose of a post-incident review?
10. How would you investigate a TaskFlow API error-rate spike?

**Completion rule:** You should be able to explain the operating response from alert through recovery and follow-up, and describe how dashboards, logs, metrics, and runbooks work together.

## Official references

- [CloudWatch concepts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html)
- [CloudWatch getting started](https://aws.amazon.com/cloudwatch/getting-started/)
- [CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Intro.html)
- [AWS Well-Architected Operational Excellence](https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html)
- [AWS runbook guidance](https://docs.aws.amazon.com/wellarchitected/2023-10-03/framework/ops_ready_to_support_use_runbooks.html)
