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
  "blitz-bomber": {
    name: "Blitz Bomber",
    icon: "💣",
    color: "red",
    description: "Bomb your way to victory!",
  },
  "dino-runner": {
    name: "Dino Runner",
    icon: "🦖",
    color: "emerald",
    description: "Run, jump, avoid obstacles!",
  },
  breakout: {
    name: "Breakout",
    icon: "🧱",
    color: "cyan",
    description: "Break all the bricks!",
  },
  "space-invaders": {
    name: "Space Invaders",
    icon: "👾",
    color: "indigo",
    description: "Defend Earth from aliens!",
  },
  "drawing-app": {
    name: "Drawing App",
    icon: "🎨",
    color: "pink",
    description: "Draw and create art",
  },
  hextris: {
    name: "Hextris",
    icon: "⬡",
    color: "purple",
    description: "Hexagonal puzzle game",
  },
  asteroids: {
    name: "Asteroids",
    icon: "🌑",
    color: "slate",
    description: "Blast space rocks!",
  },
  "drum-machine": {
    name: "Drum Machine",
    icon: "🥁",
    color: "orange",
    description: "Make beats and music",
  },
  "virtual-pet": {
    name: "Virtual Pet",
    icon: "🐣",
    color: "yellow",
    description: "Care for your pet!",
  },
  bomberman: {
    name: "Bomberman",
    icon: "💣",
    color: "amber",
    description: "Blow up your enemies!",
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
 * Static gradient class map - Tailwind can't analyze dynamic classes.
 * All classes must be written out fully for the purge to include them.
 */
const GRADIENT_MAP: Record<string, string> = {
  green: "from-green-500 to-green-700",
  red: "from-red-500 to-red-700",
  amber: "from-amber-500 to-amber-700",
  slate: "from-slate-500 to-slate-700",
  emerald: "from-emerald-500 to-emerald-700",
  sky: "from-sky-500 to-sky-700",
  orange: "from-orange-500 to-orange-700",
  lime: "from-lime-500 to-lime-700",
  purple: "from-purple-500 to-purple-700",
  yellow: "from-yellow-500 to-yellow-700",
  cyan: "from-cyan-500 to-cyan-700",
  blue: "from-blue-500 to-blue-700",
  pink: "from-pink-500 to-pink-700",
  stone: "from-stone-500 to-stone-700",
  indigo: "from-indigo-500 to-indigo-700",
  violet: "from-violet-500 to-violet-700",
  gray: "from-gray-500 to-gray-700",
};

/**
 * Get Tailwind background gradient classes for a game.
 */
export function getGameGradient(appId: string): string {
  const { color } = getGameMetadata(appId);
  return GRADIENT_MAP[color] || GRADIENT_MAP.gray;
}
