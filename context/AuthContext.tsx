"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signOut, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase-client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasPurchase: boolean;
  justLoggedIn: boolean;
  confirmationResult: ConfirmationResult | null;
  sendOTP: (phone: string, recaptchaVerifier: RecaptchaVerifier) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  checkPurchase: (phone: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchase, setHasPurchase] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser?.phoneNumber) {
        const purchased = await checkPurchase(firebaseUser.phoneNumber);
        setHasPurchase(purchased);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function sendOTP(phone: string, recaptchaVerifier: RecaptchaVerifier) {
    const result = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
    setConfirmationResult(result);
  }

  async function verifyOTP(otp: string) {
    if (!confirmationResult) throw new Error("No OTP sent. Please request OTP first.");
    const result = await confirmationResult.confirm(otp);
    const idToken = await result.user.getIdToken();

    await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, phoneNumber: result.user.phoneNumber }),
    });

    if (result.user.phoneNumber) {
      const purchased = await checkPurchase(result.user.phoneNumber);
      setHasPurchase(purchased);
    }
    setJustLoggedIn(true);
    setTimeout(() => setJustLoggedIn(false), 3000);
  }

  async function checkPurchase(phone: string): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/verify-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      return data.hasPurchase === true;
    } catch {
      return false;
    }
  }

  async function logout() {
    await signOut(auth);
    setHasPurchase(false);
    setConfirmationResult(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, hasPurchase, justLoggedIn, confirmationResult, sendOTP, verifyOTP, logout, checkPurchase }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
