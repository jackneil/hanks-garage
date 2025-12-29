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
  totalPipes: z.number().min(0).max(MAX_COUNT),
  medals: z.object({
    bronze: z.number().min(0).max(MAX_COUNT),
    silver: z.number().min(0).max(MAX_COUNT),
    gold: z.number().min(0).max(MAX_COUNT),
    platinum: z.number().min(0).max(MAX_COUNT),
  }),
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
  updatedAt: timestampSchema,
  bestTimes: z.object({
    easy: z.number().min(0).max(86400000).nullable(),
    medium: z.number().min(0).max(86400000).nullable(),
    hard: z.number().min(0).max(86400000).nullable(),
    expert: z.number().min(0).max(86400000).nullable(),
  }),
  totalMatches: z.number().min(0).max(MAX_COUNT),
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  gamesWon: z.number().min(0).max(MAX_COUNT),
  perfectGames: z.number().min(0).max(MAX_COUNT),
  favoriteTheme: boundedString,
  soundEnabled: z.boolean(),
  unlockedThemes: z.array(boundedString).max(100),
  difficulty: boundedString,
  theme: boundedString,
}).strict();

// ============================================================================
// Checkers
// ============================================================================
const checkersSchema = z.object({
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  gamesWon: z.number().min(0).max(MAX_COUNT),
  gamesLost: z.number().min(0).max(MAX_COUNT),
  totalPiecesCaptured: z.number().min(0).max(MAX_COUNT),
  totalKingsEarned: z.number().min(0).max(MAX_COUNT),
  longestJumpChain: z.number().min(0).max(MAX_COUNT),
  currentWinStreak: z.number().min(0).max(MAX_COUNT),
  bestWinStreak: z.number().min(0).max(MAX_COUNT),
  easyWins: z.number().min(0).max(MAX_COUNT),
  easyLosses: z.number().min(0).max(MAX_COUNT),
  mediumWins: z.number().min(0).max(MAX_COUNT),
  mediumLosses: z.number().min(0).max(MAX_COUNT),
  hardWins: z.number().min(0).max(MAX_COUNT),
  hardLosses: z.number().min(0).max(MAX_COUNT),
  difficulty: boundedString,
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Chess
// ============================================================================
const chessSchema = z.object({
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  gamesWon: z.number().min(0).max(MAX_COUNT),
  gamesLost: z.number().min(0).max(MAX_COUNT),
  gamesDrawn: z.number().min(0).max(MAX_COUNT),
  totalPiecesCaptured: z.number().min(0).max(MAX_COUNT),
  totalCheckmates: z.number().min(0).max(MAX_COUNT),
  currentWinStreak: z.number().min(0).max(MAX_COUNT),
  bestWinStreak: z.number().min(0).max(MAX_COUNT),
  easyWins: z.number().min(0).max(MAX_COUNT),
  easyLosses: z.number().min(0).max(MAX_COUNT),
  mediumWins: z.number().min(0).max(MAX_COUNT),
  mediumLosses: z.number().min(0).max(MAX_COUNT),
  hardWins: z.number().min(0).max(MAX_COUNT),
  hardLosses: z.number().min(0).max(MAX_COUNT),
  difficulty: boundedString,
  gameMode: boundedString,
  playerColor: z.enum(["white", "black"]),
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Quoridor
// ============================================================================
const quoridorSchema = z.object({
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  gamesWon: z.number().min(0).max(MAX_COUNT),
  gamesLost: z.number().min(0).max(MAX_COUNT),
  currentWinStreak: z.number().min(0).max(MAX_COUNT),
  bestWinStreak: z.number().min(0).max(MAX_COUNT),
  totalWallsPlaced: z.number().min(0).max(MAX_COUNT),
  totalMovesToWin: z.number().min(0).max(MAX_COUNT),
  fastestWin: z.number().min(0).max(MAX_COUNT).nullable(),
  difficulty: boundedString,
  gameMode: boundedString,
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Oregon Trail
// ============================================================================
// NOTE: Oregon Trail syncs FULL GAME STATE (not aggregate stats) to allow
// players to continue their journey across devices
const partyMemberSchema = z.object({
  name: boundedString,
  health: z.enum(["good", "fair", "poor", "very poor"]),
  isSick: z.boolean(),
  sickDays: z.number().min(0).max(365),
  leftBehind: z.boolean(),
});

const suppliesSchema = z.object({
  food: z.number().min(0).max(MAX_COUNT),
  oxen: z.number().min(0).max(100),
  clothing: z.number().min(0).max(1000),
  ammunition: z.number().min(0).max(MAX_COUNT),
  spareParts: z.object({
    wheels: z.number().min(0).max(100),
    axles: z.number().min(0).max(100),
    tongues: z.number().min(0).max(100),
  }),
  money: z.number().min(0).max(MAX_CURRENCY),
});

const oregonTrailSchema = z.object({
  // Game phase and state
  gamePhase: boundedString, // "title" | "setup" | "store" | "travel" | etc
  gameStarted: z.boolean(),
  leaderName: boundedString,
  occupation: boundedString, // "banker" | "carpenter" | "farmer"
  party: z.array(partyMemberSchema).max(5),
  departureMonth: boundedString, // "march" | "april" | etc
  // Progress
  currentDay: z.number().min(0).max(365),
  milesTraveled: z.number().min(0).max(MAX_COUNT),
  currentLandmarkIndex: z.number().min(0).max(100),
  pace: boundedString, // "steady" | "strenuous" | "grueling"
  // Resources
  supplies: suppliesSchema,
  weather: boundedString, // "clear" | "rain" | "snow" | "storm"
  // Event state (nullable for when no event is active)
  currentEvent: z.any().nullable(), // Complex event objects, validated loosely
  currentRiver: z.object({
    name: boundedString,
    depth: z.number().min(0).max(20),
  }).nullable(),
  // Session stats
  huntingFood: z.number().min(0).max(MAX_COUNT),
  huntingAmmoUsed: z.number().min(0).max(MAX_COUNT),
  daysRested: z.number().min(0).max(365),
  foodHunted: z.number().min(0).max(MAX_COUNT),
  riversCrossed: z.number().min(0).max(100),
  eventsEncountered: z.number().min(0).max(MAX_COUNT),
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Monster Truck
// ============================================================================
const truckUpgradeSchema = z.object({
  level: z.number().min(0).max(100),
  maxLevel: z.number().min(0).max(100),
  costs: z.array(z.number().min(0).max(MAX_CURRENCY)).max(20),
});

const monsterTruckSchema = z.object({
  coins: z.number().min(0).max(MAX_CURRENCY),
  totalCoinsEarned: z.number().min(0).max(MAX_CURRENCY),
  currentTruckId: boundedString,
  trucks: z.array(z.object({
    id: boundedString,
    name: boundedString,
    cost: z.number().min(0).max(MAX_CURRENCY),
    description: boundedString,
    baseStats: z.object({
      engine: z.number().min(0).max(10),
      suspension: z.number().min(0).max(10),
      tires: z.number().min(0).max(10),
      nos: z.number().min(0).max(10),
    }),
    color: boundedString,
    unlocked: z.boolean(),
  })).max(100),
  upgrades: boundedRecord(z.object({
    engine: truckUpgradeSchema,
    suspension: truckUpgradeSchema,
    tires: truckUpgradeSchema,
    nos: truckUpgradeSchema,
  })),
  customization: boundedRecord(z.object({
    paintColor: boundedString,
    decal: boundedString.nullable(),
  })),
  starsCollected: z.number().min(0).max(MAX_COUNT),
  challenges: z.array(z.object({
    id: boundedString,
    name: boundedString,
    description: boundedString,
    type: z.enum(["time", "collection", "stunt", "destruction"]),
    target: z.number().min(0).max(MAX_COUNT),
    reward: z.number().min(0).max(MAX_CURRENCY),
    completed: z.boolean(),
  })).max(500),
  soundEnabled: z.boolean(),
  musicEnabled: z.boolean(),
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
  coinsCollected: z.number().min(0).max(MAX_CURRENCY),
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  unlockedCharacters: z.array(boundedString).max(100),
  selectedCharacter: boundedString,
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Platformer
// ============================================================================
const platformerSchema = z.object({
  levels: boundedRecord(z.object({
    completed: z.boolean(),
    starsCollected: z.number().min(0).max(3),
    bestTime: z.number().min(0).max(86400000).nullable(),
    coinsCollected: z.number().min(0).max(MAX_COUNT),
  })),
  totalStars: z.number().min(0).max(MAX_COUNT),
  totalCoins: z.number().min(0).max(MAX_CURRENCY),
  gamesPlayed: z.number().min(0).max(MAX_COUNT),
  totalDeaths: z.number().min(0).max(MAX_COUNT),
  totalJumps: z.number().min(0).max(MAX_CURRENCY),
  lastPlayedLevel: boundedString.nullable(),
  lastModified: timestampSchema,
}).strict();

// ============================================================================
// Retro Arcade
// ============================================================================
const retroArcadeSchema = z.object({
  favorites: z.array(boundedString).max(500),
  recentlyPlayed: z.array(z.object({
    gameId: boundedString,
    name: boundedString,
    system: boundedString,
    lastPlayed: z.number(),
  })).max(100),
  saveStates: boundedRecord(z.object({
    slot1: z.string().max(1_000_000).optional(),
    slot2: z.string().max(1_000_000).optional(),
    slot3: z.string().max(1_000_000).optional(),
    autoSave: z.string().max(1_000_000).optional(),
    lastSaved: z.number(),
  })),
  customRoms: z.array(z.object({
    id: boundedString,
    name: boundedString,
    system: boundedString,
    addedAt: z.number(),
  })).max(500),
  stats: z.object({
    totalPlayTime: z.number().min(0).max(MAX_CURRENCY),
    gamesPlayed: z.number().min(0).max(MAX_COUNT),
    favoriteSystem: boundedString,
    lastPlayedAt: z.number(),
  }),
  settings: z.object({
    volume: z.number().min(0).max(1),
    autoSaveOnExit: z.boolean(),
    showTouchControls: z.boolean(),
  }),
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
