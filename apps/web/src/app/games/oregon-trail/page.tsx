"use client";
import dynamic from "next/dynamic";

const OregonTrailGame = dynamic(() => import("@/games/oregon-trail/Game"), { ssr: false });

export default function OregonTrailPage() {
  return <OregonTrailGame />;
}
