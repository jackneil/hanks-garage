// Breakout Game - Types and Constants

export type GameStatus = "idle" | "playing" | "paused" | "game-over" | "level-complete";

export type BrickType = "normal" | "tough" | "indestructible" | "explosive";

export type PowerUpType = "multi-ball" | "big-paddle" | "slow" | "extra-life" | "sticky";

export type Position = {
  x: number;
  y: number;
};

export type Velocity = {
  vx: number;
  vy: number;
};

export type Ball = Position & Velocity & {
  id: number;
  radius: number;
  stuck: boolean; // For sticky paddle power-up
};

export type Brick = Position & {
  id: number;
  width: number;
  height: number;
  type: BrickType;
  hitsRemaining: number;
  color: string;
  row: number;
  col: number;
};

export type PowerUp = Position & Velocity & {
  id: number;
  type: PowerUpType;
  width: number;
  height: number;
};

export type Paddle = Position & {
  width: number;
  height: number;
  baseWidth: number;
};

export type Particle = Position & Velocity & {
  id: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
};

// Canvas dimensions
export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 640;

// Paddle config
export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 15;
export const PADDLE_Y = CANVAS_HEIGHT - 40; // 40px from bottom
export const PADDLE_SPEED = 10;
export const BIG_PADDLE_MULTIPLIER = 1.5;

// Ball config
export const BALL_RADIUS = 8;
export const BALL_INITIAL_SPEED = 5;
export const BALL_MAX_SPEED = 12;
export const BALL_SPEED_INCREMENT = 0.15; // Speed increase per paddle hit

// Brick config
export const BRICK_ROWS = 8;
export const BRICK_COLS = 8;
export const BRICK_WIDTH = 55;
export const BRICK_HEIGHT = 20;
export const BRICK_PADDING = 4;
export const BRICK_OFFSET_TOP = 60;
export const BRICK_OFFSET_LEFT = (CANVAS_WIDTH - (BRICK_COLS * (BRICK_WIDTH + BRICK_PADDING) - BRICK_PADDING)) / 2;

// Power-up config
export const POWERUP_WIDTH = 30;
export const POWERUP_HEIGHT = 15;
export const POWERUP_FALL_SPEED = 2;
export const POWERUP_CHANCE = 0.25; // 25% chance to spawn on brick break

// Durations (in milliseconds)
export const BIG_PADDLE_DURATION = 15000;
export const SLOW_DURATION = 10000;
export const STICKY_DURATION = 15000;

// Scoring
export const POINTS = {
  normal: 10,
  tough: 25,
  explosive: 15,
  indestructible: 0,
} as const;

// Lives
export const INITIAL_LIVES = 3;

// Brick colors by type
export const BRICK_COLORS: Record<BrickType, string> = {
  normal: "#ef4444", // Will be overridden by row colors
  tough: "#9ca3af",  // Silver
  indestructible: "#fbbf24", // Gold
  explosive: "#f97316", // Orange
};

// Row colors for normal bricks (rainbow pattern)
export const ROW_COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
];

// Power-up colors and icons
export const POWERUP_CONFIG: Record<PowerUpType, { color: string; icon: string }> = {
  "multi-ball": { color: "#3b82f6", icon: "x3" },
  "big-paddle": { color: "#22c55e", icon: "W" },
  "slow": { color: "#a855f7", icon: "S" },
  "extra-life": { color: "#ef4444", icon: "+1" },
  "sticky": { color: "#f97316", icon: "G" },
};

// Colors
export const COLORS = {
  BACKGROUND: "#1a1a2e",
  PADDLE: "#3b82f6",
  BALL: "#ffffff",
  HUD_TEXT: "#ffffff",
  GAME_OVER_BG: "rgba(0, 0, 0, 0.8)",
  LEVEL_COMPLETE_BG: "rgba(34, 197, 94, 0.8)",
} as const;

// Helper functions
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getRandomPowerUp(): PowerUpType {
  const types: PowerUpType[] = ["multi-ball", "big-paddle", "slow", "extra-life", "sticky"];
  // Weight extra-life to be less common
  const weights = [0.25, 0.25, 0.20, 0.10, 0.20];
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < types.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) {
      return types[i];
    }
  }
  return types[0];
}

export function normalizeVector(vx: number, vy: number): { vx: number; vy: number } {
  const magnitude = Math.sqrt(vx * vx + vy * vy);
  if (magnitude === 0) return { vx: 0, vy: -1 };
  return { vx: vx / magnitude, vy: vy / magnitude };
}

export function createBall(id: number, x: number, y: number, speed: number, angle?: number): Ball {
  // If angle not provided, go up with slight random angle
  const actualAngle = angle ?? (-Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 6);
  return {
    id,
    x,
    y,
    vx: Math.cos(actualAngle) * speed,
    vy: Math.sin(actualAngle) * speed,
    radius: BALL_RADIUS,
    stuck: false,
  };
}
