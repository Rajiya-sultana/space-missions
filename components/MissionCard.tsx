import Link from "next/link";
import type { Mission } from "@/data/missions";

export function MissionCard({ mission }: { mission: Mission }) {
  const isReady = mission.videoUrl !== "";

  return (
    <Link href={`/mission/${mission.id}`} className="group block focus:outline-none">
      <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] group-focus-visible:ring-2 group-focus-visible:ring-orange-400 h-full flex flex-col">
        {/* Thumbnail / gradient banner */}
        <div className={`relative h-36 bg-gradient-to-br ${mission.gradient} flex items-center justify-center overflow-hidden`}>
          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
          <span className="text-6xl drop-shadow-lg select-none">{mission.planet}</span>

          {/* Mission number badge */}
          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-0.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-white/90 uppercase">
              {mission.title}
            </span>
          </div>

          {/* Ready indicator */}
          {isReady && (
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          )}
        </div>

        {/* Card body */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <h2
            className="font-[family-name:var(--font-space)] text-base font-bold text-white leading-tight"
          >
            {mission.subtitle}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed flex-1">
            {mission.description}
          </p>

          {/* CTA */}
          <div className="mt-3 flex items-center gap-2 text-orange-400 font-semibold text-sm group-hover:text-orange-300 transition-colors">
            <span>Launch Mission</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
