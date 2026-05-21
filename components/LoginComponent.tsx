"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase-client";

interface Props {
  productSlug?: string;
  lightMode?: boolean;
}

type Mode = "signin" | "register" | "forgot";

export default function LoginComponent({ lightMode = false }: Props) {
  const { signIn } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setPassword("");
    setConfirmPassword("");
    setResetSent(false);
  }

  async function handleForgotPassword() {
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err: unknown) {
      setError((err as { message?: string }).message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!password) { setError("Please enter your password"); return; }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? "Login failed";
      if (msg.includes("Invalid login credentials")) {
        setError("Incorrect email or password. Please try again.");
      } else if (msg.includes("Email not confirmed")) {
        setError("Please verify your email first.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!password) { setError("Please enter a password"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords don't match"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.status === 409) {
        setError("An account with this email already exists. Please sign in instead.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Account created — sign in immediately
      await signIn(email.trim(), password);
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const cardCls = lightMode
    ? "bg-white border border-gray-200 shadow-sm rounded-2xl p-8 w-full"
    : "glass-card rounded-2xl p-8 w-full";
  const headingCls = lightMode
    ? "font-bold text-gray-900 text-xl mb-1 text-center"
    : "font-bold text-white text-xl mb-1 text-center";
  const subtitleCls = lightMode
    ? "text-gray-500 text-sm text-center mb-6"
    : "text-slate-400 text-sm text-center mb-6";
  const inputCls = lightMode
    ? "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
    : "bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500";
  const eyeCls = lightMode ? "text-gray-400" : "text-slate-400";
  const toggleCls = lightMode
    ? "text-gray-400 hover:text-gray-600 transition-colors"
    : "text-slate-500 hover:text-slate-300 transition-colors";

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  return (
    <div className={cardCls}>
      <h2 className={headingCls}>
        {isRegister ? "Create your account" : isForgot ? "Reset your password" : "Sign in to continue"}
      </h2>
      <p className={subtitleCls}>
        {isRegister
          ? "Use the email from your order confirmation"
          : isForgot
          ? "We'll send a reset link to your email"
          : "Enter the email you used when purchasing"}
      </p>

      {/* Forgot password — success state */}
      {isForgot && resetSent ? (
        <div className={`rounded-xl p-4 mb-4 text-sm text-center ${lightMode ? "bg-green-50 text-green-700" : "bg-green-500/10 text-green-400"}`}>
          ✅ Reset link sent! Check your inbox and follow the link to set a new password.
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                if (isForgot) handleForgotPassword();
                else if (isRegister) handleRegister();
                else handleSignIn();
              }}
              autoComplete="email"
              className={inputCls}
            />

            {!isForgot && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (isRegister ? handleRegister() : handleSignIn())}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  className={`${inputCls} w-full pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70 ${eyeCls}`}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            )}

            {isRegister && (
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                autoComplete="new-password"
                className={inputCls}
              />
            )}
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            onClick={isForgot ? handleForgotPassword : isRegister ? handleRegister : handleSignIn}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm transition-colors"
          >
            {loading
              ? "Please wait…"
              : isForgot
              ? "Send Reset Link →"
              : isRegister
              ? "Create Account →"
              : "Sign In →"}
          </button>
        </>
      )}

      <div className="text-center mt-3 mb-4 flex flex-col gap-1">
        {mode === "signin" && (
          <>
            <button onClick={() => switchMode("register")} className={`text-xs ${toggleCls}`}>
              New here? <span className="underline">Create an account</span>
            </button>
            <button onClick={() => switchMode("forgot")} className={`text-xs ${toggleCls}`}>
              Forgot your password? <span className="underline">Reset it</span>
            </button>
          </>
        )}
        {mode === "register" && (
          <button onClick={() => switchMode("signin")} className={`text-xs ${toggleCls}`}>
            Already have an account? <span className="underline">Sign in</span>
          </button>
        )}
        {mode === "forgot" && (
          <button onClick={() => switchMode("signin")} className={`text-xs ${toggleCls}`}>
            ← Back to sign in
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={`https://wa.me/919263358336?text=${encodeURIComponent("Hi! I bought a Learn What Matters workbook but I'm having trouble signing in. Can you please help me?")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg border transition-colors ${lightMode ? "text-green-700 border-green-400 hover:bg-green-50" : "text-green-400 border-green-500/50 hover:bg-green-500/10"}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.528 5.855L.057 23.012a.75.75 0 0 0 .93.93l5.157-1.471A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.5-5.208-1.377l-.374-.214-3.878 1.107 1.107-3.878-.214-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Need help? Chat with us
        </a>
      </div>
    </div>
  );
}
