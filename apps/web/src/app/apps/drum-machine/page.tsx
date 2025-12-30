"use client";

import dynamic from "next/dynamic";

const DrumMachine = dynamic(() => import("@/apps/drum-machine"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-2xl text-white animate-pulse">Loading Drum Machine...</div>
    </div>
  ),
});

export default function DrumMachinePage() {
  return <DrumMachine />;
}
