import { ArkanoidGame } from "@/games/arkanoid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arkanoid - Chain Reaction Game",
  description: "Watch balls multiply in this mesmerizing physics-based chain reaction game!",
};

export default function ArkanoidPage() {
  return <ArkanoidGame />;
}
