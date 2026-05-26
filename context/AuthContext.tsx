"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { firebaseAuth } from "@/lib/firebase-client";
import { User, onAuthStateChanged, signOut } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  purchaseMap: Record<string, boolean>;
  justLoggedIn: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseMap, setPurchaseMap] = useState<Record<string, boolean>>({});
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const prevUserRef = useRef<User | null>(null);

  async function fetchPurchases(phone: string) {
    try {
      const res = await fetch("/api/auth/verify-purchases-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data: { purchases?: Record<string, boolean> } = await res.json();
      setPurchaseMap(data.purchases ?? {});
    } catch {
      setPurchaseMap({});
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser && !prevUserRef.current) {
        setJustLoggedIn(true);
        setTimeout(() => setJustLoggedIn(false), 3000);
      }
      prevUserRef.current = firebaseUser;
      setUser(firebaseUser);
      if (firebaseUser?.phoneNumber) {
        fetchPurchases(firebaseUser.phoneNumber);
      } else {
        setPurchaseMap({});
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function logout() {
    await signOut(firebaseAuth);
    setPurchaseMap({});
  }

  return (
    <AuthContext.Provider value={{ user, loading, purchaseMap, justLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
