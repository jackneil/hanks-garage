import { BallPhysicsGame } from "@/games/ball-physics";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ball Physics - Chain Reaction Game",
  description: "Watch balls multiply in this mesmerizing physics-based chain reaction game!",
};

export default function BallPhysicsPage() {
  return <BallPhysicsGame />;
}
