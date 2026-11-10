# TaskFlow REST API Reference

Base URL during local development: `http://127.0.0.1:5000`.

The browser normally accesses the API through the Vite proxy at `http://127.0.0.1:5173`.

All JSON request examples use `Content-Type: application/json`. Authentication uses a session cookie. Task routes require a valid session.

## Health

### GET /health/live

Returns process liveness without checking PostgreSQL.

Example response (200):

```json
{ "status": "alive" }
```

### GET /health/ready

Runs a simple PostgreSQL query. Returns 200 only when the database connection works.

Example response (200):

```json
{ "status": "ready", "database": "connected" }
```

## Authentication

### POST /api/auth/register

Creates an account and starts a session.

Request:

```json
{
  "email": "learner@example.com",
  "password": "a-local-learning-password",
  "fullName": "TaskFlow Learner"
}
```

- `email`: valid email address; normalized to lowercase.
- `password`: at least 12 characters and no more than 72 UTF-8 bytes (bcrypt input limit).
- `fullName`: optional, up to 80 characters.

Success: HTTP 201 with public user data and an HttpOnly session cookie.

### POST /api/auth/login

Authenticates an account and starts a new session.

Request:

```json
{
  "email": "learner@example.com",
  "password": "a-local-learning-password"
}
```

Success: HTTP 200 with public user data and a session cookie.

Incorrect credentials return HTTP 401 with a generic message.

### GET /api/auth/me

Returns the current public user, or `null` when there is no valid session.

### POST /api/auth/logout

Deletes the current session (if present), clears the cookie, and returns:

```json
{ "success": true }
```

## Tasks (authentication required)

All tasks are scoped to the current user's ID. The API never accepts a user ID in the task body to set ownership.

### GET /api/tasks

Lists tasks for the current user.

Success: HTTP 200.

### POST /api/tasks

Creates a task.

Request:

```json
{
  "title": "Learn Docker",
  "description": "Understand images and containers",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-12-15"
}
```

Fields:
- `title`: required, trimmed, 1–120 characters.
- `description`: optional, nullable, up to 2,000 characters.
- `status`: `todo`, `in_progress`, or `completed`; defaults to `todo`.
- `priority`: `low`, `medium`, or `high`; defaults to `medium`.
- `dueDate`: optional nullable calendar date in `YYYY-MM-DD` format.

Success: HTTP 201 with the created task.

### PATCH /api/tasks/:id

Updates one or more supplied fields. The ID must be a UUID. Empty update objects are rejected.

Example request:

```json
{
  "status": "in_progress",
  "priority": "medium"
}
```

Success: HTTP 200 with the updated task. A task not owned by the caller returns HTTP 404, the same response used for an unknown task.

### DELETE /api/tasks/:id

Deletes a task owned by the current user.

Success: HTTP 200.

## Common status codes

| Status | Meaning in TaskFlow |
|---:|---|
| 200 | Request completed |
| 201 | Resource created |
| 400 | Invalid input or invalid UUID |
| 401 | Authentication required or credentials incorrect |
| 403 | Request origin is not allowed |
| 404 | Route or owned task not found |
| 409 | Unique value conflict, such as an already-registered email |
| 429 | Authentication rate limit reached |
| 500 | Unexpected server error |

## Error response shape

A typical error:

```json
{
  "message": "Please correct the task details.",
  "details": [
    {
      "field": "title",
      "message": "Title is required."
    }
  ]
}
```

The exact `details` list is included for validation errors. Unexpected internal error details are logged server-side and are not returned to the browser.

## API testing examples

Check liveness:

```powershell
curl.exe -i http://127.0.0.1:5000/health/live
```

For manual authenticated API testing, use the browser UI or a dedicated API client with cookie support. Do not copy a production session cookie into screenshots or GitHub.
