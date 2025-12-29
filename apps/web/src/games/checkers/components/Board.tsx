"use client";

import { BOARD_SIZE, type Position, positionsEqual } from "../lib/constants";
import { getSelectablePieces } from "../lib/gameLogic";
import { useCheckersStore } from "../lib/store";
import { Square } from "./Square";
import { Piece } from "./Piece";

export function Board() {
  const board = useCheckersStore((s) => s.board);
  const currentPlayer = useCheckersStore((s) => s.currentPlayer);
  const selectedPiece = useCheckersStore((s) => s.selectedPiece);
  const validMoves = useCheckersStore((s) => s.validMoves);
  const lastMove = useCheckersStore((s) => s.lastMove);
  const status = useCheckersStore((s) => s.status);
  const isAIThinking = useCheckersStore((s) => s.isAIThinking);
  const gameMode = useCheckersStore((s) => s.gameMode);
  const rules = useCheckersStore((s) => s.rules);
  const selectPiece = useCheckersStore((s) => s.selectPiece);
  const makeMove = useCheckersStore((s) => s.makeMove);

  const isPlaying = status === "playing";

  // In AI mode: only red (human) can play when it's their turn
  // In 2-player mode: current player can always play (unless AI thinking, which shouldn't happen)
  const isPlayerTurn =
    gameMode === "vs-friend"
      ? !isAIThinking
      : currentPlayer === "red" && !isAIThinking;

  // Get selectable pieces for current player using rules
  const selectablePieces =
    isPlaying && isPlayerTurn ? getSelectablePieces(board, currentPlayer, rules) : [];

  const handleSquareClick = (row: number, col: number) => {
    if (!isPlaying || !isPlayerTurn) return;

    const pos: Position = { row, col };
    const piece = board[row][col];

    // If clicking on valid move destination
    if (validMoves.some((m) => positionsEqual(m.to, pos))) {
      makeMove(pos);
      return;
    }

    // If clicking on current player's piece (not hardcoded to "red" anymore)
    if (piece && piece.startsWith(currentPlayer)) {
      selectPiece(pos);
    }
  };

  const isLastMoveSquare = (row: number, col: number): boolean => {
    if (!lastMove) return false;
    return positionsEqual(lastMove.from, { row, col }) || positionsEqual(lastMove.to, { row, col });
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        className="grid border-4 border-amber-900 rounded-lg overflow-hidden shadow-2xl"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
      >
        {Array.from({ length: BOARD_SIZE }).map((_, row) =>
          Array.from({ length: BOARD_SIZE }).map((_, col) => {
            const piece = board[row][col];
            const pos: Position = { row, col };
            const isSelected = selectedPiece ? positionsEqual(selectedPiece, pos) : false;
            const isValidMove = validMoves.some((m) => positionsEqual(m.to, pos));
            const isSelectable = selectablePieces.some((p) => positionsEqual(p, pos));

            return (
              <Square
                key={`${row}-${col}`}
                row={row}
                col={col}
                piece={piece}
                isSelected={isSelected}
                isValidMove={isValidMove}
                isLastMove={isLastMoveSquare(row, col)}
                isSelectable={isSelectable}
                onClick={() => handleSquareClick(row, col)}
              >
                {piece && <Piece piece={piece} isSelected={isSelected} isSelectable={isSelectable} />}
              </Square>
            );
          })
        )}
      </div>
    </div>
  );
}
