import type { ValidAppId } from "@hank-neil/db/schema";
import { getGameMetadata } from "@/shared/lib/gameMetadata";

/**
 * Extracted game display info for profile cards.
 */
export interface GameDisplayInfo {
  appId: ValidAppId;
  displayName: string;
  icon: string;
  color: string;
  lastPlayed: Date;
  primaryStat: { label: string; value: string } | null;
  secondaryStats: { label: string; value: string }[];
  progress?: number; // 0-100 if applicable
}

/**
 * Extract display-friendly stats from a game's raw progress data.
 * Each game stores data differently, so we handle them individually.
 */
export function extractGameStats(
  appId: string,
  data: Record<string, unknown>,
  updatedAt: string
): GameDisplayInfo {
  const metadata = getGameMetadata(appId);
  const lastPlayed = new Date(updatedAt);

  const baseInfo: GameDisplayInfo = {
    appId: appId as ValidAppId,
    displayName: metadata.name,
    icon: metadata.icon,
    color: metadata.color,
    lastPlayed,
    primaryStat: null,
    secondaryStats: [],
  };

  // Extract stats based on game type
  switch (appId) {
    case "monster-truck":
      return {
        ...baseInfo,
        primaryStat: data.totalCoinsEarned
          ? { label: "Total Coins", value: formatNumber(data.totalCoinsEarned as number) }
          : null,
        secondaryStats: [
          data.starsCollected && { label: "Stars", value: String(data.starsCollected) },
          data.trucks && { label: "Trucks", value: String((data.trucks as unknown[]).length) },
        ].filter(Boolean) as { label: string; value: string }[],
      };

    case "2048":
      return {
        ...baseInfo,
        primaryStat: data.highScore
          ? { label: "High Score", value: formatNumber(data.highScore as number) }
          : null,
        secondaryStats: [
          data.highestTile && { label: "Best Tile", value: String(data.highestTile) },
          data.gamesWon && { label: "Wins", value: String(data.gamesWon) },
          data.gamesPlayed && { label: "Games", value: String(data.gamesPlayed) },
        ].filter(Boolean) as { label: string; value: string }[],
      };

    case "cookie-clicker":
      return {
        ...baseInfo,
        primaryStat: data.totalCookiesBaked
          ? { label: "Cookies Baked", value: formatLargeNumber(data.totalCookiesBaked as number) }
          : null,
        secondaryStats: [
          data.totalClicks && { label: "Clicks", value: formatNumber(data.totalClicks as number) },
          data.unlockedAchievements && {
            label: "Achievements",
            value: String((data.unlockedAchievements as unknown[]).length),
          },
        ].filter(Boolean) as { label: string; value: string }[],
      };

    case "oregon-trail":
      return {
        ...baseInfo,
        primaryStat: data.milesTraveled
          ? { label: "Miles Traveled", value: formatNumber(data.milesTraveled as number) }
          : null,
        secondaryStats: [
          data.riversCrossed && { label: "Rivers Crossed", value: String(data.riversCrossed) },
          data.foodHunted && { label: "Food Hunted", value: formatNumber(data.foodHunted as number) },
        ].filter(Boolean) as { label: string; value: string }[],
        progress: data.milesTraveled
          ? Math.min(100, Math.round(((data.milesTraveled as number) / 2000) * 100))
          : undefined,
      };

    case "snake":
      return {
        ...baseInfo,
        primaryStat: data.highScore
          ? { label: "High Score", value: String(data.highScore) }
          : null,
        secondaryStats: [
          data.gamesPlayed && { label: "Games", value: String(data.gamesPlayed) },
        ].filter(Boolean) as { label: string; value: string }[],
      };

    case "flappy-bird":
      return {
        ...baseInfo,
        primaryStat: data.highScore
          ? { label: "High Score", value: String(data.highScore) }
          : null,
        secondaryStats: [
          data.gamesPlayed && { label: "Games", value: String(data.gamesPlayed) },
        ].filter(Boolean) as { label: string; value: string }[],
      };

    case "memory-match":
      return {
        ...baseInfo,
        primaryStat: data.bestTime
          ? { label: "Best Time", value: formatTime(data.bestTime as number) }
          : null,
        secondaryStats: [
          data.gamesCompleted && { label: "Completed", value: String(data.gamesCompleted) },
        ].filter(Boolean) as { label: string; value: string }[],
      };

    case "hill-climb":
      return {
        ...baseInfo,
        primaryStat: data.totalCoins
          ? { label: "Total Coins", value: formatNumber(data.totalCoins as number) }
          : null,
        secondaryStats: [
          data.bestDistance && { label: "Best Distance", value: `${formatNumber(data.bestDistance as number)}m` },
        ].filter(Boolean) as { label: string; value: string }[],
      };

    case "endless-runner":
      return {
        ...baseInfo,
        primaryStat: data.highScore
          ? { label: "High Score", value: formatNumber(data.highScore as number) }
          : null,
        secondaryStats: [],
      };

    case "retro-arcade":
      return {
        ...baseInfo,
        primaryStat: data.recentlyPlayed
          ? { label: "Games Played", value: String((data.recentlyPlayed as unknown[]).length) }
          : null,
        secondaryStats: [],
      };

    case "checkers":
    case "chess":
    case "quoridor":
      return {
        ...baseInfo,
        primaryStat: data.wins
          ? { label: "Wins", value: String(data.wins) }
          : data.gamesPlayed
            ? { label: "Games", value: String(data.gamesPlayed) }
            : null,
        secondaryStats: [],
      };

    case "platformer":
      return {
        ...baseInfo,
        primaryStat: data.levelsCompleted
          ? { label: "Levels", value: String(data.levelsCompleted) }
          : null,
        secondaryStats: [
          data.coins && { label: "Coins", value: formatNumber(data.coins as number) },
        ].filter(Boolean) as { label: string; value: string }[],
      };

    // Apps (not games, but might have progress)
    case "joke-generator":
    case "weather":
    case "toy-finder":
      return {
        ...baseInfo,
        primaryStat: null,
        secondaryStats: [],
      };

    default:
      // Unknown game - try generic extraction
      return {
        ...baseInfo,
        primaryStat: data.highScore
          ? { label: "High Score", value: String(data.highScore) }
          : data.score
            ? { label: "Score", value: String(data.score) }
            : null,
        secondaryStats: [],
      };
  }
}

/**
 * Format a number with commas (e.g., 1234567 -> "1,234,567")
 */
function formatNumber(n: number): string {
  return n.toLocaleString();
}

/**
 * Format large numbers with K/M suffix (e.g., 1500000 -> "1.5M")
 */
function formatLargeNumber(n: number): string {
  if (n >= 1_000_000_000) {
    return `${(n / 1_000_000_000).toFixed(1)}B`;
  }
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1)}K`;
  }
  return String(n);
}

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}:${String(remainingMins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
}
