"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Home", emoji: "🏠", href: "/" },
  { label: "Space", emoji: "🚀", href: "/space-explorer" },
  { label: "Science", emoji: "🧪", href: "/fun-science" },
  { label: "Profile", emoji: "👤", href: "/" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-white"
      style={{ height: "64px", borderTop: "2px solid #F0F0F0" }}
    >
      <div className="grid grid-cols-4 h-full">
        {TABS.map(({ label, emoji, href }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className="relative flex flex-col items-center justify-center gap-0.5"
            >
              {isActive && (
                <span
                  className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ width: "6px", height: "6px", background: "#fc9c00" }}
                />
              )}
              <span style={{ fontSize: "20px", lineHeight: 1 }}>{emoji}</span>
              <span
                className="font-semibold"
                style={{
                  fontSize: "10px",
                  color: isActive ? "#3b0a45" : "#9CA3AF",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
