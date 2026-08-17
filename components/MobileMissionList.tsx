"use client";

import Link from "next/link";
import Image from "next/image";
import type { Mission } from "@/data/products";
import { useProgress } from "@/hooks/useProgress";

interface Props {
  missions: Mission[];
  productSlug: string;
  pathSegment?: string;
  basePath?: string; // overrides /${productSlug}/${pathSegment} when set
  label?: string;
  lightMode?: boolean;
  accentColor?: string;
}

export function MobileMissionList({ missions, productSlug, pathSegment = "mission", basePath, label = "MISSION", lightMode = false, accentColor = "#22c55e" }: Props) {
  const { completed } = useProgress(productSlug);

  const nextMission = missions.find((m) => !completed.has(m.id));
  const hasStarted = completed.size > 0;

  const rowBg      = lightMode ? "#ffffff" : "rgba(255,255,255,0.08)";
  const rowBorder  = lightMode ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.11)";
  const labelColor = lightMode ? "rgba(26,43,74,0.40)" : "rgba(255,255,255,0.40)";
  const titleColor = lightMode ? "#0A1628" : "white";
  const chevron    = lightMode ? "rgba(26,43,74,0.20)" : "rgba(255,255,255,0.25)";

  return (
    <div>
      {/* Continue banner */}
      {hasStarted && nextMission && (
        <Link
          href={basePath ? `${basePath}/${nextMission.id}` : `/${productSlug}/${pathSegment}/${nextMission.id}`}
          className="flex items-center justify-between mb-3 transition-all duration-200 active:opacity-80"
          style={{
            padding: "16px 18px",
            borderRadius: "20px",
            background: lightMode ? `${accentColor}12` : "rgba(16,55,38,0.85)",
            border: `1.5px solid ${accentColor}70`,
            gap: "14px",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: `${accentColor}25`,
                border: `1.5px solid ${accentColor}60`,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill={accentColor}>
                <path d="M4 2.5l9 5.5-9 5.5V2.5z" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 800, color: accentColor, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "2px" }}>
                Continue
              </p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: titleColor, letterSpacing: "0.04em" }}>
                {nextMission.subtitle}
              </p>
            </div>
          </div>
          <span style={{ fontSize: "20px", color: accentColor }}>→</span>
        </Link>
      )}

      {/* All complete banner */}
      {hasStarted && !nextMission && (
        <div
          className="flex items-center gap-3 mb-3"
          style={{
            padding: "16px 18px",
            borderRadius: "20px",
            background: lightMode ? "rgba(255,179,0,0.08)" : "rgba(55,40,10,0.85)",
            border: `1.5px solid rgba(234,179,8,0.4)`,
          }}
        >
          <span style={{ fontSize: "22px" }}>🏆</span>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#d97706" }}>All done!</p>
            <p style={{ fontSize: "11px", color: lightMode ? "rgba(26,43,74,0.5)" : "rgba(255,255,255,0.5)" }}>You've completed all modules. Keep hustling!</p>
          </div>
        </div>
      )}

      {/* Mission rows */}
      {missions.map((mission) => (
        <Link
          key={mission.id}
          href={basePath ? `${basePath}/${mission.id}` : `/${productSlug}/${pathSegment}/${mission.id}`}
          className="flex items-center mb-[10px] transition-all duration-200 active:opacity-80"
          style={{
            padding: "18px 16px",
            gap: "16px",
            borderRadius: "20px",
            background: rowBg,
            border: `1.5px solid ${completed.has(mission.id) ? `${accentColor}50` : rowBorder}`,
            backdropFilter: lightMode ? undefined : "blur(8px)",
            boxShadow: lightMode ? "0 1px 4px rgba(0,0,0,0.05)" : undefined,
          }}
        >
          {/* Icon */}
          <div
            className={`bg-gradient-to-br ${mission.gradient} flex items-center justify-center flex-shrink-0 relative overflow-hidden`}
            style={{ width: mission.thumbnail ? "96px" : "56px", height: "56px", borderRadius: mission.thumbnail ? "6px" : "14px", fontSize: "28px" }}
          >
            {mission.thumbnail ? (
              <Image src={mission.thumbnail} alt={mission.subtitle} fill className="object-cover" sizes="96px" />
            ) : (
              mission.planet
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: "10px", fontWeight: 800, color: labelColor, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                {label} {missions.findIndex((m) => m.id === mission.id) + 1}
              </span>
              {mission.id === 1 && (
                <span
                  style={{
                    fontSize: "9px", fontWeight: 800,
                    color: lightMode ? accentColor : "white",
                    background: lightMode ? `${accentColor}15` : "rgba(255,255,255,0.12)",
                    border: `1px solid ${lightMode ? `${accentColor}50` : "rgba(255,255,255,0.28)"}`,
                    padding: "2px 9px", borderRadius: "99px",
                  }}
                >
                  FREE
                </span>
              )}
            </div>
            <p style={{ fontSize: "16px", fontWeight: 700, color: titleColor, letterSpacing: "0.04em" }} className="truncate">
              {mission.subtitle}
            </p>
          </div>

          {/* Checkmark or chevron */}
          {completed.has(mission.id) ? (
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: "28px", height: "28px", borderRadius: "50%", background: accentColor }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <span className="flex-shrink-0" style={{ fontSize: "20px", color: chevron }}>›</span>
          )}
        </Link>
      ))}
    </div>
  );
}
