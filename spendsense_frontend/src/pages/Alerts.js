import React, { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

const MOCK_ALERTS = [
  {
    id: "a1",
    title: "Unusual spend detected",
    detail: "BrightMart is 2.3× your typical grocery transaction.",
    severity: "high",
    type: "anomaly",
    enabled: true
  },
  { id: "a2", title: "Budget reminder", detail: "Dining has reached 78% of your monthly target.", severity: "medium", type: "budget", enabled: true },
  { id: "a3", title: "Rule disabled", detail: "A merchant rule is currently disabled.", severity: "low", type: "rule", enabled: false }
];

function severityBadge(sev) {
  if (sev === "high") return <span className="ss-badge ss-badgeError">● High</span>;
  if (sev === "medium") return <span className="ss-badge ss-badgeWarning">● Medium</span>;
  return <span className="ss-badge ss-badgeSuccess">● Low</span>;
}

// PUBLIC_INTERFACE
export default function Alerts() {
  /** Alerts page showing anomalies and reminders (mocked) with filters. */
  const [severity, setSeverity] = useState("");
  const [type, setType] = useState("");
  const [enabled, setEnabled] = useState("active"); // active|disabled|all

  const types = useMemo(() => Array.from(new Set(MOCK_ALERTS.map((a) => a.type))).sort(), []);
  const activeCount = useMemo(() => MOCK_ALERTS.filter((a) => a.enabled).length, []);

  const filtered = useMemo(() => {
    return MOCK_ALERTS.filter((a) => {
      if (severity && a.severity !== severity) return false;
      if (type && a.type !== type) return false;
      if (enabled === "active" && !a.enabled) return false;
      if (enabled === "disabled" && a.enabled) return false;
      return true;
    });
  }, [severity, type, enabled]);

  return (
    <div>
      <PageHeader
        title="Alerts"
        subtitle="Monitor unusual activity and budget nudges (mocked)."
        right={<span className="ss-badge">🔔 {activeCount} active</span>}
      />

      <div className="ss-card" style={{ marginBottom: 12 }}>
        <div className="ss-cardTitle">
          <strong>Filters</strong>
          <span className="ss-muted">Severity, type, status</span>
        </div>

        <div className="u-row u-wrap">
          <div className="ss-field" style={{ minWidth: 180 }}>
            <div className="ss-label">Severity</div>
            <select className="ss-select" value={severity} onChange={(e) => setSeverity(e.target.value)} aria-label="Severity filter">
              <option value="">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="ss-field" style={{ minWidth: 180 }}>
            <div className="ss-label">Type</div>
            <select className="ss-select" value={type} onChange={(e) => setType(e.target.value)} aria-label="Type filter">
              <option value="">All</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="ss-field" style={{ minWidth: 220 }}>
            <div className="ss-label">Quick toggle</div>
            <div className="ss-chipRow">
              {[
                { key: "active", label: "Active" },
                { key: "disabled", label: "Disabled" },
                { key: "all", label: "All" }
              ].map((x) => (
                <span
                  key={x.key}
                  className={`ss-chip ${enabled === x.key ? "ss-chipActive" : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setEnabled(x.key)}
                  aria-label={`Show ${x.label}`}
                >
                  {x.label}
                </span>
              ))}
            </div>
          </div>

          <button
            className="ss-btn"
            type="button"
            onClick={() => {
              setSeverity("");
              setType("");
              setEnabled("active");
            }}
            aria-label="Clear alert filters"
          >
            Clear
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No alerts match your filters"
          description="Try switching to All alerts or clearing severity/type filters."
          ctaLabel="Adjust filters"
          onCta={() => {
            setSeverity("");
            setType("");
            setEnabled("all");
          }}
        />
      ) : (
        <div className="ss-grid ss-gridCols2">
          {filtered.map((a) => (
            <div className="ss-card" key={a.id}>
              <div className="ss-cardTitle">
                <strong>{a.title}</strong>
                <span className="u-row u-wrap" style={{ justifyContent: "flex-end" }}>
                  {severityBadge(a.severity)}
                  <span className={`ss-badge ${a.enabled ? "ss-badgeSuccess" : ""}`}>{a.enabled ? "Enabled" : "Disabled"}</span>
                </span>
              </div>
              <div className="ss-muted">{a.detail}</div>
              <div className="ss-muted" style={{ marginTop: 8 }}>
                Type: <strong>{a.type}</strong>
              </div>

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
      )}
    </div>
  );
}
