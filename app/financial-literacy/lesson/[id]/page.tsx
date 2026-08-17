import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { missions, books } from "@/data/missions/financial-literacy";
import ProtectedVideo from "@/components/ProtectedVideo";
import { BrandLogo } from "@/components/BrandLogo";

type Props = { params: Promise<{ id: string }> };

const BG   = "#FFFBF0";
const NAVY = "#1C1B4B";
const GOLD = "#F59E0B";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const mission = missions.find((m) => m.id === Number(id));
  if (!mission) return {};
  return {
    title: `${mission.title}: ${mission.subtitle} — Financial Literacy`,
    description: mission.description,
  };
}

export default async function LessonPage({ params }: Props) {
  const { id } = await params;
  const lessonId  = Number(id);
  const mission   = missions.find((m) => m.id === lessonId);
  if (!mission) notFound();

  const book        = books.find((b) => b.number === mission.book)!;
  const prevMission = missions.find((m) => m.id === lessonId - 1);
  const nextMission = missions.find((m) => m.id === lessonId + 1);
  const accent      = book.accent;

  return (
    <div className="min-h-screen" style={{ background: BG }}>

      {/* Soft glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-10 right-1/4 w-96 h-96 rounded-full"
          style={{ background: accent, opacity: 0.07, filter: "blur(100px)" }}
        />
        <div
          className="absolute bottom-1/3 left-0 w-80 h-80 rounded-full"
          style={{ background: GOLD, opacity: 0.05, filter: "blur(90px)" }}
        />
      </div>

      {/* ── HEADER ── */}
      <header
        className="relative z-50 sticky top-0 backdrop-blur-sm"
        style={{
          background: "rgba(255,251,240,0.90)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/financial-literacy"
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: NAVY }}
          >
            <span>←</span>
            <span>Back</span>
          </Link>
          <BrandLogo />
          <a
            href="https://learnwhatmatters.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: NAVY }}
          >
            Get the Workbook →
          </a>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* ── BREADCRUMB ── */}
        <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(28,27,75,0.45)" }}>
          <Link href="/financial-literacy" className="hover:opacity-70 transition-opacity" style={{ color: accent }}>
            Financial Literacy
          </Link>
          <span>›</span>
          <span>Book {book.number}: {book.title}</span>
          <span>›</span>
          <span style={{ color: NAVY, fontWeight: 600 }}>{mission.title}</span>
        </div>

        {/* ── TITLE ROW ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mission.gradient} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}
          >
            {mission.planet}
          </div>
          <div>
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 mb-1.5"
              style={{ background: accent }}
            >
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-white">
                Book {book.number} · {book.title} · {mission.title}
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

        {/* ── PREV / NEXT ── */}
        <div className="flex items-center gap-2">
          {prevMission ? (
            <Link
              href={`/financial-literacy/lesson/${prevMission.id}`}
              className="flex-1 min-w-0 overflow-hidden rounded-xl px-3 py-3 flex items-center gap-2 transition-all"
              style={{ background: "#fff", border: `1px solid ${accent}25` }}
            >
              <span className="flex-shrink-0" style={{ color: `${accent}80` }}>←</span>
              <div className="min-w-0">
                <div className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "rgba(28,27,75,0.4)" }}>Previous</div>
                <div className="text-xs font-semibold truncate" style={{ color: NAVY }}>{prevMission.subtitle}</div>
              </div>
            </Link>
          ) : <div className="flex-1" />}

          {nextMission ? (
            <Link
              href={`/financial-literacy/lesson/${nextMission.id}`}
              className="flex-1 min-w-0 overflow-hidden rounded-xl px-3 py-3 flex items-center justify-end gap-2 transition-all text-right"
              style={{ background: "#fff", border: `1px solid ${accent}25` }}
            >
              <div className="min-w-0">
                <div className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "rgba(28,27,75,0.4)" }}>Next</div>
                <div className="text-xs font-semibold truncate" style={{ color: NAVY }}>{nextMission.subtitle}</div>
              </div>
              <span className="flex-shrink-0" style={{ color: `${accent}80` }}>→</span>
            </Link>
          ) : (
            <Link
              href="/financial-literacy"
              className="flex-1 min-w-0 overflow-hidden rounded-xl px-3 py-3 flex items-center justify-end gap-2 transition-all text-right"
              style={{ background: "#fff", border: `1px solid ${accent}25` }}
            >
              <div className="min-w-0">
                <div className="text-[9px] font-mono uppercase tracking-wider" style={{ color: "rgba(28,27,75,0.4)" }}>Well done!</div>
                <div className="text-xs font-semibold" style={{ color: "#10B981" }}>Back to All Lessons 🏆</div>
              </div>
              <span className="flex-shrink-0" style={{ color: `${accent}80` }}>→</span>
            </Link>
          )}
        </div>

        {/* ── VIDEO OR COMING SOON ── */}
        {mission.videoUrl ? (
          <ProtectedVideo
            missionId={mission.id}
            videoUrl={mission.videoUrl}
            title={mission.subtitle}
            productSlug="financial-literacy"
            lightMode={true}
          />
        ) : (
          <div
            className={`w-full rounded-2xl bg-gradient-to-br ${mission.gradient} flex flex-col items-center justify-center gap-4 text-center`}
            style={{ aspectRatio: "16/9", padding: "3rem 2rem" }}
          >
            <div className="text-5xl mb-2">🎬</div>
            <h2 className="font-[family-name:var(--font-space)] font-bold text-white text-xl">
              Video Coming Soon
            </h2>
            <p className="text-white/70 text-sm max-w-xs">
              The workbook activities for this lesson are ready — grab your workbook and get started!
            </p>
          </div>
        )}

        {/* ── WORKBOOK CTA ── */}
        <div
          className="rounded-xl px-5 py-4 flex items-center gap-4"
          style={{ background: `${GOLD}18`, borderLeft: `4px solid ${GOLD}` }}
        >
          <span className="text-2xl flex-shrink-0">✏️</span>
          <p className="text-sm leading-relaxed" style={{ color: NAVY }}>
            {mission.videoUrl ? (
              <><span className="font-semibold">After the video, open your workbook</span>{" "}and complete the lesson activities to lock in what you learned.</>
            ) : (
              <><span className="font-semibold">While you wait — open your workbook</span>{" "}and read through this lesson. The activities are ready even before the video drops!</>
            )}
          </p>
        </div>

        {/* ── DESCRIPTION ── */}
        <p className="text-base leading-relaxed" style={{ color: "rgba(28,27,75,0.60)" }}>
          {mission.description}
        </p>

        {/* ── MONEY TIP CARD ── */}
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left"
          style={{
            background: `linear-gradient(135deg, ${accent}10, ${BG})`,
            border: `2px solid ${accent}25`,
          }}
        >
          <div className="text-5xl flex-shrink-0">💡</div>
          <div>
            <p className="font-[family-name:var(--font-space)] font-bold mb-1" style={{ color: NAVY }}>
              Money Wisdom:
            </p>
            <p className="text-sm leading-relaxed italic" style={{ color: "rgba(28,27,75,0.60)" }}>
              "Small money habits built today create big financial freedom tomorrow. One lesson at a time."
            </p>
          </div>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: "2rem" }}>
        <div
          className="max-w-4xl mx-auto px-4 py-6 text-center text-xs"
          style={{ color: "rgba(28,27,75,0.30)" }}
        >
          © {new Date().getFullYear()} Learn What Matters
        </div>
      </footer>
    </div>
  );
}
