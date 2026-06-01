"use client";

import { useEffect, useState, useRef, useCallback } from "react";

type Platform = "android" | "ios" | "other";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    (window.navigator as any).standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

const IOS_STEPS = [
  {
    n: "1",
    label: <>Tap the <strong>Share</strong> button in your browser</>,
    illustration: (
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 bg-gray-50">
        <div className="flex-1 flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-300" />
          <span className="text-xs text-gray-500">watch.learnwhatmatters.in</span>
        </div>
        <div className="w-8 h-8 rounded-lg border-2 border-gray-400 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
            <path d="M7 1v9M4 4l3-3 3 3" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="1" y="6" width="12" height="9" rx="2" stroke="#555" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>
    ),
  },
  {
    n: "2",
    label: <>In the pop-up, scroll and tap <strong>View More</strong></>,
    illustration: (
      <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 gap-2">
        {[
          { icon: "📋", label: "Copy" },
          { icon: "📱", label: "Send" },
          { icon: "📖", label: "Reading" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">{icon}</div>
            <span className="text-[9px] text-gray-500">{label}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full border-2 border-gray-700 bg-gray-100 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[9px] font-bold text-gray-700">View More</span>
        </div>
      </div>
    ),
  },
  {
    n: "3",
    label: <>Scroll and tap <strong>Add to Home Screen</strong></>,
    illustration: (
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
        {[{ icon: "🖨️", label: "Print" }, { icon: "➕", label: "Add to Home Screen", highlight: true }, { icon: "📝", label: "Add to Quick Note" }].map(({ icon, label, highlight }) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-3 py-2.5 border-b border-gray-100 last:border-0 ${highlight ? "bg-blue-50" : ""}`}
          >
            <span className="text-base">{icon}</span>
            <span className={`text-xs ${highlight ? "font-bold text-blue-700" : "text-gray-600"}`}>{label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "4",
    label: <>Tap <strong>Add</strong> in the top-right corner</>,
    illustration: (
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">×</div>
          <span className="text-xs font-semibold text-gray-700">Add to Home Screen</span>
          <div className="rounded-lg px-3 py-1 text-xs font-bold text-white" style={{ background: "#007AFF" }}>Add</div>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "#0A1628" }}>📚</div>
          <div>
            <p className="text-xs font-semibold text-gray-800">Learn What Matters</p>
            <p className="text-[10px] text-gray-400">watch.learnwhatmatters.in</p>
          </div>
        </div>
      </div>
    ),
  },
];

const ANDROID_STEPS = [
  {
    n: "1",
    label: <>Tap the <strong>3-dot menu</strong> (⋮) in Chrome's top-right</>,
    illustration: (
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 bg-gray-50">
        <div className="flex-1 flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-300" />
          <span className="text-xs text-gray-500">watch.learnwhatmatters.in</span>
        </div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-gray-600">⋮</span>
        </div>
      </div>
    ),
  },
  {
    n: "2",
    label: <>Tap <strong>Add to Home Screen</strong></>,
    illustration: (
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
        {[{ icon: "🔖", label: "Bookmarks" }, { icon: "➕", label: "Add to Home Screen", highlight: true }, { icon: "💾", label: "Download" }].map(({ icon, label, highlight }) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-3 py-2.5 border-b border-gray-100 last:border-0 ${highlight ? "bg-blue-50" : ""}`}
          >
            <span className="text-base">{icon}</span>
            <span className={`text-xs ${highlight ? "font-bold text-blue-700" : "text-gray-600"}`}>{label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "3",
    label: <>Tap <strong>Add</strong> to confirm</>,
    illustration: (
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 px-3 py-3 flex items-center justify-between">
        <span className="text-xs text-gray-600">Add to Home Screen?</span>
        <div className="rounded-lg px-4 py-1.5 text-xs font-bold text-white" style={{ background: "#14B8A6" }}>Add</div>
      </div>
    ),
  },
];

export function AddToHomeScreen() {
  const [show, setShow]             = useState(false);
  const [showGuide, setShowGuide]   = useState(false);
  const platform                    = useRef<Platform>("other");
  const deferredPrompt              = useRef<any>(null);

  const dismiss = useCallback(() => {
    localStorage.setItem("a2hs-dismissed-at", String(Date.now()));
    setShow(false);
    setShowGuide(false);
  }, []);

  const triggerInstall = useCallback(async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      deferredPrompt.current = null;
      if (outcome === "accepted") dismiss();
      return;
    }
    setShowGuide(true);
  }, [dismiss]);

  useEffect(() => {
    platform.current = detectPlatform();
    if (isStandalone()) return;
    if (platform.current === "other") return;
    const dismissedAt = localStorage.getItem("a2hs-dismissed-at");
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    if (dismissedAt && Date.now() - Number(dismissedAt) < THIRTY_DAYS) return;

    setShow(true);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    // Shake detection
    let lastX = 0, lastY = 0, lastZ = 0, lastShake = 0;
    const onMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const x = acc.x ?? 0, y = acc.y ?? 0, z = acc.z ?? 0;
      const now = Date.now();
      if (now - lastShake < 120) return;
      const delta = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
      lastX = x; lastY = y; lastZ = z;
      if (delta > 35) {
        lastShake = now;
        if (deferredPrompt.current) triggerInstall();
        else setShowGuide(true);
      }
    };
    window.addEventListener("devicemotion", onMotion);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("devicemotion", onMotion);
    };
  }, [triggerInstall]);

  if (!show) return null;

  const steps = platform.current === "ios" ? IOS_STEPS : ANDROID_STEPS;

  return (
    <>
      {/* ── SMALL CHIP BANNER ── */}
      {!showGuide && (
        <div className="fixed bottom-4 left-0 right-0 z-[9999] flex justify-center px-4 md:hidden">
          <button
            onClick={triggerInstall}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl transition-all active:scale-95"
            style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.10)", boxShadow: "0 4px 24px rgba(0,0,0,0.14)" }}
          >
            <div className="flex-1 text-left">
              <p className="text-sm font-bold" style={{ color: "#0A1628" }}>Add to your Home Screen</p>
              <p className="text-xs" style={{ color: "rgba(10,22,40,0.50)" }}>for quick access</p>
            </div>
            <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect width="24" height="32" rx="4" x="6" y="2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.2"/>
                <rect width="14" height="4" rx="2" x="11" y="1" fill="#d1d5db"/>
                <path d="M14 20l-3 3 3 3M22 20l3 3-3 3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="28" cy="10" r="7" fill="#14B8A6"/>
                <path d="M25.5 10h5M28 7.5v5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
          </button>
          <button
            onClick={dismiss}
            className="absolute top-1 right-5 w-5 h-5 flex items-center justify-center rounded-full text-xs"
            style={{ background: "rgba(0,0,0,0.15)", color: "#fff" }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* ── STEP-BY-STEP GUIDE MODAL ── */}
      {showGuide && (
        <div
          className="fixed inset-0 z-[99999] flex items-end md:hidden"
          style={{ background: "rgba(0,0,0,0.50)", backdropFilter: "blur(3px)" }}
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full rounded-t-3xl overflow-y-auto"
            style={{ background: "#ffffff", maxHeight: "90vh", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold" style={{ background: "#0A1628" }}>📚</div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 10h6M13 10l-3-3m3 3l-3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <div className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="1" width="14" height="18" rx="3" stroke="#374151" strokeWidth="1.5"/>
                    <rect x="7" y="1" width="6" height="2.5" rx="1.25" stroke="#374151" strokeWidth="1.2"/>
                  </svg>
                </div>
              </div>
              <button onClick={() => setShowGuide(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-lg">×</button>
            </div>

            {/* Title */}
            <div className="px-5 pt-4 pb-2">
              <h2 className="text-base font-extrabold leading-snug" style={{ color: "#0A1628" }}>
                Add Learn What Matters<br />to your home screen
              </h2>
            </div>

            {/* Steps */}
            <div className="px-5 pb-6 flex flex-col gap-5">
              {steps.map(({ n, label, illustration }) => (
                <div key={n} className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "#14B8A6", color: "white" }}>{n}</span>
                    <p className="text-sm text-gray-700 leading-snug">{label}</p>
                  </div>
                  <div className="ml-7">{illustration}</div>
                </div>
              ))}

              <p className="text-xs text-gray-400 text-center mt-1">
                Learn What Matters will be available on your home screen
              </p>

              <button
                onClick={dismiss}
                className="w-full py-3.5 rounded-2xl text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: "#14B8A6", color: "white" }}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
