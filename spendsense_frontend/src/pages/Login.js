import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../auth/AuthContext";

// PUBLIC_INTERFACE
export default function Login() {
  /** Mock login page that flips auth state and redirects back to requested page. */
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = useMemo(() => {
    const state = location.state;
    if (state && typeof state === "object" && state.from && state.from.pathname) {
      return state.from.pathname;
    }
    return "/";
  }, [location.state]);

  return (
    <div>
      <PageHeader
        title="Login"
        subtitle="Mock authentication (placeholder). Protected pages require login."
        right={<span className="ss-badge">🔒 Protected routes</span>}
      />

      <div className="ss-grid ss-gridCols2">
        <div className="ss-card">
          <div className="ss-cardTitle">
            <strong>Sign in</strong>
            <span className="ss-muted">Mock</span>
          </div>

          <div className="ss-muted">
            This is a placeholder flow. Clicking “Sign in” sets a local in-memory auth flag.
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="ss-primaryBtn"
              type="button"
              onClick={() => {
                login();
                navigate(fromPath, { replace: true });
              }}
            >
              Sign in
            </button>

            <button
              className="ss-iconBtn"
              type="button"
              aria-label="Go back"
              onClick={() => navigate("/", { replace: true })}
              title="Back to Dashboard"
            >
              ←
            </button>
          </div>

          <div className="ss-muted" style={{ marginTop: 12 }}>
            After login, you will be redirected to: <strong>{fromPath}</strong>
          </div>
        </div>

        <div className="ss-card">
          <div className="ss-cardTitle">
            <strong>Roadmap</strong>
            <span className="ss-muted">Next</span>
          </div>
          <ul className="ss-muted" style={{ margin: 0, paddingLeft: 18 }}>
            <li>Replace mock auth with Supabase auth</li>
            <li>Persist sessions</li>
            <li>Add logout + profile menu</li>
            <li>Enforce role-based access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
