import type { Task, TaskInput, User } from "../types";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    credentials: "include"
  });

  const payload: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const body = payload as { message?: string; details?: unknown };
    throw new ApiError(
      body.message ?? `Request failed with status ${response.status}.`,
      response.status,
      body.details
    );
  }

  return payload as T;
}

export const api = {
  getCurrentUser: () => request<{ user: User | null }>("/api/auth/me"),

  register: (input: { email: string; password: string; fullName: string }) =>
    request<{ user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input)
    }),

  login: (input: { email: string; password: string }) =>
    request<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input)
    }),

  logout: () =>
    request<{ success: true }>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({})
    }),

  getTasks: () => request<{ tasks: Task[] }>("/api/tasks"),

  createTask: (input: TaskInput) =>
    request<{ task: Task }>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(input)
    }),

  updateTask: (id: string, input: Partial<TaskInput>) =>
    request<{ task: Task }>(`/api/tasks/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    }),

  deleteTask: (id: string) =>
    request<{ success: true }>(`/api/tasks/${encodeURIComponent(id)}`, {
      method: "DELETE"
    })
};
