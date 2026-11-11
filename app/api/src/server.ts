import { app } from "./app.js";
import { config } from "./config/config.js";

const server = app.listen(config.PORT, () => {
  console.log(`TaskFlow API listening on port ${config.PORT} [${config.NODE_ENV}]`);
});

const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Gracefully shutting down...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
