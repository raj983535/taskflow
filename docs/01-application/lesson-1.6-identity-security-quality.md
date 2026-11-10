# Lesson 1.6 — Identity, Security, and Quality Basics

**Phase:** 1 — Full-stack application fundamentals  
**Status:** Study material; learner checkpoint pending  
**Purpose:** Understand how TaskFlow recognizes users, protects their data, handles secrets, changes its database safely, and verifies important behavior.

This final Phase 1 lesson brings together the browser, API, backend, and PostgreSQL concepts from Lessons 1.1–1.5. We will focus on practical security and quality decisions for a small full-stack application. This is not a specialist cybersecurity or testing course.

## 1. Authentication and authorization are different

These terms are related, but they answer different questions:

- **Authentication (AuthN):** Who is making this request?
- **Authorization (AuthZ):** What is this authenticated user allowed to do?

Example:
- A user enters their credentials and successfully signs in. That establishes their identity.
- The user requests a task. The backend checks whether that task belongs to them. That is authorization.

A successful login does not mean the user can access every record or endpoint. Authorization must be checked for the specific action and resource.

For TaskFlow, a normal user may read, create, update, and delete their own tasks. They should not be able to read or update another user's tasks just because they know a task ID.

**Rule:** Authentication establishes identity. Authorization decides permission. The backend enforces both.

## 2. The sign-in lifecycle

A session lets the server recognize a user across multiple HTTP requests. HTTP itself is stateless, so the application needs a mechanism to connect one request to the next.

A typical server-side session flow looks like this:

~~~text
1. Browser sends email + password over HTTPS
                 |
                 v
2. Express validates request shape and rate limits attempts
                 |
                 v
3. Backend finds the account and verifies its password hash
                 |
                 v
4. Backend creates a random, unguessable session identifier
   and stores the session record server-side
                 |
                 v
5. Backend returns Set-Cookie with protected cookie attributes
                 |
                 v
6. Browser stores the cookie and sends it on eligible requests
                 |
                 v
7. Backend validates the session and establishes user context
                 |
                 v
8. Authorization checks whether that user may perform the action
~~~

The browser normally does not need to send the user's ID with every request to prove who they are. The server derives the identity from the validated session.

When the user signs out, the server invalidates or deletes the session and the response clears the browser cookie. Clearing only the cookie is not enough if the server would still accept a stolen copy of the old session identifier.

## 3. Passwords must be hashed, not stored as text

Never store a user's plaintext password in the database. If a database is exposed, plaintext passwords would be immediately readable and may also put accounts on other services at risk when people reuse passwords.

A password-storage algorithm is deliberately expensive to slow down guessing attacks. For a new system, current OWASP guidance prefers **Argon2id**. Scrypt is another option; bcrypt is commonly encountered in legacy systems. Use a maintained library that generates a unique salt and stores the algorithm parameters with the resulting hash. Do not invent your own password-hashing algorithm or use fast general-purpose hashes such as SHA-256 by themselves for password storage. [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

Understand the difference:

| Technique | What it means | Typical use |
|---|---|---|
| Hashing | One-way transformation; original value is not decrypted | Password verification |
| Encryption | Reversible with an appropriate key | Data that must later be read |
| Encoding | Changes representation; offers no secrecy | JSON or Base64 representation |

When a user signs in, the backend verifies the submitted password against the stored password hash. It does not decrypt the hash.

A password reset should use a short-lived, single-use reset process. Do not send the user's old password back to them.

## 4. Sessions, cookies, and JWTs

### Server-side sessions

With a server-side session:
- The browser receives an opaque, random session identifier.
- The server stores the associated user, expiry, and session state.
- The server checks the identifier on later requests.
- The server can revoke a session by invalidating its server-side record.

This is a straightforward mental model for a browser-based application.

### Cookies

A cookie is a browser-managed piece of data that can be sent automatically with matching requests. Session cookies commonly carry the session identifier.

Important cookie attributes:

| Attribute | Purpose |
|---|---|
| **HttpOnly** | Prevents ordinary frontend JavaScript from reading the cookie |
| **Secure** | Sends the cookie only over secure connections |
| **SameSite** | Controls when the browser sends the cookie in cross-site contexts |
| **Path / Domain** | Controls where the cookie is sent |
| **Max-Age / Expires** | Controls the cookie's lifetime |

For a same-site HTTPS deployment, HttpOnly, Secure, and an appropriate SameSite policy are sensible baseline protections. The precise setting depends on the final frontend/API domain arrangement. A cross-site cookie setup may require SameSite=None; Secure and stronger CSRF defenses.

Cookie attributes reduce risk, but they do not replace server-side session expiry, revocation, or authorization. [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

### What about JWT?

A **JSON Web Token (JWT)** is a token format that can carry claims and be cryptographically signed. A signed JWT is not automatically encrypted; its contents may be readable by whoever has the token.

JWT-based systems can be useful when multiple services need to validate tokens, but they introduce decisions about expiry, refresh, revocation, key rotation, and safe browser storage.

Do not choose JWT merely because it is popular. For a first browser-based TaskFlow implementation, a server-side session is a reasonable starting design unless the architecture gives us a concrete reason to choose otherwise. The final implementation choice will be recorded in the blueprint.

**Important browser-storage rule:** Do not put session IDs, access tokens, refresh tokens, or other credentials in localStorage merely for convenience. JavaScript executing in the same origin can read browser storage, so an XSS vulnerability can steal those values. [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

## 5. Authorization: ownership and roles

TaskFlow's most important first authorization rule is ownership.

A request such as PATCH /api/tasks/123 must not update task 123 merely because the caller knows its ID. The backend should:
1. Validate the session and identify the signed-in user.
2. Load or update the task only when its owner matches that user.
3. Return only fields that the user is allowed to see.
4. Deny access when the permission rule is not satisfied.

Example SQL pattern from Lesson 1.5:

~~~sql
UPDATE tasks
SET status = 'completed'
WHERE id = $1
  AND user_id = $2;
~~~

The backend supplies $2 from the verified session context, not from an arbitrary owner ID sent by the browser.

If TaskFlow later needs roles such as user and admin, the backend can add role-based checks. A role is not a replacement for resource ownership: an ordinary user still cannot access another user's private record just because both users share the same general role.

Two practical authorization principles:
- **Least privilege:** Give each user, process, and service only the permissions it needs.
- **Deny by default:** If an action is not explicitly allowed, deny it.

Check permission on every request that accesses a protected resource. Do not rely on hidden buttons or frontend routes. [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

## 6. Common web security risks

You do not need to become a security specialist before building TaskFlow, but you must recognize these risks and the basic defenses.

| Risk | What it means | Project-level defense |
|---|---|---|
| SQL injection | Untrusted input changes the meaning of a database query | Parameterized SQL |
| XSS | Untrusted content runs as script in another user's browser | Context-aware output encoding; sanitize intentionally supported rich HTML |
| CSRF | A browser is tricked into sending an unwanted authenticated request | CSRF token or appropriate origin checks; SameSite as defense in depth |
| Broken access control | A user performs an action or sees data they are not allowed to access | Server-side authorization on every protected request |
| Brute-force / credential stuffing | Repeated password guesses or reused leaked credentials | Rate limits, monitoring, safe login behavior, MFA where appropriate |
| Secret exposure | A key, password, or token is disclosed | Secret storage, access control, redaction, rotation |

### XSS and React

React normally escapes text inserted through normal rendering. That reduces some XSS risks, but it does not make all content safe. Avoid injecting raw HTML into the page. If a feature genuinely needs user-authored HTML, use a maintained sanitizer and apply strict rules. Do not treat input validation as a replacement for output encoding. [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

### CSRF and cookies

Cookies are sent automatically by the browser according to their scope and policy. This behavior can be abused if a malicious site causes a browser to send an unwanted state-changing request.

Do not make GET requests change application data. Use appropriate CSRF protection for cookie-authenticated state-changing endpoints. SameSite helps, but should not automatically be treated as the only CSRF defense for every deployment. [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

### CORS is not authentication

Cross-Origin Resource Sharing (CORS) is a browser policy controlling whether frontend JavaScript from one origin can read a response from another origin.

CORS does not prove the caller's identity, and it does not stop a non-browser client from sending HTTP requests. Configure a narrow allowlist of the frontend origins that need access, but always authenticate and authorize requests on the backend.

## 7. Validate input at the server boundary

The browser can validate a form for a better user experience, but a user can bypass browser checks and send an HTTP request directly.

The backend should validate:
- Required fields and allowed fields.
- Data types and formats.
- Length and size limits.
- Allowed enum values, such as task status.
- Business rules, such as a due date being valid for the operation.

Avoid accepting arbitrary object properties and copying them directly into database updates. This is sometimes called **mass assignment**. Allow only fields that the endpoint is designed to change.

Database constraints provide another layer of protection, but they do not replace request validation. Validation should check both syntax (shape and type) and semantics (whether the values make sense). [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

## 8. Secrets and environment configuration

A **secret** is sensitive configuration such as:
- Database passwords and connection strings.
- Session-signing or encryption keys.
- Third-party API keys.
- Private service credentials.

Keep secrets out of source code, Git history, screenshots, logs, and browser-delivered JavaScript.

A local .env file is a convenient development mechanism, not a production secret manager. Add real environment files to .gitignore and provide a safe .env.example containing variable names and non-secret placeholders only.

Frontend environment variables that are intentionally exposed to the browser are public. A variable must never contain a database password or private server key merely because it has been placed in an environment file.

For deployment, use the hosting platform's protected environment configuration or an appropriate cloud secret manager. Give services access only to the secrets they need. If a secret is exposed, revoke or rotate it; deleting the visible line from the latest source file does not erase it from Git history or from systems that already copied it.

## 9. Production security basics for Express

When TaskFlow is eventually exposed to users:
- Serve public traffic over HTTPS/TLS.
- Use maintained, supported versions of Node.js, Express, and dependencies.
- Validate all incoming data on the backend.
- Configure secure cookies and session expiry.
- Apply rate limiting to sensitive endpoints such as login and password reset.
- Use security headers, commonly with Helmet, after reviewing the required policy.
- Keep stack traces and internal database errors out of public responses.
- Log security-relevant events without logging passwords, cookies, bearer tokens, or full secret-bearing request headers.
- Limit database and cloud permissions to what the service needs.

These are baseline practices, not a guarantee that an application is secure. Express maintains a production security guide covering TLS, untrusted input, secure cookies, dependency hygiene, and related controls. [Express production security best practices](https://expressjs.com/en/advanced/best-practice-security/)

## 10. Migrations: change the database in a controlled way

A **database migration** is a version-controlled change to the database schema or data. Examples:
- Create the tasks table.
- Add a priority column.
- Add an index for a query.
- Change a constraint.
- Transform existing records.

A safe migration workflow:

1. Create a new, ordered migration file.
2. Review what it changes and whether existing data is affected.
3. Apply it to a development database.
4. Test the application against the new schema.
5. Apply the same migration sequence in the target environment using the deployment process.
6. Verify the application and database after the change.

Do not casually edit a migration that has already been applied in a shared environment. Add a new migration so other environments can reach the same schema through the same history.

For a change that must work while old and new application versions overlap, use an **expand-and-contract** approach: add a compatible structure first, deploy code that can work with it, migrate data if required, and remove obsolete structure only after it is no longer used.

A migration is not a backup. For risky production changes, plan and verify an appropriate backup and recovery path.

## 11. Testing: what evidence do we need?

Testing is how we check whether the application behaves as intended.

| Test level | What it checks | TaskFlow example |
|---|---|---|
| Unit | A small function in isolation | Task validator rejects an empty title |
| Integration | Components working together | API creates a task in PostgreSQL |
| End-to-end (E2E) | A complete user workflow | Sign in, create a task, refresh, sign out |
| Manual exploratory | Human inspection of behavior | Confirm the error message is understandable |

A passing unit test does not prove the complete application works. Combine test levels.

For TaskFlow, security-focused tests should include:
- An unauthenticated request cannot create or read private tasks.
- User A cannot read, update, or delete User B's task.
- Invalid input is rejected by the backend.
- A session becomes invalid after logout or expiry.
- Repeated login attempts are controlled.
- The database constraints reject invalid values.
- A migration applies correctly to a fresh database and to a database at the previous expected version.

Type checking, linting, building, tests, and deployment verification are different checks. A successful build does not prove the application's business rules or authorization work.

The existing [migrations and testing reference](migrations-and-testing.md) contains illustrative npm commands for the future application. Those commands are not runnable in the current documentation-only repository.

## 12. TaskFlow security and quality decision checklist

Before implementing authentication and protected APIs, the design should answer:

- Which authentication mechanism will we use: a managed identity provider or our own server-side session flow?
- Where will session state live, and how will expiry and revocation work?
- Which cookie attributes match the actual frontend/API domains?
- How will CSRF protection work for cookie-authenticated state-changing endpoints?
- How will every task query enforce ownership?
- Which input schemas and database constraints enforce the application's rules?
- Where will production secrets live, and who can read them?
- Which unit, integration, and E2E tests prove the critical user and security flows?
- How will schema migrations be applied and verified?

These are design decisions to finalize in the implementation blueprint. This document describes the required principles, not a claim that any control has already been implemented.

## 13. Phase 1 final walkthrough

Explain the following lifecycle from beginning to end:

A user opens TaskFlow, signs in, creates a task, refreshes the browser, updates the task, and signs out.

Your explanation should connect all six lessons:

1. **Architecture:** Identify the browser, frontend, backend, API, and database.
2. **Frontend:** Explain what React displays and what information it sends to the backend.
3. **Backend:** Explain how Node.js and Express receive the request and run the relevant handler.
4. **HTTP:** Explain the request method, endpoint, headers, body, status code, and JSON response.
5. **Database:** Explain how PostgreSQL stores the task and connects it to the owner.
6. **Identity and security:** Explain how the server recognizes the user, checks authorization, protects secrets, and invalidates the session at sign-out.
7. **Quality:** Explain which tests would verify that the task persists after refresh and that another user cannot access it.

### Knowledge checkpoint — learner response pending

1. What is authentication, and how is it different from authorization?
2. Why does a server store a password hash instead of a plaintext password?
3. What happens between a successful login and the browser's next authenticated request?
4. What do HttpOnly, Secure, and SameSite do?
5. Is a signed JWT necessarily encrypted? Why does that distinction matter?
6. Why must the backend check ownership on every protected task operation?
7. Why is CORS not an authentication mechanism?
8. What is CSRF, and why are cookies relevant to it?
9. Why must real secrets stay out of Git and browser bundles?
10. What is a migration, and why should an applied migration normally be followed by a new migration instead of being rewritten?
11. What is the difference between a unit test, integration test, and E2E test?

**Completion rule:** Lesson 1.6 remains pending until we review your answers and the Phase 1 final walkthrough. Publishing this lesson completes the Phase 1 study-material set, not the learner checkpoints.

## Official references

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [Express production security best practices](https://expressjs.com/en/advanced/best-practice-security/)
