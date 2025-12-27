// Endless Runner - Game constants and configuration
// Tuned for kid-friendly gameplay (ages 6-14)

// Canvas dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;

// Player settings
export const PLAYER = {
  WIDTH: 40,
  HEIGHT: 50,
  X: 100, // Fixed X position (player runs in place, world scrolls)
  GROUND_Y: CANVAS_HEIGHT - 80, // Y position when on ground
  // Hitbox is smaller than visual for forgiving collisions (20% smaller)
  HITBOX_PADDING: 8,
  // Colors
  COLOR_BODY: "#FF6B35",
  COLOR_HEAD: "#FFE4C4",
  COLOR_HAIR: "#8B4513",
} as const;

// Physics - tuned for responsive, fun jumping
export const PHYSICS = {
  GRAVITY: 0.8, // pixels/frame^2
  JUMP_VELOCITY: -15, // pixels/frame - upward impulse
  MAX_FALL_SPEED: 12, // terminal velocity
  DUCK_HEIGHT: 25, // Player height when ducking
} as const;

// Ground settings
export const GROUND = {
  HEIGHT: 60,
  COLOR: "#8B5A2B",
  GRASS_COLOR: "#228B22",
  GRASS_HEIGHT: 10,
} as const;

// Obstacle settings
export const OBSTACLE = {
  GROUND_WIDTH: 40, // Ground obstacles (jump over)
  GROUND_HEIGHT: 40,
  GROUND_COLOR: "#DC2626", // Red boxes
  AIR_WIDTH: 60, // Air obstacles (duck under)
  AIR_HEIGHT: 30,
  AIR_COLOR: "#7C3AED", // Purple bars
  AIR_Y: CANVAS_HEIGHT - 80 - 60, // Position for air obstacles
  // Minimum gap between obstacles (in pixels) - generous for kids
  MIN_SPACING: 300,
  MAX_SPACING: 500,
} as const;

// Coin settings
export const COIN = {
  SIZE: 20,
  COLOR: "#FFD700",
  OUTLINE_COLOR: "#DAA520",
  VALUE: 10,
  // Spawn height variations
  LOW_Y: CANVAS_HEIGHT - 80 - 30, // Ground level coins
  MID_Y: CANVAS_HEIGHT - 80 - 70, // Mid-jump coins
  HIGH_Y: CANVAS_HEIGHT - 80 - 110, // High jump coins
  // Coin patterns spawn rate
  SPAWN_CHANCE: 0.6, // 60% chance per obstacle gap
} as const;

// Speed settings - gradual increase for kids
export const SPEED = {
  INITIAL: 5, // Starting speed (pixels/frame)
  MAX: 12, // Maximum speed
  INCREASE_RATE: 0.001, // Speed increase per frame
  INCREASE_INTERVAL: 60, // Frames between speed checks
} as const;

// Scoring
export const SCORING = {
  DISTANCE_MULTIPLIER: 0.1, // Distance in meters = pixels * this
  COIN_VALUE: 10,
  // Milestones for celebrations
  MILESTONES: [100, 250, 500, 1000, 2000, 5000],
} as const;

// Colors - bright and kid-friendly
export const COLORS = {
  SKY_TOP: "#87CEEB",
  SKY_BOTTOM: "#E0F4FF",
  CLOUD: "#FFFFFF",
  SUN: "#FFD700",
  SUN_GLOW: "rgba(255, 215, 0, 0.3)",
  MOUNTAIN_FAR: "#9CA3AF",
  MOUNTAIN_NEAR: "#6B7280",
  SCORE_TEXT: "#FFFFFF",
  SCORE_SHADOW: "#000000",
  GAME_OVER_BG: "rgba(0, 0, 0, 0.7)",
} as const;

// UI settings
export const UI = {
  SCORE_FONT: "bold 32px Arial, sans-serif",
  SMALL_FONT: "24px Arial, sans-serif",
  TITLE_FONT: "bold 48px Arial, sans-serif",
  BUTTON_MIN_SIZE: 60,
} as const;

// Game states
export type GameState = "ready" | "playing" | "gameOver";

// Types
export type Player = {
  y: number;
  velocity: number;
  isDucking: boolean;
  isJumping: boolean;
};

export type Obstacle = {
  x: number;
  type: "ground" | "air";
  width: number;
  height: number;
  id: number;
};

export type CoinType = {
  x: number;
  y: number;
  collected: boolean;
  id: number;
};

export type Cloud = {
  x: number;
  y: number;
  scale: number;
  speed: number;
};

// Characters available for unlock
export type CharacterId = "speedy-sam" | "rocket-rita" | "bouncy-bob" | "ninja-nancy" | "robo-randy" | "golden-gary";

export const CHARACTERS: Record<CharacterId, { name: string; cost: number; color: string }> = {
  "speedy-sam": { name: "Speedy Sam", cost: 0, color: "#FF6B35" },
  "rocket-rita": { name: "Rocket Rita", cost: 500, color: "#EF4444" },
  "bouncy-bob": { name: "Bouncy Bob", cost: 1000, color: "#22C55E" },
  "ninja-nancy": { name: "Ninja Nancy", cost: 2000, color: "#1F2937" },
  "robo-randy": { name: "Robo Randy", cost: 5000, color: "#6366F1" },
  "golden-gary": { name: "Golden Gary", cost: 10000, color: "#F59E0B" },
};
