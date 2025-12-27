// 2048 Game - Main exports
// Self-contained game module

export { Game2048, default } from "./Game";
export { use2048Store } from "./lib/store";
export type { Game2048Progress, GameState } from "./lib/store";
export type { Direction, GameStatus, TileData, Position } from "./lib/constants";
