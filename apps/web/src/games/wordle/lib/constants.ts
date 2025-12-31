// Wordle for Kids - Age-based difficulty settings

export type Difficulty = "4yo" | "8yo" | "12yo" | "24yo" | "99yo";

export interface DifficultySettings {
  wordLength: number;
  maxGuesses: number;
  tileSize: string;
  fontSize: string;
  keyboardSize: string;
  emoji: string;
  color: string;
  label: string;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  "4yo": {
    wordLength: 3,
    maxGuesses: 8,
    tileSize: "w-16 h-16",
    fontSize: "text-3xl",
    keyboardSize: "text-xl min-w-[36px] h-12",
    emoji: "👶",
    color: "bg-blue-400",
    label: "4 years old",
  },
  "8yo": {
    wordLength: 4,
    maxGuesses: 6,
    tileSize: "w-14 h-14",
    fontSize: "text-2xl",
    keyboardSize: "text-lg min-w-[32px] h-11",
    emoji: "🧒",
    color: "bg-green-500",
    label: "8 years old",
  },
  "12yo": {
    wordLength: 5,
    maxGuesses: 6,
    tileSize: "w-12 h-12",
    fontSize: "text-xl",
    keyboardSize: "text-base min-w-[28px] h-10",
    emoji: "👦",
    color: "bg-yellow-500",
    label: "12 years old",
  },
  "24yo": {
    wordLength: 6,
    maxGuesses: 6,
    tileSize: "w-11 h-11",
    fontSize: "text-lg",
    keyboardSize: "text-sm min-w-[26px] h-9",
    emoji: "🧑",
    color: "bg-orange-500",
    label: "24 years old",
  },
  "99yo": {
    wordLength: 4,
    maxGuesses: 8,
    tileSize: "w-16 h-16",
    fontSize: "text-3xl",
    keyboardSize: "text-xl min-w-[36px] h-12",
    emoji: "👴",
    color: "bg-purple-500",
    label: "99 years old",
  },
};

export function getDifficultySettings(difficulty: Difficulty): DifficultySettings {
  return DIFFICULTY_SETTINGS[difficulty];
}

// Letter status colors
export const LETTER_COLORS = {
  correct: "bg-green-500 border-green-500 text-white",
  present: "bg-yellow-500 border-yellow-500 text-white",
  absent: "bg-gray-600 border-gray-600 text-white",
  empty: "bg-transparent border-gray-500",
  tbd: "bg-transparent border-gray-400 text-white",
};

// Keyboard rows
export const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];
