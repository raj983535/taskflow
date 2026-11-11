import { Router, Request, Response } from "express";

export const healthRouter = Router();

// Liveness probe: returns 200 as long as the Node process is running.
healthRouter.get("/live", (_req: Request, res: Response) => {
  res.status(200).json({ status: "alive" });
});

// Readiness probe: verifies system readiness (will check DB once added in Stage 2).
healthRouter.get("/ready", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ready", timestamp: new Date().toISOString() });
});
