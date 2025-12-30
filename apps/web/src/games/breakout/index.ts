// Breakout Game - Main exports
// Self-contained game module

export { BreakoutGame, default } from "./Game";
export { useBreakoutStore } from "./lib/store";
export type { BreakoutProgress, BreakoutGameState } from "./lib/store";
export type {
  GameStatus,
  BrickType,
  PowerUpType,
  Ball,
  Brick,
  PowerUp,
  Paddle,
} from "./lib/constants";
