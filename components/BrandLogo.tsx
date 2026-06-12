"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  /** true = dark background (Space Explorer / Young Hustler) */
  dark?: boolean;
}

export function BrandLogo({ dark = false }: Props) {
  const [error, setError] = useState(false);

  const inner = error ? (
    <span
      className="text-xs font-bold tracking-widest uppercase"
      style={{ color: dark ? "rgba(255,255,255,0.75)" : "#0D2244" }}
    >
      Learn What Matters
    </span>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Learn What Matters"
      onError={() => setError(true)}
      style={{ height: 45, width: "auto", objectFit: "contain" }}
    />
  );

  return (
    <Link href="/" className="transition-opacity hover:opacity-75 focus:outline-none">
      {inner}
    </Link>
  );
}
