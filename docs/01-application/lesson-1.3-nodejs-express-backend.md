# Lesson 1.3 — Node.js and the Express Backend

**Phase:** 1 — Full-stack application fundamentals  
**Lesson:** 3 of 6  
**Status:** Study material published; learner checkpoint pending  
**Scope:** Understand how the TaskFlow server receives requests, processes them, applies rules, and communicates with PostgreSQL. No application code or installation is required for this lesson.

## 1. Learning outcomes

By the end of this lesson, you should be able to:

- Explain Node.js as a runtime and Express as a backend framework.
- Understand what a server process does when it starts and listens for requests.
- Trace a request through middleware, routing, validation, business logic, and data access.
- Explain how asynchronous I/O helps a Node.js server handle requests.
- Distinguish route handlers, middleware, services, and database access.
- Understand configuration through environment variables.
- Recognize common backend failures and know where to investigate.

## 2. What is Node.js?

Node.js is a JavaScript runtime. A runtime is the environment that executes a program.

JavaScript is commonly associated with the browser, but Node.js lets developers execute JavaScript outside the browser. That makes it possible to write server-side applications, command-line tools, build tools, and automation scripts using JavaScript.

For TaskFlow:

- The browser runs the frontend JavaScript.
- Node.js runs the backend JavaScript.
- The backend is a separate application from the browser interface.

Node.js provides APIs for tasks such as networking, file access, processes, and asynchronous input/output (I/O). It also lets a program create an HTTP server that can receive requests from browsers and other clients.

**Remember:** Node.js is not Express, React, or PostgreSQL. It is the runtime that executes our proposed server application.

## 3. What does a Node.js server process do?

A process is a running instance of a program managed by the operating system.

When we start the TaskFlow backend, the operating system runs a Node.js process. The application configures itself, creates an HTTP server, and listens on a port for incoming connections.

At a project level:

```text
Start backend application
          |
          v
Node.js process starts
          |
          v
Read configuration
          |
          v
Create Express application
          |
          v
Create HTTP server and listen on a port
          |
          v
Wait for incoming requests
          |
          v
Process requests and send responses
```

A port is a numbered communication endpoint on a machine. We studied the networking foundation earlier. A port helps the operating system deliver network traffic to the correct listening service.

The backend process normally keeps running so it can handle more than one request over its lifetime. It does not start a brand-new application process for each browser click.

## 4. What is Express?

Express is a web framework for Node.js. It provides a convenient way to define:

- Routes such as `GET /api/tasks` and `POST /api/tasks`.
- Middleware that runs during a request.
- Request and response handling.
- Centralized error-handling paths.
- Routers that group related endpoints.

Without a framework, developers would have to organize more of the HTTP request handling themselves. Express provides a lightweight structure for this work.

A useful distinction:

| Technology | Responsibility |
|---|---|
| JavaScript | Programming language |
| Node.js | Runtime that executes the server-side JavaScript |
| Express | Framework for building the HTTP server application |
| PostgreSQL | Separate service that stores application data |

Express does not replace Node.js. It runs on top of Node.js.

## 5. Routing: how does the backend know what to do?

A route tells the server which handler should run for a matching HTTP method and path.

Illustrative TaskFlow routes:

| Method and path | Intended operation |
|---|---|
| `GET /api/tasks` | List the current user's tasks |
| `POST /api/tasks` | Create a task |
| `PATCH /api/tasks/:id` | Update selected task fields |
| `DELETE /api/tasks/:id` | Delete a task |

The route identifies the operation. The handler is the backend function that processes the matching request.

For example, a POST request to `/api/tasks` should not simply trust the browser and insert any values it receives. It must pass through the appropriate validation and authorization steps.

The HTTP method and route are part of the API contract. We will study those in more detail in Lesson 1.4.

## 6. Middleware: processing that happens on the way through

Middleware is one of the most important Express concepts.

A middleware function runs during the request-response cycle. It can inspect or modify a request, perform a check, send a response, or pass control to the next middleware function.

In Express, middleware commonly works with three things:

- `req`: the request object, containing information about the incoming request.
- `res`: the response object, used to send information back.
- `next`: a function used to pass control to the next middleware or route step.

A simplified TaskFlow request pipeline could look like this:

```text
Incoming HTTP request
          |
          v
Request logging middleware
          |
          v
JSON body parsing middleware
          |
          v
Authentication middleware
          |
          v
Route matching
          |
          v
Input validation middleware
          |
          v
Route handler / business logic
          |
          v
Database access
          |
          v
HTTP response
```

Not every request uses every middleware. For example, a public health endpoint may not require user authentication.

### What might individual middleware do?

| Middleware purpose | TaskFlow example |
|---|---|
| Logging | Record method, path, status, and request duration |
| Body parsing | Read a JSON request body and make its values available to the handler |
| Authentication | Identify the signed-in user from a session |
| Authorization | Check whether the user may access a particular resource |
| Validation | Reject invalid task input |
| Rate limiting | Restrict excessive requests to sensitive endpoints |
| Error handling | Convert application errors into controlled HTTP responses |

A middleware function normally either ends the response or passes control onward. If it does neither, the request may remain waiting and appear to hang.

Order matters. For example, body-parsing middleware needs to run before a route handler that reads the parsed request body. Authentication needs to run before a protected operation that relies on the identified user.

The official Express guide describes middleware as a sequence of functions in the request-response cycle. See [Using Express middleware](https://expressjs.com/en/guide/using-middleware/).

## 7. Middleware versus route handler

These terms are related, but they have different usual roles.

| Middleware | Route handler |
|---|---|
| Often performs a shared or preliminary task | Usually performs the main operation for one endpoint |
| Can run for many routes | Is selected by a method and path |
| May pass control to another function | Commonly sends the final response |
| Example: check whether a user is signed in | Example: create the task requested by the user |

A protected TaskFlow task request might conceptually use:

```text
POST /api/tasks
       |
       v
Authentication middleware
       |
       v
Task input validation
       |
       v
Create-task handler
       |
       v
Database insert
       |
       v
Response
```

Authentication answers who is making the request. Authorization answers whether that user is allowed to perform the requested action. The two checks should not be confused.

## 8. Business logic and data access

As an application grows, putting every responsibility into one large route handler becomes difficult to maintain.

A common separation is:

```text
HTTP route
    |
    v
Controller / request handler
    |
    v
Service / business logic
    |
    v
Repository / data-access layer
    |
    v
Database client
    |
    v
PostgreSQL
```

The names and exact number of layers depend on the project. The important idea is to keep responsibilities understandable.

- **Route:** matches the HTTP method and path.
- **Controller or handler:** translates the HTTP request into an application operation and prepares the response.
- **Service:** applies business rules and coordinates the operation.
- **Repository or data-access layer:** performs database reads and writes.
- **Database client/driver:** communicates with PostgreSQL using its database protocol.

For a small TaskFlow implementation, we should use enough separation to keep code readable without building an unnecessarily complicated enterprise architecture.

The backend should also use parameterized database queries or a suitable data-access library. It must not build SQL by directly concatenating untrusted user input.

We will study SQL, relationships, query behavior, and connection management in Lesson 1.5.

## 9. How does Node.js handle multiple requests?

A server may receive many requests while other operations are still waiting for results.

Node.js uses an event loop and asynchronous I/O to help the application avoid waiting synchronously for many network and other I/O operations.

At the project level, the useful mental model is:

1. JavaScript code runs on the main execution thread of a Node.js process by default.
2. When the application starts an asynchronous I/O operation, it can wait for the result without keeping the JavaScript thread blocked on that operation.
3. When the operation completes, its continuation can run through the event loop.
4. The server can make progress on other work while I/O is pending.

For example, while TaskFlow waits for PostgreSQL to return a task query, the Node.js process can continue handling other ready work rather than sitting idle for that entire wait.

### One important limitation

A long-running synchronous CPU task can block the event loop and delay unrelated requests handled by that process.

For TaskFlow, we mainly need to:
- Use asynchronous database/network operations correctly.
- Avoid heavy synchronous work inside request handlers.
- Avoid assuming one slow request cannot affect others.
- Recognize that CPU-heavy workloads may need a different processing strategy if they become a real requirement.

We do not need to study event-loop phases, internal queues, worker-pool implementation, or thread scheduling in this lesson. The [official Node.js event-loop guide](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick) provides deeper detail if it becomes necessary.

## 10. Error handling: what happens when something fails?

A backend must handle expected failures and unexpected failures deliberately.

Examples:

| Situation | What the backend should do |
|---|---|
| Request data is invalid | Return a clear client error |
| User is not signed in | Reject access to a protected route |
| User does not own a task | Do not reveal or modify another user's resource |
| Database is unavailable | Return a controlled service error and log diagnostic details |
| Unexpected programming error | Pass it to centralized error handling |

A useful design is to have one centralized error-handling path rather than writing unrelated error responses in every route.

In Express, error-handling middleware has four parameters: `err`, `req`, `res`, and `next`. It is placed after normal middleware and routes so errors can flow to it.

For the version decision later: Express 5 forwards rejected Promises from async route handlers to error handling automatically. Older Express 4 patterns generally require the application to forward asynchronous errors explicitly. We will select and document a supported version when implementation begins, rather than mixing version assumptions into today's theory.

Official references: [Express error handling](https://expressjs.com/en/guide/error-handling/) and [Express routing](https://expressjs.com/en/guide/routing/).

## 11. Configuration and environment variables

The backend needs configuration that changes between development and deployment.

Examples:
- Port to listen on.
- Database connection address.
- Runtime mode.
- Frontend origin allowed to call the API.
- Secret values required by server-side services.

An **environment variable** is a named value provided to a process by its operating environment.

A Node.js application can read environment variables through `process.env`.

Example names:

| Variable | Purpose |
|---|---|
| `PORT` | Port where the backend listens |
| `NODE_ENV` | Runtime environment mode |
| `DATABASE_URL` | Database connection configuration |
| `FRONTEND_ORIGIN` | Allowed frontend origin in a relevant CORS setup |

These are illustrative names. The exact configuration will be finalized during implementation.

### Configuration and secret-handling rules

- Keep real secret values outside committed source code.
- Use an example environment file containing placeholders for documentation.
- Never place database credentials or private server keys in browser-delivered frontend variables.
- Restrict who and what can read production secrets.
- Do not print passwords, tokens, or full credential-bearing connection strings in logs.

Environment variables are a delivery mechanism for configuration, not a complete secret-management solution. Later, we will study how deployment environments and cloud secret services provide configuration more safely.

## 12. Essential backend commands

These are commands to understand now; do not run them as part of this theory lesson.

| Command | Meaning |
|---|---|
| `node --version` | Display the installed Node.js version |
| `npm --version` | Display the installed npm version |
| `node server.js` | Run the JavaScript file named `server.js` using Node.js |
| `npm run dev` | Run the project script named `dev`, if it is defined in `package.json` |
| `npm start` | Run the project's `start` script, if it is defined |

Important distinctions:

- `node server.js` directly starts a JavaScript entry file.
- `npm run dev` does not have a universal built-in meaning. The project author defines what the `dev` script does.
- A TypeScript backend may need a build step or an appropriate development runner. We will select the tooling when we implement TaskFlow.
- Running a server command starts a process; it does not automatically provision a database, deploy the application, or make it publicly accessible.

## 13. Common backend failures and where to investigate

| Symptom | Likely area to inspect |
|---|---|
| Browser cannot reach the API | Is the backend process running? Is the host and port correct? |
| A request returns 404 | Does the HTTP method and route path match a registered endpoint? |
| Request body is missing | Is JSON parsing middleware registered before the route? |
| A protected route returns 401 | Is the session missing, invalid, or expired? |
| A user receives 403 | Is an authorization rule rejecting the operation? |
| API returns 500 | Check backend logs and the error-handling path |
| Database connection fails | Inspect database availability and server-side connection configuration |
| Several requests become slow | Check database latency, external I/O, and blocking synchronous work |
| Request never responds | Check whether a middleware path failed to send a response or call `next()` |

The best debugging habit is to follow the request path one boundary at a time: browser, network, server process, middleware, route, business logic, database, response.

## 14. Essential vocabulary

| Term | Meaning |
|---|---|
| Runtime | Environment that executes a program |
| Node.js process | Running instance of a Node.js application |
| Express | Node.js web framework |
| HTTP server | Software that receives and responds to HTTP requests |
| Port | Numbered communication endpoint on a host |
| Route | Method/path mapping to request handling logic |
| Route handler | Function that processes a matched route |
| Middleware | Function in the request-response processing chain |
| Request object | Information about the incoming request |
| Response object | Interface used to send the response |
| Event loop | Mechanism that coordinates callbacks and asynchronous work in Node.js |
| Asynchronous I/O | I/O work that does not require the JavaScript thread to wait synchronously |
| Controller | Layer translating HTTP requests into application operations |
| Service | Layer that coordinates business rules |
| Repository | Layer responsible for data-access operations |
| Environment variable | Named configuration value made available to a process |
| Centralized error handling | One controlled path for processing application errors |

## 15. Knowledge checkpoint

Answer these without copying the explanations above:

1. What is the difference between Node.js and Express?
2. What does it mean for a Node.js server to listen on a port?
3. What is middleware, and why does its order matter?
4. What is the difference between middleware and a route handler?
5. Why should a backend avoid doing every task inside one large route handler?
6. At a high level, how does asynchronous I/O help Node.js handle requests while waiting for PostgreSQL?
7. Why can a long synchronous CPU operation make other requests slow?
8. What is an environment variable, and why should database credentials never be exposed in frontend code?
9. Where would you investigate if the API returns 404, 401, or 500?

### Explanation exercise

Explain this scenario:

A TaskFlow user submits a new task. The backend receives the request, checks the user's session, validates the task fields, saves the task in PostgreSQL, and returns a response.

Describe the role of Node.js, Express, middleware, routing, the request handler, business logic, data access, and error handling. Also explain what should happen if the database is unavailable.

## 16. Completion criteria

- [ ] Explain Node.js as a runtime and Express as a framework.
- [ ] Explain what a server process and listening port mean.
- [ ] Describe routes and middleware.
- [ ] Trace a request through the backend processing pipeline.
- [ ] Explain the separation between request handling, business logic, and data access.
- [ ] Explain asynchronous I/O and the event loop at a project level.
- [ ] Explain environment variables and secret-handling rules.
- [ ] Identify likely causes of common backend failures.
- [ ] Complete the knowledge checkpoint and explanation exercise.

**Lesson status:** Study material published. Mark complete only after the learner's checkpoint and explanation exercise have been reviewed.
