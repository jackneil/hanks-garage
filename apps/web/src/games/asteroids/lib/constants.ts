// ==============================================
// ASTEROIDS - GAME CONSTANTS
// ==============================================

export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 500;

// Ship physics
export const ROTATION_SPEED = 0.08; // Radians per frame
export const THRUST_POWER = 0.15;
export const MAX_SPEED = 6;
export const FRICTION = 0.995; // Slight drag for kid-friendly
export const SHIP_SIZE = 18;

// Bullet
export const BULLET_SPEED = 10;
export const BULLET_LIFETIME = 60; // frames
export const MAX_BULLETS = 5;
export const BULLET_COOLDOWN = 10; // frames

// Asteroids
export const ASTEROID_SIZES = {
  large: { radius: 40, points: 20, speed: 1 },
  medium: { radius: 20, points: 50, speed: 1.5 },
  small: { radius: 10, points: 100, speed: 2 },
} as const;

export const INITIAL_ASTEROIDS = 4;
export const ASTEROIDS_PER_WAVE = 2;

// UFO
export const UFO_SPEED = 2;
export const UFO_SIZE = 25;
export const UFO_POINTS = 200;
export const UFO_SHOOT_INTERVAL = 90; // frames
export const UFO_SPAWN_CHANCE = 0.002; // per frame

// Spawning
export const SAFE_SPAWN_RADIUS = 100; // Keep asteroids away from spawn point
export const RESPAWN_INVINCIBILITY = 180; // frames (~3 seconds)

// Hyperspace
export const HYPERSPACE_COOLDOWN = 180; // frames (~3 seconds)
export const HYPERSPACE_RISK = 0.15; // Chance of dying

// Lives
export const INITIAL_LIVES = 4; // Kid-friendly: 4 instead of 3

// Colors (vector style)
export const COLORS = {
  BACKGROUND: "#0a0a0a",
  SHIP: "#22c55e", // Green
  SHIP_THRUST: "#f97316", // Orange
  ASTEROID: "#f8fafc", // White
  BULLET: "#facc15", // Yellow
  UFO: "#ef4444", // Red
  UFO_BULLET: "#ef4444",
  TEXT: "#f8fafc",
  INVINCIBLE: "#60a5fa", // Blue tint when invincible
};

// Game status
export type GameStatus = "ready" | "playing" | "paused" | "gameOver" | "waveComplete";

// Types
export type AsteroidSize = "large" | "medium" | "small";

export interface Ship {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number; // Radians
  thrusting: boolean;
  invincibleFrames: number;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  isUfoBullet: boolean;
}

export interface Asteroid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: AsteroidSize;
  vertices: { x: number; y: number }[];
  rotation: number;
  rotationSpeed: number;
}

export interface UFO {
  x: number;
  y: number;
  vx: number;
  vy: number;
  shootCooldown: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

// Utility functions
export function wrap(value: number, max: number): number {
  if (value < 0) return max + value;
  if (value >= max) return value - max;
  return value;
}

export function generateAsteroidVertices(radius: number): { x: number; y: number }[] {
  const vertices: { x: number; y: number }[] = [];
  const numVertices = 8 + Math.floor(Math.random() * 4); // 8-11 vertices

  for (let i = 0; i < numVertices; i++) {
    const angle = (i / numVertices) * Math.PI * 2;
    const jitter = 0.7 + Math.random() * 0.6; // 0.7-1.3 radius variation
    vertices.push({
      x: Math.cos(angle) * radius * jitter,
      y: Math.sin(angle) * radius * jitter,
    });
  }

  return vertices;
}

export function createAsteroid(
  id: number,
  x: number,
  y: number,
  size: AsteroidSize,
  angle?: number
): Asteroid {
  const config = ASTEROID_SIZES[size];
  const speed = config.speed * (0.5 + Math.random() * 0.5);
  const direction = angle ?? Math.random() * Math.PI * 2;

  return {
    id,
    x,
    y,
    vx: Math.cos(direction) * speed,
    vy: Math.sin(direction) * speed,
    size,
    vertices: generateAsteroidVertices(config.radius),
    rotation: 0,
    rotationSpeed: (Math.random() - 0.5) * 0.04,
  };
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
