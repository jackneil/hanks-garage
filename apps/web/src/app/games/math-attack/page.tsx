"use client";

import dynamic from "next/dynamic";
import { GameShell } from "@/shared/components";

const MathAttackGame = dynamic(() => import("@/games/math-attack"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col items-center justify-center">
      <div className="text-6xl mb-4 animate-bounce">🔢</div>
      <h1 className="text-4xl font-bold text-white mb-4">Math Attack</h1>
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500 rounded-full animate-pulse"
          style={{ width: "30%" }}
        />
      </div>
      <p className="text-purple-300 mt-4">Loading game...</p>
    </div>
  ),
});

export default function MathAttackPage() {
  return (
    <GameShell gameName="Math Attack" appId="math-attack" canPause={false}>
      <MathAttackGame />
    </GameShell>
  );
}
