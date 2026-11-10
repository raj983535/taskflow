# Lesson 1.5 — PostgreSQL and Data Modeling

**Phase:** 1 — Full-stack application fundamentals  
**Status:** Study material published; learner checkpoint pending  
**Purpose:** Understand how TaskFlow stores, relates, protects, and retrieves durable application data.

This lesson covers the database knowledge needed for a normal full-stack application. It is not a database-administration course. We will focus on relational tables, relationships, SQL, constraints, transactions, indexes, and how the backend talks to PostgreSQL.

## 1. PostgreSQL, SQL, and a database are different things

- **Database:** An organized place where application data is stored.
- **PostgreSQL:** The database management system (DBMS) that stores and manages the data.
- **SQL:** The language used to define database structures and read or change data.

PostgreSQL is a **relational database**. It organizes structured information into tables and lets tables refer to one another through defined relationships. The official PostgreSQL tutorial covers creating tables, inserting rows, querying, joining, updating, deleting, foreign keys, and transactions. [PostgreSQL tutorial](https://www.postgresql.org/docs/current/tutorial.html)

## 2. Tables, rows, columns, and data types

A table is a collection of records about one kind of thing.

| id | email | created_at |
|---|---|---|
| u-101 | asha@example.com | 2026-11-01 |
| u-102 | rahul@example.com | 2026-11-02 |

- A **table** is the collection, such as users.
- A **row** is one record, such as Asha's account.
- A **column** is one property of each record, such as email.
- A **data type** determines what kind of value a column can store.

Common PostgreSQL types:

| Type | Typical use |
|---|---|
| uuid | Unique record identifiers |
| text | Text of variable length |
| integer / bigint | Whole numbers |
| boolean | True or false |
| date | A calendar date, such as a due date |
| timestamp | Date and time without a time-zone designation |
| timestamptz | A time instant with time-zone-aware handling |
| numeric | Exact decimal values, such as money |

Choose a type that matches the meaning of the data. A task's calendar due date can be a date; the moment a record was created is normally better represented as timestamptz.

A column can also contain **NULL**, which means the value is absent or unknown. NULL is not the same as an empty string, zero, or false. Use NOT NULL for fields that must always have a value.

## 3. Primary keys and foreign keys

A **primary key** identifies one row uniquely. A **foreign key** connects a row to a valid row in another table.

For TaskFlow:
- Every user has an id.
- Every task has its own id.
- Each task has a user_id that points to the user who owns it.
- Each login session has a user_id that points to the user it belongs to.

~~~text
users
  id (primary key)
   |
   | one user can own many tasks
   +----------------------< tasks
   |                         user_id (foreign key)
   |
   | one user can have many sessions
   +----------------------< sessions
                             user_id (foreign key)
~~~

This is a **one-to-many relationship**: one user can be related to many task rows, but each task row in this model belongs to one user.

A foreign key prevents a task from referring to a user that does not exist. This is called **referential integrity**. PostgreSQL checks these relationships when data is inserted or changed. [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

## 4. Why split information across tables?

Suppose every task row repeated the user's email and display name. If the user changed their email, many task rows would need to be updated. Some might be missed, leaving inconsistent information.

A cleaner model stores each kind of thing in its own table:
- users stores account information once.
- tasks stores task information and the owner's identifier.
- sessions stores login-session records and the owner's identifier.

This is a practical introduction to **normalization**: organize related information so you do not repeat the same facts unnecessarily and create avoidable update problems.

The useful judgment for TaskFlow is simple: store a fact in one appropriate place, then refer to it using keys.

## 5. TaskFlow's proposed starter schema

This is a teaching model, not a database already created in the repository. It will be reviewed before implementation.

~~~sql
CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  title text NOT NULL CHECK (length(trim(title)) > 0),
  description text,
  status text NOT NULL DEFAULT 'todo'
    CHECK (status IN ('todo', 'in_progress', 'completed')),
  priority text NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high')),
  due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
~~~

Read the rules:
- id uuid PRIMARY KEY: each record needs a unique identifier.
- NOT NULL: the value is required.
- UNIQUE: duplicate values are rejected for that column or constrained combination.
- REFERENCES users(id): the value must refer to an existing user.
- DEFAULT now(): PostgreSQL supplies the current time if the insert does not provide one.
- CHECK (...): the value must pass the stated condition.
- ON DELETE CASCADE: deleting a user also deletes that user's session rows in this example.

The example intentionally does not cascade-delete tasks. Whether deleting an account should delete, archive, or anonymize its tasks is a product and data-retention decision. Do not choose destructive behavior casually.

The schema uses uuid identifiers without choosing how the application generates them. That choice can be made in the implementation blueprint.

The password_hash field stores a password hash, never a plaintext password. A session table should store a suitably protected token representation, not expose raw session secrets. Authentication design is the next lesson.

## 6. SQL: define, insert, read, update, and delete

SQL is the language used to communicate with the database. For this project, recognize two broad groups:

- **DDL (Data Definition Language):** Defines or changes database structure, such as CREATE TABLE and ALTER TABLE.
- **DML (Data Manipulation Language):** Reads or changes stored records, such as SELECT, INSERT, UPDATE, and DELETE.

The everyday data operations are often called **CRUD**:

| CRUD action | SQL statement | TaskFlow example |
|---|---|---|
| Create | INSERT | Add a task |
| Read | SELECT | Show a user's tasks |
| Update | UPDATE | Mark a task as completed |
| Delete | DELETE | Remove a task |

### Read records

~~~sql
SELECT id, title, status, due_date
FROM tasks
WHERE user_id = $1
ORDER BY created_at DESC;
~~~

This asks for selected fields in the task table, limits the result to the specified owner, and puts newer records first.

### Insert a record

~~~sql
INSERT INTO tasks (id, user_id, title, status)
VALUES ($1, $2, $3, 'todo')
RETURNING id, title, status;
~~~

RETURNING asks PostgreSQL to return the inserted row's selected fields.

### Update a record

~~~sql
UPDATE tasks
SET status = 'completed',
    updated_at = now()
WHERE id = $1 AND user_id = $2
RETURNING id, title, status;
~~~

### Delete a record

~~~sql
DELETE FROM tasks
WHERE id = $1 AND user_id = $2
RETURNING id;
~~~

Notice that update and delete check both the task ID and the owner ID. This is an important application-security habit. A browser must not be allowed to decide which user's records it can access simply by sending an arbitrary user_id.

### What does $1 mean?

$1, $2, and $3 are parameter placeholders used by PostgreSQL client libraries such as node-postgres. The application supplies the actual values separately.

This is a **parameterized query**. It keeps untrusted input separate from the SQL command and helps prevent SQL injection.

Do not build a query by joining raw user input into a SQL string. For example, constructing a WHERE clause by concatenating an email supplied by the user is unsafe. Use the database library's parameter mechanism instead.

### Read across related tables with a JOIN

A **JOIN** combines related rows from multiple tables. For example, a report might show each task with its owner's email:

~~~sql
SELECT tasks.title, tasks.status, users.email
FROM tasks
JOIN users ON users.id = tasks.user_id;
~~~

You do not need to memorize every JOIN type now. Understand why joins exist: related data is stored in separate tables, and a query can bring the required pieces together.

## 7. Constraints: make invalid data harder to store

Application validation and database constraints have different jobs:
- The frontend can give the user immediate feedback.
- The backend should validate incoming requests.
- The database should enforce important data rules even if a request reaches it through an unexpected path.

| Constraint | Meaning | Example |
|---|---|---|
| NOT NULL | A value is required | Task title |
| UNIQUE | A value or combination cannot be duplicated | Account email |
| PRIMARY KEY | Unique, non-null row identifier | User ID |
| FOREIGN KEY | A reference must point to a valid related row | Task owner |
| CHECK | A condition must be true | Status belongs to allowed values |
| DEFAULT | Supply a value when one is omitted | Creation timestamp |

Constraints are not a replacement for readable error handling. They are a final line of data integrity enforced by PostgreSQL. [PostgreSQL constraints reference](https://www.postgresql.org/docs/current/ddl-constraints.html)

## 8. Transactions: treat related changes as one unit

A **transaction** groups multiple database operations into one logical unit.

Imagine a user signs up. The application might need to create the account and a related record. If the first operation succeeds but the second fails, the database could be left in a partially completed state unless the operations are handled together.

Conceptually:

~~~sql
BEGIN;

-- Perform the first related change.
-- Perform the second related change.

COMMIT;
~~~

If something goes wrong before the changes are committed, the application can roll the transaction back:

~~~sql
ROLLBACK;
~~~

A transaction is governed by the ACID properties:

- **Atomicity:** All operations in the transaction succeed together, or the transaction is rolled back.
- **Consistency:** The transaction must preserve database rules and constraints.
- **Isolation:** Concurrent transactions should not interfere in ways that break the database's guarantees.
- **Durability:** Once committed, the changes are expected to persist.

The practical point: use a transaction when several database changes must succeed or fail together. We will not study advanced isolation levels in this lesson. PostgreSQL's tutorial includes transactions as part of its core relational workflow. [PostgreSQL tutorial](https://www.postgresql.org/docs/current/tutorial.html)

## 9. Indexes: faster lookups with a cost

An **index** is an additional data structure PostgreSQL can use to find rows more efficiently for certain queries. Think of the index at the back of a book: it helps you find a topic without reading every page.

For TaskFlow, this query may be common:

~~~sql
SELECT id, title, status, created_at
FROM tasks
WHERE user_id = $1
ORDER BY created_at DESC;
~~~

An index that may support this query is:

~~~sql
CREATE INDEX idx_tasks_user_created
ON tasks (user_id, created_at DESC);
~~~

Indexes are not free:
- They use additional storage.
- Inserts, updates, and deletes have extra index work.
- An index only helps when it fits the query pattern.

PostgreSQL automatically creates a unique B-tree index for a primary key or unique constraint. A foreign key does **not** automatically create an index on the referencing column, so the application designer should consider whether queries or deletes need one. Do not add an index to every column. [PostgreSQL constraints and index notes](https://www.postgresql.org/docs/current/ddl-constraints.html) · [PostgreSQL index introduction](https://www.postgresql.org/docs/current/indexes-intro.html)

The practical rule: start with the queries the application actually runs, then add indexes that support important filters, joins, and sorting. Later, we will learn how to inspect query plans and identify real bottlenecks.

## 10. How the backend uses PostgreSQL

The browser does not connect directly to the TaskFlow database.

~~~text
Browser / React
      |
      | HTTPS request with application data
      v
Node.js / Express backend
      |
      | Validate input
      | Verify signed-in identity
      | Check authorization / ownership
      | Execute parameterized SQL
      v
PostgreSQL
      |
      | Rows or database result
      v
Express backend
      |
      | HTTP response (often JSON)
      v
Browser updates the UI
~~~

The backend uses a PostgreSQL client library to send SQL and receive results. In a real application, it will normally reuse a managed set of database connections called a **connection pool** rather than opening a brand-new connection for every request. We will cover practical configuration when implementation requires it.

For an authenticated user's task list, the backend should obtain the user's ID from the verified authentication context, then use that ID in the query. It should not blindly trust an owner ID supplied by the browser.

## 11. Essential inspection commands (conceptual for now)

The PostgreSQL command-line client is called psql. A connection command can look like:

~~~powershell
psql -h 127.0.0.1 -p 5432 -U taskflow -d taskflow
~~~

- psql: start the PostgreSQL command-line client.
- -h: host where PostgreSQL is running.
- -p: port; PostgreSQL commonly uses 5432.
- -U: database user.
- -d: database name.

Inside psql, these are inspection commands:

~~~text
\dt        -- list tables
\d tasks   -- describe the tasks table
\q         -- quit psql
~~~

They are psql meta-commands, not ordinary SQL statements. SQL statements such as SELECT normally end with a semicolon.

We are not installing or running anything during this theory phase. These commands are here so you can recognize them when we reach implementation.

## 12. Common mistakes and engineering judgment

1. **No ownership filter:** Fetching a task only by its ID can expose another user's data if authorization is not checked. Scope reads and writes to the verified owner.
2. **Trusting the frontend:** A hidden button or disabled field is not a security boundary. The backend and database rules must protect the data.
3. **No constraints:** If every rule exists only in frontend code, unexpected requests can create inconsistent records.
4. **Unsafe SQL strings:** Never concatenate untrusted input into a query. Use parameters.
5. **Too many indexes:** Indexes use storage and slow writes. Add them for real query patterns.
6. **Duplicate facts:** Repeating user information in every task creates update and consistency problems.
7. **Casual cascading deletes:** ON DELETE CASCADE can remove many related records. Choose delete behavior deliberately based on product and retention requirements.
8. **No migration history:** Once an application is deployed, schema changes must be repeatable and controlled. The next lesson connects migrations and quality practices to this design.

## 13. How this connects to the other lessons

- Lessons 1.1–1.4 showed how a browser request reaches the backend and how HTTP/JSON carries data.
- This lesson explains where durable records live and how the backend reads or changes them.
- Lesson 1.6 covers identity, authorization, secrets, validation, migrations, and testing. It connects database rules to the security and quality of the whole application.
- Later phases cover backups, managed databases, deployment, monitoring, and scaling. We do not need to learn database administration before building the first version.

## 14. Knowledge checkpoint — learner response pending

Answer in your own words. Short explanations are fine; focus on understanding rather than memorizing definitions.

1. What is the difference between PostgreSQL and SQL?
2. What is a row, and what is a column?
3. In TaskFlow, why does tasks.user_id reference users.id?
4. What is the difference between a primary key and a foreign key?
5. Why should the backend use a parameterized query rather than joining user input into a SQL string?
6. Why should a task update check both the task ID and the authenticated user's ID?
7. What problem does a transaction solve?
8. Why might an index make a query faster, and what is its cost?
9. Why should we avoid storing the user's email in every task row?
10. Why should the browser never connect directly to the production database?

### Small design exercise

Imagine TaskFlow adds a comments feature. Each comment belongs to one task and one user.

Explain:
- What columns the comments table might need.
- Which columns should be its primary key and foreign keys.
- What one-to-many relationships exist.
- One constraint that would protect the data.
- One query that would retrieve the comments for a task.

**Completion rule:** This lesson remains pending until we review your answers. You may continue to Lesson 1.6 without completing this checkpoint; we will keep it on the progress tracker for later review.

## Official reference

- [PostgreSQL 18 documentation — tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [PostgreSQL 18 documentation — constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [PostgreSQL 18 documentation — index introduction](https://www.postgresql.org/docs/current/indexes-intro.html)
- [PostgreSQL 18 documentation — CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html)
