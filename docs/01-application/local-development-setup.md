# Run TaskFlow Locally on Windows 11

This guide assumes PowerShell and VS Code. It runs the application directly on Windows and a locally installed PostgreSQL service. It does not use Docker.

## 1. Required software

| Software | Requirement | Why we need it |
|---|---|---|
| Git | Installed and available in PowerShell | Pull source code |
| Node.js | 22.12+ minimum; Node 26.13.0 LTS recommended | Run JavaScript/TypeScript tools |
| npm | Included with Node.js | Install workspace dependencies |
| PostgreSQL | 16 or later | Run the relational database |
| VS Code | Recommended | Edit code and Markdown |

Node 22.16.0 meets the repository's minimum engine constraint and the Vite 8 minimum of Node 22.12.0, but updating to the Node version recorded in `.node-version` is recommended.

Official references:
- [Node.js downloads](https://nodejs.org/en/download/)
- [Node.js release schedule](https://nodejs.org/en/about/previous-releases)
- [PostgreSQL downloads for Windows](https://www.postgresql.org/download/windows/)
- [Vite getting started](https://vite.dev/guide/)

## 2. Confirm local versions

Open PowerShell:

```powershell
node --version
npm --version
git --version
```

The Node version must be at least 22.12.0. The repository records 26.13.0 in `.node-version`.

## 3. Pull the project

If you already cloned the repository:

```powershell
cd E:\taskflow
git pull origin main
```

If you have not cloned it yet:

```powershell
cd E:\
git clone https://github.com/raj983535/taskflow.git
cd taskflow
```

## 4. Install PostgreSQL

Use the official Windows installer and install PostgreSQL 16 or later. During setup, remember the password you assign to the local `postgres` administrator account. Keep PostgreSQL listening on the local machine for this learning project.

Check the service from PowerShell:

```powershell
Get-Service *postgres*
```

If the service is stopped, start the actual PostgreSQL service name shown by the previous command using an elevated PowerShell window:

```powershell
Start-Service -Name "<service-name-from-the-list>"
```

## 5. Create a database and application role

Open SQL Shell (psql) from the PostgreSQL Start Menu group, or run psql if it is on your PATH:

```powershell
psql -U postgres -h 127.0.0.1 -p 5432
```

At the psql prompt, create a dedicated local role and database. Replace the example password with a new local-only password:

```sql
CREATE ROLE taskflow WITH LOGIN PASSWORD 'replace-with-a-local-password';
CREATE DATABASE taskflow OWNER taskflow;
\q
```

Do not reuse your email, banking, or production password. Do not put the password into a Git-tracked file.

If the role or database already exists, do not blindly rerun the creation statements. Inspect the existing local database first.

## 6. Configure the backend environment

From the repository root:

```powershell
Copy-Item backend/.env.example backend/.env
notepad backend/.env
```

Set `DATABASE_URL` to use the password you chose:

```dotenv
NODE_ENV=development
PORT=5000
FRONTEND_ORIGIN=http://127.0.0.1:5173
DATABASE_URL=postgresql://taskflow:YOUR_LOCAL_PASSWORD@127.0.0.1:5432/taskflow
```

Replace `YOUR_LOCAL_PASSWORD`. If your password contains URL-reserved characters such as `@`, `:`, `/`, or `#`, percent-encode those characters in the connection URL.

The file `backend/.env` is ignored by Git. Never commit it. The example file is safe to commit because it contains only a placeholder.

## 7. Install JavaScript dependencies

Run this from the repository root:

```powershell
npm install
```

The root package uses npm workspaces, so this installs dependencies for both the frontend and backend. It also creates `package-lock.json`. Commit that lockfile after a successful, reviewed install so future installations use the same dependency resolution.

## 8. Apply the database migration

```powershell
npm run db:migrate
```

Expected result on the first run:

```text
Applied migration: 001_initial_schema.sql
```

Run it again to confirm that the migration is skipped rather than applied a second time.

## 9. Start frontend and backend

```powershell
npm run dev
```

This runs two processes:
- Express API at `http://127.0.0.1:5000`
- Vite frontend at `http://127.0.0.1:5173`

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).

If you prefer separate terminals:

Terminal 1:
```powershell
npm run dev:api
```

Terminal 2:
```powershell
npm run dev:web
```

## 10. Verify API health

In another PowerShell window:

```powershell
curl.exe -i http://127.0.0.1:5000/health/live
curl.exe -i http://127.0.0.1:5000/health/ready
```

Expected:
- Liveness returns HTTP 200 and `{"status":"alive"}`.
- Readiness returns HTTP 200 and `{"status":"ready","database":"connected"}` when PostgreSQL is reachable.

## 11. Verify the application manually

1. Open TaskFlow in the browser.
2. Create an account with an email you control and a local learning password of at least 12 characters.
3. Add a task with a title, description, priority, and due date.
4. Change its status.
5. Edit its title or description.
6. Filter by To do, In progress, and Done.
7. Delete a task.
8. Sign out and sign back in.
9. Create a second account in a private/incognito session and verify it cannot see the first user's tasks.

Use two different browser profiles or an incognito window for the second account so cookies are not shared.

## 12. Run automated checks

From the repository root:

```powershell
npm run typecheck
npm test
npm run build
```

All three should complete without errors before you treat the local implementation as verified.

## 13. Stop the development processes

Press `Ctrl+C` in the terminal running `npm run dev`. PostgreSQL can remain installed as a Windows service; it does not need Docker.

## 14. What to send back for review

Share:
- The output of `node --version` and `npm --version`.
- The output of `npm run db:migrate`.
- The output of `npm run typecheck`, `npm test`, and `npm run build`.
- A screenshot of the dashboard with sample tasks (hide email addresses if you prefer).

Do not share `backend/.env`, the database password, cookies, session values, or authorization headers.
