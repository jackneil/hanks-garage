# Space Invaders - Game Design Document

## Overview

**Space Invaders** is the grandfather of shooting games - rows of aliens march toward Earth while you control a laser cannon to blast them. The iconic "doo-doo-doo-doo" heartbeat soundtrack and escalating tension make it unforgettable.

**Why Kids Love It:**
- **Shooting stuff** - Pew pew pew!
- **Clear enemies** - Aliens are obviously bad guys
- **Escalating tension** - Music speeds up as aliens approach
- **Boss moments** - Mystery ship = big points
- **Defense strategy** - Use shields wisely
- **Classic cool factor** - "My dad played this!"

**Target Player:** Hank Neil, age 8 (and kids 6-14)
**Platform:** Web (mobile + desktop)
**Style:** Classic pixel art, neon glow option

---

## Core Game Loop

```
ALIENS march left-right, drop down
    |
PLAYER moves cannon, shoots
    |
BULLETS hit aliens = destroy + points
    |
ALIENS shoot back randomly
    |
SHIELDS absorb hits (degrade)
    |
MYSTERY SHIP occasionally flies over
    |
ALL aliens dead = NEXT WAVE
    |
ALIEN reaches bottom OR hits player = LOSE LIFE
```

### Why This Loop Works

- **Active threat** - Aliens are always advancing
- **Skill shots** - Leading targets, timing
- **Risk/reward** - Mystery ship tempts you out of cover
- **Escalation** - Fewer aliens = faster movement
- **Defense management** - Shields are limited resource
- **Wave completion** - Clear satisfaction

---

## Controls

### Mobile (Touch)
| Input | Action |
|-------|--------|
| Left/Right of cannon | Move that direction |
| Tap fire button | Shoot |
| Or: Drag cannon | Direct position control |

Virtual buttons: [←] [→] [FIRE]

### Desktop
| Input | Action |
|-------|--------|
| A/D or Left/Right | Move cannon |
| Spacebar or W | Fire |
| P or Escape | Pause |

---

## Game Mechanics

### Alien Formation
```typescript
const ALIEN_ROWS = 5;
const ALIEN_COLS = 11;
const ALIEN_SPACING_X = 45;
const ALIEN_SPACING_Y = 35;
const ALIEN_MOVE_SPEED = 1;      // Pixels per step
const ALIEN_DROP_AMOUNT = 20;    // Pixels to drop
const ALIEN_SPEED_MULTIPLIER = 0.05; // Speed increase per dead alien
```

### Alien Types
| Row | Type | Points | Appearance |
|-----|------|--------|------------|
| 1 (top) | Squid | 30 | Small, tentacles |
| 2-3 | Crab | 20 | Medium, claws |
| 4-5 | Octopus | 10 | Large, round |

### Shooting
- Player: 1 bullet on screen at a time (classic) or 3 max (forgiving)
- Aliens: Random alien shoots, max 3 enemy bullets
- Bullets destroyed on hit

### Mystery Ship
- Appears randomly every 20-30 seconds
- Flies across top of screen
- 50, 100, 150, or 300 points (random)
- Disappears if not hit

### Shields
- 4 shields between player and aliens
- Each has ~20 "pixels" of health
- Degrade from both player and alien bullets
- Aliens destroy shields on contact

---

## Features (Priority Order)

### MVP (Must Have)
1. **Player cannon** movement and shooting
2. **Alien formation** that marches and drops
3. **Collision detection** (bullets, aliens, player)
4. **Score counter**
5. **Lives system** (3 lives)
6. **Alien shooting** back
7. **Game over screen**
8. **Wave completion** and restart

### Important (Fun Factor)
9. **Shield barriers** that degrade
10. **Mystery ship** bonus
11. **Sound effects** (shoot, explosion, march)
12. **Alien march music** (speeds up!)
13. **Different alien types** with points
14. **Death animation** for aliens
15. **High score persistence**

### Nice to Have
16. **Multiple waves** with harder patterns
17. **Boss aliens** (take multiple hits)
18. **Power-ups** (rapid fire, shield repair)
19. **Two-player mode** (take turns)
20. **Classic/Modern modes**

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
apps/web/src/games/space-invaders/
├── components/
│   ├── GameCanvas.tsx
│   ├── GameOverlay.tsx
│   ├── HUD.tsx
│   └── TouchControls.tsx
├── hooks/
│   ├── useGameLoop.ts
│   ├── useControls.ts
│   └── useSound.ts
├── lib/
│   ├── store.ts
│   ├── aliens.ts           # Formation, movement
│   ├── bullets.ts
│   ├── shields.ts
│   └── constants.ts
├── Game.tsx
└── index.ts
```

### The March Algorithm
```typescript
function updateAliens(aliens: Alien[], direction: number) {
  // Move all aliens in direction
  aliens.forEach(a => a.x += direction * MOVE_SPEED);

  // Check if any alien hit wall
  const hitWall = aliens.some(a =>
    a.x <= 0 || a.x >= SCREEN_WIDTH - ALIEN_WIDTH
  );

  if (hitWall) {
    // Drop down and reverse direction
    aliens.forEach(a => a.y += DROP_AMOUNT);
    return -direction;
  }
  return direction;
}
```

---

## Settings & Progress Saving

### Data Schema
```typescript
interface SpaceInvadersProgress {
  highScore: number;
  wavesCompleted: number;
  highestWave: number;
  totalAliensKilled: number;
  mysteryShipsHit: number;
  gamesPlayed: number;
  settings: {
    soundEnabled: boolean;
    difficulty: "easy" | "normal" | "hard";
    controlScheme: "buttons" | "drag";
  };
  lastPlayed: string;
}
```

### useAuthSync Integration
```typescript
useAuthSync({
  appId: "space-invaders",
  localStorageKey: "space-invaders-progress",
  getState: store.getProgress,
  setState: store.setProgress,
  debounceMs: 3000,
});
```

---

## Kid-Friendly Design

- **3+ bullets allowed** - Less frustrating than 1
- **Slower alien descent** - More time to react
- **Shields regenerate between waves** - Fresh start
- **Forgiving hitboxes** - Bullets are generous
- **Clear visual feedback** - Explosions, screen flash
- **Volume control** - Parents appreciate this
- **Pause anytime** - For bathroom breaks
- **No gore** - Aliens just explode into pixels

### Audio Design
| Sound | When | Style |
|-------|------|-------|
| Pew | Player shoots | Classic laser |
| March | Aliens move | Heartbeat bass (iconic!) |
| Explosion | Alien dies | Satisfying pop |
| Player hit | Lose life | Different explosion |
| Mystery | UFO appears | Wooo-wooo |
| Wave clear | All aliens dead | Triumphant! |

---

## References

### Open Source
- [dwmkerr/spaceinvaders](https://github.com/dwmkerr/spaceinvaders) - Clean learning exercise
- [4cylinder/spaceinvaders](https://github.com/4cylinder/spaceinvaders) - Canvas implementation
- MelonJS Space Invaders tutorial

### Original
- Taito Space Invaders (1978)
