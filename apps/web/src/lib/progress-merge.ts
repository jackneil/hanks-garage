/**
 * Progress merge utilities for handling localStorage → DB sync
 *
 * Uses a simple "last write wins" strategy for MVP, with timestamp tracking.
 * The transaction log exists for future exploit-proof merge if needed.
 */

import type { AppProgressData } from "@hank-neil/db";

/**
 * Merge strategy result
 */
export type MergeResult = {
  data: AppProgressData;
  source: "local" | "server" | "merged";
  conflicts: string[];
};

/**
 * Simple timestamp-based merge strategy
 *
 * For MVP, we use "last modified wins" approach:
 * - If local has more recent changes, use local entirely
 * - If server has more recent changes, use server entirely
 * - User sees a warning if there's a conflict
 *
 * Future: Transaction replay for true merge without exploits
 */
export function mergeProgress(
  localData: AppProgressData | null,
  serverData: AppProgressData | null,
  localTimestamp: number | null,
  serverTimestamp: number | null
): MergeResult {
  // No local data - use server
  if (!localData) {
    return {
      data: serverData || {},
      source: "server",
      conflicts: [],
    };
  }

  // No server data - use local (first login scenario)
  if (!serverData) {
    return {
      data: localData,
      source: "local",
      conflicts: [],
    };
  }

  // Both exist - compare timestamps
  const localTime = localTimestamp || 0;
  const serverTime = serverTimestamp || 0;

  // Server is newer or equal - prefer server
  if (serverTime >= localTime) {
    return {
      data: serverData,
      source: "server",
      conflicts:
        localTime > 0
          ? ["Local progress was overwritten by newer server data"]
          : [],
    };
  }

  // Local is newer - use local
  return {
    data: localData,
    source: "local",
    conflicts:
      serverTime > 0
        ? ["Server progress was overwritten by newer local data"]
        : [],
  };
}

/**
 * Extract timestamp from progress data blob
 *
 * Games should store updatedAt in their state for merge resolution
 */
export function extractTimestamp(data: AppProgressData | null): number | null {
  if (!data) return null;

  // Check common timestamp field names
  const timestampFields = ["updatedAt", "lastModified", "timestamp", "_timestamp"];

  for (const field of timestampFields) {
    const val = data[field];
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const parsed = Date.parse(val);
      if (!isNaN(parsed)) return parsed;
    }
  }

  return null;
}
