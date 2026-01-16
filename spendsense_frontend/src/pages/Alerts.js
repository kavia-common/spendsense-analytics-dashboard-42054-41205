import React from "react";
import PageHeader from "../components/PageHeader";

const MOCK_ALERTS = [
  { id: "a1", title: "Unusual spend detected", detail: "BrightMart is 2.3× your typical grocery transaction.", severity: "high" },
  { id: "a2", title: "Budget reminder", detail: "Dining has reached 78% of your monthly target.", severity: "medium" }
];

function severityBadge(sev) {
  if (sev === "high") return <span className="ss-badge ss-badgeError">● High</span>;
  if (sev === "medium") return <span className="ss-badge">● Medium</span>;
  return <span className="ss-badge ss-badgeSuccess">● Low</span>;
}

// PUBLIC_INTERFACE
export default function Alerts() {
  /** Alerts page showing anomalies and reminders (mocked). */
  return (
    <div>
      <PageHeader
        title="Alerts"
        subtitle="Monitor unusual activity and budget nudges (mocked)."
        right={<span className="ss-badge">🔔 {MOCK_ALERTS.length} active</span>}
      />

      <div className="ss-grid ss-gridCols2">
        {MOCK_ALERTS.map((a) => (
          <div className="ss-card" key={a.id}>
            <div className="ss-cardTitle">
              <strong>{a.title}</strong>
              {severityBadge(a.severity)}
            </div>
            <div className="ss-muted">{a.detail}</div>
            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="ss-primaryBtn" type="button" style={{ height: 38 }}>
                Review
              </button>
              <button className="ss-iconBtn" type="button" aria-label="Dismiss alert">
                ✓
              </button>
            </div>
          </div>
        ))}

        <div className="ss-card">
          <div className="ss-cardTitle">
            <strong>Alert rules</strong>
            <span className="ss-muted">Placeholder</span>
          </div>
          <div className="ss-muted">
            Planned: threshold alerts, category-based caps, merchant allow/deny lists, and anomaly sensitivity.
          </div>
        </div>
      </div>
    </div>
  );
}
