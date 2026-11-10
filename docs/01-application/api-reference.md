# TaskFlow — Illustrative API Contract

**Status:** Example contract for learning HTTP and API design. These endpoints do not currently exist on a running server.

An API defines how one software component asks another component to perform an operation. For a browser-based application, the frontend commonly sends HTTP requests to backend endpoints and receives HTTP responses.

## 1. Important API concepts

- **Endpoint:** a specific address and method combination exposed by an API.
- **HTTP method:** expresses the kind of operation requested, such as reading or creating a resource.
- **Request:** method, URL, headers, and optionally a body sent by the client.
- **Response:** status code, headers, and optionally a body returned by the server.
- **JSON:** a text-based format commonly used to represent structured request and response data.
- **Status code:** a three-digit number describing the broad result of an HTTP request.

## 2. Illustrative TaskFlow endpoints

| Method | Example path | Intended purpose |
|---|---|---|
| GET | `/health/live` | Ask whether the application process is responding |
| GET | `/health/ready` | Ask whether required dependencies are ready |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Start an authenticated session |
| GET | `/api/auth/me` | Retrieve the current user's public profile |
| POST | `/api/auth/logout` | End the current session |
| GET | `/api/tasks` | List tasks belonging to the current user |
| POST | `/api/tasks` | Create a task for the current user |
| PATCH | `/api/tasks/:id` | Change selected fields of a task |
| DELETE | `/api/tasks/:id` | Delete a task belonging to the current user |

The final paths and response shapes will be reviewed when the implementation blueprint is prepared.

## 3. HTTP methods in plain language

| Method | Common intent | Typical behavior |
|---|---|---|
| GET | Read | Retrieve a representation; should not change server state |
| POST | Submit or create | Ask the server to process submitted data; often creates a resource |
| PUT | Replace | Replace the target resource representation |
| PATCH | Partially update | Change selected fields |
| DELETE | Remove | Request deletion of the target resource |

The intended meaning of a method matters. For example, GET should not be used to perform a destructive operation.

## 4. Example JSON request

A proposed request to create a task might contain:

```json
{
  "title": "Understand Docker images",
  "description": "Learn what an image contains",
  "priority": "high"
}
```

The JSON body is just data. The backend still has to parse it, validate its shape, authenticate the caller, authorize the operation, and decide whether to store it.

## 5. Common HTTP status codes

| Code | Meaning | Example context |
|---:|---|---|
| 200 | OK | A read or update completed |
| 201 | Created | A new resource was created |
| 204 | No Content | The operation succeeded without a response body |
| 400 | Bad Request | The submitted data is invalid |
| 401 | Unauthorized | Valid authentication is missing |
| 403 | Forbidden | The caller is authenticated but lacks permission |
| 404 | Not Found | The resource or endpoint was not found |
| 405 | Method Not Allowed | The path exists but does not support the requested method |
| 409 | Conflict | The request conflicts with existing state |
| 415 | Unsupported Media Type | The request body format is not supported |
| 422 | Unprocessable Content | The request is understood but its instructions cannot be processed |
| 429 | Too Many Requests | A rate limit was reached |
| 500 | Internal Server Error | An unexpected server-side failure occurred |
| 502 | Bad Gateway | A gateway received an invalid upstream response |
| 503 | Service Unavailable | The service cannot currently handle the request |

The exact status used depends on the API's documented contract. Status codes are not substitutes for clear error messages or server-side logging.

## 6. Authentication and ownership

In a secure design, the task API should determine the user from the authenticated request. It should not trust a client-supplied `userId` field to decide ownership.

The backend must enforce resource ownership even when the frontend hides another user's task. We will connect this to authentication and authorization in [the security concepts lesson](authentication-and-security.md).

## 7. How to inspect an HTTP exchange later

When we enter the practical stage, we can use the browser's Developer Tools Network tab or an API client to inspect:
- Request method and URL.
- Request headers and body.
- Response status and headers.
- Response body and timing.

Do not paste real cookies, authorization headers, passwords, or tokens into notes or screenshots.


## 8. Illustrative validation error response

For consistency, TaskFlow's proposed validation errors use this response shape:

Status: HTTP 400

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

The `message` provides a general explanation. The optional `details` array can identify fields that need correction. Unexpected internal errors should not expose stack traces, database credentials, or other sensitive implementation details.

## 9. Authentication and authorization status codes

- HTTP 401 means the request has not established a valid authenticated identity.
- HTTP 403 means the caller is authenticated but is not allowed to perform the requested operation.

For resource privacy, an API may deliberately return 404 when a resource does not exist or is not owned by the caller. The final behavior must be documented consistently.
