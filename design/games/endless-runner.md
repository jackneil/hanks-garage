# Endless Runner - Game Design Document

## Overview

**Endless Runner** is a 2D side-scrolling runner game where players auto-run through an endless procedurally generated world, jumping over obstacles, sliding under barriers, and collecting coins. Inspired by mega-hits like **Subway Surfers** (3+ billion downloads) and **Temple Run**, this game captures the "one more try" magic that makes kids (and adults) addicted.

**Why Kids Love It:**
- **Instant action** - No tutorials, no waiting, just GO
- **Simple controls** - Jump and duck, that's it
- **Constant rewards** - Coins everywhere, high score chasing
- **"I almost had it!"** - Near-misses make you want to retry immediately
- **Unlockable characters** - Collect coins to unlock fun new runners

**Target Player**: Hank Neil, age 8 (and kids 6-14)
**Platform**: Web (mobile + desktop)
**Style**: 2D colorful cartoon graphics, parallax backgrounds

---

## Core Game Loop

```
AUTO-RUN forward (no stopping)
    |
REACT to obstacles (jump/duck)
    |
COLLECT coins and power-ups
    |
CRASH (inevitable)
    |
SEE your score + "New High Score!"
    |
UNLOCK new characters with coins
    |
"ONE MORE TRY!" -> REPEAT
```

### Why This Loop Works

Based on Subway Surfers' massive success:

1. **Zero friction start** - Tap once and you're running
2. **Simple binary choices** - Jump OR duck, no complex combos
3. **Escalating difficulty** - Speed increases gradually, you don't notice until BAM
4. **Near-miss dopamine** - "I ALMOST made it past that one!"
5. **Visible progress** - Distance counter always climbing
6. **Quick retry** - Dead to running in under 2 seconds

---

## Controls

### Mobile (Touch)

```
┌─────────────────────────────────────────┐
│                                         │
│         SWIPE UP = JUMP                 │
│                                         │
│           2D GAME VIEW                  │
│         (side-scrolling)                │
│                                         │
│        SWIPE DOWN = DUCK/SLIDE          │
│                                         │
│   [PAUSE]                    [COINS: 0] │
└─────────────────────────────────────────┘
```

**Touch Controls:**
| Gesture | Action |
|---------|--------|
| Swipe Up | Jump |
| Swipe Down | Duck/Slide |
| Tap | Jump (alternative) |
| Tap & Hold | Extended slide |

**Mobile Considerations:**
- Large touch zones (whole screen is the input)
- Visual feedback on input (character animation)
- Works in portrait AND landscape
- No pinch/zoom interference

### Desktop (Keyboard)

| Key | Action |
|-----|--------|
| Space / W / Arrow Up | Jump |
| S / Arrow Down | Duck/Slide |
| P / Escape | Pause |

**Desktop Polish:**
- Spacebar is primary (most natural)
- Arrow keys for kids who prefer them
- No mouse required (keyboard only)

---

## Features (Priority Order)

### MVP (Must Have for Launch)

1. **Auto-running character**
   - Constant rightward movement
   - Simple run animation (2-4 frames)
   - Jump animation
   - Slide animation

2. **Basic obstacles**
   - Ground obstacles (jump over)
   - Overhead obstacles (slide under)
   - Random generation with fair spacing

3. **Collision detection**
   - Hit obstacle = game over
   - Forgiving hitboxes (smaller than visual)

4. **Coin collection**
   - Floating coins in patterns
   - +10 coins each
   - Satisfying sound effect
   - Coin counter HUD

5. **Distance tracking**
   - Meters counter (always visible)
   - High score saved locally

6. **Game over screen**
   - Final distance
   - Coins collected this run
   - High score comparison
   - "Play Again" button (BIG)

7. **Pause functionality**
   - Pause button on mobile
   - ESC on desktop

### Phase 2 (Important for Fun)

8. **Speed escalation**
   - Start slow (kids can learn)
   - Gradually increase over 60 seconds
   - Cap at challenging-but-fair speed

9. **Power-ups**
   - **Magnet** - Attracts nearby coins (10 seconds)
   - **Shield** - Survive one hit (rare)
   - **2x Coins** - Double coin value (15 seconds)

10. **Character unlocks**
    - Starter character (free)
    - 3-5 unlockable characters
    - Different visual styles
    - Same gameplay (no pay-to-win)

11. **Sound effects**
    - Jump sound
    - Slide sound
    - Coin collect
    - Crash/game over
    - Background music

12. **Parallax backgrounds**
    - 3 layers moving at different speeds
    - Creates depth illusion

### Phase 3 (Nice to Have)

13. **Daily challenges**
    - "Collect 100 coins in one run"
    - "Run 500 meters without coins"
    - Bonus coin rewards

14. **Themes/worlds**
    - Forest, City, Space
    - Different obstacle sets per theme
    - Unlockable with coins

15. **Leaderboard**
    - Personal best
    - (Future: Global with auth)

16. **Achievements**
    - "First 1000 meters"
    - "Collect 500 coins total"
    - Badge display

---

## Progression System

### Currency: Coins (Soft Currency Only)

**No real money, no ads** - this is for an 8-year-old.

#### Earning Coins

| Source | Amount | Notes |
|--------|--------|-------|
| Coin pickup | 10 | Common, everywhere |
| Silver coin | 25 | Less common |
| Gold coin | 50 | Rare, in tricky spots |
| Power-up coins | Variable | Magnet/2x multiplier |
| Distance bonus | +1 per 100m | End of run reward |

#### Spending Coins

| Item | Cost | Description |
|------|------|-------------|
| **Speedy Sam** | FREE | Starter character |
| **Rocket Rita** | 500 | Faster looking |
| **Bouncy Bob** | 1000 | Higher jump visual |
| **Ninja Nancy** | 2000 | Cool ninja outfit |
| **Robo Randy** | 5000 | Robot character |
| **Golden Gary** | 10000 | Ultimate unlock |

### Progression Pacing

**First run (30 seconds - 2 minutes):**
- Learn jump/duck naturally
- Collect 30-100 coins
- Die around 200-500m
- See high score set

**First 10 minutes:**
- Improve to 500-1000m
- Collect 200-400 coins
- Almost unlock first character (builds anticipation)

**First session (20-30 minutes):**
- Unlock Rocket Rita (first purchase!)
- Best run 1000-2000m
- Start recognizing obstacle patterns

**First week:**
- Unlock 2-3 characters
- Consistent 2000m+ runs
- Developing mastery

---

## Technical Approach

### Stack

```
Next.js 16 + React 19
TypeScript
2D Canvas API (via HTML5 <canvas>)
OR CSS transforms + requestAnimationFrame
Zustand for state management
```

### Why Canvas vs CSS?

**Canvas (Recommended):**
- Better performance for many moving objects
- Precise collision detection
- Industry standard for 2D games
- Easier sprite animations

**CSS Transforms (Alternative):**
- Simpler to implement
- React-friendly
- Good enough for basic runner
- Easier responsive design

**Decision: Start with Canvas** - it's more scalable and performs better.

### Key Architecture

```typescript
// Core game loop
function gameLoop(timestamp: number) {
  const deltaTime = timestamp - lastTime;

  update(deltaTime);  // Move everything
  checkCollisions(); // Hit detection
  render();          // Draw frame

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Obstacle generation
function generateObstacles() {
  // Procedural with minimum spacing
  // Ensures fair patterns
  // Difficulty scales with distance
}

// Collision (AABB with smaller hitboxes)
function checkCollision(player: Rect, obstacle: Rect): boolean {
  // Shrink hitboxes by 20% for forgiveness
  const p = shrinkRect(player, 0.2);
  const o = shrinkRect(obstacle, 0.2);
  return rectIntersects(p, o);
}
```

### Performance Considerations

- **Object pooling** - Reuse obstacle/coin objects
- **Off-screen culling** - Don't render/update off-screen objects
- **Sprite sheets** - One image load, multiple frames
- **60fps target** - Use deltaTime for frame-rate independence
- **Mobile optimization** - Test on low-end devices

---

## Code Sources (GitHub Repos to Reference)

### Primary References

1. **straker/endless-runner-html5-game**
   - **URL**: https://github.com/straker/endless-runner-html5-game
   - **Why**: Clean Canvas implementation with tutorial
   - **Take**: Game loop structure, collision detection, parallax scrolling
   - **Language**: Vanilla JavaScript

2. **crlimacastro/Canvas-Runner**
   - **URL**: https://github.com/crlimacastro/Canvas-Runner
   - **Why**: Simple tutorial-style code, well-documented
   - **Take**: Player class, gravity/jump physics, obstacle spawning
   - **Language**: Vanilla JavaScript

3. **kilicbaran/endless-runner**
   - **URL**: https://github.com/kilicbaran/endless-runner
   - **Demo**: https://kilicbaran.github.io/endless-runner/
   - **Why**: Clean, minimal implementation
   - **Take**: Simple obstacle patterns, scoring
   - **Language**: JavaScript

### Secondary References (For Specific Features)

4. **ohsnapitskenny/RunnerX**
   - **URL**: https://github.com/ohsnapitskenny/RunnerX
   - **Why**: TypeScript implementation
   - **Take**: Type definitions, class structure
   - **Language**: TypeScript

5. **salatielsql/teddy-react-endless-runner-game**
   - **URL**: https://github.com/salatielsql/teddy-react-endless-runner-game
   - **Why**: React-based approach
   - **Take**: React integration patterns
   - **Language**: React/JavaScript

6. **pbarnabic/EndlessRunnerGame**
   - **URL**: https://github.com/pbarnabic/EndlessRunnerGame
   - **Why**: Lane-based runner variant
   - **Take**: Lane switching mechanics (if we want that)
   - **Language**: JavaScript ES6

7. **RNtaate/Endless-Runner**
   - **URL**: https://github.com/RNtaate/Endless-Runner
   - **Why**: Phaser 3 implementation
   - **Take**: Coin collection, missile/obstacle patterns
   - **Language**: JavaScript/Phaser

### GitHub Topics to Explore

- https://github.com/topics/endless-runner
- https://github.com/topics/runner-game
- https://github.com/topics/infinite-runner

---

## Kid-Friendly Design

### Touch Targets
- All buttons minimum **60x60 pixels**
- Pause button always accessible
- "Play Again" button is HUGE (fills bottom third of screen)

### Visual Clarity
- **High contrast** - Character pops against background
- **Bright colors** - Happy, energetic palette
- **No scary obstacles** - Friendly-looking barriers
- **Clear coin visibility** - Sparkle/glow effect

### Forgiving Gameplay
- **Generous hitboxes** - 20% smaller than visuals
- **Speed ramp is gradual** - First 30 seconds are easy
- **Instant retry** - "Play Again" is one tap away
- **No punishment** - Crash is "oops!" not "FAIL"

### Celebration Moments
- **Coin collect** - Satisfying "ding!" + particle burst
- **New high score** - Confetti explosion + fanfare
- **Character unlock** - Big reveal animation
- **Distance milestones** - "500m!", "1000m!" callouts

### Reading Level
- Minimal text
- Icons with text (coin icon + number)
- "TAP TO PLAY" not "Press any key to continue"
- Numbers are universal

### Safety
- **No chat or multiplayer**
- **No real money**
- **No external links**
- **No personal data**

---

## User Interface

### Main Menu

```
┌─────────────────────────────────────────┐
│                                         │
│         🏃 ENDLESS RUNNER 🏃            │
│                                         │
│         [High Score: 2,451m]            │
│                                         │
│         ╔═══════════════════╗           │
│         ║                   ║           │
│         ║    ▶ PLAY ▶      ║           │
│         ║                   ║           │
│         ╚═══════════════════╝           │
│                                         │
│    [🎭 Characters]    [🎵 Sound]        │
│                                         │
│         [Coins: 1,234 🪙]               │
│                                         │
└─────────────────────────────────────────┘
```

### In-Game HUD

```
┌─────────────────────────────────────────┐
│ [||]  Distance: 1,234m      🪙 456      │
│                                         │
│                                         │
│         🏃                              │
│     ___====___====___     🪙  🪙  🪙   │
│                      ████               │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

- **Pause button** (top-left)
- **Distance** (top-center)
- **Coins this run** (top-right)
- **Power-up indicator** (when active)

### Game Over Screen

```
┌─────────────────────────────────────────┐
│                                         │
│            GAME OVER!                   │
│                                         │
│         Distance: 1,234m                │
│         ⭐ NEW HIGH SCORE! ⭐           │
│                                         │
│         Coins: +456 🪙                  │
│         Total: 1,690 🪙                 │
│                                         │
│         ╔═══════════════════╗           │
│         ║   ▶ PLAY AGAIN   ║           │
│         ╚═══════════════════╝           │
│                                         │
│              [🏠 Menu]                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## File Structure

Following the project's compartmentalized architecture:

```
apps/web/src/
├── app/
│   └── games/
│       └── endless-runner/
│           └── page.tsx              # Route (dynamic import)
│
├── games/
│   └── endless-runner/               # SELF-CONTAINED MODULE
│       ├── components/
│       │   ├── Game.tsx              # Main canvas + game loop
│       │   ├── Player.tsx            # Player rendering/state
│       │   ├── Obstacle.tsx          # Obstacle types
│       │   ├── Coin.tsx              # Coin rendering/collection
│       │   ├── PowerUp.tsx           # Power-up items
│       │   ├── Background.tsx        # Parallax layers
│       │   ├── HUD.tsx               # Score, coins, distance
│       │   ├── GameOver.tsx          # End screen
│       │   ├── MainMenu.tsx          # Start screen
│       │   ├── CharacterSelect.tsx   # Unlock/select characters
│       │   └── TouchControls.tsx     # Mobile input overlay
│       │
│       ├── hooks/
│       │   ├── useGameLoop.ts        # requestAnimationFrame loop
│       │   ├── useKeyboardInput.ts   # Desktop controls
│       │   ├── useTouchInput.ts      # Mobile swipe detection
│       │   ├── useCollision.ts       # Hit detection
│       │   └── useAudio.ts           # Sound effects
│       │
│       ├── lib/
│       │   ├── store.ts              # Zustand game state
│       │   ├── types.ts              # TypeScript interfaces
│       │   ├── constants.ts          # Game balance values
│       │   ├── physics.ts            # Jump/gravity calculations
│       │   ├── spawner.ts            # Obstacle/coin generation
│       │   ├── collision.ts          # AABB collision detection
│       │   └── persistence.ts        # localStorage wrapper
│       │
│       ├── assets/                   # Game-specific assets
│       │   ├── sprites/              # Character/obstacle sprites
│       │   ├── backgrounds/          # Parallax layers
│       │   └── sounds/               # Audio files
│       │
│       ├── __tests__/                # Tests for this game
│       │   ├── Game.test.tsx
│       │   ├── collision.test.ts
│       │   └── spawner.test.ts
│       │
│       └── index.ts                  # Public exports
│
└── public/
    └── games/
        └── endless-runner/           # Static assets if needed
            └── sprites/
```

### Route File (Thin Wrapper)

```tsx
// apps/web/src/app/games/endless-runner/page.tsx
"use client";

import dynamic from 'next/dynamic';

const EndlessRunnerGame = dynamic(
  () => import('@/games/endless-runner').then(mod => mod.Game),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-sky-400">
        <div className="text-white text-2xl animate-pulse">Loading...</div>
      </div>
    )
  }
);

export default function EndlessRunnerPage() {
  return <EndlessRunnerGame />;
}
```

---

## User Data & Persistence

### App Registration

**appId**: `"endless-runner"`

Add to `packages/db/src/schema/app-progress.ts`:

```typescript
export const VALID_APP_IDS = [
  "hill-climb",
  "monster-truck",
  "weather",
  "endless-runner",  // <-- ADD THIS
] as const;
```

### Data Shape

```typescript
// games/endless-runner/lib/types.ts

export interface EndlessRunnerProgress {
  // Scores
  highScore: number;           // Best distance in meters
  totalDistance: number;       // Lifetime distance run

  // Currency
  totalCoins: number;          // Lifetime coins (for spending)
  coinsCollected: number;      // Total coins ever collected (stat)

  // Unlocks
  unlockedCharacters: string[]; // Array of character IDs
  selectedCharacter: string;    // Currently selected character

  // Stats
  gamesPlayed: number;
  longestStreak: number;       // Consecutive days played (future)

  // Achievements (future)
  achievements: string[];

  // Timestamps
  lastPlayedAt: number;        // Unix timestamp
  updatedAt: number;           // For sync conflict resolution
}

export const DEFAULT_PROGRESS: EndlessRunnerProgress = {
  highScore: 0,
  totalDistance: 0,
  totalCoins: 0,
  coinsCollected: 0,
  unlockedCharacters: ["speedy-sam"], // Starter character
  selectedCharacter: "speedy-sam",
  gamesPlayed: 0,
  longestStreak: 0,
  achievements: [],
  lastPlayedAt: 0,
  updatedAt: Date.now(),
};
```

### Store Integration

```typescript
// games/endless-runner/lib/store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EndlessRunnerProgress } from './types';
import { DEFAULT_PROGRESS } from './types';

interface EndlessRunnerStore extends EndlessRunnerProgress {
  // Actions
  addCoins: (amount: number) => void;
  setHighScore: (distance: number) => void;
  unlockCharacter: (characterId: string) => void;
  selectCharacter: (characterId: string) => void;
  incrementGamesPlayed: () => void;
  addDistance: (meters: number) => void;

  // State getters
  getState: () => EndlessRunnerProgress;
  setState: (data: EndlessRunnerProgress) => void;
}

const LOCAL_STORAGE_KEY = 'endless-runner-progress';

export const useEndlessRunnerStore = create<EndlessRunnerStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PROGRESS,

      addCoins: (amount) => set((state) => ({
        totalCoins: state.totalCoins + amount,
        coinsCollected: state.coinsCollected + amount,
        updatedAt: Date.now(),
      })),

      setHighScore: (distance) => set((state) => ({
        highScore: Math.max(state.highScore, distance),
        updatedAt: Date.now(),
      })),

      unlockCharacter: (characterId) => set((state) => ({
        unlockedCharacters: [...new Set([...state.unlockedCharacters, characterId])],
        updatedAt: Date.now(),
      })),

      selectCharacter: (characterId) => set({
        selectedCharacter: characterId,
        updatedAt: Date.now(),
      }),

      incrementGamesPlayed: () => set((state) => ({
        gamesPlayed: state.gamesPlayed + 1,
        lastPlayedAt: Date.now(),
        updatedAt: Date.now(),
      })),

      addDistance: (meters) => set((state) => ({
        totalDistance: state.totalDistance + meters,
        updatedAt: Date.now(),
      })),

      getState: () => {
        const { addCoins, setHighScore, unlockCharacter, selectCharacter,
                incrementGamesPlayed, addDistance, getState, setState, ...data } = get();
        return data;
      },

      setState: (data) => set({
        ...data,
        updatedAt: Date.now(),
      }),
    }),
    {
      name: LOCAL_STORAGE_KEY,
    }
  )
);
```

### Auth Sync Integration

```typescript
// games/endless-runner/components/Game.tsx

import { useAuthSync } from '@/shared/hooks/useAuthSync';
import { useEndlessRunnerStore } from '../lib/store';
import type { EndlessRunnerProgress } from '../lib/types';

export function Game() {
  const store = useEndlessRunnerStore();

  // Sync with database when authenticated
  const { isAuthenticated, syncStatus, forceSync } = useAuthSync<EndlessRunnerProgress>({
    appId: 'endless-runner',
    localStorageKey: 'endless-runner-progress',
    getState: store.getState,
    setState: store.setState,
    debounceMs: 3000, // Save every 3 seconds if changes
    onSyncComplete: (source) => {
      console.log(`Synced from ${source}`);
    },
  });

  // Game logic here...

  // Force sync on game over (important saves)
  const handleGameOver = async (finalDistance: number, coinsEarned: number) => {
    store.addDistance(finalDistance);
    store.addCoins(coinsEarned);
    store.setHighScore(finalDistance);
    store.incrementGamesPlayed();

    // Force immediate sync for important progress
    if (isAuthenticated) {
      await forceSync();
    }
  };

  return (
    // ...game UI
  );
}
```

---

## Audio Design

### Sound Effects

| Sound | Trigger | Style |
|-------|---------|-------|
| Jump | Player jumps | Bouncy "boing" |
| Slide | Player ducks | Quick whoosh |
| Coin collect | Touch coin | Bright "ding" or "cha-ching" |
| Power-up collect | Touch power-up | Magical sparkle |
| Crash | Hit obstacle | Soft "bonk" (not scary) |
| New high score | Beat record | Fanfare + confetti |
| Button tap | Any button | Soft click |

### Music

- Upbeat, energetic loop
- 60-90 seconds before seamless loop
- Not distracting from gameplay
- Volume slider in settings

---

## Implementation Phases

### Phase 1: Core Runner (MVP)
- [ ] Canvas setup with game loop
- [ ] Player with run animation
- [ ] Jump/duck mechanics with keyboard
- [ ] Ground obstacles (jump over)
- [ ] Overhead obstacles (duck under)
- [ ] Collision detection
- [ ] Distance counter
- [ ] Game over state
- [ ] Restart functionality

**Deliverable**: Playable runner on desktop

### Phase 2: Mobile + Polish
- [ ] Touch controls (swipe up/down)
- [ ] Responsive canvas sizing
- [ ] Coin collectibles
- [ ] Coin counter HUD
- [ ] Parallax background
- [ ] Basic sound effects
- [ ] Speed escalation

**Deliverable**: Playable on phone + coins

### Phase 3: Progression
- [ ] Zustand store setup
- [ ] localStorage persistence
- [ ] High score tracking
- [ ] Total coins tracking
- [ ] Character unlock system
- [ ] Character select screen
- [ ] Main menu

**Deliverable**: Progression loop working

### Phase 4: Power-ups + Fun
- [ ] Magnet power-up
- [ ] Shield power-up
- [ ] 2x Coins power-up
- [ ] Power-up HUD indicator
- [ ] More obstacles variety
- [ ] Better animations
- [ ] More sound effects
- [ ] Background music

**Deliverable**: Full game experience

### Phase 5: Auth Sync + Polish
- [ ] Add "endless-runner" to VALID_APP_IDS
- [ ] Integrate useAuthSync hook
- [ ] Sync on game over
- [ ] Merge progress on login
- [ ] Final polish and testing

**Deliverable**: Complete, synced game

---

## Success Metrics

1. **Hank plays 10+ runs** without getting bored
2. **Hank says "one more try"** after dying
3. **Hank asks about unlocking characters** (progression working)
4. **Hank shows friends** his high score
5. **No rage quits** - difficulty is fair

---

## References

### Game Design Inspiration
- [Subway Surfers](https://en.wikipedia.org/wiki/Subway_Surfers) - 3+ billion downloads, gold standard
- [Temple Run](https://en.wikipedia.org/wiki/Temple_Run) - Original mobile endless runner
- [Jetpack Joyride](https://en.wikipedia.org/wiki/Jetpack_Joyride) - Great power-up system

### Technical References
- [straker/endless-runner-html5-game](https://github.com/straker/endless-runner-html5-game) - Canvas tutorial
- [crlimacastro/Canvas-Runner](https://github.com/crlimacastro/Canvas-Runner) - Simple implementation
- [kilicbaran/endless-runner](https://github.com/kilicbaran/endless-runner) - Minimal runner
- [GitHub: endless-runner topic](https://github.com/topics/endless-runner) - 252 repos to explore

### Canvas/Animation Resources
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [2D collision detection](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)
