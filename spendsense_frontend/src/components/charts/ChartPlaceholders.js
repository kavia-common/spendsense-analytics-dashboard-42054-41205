import React, { useMemo } from "react";

function clampNumber(n, min, max) {
  if (typeof n !== "number" || Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function buildSeededBars(count) {
  // Deterministic "random" heights to keep UI stable across renders.
  const heights = [];
  for (let i = 0; i < count; i += 1) {
    const base = (Math.sin(i * 1.7) + 1) / 2; // 0..1
    const h = 24 + base * 64;
    heights.push(Math.round(h));
  }
  return heights;
}

function ChartFrame({ title, subtitle, variant, children }) {
  return (
    <div className="ss-card ss-chartCard">
      <div className="ss-cardTitle">
        <strong>{title || "Chart"}</strong>
        <span className="ss-muted">{subtitle || `${variant} placeholder`}</span>
      </div>

      <div className="ss-chartBody" aria-label={`${variant} chart placeholder`}>
        {children}
      </div>

      <div className="ss-muted" style={{ marginTop: 10 }}>
        Placeholder component: props accepted (title, data, labels) for future real chart integration.
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function LineChartPlaceholder({ title, data, labels }) {
  /** Placeholder for a line/area chart. Accepts props for future integration; currently unused. */
  const points = useMemo(() => {
    const count = clampNumber(Array.isArray(data) ? data.length : 8, 6, 12);
    const xs = [];
    for (let i = 0; i < count; i += 1) xs.push(i);
    return xs;
  }, [data]);

  return (
    <ChartFrame title={title} variant="Line" subtitle="Trend">
      <div className="ss-chartGrid" aria-hidden="true">
        <div className="ss-chartLine">
          {points.map((i) => (
            <span key={i} className="ss-chartDot" />
          ))}
        </div>
      </div>
      {/* data, labels are intentionally unused for now */}
      <span style={{ display: "none" }}>
        {String(!!labels)}{String(!!data)}
      </span>
    </ChartFrame>
  );
}

// PUBLIC_INTERFACE
export function BarChartPlaceholder({ title, data, labels }) {
  /** Placeholder for a bar chart. Accepts props for future integration; currently unused. */
  const bars = useMemo(() => {
    const count = clampNumber(Array.isArray(labels) ? labels.length : 10, 6, 14);
    return buildSeededBars(count);
  }, [labels]);

  return (
    <ChartFrame title={title} variant="Bar" subtitle="Distribution">
      <div className="ss-barRow" aria-hidden="true">
        {bars.map((h, idx) => (
          <div key={idx} className="ss-barWrap">
            <div className="ss-bar" style={{ height: h }} />
          </div>
        ))}
      </div>
      <span style={{ display: "none" }}>
        {String(!!labels)}{String(!!data)}
      </span>
    </ChartFrame>
  );
}

// PUBLIC_INTERFACE
export function PieChartPlaceholder({ title, data, labels }) {
  /** Placeholder for a pie/donut chart. Accepts props for future integration; currently unused. */
  return (
    <ChartFrame title={title} variant="Pie" subtitle="Share">
      <div className="ss-pieWrap" aria-hidden="true">
        <div className="ss-pie" />
        <div className="ss-pieCenter" />
      </div>
      <span style={{ display: "none" }}>
        {String(!!labels)}{String(!!data)}
      </span>
    </ChartFrame>
  );
}
