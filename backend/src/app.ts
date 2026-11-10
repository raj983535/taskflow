import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "./config.js";
import { pool } from "./db/pool.js";
import { attachAuthUser } from "./middleware/auth.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: config.frontendOrigin,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use((req, res, next) => {
  const origin = req.get("Origin");
  if (origin && origin !== config.frontendOrigin) {
    res.status(403).json({ message: "This origin is not allowed to access the TaskFlow API." });
    return;
  }
  next();
});
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Liveness must not depend on database availability or a browser session.
app.get("/health/live", (_req, res) => {
  res.status(200).json({ status: "alive" });
});

app.get("/health/ready", async (_req, res) => {
  await pool.query("SELECT 1");
  res.status(200).json({ status: "ready", database: "connected" });
});

// Load the caller once for /api/auth/me and protected task routes.
app.use(attachAuthUser);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use(errorHandler);
