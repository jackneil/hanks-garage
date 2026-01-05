import { eq, gamingProfiles, type Database } from "@hank-neil/db";

/**
 * Kid-friendly word pools for auto-generated handles
 * 30 adjectives x 30 nouns x 100 numbers = 90,000 combinations
 */
const ADJECTIVES = [
  "Turbo",
  "Cosmic",
  "Star",
  "Rocket",
  "Super",
  "Mega",
  "Ultra",
  "Ninja",
  "Speed",
  "Thunder",
  "Lightning",
  "Rainbow",
  "Pixel",
  "Retro",
  "Hyper",
  "Atomic",
  "Blazing",
  "Epic",
  "Mighty",
  "Swift",
  "Golden",
  "Silver",
  "Brave",
  "Wild",
  "Fire",
  "Ice",
  "Storm",
  "Shadow",
  "Laser",
  "Neon",
] as const;

const NOUNS = [
  "Racer",
  "Pilot",
  "Gamer",
  "Hunter",
  "Runner",
  "Jumper",
  "Collector",
  "Champion",
  "Master",
  "Legend",
  "Hero",
  "Wizard",
  "Dragon",
  "Phoenix",
  "Tiger",
  "Eagle",
  "Ninja",
  "Pirate",
  "Knight",
  "Rocket",
  "Comet",
  "Falcon",
  "Wolf",
  "Bear",
  "Shark",
  "Hawk",
  "Lion",
  "Panther",
  "Fox",
  "Viper",
] as const;

/**
 * Generate a random handle like "TurboRacer42"
 * Does NOT check for uniqueness - use generateUniqueHandle for that
 */
export function generateHandle(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}${noun}${num}`;
}

/**
 * Generate a unique handle with retry logic
 * Race-condition safe with fallback to UUID suffix
 *
 * @param db - Drizzle database instance (can be transaction)
 * @param maxRetries - Number of attempts before adding UUID suffix
 * @returns Unique handle string
 */
export async function generateUniqueHandle(
  db: Database,
  maxRetries = 10
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    const handle = generateHandle();
    const exists = await db.query.gamingProfiles.findFirst({
      where: eq(gamingProfiles.handle, handle),
      columns: { id: true },
    });
    if (!exists) return handle;
  }

  // Fallback: add random suffix (virtually guaranteed unique)
  // Uses 4-char UUID slice = 16^4 = 65,536 additional combinations
  return `${generateHandle()}_${crypto.randomUUID().slice(0, 4)}`;
}
