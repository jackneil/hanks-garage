# Bomberman - Game Design Document

## Overview

**Bomberman** is a strategic action game where players place bombs to destroy blocks and defeat enemies. Navigate a maze, trap opponents with bombs, and collect power-ups to become the ultimate bomber.

**Why Kids Love It:**
- **Explosions!** - Bombs go boom
- **Strategy** - Plan your bomb placement
- **Power-ups** - Get stronger over time
- **Maze exploration** - Find secrets
- **Satisfying destruction** - Blocks disappear
- **Simple rules** - Place bomb, run away

**Target Player:** Hank Neil, age 8 (and kids 6-14)
**Platform:** Web (mobile + desktop)
**Style:** Cute characters, colorful tiles

---

## Core Game Loop

```
NAVIGATE maze grid
    |
PLACE BOMB near destructible blocks
    |
RUN AWAY before explosion
    |
BOMB explodes in + pattern
    |
DESTROYS blocks, reveals power-ups
    |
COLLECT power-ups (more bombs, bigger blast)
    |
DEFEAT all enemies to complete level
    |
NEXT LEVEL = harder maze
```

### Why This Works

- **Risk/reward** - Bombs can hurt you too
- **Power progression** - Start weak, grow strong
- **Spatial thinking** - Predict explosion paths
- **Tension** - Timer on bomb creates urgency
- **Discovery** - Hidden items in blocks
- **Mastery** - Learn enemy patterns

---

## Controls

### Mobile (Touch)
```
+----------------------------------+
|       [UP]                       |
|  [LEFT] [DOWN] [RIGHT]   [BOMB]  |
+----------------------------------+
```
D-pad on left, bomb button on right.
Alternative: Tap destination to move, tap self to drop bomb.

### Desktop
| Input | Action |
|-------|--------|
| WASD or Arrows | Move |
| Spacebar | Place bomb |
| P / Escape | Pause |

---

## Game Mechanics

### Grid System
```typescript
const GRID_WIDTH = 13;  // Odd number for symmetry
const GRID_HEIGHT = 11;
const TILE_SIZE = 48;

type TileType =
  | "empty"       // Can walk through
  | "wall"        // Indestructible
  | "block"       // Destructible, may hide item
  | "bomb"        // Active bomb
  | "explosion";  // Temporary explosion effect
```

### Bomb Behavior
```typescript
const BOMB_TIMER = 3000;      // ms before explosion
const EXPLOSION_DURATION = 500; // ms visible
const DEFAULT_BOMB_COUNT = 1;
const DEFAULT_BLAST_RANGE = 2;  // Tiles in each direction
```

- Bombs explode in + pattern (up, down, left, right)
- Explosion stops at walls
- Explosion destroys blocks (and reveals items)
- Can chain-detonate other bombs

### Power-Ups
| Item | Effect | Rarity |
|------|--------|--------|
| Extra Bomb | +1 max bombs | Common |
| Fire | +1 blast range | Common |
| Speed | Move faster | Uncommon |
| Kick | Push bombs | Rare |
| Shield | Survive 1 hit | Rare |
| Remote | Detonate manually | Rare |

### Enemies
| Enemy | Behavior | Points |
|-------|----------|--------|
| Balloon | Wanders randomly | 100 |
| Ghost | Walks through blocks | 200 |
| Chaser | Follows player | 300 |
| Bomber | Places bombs! | 500 |

### Level Structure
- Walls form fixed grid pattern (checkered)
- Destructible blocks placed randomly
- Exit door hidden under one block
- Enemies spawn in corners (away from player)
- Player starts in corner with safe zone

---

## Features (Priority Order)

### MVP (Must Have)
1. **Grid-based movement**
2. **Bomb placement** with timer
3. **Explosion** in + pattern
4. **Destructible blocks**
5. **Collision detection** (walls, blocks)
6. **Player death** from explosion
7. **Level completion** (destroy all enemies OR find exit)
8. **Basic enemy** (random movement)

### Important (Fun Factor)
9. **Power-ups** (extra bomb, fire, speed)
10. **Multiple enemy types**
11. **Sound effects** (place, explode, power-up)
12. **Animation** (bomb pulse, explosion)
13. **Multiple levels**
14. **Score system**
15. **Lives system**
16. **High score persistence**

### Nice to Have
17. **Boss levels**
18. **Local 2-player mode**
19. **Level editor**
20. **Different themes** (grass, ice, fire)
21. **Special bombs** (pierce walls, mega blast)

---

## Technical Approach

### Stack
```
Next.js 16 + React 19
Canvas API (tile-based rendering)
Zustand for state
TypeScript
```

### Architecture
```
apps/web/src/games/bomberman/
├── components/
│   ├── BombermanCanvas.tsx
│   ├── GameOverlay.tsx
│   ├── HUD.tsx
│   └── TouchControls.tsx
├── hooks/
│   ├── useGameLoop.ts
│   ├── useControls.ts
│   └── useSound.ts
├── lib/
│   ├── store.ts
│   ├── grid.ts              # Level generation
│   ├── bomb.ts              # Bomb logic
│   ├── enemies.ts           # AI behaviors
│   ├── collision.ts
│   └── constants.ts
├── Game.tsx
└── index.ts
```

### Grid Rendering
```typescript
function renderGrid(ctx: CanvasRenderingContext2D, grid: Tile[][]) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const tile = grid[y][x];
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;

      // Draw floor
      ctx.fillStyle = '#8BC34A';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

      // Draw tile content
      switch (tile.type) {
        case 'wall':
          ctx.fillStyle = '#424242';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          break;
        case 'block':
          ctx.fillStyle = '#A1887F';
          ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          break;
        case 'bomb':
          drawBomb(ctx, px, py, tile.timer);
          break;
        case 'explosion':
          ctx.fillStyle = '#FF9800';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          break;
      }
    }
  }
}
```

### Explosion Algorithm
```typescript
function explode(grid: Tile[][], x: number, y: number, range: number) {
  const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]]; // Up, Down, Left, Right

  // Center explosion
  createExplosion(grid, x, y);

  // Spread in each direction
  for (const [dx, dy] of directions) {
    for (let i = 1; i <= range; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;

      if (!inBounds(nx, ny)) break;

      const tile = grid[ny][nx];
      if (tile.type === 'wall') break;          // Stop at walls
      if (tile.type === 'block') {
        destroyBlock(grid, nx, ny);              // Destroy and stop
        break;
      }

      createExplosion(grid, nx, ny);
    }
  }
}
```

---

## Settings & Progress Saving

### Data Schema
```typescript
interface BombermanProgress {
  highScore: number;
  highestLevel: number;
  levelsCompleted: number;
  totalEnemiesDefeated: number;
  totalBlocksDestroyed: number;
  powerUpsCollected: number;
  gamesPlayed: number;
  settings: {
    soundEnabled: boolean;
    difficulty: "easy" | "normal" | "hard";
    controlScheme: "dpad" | "tap";
  };
  lastPlayed: string;
}
```

### useAuthSync Integration
```typescript
useAuthSync({
  appId: "bomberman",
  localStorageKey: "bomberman-progress",
  getState: store.getProgress,
  setState: store.setProgress,
  debounceMs: 3000,
});
```

---

## Kid-Friendly Design

- **Longer fuse** - 3 seconds instead of 2
- **Safe start** - Corner is always clear
- **Fewer enemies** initially
- **Power-ups common** - Feel powerful early
- **No friendly fire** - Can't kill self easily (forgiving hitbox)
- **Continue option** - Restart level with progress
- **Cute characters** - Not scary enemies
- **Pause anytime**

### Level Difficulty Curve
1. Level 1: 2 Balloons, many power-ups
2. Level 2-3: Add Ghosts
3. Level 4-5: Add Chasers
4. Level 6+: Mix of all types

---

## References

### Open Source
- [nicksantiago/bomberman-js](https://github.com/nicksantiago/bomberman-js)
- Various HTML5 Bomberman clones on GitHub

### Original
- Hudson Soft Bomberman (1983)
- Super Bomberman (1993)
