"use client";

import dynamic from "next/dynamic";
import { GameShell } from "@/shared/components";

const QuoridorGame = dynamic(
  () => import("@/games/quoridor"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-b from-amber-800 to-amber-950 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4 animate-bounce">&#128994;</div>
        <h1 className="text-4xl font-bold text-white mb-4">Quoridor</h1>
        <div className="w-64 h-2 bg-black/30 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full animate-pulse" style={{ width: "30%" }} />
        </div>
        <p className="text-amber-200 mt-4">Loading game...</p>
      </div>
    ),
  }
);

export default function QuoridorPage() {
  return (
    <GameShell gameName="Quoridor" appId="quoridor" canPause>
      <QuoridorGame />
    </GameShell>
  );
}
