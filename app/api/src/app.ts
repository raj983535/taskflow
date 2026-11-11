import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "./config/config.js";
import { healthRouter } from "./modules/health/health.routes.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Mount Health Check Probes
app.use("/health", healthRouter);

// Root welcome endpoint
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    name: "TaskFlow API",
    status: "online",
    docs: "/health/live",
  });
});

// 404 Catch-all Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found." });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled API error:", err);
  res.status(500).json({
    message: config.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});
