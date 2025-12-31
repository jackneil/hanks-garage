"use client";

import dynamic from "next/dynamic";
import { GameShell } from "@/shared/components";

const DrawingApp = dynamic(
  () => import("@/apps/drawing-app"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 flex flex-col items-center justify-center">
        <div className="text-8xl mb-4 animate-bounce">🎨</div>
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Drawing App</h1>
        <div className="w-64 h-2 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-pulse" style={{ width: "30%" }} />
        </div>
        <p className="text-white/80 mt-4">Loading your canvas...</p>
      </div>
    ),
  }
);

export default function DrawingAppPage() {
  return (
    <GameShell gameName="Drawing" canPause={false}>
      <DrawingApp />
    </GameShell>
  );
}
