"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

/**
 * Auth context provider - wraps the app with NextAuth session
 *
 * Add this to layout.tsx to enable auth throughout the app
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default AuthProvider;
