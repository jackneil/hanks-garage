"use client";

import dynamic from "next/dynamic";

const HextrisGame = dynamic(() => import("@/games/hextris"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-2xl text-white animate-pulse">Loading Hextris...</div>
    </div>
  ),
});

export default function HextrisPage() {
  return <HextrisGame />;
}
