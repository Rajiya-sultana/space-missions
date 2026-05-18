"use client";
import { useState, useEffect, useCallback } from "react";

export function useProgress(productSlug: string) {
  const key = `lwm_progress_${productSlug}`;
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setCompleted(new Set(JSON.parse(raw) as number[]));
    } catch {}
  }, [key]);

  const markComplete = useCallback(
    (missionId: number) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        next.add(missionId);
        try {
          localStorage.setItem(key, JSON.stringify([...next]));
        } catch {}
        return next;
      });
    },
    [key]
  );

  return { completed, markComplete };
}
