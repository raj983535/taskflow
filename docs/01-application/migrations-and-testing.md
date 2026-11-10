# Migrations, Testing, and Application Quality

**Status:** Conceptual notes. There is no application code, migration runner, or automated test suite in the active repository yet.

## 1. What is a database migration?

A migration is a version-controlled change to a database schema or data. Examples include:
- Creating a table.
- Adding a column.
- Adding an index.
- Changing a constraint.
- Moving or transforming existing data.

Migrations allow developers to describe database changes in a known order rather than manually modifying each environment.

A typical migration workflow:
1. Write a new, uniquely named migration.
2. Review the effect on existing data and application compatibility.
3. Apply it to a development database.
4. Verify the resulting schema and behavior.
5. Apply the same ordered migration during later environment setup or deployment.

Changing a migration that has already run in a shared environment can make environments disagree. Later changes are normally recorded as new migrations.

## 2. What is testing?

Testing checks whether software behaves as intended. Different levels answer different questions.

| Type | What it checks | Example |
|---|---|---|
| Unit test | A small function or unit in isolation | Does a task validator reject an empty title? |
| Integration test | Multiple components working together | Does an API endpoint store and retrieve a task through the database? |
| End-to-end test | A complete user workflow | Can a user sign in and create a task through the browser? |
| Manual exploratory test | Behavior inspected by a person | Is the error message understandable on a small screen? |

A passing unit test does not prove the complete system works. A useful testing strategy combines different levels.

## 3. Build, type checking, and tests are different

- **Type checking** checks whether code uses declared types consistently. It does not prove that runtime behavior is correct.
- **Build** transforms or packages source code into output suitable for running or deployment. A successful build does not prove all features work.
- **Test** executes checks against expected behavior.
- **Linting** identifies certain code-quality, consistency, or likely-error patterns.
- **Deployment verification** checks that the deployed service and its dependencies are actually responding as expected.

Each check provides different evidence.

## 4. Illustrative commands for the later implementation stage

These are examples of common npm commands. They are not executable in this documentation-only repository because the application and its package manifest have deliberately not been created.

```powershell
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

What they generally mean:
- `npm install`: reads the package manifest and installs the project's declared dependencies.
- `npm run dev`: runs a project-defined script usually intended for local development.
- `npm run typecheck`: runs a project-defined type-checking script.
- `npm test`: runs the project's configured test script.
- `npm run build`: runs the project's build script.

The `run` commands depend on scripts being defined in `package.json`. The exact commands and tools will be decided when implementation begins.

## 5. Verification evidence

When we eventually implement TaskFlow, record:
- The command that was run.
- The date and environment.
- Whether it passed or failed.
- The important output or error.
- The correction made, if any.
- What the result proves and what it does not prove.

Never report a build or test as successful merely because a test file or command exists.
