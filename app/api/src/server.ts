import { app } from "./app.js";
import { config } from "./config/config.js";

const server = app.listen(config.PORT, () => {
  console.log(`TaskFlow API listening on port ${config.PORT} [${config.NODE_ENV}]`);
});

let isShuttingDown = false;

export const shutdown = (signal: string) => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;
  console.log(`Received ${signal}. Gracefully shutting down...`);

  // Fallback deadline: force process termination if connections do not close within 10s
  const forceExitTimer = setTimeout(() => {
    console.error("Forced shutdown deadline exceeded. Exiting process.");
    process.exit(1);
  }, 10000);
  forceExitTimer.unref();

  server.close((err) => {
    if (err) {
      console.error("Error encountered while closing HTTP server:", err);
      process.exit(1);
    }
    console.log("HTTP server closed cleanly.");
    // Extension point for Stage 2: close PostgreSQL connection pool here
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
