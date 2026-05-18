"use client";

import { useState } from "react";

interface Props {
  /** true = dark background (Space Explorer / Young Hustler) */
  dark?: boolean;
}

export function BrandLogo({ dark = false }: Props) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <span
        className="text-xs font-bold tracking-widest uppercase"
        style={{ color: dark ? "rgba(255,255,255,0.75)" : "#0D2244" }}
      >
        Learn What Matters
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Learn What Matters"
      onError={() => setError(true)}
      style={{ height: 28, width: "auto", objectFit: "contain" }}
    />
  );
}
