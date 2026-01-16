import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// PUBLIC_INTERFACE
export default function ProtectedRoute({ children }) {
  /** Route guard placeholder: redirects to /login when unauthenticated. */
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve where the user was trying to go for a nicer demo flow.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
