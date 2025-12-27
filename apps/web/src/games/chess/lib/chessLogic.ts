// Chess logic using chess.js library
import { Chess, Move, Square } from "chess.js";
import { PIECE_VALUES, AI_CONFIG, type Difficulty } from "./constants";

/**
 * Create a new chess game instance
 */
export function createGame(fen?: string): Chess {
  return fen ? new Chess(fen) : new Chess();
}

/**
 * Get all legal moves for a specific square
 */
export function getLegalMovesForSquare(game: Chess, square: Square): Move[] {
  return game.moves({ square, verbose: true });
}

/**
 * Check if a move is legal
 */
export function isLegalMove(game: Chess, from: Square, to: Square): boolean {
  const moves = game.moves({ square: from, verbose: true });
  return moves.some((m) => m.to === to);
}

/**
 * Make a move and return the result
 */
export function makeMove(
  game: Chess,
  from: Square,
  to: Square,
  promotion?: string
): Move | null {
  try {
    return game.move({ from, to, promotion: promotion || "q" });
  } catch {
    return null;
  }
}

/**
 * Evaluate the board position for AI
 * Positive = white advantage, Negative = black advantage
 */
export function evaluateBoard(game: Chess): number {
  const board = game.board();
  let score = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const value = PIECE_VALUES[piece.type] || 0;
        // Add positional bonus (center control)
        const centerBonus =
          (3.5 - Math.abs(col - 3.5)) * 0.1 +
          (3.5 - Math.abs(row - 3.5)) * 0.1;

        if (piece.color === "w") {
          score += value + centerBonus;
        } else {
          score -= value + centerBonus;
        }
      }
    }
  }

  // Bonus for mobility
  const currentTurn = game.turn();
  const mobility = game.moves().length * 0.05;
  score += currentTurn === "w" ? mobility : -mobility;

  return score;
}

/**
 * Minimax algorithm with alpha-beta pruning for AI
 */
function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    if (game.isCheckmate()) {
      return isMaximizing ? -Infinity : Infinity;
    }
    if (game.isDraw()) {
      return 0;
    }
    return evaluateBoard(game);
  }

  const moves = game.moves();

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Get the best move for AI based on difficulty
 */
export function getAIMove(game: Chess, difficulty: Difficulty): Move | null {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Determine depth based on difficulty
  let depth: number;
  switch (difficulty) {
    case "easy":
      depth = AI_CONFIG.EASY_DEPTH;
      break;
    case "medium":
      depth = AI_CONFIG.MEDIUM_DEPTH;
      break;
    case "hard":
      depth = AI_CONFIG.HARD_DEPTH;
      break;
    default:
      depth = 1;
  }

  // For easy mode, add randomness
  if (difficulty === "easy") {
    // 50% chance to make a random move
    if (Math.random() < 0.5) {
      return moves[Math.floor(Math.random() * moves.length)];
    }
  }

  // Find best move using minimax
  const isMaximizing = game.turn() === "w";
  let bestMove = moves[0];
  let bestValue = isMaximizing ? -Infinity : Infinity;

  for (const move of moves) {
    game.move(move);
    const value = minimax(
      game,
      depth - 1,
      -Infinity,
      Infinity,
      !isMaximizing
    );
    game.undo();

    if (isMaximizing) {
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    } else {
      if (value < bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }
  }

  // Add some randomness for medium difficulty
  if (difficulty === "medium" && Math.random() < 0.2) {
    // 20% chance to pick a suboptimal move
    const goodMoves = moves.filter((m) => {
      game.move(m);
      const val = evaluateBoard(game);
      game.undo();
      return isMaximizing ? val > bestValue - 2 : val < bestValue + 2;
    });
    if (goodMoves.length > 1) {
      return goodMoves[Math.floor(Math.random() * goodMoves.length)];
    }
  }

  return bestMove;
}

/**
 * Get captured pieces from the game history
 */
export function getCapturedPieces(game: Chess): { white: string[]; black: string[] } {
  const history = game.history({ verbose: true });
  const captured: { white: string[]; black: string[] } = {
    white: [], // Pieces captured BY white (black pieces)
    black: [], // Pieces captured BY black (white pieces)
  };

  for (const move of history) {
    if (move.captured) {
      if (move.color === "w") {
        captured.white.push(move.captured);
      } else {
        captured.black.push(move.captured);
      }
    }
  }

  return captured;
}

/**
 * Get the last move made
 */
export function getLastMove(game: Chess): { from: Square; to: Square } | null {
  const history = game.history({ verbose: true });
  if (history.length === 0) return null;
  const last = history[history.length - 1];
  return { from: last.from, to: last.to };
}

/**
 * Check if the current player's king is in check
 */
export function isInCheck(game: Chess): boolean {
  return game.isCheck();
}

/**
 * Get the square of the king that is in check
 */
export function getKingInCheckSquare(game: Chess): Square | null {
  if (!game.isCheck()) return null;
  const board = game.board();
  const currentTurn = game.turn();

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === "k" && piece.color === currentTurn) {
        const files = "abcdefgh";
        const ranks = "87654321";
        return `${files[col]}${ranks[row]}` as Square;
      }
    }
  }
  return null;
}
