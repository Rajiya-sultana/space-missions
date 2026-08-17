import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { missions, books } from "@/data/missions/ai-for-kids";
import ProtectedVideo from "@/components/ProtectedVideo";
import { BrandLogo } from "@/components/BrandLogo";

type Props = { params: Promise<{ id: string }> };

const BG   = "#F5EEFF";
const NAVY = "#1C1B4B";
const DARK = "#1E0B4B";

const AI_TIPS = [
  "AI is a tool. How smart it is depends on how smartly YOU use it.",
  "The best AI prompts are clear, specific, and creative. Think before you type!",
  "AI learns from examples — the more it sees, the smarter it gets. You're the same!",
  "Humans invented AI — and humans still make the most important decisions.",
  "Every AI mistake is a learning opportunity — for the AI and for you!",
  "Great AI creators ask lots of 'what if?' questions. Keep asking!",
  "Privacy matters with AI just as much as with people. Be thoughtful about what you share.",
  "The future of AI will be shaped by kids who are curious today. That's you!",
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const mission = missions.find((m) => m.id === Number(id));
  if (!mission) return {};
  return {
    title: `${mission.title} — AI for Kids`,
    description: mission.description,
  };
}

export default async function AiLessonPage({ params }: Props) {
  const { id } = await params;
  const lessonId = Number(id);
  const mission  = missions.find((m) => m.id === lessonId);
  if (!mission) notFound();

  const book         = books.find((b) => b.number === mission.book)!;
  const accent       = book.accent;
  const bookMissions = missions.filter((m) => m.book === mission.book);
  const missionIndex = bookMissions.findIndex((m) => m.id === lessonId);
  const prevMission  = bookMissions[missionIndex - 1];
  const nextMission  = bookMissions[missionIndex + 1];
  const moduleNumber = missionIndex + book.moduleStart;
  const lastModule   = bookMissions.length - 1 + book.moduleStart;
  const tip          = AI_TIPS[lessonId % AI_TIPS.length];

  return (
    <div className="min-h-screen" style={{ background: BG }}>

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-sm"
        style={{ background: "rgba(245,238,255,0.92)", borderBottom: "1px solid rgba(139,92,246,0.12)" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/ai-for-kids"
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
            style={{ color: accent }}
          >
            Get the Books →
          </a>
        </div>
      </header>

      {/* ── PREV / NEXT ── */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-5">
        <div className="flex items-center gap-3">
          {prevMission ? (
            <Link
              href={`/ai-for-kids/lesson/${prevMission.id}`}
              className="flex-1 rounded-xl px-4 py-3 flex items-center gap-3 border hover:shadow-sm transition-all"
              style={{ background: "#ffffff", borderColor: `${accent}30` }}
            >
              <span style={{ color: `${accent}80` }}>←</span>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(26,43,74,0.45)" }}>Previous</div>
                <div className="text-sm font-semibold truncate" style={{ color: NAVY }}>{prevMission.title}</div>
              </div>
            </Link>
          ) : <div className="flex-1" />}

          {nextMission ? (
            <Link
              href={`/ai-for-kids/lesson/${nextMission.id}`}
              className="flex-1 rounded-xl px-4 py-3 flex items-center justify-end gap-3 border hover:shadow-sm transition-all text-right"
              style={{ background: "#ffffff", borderColor: `${accent}30` }}
            >
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(26,43,74,0.45)" }}>Next</div>
                <div className="text-sm font-semibold truncate" style={{ color: NAVY }}>{nextMission.title}</div>
              </div>
              <span style={{ color: `${accent}80` }}>→</span>
            </Link>
          ) : (
            <Link
              href="/ai-for-kids"
              className="flex-1 rounded-xl px-4 py-3 flex items-center justify-end gap-3 border hover:shadow-sm transition-all text-right"
              style={{ background: "#ffffff", borderColor: `${accent}30` }}
            >
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(26,43,74,0.45)" }}>Book complete!</div>
                <div className="text-sm font-semibold" style={{ color: "#10B981" }}>Back to All Lessons 🏆</div>
              </div>
              <span style={{ color: `${accent}80` }}>→</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── SPLIT LAYOUT ── */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* LEFT: portrait video */}
          <div className="w-full lg:flex-shrink-0 lg:w-[300px]">
            <div className="w-full lg:max-w-[300px] mx-auto lg:mx-0">
              {mission.videoUrl ? (
                <ProtectedVideo
                  missionId={mission.id}
                  videoUrl={mission.videoUrl}
                  poster={mission.thumbnail}
                  title={mission.title}
                  productSlug="ai-for-kids"
                  vertical={true}
                  lightMode={true}
                  noAuth={true}
                />
              ) : (
                <div
                  className={`relative w-full rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-4 text-center ${!mission.thumbnail ? `bg-gradient-to-br ${mission.gradient}` : "bg-black"}`}
                  style={{ aspectRatio: "9/16", padding: "2rem" }}
                >
                  {mission.thumbnail && (
                    <Image
                      src={mission.thumbnail}
                      alt={mission.title}
                      fill
                      className="object-cover opacity-80"
                      sizes="300px"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    {!mission.thumbnail && <div className="text-6xl">{mission.planet}</div>}
                    <p className="text-white font-bold text-lg drop-shadow">Video Coming Soon</p>
                    <p className="text-white/80 text-sm drop-shadow">Workbook activities for this module are ready — grab your book!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: info panel */}
          <div className="flex-1 min-w-0 flex flex-col gap-6 lg:pt-2">

            {/* Title block */}
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mission.gradient} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}
              >
                {mission.planet}
              </div>
              <div>
                <div
                  className="inline-flex items-center rounded-full px-3 py-0.5 mb-2"
                  style={{ background: accent }}
                >
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-white">
                    Module {String(moduleNumber).padStart(2, "0")} of {String(lastModule).padStart(2, "0")} · Book {book.number}
                  </span>
                </div>
                <h1
                  className="font-[family-name:var(--font-nunito)] text-2xl sm:text-3xl font-bold leading-tight"
                  style={{ color: NAVY, letterSpacing: "0.04em" }}
                >
                  {mission.title}
                </h1>
              </div>
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed" style={{ color: "rgba(28,27,75,0.70)" }}>
              {mission.description}
            </p>

            {/* Workbook CTA */}
            <div
              className="rounded-xl px-5 py-4 flex items-center gap-4"
              style={{ background: `${accent}12`, borderLeft: `4px solid ${accent}` }}
            >
              <span className="text-2xl flex-shrink-0">✏️</span>
              <p className="text-sm leading-relaxed" style={{ color: NAVY }}>
                <span className="font-semibold">After watching, open your workbook</span>{" "}
                and complete the module activities to put your new AI skills to work — everything you need is in the book!
              </p>
            </div>

            {/* AIRA says */}
            <div
              className="rounded-2xl p-5 flex items-center gap-5"
              style={{
                background: `linear-gradient(135deg, ${accent}12, ${BG})`,
                border: `2px solid ${accent}`,
              }}
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                <Image
                  src="/aira-avatar.png"
                  alt="AIRA"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-[family-name:var(--font-nunito)] font-bold mb-1 text-sm" style={{ color: NAVY }}>
                  AIRA says:
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(28,27,75,0.70)" }}>
                  &ldquo;{tip}&rdquo;
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: DARK, marginTop: "2rem" }}>
        <div
          className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(139,92,246,0.20)" }}
        >
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Learn What Matters" width={64} height={32} style={{ objectFit: "contain" }} />
            <span style={{ color: "rgba(255,255,255,0.30)", fontSize: "12px" }}>
              © {new Date().getFullYear()} Learn What Matters
            </span>
          </div>
          <a
            href="https://learnwhatmatters.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold hover:underline"
            style={{ color: "#A78BFA" }}
          >
            learnwhatmatters.in →
          </a>
        </div>
      </footer>
    </div>
  );
}
