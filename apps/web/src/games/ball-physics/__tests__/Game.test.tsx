import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BallPhysicsGame } from "../Game";
import { useBallPhysicsStore } from "../lib/store";

describe("BallPhysicsGame Component", () => {
  beforeEach(() => {
    // Reset store to menu state before each test
    useBallPhysicsStore.setState({
      gameState: "menu",
      score: 0,
      multiplier: 1,
      balls: [],
      wasNewHighScore: false,
      paddleX: 0,
      soundEnabled: true,
      progress: {
        highScore: 0,
        totalGamesPlayed: 0,
        totalBallsSpawned: 0,
        highestMultiplier: 1,
        lastModified: Date.now(),
      },
    });
  });

  it("renders without crashing", () => {
    render(<BallPhysicsGame />);
    expect(screen.getByText("Ball Physics")).toBeInTheDocument();
  });

  it("renders menu screen with start button", () => {
    render(<BallPhysicsGame />);
    expect(screen.getByText(/Start Game/)).toBeInTheDocument();
    expect(screen.getByText("Chain Reaction Mayhem")).toBeInTheDocument();
  });

  it("renders game instructions on menu", () => {
    render(<BallPhysicsGame />);
    expect(screen.getByText("Move paddle with mouse/touch")).toBeInTheDocument();
    expect(screen.getByText("Balls multiply when they hit walls!")).toBeInTheDocument();
  });

  it("renders pause button", () => {
    render(<BallPhysicsGame />);
    // Pause button should be present but disabled on menu
    const pauseButton = screen.getByRole("button", { name: /⏸/ });
    expect(pauseButton).toBeInTheDocument();
    expect(pauseButton).toBeDisabled();
  });

  it("renders sound toggle button", () => {
    render(<BallPhysicsGame />);
    const soundButton = screen.getByRole("button", { name: /🔊/ });
    expect(soundButton).toBeInTheDocument();
  });

  it("shows game over screen with correct content", () => {
    // Set state to game over
    useBallPhysicsStore.setState({
      gameState: "gameOver",
      score: 1500,
      wasNewHighScore: false,
      progress: {
        highScore: 2000,
        totalGamesPlayed: 5,
        totalBallsSpawned: 100,
        highestMultiplier: 3,
        lastModified: Date.now(),
      },
    });

    render(<BallPhysicsGame />);
    expect(screen.getByText("Game Over!")).toBeInTheDocument();
    expect(screen.getByText(/^Score:/)).toBeInTheDocument();
    expect(screen.getByText(/^High Score:/)).toBeInTheDocument();
    expect(screen.getByText(/Play Again/)).toBeInTheDocument();
  });

  it("shows 'New High Score!' message when wasNewHighScore is true", () => {
    useBallPhysicsStore.setState({
      gameState: "gameOver",
      score: 3000,
      wasNewHighScore: true,
      progress: {
        highScore: 3000,
        totalGamesPlayed: 1,
        totalBallsSpawned: 50,
        highestMultiplier: 2,
        lastModified: Date.now(),
      },
    });

    render(<BallPhysicsGame />);
    expect(screen.getByText(/New High Score!/)).toBeInTheDocument();
  });

  it("does NOT show 'New High Score!' when wasNewHighScore is false", () => {
    useBallPhysicsStore.setState({
      gameState: "gameOver",
      score: 500,
      wasNewHighScore: false,
      progress: {
        highScore: 2000,
        totalGamesPlayed: 5,
        totalBallsSpawned: 100,
        highestMultiplier: 3,
        lastModified: Date.now(),
      },
    });

    render(<BallPhysicsGame />);
    expect(screen.queryByText("New High Score!")).not.toBeInTheDocument();
  });

  it("shows paused overlay when game is paused", () => {
    useBallPhysicsStore.setState({
      gameState: "paused",
      score: 100,
      balls: [{ id: "1", type: "blue", x: 0, y: 0, vx: 0, vy: 0 }],
    });

    render(<BallPhysicsGame />);
    expect(screen.getByText("PAUSED")).toBeInTheDocument();
    expect(screen.getByText(/Resume/)).toBeInTheDocument();
  });
});
