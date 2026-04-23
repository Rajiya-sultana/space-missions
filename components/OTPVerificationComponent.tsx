"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  phone: string;
  onBack: () => void;
}

export default function OTPVerificationComponent({ phone, onBack }: Props) {
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  async function handleVerify() {
    setError("");
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    if (attempts >= 5) {
      setError("Too many attempts. Please go back and request a new OTP.");
      return;
    }

    setLoading(true);
    setAttempts((a) => a + 1);
    try {
      await verifyOTP(otp);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/invalid-verification-code") {
        setError("Incorrect OTP. Please check and try again.");
      } else if (code === "auth/code-expired") {
        setError("OTP has expired. Please request a new one.");
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card rounded-2xl p-8 max-w-md w-full mx-auto">
      <button onClick={onBack} className="text-slate-400 hover:text-white text-xs mb-4 flex items-center gap-1 transition-colors">
        ← Back
      </button>

      <h2 className="font-bold text-white text-xl mb-2 text-center">Enter OTP</h2>
      <p className="text-slate-400 text-sm text-center mb-1">
        OTP sent to <span className="text-white">{phone}</span>
      </p>
      <p className="text-slate-500 text-xs text-center mb-6">
        {timeLeft > 0 ? (
          <>Expires in <span className="text-orange-400">{formatTime(timeLeft)}</span></>
        ) : (
          <span className="text-red-400">OTP expired. Please go back and request a new one.</span>
        )}
      </p>

      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        onKeyDown={(e) => e.key === "Enter" && handleVerify()}
        maxLength={6}
        disabled={timeLeft <= 0 || attempts >= 5}
        className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm text-center tracking-[0.5em] focus:outline-none focus:border-orange-500 mb-4 disabled:opacity-40"
      />

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <button
        onClick={handleVerify}
        disabled={loading || timeLeft <= 0 || attempts >= 5}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm transition-colors mb-4"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <p className="text-center text-xs text-slate-500">
        Didn&apos;t receive OTP?{" "}
        {resendCooldown > 0 ? (
          <span className="text-slate-600">Resend in {resendCooldown}s</span>
        ) : (
          <button onClick={onBack} className="text-orange-400 hover:text-orange-300 transition-colors">
            Resend OTP
          </button>
        )}
      </p>
    </div>
  );
}
