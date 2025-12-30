import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type GameState,
  type Alien,
  type AlienType,
  type Bullet,
  type MysteryShip,
  type ShieldBlock,
  type Explosion,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER,
  BULLET,
  ALIEN,
  ALIEN_TYPES,
  MYSTERY_SHIP,
  SHIELD,
  INITIAL_LIVES,
  getAlienTypeForRow,
  getShieldPositions,
  createShieldBlocks,
  getWaveDifficulty,
  getAlienSpeedForCount,
} from "./constants";

// ============================================
// Progress Data (Synced to Server)
// ============================================
export type SpaceInvadersProgress = {
  highScore: number;
  wavesCompleted: number;
  highestWave: number;
  totalAliensKilled: number;
  mysteryShipsHit: number;
  gamesPlayed: number;
  settings: {
    soundEnabled: boolean;
    difficulty: "easy" | "normal" | "hard";
  };
  lastModified: number;
};

const defaultProgress: SpaceInvadersProgress = {
  highScore: 0,
  wavesCompleted: 0,
  highestWave: 1,
  totalAliensKilled: 0,
  mysteryShipsHit: 0,
  gamesPlayed: 0,
  settings: {
    soundEnabled: true,
    difficulty: "normal",
  },
  lastModified: Date.now(),
};

// ============================================
// Full Game State
// ============================================
type SpaceInvadersState = {
  // Game state
  gameState: GameState;
  score: number;
  lives: number;
  wave: number;

  // Player
  playerX: number;

  // Aliens
  aliens: Alien[];
  alienDirection: 1 | -1; // 1 = right, -1 = left
  alienMoveTimer: number;
  alienAnimationFrame: number;

  // Bullets
  playerBullets: Bullet[];
  alienBullets: Bullet[];
  bulletIdCounter: number;

  // Mystery ship
  mysteryShip: MysteryShip | null;
  mysteryShipTimer: number;

  // Shields
  shields: ShieldBlock[][];

  // Effects
  explosions: Explosion[];
  explosionIdCounter: number;

  // Player respawn
  playerInvincible: boolean;
  invincibilityTimer: number;

  // Persisted progress
  progress: SpaceInvadersProgress;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  reset: () => void;
  movePlayer: (direction: -1 | 0 | 1) => void;
  shoot: () => void;
  update: (delta: number) => void;
  nextWave: () => void;

  // For useAuthSync
  getProgress: () => SpaceInvadersProgress;
  setProgress: (data: SpaceInvadersProgress) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setDifficulty: (difficulty: "easy" | "normal" | "hard") => void;
};

// ============================================
// Helper Functions
// ============================================
function createAliens(wave: number): Alien[] {
  const aliens: Alien[] = [];
  const difficulty = getWaveDifficulty(wave);
  let id = 0;

  for (let row = 0; row < ALIEN.ROWS; row++) {
    for (let col = 0; col < ALIEN.COLS; col++) {
      aliens.push({
        id: id++,
        type: getAlienTypeForRow(row),
        x: ALIEN.START_X + col * ALIEN.SPACING_X,
        y: ALIEN.START_Y + row * ALIEN.SPACING_Y + difficulty.startingRow * 20,
        alive: true,
        animationFrame: 0,
      });
    }
  }

  return aliens;
}

function createShields(): ShieldBlock[][] {
  const positions = getShieldPositions();
  return positions.map((x) => createShieldBlocks(x));
}

function scheduleNextMysteryShip(): number {
  return (
    Date.now() +
    MYSTERY_SHIP.SPAWN_INTERVAL_MIN +
    Math.random() *
      (MYSTERY_SHIP.SPAWN_INTERVAL_MAX - MYSTERY_SHIP.SPAWN_INTERVAL_MIN)
  );
}

// ============================================
// Zustand Store
// ============================================
export const useSpaceInvadersStore = create<SpaceInvadersState>()(
  persist(
    (set, get) => ({
      // Initial state
      gameState: "ready",
      score: 0,
      lives: INITIAL_LIVES,
      wave: 1,

      playerX: CANVAS_WIDTH / 2 - PLAYER.WIDTH / 2,

      aliens: [],
      alienDirection: 1,
      alienMoveTimer: 0,
      alienAnimationFrame: 0,

      playerBullets: [],
      alienBullets: [],
      bulletIdCounter: 0,

      mysteryShip: null,
      mysteryShipTimer: 0,

      shields: [],

      explosions: [],
      explosionIdCounter: 0,

      playerInvincible: false,
      invincibilityTimer: 0,

      progress: defaultProgress,

      // ============================================
      // Actions
      // ============================================
      startGame: () => {
        const state = get();
        set({
          gameState: "playing",
          score: 0,
          lives: INITIAL_LIVES,
          wave: 1,
          playerX: CANVAS_WIDTH / 2 - PLAYER.WIDTH / 2,
          aliens: createAliens(1),
          alienDirection: 1,
          alienMoveTimer: Date.now(),
          alienAnimationFrame: 0,
          playerBullets: [],
          alienBullets: [],
          bulletIdCounter: 0,
          mysteryShip: null,
          mysteryShipTimer: scheduleNextMysteryShip(),
          shields: createShields(),
          explosions: [],
          explosionIdCounter: 0,
          playerInvincible: false,
          invincibilityTimer: 0,
        });
      },

      pauseGame: () => {
        const state = get();
        if (state.gameState === "playing") {
          set({ gameState: "paused" });
        }
      },

      resumeGame: () => {
        const state = get();
        if (state.gameState === "paused") {
          set({ gameState: "playing" });
        }
      },

      reset: () => {
        set({
          gameState: "ready",
          score: 0,
          lives: INITIAL_LIVES,
          wave: 1,
          playerX: CANVAS_WIDTH / 2 - PLAYER.WIDTH / 2,
          aliens: [],
          alienDirection: 1,
          playerBullets: [],
          alienBullets: [],
          mysteryShip: null,
          shields: [],
          explosions: [],
          playerInvincible: false,
        });
      },

      movePlayer: (direction: -1 | 0 | 1) => {
        const state = get();
        if (state.gameState !== "playing") return;

        const newX = state.playerX + direction * PLAYER.SPEED;
        const clampedX = Math.max(
          10,
          Math.min(CANVAS_WIDTH - PLAYER.WIDTH - 10, newX)
        );
        set({ playerX: clampedX });
      },

      shoot: () => {
        const state = get();
        if (state.gameState !== "playing") return;
        if (state.playerBullets.length >= BULLET.MAX_PLAYER_BULLETS) return;

        const newBullet: Bullet = {
          id: state.bulletIdCounter,
          x: state.playerX + PLAYER.WIDTH / 2 - BULLET.WIDTH / 2,
          y: PLAYER.Y - BULLET.HEIGHT,
          isPlayerBullet: true,
        };

        set({
          playerBullets: [...state.playerBullets, newBullet],
          bulletIdCounter: state.bulletIdCounter + 1,
        });
      },

      nextWave: () => {
        const state = get();
        const newWave = state.wave + 1;

        set({
          gameState: "playing",
          wave: newWave,
          aliens: createAliens(newWave),
          alienDirection: 1,
          alienMoveTimer: Date.now(),
          playerBullets: [],
          alienBullets: [],
          mysteryShip: null,
          mysteryShipTimer: scheduleNextMysteryShip(),
          shields: createShields(), // Reset shields between waves
          explosions: [],
          playerInvincible: false,
          progress: {
            ...state.progress,
            wavesCompleted: state.progress.wavesCompleted + 1,
            highestWave: Math.max(state.progress.highestWave, newWave),
            lastModified: Date.now(),
          },
        });
      },

      update: (delta: number) => {
        const state = get();
        if (state.gameState !== "playing") return;

        const now = Date.now();
        let newPlayerBullets = [...state.playerBullets];
        let newAlienBullets = [...state.alienBullets];
        let newAliens = [...state.aliens];
        let newShields = state.shields.map((shield) => [...shield]);
        let newExplosions = [...state.explosions];
        let newMysteryShip = state.mysteryShip;
        let newScore = state.score;
        let newLives = state.lives;
        let newPlayerInvincible = state.playerInvincible;
        let newInvincibilityTimer = state.invincibilityTimer;
        let explosionIdCounter = state.explosionIdCounter;
        let bulletIdCounter = state.bulletIdCounter;
        let aliensKilledThisFrame = 0;
        let mysteryHitThisFrame = 0;

        // ============================================
        // Update player bullets
        // ============================================
        newPlayerBullets = newPlayerBullets
          .map((bullet) => ({
            ...bullet,
            y: bullet.y - BULLET.SPEED,
          }))
          .filter((bullet) => bullet.y > -BULLET.HEIGHT);

        // ============================================
        // Update alien bullets
        // ============================================
        newAlienBullets = newAlienBullets
          .map((bullet) => ({
            ...bullet,
            y: bullet.y + BULLET.SPEED * 0.6, // Alien bullets are slower
          }))
          .filter((bullet) => bullet.y < CANVAS_HEIGHT);

        // ============================================
        // Update aliens movement
        // ============================================
        const aliveAliens = newAliens.filter((a) => a.alive);
        const totalAliens = ALIEN.ROWS * ALIEN.COLS;
        const difficulty = getWaveDifficulty(state.wave);
        const baseSpeed =
          ALIEN.BASE_MOVE_SPEED * difficulty.alienSpeedMultiplier;
        const currentSpeed = getAlienSpeedForCount(
          aliveAliens.length,
          totalAliens,
          baseSpeed
        );

        // Calculate move interval based on speed
        const moveInterval = Math.max(50, 500 / currentSpeed);

        if (now - state.alienMoveTimer >= moveInterval) {
          let shouldDrop = false;
          let newDirection = state.alienDirection;

          // Check if any alive alien will hit the wall
          for (const alien of aliveAliens) {
            const nextX = alien.x + newDirection * currentSpeed * 5;
            if (nextX <= 10 || nextX >= CANVAS_WIDTH - ALIEN.WIDTH - 10) {
              shouldDrop = true;
              newDirection = (newDirection * -1) as 1 | -1;
              break;
            }
          }

          // Move aliens
          newAliens = newAliens.map((alien) => {
            if (!alien.alive) return alien;
            return {
              ...alien,
              x: shouldDrop ? alien.x : alien.x + state.alienDirection * currentSpeed * 5,
              y: shouldDrop ? alien.y + ALIEN.DROP_AMOUNT : alien.y,
              animationFrame: alien.animationFrame === 0 ? 1 : 0,
            };
          });

          set({
            alienMoveTimer: now,
            alienDirection: newDirection,
            alienAnimationFrame: state.alienAnimationFrame === 0 ? 1 : 0,
          });
        }

        // ============================================
        // Alien shooting
        // ============================================
        if (newAlienBullets.length < BULLET.MAX_ALIEN_BULLETS) {
          // Find bottom-most aliens in each column that can shoot
          const bottomAliens: Alien[] = [];
          for (let col = 0; col < ALIEN.COLS; col++) {
            const columnAliens = aliveAliens
              .filter((a) => {
                const originalCol = Math.round((a.x - ALIEN.START_X) / ALIEN.SPACING_X);
                return originalCol === col;
              })
              .sort((a, b) => b.y - a.y);
            if (columnAliens.length > 0) {
              bottomAliens.push(columnAliens[0]);
            }
          }

          // Random chance for each bottom alien to shoot
          const shootChance =
            ALIEN.SHOOT_CHANCE * difficulty.alienShootMultiplier;
          for (const alien of bottomAliens) {
            if (Math.random() < shootChance) {
              newAlienBullets.push({
                id: bulletIdCounter++,
                x: alien.x + ALIEN.WIDTH / 2 - BULLET.WIDTH / 2,
                y: alien.y + ALIEN.HEIGHT,
                isPlayerBullet: false,
              });
              break; // Only one alien shoots per frame
            }
          }
        }

        // ============================================
        // Collision: Player bullets vs Aliens
        // ============================================
        for (const bullet of newPlayerBullets) {
          for (const alien of newAliens) {
            if (!alien.alive) continue;

            if (
              bullet.x < alien.x + ALIEN.WIDTH &&
              bullet.x + BULLET.WIDTH > alien.x &&
              bullet.y < alien.y + ALIEN.HEIGHT &&
              bullet.y + BULLET.HEIGHT > alien.y
            ) {
              // Hit!
              alien.alive = false;
              newScore += ALIEN_TYPES[alien.type].points;
              aliensKilledThisFrame++;

              // Remove bullet
              newPlayerBullets = newPlayerBullets.filter((b) => b.id !== bullet.id);

              // Add explosion
              newExplosions.push({
                id: explosionIdCounter++,
                x: alien.x + ALIEN.WIDTH / 2,
                y: alien.y + ALIEN.HEIGHT / 2,
                frame: 0,
                maxFrames: 10,
              });
              break;
            }
          }
        }

        // ============================================
        // Collision: Player bullets vs Mystery Ship
        // ============================================
        if (newMysteryShip?.active) {
          for (const bullet of newPlayerBullets) {
            if (
              bullet.x < newMysteryShip.x + MYSTERY_SHIP.WIDTH &&
              bullet.x + BULLET.WIDTH > newMysteryShip.x &&
              bullet.y < MYSTERY_SHIP.Y + MYSTERY_SHIP.HEIGHT &&
              bullet.y + BULLET.HEIGHT > MYSTERY_SHIP.Y
            ) {
              // Hit mystery ship!
              newScore += newMysteryShip.points;
              mysteryHitThisFrame++;

              // Remove bullet
              newPlayerBullets = newPlayerBullets.filter((b) => b.id !== bullet.id);

              // Add explosion
              newExplosions.push({
                id: explosionIdCounter++,
                x: newMysteryShip.x + MYSTERY_SHIP.WIDTH / 2,
                y: MYSTERY_SHIP.Y + MYSTERY_SHIP.HEIGHT / 2,
                frame: 0,
                maxFrames: 15,
              });

              newMysteryShip = null;
              break;
            }
          }
        }

        // ============================================
        // Collision: Bullets vs Shields
        // ============================================
        // Player bullets
        for (const bullet of newPlayerBullets) {
          let bulletRemoved = false;
          for (let si = 0; si < newShields.length && !bulletRemoved; si++) {
            for (let bi = 0; bi < newShields[si].length && !bulletRemoved; bi++) {
              const block = newShields[si][bi];
              if (!block.active) continue;

              if (
                bullet.x < block.x + SHIELD.BLOCK_SIZE &&
                bullet.x + BULLET.WIDTH > block.x &&
                bullet.y < block.y + SHIELD.BLOCK_SIZE &&
                bullet.y + BULLET.HEIGHT > block.y
              ) {
                // Hit shield block
                newShields[si][bi].active = false;
                newPlayerBullets = newPlayerBullets.filter((b) => b.id !== bullet.id);
                bulletRemoved = true;
              }
            }
          }
        }

        // Alien bullets
        for (const bullet of newAlienBullets) {
          let bulletRemoved = false;
          for (let si = 0; si < newShields.length && !bulletRemoved; si++) {
            for (let bi = 0; bi < newShields[si].length && !bulletRemoved; bi++) {
              const block = newShields[si][bi];
              if (!block.active) continue;

              if (
                bullet.x < block.x + SHIELD.BLOCK_SIZE &&
                bullet.x + BULLET.WIDTH > block.x &&
                bullet.y < block.y + SHIELD.BLOCK_SIZE &&
                bullet.y + BULLET.HEIGHT > block.y
              ) {
                // Hit shield block
                newShields[si][bi].active = false;
                newAlienBullets = newAlienBullets.filter((b) => b.id !== bullet.id);
                bulletRemoved = true;
              }
            }
          }
        }

        // ============================================
        // Collision: Alien bullets vs Player
        // ============================================
        if (!newPlayerInvincible) {
          const playerLeft = state.playerX + PLAYER.HITBOX_PADDING;
          const playerRight = state.playerX + PLAYER.WIDTH - PLAYER.HITBOX_PADDING;
          const playerTop = PLAYER.Y + PLAYER.HITBOX_PADDING;
          const playerBottom = PLAYER.Y + PLAYER.HEIGHT;

          for (const bullet of newAlienBullets) {
            if (
              bullet.x + BULLET.WIDTH > playerLeft &&
              bullet.x < playerRight &&
              bullet.y + BULLET.HEIGHT > playerTop &&
              bullet.y < playerBottom
            ) {
              // Player hit!
              newLives--;
              newAlienBullets = newAlienBullets.filter((b) => b.id !== bullet.id);

              // Add explosion at player
              newExplosions.push({
                id: explosionIdCounter++,
                x: state.playerX + PLAYER.WIDTH / 2,
                y: PLAYER.Y + PLAYER.HEIGHT / 2,
                frame: 0,
                maxFrames: 20,
              });

              if (newLives <= 0) {
                // Game over
                const finalProgress = {
                  ...state.progress,
                  highScore: Math.max(state.progress.highScore, newScore),
                  gamesPlayed: state.progress.gamesPlayed + 1,
                  totalAliensKilled:
                    state.progress.totalAliensKilled + aliensKilledThisFrame,
                  mysteryShipsHit:
                    state.progress.mysteryShipsHit + mysteryHitThisFrame,
                  highestWave: Math.max(state.progress.highestWave, state.wave),
                  lastModified: Date.now(),
                };

                set({
                  gameState: "gameOver",
                  score: newScore,
                  lives: 0,
                  progress: finalProgress,
                });
                return;
              } else {
                // Start invincibility
                newPlayerInvincible = true;
                newInvincibilityTimer = now + 2000; // 2 seconds of invincibility
              }
              break;
            }
          }
        }

        // ============================================
        // Collision: Aliens vs Player (reach bottom)
        // ============================================
        for (const alien of aliveAliens) {
          if (alien.y + ALIEN.HEIGHT >= PLAYER.Y) {
            // Aliens reached the player - game over
            const finalProgress = {
              ...state.progress,
              highScore: Math.max(state.progress.highScore, newScore),
              gamesPlayed: state.progress.gamesPlayed + 1,
              totalAliensKilled:
                state.progress.totalAliensKilled + aliensKilledThisFrame,
              mysteryShipsHit:
                state.progress.mysteryShipsHit + mysteryHitThisFrame,
              highestWave: Math.max(state.progress.highestWave, state.wave),
              lastModified: Date.now(),
            };

            set({
              gameState: "gameOver",
              score: newScore,
              lives: 0,
              progress: finalProgress,
            });
            return;
          }
        }

        // ============================================
        // Collision: Aliens vs Shields
        // ============================================
        for (const alien of aliveAliens) {
          for (let si = 0; si < newShields.length; si++) {
            for (let bi = 0; bi < newShields[si].length; bi++) {
              const block = newShields[si][bi];
              if (!block.active) continue;

              if (
                alien.x < block.x + SHIELD.BLOCK_SIZE &&
                alien.x + ALIEN.WIDTH > block.x &&
                alien.y < block.y + SHIELD.BLOCK_SIZE &&
                alien.y + ALIEN.HEIGHT > block.y
              ) {
                // Alien destroys shield block
                newShields[si][bi].active = false;
              }
            }
          }
        }

        // ============================================
        // Update Mystery Ship
        // ============================================
        if (newMysteryShip?.active) {
          newMysteryShip = {
            ...newMysteryShip,
            x: newMysteryShip.x + MYSTERY_SHIP.SPEED * newMysteryShip.direction,
          };

          // Check if off screen
          if (
            newMysteryShip.x < -MYSTERY_SHIP.WIDTH ||
            newMysteryShip.x > CANVAS_WIDTH
          ) {
            newMysteryShip = null;
          }
        } else if (now >= state.mysteryShipTimer && aliveAliens.length > 0) {
          // Spawn new mystery ship
          const direction = Math.random() > 0.5 ? 1 : -1;
          newMysteryShip = {
            x: direction === 1 ? -MYSTERY_SHIP.WIDTH : CANVAS_WIDTH,
            direction: direction as 1 | -1,
            points:
              MYSTERY_SHIP.POINTS[
                Math.floor(Math.random() * MYSTERY_SHIP.POINTS.length)
              ],
            active: true,
          };
          set({ mysteryShipTimer: scheduleNextMysteryShip() });
        }

        // ============================================
        // Update Explosions
        // ============================================
        newExplosions = newExplosions
          .map((exp) => ({ ...exp, frame: exp.frame + 1 }))
          .filter((exp) => exp.frame < exp.maxFrames);

        // ============================================
        // Update Invincibility
        // ============================================
        if (newPlayerInvincible && now >= newInvincibilityTimer) {
          newPlayerInvincible = false;
        }

        // ============================================
        // Check Wave Complete
        // ============================================
        const remainingAliens = newAliens.filter((a) => a.alive);
        if (remainingAliens.length === 0) {
          set({
            gameState: "waveComplete",
            score: newScore,
            aliens: newAliens,
            playerBullets: [],
            alienBullets: [],
            shields: newShields,
            explosions: newExplosions,
            mysteryShip: null,
            progress: {
              ...state.progress,
              totalAliensKilled:
                state.progress.totalAliensKilled + aliensKilledThisFrame,
              mysteryShipsHit:
                state.progress.mysteryShipsHit + mysteryHitThisFrame,
              highScore: Math.max(state.progress.highScore, newScore),
              lastModified: Date.now(),
            },
          });
          return;
        }

        // ============================================
        // Commit State
        // ============================================
        set({
          score: newScore,
          lives: newLives,
          aliens: newAliens,
          playerBullets: newPlayerBullets,
          alienBullets: newAlienBullets,
          shields: newShields,
          explosions: newExplosions,
          mysteryShip: newMysteryShip,
          explosionIdCounter,
          bulletIdCounter,
          playerInvincible: newPlayerInvincible,
          invincibilityTimer: newInvincibilityTimer,
          progress: {
            ...state.progress,
            totalAliensKilled:
              state.progress.totalAliensKilled + aliensKilledThisFrame,
            mysteryShipsHit:
              state.progress.mysteryShipsHit + mysteryHitThisFrame,
            highScore: Math.max(state.progress.highScore, newScore),
            lastModified: Date.now(),
          },
        });
      },

      // ============================================
      // Progress Sync
      // ============================================
      getProgress: () => get().progress,
      setProgress: (data) => set({ progress: data }),

      setSoundEnabled: (enabled: boolean) => {
        set((state) => ({
          progress: {
            ...state.progress,
            settings: {
              ...state.progress.settings,
              soundEnabled: enabled,
            },
            lastModified: Date.now(),
          },
        }));
      },

      setDifficulty: (difficulty: "easy" | "normal" | "hard") => {
        set((state) => ({
          progress: {
            ...state.progress,
            settings: {
              ...state.progress.settings,
              difficulty,
            },
            lastModified: Date.now(),
          },
        }));
      },
    }),
    {
      name: "space-invaders-progress",
      partialize: (state) => ({ progress: state.progress }),
    }
  )
);
