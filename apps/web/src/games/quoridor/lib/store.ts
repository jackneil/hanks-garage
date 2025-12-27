import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Player,
  type Position,
  type Wall,
  type WallOrientation,
  type GameStatus,
  type GameMode,
  type Difficulty,
  WALLS_PER_PLAYER,
  createInitialPositions,
  getOpponent,
  positionsEqual,
  getGoalRow,
} from "./constants";
import {
  type GameLogicState,
  getValidMoves,
  isValidWallPlacement,
  applyPawnMove,
  getGameStatus,
  getShortestPathLength,
  getValidWalls,
} from "./quoridorLogic";

// Progress tracking for persistence
export type QuoridorProgress = {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  currentWinStreak: number;
  bestWinStreak: number;
  totalWallsPlaced: number;
  totalMovesToWin: number;
  fastestWin: number | null;
  lastModified: number;
};

// Complete game state
export type GameState = {
  // Board state
  positions: Record<Player, Position>;
  walls: Wall[];
  wallsRemaining: Record<Player, number>;
  currentPlayer: Player;
  status: GameStatus;

  // UI state
  selectedPawn: boolean;
  wallMode: boolean;
  wallOrientation: WallOrientation;
  wallPreview: Wall | null;
  validMoves: Position[];

  // Game settings
  gameMode: GameMode;
  difficulty: Difficulty;
  isAIThinking: boolean;

  // Stats for current game
  movesThisGame: number;
  wallsPlacedThisGame: number;

  // Progress tracking
  progress: QuoridorProgress;
};

type GameActions = {
  // Core game actions
  selectPawn: () => void;
  movePawn: (to: Position) => void;
  enterWallMode: () => void;
  exitWallMode: () => void;
  toggleWallOrientation: () => void;
  setWallPreview: (wall: Wall | null) => void;
  placeWall: (wall: Wall) => void;

  // Game control
  newGame: (mode?: GameMode, difficulty?: Difficulty) => void;
  setGameMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;

  // AI
  triggerAIMove: () => void;

  // Stats
  recordWin: () => void;
  recordLoss: () => void;
  getProgress: () => QuoridorProgress;
  setProgress: (data: QuoridorProgress) => void;

  // Helpers
  getLogicState: () => GameLogicState;
};

const defaultProgress: QuoridorProgress = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  currentWinStreak: 0,
  bestWinStreak: 0,
  totalWallsPlaced: 0,
  totalMovesToWin: 0,
  fastestWin: null,
  lastModified: Date.now(),
};

function createInitialState(): Omit<GameState, keyof GameActions> {
  return {
    positions: createInitialPositions(),
    walls: [],
    wallsRemaining: { 1: WALLS_PER_PLAYER, 2: WALLS_PER_PLAYER },
    currentPlayer: 1,
    status: "playing",
    selectedPawn: false,
    wallMode: false,
    wallOrientation: "horizontal",
    wallPreview: null,
    validMoves: [],
    gameMode: "local",
    difficulty: "easy",
    isAIThinking: false,
    movesThisGame: 0,
    wallsPlacedThisGame: 0,
    progress: defaultProgress,
  };
}

export const useQuoridorStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      getLogicState: (): GameLogicState => {
        const state = get();
        return {
          positions: state.positions,
          walls: state.walls,
          wallsRemaining: state.wallsRemaining,
        };
      },

      selectPawn: () => {
        const state = get();
        if (state.status !== "playing" || state.isAIThinking) return;
        if (state.gameMode === "ai" && state.currentPlayer === 2) return;

        const logicState = get().getLogicState();
        const validMoves = getValidMoves(logicState, state.currentPlayer);

        set({
          selectedPawn: true,
          wallMode: false,
          wallPreview: null,
          validMoves,
        });
      },

      movePawn: (to: Position) => {
        const state = get();
        if (state.status !== "playing" || state.isAIThinking) return;
        if (state.gameMode === "ai" && state.currentPlayer === 2) return;

        // Verify move is valid
        const isValidMove = state.validMoves.some((m) => positionsEqual(m, to));
        if (!isValidMove) return;

        const newPositions = applyPawnMove(
          state.positions,
          state.currentPlayer,
          to
        );
        const newStatus = getGameStatus(newPositions);
        const nextPlayer = getOpponent(state.currentPlayer);

        set({
          positions: newPositions,
          currentPlayer: nextPlayer,
          status: newStatus,
          selectedPawn: false,
          wallMode: false,
          validMoves: [],
          movesThisGame: state.movesThisGame + 1,
        });

        // Check win condition
        if (newStatus === "player1-wins") {
          get().recordWin();
        } else if (newStatus === "player2-wins") {
          if (state.gameMode === "ai") {
            get().recordLoss();
          }
        } else if (state.gameMode === "ai" && nextPlayer === 2) {
          // Trigger AI move
          setTimeout(() => get().triggerAIMove(), 500);
        }
      },

      enterWallMode: () => {
        const state = get();
        if (state.status !== "playing" || state.isAIThinking) return;
        if (state.gameMode === "ai" && state.currentPlayer === 2) return;
        if (state.wallsRemaining[state.currentPlayer] <= 0) return;

        set({
          wallMode: true,
          selectedPawn: false,
          validMoves: [],
        });
      },

      exitWallMode: () => {
        set({
          wallMode: false,
          wallPreview: null,
        });
      },

      toggleWallOrientation: () => {
        set((state) => ({
          wallOrientation:
            state.wallOrientation === "horizontal" ? "vertical" : "horizontal",
          wallPreview: null,
        }));
      },

      setWallPreview: (wall: Wall | null) => {
        set({ wallPreview: wall });
      },

      placeWall: (wall: Wall) => {
        const state = get();
        if (state.status !== "playing" || state.isAIThinking) return;
        if (state.gameMode === "ai" && state.currentPlayer === 2) return;

        const logicState = get().getLogicState();
        if (!isValidWallPlacement(logicState, wall, state.currentPlayer)) {
          return;
        }

        const nextPlayer = getOpponent(state.currentPlayer);

        set({
          walls: [...state.walls, wall],
          wallsRemaining: {
            ...state.wallsRemaining,
            [state.currentPlayer]: state.wallsRemaining[state.currentPlayer] - 1,
          },
          currentPlayer: nextPlayer,
          wallMode: false,
          wallPreview: null,
          wallsPlacedThisGame: state.wallsPlacedThisGame + 1,
        });

        // Trigger AI move if needed
        if (state.gameMode === "ai" && nextPlayer === 2) {
          setTimeout(() => get().triggerAIMove(), 500);
        }
      },

      triggerAIMove: () => {
        const state = get();
        if (state.status !== "playing" || state.currentPlayer !== 2) return;

        set({ isAIThinking: true });

        setTimeout(() => {
          const currentState = get();
          const logicState = currentState.getLogicState();

          // Simple AI: prioritize moving toward goal
          const validMoves = getValidMoves(logicState, 2);
          const validWalls = getValidWalls(logicState, 2);

          let bestMove: Position | null = null;
          let bestWall: Wall | null = null;

          // Evaluate moves based on distance to goal
          const aiGoal = getGoalRow(2);
          const playerGoal = getGoalRow(1);

          if (validMoves.length > 0) {
            // Find move that gets us closest to goal
            let bestDist = Infinity;
            for (const move of validMoves) {
              const newPositions = applyPawnMove(currentState.positions, 2, move);
              const dist = getShortestPathLength(
                newPositions[2],
                aiGoal,
                currentState.walls
              );
              if (dist < bestDist) {
                bestDist = dist;
                bestMove = move;
              }
            }
          }

          // For medium/hard AI, consider walls
          if (
            currentState.difficulty !== "easy" &&
            validWalls.length > 0 &&
            currentState.wallsRemaining[2] > 0
          ) {
            // Check if placing a wall helps
            const currentPlayerDist = getShortestPathLength(
              currentState.positions[1],
              playerGoal,
              currentState.walls
            );

            for (const wall of validWalls.slice(0, 20)) {
              // Limit search
              const newWalls = [...currentState.walls, wall];
              const newPlayerDist = getShortestPathLength(
                currentState.positions[1],
                playerGoal,
                newWalls
              );

              // If wall significantly slows down player
              if (newPlayerDist > currentPlayerDist + 1) {
                bestWall = wall;
                break;
              }
            }
          }

          // Decide: move or place wall
          const shouldPlaceWall =
            bestWall &&
            currentState.difficulty === "hard" &&
            Math.random() > 0.5;

          if (shouldPlaceWall && bestWall) {
            // Place wall
            const nextPlayer = 1;
            set({
              walls: [...currentState.walls, bestWall],
              wallsRemaining: {
                ...currentState.wallsRemaining,
                2: currentState.wallsRemaining[2] - 1,
              },
              currentPlayer: nextPlayer,
              isAIThinking: false,
            });
          } else if (bestMove) {
            // Move pawn
            const newPositions = applyPawnMove(
              currentState.positions,
              2,
              bestMove
            );
            const newStatus = getGameStatus(newPositions);

            set({
              positions: newPositions,
              currentPlayer: 1,
              status: newStatus,
              isAIThinking: false,
            });

            if (newStatus === "player2-wins") {
              get().recordLoss();
            }
          } else {
            // No valid moves (shouldn't happen)
            set({ isAIThinking: false });
          }
        }, 500);
      },

      newGame: (mode?: GameMode, difficulty?: Difficulty) => {
        const state = get();
        set({
          ...createInitialState(),
          gameMode: mode ?? state.gameMode,
          difficulty: difficulty ?? state.difficulty,
          progress: state.progress,
        });
      },

      setGameMode: (mode: GameMode) => set({ gameMode: mode }),
      setDifficulty: (difficulty: Difficulty) => set({ difficulty }),

      recordWin: () => {
        set((state) => {
          const newStreak = state.progress.currentWinStreak + 1;
          const fastestWin =
            state.progress.fastestWin === null
              ? state.movesThisGame
              : Math.min(state.progress.fastestWin, state.movesThisGame);

          return {
            progress: {
              ...state.progress,
              gamesPlayed: state.progress.gamesPlayed + 1,
              gamesWon: state.progress.gamesWon + 1,
              currentWinStreak: newStreak,
              bestWinStreak: Math.max(state.progress.bestWinStreak, newStreak),
              totalWallsPlaced:
                state.progress.totalWallsPlaced + state.wallsPlacedThisGame,
              totalMovesToWin:
                state.progress.totalMovesToWin + state.movesThisGame,
              fastestWin,
              lastModified: Date.now(),
            },
          };
        });
      },

      recordLoss: () => {
        set((state) => ({
          progress: {
            ...state.progress,
            gamesPlayed: state.progress.gamesPlayed + 1,
            gamesLost: state.progress.gamesLost + 1,
            currentWinStreak: 0,
            totalWallsPlaced:
              state.progress.totalWallsPlaced + state.wallsPlacedThisGame,
            lastModified: Date.now(),
          },
        }));
      },

      getProgress: () => get().progress,
      setProgress: (data: QuoridorProgress) => set({ progress: data }),
    }),
    {
      name: "quoridor-progress",
      partialize: (state) => ({
        progress: state.progress,
        difficulty: state.difficulty,
        gameMode: state.gameMode,
      }),
    }
  )
);
