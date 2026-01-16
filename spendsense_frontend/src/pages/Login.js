import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../auth/AuthContext";

// PUBLIC_INTERFACE
export default function Login() {
  /** Email/password login page backed by Supabase auth; redirects back to intended route on success. */
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fromPath = useMemo(() => {
    const state = location.state;
    if (state && typeof state === "object" && state.from && state.from.pathname) {
      return state.from.pathname;
    }
    return "/";
  }, [location.state]);

  async function onSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    const eMail = String(email).trim();
    if (!eMail) {
      setErrorMsg("Please enter your email.");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    try {
      await signIn(eMail, password);
      navigate(fromPath, { replace: true });
    } catch (err) {
      const msg = err && typeof err === "object" && "message" in err ? String(err.message) : "Sign-in failed.";
      setErrorMsg(msg);
    }
  }

  const disabled = loading;

  return (
    <div>
      <PageHeader
        title="Login"
        subtitle="Sign in to access protected pages."
        right={<span className="ss-badge">🔒 Protected routes</span>}
      />

      <div className="ss-grid ss-gridCols2">
        <div className="ss-card">
          <div className="ss-cardTitle">
            <strong>Sign in</strong>
            <span className="ss-muted">Supabase</span>
          </div>

          <form onSubmit={onSubmit} className="ss-grid" style={{ gap: 12 }} aria-label="Sign in form">
            <div className="ss-field">
              <label className="ss-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                className="ss-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@company.com"
                disabled={disabled}
                aria-invalid={!!errorMsg}
              />
            </div>

            <div className="ss-field">
              <label className="ss-label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                className="ss-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={disabled}
                aria-invalid={!!errorMsg}
              />
            </div>

            {errorMsg ? (
              <div className="ss-badge ss-badgeError" role="alert" aria-live="assertive" style={{ justifySelf: "start" }}>
                {errorMsg}
              </div>
            ) : null}

            <div className="u-row u-wrap" style={{ marginTop: 4 }}>
              <button className="ss-primaryBtn" type="submit" disabled={disabled} aria-label="Sign in">
                {disabled ? "Signing in…" : "Sign in"}
              </button>

              <button
                className="ss-iconBtn"
                type="button"
                aria-label="Go back"
                onClick={() => navigate("/", { replace: true })}
                title="Back to Dashboard"
                disabled={disabled}
              >
                ←
              </button>
            </div>

            <div className="ss-muted">
              After login, you will be redirected to: <strong>{fromPath}</strong>
            </div>
          </form>
        </div>

        <div className="ss-card">
          <div className="ss-cardTitle">
            <strong>Notes</strong>
            <span className="ss-muted">Auth</span>
          </div>
          <ul className="ss-muted" style={{ margin: 0, paddingLeft: 18 }}>
            <li>Uses Supabase email/password auth</li>
            <li>Session is restored automatically (persisted by supabase-js)</li>
            <li>Protected routes redirect here and preserve the intended path</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
