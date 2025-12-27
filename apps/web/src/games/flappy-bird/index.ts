// Flappy Bird Game - Main exports
// Self-contained game module

export { FlappyBirdGame, default } from "./Game";
export { useFlappyStore } from "./lib/store";
export type { FlappyBirdProgress } from "./lib/store";
export type { GameState, Bird, Pipe, Medal } from "./lib/constants";
