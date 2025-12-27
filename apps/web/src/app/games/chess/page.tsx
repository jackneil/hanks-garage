"use client";

import dynamic from "next/dynamic";
import { GameShell } from "@/shared/components";

const ChessGame = dynamic(
  () => import("@/games/chess"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-950 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4 animate-bounce">&#9816;</div>
        <h1 className="text-4xl font-bold text-white mb-4">Chess</h1>
        <div className="w-64 h-2 bg-black/30 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400 rounded-full animate-pulse" style={{ width: "30%" }} />
        </div>
        <p className="text-emerald-200 mt-4">Loading game...</p>
      </div>
    ),
  }
);

export default function ChessPage() {
  return (
    <GameShell gameName="Chess" canPause>
      <ChessGame />
    </GameShell>
  );
}
