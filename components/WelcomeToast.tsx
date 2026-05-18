"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export function WelcomeToast() {
  const { justLoggedIn } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (justLoggedIn) {
      setShow(true);
      setTimeout(() => setShow(false), 4000);
    }
  }, [justLoggedIn]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        color: "white",
        fontWeight: 700,
        borderRadius: "18px",
        padding: "14px 24px",
        boxShadow: "0 8px 32px rgba(34,197,94,0.5)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "15px",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: "22px" }}>🎉</span>
      <span>Welcome back! Your missions are now unlocked.</span>
    </div>
  );
}
