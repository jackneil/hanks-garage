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
 * Deep merge for game progress (when needed)
 *
 * Takes the "best" of each field:
 * - Numeric fields: take higher value (coins, xp, etc)
 * - Boolean unlocks: OR together (unlocked stays unlocked)
 * - Arrays: union (keep all collected items)
 * - Timestamps: take more recent
 *
 * WARNING: Can create exploits if not careful!
 * Only use for non-currency fields.
 */
export function deepMergeProgress(
  local: AppProgressData,
  server: AppProgressData
): AppProgressData {
  const result: AppProgressData = { ...server };

  for (const key of Object.keys(local)) {
    const localVal = local[key];
    const serverVal = server[key];

    // If server doesn't have this key, use local
    if (serverVal === undefined) {
      result[key] = localVal;
      continue;
    }

    // Both have values - merge based on type
    if (typeof localVal === "number" && typeof serverVal === "number") {
      // Take higher value (XP, best times, etc)
      result[key] = Math.max(localVal, serverVal);
    } else if (typeof localVal === "boolean" && typeof serverVal === "boolean") {
      // OR together - unlocked stays unlocked
      result[key] = localVal || serverVal;
    } else if (Array.isArray(localVal) && Array.isArray(serverVal)) {
      // Union arrays (unique items)
      result[key] = [...new Set([...serverVal, ...localVal])];
    } else if (
      typeof localVal === "object" &&
      localVal !== null &&
      typeof serverVal === "object" &&
      serverVal !== null
    ) {
      // Recursively merge objects
      result[key] = deepMergeProgress(
        localVal as AppProgressData,
        serverVal as AppProgressData
      );
    }
    // Otherwise keep server value (already in result)
  }

  return result;
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
