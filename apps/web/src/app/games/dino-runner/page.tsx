"use client";

import dynamic from "next/dynamic";
import { GameShell } from "@/shared/components";

const DinoRunnerGame = dynamic(
  () => import("@/games/dino-runner"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4 animate-bounce">🦖</div>
        <h1 className="text-4xl font-bold text-gray-700 mb-4">Dino Runner</h1>
        <div className="w-64 h-2 bg-black/20 rounded-full overflow-hidden">
          <div className="h-full bg-gray-500 rounded-full animate-pulse" style={{ width: "30%" }} />
        </div>
        <p className="text-gray-500 mt-4">Loading game...</p>
      </div>
    ),
  }
);

export default function DinoRunnerPage() {
  return (
    <GameShell gameName="Dino Runner" appId="dino-runner" canPause={false}>
      <DinoRunnerGame />
    </GameShell>
  );
}
