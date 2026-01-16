import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * Auth context backed by Supabase auth.
 * Exposes session/user and helpers for login/logout.
 */

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides Supabase session + auth helpers to the app. */
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  // "loading" is used for:
  // - initial session check on mount
  // - auth actions (sign-in/out) to disable buttons / show spinners
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!mounted) return;
        const nextSession = data?.session ?? null;
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
      } catch (e) {
        // In case of auth errors, we fall back to a signed-out state.
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    // Keep local state in sync with Supabase auth changes (sign-in/out, token refresh, etc.)
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      // Do not force loading=true here; this is a realtime update.
    });

    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Supabase will also trigger onAuthStateChange, but we set immediately for snappy UX.
      setSession(data?.session ?? null);
      setUser(data?.user ?? data?.session?.user ?? null);

      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      signIn,
      signOut
    }),
    [session, user, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Returns the current auth context. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
