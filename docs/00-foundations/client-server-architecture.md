# Client-Server Architecture: The Foundation of Modern Software

---

## 1. Definition
**Client-Server Architecture** is a distributed computing model where workload is divided between two distinct entities:
- **Client (Service Requester)**: Any hardware or software that requests services, resources, or computation (e.g., a React app running in Chrome, a mobile iOS app, or a terminal running `curl`).
- **Server (Service Provider)**: Any hardware or operating system process that passively listens for requests, performs authentication, executes business logic, interacts with persistence layers (databases), and returns responses.

---

## 2. Problem: Why It Was Created
In early computing (monolithic mainframe era), computation, display, and data all resided on a single centralized machine. Terminals were "dumb" screens without processing capability.
As personal computers and distributed networks emerged, companies faced two major issues:
1. **Centralized Bottlenecks**: One machine doing display rendering, file storage, and data querying crashed when thousands of users connected simultaneously.
2. **Duplication & Insecurity**: Storing data and business logic directly on end-user machines (peer-to-peer / desktop software) allowed users to tamper with critical data, inspect database passwords, and created massive data synchronization conflicts.

**The Solution**: Centralize the source of truth, security policies, and heavy processing on **Servers**, while offloading rendering and user interaction to **Clients**.

---

## 3. Internal Working
The interaction follows a continuous **Request-Response Cycle**:

1. **Passive Listening**: The server process binds to a network socket (IP address + Port) and enters an event loop listening for incoming TCP connection handshakes.
2. **Connection Handshake**: The client initiates a TCP 3-way handshake (`SYN` → `SYN-ACK` → `ACK`).
3. **Payload Transmission**: The client sends a formatted request (HTTP method, headers, query parameters, or body).
4. **Execution & Context Isolation**: The server accepts the socket, parses the raw bytes into a structured request object, checks authentication tokens, queries the database, and constructs a response.
5. **Response Delivery**: The server writes the response status code, headers, and payload back to the socket.
6. **Connection Termination or Reuse**: Depending on HTTP `keep-alive` headers, the TCP socket is either held open for subsequent requests or closed.

---

## 4. Architecture: Components & Relationships

```
┌─────────────────────────────────┐
│         CLIENT TIER             │
│  - React Application (Vite)     │
│  - Browser DOM & Local Storage  │
│  - Axios / Fetch API Client     │
└────────────────┬────────────────┘
                 │ HTTP/HTTPS Request (JSON)
                 ▼
┌─────────────────────────────────┐
│      APPLICATION SERVER TIER    │
│  - Reverse Proxy (Nginx)        │
│  - Node.js / Express Process    │
│  - JWT Auth & Route Validation  │
└────────────────┬────────────────┘
                 │ TCP Protocol (Port 5432)
                 ▼
┌─────────────────────────────────┐
│        DATABASE TIER            │
│  - PostgreSQL Engine            │
│  - Disk Storage & WAL Logs      │
│  - Connection Pool (pg)         │
└─────────────────────────────────┘
```

---

## 5. Practical: Commands & Implementation
To inspect client-server communication from your terminal without a browser:

```powershell
# 1. Inspect raw headers and timing of a server request
curl.exe -v https://httpbin.org/get

# 2. Inspect active network listening sockets on your local Windows machine
Get-NetTCPConnection -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess

# 3. Simulate a simple client request passing JSON to a local backend
curl.exe -X POST http://localhost:5000/api/tasks `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Learn Docker\",\"status\":\"Todo\"}'
```

---

## 6. Project Usage in TaskFlow
In TaskFlow:
- **Client**: React + TypeScript frontend running in the user's browser (or served via an Nginx container). It renders the Kanban dashboard, captures task creation events, and manages authentication state in memory.
- **Server**: Node.js + Express backend running as an isolated process inside a Docker container. It validates JWT tokens, executes CRUD queries against PostgreSQL, and logs all incoming requests.
- **Database**: PostgreSQL server running independently on port `5432`. The backend acts as a client to the PostgreSQL server.

---

## 7. Real-World Industry Context
In high-scale enterprise environments (Uber, Netflix, Airbnb):
- **BFF (Backend for Frontend)**: Different client platforms (iOS, Android, Web, Smart TVs) connect to dedicated micro-servers tailored to their UI needs.
- **Stateless Servers**: Servers do not store user sessions in local server RAM. Instead, authentication is managed via cryptographically signed tokens (JWTs) or shared distributed caches (Redis). This allows engineers to spin up 50 copies of the server behind a load balancer without users getting logged out.

---

## 8. Troubleshooting: Common Errors & Solutions
| Error | Root Cause | Engineering Solution |
|---|---|---|
| `ECONNREFUSED 127.0.0.1:5000` | The server process is not running, or is listening on a different port/interface. | Verify the server is running using `Get-Process node` or check logs. |
| `CORS Error: No 'Access-Control-Allow-Origin'` | The browser blocked the client from reading the server response because the frontend domain differs from the backend domain. | Configure Express middleware: `app.use(cors({ origin: 'http://localhost:3000' }))`. |
| `504 Gateway Timeout` | The reverse proxy (Nginx or Load Balancer) did not receive a timely response from the backend application. | Check backend performance, database locks, or slow third-party API calls. |

---

## 9. Interview Preparation: High-Yield Questions
1. **Q: What is the difference between a stateful and a stateless server?**
   - *Answer*: A stateful server keeps client session data in its local memory, requiring subsequent requests from the same user to hit that exact server (sticky sessions). A stateless server stores no client session locally; every request contains all necessary credentials (e.g., JWT), allowing any server replica in the cluster to process it.
2. **Q: Why does the browser enforce CORS, but tools like `curl` or Postman do not?**
   - *Answer*: CORS (Cross-Origin Resource Sharing) is a browser-enforced security sandbox designed to protect authenticated end users from malicious websites executing unauthorized background requests using their saved cookies. `curl` and Postman are developer tools without ambient credentials or cross-site user sessions.

---

## 10. Revision & Summary
- The client initiates requests; the server passively listens on a socket and responds.
- In modern DevOps, servers must be **stateless** so they can be packaged into containers and horizontally scaled.
- The backend application is simultaneously a **server** to the browser client and a **client** to the PostgreSQL database server.
