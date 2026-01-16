import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { SkeletonCard } from "../components/Skeletons";
import { useAuth } from "./AuthContext";

// PUBLIC_INTERFACE
export default function ProtectedRoute({ children }) {
  /** Route guard: waits for auth to resolve, then redirects to /login when unauthenticated. */
  const { session, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Lightweight loading skeleton to avoid flashing redirect while session is being restored.
    return (
      <div aria-label="Loading protected content" style={{ display: "grid", gap: 12 }}>
        <SkeletonCard lines={2} />
        <SkeletonCard lines={3} />
      </div>
    );
  }

  const isAuthed = !!session && !!user;
  if (!isAuthed) {
    // Preserve where the user was trying to go.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
