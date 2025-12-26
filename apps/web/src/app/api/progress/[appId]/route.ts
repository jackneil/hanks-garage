import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, eq, and } from "@hank-neil/db";
import {
  appProgress,
  VALID_APP_IDS,
  type ValidAppId,
  type AppProgressData,
} from "@hank-neil/db/schema";
import { mergeProgress, extractTimestamp } from "@/lib/progress-merge";

type RouteContext = {
  params: Promise<{ appId: string }>;
};

/**
 * GET /api/progress/[appId]
 * Fetch user's progress for a specific game/app
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await auth();
    const { appId } = await context.params;

    // Must be authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    // Validate appId
    if (!VALID_APP_IDS.includes(appId as ValidAppId)) {
      return NextResponse.json(
        { error: `Invalid app ID: ${appId}` },
        { status: 400 }
      );
    }

    // Fetch progress
    const progress = await db.query.appProgress.findFirst({
      where: and(
        eq(appProgress.userId, session.user.id),
        eq(appProgress.appId, appId)
      ),
    });

    if (!progress) {
      return NextResponse.json({
        data: null,
        lastSyncedAt: null,
        message: "No saved progress found",
      });
    }

    return NextResponse.json({
      data: progress.data,
      lastSyncedAt: progress.lastSyncedAt?.toISOString() || null,
      updatedAt: progress.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("GET /api/progress error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/progress/[appId]
 * Save user's progress for a specific game/app
 *
 * Body:
 * - data: AppProgressData - the entire game state
 * - localTimestamp?: number - client's last modified timestamp
 * - merge?: boolean - if true, merge with server data instead of overwrite
 */
export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await auth();
    const { appId } = await context.params;

    // Must be authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    // Validate appId
    if (!VALID_APP_IDS.includes(appId as ValidAppId)) {
      return NextResponse.json(
        { error: `Invalid app ID: ${appId}` },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { data, localTimestamp, merge = false } = body as {
      data: AppProgressData;
      localTimestamp?: number;
      merge?: boolean;
    };

    // Validate data
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Invalid progress data" },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Check for existing progress
    const existing = await db.query.appProgress.findFirst({
      where: and(
        eq(appProgress.userId, userId),
        eq(appProgress.appId, appId)
      ),
    });

    let finalData: AppProgressData = data;
    let conflicts: string[] = [];

    // If merging and existing data, perform merge
    if (merge && existing) {
      const serverTimestamp = extractTimestamp(existing.data as AppProgressData);
      const mergeResult = mergeProgress(
        data,
        existing.data as AppProgressData,
        localTimestamp || null,
        serverTimestamp
      );
      finalData = mergeResult.data;
      conflicts = mergeResult.conflicts;
    }

    const now = new Date();

    if (existing) {
      // Update existing progress
      await db
        .update(appProgress)
        .set({
          data: finalData,
          lastSyncedAt: now,
          updatedAt: now,
        })
        .where(eq(appProgress.id, existing.id));

      return NextResponse.json({
        success: true,
        progressId: existing.id,
        updatedAt: now.toISOString(),
        merged: merge && conflicts.length === 0,
        conflicts,
      });
    } else {
      // Create new progress record
      const progressId = crypto.randomUUID();

      await db.insert(appProgress).values({
        id: progressId,
        userId,
        appId,
        data: finalData,
        lastSyncedAt: now,
        updatedAt: now,
      });

      return NextResponse.json({
        success: true,
        progressId,
        updatedAt: now.toISOString(),
        created: true,
      });
    }
  } catch (error) {
    console.error("POST /api/progress error:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/progress/[appId]
 * Delete user's progress for a specific game/app
 * (For account deletion or "start over" feature)
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await auth();
    const { appId } = await context.params;

    // Must be authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    // Validate appId
    if (!VALID_APP_IDS.includes(appId as ValidAppId)) {
      return NextResponse.json(
        { error: `Invalid app ID: ${appId}` },
        { status: 400 }
      );
    }

    // Find and delete progress (cascade will delete transactions)
    const existing = await db.query.appProgress.findFirst({
      where: and(
        eq(appProgress.userId, session.user.id),
        eq(appProgress.appId, appId)
      ),
    });

    if (!existing) {
      return NextResponse.json(
        { error: "No progress found to delete" },
        { status: 404 }
      );
    }

    await db.delete(appProgress).where(eq(appProgress.id, existing.id));

    return NextResponse.json({
      success: true,
      deleted: true,
    });
  } catch (error) {
    console.error("DELETE /api/progress error:", error);
    return NextResponse.json(
      { error: "Failed to delete progress" },
      { status: 500 }
    );
  }
}
