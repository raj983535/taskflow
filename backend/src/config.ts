import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(5000),
  FRONTEND_ORIGIN: z.string().url().default("http://127.0.0.1:5173"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required")
});

const parsed = environmentSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.issues);
  throw new Error("TaskFlow API environment configuration is invalid.");
}

export const config = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  frontendOrigin: parsed.data.FRONTEND_ORIGIN,
  databaseUrl: parsed.data.DATABASE_URL,
  cookieName: "taskflow_session",
  sessionLifetimeMs: 7 * 24 * 60 * 60 * 1000
} as const;
