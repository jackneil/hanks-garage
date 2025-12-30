"use client";

import dynamic from "next/dynamic";

const VirtualPet = dynamic(() => import("@/apps/virtual-pet"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-amber-50">
      <div className="text-2xl text-amber-800 animate-pulse">Loading Virtual Pet...</div>
    </div>
  ),
});

export default function VirtualPetPage() {
  return <VirtualPet />;
}
