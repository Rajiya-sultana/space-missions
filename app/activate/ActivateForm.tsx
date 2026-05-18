"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { products } from "@/data/products";

type Mode = "register" | "signin";

export default function ActivateForm() {
  const params = useSearchParams();
  const router = useRouter();
  const productSlug = params.get("product") ?? "";
  const product = products.find((p) => p.slug === productSlug);

  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!product) {
    return (
      <div className="text-center p-8 max-w-sm w-full">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid link</h1>
        <p className="text-gray-500 text-sm">
          This activation link is not valid. Please check the card inside your
          workbook and try scanning again.
        </p>
        <a
          href={`https://wa.me/919263358336?text=${encodeURIComponent("Hi! I'm trying to activate my Learn What Matters workbook but the link isn't working. Can you help me?")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold mt-6 px-4 py-2 rounded-lg border text-green-700 border-green-400 hover:bg-green-50 transition-colors"
        >
          <WhatsAppIcon /> Need help? Chat with us
        </a>
      </div>
    );
  }

  async function addPurchaseWithToken(token: string) {
    await fetch("/api/auth/add-purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productSlug }),
    });
  }

  async function handleRegister() {
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!password) { setError("Please enter a password"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords don't match"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, productSlug }),
      });

      if (res.status === 409) {
        setMode("signin");
        setConfirmPassword("");
        setError("You already have an account. Please sign in with your existing password.");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      // Account created — sign in client-side to establish session
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError || !data.session) {
        // Shouldn't normally happen, but fall back gracefully
        setMode("signin");
        setError("Account created! Please sign in with your new password.");
        return;
      }

      setDone(true);
      setTimeout(() => router.push(`/${productSlug}`), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
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
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Incorrect email or password. Please try again.");
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.session) {
        await addPurchaseWithToken(data.session.access_token);
      }

      setDone(true);
      setTimeout(() => router.push(`/${productSlug}`), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center p-8 max-w-sm w-full">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">You&apos;re in!</h2>
        <p className="text-gray-500 text-sm">Taking you to your videos…</p>
      </div>
    );
  }

  const inputCls =
    "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500 w-full";

  return (
    <div className="w-full max-w-sm">
      {/* Brand */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">{product.icon}</div>
        <h1 className="text-xl font-bold text-gray-900">{product.title}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {mode === "register"
            ? "Create your account to unlock your videos"
            : "Sign in to unlock your videos"}
        </p>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8">
        <div className="flex flex-col gap-3 mb-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (mode === "register" ? handleRegister() : handleSignIn())}
            autoComplete="email"
            className={inputCls}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (mode === "register" ? handleRegister() : handleSignIn())}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              className={`${inputCls} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:opacity-70 transition-opacity"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>

          {mode === "register" && (
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

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={mode === "register" ? handleRegister : handleSignIn}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm transition-colors mb-4"
        >
          {loading
            ? "Please wait…"
            : mode === "register"
            ? "Activate Access →"
            : "Sign In →"}
        </button>

        <div className="text-center mb-4">
          {mode === "register" ? (
            <button
              onClick={() => { setMode("signin"); setError(""); setConfirmPassword(""); }}
              className="text-gray-400 text-xs hover:text-gray-600 transition-colors"
            >
              Already have an account? Sign in instead
            </button>
          ) : (
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className="text-gray-400 text-xs hover:text-gray-600 transition-colors"
            >
              New here? Create an account
            </button>
          )}
        </div>

        <div className="flex justify-center">
          <a
            href={`https://wa.me/919263358336?text=${encodeURIComponent("Hi! I bought the Learn What Matters workbook on Amazon and I'm having trouble activating my account. Can you please help me?")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg border text-green-700 border-green-400 hover:bg-green-50 transition-colors"
          >
            <WhatsAppIcon /> Need help? Chat with us
          </a>
        </div>
      </div>
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.528 5.855L.057 23.012a.75.75 0 0 0 .93.93l5.157-1.471A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.5-5.208-1.377l-.374-.214-3.878 1.107 1.107-3.878-.214-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}
