# Hextris - Game Design Document

## Overview

**Hextris** is a fast-paced puzzle game where colored blocks fall toward a central hexagon. Players rotate the hexagon to catch blocks and create color matches. It's like Tetris on a hexagonal plane - simple to understand but deceptively challenging.

**Why Kids Love It:**
- **Colorful visuals** - Bright, satisfying colors
- **Simple control** - Just rotate left or right
- **Quick matches** - Instant color-matching feedback
- **Escalating speed** - Gets intense fast
- **Competitive scoring** - Easy to compare with friends
- **"One more game"** - Quick rounds encourage retry

**Target Player:** Hank Neil, age 8 (and kids 6-14)
**Platform:** Web (mobile + desktop)
**Style:** Geometric, neon colors

---

## Core Game Loop

```
COLORED BLOCKS fall toward center hexagon
    |
ROTATE hexagon left or right
    |
CATCH blocks on hexagon edges
    |
3+ SAME COLOR in a row = MATCH (disappear)
    |
BLOCKS stack higher if no match
    |
STACK too high = GAME OVER
    |
SPEED increases over time
    |
SURVIVE longer = HIGHER SCORE
```

### Why This Works

- **Simple mechanic** - Just rotate
- **Pattern recognition** - See colors, make matches
- **Spatial reasoning** - 6 sides to manage
- **Pressure builds** - Faster blocks = more tension
- **Chain reactions** - Multiple matches feel amazing
- **Clear failure** - Stack too high = done

---

## Controls

### Mobile (Touch)
| Input | Action |
|-------|--------|
| Tap left half of screen | Rotate counter-clockwise |
| Tap right half of screen | Rotate clockwise |
| Swipe left | Rotate counter-clockwise |
| Swipe right | Rotate clockwise |

### Desktop
| Input | Action |
|-------|--------|
| A / Left Arrow | Rotate counter-clockwise |
| D / Right Arrow | Rotate clockwise |
| P / Escape | Pause |
| Space | Restart (when game over) |

---

## Game Mechanics

### Hexagon
- Central hexagon with 6 sides
- Each side can hold stacked blocks
- Rotates 60° per input
- Smooth rotation animation

### Blocks
```typescript
const BLOCK_COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
const FALL_SPEED = 2;           // Initial speed
const MAX_FALL_SPEED = 8;       // Cap
const SPEED_INCREMENT = 0.001;  // Per frame
const BLOCK_HEIGHT = 20;        // Visual height
const MAX_STACK = 8;            // Blocks per side before game over
```

### Matching
- 3+ adjacent same-color blocks on ANY side = match
- Matched blocks disappear with animation
- Blocks above fall down
- Can chain multiple matches

### Spawning
- One block falls at a time from random direction
- Color is random from pool
- Direction aims at one of 6 hexagon sides
- Speed increases gradually

### Scoring
| Action | Points |
|--------|--------|
| Block lands | 1 |
| 3-match | 30 |
| 4-match | 50 |
| 5+ match | 100 |
| Chain bonus | x1.5 per chain |

---

## Features (Priority Order)

### MVP (Must Have)
1. **Central hexagon** that rotates
2. **Falling blocks** from 6 directions
3. **Block stacking** on hexagon sides
4. **Color matching** (3+ adjacent)
5. **Game over** when stack too high
6. **Score counter**
7. **Rotation controls** (tap/keyboard)
8. **Speed ramping**

### Important (Fun Factor)
9. **Match animations** (flash, disappear)
10. **Sound effects** (rotate, match, game over)
11. **High score persistence**
12. **Smooth rotation** animation
13. **Chain reactions** with bonus points
14. **Pause functionality**
15. **Particle effects** on match

### Nice to Have
16. **Color themes** (neon, pastel, dark)
17. **Music** with tempo matching speed
18. **Power-ups** (bomb, color change)
19. **Challenge modes** (timed, limited moves)
20. **Leaderboards**

---

## Technical Approach

### Stack
```
Next.js 16 + React 19
Canvas API (hexagon rendering)
Zustand for state
TypeScript
```

### Architecture
```
apps/web/src/games/hextris/
├── components/
│   ├── HextrisCanvas.tsx    # Main canvas
│   ├── GameOverlay.tsx      # Start, pause, game over
│   └── ScoreDisplay.tsx
├── hooks/
│   ├── useGameLoop.ts
│   ├── useControls.ts
│   └── useSound.ts
├── lib/
│   ├── store.ts
│   ├── hexagon.ts           # Hex math, rotation
│   ├── blocks.ts            # Block spawning, falling
│   ├── matching.ts          # Match detection
│   └── constants.ts
├── Game.tsx
└── index.ts
```

### Hexagon Math
```typescript
// Draw hexagon centered at (cx, cy) with radius r
function drawHexagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2; // Start at top
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

// Get direction vector for side i (0-5)
function getSideDirection(side: number) {
  const angle = (Math.PI / 3) * side + Math.PI / 6;
  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
}
```

### Match Detection
```typescript
function checkMatches(stacks: Block[][]): Match[] {
  const matches: Match[] = [];

  for (let side = 0; side < 6; side++) {
    const stack = stacks[side];
    let runStart = 0;
    let runColor = stack[0]?.color;

    for (let i = 1; i <= stack.length; i++) {
      const current = stack[i]?.color;
      if (current !== runColor || i === stack.length) {
        const runLength = i - runStart;
        if (runLength >= 3 && runColor) {
          matches.push({
            side,
            startIndex: runStart,
            length: runLength,
            color: runColor,
          });
        }
        runStart = i;
        runColor = current;
      }
    }
  }

  return matches;
}
```

---

## Settings & Progress Saving

### Data Schema
```typescript
interface HextrisProgress {
  highScore: number;
  gamesPlayed: number;
  totalBlocksMatched: number;
  longestChain: number;
  settings: {
    soundEnabled: boolean;
    theme: "neon" | "pastel" | "dark";
    controlScheme: "tap" | "swipe";
  };
  lastPlayed: string;
}
```

### useAuthSync Integration
```typescript
useAuthSync({
  appId: "hextris",
  localStorageKey: "hextris-progress",
  getState: store.getProgress,
  setState: store.setProgress,
  debounceMs: 3000,
});
```

---

## Kid-Friendly Design

- **Slower initial speed** - Time to learn
- **Generous matching** - 3 blocks is achievable
- **Clear color contrast** - Distinct colors
- **Forgiving controls** - Rotation is quick
- **No time pressure** to start - Ball waits
- **Celebration** on match - Particles, sound
- **Simple restart** - One tap to retry
- **Big touch targets** - Half-screen zones

### Visual Polish
- Glow effects on hexagon
- Particle burst on match
- Screen shake on game over
- Smooth rotation (not instant)
- Trail effect on falling blocks

---

## References

### Open Source
- [Hextris/hextris](https://github.com/Hextris/hextris) - Original open source
- Play at [hextris.io](https://hextris.io)

### Inspiration
- Tetris (block stacking)
- Super Hexagon (hexagonal gameplay)
- Threes! (matching mechanics)
