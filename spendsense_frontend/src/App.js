import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import LayoutShell from "./components/LayoutShell";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

// PUBLIC_INTERFACE
function App() {
  /** SpendSense application root: routing and global layout shell. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Standalone auth route (must not render inside LayoutShell) */}
          <Route path="/login" element={<Login />} />

          {/* Authenticated app shell routes */}
          <Route
            element={
              <ProtectedRoute>
                <LayoutShell />
              </ProtectedRoute>
            }
          >
            {/* Post-login landing per design: /dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Back-compat / convenience: root goes to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
