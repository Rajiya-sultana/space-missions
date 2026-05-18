import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { missions } from "@/data/missions/fun-science";
import { MobileMissionList } from "@/components/MobileMissionList";

export const metadata: Metadata = {
  title: "Fun Science — Learn What Matters",
  description: "Your experiment videos are here. Watch each one, then grab your workbook and try it at home!",
};

const NAVY = "#0D2244";
const SKY = "#29ABE2";
const ORANGE = "#E8420A";
const BG = "#FFFDF8";

const FROM_COLOR: Record<string, string> = {
  "from-red-600": "#dc2626",
  "from-pink-500": "#ec4899",
  "from-blue-700": "#1d4ed8",
  "from-yellow-500": "#eab308",
  "from-orange-600": "#ea580c",
  "from-sky-600": "#0284c7",
  "from-purple-600": "#9333ea",
  "from-slate-700": "#334155",
  "from-violet-600": "#7c3aed",
  "from-gray-800": "#1f2937",
  "from-amber-600": "#d97706",
  "from-teal-600": "#0d9488",
  "from-stone-600": "#57534e",
  "from-red-500": "#ef4444",
  "from-green-600": "#16a34a",
  "from-orange-700": "#c2410c",
  "from-blue-600": "#2563eb",
  "from-cyan-700": "#0e7490",
  "from-pink-600": "#db2777",
};

function topColor(gradient: string): string {
  const cls = gradient.split(" ").find((c) => c.startsWith("from-"));
  return cls ? (FROM_COLOR[cls] ?? SKY) : SKY;
}

export default function FunSciencePage() {
  return (
    <div className="min-h-screen" style={{ background: BG }}>

      {/* Sticky top bar */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: "transparent", borderBottom: "none" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#0D2244" }}
          >
            <span>←</span>
            <span>Back</span>
          </Link>

          <span />

          <a
            href="https://learnwhatmatters.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold transition-opacity hover:opacity-80 hidden sm:block"
            style={{ color: "#0D2244" }}
          >
            Get the Workbook →
          </a>
          <a
            href="https://learnwhatmatters.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold sm:hidden"
            style={{ color: "#0D2244" }}
          >
            Get the Workbook →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #29ABE2 0%, #0D2244 100%)", paddingTop: "60px", paddingBottom: "60px" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-12">

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <div
              className="inline-flex items-center rounded-full px-4 py-1.5 mb-5"
              style={{ background: "#FFD30F" }}
            >
              <span className="text-xs font-extrabold tracking-widest uppercase" style={{ color: NAVY }}>
                Fun Science Experiments
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-space)] text-4xl sm:text-5xl font-bold leading-tight mb-4 text-white">
              Welcome,{" "}
              <span style={{ color: "#FFD30F" }}>Young Scientist!</span>
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed mx-auto md:mx-0 mb-6"
              style={{ color: "rgba(255,255,255,0.85)", maxWidth: "480px" }}
            >
              Your experiment videos are here. Watch each one, then grab your workbook and try it at home — with stuff already in your kitchen!
            </p>

          </div>

          {/* Professor avatar */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <Image
              src="/scientist.png"
              alt="The Professor — your science guide"
              width={220}
              height={220}
              priority
              className="object-contain drop-shadow-[0_0_20px_rgba(41,171,226,0.3)]"
            />
          </div>
        </div>
      </section>

      {/* Wavy divider */}
      <div style={{ background: "#29ABE2", lineHeight: 0, marginBottom: "-2px" }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "60px" }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill={BG} />
        </svg>
      </div>

      {/* Experiments Grid */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-[family-name:var(--font-space)] text-xl font-bold"
            style={{ color: NAVY }}
          >
            Choose Your Experiment
          </h2>
          <span className="text-xs font-mono" style={{ color: SKY }}>
            {missions.length} experiments total
          </span>
        </div>

        {/* Mobile list */}
        <div className="md:hidden mb-6 rounded-2xl p-4" style={{ background: "#0D2244" }}>
          <MobileMissionList missions={missions} productSlug="fun-science" pathSegment="experiment" label="EXPERIMENT" />
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {missions.map((mission) => (
            <Link
              key={mission.id}
              href={`/fun-science/experiment/${mission.id}`}
              className="group block focus:outline-none"
            >
              <div
                className="h-full flex flex-col overflow-hidden transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.06)] group-hover:scale-[1.03] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  borderTop: `3px solid ${topColor(mission.gradient)}`,
                }}
              >
                {/* Gradient image area */}
                <div className={`relative h-36 bg-gradient-to-br ${mission.gradient} flex items-center justify-center overflow-hidden`}>
                  {mission.thumbnail ? (
                    <Image src={mission.thumbnail} alt={mission.subtitle} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
                      <span className="text-6xl drop-shadow-lg select-none">{mission.planet}</span>
                    </>
                  )}
                  <div
                    className="absolute top-3 left-3 rounded-full px-2.5 py-0.5"
                    style={{ background: NAVY }}
                  >
                    <span className="text-[10px] font-mono font-extrabold tracking-widest text-white uppercase">
                      EXP {mission.id}
                    </span>
                  </div>
                  {mission.videoUrl !== "" && (
                    <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  )}
                </div>

                {/* Card body */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <h2
                    className="font-[family-name:var(--font-space)] text-base font-bold leading-tight"
                    style={{ color: NAVY }}
                  >
                    {mission.subtitle}
                  </h2>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: "#4A5E78" }}>
                    {mission.description}
                  </p>
                  <div
                    className="mt-3 flex items-center justify-end gap-1 font-semibold text-sm"
                    style={{ color: ORANGE }}
                  >
                    <span>Start Experiment</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: NAVY }}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span style={{ color: "rgba(255,255,255,0.50)" }}>
            © {new Date().getFullYear()} Learn What Matters. All rights reserved.
          </span>
          <a
            href="https://learnwhatmatters.in"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
            style={{ color: SKY }}
          >
            learnwhatmatters.in
          </a>
        </div>
      </footer>
    </div>
  );
}
