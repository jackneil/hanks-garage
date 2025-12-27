"use client";

import { type PieceType, COLORS, isDarkSquare } from "../lib/constants";

type SquareProps = {
  row: number;
  col: number;
  piece: PieceType;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMove: boolean;
  isSelectable: boolean;
  onClick: () => void;
  children?: React.ReactNode;
};

export function Square({
  row,
  col,
  isSelected,
  isValidMove,
  isLastMove,
  isSelectable,
  onClick,
  children,
}: SquareProps) {
  const isDark = isDarkSquare(row, col);
  const baseColor = isDark ? COLORS.DARK_SQUARE : COLORS.LIGHT_SQUARE;

  let bgColor: string = baseColor;
  let ringStyle = "";

  if (isSelected) {
    bgColor = COLORS.SELECTED;
  } else if (isValidMove) {
    ringStyle = "ring-4 ring-green-400 ring-inset";
  } else if (isLastMove) {
    bgColor = COLORS.LAST_MOVE;
  }

  const cursorStyle = isSelectable || isValidMove ? "cursor-pointer" : "cursor-default";
  const hoverStyle = isSelectable ? "hover:brightness-110" : "";

  return (
    <div
      className={`relative aspect-square flex items-center justify-center transition-all duration-150 ${cursorStyle} ${hoverStyle} ${ringStyle}`}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      {isValidMove && !children && (
        <div className="w-1/3 h-1/3 rounded-full bg-green-500 opacity-60 animate-pulse" />
      )}
      {children}
    </div>
  );
}
