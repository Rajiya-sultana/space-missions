import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { missions, books } from "@/data/missions/ai-for-kids";
import { MobileMissionList } from "@/components/MobileMissionList";
import { BrandLogo } from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "AI for Kids — Learn What Matters",
  description:
    "Three books, 25 video lessons — meet AIRA and explore AI from the ground up across 3 exciting levels!",
};

const BG      = "#F5EEFF";
const NAVY    = "#1C1B4B";
const PURPLE  = "#7C3AED";
const DARK    = "#1E0B4B";
const ORANGE  = "#F97316";

export default function AiForKidsPage() {
  return (
    <div className="min-h-screen" style={{ background: BG }}>

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: "rgba(245,238,255,0.92)", borderBottom: "1px solid rgba(139,92,246,0.12)" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: NAVY }}
          >
            <span>←</span>
            <span>Back</span>
          </Link>
          <BrandLogo />
          <a
            href="https://learnwhatmatters.in/products/ai-for-kids"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: PURPLE }}
          >
            Get the Books →
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${DARK} 0%, #3B1082 45%, #5B21B6 80%, #6D28D9 100%)`,
          paddingTop: "56px",
          paddingBottom: "64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Circuit-dot decorative background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {[
            { top: "12%", left: "6%",  size: 6,  opacity: 0.25 },
            { top: "25%", left: "18%", size: 4,  opacity: 0.18 },
            { top: "55%", left: "9%",  size: 8,  opacity: 0.20 },
            { top: "75%", left: "22%", size: 5,  opacity: 0.15 },
            { top: "10%", right: "8%", size: 7,  opacity: 0.22 },
            { top: "40%", right: "5%", size: 4,  opacity: 0.18 },
            { top: "65%", right: "15%",size: 9,  opacity: 0.20 },
            { top: "85%", right: "28%",size: 5,  opacity: 0.15 },
          ].map((dot, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: dot.top,
                left: "left" in dot ? dot.left : undefined,
                right: "right" in dot ? dot.right : undefined,
                width:  dot.size,
                height: dot.size,
                background: "#A78BFA",
                opacity: dot.opacity,
              }}
            />
          ))}
          {/* Glow blobs */}
          <div
            className="absolute rounded-full"
            style={{ top: "-10%", right: "15%", width: 400, height: 400, background: PURPLE, opacity: 0.15, filter: "blur(100px)" }}
          />
          <div
            className="absolute rounded-full"
            style={{ bottom: "-5%", left: "10%", width: 300, height: 300, background: "#06B6D4", opacity: 0.10, filter: "blur(80px)" }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Left: Text */}
          <div className="flex-1 text-center md:text-left">
            <style>{`
              @keyframes hero-fade-up {
                from { opacity: 0; transform: translateY(24px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              @keyframes aira-glow {
                0%, 100% { text-shadow: 0 0 8px rgba(249,115,22,0.4); }
                50%       { text-shadow: 0 0 24px rgba(249,115,22,0.9), 0 0 48px rgba(249,115,22,0.4); }
              }
              .hero-badge  { animation: hero-fade-up 0.6s ease both; animation-delay: 0.1s; }
              .hero-line1  { animation: hero-fade-up 0.6s ease both; animation-delay: 0.25s; }
              .hero-line2  { animation: hero-fade-up 0.6s ease both; animation-delay: 0.4s; }
              .hero-para   { animation: hero-fade-up 0.6s ease both; animation-delay: 0.55s; }
              .hero-pills  { animation: hero-fade-up 0.6s ease both; animation-delay: 0.7s; }
              .aira-name   { animation: aira-glow 3s ease-in-out infinite; }
            `}</style>

            <div
              className="hero-badge inline-flex items-center rounded-full px-4 py-1.5 mb-5"
              style={{ background: "rgba(139,92,246,0.25)", border: "1px solid rgba(167,139,250,0.50)" }}
            >
              <span className="text-xs font-extrabold tracking-widest uppercase" style={{ color: "#C4B5FD" }}>
                🤖 AI FOR KIDS — 3 BOOKS · 25 LESSONS
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-nunito)] text-4xl sm:text-5xl font-bold leading-tight mb-4">
              <span className="hero-line1 block text-white">
                Learn AI with{" "}
                <span className="aira-name" style={{ color: ORANGE }}>AIRA</span>
              </span>
              <span className="hero-line2 block" style={{ color: "#A78BFA" }}>Your AI Teammate.</span>
            </h1>

            <p
              className="hero-para text-base sm:text-lg leading-relaxed mb-7 mx-auto md:mx-0"
              style={{ color: "rgba(255,255,255,0.72)", maxWidth: "440px" }}
            >
              From what AI is to building your own AI ideas — three action-packed books and 25 video lessons that make every kid an AI expert.
            </p>

            {/* Book level pills */}
            <div className="hero-pills flex flex-wrap gap-3 justify-center md:justify-start">
              {books.map((b) => (
                <div
                  key={b.number}
                  className="flex items-center gap-2 rounded-full px-4 py-2"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: b.accent }}
                  />
                  <span className="text-sm font-semibold text-white">{b.level}: {b.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: AIRA illustration */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <style>{`
              @keyframes aira-float {
                0%, 100% { transform: translateY(0px); }
                50%       { transform: translateY(-12px); }
              }
            `}</style>
            <div className="relative" style={{ width: 240, height: 260 }}>
              {/* Soft shadow glow beneath */}
              <div
                className="absolute rounded-full"
                style={{
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 160,
                  height: 40,
                  background: "rgba(139,92,246,0.40)",
                  filter: "blur(24px)",
                }}
              />
              {/* AIRA image — floating */}
              <div style={{ animation: "aira-float 4s ease-in-out infinite" }}>
                <Image
                  src="/aira-avatar.png"
                  alt="AIRA — your AI guide"
                  width={240}
                  height={240}
                  style={{ objectFit: "contain", filter: "drop-shadow(0 8px 32px rgba(139,92,246,0.55))" }}
                  priority
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-3">
              {[
                { label: "25",  sub: "QR Videos" },
                { label: "3",   sub: "Levels" },
                { label: "40+", sub: "Activities" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center rounded-xl px-4 py-2.5"
                  style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.14)" }}
                >
                  <span className="font-[family-name:var(--font-nunito)] font-extrabold text-lg text-white leading-none">{s.label}</span>
                  <span className="text-[11px] mt-0.5" style={{ color: "#C4B5FD" }}>{s.sub}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── WAVE DIVIDER ── */}
      <div style={{ background: "#1E0B4B", lineHeight: 0, marginBottom: "-2px" }}>
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: "60px" }}
        >
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill={BG} />
        </svg>
      </div>

      {/* ── BOOK SECTIONS ── */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-14">
        {books.map((book) => {
          const bookMissions = missions.filter((m) => m.book === book.number);

          return (
            <section key={book.number}>

              {/* Book label */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0 shadow-md"
                  style={{
                    background: book.accent,
                    boxShadow: `0 4px 14px ${book.accent}50`,
                  }}
                >
                  {book.number}
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: book.accent }}>
                    Book {book.number} · {book.level}
                  </p>
                  <h2 className="font-[family-name:var(--font-nunito)] text-lg font-bold leading-tight" style={{ color: NAVY }}>
                    {book.title}
                  </h2>
                </div>
                <div className="ml-auto text-xs font-mono" style={{ color: `${book.accent}CC` }}>
                  {bookMissions.length} lessons
                </div>
              </div>

              {/* Mobile list */}
              <div className="md:hidden mb-4">
                <MobileMissionList
                  missions={bookMissions}
                  productSlug="ai-for-kids"
                  basePath={`/ai-for-kids/book${book.number}/lesson`}
                  lightMode={true}
                  accentColor={book.accent}
                  label="LESSON"
                />
              </div>

              {/* Desktop 3-column grid */}
              <div className="hidden md:grid grid-cols-3 gap-5">
                {bookMissions.map((mission, idx) => (
                  <Link
                    key={mission.id}
                    href={`/ai-for-kids/book${mission.book}/lesson/${idx + 1}`}
                    className="group block focus:outline-none"
                  >
                    <div
                      className="h-full flex flex-col overflow-hidden transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.07)] group-hover:scale-[1.03] group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)]"
                      style={{
                        background: "#ffffff",
                        borderRadius: "18px",
                        border: `1.5px solid ${book.accent}22`,
                      }}
                    >
                      {/* Card top — thumbnail or gradient fallback */}
                      <div className={`relative w-full aspect-video overflow-hidden ${!mission.thumbnail ? `bg-gradient-to-br ${mission.gradient}` : ""}`}>
                        {mission.thumbnail ? (
                          <Image
                            src={mission.thumbnail}
                            alt={mission.title}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
                            <span className="absolute inset-0 flex items-center justify-center text-6xl drop-shadow-lg select-none">{mission.planet}</span>
                          </>
                        )}

                        {/* FREE badge on lesson 1 */}
                        {mission.id === 1 && (
                          <div className="absolute top-3 right-3 rounded-full px-2.5 py-0.5" style={{ background: "#10B981" }}>
                            <span className="text-[10px] font-extrabold text-white uppercase">FREE</span>
                          </div>
                        )}

                        {/* Book colour dot */}
                        <div
                          className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full"
                          style={{ background: book.accent, boxShadow: `0 0 6px ${book.accent}` }}
                        />
                      </div>

                      {/* Card body */}
                      <div
                        className="p-4 flex flex-col flex-1 gap-1.5"
                        style={{ background: `linear-gradient(160deg, ${book.accent}08 0%, #ffffff 60%)` }}
                      >
                        <h3
                          className="font-[family-name:var(--font-nunito)] text-base font-bold leading-snug"
                          style={{ color: NAVY, letterSpacing: "0.04em" }}
                        >
                          {mission.title}
                        </h3>
                        <p className="text-xs leading-relaxed line-clamp-2 flex-1 mt-0.5" style={{ color: "rgba(28,27,75,0.55)" }}>
                          {mission.description}
                        </p>
                        <div
                          className="mt-2 flex items-center justify-end gap-1 font-bold text-xs"
                          style={{ color: mission.videoUrl ? book.accent : `${book.accent}60` }}
                        >
                          {mission.videoUrl ? (
                            <>
                              <span>Watch Lesson</span>
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
                ))}
              </div>

              {/* Separator between books */}
              {book.number < 3 && (
                <div
                  className="mt-10 h-px"
                  style={{ background: `linear-gradient(to right, transparent, ${book.accent}30, transparent)` }}
                />
              )}
            </section>
          );
        })}
      </div>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div
          className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: `linear-gradient(135deg, ${DARK}, #4C1D95)` }}
        >
          <div className="text-5xl flex-shrink-0">🤖</div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-[family-name:var(--font-nunito)] font-bold text-white text-lg mb-1">
              Complete all 25 lessons and become an AI Mission Pro!
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Work through all 3 levels with AIRA and earn your place as the next generation of AI innovators.
            </p>
          </div>
          <a
            href="https://learnwhatmatters.in/products/ai-for-kids"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 font-bold rounded-xl px-6 py-3 text-sm transition-opacity hover:opacity-90"
            style={{ background: ORANGE, color: "#fff" }}
          >
            Get the Books →
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: DARK }}>
        <div
          className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(139,92,246,0.20)" }}
        >
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Learn What Matters" width={72} height={36} style={{ objectFit: "contain" }} />
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>
              © {new Date().getFullYear()} Learn What Matters
            </span>
          </div>
          <a
            href="https://learnwhatmatters.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sm hover:underline"
            style={{ color: "#A78BFA" }}
          >
            learnwhatmatters.in →
          </a>
        </div>
      </footer>
    </div>
  );
}
