# Ports, Sockets, and Networking: How Processes Communicate

## Learning objectives

Understand IP addresses, ports, sockets, listening processes, local interfaces, Docker port publishing, and why production databases should not be publicly exposed.

## 1. IP address, port, and socket

- **IP address:** Identifies a network interface on an IP network. A computer can have multiple interfaces and addresses.
- **Port:** A 16-bit number used by TCP or UDP to identify an application endpoint on a host. The range is 0–65535.
- **Socket:** A programming abstraction used for network communication. A listening TCP socket is associated with a local address and port. An established TCP connection is identified by the protocol and the local and remote address/port pair.

A useful mental model is: IP address gets traffic to a network interface; the transport protocol and port help deliver it to the correct application endpoint.

Port 0 is reserved for special uses such as requesting an automatically assigned local port. It is not normally used as a destination service port.

## 2. Common port numbers

| Port | Common use |
|---:|---|
| 22 | SSH |
| 53 | DNS (TCP and UDP) |
| 80 | HTTP |
| 443 | HTTPS |
| 3000 | Common development server default |
| 5000 | Common application development port |
| 5432 | PostgreSQL |
| 3306 | MySQL |
| 6379 | Redis |

These are conventions, not guarantees. An application can be configured to listen on a different port.

## 3. Port ranges

The commonly defined IANA ranges are:
- **System / well-known:** 0–1023.
- **User / registered:** 1024–49151.
- **Dynamic / private:** 49152–65535.

Operating systems can configure their ephemeral client-port range differently. Do not assume every machine uses the same exact outbound range.

On Unix-like systems, binding to a port below 1024 generally requires root privileges or an appropriate capability. Windows uses different privilege rules; do not apply the Unix rule to Windows.

## 4. Listening address: localhost and 0.0.0.0

- **127.0.0.1:** IPv4 loopback address. A service listening only here accepts local IPv4 connections through loopback.
- **localhost:** A hostname that commonly resolves to loopback addresses (often both IPv4 and IPv6).
- **0.0.0.0:** A special IPv4 wildcard bind address. A service binding to it listens on all IPv4 interfaces available in that network namespace. It is not a remote destination address to which a client should normally connect.
- **:::** IPv6 wildcard address. Whether it also accepts IPv4-mapped connections depends on operating-system configuration.

Inside a container, binding a server to 127.0.0.1 normally makes it reachable only from inside that same container. To accept connections arriving through the container's network interface, an application commonly binds to 0.0.0.0.

Listening on all interfaces can increase exposure. Use firewall rules and port publishing deliberately.

## 5. Docker port publishing

Consider:

```powershell
docker run --rm -p 8080:5000 taskflow-api
```

The two port numbers mean:

- `8080`: Port published on the Docker host.
- `5000`: Port on which the application listens inside the container.

A request to the host's published port 8080 is forwarded to port 5000 in the container.

```text
Developer's machine
  |
  | http://localhost:8080
  v
Docker host port 8080
  |
  | Docker port forwarding
  v
Container network
  |
  | container port 5000
  v
Node.js API listening on 0.0.0.0:5000
```

Docker Desktop on Windows uses a Linux environment for Linux containers, commonly through WSL 2. Its networking and port forwarding involve Docker Desktop components and the Linux VM; it is not accurate to describe every Windows port mapping as a simple Windows iptables rule.

If no host port is published, the service may still be reachable by other containers on a shared Docker network, depending on network configuration.

## 6. TaskFlow development ports

Our planned local development defaults are:

| Component | Example host port | Internal listener |
|---|---:|---:|
| Frontend dev server | 3000 | 3000 |
| Backend API | 5000 | 5000 |
| PostgreSQL | 5432 (optional host publishing) | 5432 |

The backend should connect to PostgreSQL using the database service name and container port when both services run on the same Docker Compose network. It should not use localhost to refer to another container.

We will confirm the exact ports when we implement the services.

## 7. Security: do not expose the database publicly

In a typical cloud deployment:
- Public users reach the application through an HTTPS endpoint.
- The backend reaches the database over a private network.
- The database security rules allow connections only from the backend's security group or other explicitly authorized source.
- Database credentials are stored as secrets, not committed to Git.

A private subnet is useful but does not replace authentication, encryption where required, patching, backups, and least-privilege network rules.

## 8. PowerShell diagnostics

List listening TCP endpoints:

```powershell
Get-NetTCPConnection -State Listen |
  Select-Object LocalAddress, LocalPort, OwningProcess
```

Find the process listening on port 5000:

```powershell
$connection = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
$connection | Select-Object LocalAddress, LocalPort, OwningProcess
```

Then inspect the process:

```powershell
Get-Process -Id <PID>
```

Replace `<PID>` with the numeric process ID from the previous command.

Test a TCP connection:

```powershell
Test-NetConnection -ComputerName localhost -Port 5000
```

Inspect local IPv4 addresses:

```powershell
Get-NetIPAddress -AddressFamily IPv4 |
  Select-Object InterfaceAlias, IPAddress
```

## 9. Common errors

| Error | Possible cause | What to inspect |
|---|---|---|
| EADDRINUSE | Another process already owns the requested port | Listening sockets and owning PID |
| Connection refused | No service is listening at the target endpoint | Service status, bind address, port |
| Container is unreachable | Wrong bind address, missing port publishing, or network mismatch | Container logs, bind address, Docker network |
| Connection timed out | Firewall or routing is dropping traffic | Host firewall, cloud security rules, route |
| Database connection fails in Compose | Backend uses localhost or wrong service port | Compose service name and container port |

## 10. Interview questions

1. What is the difference between an IP address and a port?
2. What is a socket?
3. What is the difference between 127.0.0.1 and 0.0.0.0?
4. What does Docker's `-p 8080:5000` do?
5. Why should a production database not be exposed publicly?
6. Why should a backend container use a database service name rather than localhost?

## 11. Key takeaways

- IP addresses identify network interfaces; ports identify transport endpoints.
- A listening address controls which interfaces can accept connections.
- Docker port publishing connects a host port to a container port.
- Containers on the same Docker network can usually communicate without publishing every service port to the host.
- Expose only the endpoints that need to be reachable, and enforce network access with explicit rules.
