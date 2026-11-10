import test from "node:test";
import assert from "node:assert/strict";
import {
  loginSchema,
  registerSchema,
  taskCreateSchema,
  taskIdSchema,
  taskUpdateSchema
} from "../src/validation/schemas.js";

test("registration normalizes email and accepts a sufficiently long password", () => {
  const result = registerSchema.safeParse({
    email: "  PERSON@EXAMPLE.COM ",
    password: "a-secure-password-123",
    fullName: "TaskFlow Learner"
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.email, "person@example.com");
    assert.equal(result.data.fullName, "TaskFlow Learner");
  }
});

test("registration treats a blank optional display name as absent", () => {
  const result = registerSchema.safeParse({
    email: "person@example.com",
    password: "a-secure-password-123",
    fullName: "   "
  });

  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.fullName, undefined);
});

test("registration rejects short passwords", () => {
  const result = registerSchema.safeParse({
    email: "person@example.com",
    password: "short"
  });

  assert.equal(result.success, false);
});

test("registration rejects bcrypt inputs longer than 72 UTF-8 bytes", () => {
  const result = registerSchema.safeParse({
    email: "person@example.com",
    password: "é".repeat(37)
  });

  assert.equal(result.success, false);
});

test("login normalizes email before lookup", () => {
  const result = loginSchema.safeParse({
    email: "PERSON@example.com",
    password: "a-secure-password-123"
  });

  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.email, "person@example.com");
});

test("task creation supplies safe defaults and trims the title", () => {
  const result = taskCreateSchema.safeParse({ title: "  Learn PostgreSQL  " });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.title, "Learn PostgreSQL");
    assert.equal(result.data.status, "todo");
    assert.equal(result.data.priority, "medium");
  }
});

test("task creation rejects impossible calendar dates", () => {
  const result = taskCreateSchema.safeParse({
    title: "Invalid date",
    dueDate: "2026-02-31"
  });

  assert.equal(result.success, false);
});

test("task creation rejects a blank title", () => {
  const result = taskCreateSchema.safeParse({ title: "   " });
  assert.equal(result.success, false);
});

test("task update rejects an empty object", () => {
  const result = taskUpdateSchema.safeParse({});
  assert.equal(result.success, false);
});

test("task IDs must be valid UUIDs", () => {
  assert.equal(taskIdSchema.safeParse("not-a-uuid").success, false);
  assert.equal(taskIdSchema.safeParse("1a5c4c79-6d2a-4b5a-9ec9-9d2f2c7f1e01").success, true);
});
