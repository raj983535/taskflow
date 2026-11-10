import { useEffect, useState, type FormEvent } from "react";
import type { Task, TaskInput, TaskPriority, TaskStatus } from "../types";

interface TaskEditorProps {
  task: Task | null;
  onSave: (input: TaskInput) => Promise<void>;
  onCancel: () => void;
}

export function TaskEditor({ task, onSave, onCancel }: TaskEditorProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setStatus(task?.status ?? "todo");
    setPriority(task?.priority ?? "medium");
    setDueDate(task?.dueDate ?? "");
  }, [task]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || null,
        status,
        priority,
        dueDate: dueDate || null
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save this task.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="editor-card" onSubmit={submit}>
      <div className="editor-heading">
        <div>
          <p className="eyebrow">{task ? "REFINE THE DETAILS" : "GET IT OUT OF YOUR HEAD"}</p>
          <h3>{task ? "Edit task" : "Create a task"}</h3>
        </div>
        <button className="icon-button" type="button" onClick={onCancel} aria-label="Close task editor">×</button>
      </div>
      <label>
        Task title
        <input autoFocus required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs to get done?" />
      </label>
      <label>
        Description <span className="optional">Optional</span>
        <textarea rows={3} maxLength={2000} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add a little context…" />
      </label>
      <div className="form-grid">
        <label>
          Priority
          <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>
      <label>
        Due date <span className="optional">Optional</span>
        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
      </label>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <div className="editor-actions">
        <button className="button button-quiet" type="button" onClick={onCancel}>Cancel</button>
        <button className="button button-primary" type="submit" disabled={saving || title.trim().length === 0}>{saving ? "Saving…" : task ? "Save changes" : "Add task"}</button>
      </div>
    </form>
  );
}
