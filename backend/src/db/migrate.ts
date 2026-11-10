import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pool } from "./pool.js";

async function runMigrations(): Promise<void> {
  // npm runs workspace scripts with the workspace directory as process.cwd().
  // Using cwd also works after TypeScript has been compiled into backend/dist.
  const migrationsDirectory = resolve(process.cwd(), "migrations");
  const migrationFiles = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    for (const file of migrationFiles) {
      const alreadyApplied = await client.query<{ name: string }>(
        "SELECT name FROM schema_migrations WHERE name = $1",
        [file]
      );

      if (alreadyApplied.rowCount && alreadyApplied.rowCount > 0) {
        console.info(`Skipping already applied migration: ${file}`);
        continue;
      }

      const sql = await readFile(resolve(migrationsDirectory, file), "utf8");

      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
        await client.query("COMMIT");
        console.info(`Applied migration: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(async (error: unknown) => {
  console.error("Database migration failed:", error);
  await pool.end();
  process.exitCode = 1;
});
