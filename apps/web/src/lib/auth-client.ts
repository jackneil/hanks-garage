"use client";

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

// Re-export NextAuth client functions with our customizations
export { useSession, SessionProvider } from "next-auth/react";

/**
 * Sign in with credentials (email/password)
 */
export async function signInWithCredentials(
  email: string,
  password: string,
  rememberMe: boolean = true
) {
  return nextAuthSignIn("credentials", {
    email,
    password,
    redirect: false,
    // Note: rememberMe is handled by session maxAge in auth config
    // For now, we always use 30-day sessions
  });
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(callbackUrl: string = "/") {
  return nextAuthSignIn("google", { callbackUrl });
}

/**
 * Sign out and clear localStorage (security fix)
 */
export async function signOutAndClear(callbackUrl: string = "/") {
  // Clear all game localStorage to prevent cross-user contamination
  if (typeof window !== "undefined") {
    localStorage.removeItem("hill-climb-storage");
    localStorage.removeItem("monster-truck-save");
    // Add more games here as they're created
  }

  return nextAuthSignOut({ callbackUrl });
}

// Re-export raw functions for advanced use cases
export { nextAuthSignIn as signIn, nextAuthSignOut as signOut };
