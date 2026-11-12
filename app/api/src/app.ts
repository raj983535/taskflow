import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "./config/config.js";
import { healthRouter } from "./modules/health/health.routes.js";

export const app = express();

// Security baseline: disable X-Powered-By and apply Helmet headers
app.disable("x-powered-by");
app.use(helmet());

// Cross-Origin Resource Sharing: strictly restricted to validated frontend origin
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

// Body parsing with safe size limit
app.use(express.json({ limit: "1mb" }));

// Foundation cookie parser: established now to support incoming Stage 3 session authentication
app.use(cookieParser());

// Mount Health Check Probes
app.use("/health", healthRouter);

// Root informational endpoint describing available Stage 1 endpoints
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    name: "TaskFlow API",
    status: "online",
    endpoints: {
      healthLive: "/health/live",
      healthReady: "/health/ready",
    },
  });
});

// 404 Catch-all Handler for unknown routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found." });
});

// Centralized Error Handling Middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled API error:", err);
  res.status(500).json({
    message: config.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});
