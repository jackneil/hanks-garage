"use client";

import dynamic from "next/dynamic";
import { GameShell } from "@/shared/components";

const WordleGame = dynamic(() => import("@/games/wordle"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center">
      <div className="text-6xl mb-4 animate-bounce">📝</div>
      <h1 className="text-4xl font-bold text-white mb-4">Wordle</h1>
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full animate-pulse"
          style={{ width: "30%" }}
        />
      </div>
      <p className="text-slate-400 mt-4">Loading game...</p>
    </div>
  ),
});

export default function WordlePage() {
  return (
    <GameShell gameName="Wordle" canPause={false}>
      <WordleGame />
    </GameShell>
  );
}
