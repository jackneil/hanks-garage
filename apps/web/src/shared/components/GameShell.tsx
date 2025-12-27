"use client";

import { useGameShell } from "../hooks/useGameShell";
import { PauseMenu } from "./PauseMenu";

interface GameShellProps {
  children: React.ReactNode;
  gameName: string;
  canPause?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  showHomeButton?: boolean;
  showPauseButton?: boolean;
  pauseOnBlur?: boolean;
  headerClassName?: string;
  pauseMenuChildren?: React.ReactNode;
}

export function GameShell({
  children,
  gameName,
  canPause = true,
  onPause,
  onResume,
  showHomeButton = true,
  showPauseButton = true,
  pauseOnBlur = true,
  headerClassName = "",
  pauseMenuChildren,
}: GameShellProps) {
  const { isPaused, resume, togglePause, goHome } = useGameShell({
    canPause,
    onPause,
    onResume,
    pauseOnBlur,
  });

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Header bar */}
      <div
        className={`fixed top-0 left-0 right-0 h-12 md:h-14 bg-black/70 backdrop-blur-md z-[1000] flex items-center justify-between px-3 md:px-4 ${headerClassName}`}
      >
        {/* Home button */}
        {showHomeButton && (
          <button
            onClick={goHome}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-2xl hover:scale-110 transition-transform active:scale-95"
            title="Go Home"
          >
            🏠
          </button>
        )}

        {/* Game name - center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-white font-bold text-lg md:text-xl truncate max-w-[50%]">
          {gameName}
        </div>

        {/* Pause button */}
        {showPauseButton && canPause && (
          <button
            onClick={togglePause}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-2xl hover:scale-110 transition-transform active:scale-95"
            title="Pause (ESC)"
          >
            ⏸️
          </button>
        )}

        {/* Spacer if no pause button */}
        {(!showPauseButton || !canPause) && <div className="w-[44px]" />}
      </div>

      {/* Game content - offset by header height */}
      <div className="pt-12 md:pt-14 w-full h-full">{children}</div>

      {/* Pause menu overlay */}
      {canPause && (
        <PauseMenu
          isOpen={isPaused}
          onResume={resume}
          onHome={goHome}
          gameName={gameName}
        >
          {pauseMenuChildren}
        </PauseMenu>
      )}
    </div>
  );
}
