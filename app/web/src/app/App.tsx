import { useState, useEffect, useCallback } from "react";

interface HealthState {
  status: string;
  observedAt: string;
}

export function App() {
  const [health, setHealth] = useState<HealthState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/health/live", { signal });
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      const data: unknown = await response.json();

      if (
        typeof data === "object" &&
        data !== null &&
        "status" in data &&
        typeof (data as { status: unknown }).status === "string"
      ) {
        setHealth({
          status: (data as { status: string }).status,
          observedAt: new Date().toLocaleTimeString(),
        });
      } else {
        throw new Error("Invalid response format received from health endpoint");
      }
    } catch (err) {
      if (signal?.aborted) {
        return;
      }
      const message = err instanceof Error ? err.message : "Failed to connect to API";
      setError(message);
      setHealth(null);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    checkHealth(controller.signal);

    return () => {
      controller.abort();
    };
  }, [checkHealth]);

  return (
    <>
      <header>
        <div className="brand">TaskFlow</div>
        <div className="nav-info">Stage 1 — Application Foundation</div>
      </header>

      <main>
        <section className="card" aria-labelledby="foundation-heading">
          <h2 id="foundation-heading" className="card-title">
            Application Foundation Status
          </h2>
          <p className="card-subtitle">
            TaskFlow browser client (<code>@taskflow/web</code>) is running and communicating with the
            Node.js Express backend (<code>@taskflow/api</code>) via local development proxy.
          </p>

          <div
            className="status-container"
            aria-live="polite"
            aria-atomic="true"
            role="status"
          >
            {loading && <span className="card-subtitle">Connecting to API...</span>}

            {!loading && health && (
              <span className="status-badge status-online">
                <span className="indicator" aria-hidden="true" />
                <span>
                  API Status: <strong>{health.status.toUpperCase()}</strong> (Browser observed at:{" "}
                  {health.observedAt})
                </span>
              </span>
            )}

            {!loading && error && (
              <span className="status-badge status-offline">
                <span className="indicator" aria-hidden="true" />
                <span>API Offline ({error})</span>
              </span>
            )}

            <button
              type="button"
              className="btn-recheck"
              onClick={() => checkHealth()}
              disabled={loading}
              aria-label="Re-check backend API liveness health status"
            >
              {loading ? "Checking..." : "Re-check Health"}
            </button>
          </div>
        </section>

        <section className="card" aria-labelledby="roadmap-heading">
          <h3 id="roadmap-heading" className="card-title">
            Architectural Roadmap
          </h3>
          <ul className="card-list">
            <li>
              <strong>Stage 1 (Current):</strong> Monorepo foundation under <code>app/</code>,
              TypeScript build system, environment validation, health endpoints, graceful shutdown.
            </li>
            <li className="pending">
              <strong>Stage 2 (Next):</strong> PostgreSQL connection pool, schema design, and
              version-controlled migrations under <code>database/</code>.
            </li>
            <li className="pending">
              <strong>Stage 3:</strong> Task CRUD endpoints, Zod validation, server-side session
              authentication.
            </li>
            <li className="pending">
              <strong>Stage 4:</strong> Interactive React Kanban board (Todo, In Progress,
              Completed).
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
