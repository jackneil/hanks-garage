import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, eq } from "@hank-neil/db";
import { appProgress } from "@hank-neil/db/schema";

/**
 * GET /api/progress
 * Fetch ALL game progress for the current user.
 * Used by the profile page to display game stats.
 */
export async function GET() {
  try {
    const session = await auth();

    // Must be authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    // Fetch all progress for this user
    const allProgress = await db.query.appProgress.findMany({
      where: eq(appProgress.userId, session.user.id),
      orderBy: (progress, { desc }) => [desc(progress.updatedAt)],
    });

    // Transform to response format
    const progressList = allProgress.map((p) => ({
      appId: p.appId,
      data: p.data,
      updatedAt: p.updatedAt.toISOString(),
      lastSyncedAt: p.lastSyncedAt?.toISOString() || null,
    }));

    return NextResponse.json({
      progress: progressList,
      count: progressList.length,
    });
  } catch (error) {
    console.error("GET /api/progress error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
