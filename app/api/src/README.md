# Backend API Source (`app/api/src/`)

Contains the implemented TypeScript source code for the Express API service.

---

## Structure and Responsibilities

- **`config/`**: Validated runtime configuration (`config.ts`) using Zod. Validates `PORT` bounds (1–65535) and `FRONTEND_ORIGIN` scheme and format.
- **`modules/`**: Feature-oriented route modules. Currently implements `health/` (`/health/live`, `/health/ready`).
- **`app.ts`**: Configures the Express middleware pipeline, security headers (Helmet), CORS, JSON parser, and centralized error handler.
- **`server.ts`**: HTTP listener startup and graceful shutdown handler (`SIGINT`, `SIGTERM`) with fallback timeout.
- **`middleware/`**: Reserved for custom authentication and logging middlewares (Stage 3).
- **`db/`**: Reserved for PostgreSQL connection pool and query helpers (Stage 2).
- **`shared/`**: Reserved for API-internal utility functions.
