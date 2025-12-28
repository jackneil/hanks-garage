import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type PieceType,
  type Player,
  type Position,
  type Move,
  type Difficulty,
  type GameStatus,
  BOARD_SIZE,
  createInitialBoard,
  getOpponent,
  positionsEqual,
} from "./constants";
import { getValidMovesForPiece, executeMove, checkGameStatus, countPieces, countKings, getSelectablePieces } from "./gameLogic";
import { getAIMove } from "./ai";

export type CheckersProgress = {
  [key: string]: unknown;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalPiecesCaptured: number;
  totalKingsEarned: number;
  longestJumpChain: number;
  currentWinStreak: number;
  bestWinStreak: number;
  easyWins: number;
  easyLosses: number;
  mediumWins: number;
  mediumLosses: number;
  hardWins: number;
  hardLosses: number;
  // Settings (synced to cloud)
  difficulty: Difficulty;
  lastModified: number;
};

export type GameState = {
  board: PieceType[][];
  currentPlayer: Player;
  selectedPiece: Position | null;
  validMoves: Move[];
  lastMove: Move | null;
  status: GameStatus;
  difficulty: Difficulty;
  isAIThinking: boolean;
  piecesCapturedThisGame: number;
  kingsEarnedThisGame: number;
  longestChainThisGame: number;
  progress: CheckersProgress;
};

type GameActions = {
  selectPiece: (pos: Position) => void;
  makeMove: (to: Position) => void;
  newGame: (difficulty?: Difficulty) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  triggerAIMove: () => void;
  recordWin: () => void;
  recordLoss: () => void;
  getProgress: () => CheckersProgress;
  setProgress: (data: CheckersProgress) => void;
};

const defaultProgress: CheckersProgress = {
  gamesPlayed: 0, gamesWon: 0, gamesLost: 0, totalPiecesCaptured: 0, totalKingsEarned: 0,
  longestJumpChain: 0, currentWinStreak: 0, bestWinStreak: 0,
  easyWins: 0, easyLosses: 0, mediumWins: 0, mediumLosses: 0, hardWins: 0, hardLosses: 0,
  difficulty: "easy",
  lastModified: Date.now(),
};

export const useCheckersStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      board: createInitialBoard(),
      currentPlayer: "red",
      selectedPiece: null,
      validMoves: [],
      lastMove: null,
      status: "playing",
      difficulty: "easy",
      isAIThinking: false,
      piecesCapturedThisGame: 0,
      kingsEarnedThisGame: 0,
      longestChainThisGame: 0,
      progress: defaultProgress,

      selectPiece: (pos) => {
        const state = get();
        if (state.status !== "playing" || state.currentPlayer !== "red" || state.isAIThinking) return;
        const piece = state.board[pos.row][pos.col];
        if (!piece || !piece.startsWith("red")) return;
        const selectables = getSelectablePieces(state.board, "red");
        if (!selectables.some(p => positionsEqual(p, pos))) return;
        const moves = getValidMovesForPiece(state.board, pos.row, pos.col);
        set({ selectedPiece: pos, validMoves: moves });
      },

      makeMove: (to) => {
        const state = get();
        if (!state.selectedPiece || state.status !== "playing") return;
        const move = state.validMoves.find(m => positionsEqual(m.to, to));
        if (!move) return;

        const newBoard = executeMove(state.board, move);
        const capturesCount = move.captures.length;
        const newCaptured = state.piecesCapturedThisGame + capturesCount;
        const newLongestChain = Math.max(state.longestChainThisGame, capturesCount);

        let newKingsEarned = state.kingsEarnedThisGame;
        const landedPiece = newBoard[move.to.row][move.to.col];
        const originalPiece = state.board[move.from.row][move.from.col];
        if (landedPiece && landedPiece.includes("king") && originalPiece && !originalPiece.includes("king")) {
          newKingsEarned++;
        }

        const newStatus = checkGameStatus(newBoard, "black");
        set({
          board: newBoard,
          currentPlayer: "black",
          selectedPiece: null,
          validMoves: [],
          lastMove: move,
          status: newStatus,
          piecesCapturedThisGame: newCaptured,
          kingsEarnedThisGame: newKingsEarned,
          longestChainThisGame: newLongestChain,
        });

        if (newStatus === "red-wins") {
          get().recordWin();
        } else if (newStatus === "playing") {
          setTimeout(() => get().triggerAIMove(), 500);
        }
      },

      triggerAIMove: () => {
        const state = get();
        if (state.status !== "playing" || state.currentPlayer !== "black") return;
        set({ isAIThinking: true });

        setTimeout(() => {
          const currentState = get();
          const aiMove = getAIMove(currentState.board, "black", currentState.difficulty);
          if (!aiMove) {
            set({ status: "red-wins", isAIThinking: false });
            get().recordWin();
            return;
          }

          const newBoard = executeMove(currentState.board, aiMove);
          const newStatus = checkGameStatus(newBoard, "red");

          set({
            board: newBoard,
            currentPlayer: "red",
            lastMove: aiMove,
            status: newStatus,
            isAIThinking: false,
          });

          if (newStatus === "black-wins") {
            get().recordLoss();
          }
        }, 300);
      },

      newGame: (difficulty) => {
        set({
          board: createInitialBoard(),
          currentPlayer: "red",
          selectedPiece: null,
          validMoves: [],
          lastMove: null,
          status: "playing",
          difficulty: difficulty ?? get().difficulty,
          isAIThinking: false,
          piecesCapturedThisGame: 0,
          kingsEarnedThisGame: 0,
          longestChainThisGame: 0,
        });
      },

      setDifficulty: (difficulty) => set({ difficulty }),

      recordWin: () => {
        set((state) => {
          const diff = state.difficulty;
          const newStreak = state.progress.currentWinStreak + 1;
          const diffKey = `${diff}Wins` as keyof CheckersProgress;
          return {
            progress: {
              ...state.progress,
              gamesPlayed: state.progress.gamesPlayed + 1,
              gamesWon: state.progress.gamesWon + 1,
              totalPiecesCaptured: state.progress.totalPiecesCaptured + state.piecesCapturedThisGame,
              totalKingsEarned: state.progress.totalKingsEarned + state.kingsEarnedThisGame,
              longestJumpChain: Math.max(state.progress.longestJumpChain, state.longestChainThisGame),
              currentWinStreak: newStreak,
              bestWinStreak: Math.max(state.progress.bestWinStreak, newStreak),
              [diffKey]: (state.progress[diffKey] as number) + 1,
              lastModified: Date.now(),
            },
          };
        });
      },

      recordLoss: () => {
        set((state) => {
          const diff = state.difficulty;
          const diffKey = `${diff}Losses` as keyof CheckersProgress;
          return {
            progress: {
              ...state.progress,
              gamesPlayed: state.progress.gamesPlayed + 1,
              gamesLost: state.progress.gamesLost + 1,
              totalPiecesCaptured: state.progress.totalPiecesCaptured + state.piecesCapturedThisGame,
              totalKingsEarned: state.progress.totalKingsEarned + state.kingsEarnedThisGame,
              longestJumpChain: Math.max(state.progress.longestJumpChain, state.longestChainThisGame),
              currentWinStreak: 0,
              [diffKey]: (state.progress[diffKey] as number) + 1,
              lastModified: Date.now(),
            },
          };
        });
      },

      getProgress: () => ({
        ...get().progress,
        difficulty: get().difficulty,
      }),
      setProgress: (data) => set({
        progress: data,
        difficulty: data.difficulty ?? get().difficulty,
      }),
    }),
    {
      name: "checkers-progress",
      partialize: (state) => ({ progress: state.progress, difficulty: state.difficulty }),
    }
  )
);
