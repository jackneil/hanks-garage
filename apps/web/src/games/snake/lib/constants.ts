// Snake Game - Types and Constants

export type Direction = "up" | "down" | "left" | "right";

export type Position = {
  x: number;
  y: number;
};

export type GameStatus = "idle" | "playing" | "paused" | "game-over";

export type SpeedSetting = "slow" | "medium" | "fast";

export type ControlMode = "buttons" | "swipe";

export type FoodType = "apple" | "pizza" | "burger" | "donut" | "banana" | "icecream";

// Grid configuration
export const GRID_SIZE = 20; // 20x20 grid
export const CELL_SIZE = 20; // pixels per cell

// Speed configuration (milliseconds between ticks)
export const SPEED_CONFIG: Record<SpeedSetting, number> = {
  slow: 200,   // 5 moves/sec
  medium: 130, // ~7.7 moves/sec
  fast: 80,    // 12.5 moves/sec
};

// Speed ramp: decrease interval as snake grows
export const SPEED_RAMP = {
  segmentsPerSpeedUp: 5,  // Every 5 segments
  msReduction: 5,         // Reduce interval by 5ms
  minInterval: 50,        // Never faster than 50ms
};

// Scoring
export const POINTS_PER_FOOD = 10;

// Available food types for visual variety
export const FOOD_TYPES: FoodType[] = ["apple", "pizza", "burger", "donut", "banana", "icecream"];

// Food emoji mapping
export const FOOD_EMOJI: Record<FoodType, string> = {
  apple: "🍎",
  pizza: "🍕",
  burger: "🍔",
  donut: "🍩",
  banana: "🍌",
  icecream: "🍦",
};

// Colors
export const COLORS = {
  SNAKE_HEAD: "#22c55e",      // green-500
  SNAKE_BODY: "#16a34a",      // green-600
  SNAKE_BODY_ALT: "#15803d",  // green-700 (alternating segments)
  FOOD_BG: "#fef3c7",         // amber-100
  GRID_LINE: "#e5e7eb",       // gray-200
  GRID_BG: "#f3f4f6",         // gray-100
  GAME_OVER_BG: "#ef4444",    // red-500
} as const;

// Sizes for kid-friendly UI
export const SIZES = {
  MIN_BUTTON_SIZE: 60,   // Minimum touch target
  ARROW_BUTTON: 80,      // Arrow button size
  MIN_TOUCH_TARGET: 44,  // Apple HIG minimum
} as const;

// Direction vectors
export const DIRECTION_VECTORS: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

// Opposite directions (to prevent 180-degree turns)
export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

// Helper functions
export function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function getRandomPosition(gridSize: number = GRID_SIZE): Position {
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
  };
}

export function getRandomFoodType(): FoodType {
  return FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
}

export function isValidPosition(pos: Position, gridSize: number = GRID_SIZE): boolean {
  return pos.x >= 0 && pos.x < gridSize && pos.y >= 0 && pos.y < gridSize;
}

export function wrapPosition(pos: Position, gridSize: number = GRID_SIZE): Position {
  return {
    x: ((pos.x % gridSize) + gridSize) % gridSize,
    y: ((pos.y % gridSize) + gridSize) % gridSize,
  };
}

export function calculateNewHead(head: Position, direction: Direction): Position {
  const vector = DIRECTION_VECTORS[direction];
  return {
    x: head.x + vector.x,
    y: head.y + vector.y,
  };
}

export function getTickInterval(baseSpeed: SpeedSetting, snakeLength: number): number {
  const baseInterval = SPEED_CONFIG[baseSpeed];
  const lengthBonus = Math.floor(snakeLength / SPEED_RAMP.segmentsPerSpeedUp) * SPEED_RAMP.msReduction;
  return Math.max(baseInterval - lengthBonus, SPEED_RAMP.minInterval);
}

// Get a random spawn position that's not on the snake
export function getValidFoodPosition(snake: Position[], gridSize: number = GRID_SIZE): Position {
  let position: Position;
  let attempts = 0;
  const maxAttempts = gridSize * gridSize;

  do {
    position = getRandomPosition(gridSize);
    attempts++;
  } while (
    snake.some(segment => positionsEqual(segment, position)) &&
    attempts < maxAttempts
  );

  return position;
}

// Initial snake position (center of grid, facing right)
export function getInitialSnake(gridSize: number = GRID_SIZE): Position[] {
  const centerY = Math.floor(gridSize / 2);
  const startX = Math.floor(gridSize / 4);

  return [
    { x: startX + 2, y: centerY }, // Head
    { x: startX + 1, y: centerY }, // Body
    { x: startX, y: centerY },     // Tail
  ];
}
