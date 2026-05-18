import Link from "next/link";
import Image from "next/image";
import type { Mission } from "@/data/products";

interface Props {
  mission: Mission;
  productSlug: string;
  pathSegment?: string;
  label?: string;
  completed?: boolean;
}

export function MissionCard({ mission, productSlug, pathSegment = "mission", label, completed }: Props) {
  const isReady = mission.videoUrl !== "";
  const badgeText = label ? `${label} ${mission.id}` : mission.title;

  return (
    <Link href={`/${productSlug}/${pathSegment}/${mission.id}`} className="group block focus:outline-none">
      <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] group-focus-visible:ring-2 group-focus-visible:ring-orange-400 h-full flex flex-col">
        <div className={`relative h-36 bg-gradient-to-br ${mission.gradient} flex items-center justify-center overflow-hidden`}>
          {mission.thumbnail ? (
            <Image
              src={mission.thumbnail}
              alt={mission.subtitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
              <span className="text-6xl drop-shadow-lg select-none">{mission.planet}</span>
            </>
          )}

          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-0.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-white/90 uppercase">
              {badgeText}
            </span>
          </div>

          {completed ? (
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_10px_rgba(52,211,153,0.7)]">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : isReady ? (
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          ) : null}
        </div>

        <div className="p-4 flex flex-col flex-1 gap-2">
          <h2 className="font-[family-name:var(--font-space)] text-base font-bold text-white leading-tight">
            {mission.subtitle}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed flex-1">
            {mission.description}
          </p>

          <div className="mt-3 flex items-center gap-2 text-orange-400 font-semibold text-sm group-hover:text-orange-300 transition-colors">
            <span>Launch Mission</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
