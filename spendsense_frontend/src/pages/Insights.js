import React, { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

const INSIGHTS = [
  { id: "i1", type: "savings", title: "Opportunity", body: "You could save ~$35/mo by consolidating two subscriptions. (Placeholder logic)" },
  { id: "i2", type: "anomalies", title: "Category drift", body: "Dining is trending higher on weekends. Consider a weekly cap and alerts over $25." },
  { id: "i3", type: "recommendations", title: "Personalized tip", body: "Try setting category caps and enabling anomaly sensitivity for groceries." }
];

const TYPES = [
  { key: "savings", label: "Savings" },
  { key: "anomalies", label: "Anomalies" },
  { key: "recommendations", label: "Recommendations" }
];

// PUBLIC_INTERFACE
export default function Insights() {
  /** Insights page with filters for insight types. */
  const [activeTypes, setActiveTypes] = useState(() => new Set(TYPES.map((t) => t.key)));

  const visible = useMemo(() => {
    return INSIGHTS.filter((i) => activeTypes.has(i.type));
  }, [activeTypes]);

  return (
    <div>
      <PageHeader
        title="Insights"
        subtitle="Patterns and recommendations (placeholders, ready for analytics integration)."
        right={<span className="ss-badge">✦ Coming from models</span>}
      />

      <div className="ss-card" style={{ marginBottom: 12 }}>
        <div className="ss-cardTitle">
          <strong>Filter</strong>
          <span className="ss-muted">Insight types</span>
        </div>

        <div className="ss-chipRow">
          {TYPES.map((t) => {
            const active = activeTypes.has(t.key);
            return (
              <span
                key={t.key}
                className={`ss-chip ${active ? "ss-chipActive" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setActiveTypes((prev) => {
                    const next = new Set(prev);
                    if (next.has(t.key)) next.delete(t.key);
                    else next.add(t.key);
                    return next;
                  });
                }}
                aria-label={`Toggle ${t.label}`}
              >
                {t.label}
              </span>
            );
          })}

          <button
            className="ss-btn"
            type="button"
            onClick={() => setActiveTypes(new Set(TYPES.map((t) => t.key)))}
            aria-label="Reset insight filters"
          >
            Reset
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon="✦"
          title="No insights for these filters"
          description="Try enabling more insight types, or connect data to generate analytics-driven insights."
          ctaLabel="Adjust filters"
          onCta={() => setActiveTypes(new Set(TYPES.map((t) => t.key)))}
        />
      ) : (
        <div className="ss-grid ss-gridCols2">
          {visible.map((ins) => (
            <div className="ss-card" key={ins.id}>
              <div className="ss-cardTitle">
                <strong>{ins.title}</strong>
                <span className="ss-badge">{ins.type}</span>
              </div>
              <div className="ss-muted">{ins.body}</div>
            </div>
          ))}

          <div className="ss-card">
            <div className="ss-cardTitle">
              <strong>Next integrations</strong>
              <span className="ss-muted">Roadmap</span>
            </div>
            <ul className="ss-muted" style={{ margin: 0, paddingLeft: 18 }}>
              <li>Backend-driven insights endpoint</li>
              <li>Merchant clustering and anomaly scoring</li>
              <li>Budget-aware recommendations</li>
              <li>User-configurable goals</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
