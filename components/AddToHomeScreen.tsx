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

export function AddToHomeScreen() {
  const [show, setShow]               = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const platform                       = useRef<Platform>("other");
  const deferredPrompt                 = useRef<any>(null);

  const triggerInstall = useCallback(async () => {
    if (platform.current === "ios") {
      setShowIOSGuide(true);
      return;
    }
    // Android with native prompt available
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      deferredPrompt.current = null;
      if (outcome === "accepted") dismiss();
      return;
    }
    // Android without native prompt — show manual guide
    setShowIOSGuide(true);
  }, [dismiss]);

  const dismiss = useCallback(() => {
    localStorage.setItem("a2hs-dismissed", "1");
    setShow(false);
    setShowIOSGuide(false);
  }, []);

  useEffect(() => {
    platform.current = detectPlatform();

    if (isStandalone()) return;
    if (localStorage.getItem("a2hs-dismissed")) return;
    // only show on mobile
    if (platform.current === "other") return;

    // Always show banner on mobile (ios + android)
    setShow(true);

    // Capture Android native install prompt if available
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
        setShow(true);
        if (platform.current === "android" && deferredPrompt.current) triggerInstall();
        if (platform.current === "ios") setShowIOSGuide(true);
      }
    };
    window.addEventListener("devicemotion", onMotion);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("devicemotion", onMotion);
    };
  }, [triggerInstall]);

  if (!show) return null;

  return (
    <>
      {/* ── BOTTOM BANNER ── */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 md:hidden">
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl"
          style={{
            background: "#0A1628",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 -4px 32px rgba(0,0,0,0.3)",
          }}
        >
          {/* Shake hint icon */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "rgba(20,184,166,0.15)" }}
          >
            📲
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold leading-tight">Add to Home Screen</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              Opens faster · feels like an app
            </p>
          </div>

          <button
            onClick={triggerInstall}
            className="flex-shrink-0 text-sm font-bold px-4 py-2 rounded-xl transition-opacity hover:opacity-90 active:opacity-75"
            style={{ background: "#14B8A6", color: "white" }}
          >
            Add
          </button>

          <button
            onClick={dismiss}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-lg leading-none transition-opacity hover:opacity-70"
            style={{ color: "rgba(255,255,255,0.35)" }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>

      {/* ── iOS STEP-BY-STEP GUIDE ── */}
      {showIOSGuide && (
        <div
          className="fixed inset-0 z-[99999] flex items-end justify-center p-4 md:hidden"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full rounded-2xl p-6 flex flex-col gap-5"
            style={{ background: "#0A1628", border: "1px solid rgba(255,255,255,0.10)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <p className="text-white font-bold text-base">Add to Home Screen</p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                {platform.current === "ios" ? "3 quick steps in Safari" : "3 quick steps in Chrome"}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {platform.current === "ios" ? (
                [
                  { n: "1", icon: "⬆️", text: "Tap the Share button at the bottom of Safari" },
                  { n: "2", icon: "➕", text: 'Scroll and tap "Add to Home Screen"' },
                  { n: "3", icon: "✅", text: 'Tap "Add" to confirm' },
                ]
              ) : (
                [
                  { n: "1", icon: "⋮", text: "Tap the 3-dot menu in Chrome (top right)" },
                  { n: "2", icon: "➕", text: 'Tap "Add to Home Screen"' },
                  { n: "3", icon: "✅", text: 'Tap "Add" to confirm' },
                ]
              ).map(({ n, icon, text }) => (
                <div key={n} className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                    style={{ background: "#14B8A6", color: "white" }}
                  >
                    {n}
                  </span>
                  <span className="text-sm flex-1" style={{ color: "rgba(255,255,255,0.80)" }}>{text}</span>
                  <span className="text-xl flex-shrink-0">{icon}</span>
                </div>
              ))}
            </div>

            <button
              onClick={dismiss}
              className="w-full py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
              style={{ background: "#14B8A6", color: "white" }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
