# TaskFlow Web

React + TypeScript frontend built with Vite.

## Local development

Run from the repository root:

```powershell
npm install
npm run dev:web
```

Open `http://127.0.0.1:5173`.

The Vite development server proxies `/api` and `/health` to the Express API at `http://127.0.0.1:5000`.

## Important

The browser is an untrusted client. Frontend validation improves user experience, but authentication, authorization, and authoritative validation happen in the API.

Variables prefixed with `VITE_` are public and bundled into browser code. Never put database credentials or private API keys in frontend environment files.
