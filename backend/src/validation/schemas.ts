import { Buffer } from "node:buffer";
import { z } from "zod";

const passwordSchema = z.string()
  .min(12, "Password must contain at least 12 characters.")
  .refine(
    (password) => Buffer.byteLength(password, "utf8") <= 72,
    "Password must not exceed 72 UTF-8 bytes."
  );

export const registerSchema = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: passwordSchema,
  fullName: z.string().trim().max(80).transform((name) => name || undefined).optional()
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: passwordSchema
});

const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 0));
    return date.getUTCFullYear() === year
      && date.getUTCMonth() === (month ?? 1) - 1
      && date.getUTCDate() === day;
  }, "Enter a valid calendar date.");

export const taskIdSchema = z.string().uuid();

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120),
  description: z.string().trim().max(2_000).nullable().optional(),
  status: z.enum(["todo", "in_progress", "completed"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: dateOnlySchema.nullable().optional()
});

export const taskUpdateSchema = taskCreateSchema.partial()
  .refine((value) => Object.keys(value).length > 0, "Provide at least one field to update.");

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
