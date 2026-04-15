"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  slow: boolean;
};

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
    slow: Math.random() > 0.7,
  }));
}

export function StarBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stars = generateStars(120);
    container.innerHTML = "";

    stars.forEach((star) => {
      const el = document.createElement("div");
      el.className = `star${star.slow ? " star-slow" : ""}`;
      el.style.cssText = `
        left: ${star.x}%;
        top: ${star.y}%;
        width: ${star.size}px;
        height: ${star.size}px;
        --duration: ${star.duration}s;
        --delay: ${star.delay}s;
      `;
      container.appendChild(el);
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
