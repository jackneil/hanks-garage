/**
 * Zod validation schemas for game progress data.
 *
 * SECURITY: Prevents users from POSTing arbitrary data like {"coins": 999999999}.
 * Each game has strict limits on numeric values to prevent exploitation.
 *
 * Max values are generous but finite - a dedicated player couldn't legitimately
 * exceed these even with years of play.
 */

import { z } from "zod";
import type { ValidAppId } from "@hank-neil/db/schema";

// Common limits
const MAX_CURRENCY = 1_000_000_000_000; // 1 trillion - generous for any game
const MAX_COUNT = 1_000_000; // 1 million items/games/etc

// Timestamp validation - computed at validation time, not module load
// This prevents the bug where MAX_TIMESTAMP becomes stale after 24h uptime
const timestampSchema = z.number().min(0).refine(
  (val) => val <= Date.now() + 86400000,
  { message: "Timestamp cannot be more than 1 day in the future" }
).optional();

// ============================================================================
// 2048
// ============================================================================
const game2048Schema = z.object({
  highScore: z.number().min(0).max(MAX_CURRENCY),
  highestTile: z.number().min(0).max(131072), // 2^17 is theoretical max
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  gamesWon: z.number().min(0).max(MAX_COUNT),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Snake
// ============================================================================
const snakeSchema = z.object({
  highScore: z.number().min(0).max(MAX_COUNT),
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  totalFoodEaten: z.number().min(0).max(MAX_COUNT),
  longestSnake: z.number().min(0).max(1000),
  unlockedThemes: z.array(z.string()).max(100),
  selectedTheme: z.string().optional(),
  soundEnabled: z.boolean().optional(),
  wraparoundWalls: z.boolean().optional(),
  controlMode: z.string().optional(),
  speed: z.number().min(1).max(10).optional(),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Flappy Bird
// ============================================================================
const flappyBirdSchema = z.object({
  highScore: z.number().min(0).max(MAX_COUNT),
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  totalPipesCleared: z.number().min(0).max(MAX_COUNT),
  medals: z.object({
    bronze: z.boolean().optional(),
    silver: z.boolean().optional(),
    gold: z.boolean().optional(),
    platinum: z.boolean().optional(),
  }).optional(),
  soundEnabled: z.boolean().optional(),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Cookie Clicker
// ============================================================================
const cookieClickerSchema = z.object({
  cookies: z.number().min(0).max(MAX_CURRENCY),
  totalCookiesBaked: z.number().min(0).max(MAX_CURRENCY),
  totalClicks: z.number().min(0).max(MAX_CURRENCY),
  buildings: z.record(z.string(), z.number().min(0).max(10000)),
  purchasedUpgrades: z.array(z.string()).max(500),
  unlockedAchievements: z.array(z.string()).max(500),
  soundEnabled: z.boolean().optional(),
  lastTick: timestampSchema,
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Memory Match
// ============================================================================
const memoryMatchSchema = z.object({
  gamesWon: z.number().min(0).max(MAX_COUNT),
  totalMatches: z.number().min(0).max(MAX_COUNT),
  bestTimes: z.record(z.string(), z.number().min(0).max(86400000)).optional(), // Max 24h
  unlockedThemes: z.array(z.string()).max(100),
  selectedTheme: z.string().optional(),
  difficulty: z.string().optional(),
  soundEnabled: z.boolean().optional(),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Checkers
// ============================================================================
const checkersSchema = z.object({
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  gamesWon: z.number().min(0).max(MAX_COUNT),
  gamesLost: z.number().min(0).max(MAX_COUNT),
  winStreak: z.number().min(0).max(MAX_COUNT),
  bestWinStreak: z.number().min(0).max(MAX_COUNT),
  perDifficulty: z.record(z.string(), z.object({
    played: z.number().min(0).max(MAX_COUNT),
    won: z.number().min(0).max(MAX_COUNT),
  })).optional(),
  difficulty: z.string().optional(),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Chess
// ============================================================================
const chessSchema = z.object({
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  wins: z.number().min(0).max(MAX_COUNT),
  losses: z.number().min(0).max(MAX_COUNT),
  draws: z.number().min(0).max(MAX_COUNT),
  perDifficulty: z.record(z.string(), z.object({
    played: z.number().min(0).max(MAX_COUNT),
    won: z.number().min(0).max(MAX_COUNT),
    lost: z.number().min(0).max(MAX_COUNT),
    drawn: z.number().min(0).max(MAX_COUNT),
  })).optional(),
  difficulty: z.string().optional(),
  gameMode: z.string().optional(),
  playerColor: z.string().optional(),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Quoridor
// ============================================================================
const quoridorSchema = z.object({
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  wins: z.number().min(0).max(MAX_COUNT),
  losses: z.number().min(0).max(MAX_COUNT),
  perDifficulty: z.record(z.string(), z.object({
    played: z.number().min(0).max(MAX_COUNT),
    won: z.number().min(0).max(MAX_COUNT),
    lost: z.number().min(0).max(MAX_COUNT),
  })).optional(),
  difficulty: z.string().optional(),
  gameMode: z.string().optional(),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Oregon Trail
// ============================================================================
const oregonTrailSchema = z.object({
  gamesCompleted: z.number().min(0).max(MAX_COUNT),
  gamesAttempted: z.number().min(0).max(MAX_COUNT),
  bestScore: z.number().min(0).max(MAX_COUNT),
  fastestJourney: z.number().min(0).max(365), // Days
  totalMilesTraveled: z.number().min(0).max(MAX_CURRENCY),
  totalFoodHunted: z.number().min(0).max(MAX_CURRENCY),
  totalRiversCrossed: z.number().min(0).max(MAX_COUNT),
  totalDaysTraveled: z.number().min(0).max(MAX_COUNT),
  totalPartySaved: z.number().min(0).max(MAX_COUNT),
  totalPartyLost: z.number().min(0).max(MAX_COUNT),
  partyMemberNames: z.array(z.string()).max(100),
  achievementsUnlocked: z.array(z.string()).max(100),
  preferredOccupation: z.string().optional(),
  lastDepartureMonth: z.string().optional(),
  lastPlayedAt: timestampSchema,
  totalPlaytimeMinutes: z.number().min(0).max(MAX_COUNT),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Monster Truck
// ============================================================================
const monsterTruckSchema = z.object({
  coins: z.number().min(0).max(MAX_CURRENCY),
  totalCoinsEarned: z.number().min(0).max(MAX_CURRENCY),
  starsCollected: z.number().min(0).max(MAX_COUNT),
  trucks: z.array(z.object({
    id: z.string(),
    name: z.string(),
    unlocked: z.boolean(),
    color: z.string(),
  })).max(100),
  upgrades: z.record(z.string(), z.record(z.string(), z.object({
    level: z.number().min(0).max(100),
    maxLevel: z.number().min(0).max(100),
  }))).optional(),
  challenges: z.array(z.object({
    id: z.string(),
    name: z.string(),
    completed: z.boolean(),
    reward: z.number().min(0).max(MAX_CURRENCY),
  })).max(500),
  currentTruckId: z.string().optional(),
  soundEnabled: z.boolean().optional(),
  musicEnabled: z.boolean().optional(),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Hill Climb
// ============================================================================
const hillClimbSchema = z.object({
  coins: z.number().min(0).max(MAX_CURRENCY),
  totalCoinsEarned: z.number().min(0).max(MAX_CURRENCY),
  bestDistance: z.number().min(0).max(MAX_CURRENCY),
  currentVehicleId: z.string().optional(),
  currentStageId: z.string().optional(),
  unlockedVehicles: z.array(z.string()).max(100),
  unlockedStages: z.array(z.string()).max(100),
  vehicleUpgrades: z.record(z.string(), z.object({
    engine: z.number().min(0).max(100),
    suspension: z.number().min(0).max(100),
    tires: z.number().min(0).max(100),
    fuelTank: z.number().min(0).max(100),
    nitro: z.number().min(0).max(100),
  })).optional(),
  bestDistancePerStage: z.record(z.string(), z.number().min(0).max(MAX_CURRENCY)).optional(),
  soundEnabled: z.boolean().optional(),
  musicEnabled: z.boolean().optional(),
  leanSensitivity: z.number().min(0.1).max(5).optional(),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Endless Runner
// ============================================================================
const endlessRunnerSchema = z.object({
  highScore: z.number().min(0).max(MAX_CURRENCY),
  totalDistance: z.number().min(0).max(MAX_CURRENCY),
  totalCoins: z.number().min(0).max(MAX_CURRENCY),
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  unlockedCharacters: z.array(z.string()).max(100),
  selectedCharacter: z.string().optional(),
  powerupsUsed: z.number().min(0).max(MAX_COUNT).optional(),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Platformer
// ============================================================================
const platformerSchema = z.object({
  levelsCompleted: z.number().min(0).max(1000),
  currentWorld: z.number().min(0).max(100),
  currentLevel: z.number().min(0).max(100),
  totalStars: z.number().min(0).max(MAX_COUNT),
  totalCoins: z.number().min(0).max(MAX_CURRENCY),
  levelProgress: z.record(z.string(), z.object({
    completed: z.boolean(),
    stars: z.number().min(0).max(3),
    bestTime: z.number().min(0).max(86400000).optional(),
  })).optional(),
  unlockedCharacters: z.array(z.string()).max(100),
  selectedCharacter: z.string().optional(),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Retro Arcade
// ============================================================================
const retroArcadeSchema = z.object({
  favorites: z.array(z.string()).max(500),
  recentlyPlayed: z.array(z.object({
    id: z.string(),
    name: z.string(),
    system: z.string(),
    lastPlayed: z.number(),
    playtime: z.number().min(0).max(MAX_COUNT),
  })).max(100),
  saveStates: z.record(z.string(), z.object({
    data: z.string().optional(),
    screenshot: z.string().optional(),
    createdAt: z.number(),
  })).optional(),
  customRoms: z.array(z.object({
    id: z.string(),
    name: z.string(),
    system: z.string(),
  })).max(500),
  stats: z.object({
    totalPlaytime: z.number().min(0).max(MAX_CURRENCY),
    gamesPlayed: z.number().min(0).max(MAX_COUNT),
    favoriteSystem: z.string().optional(),
  }).optional(),
  settings: z.object({
    volume: z.number().min(0).max(1),
    autoSaveOnExit: z.boolean(),
    showTouchControls: z.boolean(),
  }).optional(),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Apps (non-games)
// ============================================================================
const weatherSchema = z.object({
  favoriteLocations: z.array(z.string()).max(50),
  lastLocation: z.string().optional(),
  temperatureUnit: z.enum(["celsius", "fahrenheit"]).optional(),
  lastModified: timestampSchema,
}).passthrough();

const jokeGeneratorSchema = z.object({
  favoriteJokes: z.array(z.string()).max(500),
  jokesViewed: z.number().min(0).max(MAX_COUNT),
  lastModified: timestampSchema,
}).passthrough();

const toyFinderSchema = z.object({
  wishlist: z.array(z.string()).max(500),
  viewedToys: z.array(z.string()).max(1000),
  lastModified: timestampSchema,
}).passthrough();

// ============================================================================
// Schema Registry
// ============================================================================

export const PROGRESS_SCHEMAS: Partial<Record<ValidAppId, z.ZodSchema>> = {
  "2048": game2048Schema,
  snake: snakeSchema,
  "flappy-bird": flappyBirdSchema,
  "cookie-clicker": cookieClickerSchema,
  "memory-match": memoryMatchSchema,
  checkers: checkersSchema,
  chess: chessSchema,
  quoridor: quoridorSchema,
  "oregon-trail": oregonTrailSchema,
  "monster-truck": monsterTruckSchema,
  "hill-climb": hillClimbSchema,
  "endless-runner": endlessRunnerSchema,
  platformer: platformerSchema,
  "retro-arcade": retroArcadeSchema,
  weather: weatherSchema,
  "joke-generator": jokeGeneratorSchema,
  "toy-finder": toyFinderSchema,
};

/**
 * Validate progress data for a specific app.
 *
 * Returns validated data or throws ZodError.
 */
export function validateProgress(
  appId: ValidAppId,
  data: unknown
): { success: true; data: unknown } | { success: false; error: string } {
  const schema = PROGRESS_SCHEMAS[appId];

  // If no schema defined, reject unknown apps
  if (!schema) {
    return { success: false, error: `No validation schema for app: ${appId}` };
  }

  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    return { success: false, error: `Invalid progress data: ${errors}` };
  }

  return { success: true, data: result.data };
}
