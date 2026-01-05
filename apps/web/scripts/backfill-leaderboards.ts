/**
 * One-time script to backfill leaderboard_entries from existing app_progress
 *
 * Run with:
 * DATABASE_URL="postgresql://..." pnpm tsx apps/web/scripts/backfill-leaderboards.ts
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, sql } from "drizzle-orm";
import * as schema from "@hank-neil/db/schema";

// Inline the extractor logic to avoid import issues
type ScoreType = "high_score" | "wins" | "fastest_time";

interface LeaderboardScore {
  score: number;
  scoreType: ScoreType;
  stats?: Record<string, number | string>;
}

type ProgressData = Record<string, unknown>;
type LeaderboardExtractor = (data: ProgressData) => LeaderboardScore | null;

const LEADERBOARD_EXTRACTORS: Record<string, LeaderboardExtractor> = {
  "2048": (d) => {
    const score = d.highScore as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score", stats: { highestTile: (d.highestTile as number) || 0, gamesWon: (d.gamesWon as number) || 0 } };
  },
  snake: (d) => {
    const score = d.highScore as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score", stats: { longestSnake: (d.longestSnake as number) || 0 } };
  },
  "flappy-bird": (d) => {
    const score = d.highScore as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score" };
  },
  "cookie-clicker": (d) => {
    const score = d.totalCookiesBaked as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score", stats: { totalClicks: (d.totalClicks as number) || 0 } };
  },
  "space-invaders": (d) => {
    const score = d.highScore as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score", stats: { highestWave: (d.highestWave as number) || 0 } };
  },
  asteroids: (d) => {
    const score = d.highScore as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score", stats: { highestWave: (d.highestWave as number) || 0 } };
  },
  breakout: (d) => {
    const score = d.highScore as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score" };
  },
  hextris: (d) => {
    const score = d.highScore as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score" };
  },
  bomberman: (d) => {
    const score = d.highScore as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score" };
  },
  "blitz-bomber": (d) => {
    const score = d.highScore as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score" };
  },
  "dino-runner": (d) => {
    const score = d.highScore as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score" };
  },
  "endless-runner": (d) => {
    const score = d.highScore as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score" };
  },
  "math-attack": (d) => {
    const score = d.highScore as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score" };
  },
  trivia: (d) => {
    const score = d.highScore as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score" };
  },
  "hill-climb": (d) => {
    const score = d.bestDistance as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score" };
  },
  "monster-truck": (d) => {
    const score = d.starsCollected as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score" };
  },
  platformer: (d) => {
    const score = d.totalStars as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score" };
  },
  "oregon-trail": (d) => {
    const score = d.milesTraveled as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "high_score" };
  },
  chess: (d) => {
    const score = d.gamesWon as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "wins" };
  },
  checkers: (d) => {
    const score = d.gamesWon as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "wins" };
  },
  quoridor: (d) => {
    const score = d.gamesWon as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "wins" };
  },
  wordle: (d) => {
    const score = d.gamesWon as number;
    if (!score || score <= 0) return null;
    return { score, scoreType: "wins" };
  },
  "memory-match": (d) => {
    const bestTimes = d.bestTimes as Record<string, number | null> | undefined;
    if (!bestTimes) return null;
    const validTimes = Object.values(bestTimes).filter((t): t is number => typeof t === "number" && t > 0);
    if (validTimes.length === 0) return null;
    return { score: Math.min(...validTimes), scoreType: "fastest_time" };
  },
};

// Generate a handle
const ADJECTIVES = ["Swift", "Thunder", "Cosmic", "Turbo", "Mega", "Ultra", "Hyper", "Power", "Blazing", "Shadow"];
const NOUNS = ["Racer", "Hero", "Champion", "Legend", "Star", "Phoenix", "Dragon", "Knight", "Ranger", "Warrior"];

function generateHandle(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}${noun}${num}`;
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  console.log("Connecting to database...");
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool, { schema });

  const results = {
    progressRecords: 0,
    profilesCreated: 0,
    entriesCreated: 0,
    entriesUpdated: 0,
    skipped: 0,
    errors: [] as string[],
  };

  try {
    // Fetch all progress records
    const allProgress = await db.query.appProgress.findMany();
    results.progressRecords = allProgress.length;
    console.log(`Processing ${allProgress.length} progress records...`);

    for (const progress of allProgress) {
      const { userId, appId, data } = progress;

      // Skip if game doesn't have leaderboard support
      const extractor = LEADERBOARD_EXTRACTORS[appId];
      if (!extractor) {
        results.skipped++;
        continue;
      }

      // Extract score
      const scoreData = extractor(data as ProgressData);
      if (!scoreData || scoreData.score <= 0) {
        results.skipped++;
        continue;
      }

      try {
        // Get or create gaming profile
        let profile = await db.query.gamingProfiles.findFirst({
          where: eq(schema.gamingProfiles.userId, userId),
        });

        if (!profile) {
          const handle = generateHandle();
          const [inserted] = await db
            .insert(schema.gamingProfiles)
            .values({ userId, handle })
            .onConflictDoNothing({ target: schema.gamingProfiles.userId })
            .returning();

          profile = inserted || await db.query.gamingProfiles.findFirst({
            where: eq(schema.gamingProfiles.userId, userId),
          });

          if (inserted) {
            results.profilesCreated++;
            console.log(`  Created profile: ${handle}`);
          }
        }

        if (!profile) {
          results.errors.push(`Failed to get/create profile for user ${userId}`);
          continue;
        }

        // Check if leaderboard entry already exists
        const existingEntry = await db.query.leaderboardEntries.findFirst({
          where: sql`${schema.leaderboardEntries.gamingProfileId} = ${profile.id}
            AND ${schema.leaderboardEntries.appId} = ${appId}
            AND ${schema.leaderboardEntries.scoreType} = ${scoreData.scoreType}`,
        });

        const now = new Date();
        const isTimeBased = scoreData.scoreType === "fastest_time";

        if (existingEntry) {
          // Update only if new score is better
          const isBetter = isTimeBased
            ? scoreData.score < existingEntry.score
            : scoreData.score > existingEntry.score;

          if (isBetter) {
            await db
              .update(schema.leaderboardEntries)
              .set({
                score: scoreData.score,
                additionalStats: scoreData.stats || null,
                achievedAt: progress.updatedAt,
                syncedAt: now,
              })
              .where(eq(schema.leaderboardEntries.id, existingEntry.id));
            results.entriesUpdated++;
            console.log(`  Updated ${appId}: ${scoreData.score}`);
          } else {
            results.skipped++;
          }
        } else {
          // Create new entry
          await db.insert(schema.leaderboardEntries).values({
            gamingProfileId: profile.id,
            appId,
            score: scoreData.score,
            scoreType: scoreData.scoreType,
            additionalStats: scoreData.stats || null,
            achievedAt: progress.updatedAt,
            syncedAt: now,
          });
          results.entriesCreated++;
          console.log(`  Created ${appId}: ${scoreData.score} (${scoreData.scoreType})`);
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        results.errors.push(`Error processing ${appId} for user ${userId}: ${errMsg}`);
        console.error(`  Error: ${errMsg}`);
      }
    }

    console.log("\n=== BACKFILL COMPLETE ===");
    console.log(`Progress records: ${results.progressRecords}`);
    console.log(`Profiles created: ${results.profilesCreated}`);
    console.log(`Entries created:  ${results.entriesCreated}`);
    console.log(`Entries updated:  ${results.entriesUpdated}`);
    console.log(`Skipped:          ${results.skipped}`);
    if (results.errors.length > 0) {
      console.log(`Errors:           ${results.errors.length}`);
      results.errors.forEach((e) => console.log(`  - ${e}`));
    }
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
