import { Router, Request, Response } from "express";

export const healthRouter = Router();

/**
 * GET /health/live
 * Liveness probe: Confirms that the Node.js process and HTTP listener are running.
 * Kept strictly independent of external dependencies and sessions.
 */
healthRouter.get("/live", (_req: Request, res: Response) => {
  res.status(200).json({ status: "alive" });
});

/**
 * GET /health/ready
 * Process-level readiness probe for Stage 1.
 * NOTE: At Stage 1, this confirms that the Express application is initialized
 * and able to process HTTP traffic. Full dependency readiness (checking the
 * PostgreSQL connection pool) will be integrated in Stage 2.
 */
healthRouter.get("/ready", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ready",
    stage: "stage-1-process-only",
    timestamp: new Date().toISOString(),
  });
});
