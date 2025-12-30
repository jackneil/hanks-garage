import Link from "next/link";
import { LoginButton } from "@/shared/components";
import { discoverGamesAndApps, type DisplayCategory } from "@/shared/lib/game-registry";
import { HomeClient } from "./HomeClient";

// Server component - discovers games at build time
export default async function Home() {
  const categories = await discoverGamesAndApps();

  return <HomeClient categories={categories} />;
}
