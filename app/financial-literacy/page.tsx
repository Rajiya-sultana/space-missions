import type { Metadata } from "next";
import Link from "next/link";
import { missions, books } from "@/data/missions/financial-literacy";
import { MobileMissionList } from "@/components/MobileMissionList";

export const metadata: Metadata = {
  title: "Financial Literacy — Learn What Matters",
  description:
    "Three books, 15 video lessons — learn what money is, how to use it smartly, and think like a money pro!",
};

const BG   = "#FFFBF0";
const NAVY = "#1C1B4B";
const GOLD = "#F59E0B";

export default function FinancialLiteracyPage() {
  return (
    <div className="min-h-screen" style={{ background: BG }}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: "transparent" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: NAVY }}
          >
            <span>←</span>
            <span>Back</span>
          </Link>
          <span />
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

      {/* ── HERO ── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, #2D2B6B 50%, #1a1840 100%)`,
          paddingTop: "56px",
          paddingBottom: "56px",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-10">

          {/* Left: text */}
          <div className="flex-1 text-center md:text-left">
            <div
              className="inline-flex items-center rounded-full px-4 py-1.5 mb-5"
              style={{ background: GOLD }}
            >
              <span
                className="text-xs font-extrabold tracking-widest uppercase"
                style={{ color: NAVY }}
              >
                Financial Literacy — 3 Books · 15 Lessons
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-space)] text-4xl sm:text-5xl font-bold leading-tight mb-4 text-white">
              Master Your{" "}
              <span style={{ color: GOLD }}>Money</span>
              <br />
              <span style={{ color: "#A78BFA" }}>Journey.</span>
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed mb-6 mx-auto md:mx-0"
              style={{ color: "rgba(255,255,255,0.75)", maxWidth: "440px" }}
            >
              From discovering what money is to thinking like a money pro — three books, 15 video lessons that build real financial confidence in kids.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {books.map((b) => (
                <div
                  key={b.number}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.80)" }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: b.accent }}
                  />
                  <span>Book {b.number}: {b.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: big coin illustration */}
          <div
            className="flex-shrink-0 w-44 h-44 md:w-52 md:h-52 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: `radial-gradient(circle at 35% 35%, #FCD34D, ${GOLD} 60%, #D97706)`,
              boxShadow: `0 0 60px ${GOLD}55, 0 20px 60px rgba(0,0,0,0.4)`,
            }}
          >
            <span className="text-8xl select-none" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>
              💰
            </span>
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ── */}
      <div style={{ background: "#1a1840", lineHeight: 0, marginBottom: "-2px" }}>
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
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
                  style={{ background: book.accent }}
                >
                  {book.number}
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: book.accent }}>
                    Book {book.number}
                  </p>
                  <h2
                    className="font-[family-name:var(--font-space)] text-lg font-bold leading-tight"
                    style={{ color: NAVY }}
                  >
                    {book.title}
                  </h2>
                </div>
                <div
                  className="ml-auto text-xs font-mono"
                  style={{ color: `${book.accent}CC` }}
                >
                  {bookMissions.length} lessons
                </div>
              </div>

              {/* Mobile list */}
              <div className="md:hidden mb-4">
                <MobileMissionList
                  missions={bookMissions}
                  productSlug="financial-literacy"
                  pathSegment="lesson"
                  lightMode={true}
                  accentColor={book.accent}
                  label={`LESSON`}
                />
              </div>

              {/* Desktop — 3-column grid */}
              <div className="hidden md:grid grid-cols-3 gap-5">
                {bookMissions.map((mission) => {
                  return (
                    <Link
                      key={mission.id}
                      href={`/financial-literacy/lesson/${mission.id}`}
                      className="group block focus:outline-none"
                    >
                      <div
                        className="h-full flex flex-col overflow-hidden transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.08)] group-hover:scale-[1.03] group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)]"
                        style={{
                          background: "#ffffff",
                          borderRadius: "18px",
                          border: `1.5px solid ${book.accent}25`,
                        }}
                      >
                        {/* Gradient top */}
                        <div
                          className={`relative h-40 bg-gradient-to-br ${mission.gradient} flex items-center justify-center overflow-hidden`}
                        >
                          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
                          <span className="text-6xl drop-shadow-lg select-none">{mission.planet}</span>

                          {/* Lesson badge */}
                          <div
                            className="absolute top-3 left-3 rounded-full px-2.5 py-0.5"
                            style={{ background: NAVY }}
                          >
                            <span className="text-[10px] font-mono font-extrabold tracking-widest text-white uppercase">
                              {mission.title}
                            </span>
                          </div>

                          {/* FREE badge */}
                          {mission.id === 1 && (
                            <div
                              className="absolute top-3 right-3 rounded-full px-2.5 py-0.5"
                              style={{ background: "#10B981" }}
                            >
                              <span className="text-[10px] font-extrabold text-white uppercase">FREE</span>
                            </div>
                          )}

                          {/* Book color dot */}
                          <div
                            className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full"
                            style={{ background: book.accent, boxShadow: `0 0 6px ${book.accent}` }}
                          />
                        </div>

                        {/* Card body */}
                        <div
                          className="p-4 flex flex-col flex-1 gap-2"
                          style={{
                            background: `linear-gradient(160deg, ${book.accent}08 0%, #ffffff 60%)`,
                          }}
                        >
                          <h3
                            className="font-[family-name:var(--font-space)] text-base font-bold leading-snug"
                            style={{ color: NAVY }}
                          >
                            {mission.subtitle}
                          </h3>
                          <p
                            className="text-xs leading-relaxed line-clamp-2 flex-1"
                            style={{ color: "rgba(28,27,75,0.55)" }}
                          >
                            {mission.description}
                          </p>
                          <div
                            className="mt-2 flex items-center justify-end gap-1 font-bold text-xs"
                            style={{ color: mission.videoUrl ? book.accent : `${book.accent}70` }}
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
                  );
                })}
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
          style={{ background: NAVY }}
        >
          <div className="text-5xl flex-shrink-0">🏆</div>
          <div className="flex-1 text-center sm:text-left">
            <h3
              className="font-[family-name:var(--font-space)] font-bold text-white text-lg mb-1"
            >
              Complete all 15 lessons!
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Watch every video across all three books and become a{" "}
              <span className="font-semibold" style={{ color: GOLD }}>
                real Money Pro!
              </span>
            </p>
          </div>
          <a
            href="https://learnwhatmatters.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 font-bold rounded-xl px-6 py-3 text-sm transition-opacity hover:opacity-90"
            style={{ background: GOLD, color: NAVY }}
          >
            Get the Workbooks →
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
            style={{ color: GOLD }}
          >
            learnwhatmatters.in
          </a>
        </div>
      </footer>
    </div>
  );
}
