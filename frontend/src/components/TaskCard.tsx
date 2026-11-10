import type { Task, TaskStatus } from "../types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  completed: "Completed"
};

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" })
    .format(new Date(year, month - 1, day));
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const dueLabel = formatDate(task.dueDate);
  const overdue = task.dueDate !== null
    && task.status !== "completed"
    && new Date(`${task.dueDate}T23:59:59`).getTime() < Date.now();

  return (
    <article className={`task-card ${task.status === "completed" ? "task-completed" : ""}`}>
      <div className="task-card-top">
        <span className={`priority priority-${task.priority}`}><i />{task.priority}</span>
        <div className="task-actions">
          <button className="icon-button" type="button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>↗</button>
          <button className="icon-button danger-hover" type="button" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}>×</button>
        </div>
      </div>
      <h3>{task.title}</h3>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-card-bottom">
        <label className="status-control">
          <span className="sr-only">Status for {task.title}</span>
          <select value={task.status} onChange={(event) => onStatusChange(task, event.target.value as TaskStatus)} aria-label={`Status for ${task.title}`}>
            {Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
        {dueLabel && <span className={`due-date ${overdue ? "overdue" : ""}`}>{overdue ? "Overdue · " : "Due · "}{dueLabel}</span>}
      </div>
    </article>
  );
}
