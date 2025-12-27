// constants.ts - 2048 game types and constants

export type Direction = "up" | "down" | "left" | "right";

export type Position = {
  row: number;
  col: number;
};

export type TileData = {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew: boolean;
  isMerged: boolean;
};

export type GameStatus = "playing" | "won" | "game-over";

export const GRID_SIZE = 4;
export const WINNING_TILE = 2048;

// Spawn rates
export const SPAWN_4_PROBABILITY = 0.1; // 10% chance of spawning a 4

// Animation timings (ms)
export const TIMINGS = {
  SLIDE: 150,
  MERGE_POP: 200,
  SPAWN: 100,
  CELEBRATION: 2000,
} as const;

// Tile colors - classic 2048 theme
export const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: "rgba(238, 228, 218, 0.35)", text: "#776e65" },
  2: { bg: "#eee4da", text: "#776e65" },
  4: { bg: "#ede0c8", text: "#776e65" },
  8: { bg: "#f2b179", text: "#f9f6f2" },
  16: { bg: "#f59563", text: "#f9f6f2" },
  32: { bg: "#f67c5f", text: "#f9f6f2" },
  64: { bg: "#f65e3b", text: "#f9f6f2" },
  128: { bg: "#edcf72", text: "#f9f6f2" },
  256: { bg: "#edcc61", text: "#f9f6f2" },
  512: { bg: "#edc850", text: "#f9f6f2" },
  1024: { bg: "#edc53f", text: "#f9f6f2" },
  2048: { bg: "#edc22e", text: "#f9f6f2" },
  4096: { bg: "#3c3a32", text: "#f9f6f2" },
  8192: { bg: "#3c3a32", text: "#f9f6f2" },
};

// Get tile colors with fallback for high values
export function getTileColors(value: number): { bg: string; text: string } {
  if (value === 0) return TILE_COLORS[0];
  if (TILE_COLORS[value]) return TILE_COLORS[value];
  // For tiles > 8192, use dark theme
  return { bg: "#3c3a32", text: "#f9f6f2" };
}

// Milestone tiles for celebrations
export const MILESTONE_TILES = [128, 256, 512, 1024, 2048, 4096, 8192] as const;

// Generate unique ID for tiles
let tileIdCounter = 0;
export function generateTileId(): string {
  return `tile-${++tileIdCounter}-${Date.now()}`;
}

// Reset tile ID counter (for testing)
export function resetTileIdCounter(): void {
  tileIdCounter = 0;
}

// Create empty grid
export function createEmptyGrid(): number[][] {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(0));
}

// Copy grid immutably
export function copyGrid(grid: number[][]): number[][] {
  return grid.map((row) => [...row]);
}

// Get all empty positions
export function getEmptyPositions(grid: number[][]): Position[] {
  const empty: Position[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        empty.push({ row, col });
      }
    }
  }
  return empty;
}

// Check if grids are equal
export function gridsEqual(a: number[][], b: number[][]): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (a[row][col] !== b[row][col]) return false;
    }
  }
  return true;
}
