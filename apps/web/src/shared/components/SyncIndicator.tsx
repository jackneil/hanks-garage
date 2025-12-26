"use client";

import { useSession } from "next-auth/react";

type SyncStatus = "idle" | "syncing" | "synced" | "error";

type SyncIndicatorProps = {
  status: SyncStatus;
  lastSynced?: Date | null;
  className?: string;
};

/**
 * Sync status indicator for authenticated users
 *
 * Shows:
 * - "Saving..." when syncing
 * - "Saved" with checkmark when synced
 * - "Error" with retry option on failure
 * - Nothing for guests (they use localStorage)
 */
export function SyncIndicator({
  status,
  lastSynced,
  className = "",
}: SyncIndicatorProps) {
  const { data: session } = useSession();

  // Don't show for guests
  if (!session?.user) {
    return null;
  }

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 5) return "just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  if (status === "syncing") {
    return (
      <div className={`flex items-center gap-2 text-base-content/60 text-sm ${className}`}>
        <span className="loading loading-spinner loading-xs" />
        <span>Saving...</span>
      </div>
    );
  }

  if (status === "synced") {
    return (
      <div className={`flex items-center gap-2 text-success text-sm ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span>Saved {lastSynced && formatTime(lastSynced)}</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={`flex items-center gap-2 text-error text-sm ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Save failed</span>
      </div>
    );
  }

  // Idle state - show cloud icon
  return (
    <div className={`flex items-center gap-2 text-base-content/40 text-sm ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
        />
      </svg>
      <span>Cloud sync</span>
    </div>
  );
}

export default SyncIndicator;
