// Memory Match Game - Main exports
// Self-contained game module

export { MemoryMatchGame, default } from "./Game";
export { useMemoryMatchStore } from "./lib/store";
export type { MemoryMatchProgress, GameState } from "./lib/store";
export type { Difficulty, ThemeId, Card } from "./lib/constants";
