// Chess Game - Main exports
// Self-contained game module

export { ChessGame, default } from "./Game";
export { useChessStore } from "./lib/store";
export type { ChessProgress, GameState } from "./lib/store";
export type { Player, Difficulty, GameMode, GameStatus } from "./lib/constants";
