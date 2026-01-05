import { NextResponse } from "next/server";
import { db, eq, sql } from "@hank-neil/db";
import {
  appProgress,
  gamingProfiles,
  leaderboardEntries,
  type ValidAppId,
  type AppProgressData,
} from "@hank-neil/db/schema";
import { generateUniqueHandle } from "@/lib/handle-generator";
import {
  extractLeaderboardScore,
  hasLeaderboardSupport,
} from "@/lib/leaderboard-extractors";
import { leaderboardEntrySchema } from "@/lib/leaderboard-schemas";

/**
 * POST /api/admin/backfill-leaderboards
 *
 * One-time backfill endpoint to populate leaderboard_entries from existing app_progress.
 * This is needed because progress was saved BEFORE the leaderboard sync code was deployed.
 *
 * ADMIN ONLY - protected by secret key in headers
 */
export async function POST(request: Request) {
  try {
    // Simple auth via secret header (not bulletproof, but good enough for one-time admin use)
    const authHeader = request.headers.get("x-admin-secret");
    if (authHeader !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized - missing or invalid admin secret" },
        { status: 401 }
      );
    }

    const results = {
      progressRecords: 0,
      profilesCreated: 0,
      entriesCreated: 0,
      entriesUpdated: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Fetch all progress records
    const allProgress = await db.query.appProgress.findMany();
    results.progressRecords = allProgress.length;

    console.log(`[BACKFILL] Processing ${allProgress.length} progress records...`);

    for (const progress of allProgress) {
      const { userId, appId, data } = progress;

      // Skip if game doesn't have leaderboard support
      if (!hasLeaderboardSupport(appId)) {
        results.skipped++;
        continue;
      }

      // Extract score using existing extractor
      const scoreData = extractLeaderboardScore(
        appId as ValidAppId,
        data as AppProgressData
      );

      if (!scoreData || scoreData.score <= 0) {
        results.skipped++;
        continue;
      }

      // Validate extracted score
      const validated = leaderboardEntrySchema.safeParse(scoreData);
      if (!validated.success) {
        results.errors.push(`Invalid score for ${appId} (user ${userId}): ${validated.error.message}`);
        continue;
      }

      try {
        await db.transaction(async (tx) => {
          // Get or create gaming profile
          let profile = await tx.query.gamingProfiles.findFirst({
            where: eq(gamingProfiles.userId, userId),
          });

          if (!profile) {
            // Create gaming profile with unique handle
            for (let attempt = 0; attempt < 3; attempt++) {
              const handle = await generateUniqueHandle(tx as unknown as typeof db);
              try {
                const [inserted] = await tx
                  .insert(gamingProfiles)
                  .values({
                    userId,
                    handle,
                  })
                  .onConflictDoNothing({ target: gamingProfiles.userId })
                  .returning();

                profile = inserted || await tx.query.gamingProfiles.findFirst({
                  where: eq(gamingProfiles.userId, userId),
                });

                if (profile) {
                  results.profilesCreated++;
                  break;
                }
              } catch (err) {
                const isHandleCollision = err instanceof Error &&
                  err.message.includes("unique") &&
                  err.message.toLowerCase().includes("handle");

                if (isHandleCollision && attempt < 2) {
                  continue;
                }
                throw err;
              }
            }
          }

          if (!profile) {
            results.errors.push(`Failed to get/create profile for user ${userId}`);
            return;
          }

          // Check if leaderboard entry already exists
          const existingEntry = await tx.query.leaderboardEntries.findFirst({
            where: sql`${leaderboardEntries.gamingProfileId} = ${profile.id}
              AND ${leaderboardEntries.appId} = ${appId}
              AND ${leaderboardEntries.scoreType} = ${scoreData.scoreType}`,
          });

          const now = new Date();
          const isTimeBased = scoreData.scoreType === "fastest_time";

          if (existingEntry) {
            // Update only if new score is better
            const isBetter = isTimeBased
              ? scoreData.score < existingEntry.score
              : scoreData.score > existingEntry.score;

            if (isBetter) {
              await tx
                .update(leaderboardEntries)
                .set({
                  score: scoreData.score,
                  additionalStats: scoreData.stats || null,
                  achievedAt: progress.updatedAt,
                  syncedAt: now,
                })
                .where(eq(leaderboardEntries.id, existingEntry.id));
              results.entriesUpdated++;
            } else {
              results.skipped++;
            }
          } else {
            // Create new entry
            await tx.insert(leaderboardEntries).values({
              gamingProfileId: profile.id,
              appId,
              score: scoreData.score,
              scoreType: scoreData.scoreType,
              additionalStats: scoreData.stats || null,
              achievedAt: progress.updatedAt,
              syncedAt: now,
            });
            results.entriesCreated++;
          }
        });
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        results.errors.push(`Error processing ${appId} for user ${userId}: ${errMsg}`);
      }
    }

    console.log("[BACKFILL] Complete:", results);

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("POST /api/admin/backfill-leaderboards error:", error);
    return NextResponse.json(
      { error: "Failed to backfill leaderboards" },
      { status: 500 }
    );
  }
}
