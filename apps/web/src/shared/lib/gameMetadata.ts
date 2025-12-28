import type { ValidAppId } from "@hank-neil/db/schema";

/**
 * Game metadata for display in UI (profile, cards, etc.)
 * Maps appId slugs to human-readable names, icons, and colors.
 */
export interface GameMetadata {
  name: string;
  icon: string;
  color: string; // Tailwind color class (e.g., "red", "blue")
  description: string;
}

export const GAME_METADATA: Record<ValidAppId, GameMetadata> = {
  "hill-climb": {
    name: "Hill Climb",
    icon: "🚗",
    color: "green",
    description: "Race up hills without flipping!",
  },
  "monster-truck": {
    name: "Monster Truck",
    icon: "🚛",
    color: "red",
    description: "Crush cars and collect stars!",
  },
  checkers: {
    name: "Checkers",
    icon: "🔴",
    color: "amber",
    description: "Classic board game",
  },
  chess: {
    name: "Chess",
    icon: "♟️",
    color: "slate",
    description: "The ultimate strategy game",
  },
  "oregon-trail": {
    name: "Oregon Trail",
    icon: "🐂",
    color: "emerald",
    description: "Journey to Oregon!",
  },
  "flappy-bird": {
    name: "Flappy Bird",
    icon: "🐦",
    color: "sky",
    description: "Tap to fly through pipes",
  },
  "2048": {
    name: "2048",
    icon: "🔢",
    color: "orange",
    description: "Slide tiles to 2048!",
  },
  snake: {
    name: "Snake",
    icon: "🐍",
    color: "lime",
    description: "Eat food, grow longer",
  },
  "memory-match": {
    name: "Memory Match",
    icon: "🃏",
    color: "purple",
    description: "Find matching pairs",
  },
  "joke-generator": {
    name: "Joke Generator",
    icon: "😂",
    color: "yellow",
    description: "Random jokes for laughs",
  },
  "endless-runner": {
    name: "Endless Runner",
    icon: "🏃",
    color: "cyan",
    description: "Run and jump forever!",
  },
  weather: {
    name: "Weather",
    icon: "🌤️",
    color: "blue",
    description: "Check the weather",
  },
  "cookie-clicker": {
    name: "Cookie Clicker",
    icon: "🍪",
    color: "amber",
    description: "Click cookies, get rich!",
  },
  "toy-finder": {
    name: "Toy Finder",
    icon: "🧸",
    color: "pink",
    description: "Find cool toys",
  },
  quoridor: {
    name: "Quoridor",
    icon: "🧱",
    color: "stone",
    description: "Block your opponent's path",
  },
  platformer: {
    name: "Platformer",
    icon: "🎮",
    color: "indigo",
    description: "Jump through levels",
  },
  "retro-arcade": {
    name: "Retro Arcade",
    icon: "👾",
    color: "violet",
    description: "Classic console games",
  },
};

/**
 * Get metadata for a game by its appId.
 * Returns a default if game not found.
 */
export function getGameMetadata(appId: string): GameMetadata {
  return (
    GAME_METADATA[appId as ValidAppId] || {
      name: appId,
      icon: "🎮",
      color: "gray",
      description: "A game",
    }
  );
}

/**
 * Get Tailwind background gradient classes for a game.
 */
export function getGameGradient(appId: string): string {
  const { color } = getGameMetadata(appId);
  return `from-${color}-500 to-${color}-700`;
}
