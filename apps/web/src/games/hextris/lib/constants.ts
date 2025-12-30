// ==============================================
// HEXTRIS - GAME CONSTANTS
// ==============================================

export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 500;

// Hexagon dimensions
export const HEX_RADIUS = 50; // Central hexagon radius
export const HEX_CENTER_X = CANVAS_WIDTH / 2;
export const HEX_CENTER_Y = CANVAS_HEIGHT / 2;

// Block dimensions
export const BLOCK_WIDTH = 35;
export const BLOCK_HEIGHT = 20;
export const MAX_STACK_HEIGHT = 6; // Blocks per side before game over
export const MATCH_MINIMUM = 3; // Blocks needed for a match

// Game speed
export const INITIAL_FALL_SPEED = 2;
export const MAX_FALL_SPEED = 8;
export const SPEED_INCREMENT = 0.0005; // Per frame
export const ROTATION_SPEED = 0.15; // Radians per frame for smooth rotation

// Spawn settings
export const SPAWN_DISTANCE = 250; // Distance from center where blocks spawn
export const SPAWN_INTERVAL = 1500; // ms between spawns (initial)
export const MIN_SPAWN_INTERVAL = 600; // Minimum spawn interval

// Colors
export const BLOCK_COLORS = [
  "#ef4444", // Red
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#eab308", // Yellow
  "#a855f7", // Purple
  "#f97316", // Orange
] as const;

export const COLORS = {
  BACKGROUND: "#0f172a", // Dark slate
  HEX_FILL: "#1e293b", // Slate 800
  HEX_STROKE: "#60a5fa", // Blue 400
  SCORE_TEXT: "#f8fafc", // Slate 50
  GAME_OVER_BG: "rgba(0, 0, 0, 0.7)",
};

// Scoring
export const POINTS = {
  BLOCK_LAND: 1,
  MATCH_3: 30,
  MATCH_4: 50,
  MATCH_5_PLUS: 100,
  CHAIN_MULTIPLIER: 1.5,
} as const;

// Game status
export type GameStatus = "idle" | "playing" | "paused" | "game-over";

// Types
export type BlockColor = (typeof BLOCK_COLORS)[number];

export interface Block {
  id: number;
  color: BlockColor;
  side: number; // 0-5, which hexagon side it's stacked on
  stackIndex: number; // Position in the stack (0 = closest to center)
}

export interface FallingBlock {
  id: number;
  color: BlockColor;
  x: number;
  y: number;
  targetSide: number; // Which side it's falling toward
  angle: number; // Direction angle toward center
  speed: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}

// Utility functions
export function getHexCorner(centerX: number, centerY: number, radius: number, cornerIndex: number): { x: number; y: number } {
  const angle = (Math.PI / 3) * cornerIndex - Math.PI / 2;
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

export function getSideCenter(centerX: number, centerY: number, radius: number, sideIndex: number): { x: number; y: number } {
  // Get center point of each hexagon side
  const corner1 = getHexCorner(centerX, centerY, radius, sideIndex);
  const corner2 = getHexCorner(centerX, centerY, radius, (sideIndex + 1) % 6);
  return {
    x: (corner1.x + corner2.x) / 2,
    y: (corner1.y + corner2.y) / 2,
  };
}

export function getSideAngle(sideIndex: number): number {
  // Get the outward angle perpendicular to each side
  return (Math.PI / 3) * sideIndex + Math.PI / 6;
}

export function getBlockPosition(
  centerX: number,
  centerY: number,
  baseRadius: number,
  sideIndex: number,
  stackIndex: number,
  rotationOffset: number
): { x: number; y: number; angle: number } {
  const adjustedSideIndex = sideIndex;
  const sideAngle = getSideAngle(adjustedSideIndex) + rotationOffset;
  const distance = baseRadius + BLOCK_HEIGHT / 2 + stackIndex * BLOCK_HEIGHT;

  return {
    x: centerX + Math.cos(sideAngle) * distance,
    y: centerY + Math.sin(sideAngle) * distance,
    angle: sideAngle,
  };
}

export function getRandomColor(): BlockColor {
  return BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
}

export function getRandomSide(): number {
  return Math.floor(Math.random() * 6);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
