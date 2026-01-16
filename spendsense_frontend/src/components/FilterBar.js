import React, { useMemo } from "react";

/**
 * Transactions filter bar.
 * Controlled component: parent owns filter state and updates via onChange.
 */

// PUBLIC_INTERFACE
export default function FilterBar({ value, onChange, categories, statuses, onClear, isLoading }) {
  /** Renders the transactions filter controls. */
  const cats = useMemo(() => categories || [], [categories]);
  const stats = useMemo(() => statuses || [], [statuses]);

  const v = value || {};

  return (
    <div className="ss-card ss-filterBar" aria-label="Transaction filters">
      <div className="ss-cardTitle">
        <strong>Filters</strong>
        <span className="ss-muted">{isLoading ? "Applying…" : "Search & refine"}</span>
      </div>

      {/* aria-live for loading announcements */}
      <div className="u-ariaLive" aria-live="polite">
        {isLoading ? "Loading results…" : ""}
      </div>

      <div className="ss-filterGrid">
        <div className="ss-field" style={{ minWidth: 0 }}>
          <div className="ss-label">Search</div>
          <input
            className="ss-input"
            value={v.search || ""}
            onChange={(e) => onChange({ ...v, search: e.target.value })}
            placeholder="Merchant, category, status…"
            aria-label="Search transactions"
          />
        </div>

        <div className="ss-field">
          <div className="ss-label">From</div>
          <input
            className="ss-input"
            type="date"
            value={v.dateFrom || ""}
            onChange={(e) => onChange({ ...v, dateFrom: e.target.value })}
            aria-label="Start date"
          />
        </div>

        <div className="ss-field">
          <div className="ss-label">To</div>
          <input
            className="ss-input"
            type="date"
            value={v.dateTo || ""}
            onChange={(e) => onChange({ ...v, dateTo: e.target.value })}
            aria-label="End date"
          />
        </div>

        <div className="ss-field">
          <div className="ss-label">Category</div>
          <select
            className="ss-select"
            value={v.category || ""}
            onChange={(e) => onChange({ ...v, category: e.target.value })}
            aria-label="Category filter"
          >
            <option value="">All</option>
            {cats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="ss-field">
          <div className="ss-label">Amount min</div>
          <input
            className="ss-input"
            inputMode="decimal"
            value={v.minAmount || ""}
            onChange={(e) => onChange({ ...v, minAmount: e.target.value })}
            placeholder="e.g. 10"
            aria-label="Minimum amount"
          />
        </div>

        <div className="ss-field">
          <div className="ss-label">Amount max</div>
          <input
            className="ss-input"
            inputMode="decimal"
            value={v.maxAmount || ""}
            onChange={(e) => onChange({ ...v, maxAmount: e.target.value })}
            placeholder="e.g. 250"
            aria-label="Maximum amount"
          />
        </div>

        <div className="ss-field">
          <div className="ss-label">Status</div>
          <select
            className="ss-select"
            value={v.status || ""}
            onChange={(e) => onChange({ ...v, status: e.target.value })}
            aria-label="Status filter"
          >
            <option value="">All</option>
            {stats.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="ss-field">
          <div className="ss-label"> </div>
          <div className="u-row u-wrap">
            <button className="ss-btn" type="button" onClick={onClear} disabled={isLoading} aria-label="Clear filters">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
