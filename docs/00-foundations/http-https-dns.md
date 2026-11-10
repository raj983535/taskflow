# HTTP, HTTPS, and DNS: The Anatomy of Web Communication

## Learning objectives

Understand how a browser locates a service, establishes a connection, protects data in transit, and exchanges HTTP messages.

## 1. What is a URL?

Consider:

`https://app.taskflow.example/api/tasks?status=open`

- Scheme: `https`
- Hostname: `app.taskflow.example`
- Path: `/api/tasks`
- Query string: `status=open`

A URL identifies the resource the client wants to access and provides information about how to access it.

## 2. DNS: names to network addresses

The Domain Name System (DNS) is a distributed naming system. It can return many kinds of records, including addresses and mail-routing information.

A browser normally asks a recursive DNS resolver to look up a hostname. The resolver may answer from cache or query the DNS hierarchy to find the authoritative answer.

Common records:

| Record | Purpose |
|---|---|
| A | Maps a hostname to an IPv4 address |
| AAAA | Maps a hostname to an IPv6 address |
| CNAME | Makes one hostname an alias of another hostname |
| MX | Identifies mail exchangers for a domain |
| TXT | Publishes text data, often used for domain verification and email security |
| NS | Identifies authoritative name servers |

**TTL (Time to Live)** tells DNS caches how long a record may be cached. A DNS change is not guaranteed to appear everywhere instantly because caches may retain earlier answers until their TTL expires.

A CNAME points to another hostname, not directly to an IP address. DNS standards restrict a CNAME from coexisting with other records at the same owner name. Some DNS providers offer ALIAS, ANAME, or CNAME flattening behavior for zone-apex use cases.

## 3. HTTP: the application protocol

HTTP defines request and response messages exchanged by clients and servers.

A request commonly contains:
- Method: GET, POST, PUT, PATCH, DELETE, etc.
- Path and query parameters.
- Headers: metadata about the request.
- Optional body: data sent to the server.

A response commonly contains:
- Status code, such as 200, 201, 400, 401, 404, or 500.
- Headers.
- Optional response body.

Example:

```http
GET /api/tasks HTTP/1.1
Host: localhost:5000
Accept: application/json
```

A successful response might be:

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "success": true,
  "data": []
}
```

HTTP is designed to be stateless at the protocol level: each request can be understood independently. Applications can still maintain user sessions using cookies, tokens, databases, or other mechanisms.

## 4. HTTPS and TLS

HTTPS is HTTP protected by TLS (Transport Layer Security).

TLS provides:
- **Confidentiality:** Network observers cannot normally read the protected application data.
- **Integrity:** Changes to protected data in transit can be detected.
- **Authentication:** The client can verify the server's certificate and identity, subject to correct certificate validation.

A certificate does not mean a website is trustworthy in every sense. It helps verify control of the hostname and establish an encrypted connection; it does not prove that the site's business or content is safe.

## 5. A simplified modern connection sequence

For a typical HTTPS connection over TCP (such as HTTP/1.1 or HTTP/2), the broad sequence is:

1. The client resolves the hostname through DNS, if it is not already cached.
2. The client establishes a TCP connection to the selected server endpoint.
3. The client and server perform a TLS handshake.
4. The server presents a certificate chain. The client validates the chain, hostname, validity period, and trust.
5. The peers negotiate cryptographic parameters and establish shared traffic keys.
6. HTTP messages are sent inside the encrypted TLS connection.

Modern TLS does not normally send a newly generated symmetric key encrypted with the server's RSA public key. TLS 1.3 typically uses ephemeral Diffie-Hellman key agreement (for example, ECDHE) to derive shared secrets. Both sides then derive symmetric traffic keys. This also supports forward secrecy.

HTTP/3 is different at the transport layer: it uses QUIC over UDP, with TLS 1.3 integrated into the QUIC handshake. Therefore, a TCP three-way handshake is not part of an HTTP/3 connection.

## 6. What happens when opening a website?

```text
Browser
  |
  | 1. Resolve hostname (DNS, if needed)
  v
DNS recursive resolver
  |
  | 2. Return an address record
  v
Browser
  |
  | 3. Connect to the selected endpoint
  | 4. Negotiate TLS for HTTPS
  | 5. Send an encrypted HTTP request
  v
Load balancer / reverse proxy (if configured)
  |
  | 6. Route request to application
  v
Node.js + Express API
  |
  | 7. Query database if required
  v
PostgreSQL
  |
  | 8. Return result to backend
  v
Express API
  |
  | 9. Create HTTP response
  v
Browser
  |
  | 10. Render or update the page
  v
User sees the result
```

This is a conceptual flow. Caches, CDNs, service workers, proxies, and connection reuse can change the exact sequence.

## 7. TLS termination at a reverse proxy

In a production design, TLS may terminate at a load balancer or reverse proxy.

For example:

```text
Browser --HTTPS/TLS--> AWS Load Balancer --HTTP or HTTPS--> API
```

The first connection is encrypted. The second connection's protection depends on its configuration. If the load balancer forwards plain HTTP, the traffic is not encrypted on that internal segment. A private network reduces exposure but is not itself encryption.

We will decide and document the actual configuration when we deploy TaskFlow. Do not assume that a connection is encrypted end-to-end merely because the browser URL begins with `https://`.

## 8. HTTP versions at a high level

| Version | Transport | Main idea |
|---|---|---|
| HTTP/1.1 | TCP | Text-based message format; browsers commonly use multiple connections for concurrency |
| HTTP/2 | TCP | Binary framing and multiplexed streams on a connection |
| HTTP/3 | QUIC over UDP | Multiplexed streams with transport behavior designed to avoid TCP-level head-of-line blocking between independent streams |

These are protocol-level differences. Application code often uses the same high-level HTTP methods regardless of version.

## 9. PowerShell diagnostics

Query DNS:

```powershell
Resolve-DnsName -Name example.com -Type A
Resolve-DnsName -Name example.com -Type AAAA
```

Ask a specific recursive resolver:

```powershell
nslookup example.com 8.8.8.8
```

Inspect HTTP response headers:

```powershell
curl.exe -I https://httpbin.org/get
```

Inspect connection timing:

```powershell
curl.exe -w "DNS: %{time_namelookup}s | TCP: %{time_connect}s | TLS: %{time_appconnect}s | Total: %{time_total}s\n" -o NUL -s https://example.com
```

The timing fields are measurements from curl. The exact interpretation depends on protocol, connection reuse, proxies, and the curl build.

## 10. TaskFlow usage

During local development, the frontend and backend may use HTTP on localhost because they are running on the same development machine. This is a learning convenience, not a production security recommendation.

For a production deployment:
- A DNS provider hosts the required DNS records.
- A public endpoint such as an AWS load balancer receives traffic.
- HTTPS is configured using a valid certificate.
- The load balancer forwards requests to the backend through the intended network path.
- The database is not exposed as a public application endpoint.

We will choose Route 53 or another DNS provider only when the project needs it.

## 11. Common errors

| Error | Possible cause | What to check |
|---|---|---|
| Name not resolved | Missing or incorrect DNS record, stale cache, resolver issue | Authoritative records, resolver answer, TTL |
| Certificate name mismatch | Certificate does not cover the requested hostname | Subject Alternative Names and hostname |
| Certificate expired | Certificate renewal or deployment issue | Validity period and certificate automation |
| Mixed content | HTTPS page loads an insecure HTTP resource | API and asset URLs |
| 502 Bad Gateway | Proxy could not obtain a valid upstream response | Upstream process, port, logs |
| 504 Gateway Timeout | Upstream did not respond in time | Slow handler, database, external dependency |

## 12. Interview questions

1. What is DNS and what does a recursive resolver do?
2. What is the difference between A, AAAA, and CNAME records?
3. What does TTL control?
4. What does TLS provide?
5. How does a modern TLS handshake establish traffic keys?
6. How does HTTP/3 differ from HTTP/2?
7. What does TLS termination mean?
8. Does HTTPS guarantee that a website is trustworthy?

## 13. Key takeaways

- DNS is a distributed naming system, not just a single phonebook server.
- HTTP defines the request-response message format.
- HTTPS protects HTTP using TLS.
- Modern TLS uses key agreement to derive symmetric traffic keys.
- HTTP/3 uses QUIC over UDP, not TCP.
- TLS termination at a proxy means the proxy is an endpoint of that encrypted connection.
