import React, { useMemo } from "react";
import PageHeader from "../components/PageHeader";
import {
  BarChartPlaceholder,
  LineChartPlaceholder,
  PieChartPlaceholder
} from "../components/charts/ChartPlaceholders";

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

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Snapshot of your spending and trends (mocked data for now)."
        right={deltaBadge}
      />

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

      <div className="ss-grid ss-gridCols2" style={{ marginTop: 12 }}>
        <LineChartPlaceholder
          title="Spending trend"
          data={[10, 12, 11, 15, 14, 13]}
          labels={["W1", "W2", "W3", "W4"]}
        />
        <BarChartPlaceholder
          title="Category distribution"
          data={[1, 2, 3]}
          labels={["Dining", "Groceries", "Transport", "Bills", "Shopping"]}
        />
      </div>

      <div className="ss-grid ss-gridCols2" style={{ marginTop: 12 }}>
        <PieChartPlaceholder
          title="Income vs spend share"
          data={[60, 40]}
          labels={["Income", "Spend"]}
        />

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
      </div>
    </div>
  );
}
