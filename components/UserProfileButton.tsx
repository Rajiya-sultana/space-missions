"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

export default function UserProfileButton() {
  const { user, logout, hasPurchase, justLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return <div className="w-24" />;

  const phone = user.phoneNumber ?? "";

  return (
    <>
      {/* Toast notification */}
      {justLoggedIn && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
          <div className="bg-green-500/90 backdrop-blur text-white text-sm font-medium px-5 py-3 rounded-full shadow-lg flex items-center gap-2">
            <span>✓</span>
            <span>Successfully logged in!</span>
          </div>
        </div>
      )}

      {/* Profile avatar + dropdown */}
      <div className="relative w-24 flex justify-end" ref={dropdownRef}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-400 flex items-center justify-center text-white font-bold text-sm transition-colors shadow-md"
          title={phone}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" /></svg>
        </button>

        {open && (
          <div className="absolute right-0 top-11 w-60 bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Profile</p>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-white transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Phone */}
            <div className="px-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" /></svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{phone}</p>
                  <p className="text-slate-500 text-xs">Space Explorer</p>
                </div>
              </div>
            </div>

            {/* Purchase status */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${hasPurchase ? "bg-green-400" : "bg-slate-500"}`} />
              <span className="text-xs text-slate-400">
                {hasPurchase ? "Full access unlocked" : "No purchase found"}
              </span>
            </div>

            {/* Logout */}
            <div className="px-4 py-3">
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg py-2 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
