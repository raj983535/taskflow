import { randomBytes, randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { config } from "../config.js";
import { pool } from "../db/pool.js";
import { getSessionTokenHash } from "../middleware/auth.js";
import { AppError } from "../middleware/error-handler.js";
import { loginSchema, registerSchema } from "../validation/schemas.js";

const router = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again later." }
});

type PublicUser = {
  id: string;
  email: string;
  fullName: string | null;
};

function setSessionCookie(res: Response, token: string): void {
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    path: "/",
    maxAge: config.sessionLifetimeMs
  });
}

function clearSessionCookie(res: Response): void {
  res.clearCookie(config.cookieName, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    path: "/"
  });
}

async function createSession(userId: string, res: Response): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = getSessionTokenHash(token);
  const expiresAt = new Date(Date.now() + config.sessionLifetimeMs);

  await pool.query("DELETE FROM sessions WHERE expires_at <= NOW()");
  await pool.query(
    "INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)",
    [randomUUID(), userId, tokenHash, expiresAt]
  );

  setSessionCookie(res, token);
}

function validationDetails(error: { issues: Array<{ path: PropertyKey[]; message: string }> }) {
  return error.issues.map((issue) => ({
    field: issue.path.map(String).join("."),
    message: issue.message
  }));
}

router.post("/register", authLimiter, async (req: Request, res: Response): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Please correct the registration details.", validationDetails(parsed.error));
  }

  const { email, password, fullName } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);
  const userId = randomUUID();

  const result = await pool.query<{
    id: string;
    email: string;
    full_name: string | null;
  }>(
    `INSERT INTO users (id, email, full_name, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name`,
    [userId, email, fullName ?? null, passwordHash]
  );

  const row = result.rows[0];
  if (!row) {
    throw new AppError(500, "Unable to create your account.");
  }

  await createSession(row.id, res);
  const user: PublicUser = { id: row.id, email: row.email, fullName: row.full_name };
  res.status(201).json({ user });
});

router.post("/login", authLimiter, async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Please enter a valid email and password.", validationDetails(parsed.error));
  }

  const result = await pool.query<{
    id: string;
    email: string;
    full_name: string | null;
    password_hash: string;
  }>(
    "SELECT id, email, full_name, password_hash FROM users WHERE email = $1",
    [parsed.data.email]
  );

  const row = result.rows[0];
  const passwordMatches = row
    ? await bcrypt.compare(parsed.data.password, row.password_hash)
    : false;

  if (!row || !passwordMatches) {
    throw new AppError(401, "Email or password is incorrect.");
  }

  await createSession(row.id, res);
  const user: PublicUser = { id: row.id, email: row.email, fullName: row.full_name };
  res.status(200).json({ user });
});

router.get("/me", (req: Request, res: Response): void => {
  res.status(200).json({ user: req.user ?? null });
});

router.post("/logout", async (req: Request, res: Response): Promise<void> => {
  const token: unknown = req.cookies?.[config.cookieName];

  if (typeof token === "string" && token.length > 0) {
    await pool.query("DELETE FROM sessions WHERE token_hash = $1", [getSessionTokenHash(token)]);
  }

  clearSessionCookie(res);
  res.status(200).json({ success: true });
});

export default router;
