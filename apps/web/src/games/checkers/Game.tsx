"use client";

import { useEffect } from "react";
import { Board } from "./components/Board";
import { GameUI } from "./components/GameUI";
import { useCheckersStore } from "./lib/store";
import { useAuthSync } from "@/shared/hooks/useAuthSync";
import { FullscreenButton } from "@/shared/components/FullscreenButton";
import { IOSInstallPrompt } from "@/shared/components/IOSInstallPrompt";

export function CheckersGame() {
  const store = useCheckersStore();
  
  // Sync with auth system
  const { isAuthenticated, syncStatus } = useAuthSync({
    appId: "checkers",
    localStorageKey: "checkers-progress",
    getState: () => store.getProgress(),
    setState: (data) => store.setProgress(data),
    debounceMs: 2000,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-800 to-amber-950 p-4 flex flex-col items-center justify-center gap-6">
      {/* iOS install prompt */}
      <IOSInstallPrompt />

      {/* Fullscreen button */}
      <div className="fixed top-4 right-4 z-50">
        <FullscreenButton />
      </div>

      <header className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Checkers</h1>
        <p className="text-amber-200">Jump over pieces to capture them!</p>
      </header>

      <Board />
      <GameUI />

      {/* Sync status indicator */}
      {isAuthenticated && (
        <div className="fixed bottom-2 right-2 text-xs text-amber-300/60">
          {syncStatus === "syncing" ? "Saving..." : syncStatus === "synced" ? "Saved" : ""}
        </div>
      )}
    </div>
  );
}

export default CheckersGame;
