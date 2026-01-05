"use client";

import dynamic from "next/dynamic";
import { GameShell } from "@/shared/components";

const Game2048 = dynamic(
  () => import("@/games/2048"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#faf8ef] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4 animate-bounce font-bold text-[#edc22e]">2048</div>
        <div className="w-64 h-2 bg-[#bbada0] rounded-full overflow-hidden">
          <div className="h-full bg-[#edc22e] rounded-full animate-pulse" style={{ width: "30%" }} />
        </div>
        <p className="text-[#776e65] mt-4">Loading game...</p>
      </div>
    ),
  }
);

export default function Page2048() {
  return (
    <GameShell gameName="2048" appId="2048" canPause>
      <Game2048 />
    </GameShell>
  );
}
