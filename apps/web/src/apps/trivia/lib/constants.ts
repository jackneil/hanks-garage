// Trivia Quiz - Age-based difficulty settings

export type Difficulty = "4yo" | "8yo" | "12yo" | "24yo" | "99yo";

export interface DifficultySettings {
  difficulty: "easy" | "medium" | "hard";
  timerSec: number;
  categories: number[] | "all";
  fontSize: string;
  buttonSize: string;
  emoji: string;
  color: string;
  label: string;
  questionsPerRound: number;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  "4yo": {
    difficulty: "easy",
    timerSec: 25,
    categories: [9, 27], // General Knowledge, Animals
    fontSize: "text-2xl",
    buttonSize: "text-xl py-4",
    emoji: "👶",
    color: "bg-blue-400",
    label: "4 years old",
    questionsPerRound: 5,
  },
  "8yo": {
    difficulty: "easy",
    timerSec: 20,
    categories: [9, 17, 27, 22], // + Science, Geography
    fontSize: "text-xl",
    buttonSize: "text-lg py-3",
    emoji: "🧒",
    color: "bg-green-500",
    label: "8 years old",
    questionsPerRound: 10,
  },
  "12yo": {
    difficulty: "medium",
    timerSec: 15,
    categories: "all",
    fontSize: "text-lg",
    buttonSize: "text-base py-3",
    emoji: "👦",
    color: "bg-yellow-500",
    label: "12 years old",
    questionsPerRound: 10,
  },
  "24yo": {
    difficulty: "hard",
    timerSec: 12,
    categories: "all",
    fontSize: "text-base",
    buttonSize: "text-base py-2",
    emoji: "🧑",
    color: "bg-orange-500",
    label: "24 years old",
    questionsPerRound: 15,
  },
  "99yo": {
    difficulty: "easy",
    timerSec: 35,
    categories: [9], // General Knowledge only
    fontSize: "text-3xl",
    buttonSize: "text-2xl py-5",
    emoji: "👴",
    color: "bg-purple-500",
    label: "99 years old",
    questionsPerRound: 5,
  },
};

export function getDifficultySettings(difficulty: Difficulty): DifficultySettings {
  return DIFFICULTY_SETTINGS[difficulty];
}

// Open Trivia DB Categories
export const CATEGORIES = [
  { id: 9, name: "General Knowledge" },
  { id: 10, name: "Books" },
  { id: 11, name: "Film" },
  { id: 12, name: "Music" },
  { id: 14, name: "Television" },
  { id: 15, name: "Video Games" },
  { id: 17, name: "Science & Nature" },
  { id: 18, name: "Computers" },
  { id: 21, name: "Sports" },
  { id: 22, name: "Geography" },
  { id: 23, name: "History" },
  { id: 27, name: "Animals" },
  { id: 28, name: "Vehicles" },
];

// Points system
export const POINTS = {
  correct: 100,
  streakBonus: 50, // per streak level
  timeBonus: 10, // per second remaining
};
