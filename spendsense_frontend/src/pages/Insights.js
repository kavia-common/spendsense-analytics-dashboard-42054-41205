import React from "react";
import PageHeader from "../components/PageHeader";

// PUBLIC_INTERFACE
export default function Insights() {
  /** Insights page with placeholder recommendations and segments. */
  return (
    <div>
      <PageHeader
        title="Insights"
        subtitle="Patterns and recommendations (placeholders, ready for analytics integration)."
        right={<span className="ss-badge">✦ Coming from models</span>}
      />

      <div className="ss-grid ss-gridCols2">
        <div className="ss-card">
          <div className="ss-cardTitle">
            <strong>Personalized tip</strong>
            <span className="ss-muted">Mock</span>
          </div>
          <div className="ss-muted">
            Your dining spend is trending higher on weekends. Consider setting a weekly cap and
            using alerts for merchants over $25.
          </div>
        </div>

        <div className="ss-card">
          <div className="ss-cardTitle">
            <strong>Opportunity</strong>
            <span className="ss-muted">Mock</span>
          </div>
          <div className="ss-muted">
            You could save ~<strong>$35/mo</strong> by consolidating two subscriptions. (Placeholder logic)
          </div>
        </div>

        <div className="ss-card">
          <div className="ss-cardTitle">
            <strong>Category drift</strong>
            <span className="ss-muted">Chart placeholder</span>
          </div>
          <div style={{ height: 220, marginTop: 10, borderRadius: 14, border: "1px dashed rgba(55,65,81,0.18)", background: "rgba(243,232,255,0.35)" }} />
          <div className="ss-muted" style={{ marginTop: 10 }}>
            Reserved for stacked bars / sankey / category share evolution.
          </div>
        </div>

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
    </div>
  );
}
