# Snake - Game Design Document

## Overview

**Snake** is a classic arcade game where players control a snake that grows longer each time it eats food. The game is an homage to the iconic Nokia phone game from the late 90s/early 2000s - a timeless formula that has entertained millions. For Hank's Hits, we're giving it a kid-friendly makeover with cute visuals, fun food items, forgiving gameplay options, and celebration effects.

**Why Kids Love Snake:**
- **Simple to understand** - move snake, eat food, don't crash
- **Instant gratification** - every food eaten = immediate reward
- **Skill progression** - game gets harder as snake grows
- **One more try** - quick rounds mean easy restarts
- **Nostalgic value** - parents can play with kids (they remember Nokia!)

**Target Player**: Hank Neil, age 8 (and kids 6-14)
**Platform**: Web (mobile + desktop)
**Style**: 2D top-down grid with cute, colorful graphics

---

## Core Game Loop

```
MOVE the snake around the grid
    |
    v
EAT food items (apple, pizza, etc.)
    |
    v
GROW longer with each food eaten
    |
    v
AVOID walls and your own tail
    |
    v
BEAT your high score
    |
    v
REPEAT (try to get an even longer snake!)
```

### Why This Loop Works

Based on Snake's enduring 40+ year popularity:
- **Dead simple controls** - just 4 directions
- **Constant tension** - longer snake = harder game
- **Risk/reward** - go faster for more points, but easier to crash
- **Clear feedback** - you see exactly why you died
- **Quick rounds** - fail and restart in seconds
- **Self-competition** - always trying to beat your own record

---

## Controls

### Mobile (Touch)

**Option A: Swipe Controls**
- Swipe up/down/left/right to change direction
- Most intuitive for mobile players
- Requires deliberate gesture to change direction

**Option B: On-Screen Arrow Buttons (Default)**
```
         [  ^  ]
    [ < ] [    ] [ > ]
         [  v  ]
```
- Four large arrow buttons at bottom of screen
- More precise for younger kids
- Less accidental inputs than swipe
- Minimum **60x60px** per button (fat fingers)

**Mobile Settings:**
- Let user toggle between Swipe and Buttons
- Default to Buttons (more kid-friendly)

### Desktop (Keyboard)

| Key | Action |
|-----|--------|
| W / Arrow Up | Move Up |
| S / Arrow Down | Move Down |
| A / Arrow Left | Move Left |
| D / Arrow Right | Move Right |
| Space | Pause/Resume |
| R | Restart Game |
| ESC | Open Menu |

**Important:** Prevent 180-degree turns (can't go directly backward into yourself)

---

## Features (Priority Order)

### MVP (Phase 1) - Must Have

1. **Basic Snake Movement**
   - Snake moves continuously in current direction
   - Grid-based movement (classic feel)
   - Smooth animation between grid cells
   - Speed starts slow, increases as snake grows

2. **Food System**
   - Single food item on screen at a time
   - Random spawn location (not on snake)
   - Snake grows by 1 segment when food eaten
   - Score increases (+10 per food)

3. **Collision Detection**
   - Wall collision = game over (with option to disable)
   - Self collision = game over
   - Clear visual feedback on death

4. **Game UI**
   - Current score display
   - Snake length display
   - High score display
   - Pause button (mobile)

5. **Controls**
   - Mobile: On-screen arrow buttons
   - Desktop: WASD + Arrow keys

6. **Game Over Screen**
   - Final score
   - High score comparison
   - "Play Again" button (big, obvious)

### Important for Fun (Phase 2)

7. **Sound Effects**
   - Munch sound when eating
   - Happy jingle when beating high score
   - Sad "bonk" on crash
   - Background music (optional toggle)

8. **Visual Polish**
   - Cute snake design (friendly face on head)
   - Fun food items (apple, pizza, burger, ice cream, etc.)
   - Grid background with subtle pattern
   - Particle burst when eating

9. **Forgiving Mode (Kid Mode)**
   - **Wraparound walls** - go off one edge, appear on opposite
   - Toggle in settings
   - Default ON for younger kids

10. **Speed Settings**
    - Slow / Medium / Fast
    - Default to Slow for beginners
    - Persist preference

11. **Mobile Swipe Controls**
    - Alternative to buttons
    - Toggle in settings

### Nice to Have (Phase 3)

12. **Multiple Themes**
    - Classic (green snake, red apple)
    - Ocean (fish eating smaller fish)
    - Space (rocket collecting stars)
    - Food Court (hot dog eating condiments)

13. **Power-ups**
    - Speed boost (temporary)
    - Slow-mo (temporary)
    - Shield (pass through tail once)
    - Score multiplier (2x for 10 seconds)

14. **Achievements**
    - "Hungry Hungry" - eat 10 food in one game
    - "Long Boi" - reach length 20
    - "Speed Demon" - beat high score on Fast mode
    - "No Walls Needed" - win with wraparound off

15. **Leaderboards** (if auth added)
    - Daily high scores
    - All-time high scores
    - Friends leaderboard

16. **Custom Snake Colors**
    - Unlock colors by reaching milestones
    - Personalization for replay value

---

## Technical Approach

### Stack

```
Next.js 16 + React 19
Zustand 5.0 - State management
CSS Grid or Canvas - Rendering (see below)
```

### Rendering Approach: HTML/CSS Grid vs Canvas

**Recommendation: Start with CSS Grid, migrate to Canvas if needed**

**CSS Grid Pros:**
- Simpler to implement
- Better accessibility
- Easier to style with Tailwind/DaisyUI
- DOM-based = easier debugging
- Good enough performance for classic Snake speeds

**CSS Grid Cons:**
- May get slow with very long snakes (100+ segments)
- Less smooth animations at high speeds

**Canvas Pros:**
- Better performance at high speeds
- Smoother animations
- Industry standard for games

**Canvas Cons:**
- More complex code
- Accessibility challenges
- Manual hit detection

**Decision:** Start with CSS Grid for MVP. If performance becomes an issue at high speeds/long snakes, refactor to Canvas. The game logic (snake movement, collision, etc.) will be abstracted so rendering can be swapped.

### Game Loop Architecture

```typescript
// Core game state (Zustand store)
interface SnakeGameState {
  // Game board
  gridSize: { width: number; height: number }; // e.g., 20x20

  // Snake
  snake: Position[]; // Array of {x, y}, head is [0]
  direction: Direction; // 'up' | 'down' | 'left' | 'right'
  nextDirection: Direction; // Buffered input

  // Food
  food: Position;
  foodType: FoodType; // For visual variety

  // Game state
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;

  // Score
  score: number;
  highScore: number;
  snakeLength: number; // = snake.length

  // Settings
  speed: 'slow' | 'medium' | 'fast';
  wraparoundWalls: boolean;
  controlMode: 'buttons' | 'swipe';
  soundEnabled: boolean;

  // Stats (for persistence)
  gamesPlayed: number;
  longestSnake: number;
  totalFoodEaten: number;

  // Timestamps
  lastUpdated: number;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  setDirection: (dir: Direction) => void;
  tick: () => void; // Called each game loop iteration
  reset: () => void;
}
```

### Game Tick Logic

```typescript
function tick() {
  if (!isPlaying || isPaused || isGameOver) return;

  // 1. Update direction from buffer
  direction = nextDirection;

  // 2. Calculate new head position
  const head = snake[0];
  let newHead = calculateNewPosition(head, direction);

  // 3. Handle wall collision
  if (isOutOfBounds(newHead)) {
    if (wraparoundWalls) {
      newHead = wrapPosition(newHead);
    } else {
      gameOver();
      return;
    }
  }

  // 4. Check self collision
  if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
    gameOver();
    return;
  }

  // 5. Move snake
  snake.unshift(newHead); // Add new head

  // 6. Check food collision
  if (newHead.x === food.x && newHead.y === food.y) {
    // Eat food - don't remove tail (snake grows)
    score += 10;
    totalFoodEaten++;
    spawnNewFood();
    playSound('eat');

    // Check high score
    if (score > highScore) {
      highScore = score;
      playSound('newHighScore');
    }

    // Check longest snake
    if (snake.length > longestSnake) {
      longestSnake = snake.length;
    }
  } else {
    // No food - remove tail (snake moves without growing)
    snake.pop();
  }

  // 7. Increase speed based on length (optional)
  adjustSpeed();
}
```

### Speed Configuration

```typescript
const SPEED_CONFIG = {
  slow: 200,    // 200ms between ticks (5 moves/sec)
  medium: 130,  // 130ms between ticks (7.7 moves/sec)
  fast: 80,     // 80ms between ticks (12.5 moves/sec)
};

// Speed ramp: increase speed as snake grows
function getTickInterval() {
  const baseInterval = SPEED_CONFIG[speed];
  const lengthBonus = Math.floor(snake.length / 5) * 5; // -5ms per 5 segments
  return Math.max(baseInterval - lengthBonus, 50); // Never faster than 50ms
}
```

---

## Code Sources to Reference

### Open Source Snake Implementations

1. **React Snake Game (TypeScript)**
   - https://github.com/weibenfalk/react-snake
   - Clean React implementation with hooks
   - Good reference for game loop structure

2. **Snake Game React**
   - https://github.com/Dineshs91/react-snake-game
   - Simple CSS-based rendering
   - Good for understanding grid approach

3. **Classic Snake Remastered**
   - https://github.com/nicksenger/react-native-snake
   - React Native but logic is portable
   - Touch controls reference

4. **JavaScript Snake**
   - https://github.com/patorjk/JavaScript-Snake
   - Vanilla JS but excellent game logic
   - Multiple game modes

5. **Canvas Snake**
   - https://github.com/AJC32199/Snake-Game
   - Canvas-based rendering reference
   - If we need to migrate from CSS Grid

### Key Patterns to Port

From these repos, we'll adapt:
- Game loop timing (requestAnimationFrame or setInterval)
- Input buffering (prevent 180-degree turns)
- Food spawn algorithm (avoid snake body)
- Score/high score logic
- Touch control handling

---

## Child-Friendly Design

### Visual Design

**Snake Appearance:**
- Cute, rounded head with simple face (two eyes, small smile)
- Body segments are rounded rectangles with subtle gradient
- Tail tapers to a point
- Bright, friendly colors (green primary, with unlockable colors)

**Food Items:**
- Randomly cycle through cute food sprites:
  - Red apple (classic)
  - Pizza slice
  - Ice cream cone
  - Burger
  - Donut
  - Banana
- Each food worth same points (10) - visual variety only
- Gentle bounce animation on food

**Background:**
- Subtle grid pattern (helps kids see cells)
- Soft, non-distracting color (light blue or cream)
- Optional: grass/tiles theme matching selected snake theme

### Touch Targets

- All buttons **minimum 60x60 pixels**
- Arrow buttons even larger: **80x80 pixels**
- Good spacing between buttons (no accidental taps)
- Visual feedback on press (button dims/scales)

### Forgiving Gameplay

**Wraparound Mode (Default ON):**
- Going off one edge wraps to opposite edge
- Removes wall collision frustration
- Makes game much more forgiving for young kids
- Can be disabled for "hard mode" challenge

**Visual Collision Warning:**
- Snake head flashes red briefly before collision
- Gives split-second to react
- Reduces surprise frustration

**Clear Death Feedback:**
- Short death animation (snake turns gray, sad face)
- Clear message: "Oops! You hit the wall!" or "Oh no! You bit your tail!"
- Immediate "Play Again" button (big, centered)

### Celebration & Rewards

**Eating Food:**
- Quick particle burst (confetti/sparkles)
- Satisfying "munch" sound
- Score popup floats up (+10)

**New High Score:**
- Big celebration (confetti explosion)
- Fanfare sound
- "NEW HIGH SCORE!" banner
- Score highlighted in gold

**Milestones:**
- Length 10: "Nice snake!"
- Length 20: "Super snake!"
- Length 30+: "MEGA SNAKE!"
- Quick toast notification, doesn't interrupt game

---

## File Structure

```
apps/web/src/
├── app/games/snake/
│   └── page.tsx                    # Dynamic import, no SSR
│
├── games/snake/                    # SELF-CONTAINED module
│   ├── components/
│   │   ├── GameBoard.tsx          # Main game grid/canvas
│   │   ├── Snake.tsx              # Snake rendering
│   │   ├── Food.tsx               # Food item rendering
│   │   ├── GameUI.tsx             # Score, pause button, etc.
│   │   ├── MobileControls.tsx     # Arrow buttons + swipe
│   │   ├── GameOverScreen.tsx     # End game UI
│   │   ├── SettingsMenu.tsx       # Speed, wraparound, sound
│   │   └── StartScreen.tsx        # Pre-game UI
│   │
│   ├── hooks/
│   │   ├── useSnakeGame.ts        # Main game hook (connects store)
│   │   ├── useKeyboardControls.ts # Desktop WASD/arrows
│   │   ├── useTouchControls.ts    # Swipe detection
│   │   └── useGameLoop.ts         # Game tick timing
│   │
│   ├── lib/
│   │   ├── store.ts               # Zustand store
│   │   ├── constants.ts           # Grid size, speeds, etc.
│   │   ├── sounds.ts              # Sound effects (Howler.js or Audio API)
│   │   └── types.ts               # TypeScript types
│   │
│   ├── __tests__/
│   │   ├── Snake.test.tsx         # Component tests
│   │   ├── store.test.ts          # Game logic tests
│   │   └── collision.test.ts      # Edge case tests
│   │
│   ├── Game.tsx                   # Main game component
│   └── index.ts                   # Public exports
│
└── public/games/snake/
    ├── sounds/
    │   ├── eat.mp3
    │   ├── crash.mp3
    │   ├── highscore.mp3
    │   └── bgm.mp3 (optional)
    └── images/
        ├── foods/
        │   ├── apple.png
        │   ├── pizza.png
        │   └── ...
        └── snake/
            ├── head.png
            └── body.png (optional, can use CSS)
```

---

## User Data & Persistence

### App ID

```typescript
appId: "snake"
```

### Data to Save

```typescript
interface SnakeProgressData {
  // High scores
  highScore: number;           // Best score ever
  longestSnake: number;        // Longest snake length achieved

  // Lifetime stats
  gamesPlayed: number;         // Total games played
  totalFoodEaten: number;      // Cumulative food eaten

  // Preferences
  speed: 'slow' | 'medium' | 'fast';
  wraparoundWalls: boolean;
  controlMode: 'buttons' | 'swipe';
  soundEnabled: boolean;

  // Achievements (Phase 3)
  achievements?: string[];     // Array of unlocked achievement IDs

  // Customization (Phase 3)
  selectedTheme?: string;      // 'classic' | 'ocean' | 'space' | etc.
  unlockedThemes?: string[];

  // Sync metadata
  lastUpdated: number;         // Timestamp for merge conflicts
}
```

### Using useAuthSync Hook

```typescript
// In games/snake/lib/store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const LOCAL_STORAGE_KEY = 'snake-game-state';

export const useSnakeStore = create<SnakeGameState>()(
  persist(
    (set, get) => ({
      // ... all state and actions
    }),
    {
      name: LOCAL_STORAGE_KEY,
      partialize: (state) => ({
        // Only persist these fields
        highScore: state.highScore,
        longestSnake: state.longestSnake,
        gamesPlayed: state.gamesPlayed,
        totalFoodEaten: state.totalFoodEaten,
        speed: state.speed,
        wraparoundWalls: state.wraparoundWalls,
        controlMode: state.controlMode,
        soundEnabled: state.soundEnabled,
        lastUpdated: Date.now(),
      }),
    }
  )
);

// In Game.tsx - sync with database when authenticated
import { useAuthSync } from '@/shared/hooks/useAuthSync';
import { useSnakeStore } from './lib/store';

function SnakeGame() {
  const {
    highScore,
    longestSnake,
    gamesPlayed,
    totalFoodEaten,
    speed,
    wraparoundWalls,
    controlMode,
    soundEnabled,
  } = useSnakeStore();

  // Sync state getter
  const getState = useCallback(() => ({
    highScore,
    longestSnake,
    gamesPlayed,
    totalFoodEaten,
    speed,
    wraparoundWalls,
    controlMode,
    soundEnabled,
    lastUpdated: Date.now(),
  }), [highScore, longestSnake, gamesPlayed, totalFoodEaten, speed, wraparoundWalls, controlMode, soundEnabled]);

  // Sync state setter
  const setState = useCallback((data: SnakeProgressData) => {
    useSnakeStore.setState({
      highScore: data.highScore,
      longestSnake: data.longestSnake,
      gamesPlayed: data.gamesPlayed,
      totalFoodEaten: data.totalFoodEaten,
      speed: data.speed,
      wraparoundWalls: data.wraparoundWalls,
      controlMode: data.controlMode,
      soundEnabled: data.soundEnabled,
    });
  }, []);

  const { isAuthenticated, syncStatus } = useAuthSync({
    appId: 'snake',
    localStorageKey: LOCAL_STORAGE_KEY,
    getState,
    setState,
  });

  // ... rest of game component
}
```

### Add to VALID_APP_IDS

**File:** `packages/db/src/schema/app-progress.ts`

```typescript
export const VALID_APP_IDS = [
  "hill-climb",
  "monster-truck",
  "weather",
  "snake",  // <-- ADD THIS
] as const;
```

---

## Implementation Phases

### Phase 1: Core Game (MVP)
- [ ] Set up folder structure (`src/games/snake/`)
- [ ] Create Zustand store with game state
- [ ] Build game board component (CSS Grid)
- [ ] Implement snake rendering
- [ ] Implement food spawning
- [ ] Game loop with `setInterval` or `requestAnimationFrame`
- [ ] Keyboard controls (WASD + arrows)
- [ ] Collision detection (walls + self)
- [ ] Score tracking
- [ ] Game over screen with restart
- [ ] Basic tests

**Deliverable:** Playable Snake game on desktop

### Phase 2: Mobile + Polish
- [ ] Mobile arrow button controls
- [ ] Touch event handling
- [ ] Responsive layout
- [ ] Sound effects
- [ ] Visual polish (cute snake, food sprites)
- [ ] Particle effects on eating
- [ ] Forgiving mode (wraparound walls)
- [ ] Settings menu (speed, wraparound, sound)
- [ ] High score persistence (localStorage)

**Deliverable:** Fun, polished game on mobile

### Phase 3: Persistence + Extras
- [ ] Add "snake" to VALID_APP_IDS
- [ ] Integrate useAuthSync hook
- [ ] Database sync for authenticated users
- [ ] Swipe controls option
- [ ] Multiple themes
- [ ] Achievements system
- [ ] Unlock colors/themes

**Deliverable:** Full featured game with cloud save

---

## Success Metrics

How do we know the game is good?

1. **Hank plays for 5+ minutes** - quick rounds, but keeps retrying
2. **Hank tries to beat his high score** - score system is motivating
3. **Hank shows friends** - it's actually fun
4. **No frustration deaths** - forgiving mode prevents rage
5. **Works on Hank's tablet** - mobile controls feel good
6. **Parents recognize it** - "Oh, like the Nokia game!"

---

## References

### Snake Game Design
- [Original Nokia Snake History](https://en.wikipedia.org/wiki/Snake_(video_game_genre))
- [Snake Game Design Analysis](https://gameanalytics.com/blog/how-to-perfect-your-games-core-loop/)

### Implementation References
- [React Snake Implementation](https://github.com/weibenfalk/react-snake)
- [JavaScript Snake Logic](https://github.com/patorjk/JavaScript-Snake)
- [CSS Grid Game Tutorial](https://www.freecodecamp.org/news/how-to-build-a-snake-game-in-javascript/)

### Mobile Touch Controls
- [Touch Events MDN](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Hammer.js (swipe gestures)](https://hammerjs.github.io/)

### Existing Hank's Hits Patterns
- Monster Truck game design: `design/games/monster-truck.md`
- useAuthSync hook: `apps/web/src/shared/hooks/useAuthSync.ts`
- App progress schema: `packages/db/src/schema/app-progress.ts`
