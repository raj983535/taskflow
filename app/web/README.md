# Web Frontend (`app/web/`)

The TaskFlow browser client implemented with React 19, TypeScript, and Vite.

---

## Directory Structure

```text
web/
├── package.json             # Workspace package manifest (@taskflow/web)
├── tsconfig.json            # Bundler TypeScript configuration
├── vite.config.ts           # Vite bundler and development proxy config
├── index.html               # Single-page HTML entry point
├── public/                  # Static assets
├── src/
│   ├── app/                 # Application component (App.tsx)
│   ├── styles/              # Design tokens and responsive CSS (index.css)
│   ├── components/          # Planned reusable UI components
│   ├── features/            # Planned feature modules (tasks Kanban)
│   ├── hooks/               # Planned reusable React hooks
│   ├── services/            # Planned HTTP API clients
│   ├── types/               # Frontend TypeScript interfaces
│   └── main.tsx             # DOM mounting entry point with StrictMode
└── tests/                   # Frontend test suites
```

---

## Implemented Behavior (Stage 1)

- **Application Mounting:** Mounts `App.tsx` into `#root` with a defensive error check if the DOM root element is missing.
- **Connection Check:** Sends an initial request to `/health/live` on load and allows manual re-checking via button.
- **Proxy Routing:** Requests to `/health` and `/api` during development are proxied to `http://localhost:5000` by Vite.
- **Accessibility & UX:** Includes `aria-live="polite"` dynamic live regions, keyboard `:focus-visible` outlines, and `@media (prefers-reduced-motion)` adaptations.

---

## Running and Building

```powershell
# Run from repository root
npm run dev:web       # Start Vite dev server on port 5173
npm run build:web     # Typecheck and bundle static assets to dist/
npm run preview       # Preview production bundle locally
```
