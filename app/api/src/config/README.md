# API Configuration (`app/api/src/config/`)

Manages and validates backend environment variables and application runtime settings.

---

## Implemented Validation (`config.ts`)

The configuration is parsed and strictly validated at server startup using **Zod**:

- **`PORT`**: Validated as an integer within valid TCP port bounds (`1` – `65535`). Defaults to `5000` if omitted or empty.
- **`NODE_ENV`**: Constrained to `"development" | "production" | "test"`. Defaults to `"development"`.
- **`FRONTEND_ORIGIN`**: Validated as a valid HTTP/HTTPS origin (`scheme://host[:port]`) without paths, query strings, or hash fragments. Defaults to `"http://localhost:5173"`.

If any variable fails validation, the process logs the exact validation error and exits immediately (`process.exit(1)`), preventing the server from running with invalid or insecure settings.

---

## Template

See [`app/api/.env.example`](../.env.example) for the development template. Real secrets must never be committed to Git.
