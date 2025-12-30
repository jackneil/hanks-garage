# Blitz Bomber - Game Design Document

## Overview

**Blitz Bomber** is a classic arcade game where you pilot a plane flying across a city skyline. Each pass takes you lower, and you must drop bombs to destroy buildings before you crash into them. Clear the city to land safely!

Based on the classic "Blitz" / "Bomber" games from the DOS era (1980s).

**Why Kids Love It:**
- **Simple one-button gameplay** - Just press to bomb
- **Explosions!** - Buildings crumble satisfyingly
- **Escalating tension** - Lower and lower each pass
- **Clear goal** - Destroy everything to land
- **Quick rounds** - 1-2 minutes per game
- **Satisfying destruction** - Watch the city fall

**Target Player:** Hank Neil, age 8 (and kids 6-14)
**Platform:** Web (mobile + desktop)
**Style:** Retro pixel art, colorful city

---

## Core Game Loop

```
PLANE flies left to right automatically
    |
PRESS BUTTON to drop bomb
    |
BOMB falls straight down
    |
HIT building = destroy top section
    |
PLANE reaches edge = wraps to other side
    |
EACH PASS = plane drops lower
    |
ALL buildings cleared = LAND SAFELY (win!)
    |
HIT a building = CRASH (game over)
```

### Why This Works

- **Automatic progression** - Plane moves on its own
- **Timing challenge** - When to drop?
- **Escalating tension** - Getting lower = more urgent
- **Visible progress** - Buildings get shorter
- **Clear win condition** - Flat ground = safe landing
- **Simple mastery** - One button, infinite skill ceiling

---

## Controls

### Mobile (Touch)
| Input | Action |
|-------|--------|
| Tap anywhere | Drop bomb |

That's it! One-tap gameplay.

### Desktop
| Input | Action |
|-------|--------|
| Spacebar | Drop bomb |
| Any key | Drop bomb |
| P / Escape | Pause |

---

## Game Mechanics

### Plane Movement
```typescript
const PLANE_SPEED = 3;          // Pixels per frame
const DROP_AMOUNT = 30;         // Pixels lower each pass
const STARTING_HEIGHT = 50;     // Y position at start
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
```

- Plane moves right at constant speed
- When reaching right edge, wraps to left side
- Each wrap = drop down by DROP_AMOUNT
- Speed increases slightly each pass (optional difficulty)

### Bombs
```typescript
const BOMB_FALL_SPEED = 8;
const BOMB_SIZE = 10;
const MAX_BOMBS_ON_SCREEN = 3;  // Can drop multiple
```

- Bombs fall straight down from plane position
- One bomb destroys one building segment (top)
- Can drop multiple bombs in quick succession
- Bombs disappear on impact or ground

### Buildings
```typescript
interface Building {
  x: number;           // X position
  width: number;       // Building width (varies)
  height: number;      // Current height (decreases)
  originalHeight: number;
  color: string;
}

const BUILDING_COUNT = 15;
const MIN_BUILDING_HEIGHT = 100;
const MAX_BUILDING_HEIGHT = 400;
const BUILDING_WIDTH_MIN = 40;
const BUILDING_WIDTH_MAX = 80;
const SEGMENT_HEIGHT = 30;      // Height removed per bomb hit
```

### Collision
- Plane hitbox vs building tops
- Plane Y + plane height > building top Y = CRASH
- Landing: Plane Y > ground level AND all buildings flat = WIN

### Scoring
| Action | Points |
|--------|--------|
| Building segment destroyed | 10 |
| Full building destroyed | 50 bonus |
| Safe landing | 500 |
| Fast clear bonus | Time remaining × 5 |

### Levels
- Level 1: 10 buildings, reasonable heights
- Level 2: 12 buildings, taller
- Level 3: 15 buildings, varied sizes
- Each level = new city layout
- Speed increases slightly per level

---

## Features (Priority Order)

### MVP (Must Have)
1. **Plane** that flies and wraps
2. **Buildings** of varying heights
3. **Bomb dropping** on button press
4. **Building destruction** (remove segments)
5. **Plane descent** each pass
6. **Collision detection** (crash on hit)
7. **Win condition** (land when flat)
8. **Score counter**

### Important (Fun Factor)
9. **Explosion animation** when bomb hits
10. **Building crumble animation**
11. **Sound effects** (engine, bomb, explosion, crash)
12. **Multiple levels**
13. **High score persistence**
14. **Landing animation** (plane touches down)
15. **Speed ramping** per level

### Nice to Have
16. **Different city themes** (day, night, sunset)
17. **Power-ups** (mega bomb, slow plane)
18. **Moving targets** (helicopters, UFOs)
19. **Bonus rounds** (all short buildings)
20. **Two-player mode** (alternating)

---

## Technical Approach

### Stack
```
Next.js 16 + React 19
Canvas API
Zustand for state
TypeScript
```

### Architecture
```
apps/web/src/games/blitz-bomber/
├── components/
│   ├── BlitzCanvas.tsx      # Main canvas
│   ├── GameOverlay.tsx      # Start, win, lose screens
│   ├── HUD.tsx              # Score, level display
│   └── TouchZone.tsx        # Full-screen tap zone
├── hooks/
│   ├── useGameLoop.ts
│   ├── useControls.ts
│   └── useSound.ts
├── lib/
│   ├── store.ts
│   ├── plane.ts             # Plane logic
│   ├── buildings.ts         # Building generation
│   ├── bombs.ts             # Bomb physics
│   └── constants.ts
├── Game.tsx
└── index.ts
```

### Game Loop
```typescript
function gameLoop(state: GameState): GameState {
  // 1. Move plane
  let { plane, bombs, buildings, score } = state;
  plane.x += PLANE_SPEED;

  // 2. Check for wrap
  if (plane.x > SCREEN_WIDTH) {
    plane.x = -PLANE_WIDTH;
    plane.y += DROP_AMOUNT;
  }

  // 3. Update bombs
  bombs = bombs
    .map(b => ({ ...b, y: b.y + BOMB_FALL_SPEED }))
    .filter(b => b.y < SCREEN_HEIGHT);

  // 4. Check bomb collisions with buildings
  bombs.forEach(bomb => {
    buildings.forEach(building => {
      if (bombHitsBuilding(bomb, building)) {
        building.height -= SEGMENT_HEIGHT;
        score += 10;
        if (building.height <= 0) {
          building.height = 0;
          score += 50; // Bonus for full destruction
        }
        bomb.destroyed = true;
        // Trigger explosion animation
      }
    });
  });
  bombs = bombs.filter(b => !b.destroyed);

  // 5. Check plane collision with buildings
  const crash = buildings.some(b =>
    plane.x + PLANE_WIDTH > b.x &&
    plane.x < b.x + b.width &&
    plane.y + PLANE_HEIGHT > SCREEN_HEIGHT - b.height
  );

  if (crash) {
    return { ...state, gameState: 'crashed' };
  }

  // 6. Check win condition
  const allFlat = buildings.every(b => b.height <= 0);
  const lowEnough = plane.y > SCREEN_HEIGHT - 100;

  if (allFlat && lowEnough) {
    return { ...state, gameState: 'landed', score: score + 500 };
  }

  return { ...state, plane, bombs, buildings, score };
}
```

### Building Rendering
```typescript
function drawBuildings(ctx: CanvasRenderingContext2D, buildings: Building[]) {
  buildings.forEach(building => {
    const x = building.x;
    const height = building.height;
    const y = SCREEN_HEIGHT - height;

    // Building body
    ctx.fillStyle = building.color;
    ctx.fillRect(x, y, building.width, height);

    // Windows (grid pattern)
    ctx.fillStyle = '#FFE082';
    const windowSize = 8;
    const windowGap = 15;

    for (let wy = y + 10; wy < SCREEN_HEIGHT - 10; wy += windowGap) {
      for (let wx = x + 5; wx < x + building.width - 10; wx += windowGap) {
        ctx.fillRect(wx, wy, windowSize, windowSize);
      }
    }
  });
}
```

---

## Settings & Progress Saving

### Data Schema
```typescript
interface BlitzBomberProgress {
  highScore: number;
  highestLevel: number;
  levelsCompleted: number;
  totalBuildingsDestroyed: number;
  totalBombsDropped: number;
  successfulLandings: number;
  crashes: number;
  gamesPlayed: number;
  settings: {
    soundEnabled: boolean;
    difficulty: "easy" | "normal" | "hard";
    theme: "day" | "night" | "sunset";
  };
  lastPlayed: string;
}
```

### useAuthSync Integration
```typescript
useAuthSync({
  appId: "blitz-bomber",
  localStorageKey: "blitz-bomber-progress",
  getState: store.getProgress,
  setState: store.setProgress,
  debounceMs: 3000,
});
```

---

## Kid-Friendly Design

- **Slower plane** - More time to react
- **Larger bombs** - Easier to hit
- **Buildings not too tall** initially
- **Gentle difficulty curve**
- **Satisfying explosions** - Big, colorful
- **Happy landing** - Celebration animation
- **No violent imagery** - Buildings just crumble
- **Quick restart** - Try again immediately

### Visual Style
- Colorful city buildings (not gray/depressing)
- Cute cartoon plane (biplane style)
- Big fluffy explosion clouds
- Cheerful sky (blue with clouds)
- Stars/confetti on successful landing

### Audio
| Sound | When |
|-------|------|
| Engine hum | Constant (low volume) |
| Bomb whistle | Bomb falling |
| Explosion | Bomb hits building |
| Crumble | Building segment falls |
| Crash | Plane hits building |
| Landing | Successful touchdown |
| Victory | Level complete |

---

## Difficulty Settings

### Easy Mode
- Slower plane
- Shorter buildings
- More bombs allowed
- Plane descends less per pass

### Normal Mode
- Standard speeds
- Moderate buildings
- Classic gameplay

### Hard Mode
- Faster plane
- Taller buildings
- Speed increases more each pass
- Fewer bombs on screen

---

## References

### Original Games
- [Blitz (VIC-20, 1981)](https://en.wikipedia.org/wiki/Blitz_(video_game))
- [Bomber (DOS, 1984)](https://www.dosgamesarchive.com/download/bomber)
- [Sopwith (DOS, 1984)](https://en.wikipedia.org/wiki/Sopwith_(video_game))

### Open Source
- Various "Blitz" clones on GitHub
- JavaScript implementations available

### Inspiration
- City Bomber (mobile)
- Luftwaffe (classic)
