import {
  type PieceType,
  type Player,
  type Move,
  type Difficulty,
  BOARD_SIZE,
  AI_CONFIG,
  PIECE_VALUES,
  getPlayerFromPiece,
  isKing,
  getOpponent,
} from "./constants";
import { getAllValidMoves, executeMove } from "./gameLogic";

export function getAIMove(board: PieceType[][], player: Player, difficulty: Difficulty): Move | null {
  const validMoves = getAllValidMoves(board, player);
  if (validMoves.length === 0) return null;
  switch (difficulty) {
    case "easy": return getRandomMove(validMoves);
    case "medium": return getBestMove(board, player, AI_CONFIG.MEDIUM_DEPTH);
    case "hard": return getBestMove(board, player, AI_CONFIG.HARD_DEPTH);
    default: return getRandomMove(validMoves);
  }
}

function getRandomMove(moves: Move[]): Move {
  return moves[Math.floor(Math.random() * moves.length)];
}

function getBestMove(board: PieceType[][], player: Player, maxDepth: number): Move | null {
  const validMoves = getAllValidMoves(board, player);
  if (validMoves.length === 0) return null;
  let bestMove = validMoves[0];
  let bestScore = -Infinity;
  for (const move of validMoves) {
    const newBoard = executeMove(board, move);
    const score = minimax(newBoard, maxDepth - 1, -Infinity, Infinity, false, player, getOpponent(player));
    if (score > bestScore) { bestScore = score; bestMove = move; }
  }
  return bestMove;
}

function minimax(board: PieceType[][], depth: number, alpha: number, beta: number, isMaximizing: boolean, aiPlayer: Player, currentPlayer: Player): number {
  if (depth === 0) return evaluateBoard(board, aiPlayer);
  const validMoves = getAllValidMoves(board, currentPlayer);
  if (validMoves.length === 0) return currentPlayer === aiPlayer ? -10000 : 10000;
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const newBoard = executeMove(board, move);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer, getOpponent(currentPlayer));
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const newBoard = executeMove(board, move);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer, getOpponent(currentPlayer));
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function evaluateBoard(board: PieceType[][], player: Player): number {
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
      score += getPositionBonus(row, col, piece, piecePlayer!) * multiplier;
    }
  }
  const playerMoves = getAllValidMoves(board, player).length;
  const opponentMoves = getAllValidMoves(board, opponent).length;
  score += (playerMoves - opponentMoves) * 2;
  return score;
}

function getPositionBonus(row: number, col: number, piece: PieceType, player: Player): number {
  let bonus = 0;
  if (col >= 2 && col <= 5) bonus += PIECE_VALUES.CENTER_BONUS;
  if (!isKing(piece)) {
    if (player === "red") bonus += (BOARD_SIZE - 1 - row) * PIECE_VALUES.ADVANCEMENT_BONUS;
    else bonus += row * PIECE_VALUES.ADVANCEMENT_BONUS;
  }
  if (player === "red" && row === BOARD_SIZE - 1) bonus += PIECE_VALUES.BACK_ROW_BONUS;
  if (player === "black" && row === 0) bonus += PIECE_VALUES.BACK_ROW_BONUS;
  return bonus;
}
