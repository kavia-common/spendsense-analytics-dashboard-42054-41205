import React from "react";

// PUBLIC_INTERFACE
export default function EmptyState({ icon, title, description, ctaLabel, onCta }) {
  /** Standard empty state for lists/tiles/charts. */
  return (
    <div className="ss-empty" role="status" aria-live="polite">
      <div className="ss-emptyIcon" aria-hidden="true">
        {icon || "◻"}
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>{title || "Nothing here yet"}</div>
        <div className="ss-muted">{description || "Try adjusting your filters or connecting data sources."}</div>
      </div>
      {ctaLabel ? (
        <button className="ss-primaryBtn" type="button" onClick={onCta} aria-label={ctaLabel}>
          {ctaLabel}
        </button>
      ) : null}
    </div>
  );
}
