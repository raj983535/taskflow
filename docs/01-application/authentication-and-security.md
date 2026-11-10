# TaskFlow Authentication and Security Model

This document explains the learning project's baseline security controls and their limits. TaskFlow Phase 1 is an educational implementation, not a security-audited production identity service.

## 1. Password handling

- The API validates a minimum password length of 12 characters.
- Password input is limited to 72 UTF-8 bytes because bcrypt uses at most 72 input bytes.
- bcryptjs hashes passwords with cost factor 12.
- The database stores the password hash, never the plaintext password.
- Login uses bcrypt comparison and returns a generic incorrect-credentials message.

Passwords should not be logged, included in error reports, sent to analytics, or committed to Git.

## 2. Opaque server-side sessions

After registration or successful login:
1. The backend generates a cryptographically random 32-byte token.
2. The browser receives the token in a cookie.
3. The backend stores only the SHA-256 hash of the token in the sessions table.
4. On later requests, the backend hashes the cookie token and looks up a non-expired session.
5. Logout deletes the matching session and clears the cookie.

The browser cookie is configured with:
- `HttpOnly`: frontend JavaScript cannot read the cookie.
- `SameSite=Lax`: reduces cross-site cookie sending in common navigation/request scenarios.
- `Secure` in production: browsers send the cookie only over secure connections.
- `Path=/`.
- Seven-day max age.

## 3. Authentication vs authorization

Authentication answers "Who is making this request?"

Authorization answers "Is this authenticated user allowed to access this resource?"

TaskFlow performs authentication in middleware and authorization by including the authenticated `user_id` in task SQL queries. This is essential for preventing insecure direct object reference (IDOR) bugs.

## 4. Browser origin and CORS

The API allows the configured frontend origin and credentialed requests. A separate origin-check middleware rejects a browser request that supplies a different Origin.

CORS is not authentication. Non-browser tools can make requests without browser CORS enforcement. The backend still needs to validate the session and user ownership.

The local Vite proxy makes browser API requests appear same-origin. The cookie is sent with requests because the frontend API client sets `credentials: "include"`.

## 5. Additional defensive controls

- Helmet sets common HTTP security headers.
- JSON bodies are limited to 1 MB.
- Zod validates untrusted input.
- SQL values are parameterized.
- Task IDs are validated as UUIDs.
- Authentication routes are rate limited to 10 requests per 15-minute window per client key using the in-memory default store.
- Unknown routes return 404.
- Internal error details are not returned to the caller.
- The API does not return password hashes or raw session tokens in JSON.

## 6. Important limitations to understand

Before a real public production launch, this design needs a focused security review and additional work, including:
- CSRF protection appropriate to the final origin and cookie deployment model.
- Email verification and account recovery/password reset.
- A shared rate-limit/session strategy when multiple API instances are deployed.
- Session revocation and user-driven active-session management.
- Security logging, audit events, alerting, and abuse monitoring.
- Database TLS and secure secret delivery in production.
- Dependency scanning, patching, security tests, and a documented incident process.
- Appropriate reverse-proxy trust settings and network restrictions.
- A password policy and abuse controls designed for the actual threat model.

The in-memory rate-limit store is per-process. It does not coordinate limits between multiple API replicas and is not a distributed production rate limiter.

## 7. Secret-handling rules

- Keep `backend/.env` local and untracked.
- Commit only `backend/.env.example` with placeholder values.
- Never put database passwords in frontend environment variables. Vite variables prefixed with `VITE_` are compiled into browser-accessible code.
- Never paste cookies, session tokens, or credentials into GitHub issues or screenshots.
