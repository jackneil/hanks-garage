import {
  type PieceType,
  type Player,
  type Move,
  type Difficulty,
  type RuleSet,
  BOARD_SIZE,
  AI_CONFIG,
  PIECE_VALUES,
  getPlayerFromPiece,
  isKing,
  getOpponent,
  getDefaultRuleSet,
} from "./constants";
import { getAllValidMoves, executeMove } from "./gameLogic";

export function getAIMove(
  board: PieceType[][],
  player: Player,
  difficulty: Difficulty,
  rules: RuleSet = getDefaultRuleSet()
): Move | null {
  const validMoves = getAllValidMoves(board, player, rules);
  if (validMoves.length === 0) return null;

  // For flying kings (Brazilian), reduce depth due to higher branching factor
  const adjustedDepth = rules.flyingKings
    ? {
        easy: AI_CONFIG.EASY_DEPTH,
        medium: Math.max(1, AI_CONFIG.MEDIUM_DEPTH - 1), // depth 2 instead of 3
        hard: Math.max(2, AI_CONFIG.HARD_DEPTH - 2), // depth 4 instead of 6
      }
    : {
        easy: AI_CONFIG.EASY_DEPTH,
        medium: AI_CONFIG.MEDIUM_DEPTH,
        hard: AI_CONFIG.HARD_DEPTH,
      };

  switch (difficulty) {
    case "easy":
      return getRandomMove(validMoves);
    case "medium":
      return getBestMove(board, player, adjustedDepth.medium, rules);
    case "hard":
      return getBestMove(board, player, adjustedDepth.hard, rules);
    default:
      return getRandomMove(validMoves);
  }
}

function getRandomMove(moves: Move[]): Move {
  return moves[Math.floor(Math.random() * moves.length)];
}

function getBestMove(
  board: PieceType[][],
  player: Player,
  maxDepth: number,
  rules: RuleSet
): Move | null {
  const validMoves = getAllValidMoves(board, player, rules);
  if (validMoves.length === 0) return null;

  let bestMove = validMoves[0];
  let bestScore = -Infinity;

  for (const move of validMoves) {
    const newBoard = executeMove(board, move);
    const score = minimax(
      newBoard,
      maxDepth - 1,
      -Infinity,
      Infinity,
      false,
      player,
      getOpponent(player),
      rules
    );
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}

function minimax(
  board: PieceType[][],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  currentPlayer: Player,
  rules: RuleSet
): number {
  if (depth === 0) return evaluateBoard(board, aiPlayer, rules);

  const validMoves = getAllValidMoves(board, currentPlayer, rules);

  if (validMoves.length === 0) {
    // No moves available
    if (rules.invertedWinCondition) {
      // SUICIDE: no moves = WIN for current player (which is bad if it's the AI, good if opponent)
      return currentPlayer === aiPlayer ? 10000 : -10000;
    } else {
      // NORMAL: no moves = LOSS for current player
      return currentPlayer === aiPlayer ? -10000 : 10000;
    }
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const newBoard = executeMove(board, move);
      const evaluation = minimax(
        newBoard,
        depth - 1,
        alpha,
        beta,
        false,
        aiPlayer,
        getOpponent(currentPlayer),
        rules
      );
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const newBoard = executeMove(board, move);
      const evaluation = minimax(
        newBoard,
        depth - 1,
        alpha,
        beta,
        true,
        aiPlayer,
        getOpponent(currentPlayer),
        rules
      );
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function evaluateBoard(board: PieceType[][], player: Player, rules: RuleSet): number {
  let score = 0;
  const opponent = getOpponent(player);

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      const piecePlayer = getPlayerFromPiece(piece);
      const multiplier = piecePlayer === player ? 1 : -1;
      const baseValue = isKing(piece) ? PIECE_VALUES.KING : PIECE_VALUES.REGULAR;

      score += baseValue * multiplier;
      score += getPositionBonus(row, col, piece, piecePlayer!, rules) * multiplier;
    }
  }

  // Mobility bonus
  const playerMoves = getAllValidMoves(board, player, rules).length;
  const opponentMoves = getAllValidMoves(board, opponent, rules).length;
  score += (playerMoves - opponentMoves) * 2;

  // SUICIDE MODE: invert the entire evaluation!
  // In suicide, having fewer pieces is GOOD, having no mobility is GOOD
  if (rules.invertedWinCondition) {
    score = -score;
  }

  return score;
}

function getPositionBonus(
  row: number,
  col: number,
  piece: PieceType,
  player: Player,
  rules: RuleSet
): number {
  let bonus = 0;

  // Center control
  if (col >= 2 && col <= 5) bonus += PIECE_VALUES.CENTER_BONUS;

  // Advancement bonus (getting closer to promotion)
  if (!isKing(piece)) {
    if (player === "red") {
      bonus += (BOARD_SIZE - 1 - row) * PIECE_VALUES.ADVANCEMENT_BONUS;
    } else {
      bonus += row * PIECE_VALUES.ADVANCEMENT_BONUS;
    }
  }

  // Back row protection
  if (player === "red" && row === BOARD_SIZE - 1) bonus += PIECE_VALUES.BACK_ROW_BONUS;
  if (player === "black" && row === 0) bonus += PIECE_VALUES.BACK_ROW_BONUS;

  // For flying kings in Brazilian, being centrally located is even more valuable
  if (rules.flyingKings && isKing(piece)) {
    // Flying kings are more valuable in center where they have max range
    const centerDistance = Math.abs(row - 3.5) + Math.abs(col - 3.5);
    bonus += (7 - centerDistance) * 2; // Up to 14 bonus for center
  }

  return bonus;
}
