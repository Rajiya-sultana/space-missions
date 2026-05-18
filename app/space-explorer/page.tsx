import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProduct } from "@/data/products";
import { missions } from "@/data/missions/space-explorer";
import { MissionGrid } from "@/components/MissionGrid";
import { MobileMissionList } from "@/components/MobileMissionList";
import { StarBackground } from "@/components/StarBackground";

export const metadata: Metadata = {
  title: "Space Explorer — Mission HQ",
  description:
    "Explore the solar system, rockets, astronauts, and the mysteries of deep space across 10 epic missions!",
};

export default function SpaceExplorerPage() {
  const product = getProduct("space-explorer")!;

  return (
    <div className="relative min-h-screen">
      <StarBackground />

      {/* Nebula blobs */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-blue-900/25 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-900/20 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050714]/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                <span>←</span>
                <span>Back</span>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-xl">{product.icon}</span>
                <span className="font-[family-name:var(--font-space)] font-bold text-white text-sm sm:text-base tracking-tight">
                  Mission HQ
                </span>
              </div>
            </div>
            {product.shopifyProductId && (
              <a
                href={product.shopifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-orange-400 transition-colors hidden sm:block"
              >
                Get the Workbook →
              </a>
            )}
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 pt-12 pb-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-orange-300 text-xs font-semibold tracking-wide uppercase">
                {product.title} Workbook
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-space)] text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Welcome,{" "}
              <span className="shimmer-text">{product.tagline}!</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
              {product.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-lg">🎖️</span>
                <span>{missions.length} Mission Badges</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-lg">🏆</span>
                <span>1 Certificate</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-lg">🎬</span>
                <span>3D Animated Videos</span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-4 rounded-full bg-orange-500/20 blur-2xl" />
              {product.mascotImage ? (
                <div className="relative mascot-float">
                  <Image
                    src={product.mascotImage}
                    alt={`${product.title} mascot`}
                    width={220}
                    height={220}
                    priority
                    className="drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]"
                    style={{ mixBlendMode: "screen" }}
                  />
                </div>
              ) : (
                <div className="relative mascot-float select-none" style={{ fontSize: "140px", lineHeight: 1 }}>
                  {product.icon}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4">
          <div className="border-t border-white/5" />
        </div>

        {/* Mission section */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          {/* Desktop header + grid — hidden on mobile */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <h2 className="font-[family-name:var(--font-space)] text-xl font-bold text-white">
              Choose Your Mission
            </h2>
            <span className="text-xs text-slate-500 font-mono">{missions.length} missions total</span>
          </div>
          <div className="hidden md:block">
            <MissionGrid missions={missions} productSlug={product.slug} />
          </div>

          {/* Mobile list view — hidden on desktop */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-3">
              <p className="font-[family-name:var(--font-space)] font-extrabold text-white" style={{ fontSize: "18px" }}>
                Choose Your Mission
              </p>
              <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                {missions.length} missions total
              </span>
            </div>
            <MobileMissionList missions={missions} productSlug="space-explorer" />
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="text-5xl flex-shrink-0">🏆</div>
            <div className="flex-1">
              <h3 className="font-[family-name:var(--font-space)] font-bold text-white text-lg mb-1">
                Complete all {missions.length} missions!
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Watch every video, complete the activities in your workbook, and earn your{" "}
                <span className="text-orange-400 font-semibold">Certified Explorer Certificate!</span>
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 mt-4">
          <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} Learn What Matters. All rights reserved.</span>
            <a
              href="https://learnwhatmatters.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-400 transition-colors"
            >
              learnwhatmatters.in
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
