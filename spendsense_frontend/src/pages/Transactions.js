import React, { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";

const MOCK_TX = [
  { id: "t1", date: "2026-01-12", merchant: "Luna Cafe", category: "Dining", amount: -18.25, status: "Cleared" },
  { id: "t2", date: "2026-01-11", merchant: "Metro Transit", category: "Transport", amount: -2.75, status: "Cleared" },
  { id: "t3", date: "2026-01-10", merchant: "BrightMart", category: "Groceries", amount: -64.39, status: "Pending" },
  { id: "t4", date: "2026-01-09", merchant: "Payroll", category: "Income", amount: 2450.0, status: "Cleared" }
];

function formatMoney(v) {
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

// PUBLIC_INTERFACE
export default function Transactions() {
  /** Transactions list page with mocked data; ready to connect to backend later. */
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_TX;
    return MOCK_TX.filter((t) =>
      `${t.merchant} ${t.category} ${t.status}`.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Review and search your transaction history (mocked)."
        right={
          <span className="ss-badge">
            ⌁ {filtered.length} shown
          </span>
        }
      />

      <div className="ss-card" style={{ marginBottom: 12 }}>
        <div className="ss-cardTitle">
          <strong>Quick filter</strong>
          <span className="ss-muted">UI-only</span>
        </div>
        <div className="ss-search" style={{ maxWidth: 520 }}>
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search merchant, category, status…"
            aria-label="Filter transactions"
          />
        </div>
      </div>

      <div className="ss-card">
        <div className="ss-cardTitle">
          <strong>Latest activity</strong>
          <span className="ss-muted">Backend integration pending</span>
        </div>

        <table className="ss-table" aria-label="Transactions table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Merchant</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const isIncome = t.amount > 0;
              return (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.merchant}</td>
                  <td>{t.category}</td>
                  <td style={{ fontWeight: 650, color: isIncome ? "var(--color-success)" : "var(--color-text)" }}>
                    {formatMoney(t.amount)}
                  </td>
                  <td>
                    <span className={`ss-badge ${t.status === "Pending" ? "" : "ss-badgeSuccess"}`}>
                      {t.status === "Pending" ? "⏳" : "✓"} {t.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="ss-muted" style={{ marginTop: 10 }}>
          Planned: pagination, export, category rules, and vendor normalization.
        </div>
      </div>
    </div>
  );
}
