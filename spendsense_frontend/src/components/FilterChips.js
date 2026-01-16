import React, { useMemo } from "react";

function isTruthyValue(v) {
  return v !== undefined && v !== null && String(v).trim() !== "";
}

function formatChipLabel(key, value) {
  const map = {
    search: "Search",
    dateFrom: "From",
    dateTo: "To",
    category: "Category",
    minAmount: "Min",
    maxAmount: "Max",
    status: "Status",
    severity: "Severity",
    type: "Type",
    enabled: "Enabled"
  };
  const k = map[key] || key;
  return `${k}: ${value}`;
}

// PUBLIC_INTERFACE
export default function FilterChips({ value, onRemove, onClearAll, emptyLabel }) {
  /** Shows active filter chips (clearable). */
  const v = value || {};

  const chips = useMemo(() => {
    return Object.keys(v)
      .filter((k) => isTruthyValue(v[k]))
      .map((k) => ({ key: k, value: v[k] }));
  }, [v]);

  if (chips.length === 0) {
    return (
      <div className="ss-card" style={{ padding: 12 }}>
        <div className="ss-muted">{emptyLabel || "No filters applied."}</div>
      </div>
    );
  }

  return (
    <div className="ss-card" style={{ padding: 12 }} aria-label="Active filters">
      <div className="u-spread">
        <div className="ss-muted" style={{ fontWeight: 650 }}>
          Active filters
        </div>
        <button className="ss-btn" type="button" onClick={onClearAll} aria-label="Clear all filters">
          Clear all
        </button>
      </div>

      <div className="ss-chipRow u-mt-2">
        {chips.map((c) => (
          <span key={c.key} className="ss-chip" role="button" tabIndex={0} aria-label={`Remove ${c.key} filter`}>
            {formatChipLabel(c.key, c.value)}
            <button
              type="button"
              className="ss-chipClearBtn"
              onClick={() => onRemove(c.key)}
              aria-label={`Remove ${c.key}`}
              title="Remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
