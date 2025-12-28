"use client";

import Link from "next/link";
import type { GameDisplayInfo } from "../lib/gameStatExtractor";

interface GameProgressCardProps {
  game: GameDisplayInfo;
}

/**
 * Kid-friendly game progress card for the profile page.
 * Big, colorful, with fun stats.
 */
export function GameProgressCard({ game }: GameProgressCardProps) {
  // Format relative time (e.g., "2 hours ago", "Yesterday")
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Determine game URL
  const gameUrl = `/games/${game.appId}`;

  return (
    <Link
      href={gameUrl}
      className={`
        block p-4 rounded-2xl shadow-lg
        bg-gradient-to-br from-${game.color}-500 to-${game.color}-700
        hover:scale-[1.02] active:scale-[0.98]
        transition-transform duration-150
        border-2 border-white/20 hover:border-white/40
      `}
    >
      {/* Header with icon and name */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{game.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate">
            {game.displayName}
          </h3>
          <p className="text-white/60 text-sm">
            {formatRelativeTime(game.lastPlayed)}
          </p>
        </div>
      </div>

      {/* Primary stat - big and bold */}
      {game.primaryStat && (
        <div className="bg-white/20 rounded-xl p-3 mb-3 text-center">
          <div className="text-2xl font-bold text-white">
            {game.primaryStat.value}
          </div>
          <div className="text-white/70 text-sm">
            {game.primaryStat.label}
          </div>
        </div>
      )}

      {/* Progress bar if applicable */}
      {game.progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-white/70 text-xs mb-1">
            <span>Progress</span>
            <span>{game.progress}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/80 rounded-full transition-all duration-500"
              style={{ width: `${game.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Secondary stats - smaller row */}
      {game.secondaryStats.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {game.secondaryStats.slice(0, 3).map((stat, i) => (
            <div
              key={i}
              className="bg-white/10 rounded-lg px-2 py-1 text-xs text-white/80"
            >
              <span className="font-semibold">{stat.value}</span>{" "}
              <span className="text-white/60">{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Play button hint */}
      <div className="mt-3 text-center text-white/50 text-xs">
        Tap to play!
      </div>
    </Link>
  );
}

export default GameProgressCard;
