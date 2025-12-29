"use client";
import { useOregonTrailStore, type OregonTrailSyncData } from "./lib/store";
import { useAuthSync } from "@/shared/hooks/useAuthSync";
import { FullscreenButton } from "@/shared/components/FullscreenButton";
import { IOSInstallPrompt } from "@/shared/components/IOSInstallPrompt";
import { TitleScreen } from "./components/TitleScreen";
import { Store } from "./components/Store";
import { Travel } from "./components/Travel";
import { Event } from "./components/Event";
import { River } from "./components/River";
import { Hunting } from "./components/Hunting";
import { GameUI } from "./components/GameUI";

export default function OregonTrailGame() {
  const store = useOregonTrailStore();
  const { gamePhase } = store;

  // Cloud sync for authenticated users
  useAuthSync<OregonTrailSyncData>({
    appId: "oregon-trail",
    localStorageKey: "oregon-trail-storage",
    getState: () => store.getProgress(),
    setState: (data) => store.setProgress(data),
    debounceMs: 5000,
  });

  const renderPhase = () => {
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
  };

  return (
    <>
      {/* iOS install prompt */}
      <IOSInstallPrompt />

      {/* Fullscreen button */}
      <div className="fixed top-4 right-4 z-50">
        <FullscreenButton />
      </div>

      {renderPhase()}
    </>
  );
}
