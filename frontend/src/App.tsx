import { useEffect, useMemo, useState } from "react";
import { api } from "./lib/api";
import { AuthScreen } from "./components/AuthScreen";
import { TaskCard } from "./components/TaskCard";
import { TaskEditor } from "./components/TaskEditor";
import type { Task, TaskInput, TaskStatus, User } from "./types";

type TaskFilter = "all" | TaskStatus;

function getInitials(user: User): string {
  const name = user.fullName?.trim();
  if (name) return name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
  return user.email.slice(0, 1).toUpperCase();
}

function greetingName(user: User): string {
  return user.fullName?.trim().split(/\s+/)[0] || user.email.split("@")[0] || "there";
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);

  async function loadTasks() {
    const result = await api.getTasks();
    setTasks(result.tasks);
  }

  async function refreshSession() {
    try {
      const result = await api.getCurrentUser();
      setUser(result.user);
      if (result.user) await loadTasks();
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to connect to TaskFlow.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshSession();
  }, []);

  async function handleLogin(input: { email: string; password: string }) {
    const result = await api.login(input);
    setUser(result.user);
    await loadTasks();
  }

  async function handleRegister(input: { email: string; password: string; fullName: string }) {
    const result = await api.register(input);
    setUser(result.user);
    await loadTasks();
  }

  async function handleLogout() {
    try {
      await api.logout();
      setUser(null);
      setTasks([]);
      setFilter("all");
      setPageError("");
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to sign out.");
    }
  }

  async function saveTask(input: TaskInput) {
    if (editingTask) {
      const result = await api.updateTask(editingTask.id, input);
      setTasks((current) => current.map((task) => task.id === editingTask.id ? result.task : task));
    } else {
      const result = await api.createTask(input);
      setTasks((current) => [result.task, ...current]);
    }
    setEditingTask(null);
    setEditorOpen(false);
  }

  async function changeStatus(task: Task, status: TaskStatus) {
    setBusyTaskId(task.id);
    try {
      const result = await api.updateTask(task.id, { status });
      setTasks((current) => current.map((item) => item.id === task.id ? result.task : item));
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to update task.");
    } finally {
      setBusyTaskId(null);
    }
  }

  async function deleteTask(task: Task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    setBusyTaskId(task.id);
    try {
      await api.deleteTask(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to delete task.");
    } finally {
      setBusyTaskId(null);
    }
  }

  const counts = useMemo(() => ({
    all: tasks.length,
    todo: tasks.filter((task) => task.status === "todo").length,
    inProgress: tasks.filter((task) => task.status === "in_progress").length,
    completed: tasks.filter((task) => task.status === "completed").length
  }), [tasks]);

  const visibleTasks = useMemo(
    () => filter === "all" ? tasks : tasks.filter((task) => task.status === filter),
    [filter, tasks]
  );

  function openNewTask() {
    setEditingTask(null);
    setEditorOpen(true);
  }

  function openEditTask(task: Task) {
    setEditingTask(task);
    setEditorOpen(true);
  }

  if (loading) {
    return <div className="loading-screen"><span className="loading-mark">t</span><p>Getting your workspace ready…</p></div>;
  }

  if (!user) {
    return (
      <>
        {pageError && <div className="connection-note" role="status">{pageError}</div>}
        <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />
      </>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="TaskFlow home">
          <span className="brand-mark">t</span><span>taskflow</span>
        </a>
        <div className="sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>
          <button className={`nav-link ${filter === "all" ? "active" : ""}`} type="button" onClick={() => setFilter("all")}><span className="nav-icon">▦</span> My tasks <span className="nav-count">{counts.all}</span></button>
          <button className="nav-link" type="button" onClick={() => setFilter("in_progress")}><span className="nav-icon">◷</span> In progress</button>
          <button className="nav-link" type="button" onClick={() => setFilter("completed")}><span className="nav-icon">✓</span> Completed</button>
        </div>
        <div className="sidebar-tip">
          <span className="tip-spark">✦</span>
          <p className="tip-title">Small steps add up.</p>
          <p>Pick one meaningful task and give it your attention.</p>
        </div>
        <div className="sidebar-user">
          <span className="avatar">{getInitials(user)}</span>
          <div className="user-details"><strong>{user.fullName || "Your account"}</strong><span>{user.email}</span></div>
          <button className="icon-button" type="button" onClick={() => void handleLogout()} aria-label="Sign out">↗</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>My tasks</strong></div>
          <div className="topbar-right"><span className="live-indicator"><i /> All changes saved</span><span className="avatar avatar-small">{getInitials(user)}</span></div>
        </header>

        <section className="page-intro">
          <div>
            <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
            <h1>Good day, {greetingName(user)} <span className="wave">✳</span></h1>
            <p className="muted">A little clarity goes a long way. Here's what's on your plate.</p>
          </div>
          <button className="button button-primary" type="button" onClick={openNewTask}><span>＋</span> New task</button>
        </section>

        {pageError && <div className="alert alert-error page-alert" role="alert">{pageError}<button className="alert-dismiss" onClick={() => setPageError("")} type="button" aria-label="Dismiss error">×</button></div>}

        <section className="stats-grid" aria-label="Task summary">
          <div className="stat-card"><span className="stat-icon stat-icon-dark">▦</span><span className="stat-label">Total tasks</span><strong>{counts.all}</strong><small>Across your workspace</small></div>
          <div className="stat-card"><span className="stat-icon stat-icon-blue">◷</span><span className="stat-label">To do</span><strong>{counts.todo}</strong><small>Ready when you are</small></div>
          <div className="stat-card"><span className="stat-icon stat-icon-amber">↗</span><span className="stat-label">In progress</span><strong>{counts.inProgress}</strong><small>Currently moving forward</small></div>
          <div className="stat-card"><span className="stat-icon stat-icon-green">✓</span><span className="stat-label">Completed</span><strong>{counts.completed}</strong><small>Good work, keep going</small></div>
        </section>

        <section className="task-section">
          <div className="section-heading">
            <div><p className="eyebrow">KEEP YOUR MOMENTUM</p><h2>Your tasks <span className="heading-count">{visibleTasks.length}</span></h2></div>
            <div className="filter-tabs" role="group" aria-label="Filter tasks">
              {([["all", "All"], ["todo", "To do"], ["in_progress", "In progress"], ["completed", "Done"]] as const).map(([value, label]) => (
                <button type="button" key={value} className={filter === value ? "selected" : ""} onClick={() => setFilter(value)}>{label}</button>
              ))}
            </div>
          </div>

          {editorOpen && <TaskEditor key={editingTask?.id ?? "new"} task={editingTask} onSave={saveTask} onCancel={() => { setEditorOpen(false); setEditingTask(null); }} />}

          {visibleTasks.length > 0 ? (
            <div className="task-grid">
              {visibleTasks.map((task) => (
                <div className="task-card-wrap" key={task.id} aria-busy={busyTaskId === task.id}>
                  <TaskCard task={task} onEdit={openEditTask} onDelete={(item) => void deleteTask(item)} onStatusChange={(item, status) => void changeStatus(item, status)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-illustration">✳</span>
              <h3>{filter === "all" ? "A clean slate." : "Nothing here just yet."}</h3>
              <p>{filter === "all" ? "Add your first task and turn an idea into a next step." : "Try another filter or move a task into this stage."}</p>
              {filter === "all" && <button className="button button-secondary" type="button" onClick={openNewTask}>Create your first task</button>}
            </div>
          )}
        </section>
        <footer className="app-footer"><span>TaskFlow</span><span>Focus on progress, not perfection.</span><span>Phase 1 · Application foundation</span></footer>
      </main>
    </div>
  );
}
