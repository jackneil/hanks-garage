import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type PieceType,
  type Player,
  type Position,
  type Move,
  type Difficulty,
  type GameStatus,
  type GameVariant,
  type GameMode,
  type RuleSet,
  BOARD_SIZE,
  RULE_SETS,
  createInitialBoard,
  getOpponent,
  positionsEqual,
  getDefaultRuleSet,
} from "./constants";
import {
  getValidMovesForPiece,
  executeMove,
  checkGameStatus,
  countPieces,
  getSelectablePieces,
  getAllValidMoves,
} from "./gameLogic";
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
  // 2-player stats
  twoPlayerGamesPlayed: number;
  twoPlayerRedWins: number;
  twoPlayerBlackWins: number;
  // Settings (synced to cloud)
  difficulty: Difficulty;
  variant: GameVariant;
  gameMode: GameMode;
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
  // New for variants and 2-player
  rules: RuleSet;
  gameMode: GameMode;
};

type GameActions = {
  selectPiece: (pos: Position) => void;
  makeMove: (to: Position) => void;
  newGame: (options?: { difficulty?: Difficulty; variant?: GameVariant; mode?: GameMode }) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setVariant: (variant: GameVariant) => void;
  setGameMode: (mode: GameMode) => void;
  triggerAIMove: () => void;
  recordWin: (winner: Player) => void;
  recordLoss: () => void;
  getProgress: () => CheckersProgress;
  setProgress: (data: CheckersProgress) => void;
};

const defaultProgress: CheckersProgress = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  totalPiecesCaptured: 0,
  totalKingsEarned: 0,
  longestJumpChain: 0,
  currentWinStreak: 0,
  bestWinStreak: 0,
  easyWins: 0,
  easyLosses: 0,
  mediumWins: 0,
  mediumLosses: 0,
  hardWins: 0,
  hardLosses: 0,
  twoPlayerGamesPlayed: 0,
  twoPlayerRedWins: 0,
  twoPlayerBlackWins: 0,
  difficulty: "easy",
  variant: "american",
  gameMode: "vs-ai",
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
      rules: getDefaultRuleSet(),
      gameMode: "vs-ai",

      selectPiece: (pos) => {
        const state = get();
        if (state.status !== "playing" || state.isAIThinking) return;

        // In AI mode, only human player (red) can select
        // In 2-player mode, current player can select their pieces
        if (state.gameMode === "vs-ai" && state.currentPlayer !== "red") return;

        const piece = state.board[pos.row][pos.col];
        // Check piece belongs to current player
        const playerPrefix = state.currentPlayer;
        if (!piece || !piece.startsWith(playerPrefix)) return;

        const selectables = getSelectablePieces(state.board, state.currentPlayer, state.rules);
        if (!selectables.some((p) => positionsEqual(p, pos))) return;

        const moves = getValidMovesForPiece(state.board, pos.row, pos.col, state.rules);
        set({ selectedPiece: pos, validMoves: moves });
      },

      makeMove: (to) => {
        const state = get();
        if (!state.selectedPiece || state.status !== "playing") return;
        const move = state.validMoves.find((m) => positionsEqual(m.to, to));
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

        const nextPlayer = getOpponent(state.currentPlayer);
        const newStatus = checkGameStatus(newBoard, nextPlayer, state.rules);

        set({
          board: newBoard,
          currentPlayer: nextPlayer,
          selectedPiece: null,
          validMoves: [],
          lastMove: move,
          status: newStatus,
          piecesCapturedThisGame: newCaptured,
          kingsEarnedThisGame: newKingsEarned,
          longestChainThisGame: newLongestChain,
        });

        // Handle game over
        if (newStatus !== "playing") {
          const winner = newStatus === "red-wins" ? "red" : "black";
          get().recordWin(winner);
        } else if (state.gameMode === "vs-ai" && nextPlayer === "black") {
          // AI's turn
          setTimeout(() => get().triggerAIMove(), 500);
        }
        // In 2-player mode, just wait for next human input
      },

      triggerAIMove: () => {
        const state = get();
        if (state.status !== "playing" || state.currentPlayer !== "black" || state.gameMode !== "vs-ai") return;
        set({ isAIThinking: true });

        setTimeout(() => {
          const currentState = get();
          const aiMove = getAIMove(currentState.board, "black", currentState.difficulty, currentState.rules);
          if (!aiMove) {
            // No moves = game over
            const newStatus = checkGameStatus(currentState.board, "black", currentState.rules);
            set({ status: newStatus, isAIThinking: false });
            if (newStatus !== "playing") {
              const winner = newStatus === "red-wins" ? "red" : "black";
              get().recordWin(winner);
            }
            return;
          }

          const newBoard = executeMove(currentState.board, aiMove);
          const newStatus = checkGameStatus(newBoard, "red", currentState.rules);

          set({
            board: newBoard,
            currentPlayer: "red",
            lastMove: aiMove,
            status: newStatus,
            isAIThinking: false,
          });

          if (newStatus !== "playing") {
            const winner = newStatus === "red-wins" ? "red" : "black";
            get().recordWin(winner);
          }
        }, 300);
      },

      newGame: (options) => {
        const state = get();
        const newVariant = options?.variant ?? state.progress.variant;
        const newMode = options?.mode ?? state.gameMode;
        const newDifficulty = options?.difficulty ?? state.difficulty;

        set({
          board: createInitialBoard(),
          currentPlayer: "red",
          selectedPiece: null,
          validMoves: [],
          lastMove: null,
          status: "playing",
          difficulty: newDifficulty,
          isAIThinking: false,
          piecesCapturedThisGame: 0,
          kingsEarnedThisGame: 0,
          longestChainThisGame: 0,
          rules: RULE_SETS[newVariant],
          gameMode: newMode,
        });
      },

      setDifficulty: (difficulty) => set({ difficulty }),

      setVariant: (variant) => {
        set((state) => ({
          rules: RULE_SETS[variant],
          progress: { ...state.progress, variant, lastModified: Date.now() },
        }));
      },

      setGameMode: (mode) => {
        set((state) => ({
          gameMode: mode,
          progress: { ...state.progress, gameMode: mode, lastModified: Date.now() },
        }));
      },

      recordWin: (winner: Player) => {
        const state = get();

        if (state.gameMode === "vs-ai") {
          // AI mode: red = human
          if (winner === "red") {
            // Human won
            const diff = state.difficulty;
            const newStreak = state.progress.currentWinStreak + 1;
            const diffKey = `${diff}Wins` as keyof CheckersProgress;
            set({
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
            });
          } else {
            // Human lost (AI won)
            const diff = state.difficulty;
            const diffKey = `${diff}Losses` as keyof CheckersProgress;
            set({
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
            });
          }
        } else {
          // 2-player mode
          set({
            progress: {
              ...state.progress,
              twoPlayerGamesPlayed: state.progress.twoPlayerGamesPlayed + 1,
              twoPlayerRedWins: state.progress.twoPlayerRedWins + (winner === "red" ? 1 : 0),
              twoPlayerBlackWins: state.progress.twoPlayerBlackWins + (winner === "black" ? 1 : 0),
              lastModified: Date.now(),
            },
          });
        }
      },

      recordLoss: () => {
        // Kept for backward compatibility but now handled by recordWin
      },

      getProgress: () => ({
        ...get().progress,
        difficulty: get().difficulty,
        variant: get().rules.variant,
        gameMode: get().gameMode,
      }),
      setProgress: (data) =>
        set({
          progress: {
            ...defaultProgress,
            ...data,
          },
          difficulty: data.difficulty ?? get().difficulty,
          rules: RULE_SETS[data.variant ?? "american"],
          gameMode: data.gameMode ?? get().gameMode,
        }),
    }),
    {
      name: "checkers-progress",
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Partial<{ progress: Partial<CheckersProgress>; difficulty: Difficulty }>;
        if (version < 2) {
          // Migrate from v1 to v2: add new fields
          return {
            ...state,
            progress: {
              ...defaultProgress,
              ...state.progress,
              twoPlayerGamesPlayed: 0,
              twoPlayerRedWins: 0,
              twoPlayerBlackWins: 0,
              variant: "american" as GameVariant,
              gameMode: "vs-ai" as GameMode,
            },
          };
        }
        return state;
      },
      partialize: (state) => ({
        progress: state.progress,
        difficulty: state.difficulty,
      }),
    }
  )
);
