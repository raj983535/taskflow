# Application Source Area (`app/`)

This directory contains the TaskFlow application code organized into modular workspaces under npm.

---

## Workspaces

- **[api/](api/README.md)** — Node.js + Express + TypeScript backend HTTP API service. Exposes health probes, security middleware, and configuration validation.
- **[web/](web/README.md)** — React 19 + TypeScript + Vite browser frontend client. Handles user interaction, responsive presentation, and API communication.
- **[shared/](shared/README.md)** — Reserved for contracts and TypeScript types genuinely shared between `web` and `api` once approved.

---

## Development Commands

All commands run from repository root (`E:\Taskflow`):

```powershell
# Install dependencies across workspaces
npm install

# Run backend API in watch mode (Port 5000)
npm run dev:api

# Run frontend web dev server (Port 5173)
npm run dev:web

# Run TypeScript typechecks across both workspaces
npm run typecheck

# Run backend test suite (18 automated tests)
npm test
```

For full implementation details, see [Stage 1 Architecture Guide](../docs/implementation/architecture/01-workspace-and-application-foundation.md).
