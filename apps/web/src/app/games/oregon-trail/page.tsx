"use client";
import dynamic from "next/dynamic";
import { GameShell } from "@/shared/components";

const OregonTrailGame = dynamic(() => import("@/games/oregon-trail/Game"), { ssr: false });

export default function OregonTrailPage() {
  return (
    <GameShell gameName="Oregon Trail" canPause>
      <OregonTrailGame />
    </GameShell>
  );
}
