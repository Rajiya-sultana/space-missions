"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";

const LOGO =
  "https://learnwhatmatters.in/cdn/shop/files/Learn_what_matters_Logo.png?v=1775811659&width=300";
const GOLD = "#fc9c00";
const NAVY = "#0D2244";
const PURPLE = "#3b0a45";

interface StaticProduct {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  emoji: string;
  gradient: string;
  accent: string;
  hoverBorderClass: string;
  total: number;
  href: string;
  heroImage: string;
  buyUrl: string;
}

const PRODUCTS: StaticProduct[] = [
  {
    slug: "space-explorer",
    title: "Ultimate Space Explorer",
    tagline: "10 MISSIONS · SPACE & ASTRONOMY",
    description: "Fly through the solar system across 10 animated missions with Captain Nova.",
    emoji: "🚀",
    gradient: "from-orange-500 to-purple-700",
    accent: "#fc9c00",
    hoverBorderClass: "hover:border-[#fc9c00]",
    total: 10,
    href: "/space-explorer",
    heroImage: "/thumb-space-explorer.jpg",
    buyUrl: "https://learnwhatmatters.in/products/the-ultimate-space-explorer-workbook",
  },
  {
    slug: "fun-science",
    title: "Fun Science Experiments",
    tagline: "20 EXPERIMENTS · AGES 6–10",
    description: "Conduct real experiments at home using everyday kitchen materials.",
    emoji: "🧪",
    gradient: "from-sky-500 to-blue-700",
    accent: "#29ABE2",
    hoverBorderClass: "hover:border-[#29ABE2]",
    total: 20,
    href: "/fun-science",
    heroImage: "/thumb-fun-science.jpg",
    buyUrl: "https://learnwhatmatters.in/products/fun-easy-science-experiments-for-kids-stem-workbook",
  },
];

interface CardProps {
  product: StaticProduct;
  owned: boolean;
  watched: number;
}

function CardUI({ product, owned, watched }: CardProps) {
  const router = useRouter();
  const progress = product.total > 0 ? watched / product.total : 0;

  return (
    <div
      onClick={() => router.push(product.href)}
      className={`bg-white rounded-[24px] overflow-hidden border-2 border-[#F0F0F0] shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] ${product.hoverBorderClass} flex flex-col h-full cursor-pointer`}
    >
      {/* Image area */}
      <div
        className={`relative bg-gradient-to-br ${product.gradient} flex items-center justify-center overflow-hidden flex-shrink-0`}
        style={{ height: "200px" }}
      >
        <Image
          src={product.heroImage}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 88vw, 33vw"
        />
        {!owned && (
          <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: "rgba(0,0,0,0.45)" }}>
            <span className="text-5xl">🔒</span>
          </div>
        )}
        <div
          className="absolute top-3 left-3 text-white font-extrabold uppercase rounded-full px-3 py-1 z-20"
          style={{ fontSize: "11px", background: owned ? "#3DB549" : "#9CA3AF" }}
        >
          {owned ? "OWNED" : "LOCKED"}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-[family-name:var(--font-space)] font-extrabold mb-1"
          style={{ fontSize: "18px", color: NAVY }}
        >
          {product.title}
        </h3>
        <p
          className="font-bold uppercase mb-3"
          style={{ fontSize: "12px", letterSpacing: "1.5px", color: product.accent }}
        >
          {product.tagline}
        </p>
        <p className="mb-4 flex-1" style={{ fontSize: "13px", color: "#4A5E78" }}>
          {product.description}
        </p>

        {owned && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: "#9CA3AF" }}>Progress</span>
              <span className="text-xs" style={{ color: "#9CA3AF" }}>
                {watched} of {product.total}
              </span>
            </div>
            <div className="rounded-full" style={{ height: "8px", background: "#F0F0F0" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round(progress * 100)}%`, background: product.accent }}
              />
            </div>
            <p className="mt-1" style={{ fontSize: "11px", color: "#9CA3AF" }}>
              {watched === 0 ? "Not started yet" : `${watched} video${watched === 1 ? "" : "s"} watched`}
            </p>
          </div>
        )}

        {owned ? (
          <div
            className="w-full text-center font-extrabold text-white rounded-xl py-3"
            style={{ background: product.accent, fontSize: "14px" }}
          >
            {watched === 0 ? "Start Learning →" : "Continue Learning →"}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div
              className="w-full text-center font-extrabold rounded-xl py-3 text-[14px] border-2"
              style={{ borderColor: product.accent, color: product.accent }}
            >
              ▶ Watch Free Preview
            </div>
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #F0F0F0" }}>
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>🔒 Not purchased</span>
              <a
                href={product.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-bold hover:underline"
                style={{ color: GOLD, fontSize: "13px" }}
              >
                Buy Now →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default function HubPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { user, purchaseMap, loading, logout } = useAuth();
  const { completed: spaceCompleted } = useProgress("space-explorer");
  const { completed: funCompleted } = useProgress("fun-science");

  const progressBySlug: Record<string, Set<number>> = {
    "space-explorer": spaceCompleted,
    "fun-science": funCompleted,
  };

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const cardWidth = window.innerWidth * 0.85 + 16;
    const index = Math.round(scrollRef.current.scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(index, 0), PRODUCTS.length - 1));
  }, []);

  const scrollByCard = (dir: "left" | "right") => {
    const cardWidth = window.innerWidth * 0.85 + 16;
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  const totalWatched = spaceCompleted.size + funCompleted.size;

  return (
    <div className="min-h-screen" style={{ background: "#FFFDF8" }}>

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 bg-white"
        style={{ borderBottom: "2px solid #F0F0F0", height: "64px" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <a href="/">
            <Image src={LOGO} alt="Learn What Matters" width={80} height={40} unoptimized style={{ objectFit: "contain" }} />
          </a>
          {!loading && (
            user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm hidden sm:block" style={{ color: "#4A5E78" }}>{user.email}</span>
                <button
                  onClick={logout}
                  className="font-bold text-sm transition-opacity hover:opacity-80"
                  style={{ border: `2px solid #E0E0E0`, color: "#4A5E78", borderRadius: "8px", padding: "7px 16px" }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <p className="text-sm hidden sm:block" style={{ color: "#9CA3AF" }}>
                Sign in inside any product to unlock videos
              </p>
            )
          )}
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: "linear-gradient(135deg, #3b0a45 0%, #1a0a2e 100%)", paddingTop: "48px", paddingBottom: "48px" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <div
              className="inline-flex items-center rounded-full px-4 py-1.5 mb-5 text-xs font-bold tracking-widest uppercase"
              style={{ background: "rgba(252,156,0,0.15)", border: `1px solid ${GOLD}`, color: GOLD }}
            >
              🎓 YOUR LEARNING HUB
            </div>
            <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white mb-4">
              Everything you bought,<br />
              <span style={{ color: GOLD }}>ready to watch.</span>
            </h1>
            <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.70)" }}>
              Pick a product below to continue learning.<br className="hidden sm:block" />
              Your videos are waiting.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: "rgba(255,255,255,0.08)" }}>
                📦 {PRODUCTS.length} Products Available
              </span>
              <span className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: "rgba(252,156,0,0.15)", border: `1px solid ${GOLD}`, color: GOLD }}>
                🔥 Start Learning Today
              </span>
            </div>
          </div>

          {/* Progress card */}
          <div className="flex-shrink-0 w-full md:w-auto flex justify-center">
            <div className="w-full md:w-[280px] rounded-[20px] p-5" style={{ background: "#ffffff", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
              {user ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-[family-name:var(--font-space)] font-bold text-sm" style={{ color: NAVY }}>Your Progress</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider rounded-full px-2 py-0.5" style={{ background: "rgba(61,181,73,0.12)", color: "#3DB549" }}>LIVE</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {PRODUCTS.map((p) => {
                      const watched = progressBySlug[p.slug]?.size ?? 0;
                      const pct = p.total > 0 ? Math.round((watched / p.total) * 100) : 0;
                      return (
                        <div key={p.slug}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold" style={{ color: NAVY }}>{p.emoji} {p.title.split(" ")[0]} {p.title.split(" ")[1]}</span>
                            <span className="text-[11px]" style={{ color: "#9CA3AF" }}>{watched}/{p.total}</span>
                          </div>
                          <div className="rounded-full" style={{ height: "6px", background: "#F0F0F0" }}>
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: p.accent }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 pt-3 text-[11px] text-center border-t" style={{ color: "#9CA3AF", borderColor: "#F0F0F0" }}>
                    {totalWatched === 0 ? "Start watching to track progress" : `${totalWatched} video${totalWatched === 1 ? "" : "s"} watched total`}
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center text-center gap-3 py-2">
                  <span className="text-4xl">🔓</span>
                  <p className="font-[family-name:var(--font-space)] font-bold text-sm" style={{ color: NAVY }}>Unlock your videos</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
                    Sign in inside any product below to access your purchased content.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT CARDS ── */}
      <section style={{ paddingTop: "60px", paddingBottom: "60px" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 px-6">
            <h2 className="font-[family-name:var(--font-space)] font-extrabold" style={{ fontSize: "22px", color: NAVY }}>
              My Products
            </h2>
            <span className="text-sm" style={{ color: "#9CA3AF" }}>{PRODUCTS.length} available</span>
          </div>

          {/* Desktop grid */}
          <div className={`hidden md:grid gap-6 px-6 ${PRODUCTS.length === 1 ? "md:grid-cols-1 max-w-xs mx-auto" : PRODUCTS.length === 2 ? "md:grid-cols-2 max-w-[760px]" : "md:grid-cols-3"}`}>
            {PRODUCTS.map((p) => (
              <CardUI
                key={p.slug}
                product={p}
                owned={!!(user && purchaseMap[p.slug])}
                watched={progressBySlug[p.slug]?.size ?? 0}
              />
            ))}
          </div>

          {/* Mobile carousel */}
          <div className="md:hidden">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex snap-x snap-mandatory overflow-x-auto [&::-webkit-scrollbar]:hidden"
              style={{ gap: "16px", padding: "4px 20px 4px", scrollbarWidth: "none", scrollBehavior: "smooth" }}
            >
              {PRODUCTS.map((p) => (
                <div key={p.slug} className="snap-start flex-shrink-0" style={{ flex: "0 0 88vw" }}>
                  <CardUI
                    product={p}
                    owned={!!(user && purchaseMap[p.slug])}
                    watched={progressBySlug[p.slug]?.size ?? 0}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => scrollByCard("left")}
                className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-[#F0F0F0] bg-white text-[#0D2244] text-xl cursor-pointer transition-all duration-200 hover:bg-[#3b0a45] hover:text-white hover:border-[#3b0a45] flex-shrink-0"
                aria-label="Previous"
              >
                ‹
              </button>
              {PRODUCTS.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === activeIndex ? "24px" : "8px", height: "8px", background: i === activeIndex ? PURPLE : "#D1D5DB" }}
                />
              ))}
              <button
                onClick={() => scrollByCard("right")}
                className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-[#F0F0F0] bg-white text-[#0D2244] text-xl cursor-pointer transition-all duration-200 hover:bg-[#3b0a45] hover:text-white hover:border-[#3b0a45] flex-shrink-0"
                aria-label="Next"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1a0a2e", paddingTop: "32px", paddingBottom: "32px" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src={LOGO} alt="Learn What Matters" width={64} height={32} unoptimized style={{ objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.5 }} />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>© {new Date().getFullYear()} Learn What Matters</span>
          </div>
          <a href="https://learnwhatmatters.in" target="_blank" rel="noopener noreferrer" className="font-semibold text-sm hover:underline" style={{ color: GOLD }}>
            learnwhatmatters.in →
          </a>
        </div>
      </footer>
    </div>
  );
}
