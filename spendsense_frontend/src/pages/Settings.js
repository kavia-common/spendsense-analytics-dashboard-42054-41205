import React, { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { getApiBaseUrl } from "../config/api";
import { runSupabaseVerification } from "../lib/supabaseVerification";

// PUBLIC_INTERFACE
export default function Settings() {
  /** Settings page (mocked preferences). */
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const apiBase = useMemo(() => getApiBaseUrl(), []);

  function badgeClassForStatus(status) {
    if (status === "Success") return "ss-badge ss-badgeSuccess";
    if (status === "Warnings") return "ss-badge ss-badgeWarning";
    if (status === "Errors") return "ss-badge ss-badgeError";
    return "ss-badge";
  }

  async function onRunVerification() {
    setVerifyLoading(true);

    // eslint-disable-next-line no-console
    console.groupCollapsed("[Settings] Supabase verification: run triggered");
    // eslint-disable-next-line no-console
    console.info({
      at: new Date().toISOString(),
      env: {
        hasUrl: !!process.env.REACT_APP_SUPABASE_URL,
        hasKey: !!process.env.REACT_APP_SUPABASE_KEY
      }
    });
    // eslint-disable-next-line no-console
    console.groupEnd();

    try {
      const res = await runSupabaseVerification();
      setVerifyResult(res);

      // eslint-disable-next-line no-console
      console.info("[Settings] Supabase verification result (for UI):", res);
    } catch (e) {
      // This should be rare because the verifier catches per-check errors,
      // but keep a final safety net for unexpected exceptions.
      const msg = e && typeof e === "object" && "message" in e ? String(e.message) : "Unknown verification error";
      // eslint-disable-next-line no-console
      console.error("[Supabase Verification] Unexpected failure:", e);
      setVerifyResult({
        status: "Errors",
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        summary: { overall: "Errors", errorsCount: 1, warningsCount: 0 },
        checks: [
          {
            id: "unexpected",
            label: "Verification routine",
            ok: false,
            severity: "error",
            detail: msg
          }
        ],
        hints: ["Open the browser console for details."]
      });
    } finally {
      setVerifyLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage preferences and environment configuration (UI placeholders)."
        right={<span className="ss-badge">⚙ Preferences</span>}
      />

      <div className="ss-grid ss-gridCols2">
        <div className="ss-card">
          <div className="ss-cardTitle">
            <strong>Notifications</strong>
            <span className="ss-muted">Mock</span>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
            />
            <span className="ss-muted">Email alerts for unusual spend</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
            <input
              type="checkbox"
              checked={weeklySummary}
              onChange={(e) => setWeeklySummary(e.target.checked)}
            />
            <span className="ss-muted">Weekly summary report</span>
          </label>
        </div>

        <div className="ss-card">
          <div className="ss-cardTitle">
            <strong>Backend connection</strong>
            <span className="ss-muted">Env-driven</span>
          </div>

          <div className="ss-muted">
            API base URL:
            <div style={{ marginTop: 8, fontWeight: 650 }}>
              {apiBase ? apiBase : "(not set)"}
            </div>
          </div>

          <div className="ss-muted" style={{ marginTop: 10 }}>
            Configure via <code>REACT_APP_API_BASE</code> or <code>REACT_APP_BACKEND_URL</code>.
          </div>
        </div>

        {/* New: Supabase verification panel (read-only, non-intrusive) */}
        <div className="ss-card" style={{ gridColumn: "1 / -1" }}>
          <div className="ss-cardTitle">
            <strong>Supabase verification</strong>
            <span className="ss-muted">Read-only checks</span>
          </div>

          <div className="u-spread" style={{ alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div className="ss-muted" style={{ maxWidth: 720 }}>
              Validates env vars, session fetch, DB access to <code>public.profiles</code>, and that Storage bucket{" "}
              <code>avatars</code> exists. Detailed logs are printed to the browser console.
            </div>

            <div className="u-row" style={{ flexWrap: "wrap" }}>
              <button
                className="ss-primaryBtn"
                type="button"
                onClick={onRunVerification}
                disabled={verifyLoading}
                aria-label="Run Supabase verification"
              >
                {verifyLoading ? "Running…" : "Run Verification"}
              </button>

              {verifyResult?.status ? (
                <span className={badgeClassForStatus(verifyResult.status)} aria-label="Verification status">
                  {verifyResult.status}
                </span>
              ) : (
                <span className="ss-muted">Not run</span>
              )}
            </div>
          </div>

          {verifyResult ? (
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <div className="ss-muted">
                Last run: <strong>{verifyResult.finishedAt}</strong> • Errors:{" "}
                <strong>{verifyResult.summary?.errorsCount ?? 0}</strong> • Warnings:{" "}
                <strong>{verifyResult.summary?.warningsCount ?? 0}</strong>
              </div>

              <div className="ss-grid" style={{ gap: 10 }}>
                {Array.isArray(verifyResult.checks)
                  ? verifyResult.checks.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          padding: 12,
                          borderRadius: 14,
                          border: "1px solid var(--color-border)",
                          background: "rgba(255, 255, 255, 0.70)"
                        }}
                      >
                        <div className="u-spread" style={{ alignItems: "center" }}>
                          <div style={{ fontWeight: 750, fontSize: 13 }}>{c.label}</div>
                          <span
                            className={
                              c.severity === "ok"
                                ? "ss-badge ss-badgeSuccess"
                                : c.severity === "warning"
                                  ? "ss-badge ss-badgeWarning"
                                  : "ss-badge ss-badgeError"
                            }
                          >
                            {c.severity === "ok" ? "OK" : c.severity === "warning" ? "Warning" : "Error"}
                          </span>
                        </div>
                        <div className="ss-muted" style={{ marginTop: 6 }}>
                          {c.detail}
                        </div>
                      </div>
                    ))
                  : null}
              </div>

              {Array.isArray(verifyResult.hints) && verifyResult.hints.length ? (
                <div style={{ marginTop: 4 }}>
                  <div style={{ fontWeight: 750, fontSize: 13 }}>Actionable hints</div>
                  <ul className="ss-muted" style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                    {verifyResult.hints.map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
