/**
 * Joke Generator Zustand Store
 * Handles favorites, ratings, stats, and persistence
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Joke, JokeCategory, Rating } from "./constants";

// Saved joke in favorites
export interface SavedJoke {
  id: string;
  setup: string;
  punchline: string;
  category: Exclude<JokeCategory, "all">;
  savedAt: number;
}

// Rating record
export interface JokeRating {
  jokeId: string;
  rating: Rating;
  ratedAt: number;
}

// Progress data shape (for sync)
// Index signature required for AppProgressData compatibility
export interface JokeGeneratorProgress {
  [key: string]: unknown;
  favorites: SavedJoke[];
  ratings: JokeRating[];
  lastCategory: JokeCategory;
  jokesViewed: number;
  jokesCopied: number;
  jokesShared: number;
  lastModified: number;
}

// Store state
interface JokeStoreState extends JokeGeneratorProgress {
  // Current session state (not persisted)
  currentJoke: Joke | null;
  showPunchline: boolean;
  isLoading: boolean;
  showFavorites: boolean;
  copiedId: string | null;
}

// Store actions
interface JokeStoreActions {
  // Joke actions
  setCurrentJoke: (joke: Joke) => void;
  revealPunchline: () => void;
  hidePunchline: () => void;
  setLoading: (loading: boolean) => void;

  // Category
  setCategory: (category: JokeCategory) => void;

  // Favorites
  addFavorite: (joke: Joke) => void;
  removeFavorite: (jokeId: string) => void;
  isFavorite: (jokeId: string) => boolean;
  setShowFavorites: (show: boolean) => void;

  // Ratings
  rateJoke: (jokeId: string, rating: Rating) => void;
  getJokeRating: (jokeId: string) => Rating | null;

  // Stats
  incrementViewed: () => void;
  incrementCopied: () => void;
  incrementShared: () => void;
  setCopiedId: (id: string | null) => void;

  // Sync helpers
  getProgress: () => JokeGeneratorProgress;
  setProgress: (data: JokeGeneratorProgress) => void;
}

const STORAGE_KEY = "joke-generator-progress";

const defaultProgress: JokeGeneratorProgress = {
  favorites: [],
  ratings: [],
  lastCategory: "all",
  jokesViewed: 0,
  jokesCopied: 0,
  jokesShared: 0,
  lastModified: Date.now(),
};

export const useJokeStore = create<JokeStoreState & JokeStoreActions>()(
  persist(
    (set, get) => ({
      // Initial state
      ...defaultProgress,
      currentJoke: null,
      showPunchline: false,
      isLoading: false,
      showFavorites: false,
      copiedId: null,

      // Joke actions
      setCurrentJoke: (joke) => {
        set({
          currentJoke: joke,
          showPunchline: false,
          copiedId: null,
        });
      },

      revealPunchline: () => set({ showPunchline: true }),
      hidePunchline: () => set({ showPunchline: false }),
      setLoading: (loading) => set({ isLoading: loading }),

      // Category
      setCategory: (category) => {
        set({
          lastCategory: category,
          lastModified: Date.now(),
        });
      },

      // Favorites
      addFavorite: (joke) => {
        const saved: SavedJoke = {
          id: joke.id,
          setup: joke.setup,
          punchline: joke.punchline,
          category: joke.category,
          savedAt: Date.now(),
        };
        set((state) => ({
          favorites: [...state.favorites, saved],
          lastModified: Date.now(),
        }));
      },

      removeFavorite: (jokeId) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== jokeId),
          lastModified: Date.now(),
        }));
      },

      isFavorite: (jokeId) => {
        return get().favorites.some((f) => f.id === jokeId);
      },

      setShowFavorites: (show) => set({ showFavorites: show }),

      // Ratings
      rateJoke: (jokeId, rating) => {
        set((state) => ({
          ratings: [
            ...state.ratings.filter((r) => r.jokeId !== jokeId),
            { jokeId, rating, ratedAt: Date.now() },
          ],
          lastModified: Date.now(),
        }));
      },

      getJokeRating: (jokeId) => {
        const rating = get().ratings.find((r) => r.jokeId === jokeId);
        return rating?.rating ?? null;
      },

      // Stats
      incrementViewed: () => {
        set((state) => ({
          jokesViewed: state.jokesViewed + 1,
          lastModified: Date.now(),
        }));
      },

      incrementCopied: () => {
        set((state) => ({
          jokesCopied: state.jokesCopied + 1,
          lastModified: Date.now(),
        }));
      },

      incrementShared: () => {
        set((state) => ({
          jokesShared: state.jokesShared + 1,
          lastModified: Date.now(),
        }));
      },

      setCopiedId: (id) => set({ copiedId: id }),

      // Sync helpers
      getProgress: (): JokeGeneratorProgress => {
        const state = get();
        return {
          favorites: state.favorites,
          ratings: state.ratings,
          lastCategory: state.lastCategory,
          jokesViewed: state.jokesViewed,
          jokesCopied: state.jokesCopied,
          jokesShared: state.jokesShared,
          lastModified: state.lastModified,
        } as JokeGeneratorProgress;
      },

      setProgress: (data) => {
        set({
          favorites: data.favorites ?? [],
          ratings: data.ratings ?? [],
          lastCategory: data.lastCategory ?? "all",
          jokesViewed: data.jokesViewed ?? 0,
          jokesCopied: data.jokesCopied ?? 0,
          jokesShared: data.jokesShared ?? 0,
          lastModified: Date.now(),
        });
      },
    }),
    {
      name: STORAGE_KEY,
      // Only persist progress data, not session state
      partialize: (state) => ({
        favorites: state.favorites,
        ratings: state.ratings,
        lastCategory: state.lastCategory,
        jokesViewed: state.jokesViewed,
        jokesCopied: state.jokesCopied,
        jokesShared: state.jokesShared,
        lastModified: state.lastModified,
      }),
    }
  )
);
