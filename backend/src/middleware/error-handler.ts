import type { ErrorRequestHandler } from "express";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      ...(error.details === undefined ? {} : { details: error.details })
    });
    return;
  }

  const frameworkError = error as { type?: string; status?: number; statusCode?: number; code?: string };
  if (frameworkError.type === "entity.parse.failed" || frameworkError.status === 400) {
    res.status(400).json({ message: "Request body contains invalid JSON or malformed input." });
    return;
  }
  if (frameworkError.type === "entity.too.large" || frameworkError.status === 413 || frameworkError.statusCode === 413) {
    res.status(413).json({ message: "Request body is too large." });
    return;
  }

  if (frameworkError.code === "23505") {
    res.status(409).json({ message: "A record with that value already exists." });
    return;
  }

  console.error(JSON.stringify({
    level: "error",
    message: "Unhandled API error",
    error: error instanceof Error ? error.message : "Unknown error"
  }));

  res.status(500).json({ message: "An unexpected server error occurred." });
};
