"use client";
import { useOregonTrailStore } from "./lib/store";
import { TitleScreen } from "./components/TitleScreen";
import { Store } from "./components/Store";
import { Travel } from "./components/Travel";
import { Event } from "./components/Event";
import { River } from "./components/River";
import { Hunting } from "./components/Hunting";
import { GameUI } from "./components/GameUI";

export default function OregonTrailGame() {
  const { gamePhase } = useOregonTrailStore();

  switch (gamePhase) {
    case "title":
    case "setup_name":
    case "setup_party":
    case "setup_month":
      return <TitleScreen />;
    case "store":
      return <Store />;
    case "travel":
      return <Travel />;
    case "event":
      return <Event />;
    case "river":
      return <River />;
    case "hunting":
      return <Hunting />;
    case "landmark":
    case "victory":
    case "game_over":
      return <GameUI />;
    default:
      return <TitleScreen />;
  }
}
