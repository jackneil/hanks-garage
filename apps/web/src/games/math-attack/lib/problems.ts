// Math problem generator

import type { Operation } from "./constants";
import { GAME } from "./constants";

export interface Problem {
  id: string;
  text: string;
  answer: number;
  operation: string; // The operation used (+, -, ×, ÷)
  x: number;
  y: number;
  speed: number;
  color: string;
  reachedBottom: boolean; // Flag to prevent multiple life loss
}

const COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a math problem based on difficulty settings
 */
export function generateProblem(
  operations: Operation[],
  range: [number, number],
  baseSpeed: number,
  bubbleSize: number
): Problem {
  const op = operations[randInt(0, operations.length - 1)];
  let a = randInt(range[0], range[1]);
  let b = randInt(range[0], range[1]);
  let answer: number;

  switch (op) {
    case "+":
      answer = a + b;
      break;
    case "-":
      // Ensure positive result
      if (a < b) [a, b] = [b, a];
      answer = a - b;
      break;
    case "×":
      // Keep multiplication simpler
      a = randInt(1, Math.min(12, range[1]));
      b = randInt(1, Math.min(12, range[1]));
      answer = a * b;
      break;
    case "÷":
      // Ensure clean division
      b = randInt(1, 10);
      const quotient = randInt(1, Math.min(10, range[1]));
      a = b * quotient;
      answer = quotient;
      break;
    default:
      answer = a + b;
  }

  // Random x position (keeping bubble within bounds)
  const padding = bubbleSize / 2 + 10;
  const x = randInt(padding, GAME.width - padding);

  // Random speed variation (±20%)
  const speedVariation = 0.8 + Math.random() * 0.4;
  const speed = baseSpeed * speedVariation;

  // Random color
  const color = COLORS[randInt(0, COLORS.length - 1)];

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    text: `${a} ${op} ${b}`,
    answer,
    operation: op,
    x,
    y: -bubbleSize / 2,
    speed,
    color,
    reachedBottom: false,
  };
}

/**
 * Check if answer matches any problem
 */
export function findMatchingProblem(problems: Problem[], answer: number): Problem | null {
  // Find the lowest (closest to bottom) problem with matching answer
  let lowestMatch: Problem | null = null;

  for (const problem of problems) {
    if (problem.answer === answer) {
      if (!lowestMatch || problem.y > lowestMatch.y) {
        lowestMatch = problem;
      }
    }
  }

  return lowestMatch;
}
