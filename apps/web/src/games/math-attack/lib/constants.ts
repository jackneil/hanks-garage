// Math Attack - Age-based difficulty settings

export type Difficulty = "4yo" | "6yo" | "8yo" | "10yo" | "12yo" | "24yo" | "99yo";
export type Operation = "+" | "-" | "×" | "÷";

export interface DifficultySettings {
  operations: Operation[];
  numberRange: [number, number];
  spawnRateMs: number;
  fallSpeed: number;
  fontSize: string;
  bubbleSize: number;
  lives: number;
  emoji: string;
  color: string;
  label: string;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  "4yo": {
    operations: ["+"],
    numberRange: [1, 5], // Sums max 10, very easy for little ones
    spawnRateMs: 4000,
    fallSpeed: 0.3,
    fontSize: "text-3xl",
    bubbleSize: 90,
    lives: 5,
    emoji: "👶",
    color: "bg-pink-400",
    label: "4 years old",
  },
  "6yo": {
    operations: ["+"],
    numberRange: [1, 10], // Sums up to ~18, addition only
    spawnRateMs: 3500,
    fallSpeed: 0.4,
    fontSize: "text-2xl",
    bubbleSize: 85,
    lives: 5,
    emoji: "🧒",
    color: "bg-blue-400",
    label: "6 years old",
  },
  "8yo": {
    operations: ["+", "-"],
    numberRange: [1, 10], // REDUCED from 15 - easier subtraction
    spawnRateMs: 3000,
    fallSpeed: 0.5,
    fontSize: "text-2xl",
    bubbleSize: 80,
    lives: 4,
    emoji: "👧",
    color: "bg-green-500",
    label: "8 years old",
  },
  "10yo": {
    operations: ["+", "-", "×"],
    numberRange: [1, 12], // Times tables range, multiplication capped at 10x10
    spawnRateMs: 2800,
    fallSpeed: 0.6,
    fontSize: "text-xl",
    bubbleSize: 75,
    lives: 4,
    emoji: "👦",
    color: "bg-yellow-500",
    label: "10 years old",
  },
  "12yo": {
    operations: ["+", "-", "×"],
    numberRange: [1, 15], // REDUCED from 20
    spawnRateMs: 2500,
    fallSpeed: 0.7,
    fontSize: "text-xl",
    bubbleSize: 70,
    lives: 3,
    emoji: "🧑‍🎓",
    color: "bg-orange-500",
    label: "12 years old",
  },
  "24yo": {
    operations: ["+", "-", "×", "÷"],
    numberRange: [1, 25], // REDUCED from 50 - still challenging
    spawnRateMs: 2000,
    fallSpeed: 1.0,
    fontSize: "text-lg",
    bubbleSize: 65,
    lives: 3,
    emoji: "🧑",
    color: "bg-red-500",
    label: "24 years old",
  },
  "99yo": {
    operations: ["+"],
    numberRange: [1, 5],
    spawnRateMs: 5000,
    fallSpeed: 0.2,
    fontSize: "text-4xl",
    bubbleSize: 110,
    lives: 6,
    emoji: "👴",
    color: "bg-purple-500",
    label: "99 years old",
  },
};

export function getDifficultySettings(difficulty: Difficulty): DifficultySettings {
  return DIFFICULTY_SETTINGS[difficulty];
}

// Points system
export const POINTS = {
  correct: 100,
  comboBonus: 25, // per combo level
  speedBonus: 5, // per pixel from bottom
};

// Game dimensions
export const GAME = {
  width: 400,
  height: 600,
  bottomZone: 80, // Height of danger zone at bottom
};
