# TaskFlow database

PostgreSQL is the agreed relational database direction.

## Planned responsibilities

- Version-controlled schema migrations.
- Safe development/test seed data.
- Relational constraints and indexes justified by actual query patterns.
- Documented local connection, backup, and recovery procedures when relevant.

## Current status

- PostgreSQL: agreed direction.
- Database driver/query library: not selected.
- Migration tool: not selected.
- Users/sessions/tasks tables: examples exist in [the Phase 1 learning design](../docs/01-application/database-design.md), but they are not an approved production schema.
- Database connection, migrations, and seed scripts: not implemented.

Do not create schema files until MVP fields, ownership rules, deletion behaviour, authentication design, and migration approach are approved.
