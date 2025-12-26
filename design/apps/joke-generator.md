# Joke Generator - Design Document

## Overview

The **Joke Generator** is a kid-friendly app where Hank (and kids ages 6-14) can tap a big button to get random jokes. It's simple, shareable, and designed to make kids laugh with age-appropriate humor like dad jokes, knock-knock jokes, puns, and animal jokes.

**Why it's fun:** Kids love jokes. They love telling jokes even more. This app gives them an endless supply of jokes to share with friends, family, and anyone who will listen. The instant gratification of tapping a button and getting something funny scratches that same itch as opening a mystery box.

---

## Core Experience

### The Loop

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│   TAP "TELL ME A JOKE!" button                      │
│              ↓                                       │
│   See joke appear with fun animation                │
│              ↓                                       │
│   Laugh (hopefully)                                 │
│              ↓                                       │
│   Rate it: Funny / Not Funny                        │
│              ↓                                       │
│   Share with friends OR get another joke            │
│              ↓                                       │
│   (repeat forever)                                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### What Makes It Engaging

1. **Instant gratification** - One tap, instant joke
2. **Variety** - Different categories keep it fresh
3. **Social sharing** - Kids want to tell jokes to others
4. **Personal collection** - Favorites list to revisit the best ones
5. **Ownership** - Submit your own jokes to feel like a contributor

---

## Controls

### Mobile (Touch)

| Action | Control |
|--------|---------|
| Get new joke | Tap "TELL ME A JOKE!" button |
| Rate joke | Tap thumbs up/down buttons |
| Copy joke | Tap copy button |
| Share joke | Tap share button (native share sheet) |
| Change category | Tap category pills at top |
| View favorites | Tap heart icon in corner |

### Desktop (Click)

| Action | Control |
|--------|---------|
| Get new joke | Click "TELL ME A JOKE!" button OR press `Space` |
| Rate joke | Click thumbs up/down OR press `1`/`2` |
| Copy joke | Click copy OR press `C` |
| Change category | Click category tabs |
| View favorites | Click heart icon |

---

## UI Layout

```
┌────────────────────────────────────────────────────┐
│  [<] Joke Generator                    [♥] [⚙️]    │
├────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  [All] [Dad Jokes] [Knock-Knock] [Puns] ...  │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │                                              │  │
│  │      Why don't scientists trust atoms?      │  │
│  │                                              │  │
│  │      Because they make up everything!        │  │
│  │                    🎉                         │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│           [👍 Funny!]    [👎 Meh]                   │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │                                              │  │
│  │        🎤  TELL ME A JOKE!  🎤               │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│        [📋 Copy]      [📤 Share]     [❤️ Save]     │
│                                                     │
└────────────────────────────────────────────────────┘
```

---

## Features (Priority Order)

### P0 - MVP (Must Have)

1. **Random Joke Display**
   - Fetch and display random kid-friendly jokes
   - Handle loading states gracefully
   - Fun reveal animation (fade in, bounce, slide up)

2. **Category Filter**
   - Categories: All, Dad Jokes, Knock-Knock, Puns, Animal Jokes
   - Visual category pills/tabs
   - Remember last selected category

3. **Big "Tell Me A Joke" Button**
   - Minimum 60x200px (oversized for kids)
   - Satisfying press animation
   - Bright, attention-grabbing color

4. **Copy to Clipboard**
   - One-tap copy
   - Visual confirmation (checkmark, "Copied!")
   - Formats joke nicely for pasting

### P1 - Important for Fun

5. **Share Button**
   - Native share sheet on mobile (Web Share API)
   - Fallback to copy on desktop
   - Pre-formatted share text

6. **Rate Jokes (Funny/Not Funny)**
   - Thumbs up/down buttons
   - Tracks ratings locally
   - Uses ratings to show "Top Rated" section later

7. **Favorites List**
   - Heart button to save jokes
   - Separate favorites view
   - Persist across sessions

8. **Fun Animations & Sounds**
   - Drumroll before punchline (for knock-knock)
   - Confetti on "Funny!" rating
   - Cartoon "boing" on button press

### P2 - Nice to Have

9. **Submit Your Own Joke**
   - Simple form: setup + punchline
   - Moderation flag (stored but not shown publicly)
   - Shows in "My Jokes" section

10. **Joke of the Day**
    - Featured joke on landing
    - Changes daily (seeded random)

11. **Top Rated Jokes**
    - Section showing highly-rated jokes
    - Based on aggregate ratings

12. **Achievements**
    - "Told 10 jokes"
    - "Rated 50 jokes"
    - "Saved 5 favorites"

---

## Technical Approach

### Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 + React 19 |
| Styling | Tailwind + DaisyUI |
| State | Zustand (local store) |
| Persistence | localStorage + useAuthSync hook |
| API Calls | fetch (to joke APIs) |
| Animations | Framer Motion (or CSS transitions) |

### File Structure

```
apps/web/src/
├── app/
│   └── apps/
│       └── joke-generator/
│           └── page.tsx              # Route - just imports JokeGenerator
│
├── apps/
│   └── joke-generator/
│       ├── components/
│       │   ├── JokeDisplay.tsx       # Shows the joke text
│       │   ├── JokeButton.tsx        # Big "Tell Me A Joke" button
│       │   ├── CategoryTabs.tsx      # Category filter pills
│       │   ├── RatingButtons.tsx     # Thumbs up/down
│       │   ├── ActionButtons.tsx     # Copy, Share, Save
│       │   ├── FavoritesList.tsx     # Favorites drawer/modal
│       │   └── SubmitJokeForm.tsx    # User joke submission
│       │
│       ├── hooks/
│       │   ├── useJoke.ts            # Fetch random joke hook
│       │   └── useJokeStore.ts       # Zustand wrapper with localStorage
│       │
│       ├── lib/
│       │   ├── store.ts              # Zustand store definition
│       │   ├── jokeApi.ts            # API fetching logic
│       │   ├── constants.ts          # Categories, config
│       │   └── types.ts              # TypeScript types
│       │
│       ├── JokeGenerator.tsx         # Main component
│       ├── index.ts                  # Exports
│       │
│       └── __tests__/
│           ├── JokeGenerator.test.tsx
│           └── store.test.ts
│
└── public/
    └── sounds/
        └── apps/
            └── joke-generator/
                ├── button-press.mp3
                ├── drumroll.mp3
                └── tada.mp3
```

### Component Architecture

```tsx
// apps/web/src/apps/joke-generator/JokeGenerator.tsx
"use client";

import { useState } from "react";
import { useJokeStore } from "./hooks/useJokeStore";
import { useJoke } from "./hooks/useJoke";
import { CategoryTabs } from "./components/CategoryTabs";
import { JokeDisplay } from "./components/JokeDisplay";
import { JokeButton } from "./components/JokeButton";
import { RatingButtons } from "./components/RatingButtons";
import { ActionButtons } from "./components/ActionButtons";
import { FavoritesList } from "./components/FavoritesList";

export function JokeGenerator() {
  const [showFavorites, setShowFavorites] = useState(false);
  const { category, setCategory, favorites, addFavorite, rateJoke } = useJokeStore();
  const { joke, isLoading, fetchJoke } = useJoke(category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-orange-400 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-800">Joke Generator</h1>
        <button onClick={() => setShowFavorites(true)}>
          <span className="text-2xl">❤️</span>
        </button>
      </header>

      <CategoryTabs selected={category} onSelect={setCategory} />

      <JokeDisplay joke={joke} isLoading={isLoading} />

      {joke && !isLoading && (
        <RatingButtons
          onFunny={() => rateJoke(joke.id, "funny")}
          onNotFunny={() => rateJoke(joke.id, "not-funny")}
        />
      )}

      <JokeButton onClick={fetchJoke} isLoading={isLoading} />

      {joke && (
        <ActionButtons
          joke={joke}
          onSave={() => addFavorite(joke)}
          isSaved={favorites.some(f => f.id === joke.id)}
        />
      )}

      <FavoritesList
        open={showFavorites}
        onClose={() => setShowFavorites(false)}
        favorites={favorites}
      />
    </div>
  );
}
```

---

## Joke Sources

### Primary APIs

#### 1. Official Joke API (Recommended for MVP)
```
GET https://official-joke-api.appspot.com/random_joke
GET https://official-joke-api.appspot.com/jokes/ten
GET https://official-joke-api.appspot.com/jokes/programming/random
```

**Response:**
```json
{
  "type": "general",
  "setup": "Why don't scientists trust atoms?",
  "punchline": "Because they make up everything!"
}
```

**Pros:** Simple, free, no auth required
**Cons:** Limited categories, can't filter for kid-specific

#### 2. JokeAPI v2 (Best for Categories)
```
GET https://v2.jokeapi.dev/joke/Any?safe-mode&type=twopart
GET https://v2.jokeapi.dev/joke/Pun?safe-mode
GET https://v2.jokeapi.dev/joke/Misc?safe-mode&type=twopart
```

**IMPORTANT: Always use `safe-mode` flag to filter out inappropriate content!**

**Response:**
```json
{
  "category": "Pun",
  "type": "twopart",
  "setup": "What do you call a fish without eyes?",
  "delivery": "A fsh",
  "safe": true,
  "id": 123
}
```

**Pros:** More categories, safe-mode filter, reliable
**Cons:** Rate limited (120 requests/minute)

#### 3. icanhazdadjoke.com
```
GET https://icanhazdadjoke.com/
Headers: { Accept: "application/json" }
```

**Response:**
```json
{
  "id": "abc123",
  "joke": "Why did the coffee file a police report? It got mugged.",
  "status": 200
}
```

**Pros:** Great for dad jokes, free
**Cons:** Single-line format (no setup/punchline split)

### Fallback: Local Curated JSON

For reliability and guaranteed kid-friendly content, maintain a local JSON file:

```typescript
// apps/web/src/apps/joke-generator/lib/localJokes.ts
export const CURATED_JOKES: Joke[] = [
  {
    id: "local-001",
    category: "knock-knock",
    setup: "Knock knock.",
    punchline: "Who's there?\nBoo.\nBoo who?\nDon't cry, it's just a joke!",
    source: "local"
  },
  {
    id: "local-002",
    category: "animal",
    setup: "What do you call a sleeping dinosaur?",
    punchline: "A dino-snore!",
    source: "local"
  },
  // ... 50-100 curated jokes
];
```

### API Wrapper Strategy

```typescript
// apps/web/src/apps/joke-generator/lib/jokeApi.ts
import { CURATED_JOKES } from "./localJokes";

export type JokeCategory = "all" | "dad" | "knock-knock" | "pun" | "animal";

export interface Joke {
  id: string;
  category: JokeCategory;
  setup: string;
  punchline: string;
  source: "official-joke-api" | "jokeapi" | "icanhazdadjoke" | "local" | "user";
}

const API_ENDPOINTS = {
  "official-joke-api": "https://official-joke-api.appspot.com/random_joke",
  "jokeapi": "https://v2.jokeapi.dev/joke/Any?safe-mode&type=twopart",
  "icanhazdadjoke": "https://icanhazdadjoke.com/",
};

export async function fetchRandomJoke(category: JokeCategory): Promise<Joke> {
  // Try external APIs first
  try {
    if (category === "dad" || category === "all") {
      const response = await fetch(API_ENDPOINTS["icanhazdadjoke"], {
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        return transformDadJoke(data);
      }
    }

    // Try JokeAPI with category mapping
    const jokeApiCategory = mapCategoryToJokeApi(category);
    const response = await fetch(
      `https://v2.jokeapi.dev/joke/${jokeApiCategory}?safe-mode&type=twopart`
    );
    if (response.ok) {
      const data = await response.json();
      return transformJokeApi(data);
    }
  } catch (error) {
    console.warn("External joke API failed, falling back to local:", error);
  }

  // Fallback to local curated jokes
  return getRandomLocalJoke(category);
}

function getRandomLocalJoke(category: JokeCategory): Joke {
  const filtered = category === "all"
    ? CURATED_JOKES
    : CURATED_JOKES.filter(j => j.category === category);

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
```

---

## User Data & Persistence

### App ID Configuration

**appId:** `"joke-generator"`

Add to `VALID_APP_IDS` in `packages/db/src/schema/app-progress.ts`:

```typescript
export const VALID_APP_IDS = [
  "hill-climb",
  "monster-truck",
  "weather",
  "joke-generator",  // <-- ADD THIS
] as const;
```

### Data Shape

```typescript
// apps/web/src/apps/joke-generator/lib/types.ts
export interface JokeGeneratorProgress {
  // Favorites
  favorites: SavedJoke[];

  // Rating history
  ratings: JokeRating[];

  // User-submitted jokes
  submittedJokes: UserJoke[];

  // Preferences
  lastCategory: JokeCategory;

  // Stats
  jokesViewed: number;
  jokesCopied: number;
  jokesShared: number;

  // Timestamp for sync
  lastUpdated: number;
}

export interface SavedJoke {
  id: string;
  setup: string;
  punchline: string;
  category: JokeCategory;
  savedAt: number;
}

export interface JokeRating {
  jokeId: string;
  rating: "funny" | "not-funny";
  ratedAt: number;
}

export interface UserJoke {
  id: string;
  setup: string;
  punchline: string;
  category: JokeCategory;
  createdAt: number;
  approved: boolean; // For future moderation
}
```

### Zustand Store with Persistence

```typescript
// apps/web/src/apps/joke-generator/lib/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JokeGeneratorProgress, JokeCategory, SavedJoke, Joke } from "./types";

const STORAGE_KEY = "joke-generator-progress";

const initialState: JokeGeneratorProgress = {
  favorites: [],
  ratings: [],
  submittedJokes: [],
  lastCategory: "all",
  jokesViewed: 0,
  jokesCopied: 0,
  jokesShared: 0,
  lastUpdated: Date.now(),
};

interface JokeStore extends JokeGeneratorProgress {
  // Actions
  setCategory: (category: JokeCategory) => void;
  addFavorite: (joke: Joke) => void;
  removeFavorite: (jokeId: string) => void;
  rateJoke: (jokeId: string, rating: "funny" | "not-funny") => void;
  submitJoke: (setup: string, punchline: string, category: JokeCategory) => void;
  incrementViewed: () => void;
  incrementCopied: () => void;
  incrementShared: () => void;
  getState: () => JokeGeneratorProgress;
  setState: (data: JokeGeneratorProgress) => void;
}

export const useJokeStore = create<JokeStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCategory: (category) => {
        set({ lastCategory: category, lastUpdated: Date.now() });
      },

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
          lastUpdated: Date.now(),
        }));
      },

      removeFavorite: (jokeId) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== jokeId),
          lastUpdated: Date.now(),
        }));
      },

      rateJoke: (jokeId, rating) => {
        set((state) => ({
          ratings: [
            ...state.ratings.filter((r) => r.jokeId !== jokeId),
            { jokeId, rating, ratedAt: Date.now() },
          ],
          lastUpdated: Date.now(),
        }));
      },

      submitJoke: (setup, punchline, category) => {
        const newJoke = {
          id: `user-${Date.now()}`,
          setup,
          punchline,
          category,
          createdAt: Date.now(),
          approved: false,
        };
        set((state) => ({
          submittedJokes: [...state.submittedJokes, newJoke],
          lastUpdated: Date.now(),
        }));
      },

      incrementViewed: () => {
        set((state) => ({
          jokesViewed: state.jokesViewed + 1,
          lastUpdated: Date.now(),
        }));
      },

      incrementCopied: () => {
        set((state) => ({
          jokesCopied: state.jokesCopied + 1,
          lastUpdated: Date.now(),
        }));
      },

      incrementShared: () => {
        set((state) => ({
          jokesShared: state.jokesShared + 1,
          lastUpdated: Date.now(),
        }));
      },

      getState: () => {
        const state = get();
        return {
          favorites: state.favorites,
          ratings: state.ratings,
          submittedJokes: state.submittedJokes,
          lastCategory: state.lastCategory,
          jokesViewed: state.jokesViewed,
          jokesCopied: state.jokesCopied,
          jokesShared: state.jokesShared,
          lastUpdated: state.lastUpdated,
        };
      },

      setState: (data) => {
        set({
          ...data,
          lastUpdated: Date.now(),
        });
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
);
```

### Using useAuthSync

```typescript
// apps/web/src/apps/joke-generator/hooks/useJokeStoreSync.ts
"use client";

import { useAuthSync } from "@/shared/hooks";
import { useJokeStore } from "../lib/store";

const STORAGE_KEY = "joke-generator-progress";

export function useJokeStoreSync() {
  const getState = useJokeStore((s) => s.getState);
  const setState = useJokeStore((s) => s.setState);

  return useAuthSync({
    appId: "joke-generator",
    localStorageKey: STORAGE_KEY,
    getState,
    setState,
    debounceMs: 2000,
    onSyncComplete: (source) => {
      console.log(`Joke Generator synced from ${source}`);
    },
  });
}
```

---

## Kid-Friendly Design

### Visual Design

| Element | Style |
|---------|-------|
| Background | Bright gradient (yellow to orange) |
| Primary button | Large, purple, bouncy |
| Text | Large font (18-24px minimum) |
| Icons | Big, colorful, recognizable |
| Cards | Rounded corners (16px+), soft shadows |

### Button Sizes

```css
/* Minimum touch targets */
.btn-joke {
  min-height: 64px;
  min-width: 200px;
  font-size: 1.5rem;
  border-radius: 9999px;
}

.btn-action {
  min-height: 48px;
  min-width: 48px;
}
```

### Animations

1. **Button Press**
   - Scale down to 0.95 on press
   - Scale back to 1.0 with bounce easing
   - Optional sound effect

2. **Joke Reveal**
   - Fade in from opacity 0
   - Slide up 20px
   - 300ms duration

3. **Rating Celebration**
   - Confetti burst on "Funny!" rating
   - Small shake on "Not Funny"

4. **Save to Favorites**
   - Heart scales up and fills with color
   - Particle burst around heart

### Sound Effects (Optional)

| Action | Sound |
|--------|-------|
| Button press | Cartoon "boing" |
| Joke appears | Drumroll (short) |
| Rate funny | Crowd laughter |
| Copy success | Pop sound |
| Save favorite | Sparkle |

### Accessibility

- All buttons have `aria-label`
- Color contrast meets WCAG AA
- Focus states visible
- Reduced motion support
- Screen reader friendly joke structure

---

## Error Handling

### API Failures

```typescript
// Graceful degradation
try {
  joke = await fetchRandomJoke(category);
} catch (error) {
  // Show local joke instead
  joke = getRandomLocalJoke(category);

  // Optional: show subtle toast
  toast.info("Using offline jokes");
}
```

### Empty States

- **No favorites:** "You haven't saved any jokes yet! Tap the heart to save your favorites."
- **API error:** "Oops! The joke factory is taking a break. Here's one from our collection:"
- **No jokes in category:** "We're fresh out of [category] jokes! Try another category."

---

## Testing Strategy

### Unit Tests

```typescript
// __tests__/store.test.ts
describe("JokeStore", () => {
  it("adds joke to favorites", () => {
    const { addFavorite, favorites } = useJokeStore.getState();
    addFavorite(mockJoke);
    expect(useJokeStore.getState().favorites).toHaveLength(1);
  });

  it("removes joke from favorites", () => {
    // ...
  });

  it("rates joke and replaces previous rating", () => {
    // ...
  });
});
```

### Component Tests

```typescript
// __tests__/JokeGenerator.test.tsx
describe("JokeGenerator", () => {
  it("renders without crashing", () => {
    render(<JokeGenerator />);
    expect(screen.getByText("TELL ME A JOKE!")).toBeInTheDocument();
  });

  it("displays joke after button click", async () => {
    // Mock API
    // Click button
    // Assert joke appears
  });

  it("copies joke to clipboard", async () => {
    // ...
  });
});
```

---

## Implementation Phases

### Phase 1: MVP (Day 1)
- [ ] Create folder structure
- [ ] Basic JokeGenerator component
- [ ] Fetch from Official Joke API
- [ ] Display joke with loading state
- [ ] Big button that works
- [ ] Basic styling

### Phase 2: Core Features (Day 2)
- [ ] Category tabs
- [ ] Copy to clipboard
- [ ] Share button (Web Share API)
- [ ] Local curated jokes fallback

### Phase 3: Persistence (Day 3)
- [ ] Zustand store setup
- [ ] Favorites functionality
- [ ] Rating system
- [ ] useAuthSync integration
- [ ] Add to VALID_APP_IDS

### Phase 4: Polish (Day 4)
- [ ] Animations (Framer Motion)
- [ ] Sound effects
- [ ] Submit your own joke form
- [ ] Responsive design tweaks
- [ ] Keyboard shortcuts

### Phase 5: Testing & Deploy
- [ ] Unit tests
- [ ] Component tests
- [ ] Manual QA on mobile
- [ ] Deploy to Railway

---

## Future Ideas

- **Joke Timer:** Challenge mode - how fast can you read the punchline?
- **Daily Streak:** Come back each day for Joke of the Day
- **Joke Battle:** Two jokes, vote which is funnier
- **Sound Effects Board:** Pair jokes with sound buttons
- **Print Joke Cards:** Generate printable joke cards to share IRL

---

## References

- [Web Share API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [JokeAPI Documentation](https://jokeapi.dev/#documentation)
- [Official Joke API](https://github.com/15Dkatz/official_joke_api)
- [icanhazdadjoke API](https://icanhazdadjoke.com/api)
- [Framer Motion](https://www.framer.com/motion/)
