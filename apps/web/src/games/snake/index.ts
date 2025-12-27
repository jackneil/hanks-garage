// Snake Game - Main exports
// Self-contained game module

export { SnakeGame, default } from "./Game";
export { useSnakeStore } from "./lib/store";
export type { SnakeProgress, SnakeGameState } from "./lib/store";
export type {
  Direction,
  Position,
  GameStatus,
  SpeedSetting,
  ControlMode,
  FoodType,
} from "./lib/constants";
