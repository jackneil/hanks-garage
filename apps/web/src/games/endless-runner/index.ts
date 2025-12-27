// Endless Runner Game - Main exports
// Self-contained game module

export { EndlessRunnerGame, default } from "./Game";
export { useEndlessRunnerStore } from "./lib/store";
export type { EndlessRunnerProgress } from "./lib/store";
export type { GameState, Player, Obstacle, CoinType, CharacterId } from "./lib/constants";
