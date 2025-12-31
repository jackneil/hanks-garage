"use client";

import dynamic from "next/dynamic";
import { GameShell } from "@/shared/components";

const BombermanGame = dynamic(() => import("@/games/bomberman"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-6xl mb-4 animate-bounce">💣</div>
      <div className="text-2xl text-white animate-pulse">Loading Bomberman...</div>
    </div>
  ),
});

export default function BombermanPage() {
  return (
    <GameShell gameName="Bomberman" canPause>
      <BombermanGame />
    </GameShell>
  );
}
