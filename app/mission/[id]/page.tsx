import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { missions } from "@/data/missions";
import ProtectedVideo from "@/components/ProtectedVideo";
import { StarBackground } from "@/components/StarBackground";
import UserProfileButton from "@/components/UserProfileButton";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const mission = missions.find((m) => m.id === Number(id));
  if (!mission) return {};
  return {
    title: `${mission.title}: ${mission.subtitle} — Space Explorer`,
    description: mission.description,
  };
}


export default async function MissionPage({ params }: Props) {
  const { id } = await params;
  const missionId = Number(id);
  const mission = missions.find((m) => m.id === missionId);

  if (!mission) notFound();

  const prev = missions.find((m) => m.id === missionId - 1);
  const next = missions.find((m) => m.id === missionId + 1);

  return (
    <div className="relative min-h-screen">
      <StarBackground />

      {/* Nebula blobs */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-900/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-blue-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050714]/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
            >
              <span>←</span>
              <span>Mission HQ</span>
            </Link>
            <span className="font-[family-name:var(--font-space)] font-bold text-white text-sm">
              {mission.title}
            </span>
            <UserProfileButton />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Mission header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mission.gradient} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
              {mission.planet}
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase mb-1">
                {mission.title} of {missions.length}
              </div>
              <h1 className="font-[family-name:var(--font-space)] text-2xl sm:text-3xl font-bold text-white leading-tight">
                {mission.subtitle}
              </h1>
            </div>
          </div>

          {/* Video player */}
          <ProtectedVideo missionId={missionId} videoUrl={mission.videoUrl} title={mission.subtitle} />

          {/* Return to workbook callout */}
          <div className="glass-card rounded-xl px-5 py-4 flex items-center gap-4">
            <span className="text-2xl flex-shrink-0">✏️</span>
            <p className="text-sm text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">After the video, return to your workbook</span>{" "}
              to complete the mission activities and earn your{" "}
              <span className="text-orange-400 font-semibold">Mission Badge!</span>
            </p>
          </div>

          {/* Mission description */}
          <p className="text-slate-400 text-base leading-relaxed">{mission.description}</p>

          {/* Captain Nova encouragement */}
          <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-2 rounded-full bg-orange-500/20 blur-xl" />
              <Image
                src="/captain-nova.png"
                alt="Captain Nova"
                width={100}
                height={100}
                className="relative drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                style={{ mixBlendMode: "screen" }}
              />
            </div>
            <div>
              <p className="font-[family-name:var(--font-space)] font-bold text-white mb-1">
                Captain Nova says:
              </p>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                &ldquo;Amazing work, Space Explorer! Complete your workbook activities to earn your badge.
                I&apos;ll be right here for every mission! 🌟&rdquo;
              </p>
            </div>
          </div>

          {/* Prev / Next navigation */}
          <div className="flex items-center gap-4">
            {prev ? (
              <Link
                href={`/mission/${prev.id}`}
                className="flex-1 glass-card rounded-xl p-4 flex items-center gap-3 hover:border-orange-500/30 transition-all group"
              >
                <span className="text-slate-500 group-hover:text-orange-400 transition-colors">←</span>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Previous</div>
                  <div className="text-sm font-semibold text-white truncate">{prev.subtitle}</div>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {next ? (
              <Link
                href={`/mission/${next.id}`}
                className="flex-1 glass-card rounded-xl p-4 flex items-center justify-end gap-3 hover:border-orange-500/30 transition-all group text-right"
              >
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Next</div>
                  <div className="text-sm font-semibold text-white truncate">{next.subtitle}</div>
                </div>
                <span className="text-slate-500 group-hover:text-orange-400 transition-colors">→</span>
              </Link>
            ) : (
              <Link
                href="/"
                className="flex-1 glass-card rounded-xl p-4 flex items-center justify-end gap-3 hover:border-orange-500/30 transition-all group text-right"
              >
                <div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">You did it!</div>
                  <div className="text-sm font-semibold text-orange-400">Back to Mission HQ 🏆</div>
                </div>
                <span className="text-slate-500 group-hover:text-orange-400 transition-colors">→</span>
              </Link>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 mt-8">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} Learn What Matters
          </div>
        </footer>
      </div>
    </div>
  );
}
