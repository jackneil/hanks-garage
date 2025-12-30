// Dino Runner - Main exports
// Self-contained game module (Chrome dinosaur clone)

export { DinoRunnerGame, default } from "./Game";
export { useDinoRunnerStore } from "./lib/store";
export type { DinoRunnerProgress, DinoRunnerGameState } from "./lib/store";
export type {
  GameState,
  Obstacle,
  ObstacleType,
  CloudData,
} from "./lib/constants";
