import pg from "pg";
import { config } from "../config.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000
});

pool.on("error", (error: Error) => {
  console.error(JSON.stringify({
    level: "error",
    message: "Unexpected error from an idle PostgreSQL client",
    error: error.message
  }));
});
