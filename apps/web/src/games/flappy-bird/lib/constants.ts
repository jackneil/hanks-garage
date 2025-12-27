// Flappy Bird - Game constants and configuration
// Tuned for kid-friendly gameplay (ages 6-14)

// Canvas dimensions
export const CANVAS_WIDTH = 320;
export const CANVAS_HEIGHT = 480;

// Bird settings
export const BIRD = {
  WIDTH: 34,
  HEIGHT: 24,
  X: 80, // Fixed X position (bird doesn't move horizontally)
  START_Y: CANVAS_HEIGHT / 2,
  // Hitbox is smaller than visual for forgiving collisions
  HITBOX_WIDTH: 24,
  HITBOX_HEIGHT: 20,
  HITBOX_OFFSET_X: 5,
  HITBOX_OFFSET_Y: 2,
} as const;

// Physics - tuned for that satisfying Flappy Bird feel
export const PHYSICS = {
  GRAVITY: 0.4, // pixels/frame^2 - slightly lower for kids
  FLAP_VELOCITY: -7, // pixels/frame - upward impulse
  MAX_FALL_SPEED: 8, // terminal velocity
  ROTATION_SPEED: 3, // degrees/frame for bird tilt
  MAX_ROTATION_UP: -25, // max upward tilt (degrees)
  MAX_ROTATION_DOWN: 70, // max downward tilt (degrees)
} as const;

// Pipe settings - larger gap for kids
export const PIPE = {
  WIDTH: 52,
  GAP: 140, // Gap between top/bottom pipes (larger = easier)
  SPEED: 2.5, // pixels/frame - slightly slower for kids
  SPAWN_INTERVAL: 1800, // ms between pipes
  MIN_HEIGHT: 60, // Minimum pipe segment height
  COLOR_TOP: "#73bf2e",
  COLOR_BODY: "#5a9e1e",
  COLOR_SHADOW: "#4a8c1a",
} as const;

// Ground settings
export const GROUND = {
  HEIGHT: 112,
  SCROLL_SPEED: PIPE.SPEED,
  COLOR: "#ded895",
  STRIPE_COLOR: "#c4b06c",
} as const;

// Game timing
export const TIMING = {
  FIRST_PIPE_DELAY: 2500, // ms before first pipe (generous start)
  RESTART_DELAY: 500, // ms before restart is allowed
} as const;

// Scoring
export const MEDALS = {
  BRONZE: 10,
  SILVER: 20,
  GOLD: 30,
  PLATINUM: 40,
} as const;

// Colors - bright and kid-friendly
export const COLORS = {
  SKY_TOP: "#4ec0ca",
  SKY_BOTTOM: "#87ceeb",
  BIRD_BODY: "#f9e400",
  BIRD_WING: "#f7941e",
  BIRD_BEAK: "#e44d26",
  BIRD_EYE: "#ffffff",
  BIRD_PUPIL: "#000000",
  SCORE_TEXT: "#ffffff",
  SCORE_SHADOW: "#000000",
  GAME_OVER_BG: "rgba(0, 0, 0, 0.7)",
} as const;

// UI settings
export const UI = {
  SCORE_FONT_SIZE: 48,
  SCORE_FONT: "bold 48px Arial, sans-serif",
  SMALL_FONT: "24px Arial, sans-serif",
  BUTTON_MIN_SIZE: 60, // Minimum button size for kid-friendly tapping
} as const;

// Game states
export type GameState = "ready" | "playing" | "gameOver";

// Types
export type Position = {
  x: number;
  y: number;
};

export type Bird = {
  y: number;
  velocity: number;
  rotation: number;
};

export type Pipe = {
  x: number;
  gapY: number; // Center of the gap
  scored: boolean;
  id: number;
};

export type Medal = "none" | "bronze" | "silver" | "gold" | "platinum";

export function getMedal(score: number): Medal {
  if (score >= MEDALS.PLATINUM) return "platinum";
  if (score >= MEDALS.GOLD) return "gold";
  if (score >= MEDALS.SILVER) return "silver";
  if (score >= MEDALS.BRONZE) return "bronze";
  return "none";
}
