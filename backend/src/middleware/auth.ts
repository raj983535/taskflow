import { createHash } from "node:crypto";
import type { RequestHandler } from "express";
import { config } from "../config.js";
import { pool } from "../db/pool.js";

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export const attachAuthUser: RequestHandler = async (req, _res, next) => {
  const token: unknown = req.cookies?.[config.cookieName];

  if (typeof token !== "string" || token.length === 0) {
    next();
    return;
  }

  const result = await pool.query<{
    id: string;
    email: string;
    full_name: string | null;
  }>(
    `SELECT users.id, users.email, users.full_name
     FROM sessions
     INNER JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = $1 AND sessions.expires_at > NOW()`,
    [hashSessionToken(token)]
  );

  const user = result.rows[0];
  if (user) {
    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.full_name
    };
  }

  next();
};

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "You must sign in to access this resource." });
    return;
  }

  next();
};

export function getSessionTokenHash(token: string): string {
  return hashSessionToken(token);
}
