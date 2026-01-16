import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", sub: "Overview & trends", icon: "⌁", public: true },
  { to: "/transactions", label: "Transactions", sub: "Spending history", icon: "↕", public: true },
  { to: "/insights", label: "Insights", sub: "Patterns & tips", icon: "✦", public: false },
  { to: "/alerts", label: "Alerts", sub: "Anomalies & rules", icon: "!", public: false },
  { to: "/settings", label: "Settings", sub: "Preferences", icon: "⚙", public: false }
];

function getTitleFromPath(pathname) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/transactions")) return "Transactions";
  if (pathname.startsWith("/insights")) return "Insights";
  if (pathname.startsWith("/alerts")) return "Alerts";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/login")) return "Login";
  return "SpendSense";
}

// PUBLIC_INTERFACE
export default function LayoutShell() {
  /** Layout shell: responsive top navbar + sidebar navigation + main content outlet. */
  const location = useLocation();
  const { session, user, loading, signOut } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const title = useMemo(() => getTitleFromPath(location.pathname), [location.pathname]);

  const isAuthenticated = !!session && !!user;

  return (
    <>
      {sidebarOpen ? <div className="ss-backdrop" onClick={() => setSidebarOpen(false)} /> : null}

      <header className="ss-topnav" aria-label="Top navigation">
        <div className="ss-topnavLeft">
          <button
            className="ss-topnavMenuBtn"
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            title="Menu"
          >
            ☰
          </button>

          <Link to="/" className="ss-topnavBrand" onClick={() => setMobileMenuOpen(false)}>
            <div className="ss-brandMark" aria-hidden="true" style={{ width: 34, height: 34, borderRadius: 12 }} />
            <div className="ss-brandTitle">
              <strong>SpendSense</strong>
              <span>{title}</span>
            </div>
          </Link>
        </div>

        <nav className="ss-topnavLinks" aria-label="Primary links">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `ss-topnavLink ${isActive ? "ss-topnavLinkActive" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ss-topnavRight">
          <div className="ss-actions" aria-label="Quick actions">
            <button className="ss-iconBtn" type="button" aria-label="View alerts" title="Alerts">
              🔔
            </button>

            {isAuthenticated ? (
              <button
                className="ss-iconBtn"
                type="button"
                aria-label="Log out"
                title="Log out"
                onClick={signOut}
                disabled={loading}
              >
                ⎋
              </button>
            ) : (
              <NavLink to="/login" className="ss-iconBtn" aria-label="Log in" title="Log in">
                🔒
              </NavLink>
            )}
          </div>

          <div className="ss-topnavMenu">
            <button
              className="ss-topnavMenuBtn"
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              title="Navigation"
            >
              ⋮
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="ss-topnavDropdown" role="dialog" aria-label="Mobile navigation menu">
            <div className="ss-topnavDropdownLinks">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `ss-topnavDropdownLink ${isActive ? "ss-topnavLinkActive" : ""}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="ss-navIcon" aria-hidden="true" style={{ width: 26, height: 26, borderRadius: 10 }}>
                      {item.icon}
                    </span>
                    <span style={{ fontWeight: 650, fontSize: 13 }}>{item.label}</span>
                  </span>
                  <span className="ss-muted" style={{ fontSize: 12 }}>
                    {item.public ? "Public" : "Protected"}
                  </span>
                </NavLink>
              ))}
            </div>

            <div style={{ borderTop: "1px solid rgba(55, 65, 81, 0.10)", marginTop: 10, paddingTop: 10 }}>
              {isAuthenticated ? (
                <button
                  className="ss-primaryBtn"
                  type="button"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  disabled={loading}
                >
                  {loading ? "Signing out…" : "Log out"}
                </button>
              ) : (
                <NavLink to="/login" className="ss-primaryBtn" onClick={() => setMobileMenuOpen(false)}>
                  Log in
                </NavLink>
              )}
            </div>
          </div>
        ) : null}
      </header>

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
                className={({ isActive }) => `ss-navLink ${isActive ? "ss-navLinkActive" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="ss-navIcon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="ss-navText">
                  <strong>{item.label}</strong>
                  <span>
                    {item.sub} {item.public ? "• Public" : "• Protected"}
                  </span>
                </span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="ss-main" style={{ paddingTop: 0 }}>
          <section className="ss-content" aria-label="Main content" style={{ marginTop: 14 }}>
            <Outlet />
          </section>
        </main>
      </div>
    </>
  );
}
