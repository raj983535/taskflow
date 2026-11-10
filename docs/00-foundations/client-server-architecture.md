# Client-Server Architecture: The Foundation of Modern Software

## Learning objectives

By the end of this lesson, you should be able to explain:
- What a client and server are.
- Why applications separate user interfaces from server-side business logic.
- How a request-response interaction works.
- Why a backend can be a server to a browser and a client to a database.
- Where networking and databases fit into the architecture.

## 1. The basic idea

Client-server architecture is a model in which one program requests a service or resource and another program provides it.

- **Client:** Starts a request. Examples include a browser, mobile app, command-line tool, or another backend service.
- **Server:** Receives requests and provides a response. A server is often a program running on a computer, not necessarily a special physical machine.

A browser is a client when it requests a web page. An Express application is a server when it handles that browser's HTTP request.

The same Express application can also be a client when it connects to PostgreSQL or calls another service. The words client and server describe a role in a particular interaction.

## 2. Why separate the client and server?

Consider a task-management application. The browser needs to display tasks and capture user actions. The application also needs to enforce rules such as:
- A user must be authenticated before accessing private tasks.
- A task title cannot be empty.
- One user must not read or edit another user's tasks.
- Data must be stored consistently.

The browser is not a trusted place to enforce these rules. Users can inspect and modify browser code and requests. The backend therefore validates requests and enforces authorization before changing protected data.

The database stores durable information. It is not normally exposed directly to an untrusted browser.

## 3. A request-response cycle

Suppose a signed-in TaskFlow user opens the My Tasks screen.

1. The user performs an action in the browser.
2. The frontend sends a request to the backend API.
3. The backend receives and parses the request.
4. The backend authenticates the caller and checks authorization.
5. If needed, the backend queries PostgreSQL.
6. PostgreSQL returns a result or error.
7. The backend creates an HTTP response.
8. The browser uses the response to update the screen.

This is a simplified logical sequence. Real requests also involve DNS resolution, transport connections, possible TLS encryption, proxies, timeouts, and error handling.

### Example request

```http
GET /api/tasks HTTP/1.1
Host: localhost:5000
Accept: application/json
Authorization: Bearer <access-token>
```

### Example response

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "data": [
    {
      "id": "task-001",
      "title": "Learn Docker",
      "status": "pending"
    }
  ]
}
```

The example token is a placeholder. Never put a real access token in committed documentation.

## 4. Architecture and responsibilities

```text
+---------------------------+
| Browser / React frontend  |
| - Renders the interface   |
| - Captures user actions   |
| - Calls the backend API   |
+-------------+-------------+
              |
              | HTTP request / response
              v
+---------------------------+
| Node.js + Express backend |
| - Authentication         |
| - Authorization           |
| - Validation              |
| - Business rules          |
| - Logging and errors      |
+-------------+-------------+
              |
              | Database protocol / SQL
              v
+---------------------------+
| PostgreSQL                |
| - Stores durable data     |
| - Enforces constraints    |
| - Executes queries        |
+---------------------------+
```

Responsibilities should be separated, but the diagram does not mean every application requires separate physical machines. During local development, all three components can run on one laptop. In production, they may run on different services or hosts.

## 5. A server is a role, not necessarily a physical machine

A server can be:
- A program listening for network requests.
- A physical computer running that program.
- A virtual machine in a data centre.
- A container running on a host.
- A managed cloud service.

For example, an EC2 virtual machine is a cloud compute resource. Our Node.js process inside it can act as the application server.

## 6. TaskFlow usage

For TaskFlow:
- **Client:** React + TypeScript in the user's browser.
- **Application server:** Node.js + Express API.
- **Database server:** PostgreSQL.
- **Communication:** HTTP between browser and API; PostgreSQL's database protocol between API and database.

The backend is a server to the browser and a client to PostgreSQL.

## 7. Important concepts not to confuse

### Authentication vs authorization
- Authentication asks: Who are you?
- Authorization asks: Are you allowed to do this?

### CORS vs authentication
CORS is a browser-enforced mechanism that controls whether frontend JavaScript can read cross-origin responses. It is not an authentication or authorization system. The backend must still validate identity and permissions. Tools such as curl and Postman do not enforce browser CORS rules, but they can send credentials when configured to do so.

### Stateful vs stateless
A stateful service keeps relevant session or conversational state between requests. A stateless API design aims for each request to carry the information required to process it, rather than depending on memory stored in one particular application instance. Stateless design can make horizontal scaling easier, but it does not mean the whole system has no state: the database still stores application data.

## 8. Practical observation

Open Chrome DevTools:
1. Open the Network tab.
2. Filter by Fetch/XHR.
3. Visit `https://jsonplaceholder.typicode.com/posts`.
4. Select a request.
5. Inspect Request URL, Request Method, Status Code, Response, and Content-Type.

You can also inspect a request from PowerShell:

```powershell
curl.exe -i https://httpbin.org/get
```

The command sends an HTTP request and prints response headers along with the response body.

## 9. Common errors

| Error | Possible cause | What to inspect |
|---|---|---|
| Connection refused | No process is listening at the target address and port | Server process, port, bind address |
| 401 Unauthorized | Missing or invalid authentication | Token or session validation |
| 403 Forbidden | Caller is authenticated but lacks permission | Authorization rules |
| 404 Not Found | Route or resource does not exist | Request path and resource ID |
| 500 Internal Server Error | Unexpected server-side failure | Application logs and stack trace |
| CORS error in browser | Browser rejected access to a cross-origin response | Origin, preflight, CORS headers |

## 10. Interview questions

1. What is client-server architecture?
2. Can a backend be both a client and a server?
3. Why should the backend enforce authorization?
4. What is the difference between authentication and authorization?
5. Does a server have to be a physical machine?
6. Does CORS replace authentication?

## 11. Key takeaways

- Client and server describe roles in a specific interaction.
- The client initiates a request; the server handles it and returns a response.
- The backend enforces business rules and access permissions.
- The database stores durable application data.
- The backend can be a client to another server.
- CORS, authentication, and authorization solve different problems.

## 12. Lesson completion

- [ ] Explain client and server in your own words.
- [ ] Trace a request in Chrome DevTools.
- [ ] Explain why the browser should not connect directly to the production database.
- [ ] Distinguish CORS from authorization.
- [ ] Complete the knowledge check with the mentor.
