"use client";

import Link from "next/link";
import type { Mission } from "@/data/products";
import { MissionCard } from "@/components/MissionCard";
import { useProgress } from "@/hooks/useProgress";

interface Props {
  missions: Mission[];
  productSlug: string;
  pathSegment?: string;
  label?: string;
}

export function MissionGrid({ missions, productSlug, pathSegment = "mission", label }: Props) {
  const { completed } = useProgress(productSlug);

  const nextMission = missions.find((m) => !completed.has(m.id));
  const hasStarted = completed.size > 0;

  return (
    <div className="flex flex-col gap-5">
      {hasStarted && nextMission && (
        <Link
          href={`/${productSlug}/${pathSegment}/${nextMission.id}`}
          className="flex items-center justify-between rounded-2xl px-5 py-4 transition-all"
          style={{
            background: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(16,185,129,0.10) 100%)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">▶</div>
            <div>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-0.5">Continue</p>
              <p className="text-sm font-bold text-white">{nextMission.subtitle}</p>
            </div>
          </div>
          <span className="text-emerald-400 text-lg">→</span>
        </Link>
      )}

      {hasStarted && !nextMission && (
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-4"
          style={{
            background: "linear-gradient(135deg, rgba(234,179,8,0.15) 0%, rgba(249,115,22,0.10) 100%)",
            border: "1px solid rgba(234,179,8,0.3)",
          }}
        >
          <span className="text-2xl">🏆</span>
          <div>
            <p className="text-sm font-bold text-yellow-400">All missions complete!</p>
            <p className="text-xs text-slate-400">Complete your workbook to earn your certificate.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            productSlug={productSlug}
            pathSegment={pathSegment}
            label={label}
            completed={completed.has(mission.id)}
          />
        ))}
      </div>
    </div>
  );
}
