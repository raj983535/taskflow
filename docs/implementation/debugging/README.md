# TaskFlow debugging guides

This folder collects repeatable ways to investigate real problems in TaskFlow.

## What belongs here

Add a guide when an error or failure is likely to recur, crosses more than one layer, or taught an important engineering lesson. Examples may include a frontend request failing, an API returning a validation error, a database connection problem, a container failing to start, or a CI workflow failing.

## Required structure

1. **Symptom:** what the user or developer observes.
2. **Scope:** which environment and versions are affected, if known.
3. **First checks:** the safest status, log, request, or configuration to inspect.
4. **Investigation path:** ordered steps, including what each result means.
5. **Likely causes:** distinguish evidence from guesses.
6. **Fix:** the smallest confirmed correction.
7. **Verification:** the exact checks run and their results.
8. **Prevention:** a test, alert, documentation change, or design improvement that reduces recurrence.

Do not write a speculative fix as though it were confirmed. Link to the feature or infrastructure guide involved.
