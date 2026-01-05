import { z } from "zod";

/**
 * Score type enum - determines sort direction and display format
 */
export const scoreTypeSchema = z.enum(["high_score", "wins", "fastest_time"]);
export type ScoreType = z.infer<typeof scoreTypeSchema>;

/**
 * Validation schema for leaderboard entry data
 * Used to validate extracted scores before DB insert
 */
export const leaderboardEntrySchema = z.object({
  score: z.number().min(0).max(1_000_000_000_000), // MAX_CURRENCY
  scoreType: scoreTypeSchema,
  additionalStats: z
    .record(z.string().max(50), z.union([z.number(), z.string().max(100)]))
    .optional()
    .refine((obj) => !obj || Object.keys(obj).length <= 10, {
      message: "Max 10 additional stats",
    }),
});

export type LeaderboardEntryData = z.infer<typeof leaderboardEntrySchema>;

/**
 * Query params for GET /api/leaderboards/[appId]
 */
export const leaderboardQuerySchema = z.object({
  period: z.enum(["all", "week", "month"]).default("all"),
  limit: z.coerce.number().min(1).max(100).default(100), // Capped at 100
  offset: z.coerce.number().min(0).default(0),
  includeMe: z.coerce.boolean().default(false),
});

export type LeaderboardQuery = z.infer<typeof leaderboardQuerySchema>;

/**
 * Handle validation (for future customization if enabled)
 */
export const handleSchema = z
  .string()
  .min(3)
  .max(35) // Allow for suffix
  .regex(/^[a-zA-Z0-9_]+$/, "Handle must be alphanumeric");

/**
 * Time periods for leaderboard filtering
 */
export const TIME_PERIODS = {
  all: null, // No filter
  week: 7, // Last 7 days
  month: 30, // Last 30 days
} as const;

export type TimePeriod = keyof typeof TIME_PERIODS;
