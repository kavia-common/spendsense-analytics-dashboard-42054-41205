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
      className="ss-loginScreen"
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: 18,
        display: "grid",
        placeItems: "center"
      }}
    >
      <div
        className="ss-loginShell"
        style={{
          width: "min(1180px, 100%)",
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 18,
          alignItems: "start"
        }}
      >
        {/* Sidebar (static visual shell to match design reference; not app navigation) */}
        <aside
          className="ss-card"
          aria-label="Sidebar navigation"
          style={{
            padding: 14,
            height: "fit-content"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px 12px" }}>
            <div
              className="ss-brandMark"
              aria-hidden="true"
              style={{
                width: 34,
                height: 34,
                borderRadius: 12
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <strong style={{ fontSize: 13 }}>SpendSense</strong>
              <span className="ss-muted" style={{ fontSize: 11 }}>
                Analytics Dashboard
              </span>
            </div>
          </div>

          <nav aria-label="Primary" style={{ display: "flex", flexDirection: "column", gap: 6, padding: 6 }}>
            {[
              { icon: "⌁", label: "Dashboard", active: true },
              { icon: "↕", label: "Transactions" },
              { icon: "✶", label: "Insights" },
              { icon: "!", label: "Alerts" },
              { icon: "⚙", label: "Settings" }
            ].map((item) => (
              <div
                key={item.label}
                aria-current={item.active ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 10px",
                  borderRadius: 14,
                  border: `1px solid ${item.active ? "rgba(37, 99, 235, 0.18)" : "transparent"}`,
                  background: item.active ? "rgba(37, 99, 235, 0.10)" : "transparent",
                  color: "rgba(15, 23, 42, 0.92)"
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 10,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(15, 23, 42, 0.06)",
                    color: "rgba(15, 23, 42, 0.85)",
                    fontSize: 14,
                    flex: "0 0 auto"
                  }}
                >
                  {item.icon}
                </span>
                <span style={{ fontSize: 13, fontWeight: 650 }}>{item.label}</span>
              </div>
            ))}
          </nav>
        </aside>

        <main aria-label="Main content" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Topbar (static visual shell to match design reference) */}
          <header
            className="ss-card"
            aria-label="Top bar"
            style={{
              padding: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12
            }}
          >
            <div
              className="ss-search"
              role="search"
              aria-label="Search"
              style={{
                minWidth: 280,
                height: 40,
                padding: "0 12px",
                background: "rgba(255, 255, 255, 0.92)"
              }}
            >
              <span aria-hidden="true" style={{ opacity: 0.6 }}>
                🔎
              </span>
              <input placeholder="Search transactions, categories, merchants…" disabled aria-disabled="true" />
            </div>

            <div className="u-row" aria-label="Top actions">
              <button className="ss-iconBtn" type="button" aria-label="Notifications" title="Notifications" disabled={disabled}>
                🔔
              </button>
              <button className="ss-iconBtn" type="button" aria-label="Help" title="Help" disabled={disabled}>
                ?
              </button>
              <button className="ss-primaryBtn" type="button" disabled={disabled} aria-label="Login">
                Login
              </button>
            </div>
          </header>

          {/* Login panel */}
          <section
            className="ss-card"
            aria-label="Login panel"
            style={{
              padding: 18,
              boxShadow: "var(--shadow-md)"
            }}
          >
            <div className="u-spread" style={{ marginBottom: 12, alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 750, letterSpacing: 0.2 }}>Sign in</div>
                <div className="ss-muted" style={{ marginTop: 4, fontSize: 12 }}>
                  Access protected pages after authentication.
                </div>
              </div>

              <span className="ss-badge ss-badgeSuccess" aria-label="Status">
                Success
              </span>
            </div>

            <form onSubmit={onSubmit} aria-label="Sign in form" style={{ maxWidth: 560, display: "grid", gap: 12 }}>
              <div className="ss-field">
                <label className="ss-label" htmlFor="login-email">
                  Email
                </label>
                <input
                  id="login-email"
                  className="ss-input"
                  style={{ height: 40 }}
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
                  style={{ height: 40 }}
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
                <label className="ss-muted" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    disabled={disabled}
                    aria-label="Remember me"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => window.alert("Forgot password flow is not implemented yet.")}
                  disabled={disabled}
                  aria-label="Forgot password"
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(37, 99, 235, 0.92)",
                    cursor: disabled ? "not-allowed" : "pointer"
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {errorMsg ? (
                <div className="ss-badge ss-badgeError" role="alert" aria-live="assertive" style={{ justifySelf: "start" }}>
                  {errorMsg}
                </div>
              ) : null}

              <div className="u-row" style={{ gap: 12 }}>
                <button className="ss-primaryBtn" type="submit" disabled={disabled} aria-label="Sign in">
                  {disabled ? "Signing in…" : "Sign in"}
                </button>
              </div>

              <div className="ss-muted" style={{ fontSize: 12 }}>
                After login, you will be redirected to: <strong>{redirectTo}</strong>
              </div>
            </form>
          </section>
        </main>
      </div>

      {/* responsive fallback */}
      <style>{`
        @media (max-width: 920px) {
          .ss-loginShell { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
