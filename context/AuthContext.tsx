"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  purchaseMap: Record<string, boolean>;
  justLoggedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseMap, setPurchaseMap] = useState<Record<string, boolean>>({});
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  async function fetchPurchases(email: string) {
    try {
      const res = await fetch("/api/auth/verify-purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data: { purchases?: Record<string, boolean> } = await res.json();
      setPurchaseMap(data.purchases ?? {});
    } catch {
      setPurchaseMap({});
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) fetchPurchases(session.user.email);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        fetchPurchases(session.user.email);
      } else {
        setPurchaseMap({});
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setJustLoggedIn(true);
    setTimeout(() => setJustLoggedIn(false), 3000);
  }

  async function logout() {
    await supabase.auth.signOut();
    setPurchaseMap({});
  }

  return (
    <AuthContext.Provider value={{ user, loading, purchaseMap, justLoggedIn, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
