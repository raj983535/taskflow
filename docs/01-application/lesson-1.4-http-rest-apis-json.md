# Lesson 1.4 — HTTP, REST APIs, and JSON

**Phase:** 1 — Full-stack application fundamentals  
**Lesson:** 4 of 6  
**Status:** Study material published; learner checkpoint pending  
**Scope:** Understand how the TaskFlow frontend and backend exchange information, how to describe an API contract, and how to inspect common requests and responses. This is project-level API knowledge, not a full protocol specification course.

## 1. Learning outcomes

By the end of this lesson, you should be able to:

- Explain HTTP as the request-response protocol used between the frontend and backend.
- Identify the important parts of an HTTP request and response.
- Distinguish HTTP methods and use GET, POST, PUT, PATCH, and DELETE appropriately.
- Explain status-code groups and recognize common API status codes.
- Understand headers, request bodies, response bodies, and JSON.
- Explain what a REST-style API means at the level needed for TaskFlow.
- Read a simple API contract and inspect a request using browser tools or curl.
- Understand why HTTP being stateless does not prevent an application from using login sessions.

## 2. What is HTTP?

HTTP stands for **Hypertext Transfer Protocol**. It is the application-level protocol that allows a client and server to exchange requests and responses.

For TaskFlow:

- React running in the browser acts as the API client.
- The Node.js/Express application acts as the API server.
- The client sends an HTTP request.
- The server processes it and returns an HTTP response.

HTTPS is HTTP protected by TLS. HTTPS is what we should use for public application traffic because TLS provides confidentiality and integrity for data in transit and helps authenticate the server.

We studied the foundations of HTTP, HTTPS, DNS, and networking in Phase 0. Here, we focus on how HTTP is used to design and consume backend APIs.

Useful references:
- [MDN: Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)
- [IETF RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

## 3. The request-response model

Every normal API interaction follows this high-level pattern:

```text
Frontend / Client
       |
       | HTTP request
       v
Backend / API server
       |
       | Process request
       | Validate and authorize
       | Apply business logic
       | Access database if needed
       |
       v
Backend / API server
       |
       | HTTP response
       v
Frontend / Client
       |
       v
Update the user interface
```

The client starts the exchange. The server responds to that particular request. The response tells the client what happened and may contain the requested or newly created data.

An HTTP request does not mean that the operation succeeded. The client must inspect the response status and content.

## 4. What is inside an HTTP request?

A request has several important parts:

| Part | Purpose |
|---|---|
| Method | What kind of operation the client is asking for |
| URL/path | Which resource or operation is targeted |
| Headers | Additional information about the request |
| Body | Optional data sent to the server |

An illustrative request to create a TaskFlow task:

```http
POST /api/tasks HTTP/1.1
Host: api.taskflow.example
Accept: application/json
Content-Type: application/json
Cookie: taskflow_session=<session-cookie>

{
  "title": "Learn HTTP APIs",
  "priority": "high"
}
```

This is a human-readable illustration of HTTP semantics. HTTP/2 and HTTP/3 use different wire framing, but the method, target, headers, and message-body concepts remain useful when inspecting requests in developer tools.

What the example says:

- `POST` asks the server to process the submitted information, commonly to create a resource.
- `/api/tasks` is the target path.
- `Accept: application/json` says the client can accept a JSON response.
- `Content-Type: application/json` says the request body is JSON.
- `Cookie` may carry a session identifier when the application uses cookie-based authentication.
- The body contains the proposed task values.

Do not copy actual session cookies or authentication values into notes, screenshots, or GitHub.

## 5. What is inside an HTTP response?

A response commonly contains:

| Part | Purpose |
|---|---|
| Status code | Describes the broad result of the request |
| Headers | Describe the response and how it should be handled |
| Body | Optional returned data or an error explanation |

Illustrative response:

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/tasks/8f7a...

{
  "data": {
    "id": "8f7a...",
    "title": "Learn HTTP APIs",
    "priority": "high",
    "status": "todo"
  }
}
```

The status is `201 Created`, meaning the server successfully created a resource. The response body contains the created task. A `Location` header can identify the new resource.

The frontend reads the response, checks whether the operation succeeded, and then updates the page.

## 6. HTTP methods: what operation are we asking for?

The HTTP method communicates the intended operation. Methods have standardized semantics; they are not just arbitrary labels chosen by a developer.

For TaskFlow, the core methods are:

| Method | Typical purpose | TaskFlow example |
|---|---|---|
| GET | Read a resource | Retrieve the user's tasks |
| POST | Submit data or create a resource | Create a task |
| PUT | Replace a resource representation | Replace all editable fields of a task |
| PATCH | Partially update a resource | Change only a task's status |
| DELETE | Remove a resource | Delete a task |

### GET

Used to retrieve information.

Example: `GET /api/tasks`

The client asks for the current user's task list. A GET request should not be used to create, update, or delete data.

### POST

Used to submit data for processing. It is commonly used to create a resource.

Example: `POST /api/tasks`

The request body contains the new task's fields. The backend validates the values and decides whether to create the task.

Repeated POST requests may create duplicate resources unless the API has additional protection. A client should not blindly retry an uncertain create operation just because it did not receive a response.

### PUT

Used to replace the target resource representation.

Example: `PUT /api/tasks/123`

Conceptually, the client supplies the complete representation it intends the server to store for that resource. PUT is not simply another name for any update.

### PATCH

Used to apply a partial modification.

Example: `PATCH /api/tasks/123`

The client may send only the fields that should change:

```json
{
  "status": "completed"
}
```

PATCH does not guarantee idempotency by itself; it depends on the patch operation and API design.

### DELETE

Used to remove the target resource.

Example: `DELETE /api/tasks/123`

The server checks ownership and permission before deleting the task.

Official method semantics are defined in [RFC 9110, Section 9](https://www.rfc-editor.org/rfc/rfc9110.html#name-methods). See also [MDN's HTTP method reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods).

## 7. Two important method properties: safe and idempotent

These terms matter when designing reliable APIs and deciding whether a failed request can be retried.

### Safe

A safe method is defined as essentially read-only: the client is not asking the server to change the target resource's state.

GET is safe. A GET request might still create an access log entry, but its intended application effect is read-only.

### Idempotent

An idempotent method has the same intended server effect when the same request is repeated one or more times as it would have from one request.

For example:
- Repeating a GET should not create additional tasks.
- Repeating a PUT that sets the same complete representation should leave the resource in the same intended state.
- Repeating a DELETE should leave the resource deleted, even if a later response says it is already gone.

PUT, DELETE, and safe methods are defined as idempotent in HTTP semantics. POST is not generally idempotent. PATCH is not guaranteed to be idempotent by its method definition.

| Method | Safe? | Idempotent by standard semantics? |
|---|---|---|
| GET | Yes | Yes |
| POST | No | No |
| PUT | No | Yes |
| PATCH | No | Not guaranteed |
| DELETE | No | Yes |

**Why this matters:** if a client sends a create-task POST and the network connection drops before the response arrives, the client may not know whether the server created the task. Blindly retrying could create a duplicate. More advanced APIs can use idempotency keys or other safeguards for operations that must safely tolerate retries.

Reference: [RFC 9110 — Safe and Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110.html#name-common-method-properties).

## 8. HTTP status codes

The response status code tells the client the broad result of its request.

The first digit identifies the class:

| Range | Meaning |
|---|---|
| 1xx | Informational |
| 2xx | Successful |
| 3xx | Redirection |
| 4xx | Client error |
| 5xx | Server error |

### Status codes we should recognize for TaskFlow

| Code | Meaning | Example |
|---:|---|---|
| 200 | OK | Tasks retrieved or updated successfully |
| 201 | Created | A new task was created |
| 202 | Accepted | Work was accepted for later processing |
| 204 | No Content | Operation succeeded with no response body |
| 400 | Bad Request | Request is malformed or input fails the API's validation policy |
| 401 | Unauthorized | A valid authentication credential is missing or invalid |
| 403 | Forbidden | The caller is authenticated but not allowed to perform the operation |
| 404 | Not Found | Endpoint or requested resource was not found |
| 405 | Method Not Allowed | The route exists but does not support that method |
| 409 | Conflict | Request conflicts with current resource state, such as a duplicate unique value |
| 415 | Unsupported Media Type | Request content format is not supported |
| 422 | Unprocessable Content | Content type and syntax are understood, but the instructions cannot be processed |
| 429 | Too Many Requests | Rate limit reached |
| 500 | Internal Server Error | Unexpected server-side failure |
| 502 | Bad Gateway | A gateway/proxy received an invalid upstream response |
| 503 | Service Unavailable | Server is temporarily unable to handle the request, perhaps because a dependency is unavailable |

### Do not confuse 401 and 403

- **401:** the request does not establish a valid authenticated identity.
- **403:** the request is authenticated, but the user is not permitted to do the requested operation.

For example, a signed-out user trying to create a task may receive 401. A signed-in user trying to modify another user's task may receive 403 or, depending on the API's privacy design, 404.

For TaskFlow, we will document one consistent error policy when the API is finalized. The example API reference currently uses 400 for invalid input and 404 for tasks that the caller does not own.

Reference: [RFC 9110 — Status Codes](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes).

## 9. HTTP headers: additional request and response information

Headers are metadata sent with a request or response.

A few important headers:

| Header | Typical purpose |
|---|---|
| Content-Type | Describes the media type of the message body |
| Accept | Describes response media types the client can accept |
| Authorization | Carries credentials using an agreed authentication scheme |
| Cookie | Sends applicable browser cookies to a server |
| Set-Cookie | Asks a browser to store or update a cookie |
| Cache-Control | Gives caching instructions |
| Location | Identifies a resource or redirect destination in relevant responses |
| Access-Control-Allow-Origin | Indicates which browser origin is allowed to read a cross-origin response under CORS |

The two headers worth remembering immediately are:

- **Content-Type:** what format am I sending?
- **Accept:** what response format can I receive?

For TaskFlow, the frontend will commonly send JSON with `Content-Type: application/json` and request JSON responses using `Accept: application/json`.

### What is CORS?

CORS stands for Cross-Origin Resource Sharing. It is a browser-enforced mechanism that controls whether frontend JavaScript from one origin can read a response from a different origin.

An origin is made from the scheme, host, and port. For example, `http://localhost:5173` and `http://localhost:5000` are different origins because their ports differ.

CORS does not authenticate users and does not replace backend authorization. Non-browser clients are not controlled by browser CORS enforcement.

When TaskFlow's frontend and backend are deployed, we must configure the expected origins and credential behavior deliberately. Detailed deployment and security configuration comes later.

Reference: [MDN HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers).

## 10. What is JSON?

JSON means **JavaScript Object Notation**. It is a lightweight, text-based, language-independent data-interchange format used by many web APIs.

JSON is not the same thing as a JavaScript object, even though its syntax resembles JavaScript object syntax.

JSON supports:
- Strings.
- Numbers.
- Booleans (`true` and `false`).
- `null`.
- Objects.
- Arrays.

Example TaskFlow request body:

```json
{
  "title": "Learn HTTP",
  "description": "Understand requests and responses",
  "status": "in_progress",
  "priority": "high",
  "labels": ["backend", "learning"],
  "isArchived": false
}
```

### JSON syntax rules

1. Object property names and strings use double quotes.
2. A colon separates each property name from its value.
3. Commas separate values.
4. Do not use trailing commas.
5. JSON does not support comments.
6. JSON does not support JavaScript functions or `undefined`.

This is invalid JSON:

```text
{
  title: 'Learn HTTP', // comments and single quotes are invalid
}
```

### Serialization and parsing

When the frontend sends data, a JavaScript value is commonly serialized into JSON text.

When the frontend receives a JSON response, it parses that text into a usable JavaScript value.

| Term | Meaning |
|---|---|
| Serialization | Convert structured data into a transferable representation |
| Parsing / deserialization | Read that representation and turn it into usable data |

The browser Fetch API has a `Response.json()` method for reading a response body as JSON. See [MDN: Working with JSON](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON).

## 11. What is REST, and what does REST-style API mean?

REST stands for **Representational State Transfer**. It is an architectural style for distributed systems, not a JavaScript framework or a specific software package.

For our project, we will design a practical **REST-style resource API**.

The important conventions are:

- Use resource-oriented paths, commonly nouns such as `/tasks` and `/users`.
- Use HTTP methods to express the intended operation.
- Exchange representations of resources, commonly JSON.
- Use HTTP status codes to communicate outcomes.
- Keep the API contract predictable and consistent.
- Do not make the client responsible for bypassing server-side business rules.

Example:

| Less clear design | More resource-oriented design |
|---|---|
| `POST /createTask` | `POST /tasks` |
| `POST /getAllTasks` | `GET /tasks` |
| `POST /updateTaskStatus` | `PATCH /tasks/123` |
| `GET /deleteTask/123` | `DELETE /tasks/123` |

Using JSON and HTTP does not automatically make an API fully RESTful. REST has additional architectural constraints. We do not need a deep study of every constraint for TaskFlow; consistent resource-oriented API design is the practical target.

## 12. What is an API contract?

An API contract is the agreement between the client and server about how an operation works.

For each endpoint, define:

1. HTTP method and path.
2. Whether authentication is required.
3. Required headers and content type.
4. Path parameters and query parameters.
5. Request-body fields and validation rules.
6. Expected success status and response body.
7. Possible error statuses and response shape.
8. Important side effects or permission rules.

Example contract for creating a TaskFlow task:

### Request

```http
POST /api/tasks
Content-Type: application/json
Accept: application/json
```

```json
{
  "title": "Finish API lesson",
  "description": "Review HTTP request and response structure",
  "priority": "high"
}
```

### Expected success

Status: `201 Created`

```json
{
  "data": {
    "id": "task-identifier",
    "title": "Finish API lesson",
    "description": "Review HTTP request and response structure",
    "status": "todo",
    "priority": "high"
  }
}
```

### Example validation error

Status: `400 Bad Request`

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the task details.",
    "details": [
      {
        "field": "title",
        "message": "Title is required."
      }
    ]
  }
}
```

This is an illustrative contract. The exact response envelope will be finalized before we implement the API. The key point is that the frontend and backend agree on the shape and meaning of requests and responses.

A clear contract lets frontend and backend developers work in parallel. It also gives an AI coding tool explicit instructions about what the server must accept and return.

## 13. Stateless HTTP and application sessions

HTTP is described as a stateless protocol: the meaning of one request can generally be understood without relying on the previous HTTP request.

But TaskFlow still needs users to remain signed in across requests.

An application can solve this by using a session cookie:

1. The user signs in.
2. The server creates a session.
3. The browser receives a cookie identifying that session.
4. The browser sends the cookie with later applicable requests.
5. The backend validates the session and identifies the user.

The HTTP protocol itself remains stateless. The application uses the session identifier and server-side session data to connect separate requests to the same login session.

We will examine cookies, sessions, authentication, and authorization in Lesson 1.6.

## 14. Inspecting API requests

During the practical stage, the browser's Developer Tools can help us inspect requests.

In Chrome or Edge:
1. Open Developer Tools.
2. Open the Network tab.
3. Perform an action in the application.
4. Select the corresponding API request.
5. Inspect its method, URL, status, request headers, payload, response headers, response body, and timing.

A command-line tool such as curl can also send requests.

Illustrative PowerShell command:

```powershell
curl.exe -i -X POST "http://127.0.0.1:5000/api/tasks" -H "Content-Type: application/json" -H "Accept: application/json" --data-raw '{"title":"Learn HTTP","priority":"high"}'
```

What the options mean:

| Option | Purpose |
|---|---|
| `curl.exe` | Run the curl executable in Windows PowerShell |
| `-i` | Include response headers in the output |
| `-X POST` | Select the HTTP method |
| `-H` | Add an HTTP header |
| `--data-raw` | Send the request body as supplied |

This command is only an example. The TaskFlow API is not currently running, and a real protected task route would also require a valid session credential. We are not asking you to run it now.

## 15. Common API problems

| Symptom | Likely reason |
|---|---|
| 400 | Invalid request format or failed validation |
| 401 | Missing, invalid, or expired authentication |
| 403 | Authenticated user lacks permission |
| 404 | Wrong path or resource not found |
| 405 | Correct path but unsupported method |
| 409 | Conflict with existing resource state |
| 415 | Unsupported request content type |
| 429 | Rate limit reached |
| 500 | Unexpected backend failure |
| 502 / 503 | Gateway or service/dependency availability problem |
| Browser reports a CORS error | Cross-origin policy or configuration prevents the frontend from reading the response |

When debugging, inspect the method, URL, status, request headers, payload, response body, and backend logs. A status code narrows the investigation; it does not always identify the root cause by itself.

## 16. Essential vocabulary

| Term | Meaning |
|---|---|
| HTTP | Application-level request/response protocol |
| HTTPS | HTTP protected by TLS |
| Request | Message sent by the client to a server |
| Response | Message returned by a server |
| Method | Intended operation, such as GET or POST |
| Header | Metadata associated with a request or response |
| Request body | Optional data submitted by the client |
| Status code | Three-digit result classification |
| JSON | Text-based data-interchange format |
| Serialization | Convert data to a transferable representation |
| Parsing | Read text/data into a usable structure |
| REST | Architectural style for distributed systems |
| Resource | Item or collection exposed by an API |
| API contract | Agreed request, response, and error behavior |
| Safe method | Method whose defined semantics are read-only |
| Idempotent method | Repeating the same request has the same intended effect |
| CORS | Browser mechanism governing access to cross-origin responses |
| Origin | Scheme, host, and port combination |

## 17. Knowledge checkpoint

Answer these without copying the explanations above:

1. What are the four main parts of an HTTP request?
2. What is the difference between `Content-Type` and `Accept`?
3. Which HTTP method should TaskFlow use to retrieve tasks, and which should it use to create a task?
4. What is the difference between PUT and PATCH?
5. Explain safe and idempotent in your own words. Why should a client be careful about retrying POST?
6. What is the difference between 401 and 403?
7. What does a 201 response mean?
8. What kind of values can JSON represent, and name two syntax rules that differ from JavaScript object literals.
9. What is an API contract, and why should frontend and backend developers agree on it?
10. Why can HTTP be stateless while TaskFlow still uses a login session?

### Explanation exercise

Explain this TaskFlow flow:

The user clicks Save on a new task. The frontend sends a POST request with JSON. The backend validates the input, checks authentication, stores the task, and returns a 201 response. The frontend then displays the created task.

Describe the method, URL, headers, body, status code, response body, and the responsibilities of the frontend and backend.

## 18. Completion criteria

- [ ] Explain the HTTP request-response model.
- [ ] Identify method, path, headers, and body.
- [ ] Explain GET, POST, PUT, PATCH, and DELETE.
- [ ] Distinguish safe and idempotent methods.
- [ ] Recognize the common HTTP status codes.
- [ ] Explain Content-Type, Accept, Cookie, and CORS at a project level.
- [ ] Explain JSON syntax and why JSON is not identical to a JavaScript object.
- [ ] Explain REST-style resource APIs and API contracts.
- [ ] Explain stateless HTTP versus application sessions.
- [ ] Understand the browser Network tab and the purpose of the curl options shown.
- [ ] Complete the knowledge checkpoint and explanation exercise.

**Lesson status:** Study material published. Mark complete only after the learner's checkpoint and explanation exercise have been reviewed.
