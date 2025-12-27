// Toy Finder App - Main exports
// Self-contained app module

export { ToyFinder, default } from "./ToyFinder";
export { useToyFinderStore } from "./lib/store";
export type { WishlistItem, ToyFinderProgress } from "./lib/store";
export type { Toy, ToyCategory, AgeRange, Priority } from "./lib/constants";
export {
  TOY_CATEGORIES,
  AGE_RANGES,
  PRIORITIES,
  CURATED_TOYS,
  getToysByCategory,
  getToysByAge,
  getToyById,
} from "./lib/constants";
