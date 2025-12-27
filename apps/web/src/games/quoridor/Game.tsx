"use client";

import { useState } from "react";
import { useQuoridorStore } from "./lib/store";
import { useAuthSync } from "@/shared/hooks/useAuthSync";
import {
  type Position,
  type Wall,
  type WallOrientation,
  type Difficulty,
  type GameMode,
  BOARD_SIZE,
  COLORS,
  positionsEqual,
  getPlayerColor,
} from "./lib/constants";
import { isValidWallPlacement } from "./lib/quoridorLogic";

export function QuoridorGame() {
  const store = useQuoridorStore();
  const [showStats, setShowStats] = useState(false);

  // Sync with auth system
  const { isAuthenticated, syncStatus } = useAuthSync({
    appId: "quoridor",
    localStorageKey: "quoridor-progress",
    getState: () => store.getProgress(),
    setState: (data) => store.setProgress(data),
    debounceMs: 2000,
  });

  const handleSquareClick = (row: number, col: number) => {
    const pos: Position = { row, col };

    // If pawn is selected and this is a valid move, make the move
    if (store.selectedPawn && store.validMoves.some((m) => positionsEqual(m, pos))) {
      store.movePawn(pos);
      return;
    }

    // If clicking on current player's pawn, select it
    const currentPlayerPos = store.positions[store.currentPlayer];
    if (positionsEqual(currentPlayerPos, pos)) {
      store.selectPawn();
      return;
    }

    // If in wall mode, try to place wall at this position
    if (store.wallMode) {
      const wall: Wall = {
        row: store.wallOrientation === "horizontal" ? row : row,
        col: store.wallOrientation === "vertical" ? col : col,
        orientation: store.wallOrientation,
      };
      if (
        isValidWallPlacement(store.getLogicState(), wall, store.currentPlayer)
      ) {
        store.placeWall(wall);
      }
    }
  };

  const handleGrooveClick = (
    row: number,
    col: number,
    orientation: WallOrientation
  ) => {
    if (!store.wallMode) return;

    const wall: Wall = { row, col, orientation };
    if (isValidWallPlacement(store.getLogicState(), wall, store.currentPlayer)) {
      store.placeWall(wall);
    }
  };

  const handleGrooveHover = (
    row: number,
    col: number,
    orientation: WallOrientation
  ) => {
    if (!store.wallMode) return;

    const wall: Wall = { row, col, orientation };
    const isValid = isValidWallPlacement(
      store.getLogicState(),
      wall,
      store.currentPlayer
    );
    store.setWallPreview(isValid ? wall : null);
  };

  const renderSquare = (row: number, col: number) => {
    const pos: Position = { row, col };
    const isPlayer1 = positionsEqual(store.positions[1], pos);
    const isPlayer2 = positionsEqual(store.positions[2], pos);
    const isValidMove = store.validMoves.some((m) => positionsEqual(m, pos));
    const isCurrentPlayerPawn =
      positionsEqual(store.positions[store.currentPlayer], pos) &&
      store.status === "playing";

    return (
      <div
        key={`square-${row}-${col}`}
        className={`
          relative flex items-center justify-center
          transition-all duration-150
          ${isValidMove ? "cursor-pointer ring-4 ring-green-400 ring-inset" : ""}
          ${isCurrentPlayerPawn && !store.isAIThinking ? "cursor-pointer" : ""}
        `}
        style={{
          backgroundColor: COLORS.BOARD_LIGHT,
          aspectRatio: "1",
        }}
        onClick={() => handleSquareClick(row, col)}
      >
        {/* Valid move indicator */}
        {isValidMove && !isPlayer1 && !isPlayer2 && (
          <div className="absolute w-1/3 h-1/3 rounded-full bg-green-500 opacity-60 animate-pulse" />
        )}

        {/* Player 1 pawn */}
        {isPlayer1 && (
          <div
            className={`
              w-3/4 h-3/4 rounded-full shadow-lg
              ${store.selectedPawn && store.currentPlayer === 1 ? "ring-4 ring-yellow-400" : ""}
              transition-all duration-200
            `}
            style={{ backgroundColor: COLORS.PLAYER1 }}
          />
        )}

        {/* Player 2 pawn */}
        {isPlayer2 && (
          <div
            className={`
              w-3/4 h-3/4 rounded-full shadow-lg
              ${store.selectedPawn && store.currentPlayer === 2 ? "ring-4 ring-yellow-400" : ""}
              transition-all duration-200
            `}
            style={{ backgroundColor: COLORS.PLAYER2 }}
          />
        )}
      </div>
    );
  };

  const renderHorizontalGroove = (row: number, col: number) => {
    // Horizontal walls block between row-1 and row (placed at row 1-8)
    const hasWall = store.walls.some(
      (w) => w.orientation === "horizontal" && w.row === row && w.col === col
    );
    const hasWallLeft = store.walls.some(
      (w) => w.orientation === "horizontal" && w.row === row && w.col === col - 1
    );
    const isPreview =
      store.wallPreview?.orientation === "horizontal" &&
      store.wallPreview?.row === row &&
      (store.wallPreview?.col === col || store.wallPreview?.col === col - 1);

    return (
      <div
        key={`hgroove-${row}-${col}`}
        className={`
          ${store.wallMode ? "cursor-pointer hover:bg-amber-600" : ""}
          transition-all duration-150
        `}
        style={{
          backgroundColor: hasWall || hasWallLeft
            ? COLORS.WALL
            : isPreview
            ? COLORS.WALL_PREVIEW
            : COLORS.GROOVE,
          height: "8px",
        }}
        onClick={() => handleGrooveClick(row, col, "horizontal")}
        onMouseEnter={() => handleGrooveHover(row, col, "horizontal")}
        onMouseLeave={() => store.setWallPreview(null)}
      />
    );
  };

  const renderVerticalGroove = (row: number, col: number) => {
    // Vertical walls block between col-1 and col (placed at col 1-8)
    const hasWall = store.walls.some(
      (w) => w.orientation === "vertical" && w.col === col && w.row === row
    );
    const hasWallAbove = store.walls.some(
      (w) => w.orientation === "vertical" && w.col === col && w.row === row - 1
    );
    const isPreview =
      store.wallPreview?.orientation === "vertical" &&
      store.wallPreview?.col === col &&
      (store.wallPreview?.row === row || store.wallPreview?.row === row - 1);

    return (
      <div
        key={`vgroove-${row}-${col}`}
        className={`
          ${store.wallMode ? "cursor-pointer hover:bg-amber-600" : ""}
          transition-all duration-150
        `}
        style={{
          backgroundColor: hasWall || hasWallAbove
            ? COLORS.WALL
            : isPreview
            ? COLORS.WALL_PREVIEW
            : COLORS.GROOVE,
          width: "8px",
        }}
        onClick={() => handleGrooveClick(row, col, "vertical")}
        onMouseEnter={() => handleGrooveHover(row, col, "vertical")}
        onMouseLeave={() => store.setWallPreview(null)}
      />
    );
  };

  const renderIntersection = (row: number, col: number) => {
    return (
      <div
        key={`intersection-${row}-${col}`}
        style={{
          backgroundColor: COLORS.GROOVE,
          width: "8px",
          height: "8px",
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-800 to-amber-950 p-4 flex flex-col items-center justify-center gap-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Quoridor</h1>
        <p className="text-amber-200">Block your opponent, reach the other side!</p>
      </header>

      {/* Turn indicator */}
      <div className="flex items-center justify-center gap-4 py-3 px-6 bg-gray-800 rounded-lg">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded ${
            store.currentPlayer === 1 ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: COLORS.PLAYER1 }}
          />
          <span className="font-bold text-white">
            P1: {store.wallsRemaining[1]}
          </span>
        </div>

        <div className="text-white font-bold text-lg">
          {store.status === "playing" ? (
            store.isAIThinking ? (
              "AI Thinking..."
            ) : store.gameMode === "local" ? (
              `Player ${store.currentPlayer}'s Turn`
            ) : store.currentPlayer === 1 ? (
              "Your Turn!"
            ) : (
              "..."
            )
          ) : store.status === "player1-wins" ? (
            store.gameMode === "ai" ? "You Win!" : "Player 1 Wins!"
          ) : (
            store.gameMode === "ai" ? "AI Wins!" : "Player 2 Wins!"
          )}
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-1 rounded ${
            store.currentPlayer === 2 ? "bg-orange-600" : "bg-gray-700"
          }`}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: COLORS.PLAYER2 }}
          />
          <span className="font-bold text-white">
            {store.gameMode === "ai" ? "AI" : "P2"}: {store.wallsRemaining[2]}
          </span>
        </div>
      </div>

      {/* Board */}
      <div
        className="bg-amber-900 p-2 rounded-lg shadow-2xl"
        style={{ maxWidth: "min(90vw, 500px)" }}
      >
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE * 2 - 1}, 1fr)`,
            gridTemplateRows: `repeat(${BOARD_SIZE * 2 - 1}, 1fr)`,
          }}
        >
          {/* Render board from top (row 8) to bottom (row 0) */}
          {Array.from({ length: BOARD_SIZE * 2 - 1 }).map((_, gridRow) => {
            const boardRow = BOARD_SIZE - 1 - Math.floor(gridRow / 2);
            const isSquareRow = gridRow % 2 === 0;

            return Array.from({ length: BOARD_SIZE * 2 - 1 }).map(
              (_, gridCol) => {
                const boardCol = Math.floor(gridCol / 2);
                const isSquareCol = gridCol % 2 === 0;

                if (isSquareRow && isSquareCol) {
                  // Square
                  return renderSquare(boardRow, boardCol);
                } else if (!isSquareRow && isSquareCol) {
                  // Horizontal groove (between rows)
                  return renderHorizontalGroove(boardRow + 1, boardCol);
                } else if (isSquareRow && !isSquareCol) {
                  // Vertical groove (between columns)
                  return renderVerticalGroove(boardRow, boardCol + 1);
                } else {
                  // Intersection
                  return renderIntersection(boardRow + 1, boardCol + 1);
                }
              }
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 w-full max-w-lg">
        {/* Mode buttons */}
        {store.status === "playing" && !store.isAIThinking && (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => store.selectPawn()}
              className={`px-6 py-3 font-bold rounded-lg transition-colors ${
                store.selectedPawn
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 hover:bg-gray-500 text-white"
              }`}
            >
              Move Pawn
            </button>
            <button
              onClick={() =>
                store.wallMode ? store.exitWallMode() : store.enterWallMode()
              }
              disabled={store.wallsRemaining[store.currentPlayer] <= 0}
              className={`px-6 py-3 font-bold rounded-lg transition-colors ${
                store.wallMode
                  ? "bg-amber-600 text-white"
                  : store.wallsRemaining[store.currentPlayer] > 0
                  ? "bg-gray-600 hover:bg-gray-500 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Place Wall
            </button>
            {store.wallMode && (
              <button
                onClick={() => store.toggleWallOrientation()}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors"
              >
                {store.wallOrientation === "horizontal" ? "Horiz" : "Vert"}
              </button>
            )}
          </div>
        )}

        {/* Game mode selector */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => store.setGameMode("local")}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              store.gameMode === "local"
                ? "bg-green-500 text-white"
                : "bg-gray-600 hover:bg-gray-500 text-white"
            }`}
          >
            2 Players
          </button>
          <button
            onClick={() => store.setGameMode("ai")}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              store.gameMode === "ai"
                ? "bg-green-500 text-white"
                : "bg-gray-600 hover:bg-gray-500 text-white"
            }`}
          >
            vs AI
          </button>
        </div>

        {/* Difficulty selector (only for AI mode) */}
        {store.gameMode === "ai" && (
          <div className="flex gap-2 justify-center">
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => store.setDifficulty(d)}
                className={`px-4 py-2 rounded-lg font-bold text-white transition-colors ${
                  store.difficulty === d
                    ? d === "easy"
                      ? "bg-green-500"
                      : d === "medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => store.newGame()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            New Game
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
          >
            Stats
          </button>
        </div>

        {/* Stats panel */}
        {showStats && (
          <div className="p-4 bg-gray-800 rounded-lg text-white">
            <h3 className="text-lg font-bold mb-2">Your Stats</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Games Played: {store.progress.gamesPlayed}</div>
              <div>Games Won: {store.progress.gamesWon}</div>
              <div>Win Streak: {store.progress.currentWinStreak}</div>
              <div>Best Streak: {store.progress.bestWinStreak}</div>
              <div>Total Walls Placed: {store.progress.totalWallsPlaced}</div>
              <div>
                Fastest Win:{" "}
                {store.progress.fastestWin !== null
                  ? `${store.progress.fastestWin} moves`
                  : "N/A"}
              </div>
            </div>
          </div>
        )}

        {/* Win/Loss celebration */}
        {store.status !== "playing" && (
          <div
            className={`p-4 rounded-lg text-center text-white font-bold text-xl ${
              store.status === "player1-wins"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {store.status === "player1-wins"
              ? store.gameMode === "ai"
                ? "Congratulations! You won!"
                : "Player 1 wins!"
              : store.gameMode === "ai"
              ? "AI wins! Try again?"
              : "Player 2 wins!"}
            <button
              onClick={() => store.newGame()}
              className="block mx-auto mt-2 px-4 py-2 bg-white text-gray-800 rounded-lg"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Sync status indicator */}
      {isAuthenticated && (
        <div className="fixed bottom-2 right-2 text-xs text-amber-300/60">
          {syncStatus === "syncing"
            ? "Saving..."
            : syncStatus === "synced"
            ? "Saved"
            : ""}
        </div>
      )}
    </div>
  );
}

export default QuoridorGame;
