import React from "react";

function Box({ className, style }) {
  return <div className={`ss-skeleton ${className || ""}`} style={style} />;
}

// PUBLIC_INTERFACE
export function SkeletonCard({ lines = 3 }) {
  /** Skeleton placeholder shaped like a card block with header + lines. */
  return (
    <div className="ss-card" aria-label="Loading card">
      <div className="u-spread" style={{ marginBottom: 10 }}>
        <Box className="ss-skeletonTitle" style={{ width: "45%" }} />
        <Box className="ss-skeletonLine" style={{ width: "25%" }} />
      </div>
      {Array.from({ length: lines }).map((_, idx) => (
        <Box key={idx} className="ss-skeletonLine" style={{ width: `${92 - idx * 10}%`, marginTop: 10 }} />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
export function SkeletonTable({ rows = 6, cols = 5 }) {
  /** Skeleton placeholder for a table: header + rows. */
  return (
    <div className="ss-card" aria-label="Loading table">
      <div className="u-spread" style={{ marginBottom: 10 }}>
        <Box className="ss-skeletonTitle" style={{ width: "35%" }} />
        <Box className="ss-skeletonLine" style={{ width: "20%" }} />
      </div>

      <div className="ss-table" aria-hidden="true" style={{ padding: 12 }}>
        <div className="u-row u-wrap" style={{ gap: 8, paddingBottom: 10 }}>
          {Array.from({ length: cols }).map((_, i) => (
            <Box key={i} className="ss-skeletonLine" style={{ width: `${Math.max(12, 20 - i * 2)}%`, height: 10 }} />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="u-row u-wrap" style={{ gap: 8, paddingTop: 10 }}>
            {Array.from({ length: cols }).map((__, c) => (
              <Box
                key={c}
                className="ss-skeletonLine"
                style={{ width: `${Math.max(14, 24 - c * 2)}%`, height: 12 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function SkeletonChart() {
  /** Skeleton placeholder for a chart block. */
  return (
    <div className="ss-card" aria-label="Loading chart">
      <div className="u-spread" style={{ marginBottom: 10 }}>
        <Box className="ss-skeletonTitle" style={{ width: "40%" }} />
        <Box className="ss-skeletonLine" style={{ width: "22%" }} />
      </div>
      <Box className="ss-skeletonBlock" />
      <Box className="ss-skeletonLine" style={{ width: "70%", marginTop: 10 }} />
    </div>
  );
}
