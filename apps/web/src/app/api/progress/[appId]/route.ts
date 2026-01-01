import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, eq, and } from "@hank-neil/db";
import {
  appProgress,
  VALID_APP_IDS,
  type ValidAppId,
  type AppProgressData,
} from "@hank-neil/db/schema";
import { mergeProgress } from "@/lib/progress-merge";
import { validateProgress } from "@/lib/progress-schemas";
import { checkProgressRateLimit } from "@/lib/rate-limit";

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

    // Rate limit: 60 requests per minute per user
    const rateLimit = checkProgressRateLimit(session.user.id);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${rateLimit.resetIn}s` },
        { status: 429 }
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

    // Rate limit: 60 saves per minute per user
    const rateLimit = checkProgressRateLimit(session.user.id);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${rateLimit.resetIn}s` },
        { status: 429 }
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

    // Basic type check
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Invalid progress data" },
        { status: 400 }
      );
    }

    // SECURITY: Validate progress data against game-specific schema
    // This prevents users from POSTing arbitrary data like {"coins": 999999999}
    const validation = validateProgress(appId as ValidAppId, data);
    if (!validation.success) {
      console.warn(
        `Invalid progress data for ${appId} from user ${session.user.id}:`,
        validation.error
      );
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    let finalData: AppProgressData = data;
    let conflicts: string[] = [];

    // If merging, fetch existing first and merge
    // SECURITY: Server timestamp ALWAYS wins - we don't trust any client timestamps
    if (merge) {
      const existing = await db.query.appProgress.findFirst({
        where: and(
          eq(appProgress.userId, userId),
          eq(appProgress.appId, appId)
        ),
      });

      if (existing) {
        const serverTimestamp = existing.updatedAt.getTime();
        const nowTimestamp = Date.now();
        const mergeResult = mergeProgress(
          data,
          existing.data as AppProgressData,
          nowTimestamp,
          serverTimestamp
        );
        finalData = mergeResult.data;
        conflicts = mergeResult.conflicts;
      }
    }

    const now = new Date();
    const progressId = crypto.randomUUID();

    // UPSERT: Insert or update atomically - eliminates race condition
    // This prevents "duplicate key" errors when multiple requests try to create
    // the same (userId, appId) record simultaneously
    await db
      .insert(appProgress)
      .values({
        id: progressId,
        userId,
        appId,
        data: finalData,
        lastSyncedAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [appProgress.userId, appProgress.appId],
        set: {
          data: finalData,
          lastSyncedAt: now,
          updatedAt: now,
        },
      });

    return NextResponse.json({
      success: true,
      updatedAt: now.toISOString(),
      merged: merge && conflicts.length === 0,
      conflicts,
    });
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

    // Rate limit: 10 deletes per minute per user (stricter than saves)
    const rateLimit = checkProgressRateLimit(session.user.id);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${rateLimit.resetIn}s` },
        { status: 429 }
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
