# Hank's Hopper - 2D Platformer Game Design Document

## Overview

**Hank's Hopper** is a 2D side-scrolling platformer where players run, jump, and bounce through colorful worlds collecting stars, dodging enemies, and reaching the goal flag. Think classic Mario meets modern mobile gaming with forgiving mechanics designed for ages 6-14.

**Why Kids Love It:**
- **Simple satisfaction**: Run left/right, jump on platforms, collect shiny things
- **Instant gratification**: Stars everywhere, celebration particles on collection
- **Low frustration**: Forgiving jump mechanics, checkpoints, multiple lives
- **Clear goals**: See the flag, get to the flag, feel like a champion
- **Progression**: Unlock new worlds, characters, and abilities

**Target Player**: Hank Neil, age 8 (and kids 6-14)
**Platform**: Web (mobile + desktop)
**Camera**: Side-scrolling, follows player horizontally
**Style**: Bright, colorful 2D with chunky cartoon characters

---

## Core Game Loop

```
RUN through the level
    |
JUMP on platforms and over gaps
    |
COLLECT stars and coins
    |
AVOID or STOMP enemies
    |
REACH the goal flag
    |
UNLOCK new levels and characters
    |
REPEAT (with harder levels = more satisfaction)
```

### Why This Loop Works

Based on research from successful platformers (Super Mario Run, Geometry Dash, Celeste):

- **Muscle memory satisfaction** - jumping feels good when controls are tight
- **Risk/reward balance** - harder paths have more stars
- **Constant small wins** - coins and stars everywhere
- **Clear progression** - world map shows where you've been and where you're going
- **"Just one more level"** - each level is 1-3 minutes, perfect for short sessions

---

## Controls

### Mobile (Virtual Joystick + Buttons)

```
+--------------------------------------------------+
|                                                  |
|                  GAME VIEW                       |
|           (side-scrolling level)                 |
|                                                  |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  [<-  JOYSTICK  ->]           [JUMP]   [ACTION]  |
|     (left/right)                (A)      (B)     |
|                                                  |
+--------------------------------------------------+
```

**Touch Controls:**
- **Left side**: Virtual joystick or left/right touch zones (not tilt - precise control needed)
- **Right side**: Large jump button (A) + Action button (B) for special abilities
- **Tap anywhere to start** - no menu hunting
- **Auto-run option** - for younger kids, just tap to jump (like Geometry Dash/Mario Run)

### Desktop (Keyboard)

| Key | Action |
|-----|--------|
| A / Arrow Left | Move Left |
| D / Arrow Right | Move Right |
| Space / W / Arrow Up | Jump (hold for higher) |
| Shift / E | Action (dash, shoot, etc.) |
| ESC | Pause Menu |
| R | Restart from checkpoint |

**Pro Controls:**
- **Variable jump height** - tap = small hop, hold = full jump
- **Coyote time** - can still jump for 100ms after leaving platform edge
- **Jump buffering** - press jump just before landing = instant jump on land

---

## Features (Priority Order)

### Phase 1: MVP - "It's a Platformer"

**Must-have for playable demo:**

1. **Player character** that runs and jumps
2. **Solid platforms** to land on
3. **Moving camera** that follows player
4. **Star collectibles** (10-20 per level)
5. **Goal flag** at end of level
6. **3 demo levels** with increasing difficulty
7. **Basic enemy** (patrolling slime, dies when stomped)
8. **Death & respawn** (fall in pit = respawn at start or checkpoint)
9. **Level complete screen** (stars collected, time taken)

### Phase 2: "Actually Fun"

**Important for engagement:**

1. **Checkpoints** (flags that save progress mid-level)
2. **Moving platforms** (horizontal and vertical)
3. **Spring pads** (bouncy mushrooms/trampolines)
4. **Coins** (soft currency for unlocks)
5. **Sound effects** (jump, collect, stomp, victory)
6. **Background music** (upbeat, not annoying on loop)
7. **Parallax backgrounds** (depth illusion)
8. **Particle effects** (collection sparkles, dust clouds)
9. **10 levels** across 2 worlds

### Phase 3: "Keep Playing"

**Progression & retention:**

1. **World map** (visual level selection like Super Mario World)
2. **Star gates** (need X stars to unlock next world)
3. **Multiple characters** (unlock with coins)
4. **Character abilities** (double jump, dash, float)
5. **Power-ups** (temporary abilities in levels)
6. **Time trial mode** (speedrun with leaderboard)
7. **20 levels** across 4 worlds

### Phase 4: "Nice to Have"

**Polish & extras:**

1. **Hidden secrets** (invisible blocks, secret rooms)
2. **Boss levels** (end of each world)
3. **Achievements/badges**
4. **Daily challenges**
5. **Character costumes**
6. **User-generated levels** (way in the future)

---

## Progression System

### Collectibles

| Item | Amount | Purpose |
|------|--------|---------|
| **Stars** | 3 per level | Unlock next worlds (star gates) |
| **Coins** | 50-100 per level | Buy characters/costumes |
| **Hidden Gems** | 1 per level | Completionist bonus |

### Star Rating System

Each level has 3 stars to collect:
- **Star 1**: Always on the main path (guaranteed)
- **Star 2**: Slightly off-path, requires extra jump
- **Star 3**: Hidden or requires skill to reach

**Why 3 stars?** Research shows 3 is the magic number:
- 1 star = easy to get, feels like progress
- 2 stars = satisfying, you're good at this
- 3 stars = completionist satisfaction, mastery

### World Unlock Gates

| World | Stars Required | Theme |
|-------|---------------|-------|
| Grassland (1) | 0 | Tutorial, easy jumps |
| Forest (2) | 8 | Moving platforms, more enemies |
| Sky Kingdom (3) | 20 | Vertical levels, wind gusts |
| Volcano (4) | 35 | Crumbling platforms, lava |
| Crystal Cave (5) | 50 | Ice physics, crystals |

### Character Unlocks

| Character | Cost | Special Ability |
|-----------|------|-----------------|
| **Hoppy** (default) | FREE | Standard jump |
| **Bouncy Bear** | 500 coins | Double jump |
| **Swift Squirrel** | 750 coins | Air dash |
| **Floaty Fox** | 1000 coins | Glide (hold jump) |
| **Turbo Turtle** | 1500 coins | Ground pound (down + jump in air) |

---

## Technical Approach

### Technology Options

**Option A: Phaser.js (Recommended)**
```
Phaser 3.x - Most popular 2D game framework
- Built-in physics (Arcade Physics for simple platformer)
- Tilemaps for level design
- Animation system
- Mobile touch support
- Massive community & tutorials
```

**Option B: Custom Canvas/React**
```
React + Canvas API
- Full control over rendering
- Lighter weight (no framework overhead)
- More work to implement physics
- Good for learning, harder for rapid development
```

**Option C: PixiJS + Custom Physics**
```
PixiJS for rendering + custom physics
- Best performance
- More flexibility than Phaser
- More setup work
```

### Recommended Stack

```
Next.js 16 + React 19
Phaser 3.85+ (latest stable)
react-phaser-fiber (optional - React bindings for Phaser)
Zustand 5.0 - State management
Tiled Map Editor - Level design (exports JSON)
```

### Why Phaser.js?

1. **Battle-tested** - Used by thousands of games
2. **Platformer-ready** - Arcade physics handles gravity, collision
3. **Tilemap support** - Load levels from Tiled editor
4. **Touch controls** - Virtual joystick plugin available
5. **Documentation** - Extensive tutorials and examples
6. **Active community** - Stack Overflow, Discord, forums

---

## Code Sources (GitHub References)

### Complete Platformer Examples

| Repository | Description | Stars |
|------------|-------------|-------|
| [photonstorm/phaser3-examples](https://github.com/photonstorm/phaser3-examples) | Official Phaser examples including platformers | 1.5k+ |
| [ourcade/phaser3-parcel-template](https://github.com/ourcade/phaser3-parcel-template) | Modern Phaser 3 + TypeScript template | 500+ |
| [nkholski/phaser3-es6-webpack](https://github.com/nkholski/phaser3-es6-webpack) | Phaser 3 with ES6 and Webpack | 300+ |
| [digitsensitive/phaser3-typescript](https://github.com/digitsensitive/phaser3-typescript) | Phaser 3 + TypeScript platformer examples | 800+ |

### Specific Platformer Mechanics

| Repository | What to Learn |
|------------|---------------|
| [samme/phaser-plugin-virtual-joystick](https://github.com/samme/phaser-plugin-virtual-joystick) | Mobile virtual joystick implementation |
| [rexrainbow/phaser3-rex-notes](https://github.com/rexrainbow/phaser3-rex-notes) | Huge plugin library including UI, gestures |
| [phaserjs/examples](https://github.com/phaserjs/examples) | Official examples (search "platformer") |
| [mikewesthad/phaser-3-tilemap-blog-posts](https://github.com/mikewesthad/phaser-3-tilemap-blog-posts) | Excellent tilemap tutorial with code |

### React + Phaser Integration

| Repository | Description |
|------------|-------------|
| [raineio/react-phaser](https://github.com/raineio/react-phaser) | React wrapper for Phaser |
| [Aswomeness/phaser3-react-example](https://github.com/Aswomeness/phaser3-react-example) | Example integration |

### Alternative: Pure Canvas Platformers

| Repository | Description |
|------------|-------------|
| [rembound/Platform-Game-Tutorial-with-HTML5-and-JavaScript](https://github.com/rembound/Platform-Game-Tutorial-with-HTML5-and-JavaScript) | Pure JS platformer tutorial |
| [jakesgordon/javascript-state-machine](https://github.com/jakesgordon/javascript-state-machine) | State machine for player states |

### Level Design Resources

| Resource | What It Provides |
|----------|------------------|
| [Tiled Map Editor](https://www.mapeditor.org/) | Free level editor, exports JSON |
| [Kenney.nl](https://kenney.nl/assets) | FREE game assets (sprites, tiles) |
| [OpenGameArt.org](https://opengameart.org/) | Free game assets |

---

## Kid-Friendly Design

### Touch Targets

- **Minimum button size**: 64x64 pixels (larger than standard 44px)
- **Jump button**: Extra large, bottom-right corner
- **Generous hitboxes**: Slightly larger than visual for easier collection

### Forgiving Mechanics

1. **Coyote time**: 100-150ms grace period after leaving platform edge
2. **Jump buffering**: 100ms window to press jump before landing
3. **Generous collision**: Player hitbox slightly smaller than sprite
4. **Multiple lives**: 3 lives per level, restart at checkpoint not beginning
5. **No harsh punishment**: Falling = respawn at checkpoint, not game over
6. **Infinite continues**: Can always retry a level

### Visual Clarity

- **High contrast**: Player stands out from background
- **Color coding**: Green = safe, Red = danger, Yellow = collectible
- **Clear edges**: Platform edges clearly visible
- **Enemy tells**: Enemies telegraph attacks (wind up before charging)
- **Particle effects**: Stars burst when collected, dust when landing

### Audio Cues

- **Collection sounds**: Satisfying "ding" for coins, "sparkle" for stars
- **Jump sound**: Cute "boing"
- **Stomp sound**: Satisfying "squish" when defeating enemy
- **Victory fanfare**: Celebration when reaching goal
- **Warning sounds**: Subtle alert near hazards

### Celebration Moments

- **Level complete**: Big "LEVEL CLEAR" with star count, confetti
- **Star collection**: Particle burst, "+1" popup
- **New record**: Special animation for best time
- **Character unlock**: Full-screen celebration

---

## File Structure

Following the compartmentalized structure from CLAUDE.md:

```
apps/web/src/
├── app/
│   └── games/
│       └── platformer/
│           └── page.tsx              # Route - just imports the game
│
├── games/
│   └── platformer/                   # SELF-CONTAINED module
│       ├── components/
│       │   ├── Game.tsx              # Main Phaser game container
│       │   ├── LoadingScreen.tsx     # Loading progress
│       │   ├── PauseMenu.tsx         # Pause overlay
│       │   ├── LevelComplete.tsx     # Victory screen
│       │   ├── WorldMap.tsx          # Level selection
│       │   ├── CharacterSelect.tsx   # Character picker
│       │   └── MobileControls.tsx    # Virtual joystick + buttons
│       │
│       ├── scenes/                   # Phaser scenes
│       │   ├── BootScene.ts          # Asset loading
│       │   ├── MainMenuScene.ts      # Title screen
│       │   ├── WorldMapScene.ts      # Level selection
│       │   ├── GameScene.ts          # Actual gameplay
│       │   └── UIScene.ts            # HUD overlay
│       │
│       ├── objects/                  # Game objects
│       │   ├── Player.ts             # Player character
│       │   ├── Enemy.ts              # Base enemy class
│       │   ├── enemies/
│       │   │   ├── Slime.ts
│       │   │   ├── Spiky.ts
│       │   │   └── Flyer.ts
│       │   ├── Collectible.ts        # Star, coin, gem
│       │   ├── Platform.ts           # Moving platforms
│       │   ├── Checkpoint.ts         # Save point
│       │   └── Goal.ts               # End flag
│       │
│       ├── lib/
│       │   ├── store.ts              # Zustand game state
│       │   ├── config.ts             # Phaser config
│       │   ├── constants.ts          # Game balance values
│       │   ├── levels.ts             # Level data/imports
│       │   └── sounds.ts             # Audio manager
│       │
│       ├── hooks/
│       │   ├── useGameStore.ts       # Zustand hook
│       │   ├── useControls.ts        # Keyboard/touch input
│       │   └── usePlatformerSync.ts  # Auth sync wrapper
│       │
│       ├── types/
│       │   └── index.ts              # TypeScript types
│       │
│       ├── assets/                   # Static assets (or in public/)
│       │   ├── sprites/
│       │   ├── tilemaps/
│       │   └── audio/
│       │
│       └── index.ts                  # Public exports
│
└── public/
    └── games/
        └── platformer/
            ├── sprites/              # Character & enemy sprites
            ├── tiles/                # Tilemap images
            ├── backgrounds/          # Parallax backgrounds
            ├── levels/               # Tiled JSON exports
            └── audio/                # Sound effects & music
```

---

## User Data & Persistence

### App Configuration

```typescript
// appId for database storage
appId: "platformer"

// Add to packages/db/src/schema/app-progress.ts
export const VALID_APP_IDS = [
  "hill-climb",
  "monster-truck",
  "weather",
  "platformer",  // <-- ADD THIS
] as const;
```

### Data Schema

```typescript
// Type for platformer progress data
interface PlatformerProgress {
  // Level progress
  levels: {
    [levelId: string]: {
      completed: boolean;
      starsCollected: number;      // 0-3
      bestTime: number | null;     // milliseconds
      coinsCollected: number;
      gemFound: boolean;
    };
  };

  // Currencies
  totalStars: number;              // Accumulated stars (for gates)
  coins: number;                   // Spendable currency

  // Unlocks
  unlockedWorlds: string[];        // ["grassland", "forest", ...]
  unlockedCharacters: string[];    // ["hoppy", "bouncy-bear", ...]
  selectedCharacter: string;       // Currently selected

  // Stats
  totalDeaths: number;
  totalJumps: number;
  enemiesStomped: number;
  playTimeSeconds: number;

  // Meta
  lastPlayedLevel: string | null;
  updatedAt: number;               // timestamp for sync
}
```

### LocalStorage Key

```typescript
const LOCAL_STORAGE_KEY = "hank-platformer-progress";
```

### useAuthSync Integration

```typescript
// In games/platformer/hooks/usePlatformerSync.ts
import { useAuthSync } from "@/shared/hooks/useAuthSync";
import { usePlatformerStore } from "../lib/store";

export function usePlatformerSync() {
  const getState = usePlatformerStore.getState;
  const setState = (data: PlatformerProgress) => {
    usePlatformerStore.setState(data);
  };

  return useAuthSync<PlatformerProgress>({
    appId: "platformer",
    localStorageKey: "hank-platformer-progress",
    getState: () => getState().getSaveData(),
    setState: (data) => getState().loadSaveData(data),
    debounceMs: 3000, // Save every 3 seconds of changes
    onSyncComplete: (source) => {
      console.log(`Platformer progress synced from ${source}`);
    },
  });
}
```

### Zustand Store

```typescript
// In games/platformer/lib/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlatformerStore extends PlatformerProgress {
  // Actions
  completeLevel: (levelId: string, stars: number, time: number, coins: number, gem: boolean) => void;
  unlockCharacter: (characterId: string) => void;
  selectCharacter: (characterId: string) => void;
  spendCoins: (amount: number) => boolean;
  addCoins: (amount: number) => void;

  // Sync helpers
  getSaveData: () => PlatformerProgress;
  loadSaveData: (data: PlatformerProgress) => void;
}

export const usePlatformerStore = create<PlatformerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      levels: {},
      totalStars: 0,
      coins: 0,
      unlockedWorlds: ["grassland"],
      unlockedCharacters: ["hoppy"],
      selectedCharacter: "hoppy",
      totalDeaths: 0,
      totalJumps: 0,
      enemiesStomped: 0,
      playTimeSeconds: 0,
      lastPlayedLevel: null,
      updatedAt: Date.now(),

      // ... actions implementation
    }),
    {
      name: "hank-platformer-progress",
    }
  )
);
```

---

## Level Design Philosophy

### Difficulty Curve

1. **Level 1-1**: Just run right, one jump, collect stars on ground
2. **Level 1-2**: Introduce gaps, must jump to continue
3. **Level 1-3**: Moving platform (slow, forgiving)
4. **Level 1-4**: First enemy (slow patroller)
5. **Level 1-5**: Combine: platforms + gaps + one enemy

### Level Length

- **Target**: 1-2 minutes for average player
- **Too short**: Feels empty, not satisfying
- **Too long**: Frustrating to restart, loses mobile players

### Hidden Star Placement

- **Star 1**: On the main path, impossible to miss
- **Star 2**: Visible but requires slight detour
- **Star 3**: Hidden (behind decoration, requires wall jump, etc.)

### Checkpoint Placement

- Every 30-45 seconds of gameplay
- After difficult sections
- Before boss fights
- Always near health/power-up

---

## Implementation Phases

### Phase 1: Core Mechanics (Week 1-2)
- [ ] Set up Phaser 3 in Next.js
- [ ] Create player with run/jump
- [ ] Implement basic physics (gravity, collision)
- [ ] Load tilemap from Tiled
- [ ] Follow camera
- [ ] Desktop keyboard controls

### Phase 2: Mobile & Polish (Week 2-3)
- [ ] Virtual joystick + jump button
- [ ] Touch control tuning
- [ ] Coyote time + jump buffering
- [ ] Star collectibles with particles
- [ ] Coin collectibles
- [ ] Sound effects

### Phase 3: Enemies & Danger (Week 3-4)
- [ ] Slime enemy (patrol, stompable)
- [ ] Spiky enemy (cannot stomp)
- [ ] Pits (respawn at checkpoint)
- [ ] Checkpoint flags
- [ ] Lives system

### Phase 4: Progression (Week 4-5)
- [ ] Level complete screen
- [ ] World map UI
- [ ] Star gates (unlock next world)
- [ ] Zustand store + localStorage
- [ ] Multiple levels (5-10)

### Phase 5: Characters & Sync (Week 5-6)
- [ ] Character unlock system
- [ ] Character abilities
- [ ] Auth sync integration
- [ ] Polish and bug fixes

---

## Success Metrics

How do we know the platformer is good?

1. **Hank completes 5+ levels** without giving up
2. **Hank asks to play again** later
3. **Hank tries to 3-star levels** (progression working)
4. **No rage quits** from unfair deaths
5. **Works on iPad** (primary device for kids)
6. **Load time < 5 seconds** on mobile

---

## References

### Research & Design
- [Platformer Design 101](https://www.gamedeveloper.com/design/platformer-level-design-101) - Level design fundamentals
- [Celeste & TowerFall Controls](https://maddymakesgames.com/articles/celeste_traversal/index.html) - Coyote time, jump buffering
- [Game Feel Book](https://www.game-feel.com/) - Why controls feel good

### Technical Tutorials
- [Phaser 3 Platformer Tutorial](https://phaser.io/tutorials/making-your-first-phaser-3-game/part1) - Official tutorial
- [Phaser 3 + TypeScript](https://blog.ourcade.co/posts/2020/phaser-3-parcel-typescript-tutorial/) - Modern setup
- [Tiled + Phaser Tutorial](https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6) - Level design workflow

### Assets (Free)
- [Kenney Platformer Pack](https://kenney.nl/assets/platformer-pack-redux) - Tiles, characters, enemies
- [Kenney Input Prompts](https://kenney.nl/assets/input-prompts) - Controller button icons
- [OpenGameArt Platformers](https://opengameart.org/art-search?keys=platformer) - Various free assets
