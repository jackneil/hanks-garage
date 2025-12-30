# Breakout - Game Design Document

## Overview

**Breakout** (Brick Breaker) is a classic arcade game where players control a paddle to bounce a ball and destroy bricks. The satisfying destruction of colorful bricks combined with increasing challenge makes it timeless.

**Why Kids Love It:**
- **Satisfying destruction** - Breaking things is inherently fun
- **Simple controls** - Just move left/right
- **Visual progress** - Watch bricks disappear
- **Increasing tension** - Ball speeds up, fewer bricks to aim for
- **Power-ups** - Surprise bonuses keep it exciting
- **Clear goal** - Break all the bricks!

**Target Player:** Hank Neil, age 8 (and kids 6-14)
**Platform:** Web (mobile + desktop)
**Style:** Colorful bricks, neon aesthetic

---

## Core Game Loop

```
BALL bounces around screen
    |
PADDLE moves to intercept
    |
BALL hits BRICK = brick destroyed + points
    |
POWER-UPS occasionally drop
    |
ALL bricks gone = LEVEL COMPLETE
    |
BALL hits bottom = LOSE LIFE
    |
NO lives left = GAME OVER
    |
NEXT LEVEL = new brick pattern
```

### Why This Loop Works

- **Immediate feedback** - Every hit destroys something
- **Skill expression** - Paddle angle affects ball direction
- **Risk/reward** - Going for tough bricks vs playing safe
- **Power fantasy** - Multi-ball, laser paddle feel awesome
- **Completionist satisfaction** - Clearing every brick

---

## Controls

### Mobile (Touch)
| Input | Action |
|-------|--------|
| Touch + drag | Move paddle horizontally |
| Tap | Launch ball (when attached) |

Paddle follows finger position on X-axis.

### Desktop
| Input | Action |
|-------|--------|
| Mouse movement | Move paddle |
| Left/Right arrows | Move paddle |
| Spacebar | Launch ball |
| P or Escape | Pause |

---

## Game Mechanics

### Physics
```typescript
const BALL_SPEED = 5;           // Initial speed
const BALL_MAX_SPEED = 12;      // Cap after speedups
const PADDLE_WIDTH = 100;
const PADDLE_SPEED = 8;
const BALL_RADIUS = 8;
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
```

### Ball Behavior
- Bounces off walls, ceiling, paddle, and bricks
- Paddle hit position affects angle (left = left, right = right)
- Speed increases slightly each time it hits paddle
- Resets to paddle after losing life

### Brick Types
| Type | Hits to Break | Points | Color |
|------|---------------|--------|-------|
| Normal | 1 | 10 | Various |
| Tough | 2 | 25 | Silver |
| Indestructible | ∞ | 0 | Gold |
| Explosive | 1 | 15 | Orange (destroys neighbors) |

### Power-Ups (Drop from bricks)
| Power-Up | Effect | Duration |
|----------|--------|----------|
| Multi-Ball | Split into 3 balls | Until all lost |
| Big Paddle | Paddle 50% wider | 15 seconds |
| Laser | Shoot from paddle | 10 seconds |
| Slow | Ball speed -30% | 10 seconds |
| Extra Life | +1 life | Permanent |
| Sticky | Ball sticks to paddle | 15 seconds |

---

## Features (Priority Order)

### MVP (Must Have)
1. **Paddle movement** (touch + keyboard + mouse)
2. **Ball physics** with bouncing
3. **Brick grid** rendering
4. **Collision detection** (ball vs brick, paddle, walls)
5. **Score counter**
6. **Lives system** (3 lives)
7. **Game over screen**
8. **Single level** with restart

### Important (Fun Factor)
9. **Multiple levels** (different patterns)
10. **Power-ups** (at least multi-ball, big paddle)
11. **Sound effects** (bounce, break, power-up)
12. **Ball speed ramping**
13. **Brick destruction particles**
14. **High score persistence**
15. **Level transitions**

### Nice to Have
16. **Level editor** (create your own)
17. **Boss levels** (moving brick formations)
18. **Combo scoring** (rapid hits = bonus)
19. **Themes** (space, underwater, candy)
20. **Achievements**

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
apps/web/src/games/breakout/
├── components/
│   ├── BreakoutCanvas.tsx   # Main canvas
│   ├── GameOverlay.tsx      # Menus, game over
│   └── HUD.tsx              # Score, lives display
├── hooks/
│   ├── useGameLoop.ts
│   ├── useControls.ts
│   └── useCollision.ts
├── lib/
│   ├── store.ts
│   ├── physics.ts
│   ├── levels.ts            # Level definitions
│   ├── powerups.ts
│   └── constants.ts
├── Game.tsx
└── index.ts
```

---

## Level Design

### Level Structure
```typescript
interface Level {
  id: number;
  name: string;
  bricks: BrickConfig[][];  // 2D grid
  powerUpChance: number;    // 0-1 probability
  ballSpeed: number;        // Starting speed
}
```

### Sample Levels
1. **Introduction** - Simple rectangle, all normal bricks
2. **Diamond** - Diamond shape in center
3. **Checkerboard** - Alternating pattern
4. **Fortress** - Tough bricks protecting center
5. **Rainbow** - Colorful rows
6. **Invaders** - Space Invader shape
7. **Letters** - Spell "HANK"
8. **Boss** - Moving formation

---

## Settings & Progress Saving

### Data Schema
```typescript
interface BreakoutProgress {
  highScore: number;
  levelsCompleted: number;
  highestLevel: number;
  totalBricksDestroyed: number;
  gamesPlayed: number;
  powerUpsCollected: number;
  settings: {
    soundEnabled: boolean;
    difficulty: "easy" | "normal" | "hard";
    paddleSensitivity: number;
  };
  lastPlayed: string;
}
```

### useAuthSync Integration
```typescript
useAuthSync({
  appId: "breakout",
  localStorageKey: "breakout-progress",
  getState: store.getProgress,
  setState: store.setProgress,
  debounceMs: 3000,
});
```

---

## Kid-Friendly Design

- **Forgiving paddle size** - Wider than classic
- **3+ lives** - Room for mistakes
- **Slow start** - Ball starts slow, ramps up
- **Bright colors** - Cheerful, not stressful
- **Particles on break** - Satisfying feedback
- **Power-ups common** - Rewards throughout
- **No time pressure** - Take your time
- **Auto-pause** if ball is still - prevents frustration

---

## References

### Open Source
- [nicksantiago/HTML5-Breakout](https://github.com/nicksantiago/HTML5-Breakout)
- [billsun/breakout-js](https://github.com/nicksantiago/breakout-js)
- MDN Breakout tutorial

### Original
- Atari Breakout (1976)
- Arkanoid (1986)
