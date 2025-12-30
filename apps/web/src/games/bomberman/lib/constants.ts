// ==============================================
// BOMBERMAN - CONSTANTS
// ==============================================

// Grid settings
export const GRID_WIDTH = 13;
export const GRID_HEIGHT = 11;
export const TILE_SIZE = 48;

// Timing
export const BOMB_TIMER = 3000; // 3 seconds fuse (kid-friendly)
export const EXPLOSION_DURATION = 400;
export const MOVE_COOLDOWN = 150; // ms between moves
export const ENEMY_MOVE_INTERVAL = 500;

// Player defaults
export const DEFAULT_BOMB_COUNT = 1;
export const DEFAULT_BLAST_RANGE = 2;
export const DEFAULT_SPEED = 1;
export const STARTING_LIVES = 3;

// Level generation
export const BLOCK_DENSITY = 0.5; // 50% of empty tiles get blocks
export const POWERUP_CHANCE = 0.25; // 25% of blocks have power-ups

// Colors
export const COLORS = {
  FLOOR: "#8BC34A",
  FLOOR_ALT: "#7CB342",
  WALL: "#424242",
  WALL_BORDER: "#212121",
  BLOCK: "#A1887F",
  BLOCK_BORDER: "#8D6E63",
  EXPLOSION: "#FF9800",
  EXPLOSION_CENTER: "#FFEB3B",
};

// Tile types
export type TileType = "empty" | "wall" | "block" | "exit";

export interface Tile {
  type: TileType;
  powerUp?: PowerUpType;
  revealed?: boolean;
}

// Power-ups
export type PowerUpType = "bomb" | "fire" | "speed" | "kick" | "shield";

export interface PowerUp {
  type: PowerUpType;
  name: string;
  emoji: string;
  description: string;
  rarity: number; // Weight for random selection
}

export const POWER_UPS: PowerUp[] = [
  { type: "bomb", name: "Extra Bomb", emoji: "💣", description: "+1 bomb", rarity: 30 },
  { type: "fire", name: "Fire Power", emoji: "🔥", description: "+1 range", rarity: 30 },
  { type: "speed", name: "Speed Up", emoji: "👟", description: "Move faster", rarity: 20 },
  { type: "kick", name: "Bomb Kick", emoji: "🦶", description: "Kick bombs", rarity: 10 },
  { type: "shield", name: "Shield", emoji: "🛡️", description: "Survive 1 hit", rarity: 10 },
];

// Get random power-up based on rarity
export function getRandomPowerUp(): PowerUpType {
  const totalRarity = POWER_UPS.reduce((sum, p) => sum + p.rarity, 0);
  let roll = Math.random() * totalRarity;

  for (const powerUp of POWER_UPS) {
    roll -= powerUp.rarity;
    if (roll <= 0) return powerUp.type;
  }

  return "bomb";
}

// Enemies
export type EnemyType = "balloon" | "ghost" | "chaser" | "bomber";

export interface EnemyConfig {
  type: EnemyType;
  name: string;
  emoji: string;
  points: number;
  speed: number;
  canPassBlocks: boolean;
  ai: "random" | "chase" | "smart";
}

export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  balloon: {
    type: "balloon",
    name: "Balloon",
    emoji: "🎈",
    points: 100,
    speed: 1,
    canPassBlocks: false,
    ai: "random",
  },
  ghost: {
    type: "ghost",
    name: "Ghost",
    emoji: "👻",
    points: 200,
    speed: 0.8,
    canPassBlocks: true,
    ai: "random",
  },
  chaser: {
    type: "chaser",
    name: "Chaser",
    emoji: "😈",
    points: 300,
    speed: 1.2,
    canPassBlocks: false,
    ai: "chase",
  },
  bomber: {
    type: "bomber",
    name: "Bomber",
    emoji: "💀",
    points: 500,
    speed: 0.7,
    canPassBlocks: false,
    ai: "smart",
  },
};

// Level configurations
export interface LevelConfig {
  level: number;
  enemies: { type: EnemyType; count: number }[];
  blockDensity: number;
  powerUpChance: number;
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, enemies: [{ type: "balloon", count: 2 }], blockDensity: 0.4, powerUpChance: 0.35 },
  { level: 2, enemies: [{ type: "balloon", count: 3 }], blockDensity: 0.45, powerUpChance: 0.3 },
  { level: 3, enemies: [{ type: "balloon", count: 2 }, { type: "ghost", count: 1 }], blockDensity: 0.45, powerUpChance: 0.3 },
  { level: 4, enemies: [{ type: "balloon", count: 2 }, { type: "ghost", count: 2 }], blockDensity: 0.5, powerUpChance: 0.25 },
  { level: 5, enemies: [{ type: "balloon", count: 1 }, { type: "ghost", count: 1 }, { type: "chaser", count: 1 }], blockDensity: 0.5, powerUpChance: 0.25 },
  { level: 6, enemies: [{ type: "ghost", count: 2 }, { type: "chaser", count: 2 }], blockDensity: 0.55, powerUpChance: 0.2 },
  { level: 7, enemies: [{ type: "chaser", count: 3 }, { type: "bomber", count: 1 }], blockDensity: 0.55, powerUpChance: 0.2 },
  { level: 8, enemies: [{ type: "ghost", count: 2 }, { type: "chaser", count: 2 }, { type: "bomber", count: 1 }], blockDensity: 0.6, powerUpChance: 0.2 },
];

// Get level config (loops after level 8 with more enemies)
export function getLevelConfig(level: number): LevelConfig {
  if (level <= LEVEL_CONFIGS.length) {
    return LEVEL_CONFIGS[level - 1];
  }

  // After level 8, increase difficulty
  const base = LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1];
  const extraEnemies = Math.floor((level - LEVEL_CONFIGS.length) / 2);

  return {
    level,
    enemies: base.enemies.map(e => ({
      type: e.type,
      count: Math.min(e.count + extraEnemies, 6),
    })),
    blockDensity: Math.min(0.7, base.blockDensity + 0.02 * (level - LEVEL_CONFIGS.length)),
    powerUpChance: Math.max(0.1, base.powerUpChance - 0.01 * (level - LEVEL_CONFIGS.length)),
  };
}

// Directions
export const DIRECTIONS = {
  UP: { dx: 0, dy: -1 },
  DOWN: { dx: 0, dy: 1 },
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
};

export type Direction = keyof typeof DIRECTIONS;

// Helper functions
export function inBounds(x: number, y: number): boolean {
  return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
}

export function isWalkable(tile: Tile, canPassBlocks: boolean = false): boolean {
  if (tile.type === "empty") return true;
  if (tile.type === "exit" && tile.revealed) return true;
  if (tile.type === "block" && canPassBlocks) return true;
  return false;
}
