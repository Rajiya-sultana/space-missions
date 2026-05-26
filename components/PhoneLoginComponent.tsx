"use client";

import { useState, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";
import { formatPhoneNumber, validatePhoneNumber } from "@/lib/phone-utils";

interface Props {
  lightMode?: boolean;
}

export default function PhoneLoginComponent({ lightMode = false }: Props) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  async function handleSendOTP() {
    setError("");
    if (!validatePhoneNumber(phone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    const formattedPhone = formatPhoneNumber(phone);
    setLoading(true);
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", {
          size: "invisible",
        });
      }
      const result = await signInWithPhoneNumber(firebaseAuth, formattedPhone, recaptchaRef.current);
      confirmationRef.current = result;
      setStep("otp");
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? "Failed to send OTP";
      if (msg.includes("invalid-phone-number")) {
        setError("Invalid phone number. Please check and try again.");
      } else if (msg.includes("too-many-requests")) {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(msg);
      }
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    setError("");
    if (!otp || otp.length < 4) {
      setError("Please enter the OTP");
      return;
    }
    if (!confirmationRef.current) {
      setError("Session expired. Please resend OTP.");
      return;
    }

    setLoading(true);
    try {
      await confirmationRef.current.confirm(otp);
      // AuthContext onAuthStateChanged fires automatically — no action needed here
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? "Invalid OTP";
      if (msg.includes("invalid-verification-code")) {
        setError("Incorrect OTP. Please try again.");
      } else if (msg.includes("code-expired")) {
        setError("OTP expired. Please resend.");
      } else {
        setError(msg);
      }
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
  const prefixCls = lightMode
    ? "bg-gray-50 border border-gray-300 text-gray-600 rounded-lg px-3 py-3 text-sm shrink-0"
    : "bg-white/5 border border-white/10 text-slate-400 rounded-lg px-3 py-3 text-sm shrink-0";
  const toggleCls = lightMode
    ? "text-gray-400 hover:text-gray-600 transition-colors"
    : "text-slate-500 hover:text-slate-300 transition-colors";

  return (
    <div className={cardCls}>
      <h2 className={headingCls}>
        {step === "phone" ? "Sign in to continue" : "Enter OTP"}
      </h2>
      <p className={subtitleCls}>
        {step === "phone"
          ? "Enter the mobile number you used when purchasing"
          : `OTP sent to ${formatPhoneNumber(phone)}`}
      </p>

      <div className="flex flex-col gap-3 mb-4">
        {step === "phone" ? (
          <div className="flex gap-2">
            <span className={prefixCls}>+91</span>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
              autoComplete="tel"
              className={`${inputCls} flex-1`}
            />
          </div>
        ) : (
          <input
            type="text"
            inputMode="numeric"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
            autoComplete="one-time-code"
            className={inputCls}
          />
        )}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <button
        onClick={step === "phone" ? handleSendOTP : handleVerifyOTP}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-3 text-sm transition-colors"
      >
        {loading ? "Please wait…" : step === "phone" ? "Send OTP →" : "Verify OTP →"}
      </button>

      {step === "otp" && (
        <div className="text-center mt-3">
          <button
            onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
            className={`text-xs ${toggleCls}`}
          >
            ← Change number or resend
          </button>
        </div>
      )}

      {/* Invisible reCAPTCHA mounts here */}
      <div id="recaptcha-container" />

      <div className="flex justify-center mt-4">
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
