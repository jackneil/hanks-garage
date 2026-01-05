"use client";

import dynamic from "next/dynamic";
import { GameShell } from "@/shared/components";

const Trivia = dynamic(() => import("@/apps/trivia"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center">
      <div className="text-6xl mb-4 animate-bounce">🧠</div>
      <h1 className="text-4xl font-bold text-white mb-4">Trivia Quiz</h1>
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500 rounded-full animate-pulse"
          style={{ width: "30%" }}
        />
      </div>
      <p className="text-purple-300 mt-4">Loading questions...</p>
    </div>
  ),
});

export default function TriviaPage() {
  return (
    <GameShell gameName="Trivia Quiz" appId="trivia" canPause={false}>
      <Trivia />
    </GameShell>
  );
}
