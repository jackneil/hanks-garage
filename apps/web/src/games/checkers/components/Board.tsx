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
  const selectPiece = useCheckersStore((s) => s.selectPiece);
  const makeMove = useCheckersStore((s) => s.makeMove);

  const isPlaying = status === "playing";
  const isPlayerTurn = currentPlayer === "red" && !isAIThinking;

  const selectablePieces = isPlaying && isPlayerTurn ? getSelectablePieces(board, "red") : [];

  const handleSquareClick = (row: number, col: number) => {
    if (!isPlaying || !isPlayerTurn) return;

    const pos: Position = { row, col };
    const piece = board[row][col];

    // If clicking on valid move destination
    if (validMoves.some(m => positionsEqual(m.to, pos))) {
      makeMove(pos);
      return;
    }

    // If clicking on own piece
    if (piece && piece.startsWith("red")) {
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
            const isValidMove = validMoves.some(m => positionsEqual(m.to, pos));
            const isSelectable = selectablePieces.some(p => positionsEqual(p, pos));

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
                {piece && (
                  <Piece
                    piece={piece}
                    isSelected={isSelected}
                    isSelectable={isSelectable}
                  />
                )}
              </Square>
            );
          })
        )}
      </div>
    </div>
  );
}
