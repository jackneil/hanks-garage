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
const MAX_STRING_LENGTH = 255; // Max length for string fields
const MAX_RECORD_KEYS = 100; // Max keys in a record/object

// Bounded string helper - all strings have max length
const boundedString = z.string().max(MAX_STRING_LENGTH);

// Timestamp validation - computed at validation time, not module load
// This prevents the bug where MAX_TIMESTAMP becomes stale after 24h uptime
const timestampSchema = z.number().min(0).refine(
  (val) => val <= Date.now() + 86400000,
  { message: "Timestamp cannot be more than 1 day in the future" }
).optional();

// Helper to create a bounded record (limits number of keys)
const boundedRecord = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.record(boundedString, valueSchema).refine(
    (obj) => Object.keys(obj).length <= MAX_RECORD_KEYS,
    { message: `Too many entries (max ${MAX_RECORD_KEYS})` }
  );

// ============================================================================
// 2048
// ============================================================================
const game2048Schema = z.object({
  highScore: z.number().min(0).max(MAX_CURRENCY),
  highestTile: z.number().min(0).max(131072), // 2^17 is theoretical max
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  gamesWon: z.number().min(0).max(MAX_COUNT),
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Snake
// ============================================================================
const snakeSchema = z.object({
  highScore: z.number().min(0).max(MAX_COUNT),
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  totalFoodEaten: z.number().min(0).max(MAX_COUNT),
  longestSnake: z.number().min(0).max(1000),
  soundEnabled: z.boolean().optional(),
  wraparoundWalls: z.boolean().optional(),
  controlMode: boundedString.optional(),
  speed: z.enum(["slow", "medium", "fast"]).optional(),
  lastModified: timestampSchema,
}).strict();

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
}).strict();

// ============================================================================
// Cookie Clicker
// ============================================================================
const cookieClickerSchema = z.object({
  cookies: z.number().min(0).max(MAX_CURRENCY),
  totalCookiesBaked: z.number().min(0).max(MAX_CURRENCY),
  totalClicks: z.number().min(0).max(MAX_CURRENCY),
  buildings: boundedRecord(z.number().min(0).max(10000)),
  purchasedUpgrades: z.array(boundedString).max(500),
  unlockedAchievements: z.array(boundedString).max(500),
  soundEnabled: z.boolean().optional(),
  lastTick: timestampSchema,
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Memory Match
// ============================================================================
const memoryMatchSchema = z.object({
  gamesWon: z.number().min(0).max(MAX_COUNT),
  totalMatches: z.number().min(0).max(MAX_COUNT),
  bestTimes: boundedRecord(z.number().min(0).max(86400000)).optional(), // Max 24h
  unlockedThemes: z.array(boundedString).max(100),
  selectedTheme: boundedString.optional(),
  difficulty: boundedString.optional(),
  soundEnabled: z.boolean().optional(),
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Checkers
// ============================================================================
const checkersSchema = z.object({
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  gamesWon: z.number().min(0).max(MAX_COUNT),
  gamesLost: z.number().min(0).max(MAX_COUNT),
  winStreak: z.number().min(0).max(MAX_COUNT),
  bestWinStreak: z.number().min(0).max(MAX_COUNT),
  perDifficulty: boundedRecord(z.object({
    played: z.number().min(0).max(MAX_COUNT),
    won: z.number().min(0).max(MAX_COUNT),
  })).optional(),
  difficulty: boundedString.optional(),
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Chess
// ============================================================================
const chessSchema = z.object({
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  wins: z.number().min(0).max(MAX_COUNT),
  losses: z.number().min(0).max(MAX_COUNT),
  draws: z.number().min(0).max(MAX_COUNT),
  perDifficulty: boundedRecord(z.object({
    played: z.number().min(0).max(MAX_COUNT),
    won: z.number().min(0).max(MAX_COUNT),
    lost: z.number().min(0).max(MAX_COUNT),
    drawn: z.number().min(0).max(MAX_COUNT),
  })).optional(),
  difficulty: boundedString.optional(),
  gameMode: boundedString.optional(),
  playerColor: boundedString.optional(),
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Quoridor
// ============================================================================
const quoridorSchema = z.object({
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  wins: z.number().min(0).max(MAX_COUNT),
  losses: z.number().min(0).max(MAX_COUNT),
  perDifficulty: boundedRecord(z.object({
    played: z.number().min(0).max(MAX_COUNT),
    won: z.number().min(0).max(MAX_COUNT),
    lost: z.number().min(0).max(MAX_COUNT),
  })).optional(),
  difficulty: boundedString.optional(),
  gameMode: boundedString.optional(),
  lastModified: timestampSchema,
}).strict();

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
  partyMemberNames: z.array(boundedString).max(100),
  achievementsUnlocked: z.array(boundedString).max(100),
  preferredOccupation: boundedString.optional(),
  lastDepartureMonth: boundedString.optional(),
  lastPlayedAt: timestampSchema,
  totalPlaytimeMinutes: z.number().min(0).max(MAX_COUNT),
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Monster Truck
// ============================================================================
const monsterTruckSchema = z.object({
  coins: z.number().min(0).max(MAX_CURRENCY),
  totalCoinsEarned: z.number().min(0).max(MAX_CURRENCY),
  starsCollected: z.number().min(0).max(MAX_COUNT),
  trucks: z.array(z.object({
    id: boundedString,
    name: boundedString,
    unlocked: z.boolean(),
    color: boundedString,
  })).max(100),
  upgrades: boundedRecord(boundedRecord(z.object({
    level: z.number().min(0).max(100),
    maxLevel: z.number().min(0).max(100),
  }))).optional(),
  challenges: z.array(z.object({
    id: boundedString,
    name: boundedString,
    completed: z.boolean(),
    reward: z.number().min(0).max(MAX_CURRENCY),
  })).max(500),
  currentTruckId: boundedString.optional(),
  soundEnabled: z.boolean().optional(),
  musicEnabled: z.boolean().optional(),
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Hill Climb
// ============================================================================
const hillClimbSchema = z.object({
  coins: z.number().min(0).max(MAX_CURRENCY),
  totalCoinsEarned: z.number().min(0).max(MAX_CURRENCY),
  bestDistance: z.number().min(0).max(MAX_CURRENCY),
  currentVehicleId: boundedString.optional(),
  currentStageId: boundedString.optional(),
  unlockedVehicles: z.array(boundedString).max(100),
  unlockedStages: z.array(boundedString).max(100),
  vehicleUpgrades: boundedRecord(z.object({
    engine: z.number().min(0).max(100),
    suspension: z.number().min(0).max(100),
    tires: z.number().min(0).max(100),
    fuelTank: z.number().min(0).max(100),
    nitro: z.number().min(0).max(100),
  })).optional(),
  bestDistancePerStage: boundedRecord(z.number().min(0).max(MAX_CURRENCY)).optional(),
  soundEnabled: z.boolean().optional(),
  musicEnabled: z.boolean().optional(),
  leanSensitivity: z.number().min(0.1).max(5).optional(),
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Endless Runner
// ============================================================================
const endlessRunnerSchema = z.object({
  highScore: z.number().min(0).max(MAX_CURRENCY),
  totalDistance: z.number().min(0).max(MAX_CURRENCY),
  totalCoins: z.number().min(0).max(MAX_CURRENCY),
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  unlockedCharacters: z.array(boundedString).max(100),
  selectedCharacter: boundedString.optional(),
  powerupsUsed: z.number().min(0).max(MAX_COUNT).optional(),
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Platformer
// ============================================================================
const platformerSchema = z.object({
  levelsCompleted: z.number().min(0).max(1000),
  currentWorld: z.number().min(0).max(100),
  currentLevel: z.number().min(0).max(100),
  totalStars: z.number().min(0).max(MAX_COUNT),
  totalCoins: z.number().min(0).max(MAX_CURRENCY),
  levelProgress: boundedRecord(z.object({
    completed: z.boolean(),
    stars: z.number().min(0).max(3),
    bestTime: z.number().min(0).max(86400000).optional(),
  })).optional(),
  unlockedCharacters: z.array(boundedString).max(100),
  selectedCharacter: boundedString.optional(),
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Retro Arcade
// ============================================================================
const retroArcadeSchema = z.object({
  favorites: z.array(boundedString).max(500),
  recentlyPlayed: z.array(z.object({
    id: boundedString,
    name: boundedString,
    system: boundedString,
    lastPlayed: z.number(),
    playtime: z.number().min(0).max(MAX_COUNT),
  })).max(100),
  saveStates: boundedRecord(z.object({
    data: z.string().max(1_000_000).optional(), // 1MB max for save state data
    screenshot: z.string().max(500_000).optional(), // 500KB max for screenshot
    createdAt: z.number(),
  })).optional(),
  customRoms: z.array(z.object({
    id: boundedString,
    name: boundedString,
    system: boundedString,
  })).max(500),
  stats: z.object({
    totalPlaytime: z.number().min(0).max(MAX_CURRENCY),
    gamesPlayed: z.number().min(0).max(MAX_COUNT),
    favoriteSystem: boundedString.optional(),
  }).optional(),
  settings: z.object({
    volume: z.number().min(0).max(1),
    autoSaveOnExit: z.boolean(),
    showTouchControls: z.boolean(),
  }).optional(),
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Apps (non-games)
// ============================================================================
const weatherSchema = z.object({
  favoriteLocations: z.array(boundedString).max(50),
  lastLocation: boundedString.optional(),
  temperatureUnit: z.enum(["celsius", "fahrenheit"]).optional(),
  lastModified: timestampSchema,
}).strict();

const jokeGeneratorSchema = z.object({
  favoriteJokes: z.array(z.string().max(2000)).max(500), // Jokes can be longer
  jokesViewed: z.number().min(0).max(MAX_COUNT),
  lastModified: timestampSchema,
}).strict();

const toyFinderSchema = z.object({
  wishlist: z.array(boundedString).max(500),
  viewedToys: z.array(boundedString).max(1000),
  lastModified: timestampSchema,
}).strict();

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
