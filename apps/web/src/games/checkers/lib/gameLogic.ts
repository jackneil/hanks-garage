import {
  type PieceType,
  type Player,
  type Position,
  type Move,
  type GameStatus,
  BOARD_SIZE,
  getPlayerFromPiece,
  isKing,
  makeKing,
  getOpponent,
  isValidPosition,
  positionsEqual,
  copyBoard,
} from "./constants";

function getMoveDirections(piece: PieceType): [number, number][] {
  if (!piece) return [];
  if (isKing(piece)) {
    return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  }
  if (piece === "red") {
    return [[-1, -1], [-1, 1]];
  } else {
    return [[1, -1], [1, 1]];
  }
}

function getSimpleMoves(board: PieceType[][], row: number, col: number, piece: PieceType): Move[] {
  const moves: Move[] = [];
  const directions = getMoveDirections(piece);
  for (const [dRow, dCol] of directions) {
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
  return moves;
}

function getJumpMoves(board: PieceType[][], row: number, col: number, piece: PieceType): Move[] {
  const moves: Move[] = [];
  const directions = getMoveDirections(piece);
  const player = getPlayerFromPiece(piece);
  if (!player) return moves;

  for (const [dRow, dCol] of directions) {
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

      const continuationJumps = getJumpMoves(tempBoard, landRow, landCol, landingPiece);

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
  return moves;
}

export function playerHasCaptures(board: PieceType[][], player: Player): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && getPlayerFromPiece(piece) === player) {
        const jumps = getJumpMoves(board, row, col, piece);
        if (jumps.length > 0) return true;
      }
    }
  }
  return false;
}

export function getValidMovesForPiece(board: PieceType[][], row: number, col: number): Move[] {
  const piece = board[row][col];
  if (!piece) return [];
  const player = getPlayerFromPiece(piece);
  if (!player) return [];

  const hasCaptures = playerHasCaptures(board, player);
  if (hasCaptures) {
    return getJumpMoves(board, row, col, piece);
  } else {
    return getSimpleMoves(board, row, col, piece);
  }
}

export function getAllValidMoves(board: PieceType[][], player: Player): Move[] {
  const allMoves: Move[] = [];
  const hasCaptures = playerHasCaptures(board, player);

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && getPlayerFromPiece(piece) === player) {
        if (hasCaptures) {
          allMoves.push(...getJumpMoves(board, row, col, piece));
        } else {
          allMoves.push(...getSimpleMoves(board, row, col, piece));
        }
      }
    }
  }
  return allMoves;
}

export function shouldPromoteToKing(row: number, player: Player): boolean {
  if (player === "red" && row === 0) return true;
  if (player === "black" && row === BOARD_SIZE - 1) return true;
  return false;
}

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

export function checkGameStatus(board: PieceType[][], currentPlayer: Player): GameStatus {
  const pieces = countPieces(board);
  if (pieces.red === 0) return "black-wins";
  if (pieces.black === 0) return "red-wins";

  const validMoves = getAllValidMoves(board, currentPlayer);
  if (validMoves.length === 0) {
    return currentPlayer === "red" ? "black-wins" : "red-wins";
  }
  return "playing";
}

export function isMoveValid(board: PieceType[][], from: Position, to: Position, player: Player): Move | null {
  const piece = board[from.row][from.col];
  if (!piece || getPlayerFromPiece(piece) !== player) return null;
  const validMoves = getValidMovesForPiece(board, from.row, from.col);
  const matchingMove = validMoves.find(m => positionsEqual(m.to, to));
  return matchingMove || null;
}

export function getSelectablePieces(board: PieceType[][], player: Player): Position[] {
  const selectable: Position[] = [];
  const hasCaptures = playerHasCaptures(board, player);

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const piece = board[row][col];
      if (piece && getPlayerFromPiece(piece) === player) {
        if (hasCaptures) {
          const jumps = getJumpMoves(board, row, col, piece);
          if (jumps.length > 0) selectable.push({ row, col });
        } else {
          const moves = getSimpleMoves(board, row, col, piece);
          if (moves.length > 0) selectable.push({ row, col });
        }
      }
    }
  }
  return selectable;
}
