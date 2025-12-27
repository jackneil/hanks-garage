"use client";

import dynamic from "next/dynamic";
import { GameShell } from "@/shared/components";

const MemoryMatchGame = dynamic(
  () => import("@/games/memory-match"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-b from-blue-800 to-purple-900 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4 animate-bounce">&#129504;</div>
        <h1 className="text-4xl font-bold text-white mb-4">Memory Match</h1>
        <div className="w-64 h-2 bg-black/30 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full animate-pulse" style={{ width: "30%" }} />
        </div>
        <p className="text-blue-200 mt-4">Loading game...</p>
      </div>
    ),
  }
);

export default function MemoryMatchPage() {
  return (
    <GameShell gameName="Memory Match" canPause>
      <MemoryMatchGame />
    </GameShell>
  );
}
