# Lesson 5.3 — Server Access and Networking

**Phase:** 5 — Linux and Server Administration  
**Goal:** Understand how to connect to a Linux server securely and investigate common network access problems.

## 1. Why do we need remote server access?

When TaskFlow is deployed on a cloud server, your development computer is not the same computer that runs the application.

You need a secure way to administer that remote server.

A common tool is **SSH**, which stands for Secure Shell. SSH provides an encrypted connection for remote command-line access and related operations.

You typically connect using:

- The server's IP address or hostname.
- A valid user account.
- An authentication method, commonly an SSH key.

## 2. What is an IP address and port?

An **IP address** identifies a network interface or endpoint so devices can send network traffic to it.

A **port** identifies a communication endpoint for a program or service on a host.

For example:

- SSH commonly listens on TCP port 22.
- HTTPS commonly uses TCP port 443.
- A local TaskFlow API might listen on port 3000.

These are common defaults, not guarantees. A service can be configured to use a different port.

A network connection is often identified using the protocol, IP address, and port.

## 3. Connect using SSH

A basic SSH command looks like:

    ssh developer@203.0.113.10

- ssh is the client program.
- developer is the username on the remote server.
- 203.0.113.10 is an example documentation IP address, not a real TaskFlow server.

If a server uses a non-default SSH port:

    ssh -p 2222 developer@203.0.113.10

The -p option selects the SSH server port.

If you need to select a particular private key:

    ssh -i ~/.ssh/taskflow_ed25519 developer@203.0.113.10

The -i option identifies the identity file used by the SSH client. The file path must refer to the private key stored securely on your computer.

## 4. Public key and private key

SSH key authentication commonly uses a key pair:

- **Private key:** stays with you and must remain secret.
- **Public key:** can be installed on the server to allow a matching private key to authenticate.

The server stores authorized public keys for an account, commonly in the user's .ssh/authorized_keys file.

A simplified flow:

    Your computer
    +----------------------+
    | Private key          |
    | stays private        |
    +----------------------+
             |
             | prove key possession
             v
       Encrypted SSH session
             |
             v
    Linux server
    +----------------------+
    | Authorized public key|
    | checks authentication|
    +----------------------+

The private key is not uploaded to the server. Never send it to a teammate or paste it into a chat, code file, issue, or Git repository.

Create an Ed25519 key pair:

    ssh-keygen -t ed25519 -C "taskflow-development"

- ssh-keygen creates SSH keys.
- -t chooses the key type.
- ed25519 is a modern public-key algorithm supported by OpenSSH.
- -C adds a comment to help identify the key.

You will be prompted for a file location and optionally a passphrase. A passphrase protects the private key if the file is copied or stolen.

The public key is typically saved with a .pub suffix. Only the public key is installed on the server.

Official OpenSSH manuals: https://www.openssh.org/manual.html

## 5. First-connection host verification

The first time you connect to a new SSH server, the client may ask you to trust its host key.

A **host key** identifies the server to the client. It helps protect against connecting to an impersonating server.

You should verify the server's host-key fingerprint through a trusted channel, such as the provider's console or an administrator, before accepting it.

Do not blindly delete the known_hosts record or disable host-key checking when a warning appears. A changed key can be legitimate after a server rebuild, but it can also indicate a security problem.

## 6. Inspect network interfaces and addresses

Once connected to a Linux server, inspect its network interfaces:

    ip address

This shows IP addresses and interface information.

Show the routing table:

    ip route

A **route** tells the system where to send network traffic for a destination.

You may see a default route. It indicates where traffic is sent when no more specific route matches.

Show network links:

    ip link

The ip command is a standard tool for inspecting and managing IP networking on Linux. Temporary changes made with ip commands may not survive a reboot; persistent configuration is handled by the distribution's network configuration system. On Ubuntu Server, Netplan is commonly used. Do not change network addresses or routes remotely without a recovery plan.

## 7. Check which ports are listening

Imagine TaskFlow is supposed to serve HTTP traffic on port 3000.

Is any process actually listening on that port?

Use:

    ss -lnt

This lists listening TCP sockets with numeric addresses and ports.

Useful flags:

- -l: listening sockets.
- -n: numeric output; avoid converting addresses and ports to names.
- -t: TCP sockets.

To include process information, you may use:

    sudo ss -lntp

The -p option attempts to show the process associated with a socket. sudo may be needed to see details for processes owned by other users.

If a server is not listening on the expected port, a firewall rule will not make the application appear. First confirm that the service is running and bound to the intended address and port.

## 8. Understand DNS and name resolution

DNS maps hostnames, such as api.example.com, to network records including IP addresses.

If an application cannot reach a service by hostname, the issue may be DNS rather than the service itself.

Useful commands:

    getent hosts api.example.com

This asks the system's name-service configuration to resolve the hostname.

    resolvectl status

On systems using systemd-resolved, this displays resolver configuration and DNS information.

Some systems use:

    dig api.example.com

dig is a DNS query tool. It may need to be installed separately.

If a hostname resolves to the wrong address, check the DNS configuration and records rather than changing unrelated application settings.

## 9. Test connectivity carefully

A few tools help investigate different layers:

    ping 203.0.113.10

ping tests whether ICMP echo messages receive replies. A failed ping does not prove that a web server is unavailable; firewalls may block ICMP while TCP services still work.

Check whether an HTTP service responds:

    curl -I https://example.com

curl makes a request to the address. The -I option requests response headers for HTTP(S) in common use.

These tests answer different questions:

| Tool | What it helps test |
|---|---|
| ping | Basic ICMP reachability, if allowed |
| curl | Whether an HTTP(S) endpoint responds |
| getent hosts | System hostname resolution |
| dig | DNS records and responses |
| ss -lnt | Local listening TCP ports |
| ip route | Where the system routes traffic |

No single command proves that the entire application path is healthy.

## 10. Firewall basics

A **firewall** applies rules that allow or block network traffic.

A Linux host firewall controls traffic at the server. In a cloud environment, there may also be a provider-level firewall or security group.

These are separate layers.

For example, the TaskFlow API may listen on port 3000, but:

- The Linux firewall might block port 3000.
- A cloud security group might block port 3000.
- A router or load balancer might not forward the traffic.
- The application may be listening only on loopback.
- The DNS record may point to another server.

On Ubuntu, UFW is a common firewall management tool.

Check its status:

    sudo ufw status verbose

A rule to allow SSH might look like:

    sudo ufw allow OpenSSH

A web server may need HTTP and HTTPS access:

    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp

Do not enable or change a firewall over your only remote SSH connection until you have confirmed that SSH is allowed and have an alternate recovery path. An incorrect firewall rule can lock you out.

The exact policy for TaskFlow must be designed deliberately. Do not expose the database to the public internet just to make the API connect to it.

## 11. A safe remote troubleshooting sequence

Suppose TaskFlow's public website cannot be reached.

Work through the layers:

1. **Check DNS:** does the hostname resolve to the expected server address?
2. **Check server reachability:** is the address correct and is the server available?
3. **Check the service process:** is the web service or container running?
4. **Check the listening port:** does ss show the expected port?
5. **Check local HTTP response:** can curl reach the service from the server itself?
6. **Check the host firewall:** are the intended ports allowed?
7. **Check the cloud firewall/security group:** does the provider allow the traffic?
8. **Check routing and proxying:** is traffic sent to the correct backend?
9. **Check logs:** what does the application or web server report?

Use the evidence to identify the layer that is failing. Avoid changing DNS, firewall, application configuration, and network routes all at once.

## 12. How this connects to TaskFlow and later AWS work

When TaskFlow is deployed, a normal traffic path may be:

    Browser
       |
       v
    DNS hostname
       |
       v
    Public server address
       |
       v
    Cloud network/firewall rules
       |
       v
    Linux host / reverse proxy
       |
       v
    Application container
       |
       v
    Database on private application network

SSH is an administration path, not the normal public web application path.

Phase 6 will introduce AWS networking and security groups. Phase 7 will connect public web access, DNS, HTTPS, reverse proxy, and application ports. This phase gives you the Linux and network vocabulary needed to understand those designs.

## 13. Common beginner mistakes

- **Sharing a private SSH key:** only the public key should be installed on the server.
- **Ignoring host-key warnings:** verify the fingerprint through a trusted channel.
- **Assuming ping proves web access:** ICMP and HTTP use different protocols.
- **Assuming DNS success proves the server is healthy:** DNS only resolves names.
- **Assuming an open firewall port means an app is running:** a process must listen on the port.
- **Using localhost to test a remote service from your laptop:** localhost refers to the computer where the command runs.
- **Changing firewall rules over SSH without a fallback:** you may disconnect yourself.
- **Opening database ports publicly:** keep database access restricted to the required application path.

## 14. Knowledge checkpoint

1. What does SSH provide?
2. What is the difference between a public key and a private key?
3. Why should you verify a server's host-key fingerprint?
4. What does ip address show?
5. What does ip route help you understand?
6. What does ss -lntp show?
7. How are DNS, ping, and curl tests different?
8. What does a firewall do?
9. Why should you confirm SSH access before changing remote firewall rules?
10. Describe a safe order for investigating a website that cannot be reached.

**Completion rule:** You should be able to explain remote access, key safety, basic network inspection, and a layered troubleshooting process.

## Official references

- [OpenSSH manual pages](https://www.openssh.org/manual.html)
- [OpenSSH ssh-keygen manual](https://man.openbsd.org/ssh-keygen)
- [Ubuntu networking documentation](https://ubuntu.com/server/docs/how-to/networking/)
- [Ubuntu network configuration](https://ubuntu.com/server/docs/configuring-networks/)
- [Ubuntu firewall guide](https://ubuntu.com/server/docs/how-to/security/firewalls/)
- [iproute2 manual collection](https://www.kernel.org/doc/html/latest/networking/)
