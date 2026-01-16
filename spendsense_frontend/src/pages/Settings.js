import React, { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { getApiBaseUrl } from "../config/api";

// PUBLIC_INTERFACE
export default function Settings() {
  /** Settings page (mocked preferences). */
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  const apiBase = useMemo(() => getApiBaseUrl(), []);

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
      </div>
    </div>
  );
}
