import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/data/products";
import { missions } from "@/data/missions/young-hustler";
import { MobileMissionList } from "@/components/MobileMissionList";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "Young Hustler — Module HQ",
  description:
    "Think Like a Hustler. Build Like a Hustler. 8 modules to launch your entrepreneurship journey.",
};

const NAVY  = "#0A1628";
const GOLD  = "#FFB300";
const TEAL  = "#14B8A6";
const GREEN = "#22C55E";
const BG    = "#F7F9FA";
const INK   = "#1A2B4A";


export default function YoungHustlerPage() {
  const product = getProduct("young-hustler")!;

  return (
    <div className="min-h-screen" style={{ background: BG }}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: "transparent" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 grid grid-cols-3 items-center">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70 w-fit"
              style={{ color: INK }}
            >
              <span>←</span>
              <span>Back</span>
            </Link>
          </div>
          <div className="flex justify-center">
            <BrandLogo dark={false} />
          </div>
          <div className="flex justify-end">
            <a
              href={product.shopifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: INK }}
            >
              Get the Workbook →
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #142340 100%)`, paddingTop: "56px", paddingBottom: "56px" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-10">

          {/* Left: text */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center rounded-full px-4 py-1.5 mb-5" style={{ background: GOLD }}>
              <span className="text-xs font-extrabold tracking-widest uppercase" style={{ color: NAVY }}>
                Young Hustler — Teen Edition
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-space)] text-4xl sm:text-5xl font-bold leading-tight mb-4 text-white">
              Think it.{" "}
              <span style={{ color: GOLD }}>Build it.</span>
              <br />
              <span style={{ color: TEAL }}>Launch it.</span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed mb-6 mx-auto md:mx-0" style={{ color: "rgba(255,255,255,0.75)", maxWidth: "440px" }}>
              8 video modules across two powerful workbooks — designed to turn any teen into a real entrepreneur.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {[
                { icon: "🎬", text: "8 Video Modules" },
                { icon: "⚡", text: "72-Hour Challenge" },
                { icon: "📒", text: "2 Workbooks" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.80)" }}>
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: book image */}
          <div className="flex-shrink-0 w-full max-w-[400px] md:max-w-[420px]">
            <Image
              src="/hero-young-hustler.jpg"
              alt="Think Like a Hustler & Build Like a Hustler — Teen Edition"
              width={840}
              height={480}
              priority
              className="w-full rounded-2xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ── */}
      <div style={{ background: "#142340", lineHeight: 0, marginBottom: "-2px" }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "60px" }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill={BG} />
        </svg>
      </div>

      {/* ── MODULE GRID ── */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-space)] text-xl font-bold" style={{ color: NAVY }}>
            Choose Your Module
          </h2>
          <span className="text-xs font-mono" style={{ color: TEAL }}>
            {missions.length} modules total
          </span>
        </div>

        {/* Book level labels */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: `${TEAL}15`, border: `1px solid ${TEAL}40` }}>
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: TEAL }} />
            <span className="text-xs font-semibold" style={{ color: TEAL }}>Level 1 — Think Like a Hustler · Modules 1–4</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: `${GREEN}15`, border: `1px solid ${GREEN}40` }}>
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: GREEN }} />
            <span className="text-xs font-semibold" style={{ color: GREEN }}>Level 2 — Build Like a Hustler · Modules 5–8</span>
          </div>
        </div>

        {/* Mobile list */}
        <div className="md:hidden mb-4">
          <MobileMissionList
            missions={missions}
            productSlug="young-hustler"
            pathSegment="module"
            lightMode={true}
            accentColor={TEAL}
          />
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4">
          {missions.map((mission) => {
            const accent = mission.id <= 4 ? TEAL : GREEN;
            return (
              <Link
                key={mission.id}
                href={`/young-hustler/module/${mission.id}`}
                className="group block focus:outline-none"
              >
                <div
                  className="h-full flex flex-col overflow-hidden transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.08)] group-hover:scale-[1.03] group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)]"
                  style={{ background: "#ffffff", borderRadius: "16px", border: `1.5px solid ${accent}25` }}
                >
                  {/* Gradient top */}
                  <div className={`relative h-36 bg-gradient-to-br ${mission.gradient} flex items-center justify-center overflow-hidden`}>
                    {mission.thumbnail ? (
                      <Image src={mission.thumbnail} alt={mission.subtitle} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                    ) : (
                      <>
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
                        <span className="text-6xl drop-shadow-lg select-none">{mission.planet}</span>
                      </>
                    )}

                    {/* Module badge */}
                    <div className="absolute top-3 left-3 rounded-full px-2.5 py-0.5" style={{ background: NAVY }}>
                      <span className="text-[10px] font-mono font-extrabold tracking-widest text-white uppercase">
                        {mission.title}
                      </span>
                    </div>

                    {/* FREE badge */}
                    {mission.id === 1 && (
                      <div className="absolute top-3 right-3 rounded-full px-2.5 py-0.5" style={{ background: GREEN }}>
                        <span className="text-[10px] font-extrabold text-white uppercase">FREE</span>
                      </div>
                    )}

                    {/* Level dot */}
                    <div
                      className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full"
                      style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
                    />
                  </div>

                  {/* Card body */}
                  <div
                    className="p-4 flex flex-col flex-1 gap-2"
                    style={{ background: `linear-gradient(160deg, ${accent}08 0%, #ffffff 55%)` }}
                  >
                    <h3
                      className="font-[family-name:var(--font-space)] text-base font-bold leading-tight"
                      style={{ color: NAVY }}
                    >
                      {mission.subtitle}
                    </h3>
                    <p className="text-xs leading-relaxed flex-1" style={{ color: "rgba(26,43,74,0.60)" }}>
                      {mission.description}
                    </p>
                    <div
                      className="mt-2 flex items-center justify-end gap-1 font-bold text-xs"
                      style={{ color: mission.videoUrl ? accent : `${accent}80` }}
                    >
                      {mission.videoUrl ? (
                        <>
                          <span>Watch Module</span>
                          <span className="transition-transform group-hover:translate-x-1">→</span>
                        </>
                      ) : (
                        <>
                          <span>Coming Soon</span>
                          <span>·</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div
          className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: NAVY }}
        >
          <div className="text-5xl flex-shrink-0">🏆</div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-[family-name:var(--font-space)] font-bold text-white text-lg mb-1">
              Complete all {missions.length} modules!
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Watch every video and complete the workbook activities to become a{" "}
              <span className="font-semibold" style={{ color: GOLD }}>real Young Hustler!</span>
            </p>
          </div>
          <a
            href={product.shopifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 font-bold rounded-xl px-6 py-3 text-sm transition-opacity hover:opacity-90"
            style={{ background: GOLD, color: NAVY }}
          >
            Get the Workbook →
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: NAVY }}>
        <div
          className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ color: "rgba(255,255,255,0.40)" }}
        >
          <span>© {new Date().getFullYear()} Learn What Matters. All rights reserved.</span>
          <a
            href="https://learnwhatmatters.in"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
            style={{ color: TEAL }}
          >
            learnwhatmatters.in
          </a>
        </div>
      </footer>

    </div>
  );
}
