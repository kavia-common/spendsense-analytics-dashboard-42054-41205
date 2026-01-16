import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { SkeletonCard, SkeletonChart } from "../components/Skeletons";
import { BarChartPlaceholder, LineChartPlaceholder, PieChartPlaceholder } from "../components/charts/ChartPlaceholders";

const MOCK = {
  monthSpend: 2483.19,
  monthDeltaPct: -6.2,
  savings: 412.0,
  alerts: 2,
  topCategories: [
    { name: "Dining", amount: 482.12 },
    { name: "Groceries", amount: 389.44 },
    { name: "Transport", amount: 210.33 }
  ]
};

function formatMoney(v) {
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Dashboard overview page with mocked analytics and placeholders. */
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    // Simulate async fetch; in real integration this would wrap API calls.
    const t = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const deltaBadge = useMemo(() => {
    const isGood = MOCK.monthDeltaPct < 0;
    const cls = `ss-badge ${isGood ? "ss-badgeSuccess" : "ss-badgeError"}`;
    const label = `${MOCK.monthDeltaPct > 0 ? "+" : ""}${MOCK.monthDeltaPct}%`;
    return (
      <span className={cls}>
        {isGood ? "↓" : "↑"} {label} vs last month
      </span>
    );
  }, []);

  const metrics = (
    <div className="ss-grid ss-gridCols4">
      <div className="ss-card">
        <div className="ss-cardTitle">
          <strong>This month</strong>
          <span className="ss-muted">Spend</span>
        </div>
        <div className="ss-metricValue">{formatMoney(MOCK.monthSpend)}</div>
        <div className="ss-muted">Goal: keep under $2,600</div>
      </div>

      <div className="ss-card">
        <div className="ss-cardTitle">
          <strong>Saved</strong>
          <span className="ss-muted">Net</span>
        </div>
        <div className="ss-metricValue">{formatMoney(MOCK.savings)}</div>
        <div className="ss-muted">Based on monthly budget targets</div>
      </div>

      <div className="ss-card">
        <div className="ss-cardTitle">
          <strong>Active alerts</strong>
          <span className="ss-muted">Risk</span>
        </div>
        <div className="ss-metricValue">{MOCK.alerts}</div>
        <div className="ss-muted">Unusual activity & reminders</div>
      </div>

      <div className="ss-card">
        <div className="ss-cardTitle">
          <strong>Health</strong>
          <span className="ss-muted">Score</span>
        </div>
        <div className="ss-metricValue">82</div>
        <div className="ss-muted">Placeholder score model</div>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Snapshot of your spending and trends (mocked data for now)."
        right={
          <span className="u-row u-wrap">
            {deltaBadge}
            <button className="ss-btn" type="button" onClick={() => setHasData((v) => !v)} aria-label="Toggle mock data">
              {hasData ? "Simulate empty" : "Simulate data"}
            </button>
          </span>
        }
      />

      {isLoading ? (
        <div className="ss-grid ss-gridCols4">
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
        </div>
      ) : hasData ? (
        metrics
      ) : (
        <EmptyState
          icon="◔"
          title="No dashboard data yet"
          description="Connect a data source or try again later. Once data arrives, charts and top categories will populate here."
          ctaLabel="Connect data"
          onCta={() => {
            // Placeholder CTA for future integration
            window.alert("Connect data: placeholder action");
          }}
        />
      )}

      <div className="ss-grid ss-gridCols2" style={{ marginTop: 12 }}>
        {isLoading ? (
          <>
            <SkeletonChart />
            <SkeletonChart />
          </>
        ) : hasData ? (
          <>
            <LineChartPlaceholder title="Spending trend" data={[10, 12, 11, 15, 14, 13]} labels={["W1", "W2", "W3", "W4"]} />
            <BarChartPlaceholder
              title="Category distribution"
              data={[1, 2, 3]}
              labels={["Dining", "Groceries", "Transport", "Bills", "Shopping"]}
            />
          </>
        ) : (
          <>
            <EmptyState icon="⌁" title="No trend data" description="Try connecting transactions to unlock trend charts." ctaLabel="Connect data" onCta={() => window.alert("Placeholder")} />
            <EmptyState icon="◑" title="No categories to show" description="Once transactions are available, we’ll compute category distribution." ctaLabel="Connect data" onCta={() => window.alert("Placeholder")} />
          </>
        )}
      </div>

      <div className="ss-grid ss-gridCols2" style={{ marginTop: 12 }}>
        {isLoading ? (
          <>
            <SkeletonChart />
            <SkeletonCard lines={6} />
          </>
        ) : hasData ? (
          <>
            <PieChartPlaceholder title="Income vs spend share" data={[60, 40]} labels={["Income", "Spend"]} />

            <div className="ss-card">
              <div className="ss-cardTitle">
                <strong>Top categories</strong>
                <span className="ss-muted">This month</span>
              </div>

              <table className="ss-table" aria-label="Top categories table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK.topCategories.map((c) => (
                    <tr key={c.name}>
                      <td>{c.name}</td>
                      <td>{formatMoney(c.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="ss-muted" style={{ marginTop: 10 }}>
                Tip: focus on the top 1–2 categories for quickest impact.
              </div>
            </div>
          </>
        ) : (
          <>
            <EmptyState icon="◕" title="No share chart" description="Income/spend share will appear once we have categorized cashflow." ctaLabel="Connect data" onCta={() => window.alert("Placeholder")} />
            <EmptyState icon="▦" title="No categories found" description="Adjust filters or connect your accounts to see top categories." ctaLabel="Adjust filters" onCta={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
          </>
        )}
      </div>
    </div>
  );
}
