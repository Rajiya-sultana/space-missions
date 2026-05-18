"use client";

import Link from "next/link";
import Image from "next/image";
import type { Mission } from "@/data/products";
import { useProgress } from "@/hooks/useProgress";

interface Props {
  missions: Mission[];
  productSlug: string;
  pathSegment?: string;
  label?: string;
}

export function MobileMissionList({ missions, productSlug, pathSegment = "mission", label = "MISSION" }: Props) {
  const { completed } = useProgress(productSlug);

  const nextMission = missions.find((m) => !completed.has(m.id));
  const hasStarted = completed.size > 0;

  return (
    <div>
      {/* Continue banner */}
      {hasStarted && nextMission && (
        <Link
          href={`/${productSlug}/${pathSegment}/${nextMission.id}`}
          className="flex items-center justify-between mb-3 transition-all duration-200 active:opacity-80"
          style={{
            padding: "16px 18px",
            borderRadius: "20px",
            background: "rgba(16, 55, 38, 0.85)",
            border: "1.5px solid rgba(34,197,94,0.45)",
            gap: "14px",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "rgba(34,197,94,0.2)",
                border: "1.5px solid rgba(34,197,94,0.4)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#22c55e">
                <path d="M4 2.5l9 5.5-9 5.5V2.5z" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 800, color: "#22c55e", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "2px" }}>
                Continue
              </p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>
                {nextMission.subtitle}
              </p>
            </div>
          </div>
          <span style={{ fontSize: "20px", color: "#22c55e" }}>→</span>
        </Link>
      )}

      {/* All complete banner */}
      {hasStarted && !nextMission && (
        <div
          className="flex items-center gap-3 mb-3"
          style={{
            padding: "16px 18px",
            borderRadius: "20px",
            background: "rgba(55, 40, 10, 0.85)",
            border: "1.5px solid rgba(234,179,8,0.4)",
          }}
        >
          <span style={{ fontSize: "22px" }}>🏆</span>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#facc15" }}>All done!</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Complete your workbook to earn your certificate.</p>
          </div>
        </div>
      )}

      {/* Mission rows */}
      {missions.map((mission) => (
        <Link
          key={mission.id}
          href={`/${productSlug}/${pathSegment}/${mission.id}`}
          className="flex items-center mb-[10px] transition-all duration-200 active:opacity-80"
          style={{
            padding: "18px 16px",
            gap: "16px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.08)",
            border: `1.5px solid ${completed.has(mission.id) ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.11)"}`,
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Icon */}
          <div
            className={`bg-gradient-to-br ${mission.gradient} flex items-center justify-center flex-shrink-0 relative overflow-hidden`}
            style={{ width: "56px", height: "56px", borderRadius: "14px", fontSize: "28px" }}
          >
            {mission.thumbnail ? (
              <Image
                src={mission.thumbnail}
                alt={mission.subtitle}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              mission.planet
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                {label} {mission.id}
              </span>
              {mission.id === 1 && (
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 800,
                    color: "white",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.28)",
                    padding: "2px 9px",
                    borderRadius: "99px",
                  }}
                >
                  FREE
                </span>
              )}
            </div>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "white" }} className="truncate">
              {mission.subtitle}
            </p>
          </div>

          {/* Checkmark or chevron */}
          {completed.has(mission.id) ? (
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#22c55e" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <span className="flex-shrink-0" style={{ fontSize: "20px", color: "rgba(255,255,255,0.25)" }}>›</span>
          )}
        </Link>
      ))}
    </div>
  );
}
