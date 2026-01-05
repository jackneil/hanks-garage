// Ball Physics Game - State Management
// Zustand store with progress persistence

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BallType = "blue" | "orange" | "yellow-dot";

export type Ball = {
  id: string;
  type: BallType;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export type GameState = "menu" | "playing" | "paused" | "gameOver";

export type BallPhysicsProgress = {
  highScore: number;
  totalGamesPlayed: number;
  totalBallsSpawned: number;
  highestMultiplier: number;
  lastModified: number;
};

type State = {
  // Game state
  gameState: GameState;
  score: number;
  multiplier: number;
  balls: Ball[];

  // Paddle
  paddleX: number; // -1 to 1 (normalized)

  // Settings
  soundEnabled: boolean;

  // Progress (saved)
  progress: BallPhysicsProgress;
};

type Actions = {
  // Game flow
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;

  // Gameplay
  setPaddleX: (x: number) => void;
  addBall: (ball: Omit<Ball, "id">) => void;
  removeBall: (id: string) => void;
  updateBalls: (balls: Ball[]) => void;
  addScore: (points: number) => void;
  updateMultiplier: (ballCount: number) => void;

  // Settings
  toggleSound: () => void;

  // Progress (required for cloud sync)
  getProgress: () => BallPhysicsProgress;
  setProgress: (data: BallPhysicsProgress) => void;
};

const defaultProgress: BallPhysicsProgress = {
  highScore: 0,
  totalGamesPlayed: 0,
  totalBallsSpawned: 0,
  highestMultiplier: 1,
  lastModified: Date.now(),
};

export const useBallPhysicsStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: "menu",
      score: 0,
      multiplier: 1,
      balls: [],
      paddleX: 0,
      soundEnabled: true,
      progress: defaultProgress,

      // Game flow
      startGame: () => {
        set({
          gameState: "playing",
          score: 0,
          multiplier: 1,
          balls: [
            // Start with 3 blue balls
            {
              id: "initial-1",
              type: "blue",
              x: -0.3,
              y: 0.8,
              vx: 0.01,
              vy: -0.02,
            },
            {
              id: "initial-2",
              type: "blue",
              x: 0,
              y: 0.7,
              vx: -0.015,
              vy: -0.018,
            },
            {
              id: "initial-3",
              type: "blue",
              x: 0.3,
              y: 0.8,
              vx: -0.01,
              vy: -0.022,
            },
          ],
        });
      },

      pauseGame: () => {
        if (get().gameState === "playing") {
          set({ gameState: "paused" });
        }
      },

      resumeGame: () => {
        if (get().gameState === "paused") {
          set({ gameState: "playing" });
        }
      },

      endGame: () => {
        const state = get();
        const newProgress = { ...state.progress };

        // Update progress
        if (state.score > newProgress.highScore) {
          newProgress.highScore = state.score;
        }
        if (state.multiplier > newProgress.highestMultiplier) {
          newProgress.highestMultiplier = state.multiplier;
        }
        newProgress.totalGamesPlayed += 1;
        newProgress.lastModified = Date.now();

        set({
          gameState: "gameOver",
          progress: newProgress,
        });
      },

      // Gameplay
      setPaddleX: (x: number) => {
        // Clamp to -1 to 1
        const clamped = Math.max(-1, Math.min(1, x));
        set({ paddleX: clamped });
      },

      addBall: (ball: Omit<Ball, "id">) => {
        const state = get();
        const id = `ball-${Date.now()}-${Math.random()}`;
        const newBall = { ...ball, id };

        set({
          balls: [...state.balls, newBall],
          progress: {
            ...state.progress,
            totalBallsSpawned: state.progress.totalBallsSpawned + 1,
            lastModified: Date.now(),
          },
        });
      },

      removeBall: (id: string) => {
        const state = get();
        const newBalls = state.balls.filter((b) => b.id !== id);

        // Game over if no balls left
        if (newBalls.length === 0) {
          get().endGame();
        } else {
          set({ balls: newBalls });
        }
      },

      updateBalls: (balls: Ball[]) => {
        set({ balls });
      },

      addScore: (points: number) => {
        const state = get();
        const finalPoints = Math.floor(points * state.multiplier);
        set({ score: state.score + finalPoints });
      },

      updateMultiplier: (ballCount: number) => {
        let mult = 1;
        if (ballCount >= 50) mult = 10;
        else if (ballCount >= 20) mult = 5;
        else if (ballCount >= 10) mult = 2;

        set({ multiplier: mult });
      },

      // Settings
      toggleSound: () => {
        set({ soundEnabled: !get().soundEnabled });
      },

      // Progress (required for cloud sync)
      getProgress: () => get().progress,
      setProgress: (data: BallPhysicsProgress) => {
        set({ progress: data });
      },
    }),
    {
      name: "ball-physics-state",
      partialize: (state) => ({
        progress: state.progress,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);
