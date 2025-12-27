"use client";

import { useState } from "react";
import { type Difficulty, COLORS } from "../lib/constants";
import { countPieces } from "../lib/gameLogic";
import { useCheckersStore } from "../lib/store";

export function GameUI() {
  const board = useCheckersStore((s) => s.board);
  const currentPlayer = useCheckersStore((s) => s.currentPlayer);
  const status = useCheckersStore((s) => s.status);
  const difficulty = useCheckersStore((s) => s.difficulty);
  const isAIThinking = useCheckersStore((s) => s.isAIThinking);
  const progress = useCheckersStore((s) => s.progress);
  const newGame = useCheckersStore((s) => s.newGame);
  const setDifficulty = useCheckersStore((s) => s.setDifficulty);

  const pieces = countPieces(board);
  const [showStats, setShowStats] = useState(false);

  const getDifficultyColor = (d: Difficulty) => {
    switch (d) {
      case "easy": return "bg-green-500 hover:bg-green-600";
      case "medium": return "bg-yellow-500 hover:bg-yellow-600";
      case "hard": return "bg-red-500 hover:bg-red-600";
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Turn indicator */}
      <div className="flex items-center justify-center gap-4 py-3 px-4 bg-gray-800 rounded-lg">
        <div className={`flex items-center gap-2 px-3 py-1 rounded ${currentPlayer === "red" ? "bg-red-600" : "bg-gray-700"}`}>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.RED_PIECE }} />
          <span className="font-bold text-white">{pieces.red}</span>
        </div>
        
        <div className="text-white font-bold text-lg">
          {status === "playing" ? (
            isAIThinking ? "AI Thinking..." : currentPlayer === "red" ? "Your Turn!" : "..."
          ) : status === "red-wins" ? (
            "You Win!"
          ) : (
            "AI Wins!"
          )}
        </div>

        <div className={`flex items-center gap-2 px-3 py-1 rounded ${currentPlayer === "black" ? "bg-slate-600" : "bg-gray-700"}`}>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.BLACK_PIECE }} />
          <span className="font-bold text-white">{pieces.black}</span>
        </div>
      </div>

      {/* Difficulty selector */}
      <div className="flex gap-2 justify-center">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-4 py-2 rounded-lg font-bold text-white transition-colors ${
              difficulty === d ? getDifficultyColor(d) : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => newGame()}
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
            <div>Games Played: {progress.gamesPlayed}</div>
            <div>Games Won: {progress.gamesWon}</div>
            <div>Win Streak: {progress.currentWinStreak}</div>
            <div>Best Streak: {progress.bestWinStreak}</div>
            <div>Pieces Captured: {progress.totalPiecesCaptured}</div>
            <div>Kings Earned: {progress.totalKingsEarned}</div>
          </div>
        </div>
      )}

      {/* Win/Loss celebration */}
      {status !== "playing" && (
        <div className={`p-4 rounded-lg text-center text-white font-bold text-xl ${
          status === "red-wins" ? "bg-green-600" : "bg-red-600"
        }`}>
          {status === "red-wins" ? "Congratulations! You won!" : "Better luck next time!"}
          <button
            onClick={() => newGame()}
            className="block mx-auto mt-2 px-4 py-2 bg-white text-gray-800 rounded-lg"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
