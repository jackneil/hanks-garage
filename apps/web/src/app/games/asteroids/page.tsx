"use client";

import dynamic from "next/dynamic";

const AsteroidsGame = dynamic(() => import("@/games/asteroids"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-2xl text-white animate-pulse">Loading Asteroids...</div>
    </div>
  ),
});

export default function AsteroidsPage() {
  return <AsteroidsGame />;
}
