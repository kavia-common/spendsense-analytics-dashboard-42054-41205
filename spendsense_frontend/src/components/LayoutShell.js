import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", sub: "Overview & trends", icon: "⌁" },
  { to: "/transactions", label: "Transactions", sub: "Spending history", icon: "↕" },
  { to: "/insights", label: "Insights", sub: "Patterns & tips", icon: "✦" },
  { to: "/alerts", label: "Alerts", sub: "Anomalies & rules", icon: "!" },
  { to: "/settings", label: "Settings", sub: "Preferences", icon: "⚙" }
];

function getTitleFromPath(pathname) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/transactions")) return "Transactions";
  if (pathname.startsWith("/insights")) return "Insights";
  if (pathname.startsWith("/alerts")) return "Alerts";
  if (pathname.startsWith("/settings")) return "Settings";
  return "SpendSense";
}

// PUBLIC_INTERFACE
export default function LayoutShell() {
  /** Layout shell: sidebar navigation, top bar, and main content outlet. */
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = useMemo(() => getTitleFromPath(location.pathname), [location.pathname]);

  return (
    <>
      {sidebarOpen ? <div className="ss-backdrop" onClick={() => setSidebarOpen(false)} /> : null}

      <div className="ss-shell">
        <aside className={`ss-sidebar ${sidebarOpen ? "ss-sidebarOpen" : ""}`} aria-label="Sidebar">
          <div className="ss-brand">
            <div className="ss-brandMark" aria-hidden="true" />
            <div className="ss-brandTitle">
              <strong>SpendSense</strong>
              <span>Analytics Dashboard</span>
            </div>
          </div>

          <nav className="ss-nav" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `ss-navLink ${isActive ? "ss-navLinkActive" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span className="ss-navIcon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="ss-navText">
                  <strong>{item.label}</strong>
                  <span>{item.sub}</span>
                </span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="ss-main">
          <div className="ss-mobileHeader">
            <button
              className="ss-hamburger"
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            >
              ☰
            </button>
            <div className="ss-brandTitle">
              <strong>SpendSense</strong>
              <span>{title}</span>
            </div>
          </div>

          <header className="ss-topbar" aria-label="Top bar">
            <div className="ss-topbarTitle">
              <h1>{title}</h1>
              <p>Royal Purple • elegant insights at a glance</p>
            </div>

            <div className="ss-search" role="search">
              <span aria-hidden="true">⌕</span>
              <input placeholder="Search merchants, categories…" aria-label="Search" />
            </div>

            <div className="ss-actions">
              <button className="ss-iconBtn" type="button" aria-label="View alerts">
                🔔
              </button>
              <button className="ss-primaryBtn" type="button">
                Add transaction
              </button>
            </div>
          </header>

          <section className="ss-content" aria-label="Main content">
            <Outlet />
          </section>
        </main>
      </div>
    </>
  );
}
