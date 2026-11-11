# [Feature or technical concept]

> **Status:** Proposed / Implemented / Verified  
> **Last updated:** YYYY-MM-DD  
> **Code areas:** [Current repository paths]  
> **Related theory:** [Link to relevant Phase 0–11 lesson(s)]

## 1. Why this exists

What user problem or engineering need caused this implementation? Why is it needed at this point in TaskFlow? What would be missing or difficult without it?

## 2. What was introduced

Summarise the behaviour and list the important files, components, endpoints, tables, migrations, dependencies, services, and configuration added or changed. Link to each current path.

## 3. Beginner's mental model

Explain the new concepts in simple language before using specialist terms. Define acronyms. Explain what each major part is responsible for and what it is not responsible for.

## 4. Business logic and expected behaviour

Describe the rules the application follows:

- User input and preconditions.
- Validation and business constraints.
- Permissions and ownership rules, if applicable.
- State changes and calculations, if applicable.
- Success behaviour.
- Invalid input, missing records, conflicts, and failure behaviour.

Do not invent rules. Mark unresolved requirements as open questions.

## 5. How the complete flow works

Describe the flow in order. For example:

1. What the user does in the browser.
2. Which frontend component handles the action.
3. What request is sent and why.
4. Which backend route/controller/service handles it.
5. What validation and business rules run.
6. What database operation occurs, if any.
7. What response returns to the frontend.
8. What the user sees next.

Include a simple diagram when it makes the relationship easier to understand.

## 6. Code map

| File or location | Responsibility | Important function/component/configuration |
|---|---|---|
| [path] | [what this file owns] | [important symbol] |

Explain how the files work together. Keep paths and names aligned with the current code.

## 7. Important code and configuration explained

Explain the important implementation choices and configuration fields. For commands, state which terminal or working directory to use, what important flags mean, what the command changes, and what successful output should indicate.

List environment variable names and safe example placeholders only. Never include secret values.

## 8. Security, data safety, and failure cases

Explain applicable authentication, authorization, validation, privacy, secret handling, database integrity, error handling, and data-loss risks. Include likely failure cases and the first useful investigation step.

## 9. How to run and verify

List the exact commands and checks that apply. Separate commands that were actually executed from commands provided as instructions.

| Check | Result | Evidence or notes |
|---|---|---|
| [test/command/manual check] | Passed / Failed / Not run | [actual result] |

Never mark a check passed unless it was run and observed. State what remains unverified.

## 10. How to debug it

Provide an ordered troubleshooting path from symptom to likely layer. Explain what each check tells the reader and where relevant logs or status information live.

## 11. Alternatives and trade-offs

Explain important alternatives considered, why this approach was selected, and what it costs in complexity, performance, security, maintainability, or learning effort. Link a decision record when one exists.

## 12. Connection to the theory course

Link to the relevant existing theory lesson(s) and explain what each one helps the reader understand. **These lessons are optional learning support, not prerequisites for using or changing the implementation.**

## 13. Limitations and next steps

List known limitations, open questions, follow-up improvements, and any work intentionally deferred.
