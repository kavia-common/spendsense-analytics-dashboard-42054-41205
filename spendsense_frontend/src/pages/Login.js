import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function safeRedirectPath(path) {
  // Prevent open-redirects by only allowing same-origin relative paths.
  if (!path || typeof path !== "string") return "/dashboard";
  if (!path.startsWith("/")) return "/dashboard";
  return path;
}

// PUBLIC_INTERFACE
export default function Login() {
  /** Standalone email/password login screen backed by Supabase auth; redirects into the app on success. */
  const { signIn, loading, session, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const redirectTo = useMemo(() => {
    const state = location.state;
    if (state && typeof state === "object" && typeof state.redirectTo === "string") {
      return safeRedirectPath(state.redirectTo);
    }
    return "/dashboard";
  }, [location.state]);

  // If already authenticated, don't let users sit on /login.
  useEffect(() => {
    const isAuthed = !!session && !!user;
    if (isAuthed) navigate("/dashboard", { replace: true });
  }, [navigate, session, user]);

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
      // Note: supabase-js persists session by default. "Remember me" is here for UI parity with design;
      // wiring a real remember-me toggle would require controlling storage/persist config.
      await signIn(eMail, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const msg = err && typeof err === "object" && "message" in err ? String(err.message) : "Sign-in failed.";
      setErrorMsg(msg);
    }
  }

  const disabled = loading;

  return (
    <div
      aria-label="Login screen"
      style={{
        minHeight: "100vh",
        padding: 18,
        display: "grid",
        placeItems: "center"
      }}
    >
      <section
        className="ss-card"
        aria-label="Login panel"
        style={{
          width: "min(92vw, 640px)",
          padding: 18
        }}
      >
        <div className="u-spread" style={{ marginBottom: 12, alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 750, letterSpacing: 0.2 }}>Sign in</div>
            <div className="ss-muted" style={{ marginTop: 4 }}>
              Access protected pages after authentication.
            </div>
          </div>
          <span className="ss-badge ss-badgeSuccess" aria-label="Status">
            Ready
          </span>
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

          <div className="u-spread" style={{ flexWrap: "wrap", gap: 12 }}>
            <label className="ss-muted" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} disabled={disabled} />
              Remember me
            </label>

            <button
              type="button"
              className="ss-btn"
              onClick={() => window.alert("Forgot password flow is not implemented yet.")}
              disabled={disabled}
              aria-label="Forgot password"
            >
              Forgot password?
            </button>
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
          </div>

          <div className="ss-muted" style={{ fontSize: 12 }}>
            After login, you will be redirected to: <strong>{redirectTo}</strong>
          </div>
        </form>
      </section>
    </div>
  );
}
