// Blitz Bomber Game - Main exports
// Self-contained game module

export { BlitzBomberGame, default } from "./Game";
export { useBlitzBomberStore } from "./lib/store";
export type { BlitzBomberProgress } from "./lib/store";
export type {
  GameState,
  DifficultyLevel,
  Position,
  Plane,
  Bomb,
  Building,
  Explosion,
} from "./lib/constants";
