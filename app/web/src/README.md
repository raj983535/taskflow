# Frontend Source (`app/web/src/`)

Contains the implemented TypeScript and React 19 source code for the browser web client.

---

## Structure and Responsibilities

- **`main.tsx`**: Browser entry point that mounts the application into `#root` with React StrictMode and defensive DOM checks.
- **`app/`**: Contains `App.tsx`, providing the application foundation layout, health check indicator, and roadmap summary.
- **`styles/`**: Global stylesheet (`index.css`) containing CSS custom properties, responsive card layouts, and accessible button/focus styles.
- **`components/`**: Reserved for shared visual components (buttons, modals, form inputs).
- **`features/`**: Reserved for domain features, starting with `tasks/` (Kanban board) in Stage 4.
- **`hooks/`**: Reserved for custom React state/lifecycle hooks.
- **`services/`**: Reserved for HTTP API client wrappers and fetch handlers.
- **`types/`**: Frontend TypeScript interface definitions.
