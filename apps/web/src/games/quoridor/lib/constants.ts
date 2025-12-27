// constants.ts - Quoridor game types and constants

// Players
export type Player = 1 | 2;

// Board position (0-8 for row and col)
export type Position = {
  row: number;
  col: number;
};

// Wall placement
export type WallOrientation = "horizontal" | "vertical";

export type Wall = {
  row: number; // Row where wall starts (0-7 for horizontal, 0-8 for vertical)
  col: number; // Column where wall starts
  orientation: WallOrientation;
};

// A move is either pawn movement or wall placement
export type Move =
  | { type: "move"; to: Position }
  | { type: "wall"; wall: Wall };

// Game status
export type GameStatus = "playing" | "player1-wins" | "player2-wins";

// Game mode
export type GameMode = "local" | "ai";

// AI difficulty
export type Difficulty = "easy" | "medium" | "hard";

// Board constants
export const BOARD_SIZE = 9;
export const WALLS_PER_PLAYER = 10;

// Player starting positions
export const PLAYER1_START: Position = { row: 0, col: 4 }; // Bottom center
export const PLAYER2_START: Position = { row: 8, col: 4 }; // Top center

// Goal rows
export const PLAYER1_GOAL_ROW = 8; // Player 1 needs to reach row 8
export const PLAYER2_GOAL_ROW = 0; // Player 2 needs to reach row 0

// Colors for UI
export const COLORS = {
  BOARD_LIGHT: "#d4a574",
  BOARD_DARK: "#8b5a2b",
  GROOVE: "#5c3a21",
  PLAYER1: "#3b82f6", // Blue
  PLAYER2: "#f97316", // Orange
  WALL: "#78350f", // Dark brown
  WALL_PREVIEW: "rgba(120, 53, 15, 0.5)",
  WALL_INVALID: "rgba(239, 68, 68, 0.5)",
  VALID_MOVE: "#22c55e",
  SELECTED: "#fbbf24",
} as const;

// UI sizes
export const SIZES = {
  MIN_SQUARE_SIZE: 40,
  MIN_BUTTON_SIZE: 48,
  GROOVE_WIDTH: 8,
} as const;

// AI config
export const AI_CONFIG = {
  EASY_DEPTH: 1,
  MEDIUM_DEPTH: 2,
  HARD_DEPTH: 3,
  MOVE_DELAY_MS: 500,
} as const;

// Utility functions
export function positionsEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

export function wallsEqual(a: Wall, b: Wall): boolean {
  return a.row === b.row && a.col === b.col && a.orientation === b.orientation;
}

export function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function getOpponent(player: Player): Player {
  return player === 1 ? 2 : 1;
}

export function getGoalRow(player: Player): number {
  return player === 1 ? PLAYER1_GOAL_ROW : PLAYER2_GOAL_ROW;
}

export function getPlayerColor(player: Player): string {
  return player === 1 ? COLORS.PLAYER1 : COLORS.PLAYER2;
}

export function createInitialPositions(): Record<Player, Position> {
  return {
    1: { ...PLAYER1_START },
    2: { ...PLAYER2_START },
  };
}
