import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import FilterChips from "../components/FilterChips";
import EmptyState from "../components/EmptyState";
import { SkeletonTable } from "../components/Skeletons";
import { useQueryFilters } from "../components/useQueryFilters";

const MOCK_TX = [
  { id: "t1", date: "2026-01-12", merchant: "Luna Cafe", category: "Dining", amount: -18.25, status: "Cleared" },
  { id: "t2", date: "2026-01-11", merchant: "Metro Transit", category: "Transport", amount: -2.75, status: "Cleared" },
  { id: "t3", date: "2026-01-10", merchant: "BrightMart", category: "Groceries", amount: -64.39, status: "Pending" },
  { id: "t4", date: "2026-01-09", merchant: "Payroll", category: "Income", amount: 2450.0, status: "Cleared" }
];

const FILTER_KEYS = ["search", "dateFrom", "dateTo", "category", "minAmount", "maxAmount", "status"];

function formatMoney(v) {
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function parseAmount(s) {
  if (s === undefined || s === null) return null;
  const v = Number(String(s).replace(/[^0-9.+-]/g, ""));
  if (Number.isNaN(v)) return null;
  return v;
}

// PUBLIC_INTERFACE
export default function Transactions() {
  /** Transactions list page with mocked data; includes URL-synced filters and consistent loading/empty states. */
  const { value: queryValue, setValue: setQueryValue } = useQueryFilters(FILTER_KEYS);
  const [filters, setFilters] = useState(() => ({
    search: "",
    dateFrom: "",
    dateTo: "",
    category: "",
    minAmount: "",
    maxAmount: "",
    status: ""
  }));

  const [isLoading, setIsLoading] = useState(false);

  // Sync from URL -> state when URL changes (deep-linking)
  useEffect(() => {
    setFilters((prev) => ({ ...prev, ...queryValue }));
  }, [queryValue]);

  // Whenever filters change, persist to URL and simulate loading
  useEffect(() => {
    setQueryValue(filters);
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 350); // mimic fetch
    return () => clearTimeout(t);
  }, [filters, setQueryValue]);

  const categories = useMemo(() => {
    const set = new Set(MOCK_TX.map((t) => t.category));
    return Array.from(set.values()).sort();
  }, []);

  const statuses = useMemo(() => {
    const set = new Set(MOCK_TX.map((t) => t.status));
    return Array.from(set.values()).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = String(filters.search || "").trim().toLowerCase();
    const from = String(filters.dateFrom || "").trim();
    const to = String(filters.dateTo || "").trim();
    const cat = String(filters.category || "").trim();
    const status = String(filters.status || "").trim();
    const minA = parseAmount(filters.minAmount);
    const maxA = parseAmount(filters.maxAmount);

    return MOCK_TX.filter((t) => {
      if (q) {
        const hay = `${t.merchant} ${t.category} ${t.status}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (from && t.date < from) return false;
      if (to && t.date > to) return false;
      if (cat && t.category !== cat) return false;
      if (status && t.status !== status) return false;

      // Amount filters should apply to absolute spend/income magnitude to feel intuitive.
      const abs = Math.abs(t.amount);
      if (minA !== null && abs < minA) return false;
      if (maxA !== null && abs > maxA) return false;
      return true;
    });
  }, [filters]);

  const hasAnyFilter = useMemo(() => {
    return Object.values(filters).some((v) => v !== undefined && v !== null && String(v).trim() !== "");
  }, [filters]);

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Review and filter your transaction history (mocked)."
        right={<span className="ss-badge">⌁ {filtered.length} shown</span>}
      />

      <FilterBar
        value={filters}
        onChange={setFilters}
        categories={categories}
        statuses={statuses}
        isLoading={isLoading}
        onClear={() =>
          setFilters({
            search: "",
            dateFrom: "",
            dateTo: "",
            category: "",
            minAmount: "",
            maxAmount: "",
            status: ""
          })
        }
      />

      <div style={{ marginTop: 12 }}>
        <FilterChips
          value={filters}
          emptyLabel="No active filters. Tip: try searching for a merchant or filtering by category."
          onRemove={(key) => setFilters((prev) => ({ ...prev, [key]: "" }))}
          onClearAll={() =>
            setFilters({
              search: "",
              dateFrom: "",
              dateTo: "",
              category: "",
              minAmount: "",
              maxAmount: "",
              status: ""
            })
          }
        />
      </div>

      <div className="u-mt-3">
        {isLoading ? (
          <SkeletonTable rows={6} cols={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="⌕"
            title="No transactions match your filters"
            description={hasAnyFilter ? "Try clearing filters or widening your date/amount range." : "Connect data to see transactions here."}
            ctaLabel={hasAnyFilter ? "Adjust filters" : "Connect data"}
            onCta={() => {
              if (hasAnyFilter) {
                setFilters({
                  search: "",
                  dateFrom: "",
                  dateTo: "",
                  category: "",
                  minAmount: "",
                  maxAmount: "",
                  status: ""
                });
              } else {
                window.alert("Connect data: placeholder action");
              }
            }}
          />
        ) : (
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
                        <span className={`ss-badge ${t.status === "Pending" ? "ss-badgeWarning" : "ss-badgeSuccess"}`}>
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
        )}
      </div>
    </div>
  );
}
