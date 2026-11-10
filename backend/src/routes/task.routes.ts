import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { AppError } from "../middleware/error-handler.js";
import { taskCreateSchema, taskIdSchema, taskUpdateSchema } from "../validation/schemas.js";

const router = Router();

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function validationDetails(error: { issues: Array<{ path: PropertyKey[]; message: string }> }) {
  return error.issues.map((issue) => ({
    field: issue.path.map(String).join("."),
    message: issue.message
  }));
}

router.use(requireAuth);

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const result = await pool.query<TaskRow>(
    `SELECT id, title, description, status, priority,
            TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
     FROM tasks
     WHERE user_id = $1
     ORDER BY
       CASE WHEN status = 'completed' THEN 1 ELSE 0 END,
       due_date ASC NULLS LAST,
       created_at DESC`,
    [req.user!.id]
  );

  res.status(200).json({ tasks: result.rows });
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const parsed = taskCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Please correct the task details.", validationDetails(parsed.error));
  }

  const task = parsed.data;
  const result = await pool.query<TaskRow>(
    `INSERT INTO tasks (id, user_id, title, description, status, priority, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, title, description, status, priority,
       TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate",
       created_at AS "createdAt", updated_at AS "updatedAt"`,
    [
      randomUUID(),
      req.user!.id,
      task.title,
      task.description ?? null,
      task.status,
      task.priority,
      task.dueDate ?? null
    ]
  );

  res.status(201).json({ task: result.rows[0] });
});

router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = taskIdSchema.safeParse(req.params.id);
  if (!id.success) {
    throw new AppError(400, "Task ID must be a valid UUID.");
  }

  const parsed = taskUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, "Please provide valid fields to update.", validationDetails(parsed.error));
  }

  const fields: string[] = [];
  const values: unknown[] = [];
  const updates = parsed.data;

  if (updates.title !== undefined) {
    values.push(updates.title);
    fields.push(`title = $${values.length}`);
  }
  if (updates.description !== undefined) {
    values.push(updates.description);
    fields.push(`description = $${values.length}`);
  }
  if (updates.status !== undefined) {
    values.push(updates.status);
    fields.push(`status = $${values.length}`);
  }
  if (updates.priority !== undefined) {
    values.push(updates.priority);
    fields.push(`priority = $${values.length}`);
  }
  if (updates.dueDate !== undefined) {
    values.push(updates.dueDate);
    fields.push(`due_date = $${values.length}`);
  }

  values.push(id.data);
  const idParameter = values.length;
  values.push(req.user!.id);
  const userParameter = values.length;

  const result = await pool.query<TaskRow>(
    `UPDATE tasks
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${idParameter} AND user_id = $${userParameter}
     RETURNING id, title, description, status, priority,
       TO_CHAR(due_date, 'YYYY-MM-DD') AS "dueDate",
       created_at AS "createdAt", updated_at AS "updatedAt"`,
    values
  );

  const task = result.rows[0];
  if (!task) {
    throw new AppError(404, "Task not found.");
  }

  res.status(200).json({ task });
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = taskIdSchema.safeParse(req.params.id);
  if (!id.success) {
    throw new AppError(400, "Task ID must be a valid UUID.");
  }

  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
    [id.data, req.user!.id]
  );

  if (result.rowCount === 0) {
    throw new AppError(404, "Task not found.");
  }

  res.status(200).json({ success: true });
});

export default router;
