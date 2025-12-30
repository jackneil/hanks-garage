# Asteroids - Game Design Document

## Overview

**Asteroids** is the iconic 1979 arcade game where you pilot a triangular ship, rotating and thrusting through space while blasting asteroids into smaller pieces. The wraparound screen and momentum-based physics create a unique challenge.

**Why Kids Love It:**
- **Space ships!** - Flying a spaceship is inherently cool
- **Shooting explosions** - Asteroids shatter satisfyingly
- **Momentum physics** - Ship drifts, feels realistic
- **Risk everywhere** - 360° of danger
- **Skill mastery** - Rotation + thrust takes practice
- **Hyperspace panic** - Emergency teleport!

**Target Player:** Hank Neil, age 8 (and kids 6-14)
**Platform:** Web (mobile + desktop)
**Style:** Vector graphics (lines), neon glow

---

## Core Game Loop

```
ASTEROIDS drift across screen
    |
SHIP rotates left/right
    |
THRUST to move (momentum-based)
    |
SHOOT asteroids = split into smaller pieces
    |
SMALL asteroids = destroyed completely
    |
UFO occasionally appears (shoots at you!)
    |
ALL asteroids cleared = NEXT WAVE
    |
HIT by asteroid or UFO = LOSE LIFE
```

### Why This Loop Works

- **Inertia mastery** - Learning to control drift is satisfying
- **Escalating chaos** - More asteroids = more danger
- **Chain reactions** - Big asteroid → 2 medium → 4 small
- **Spatial awareness** - Wrap-around screen keeps you alert
- **Skill ceiling** - Easy to play, hard to master
- **UFO tension** - Random threat keeps you on edge

---

## Controls

### Mobile (Touch)
```
+----------------------------------+
|           [HYPERSPACE]           |
|                                  |
|  [↺ LEFT]              [RIGHT ↻] |
|                                  |
|     [🔥 THRUST]    [● FIRE]     |
+----------------------------------+
```

Virtual joystick alternative: drag to rotate, release to thrust

### Desktop
| Input | Action |
|-------|--------|
| A/Left Arrow | Rotate left |
| D/Right Arrow | Rotate right |
| W/Up Arrow | Thrust |
| Spacebar | Fire |
| Shift | Hyperspace (random teleport) |
| P/Escape | Pause |

---

## Game Mechanics

### Ship Physics
```typescript
const ROTATION_SPEED = 5;        // Degrees per frame
const THRUST_POWER = 0.1;        // Acceleration
const MAX_SPEED = 8;             // Velocity cap
const FRICTION = 0.99;           // Slight drag (easier than original)
const SHIP_SIZE = 20;            // Triangle size
```

```typescript
// Ship update
ship.angle += rotationInput * ROTATION_SPEED;
if (thrustInput) {
  ship.vx += Math.cos(ship.angle) * THRUST_POWER;
  ship.vy += Math.sin(ship.angle) * THRUST_POWER;
}
ship.vx *= FRICTION;
ship.vy *= FRICTION;
ship.x = wrap(ship.x + ship.vx, SCREEN_WIDTH);
ship.y = wrap(ship.y + ship.vy, SCREEN_HEIGHT);
```

### Asteroid Types
| Size | Radius | Points | Splits Into |
|------|--------|--------|-------------|
| Large | 40 | 20 | 2 Medium |
| Medium | 20 | 50 | 2 Small |
| Small | 10 | 100 | Destroyed |

### Screen Wrapping
- All objects wrap around screen edges
- Exit right → enter left
- Exit top → enter bottom
- Creates infinite playfield feel

### UFO (Saucer)
- Small UFO: Appears after wave 3, accurate shots
- Large UFO: Appears earlier, random shots
- Worth 200-1000 points
- Shoots at player, can hit asteroids too

### Hyperspace
- Emergency escape - teleport to random location
- Risk: Might teleport INTO an asteroid
- Cooldown: 3 seconds between uses
- Limited uses per life (3)

---

## Features (Priority Order)

### MVP (Must Have)
1. **Ship rotation and thrust** with inertia
2. **Shooting bullets** that travel and wrap
3. **Large asteroids** that drift and wrap
4. **Asteroid splitting** (large → medium → small)
5. **Collision detection** (ship, bullets, asteroids)
6. **Score counter**
7. **Lives system** (3 lives)
8. **Wave completion** and progression

### Important (Fun Factor)
9. **Vector graphics style** (line rendering)
10. **Screen wrap** for all objects
11. **UFO enemy** that shoots back
12. **Sound effects** (thrust, shoot, explosions)
13. **Explosion particles** when asteroids split
14. **Ship thrust flame** animation
15. **High score persistence**

### Nice to Have
16. **Hyperspace** teleport ability
17. **Power-ups** (shield, rapid fire)
18. **Two-player mode** (take turns)
19. **Boss asteroids** (huge, take multiple hits)
20. **Neon glow effect** for modern look

---

## Technical Approach

### Stack
```
Next.js 16 + React 19
Canvas API (vector line drawing)
Zustand for state
TypeScript
```

### Architecture
```
apps/web/src/games/asteroids/
├── components/
│   ├── AsteroidsCanvas.tsx
│   ├── GameOverlay.tsx
│   ├── HUD.tsx
│   └── TouchControls.tsx
├── hooks/
│   ├── useGameLoop.ts
│   ├── useControls.ts
│   └── useSound.ts
├── lib/
│   ├── store.ts
│   ├── physics.ts           # Vector math, wrapping
│   ├── entities.ts          # Ship, asteroid, bullet
│   ├── collision.ts         # Polygon collision
│   └── constants.ts
├── Game.tsx
└── index.ts
```

### Vector Rendering
```typescript
// Draw ship as triangle
function drawShip(ctx: CanvasRenderingContext2D, ship: Ship) {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);

  ctx.strokeStyle = '#0f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 0);       // Nose
  ctx.lineTo(-15, -12);    // Left wing
  ctx.lineTo(-10, 0);      // Back indent
  ctx.lineTo(-15, 12);     // Right wing
  ctx.closePath();
  ctx.stroke();

  // Thrust flame
  if (ship.thrusting) {
    ctx.strokeStyle = '#f80';
    ctx.beginPath();
    ctx.moveTo(-10, -5);
    ctx.lineTo(-25, 0);
    ctx.lineTo(-10, 5);
    ctx.stroke();
  }

  ctx.restore();
}

// Draw asteroid as irregular polygon
function drawAsteroid(ctx: CanvasRenderingContext2D, asteroid: Asteroid) {
  ctx.save();
  ctx.translate(asteroid.x, asteroid.y);
  ctx.rotate(asteroid.rotation);

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  asteroid.vertices.forEach((v, i) => {
    if (i === 0) ctx.moveTo(v.x, v.y);
    else ctx.lineTo(v.x, v.y);
  });
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}
```

---

## Settings & Progress Saving

### Data Schema
```typescript
interface AsteroidsProgress {
  highScore: number;
  highestWave: number;
  totalAsteroidsDestroyed: number;
  totalUfosDestroyed: number;
  gamesPlayed: number;
  settings: {
    soundEnabled: boolean;
    difficulty: "easy" | "normal" | "hard";
    controlScheme: "buttons" | "joystick";
    glowEffect: boolean;
  };
  lastPlayed: string;
}
```

### useAuthSync Integration
```typescript
useAuthSync({
  appId: "asteroids",
  localStorageKey: "asteroids-progress",
  getState: store.getProgress,
  setState: store.setProgress,
  debounceMs: 3000,
});
```

---

## Kid-Friendly Design

- **Slight friction** - Ship doesn't drift forever
- **Larger ship** - Easier to see and identify with
- **Slower asteroids** initially - Ramp up difficulty
- **More lives** (5 instead of 3)
- **Safe spawn** - Brief invincibility after death
- **Visible bullets** - Thicker, glowing
- **Forgiving collisions** - Slightly smaller hitboxes
- **Clear colors** - Green ship, white asteroids, red UFO

### Mobile Considerations
- Large touch buttons
- Both button and joystick options
- No rotation if device tilted (confusing)
- Pause on app switch

---

## References

### Open Source
- [nicksantiago/asteroids](https://github.com/nicksantiago/asteroids)
- Classic Asteroids implementations on GitHub
- [freeCodeCamp Asteroids Tutorial](https://www.freecodecamp.org)

### Original
- Atari Asteroids (1979)
