"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { missions } from "@/data/missions/fun-science";
import ProtectedVideo from "@/components/ProtectedVideo";

type Props = { params: Promise<{ id: string }> };

const SKY = "#29ABE2";
const ORANGE = "#E8420A";
const NAVY = "#0D2244";
const BG = "#FFFDF8";
const INK = "#1A2B4A";

export default function ExperimentPage({ params }: Props) {
  const { id } = use(params);
  const experimentId = Number(id);
  const experiment = missions.find((m) => m.id === experimentId);
  if (!experiment) notFound();

  const prevExperiment = missions.find((m) => m.id === experimentId - 1);
  const nextExperiment = missions.find((m) => m.id === experimentId + 1);
  const total = missions.length;

  return (
    <div className="min-h-screen" style={{ background: BG }}>

      {/* Sticky top bar */}
      <header
        className="sticky top-0 z-50 backdrop-blur-sm"
        style={{ background: "transparent", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/fun-science"
            className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#0D2244" }}
          >
            <span>←</span>
            <span>Back</span>
          </Link>

          <Image
            src="/logo.png"
            alt="Learn What Matters"
            width={110}
            height={28}
            className="object-contain"
            style={{ maxHeight: 28 }}
          />

          <a
            href="https://learnwhatmatters.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: "#0D2244" }}
          >
            Get the Workbook →
          </a>
        </div>
      </header>

      {/* Prev / Next navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-5">
        <div className="flex items-center gap-3">
          {prevExperiment ? (
            <Link
              href={`/fun-science/experiment/${prevExperiment.id}`}
              className="flex-1 rounded-xl px-4 py-3 flex items-center gap-3 border hover:border-[#29ABE2] hover:shadow-sm transition-all group"
              style={{ background: "#ffffff", borderColor: "rgba(41,171,226,0.2)" }}
            >
              <span className="transition-colors group-hover:text-[#29ABE2]" style={{ color: "rgba(41,171,226,0.5)" }}>←</span>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(26,43,74,0.45)" }}>Previous</div>
                <div className="text-sm font-semibold truncate" style={{ color: INK }}>{prevExperiment.subtitle}</div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextExperiment ? (
            <Link
              href={`/fun-science/experiment/${nextExperiment.id}`}
              className="flex-1 rounded-xl px-4 py-3 flex items-center justify-end gap-3 border hover:border-[#29ABE2] hover:shadow-sm transition-all group text-right"
              style={{ background: "#ffffff", borderColor: "rgba(41,171,226,0.2)" }}
            >
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(26,43,74,0.45)" }}>Next</div>
                <div className="text-sm font-semibold truncate" style={{ color: INK }}>{nextExperiment.subtitle}</div>
              </div>
              <span className="transition-colors group-hover:text-[#29ABE2]" style={{ color: "rgba(41,171,226,0.5)" }}>→</span>
            </Link>
          ) : (
            <Link
              href="/fun-science"
              className="flex-1 rounded-xl px-4 py-3 flex items-center justify-end gap-3 border hover:border-[#29ABE2] hover:shadow-sm transition-all group text-right"
              style={{ background: "#ffffff", borderColor: "rgba(41,171,226,0.2)" }}
            >
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "rgba(26,43,74,0.45)" }}>You did it!</div>
                <div className="text-sm font-semibold" style={{ color: ORANGE }}>Back to Fun Science 🏆</div>
              </div>
              <span className="transition-colors group-hover:text-[#29ABE2]" style={{ color: "rgba(41,171,226,0.5)" }}>→</span>
            </Link>
          )}
        </div>
      </div>

      {/* Split layout */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ── LEFT: vertical video ── */}
          <div className="w-full lg:flex-shrink-0 lg:w-[300px]">
            {/* On mobile: centre the video as a narrow column */}
            <div className="max-w-[300px] mx-auto lg:mx-0">
              <ProtectedVideo
                missionId={experiment.id}
                videoUrl={experiment.videoUrl}
                title={experiment.subtitle}
                productSlug="fun-science"
                vertical={true}
                lightMode={true}
              />
            </div>
          </div>

          {/* ── RIGHT: info panel ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-6 lg:pt-2">

            {/* Title */}
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${experiment.gradient} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
                {experiment.planet}
              </div>
              <div>
                <div className="inline-flex items-center rounded-full px-3 py-0.5 mb-2" style={{ background: SKY }}>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-white">
                    Experiment {experimentId} of {total}
                  </span>
                </div>
                <h1 className="font-[family-name:var(--font-space)] text-2xl sm:text-3xl font-bold leading-tight" style={{ color: NAVY }}>
                  {experiment.subtitle}
                </h1>
              </div>
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed" style={{ color: "rgba(26,43,74,0.70)" }}>
              {experiment.description}
            </p>

            {/* Workbook CTA */}
            <div
              className="rounded-xl px-5 py-4 flex items-center gap-4"
              style={{ background: "#EEF8FE", borderLeft: "4px solid #29ABE2" }}
            >
              <span className="text-2xl flex-shrink-0">✏️</span>
              <p className="text-sm leading-relaxed" style={{ color: INK }}>
                <span className="font-semibold">After watching, open your workbook</span>{" "}
                and follow the steps to do the experiment yourself — everything you need is in the book!
              </p>
            </div>

            {/* Professor note */}
            <div
              className="rounded-2xl p-5 flex items-center gap-5"
              style={{ background: "linear-gradient(135deg, #EEF8FE, #FFFDF8)", border: "2px solid #29ABE2" }}
            >
              <div className="flex-shrink-0">
                <Image src="/scientist.png" alt="The Professor" width={80} height={80} className="object-contain" />
              </div>
              <div>
                <p className="font-[family-name:var(--font-space)] font-bold mb-1 text-sm" style={{ color: NAVY }}>
                  The Professor says:
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(26,43,74,0.70)" }}>
                  Watch the video first to see how it works — then open your workbook, gather your materials, and try it yourself. Science is best when you do it!
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: NAVY }}>
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
          © {new Date().getFullYear()} Learn What Matters
        </div>
      </footer>
    </div>
  );
}
