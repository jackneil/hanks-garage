// gameLogic.ts - Pure game logic functions for 2048

import {
  type Direction,
  GRID_SIZE,
  WINNING_TILE,
  SPAWN_4_PROBABILITY,
  copyGrid,
  getEmptyPositions,
  gridsEqual,
} from "./constants";

export type SlideResult = {
  grid: number[][];
  scoreGained: number;
  moved: boolean;
  mergedPositions: { row: number; col: number }[];
};

/**
 * Slide a single row/column to the left and merge tiles
 * Returns the new row and score gained from merges
 */
function slideRowLeft(row: number[]): { newRow: number[]; score: number; mergedIndices: number[] } {
  // Filter out zeros
  const nonZero = row.filter((val) => val !== 0);

  const merged: number[] = [];
  const mergedIndices: number[] = [];
  let score = 0;
  let i = 0;

  while (i < nonZero.length) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      // Merge two tiles
      const mergedValue = nonZero[i] * 2;
      merged.push(mergedValue);
      mergedIndices.push(merged.length - 1);
      score += mergedValue;
      i += 2; // Skip both merged tiles
    } else {
      merged.push(nonZero[i]);
      i++;
    }
  }

  // Pad with zeros to maintain row length
  while (merged.length < GRID_SIZE) {
    merged.push(0);
  }

  return { newRow: merged, score, mergedIndices };
}

/**
 * Rotate a grid 90 degrees clockwise
 */
function rotateClockwise(grid: number[][]): number[][] {
  const result: number[][] = [];
  for (let col = 0; col < GRID_SIZE; col++) {
    const newRow: number[] = [];
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      newRow.push(grid[row][col]);
    }
    result.push(newRow);
  }
  return result;
}

/**
 * Rotate a grid 90 degrees counter-clockwise
 */
function rotateCounterClockwise(grid: number[][]): number[][] {
  const result: number[][] = [];
  for (let col = GRID_SIZE - 1; col >= 0; col--) {
    const newRow: number[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      newRow.push(grid[row][col]);
    }
    result.push(newRow);
  }
  return result;
}

/**
 * Transform merged position indices based on direction
 */
function transformMergedPositions(
  mergedByRow: { row: number; indices: number[] }[],
  direction: Direction
): { row: number; col: number }[] {
  const positions: { row: number; col: number }[] = [];

  for (const { row, indices } of mergedByRow) {
    for (const col of indices) {
      let finalRow = row;
      let finalCol = col;

      switch (direction) {
        case "right":
          // Row was reversed, so col position is GRID_SIZE - 1 - col
          finalCol = GRID_SIZE - 1 - col;
          break;
        case "up":
          // Grid was rotated clockwise, then slides left
          // Original position was at column `row`, row `GRID_SIZE - 1 - col`
          finalRow = col;
          finalCol = row;
          break;
        case "down":
          // Grid was rotated counter-clockwise, then slides left
          // Need to reverse the transformation
          finalRow = GRID_SIZE - 1 - col;
          finalCol = GRID_SIZE - 1 - row;
          break;
      }

      positions.push({ row: finalRow, col: finalCol });
    }
  }

  return positions;
}

/**
 * Slide all tiles in the given direction
 * Returns new grid, score gained, and whether any tiles moved
 */
export function slideTiles(grid: number[][], direction: Direction): SlideResult {
  const originalGrid = copyGrid(grid);
  let workingGrid = copyGrid(grid);
  let totalScore = 0;
  const mergedByRow: { row: number; indices: number[] }[] = [];

  // Transform grid so we always slide left
  switch (direction) {
    case "right":
      // Reverse each row
      workingGrid = workingGrid.map((row) => [...row].reverse());
      break;
    case "up":
      // Rotate clockwise
      workingGrid = rotateClockwise(workingGrid);
      break;
    case "down":
      // Rotate counter-clockwise
      workingGrid = rotateCounterClockwise(workingGrid);
      break;
  }

  // Slide all rows left
  for (let row = 0; row < GRID_SIZE; row++) {
    const { newRow, score, mergedIndices } = slideRowLeft(workingGrid[row]);
    workingGrid[row] = newRow;
    totalScore += score;
    if (mergedIndices.length > 0) {
      mergedByRow.push({ row, indices: mergedIndices });
    }
  }

  // Transform back
  switch (direction) {
    case "right":
      workingGrid = workingGrid.map((row) => [...row].reverse());
      break;
    case "up":
      workingGrid = rotateCounterClockwise(workingGrid);
      break;
    case "down":
      workingGrid = rotateClockwise(workingGrid);
      break;
  }

  const moved = !gridsEqual(originalGrid, workingGrid);
  const mergedPositions = transformMergedPositions(mergedByRow, direction);

  return {
    grid: workingGrid,
    scoreGained: totalScore,
    moved,
    mergedPositions,
  };
}

/**
 * Spawn a new tile (2 or 4) in a random empty cell
 * Returns null if no empty cells
 */
export function spawnTile(grid: number[][]): {
  grid: number[][];
  position: { row: number; col: number };
  value: number;
} | null {
  const emptyPositions = getEmptyPositions(grid);

  if (emptyPositions.length === 0) {
    return null;
  }

  const position = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const value = Math.random() < SPAWN_4_PROBABILITY ? 4 : 2;

  const newGrid = copyGrid(grid);
  newGrid[position.row][position.col] = value;

  return { grid: newGrid, position, value };
}

/**
 * Check if any valid move exists
 */
export function hasValidMoves(grid: number[][]): boolean {
  // Check for empty cells
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) return true;
    }
  }

  // Check for adjacent matching tiles (horizontally)
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE - 1; col++) {
      if (grid[row][col] === grid[row][col + 1]) return true;
    }
  }

  // Check for adjacent matching tiles (vertically)
  for (let row = 0; row < GRID_SIZE - 1; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === grid[row + 1][col]) return true;
    }
  }

  return false;
}

/**
 * Check if 2048 tile exists (win condition)
 */
export function hasWon(grid: number[][]): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] >= WINNING_TILE) return true;
    }
  }
  return false;
}

/**
 * Get highest tile value on the grid
 */
export function getHighestTile(grid: number[][]): number {
  let max = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] > max) max = grid[row][col];
    }
  }
  return max;
}

/**
 * Initialize a new game grid with two random tiles
 */
export function initializeGrid(): number[][] {
  let grid: number[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(0));

  // Spawn first tile
  const spawn1 = spawnTile(grid);
  if (spawn1) grid = spawn1.grid;

  // Spawn second tile
  const spawn2 = spawnTile(grid);
  if (spawn2) grid = spawn2.grid;

  return grid;
}
