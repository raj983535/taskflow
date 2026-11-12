import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { Server } from "node:http";
import { app } from "../../app.js";

interface RootResponse {
  name: string;
  status: string;
  endpoints: {
    healthLive: string;
    healthReady: string;
  };
}

interface LiveResponse {
  status: string;
}

interface ReadyResponse {
  status: string;
  stage: string;
  timestamp: string;
}

interface ErrorResponse {
  message: string;
}

describe("API Health and Route Endpoints", () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    await new Promise<void>((resolve) => {
      // Ephemeral port 0 prevents port collisions in tests
      server = app.listen(0, () => {
        const address = server.address();
        if (address && typeof address === "object") {
          baseUrl = `http://localhost:${address.port}`;
        }
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  test("GET / returns 200 with online status and endpoint directory", async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    const data = (await res.json()) as RootResponse;
    assert.equal(data.name, "TaskFlow API");
    assert.equal(data.status, "online");
    assert.equal(typeof data.endpoints, "object");
    assert.equal(data.endpoints.healthLive, "/health/live");
    assert.equal(data.endpoints.healthReady, "/health/ready");
  });

  test("GET /health/live returns 200 with status alive", async () => {
    const res = await fetch(`${baseUrl}/health/live`);
    assert.equal(res.status, 200);
    const data = (await res.json()) as LiveResponse;
    assert.equal(data.status, "alive");
  });

  test("GET /health/ready returns 200 with process readiness", async () => {
    const res = await fetch(`${baseUrl}/health/ready`);
    assert.equal(res.status, 200);
    const data = (await res.json()) as ReadyResponse;
    assert.equal(data.status, "ready");
    assert.equal(data.stage, "stage-1-process-only");
    assert.ok(data.timestamp);
  });

  test("GET /non-existent-route returns 404 with structured JSON", async () => {
    const res = await fetch(`${baseUrl}/non-existent-route`);
    assert.equal(res.status, 404);
    const data = (await res.json()) as ErrorResponse;
    assert.equal(data.message, "Route not found.");
  });

  test("Security headers are present in responses", async () => {
    const res = await fetch(`${baseUrl}/health/live`);
    // Helmet disables X-Powered-By and adds security headers
    assert.equal(res.headers.get("x-powered-by"), null);
    assert.ok(res.headers.get("x-content-type-options"));
  });
});
