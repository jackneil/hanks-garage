import {
  type PieceType,
  type Player,
  type Position,
  type Move,
  type GameStatus,
  type RuleSet,
  BOARD_SIZE,
  ALL_DIRECTIONS,
  getPlayerFromPiece,
  isKing,
  makeKing,
  getOpponent,
  isValidPosition,
  positionsEqual,
  copyBoard,
  getDefaultRuleSet,
} from "./constants";

// Get movement directions for a piece (forward-only for regular pieces)
function getMoveDirections(piece: PieceType): [number, number][] {
  if (!piece) return [];
  if (isKing(piece)) {
    return ALL_DIRECTIONS;
  }
  if (piece === "red") {
    return [[-1, -1], [-1, 1]]; // Red moves up
  } else {
    return [[1, -1], [1, 1]]; // Black moves down
  }
}

// Get capture directions - may include backward for Brazilian variant
function getCaptureDirections(piece: PieceType, rules: RuleSet): [number, number][] {
  if (!piece) return [];
  if (isKing(piece)) {
    return ALL_DIRECTIONS;
  }
  // Brazilian allows backward capture for regular pieces
  if (rules.backwardCapture) {
    return ALL_DIRECTIONS;
  }
  // Standard: forward only
  return getMoveDirections(piece);
}

// Get simple (non-capture) moves for a piece
function getSimpleMoves(
  board: PieceType[][],
  row: number,
  col: number,
  piece: PieceType,
  rules: RuleSet
): Move[] {
  const moves: Move[] = [];
  const directions = getMoveDirections(piece);
  const pieceIsKing = isKing(piece);

  for (const [dRow, dCol] of directions) {
    if (pieceIsKing && rules.flyingKings) {
      // Flying king: slide any distance until blocked
      let distance = 1;
      while (true) {
        const newRow = row + dRow * distance;
        const newCol = col + dCol * distance;
        if (!isValidPosition(newRow, newCol)) break;
        if (board[newRow][newCol] !== null) break; // blocked by any piece

        moves.push({
          from: { row, col },
          to: { row: newRow, col: newCol },
          captures: [],
          isJump: false,
        });
        distance++;
      }
    } else {
      // Normal 1-square move
      const newRow = row + dRow;
      const newCol = col + dCol;
      if (isValidPosition(newRow, newCol) && board[newRow][newCol] === null) {
        moves.push({
          from: { row, col },
          to: { row: newRow, col: newCol },
          captures: [],
          isJump: false,
        });
      }
    }
  }
  return moves;
}

// Get jump (capture) moves for a piece
function getJumpMoves(
  board: PieceType[][],
  row: number,
  col: number,
  piece: PieceType,
  rules: RuleSet
): Move[] {
  const moves: Move[] = [];
  const directions = getCaptureDirections(piece, rules);
  const player = getPlayerFromPiece(piece);
  if (!player) return moves;
  const pieceIsKing = isKing(piece);

  for (const [dRow, dCol] of directions) {
    if (pieceIsKing && rules.flyingKings) {
      // Flying king: scan for enemy, can land anywhere beyond
      let scanRow = row + dRow;
      let scanCol = col + dCol;
      let enemyPos: Position | null = null;

      // Find first piece in this direction
      while (isValidPosition(scanRow, scanCol)) {
        const scanPiece = board[scanRow][scanCol];
        if (scanPiece) {
          if (getPlayerFromPiece(scanPiece) === getOpponent(player)) {
            enemyPos = { row: scanRow, col: scanCol };
          }
          break; // Stop at any piece (friend or foe)
        }
        scanRow += dRow;
        scanCol += dCol;
      }

      if (enemyPos) {
        // Can land on any empty square beyond the enemy
        let landRow = enemyPos.row + dRow;
        let landCol = enemyPos.col + dCol;

        while (isValidPosition(landRow, landCol) && board[landRow][landCol] === null) {
          // For each landing square, check continuation jumps
          const tempBoard = copyBoard(board);
          tempBoard[row][col] = null;
          tempBoard[enemyPos.row][enemyPos.col] = null;

          let landingPiece = piece;
          if (shouldPromoteToKing(landRow, player)) {
            landingPiece = makeKing(piece);
          }
          tempBoard[landRow][landCol] = landingPiece;

          const continuations = getJumpMoves(tempBoard, landRow, landCol, landingPiece, rules);

          if (continuations.length > 0) {
            for (const cont of continuations) {
              moves.push({
                from: { row, col },
                to: cont.to,
                captures: [enemyPos, ...cont.captures],
                isJump: true,
              });
            }
          } else {
            moves.push({
              from: { row, col },
              to: { row: landRow, col: landCol },
              captures: [enemyPos],
              isJump: true,
            });
          }

          landRow += dRow;
          landCol += dCol;
        }
      }
    } else {
      // Normal 2-square jump
      const jumpRow = row + dRow;
      const jumpCol = col + dCol;
      const landRow = row + dRow * 2;
      const landCol = col + dCol * 2;

      if (!isValidPosition(landRow, landCol)) continue;

      const jumpedPiece = board[jumpRow]?.[jumpCol];
      const landSquare = board[landRow][landCol];

      if (jumpedPiece && getPlayerFromPiece(jumpedPiece) === getOpponent(player) && landSquare === null) {
        const capturedPosition = { row: jumpRow, col: jumpCol };
        const tempBoard = copyBoard(board);
        tempBoard[row][col] = null;
        tempBoard[jumpRow][jumpCol] = null;

        let landingPiece = piece;
        if (shouldPromoteToKing(landRow, player)) {
          landingPiece = makeKing(piece);
        }
        tempBoard[landRow][landCol] = landingPiece;

        const continuationJumps = getJumpMoves(tempBoard, landRow, landCol, landingPiece, rules);

        if (continuationJumps.length > 0) {
          for (const continuation of continuationJumps) {
            moves.push({
              from: { row, col },
              to: continuation.to,
              captures: [capturedPosition, ...continuation.captures],
              isJump: true,
            });
          }
        } else {
          moves.push({
            from: { row, col },
            to: { row: landRow, col: landCol },
            captures: [capturedPosition],
            isJump: true,
          });
        }
      }
    }
  }
  return moves;
}

// Check if player has any captures available
export function playerHasCaptures(
  board: PieceType[][],
  player: Player,
  rules: RuleSet = getDefaultRuleSet()
): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && getPlayerFromPiece(piece) === player) {
        const jumps = getJumpMoves(board, row, col, piece, rules);
        if (jumps.length > 0) return true;
      }
    }
  }
  return false;
}

// Get valid moves for a specific piece
export function getValidMovesForPiece(
  board: PieceType[][],
  row: number,
  col: number,
  rules: RuleSet = getDefaultRuleSet()
): Move[] {
  const piece = board[row][col];
  if (!piece) return [];
  const player = getPlayerFromPiece(piece);
  if (!player) return [];

  const hasCaptures = playerHasCaptures(board, player, rules);

  if (rules.forcedCaptures && hasCaptures) {
    // Must take jumps if available
    return getJumpMoves(board, row, col, piece, rules);
  } else if (!rules.forcedCaptures) {
    // Casual mode: can choose either jumps or simple moves
    const jumps = getJumpMoves(board, row, col, piece, rules);
    const simple = getSimpleMoves(board, row, col, piece, rules);
    return [...jumps, ...simple];
  } else {
    // No captures available, return simple moves
    return getSimpleMoves(board, row, col, piece, rules);
  }
}

// Get all valid moves for a player
export function getAllValidMoves(
  board: PieceType[][],
  player: Player,
  rules: RuleSet = getDefaultRuleSet()
): Move[] {
  let allMoves: Move[] = [];
  const hasCaptures = playerHasCaptures(board, player, rules);

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && getPlayerFromPiece(piece) === player) {
        if (rules.forcedCaptures && hasCaptures) {
          allMoves.push(...getJumpMoves(board, row, col, piece, rules));
        } else if (!rules.forcedCaptures) {
          // Casual: can choose jumps or simple moves
          allMoves.push(...getJumpMoves(board, row, col, piece, rules));
          allMoves.push(...getSimpleMoves(board, row, col, piece, rules));
        } else {
          allMoves.push(...getSimpleMoves(board, row, col, piece, rules));
        }
      }
    }
  }

  // Apply majority rule: only keep moves with maximum captures
  if (rules.majorityRule && hasCaptures) {
    const maxCaptures = Math.max(...allMoves.map((m) => m.captures.length), 0);
    if (maxCaptures > 0) {
      allMoves = allMoves.filter((m) => m.captures.length === maxCaptures);
    }
  }

  return allMoves;
}

// Check if piece should be promoted to king
export function shouldPromoteToKing(row: number, player: Player): boolean {
  if (player === "red" && row === 0) return true;
  if (player === "black" && row === BOARD_SIZE - 1) return true;
  return false;
}

// Execute a move and return new board state
export function executeMove(board: PieceType[][], move: Move): PieceType[][] {
  const newBoard = copyBoard(board);
  const piece = newBoard[move.from.row][move.from.col];
  if (!piece) return newBoard;

  newBoard[move.from.row][move.from.col] = null;
  for (const captured of move.captures) {
    newBoard[captured.row][captured.col] = null;
  }

  const player = getPlayerFromPiece(piece);
  let finalPiece: PieceType = piece;
  if (player && shouldPromoteToKing(move.to.row, player)) {
    finalPiece = makeKing(piece);
  }
  newBoard[move.to.row][move.to.col] = finalPiece;
  return newBoard;
}

// Count pieces on the board
export function countPieces(board: PieceType[][]): { red: number; black: number } {
  let red = 0;
  let black = 0;
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece) {
        if (getPlayerFromPiece(piece) === "red") red++;
        else black++;
      }
    }
  }
  return { red, black };
}

// Count kings on the board
export function countKings(board: PieceType[][]): { red: number; black: number } {
  let red = 0;
  let black = 0;
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece === "red-king") red++;
      if (piece === "black-king") black++;
    }
  }
  return { red, black };
}

// Check game status (playing, red-wins, black-wins)
export function checkGameStatus(
  board: PieceType[][],
  currentPlayer: Player,
  rules: RuleSet = getDefaultRuleSet()
): GameStatus {
  const pieces = countPieces(board);

  if (rules.invertedWinCondition) {
    // SUICIDE MODE: losing all pieces = WIN!
    if (pieces.red === 0) return "red-wins";
    if (pieces.black === 0) return "black-wins";

    // Having no valid moves = WIN (you "lose" your turn, which is good in suicide)
    const validMoves = getAllValidMoves(board, currentPlayer, rules);
    if (validMoves.length === 0) {
      return currentPlayer === "red" ? "red-wins" : "black-wins";
    }
  } else {
    // NORMAL: losing all pieces = LOSS
    if (pieces.red === 0) return "black-wins";
    if (pieces.black === 0) return "red-wins";

    const validMoves = getAllValidMoves(board, currentPlayer, rules);
    if (validMoves.length === 0) {
      return currentPlayer === "red" ? "black-wins" : "red-wins";
    }
  }
  return "playing";
}

// Check if a move is valid
export function isMoveValid(
  board: PieceType[][],
  from: Position,
  to: Position,
  player: Player,
  rules: RuleSet = getDefaultRuleSet()
): Move | null {
  const piece = board[from.row][from.col];
  if (!piece || getPlayerFromPiece(piece) !== player) return null;
  const validMoves = getValidMovesForPiece(board, from.row, from.col, rules);
  const matchingMove = validMoves.find((m) => positionsEqual(m.to, to));
  return matchingMove || null;
}

// Get pieces that can be selected (have valid moves)
export function getSelectablePieces(
  board: PieceType[][],
  player: Player,
  rules: RuleSet = getDefaultRuleSet()
): Position[] {
  const selectable: Position[] = [];
  const hasCaptures = playerHasCaptures(board, player, rules);

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && getPlayerFromPiece(piece) === player) {
        if (rules.forcedCaptures && hasCaptures) {
          const jumps = getJumpMoves(board, row, col, piece, rules);
          if (jumps.length > 0) {
            // Apply majority rule filtering
            if (rules.majorityRule) {
              const allJumps = getAllValidMoves(board, player, rules);
              const maxCaptures = Math.max(...allJumps.map((m) => m.captures.length), 0);
              const hasMaxCapture = jumps.some((j) => j.captures.length === maxCaptures);
              if (hasMaxCapture) selectable.push({ row, col });
            } else {
              selectable.push({ row, col });
            }
          }
        } else if (!rules.forcedCaptures) {
          // Casual: any piece with any move
          const moves = [
            ...getJumpMoves(board, row, col, piece, rules),
            ...getSimpleMoves(board, row, col, piece, rules),
          ];
          if (moves.length > 0) selectable.push({ row, col });
        } else {
          const moves = getSimpleMoves(board, row, col, piece, rules);
          if (moves.length > 0) selectable.push({ row, col });
        }
      }
    }
  }
  return selectable;
}
