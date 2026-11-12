import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

/**
 * Validates that a string represents a clean origin: scheme://host[:port]
 * without trailing path, query parameters, or fragment.
 */
function isValidOrigin(val: string): boolean {
  try {
    const url = new URL(val);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }
    // Disallow path beyond optional root slash, query params, and hash fragments
    if (url.pathname !== "" && url.pathname !== "/") {
      return false;
    }
    if (url.search !== "" || url.hash !== "") {
      return false;
    }
    return url.origin === val || `${url.origin}/` === val;
  } catch {
    return false;
  }
}

export const envSchema = z.object({
  PORT: z
    .preprocess(
      (val) => (val === undefined || val === "" ? 5000 : val),
      z.coerce
        .number({ invalid_type_error: "PORT must be a number" })
        .int({ message: "PORT must be an integer" })
        .min(1, { message: "PORT must be between 1 and 65535" })
        .max(65535, { message: "PORT must be between 1 and 65535" })
    )
    .default(5000),

  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  FRONTEND_ORIGIN: z
    .preprocess(
      (val) => (val === undefined || val === "" ? "http://localhost:5173" : val),
      z
        .string()
        .refine(isValidOrigin, {
          message:
            "FRONTEND_ORIGIN must be a valid origin (e.g. http://localhost:5173 or https://app.example.com) without paths, query strings, or fragments",
        })
        .transform((val) => new URL(val).origin)
    )
    .default("http://localhost:5173"),
});

export type Config = z.infer<typeof envSchema>;

export function validateConfig(rawEnv: Record<string, unknown>): Config {
  const parsed = envSchema.safeParse(rawEnv);
  if (!parsed.success) {
    console.error("Invalid environment configuration:", parsed.error.format());
    process.exit(1);
  }
  return parsed.data;
}

export const config = validateConfig(process.env);
