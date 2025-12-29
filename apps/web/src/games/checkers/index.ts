// Checkers Game - Main exports
// Self-contained game module

export { CheckersGame, default } from "./Game";
export { useCheckersStore } from "./lib/store";
export type { CheckersProgress, GameState } from "./lib/store";
export type {
  Player,
  PieceType,
  Move,
  Difficulty,
  GameStatus,
  GameVariant,
  GameMode,
  RuleSet,
} from "./lib/constants";
export { RULE_SETS } from "./lib/constants";
