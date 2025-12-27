// Platformer Game - Main exports
// "Hank's Hopper" - Self-contained game module

export { PlatformerGame, default } from "./Game";
export { usePlatformerStore } from "./lib/store";
export type { PlatformerProgress } from "./lib/store";
export type {
  GameState,
  Player,
  Platform,
  Collectible,
  Particle,
  LevelDef,
} from "./lib/constants";
