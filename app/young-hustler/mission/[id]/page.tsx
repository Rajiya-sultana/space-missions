import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { missions } from "@/data/missions/young-hustler";
import { MissionDetail } from "@/components/MissionDetail";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const mission = missions.find((m) => m.id === Number(id));
  if (!mission) return {};
  return {
    title: `${mission.title}: ${mission.subtitle} — Young Hustler`,
    description: mission.description,
  };
}

export default async function MissionPage({ params }: Props) {
  const { id } = await params;
  const missionId = Number(id);
  const mission = missions.find((m) => m.id === missionId);
  if (!mission) notFound();

  const prevMission = missions.find((m) => m.id === missionId - 1);
  const nextMission = missions.find((m) => m.id === missionId + 1);

  return (
    <MissionDetail
      mission={mission}
      prevMission={prevMission}
      nextMission={nextMission}
      productSlug="young-hustler"
      totalMissions={missions.length}
    />
  );
}
