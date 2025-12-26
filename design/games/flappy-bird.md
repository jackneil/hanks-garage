# Flappy Bird - Game Design Document

## Overview

**Flappy Bird** is a simple yet addictive 2D side-scrolling game where players tap to make a bird flap its wings and navigate through gaps in pipes. Despite its simplicity, the game became one of the most downloaded mobile games ever due to its "just one more try" appeal.

**Why Kids Love It:**
- **Dead simple controls** - one button/tap, anyone can understand it instantly
- **Instant feedback** - you know exactly why you failed
- **Quick rounds** - 10-30 seconds per attempt, perfect for short attention spans
- **Bragging rights** - "I got 47!" becomes playground currency
- **No punishment** - instant restart, no waiting
- **Satisfying physics** - the "flap" feels responsive and fun

**Target Player:** Hank Neil, age 8 (and kids 6-14)
**Platform:** Web (mobile + desktop)
**Style:** 2D pixel art with bright, vibrant colors

---

## Core Game Loop

```
TAP to flap (gain altitude)
    |
GRAVITY pulls you down
    |
NAVIGATE through pipe gaps
    |
SCORE +1 for each pipe passed
    |
HIT pipe or ground = GAME OVER
    |
SEE your score vs high score
    |
TAP to restart instantly
    |
REPEAT ("I can beat that!")
```

### Why This Loop Works

Based on Flappy Bird's original success (50M+ downloads before removal):

- **One-button mastery** - Skill ceiling is infinite, skill floor is zero
- **Immediate cause/effect** - Tap = go up, no tap = go down. Crystal clear.
- **Short sessions** - Perfect for mobile/kid attention spans
- **Near-miss dopamine** - Almost making it through triggers "one more try"
- **Social competition** - Simple score = easy to compare with friends
- **No progression bloat** - Pure skill, no upgrades to manage

---

## Controls

### Mobile (Touch)

```
+------------------------------------+
|                                    |
|                                    |
|    TAP ANYWHERE TO FLAP            |
|                                    |
|         [BIRD]        |||          |
|                       |||          |
|                       |||          |
|                                    |
+------------------------------------+
```

- **Tap anywhere** on screen = flap once
- **No dragging, no holding** - just tap
- Touch target is the ENTIRE screen (kid-friendly)

### Desktop (Keyboard + Mouse)

| Input | Action |
|-------|--------|
| Spacebar | Flap |
| Click anywhere | Flap |
| Enter | Restart (after game over) |
| Escape | Pause |

### Control Feel

The key to Flappy Bird's addictiveness is the **precise control feel**:

- **Flap impulse:** Immediate upward velocity boost (not gradual)
- **Gravity:** Constant downward acceleration
- **No air resistance:** Clean, predictable physics
- **Quick fall:** Bird falls fast enough to create tension

---

## Game Mechanics

### Physics (Critical - Must Feel Right)

```typescript
// Reference values (tune for fun)
const GRAVITY = 0.5;           // pixels/frame^2 - how fast bird falls
const FLAP_VELOCITY = -8;      // pixels/frame - upward impulse on tap
const MAX_FALL_SPEED = 10;     // pixels/frame - terminal velocity
const BIRD_ROTATION_SPEED = 3; // degrees/frame - bird tilts with velocity
```

**Physics Rules:**
1. Bird constantly accelerates downward (gravity)
2. Tapping adds instant upward velocity (replaces, doesn't add)
3. Bird tilts nose-up when rising, nose-down when falling
4. Collision with pipe or ground/ceiling = instant death

### Pipe Generation

```typescript
const PIPE_WIDTH = 52;
const PIPE_GAP = 120;           // Gap between top/bottom pipes (forgiving for kids)
const PIPE_SPAWN_INTERVAL = 2000; // ms between pipes
const PIPE_SPEED = 3;           // pixels/frame - how fast pipes scroll
const MIN_PIPE_HEIGHT = 50;     // Minimum pipe segment height
```

**Pipe Placement:**
- Pipes spawn off-screen right, scroll left
- Gap position is random but always passable
- Gap is vertically centered +/- random offset
- Minimum top/bottom pipe height ensures visibility

### Scoring

```typescript
// Score increments when bird's X position passes pipe's right edge
if (bird.x > pipe.x + PIPE_WIDTH && !pipe.scored) {
  score++;
  pipe.scored = true;
  playSound('point');
}
```

### Collision Detection

Two types of collision:
1. **Ground/Ceiling** - Bird Y position vs boundaries
2. **Pipes** - Rectangle-based hitbox collision

```typescript
// Hitbox should be SMALLER than visual bird (forgiving)
const BIRD_HITBOX = {
  width: 24,   // Visual width: 34
  height: 20,  // Visual height: 24
  offsetX: 5,  // Center the hitbox
  offsetY: 2,
};
```

---

## Features (Priority Order)

### MVP (Must Have)

1. **Bird with flap physics** - Responsive tap-to-flap
2. **Scrolling pipes** - Randomly generated gaps
3. **Score counter** - Shows current score prominently
4. **Collision detection** - Game over on hit
5. **Game over screen** - Shows score, high score, restart button
6. **High score persistence** - localStorage for guest, DB for logged in
7. **Mobile touch support** - Tap anywhere to flap
8. **Desktop keyboard/mouse** - Spacebar or click to flap

### Important (Fun Factor)

9. **Sound effects** - Flap, point scored, hit, game over
10. **Bird animation** - Wing flapping sprite animation
11. **Bird rotation** - Tilts based on velocity (satisfying)
12. **Score popup** - "+1" floats up when passing pipe
13. **Medal system** - Bronze (10), Silver (20), Gold (30), Platinum (40)
14. **Shake on death** - Screen shake feedback
15. **Getting ready screen** - "Tap to start" with bouncing bird

### Nice to Have

16. **Day/night themes** - Toggle or random
17. **Different birds** - Unlockable bird skins
18. **Parallax background** - Clouds/city scrolling at different speeds
19. **Best streak tracking** - Longest run without dying
20. **Daily challenge** - "Beat your yesterday" target
21. **Share score** - Copy/share button for bragging
22. **Confetti on new high score** - Celebration!

---

## Technical Approach

### Stack

```
Next.js 16 + React 19
Canvas API (requestAnimationFrame game loop)
Zustand for state management
TypeScript throughout
```

### Why Canvas (Not CSS/DOM)?

- **Performance:** 60fps game loop with many moving elements
- **Precise collision:** Pixel-accurate hitbox detection
- **Animation control:** Frame-by-frame sprite animation
- **Portability:** Easy to reference existing Canvas implementations

### Architecture

```
apps/web/src/games/flappy-bird/
├── components/
│   ├── FlappyCanvas.tsx    # Main canvas + game loop
│   ├── GameOverlay.tsx     # Start screen, game over, pause
│   └── ScoreDisplay.tsx    # Current score HUD
├── hooks/
│   ├── useGameLoop.ts      # requestAnimationFrame wrapper
│   ├── useControls.ts      # Tap/keyboard input handling
│   └── useSound.ts         # Sound effect triggers
├── lib/
│   ├── store.ts            # Zustand: score, highScore, gameState
│   ├── physics.ts          # Bird physics, collision detection
│   ├── renderer.ts         # Canvas drawing functions
│   ├── sprites.ts          # Sprite sheet management
│   └── constants.ts        # All tuning values
├── assets/
│   ├── sprites/            # Bird, pipes, background
│   └── sounds/             # flap.mp3, point.mp3, hit.mp3
├── Game.tsx                # Main component (dynamic import)
├── index.ts                # Public exports
└── __tests__/
    ├── Game.test.tsx       # Component rendering tests
    ├── physics.test.ts     # Physics/collision unit tests
    └── store.test.ts       # State management tests
```

### Game Loop Pattern

```typescript
// hooks/useGameLoop.ts
export function useGameLoop(update: (delta: number) => void) {
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const loop = (time: number) => {
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;
      update(delta);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current!);
  }, [update]);
}
```

### Rendering Approach

```typescript
// lib/renderer.ts
export function render(ctx: CanvasRenderingContext2D, state: GameState) {
  // 1. Clear canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 2. Draw background (scrolling)
  drawBackground(ctx, state.scrollOffset);

  // 3. Draw pipes
  state.pipes.forEach(pipe => drawPipe(ctx, pipe));

  // 4. Draw ground (scrolling)
  drawGround(ctx, state.scrollOffset);

  // 5. Draw bird (with rotation)
  drawBird(ctx, state.bird);

  // 6. Draw score
  drawScore(ctx, state.score);
}
```

---

## Code Sources (Reference Implementations)

These open-source repos provide excellent reference code to port/adapt:

### Primary References

1. **[nebez/floppybird](https://github.com/nebez/floppybird)** (1.4k stars)
   - Pure HTML/CSS/JS implementation
   - DOM-based (we'll convert to Canvas)
   - Clean, readable code structure
   - MIT License

2. **[LFSCamargo/flappy.bird](https://github.com/LFSCamargo/flappy.bird)**
   - **TypeScript implementation** - closest to our stack
   - Modern build tooling
   - Clean code organization

3. **[aaarafat/JS-Flappy-Bird](https://github.com/aaarafat/JS-Flappy-Bird)**
   - HTML5 Canvas implementation
   - Pure JavaScript game loop
   - Good physics reference

### Additional Resources

4. **[ljfio/Tiny-Flap](https://github.com/ljfio/Tiny-Flap)**
   - Single-file JavaScript implementation
   - Great for understanding core logic
   - Minimal dependencies

5. **[locotoki/flappy-bird-clone](https://github.com/locotoki/flappy-bird-clone)**
   - HTML5 Canvas + JavaScript
   - MIT License
   - Clean separation of concerns

6. **[Chloeiii/FlappyBird](https://github.com/Chloeiii/FlappyBird)**
   - JavaScript Canvas implementation
   - Good sprite handling examples

### What to Extract From Each

| Repo | Extract |
|------|---------|
| nebez/floppybird | Game state machine, medal logic |
| LFSCamargo/flappy.bird | TypeScript types, component structure |
| aaarafat/JS-Flappy-Bird | Canvas rendering, game loop, physics constants |
| ljfio/Tiny-Flap | Minimal collision detection |

---

## Kid-Friendly Design (Age 6-14)

### Forgiving Gameplay

- **Larger gap size** - 120px instead of original 100px
- **Slightly smaller hitbox** - Give benefit of the doubt
- **Slower pipe speed** - Start slower, speed up with score (optional)
- **Generous start** - First pipe appears after 2 seconds
- **Quick restart** - One tap from game over to playing

### Visual Design

- **Bright colors** - Happy, not frustrating
- **Chunky pixels** - Retro-cute aesthetic
- **Smooth animations** - 60fps target
- **Clear contrast** - Pipes vs background very distinct
- **Big score font** - Easy to read at a glance

### Audio Design

| Sound | Trigger | Style |
|-------|---------|-------|
| Flap | Each tap | Soft "whoosh" or wing flap |
| Point | Pass pipe | Cheerful "ding" |
| Hit | Collision | Soft "bonk" (not harsh) |
| Fall | Hit ground | Thud |
| Medal | New medal | Fanfare |
| High Score | Beat record | Celebration! |

### Touch Targets

- **Tap anywhere** to flap (entire screen is target)
- **Restart button:** 80x80px minimum
- **Menu buttons:** 60x60px minimum

### No Frustration Mechanics

- **Instant restart** - No waiting, no animations blocking
- **No ads** - Just the game
- **No lives system** - Infinite retries
- **Progress saves** - High score never lost
- **Celebration, not punishment** - Focus on "new high score!" not "you died"

---

## File Structure

Following the compartmentalized structure from CLAUDE.md:

```
apps/web/src/
├── app/
│   └── games/
│       └── flappy-bird/
│           └── page.tsx              # Dynamic import, no SSR
│
├── games/
│   └── flappy-bird/                  # SELF-CONTAINED MODULE
│       ├── components/
│       │   ├── FlappyCanvas.tsx      # Canvas element + game loop
│       │   ├── GameOverlay.tsx       # Start, pause, game over screens
│       │   └── ScoreDisplay.tsx      # Score HUD component
│       ├── hooks/
│       │   ├── useGameLoop.ts        # requestAnimationFrame hook
│       │   ├── useControls.ts        # Keyboard + touch input
│       │   └── useSound.ts           # Sound effect management
│       ├── lib/
│       │   ├── store.ts              # Zustand store
│       │   ├── physics.ts            # Bird physics, collision
│       │   ├── renderer.ts           # Canvas drawing
│       │   ├── sprites.ts            # Sprite sheet loading
│       │   └── constants.ts          # All game tuning values
│       ├── Game.tsx                  # Main game component
│       ├── index.ts                  # Public exports
│       └── __tests__/
│           ├── Game.test.tsx
│           ├── physics.test.ts
│           └── store.test.ts
│
└── public/
    └── games/
        └── flappy-bird/
            ├── sprites/
            │   ├── bird.png          # Bird sprite sheet (3 frames)
            │   ├── pipe.png          # Pipe segments
            │   ├── background.png    # Sky/city background
            │   └── ground.png        # Scrolling ground
            └── sounds/
                ├── flap.mp3
                ├── point.mp3
                ├── hit.mp3
                └── medal.mp3
```

### Route File (Thin Wrapper)

```tsx
// apps/web/src/app/games/flappy-bird/page.tsx
"use client";

import dynamic from "next/dynamic";

const FlappyBirdGame = dynamic(
  () => import("@/games/flappy-bird").then((mod) => mod.Game),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-sky-400">
        <span className="text-white text-2xl">Loading...</span>
      </div>
    ),
  }
);

export default function FlappyBirdPage() {
  return <FlappyBirdGame />;
}
```

---

## User Data & Persistence

### App ID

```typescript
appId: "flappy-bird"
```

### Data Schema

```typescript
// Type for flappy-bird progress data
interface FlappyBirdProgress {
  highScore: number;         // Best score ever achieved
  gamesPlayed: number;       // Total games played
  bestStreak: number;        // Longest session (consecutive games)
  totalPipes: number;        // Lifetime pipes passed (for fun stats)
  medals: {
    bronze: number;          // Times scored 10+
    silver: number;          // Times scored 20+
    gold: number;            // Times scored 30+
    platinum: number;        // Times scored 40+
  };
  lastPlayed: string;        // ISO date string
}

// Initial state
const DEFAULT_PROGRESS: FlappyBirdProgress = {
  highScore: 0,
  gamesPlayed: 0,
  bestStreak: 0,
  totalPipes: 0,
  medals: {
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
  },
  lastPlayed: new Date().toISOString(),
};
```

### Zustand Store Integration

```typescript
// lib/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FlappyBirdState {
  // Current game state
  gameState: "ready" | "playing" | "gameOver";
  score: number;

  // Persisted progress
  highScore: number;
  gamesPlayed: number;
  bestStreak: number;
  totalPipes: number;
  medals: { bronze: number; silver: number; gold: number; platinum: number };

  // Session tracking
  currentStreak: number;

  // Actions
  flap: () => void;
  startGame: () => void;
  endGame: () => void;
  incrementScore: () => void;
  reset: () => void;

  // For useAuthSync
  getProgressData: () => FlappyBirdProgress;
  setProgressData: (data: FlappyBirdProgress) => void;
}

export const useFlappyStore = create<FlappyBirdState>()(
  persist(
    (set, get) => ({
      // ... implementation
    }),
    {
      name: "flappy-bird-progress",
      partialize: (state) => ({
        highScore: state.highScore,
        gamesPlayed: state.gamesPlayed,
        bestStreak: state.bestStreak,
        totalPipes: state.totalPipes,
        medals: state.medals,
      }),
    }
  )
);
```

### useAuthSync Integration

```typescript
// In Game.tsx
import { useAuthSync } from "@/shared/hooks/useAuthSync";
import { useFlappyStore } from "./lib/store";

export function Game() {
  const { getProgressData, setProgressData } = useFlappyStore();

  const { isAuthenticated, syncStatus } = useAuthSync({
    appId: "flappy-bird",
    localStorageKey: "flappy-bird-progress",
    getState: getProgressData,
    setState: setProgressData,
    debounceMs: 3000, // Sync 3s after last change
  });

  // ... rest of game
}
```

### VALID_APP_IDS Update Required

Add `"flappy-bird"` to the VALID_APP_IDS array in:

```typescript
// packages/db/src/schema/app-progress.ts
export const VALID_APP_IDS = [
  "hill-climb",
  "monster-truck",
  "weather",
  "flappy-bird",  // ADD THIS
] as const;
```

---

## Implementation Phases

### Phase 1: Core Mechanics (MVP)

- [ ] Canvas setup with responsive sizing
- [ ] Bird with gravity + flap physics
- [ ] Single pipe spawning and scrolling
- [ ] Basic collision detection
- [ ] Score counter
- [ ] Game over state
- [ ] Tap/click/spacebar input

**Deliverable:** Playable game loop

### Phase 2: Polish + Feel

- [ ] Bird rotation based on velocity
- [ ] Wing flapping animation
- [ ] Sound effects (flap, point, hit)
- [ ] Scrolling ground
- [ ] Proper hitbox tuning
- [ ] Screen shake on death

**Deliverable:** Feels good to play

### Phase 3: Persistence + UI

- [ ] Zustand store setup
- [ ] High score tracking
- [ ] localStorage persistence
- [ ] Start screen ("Tap to Play")
- [ ] Game over screen (score, high score, restart)
- [ ] Medal system

**Deliverable:** Progress saves, complete UI

### Phase 4: Auth Integration

- [ ] Add "flappy-bird" to VALID_APP_IDS
- [ ] Integrate useAuthSync hook
- [ ] Games played tracking
- [ ] Best streak tracking
- [ ] Total pipes stat

**Deliverable:** Cloud sync for logged-in users

### Phase 5: Extra Polish

- [ ] Day/night themes
- [ ] Parallax background
- [ ] Confetti on new high score
- [ ] Share button

**Deliverable:** Complete, polished game

---

## Success Metrics

How do we know the game is good?

1. **Hank plays 10+ rounds** in first session
2. **Hank brags about score** to family
3. **Hank returns next day** to beat high score
4. **No rage quits** - frustration stays fun-frustration
5. **Plays on phone** - mobile controls work great

---

## References

### Open Source Implementations
- [nebez/floppybird](https://github.com/nebez/floppybird) - Popular HTML/CSS/JS clone
- [LFSCamargo/flappy.bird](https://github.com/LFSCamargo/flappy.bird) - TypeScript implementation
- [aaarafat/JS-Flappy-Bird](https://github.com/aaarafat/JS-Flappy-Bird) - Canvas + JS implementation
- [GitHub: flappy-bird-js topic](https://github.com/topics/flappy-bird-js) - More implementations

### Game Design
- [Flappy Bird Postmortem](https://en.wikipedia.org/wiki/Flappy_Bird) - History and success factors
- [One-Button Game Design](https://gamedesignskills.com/game-design/one-button-games/) - Simple control patterns

### Technical
- [requestAnimationFrame MDN](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [Canvas API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Zustand](https://github.com/pmndrs/zustand) - State management
