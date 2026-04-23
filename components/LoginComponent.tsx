"use client";

import { useState, useEffect, useRef } from "react";
import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { useAuth } from "@/context/AuthContext";
import OTPVerificationComponent from "@/components/OTPVerificationComponent";

export default function LoginComponent() {
  const { sendOTP } = useAuth();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);


  function getFullPhone() {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) return `+91${digits}`;
    if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
    return `+${digits}`;
  }

  async function handleSendOTP() {
    setError("");
    const digits = phone.replace(/\D/g, "");

    if (digits.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
        await recaptchaRef.current.render();
      }
      await sendOTP(getFullPhone(), recaptchaRef.current);
      setOtpSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      console.error("sendOTP error:", err);
      if (code === "auth/invalid-phone-number") {
        setError("Invalid phone number. Please enter a valid Indian mobile number.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (code === "auth/billing-not-enabled") {
        setError("Service temporarily unavailable. Please try again later.");
      } else {
        setError(`Failed to send OTP (${code ?? "unknown"}). Please try again.`);
      }
      // Reset reCAPTCHA on error
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      verifier.render();
      recaptchaRef.current = verifier;
    } finally {
      setLoading(false);
    }
  }

  if (otpSent) {
    return (
      <OTPVerificationComponent
        phone={getFullPhone()}
        onBack={() => { setOtpSent(false); setError(""); }}
      />
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8 max-w-md w-full mx-auto">
      <h2 className="font-bold text-white text-xl mb-2 text-center">Login to Access Mission</h2>
      <p className="text-slate-400 text-sm text-center mb-6">
        Enter your mobile number to receive an OTP
      </p>

      <div className="flex gap-2 mb-4">
        <div className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-3 text-sm flex items-center gap-1 whitespace-nowrap">
          🇮🇳 +91
        </div>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="10-digit mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
          className="flex-1 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
        />
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div id="recaptcha-container" />

      <button
        onClick={handleSendOTP}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm transition-colors"
      >
        {loading ? "Sending OTP..." : "Send OTP →"}
      </button>

      <p className="text-center text-xs text-slate-500 mt-4">
        OTP will be sent via SMS to your registered number
      </p>
    </div>
  );
}
