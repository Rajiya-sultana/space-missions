import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { missions } from "@/data/missions/young-hustler";
import ProtectedVideo from "@/components/ProtectedVideo";
import { BrandLogo } from "@/components/BrandLogo";

type Props = { params: Promise<{ id: string }> };

const NAVY  = "#0A1628";
const GOLD  = "#FFB300";
const TEAL  = "#14B8A6";
const GREEN = "#22C55E";
const BG    = "#F7F9FA";
const INK   = "#1A2B4A";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const mission = missions.find((m) => m.id === Number(id));
  if (!mission) return {};
  return {
    title: `${mission.title}: ${mission.subtitle} — Young Hustler`,
    description: mission.description,
  };
}

export default async function MissionPage({ params }: Props) {
  const { id } = await params;
  const missionId = Number(id);
  const mission = missions.find((m) => m.id === missionId);
  if (!mission) notFound();

  const prevMission = missions.find((m) => m.id === missionId - 1);
  const nextMission = missions.find((m) => m.id === missionId + 1);

  const accent     = missionId <= 4 ? TEAL : GREEN;
  const levelLabel = missionId <= 4 ? "Level 1 · Think Like a Hustler" : "Level 2 · Build Like a Hustler";

  return (
    <div className="min-h-screen" style={{ background: BG }}>

      {/* Subtle watercolor blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-10 right-1/4 w-96 h-96 rounded-full" style={{ background: accent, opacity: 0.07, filter: "blur(100px)" }} />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full" style={{ background: GOLD, opacity: 0.05, filter: "blur(90px)" }} />
      </div>

      {/* ── HEADER ── */}
      <header
        className="relative z-50 sticky top-0 backdrop-blur-sm"
        style={{ background: "rgba(247,249,250,0.88)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/young-hustler"
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: INK }}
          >
            <span>←</span>
            <span>Back</span>
          </Link>
          <BrandLogo />
          <a
            href="https://learnwhatmatters.in/products/think-like-a-hustler-build-like-a-hustler-teen-entrepreneurship-workbook-bundle-startup-business-marketing-side-hustle-guide-for-teens-ages-12-18"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: INK }}
          >
            Get the Workbook →
          </a>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* ── TITLE ROW ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mission.gradient} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
            {mission.planet}
          </div>
          <div>
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 mb-1.5"
              style={{ background: accent }}
            >
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-white">
                {levelLabel} · {mission.title}
              </span>
            </div>
            <h1
              className="font-[family-name:var(--font-space)] text-2xl sm:text-3xl font-bold leading-tight"
              style={{ color: NAVY }}
            >
              {mission.subtitle}
            </h1>
          </div>
        </div>

        {/* ── PREV / NEXT NAV ── */}
        <div className="flex items-center gap-2">
          {prevMission ? (
            <Link
              href={`/young-hustler/module/${prevMission.id}`}
              className="flex-1 min-w-0 overflow-hidden rounded-xl px-3 py-3 flex items-center gap-2 transition-all group"
              style={{ background: "#fff", border: `1px solid ${accent}25` }}
            >
              <span className="flex-shrink-0 transition-colors" style={{ color: `${accent}70` }}>←</span>
              <div className="min-w-0">
                <div className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "rgba(26,43,74,0.4)" }}>Previous</div>
                <div className="text-xs font-semibold truncate" style={{ color: INK }}>{prevMission.subtitle}</div>
              </div>
            </Link>
          ) : <div className="flex-1" />}

          {nextMission ? (
            <Link
              href={`/young-hustler/module/${nextMission.id}`}
              className="flex-1 min-w-0 overflow-hidden rounded-xl px-3 py-3 flex items-center justify-end gap-2 transition-all group text-right"
              style={{ background: "#fff", border: `1px solid ${accent}25` }}
            >
              <div className="min-w-0">
                <div className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "rgba(26,43,74,0.4)" }}>Next</div>
                <div className="text-xs font-semibold truncate" style={{ color: INK }}>{nextMission.subtitle}</div>
              </div>
              <span className="flex-shrink-0 transition-colors" style={{ color: `${accent}70` }}>→</span>
            </Link>
          ) : (
            <Link
              href="/young-hustler"
              className="flex-1 min-w-0 overflow-hidden rounded-xl px-3 py-3 flex items-center justify-end gap-2 transition-all group text-right"
              style={{ background: "#fff", border: `1px solid ${accent}25` }}
            >
              <div className="min-w-0">
                <div className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "rgba(26,43,74,0.4)" }}>You did it!</div>
                <div className="text-xs font-semibold" style={{ color: GREEN }}>Back to Module HQ 🏆</div>
              </div>
              <span className="flex-shrink-0" style={{ color: `${accent}70` }}>→</span>
            </Link>
          )}
        </div>

        {/* ── VIDEO OR COMING SOON ── */}
        {mission.videoUrl ? (
          <ProtectedVideo
            missionId={mission.id}
            videoUrl={mission.videoUrl}
            title={mission.subtitle}
            productSlug="young-hustler"
            lightMode={true}
          />
        ) : (
          <div className="w-full rounded-2xl overflow-hidden relative" style={{ aspectRatio: "16/9" }}>
            {mission.thumbnail ? (
              <>
                <Image
                  src={mission.thumbnail}
                  alt={mission.subtitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                  priority
                />
                <div
                  className="absolute inset-0 flex flex-col items-center justify-end pb-8 gap-2"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)" }}
                >
                  <div className="flex items-center gap-2 rounded-full px-4 py-1.5" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.18)" }}>
                    <span className="text-base">🎬</span>
                    <span className="text-white text-sm font-semibold">Video Coming Soon</span>
                  </div>
                </div>
              </>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${mission.gradient} flex flex-col items-center justify-center gap-4 text-center`} style={{ padding: "3rem 2rem" }}>
                <div className="text-4xl mb-2">🎬</div>
                <h2 className="font-[family-name:var(--font-space)] font-bold text-white text-xl mb-2">Video Coming Soon</h2>
              </div>
            )}
          </div>
        )}

        {/* ── WORKBOOK CTA ── */}
        <div
          className="rounded-xl px-5 py-4 flex items-center gap-4"
          style={{ background: `${GOLD}15`, borderLeft: `4px solid ${GOLD}` }}
        >
          <span className="text-2xl flex-shrink-0">✏️</span>
          <p className="text-sm leading-relaxed" style={{ color: INK }}>
            {mission.videoUrl ? (
              <><span className="font-semibold">After the video, open your workbook</span>{" "}and complete the module activities to lock in what you learned.</>
            ) : (
              <><span className="font-semibold">While you wait — open your workbook</span>{" "}and read through this module. The activities are ready even before the video drops!</>
            )}
          </p>
        </div>

        {/* ── DESCRIPTION ── */}
        <p className="text-base leading-relaxed" style={{ color: "rgba(26,43,74,0.65)" }}>
          {mission.description}
        </p>

        {/* ── HUSTLER NOTE ── */}
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left"
          style={{ background: `linear-gradient(135deg, ${accent}12, ${BG})`, border: `2px solid ${accent}25` }}
        >
          <div className="text-5xl flex-shrink-0">💡</div>
          <div>
            <p className="font-[family-name:var(--font-space)] font-bold mb-1" style={{ color: NAVY }}>
              The Hustler Mindset:
            </p>
            <p className="text-sm leading-relaxed italic" style={{ color: "rgba(26,43,74,0.65)" }}>
              "Ideas are easy. Execution is what makes you different. Take one small action after every module."
            </p>
          </div>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: "2rem" }}>
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs" style={{ color: "rgba(26,43,74,0.30)" }}>
          © {new Date().getFullYear()} Learn What Matters
        </div>
      </footer>
    </div>
  );
}
