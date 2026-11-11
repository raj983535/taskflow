import { useState, useEffect } from "react";

interface HealthStatus {
  status: string;
  checkedAt: string;
}

export function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/health/live");
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      const data = await response.json();
      setHealth({
        status: data.status,
        checkedAt: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to API");
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <>
      <header>
        <div className="brand">TaskFlow</div>
        <div className="nav-info">Stage 1 — Foundation</div>
      </header>

      <main>
        <section className="card">
          <h2>Application Foundation Status</h2>
          <p style={{ marginTop: "0.5rem", color: "var(--text-muted)" }}>
            TaskFlow frontend (<code>@taskflow/web</code>) is running and testing communication with the Express backend (<code>@taskflow/api</code>).
          </p>

          <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            {loading && <span style={{ color: "var(--text-muted)" }}>Connecting to API...</span>}

            {!loading && health && (
              <span className="status-badge status-online">
                <span className="indicator" />
                API Status: {health.status.toUpperCase()} (checked {health.checkedAt})
              </span>
            )}

            {!loading && error && (
              <span className="status-badge status-offline">
                <span className="indicator" />
                API Offline ({error})
              </span>
            )}

            <button onClick={checkHealth} disabled={loading} style={{ marginLeft: "auto" }}>
              {loading ? "Checking..." : "Re-check Health"}
            </button>
          </div>
        </section>

        <section className="card">
          <h3>Architectural Slices Overview</h3>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", lineHeight: "1.8" }}>
            <li>
              <strong>Stage 1 (Current):</strong> Monorepo scaffold under <code>app/</code>, TypeScript build system, environment variables, health endpoints.
            </li>
            <li style={{ color: "var(--text-muted)" }}>
              <strong>Stage 2 (Next):</strong> PostgreSQL connection pool, schema design, and version-controlled migrations under <code>database/</code>.
            </li>
            <li style={{ color: "var(--text-muted)" }}>
              <strong>Stage 3:</strong> Task CRUD endpoints, Zod schema validation, server-side session authentication.
            </li>
            <li style={{ color: "var(--text-muted)" }}>
              <strong>Stage 4:</strong> Interactive React Kanban board (Todo, In Progress, Completed).
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
