"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import type { ValidAppId, AppProgressData } from "@hank-neil/db/schema";

type SyncStatus = "idle" | "syncing" | "synced" | "error";

type UseAuthSyncOptions<T> = {
  appId: ValidAppId;
  localStorageKey: string;
  getState: () => T;
  setState: (data: T) => void;
  debounceMs?: number;
  onSyncComplete?: (source: "local" | "server") => void;
};

type UseAuthSyncReturn = {
  isAuthenticated: boolean;
  isGuest: boolean;
  syncStatus: SyncStatus;
  lastSynced: Date | null;
  forceSync: () => Promise<void>;
};

/**
 * Hook for syncing game/app state between localStorage and database
 *
 * - Guest mode: saves to localStorage only
 * - Authenticated: syncs to DB with debounced auto-save
 * - On login: merges localStorage → DB
 * - On logout: clears localStorage (handled by signOutAndClear)
 */
export function useAuthSync<T extends AppProgressData>({
  appId,
  localStorageKey,
  getState,
  setState,
  debounceMs = 2000,
  onSyncComplete,
}: UseAuthSyncOptions<T>): UseAuthSyncReturn {
  const { data: session, status } = useSession();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const isAuthenticated = status === "authenticated" && !!session?.user?.id;
  const isGuest = status === "unauthenticated";
  const isLoading = status === "loading";

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>("");
  const initialSyncDoneRef = useRef(false);

  /**
   * Fetch progress from server
   */
  const fetchFromServer = useCallback(async (): Promise<{
    data: T | null;
    lastSyncedAt: string | null;
  } | null> => {
    try {
      const res = await fetch(`/api/progress/${appId}`);
      if (!res.ok) {
        console.error("Failed to fetch progress:", res.status);
        return null;
      }
      return res.json();
    } catch (error) {
      console.error("Fetch progress error:", error);
      return null;
    }
  }, [appId]);

  /**
   * Save progress to server
   */
  const saveToServer = useCallback(
    async (data: T, merge = false): Promise<boolean> => {
      try {
        setSyncStatus("syncing");

        const res = await fetch(`/api/progress/${appId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data,
            localTimestamp: Date.now(),
            merge,
          }),
        });

        if (!res.ok) {
          console.error("Failed to save progress:", res.status);
          setSyncStatus("error");
          return false;
        }

        const result = await res.json();
        setSyncStatus("synced");
        setLastSynced(new Date(result.updatedAt));
        return true;
      } catch (error) {
        console.error("Save progress error:", error);
        setSyncStatus("error");
        return false;
      }
    },
    [appId]
  );

  /**
   * Initial sync on login - merge localStorage with server
   */
  const performInitialSync = useCallback(async () => {
    if (initialSyncDoneRef.current) return;

    setSyncStatus("syncing");

    // Get local state
    const localState = getState();

    // Fetch server state
    const serverResult = await fetchFromServer();

    if (!serverResult) {
      // Server fetch failed - DON'T set flag, allow retry on next auth change
      setSyncStatus("error");
      return;
    }

    const serverData = serverResult.data as T | null;

    // No server data - upload local
    if (!serverData) {
      if (localState && Object.keys(localState).length > 0) {
        const success = await saveToServer(localState, false);
        if (success) {
          initialSyncDoneRef.current = true;
          onSyncComplete?.("local");
        }
      } else {
        // No data anywhere, but sync is "done"
        initialSyncDoneRef.current = true;
        setSyncStatus("synced");
      }
      return;
    }

    // No local data - use server
    if (!localState || Object.keys(localState).length === 0) {
      setState(serverData);
      setSyncStatus("synced");
      setLastSynced(
        serverResult.lastSyncedAt
          ? new Date(serverResult.lastSyncedAt)
          : new Date()
      );
      initialSyncDoneRef.current = true;
      onSyncComplete?.("server");
      return;
    }

    // Both exist - merge (server takes precedence for now)
    // This saves local to server with merge flag
    const success = await saveToServer(localState, true);
    if (success) {
      // Re-fetch to get merged result
      const merged = await fetchFromServer();
      if (merged?.data) {
        setState(merged.data as T);
        initialSyncDoneRef.current = true;
        onSyncComplete?.("server");
      }
    }
  }, [getState, setState, fetchFromServer, saveToServer, onSyncComplete]);

  /**
   * Debounced save - called on state changes
   */
  const debouncedSave = useCallback(
    (data: T) => {
      if (!isAuthenticated) return;

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Check if data actually changed
      const dataStr = JSON.stringify(data);
      if (dataStr === lastSavedRef.current) return;

      // Schedule save
      saveTimeoutRef.current = setTimeout(async () => {
        lastSavedRef.current = dataStr;
        await saveToServer(data, false);
      }, debounceMs);
    },
    [isAuthenticated, debounceMs, saveToServer]
  );

  /**
   * Force immediate sync
   */
  const forceSync = useCallback(async () => {
    if (!isAuthenticated) return;

    // Clear pending debounce
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    const data = getState();
    lastSavedRef.current = JSON.stringify(data);
    await saveToServer(data, false);
  }, [isAuthenticated, getState, saveToServer]);

  // Initial sync when authenticated
  useEffect(() => {
    if (isAuthenticated && !initialSyncDoneRef.current) {
      performInitialSync();
    }

    // Reset sync flag on logout
    if (!isAuthenticated && status !== "loading") {
      initialSyncDoneRef.current = false;
    }
  }, [isAuthenticated, status, performInitialSync]);

  // Subscribe to state changes for auto-save
  useEffect(() => {
    if (!isAuthenticated) return;

    // Set up an interval to check for changes
    // (Better approach: subscribe to Zustand store directly in the game)
    const interval = setInterval(() => {
      const currentState = getState();
      debouncedSave(currentState);
    }, 1000);

    return () => {
      clearInterval(interval);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isAuthenticated, getState, debouncedSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    isAuthenticated,
    isGuest,
    syncStatus: isLoading ? "syncing" : syncStatus,
    lastSynced,
    forceSync,
  };
}

export default useAuthSync;
