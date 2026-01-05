import {
  pgTable,
  text,
  bigint,
  boolean,
  timestamp,
  jsonb,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

/**
 * Gaming Profiles - User's public gaming identity
 * Auto-generated handles like "TurboRacer42" for privacy
 * Handle is consistent across all games (builds reputation)
 */
export const gamingProfiles = pgTable(
  "gaming_profiles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    handle: text("handle").notNull().unique(),
    showOnLeaderboards: boolean("show_on_leaderboards").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("gaming_profiles_user_idx").on(table.userId),
    index("gaming_profiles_handle_idx").on(table.handle),
  ]
);

/**
 * Leaderboard Entries - Denormalized scores for fast queries
 * One entry per user per game per score type
 * Only stores best score (auto-updates on progress save)
 */
export const leaderboardEntries = pgTable(
  "leaderboard_entries",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    gamingProfileId: text("gaming_profile_id")
      .notNull()
      .references(() => gamingProfiles.id, { onDelete: "cascade" }),
    appId: text("app_id").notNull(),
    score: bigint("score", { mode: "number" }).notNull(),
    scoreType: text("score_type").notNull().default("high_score"), // 'high_score' | 'wins' | 'fastest_time'
    additionalStats: jsonb("additional_stats"), // Extra display data like { highestTile: 2048 }
    achievedAt: timestamp("achieved_at").notNull().defaultNow(), // Server-set only
    syncedAt: timestamp("synced_at").notNull().defaultNow(),
  },
  (table) => [
    // One entry per profile per app per score type
    unique("leaderboard_unique").on(
      table.gamingProfileId,
      table.appId,
      table.scoreType
    ),
    // Index for leaderboard queries: top scores for a game
    index("leaderboard_app_score_idx").on(table.appId, table.score),
    // Index for time-filtered queries (weekly/monthly)
    index("leaderboard_app_time_idx").on(table.appId, table.achievedAt),
    // Index for user's entries lookup
    index("leaderboard_profile_idx").on(table.gamingProfileId),
  ]
);

// Score type enum for type safety
export const SCORE_TYPES = ["high_score", "wins", "fastest_time"] as const;
export type ScoreType = (typeof SCORE_TYPES)[number];

// Type for additional stats JSONB
export type AdditionalStats = Record<string, number | string>;
