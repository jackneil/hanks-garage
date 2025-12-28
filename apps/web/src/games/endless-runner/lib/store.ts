import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type GameState,
  type Player as PlayerType,
  type Obstacle as ObstacleType,
  type CoinType,
  type Cloud,
  type CharacterId,
  PLAYER,
  PHYSICS,
  OBSTACLE,
  COIN,
  SPEED,
  SCORING,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND,
  CHARACTERS,
} from "./constants";

// Progress data that gets synced to server
// Index signature required for AppProgressData compatibility
export type EndlessRunnerProgress = {
  [key: string]: unknown;
  highScore: number;
  totalDistance: number;
  totalCoins: number;
  coinsCollected: number;
  gamesPlayed: number;
  unlockedCharacters: CharacterId[];
  selectedCharacter: CharacterId;
  lastModified: number;
};

const defaultProgress: EndlessRunnerProgress = {
  highScore: 0,
  totalDistance: 0,
  totalCoins: 0,
  coinsCollected: 0,
  gamesPlayed: 0,
  unlockedCharacters: ["speedy-sam"],
  selectedCharacter: "speedy-sam",
  lastModified: Date.now(),
};

// Full game state
type EndlessRunnerState = {
  // Current game state
  gameState: GameState;
  score: number;
  distance: number;
  coinsThisRun: number;
  player: PlayerType;
  obstacles: ObstacleType[];
  coins: CoinType[];
  clouds: Cloud[];
  groundOffset: number;
  currentSpeed: number;
  obstacleIdCounter: number;
  coinIdCounter: number;
  isNewHighScore: boolean;
  lastMilestone: number;

  // Persisted progress
  progress: EndlessRunnerProgress;

  // Actions
  startGame: () => void;
  jump: () => void;
  startDuck: () => void;
  stopDuck: () => void;
  update: (delta: number) => void;
  endGame: () => void;
  reset: () => void;
  unlockCharacter: (id: CharacterId) => boolean;
  selectCharacter: (id: CharacterId) => void;

  // For useAuthSync
  getProgress: () => EndlessRunnerProgress;
  setProgress: (data: EndlessRunnerProgress) => void;
};

// Create initial clouds
function createInitialClouds(): Cloud[] {
  const clouds: Cloud[] = [];
  for (let i = 0; i < 5; i++) {
    clouds.push({
      x: Math.random() * CANVAS_WIDTH * 1.5,
      y: 30 + Math.random() * 80,
      scale: 0.5 + Math.random() * 0.5,
      speed: 0.2 + Math.random() * 0.3,
    });
  }
  return clouds;
}

// Spawn a new obstacle
function createObstacle(id: number, x: number): ObstacleType {
  // 70% ground obstacles, 30% air obstacles (more forgiving for kids)
  const isGround = Math.random() < 0.7;

  if (isGround) {
    return {
      x,
      type: "ground",
      width: OBSTACLE.GROUND_WIDTH,
      height: OBSTACLE.GROUND_HEIGHT,
      id,
    };
  } else {
    return {
      x,
      type: "air",
      width: OBSTACLE.AIR_WIDTH,
      height: OBSTACLE.AIR_HEIGHT,
      id,
    };
  }
}

// Spawn coins in a pattern
function createCoins(startId: number, obstacleX: number): CoinType[] {
  if (Math.random() > COIN.SPAWN_CHANCE) return [];

  const coins: CoinType[] = [];
  const pattern = Math.floor(Math.random() * 3); // 0: line, 1: arc, 2: single
  const startX = obstacleX - 150; // Coins appear before obstacles

  if (pattern === 0) {
    // Line of 3 coins
    const y = [COIN.LOW_Y, COIN.MID_Y, COIN.HIGH_Y][Math.floor(Math.random() * 3)];
    for (let i = 0; i < 3; i++) {
      coins.push({
        x: startX + i * 40,
        y,
        collected: false,
        id: startId + i,
      });
    }
  } else if (pattern === 1) {
    // Arc pattern (3 coins)
    coins.push({ x: startX, y: COIN.LOW_Y, collected: false, id: startId });
    coins.push({ x: startX + 40, y: COIN.HIGH_Y, collected: false, id: startId + 1 });
    coins.push({ x: startX + 80, y: COIN.LOW_Y, collected: false, id: startId + 2 });
  } else {
    // Single high-value position
    coins.push({
      x: startX + 40,
      y: COIN.HIGH_Y,
      collected: false,
      id: startId,
    });
  }

  return coins;
}

export const useEndlessRunnerStore = create<EndlessRunnerState>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: "ready",
      score: 0,
      distance: 0,
      coinsThisRun: 0,
      player: {
        y: PLAYER.GROUND_Y,
        velocity: 0,
        isDucking: false,
        isJumping: false,
      },
      obstacles: [],
      coins: [],
      clouds: createInitialClouds(),
      groundOffset: 0,
      currentSpeed: SPEED.INITIAL,
      obstacleIdCounter: 0,
      coinIdCounter: 0,
      isNewHighScore: false,
      lastMilestone: 0,
      progress: defaultProgress,

      startGame: () => {
        const state = get();
        const firstObstacleX = CANVAS_WIDTH + 200;
        const firstObstacle = createObstacle(1, firstObstacleX);
        const firstCoins = createCoins(1, firstObstacleX);

        set({
          gameState: "playing",
          score: 0,
          distance: 0,
          coinsThisRun: 0,
          player: {
            y: PLAYER.GROUND_Y,
            velocity: 0,
            isDucking: false,
            isJumping: false,
          },
          obstacles: [firstObstacle],
          coins: firstCoins,
          clouds: createInitialClouds(),
          groundOffset: 0,
          currentSpeed: SPEED.INITIAL,
          obstacleIdCounter: 1,
          coinIdCounter: firstCoins.length > 0 ? firstCoins[firstCoins.length - 1].id : 0,
          isNewHighScore: false,
          lastMilestone: 0,
        });
      },

      jump: () => {
        const state = get();
        if (state.gameState !== "playing") return;
        if (state.player.isJumping || state.player.isDucking) return;

        set({
          player: {
            ...state.player,
            velocity: PHYSICS.JUMP_VELOCITY,
            isJumping: true,
          },
        });
      },

      startDuck: () => {
        const state = get();
        if (state.gameState !== "playing") return;
        if (state.player.isJumping) return;

        set({
          player: {
            ...state.player,
            isDucking: true,
          },
        });
      },

      stopDuck: () => {
        const state = get();
        set({
          player: {
            ...state.player,
            isDucking: false,
          },
        });
      },

      update: (delta: number) => {
        const state = get();
        if (state.gameState !== "playing") return;

        // Normalize delta to ~16ms (60fps)
        const normalizedDelta = Math.min(delta / 16.67, 2);

        // Update player physics
        let newY = state.player.y;
        let newVelocity = state.player.velocity;
        let newIsJumping = state.player.isJumping;

        if (state.player.isJumping) {
          newVelocity += PHYSICS.GRAVITY * normalizedDelta;
          newVelocity = Math.min(newVelocity, PHYSICS.MAX_FALL_SPEED);
          newY += newVelocity * normalizedDelta;

          // Check if landed
          if (newY >= PLAYER.GROUND_Y) {
            newY = PLAYER.GROUND_Y;
            newVelocity = 0;
            newIsJumping = false;
          }
        }

        // Update speed (gradual increase)
        let newSpeed = state.currentSpeed;
        if (newSpeed < SPEED.MAX) {
          newSpeed = Math.min(newSpeed + SPEED.INCREASE_RATE * normalizedDelta, SPEED.MAX);
        }

        // Update ground offset for scrolling effect
        const newGroundOffset = (state.groundOffset + newSpeed * normalizedDelta) % 40;

        // Update obstacles
        let newObstacles = state.obstacles.map((obs) => ({
          ...obs,
          x: obs.x - newSpeed * normalizedDelta,
        }));

        // Remove off-screen obstacles
        newObstacles = newObstacles.filter((obs) => obs.x > -obs.width);

        // Spawn new obstacles
        let newObstacleIdCounter = state.obstacleIdCounter;
        let newCoinIdCounter = state.coinIdCounter;
        let newCoins = [...state.coins];

        const lastObstacle = newObstacles[newObstacles.length - 1];
        const spawnThreshold = CANVAS_WIDTH + OBSTACLE.MIN_SPACING;

        if (!lastObstacle || lastObstacle.x < spawnThreshold - (OBSTACLE.MIN_SPACING + Math.random() * (OBSTACLE.MAX_SPACING - OBSTACLE.MIN_SPACING))) {
          newObstacleIdCounter++;
          const newObstacleX = CANVAS_WIDTH + 50;
          const newObstacle = createObstacle(newObstacleIdCounter, newObstacleX);
          newObstacles.push(newObstacle);

          // Spawn coins with new obstacle
          const obstacleCoins = createCoins(newCoinIdCounter + 1, newObstacleX);
          if (obstacleCoins.length > 0) {
            newCoins.push(...obstacleCoins);
            newCoinIdCounter = obstacleCoins[obstacleCoins.length - 1].id;
          }
        }

        // Update coins
        newCoins = newCoins.map((coin) => ({
          ...coin,
          x: coin.x - newSpeed * normalizedDelta,
        }));

        // Remove off-screen coins
        newCoins = newCoins.filter((coin) => coin.x > -COIN.SIZE && !coin.collected);

        // Update clouds (parallax - slower than ground)
        const newClouds = state.clouds.map((cloud) => {
          let newX = cloud.x - cloud.speed * normalizedDelta;
          if (newX < -100) {
            newX = CANVAS_WIDTH + 100;
          }
          return { ...cloud, x: newX };
        });

        // Update distance
        const newDistance = state.distance + newSpeed * normalizedDelta * SCORING.DISTANCE_MULTIPLIER;

        // Check for coin collection
        let newCoinsThisRun = state.coinsThisRun;
        const playerHeight = state.player.isDucking ? PHYSICS.DUCK_HEIGHT : PLAYER.HEIGHT;
        const playerTop = newY - playerHeight;
        const playerBottom = newY;
        const playerLeft = PLAYER.X - PLAYER.WIDTH / 2 + PLAYER.HITBOX_PADDING;
        const playerRight = PLAYER.X + PLAYER.WIDTH / 2 - PLAYER.HITBOX_PADDING;

        newCoins = newCoins.map((coin) => {
          if (coin.collected) return coin;

          const coinLeft = coin.x - COIN.SIZE / 2;
          const coinRight = coin.x + COIN.SIZE / 2;
          const coinTop = coin.y - COIN.SIZE / 2;
          const coinBottom = coin.y + COIN.SIZE / 2;

          // Check collision
          if (
            playerRight > coinLeft &&
            playerLeft < coinRight &&
            playerBottom > coinTop &&
            playerTop < coinBottom
          ) {
            newCoinsThisRun += COIN.VALUE;
            return { ...coin, collected: true };
          }
          return coin;
        });

        // Check for obstacle collision
        const groundY = CANVAS_HEIGHT - GROUND.HEIGHT;
        for (const obs of newObstacles) {
          const obsLeft = obs.x;
          const obsRight = obs.x + obs.width;
          let obsTop: number;
          let obsBottom: number;

          if (obs.type === "ground") {
            obsTop = groundY - GROUND.HEIGHT - obs.height;
            obsBottom = groundY - GROUND.HEIGHT;
          } else {
            // Air obstacle
            obsTop = OBSTACLE.AIR_Y;
            obsBottom = OBSTACLE.AIR_Y + obs.height;
          }

          // Add padding for forgiving hitboxes
          const paddedPlayerLeft = playerLeft;
          const paddedPlayerRight = playerRight;
          const paddedPlayerTop = playerTop + PLAYER.HITBOX_PADDING;
          const paddedPlayerBottom = playerBottom - PLAYER.HITBOX_PADDING;

          // Check collision
          if (
            paddedPlayerRight > obsLeft &&
            paddedPlayerLeft < obsRight &&
            paddedPlayerBottom > obsTop &&
            paddedPlayerTop < obsBottom
          ) {
            get().endGame();
            return;
          }
        }

        // Check milestones
        let newMilestone = state.lastMilestone;
        const distanceMeters = Math.floor(newDistance);
        for (const milestone of SCORING.MILESTONES) {
          if (distanceMeters >= milestone && state.lastMilestone < milestone) {
            newMilestone = milestone;
            // Could trigger celebration here
          }
        }

        set({
          player: {
            ...state.player,
            y: newY,
            velocity: newVelocity,
            isJumping: newIsJumping,
          },
          obstacles: newObstacles,
          coins: newCoins,
          clouds: newClouds,
          groundOffset: newGroundOffset,
          currentSpeed: newSpeed,
          distance: newDistance,
          score: Math.floor(newDistance),
          coinsThisRun: newCoinsThisRun,
          obstacleIdCounter: newObstacleIdCounter,
          coinIdCounter: newCoinIdCounter,
          lastMilestone: newMilestone,
        });
      },

      endGame: () => {
        const state = get();
        const finalScore = Math.floor(state.distance);
        const isNewHighScore = finalScore > state.progress.highScore;

        set({
          gameState: "gameOver",
          isNewHighScore,
          progress: {
            ...state.progress,
            highScore: Math.max(state.progress.highScore, finalScore),
            totalDistance: state.progress.totalDistance + state.distance,
            totalCoins: state.progress.totalCoins + state.coinsThisRun,
            coinsCollected: state.progress.coinsCollected + state.coinsThisRun,
            gamesPlayed: state.progress.gamesPlayed + 1,
            lastModified: Date.now(),
          },
        });
      },

      reset: () => {
        set({
          gameState: "ready",
          score: 0,
          distance: 0,
          coinsThisRun: 0,
          player: {
            y: PLAYER.GROUND_Y,
            velocity: 0,
            isDucking: false,
            isJumping: false,
          },
          obstacles: [],
          coins: [],
          clouds: createInitialClouds(),
          groundOffset: 0,
          currentSpeed: SPEED.INITIAL,
          isNewHighScore: false,
          lastMilestone: 0,
        });
      },

      unlockCharacter: (id: CharacterId) => {
        const state = get();
        const character = CHARACTERS[id];
        if (!character) return false;
        if (state.progress.unlockedCharacters.includes(id)) return false;
        if (state.progress.totalCoins < character.cost) return false;

        set({
          progress: {
            ...state.progress,
            totalCoins: state.progress.totalCoins - character.cost,
            unlockedCharacters: [...state.progress.unlockedCharacters, id],
            lastModified: Date.now(),
          },
        });
        return true;
      },

      selectCharacter: (id: CharacterId) => {
        const state = get();
        if (!state.progress.unlockedCharacters.includes(id)) return;

        set({
          progress: {
            ...state.progress,
            selectedCharacter: id,
            lastModified: Date.now(),
          },
        });
      },

      getProgress: () => get().progress,
      setProgress: (data) => set({ progress: data }),
    }),
    {
      name: "endless-runner-progress",
      partialize: (state) => ({ progress: state.progress }),
    }
  )
);
