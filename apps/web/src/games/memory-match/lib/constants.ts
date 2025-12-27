// constants.ts - Memory Match game types and constants

export type Difficulty = "easy" | "medium" | "hard" | "expert";
export type ThemeId = "animals" | "vehicles" | "emojis" | "dinosaurs";

export type Card = {
  id: number;
  imageId: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export type DifficultyConfig = {
  name: string;
  rows: number;
  cols: number;
  pairs: number;
};

export type ThemeConfig = {
  id: ThemeId;
  name: string;
  emoji: string;
  images: string[];
  unlockCondition: number; // wins needed to unlock
};

// Difficulty configurations
export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: { name: "Easy", rows: 3, cols: 4, pairs: 6 },
  medium: { name: "Medium", rows: 4, cols: 4, pairs: 8 },
  hard: { name: "Hard", rows: 4, cols: 5, pairs: 10 },
  expert: { name: "Expert", rows: 4, cols: 6, pairs: 12 },
};

// Theme configurations with emoji images
export const THEMES: Record<ThemeId, ThemeConfig> = {
  animals: {
    id: "animals",
    name: "Animals",
    emoji: "\u{1F436}",
    images: [
      "\u{1F436}", // dog
      "\u{1F431}", // cat
      "\u{1F981}", // lion
      "\u{1F43B}", // bear
      "\u{1F418}", // elephant
      "\u{1F992}", // giraffe
      "\u{1F435}", // monkey
      "\u{1F427}", // penguin
      "\u{1F430}", // rabbit
      "\u{1F98A}", // fox
      "\u{1F43C}", // panda
      "\u{1F42F}", // tiger
    ],
    unlockCondition: 0, // default unlocked
  },
  vehicles: {
    id: "vehicles",
    name: "Vehicles",
    emoji: "\u{1F697}",
    images: [
      "\u{1F697}", // car
      "\u{1F68C}", // bus
      "\u{1F692}", // fire truck
      "\u{1F691}", // ambulance
      "\u{1F693}", // police car
      "\u{1F3CE}\u{FE0F}", // racing car
      "\u{1F6F5}", // scooter
      "\u{1F6B2}", // bicycle
      "\u{2708}\u{FE0F}", // airplane
      "\u{1F6A2}", // ship
      "\u{1F681}", // helicopter
      "\u{1F680}", // rocket
    ],
    unlockCondition: 1, // 1 win
  },
  emojis: {
    id: "emojis",
    name: "Emojis",
    emoji: "\u{1F60A}",
    images: [
      "\u{1F600}", // grinning
      "\u{1F602}", // joy
      "\u{1F60D}", // heart eyes
      "\u{1F60E}", // cool
      "\u{1F914}", // thinking
      "\u{1F525}", // fire
      "\u{2B50}", // star
      "\u{1F308}", // rainbow
      "\u{1F389}", // party popper
      "\u{1F381}", // gift
      "\u{2764}\u{FE0F}", // heart
      "\u{1F44D}", // thumbs up
    ],
    unlockCondition: 5, // 5 wins
  },
  dinosaurs: {
    id: "dinosaurs",
    name: "Dinosaurs",
    emoji: "\u{1F996}",
    images: [
      "\u{1F996}", // t-rex
      "\u{1F995}", // sauropod
      "\u{1F409}", // dragon (dino-ish)
      "\u{1F40A}", // crocodile (dino-like)
      "\u{1F98E}", // lizard
      "\u{1F422}", // turtle (ancient!)
      "\u{1FAB6}", // feather (bird ancestors)
      "\u{1F9B4}", // bone (fossils)
      "\u{1F30B}", // volcano
      "\u{1FAA8}", // rock
      "\u{1F333}", // tree (prehistoric)
      "\u{1F404}", // cow (evolution lol)
    ],
    unlockCondition: 10, // 10 wins
  },
};

// Game timing constants
export const TIMING = {
  MISMATCH_DELAY_MS: 1000, // How long to show mismatched cards
  FLIP_ANIMATION_MS: 400, // CSS flip animation duration
  MATCH_CELEBRATION_MS: 600, // Celebration effect duration
} as const;

// Star rating thresholds (based on moves vs optimal)
export const STAR_RATINGS = {
  THREE_STAR_THRESHOLD: 1.0, // Perfect = pairs * 2 moves
  TWO_STAR_THRESHOLD: 1.5, // Good = under 1.5x optimal
  ONE_STAR_THRESHOLD: 999, // Always get at least 1 star
} as const;

// Colors for UI
export const COLORS = {
  CARD_BACK: "#3b82f6", // bright blue
  MATCHED_GLOW: "#22c55e", // green
  SELECTED_RING: "#fbbf24", // amber
  BACKGROUND_FROM: "#1e3a8a", // blue-800
  BACKGROUND_TO: "#581c87", // purple-800
} as const;

// Helper functions
export function shuffleCards<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createCards(difficulty: Difficulty, theme: ThemeId): Card[] {
  const config = DIFFICULTIES[difficulty];
  const themeConfig = THEMES[theme];

  // Get the right number of unique images for this difficulty
  const images = themeConfig.images.slice(0, config.pairs);

  // Create pairs
  const cardPairs: Card[] = [];
  images.forEach((imageId, index) => {
    // Two cards for each image
    cardPairs.push({
      id: index * 2,
      imageId,
      isFlipped: false,
      isMatched: false,
    });
    cardPairs.push({
      id: index * 2 + 1,
      imageId,
      isFlipped: false,
      isMatched: false,
    });
  });

  return shuffleCards(cardPairs);
}

export function calculateOptimalMoves(pairs: number): number {
  return pairs * 2; // Best case: find every pair on first try
}

export function calculateStars(moves: number, pairs: number): 1 | 2 | 3 {
  const optimal = calculateOptimalMoves(pairs);
  const ratio = moves / optimal;

  if (ratio <= STAR_RATINGS.THREE_STAR_THRESHOLD) return 3;
  if (ratio <= STAR_RATINGS.TWO_STAR_THRESHOLD) return 2;
  return 1;
}

export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  return `${remainingSeconds}s`;
}
