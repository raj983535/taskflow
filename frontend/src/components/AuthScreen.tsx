import { useState, type FormEvent } from "react";

type AuthMode = "login" | "register";

interface AuthScreenProps {
  onLogin: (input: { email: string; password: string }) => Promise<void>;
  onRegister: (input: { email: string; password: string; fullName: string }) => Promise<void>;
}

export function AuthScreen({ onLogin, onRegister }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        await onLogin({ email, password });
      } else {
        await onRegister({ email, password, fullName });
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-story">
        <a className="brand brand-light" href="/">
          <span className="brand-mark">t</span>
          <span>taskflow</span>
        </a>
        <div className="story-copy">
          <p className="eyebrow eyebrow-light">A clearer way to work</p>
          <h1>Make room for the work that matters.</h1>
          <p>Capture the next step, see what needs your attention, and make steady progress without the noise.</p>
          <div className="story-points">
            <span><i /> One calm place for your tasks</span>
            <span><i /> Priorities you can actually see</span>
            <span><i /> Progress that feels tangible</span>
          </div>
        </div>
        <p className="auth-footnote">TaskFlow · Built as a full-stack engineering project</p>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">WELCOME TO TASKFLOW</p>
          <h2>{mode === "login" ? "Good to have you back." : "Start with a clear slate."}</h2>
          <p className="muted">{mode === "login" ? "Sign in to pick up where you left off." : "Create your account and organize your day."}</p>

          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); }}>Sign in</button>
            <button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setError(""); }}>Create account</button>
          </div>

          <form className="stack-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <label>
                Your name
                <input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="e.g. Alex Morgan" maxLength={80} />
              </label>
            )}
            <label>
              Email address
              <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" maxLength={254} />
            </label>
            <label>
              Password
              <input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 12 characters" />
              {mode === "register" && <small>Use at least 12 characters.</small>}
            </label>
            {error && <div className="alert alert-error" role="alert">{error}</div>}
            <button className="button button-primary button-full" type="submit" disabled={submitting}>
              {submitting ? "Please wait…" : mode === "login" ? "Sign in to TaskFlow" : "Create your account"}
              <span aria-hidden="true">→</span>
            </button>
          </form>
          <p className="auth-legal">By continuing, you agree to use this learning application responsibly. Do not use real production credentials here.</p>
        </div>
      </section>
    </main>
  );
}
