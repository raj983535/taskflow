# Authentication, Authorization, and Application Security

**Status:** Conceptual learning notes and proposed design principles. No authentication system has been implemented in this repository.

## 1. Authentication versus authorization

These two ideas are related, but not interchangeable.

- **Authentication:** Who is making this request?
- **Authorization:** What is this authenticated person allowed to do?

Example: signing in proves which account is making a request. Checking that the account owns a particular task is an authorization decision.

Both checks must happen on the server. Hiding a button in the frontend does not protect an API or a database record.

## 2. Password storage

A system should never store users' plaintext passwords.

A password-hashing function is designed to make guessing expensive. A unique random salt is used so identical passwords do not result in identical stored hashes. For a new system, current OWASP guidance prefers Argon2id. Scrypt is another option; bcrypt is more commonly encountered in legacy systems. Use a maintained library with suitable parameters and unique salts. The exact library and configuration should be selected and benchmarked using current security guidance when implementation begins.

Do not confuse:
- **Password hashing:** deliberately expensive because passwords are human-chosen and may be guessable.
- **General-purpose hashing:** fast algorithms such as SHA-256, which are not suitable by themselves for storing passwords.

The server verifies a submitted password by running the password-hashing verification procedure against the stored hash. It does not decrypt a password.

## 3. Sessions and tokens

After a successful login, the application needs a way to recognize later requests.

One common approach is a server-side session:
1. The server creates a cryptographically random session identifier.
2. The browser stores it in a cookie.
3. The browser sends the cookie on later requests according to its cookie rules.
4. The server checks the session and determines the associated user.
5. Logout or expiry makes the session invalid.

A different approach uses signed tokens, such as JWTs. These approaches have different trade-offs around revocation, state, storage, and operational complexity. Neither should be selected just because it is fashionable.

## 4. Cookie concepts

Important cookie attributes include:

- `HttpOnly`: prevents ordinary frontend JavaScript from reading the cookie.
- `Secure`: restricts sending the cookie to secure connections.
- `SameSite`: controls some cross-site cookie sending behavior.
- `Path` and `Domain`: define where the cookie is sent.
- `Max-Age` or `Expires`: control cookie lifetime.

Cookie settings must be chosen for the actual frontend/API origin design. Cookie flags alone do not solve every cross-site request forgery (CSRF) risk.

## 5. CORS is not authentication

Cross-Origin Resource Sharing (CORS) is a browser-enforced mechanism controlling whether frontend JavaScript from one origin can read responses from another origin.

CORS does not prove who the caller is. Non-browser clients are not constrained by browser CORS enforcement. The backend must still authenticate requests and authorize access to each resource.

## 6. Other security concepts to understand

- **Input validation:** check that incoming values have the expected type, format, and allowed range.
- **SQL injection:** an attack in which untrusted input changes the meaning of a database query; parameterized queries help prevent it.
- **CSRF:** tricks a browser into sending an unwanted authenticated request.
- **XSS:** injection of script content that runs in another user's browser.
- **Rate limiting:** restricts how frequently a client can make certain requests.
- **Least privilege:** give each user, process, and service only the permissions it needs.
- **Secret management:** keep passwords, API keys, and private credentials out of source code and browser bundles.
- **TLS/HTTPS:** protects data in transit between communicating endpoints.

## 7. A proposed TaskFlow security boundary

The browser is not trusted to decide ownership. The backend should:
1. Validate the request.
2. Establish the caller's identity.
3. Check whether the caller may perform the requested operation.
4. Use parameterized database operations.
5. Return only data the caller is allowed to see.
6. Avoid exposing internal error details or secrets.

## 8. Questions to review

- Why is a password hash not the same as encryption?
- Why should a password be processed differently from a random session token?
- What is the difference between a session and a JWT?
- Why does CORS not replace authentication?
- Why must ownership be checked by the backend?
- What risks do XSS and CSRF describe?
- Why should a frontend bundle never contain a database password?
